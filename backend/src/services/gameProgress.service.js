const { db, docToObj } = require('../configs/firebase.config');

const gameProgressCol = db.collection('gameProgress');

const COINS_ON_COMPLETE = 30;
const COINS_PER_CORRECT = 3;
const FLASHCARD_COINS_ON_COMPLETE = 20;
const FLASHCARD_COINS_PER_KNOWN = 2;

// ── Solo game progress (teacher room practice) ────────────────────────────────

exports.startOrResumeGameSession = async (userId, roomCode, totalQuestions) => {
  // Look for an existing in-progress session
  const inProgressSnap = await gameProgressCol
    .where('userId', '==', userId)
    .where('roomCode', '==', roomCode)
    .where('status', '==', 'in_progress')
    .limit(1)
    .get();

  if (!inProgressSnap.empty) {
    return { session: docToObj(inProgressSnap.docs[0]), resumed: true };
  }

  // Count all previous attempts to determine attempt number
  const allSnap = await gameProgressCol
    .where('userId', '==', userId)
    .where('roomCode', '==', roomCode)
    .get();
  const attemptNumber = allSnap.docs.length + 1;

  const now = new Date().toISOString();
  const ref = await gameProgressCol.add({
    type: 'game',
    userId,
    roomCode,
    currentQuestion: 0,
    totalQuestions,
    score: 0,
    correctCount: 0,
    incorrectCount: 0,
    attemptNumber,
    status: 'in_progress',
    coinsAwarded: 0,
    createdAt: now,
    updatedAt: now,
  });
  return { session: docToObj(await ref.get()), resumed: false };
};

exports.updateGameProgress = async (sessionId, { currentQuestion, score, correctCount, incorrectCount }) => {
  const doc = await gameProgressCol.doc(sessionId).get();
  if (!doc.exists) return null;
  const patch = { updatedAt: new Date().toISOString() };
  if (currentQuestion !== undefined) patch.currentQuestion = currentQuestion;
  if (score !== undefined) patch.score = score;
  if (correctCount !== undefined) patch.correctCount = correctCount;
  if (incorrectCount !== undefined) patch.incorrectCount = incorrectCount;
  await doc.ref.update(patch);
  return docToObj(await doc.ref.get());
};

exports.completeGameSession = async (sessionId) => {
  const doc = await gameProgressCol.doc(sessionId).get();
  if (!doc.exists) return null;
  const data = docToObj(doc);
  if (data.status === 'completed') return { session: data, coins: 0 };

  const coins = COINS_ON_COMPLETE + (data.correctCount || 0) * COINS_PER_CORRECT;
  await doc.ref.update({
    status: 'completed',
    completedAt: new Date().toISOString(),
    coinsAwarded: coins,
    updatedAt: new Date().toISOString(),
  });
  return { session: docToObj(await doc.ref.get()), coins };
};

exports.getGameAttempts = async (userId, roomCode) => {
  const snap = await gameProgressCol
    .where('userId', '==', userId)
    .where('roomCode', '==', roomCode)
    .get();
  const sessions = snap.docs.map(docToObj).sort((a, b) => a.attemptNumber - b.attemptNumber);
  return sessions;
};

// ── Flashcard progress ────────────────────────────────────────────────────────

exports.startOrResumeFlashcardSession = async (userId, sessionKey, totalCards) => {
  const inProgressSnap = await gameProgressCol
    .where('userId', '==', userId)
    .where('sessionKey', '==', sessionKey)
    .where('type', '==', 'flashcard')
    .where('status', '==', 'in_progress')
    .limit(1)
    .get();

  if (!inProgressSnap.empty) {
    return { session: docToObj(inProgressSnap.docs[0]), resumed: true };
  }

  const allSnap = await gameProgressCol
    .where('userId', '==', userId)
    .where('sessionKey', '==', sessionKey)
    .where('type', '==', 'flashcard')
    .get();
  const attemptNumber = allSnap.docs.length + 1;

  const now = new Date().toISOString();
  const ref = await gameProgressCol.add({
    type: 'flashcard',
    userId,
    sessionKey,
    currentIndex: 0,
    totalCards,
    knownCount: 0,
    unknownCount: 0,
    attemptNumber,
    status: 'in_progress',
    coinsAwarded: 0,
    createdAt: now,
    updatedAt: now,
  });
  return { session: docToObj(await ref.get()), resumed: false };
};

exports.completeFlashcardSession = async (sessionId, knownCount) => {
  const doc = await gameProgressCol.doc(sessionId).get();
  if (!doc.exists) return null;
  const data = docToObj(doc);
  if (data.status === 'completed') return { session: data, coins: 0 };

  const coins = FLASHCARD_COINS_ON_COMPLETE + (knownCount || 0) * FLASHCARD_COINS_PER_KNOWN;
  await doc.ref.update({
    status: 'completed',
    knownCount: knownCount || 0,
    completedAt: new Date().toISOString(),
    coinsAwarded: coins,
    updatedAt: new Date().toISOString(),
  });
  return { session: docToObj(await doc.ref.get()), coins };
};

exports.getFlashcardAttempts = async (userId, sessionKey) => {
  const snap = await gameProgressCol
    .where('userId', '==', userId)
    .where('sessionKey', '==', sessionKey)
    .where('type', '==', 'flashcard')
    .get();
  return snap.docs.map(docToObj).sort((a, b) => a.attemptNumber - b.attemptNumber);
};
