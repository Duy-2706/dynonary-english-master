require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { db, COLLECTIONS, admin } = require('../src/configs/firebase.config');
const { hashPassword, generateTeacherEmail, generateStudentEmail, normalizeVN } = require('../src/helper');

const accountsCol = db.collection(COLLECTIONS.ACCOUNTS);
const usersCol    = db.collection(COLLECTIONS.USERS);
const classroomsCol = db.collection(COLLECTIONS.CLASSROOMS);

const DEFAULT_PW = '12345678a';

const TEACHERS = [
  { name: 'Nguyễn Thị Lan', subject: 'Tiếng Anh' },
  { name: 'Trần Văn Minh',  subject: 'Tiếng Anh' },
  { name: 'Lê Thị Hoa',     subject: 'Tiếng Anh' },
];

const CLASSROOMS = [
  { name: '1A', grade: '1', teacherIdx: 0 },
  { name: '2A', grade: '2', teacherIdx: 1 },
  { name: '3A', grade: '3', teacherIdx: 2 },
  { name: '4A', grade: '4', teacherIdx: 0 },
  { name: '5A', grade: '5', teacherIdx: 1 },
];

const STUDENTS_BY_CLASS = {
  '1A': [
    { name: 'Nguyễn Văn An',   dob: '05/03/2019' },
    { name: 'Trần Thị Bảo',    dob: '12/07/2019' },
    { name: 'Lê Hoàng Chiến',  dob: '20/01/2019' },
    { name: 'Phạm Thị Diệu',   dob: '08/09/2019' },
    { name: 'Hoàng Văn Em',    dob: '15/11/2019' },
  ],
  '2A': [
    { name: 'Võ Thị Phương',   dob: '02/04/2018' },
    { name: 'Đặng Văn Giang',  dob: '18/06/2018' },
    { name: 'Bùi Thị Hương',   dob: '25/02/2018' },
    { name: 'Ngô Văn Ích',     dob: '10/08/2018' },
    { name: 'Dương Thị Kim',   dob: '30/12/2018' },
  ],
  '3A': [
    { name: 'Nguyễn Văn Vinh', dob: '09/02/2017' },
    { name: 'Trần Thị Xuân',   dob: '17/08/2017' },
    { name: 'Lê Văn Yên',      dob: '26/05/2017' },
    { name: 'Phạm Thị Vân',    dob: '13/01/2017' },
    { name: 'Hoàng Văn Ân',    dob: '05/10/2017' },
  ],
  '4A': [
    { name: 'Võ Văn Quang',    dob: '11/02/2016' },
    { name: 'Đặng Thị Rin',    dob: '28/06/2016' },
    { name: 'Bùi Văn Sơn',     dob: '04/09/2016' },
    { name: 'Ngô Thị Thảo',    dob: '16/04/2016' },
    { name: 'Dương Văn Uy',    dob: '21/11/2016' },
  ],
  '5A': [
    { name: 'Nguyễn Văn Sáng', dob: '06/02/2015' },
    { name: 'Trần Thị Thơm',   dob: '19/06/2015' },
    { name: 'Lê Văn Ước',      dob: '28/10/2015' },
    { name: 'Phạm Thị Linh',   dob: '10/04/2015' },
    { name: 'Hoàng Văn Xuân',  dob: '23/08/2015' },
  ],
};

async function emailExists(email) {
  const snap = await accountsCol.where('email', '==', email.toLowerCase()).limit(1).get();
  return !snap.empty;
}

async function uniqueEmail(base) {
  const [local, domain] = base.split('@');
  let email = base;
  let n = 2;
  while (await emailExists(email)) {
    email = `${local}${n}@${domain}`;
    n++;
  }
  return email;
}

