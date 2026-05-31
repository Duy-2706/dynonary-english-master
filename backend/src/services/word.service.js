const { db, COLLECTIONS, docToObj } = require('../configs/firebase.config');

const wordsCol = db.collection(COLLECTIONS.WORDS);

// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * Pick / omit keys from an object (mimics Mongoose .select()).
 * Supports '+field' (include) and '-field' (exclude) notation.
 * Note: '-_id' is ignored since Firestore uses `id`; `_id` is already aliased.
 */
function pickFields(obj, select = '') {
  if (!select) return obj;

  const parts = select.split(/\s+/).filter(Boolean);
  const excluded = parts
    .filter((f) => f.startsWith('-'))
    .map((f) => f.slice(1))
    .filter((f) => f !== '_id'); // _id is handled via docToObj alias
  const included = parts.filter((f) => !f.startsWith('-'));

  if (included.length > 0) {
    return included.reduce((acc, key) => {
      if (key in obj) acc[key] = obj[key];
      return acc;
    }, {});
  } else {
    return Object.keys(obj).reduce((acc, key) => {
      if (!excluded.includes(key)) acc[key] = obj[key];
      return acc;
    }, {});
  }
}

function wordPrefixQuery(baseQuery, word) {
  const lower = word.toLowerCase();
  return baseQuery
    .where('word', '>=', lower)
    .where('word', '<=', lower + '');
}

// ─── exports ─────────────────────────────────────────────────────────────────

exports.createNewWord = async (wordInfo) => {
  // Normalize word to lowercase for consistent search
  const normalized = {
    ...wordInfo,
    word: (wordInfo.word || '').toLowerCase(),
  };

  const ref = await wordsCol.add(normalized);
  return Boolean(ref.id);
};

exports.searchWord = async (word = '', limit = 20, select = '') => {
  const snap = await wordPrefixQuery(wordsCol, word).limit(limit).get();

  return snap.docs.map((doc) => pickFields(docToObj(doc), select));
};

exports.getWordDetail = async (word = '') => {
  const snap = await wordsCol
    .where('word', '==', word.toLowerCase())
    .limit(1)
    .get();

  if (snap.empty) return null;
  return docToObj(snap.docs[0]);
};

exports.getFavoriteList = async (rawFavorites = []) => {
  if (!Array.isArray(rawFavorites) || rawFavorites.length === 0) {
    return [];
  }

  const list = [];
  for (const word of rawFavorites) {
    const snap = await wordPrefixQuery(wordsCol, word).limit(1).get();

    if (!snap.empty) {
      list.push(
        pickFields(
          docToObj(snap.docs[0]),
          '-_id type word mean phonetic picture',
        ),
      );
    }
  }

  return list;
};
