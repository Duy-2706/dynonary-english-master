const { db, docToObj } = require('../configs/firebase.config');

const gameRoomsCol = db.collection('gameRooms');
const AVATARS = ['🦁','🐸','🦊','🐼','🐯','🦄','🐧','🦋','🐳','🦕'];

function generatePin() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function pickAvatar(existingPlayers = {}) {
  const used = Object.values(existingPlayers).map(p => p.avatar);
  const pool = AVATARS.filter(a => !used.includes(a));
  return (pool.length > 0 ? pool : AVATARS)[Math.floor(Math.random() * (pool.length || AVATARS.length))];
}

async function getRoomByPin(pin) {
  const snap = await gameRoomsCol.where('pin', '==', pin).limit(1).get();
  if (snap.empty) return null;
  return { doc: snap.docs[0], data: docToObj(snap.docs[0]) };
}

exports.createRoom = async ({ hostId, hostName, gameType, wordPack }) => {
  const questions = (wordPack || []).map(w => ({
    word: w.word || '', mean: w.mean || '', phonetic: w.phonetic || '',
    picture: w.picture || '', audioUrl: w.audioUrl || '',
    choices: w.choices || [], correct: w.correct || w.word || '',
  }));
  let pin = generatePin();
  while (await getRoomByPin(pin)) pin = generatePin();
  const ref = await gameRoomsCol.add({
    pin, hostId, status: 'waiting', gameType: gameType || 'classic',
    questions, currentQuestion: 0, questionStartAt: null,
    players: { [hostId]: { name: hostName || 'Host', score: 0, streak: 0, avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)], answered: false } },
    createdAt: new Date().toISOString(),
  });
  return { id: ref.id, pin };
};

exports.joinRoom = async (pin, userId, userName) => {
  const result = await getRoomByPin(pin);
  if (!result || result.data.status !== 'waiting') throw new Error('Room not found or already started');
  const { doc, data } = result;
  await doc.ref.update({ [`players.${userId}`]: { name: userName || 'Player', score: 0, streak: 0, avatar: pickAvatar(data.players), answered: false } });
  return docToObj(await doc.ref.get());
};

exports.getRoom = async (pin) => {
  const result = await getRoomByPin(pin);
  return result ? result.data : null;
};

exports.getRoomById = async (roomId) => {
  const doc = await gameRoomsCol.doc(roomId).get();
  return docToObj(doc);
};

exports.startRoom = async (roomId, hostId) => {
  const doc = await gameRoomsCol.doc(roomId).get();
  const data = docToObj(doc);
  if (!data) throw new Error('Room not found');
  if (data.hostId !== hostId) throw new Error('Only the host can start');
  await doc.ref.update({ status: 'playing', currentQuestion: 0, questionStartAt: new Date().toISOString() });
};

exports.submitAnswer = async (pin, userId, questionIndex, answer, timeMs) => {
  const result = await getRoomByPin(pin);
  if (!result) throw new Error('Room not found');
  const { doc, data } = result;
  const question = data.questions[questionIndex];
  if (!question) throw new Error('Question not found');
  const isCorrect = (answer || '').trim().toLowerCase() === (question.correct || '').trim().toLowerCase();
  const player = data.players[userId] || { score: 0, streak: 0 };
  let scoreGain = 0, newStreak = 0;
  if (isCorrect) {
    const speedRatio = 1 - Math.min(timeMs, 20000) / 20000;
    newStreak = (player.streak || 0) + 1;
    scoreGain = (500 + Math.round(500 * speedRatio)) * (newStreak >= 5 ? 2 : 1);
  }
  const newScore = (player.score || 0) + scoreGain;
  await doc.ref.update({ [`players.${userId}.score`]: newScore, [`players.${userId}.streak`]: newStreak, [`players.${userId}.answered`]: true });
  return { isCorrect, scoreGain, newScore };
};

exports.nextQuestion = async (roomId, hostId) => {
  const doc = await gameRoomsCol.doc(roomId).get();
  const data = docToObj(doc);
  if (!data) throw new Error('Room not found');
  if (data.hostId !== hostId) throw new Error('Only the host can advance');
  const nextIndex = (data.currentQuestion || 0) + 1;
  const isEnd = nextIndex >= (data.questions || []).length;
  const playerUpdates = {};
  for (const uid of Object.keys(data.players || {})) playerUpdates[`players.${uid}.answered`] = false;
  if (isEnd) {
    await doc.ref.update({ status: 'ended', ...playerUpdates });
  } else {
    await doc.ref.update({ currentQuestion: nextIndex, questionStartAt: new Date().toISOString(), ...playerUpdates });
  }
  return { isEnd };
};


/**
 * Force-end a room (used when teacher cancels live session).
 * @param {string} roomId
 */
exports.endRoom = async (roomId) => {
  try {
    const doc = await gameRoomsCol.doc(roomId).get();
    if (doc.exists) await doc.ref.update({ status: 'ended' });
  } catch {}
};