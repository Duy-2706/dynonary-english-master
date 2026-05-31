const { db, COLLECTIONS } = require('../configs/firebase.config');

const sentencesCol = db.collection(COLLECTIONS.SENTENCES);

// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * Apply topic filter to a Firestore query.
 * Mirrors the MongoDB addTopicsQuery helper.
 * Firestore: array-contains (single) or array-contains-any (multiple, max 10).
 */
function applyTopicFilter(query, topics = []) {
  if (!topics || topics.length === 0) return query;
  if (topics.length === 1) return query.where('topics', 'array-contains', topics[0]);
  return query.where('topics', 'array-contains-any', topics.slice(0, 10));
}

// ─── exports ─────────────────────────────────────────────────────────────────

exports.createSentence = async (sentence, mean, note, topics) => {
  const ref = await sentencesCol.add({ sentence, mean, note, topics });
  return Boolean(ref.id);
};

exports.getTotalSentences = async (topics = []) => {
  let q = applyTopicFilter(sentencesCol, topics);
  const countSnap = await q.count().get();
  return countSnap.data().count;
};

exports.getSentenceList = async (page = 1, perPage = 20, topics = []) => {
  const pageInt = parseInt(page);
  const perPageInt = parseInt(perPage);
  const skip = (pageInt - 1) * perPageInt;

  let q = applyTopicFilter(sentencesCol, topics);
  if (skip > 0) q = q.offset(skip);
  q = q.limit(perPageInt);

  const snap = await q.get();

  // Exclude isChecked and topics (mirrors .select('-_id -isChecked -topics'))
  return snap.docs.map((doc) => {
    const { isChecked, topics: _t, ...rest } = doc.data();
    return rest;
  });
};
