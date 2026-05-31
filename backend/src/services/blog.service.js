const { db, COLLECTIONS, docToObj } = require('../configs/firebase.config');

const blogsCol = db.collection(COLLECTIONS.BLOGS);

exports.getBlogListService = async () => {
  const snap = await blogsCol.get();
  // Exclude 'html' field from list (mimics Mongoose .select('-html'))
  return snap.docs.map((doc) => {
    const { html, ...rest } = doc.data();
    return { _id: doc.id, id: doc.id, ...rest };
  });
};

exports.getBlogHtmlService = async (id) => {
  if (!id) return null;
  const doc = await blogsCol.doc(id).get();
  if (!doc.exists) return null;
  return doc.data().html || '';
};
