const { db, docToObj } = require('../configs/firebase.config');

const teacherRoomsCol = db.collection('teacherRooms');

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function isCodeUnique(code) {
  const snap = await teacherRoomsCol.where('roomCode', '==', code).limit(1).get();
  return snap.empty;
}

exports.createRoom = async ({ teacherAccountId, teacherName, title, description = '' }) => {
  let code;
  do { code = generateRoomCode(); } while (!(await isCodeUnique(code)));

  const now = new Date().toISOString();
  const ref = await teacherRoomsCol.add({
    teacherAccountId,
    teacherName: teacherName || '',
    title,
    description,
    roomCode: code,
    questions: [],
    createdAt: now,
    updatedAt: now,
  });
  const doc = await ref.get();
  return docToObj(doc);
};

exports.getTeacherRooms = async (teacherAccountId) => {
  const snap = await teacherRoomsCol.where('teacherAccountId', '==', teacherAccountId).get();
  return snap.docs.map(docToObj).sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
};

exports.getRoom = async (roomId) => {
  const doc = await teacherRoomsCol.doc(roomId).get();
  return docToObj(doc);
};

exports.getRoomByCode = async (roomCode) => {
  const snap = await teacherRoomsCol.where('roomCode', '==', roomCode.toUpperCase()).limit(1).get();
  if (snap.empty) return null;
  return docToObj(snap.docs[0]);
};

exports.updateRoom = async (roomId, teacherAccountId, updates) => {
  const doc = await teacherRoomsCol.doc(roomId).get();
  const data = docToObj(doc);
  if (!data || data.teacherAccountId !== teacherAccountId) return null;
  const patch = {};
  if (updates.title !== undefined) patch.title = updates.title;
  if (updates.description !== undefined) patch.description = updates.description;
  patch.updatedAt = new Date().toISOString();
  await doc.ref.update(patch);
  return docToObj(await doc.ref.get());
};

exports.deleteRoom = async (roomId, teacherAccountId) => {
  const doc = await teacherRoomsCol.doc(roomId).get();
  const data = docToObj(doc);
  if (!data || data.teacherAccountId !== teacherAccountId) return false;
  await doc.ref.delete();
  return true;
};

exports.addQuestion = async (roomId, teacherAccountId, question) => {
  const doc = await teacherRoomsCol.doc(roomId).get();
  const data = docToObj(doc);
  if (!data || data.teacherAccountId !== teacherAccountId) return null;

  const newQ = {
    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
    question: question.question || '',
    answer: question.answer || '',
    choices: Array.isArray(question.choices) ? question.choices : [],
    timeLimit: question.timeLimit || 20,
    hint: question.hint || '',
  };

  const questions = [...(data.questions || []), newQ];
  await doc.ref.update({ questions, updatedAt: new Date().toISOString() });
  return docToObj(await doc.ref.get());
};

exports.updateQuestion = async (roomId, teacherAccountId, questionId, updates) => {
  const doc = await teacherRoomsCol.doc(roomId).get();
  const data = docToObj(doc);
  if (!data || data.teacherAccountId !== teacherAccountId) return null;

  const questions = (data.questions || []).map((q) =>
    q.id === questionId ? { ...q, ...updates } : q,
  );
  await doc.ref.update({ questions, updatedAt: new Date().toISOString() });
  return docToObj(await doc.ref.get());
};

exports.deleteQuestion = async (roomId, teacherAccountId, questionId) => {
  const doc = await teacherRoomsCol.doc(roomId).get();
  const data = docToObj(doc);
  if (!data || data.teacherAccountId !== teacherAccountId) return null;

  const questions = (data.questions || []).filter((q) => q.id !== questionId);
  await doc.ref.update({ questions, updatedAt: new Date().toISOString() });
  return docToObj(await doc.ref.get());
};


// ── Live session management ───────────────────────────────────────────────────

exports.saveLiveSession = async (roomId, teacherAccountId, pin, gameRoomId) => {
  const doc = await teacherRoomsCol.doc(roomId).get();
  const data = docToObj(doc);
  if (!data || data.teacherAccountId !== teacherAccountId) return false;
  await doc.ref.update({
    activeLiveSession: { pin, gameRoomId, startedAt: new Date().toISOString() },
    updatedAt: new Date().toISOString(),
  });
  return true;
};

exports.clearLiveSession = async (roomId, teacherAccountId) => {
  const doc = await teacherRoomsCol.doc(roomId).get();
  const data = docToObj(doc);
  if (!data || data.teacherAccountId !== teacherAccountId) return null;
  const gameRoomId = data.activeLiveSession?.gameRoomId || null;
  await doc.ref.update({ activeLiveSession: null, updatedAt: new Date().toISOString() });
  return { gameRoomId };
};