async function makeAccount(email, name, role, extra = {}) {
  const hashedPw = await hashPassword(DEFAULT_PW);
  const accountRef = await accountsCol.add({
    email: email.toLowerCase(),
    password: hashedPw,
    authType: 'local',
    isVerified: true,
    createdDate: new Date(),
  });
  const accountId = accountRef.id;
  const username = normalizeVN(name.split(/\s+/).pop()) + accountId.slice(-5);
  await usersCol.add({ accountId, name, username, avt: '', coin: 100, favoriteList: [], role, ...extra });
  return { accountId, username };
}

async function seedTeachers() {
  console.log('\n--- Giáo viên ---');
  const results = [];
  for (const t of TEACHERS) {
    const base = generateTeacherEmail(t.name);
    if (await emailExists(base)) {
      const snap = await accountsCol.where('email', '==', base).limit(1).get();
      console.log(`  [BỎ QUA] ${t.name} — ${base} đã tồn tại`);
      results.push({ name: t.name, email: base, accountId: snap.docs[0]?.id || '', skipped: true });
      continue;
    }
    const email = await uniqueEmail(base);
    const { accountId } = await makeAccount(email, t.name, 'teacher', { subject: t.subject });
    console.log(`  [OK] ${t.name} → ${email} / ${DEFAULT_PW}`);
    results.push({ name: t.name, email, accountId, skipped: false });
  }
  return results;
}

async function seedClassrooms(teacherResults) {
  console.log('\n--- Lớp học ---');
  const ids = {};
  for (const cls of CLASSROOMS) {
    const snap = await classroomsCol.where('name', '==', cls.name).limit(1).get();
    if (!snap.empty) {
      console.log(`  [BỎ QUA] Lớp ${cls.name} đã tồn tại`);
      ids[cls.name] = snap.docs[0].id;
      continue;
    }
    const teacher = teacherResults[cls.teacherIdx] || {};
    const now = new Date().toISOString();
    const ref = await classroomsCol.add({
      name: cls.name,
      grade: cls.grade,
      teacherAccountId: teacher.accountId || '',
      teacherName: teacher.name || '',
      students: [],
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  [OK] Lớp ${cls.name} (GVCN: ${teacher.name || '—'})`);
    ids[cls.name] = ref.id;
  }
  return ids;
}

async function seedStudents(classroomIds) {
  console.log('\n--- Học sinh ---');
  let total = 0, skipped = 0;
  for (const [className, students] of Object.entries(STUDENTS_BY_CLASS)) {
    const classroomId = classroomIds[className];
    if (!classroomId) { console.log(`  [LỖI] Không có ID lớp ${className}`); continue; }
    console.log(`\n  Lớp ${className}:`);
    for (const s of students) {
      const base = generateStudentEmail(s.name, s.dob);
      if (await emailExists(base)) {
        console.log(`    [BỎ QUA] ${s.name} — ${base} đã tồn tại`);
        skipped++;
        continue;
      }
      const email = await uniqueEmail(base);
      const { accountId, username } = await makeAccount(email, s.name, 'student', {
        classroomId,
        classroomName: className,
        dob: s.dob,
      });
      await classroomsCol.doc(classroomId).update({
        students: admin.firestore.FieldValue.arrayUnion({
          accountId,
          username,
          name: s.name,
          joinedAt: new Date().toISOString(),
        }),
      });
      console.log(`    [OK] ${s.name} → ${email} / ${DEFAULT_PW}`);
      total++;
    }
  }
  return { total, skipped };
}

async function main() {
  console.log('=== SEED DỮ LIỆU DEMO (3 GV, 5 LỚP, 5 HS/LỚP) ===');
  try {
    const teacherResults = await seedTeachers();
    const classroomIds   = await seedClassrooms(teacherResults);
    const { total, skipped } = await seedStudents(classroomIds);
    console.log('\n=== HOÀN TẤT ===');
    console.log(`Giáo viên: ${teacherResults.filter((t) => !t.skipped).length} mới`);
    console.log(`Lớp học: ${Object.keys(classroomIds).length} lớp`);
    console.log(`Học sinh: ${total} mới, ${skipped} đã có`);
    process.exit(0);
  } catch (err) {
    console.error('LỖI:', err.message);
    process.exit(1);
  }
}

main();
