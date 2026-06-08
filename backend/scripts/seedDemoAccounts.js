require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { db, COLLECTIONS } = require('../src/configs/firebase.config');
const { hashPassword, generateTeacherEmail, generateStudentEmail, generateStudentPassword, normalizeVN } = require('../src/helper');

const accountsCol = db.collection(COLLECTIONS.ACCOUNTS);
const usersCol = db.collection(COLLECTIONS.USERS);
const classroomsCol = db.collection(COLLECTIONS.CLASSROOMS);

const TEACHER_PW = 'GiaoVien@TCA123';

const TEACHERS = [
  { name: 'Nguyễn Thị Dương', subject: 'Tiếng Anh' },
  { name: 'Trần Văn Minh',    subject: 'Tiếng Anh' },
  { name: 'Lê Thị Hoa',       subject: 'Tiếng Anh' },
];

const CLASSROOMS = [
  { name: '1A', grade: '1', teacherIdx: 0 },
  { name: '1B', grade: '1', teacherIdx: 0 },
  { name: '2A', grade: '2', teacherIdx: 1 },
  { name: '2B', grade: '2', teacherIdx: 1 },
  { name: '3A', grade: '3', teacherIdx: 2 },
  { name: '3B', grade: '3', teacherIdx: 2 },
  { name: '4A', grade: '4', teacherIdx: 0 },
  { name: '5A', grade: '5', teacherIdx: 1 },
];

const STUDENTS_BY_CLASS = {
  '1A': [
    { name: 'Nguyễn Văn An',    dob: '05/03/2019' },
    { name: 'Trần Thị Bích',    dob: '12/07/2019' },
    { name: 'Lê Hoàng Cường',   dob: '20/01/2019' },
    { name: 'Phạm Thị Dung',    dob: '08/09/2019' },
    { name: 'Hoàng Văn Đức',    dob: '15/04/2019' },
    { name: 'Vũ Thị Hằng',      dob: '03/11/2019' },
    { name: 'Đặng Minh Hiếu',   dob: '25/06/2019' },
    { name: 'Bùi Thị Lan',      dob: '18/02/2019' },
  ],
  '1B': [
    { name: 'Phan Văn Long',    dob: '07/05/2019' },
    { name: 'Ngô Thị Mai',      dob: '14/08/2019' },
    { name: 'Đinh Quốc Nam',    dob: '22/10/2019' },
    { name: 'Trương Thị Nga',   dob: '01/12/2019' },
    { name: 'Lý Văn Phong',     dob: '09/03/2019' },
    { name: 'Đỗ Thị Quỳnh',    dob: '27/07/2019' },
    { name: 'Hồ Minh Sơn',     dob: '16/01/2019' },
    { name: 'Cao Thị Thu',      dob: '04/06/2019' },
  ],
  '2A': [
    { name: 'Nguyễn Thị Ánh',   dob: '10/02/2018' },
    { name: 'Trần Văn Bình',    dob: '23/05/2018' },
    { name: 'Lê Thị Châu',      dob: '06/09/2018' },
    { name: 'Phạm Quang Duy',   dob: '19/11/2018' },
    { name: 'Hoàng Thị Em',     dob: '02/04/2018' },
    { name: 'Vũ Văn Giang',     dob: '28/07/2018' },
    { name: 'Đặng Thị Huệ',     dob: '13/01/2018' },
    { name: 'Bùi Hữu Khoa',     dob: '30/06/2018' },
  ],
  '2B': [
    { name: 'Phan Thị Liên',    dob: '11/10/2018' },
    { name: 'Ngô Văn Mạnh',     dob: '08/03/2018' },
    { name: 'Đinh Thị Nhi',     dob: '17/06/2018' },
    { name: 'Trương Văn Oai',   dob: '24/08/2018' },
    { name: 'Lý Thị Phương',    dob: '05/12/2018' },
    { name: 'Đỗ Quốc Quyền',    dob: '21/02/2018' },
    { name: 'Hồ Thị Ry',        dob: '14/05/2018' },
    { name: 'Cao Văn Sáng',     dob: '03/09/2018' },
  ],
  '3A': [
    { name: 'Nguyễn Hữu Ân',    dob: '15/01/2017' },
    { name: 'Trần Thị Bảo',     dob: '04/04/2017' },
    { name: 'Lê Văn Chiến',     dob: '22/07/2017' },
    { name: 'Phạm Thị Diệu',    dob: '09/10/2017' },
    { name: 'Hoàng Văn Ên',     dob: '18/03/2017' },
    { name: 'Vũ Thị Giang',     dob: '01/06/2017' },
    { name: 'Đặng Quang Hùng',  dob: '29/08/2017' },
    { name: 'Bùi Thị Lan Anh',  dob: '12/12/2017' },
  ],
  '3B': [
    { name: 'Phan Văn Minh',    dob: '06/02/2017' },
    { name: 'Ngô Thị Ngọc',     dob: '20/05/2017' },
    { name: 'Đinh Văn Phi',     dob: '07/09/2017' },
    { name: 'Trương Thị Quế',   dob: '25/11/2017' },
    { name: 'Lý Hồng Phúc',     dob: '13/04/2017' },
    { name: 'Đỗ Thị Sang',      dob: '02/07/2017' },
    { name: 'Hồ Văn Tài',       dob: '17/01/2017' },
    { name: 'Cao Thị Uyên',     dob: '08/06/2017' },
  ],
  '4A': [
    { name: 'Nguyễn Thị Vân',   dob: '11/03/2016' },
    { name: 'Trần Văn Vinh',    dob: '24/06/2016' },
    { name: 'Lê Thị Xuân',      dob: '07/09/2016' },
    { name: 'Phạm Hữu Yên',     dob: '19/12/2016' },
    { name: 'Hoàng Thị Yến',    dob: '03/02/2016' },
    { name: 'Vũ Văn Dũng',      dob: '28/04/2016' },
    { name: 'Đặng Thị Anh Thư', dob: '15/07/2016' },
    { name: 'Bùi Văn Bắc',      dob: '09/10/2016' },
  ],
  '5A': [
    { name: 'Phan Thị Cẩm',     dob: '12/01/2015' },
    { name: 'Ngô Văn Dần',      dob: '05/04/2015' },
    { name: 'Đinh Thị Lan',     dob: '18/07/2015' },
    { name: 'Trương Văn Phúc',  dob: '30/09/2015' },
    { name: 'Lý Thị Giao',      dob: '14/11/2015' },
    { name: 'Đỗ Văn Hải',       dob: '22/02/2015' },
    { name: 'Hồ Thị Hương',     dob: '08/05/2015' },
    { name: 'Cao Văn Khang',    dob: '26/08/2015' },
  ],
};

