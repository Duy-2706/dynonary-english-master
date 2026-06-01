const { db, COLLECTIONS, docToObj } = require('../configs/firebase.config');

exports.getStudentStats = async (studentAccountId) => {
  const [progressSnap, enrollmentsSnap, grammarProgressSnap, highscoresSnap] = await Promise.all([
    db.collection(COLLECTIONS.LESSON_PROGRESS).where('studentAccountId', '==', studentAccountId).get(),
    db.collection(COLLECTIONS.ENROLLMENTS).where('studentAccountId', '==', studentAccountId).get(),
    db.collection(COLLECTIONS.GRAMMAR_PROGRESS).where('studentAccountId', '==', studentAccountId).get(),
    db.collection(COLLECTIONS.HIGHSCORES).where('accountId', '==', studentAccountId).orderBy('score', 'desc').limit(5).get(),
  ]);

  const progress = progressSnap.docs.map((d) => d.data());
  const enrollments = enrollmentsSnap.docs.map((d) => d.data());
  const grammarProgress = grammarProgressSnap.docs.map((d) => d.data());
  const highscores = highscoresSnap.docs.map(docToObj);

  const completedLessons = progress.filter((p) => p.status === 'completed').length;
  const totalScore = progress.reduce((sum, p) => sum + (p.score || 0), 0);

  return {
    coursesEnrolled: enrollments.length,
    activeCourses: enrollments.filter((e) => e.status === 'active').length,
    completedCourses: enrollments.filter((e) => e.status === 'completed').length,
    lessonsCompleted: completedLessons,
    totalLessonScore: totalScore,
    grammarLessonsCompleted: grammarProgress.filter((p) => p.completedAt).length,
    grammarTotalScore: grammarProgress.reduce((sum, p) => sum + (p.score || 0), 0),
    topHighscores: highscores,
  };
};

exports.getTeacherStats = async (teacherAccountId) => {
  const [coursesSnap, grammarSnap] = await Promise.all([
    db.collection(COLLECTIONS.COURSES).where('teacherAccountId', '==', teacherAccountId).get(),
    db.collection(COLLECTIONS.GRAMMAR_LESSONS).where('teacherAccountId', '==', teacherAccountId).get(),
  ]);

  const courses = coursesSnap.docs.map(docToObj);
  const grammarLessons = grammarSnap.docs.map(docToObj);

  const studentsPerCourse = [];
  let totalStudentsEnrolled = 0;

  for (const course of courses) {
    const enrollSnap = await db.collection(COLLECTIONS.ENROLLMENTS)
      .where('courseId', '==', course.id)
      .get();
    const enrollments = enrollSnap.docs.map((d) => d.data());
    totalStudentsEnrolled += enrollments.length;
    studentsPerCourse.push({
      courseId: course.id,
      title: course.title,
      status: course.status,
      totalStudents: enrollments.length,
      completedStudents: enrollments.filter((e) => e.status === 'completed').length,
      avgProgress: enrollments.length
        ? Math.round(enrollments.reduce((s, e) => s + (e.progressPercent || 0), 0) / enrollments.length)
        : 0,
    });
  }

  const grammarByGrade = {};
  grammarLessons.forEach((l) => {
    const g = l.gradeLevel || 'all';
    grammarByGrade[g] = (grammarByGrade[g] || 0) + 1;
  });

  return {
    totalCourses: courses.length,
    publishedCourses: courses.filter((c) => c.status === 'published').length,
    totalGrammarLessons: grammarLessons.length,
    publishedGrammarLessons: grammarLessons.filter((l) => l.status === 'published').length,
    totalStudentsEnrolled,
    studentsPerCourse,
    grammarByGrade,
  };
};
