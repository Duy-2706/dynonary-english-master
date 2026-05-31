const { db, COLLECTIONS, docToObj } = require('../configs/firebase.config');

const classroomsCol = db.collection(COLLECTIONS.CLASSROOMS);

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

exports.getMyClassrooms = async (teacher) => {
  const snap = await classroomsCol
    .where('teacherAccountId', '==', teacher.accountId)
    .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map(docToObj);
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