async function emailExists(email) {
  const snap = await accountsCol.where('email', '==', email.toLowerCase()).limit(1).get();
  return !snap.empty;
}

async function uniqueEmail(baseEmail) {
  const [local, domain] = baseEmail.split('@');
  let email = baseEmail;
  let counter = 2;
  while (await emailExists(email)) {
    email = `${local}${counter}@${domain}`;
    counter++;
  }
  return email;
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
    accountId, name, username, avt: '', coin: 100,
    favoriteList: [], role, ...extraUserFields,
  });
  return { accountId, email, password, username };
}

async function seedTeachers() {
  console.log('\n--- Tạo tài khoản giáo viên ---');
  const results = [];
  for (const t of TEACHERS) {
    const base = generateTeacherEmail(t.name);
    if (await emailExists(base)) {
      const snap = await accountsCol.where('email', '==', base).limit(1).get();
      const accountId = snap.empty ? '' : snap.docs[0].id;
      console.log(`  [BỎ QUA] ${t.name} — ${base} đã tồn tại`);
      results.push({ name: t.name, email: base, accountId, skipped: true });
      continue;
    }
    const email = await uniqueEmail(base);
    const created = await makeAccountAndUser(email, TEACHER_PW, t.name, 'teacher', { subject: t.subject });
    console.log(`  [OK] ${t.name} → ${email} / ${TEACHER_PW}`);
    results.push({ name: t.name, email, accountId: created.accountId, skipped: false });
  }
  return results;
}

async function seedClassrooms(teacherResults) {
  console.log('\n--- Tạo lớp học ---');
  const classroomIds = {};
  for (const cls of CLASSROOMS) {
    const snap = await classroomsCol.where('name', '==', cls.name).limit(1).get();
    if (!snap.empty) {
      console.log(`  [BỎ QUA] Lớp ${cls.name} đã tồn tại`);
      classroomIds[cls.name] = snap.docs[0].id;
      continue;
    }
    const teacher = teacherResults[cls.teacherIdx] || {};
    const now = new Date().toISOString();
    const ref = await classroomsCol.add({
      name: cls.name, grade: cls.grade,
      teacherAccountId: teacher.accountId || '',
      teacherName: teacher.name || '',
      students: [], status: 'active', createdAt: now, updatedAt: now,
    });
    console.log(`  [OK] Lớp ${cls.name} → ${ref.id} (GVCN: ${teacher.name || 'chưa gán'})`);
    classroomIds[cls.name] = ref.id;
  }
  return classroomIds;
}

async function seedStudents(classroomIds) {
  console.log('\n--- Tạo tài khoản học sinh ---');
  let total = 0, skipped = 0;
  for (const [className, students] of Object.entries(STUDENTS_BY_CLASS)) {
    const classroomId = classroomIds[className];
    if (!classroomId) { console.log(`  [LỖI] Không tìm thấy ID lớp ${className}`); continue; }
    console.log(`\n  Lớp ${className}:`);
    for (const s of students) {
      const base = generateStudentEmail(s.name, s.dob);
      if (await emailExists(base)) {
        console.log(`    [BỎ QUA] ${s.name} — ${base} đã tồn tại`);
        skipped++; continue;
      }
      const email = await uniqueEmail(base);
      const password = generateStudentPassword(s.dob);
      const created = await makeAccountAndUser(email, password, s.name, 'student', {
        classroomId, classroomName: className, dob: s.dob,
      });
      const { admin } = require('../src/configs/firebase.config');
      await classroomsCol.doc(classroomId).update({
        students: admin.firestore.FieldValue.arrayUnion({
          accountId: created.accountId,
          username: created.username,
          name: s.name,
          joinedAt: new Date().toISOString(),
        }),
      });
      console.log(`    [OK] ${s.name} → ${email} / ${password}`);
      total++;
    }
  }
  return { total, skipped };
}

async function main() {
  console.log('=== SEED DỮ LIỆU DEMO TCA (LỚP 1-5) ===\n');
  try {
    const teacherResults = await seedTeachers();
    const classroomIds = await seedClassrooms(teacherResults);
    const { total, skipped } = await seedStudents(classroomIds);
    console.log('\n=== HOÀN TẤT ===');
    console.log(`Giáo viên: ${teacherResults.filter((t) => !t.skipped).length} mới, ${teacherResults.filter((t) => t.skipped).length} đã có`);
    console.log(`Lớp học: ${Object.keys(classroomIds).length} lớp`);
    console.log(`Học sinh: ${total} mới, ${skipped} đã có`);
    process.exit(0);
  } catch (err) {
    console.error('LỖI:', err);
    process.exit(1);
  }
}

main();