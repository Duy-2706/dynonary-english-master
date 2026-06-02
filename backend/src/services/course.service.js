const { admin, db, COLLECTIONS, docToObj } = require('../configs/firebase.config');

const coursesCol = db.collection(COLLECTIONS.COURSES);
const chaptersCol = db.collection(COLLECTIONS.CHAPTERS);
const lessonsCol = db.collection(COLLECTIONS.LESSONS);
const enrollmentsCol = db.collection(COLLECTIONS.ENROLLMENTS);
const progressCol = db.collection(COLLECTIONS.LESSON_PROGRESS);

async function getDocById(collection, id) {
  const doc = await collection.doc(id).get();
  return docToObj(doc);
}

async function findOne(collection, constraints) {
  let q = collection;
  const entries = Object.entries(constraints);
  const [firstField, firstValue] = entries[0];
  q = q.where(firstField, '==', firstValue);
  const snap = await q.get();
  if (snap.empty) return null;
  const rest = entries.slice(1);
  const doc = snap.docs.find(d => rest.every(([f, v]) => d.data()[f] === v));
  return doc ? docToObj(doc) : null;
}

exports.createCourse = async (teacher, courseData) => {
  const ref = await coursesCol.add({
    ...courseData,
    teacherAccountId: teacher.accountId,
    teacherName: teacher.name,
    totalStudents: 0,
    totalChapters: 0,
    totalLessons: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return getDocById(coursesCol, ref.id);
};

exports.updateCourse = async (courseId, teacherAccountId, data) => {
  const doc = await coursesCol.doc(courseId).get();
  if (!doc.exists) return null;
  if (doc.data().teacherAccountId !== teacherAccountId) return null;
  await coursesCol.doc(courseId).update({ ...data, updatedAt: new Date() });
  return getDocById(coursesCol, courseId);
};

exports.deleteCourse = async (courseId, teacherAccountId) => {
  const doc = await coursesCol.doc(courseId).get();
  if (!doc.exists) return null;
  if (doc.data().teacherAccountId !== teacherAccountId) return null;

  const [chapSnap, lessnSnap, enrollSnap] = await Promise.all([
    chaptersCol.where('courseId', '==', courseId).get(),
    lessonsCol.where('courseId', '==', courseId).get(),
    enrollmentsCol.where('courseId', '==', courseId).get(),
  ]);

  const batch = db.batch();
  chapSnap.docs.forEach((d) => batch.delete(d.ref));
  lessnSnap.docs.forEach((d) => batch.delete(d.ref));
  enrollSnap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(coursesCol.doc(courseId));
  await batch.commit();
  return { deleted: true };
};

exports.getTeacherCourses = async (teacherAccountId) => {
  const snap = await coursesCol.where('teacherAccountId', '==', teacherAccountId).get();
  return snap.docs.map(docToObj).sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
};

exports.getPublishedCourses = async (page = 1, limit = 12) => {
  const snap = await coursesCol.where('status', '==', 'published').get();
  const all = snap.docs.map(docToObj).sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  const total = all.length;
  const courses = all.slice((page - 1) * limit, page * limit);
  return { courses, total };
};

exports.getCourseDetail = async (courseId) => {
  const course = await getDocById(coursesCol, courseId);
  if (!course) return null;

  const chapSnap = await chaptersCol.where('courseId', '==', courseId).get();
  const sortedChapters = chapSnap.docs.map(docToObj).sort((a, b) => (a.order || 0) - (b.order || 0));

  const chaptersWithLessons = await Promise.all(
    sortedChapters.map(async (chapter) => {
      const lessSnap = await lessonsCol.where('chapterId', '==', chapter._id).get();
      const lessons = lessSnap.docs.map(docToObj).sort((a, b) => (a.order || 0) - (b.order || 0));
      return { ...chapter, lessons };
    }),
  );

  return { ...course, chapters: chaptersWithLessons };
};

exports.createChapter = async (courseId, teacherAccountId, data) => {
  const courseDoc = await coursesCol.doc(courseId).get();
  if (!courseDoc.exists) return null;
  if (courseDoc.data().teacherAccountId !== teacherAccountId) return null;

  const existingSnap = await chaptersCol.where('courseId', '==', courseId).get();
  const order = existingSnap.empty ? 1 : Math.max(...existingSnap.docs.map(d => d.data().order || 0)) + 1;

  const ref = await chaptersCol.add({
    courseId, ...data, order, totalLessons: 0,
    createdAt: new Date(), updatedAt: new Date(),
  });

  await coursesCol.doc(courseId).update({
    totalChapters: admin.firestore.FieldValue.increment(1),
    updatedAt: new Date(),
  });

  return getDocById(chaptersCol, ref.id);
};

exports.updateChapter = async (chapterId, courseId, teacherAccountId, data) => {
  const courseDoc = await coursesCol.doc(courseId).get();
  if (!courseDoc.exists) return null;
  if (courseDoc.data().teacherAccountId !== teacherAccountId) return null;
  await chaptersCol.doc(chapterId).update({ ...data, updatedAt: new Date() });
  return getDocById(chaptersCol, chapterId);
};

exports.deleteChapter = async (chapterId, courseId, teacherAccountId) => {
  const courseDoc = await coursesCol.doc(courseId).get();
  if (!courseDoc.exists) return null;
  if (courseDoc.data().teacherAccountId !== teacherAccountId) return null;

  const lessonsSnap = await lessonsCol.where('chapterId', '==', chapterId).get();
  const lessonCount = lessonsSnap.size;

  const batch = db.batch();
  lessonsSnap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(chaptersCol.doc(chapterId));
  await batch.commit();

  await coursesCol.doc(courseId).update({
    totalChapters: admin.firestore.FieldValue.increment(-1),
    totalLessons: admin.firestore.FieldValue.increment(-lessonCount),
  });
  return { deleted: true };
};

exports.createLesson = async (chapterId, courseId, teacherAccountId, data) => {
  const courseDoc = await coursesCol.doc(courseId).get();
  if (!courseDoc.exists) return null;
  if (courseDoc.data().teacherAccountId !== teacherAccountId) return null;

  const existingLessSnap = await lessonsCol.where('chapterId', '==', chapterId).get();
  const order = existingLessSnap.empty ? 1 : Math.max(...existingLessSnap.docs.map(d => d.data().order || 0)) + 1;

  const ref = await lessonsCol.add({
    chapterId, courseId, ...data, order,
    createdAt: new Date(), updatedAt: new Date(),
  });

  await Promise.all([
    coursesCol.doc(courseId).update({
      totalLessons: admin.firestore.FieldValue.increment(1),
      updatedAt: new Date(),
    }),
    chaptersCol.doc(chapterId).update({
      totalLessons: admin.firestore.FieldValue.increment(1),
    }),
  ]);

  return getDocById(lessonsCol, ref.id);
};

exports.updateLesson = async (lessonId, courseId, teacherAccountId, data) => {
  const courseDoc = await coursesCol.doc(courseId).get();
  if (!courseDoc.exists) return null;
  if (courseDoc.data().teacherAccountId !== teacherAccountId) return null;
  await lessonsCol.doc(lessonId).update({ ...data, updatedAt: new Date() });
  return getDocById(lessonsCol, lessonId);
};

exports.deleteLesson = async (lessonId, courseId, teacherAccountId) => {
  const courseDoc = await coursesCol.doc(courseId).get();
  if (!courseDoc.exists) return null;
  if (courseDoc.data().teacherAccountId !== teacherAccountId) return null;

  const lesson = await getDocById(lessonsCol, lessonId);
  if (!lesson) return null;

  await lessonsCol.doc(lessonId).delete();
  await Promise.all([
    coursesCol.doc(courseId).update({ totalLessons: admin.firestore.FieldValue.increment(-1) }),
    chaptersCol.doc(lesson.chapterId).update({ totalLessons: admin.firestore.FieldValue.increment(-1) }),
  ]);
  return { deleted: true };
};

exports.getLessonDetail = async (lessonId, studentAccountId) => {
  const lesson = await getDocById(lessonsCol, lessonId);
  if (!lesson) return null;

  let nextLessonFinal = null;
  const chapLessSnap = await lessonsCol.where('chapterId', '==', lesson.chapterId).get();
  const chapLessons = chapLessSnap.docs.map(docToObj).sort((a, b) => (a.order || 0) - (b.order || 0));
  const nextInChap = chapLessons.find(l => (l.order || 0) === (lesson.order || 0) + 1);

  if (nextInChap) {
    nextLessonFinal = nextInChap;
  } else {
    const currentChapter = await getDocById(chaptersCol, lesson.chapterId);
    const allChapsSnap = await chaptersCol.where('courseId', '==', lesson.courseId).get();
    const nextChap = allChapsSnap.docs
      .map(docToObj)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .find(c => (c.order || 0) > (currentChapter?.order || 0));

    if (nextChap) {
      const firstLessSnap = await lessonsCol.where('chapterId', '==', nextChap._id).get();
      const firstLess = firstLessSnap.docs.map(docToObj).sort((a, b) => (a.order || 0) - (b.order || 0))[0];
      if (firstLess) nextLessonFinal = firstLess;
    }
  }

  let progress = null;
  if (studentAccountId) {
    const progSnap = await progressCol
      .where('lessonId', '==', lessonId)
      .where('studentAccountId', '==', studentAccountId)
      .limit(1).get();
    if (!progSnap.empty) progress = docToObj(progSnap.docs[0]);
  }

  const isEnrolled = studentAccountId
    ? !!(await findOne(enrollmentsCol, { courseId: lesson.courseId, studentAccountId, status: 'active' }))
    : false;

  const nextLesson = nextLessonFinal
    ? {
        _id: nextLessonFinal._id,
        title: nextLessonFinal.title,
        isFree: nextLessonFinal.isFree,
        locked: !nextLessonFinal.isFree && !isEnrolled,
      }
    : null;

  return { lesson, progress, nextLesson };
};

exports.enrollCourse = async (courseId, student) => {
  const course = await getDocById(coursesCol, courseId);
  if (!course || course.status !== 'published') return { error: 'Khoa hoc khong ton tai.' };

  const existing = await findOne(enrollmentsCol, { courseId, studentAccountId: student.accountId });
  if (existing) return { error: 'Ban da dang ky khoa hoc nay roi.' };

  const ref = await enrollmentsCol.add({
    courseId,
    studentAccountId: student.accountId,
    studentName: student.name || '',
    paymentStatus: course.isFree ? 'free' : 'pending',
    status: course.isFree ? 'active' : 'pending',
    totalLessons: course.totalLessons || 0,
    progressPercent: 0,
    completedLessons: 0,
    enrolledAt: new Date(),
    completedAt: null,
  });

  if (course.isFree) {
    await coursesCol.doc(courseId).update({ totalStudents: admin.firestore.FieldValue.increment(1) });
  }

  const enrollment = await getDocById(enrollmentsCol, ref.id);
  return { enrollment, isPending: !course.isFree };
};

exports.getStudentCourses = async (studentAccountId) => {
  const snap = await enrollmentsCol.where('studentAccountId', '==', studentAccountId).get();
  const enrollments = await Promise.all(
    snap.docs.map(async (doc) => {
      const enrollment = docToObj(doc);
      const courseDoc = await coursesCol.doc(enrollment.courseId).get();
      enrollment.courseId = courseDoc.exists ? docToObj(courseDoc) : null;
      return enrollment;
    }),
  );
  return enrollments.sort((a, b) => (b.enrolledAt > a.enrolledAt ? 1 : -1));
};

exports.getPendingEnrollments = async (teacherAccountId) => {
  const coursesSnap = await coursesCol.where('teacherAccountId', '==', teacherAccountId).get();
  const courseIds = coursesSnap.docs.map((d) => d.id);
  if (courseIds.length === 0) return [];

  const chunkSize = 30;
  const chunks = [];
  for (let i = 0; i < courseIds.length; i += chunkSize) {
    chunks.push(courseIds.slice(i, i + chunkSize));
  }

  const allSnaps = await Promise.all(
    chunks.map((chunk) =>
      enrollmentsCol.where('courseId', 'in', chunk).where('status', '==', 'pending').get(),
    ),
  );

  const results = [];
  for (const snap of allSnaps) {
    for (const doc of snap.docs) {
      const enrollment = docToObj(doc);
      const courseDoc = await coursesCol.doc(enrollment.courseId).get();
      enrollment.courseId = courseDoc.exists
        ? { _id: courseDoc.id, id: courseDoc.id, title: courseDoc.data().title }
        : null;
      results.push(enrollment);
    }
  }
  return results;
};

exports.approveEnrollment = async (enrollmentId, teacherAccountId) => {
  const enrollment = await getDocById(enrollmentsCol, enrollmentId);
  if (!enrollment) return null;
  const courseDoc = await coursesCol.doc(enrollment.courseId).get();
  if (!courseDoc.exists) return null;
  if (courseDoc.data().teacherAccountId !== teacherAccountId) return null;

  await coursesCol.doc(enrollment.courseId).update({
    totalStudents: admin.firestore.FieldValue.increment(1),
  });
  await enrollmentsCol.doc(enrollmentId).update({ status: 'active', paymentStatus: 'paid' });
  return getDocById(enrollmentsCol, enrollmentId);
};

exports.rejectEnrollment = async (enrollmentId, teacherAccountId) => {
  const enrollment = await getDocById(enrollmentsCol, enrollmentId);
  if (!enrollment) return null;
  const courseDoc = await coursesCol.doc(enrollment.courseId).get();
  if (!courseDoc.exists) return null;
  if (courseDoc.data().teacherAccountId !== teacherAccountId) return null;

  await enrollmentsCol.doc(enrollmentId).update({ status: 'cancelled' });
  return getDocById(enrollmentsCol, enrollmentId);
};

exports.updateLessonProgress = async (lessonId, courseId, studentAccountId, data) => {
  const existing = await progressCol
    .where('lessonId', '==', lessonId)
    .where('studentAccountId', '==', studentAccountId)
    .limit(1).get();

  let progressId;
  if (existing.empty) {
    const ref = await progressCol.add({ lessonId, courseId, studentAccountId, ...data, updatedAt: new Date() });
    progressId = ref.id;
  } else {
    progressId = existing.docs[0].id;
    await progressCol.doc(progressId).update({ courseId, studentAccountId, ...data, updatedAt: new Date() });
  }

  const [allLessSnap, allProgSnap] = await Promise.all([
    lessonsCol.where('courseId', '==', courseId).get(),
    progressCol.where('courseId', '==', courseId).get(),
  ]);
  const totalLessons = allLessSnap.size;
  const completedLessons = allProgSnap.docs.filter(
    d => d.data().studentAccountId === studentAccountId && d.data().status === 'completed'
  ).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const enrollSnap = await enrollmentsCol
    .where('courseId', '==', courseId)
    .where('studentAccountId', '==', studentAccountId)
    .limit(1).get();

  if (!enrollSnap.empty) {
    await enrollSnap.docs[0].ref.update({ progressPercent, completedLessons, totalLessons });
  }

  return getDocById(progressCol, progressId);
};

exports.getStudentsProgress = async (courseId, teacherAccountId) => {
  const course = await getDocById(coursesCol, courseId);
  if (!course || course.teacherAccountId !== teacherAccountId) return null;

  const [enrollSnap, lessonsSnap, progressSnap] = await Promise.all([
    enrollmentsCol.where('courseId', '==', courseId).get(),
    lessonsCol.where('courseId', '==', courseId).get(),
    progressCol.where('courseId', '==', courseId).get(),
  ]);

  const lessons = lessonsSnap.docs.map(docToObj).sort((a, b) => (a.order || 0) - (b.order || 0));
  const allProgress = progressSnap.docs.map(docToObj);

  const students = enrollSnap.docs.map(docToObj).filter(e => e.status === 'active').map((enrollment) => {
    const studentProgress = allProgress.filter(p => p.studentAccountId === enrollment.studentAccountId);
    const lessonDetails = lessons.map((lesson) => {
      const prog = studentProgress.find((p) => p.lessonId === lesson._id);
      return {
        lessonId: lesson._id,
        lessonTitle: lesson.title,
        lessonOrder: lesson.order,
        status: prog?.status || 'not_started',
        completedAt: prog?.completedAt || null,
        score: prog?.score ?? null,
      };
    });
    return {
      studentAccountId: enrollment.studentAccountId,
      studentName: enrollment.studentName,
      progressPercent: enrollment.progressPercent || 0,
      completedLessons: enrollment.completedLessons || 0,
      totalLessons: lessons.length,
      enrolledAt: enrollment.enrolledAt,
      lessons: lessonDetails,
    };
  });

  return { students, totalStudents: students.length };
};