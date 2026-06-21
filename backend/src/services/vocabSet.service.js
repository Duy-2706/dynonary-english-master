const { db, COLLECTIONS, docToObj } = require('../configs/firebase.config');

const vocabSetsCol = db.collection(COLLECTIONS.VOCAB_SETS);
const wordsCol = db.collection(COLLECTIONS.WORDS);

// Tra từ điển, lấy phonetic + thumbnail + audio cố định
async function enrichFromDictionary(wordText) {
  if (!wordText) return {};
  try {
    const snap = await wordsCol
      .where('word', '==', wordText.toLowerCase().trim())
      .limit(1)
      .get();
    if (!snap.empty) {
      const d = snap.docs[0].data();
      return {
        phonetic: d.phonetic || d.pronounce || '',
        thumbnail: d.thumbnail || d.picture || '',
        audio: d.audio || '',
      };
    }
  } catch (_) {}
  return {};
}

async function buildWordList(rawWords) {
  return Promise.all(
    (rawWords || []).map(async (w) => {
      if (!w.word) return { word: '', type: '', phonetic: '', meaning: '', thumbnail: '', audio: '' };
      const dict = await enrichFromDictionary(w.word);
      return {
        word: w.word || '',
        type: w.type || '',
        // Ưu tiên giữ phonetic GV nhập nếu có, nếu không lấy từ từ điển
        phonetic: w.phonetic || dict.phonetic || '',
        meaning: w.meaning || '',
        // Ảnh: luôn lấy từ điển nếu có (cố định), không để GV nhập tay
        thumbnail: dict.thumbnail || w.thumbnail || '',
        audio: dict.audio || w.audio || '',
      };
    }),
  );
}


exports.getMyVocabSets = async (teacherAccountId) => {
  const snap = await vocabSetsCol.where('teacherAccountId', '==', teacherAccountId).get();
  const sets = snap.docs.map(docToObj);
  sets.sort((a, b) => {
    const ga = parseInt(a.gradeLevel) || 0;
    const gb = parseInt(b.gradeLevel) || 0;
    if (ga !== gb) return ga - gb;
    return (a.unit || '').localeCompare(b.unit || '');
  });
  return sets;
};

exports.getVocabSetById = async (id) => {
  const doc = await vocabSetsCol.doc(id).get();
  return docToObj(doc);
};

exports.getClassroomVocabSets = async (classroomId) => {
  const snap = await vocabSetsCol.where('status', '==', 'published').get();
  const all = snap.docs.map(docToObj);
  return all.filter(
    (s) => Array.isArray(s.classroomIds) && s.classroomIds.includes(classroomId),
  );
};

exports.createVocabSet = async (teacherAccountId, teacherName, data) => {
  const now = new Date().toISOString();
  const words = await buildWordList(data.words);
  const set = {
    teacherAccountId,
    teacherName,
    title: data.title || '',
    gradeLevel: data.gradeLevel || '3',
    unit: data.unit || '',
    classroomIds: Array.isArray(data.classroomIds) ? data.classroomIds : [],
    words,
    status: data.status || 'draft',
    createdAt: now,
    updatedAt: now,
  };
  const ref = await vocabSetsCol.add(set);
  return { ...set, id: ref.id, _id: ref.id };
};

exports.updateVocabSet = async (id, teacherAccountId, data) => {
  const doc = await vocabSetsCol.doc(id).get();
  if (!doc.exists) throw new Error('Không tìm thấy bộ từ');
  if (doc.data().teacherAccountId !== teacherAccountId) throw new Error('Không có quyền');

  const { teacherAccountId: _a, teacherName: _b, createdAt: _c, ...rest } = data;
  const updates = { ...rest, updatedAt: new Date().toISOString() };

  if (updates.words) {
   updates.words = await buildWordList(updates.words);
  }

  await vocabSetsCol.doc(id).update(updates);
  const updated = await vocabSetsCol.doc(id).get();
  return docToObj(updated);
};

exports.deleteVocabSet = async (id, teacherAccountId) => {
  const doc = await vocabSetsCol.doc(id).get();
  if (!doc.exists) throw new Error('Không tìm thấy bộ từ');
  if (doc.data().teacherAccountId !== teacherAccountId) throw new Error('Không có quyền');
  await vocabSetsCol.doc(id).delete();
};
