const CourseModel = require('../models/course.model');
const ChapterModel = require('../models/chapter.model');
const LessonModel = require('../models/lesson.model');
const EnrollmentModel = require('../models/enrollment.model');
const LessonProgressModel = require('../models/lessonProgress.model');

// ===== COURSE =====
exports.createCourse = async (teacher, courseData) => {
  const course = await CourseModel.create({
    ...courseData,
    teacherAccountId: teacher.accountId,
    teacherName: teacher.name,
  });
  return course;
};

exports.updateCourse = async (courseId, teacherAccountId, data) => {
  return await CourseModel.findOneAndUpdate(
    { _id: courseId, teacherAccountId },
    { ...data, updatedAt: Date.now() },
    { new: true },
  );
};

exports.deleteCourse = async (courseId, teacherAccountId) => {
  await ChapterModel.deleteMany({ courseId });
  await LessonModel.deleteMany({ courseId });
  await EnrollmentModel.deleteMany({ courseId });
  return await CourseModel.deleteOne({ _id: courseId, teacherAccountId });
};

exports.getTeacherCourses = async (teacherAccountId) => {
  return await CourseModel.find({ teacherAccountId }).sort({ createdAt: -1 });
};

exports.getPublishedCourses = async (page = 1, limit = 12) => {
  const skip = (page - 1) * limit;
  const [courses, total] = await Promise.all([
    CourseModel.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    CourseModel.countDocuments({ status: 'published' }),
  ]);
  return { courses, total };
};

exports.getCourseDetail = async (courseId) => {
  const course = await CourseModel.findById(courseId);
  if (!course) return null;
  const chapters = await ChapterModel.find({ courseId }).sort({ order: 1 });
  const chaptersWithLessons = await Promise.all(
    chapters.map(async (chapter) => {
    const lessons = await LessonModel.find(
    { chapterId: chapter._id },
    ).sort({ order: 1 });
      return { ...chapter.toObject(), lessons };
    }),
  );
  return { ...course.toObject(), chapters: chaptersWithLessons };
};

// ===== CHAPTER =====
exports.createChapter = async (courseId, teacherAccountId, data) => {
  const course = await CourseModel.findOne({ _id: courseId, teacherAccountId });
  if (!course) return null;
  const lastChapter = await ChapterModel.findOne({ courseId }).sort({ order: -1 });
  const order = lastChapter ? lastChapter.order + 1 : 1;
  const chapter = await ChapterModel.create({ courseId, ...data, order });
  await CourseModel.findByIdAndUpdate(courseId, {
    $inc: { totalChapters: 1 },
    updatedAt: Date.now(),
  });
  return chapter;
};

exports.updateChapter = async (chapterId, courseId, teacherAccountId, data) => {
  const course = await CourseModel.findOne({ _id: courseId, teacherAccountId });
  if (!course) return null;
  return await ChapterModel.findByIdAndUpdate(
    chapterId,
    { ...data, updatedAt: Date.now() },
    { new: true },
  );
};

exports.deleteChapter = async (chapterId, courseId, teacherAccountId) => {
  const course = await CourseModel.findOne({ _id: courseId, teacherAccountId });
  if (!course) return null;
  const lessons = await LessonModel.find({ chapterId });
  await LessonModel.deleteMany({ chapterId });
  await CourseModel.findByIdAndUpdate(courseId, {
    $inc: { totalChapters: -1, totalLessons: -lessons.length },
  });
  return await ChapterModel.deleteOne({ _id: chapterId });
};

// ===== LESSON =====
exports.createLesson = async (chapterId, courseId, teacherAccountId, data) => {
  const course = await CourseModel.findOne({ _id: courseId, teacherAccountId });
  if (!course) return null;
  const lastLesson = await LessonModel.findOne({ chapterId }).sort({ order: -1 });
  const order = lastLesson ? lastLesson.order + 1 : 1;
  const lesson = await LessonModel.create({ chapterId, courseId, ...data, order });
  await CourseModel.findByIdAndUpdate(courseId, {
    $inc: { totalLessons: 1 },
    updatedAt: Date.now(),
  });
  await ChapterModel.findByIdAndUpdate(chapterId, {
    $inc: { totalLessons: 1 },
  });
  return lesson;
};

exports.updateLesson = async (lessonId, courseId, teacherAccountId, data) => {
  const course = await CourseModel.findOne({ _id: courseId, teacherAccountId });
  if (!course) return null;
  return await LessonModel.findByIdAndUpdate(
    lessonId,
    { ...data, updatedAt: Date.now() },
    { new: true },
  );
};

exports.deleteLesson = async (lessonId, courseId, teacherAccountId) => {
  const course = await CourseModel.findOne({ _id: courseId, teacherAccountId });
  if (!course) return null;
  const lesson = await LessonModel.findById(lessonId);
  if (!lesson) return null;
  await CourseModel.findByIdAndUpdate(courseId, {
    $inc: { totalLessons: -1 },
  });
  await ChapterModel.findByIdAndUpdate(lesson.chapterId, {
    $inc: { totalLessons: -1 },
  });
  return await LessonModel.deleteOne({ _id: lessonId });
};

