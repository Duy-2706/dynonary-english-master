const { db, COLLECTIONS, docToObj } = require('../configs/firebase.config');

const grammarCol = db.collection(COLLECTIONS.GRAMMAR_LESSONS);
const progressCol = db.collection(COLLECTIONS.GRAMMAR_PROGRESS);

exports.getLessons = async (filters = {}) => {
  // Dùng TỐI ĐA 1 điều kiện equality để tránh composite index
  // Mọi filter khác và sort đều làm trong memory
  let query = grammarCol;
  if (filters.teacherAccountId) {
    query = query.where('teacherAccountId', '==', filters.teacherAccountId);
  } else if (filters.status) {
    query = query.where('status', '==', filters.status);
  }

  const snap = await query.get();
  let lessons = snap.docs.map(docToObj);

  // In-memory filters
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