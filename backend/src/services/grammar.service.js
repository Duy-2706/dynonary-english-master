const { db, COLLECTIONS, docToObj } = require('../configs/firebase.config');

const grammarCol = db.collection(COLLECTIONS.GRAMMAR_LESSONS);
const progressCol = db.collection(COLLECTIONS.GRAMMAR_PROGRESS);
const assignmentsCol = db.collection(COLLECTIONS.GRAMMAR_ASSIGNMENTS);
const submissionsCol = db.collection(COLLECTIONS.GRAMMAR_SUBMISSIONS);

exports.getLessons = async (filters = {}) => {
  let query = grammarCol;
  if (filters.teacherAccountId) {
    query = query.where('teacherAccountId', '==', filters.teacherAccountId);
  } else if (filters.status) {
    query = query.where('status', '==', filters.status);
  }

  const snap = await query.get();
  let lessons = snap.docs.map(docToObj);

  if (filters.status && !filters.teacherAccountId) {
    // đã filter bởi Firestore ở trên rồi
  } else if (filters.status) {
    lessons = lessons.filter(l => l.status === filters.status);
  }
  if (filters.year) lessons = lessons.filter(l => l.year === Number(filters.year));
  if (filters.month) lessons = lessons.filter(l => l.month === Number(filters.month));
  if (filters.weekNumber) lessons = lessons.filter(l => l.weekNumber === Number(filters.weekNumber));
  if (filters.gradeLevel && filters.gradeLevel !== 'all') {
    lessons = lessons.filter(l => l.gradeLevel === filters.gradeLevel || l.gradeLevel === 'all');
  }
  if (filters.topic) lessons = lessons.filter(l => l.topic === filters.topic);
  if (filters.module) lessons = lessons.filter(l => l.module === filters.module);

  // Sort mới nhất trước (không cần Firestore index)
  lessons.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));

  return lessons;
};

exports.getLessonById = async (lessonId) => {
  const doc = await grammarCol.doc(lessonId).get();
  return docToObj(doc);
};

exports.createLesson = async (teacherAccountId, teacherName, data) => {
  const now = new Date().toISOString();
  const lesson = {
    title: data.title || '',
    description: data.description || '',
    videoUrl: data.videoUrl || '',
    content: data.content || '',
    gradeLevel: data.gradeLevel || 'all',
    topic: data.topic || '',
    module: data.module || '',
    weekNumber: data.weekNumber ? Number(data.weekNumber) : null,
    month: data.month ? Number(data.month) : null,
    year: data.year ? Number(data.year) : new Date().getFullYear(),
    exercises: (data.exercises || []).map((ex, i) => ({
      id: `ex_${i}_${Date.now()}`,
      question: ex.question || '',
      type: ex.type || 'mcq',
      options: ex.options || [],
      answer: ex.answer || '',
      explanation: ex.explanation || '',
    })),
    teacherAccountId,
    teacherName,
    status: data.status || 'draft',
    createdAt: now,
    updatedAt: now,
  };

  const ref = await grammarCol.add(lesson);
  return { ...lesson, id: ref.id, _id: ref.id };
};

exports.updateLesson = async (lessonId, teacherAccountId, data) => {
  const doc = await grammarCol.doc(lessonId).get();
  if (!doc.exists) throw new Error('Không tìm thấy bài học');
  if (doc.data().teacherAccountId !== teacherAccountId) throw new Error('Không có quyền');

  const { teacherAccountId: _, teacherName: __, createdAt: ___, ...rest } = data;
  const updates = { ...rest, updatedAt: new Date().toISOString() };

  if (updates.exercises) {
    updates.exercises = updates.exercises.map((ex, i) => ({
      id: ex.id || `ex_${i}_${Date.now()}`,
      question: ex.question || '',
      type: ex.type || 'mcq',
      options: ex.options || [],
      answer: ex.answer || '',
      explanation: ex.explanation || '',
    }));
  }

  await doc.ref.update(updates);
  return docToObj(await grammarCol.doc(lessonId).get());
};

exports.deleteLesson = async (lessonId, teacherAccountId) => {
  const doc = await grammarCol.doc(lessonId).get();
  if (!doc.exists) throw new Error('Không tìm thấy bài học');
  if (doc.data().teacherAccountId !== teacherAccountId) throw new Error('Không có quyền');
  await doc.ref.delete();
};

