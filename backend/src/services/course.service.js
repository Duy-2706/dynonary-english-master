const { admin, db, COLLECTIONS, docToObj } = require('../configs/firebase.config');

const coursesCol = db.collection(COLLECTIONS.COURSES);
const chaptersCol = db.collection(COLLECTIONS.CHAPTERS);
const lessonsCol = db.collection(COLLECTIONS.LESSONS);
const enrollmentsCol = db.collection(COLLECTIONS.ENROLLMENTS);
const progressCol = db.collection(COLLECTIONS.LESSON_PROGRESS);

// ─── helpers ────────────────────────────────────────────────────────────────

async function getDocById(collection, id) {
  const doc = await collection.doc(id).get();
  return docToObj(doc);
}

async function findOne(collection, constraints) {
  let q = collection;
  for (const [field, value] of Object.entries(constraints)) {
    q = q.where(field, '==', value);
  }
  const snap = await q.limit(1).get();
  if (snap.empty) return null;
  return docToObj(snap.docs[0]);
}

// ─── COURSE ──────────────────────────────────────────────────────────────────

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

  // Batch-delete all related documents (max 500 per batch)
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
  const snap = await coursesCol
    .where('teacherAccountId', '==', teacherAccountId)
    .orderBy('createdAt', 'desc')
    .get();
  return snap.docs.map(docToObj);
};

exports.getPublishedCourses = async (page = 1, limit = 12) => {
  const skip = (page - 1) * limit;

  const [snap, countSnap] = await Promise.all([
    coursesCol
      .where('status', '==', 'published')
      .orderBy('createdAt', 'desc')
      .offset(skip)
      .limit(limit)
      .get(),
    coursesCol.where('status', '==', 'published').count().get(),
  ]);

  const courses = snap.docs.map(docToObj);
  const total = countSnap.data().count;
  return { courses, total };
};

exports.getCourseDetail = async (courseId) => {
  const course = await getDocById(coursesCol, courseId);
  if (!course) return null;

  const chapSnap = await chaptersCol
    .where('courseId', '==', courseId)
    .orderBy('order', 'asc')
    .get();

  const chaptersWithLessons = await Promise.all(
    chapSnap.docs.map(async (chapDoc) => {
      const chapter = docToObj(chapDoc);
      const lessSnap = await lessonsCol
        .where('chapterId', '==', chapDoc.id)
        .orderBy('order', 'asc')
        .get();
      const lessons = lessSnap.docs.map(docToObj);
      return { ...chapter, lessons };
    }),
  );

  return { ...course, chapters: chaptersWithLessons };
};

// ─── CHAPTER ─────────────────────────────────────────────────────────────────