exports.getLessonDetail = async (lessonId, studentAccountId) => {
  const lesson = await LessonModel.findById(lessonId);
  if (!lesson) return null;

  // Tìm bài học tiếp theo trong cùng chương
  let nextLessonFinal = await LessonModel.findOne({
    courseId: lesson.courseId,
    order: lesson.order + 1,
    chapterId: lesson.chapterId,
  }).select('_id title isFree order');

  // Nếu không có bài tiếp trong chương → tìm chương tiếp
  if (!nextLessonFinal) {
    const currentChapter = await ChapterModel.findById(lesson.chapterId);
    const nextChapter = await ChapterModel.findOne({
      courseId: lesson.courseId,
      order: { $gt: currentChapter?.order || 0 },
    }).sort({ order: 1 });

    if (nextChapter) {
      const firstLesson = await LessonModel
        .findOne({ chapterId: nextChapter._id })
        .sort({ order: 1 })
        .select('_id title isFree order');
      if (firstLesson) nextLessonFinal = firstLesson;
    }
  }

  // Tiến độ học
  let progress = null;
  if (studentAccountId) {
    progress = await LessonProgressModel.findOne({ lessonId, studentAccountId });
  }

  const isEnrolled = studentAccountId
    ? !!(await EnrollmentModel.findOne({
        courseId: lesson.courseId,
        studentAccountId,
        status: 'active',
      }))
    : false;

  const nextLesson = nextLessonFinal ? {
    _id: nextLessonFinal._id,
    title: nextLessonFinal.title,
    isFree: nextLessonFinal.isFree,
    locked: !nextLessonFinal.isFree && !isEnrolled,
  } : null;

  return { lesson, progress, nextLesson };
};

// ===== ENROLLMENT =====
exports.enrollCourse = async (courseId, student) => {
  const course = await CourseModel.findOne({ _id: courseId, status: 'published' });
  if (!course) return { error: 'Khoa hoc khong ton tai.' };

  const existed = await EnrollmentModel.findOne({
    courseId,
    studentAccountId: student.accountId,
  });
  if (existed) return { error: 'Ban da dang ky khoa hoc nay roi.' };

  // Khóa free → duyệt tự động, khóa trả phí → chờ giáo viên duyệt
  const enrollment = await EnrollmentModel.create({
    courseId,
    studentAccountId: student.accountId,
    studentName: student.name,
    paymentStatus: course.isFree ? 'free' : 'pending',
    status: course.isFree ? 'active' : 'pending', // ← pending cho khóa trả phí
    totalLessons: course.totalLessons,
  });

  if (course.isFree) {
    await CourseModel.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });
  }

  return { enrollment, isPending: !course.isFree };
};

exports.getStudentCourses = async (studentAccountId) => {
  const enrollments = await EnrollmentModel.find({ studentAccountId })
    .populate('courseId')
    .sort({ enrolledAt: -1 });
  return enrollments;
};

// ===== PROGRESS =====
exports.updateLessonProgress = async (lessonId, courseId, studentAccountId, data) => {
  const progress = await LessonProgressModel.findOneAndUpdate(
    { lessonId, studentAccountId },
    {
      courseId,
      studentAccountId,
      ...data,
      updatedAt: Date.now(),
    },
    { upsert: true, new: true },
  );

  // Cập nhật tiến độ tổng enrollment
  const totalLessons = await LessonModel.countDocuments({ courseId });
  const completedLessons = await LessonProgressModel.countDocuments({
    courseId,
    studentAccountId,
    status: 'completed',
  });
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  await EnrollmentModel.findOneAndUpdate(
    { courseId, studentAccountId },
    { progressPercent, completedLessons, totalLessons },
  );

  return progress;
};

exports.getPendingEnrollments = async (teacherAccountId) => {
  const courses = await CourseModel.find({ teacherAccountId });
  const courseIds = courses.map(c => c._id);
  return await EnrollmentModel.find({
    courseId: { $in: courseIds },
    status: 'pending',
  }).populate('courseId', 'title');
};

// Duyệt học viên
exports.approveEnrollment = async (enrollmentId, teacherAccountId) => {
  const enrollment = await EnrollmentModel.findById(enrollmentId)
    .populate('courseId');
  if (!enrollment) return null;
  if (enrollment.courseId.teacherAccountId.toString() !== teacherAccountId.toString()) return null;

  // Tăng totalStudents
  await CourseModel.findByIdAndUpdate(
    enrollment.courseId._id,
    { $inc: { totalStudents: 1 } }
  );

  return await EnrollmentModel.findByIdAndUpdate(
    enrollmentId,
    { status: 'active', paymentStatus: 'paid' },
    { new: true }
  );
};

// Từ chối học viên
exports.rejectEnrollment = async (enrollmentId, teacherAccountId) => {
  const enrollment = await EnrollmentModel.findById(enrollmentId)
    .populate('courseId');
  if (!enrollment) return null;
  if (enrollment.courseId.teacherAccountId.toString() !== teacherAccountId.toString()) return null;
  return await EnrollmentModel.findByIdAndUpdate(
    enrollmentId,
    { status: 'cancelled' },
    { new: true }
  );
};