exports.submitProgress = async (lessonId, studentAccountId, data) => {
  const lessonDoc = await grammarCol.doc(lessonId).get();
  if (!lessonDoc.exists) throw new Error('Không tìm thấy bài học');

  const exercises = lessonDoc.data().exercises || [];
  const answers = data.answers || [];
  let correct = 0;

  const evaluated = answers.map((a) => {
    const ex = exercises.find((e) => e.id === a.questionId);
    const isCorrect = ex && a.answer.trim().toLowerCase() === ex.answer.trim().toLowerCase();
    if (isCorrect) correct++;
    return { ...a, isCorrect };
  });

  const now = new Date().toISOString();
  const progressData = {
    lessonId,
    studentAccountId,
    score: correct,
    maxScore: exercises.length,
    answers: evaluated,
    completedAt: now,
    updatedAt: now,
  };

  const existing = await progressCol
    .where('lessonId', '==', lessonId)
    .where('studentAccountId', '==', studentAccountId)
    .limit(1)
    .get();

  if (!existing.empty) {
    await existing.docs[0].ref.update(progressData);
  } else {
    await progressCol.add(progressData);
  }

  return { score: correct, maxScore: exercises.length, answers: evaluated };
};

exports.getStudentProgress = async (studentAccountId) => {
  const snap = await progressCol.where('studentAccountId', '==', studentAccountId).get();
  return snap.docs.map(docToObj);
};

exports.getTopics = async () => {
  const snap = await grammarCol.where('status', '==', 'published').get();
  const topics = {};
  snap.docs.forEach((doc) => {
    const d = doc.data();
    const grade = d.gradeLevel || 'all';
    if (!topics[grade]) topics[grade] = new Set();
    if (d.topic) topics[grade].add(d.topic);
  });
  const result = {};
  for (const [grade, set] of Object.entries(topics)) {
    result[grade] = Array.from(set);
  }
  return result;
};

exports.createAssignment = async (teacherAccountId, teacherName, data) => {
  const now = new Date().toISOString();
  const doc = {
    lessonId: data.lessonId || null,
    classroomId: data.classroomId || '',
    classroomName: data.classroomName || '',
    teacherAccountId,
    teacherName,
    title: data.title || '',
    description: data.description || '',
    gradeLevel: data.gradeLevel || 'all',
    weekNumber: data.weekNumber ? Number(data.weekNumber) : null,
    year: data.year ? Number(data.year) : new Date().getFullYear(),
    dueDate: data.dueDate || null,
    exercises: (data.exercises || []).map((ex, i) => ({
      id: ex.id || `ex_${i}_${Date.now()}`,
      question: ex.question || '',
      type: ex.type || 'mcq',
      options: ex.options || [],
      answer: ex.answer || '',
      explanation: ex.explanation || '',
    })),
    status: data.status || 'active',
    createdAt: now,
    updatedAt: now,
  };
  const ref = await assignmentsCol.add(doc);
  return { ...doc, id: ref.id, _id: ref.id };
};

exports.getTeacherAssignments = async (teacherAccountId) => {
  const snap = await assignmentsCol.where('teacherAccountId', '==', teacherAccountId).get();
  return snap.docs.map(docToObj).sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
};

exports.getClassroomAssignments = async (classroomId) => {
  const snap = await assignmentsCol.where('classroomId', '==', classroomId).get();
  return snap.docs
    .map(docToObj)
    .filter((a) => a.status !== 'draft')
    .sort((a, b) => ((a.dueDate || '') > (b.dueDate || '') ? 1 : -1));
};

exports.updateAssignment = async (id, teacherAccountId, data) => {
  const doc = await assignmentsCol.doc(id).get();
  if (!doc.exists) throw new Error('Không tìm thấy bài tập');
  if (doc.data().teacherAccountId !== teacherAccountId) throw new Error('Không có quyền');
  const updates = { ...data, updatedAt: new Date().toISOString() };
  delete updates.teacherAccountId;
  delete updates.teacherName;
  delete updates.createdAt;
  if (updates.exercises) {
    updates.exercises = updates.exercises.map((ex, i) => ({
      id: ex.id || `ex_${i}_${Date.now()}`,
      question: ex.question || '',
      type: ex.type || 'mcq',
      options: ex.options || [],
      answer: ex.answer || '',
      explanation: ex.explanation || '',
    }));
  }
  await doc.ref.update(updates);
  return docToObj(await assignmentsCol.doc(id).get());
};

