const { db, COLLECTIONS, docToObj } = require('../configs/firebase.config');
const { hashPassword, generateTeacherEmail, generateStudentEmail, generateStudentPassword, normalizeVN } = require('../helper');

const usersCol = db.collection(COLLECTIONS.USERS);
const accountsCol = db.collection(COLLECTIONS.ACCOUNTS);
const classroomsCol = db.collection(COLLECTIONS.CLASSROOMS);

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Ensure email is unique; append numeric suffix if taken */
async function uniqueEmail(baseEmail) {
  const [local, domain] = baseEmail.split('@');
  let email = baseEmail;
  let counter = 2;
  while (true) {
    const snap = await accountsCol.where('email', '==', email).limit(1).get();
    if (snap.empty) return email;
    email = `${local}${counter}@${domain}`;
    counter++;
  }
}

async function makeAccountAndUser(email, password, name, role, extraUserFields = {}) {
  const hashedPw = await hashPassword(password);
  const accountRef = await accountsCol.add({
    email: email.toLowerCase(),
    password: hashedPw,
    authType: 'local',
    isVerified: true,
    createdDate: new Date(),
  });
  const accountId = accountRef.id;
  const username = normalizeVN(name.split(/\s+/).pop()) + accountId.slice(-5);
  await usersCol.add({
    accountId,
    name,
    username,
    avt: '',
    coin: 100,
    favoriteList: [],
    role,
    ...extraUserFields,
  });
  return { accountId, email, password, username };
}

// ─── Admin account creation ────────────────────────────────────────────────


exports.updateTeacher = async (userId, { name, subject }) => {
  const doc = await usersCol.doc(userId).get();
  if (!doc.exists) throw new Error('Người dùng không tồn tại');
  if (doc.data().role !== 'teacher') throw new Error('Người dùng không phải giáo viên');
  await doc.ref.update({ name: name || doc.data().name, subject: subject || '', updatedAt: new Date().toISOString() });
  return docToObj(await usersCol.doc(userId).get());
};

exports.deleteTeacher = async (userId, adminAccountId) => {
  const doc = await usersCol.doc(userId).get();
  if (!doc.exists) throw new Error('Người dùng không tồn tại');
  if (doc.data().role !== 'teacher') throw new Error('Người dùng không phải giáo viên');
  if (doc.data().accountId === adminAccountId) throw new Error('Không thể xóa tài khoản của chính mình');
  const accountId = doc.data().accountId;
  await doc.ref.delete();
  if (accountId) {
    try { await accountsCol.doc(accountId).delete(); } catch (_) {}
  }
};

exports.adminCreateTeachers = async (teachers = []) => {
  const results = [];
  const defaultPw = '12345678a';
  for (const t of teachers) {
    const base = generateTeacherEmail(t.name);
    const email = await uniqueEmail(base);
    const created = await makeAccountAndUser(email, defaultPw, t.name, 'teacher', {
      subject: t.subject || '',
    });
    results.push({ name: t.name, email: created.email, password: defaultPw, username: created.username });
  }
  return results;
};

/**
 * Create student accounts and assign to a classroom.
 * @param {Array<{name:string, dob:string}>} students  dob format "dd/mm/yyyy"
 * @param {string} classroomId  Firestore doc id of the classroom
 * @param {string} classroomName  Display name e.g. "10A1"
 */
exports.adminCreateStudents = async (students = [], classroomId = '', classroomName = '') => {
  const results = [];
  for (const s of students) {
    const base = (s.email && s.email.trim()) ? s.email.trim().toLowerCase() : generateStudentEmail(s.name, s.dob);
    const email = await uniqueEmail(base);
    const password = (s.password && s.password.trim()) ? s.password.trim() : generateStudentPassword();
    const created = await makeAccountAndUser(email, password, s.name, 'student', {
      classroomId,
      classroomName,
      dob: s.dob,
    });
    results.push({ name: s.name, dob: s.dob, email: created.email, password, username: created.username, classroomName });

    // Add student to classroom's students array
    if (classroomId) {
      try {
        const { admin } = require('../configs/firebase.config');
        await classroomsCol.doc(classroomId).update({
          students: admin.firestore.FieldValue.arrayUnion({
            accountId: created.accountId,
            username: created.username,
            name: s.name,
            joinedAt: new Date().toISOString(),
          }),
        });
      } catch {}
    }
  }
  return results;
};