exports.createChapter = async (courseId, teacherAccountId, data) => {
  const courseDoc = await coursesCol.doc(courseId).get();
  if (!courseDoc.exists) return null;
  if (courseDoc.data().teacherAccountId !== teacherAccountId) return null;

  // Determine next order number
  const lastSnap = await chaptersCol
    .where('courseId', '==', courseId)
    .orderBy('order', 'desc')
    .limit(1)
    .get();
  const order = lastSnap.empty ? 1 : lastSnap.docs[0].data().order + 1;

  const ref = await chaptersCol.add({
    courseId,
    ...data,
    order,
    totalLessons: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
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

  const lessonsSnap = await lessonsCol
    .where('chapterId', '==', chapterId)
    .get();
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

// ─── LESSON ──────────────────────────────────────────────────────────────────

exports.createLesson = async (chapterId, courseId, teacherAccountId, data) => {
  const courseDoc = await coursesCol.doc(courseId).get();
  if (!courseDoc.exists) return null;
  if (courseDoc.data().teacherAccountId !== teacherAccountId) return null;

  const lastSnap = await lessonsCol
    .where('chapterId', '==', chapterId)
    .orderBy('order', 'desc')
    .limit(1)
    .get();
  const order = lastSnap.empty ? 1 : lastSnap.docs[0].data().order + 1;

  const ref = await lessonsCol.add({
    chapterId,
    courseId,
    ...data,
    order,
    createdAt: new Date(),
    updatedAt: new Date(),
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
    coursesCol.doc(courseId).update({
      totalLessons: admin.firestore.FieldValue.increment(-1),
    }),
    chaptersCol.doc(lesson.chapterId).update({
      totalLessons: admin.firestore.FieldValue.increment(-1),
    }),
  ]);

  return { deleted: true };
};

exports.getLessonDetail = async (lessonId, studentAccountId) => {
  const lesson = await getDocById(lessonsCol, lessonId);
  if (!lesson) return null;

  // Find next lesson in same chapter (order + 1)
  let nextLessonFinal = null;
  const nextInChapSnap = await lessonsCol
    .where('courseId', '==', lesson.courseId)
    .where('chapterId', '==', lesson.chapterId)
    .where('order', '==', lesson.order + 1)
    .limit(1)
    .get();

  if (!nextInChapSnap.empty) {
    nextLessonFinal = docToObj(nextInChapSnap.docs[0]);
  } else {
    // No more lessons in this chapter → look for next chapter
    const currentChapter = await getDocById(chaptersCol, lesson.chapterId);
    const nextChapSnap = await chaptersCol
      .where('courseId', '==', lesson.courseId)
      .where('order', '>', currentChapter?.order || 0)
      .orderBy('order', 'asc')
      .limit(1)
      .get();

    if (!nextChapSnap.empty) {
      const firstLessSnap = await lessonsCol
        .where('chapterId', '==', nextChapSnap.docs[0].id)
        .orderBy('order', 'asc')
        .limit(1)
        .get();

      if (!firstLessSnap.empty) {
        nextLessonFinal = docToObj(firstLessSnap.docs[0]);
      }
    }
  }

  // Student progress
  let progress = null;
  if (studentAccountId) {
    const progSnap = await progressCol
      .where('lessonId', '==', lessonId)
      .where('studentAccountId', '==', studentAccountId)
      .limit(1)
      .get();
    if (!progSnap.empty) progress = docToObj(progSnap.docs[0]);
  }

  const isEnrolled = studentAccountId
    ? !!(await findOne(enrollmentsCol, {
        courseId: lesson.courseId,
        studentAccountId,
        status: 'active',
      }))
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

// ─── ENROLLMENT ──────────────────────────────────────────────────────────────

exports.enrollCourse = async (courseId, student) => {
  const course = await getDocById(coursesCol, courseId);
  if (!course || course.status !== 'published') {
    return { error: 'Khoa hoc khong ton tai.' };
  }

  const existing = await findOne(enrollmentsCol, {
    courseId,
    studentAccountId: student.accountId,
  });
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
    await coursesCol.doc(courseId).update({
      totalStudents: admin.firestore.FieldValue.increment(1),
    });
  }

  const enrollment = await getDocById(enrollmentsCol, ref.id);
  return { enrollment, isPending: !course.isFree };
};

exports.getStudentCourses = async (studentAccountId) => {
  const snap = await enrollmentsCol
    .where('studentAccountId', '==', studentAccountId)
    .orderBy('enrolledAt', 'desc')
    .get();

  // Manual populate: replace courseId string with full course object
  return Promise.all(
    snap.docs.map(async (doc) => {
      const enrollment = docToObj(doc);
      const courseDoc = await coursesCol.doc(enrollment.courseId).get();
      enrollment.courseId = courseDoc.exists ? docToObj(courseDoc) : null;
      return enrollment;
    }),
  );
};

exports.getPendingEnrollments = async (teacherAccountId) => {
  const coursesSnap = await coursesCol
    .where('teacherAccountId', '==', teacherAccountId)
    .get();
  const courseIds = coursesSnap.docs.map((d) => d.id);
  if (courseIds.length === 0) return [];

  // Firestore 'in' filter supports max 30 values; chunk if needed
  const chunkSize = 30;
  const chunks = [];
  for (let i = 0; i < courseIds.length; i += chunkSize) {
    chunks.push(courseIds.slice(i, i + chunkSize));
  }

  const allSnaps = await Promise.all(
    chunks.map((chunk) =>
      enrollmentsCol
        .where('courseId', 'in', chunk)
        .where('status', '==', 'pending')
        .get(),
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

  await enrollmentsCol
    .doc(enrollmentId)
    .update({ status: 'active', paymentStatus: 'paid' });

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

// ─── PROGRESS ────────────────────────────────────────────────────────────────

exports.updateLessonProgress = async (
  lessonId,
  courseId,
  studentAccountId,
  data,
) => {
  // Upsert lesson progress (findOneAndUpdate with upsert:true)
  const existing = await progressCol
    .where('lessonId', '==', lessonId)
    .where('studentAccountId', '==', studentAccountId)
    .limit(1)
    .get();

  let progressId;
  if (existing.empty) {
    const ref = await progressCol.add({
      lessonId,
      courseId,
      studentAccountId,
      ...data,
      updatedAt: new Date(),
    });
    progressId = ref.id;
  } else {
    progressId = existing.docs[0].id;
    await progressCol.doc(progressId).update({
      courseId,
      studentAccountId,
      ...data,
      updatedAt: new Date(),
    });
  }

  // Update overall enrollment progress
  const [totalSnap, completedSnap] = await Promise.all([
    lessonsCol.where('courseId', '==', courseId).count().get(),
    progressCol
      .where('courseId', '==', courseId)
      .where('studentAccountId', '==', studentAccountId)
      .where('status', '==', 'completed')
      .count()
      .get(),
  ]);

  const totalLessons = totalSnap.data().count;
  const completedLessons = completedSnap.data().count;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const enrollSnap = await enrollmentsCol
    .where('courseId', '==', courseId)
    .where('studentAccountId', '==', studentAccountId)
    .limit(1)
    .get();

  if (!enrollSnap.empty) {
    await enrollSnap.docs[0].ref.update({
      progressPercent,
      completedLessons,
      totalLessons,
    });
  }

  return getDocById(progressCol, progressId);
};
