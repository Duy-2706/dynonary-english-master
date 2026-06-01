const { cloudinary } = require('../configs/cloudinary.config');
const { MAX } = require('../constant');
const { db, COLLECTIONS, docToObj } = require('../configs/firebase.config');

const verifyCodesCol = db.collection(COLLECTIONS.VERIFY_CODES);
const sentencesCol = db.collection(COLLECTIONS.SENTENCES);
const wordsCol = db.collection(COLLECTIONS.WORDS);

// ─── helpers ────────────────────────────────────────────────────────────────

function buildPackFilters(packInfo = {}) {
  const { topics, ...rest } = packInfo;
  const filters = [];

  for (const key in rest) {
    const val = rest[key];
    if (val !== '-1' && val !== undefined && val !== null && val !== '') {
      filters.push({ field: key, op: '==', value: val });
    }
  }

  let topicList = [];
  if (topics) {
    topicList = typeof topics === 'string' ? JSON.parse(topics) : topics;
  }

  return { filters, topicList };
}

function applyFilters(colRef, filters) {
  let q = colRef;
  for (const { field, op, value } of filters) {
    q = q.where(field, op, value);
  }
  return q;
}

function applyTopicFilter(q, topicList) {
  if (topicList.length === 0) return q;
  if (topicList.length === 1) return q.where('topics', 'array-contains', topicList[0]);
  return q.where('topics', 'array-contains-any', topicList.slice(0, 30));
}

function pickFields(obj, select = '') {
  if (!select) return obj;

  const parts = select.split(/\s+/).filter(Boolean);
  const excluded = parts
    .filter((f) => f.startsWith('-'))
    .map((f) => f.slice(1))
    .filter((f) => f !== '_id');
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

// ─── exports ─────────────────────────────────────────────────────────────────

exports.uploadImage = async (imgSrc, folderName = '', config = {}) => {
  try {
    const result = await cloudinary.uploader.upload(imgSrc, {
      folder: folderName,
      ...config,
    });
    const { secure_url = null } = result;
    return secure_url;
  } catch (error) {
    throw error;
  }
};

exports.isExistWord = async (word = '', type = '') => {
  if (word === '' || type === '') return false;

  const snap = await wordsCol
    .where('word', '==', word.toLowerCase())
    .where('type', '==', type)
    .limit(1)
    .get();

  return !snap.empty;
};

exports.isExistSentence = async (sentence = '') => {
  if (sentence === '') return false;

  const snap = await sentencesCol
    .where('sentence', '==', sentence)
    .limit(1)
    .get();

  return !snap.empty;
};

exports.getWordPack = async (
  packInfo = {},
  skip = 0,
  limit = 500,
  select = '',
  sortType = null,
  expandQuery = null,
) => {
  const { filters, topicList } = buildPackFilters(packInfo);

  if (expandQuery && typeof expandQuery === 'object') {
    for (const key in expandQuery) {
      filters.push({ field: key, op: '==', value: expandQuery[key] });
    }
  }

  let q = applyFilters(wordsCol, filters);

  // Topic filter — covers both string ('1') and number (1) storage formats
  q = applyTopicFilter(q, topicList);

  if (sortType !== null && sortType !== undefined) {
    q = q.orderBy('word', sortType === -1 ? 'desc' : 'asc');
  }

  if (skip > 0) q = q.offset(skip);
  q = q.limit(limit);

  const snap = await q.get();
  return snap.docs.map((doc) => pickFields(docToObj(doc), select));
};

exports.countWordPack = async (packInfo = {}) => {
  const { filters, topicList } = buildPackFilters(packInfo);
  let q = applyFilters(wordsCol, filters);

  q = applyTopicFilter(q, topicList);

  const countSnap = await q.count().get();
  return countSnap.data().count;
};

exports.saveVerifyCode = async (code = '', email = '') => {
  const existing = await verifyCodesCol
    .where('email', '==', email.toLowerCase())
    .get();

  if (!existing.empty) {
    const batch = db.batch();
    existing.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }

  const ref = await verifyCodesCol.add({
    code,
    email: email.toLowerCase(),
    createdDate: new Date(),
  });

  return docToObj(await verifyCodesCol.doc(ref.id).get());
};

exports.checkVerifyCode = async (code = '', email = '') => {
  const snap = await verifyCodesCol
    .where('email', '==', email.toLowerCase())
    .where('code', '==', code)
    .limit(1)
    .get();

  if (snap.empty) {
    return { status: false, message: 'Hãy gửi mã để nhận mã xác thực.' };
  }

  const item = snap.docs[0].data();

  const createdDate = item.createdDate?.toDate
    ? item.createdDate.toDate().getTime()
    : new Date(item.createdDate).getTime();

  if (Date.now() - createdDate > MAX.VERIFY_TIME) {
    return {
      status: false,
      message: 'Mã xác thực đã hết hiệu lực. Hãy lấy một mã khác',
    };
  }

  return { status: true, message: 'valid' };
};

exports.removeVerifyCode = async (email = '') => {
  const snap = await verifyCodesCol
    .where('email', '==', email.toLowerCase())
    .get();

  if (snap.empty) return;

  const batch = db.batch();
  snap.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
};