// ─── Classroom management ─────────────────────────────────────────────────

exports.getAdminClassrooms = async () => {
  const snap = await classroomsCol.orderBy('name').get();
  return snap.docs.map(docToObj);
};

exports.adminCreateClassroom = async ({ name, grade, teacherAccountId = '', teacherName = '' }) => {
  const now = new Date().toISOString();
  const ref = await classroomsCol.add({
    name,
    grade: grade || '',
    teacherAccountId,
    teacherName,
    students: [],
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });
  return docToObj(await classroomsCol.doc(ref.id).get());
};

exports.getUsers = async (page = 1, limit = 20, search = '') => {
  const snap = await usersCol.orderBy('name').get();
  let users = snap.docs.map(docToObj);

    // Join with accounts collection to get email
  users = await Promise.all(
    users.map(async (user) => {
      if (!user.accountId) return { ...user, email: '' };
      try {
        const accountDoc = await accountsCol.doc(user.accountId).get();
        const email = accountDoc.exists ? (accountDoc.data().email || '') : '';
        return { ...user, email };
      } catch {
        return { ...user, email: '' };
      }
    }),
  );


  if (search) {
    const lower = search.toLowerCase();
    users = users.filter(
      (u) =>
        (u.name || '').toLowerCase().includes(lower) ||
        (u.username || '').toLowerCase().includes(lower) ||
        (u.email || '').toLowerCase().includes(lower),
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
  const [usersSnap, wordsSnap, coursesSnap, grammarSnap, gameRoomsSnap] = await Promise.all([
    usersCol.get(),
    db.collection(COLLECTIONS.WORDS).get(),
    db.collection(COLLECTIONS.COURSES).get(),
    db.collection(COLLECTIONS.GRAMMAR_LESSONS).get(),
    db.collection('gameRooms').get(),
  ]);

  const userDocs = usersSnap.docs.map((d) => d.data());
  const courseDocs = coursesSnap.docs.map((d) => d.data());

  const coursesByStatus = courseDocs.reduce((acc, c) => {
    const status = c.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return {
    totalUsers: userDocs.length,
    totalTeachers: userDocs.filter((u) => u.role === 'teacher').length,
    totalStudents: userDocs.filter((u) => u.role === 'student').length,
    totalAdmins: userDocs.filter((u) => u.role === 'admin').length,
    totalWords: wordsSnap.size,
    totalCourses: coursesSnap.size,
    coursesByStatus,
    totalGrammarLessons: grammarSnap.size,
    totalGameRooms: gameRoomsSnap.size,
  };
};

exports.lockUser = async (userId, adminAccountId) => {
  const doc = await usersCol.doc(userId).get();
  if (!doc.exists) throw new Error('Người dùng không tồn tại');
  if (doc.data().accountId === adminAccountId) throw new Error('Không thể khóa tài khoản của chính mình');

  await doc.ref.update({ isLocked: true, lockedAt: new Date().toISOString() });
};

exports.unlockUser = async (userId, adminAccountId) => {
  const doc = await usersCol.doc(userId).get();
  if (!doc.exists) throw new Error('Người dùng không tồn tại');
  if (doc.data().accountId === adminAccountId) throw new Error('Không thể mở khóa tài khoản của chính mình');

  await doc.ref.update({ isLocked: false, lockedAt: null });
};

const GRAMMAR_TENSES = [
  {
    title: 'Thì Hiện Tại Đơn (Simple Present)',
    description: 'Diễn tả hành động thường xuyên, thói quen và sự thật hiển nhiên.',
    content: '<h2>Thì Hiện Tại Đơn</h2><div class="rule-box"><strong>Cấu trúc:</strong><br/>• Khẳng định: S + V(s/es)<br/>• Phủ định: S + do/does + not + V<br/>• Nghi vấn: Do/Does + S + V?</div><h3>Cách dùng</h3><ul><li>Thói quen, hành động lặp đi lặp lại: <em class="example">I go to school every day.</em></li><li>Sự thật hiển nhiên: <em class="example">The sun rises in the east.</em></li><li>Lịch trình cố định: <em class="example">The train leaves at 8 AM.</em></li></ul><h3>Dấu hiệu nhận biết</h3><div class="warning-box">always, usually, often, sometimes, rarely, never, every day/week/month/year</div>',
    exercises: [
      { question: 'She ___ to school every day.', type: 'mcq', options: ['go', 'goes', 'going', 'went'], answer: 'goes', explanation: 'She (ngôi 3 số ít) dùng goes.' },
      { question: 'They ___ not like coffee.', type: 'mcq', options: ['do', 'does', 'did', 'are'], answer: 'do', explanation: 'They (số nhiều) dùng do not.' },
      { question: 'The sun ___ in the east.', type: 'fill', answer: 'rises', explanation: 'Sự thật hiển nhiên dùng thì hiện tại đơn: rises.' },
      { question: '___ he speak English?', type: 'mcq', options: ['Do', 'Does', 'Is', 'Are'], answer: 'Does', explanation: 'He (ngôi 3 số ít) dùng Does.' },
    ],
  },
  {
    title: 'Thì Hiện Tại Tiếp Diễn (Present Continuous)',
    description: 'Diễn tả hành động đang xảy ra tại thời điểm nói hoặc xung quanh thời điểm nói.',
    content: '<h2>Thì Hiện Tại Tiếp Diễn</h2><div class="rule-box"><strong>Cấu trúc:</strong><br/>• Khẳng định: S + am/is/are + V-ing<br/>• Phủ định: S + am/is/are + not + V-ing<br/>• Nghi vấn: Am/Is/Are + S + V-ing?</div><h3>Cách dùng</h3><ul><li>Hành động đang xảy ra: <em class="example">She is reading a book now.</em></li><li>Kế hoạch tương lai: <em class="example">We are meeting tomorrow.</em></li><li>Xu hướng hiện tại: <em class="example">Prices are rising.</em></li></ul><h3>Dấu hiệu nhận biết</h3><div class="warning-box">now, at the moment, at present, currently, right now, look!, listen!</div>',
    exercises: [
      { question: 'She ___ (read) a book right now.', type: 'mcq', options: ['is reading', 'reads', 'read', 'was reading'], answer: 'is reading', explanation: 'Right now → hiện tại tiếp diễn: is reading.' },
      { question: 'They ___ (play) football at the moment.', type: 'fill', answer: 'are playing', explanation: 'They + are + V-ing = are playing.' },
      { question: '___ you listening to me?', type: 'mcq', options: ['Am', 'Is', 'Are', 'Do'], answer: 'Are', explanation: 'You → Are + V-ing.' },
    ],
  },
  {
    title: 'Thì Hiện Tại Hoàn Thành (Present Perfect)',
    description: 'Diễn tả hành động đã xảy ra và có liên quan đến hiện tại.',
    content: '<h2>Thì Hiện Tại Hoàn Thành</h2><div class="rule-box"><strong>Cấu trúc:</strong><br/>• Khẳng định: S + have/has + V3/ed<br/>• Phủ định: S + have/has + not + V3/ed<br/>• Nghi vấn: Have/Has + S + V3/ed?</div><h3>Cách dùng</h3><ul><li>Kinh nghiệm: <em class="example">I have visited Paris three times.</em></li><li>Hành động vừa xong: <em class="example">She has just finished her homework.</em></li><li>Kéo dài đến hiện tại: <em class="example">We have lived here for 10 years.</em></li></ul><h3>Dấu hiệu nhận biết</h3><div class="warning-box">just, already, yet, ever, never, recently, lately, since, for, so far</div>',
    exercises: [
      { question: 'She ___ (finish) her homework already.', type: 'mcq', options: ['has finished', 'have finished', 'finished', 'is finishing'], answer: 'has finished', explanation: 'She (ngôi 3 số ít) → has + finished.' },
      { question: 'I ___ never ___ sushi before.', type: 'mcq', options: ['have / eaten', 'has / eat', 'had / ate', 'am / eating'], answer: 'have / eaten', explanation: 'I → have + never + eaten (V3).' },
      { question: 'They ___ here for 5 years.', type: 'fill', answer: 'have lived', explanation: 'For + khoảng thời gian → have lived.' },
    ],
  },
  {
    title: 'Thì Hiện Tại Hoàn Thành Tiếp Diễn (Present Perfect Continuous)',
    description: 'Diễn tả hành động đã bắt đầu trong quá khứ và vẫn đang tiếp diễn.',
    content: '<h2>Thì Hiện Tại Hoàn Thành Tiếp Diễn</h2><div class="rule-box"><strong>Cấu trúc:</strong><br/>• Khẳng định: S + have/has + been + V-ing<br/>• Phủ định: S + have/has + not + been + V-ing<br/>• Nghi vấn: Have/Has + S + been + V-ing?</div><h3>Cách dùng</h3><ul><li>Nhấn mạnh tính liên tục: <em class="example">I have been studying for 3 hours.</em></li><li>Hành động gần đây gây ra kết quả: <em class="example">He is tired because he has been working all day.</em></li></ul><h3>Dấu hiệu nhận biết</h3><div class="warning-box">for, since, all day/morning/week, lately, recently</div>',
    exercises: [
      { question: 'She ___ (study) English for 2 years.', type: 'mcq', options: ['has been studying', 'have been studying', 'is studying', 'has studied'], answer: 'has been studying', explanation: 'She + has been + V-ing nhấn mạnh sự liên tục.' },
      { question: 'They ___ (wait) for an hour.', type: 'fill', answer: 'have been waiting', explanation: 'They + have been + waiting.' },
    ],
  },
  {
    title: 'Thì Quá Khứ Đơn (Simple Past)',
    description: 'Diễn tả hành động đã xảy ra và kết thúc hoàn toàn trong quá khứ.',
    content: '<h2>Thì Quá Khứ Đơn</h2><div class="rule-box"><strong>Cấu trúc:</strong><br/>• Khẳng định: S + V2/ed<br/>• Phủ định: S + did + not + V<br/>• Nghi vấn: Did + S + V?</div><h3>Cách dùng</h3><ul><li>Hành động đã hoàn thành: <em class="example">She visited Paris last year.</em></li><li>Chuỗi hành động quá khứ: <em class="example">He came, saw, and conquered.</em></li></ul><h3>Động từ bất quy tắc thông dụng</h3><table><tr><th>Nguyên mẫu</th><th>Quá khứ</th><th>Nghĩa</th></tr><tr><td>go</td><td>went</td><td>đi</td></tr><tr><td>see</td><td>saw</td><td>thấy</td></tr><tr><td>eat</td><td>ate</td><td>ăn</td></tr><tr><td>come</td><td>came</td><td>đến</td></tr></table><h3>Dấu hiệu nhận biết</h3><div class="warning-box">yesterday, last week/month/year, ago, in 2020, when I was young</div>',
    exercises: [
      { question: 'She ___ (go) to Paris last year.', type: 'mcq', options: ['went', 'goes', 'has gone', 'go'], answer: 'went', explanation: 'Last year → quá khứ đơn: went (V2 bất quy tắc).' },
      { question: '___ you study English yesterday?', type: 'mcq', options: ['Did', 'Do', 'Does', 'Have'], answer: 'Did', explanation: 'Câu nghi vấn quá khứ đơn dùng Did.' },
      { question: 'I ___ a letter to her last week.', type: 'fill', answer: 'wrote', explanation: 'Write → wrote (V2 bất quy tắc).' },
    ],
  },
  {
    title: 'Thì Quá Khứ Tiếp Diễn (Past Continuous)',
    description: 'Diễn tả hành động đang xảy ra tại một thời điểm trong quá khứ.',
    content: '<h2>Thì Quá Khứ Tiếp Diễn</h2><div class="rule-box"><strong>Cấu trúc:</strong><br/>• Khẳng định: S + was/were + V-ing<br/>• Phủ định: S + was/were + not + V-ing<br/>• Nghi vấn: Was/Were + S + V-ing?</div><h3>Cách dùng</h3><ul><li>Hành động đang diễn ra khi có hành động khác xen vào: <em class="example">She was sleeping when the phone rang.</em></li><li>Hai hành động cùng xảy ra: <em class="example">While he was cooking, she was reading.</em></li></ul><h3>Dấu hiệu nhận biết</h3><div class="warning-box">while, when, at 8 PM yesterday, at that time</div>',
    exercises: [
      { question: 'She ___ (sleep) when the phone rang.', type: 'mcq', options: ['was sleeping', 'is sleeping', 'slept', 'were sleeping'], answer: 'was sleeping', explanation: 'She + was + V-ing (hành động đang diễn ra).' },
      { question: 'While I ___ TV, she called.', type: 'fill', answer: 'was watching', explanation: 'While + quá khứ tiếp diễn: was watching.' },
    ],
  },
  {
    title: 'Thì Quá Khứ Hoàn Thành (Past Perfect)',
    description: 'Diễn tả hành động đã hoàn thành trước một hành động khác trong quá khứ.',
    content: '<h2>Thì Quá Khứ Hoàn Thành</h2><div class="rule-box"><strong>Cấu trúc:</strong><br/>• Khẳng định: S + had + V3/ed<br/>• Phủ định: S + had + not + V3/ed<br/>• Nghi vấn: Had + S + V3/ed?</div><h3>Cách dùng</h3><ul><li>Hành động xảy ra TRƯỚC một hành động quá khứ khác: <em class="example">She had left before he arrived.</em></li><li>Điều kiện loại 3: <em class="example">If I had studied harder, I would have passed.</em></li></ul><h3>Dấu hiệu nhận biết</h3><div class="warning-box">before, after, by the time, already, just, when (khi đã)</div>',
    exercises: [
      { question: 'She ___ (leave) before he arrived.', type: 'mcq', options: ['had left', 'has left', 'left', 'was leaving'], answer: 'had left', explanation: 'Hành động xảy ra trước → had + left (V3).' },
      { question: 'By 8 PM, they ___ dinner.', type: 'fill', answer: 'had finished', explanation: 'By + mốc thời gian → had + V3.' },
    ],
  },
  {
    title: 'Thì Tương Lai Đơn (Simple Future)',
    description: 'Diễn tả hành động sẽ xảy ra trong tương lai.',
    content: '<h2>Thì Tương Lai Đơn</h2><div class="rule-box"><strong>Cấu trúc (will):</strong><br/>• Khẳng định: S + will + V<br/>• Phủ định: S + will + not (won\'t) + V<br/>• Nghi vấn: Will + S + V?</div><div class="rule-box"><strong>Cấu trúc (be going to):</strong><br/>• S + am/is/are + going to + V</div><h3>Cách dùng</h3><ul><li>Will: quyết định tức thời, dự đoán không có bằng chứng: <em class="example">I will help you.</em></li><li>Be going to: kế hoạch đã định, dự đoán có bằng chứng: <em class="example">It\'s going to rain (dark clouds).</em></li></ul><h3>Dấu hiệu nhận biết</h3><div class="warning-box">tomorrow, next week/month/year, soon, in the future, tonight</div>',
    exercises: [
      { question: 'I ___ help you with that.', type: 'mcq', options: ['will', 'am going to', 'would', 'shall'], answer: 'will', explanation: 'Quyết định tức thời → will.' },
      { question: 'Look at those clouds! It ___ rain.', type: 'mcq', options: ['is going to', 'will', 'shall', 'would'], answer: 'is going to', explanation: 'Có bằng chứng → be going to.' },
      { question: 'She ___ visit us next week.', type: 'fill', answer: 'will', explanation: 'Tương lai đơn: will + V.' },
    ],
  },
  {
    title: 'Thì Tương Lai Tiếp Diễn (Future Continuous)',
    description: 'Diễn tả hành động đang xảy ra tại một thời điểm trong tương lai.',
    content: '<h2>Thì Tương Lai Tiếp Diễn</h2><div class="rule-box"><strong>Cấu trúc:</strong><br/>• Khẳng định: S + will + be + V-ing<br/>• Phủ định: S + will + not + be + V-ing<br/>• Nghi vấn: Will + S + be + V-ing?</div><h3>Cách dùng</h3><ul><li>Hành động đang diễn ra tại thời điểm cụ thể trong tương lai: <em class="example">At 8 PM tomorrow, I will be studying.</em></li><li>Hành động dự kiến sẽ xảy ra: <em class="example">She will be working late tonight.</em></li></ul>',
    exercises: [
      { question: 'At 9 PM, she ___ (study).', type: 'mcq', options: ['will be studying', 'will study', 'is studying', 'will have studied'], answer: 'will be studying', explanation: 'Tại thời điểm cụ thể trong tương lai → will be + V-ing.' },
      { question: 'This time next week, we ___ on the beach.', type: 'fill', answer: 'will be lying', explanation: 'Will be + V-ing.' },
    ],
  },
  {
    title: 'Thì Tương Lai Hoàn Thành (Future Perfect)',
    description: 'Diễn tả hành động sẽ hoàn thành trước một thời điểm trong tương lai.',
    content: '<h2>Thì Tương Lai Hoàn Thành</h2><div class="rule-box"><strong>Cấu trúc:</strong><br/>• Khẳng định: S + will + have + V3/ed<br/>• Phủ định: S + will + not + have + V3/ed<br/>• Nghi vấn: Will + S + have + V3/ed?</div><h3>Cách dùng</h3><ul><li>Hành động hoàn thành trước một mốc thời gian tương lai: <em class="example">By 2030, scientists will have found a cure.</em></li></ul><h3>Dấu hiệu nhận biết</h3><div class="warning-box">by then, by + thời gian tương lai, before + tương lai</div>',
    exercises: [
      { question: 'By next year, she ___ her degree.', type: 'mcq', options: ['will have completed', 'will complete', 'has completed', 'will be completing'], answer: 'will have completed', explanation: 'By + tương lai → will have + V3.' },
      { question: 'They ___ the project by Friday.', type: 'fill', answer: 'will have finished', explanation: 'Will have + finished (V3).' },
    ],
  },
  {
    title: 'Thì Quá Khứ Hoàn Thành Tiếp Diễn (Past Perfect Continuous)',
    description: 'Diễn tả hành động đã diễn ra liên tục trước một thời điểm trong quá khứ.',
    content: '<h2>Thì Quá Khứ Hoàn Thành Tiếp Diễn</h2><div class="rule-box"><strong>Cấu trúc:</strong><br/>• Khẳng định: S + had + been + V-ing<br/>• Phủ định: S + had + not + been + V-ing<br/>• Nghi vấn: Had + S + been + V-ing?</div><h3>Cách dùng</h3><ul><li>Nhấn mạnh thời gian diễn ra liên tục trước một hành động quá khứ: <em class="example">She had been studying for 3 hours before she fell asleep.</em></li></ul>',
    exercises: [
      { question: 'She ___ (work) for 5 hours before she took a break.', type: 'mcq', options: ['had been working', 'was working', 'had worked', 'has been working'], answer: 'had been working', explanation: 'Nhấn mạnh tính liên tục trước thời điểm quá khứ → had been + V-ing.' },
      { question: 'He ___ for the bus for an hour when it finally came.', type: 'fill', answer: 'had been waiting', explanation: 'Had been + waiting (V-ing).' },
    ],
  },
  {
    title: 'Thì Tương Lai Hoàn Thành Tiếp Diễn (Future Perfect Continuous)',
    description: 'Diễn tả hành động sẽ diễn ra liên tục cho đến trước một thời điểm trong tương lai.',
    content: '<h2>Thì Tương Lai Hoàn Thành Tiếp Diễn</h2><div class="rule-box"><strong>Cấu trúc:</strong><br/>• Khẳng định: S + will + have + been + V-ing<br/>• Phủ định: S + will + not + have + been + V-ing<br/>• Nghi vấn: Will + S + have + been + V-ing?</div><h3>Cách dùng</h3><ul><li>Hành động sẽ diễn ra liên tục cho đến một thời điểm trong tương lai: <em class="example">By 2025, I will have been teaching for 10 years.</em></li></ul><h3>Dấu hiệu nhận biết</h3><div class="warning-box">by + thời gian tương lai + for + khoảng thời gian</div>',
    exercises: [
      { question: 'By next month, she ___ here for a year.', type: 'mcq', options: ['will have been working', 'will work', 'has been working', 'will have worked'], answer: 'will have been working', explanation: 'By + tương lai + for → will have been + V-ing.' },
      { question: 'In July, we ___ together for 10 years.', type: 'fill', answer: 'will have been living', explanation: 'Will have been + V-ing.' },
    ],
  },
];

exports.getCourseStats = async () => {
  const { admin } = require('../configs/firebase.config');
  const [coursesSnap, enrollmentsSnap] = await Promise.all([
    db.collection(COLLECTIONS.COURSES).get(),
    db.collection(COLLECTIONS.ENROLLMENTS).get(),
  ]);

  const courses = coursesSnap.docs.map(docToObj);
  const enrollments = enrollmentsSnap.docs.map((d) => d.data());

  const enrollCountMap = {};
  const completedCountMap = {};
  enrollments.forEach((e) => {
    const cid = e.courseId;
    if (!cid) return;
    enrollCountMap[cid] = (enrollCountMap[cid] || 0) + 1;
    if (e.status === 'completed') completedCountMap[cid] = (completedCountMap[cid] || 0) + 1;
  });

  const totalEnrollments = enrollments.length;
  const totalCompleted = enrollments.filter((e) => e.status === 'completed').length;
  const completionRate = totalEnrollments > 0 ? Math.round((totalCompleted / totalEnrollments) * 100) : 0;

  const topCourses = courses
    .map((c) => ({
      id: c.id,
      title: c.title || 'Không tên',
      status: c.status || 'draft',
      enrollments: enrollCountMap[c.id] || 0,
      completed: completedCountMap[c.id] || 0,
      viewCount: c.viewCount || 0,
    }))
    .sort((a, b) => b.enrollments - a.enrollments)
    .slice(0, 10);

  // Enrollments by month — last 6 months
  const monthMap = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthMap[key] = 0;
  }
  enrollments.forEach((e) => {
    const at = e.enrolledAt || e.createdAt;
    if (!at) return;
    const d = new Date(at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (monthMap[key] !== undefined) monthMap[key]++;
  });

  return {
    totalCourses: courses.length,
    publishedCourses: courses.filter((c) => c.status === 'published').length,
    totalEnrollments,
    totalCompleted,
    completionRate,
    topCourses,
    enrollmentsByMonth: Object.entries(monthMap).map(([month, count]) => ({ month, count })),
  };
};

exports.getGameStats = async () => {
  const highscoresSnap = await db.collection(COLLECTIONS.HIGHSCORES).get();
  const highscores = highscoresSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  let totalPlayers = 0;
  const gameBreakdown = [];

  highscores.forEach((hs) => {
    const top = hs.top || [];
    const playerCount = top.length;
    const avgScore = playerCount > 0
      ? Math.round(top.reduce((s, t) => s + (t.score || 0), 0) / playerCount)
      : 0;
    const maxScore = playerCount > 0 ? Math.max(...top.map((t) => t.score || 0)) : 0;
    totalPlayers += playerCount;
    gameBreakdown.push({ gameName: hs.name, unit: hs.unit || '', playerCount, avgScore, maxScore });
  });
  gameBreakdown.sort((a, b) => b.playerCount - a.playerCount);

  // Top players across all games (max score per accountId)
  const playerMap = {};
  highscores.forEach((hs) => {
    (hs.top || []).forEach((entry) => {
      const prev = playerMap[entry.accountId];
      if (!prev || prev.score < entry.score) {
        playerMap[entry.accountId] = { accountId: entry.accountId, score: entry.score, gameName: hs.name };
      }
    });
  });

  const topPlayers = Object.values(playerMap)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const usersCol = db.collection(COLLECTIONS.USERS);
  for (const p of topPlayers) {
    const snap = await usersCol.where('accountId', '==', p.accountId).limit(1).get();
    if (!snap.empty) {
      p.username = snap.docs[0].data().name || 'Ẩn danh';
      p.avt = snap.docs[0].data().avt || '';
    } else {
      p.username = 'Ẩn danh';
    }
  }

  return {
    totalGames: highscores.length,
    totalPlayers,
    gameBreakdown,
    topPlayers,
  };
};

exports.trackCourseView = async (courseId) => {
  try {
    const { admin } = require('../configs/firebase.config');
    const FieldValue = admin.firestore.FieldValue;
    await db.collection(COLLECTIONS.COURSES).doc(courseId).update({
      viewCount: FieldValue.increment(1),
    });
  } catch (_) {}
};


exports.seedGrammarTenses = async () => {
  const grammarCol = db.collection(COLLECTIONS.GRAMMAR_LESSONS);
  const existing = await grammarCol.where('teacherAccountId', '==', 'system').get();
  if (!existing.empty) {
    return { skipped: true, count: existing.size, message: 'Dữ liệu mẫu đã tồn tại' };
  }

  const now = new Date().toISOString();
  const batch = db.batch();

  GRAMMAR_TENSES.forEach((tense, idx) => {
    const ref = grammarCol.doc();
    batch.set(ref, {
      title: tense.title,
      description: tense.description,
      content: tense.content,
      videoUrl: '',
      gradeLevel: 'all',
      topic: 'tenses',
      module: 'grammar',
      weekNumber: idx + 1,
      month: null,
      year: new Date().getFullYear(),
      exercises: tense.exercises.map((ex, i) => ({
        id: `ex_${i}_seed`,
        question: ex.question,
        type: ex.type,
        options: ex.type === 'mcq' ? ex.options : [],
        answer: ex.answer,
        explanation: ex.explanation || '',
      })),
      teacherAccountId: 'system',
      teacherName: 'Hệ thống',
      status: 'published',
      createdAt: now,
      updatedAt: now,
    });
  });

  await batch.commit();
  return { skipped: false, count: GRAMMAR_TENSES.length, message: 'Đã tạo 12 bài học ngữ pháp' };
};