exports.deleteAssignment = async (id, teacherAccountId) => {
  const doc = await assignmentsCol.doc(id).get();
  if (!doc.exists) throw new Error('Không tìm thấy bài tập');
  if (doc.data().teacherAccountId !== teacherAccountId) throw new Error('Không có quyền');
  await doc.ref.delete();
};

exports.submitAssignment = async (assignmentId, studentAccountId, studentName, data) => {
  const doc = await assignmentsCol.doc(assignmentId).get();
  if (!doc.exists) throw new Error('Không tìm thấy bài tập');
  const assignment = doc.data();
  const now = new Date().toISOString();
  const isLate = assignment.dueDate ? now > assignment.dueDate : false;

  const exercises = assignment.exercises || [];
  const answers = data.answers || [];
  let correct = 0;
  const evaluated = answers.map((a) => {
    const ex = exercises.find((e) => e.id === a.questionId);
    const isCorrect = ex ? a.answer.trim().toLowerCase() === ex.answer.trim().toLowerCase() : false;
    if (isCorrect) correct++;
    return { ...a, isCorrect };
  });

  const submissionDoc = {
    assignmentId,
    classroomId: assignment.classroomId,
    studentAccountId,
    studentName: studentName || '',
    answers: evaluated,
    score: correct,
    maxScore: exercises.length,
    isLate,
    submittedAt: now,
  };

  const existing = await submissionsCol
    .where('assignmentId', '==', assignmentId)
    .where('studentAccountId', '==', studentAccountId)
    .limit(1)
    .get();

  if (!existing.empty) {
    await existing.docs[0].ref.update(submissionDoc);
    return { ...submissionDoc, id: existing.docs[0].id, _id: existing.docs[0].id };
  }
  const ref = await submissionsCol.add(submissionDoc);
  return { ...submissionDoc, id: ref.id, _id: ref.id };
};

exports.getAssignmentSubmissions = async (assignmentId, teacherAccountId) => {
  const doc = await assignmentsCol.doc(assignmentId).get();
  if (!doc.exists) throw new Error('Không tìm thấy bài tập');
  if (doc.data().teacherAccountId !== teacherAccountId) throw new Error('Không có quyền');
  const snap = await submissionsCol.where('assignmentId', '==', assignmentId).get();
  return snap.docs.map(docToObj).sort((a, b) => (a.submittedAt > b.submittedAt ? 1 : -1));
};

exports.getMySubmissions = async (studentAccountId) => {
  const snap = await submissionsCol.where('studentAccountId', '==', studentAccountId).get();
  return snap.docs.map(docToObj);
};

exports.getLessonAssignmentsForClassroom = async (lessonId, classroomId) => {
  const snap = await assignmentsCol
    .where('lessonId', '==', lessonId)
    .where('classroomId', '==', classroomId)
    .get();
  return snap.docs
    .map(docToObj)
    .filter((a) => a.status !== 'draft')
    .sort((a, b) => ((a.dueDate || '') > (b.dueDate || '') ? 1 : -1));
};

exports.getAllLessonsAdmin = async () => {
  const snap = await grammarCol.get();
  const lessons = snap.docs.map(docToObj);
  lessons.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  return lessons;
};

exports.updateLessonAdmin = async (lessonId, data) => {
  const doc = await grammarCol.doc(lessonId).get();
  if (!doc.exists) throw new Error('Không tìm thấy bài học');
  const { teacherAccountId: _a, teacherName: _b, createdAt: _c, ...rest } = data;
  const updates = { ...rest, updatedAt: new Date().toISOString() };
  if (updates.exercises) {
    updates.exercises = updates.exercises.map((ex, i) => ({
      id: ex.id || `ex_${i}_${Date.now()}`,
      question: ex.question || '',
      type: ex.type || 'mcq',
      options: ex.options || [],
      answer: ex.answer || '',
      explanation: ex.explanation || '',
    }));
  }
  await doc.ref.update(updates);
  return docToObj(await grammarCol.doc(lessonId).get());
};

exports.deleteLessonAdmin = async (lessonId) => {
  const doc = await grammarCol.doc(lessonId).get();
  if (!doc.exists) throw new Error('Không tìm thấy bài học');
  await doc.ref.delete();
};

