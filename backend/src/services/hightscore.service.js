const { MAX_TOP, HIGHSCORE_NAME } = require('../constant/highscore');
const { db, COLLECTIONS } = require('../configs/firebase.config');

const highscoresCol = db.collection(COLLECTIONS.HIGHSCORES);
const usersCol = db.collection(COLLECTIONS.USERS);

// ─── helpers ────────────────────────────────────────────────────────────────

async function getHighscoreByName(name) {
  const snap = await highscoresCol.where('name', '==', name).limit(1).get();
  if (snap.empty) return null;
  return { id: snap.docs[0].id, _id: snap.docs[0].id, ...snap.docs[0].data() };
}

// ─── exports ─────────────────────────────────────────────────────────────────

exports.updateTop = async (accountId, name, score) => {
  let unit = '';
  for (const key in HIGHSCORE_NAME) {
    if (HIGHSCORE_NAME[key].name === name) {
      unit = HIGHSCORE_NAME[key].unit;
      break;
    }
  }

  const tops = await getHighscoreByName(name);

  if (!tops) {
    // First entry for this game
    await highscoresCol.add({
      name,
      unit,
      top: [{ accountId, score: Number(score) }],
    });
  } else {
    let topList = [...(tops.top || [])];
    const index = topList.findIndex((i) => i.accountId === accountId);

    if (index === -1) {
      topList.push({ accountId, score: Number(score) });
    } else {
      if (Number(topList[index].score) < Number(score)) {
        topList[index].score = Number(score);
      }
    }

    // Sort ascending by score and keep only top N
    topList = topList
      .sort((a, b) => Number(a.score) - Number(b.score))
      .slice(0, MAX_TOP);

    await highscoresCol.doc(tops.id).update({ top: topList });
  }
};

exports.getLeaderboardWithName = async (name = '') => {
  const highscores = await getHighscoreByName(name);
  if (!highscores) return [];

  const { top = [] } = highscores;
  const topList = [];

  for (const entry of top) {
    const userSnap = await usersCol
      .where('accountId', '==', entry.accountId)
      .limit(1)
      .get();

    let userName = 'Anonymous';
    let avt = '';

    if (!userSnap.empty) {
      const userData = userSnap.docs[0].data();
      userName = userData.name || 'Anonymous';
      avt = userData.avt || '';
    }

    topList.push({ name: userName, avt, score: entry.score });
  }

  return topList;
};
