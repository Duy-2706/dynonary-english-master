/**
 * Migrate classrooms from existing user data.
 *
 * Problems this fixes:
 *  1. Students have classroomName but no classroomId (no classroom doc exists)
 *  2. Teachers not linked to any classroom
 *  3. Classroom docs missing entirely
 *
 * What this script does:
 *  - Reads all users in Firestore
 *  - Groups students by classroomName
 *  - For each group: creates the classroom doc if not already present
 *  - Updates each student's classroomId field to the real classroom doc ID
 *  - Rebuilds the classroom's students[] array
 *  - Tries to match teachers by their first classroom assignment or asks you to
 *    set teacherIdx in TEACHER_CLASS_MAP below
 *
 * Run from backend/: node scripts/migrateClassrooms.js
 */
require('dotenv').config();
require('dotenv').config({ path: '.local.env', override: false });

const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
    }),
  });
}

const db = admin.firestore();
const usersCol      = db.collection('users');
const accountsCol   = db.collection('accounts');
const classroomsCol = db.collection('classrooms');

// ── Assign teachers to classes manually if needed ─────────────────────────────
// Key = classroomName, Value = teacher name (partial match OK, case-insensitive)
// Leave empty string to skip teacher assignment for that class.
const TEACHER_CLASS_MAP = {
  '1A': 'Nguyễn Thị Lan',
  '2A': 'Trần Văn Minh',
  '3A': 'Lê Thị Hoa',
  '4A': 'Nguyễn Thị Lan',
  '5A': 'Trần Văn Minh',
};

function docToObj(doc) {
  if (!doc || !doc.exists) return null;
  return { ...doc.data(), _id: doc.id, id: doc.id };
}

async function run() {
  console.log('=== MIGRATE CLASSROOMS ===\n');

  // 1. Load all users
  const usersSnap = await usersCol.get();
  const allUsers = usersSnap.docs.map(docToObj).filter(Boolean);

  const students = allUsers.filter((u) => u.role === 'student' && u.classroomName);
  const teachers = allUsers.filter((u) => u.role === 'teacher');

  console.log(`Found ${students.length} students with classroomName, ${teachers.length} teachers.\n`);

  // 2. Group students by classroomName
  const byClass = {};
  for (const s of students) {
    const cn = (s.classroomName || '').trim();
    if (!cn) continue;
    if (!byClass[cn]) byClass[cn] = [];
    byClass[cn].push(s);
  }

  const classNames = Object.keys(byClass).sort();
  console.log(`Classes to process: ${classNames.join(', ')}\n`);

  for (const className of classNames) {
    const classStudents = byClass[className];
    console.log(`--- Lớp ${className} (${classStudents.length} học sinh) ---`);

    // 3. Find or create classroom doc
    const existingSnap = await classroomsCol.where('name', '==', className).limit(1).get();
    let classroomId;
    let classroomRef;

    if (!existingSnap.empty) {
      classroomId = existingSnap.docs[0].id;
      classroomRef = classroomsCol.doc(classroomId);
      console.log(`  [EXIST] classroom doc: ${classroomId}`);
    } else {
      const now = new Date().toISOString();
      // Grade = first digit of className (e.g. "1A" → "1")
      const grade = className.match(/\d+/)?.[0] || '';

      classroomRef = await classroomsCol.add({
        name: className,
        grade,
        teacherAccountId: '',
        teacherName: '',
        students: [],
        status: 'active',
        createdAt: now,
        updatedAt: now,
      });
      classroomId = classroomRef.id;
      console.log(`  [CREATED] classroom doc: ${classroomId}`);
    }

    // 4. Match teacher
    const teacherNameHint = TEACHER_CLASS_MAP[className] || '';
    let teacherAccountId = '';
    let teacherName = '';

    if (teacherNameHint) {
      const hint = teacherNameHint.toLowerCase();
      const matched = teachers.find((t) =>
        (t.name || '').toLowerCase().includes(hint.split(' ').pop()),
      );
      if (matched) {
        teacherName = matched.name;
        teacherAccountId = matched.accountId || '';
        console.log(`  [TEACHER] ${teacherName} (accountId: ${teacherAccountId})`);
      } else {
        console.log(`  [TEACHER] Không tìm thấy giáo viên khớp với "${teacherNameHint}"`);
      }
    }

    // 5. Build students array and update each student's classroomId
    const studentsArr = [];
    for (const s of classStudents) {
      studentsArr.push({
        accountId: s.accountId || '',
        username:  s.username  || '',
        name:      s.name      || '',
        joinedAt:  new Date().toISOString(),
      });

      // Update user doc if classroomId is missing/wrong
      if (s.classroomId !== classroomId) {
        await usersCol.doc(s._id).update({ classroomId, classroomName: className });
        console.log(`    [FIX] ${s.name} → classroomId set`);
      }
    }

    // 6. Update classroom doc
    await classroomsCol.doc(classroomId).update({
      students: studentsArr,
      teacherAccountId,
      teacherName,
      updatedAt: new Date().toISOString(),
    });

    console.log(`  [OK] ${studentsArr.length} học sinh, giáo viên: ${teacherName || '(chưa gán)'}\n`);
  }

  // 7. Fix teachers: set their classroomId list (optional — for future use)
  console.log('--- Kiểm tra giáo viên ---');
  for (const t of teachers) {
    const assignedClasses = classNames.filter(
      (cn) => (TEACHER_CLASS_MAP[cn] || '').toLowerCase().includes(
        (t.name || '').split(' ').pop().toLowerCase()
      )
    );
    if (assignedClasses.length) {
      console.log(`  ${t.name} → phụ trách lớp: ${assignedClasses.join(', ')}`);
    } else {
      console.log(`  ${t.name} → chưa được gán lớp nào`);
    }
  }

  console.log('\n=== XONG ===');
  process.exit(0);
}

run().catch((err) => {
  console.error('LỖI:', err.message);
  process.exit(1);
});
