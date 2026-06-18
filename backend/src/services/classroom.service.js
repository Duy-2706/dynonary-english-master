const { db, COLLECTIONS, docToObj } = require('../configs/firebase.config');

const classroomsCol = db.collection(COLLECTIONS.CLASSROOMS);
const usersCol = db.collection(COLLECTIONS.USERS);
const submissionsCol = db.collection(COLLECTIONS.GRAMMAR_SUBMISSIONS);
const assignmentsCol = db.collection(COLLECTIONS.GRAMMAR_ASSIGNMENTS);
const evalsCol = db.collection(COLLECTIONS.WEEKLY_EVALUATIONS);

// ─── helpers ────────────────────────────────────────────────────────────────

function generateClassCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function getById(id) {
  const doc = await classroomsCol.doc(id).get();
  return docToObj(doc);
}

// ─── exports ─────────────────────────────────────────────────────────────────

exports.createClassroom = async (teacher, data) => {
  const { name, description = '', level = 'A1' } = data;

  // Generate a unique class code
  let classCode = generateClassCode();
  let snap = await classroomsCol
    .where('classCode', '==', classCode)
    .limit(1)
    .get();

  while (!snap.empty) {
    classCode = generateClassCode();
    snap = await classroomsCol
      .where('classCode', '==', classCode)
      .limit(1)
      .get();
  }

  const ref = await classroomsCol.add({
    teacherAccountId: teacher.accountId,
    teacherUsername: teacher.username,
    name,
    description,
    level,
    classCode,
    status: 'active',
    students: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return getById(ref.id);
};

exports.getMyClassrooms = async (user) => {
    if (user.role === 'student') {
    // Try classroomId first
    if (user.classroomId) {
      const doc = await classroomsCol.doc(user.classroomId).get();
      if (doc.exists) return [docToObj(doc)];
    }
    // Fallback: find by classroomName, then auto-fix classroomId on user doc
    if (user.classroomName) {
      const snap = await classroomsCol.where('name', '==', user.classroomName).limit(1).get();
      if (!snap.empty) {
        const classroom = docToObj(snap.docs[0]);
        const userSnap = await usersCol.where('accountId', '==', user.accountId).limit(1).get();
        if (!userSnap.empty) {
          await userSnap.docs[0].ref.update({ classroomId: classroom.id });
        }
        return [classroom];
      }
    }
    return [];
  }
  const snap = await classroomsCol
    .where('teacherAccountId', '==', user.accountId)
    // .orderBy('createdAt', 'desc')
    .get();
    return snap.docs.map(docToObj).sort((a, b) => {
    const ta = a.createdAt?.toDate?.() ?? new Date(a.createdAt ?? 0);
    const tb = b.createdAt?.toDate?.() ?? new Date(b.createdAt ?? 0);
    return tb - ta;
  });
};

exports.updateClassroom = async (teacher, classroomId, data) => {
  const { name, description, level, status } = data;

  const doc = await classroomsCol.doc(classroomId).get();
  if (!doc.exists) return null;
  if (doc.data().teacherAccountId !== teacher.accountId) return null;

  await classroomsCol.doc(classroomId).update({
    name,
    description,
    level,
    status,
    updatedAt: new Date(),
  });

  return getById(classroomId);
};

exports.deleteClassroom = async (teacher, classroomId) => {
  const doc = await classroomsCol.doc(classroomId).get();
  if (!doc.exists) return null;
  if (doc.data().teacherAccountId !== teacher.accountId) return null;

  await classroomsCol.doc(classroomId).delete();
  return { deleted: true };
};

exports.getClassroomById = async (teacher, classroomId) => {
  const doc = await classroomsCol.doc(classroomId).get();
  if (!doc.exists) return null;
  const classroom = docToObj(doc);
  if (classroom.teacherAccountId !== teacher.accountId) return null;
  return classroom;
};

exports.getClassroomActivity = async (teacher, classroomId) => {
  const doc = await classroomsCol.doc(classroomId).get();
  if (!doc.exists) return null;
  if (doc.data().teacherAccountId !== teacher.accountId) return null;

  const classroom = docToObj(doc);
  const students = classroom.students || [];

  const submissionsSnap = await submissionsCol
    .where('classroomId', '==', classroomId)
    .get();

  const submissions = submissionsSnap.docs.map(docToObj);

  const activityMap = {};
  students.forEach((s) => {
    activityMap[s.accountId] = {
      ...s,
      submissionCount: 0,
      totalScore: 0,
      totalMaxScore: 0,
      lastActive: null,
    };
  });

  submissions.forEach((sub) => {
    if (!activityMap[sub.studentAccountId]) return;
    activityMap[sub.studentAccountId].submissionCount += 1;
    activityMap[sub.studentAccountId].totalScore += sub.score || 0;
    activityMap[sub.studentAccountId].totalMaxScore += sub.maxScore || 0;
    const subDate = sub.submittedAt?.toDate
      ? sub.submittedAt.toDate()
      : new Date(sub.submittedAt);
    const prev = activityMap[sub.studentAccountId].lastActive;
    if (!prev || subDate > prev) {
      activityMap[sub.studentAccountId].lastActive = subDate;
    }
  });

  return Object.values(activityMap);
};

exports.getWeeklyReport = async (teacher, classroomId, weekNumber, year) => {
  const doc = await classroomsCol.doc(classroomId).get();
  if (!doc.exists) return null;
  if (doc.data().teacherAccountId !== teacher.accountId) return null;

  const classroom = docToObj(doc);
  const students = classroom.students || [];

  const assignmentsSnap = await assignmentsCol
    .where('classroomId', '==', classroomId)
    .where('weekNumber', '==', Number(weekNumber))
    .where('year', '==', Number(year))
    .get();

  const assignments = assignmentsSnap.docs.map(docToObj);
  const assignmentIds = assignments.map((a) => a._id);

  let submissions = [];
  for (let i = 0; i < assignmentIds.length; i += 10) {
    const chunk = assignmentIds.slice(i, i + 10);
    const snap = await submissionsCol.where('assignmentId', 'in', chunk).get();
    submissions.push(...snap.docs.map(docToObj));
  }

  const evalsSnap = await evalsCol
    .where('classroomId', '==', classroomId)
    .where('weekNumber', '==', Number(weekNumber))
    .where('year', '==', Number(year))
    .get();

  const evalMap = {};
  evalsSnap.docs.map(docToObj).forEach((e) => {
    evalMap[e.studentAccountId] = e;
  });

  const report = students.map((student) => {
    const studentSubs = submissions.filter(
      (s) => s.studentAccountId === student.accountId,
    );
    const totalScore = studentSubs.reduce((sum, s) => sum + (s.score || 0), 0);
    const totalMaxScore = studentSubs.reduce(
      (sum, s) => sum + (s.maxScore || 0),
      0,
    );
    return {
      ...student,
      assignments: assignments.map((a) => {
        const sub = studentSubs.find((s) => s.assignmentId === a._id);
        return {
          assignmentId: a._id,
          assignmentTitle: a.title || a.lessonTitle,
          submitted: !!sub,
          score: sub?.score,
          maxScore: sub?.maxScore ?? a.maxScore,
          isLate: sub?.isLate,
        };
      }),
      totalScore,
      totalMaxScore,
      submissionCount: studentSubs.length,
      evaluation: evalMap[student.accountId] || null,
    };
  });

  return { assignments, report, weekNumber: Number(weekNumber), year: Number(year) };
};

exports.upsertWeeklyEvaluation = async (teacher, classroomId, data) => {
  const doc = await classroomsCol.doc(classroomId).get();
  if (!doc.exists) return null;
  if (doc.data().teacherAccountId !== teacher.accountId) return null;

  const {
    studentAccountId,
    weekNumber,
    year,
    teacherScore,
    teacherComment,
    studentName,
  } = data;

  const snap = await evalsCol
    .where('classroomId', '==', classroomId)
    .where('studentAccountId', '==', studentAccountId)
    .where('weekNumber', '==', Number(weekNumber))
    .where('year', '==', Number(year))
    .limit(1)
    .get();

  const evalData = {
    classroomId,
    studentAccountId,
    studentName: studentName || '',
    weekNumber: Number(weekNumber),
    year: Number(year),
    teacherScore: Number(teacherScore) || 0,
    teacherComment: teacherComment || '',
    updatedAt: new Date(),
  };

  if (!snap.empty) {
    const ref = evalsCol.doc(snap.docs[0].id);
    await ref.update(evalData);
    return docToObj(await ref.get());
  }

  evalData.createdAt = new Date();
  const ref = await evalsCol.add(evalData);
  return docToObj(await ref.get());
};