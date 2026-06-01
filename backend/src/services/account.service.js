const { ACCOUNT_TYPES, MAX } = require('../constant');
const { hashPassword } = require('../helper');
const { admin, db, COLLECTIONS, docToObj } = require('../configs/firebase.config');
const { uploadImage } = require('./common.service');

const accountsCol = db.collection(COLLECTIONS.ACCOUNTS);
const usersCol = db.collection(COLLECTIONS.USERS);

// ─── helpers ────────────────────────────────────────────────────────────────

/** Return first doc matching a field == value, or null */
async function findOneBy(collection, field, value) {
  const snap = await collection.where(field, '==', value).limit(1).get();
  if (snap.empty) return null;
  return docToObj(snap.docs[0]);
}

// ─── exports ─────────────────────────────────────────────────────────────────

exports.isExistAccount = async (email) => {
  const snap = await accountsCol
    .where('email', '==', email.toLowerCase())
    .limit(1)
    .get();
  return !snap.empty;
};

exports.findAccount = async (email) => {
  return findOneBy(accountsCol, 'email', email.toLowerCase());
};

/**
 * Create a new account document in Firestore.
 * Returns the Firestore document ID (used as accountId throughout the app).
 * Note: password hashing was previously done in the Mongoose pre-save hook;
 *       it is now handled explicitly here.
 */
exports.createAccount = async (
  email,
  password,
  authType = ACCOUNT_TYPES.LOCAL,
) => {
  const hashedPw = password ? await hashPassword(password) : '';

  const ref = await accountsCol.add({
    email: email.toLowerCase(),
    password: hashedPw,
    authType,
    createdDate: new Date(),
  });

  return ref.id; // Firestore document ID serves as accountId
};

exports.createUser = async (accountId, username, name, avt = '') => {
  const ref = await usersCol.add({
    accountId,
    name,
    username,
    avt,
    coin: 100, // DEFAULT.USER_COIN
    favoriteList: [],
    role: 'student',
  });

  return docToObj(await usersCol.doc(ref.id).get());
};

exports.isExistWordInFavorites = async (word, username) => {
  const user = await findOneBy(usersCol, 'username', username);
  if (!user) return false;
  const { favoriteList = [] } = user;
  return favoriteList.some((w) => w.toLowerCase() === word.toLowerCase());
};

exports.isLimitedFavorites = async (word, username) => {
  const user = await findOneBy(usersCol, 'username', username);
  if (!user) return false;
  const { favoriteList = [] } = user;
  return favoriteList.length >= MAX.FAVORITES_LEN;
};

exports.updateFavoriteList = async (word, username, isAdd = false) => {
  const snap = await usersCol.where('username', '==', username).limit(1).get();
  if (snap.empty) return { ok: 0, nModified: 0 };

  const docRef = snap.docs[0].ref;
  if (isAdd) {
    await docRef.update({
      favoriteList: admin.firestore.FieldValue.arrayUnion(word),
    });
  } else {
    await docRef.update({
      favoriteList: admin.firestore.FieldValue.arrayRemove(word),
    });
  }

  return { ok: 1, nModified: 1 };
};

exports.updateUserCoin = async (newCoin = 0, username = '') => {
  if (newCoin < 0 || newCoin > MAX.USER_COIN || !username || username === '') {
    return false;
  }

  const snap = await usersCol.where('username', '==', username).limit(1).get();
  if (snap.empty) return false;

  await snap.docs[0].ref.update({ coin: newCoin });
  return true;
};

exports.updatePassword = async (email = '', newPassword = '') => {
  const hashPw = await hashPassword(newPassword);

  const snap = await accountsCol
    .where('email', '==', email.toLowerCase())
    .limit(1)
    .get();
  if (snap.empty) return false;

  await snap.docs[0].ref.update({ password: hashPw });
  return true;
};

exports.updateAvt = async (username = '', avtSrc = '') => {
  const picture = await uploadImage(avtSrc, 'dynonary/user-avt');

  const snap = await usersCol.where('username', '==', username).limit(1).get();
  if (snap.empty) return false;

  await snap.docs[0].ref.update({ avt: picture });
  return picture;
};

exports.updateProfile = async (
  username = '',
  newName = '',
  newUsername = '',
) => {
  // Check username uniqueness if it's being changed
  if (username.toLowerCase() !== newUsername.toLowerCase()) {
    const exists = await findOneBy(usersCol, 'username', newUsername);
    if (exists) {
      return { status: false, message: 'username đã được sử dụng' };
    }
  }

  const snap = await usersCol.where('username', '==', username).limit(1).get();
  if (snap.empty) return false;

  await snap.docs[0].ref.update({ name: newName, username: newUsername });
  return { status: true, message: 'success' };
};

exports.getProfile = async (accountId = '') => {
  const doc = await accountsCol.doc(accountId).get();
  if (!doc.exists) return null;
  const { email, createdDate } = doc.data();
  // Convert Firestore Timestamp to Date if needed
  return {
    email,
    createdDate: createdDate?.toDate ? createdDate.toDate() : createdDate,
  };
};
