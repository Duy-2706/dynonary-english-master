const { db, COLLECTIONS, docToObj } = require('../configs/firebase.config');

const usersCol = db.collection(COLLECTIONS.USERS);

exports.getUsers = async (page = 1, limit = 20, search = '') => {
  const snap = await usersCol.orderBy('name').get();
  let users = snap.docs.map(docToObj);

  if (search) {
    const lower = search.toLowerCase();
    users = users.filter(
      (u) =>
        (u.name || '').toLowerCase().includes(lower) ||
        (u.username || '').toLowerCase().includes(lower),
    );
  }

  const total = users.length;
  const start = (page - 1) * limit;
  const paginated = users.slice(start, start + limit);

  return { users: paginated, total, page: Number(page), totalPages: Math.ceil(total / limit) };
};

exports.updateUserRole = async (userId, newRole, adminAccountId) => {
  const ALLOWED_ROLES = ['student', 'teacher', 'admin'];
  if (!ALLOWED_ROLES.includes(newRole)) throw new Error('Quyền không hợp lệ');

  const doc = await usersCol.doc(userId).get();
  if (!doc.exists) throw new Error('Người dùng không tồn tại');
  if (doc.data().accountId === adminAccountId) throw new Error('Không thể thay đổi quyền của chính mình');

  await doc.ref.update({ role: newRole, updatedAt: new Date().toISOString() });
  return docToObj(await usersCol.doc(userId).get());
};

exports.getSystemStats = async () => {
  const [usersSnap, wordsSnap, coursesSnap, grammarSnap] = await Promise.all([
    usersCol.get(),
    db.collection(COLLECTIONS.WORDS).get(),
    db.collection(COLLECTIONS.COURSES).get(),
    db.collection(COLLECTIONS.GRAMMAR_LESSONS).get(),
  ]);

  const userDocs = usersSnap.docs.map((d) => d.data());

  return {
    totalUsers: userDocs.length,
    totalTeachers: userDocs.filter((u) => u.role === 'teacher').length,
    totalStudents: userDocs.filter((u) => u.role === 'student').length,
    totalAdmins: userDocs.filter((u) => u.role === 'admin').length,
    totalWords: wordsSnap.size,
    totalCourses: coursesSnap.size,
    totalGrammarLessons: grammarSnap.size,
  };
};
