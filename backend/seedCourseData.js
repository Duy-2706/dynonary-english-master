require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const AccountModel = require('./src/models/account.model/account.model');
const UserModel = require('./src/models/account.model/user.model');
const CourseModel = require('./src/models/course.model');
const ChapterModel = require('./src/models/chapter.model');
const LessonModel = require('./src/models/lesson.model');
const EnrollmentModel = require('./src/models/enrollment.model');
const LessonProgressModel = require('./src/models/lessonProgress.model');

const MONGO_URL = process.env.MONGO_URL_LOCAL || 'mongodb://127.0.0.1:27017/dynonary';

async function seed() {
  await mongoose.connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  });
  console.log('✅ Connected to MongoDB');

  // Xóa dữ liệu cũ
  await Promise.all([
    CourseModel.deleteMany({}),
    ChapterModel.deleteMany({}),
    LessonModel.deleteMany({}),
    EnrollmentModel.deleteMany({}),
    LessonProgressModel.deleteMany({}),
  ]);
  console.log('🗑️  Cleared old course data');

  // ==================== TẠO TÀI KHOẢN ====================
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('123456', saltRounds);

  // Xóa tài khoản demo cũ nếu có
  const demoEmails = [
    'teacher1@demo.com', 'teacher2@demo.com',
    'student1@demo.com', 'student2@demo.com', 'student3@demo.com',
  ];
  for (const email of demoEmails) {
    const acc = await AccountModel.findOne({ email });
    if (acc) {
      await UserModel.deleteOne({ accountId: acc._id });
      await AccountModel.deleteOne({ email });
    }
  }

  // Tạo giáo viên 1
  const teacher1Account = await AccountModel.create({
    email: 'teacher1@demo.com',
    password: hashedPassword,
    authType: 'local',
    createdDate: new Date(),
  });
  // Bypass bcrypt pre-save hook bằng cách dùng updateOne
  await AccountModel.updateOne(
    { _id: teacher1Account._id },
    { password: hashedPassword },
  );
  const teacher1User = await UserModel.create({
    accountId: teacher1Account._id,
    name: 'Nguyễn Thị Lan Anh',
    username: 'teacher_lananh',
    coin: 5000,
    role: 'teacher',
    avt: 'https://i.pravatar.cc/150?img=47',
  });

  // Tạo giáo viên 2
  const teacher2Account = await AccountModel.create({
    email: 'teacher2@demo.com',
    password: hashedPassword,
    authType: 'local',
    createdDate: new Date(),
  });
  await AccountModel.updateOne(
    { _id: teacher2Account._id },
    { password: hashedPassword },
  );
  const teacher2User = await UserModel.create({
    accountId: teacher2Account._id,
    name: 'Trần Minh Khoa',
    username: 'teacher_minhkhoa',
    coin: 3000,
    role: 'teacher',
    avt: 'https://i.pravatar.cc/150?img=12',
  });

  // Tạo học viên
  const studentAccounts = [];
  const studentUsers = [];
  const studentData = [
    { email: 'student1@demo.com', name: 'Phạm Thị Thu Hà', username: 'student_thuha', avt: 'https://i.pravatar.cc/150?img=5' },
    { email: 'student2@demo.com', name: 'Lê Văn Đức', username: 'student_vanduc', avt: 'https://i.pravatar.cc/150?img=8' },
    { email: 'student3@demo.com', name: 'Hoàng Thị Mai', username: 'student_hoangmai', avt: 'https://i.pravatar.cc/150?img=9' },
  ];

  for (const s of studentData) {
    const acc = await AccountModel.create({
      email: s.email,
      password: hashedPassword,
      authType: 'local',
      createdDate: new Date(),
    });
    await AccountModel.updateOne({ _id: acc._id }, { password: hashedPassword });
    const user = await UserModel.create({
      accountId: acc._id,
      name: s.name,
      username: s.username,
      coin: 500,
      role: 'student',
      avt: s.avt,
    });
    studentAccounts.push(acc);
    studentUsers.push(user);
  }

  console.log('👤 Created accounts');

  // ==================== KHÓA HỌC 1 ====================
  // Tiếng Anh Giao Tiếp Cơ Bản - Miễn phí
  const course1 = await CourseModel.create({
    title: 'Tiếng Anh Giao Tiếp Cơ Bản',
    description: 'Khóa học giúp bạn tự tin giao tiếp tiếng Anh trong các tình huống hàng ngày. Từ chào hỏi, mua sắm đến du lịch, bạn sẽ học được những câu nói thực tế nhất.',
    thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600',
    level: 'A1',
    teacherAccountId: teacher1Account._id,
    teacherName: 'Nguyễn Thị Lan Anh',
    price: 0,
    isFree: true,
    status: 'published',
    totalStudents: 3,
    totalChapters: 3,
    totalLessons: 9,
  });

  // Chương 1 - Chào hỏi
  const ch1_1 = await ChapterModel.create({
    courseId: course1._id,
    title: 'Chào hỏi & Giới thiệu bản thân',
    description: 'Học cách chào hỏi và giới thiệu bản thân trong tiếng Anh',
    order: 1,
    isFree: true,
    totalLessons: 3,
  });

  await LessonModel.create({
    courseId: course1._id,
    chapterId: ch1_1._id,
    title: 'Từ vựng chào hỏi cơ bản',
    order: 1,
    type: 'flashcard',
    isFree: true,
    words: [
      { word: 'Hello', mean: 'Xin chào', phonetic: 'həˈloʊ', picture: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300', example: 'Hello! How are you?' },
      { word: 'Goodbye', mean: 'Tạm biệt', phonetic: 'ɡʊdˈbaɪ', picture: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300', example: 'Goodbye! See you tomorrow.' },
      { word: 'Thank you', mean: 'Cảm ơn', phonetic: 'θæŋk juː', picture: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300', example: 'Thank you for your help.' },
      { word: 'Sorry', mean: 'Xin lỗi', phonetic: 'ˈsɒri', picture: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=300', example: 'Sorry, I am late.' },
      { word: 'Please', mean: 'Làm ơn / Xin', phonetic: 'pliːz', picture: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300', example: 'Please help me.' },
      { word: 'Yes', mean: 'Có / Đúng', phonetic: 'jɛs', example: 'Yes, I understand.' },
      { word: 'No', mean: 'Không', phonetic: 'noʊ', example: 'No, that is not right.' },
      { word: 'Good morning', mean: 'Chào buổi sáng', phonetic: 'ɡʊd ˈmɔːrnɪŋ', example: 'Good morning! Have a nice day.' },
      { word: 'Good night', mean: 'Chúc ngủ ngon', phonetic: 'ɡʊd naɪt', example: 'Good night! See you tomorrow.' },
      { word: 'Nice to meet you', mean: 'Rất vui được gặp bạn', phonetic: 'naɪs tuː miːt juː', example: 'Nice to meet you, John!' },
    ],
  });

  await LessonModel.create({
    courseId: course1._id,
    chapterId: ch1_1._id,
    title: 'Bài tập trắc nghiệm - Chào hỏi',
    order: 2,
    type: 'quiz',
    isFree: true,
    questions: [
      {
        question: '"Xin chào" trong tiếng Anh là gì?',
        options: ['Goodbye', 'Hello', 'Sorry', 'Thank you'],
        correctIndex: 1,
        explanation: 'Hello có nghĩa là Xin chào, dùng để chào hỏi.',
      },
      {
        question: 'Bạn muốn nói "Cảm ơn" bằng tiếng Anh, bạn nói gì?',
        options: ['Please', 'Sorry', 'Thank you', 'Yes'],
        correctIndex: 2,
        explanation: 'Thank you là cách nói cảm ơn phổ biến nhất.',
      },
      {
        question: '"Good morning" có nghĩa là gì?',
        options: ['Chúc ngủ ngon', 'Chào buổi chiều', 'Chào buổi sáng', 'Tạm biệt'],
        correctIndex: 2,
        explanation: 'Good morning = Chào buổi sáng.',
      },
      {
        question: 'Khi gặp ai lần đầu, bạn nói gì?',
        options: ['Goodbye', 'Good night', 'Sorry', 'Nice to meet you'],
        correctIndex: 3,
        explanation: 'Nice to meet you = Rất vui được gặp bạn.',
      },
      {
        question: '"No" có nghĩa là gì?',
        options: ['Có', 'Không', 'Làm ơn', 'Xin lỗi'],
        correctIndex: 1,
        explanation: 'No = Không.',
      },
    ],
  });

  await LessonModel.create({
    courseId: course1._id,
    chapterId: ch1_1._id,
    title: 'Điền từ - Hoàn thành câu chào hỏi',
    order: 3,
    type: 'fill_blank',
    isFree: true,
    fillBlanks: [
      { sentence: '___ morning! How are you?', correctAnswer: 'Good', hint: 'Bắt đầu bằng chữ G' },
      { sentence: 'Nice to ___ you!', correctAnswer: 'meet', hint: 'Động từ có nghĩa là gặp' },
      { sentence: 'Thank ___ for your help.', correctAnswer: 'you', hint: 'Đại từ ngôi 2' },
      { sentence: '___ , I am late. Please forgive me.', correctAnswer: 'Sorry', hint: 'Lời xin lỗi' },
      { sentence: 'Good ___! See you tomorrow.', correctAnswer: 'night', hint: 'Thời điểm trong ngày' },
    ],
  });

  // Chương 2 - Gia đình
  const ch1_2 = await ChapterModel.create({
    courseId: course1._id,
    title: 'Gia đình & Các mối quan hệ',
    description: 'Từ vựng về gia đình và các mối quan hệ thân thiết',
    order: 2,
    isFree: false,
    totalLessons: 3,
  });

  await LessonModel.create({
    courseId: course1._id,
    chapterId: ch1_2._id,
    title: 'Từ vựng về gia đình',
    order: 1,
    type: 'flashcard',
    isFree: false,
    words: [
      { word: 'Father', mean: 'Cha / Bố', phonetic: 'ˈfɑːðər', picture: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=300', example: 'My father is a doctor.' },
      { word: 'Mother', mean: 'Mẹ', phonetic: 'ˈmʌðər', picture: 'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=300', example: 'My mother cooks very well.' },
      { word: 'Brother', mean: 'Anh / Em trai', phonetic: 'ˈbrʌðər', example: 'I have two brothers.' },
      { word: 'Sister', mean: 'Chị / Em gái', phonetic: 'ˈsɪstər', example: 'My sister is a teacher.' },
      { word: 'Grandfather', mean: 'Ông', phonetic: 'ˈɡrændfɑːðər', example: 'My grandfather is 75 years old.' },
      { word: 'Grandmother', mean: 'Bà', phonetic: 'ˈɡrændmʌðər', example: 'My grandmother tells good stories.' },
      { word: 'Son', mean: 'Con trai', phonetic: 'sʌn', example: 'They have one son.' },
      { word: 'Daughter', mean: 'Con gái', phonetic: 'ˈdɔːtər', example: 'Their daughter is very smart.' },
      { word: 'Husband', mean: 'Chồng', phonetic: 'ˈhʌzbənd', example: 'Her husband works in Hanoi.' },
      { word: 'Wife', mean: 'Vợ', phonetic: 'waɪf', example: 'His wife is a nurse.' },
      { word: 'Uncle', mean: 'Chú / Bác / Cậu', phonetic: 'ˈʌŋkl', example: 'My uncle lives in Ho Chi Minh City.' },
      { word: 'Aunt', mean: 'Cô / Dì / Mợ', phonetic: 'ænt', example: 'My aunt makes delicious food.' },
    ],
  });

  await LessonModel.create({
    courseId: course1._id,
    chapterId: ch1_2._id,
    title: 'Trắc nghiệm - Từ vựng gia đình',
    order: 2,
    type: 'quiz',
    questions: [
      {
        question: '"Mother" có nghĩa là gì?',
        options: ['Cha', 'Mẹ', 'Anh trai', 'Em gái'],
        correctIndex: 1,
        explanation: 'Mother = Mẹ.',
      },
      {
        question: 'Con gái trong tiếng Anh là gì?',
        options: ['Son', 'Brother', 'Daughter', 'Sister'],
        correctIndex: 2,
        explanation: 'Daughter = Con gái. Son = Con trai.',
      },
      {
        question: '"Grandfather" có nghĩa là gì?',
        options: ['Bố', 'Ông', 'Chú', 'Anh'],
        correctIndex: 1,
        explanation: 'Grandfather = Ông nội/ngoại.',
      },
      {
        question: 'Người phụ nữ đã kết hôn gọi chồng mình là gì?',
        options: ['Brother', 'Father', 'Husband', 'Uncle'],
        correctIndex: 2,
        explanation: 'Husband = Chồng.',
      },
    ],
  });

  await LessonModel.create({
    courseId: course1._id,
    chapterId: ch1_2._id,
    title: 'Điền từ - Gia đình',
    order: 3,
    type: 'fill_blank',
    fillBlanks: [
      { sentence: 'My ___ is a doctor. He works at a hospital.', correctAnswer: 'father', hint: 'Người đàn ông trong gia đình' },
      { sentence: 'She has one ___ and two sisters.', correctAnswer: 'brother', hint: 'Anh hoặc em trai' },
      { sentence: 'Their ___ is 5 years old. She loves to play.', correctAnswer: 'daughter', hint: 'Con gái' },
      { sentence: 'My ___ tells wonderful stories every night.', correctAnswer: 'grandmother', hint: 'Bà nội/ngoại' },
    ],
  });

  // Chương 3 - Màu sắc & Số đếm
  const ch1_3 = await ChapterModel.create({
    courseId: course1._id,
    title: 'Màu sắc & Số đếm',
    description: 'Học màu sắc và số đếm cơ bản trong tiếng Anh',
    order: 3,
    isFree: false,
    totalLessons: 3,
  });

  await LessonModel.create({
    courseId: course1._id,
    chapterId: ch1_3._id,
    title: 'Từ vựng màu sắc',
    order: 1,
    type: 'flashcard',
    words: [
      { word: 'Red', mean: 'Màu đỏ', phonetic: 'rɛd', picture: 'https://images.unsplash.com/photo-1508921340878-ba53e1f016ec?w=300', example: 'The rose is red.' },
      { word: 'Blue', mean: 'Màu xanh dương', phonetic: 'bluː', picture: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300', example: 'The sky is blue.' },
      { word: 'Green', mean: 'Màu xanh lá', phonetic: 'ɡriːn', picture: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=300', example: 'The grass is green.' },
      { word: 'Yellow', mean: 'Màu vàng', phonetic: 'ˈjɛloʊ', picture: 'https://images.unsplash.com/photo-1490750967868-88df5691bbaa?w=300', example: 'The sun is yellow.' },
      { word: 'White', mean: 'Màu trắng', phonetic: 'waɪt', example: 'Snow is white.' },
      { word: 'Black', mean: 'Màu đen', phonetic: 'blæk', example: 'The night sky is black.' },
      { word: 'Orange', mean: 'Màu cam', phonetic: 'ˈɔːrɪndʒ', picture: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=300', example: 'The orange is orange.' },
      { word: 'Purple', mean: 'Màu tím', phonetic: 'ˈpɜːrpl', example: 'She likes purple flowers.' },
      { word: 'Pink', mean: 'Màu hồng', phonetic: 'pɪŋk', example: 'The flamingo is pink.' },
      { word: 'Brown', mean: 'Màu nâu', phonetic: 'braʊn', example: 'The bear is brown.' },
    ],
  });

  await LessonModel.create({
    courseId: course1._id,
    chapterId: ch1_3._id,
    title: 'Từ vựng số đếm 1-20',
    order: 2,
    type: 'flashcard',
    words: [
      { word: 'One', mean: 'Số 1', phonetic: 'wʌn', example: 'I have one dog.' },
      { word: 'Two', mean: 'Số 2', phonetic: 'tuː', example: 'She has two cats.' },
      { word: 'Three', mean: 'Số 3', phonetic: 'θriː', example: 'There are three apples.' },
      { word: 'Four', mean: 'Số 4', phonetic: 'fɔːr', example: 'He has four brothers.' },
      { word: 'Five', mean: 'Số 5', phonetic: 'faɪv', example: 'There are five fingers.' },
      { word: 'Ten', mean: 'Số 10', phonetic: 'tɛn', example: 'I have ten books.' },
      { word: 'Twenty', mean: 'Số 20', phonetic: 'ˈtwɛnti', example: 'She is twenty years old.' },
      { word: 'Hundred', mean: 'Trăm', phonetic: 'ˈhʌndrəd', example: 'There are one hundred students.' },
    ],
  });

  await LessonModel.create({
    courseId: course1._id,
    chapterId: ch1_3._id,
    title: 'Trắc nghiệm - Màu sắc & Số đếm',
    order: 3,
    type: 'quiz',
    questions: [
      {
        question: '"Blue" có nghĩa là màu gì?',
        options: ['Màu đỏ', 'Màu xanh lá', 'Màu xanh dương', 'Màu vàng'],
        correctIndex: 2,
        explanation: 'Blue = Màu xanh dương, như bầu trời.',
      },
      {
        question: 'Màu vàng trong tiếng Anh là gì?',
        options: ['Red', 'Yellow', 'Green', 'Orange'],
        correctIndex: 1,
        explanation: 'Yellow = Màu vàng.',
      },
      {
        question: '"Five" có nghĩa là số mấy?',
        options: ['3', '4', '5', '6'],
        correctIndex: 2,
        explanation: 'Five = Số 5.',
      },
    ],
  });

  console.log('📚 Created Course 1: Tiếng Anh Giao Tiếp Cơ Bản');

  // ==================== KHÓA HỌC 2 ====================
  // Tiếng Anh Văn Phòng - Trả phí
  const course2 = await CourseModel.create({
    title: 'Tiếng Anh Văn Phòng Chuyên Nghiệp',
    description: 'Khóa học chuyên sâu về tiếng Anh trong môi trường công sở. Học cách viết email, họp hành, thuyết trình và giao tiếp chuyên nghiệp với đồng nghiệp quốc tế.',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
    level: 'B1',
    teacherAccountId: teacher1Account._id,
    teacherName: 'Nguyễn Thị Lan Anh',
    price: 299,
    isFree: false,
    status: 'published',
    totalStudents: 2,
    totalChapters: 2,
    totalLessons: 6,
  });

  // Chương 1 - Email văn phòng
  const ch2_1 = await ChapterModel.create({
    courseId: course2._id,
    title: 'Viết Email Chuyên Nghiệp',
    description: 'Học cách viết email tiếng Anh chuẩn mực trong môi trường công sở',
    order: 1,
    isFree: true,
    totalLessons: 3,
  });

  await LessonModel.create({
    courseId: course2._id,
    chapterId: ch2_1._id,
    title: 'Từ vựng viết email',
    order: 1,
    type: 'flashcard',
    isFree: true,
    words: [
      { word: 'Dear', mean: 'Kính gửi', phonetic: 'dɪər', example: 'Dear Mr. Johnson,' },
      { word: 'Sincerely', mean: 'Trân trọng', phonetic: 'sɪnˈsɪərli', example: 'Sincerely, John Smith' },
      { word: 'Attached', mean: 'Đính kèm', phonetic: 'əˈtætʃt', example: 'Please find the document attached.' },
      { word: 'Regarding', mean: 'Liên quan đến / Về vấn đề', phonetic: 'rɪˈɡɑːrdɪŋ', example: 'Regarding your request...' },
      { word: 'Schedule', mean: 'Lịch trình / Sắp xếp', phonetic: 'ˈskɛdʒuːl', example: 'Please schedule a meeting.' },
      { word: 'Deadline', mean: 'Hạn chót', phonetic: 'ˈdɛdlaɪn', example: 'The deadline is Friday.' },
      { word: 'Urgent', mean: 'Khẩn cấp', phonetic: 'ˈɜːrdʒənt', example: 'This is an urgent matter.' },
      { word: 'Confirm', mean: 'Xác nhận', phonetic: 'kənˈfɜːrm', example: 'Please confirm your attendance.' },
      { word: 'Apologize', mean: 'Xin lỗi (formal)', phonetic: 'əˈpɒlədʒaɪz', example: 'I apologize for the delay.' },
      { word: 'Forward', mean: 'Chuyển tiếp', phonetic: 'ˈfɔːrwərd', example: 'I will forward the email to you.' },
    ],
  });

  await LessonModel.create({
    courseId: course2._id,
    chapterId: ch2_1._id,
    title: 'Mẫu câu viết email',
    order: 2,
    type: 'fill_blank',
    isFree: true,
    fillBlanks: [
      { sentence: '___ Mr. Smith, I am writing to inform you about the meeting.', correctAnswer: 'Dear', hint: 'Cách mở đầu email' },
      { sentence: 'Please find the report ___ to this email.', correctAnswer: 'attached', hint: 'Đính kèm' },
      { sentence: 'I ___ for the late reply.', correctAnswer: 'apologize', hint: 'Xin lỗi lịch sự' },
      { sentence: 'Could you please ___ the meeting for next Monday?', correctAnswer: 'schedule', hint: 'Sắp xếp/lên lịch' },
      { sentence: 'The ___ for this project is December 31st.', correctAnswer: 'deadline', hint: 'Hạn chót' },
    ],
  });

  await LessonModel.create({
    courseId: course2._id,
    chapterId: ch2_1._id,
    title: 'Trắc nghiệm - Email văn phòng',
    order: 3,
    type: 'quiz',
    questions: [
      {
        question: 'Khi viết email trang trọng, bạn bắt đầu bằng từ nào?',
        options: ['Hello', 'Hey', 'Dear', 'Hi'],
        correctIndex: 2,
        explanation: 'Dear là cách mở đầu email trang trọng nhất.',
      },
      {
        question: '"Deadline" có nghĩa là gì?',
        options: ['Cuộc họp', 'Hạn chót', 'Lịch trình', 'Báo cáo'],
        correctIndex: 1,
        explanation: 'Deadline = Hạn chót, thời hạn hoàn thành.',
      },
      {
        question: 'Bạn muốn đính kèm file vào email, bạn dùng từ nào?',
        options: ['Forward', 'Confirm', 'Attached', 'Schedule'],
        correctIndex: 2,
        explanation: 'Attached = Đính kèm.',
      },
    ],
  });

  // Chương 2 - Họp hành
  const ch2_2 = await ChapterModel.create({
    courseId: course2._id,
    title: 'Tiếng Anh Trong Cuộc Họp',
    description: 'Học cách sử dụng tiếng Anh hiệu quả trong các cuộc họp',
    order: 2,
    isFree: false,
    totalLessons: 3,
  });

  await LessonModel.create({
    courseId: course2._id,
    chapterId: ch2_2._id,
    title: 'Từ vựng trong cuộc họp',
    order: 1,
    type: 'flashcard',
    words: [
      { word: 'Agenda', mean: 'Chương trình nghị sự', phonetic: 'əˈdʒɛndə', example: "Let's go through the agenda." },
      { word: 'Minutes', mean: 'Biên bản cuộc họp', phonetic: 'ˈmɪnɪts', example: 'Who will take the minutes?' },
      { word: 'Proposal', mean: 'Đề xuất', phonetic: 'prəˈpoʊzl', example: 'I have a proposal for the team.' },
      { word: 'Feedback', mean: 'Phản hồi', phonetic: 'ˈfiːdbæk', example: 'Thank you for your feedback.' },
      { word: 'Brainstorm', mean: 'Động não / Suy nghĩ sáng tạo', phonetic: 'ˈbreɪnstɔːrm', example: "Let's brainstorm some ideas." },
      { word: 'Clarify', mean: 'Làm rõ', phonetic: 'ˈklærɪfaɪ', example: 'Could you clarify that point?' },
      { word: 'Proceed', mean: 'Tiến hành', phonetic: 'prəˈsiːd', example: "Let's proceed to the next item." },
      { word: 'Summarize', mean: 'Tóm tắt', phonetic: 'ˈsʌməraɪz', example: 'Let me summarize the key points.' },
    ],
  });

  await LessonModel.create({
    courseId: course2._id,
    chapterId: ch2_2._id,
    title: 'Câu nói thông dụng trong họp',
    order: 2,
    type: 'fill_blank',
    fillBlanks: [
      { sentence: "Let's ___ some new ideas for the campaign.", correctAnswer: 'brainstorm', hint: 'Động não' },
      { sentence: 'Could you ___ what you mean by that?', correctAnswer: 'clarify', hint: 'Làm rõ' },
      { sentence: 'Let me ___ the key points from today\'s meeting.', correctAnswer: 'summarize', hint: 'Tóm tắt' },
      { sentence: "Let's ___ to the next item on the agenda.", correctAnswer: 'proceed', hint: 'Tiến hành' },
    ],
  });

  await LessonModel.create({
    courseId: course2._id,
    chapterId: ch2_2._id,
    title: 'Trắc nghiệm - Tiếng Anh trong họp',
    order: 3,
    type: 'quiz',
    questions: [
      {
        question: '"Agenda" trong cuộc họp có nghĩa là gì?',
        options: ['Biên bản', 'Chương trình nghị sự', 'Đề xuất', 'Phản hồi'],
        correctIndex: 1,
        explanation: 'Agenda = Chương trình nghị sự của cuộc họp.',
      },
      {
        question: 'Khi muốn nói "Làm rõ điều đó", bạn dùng từ nào?',
        options: ['Summarize', 'Proceed', 'Clarify', 'Brainstorm'],
        correctIndex: 2,
        explanation: 'Clarify = Làm rõ, giải thích rõ hơn.',
      },
    ],
  });

  console.log('📚 Created Course 2: Tiếng Anh Văn Phòng');

  // ==================== KHÓA HỌC 3 ====================
  // IELTS Vocabulary - Trả phí
  const course3 = await CourseModel.create({
    title: 'Từ Vựng IELTS Nâng Cao',
    description: 'Khóa học từ vựng IELTS được thiết kế để giúp bạn đạt band 6.5-8.0. Bao gồm các chủ đề thường gặp trong IELTS Writing và Speaking với từ vựng học thuật cao cấp.',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600',
    level: 'C1',
    teacherAccountId: teacher2Account._id,
    teacherName: 'Trần Minh Khoa',
    price: 499,
    isFree: false,
    status: 'published',
    totalStudents: 1,
    totalChapters: 2,
    totalLessons: 4,
  });

  const ch3_1 = await ChapterModel.create({
    courseId: course3._id,
    title: 'Từ Vựng Học Thuật - Academic Vocabulary',
    description: 'Từ vựng học thuật thiết yếu cho IELTS',
    order: 1,
    isFree: true,
    totalLessons: 2,
  });

  await LessonModel.create({
    courseId: course3._id,
    chapterId: ch3_1._id,
    title: 'Academic Word List - Phần 1',
    order: 1,
    type: 'flashcard',
    isFree: true,
    words: [
      { word: 'Significant', mean: 'Đáng kể / Quan trọng', phonetic: 'sɪɡˈnɪfɪkənt', example: 'There has been a significant increase in pollution.' },
      { word: 'Consequently', mean: 'Do đó / Vì vậy', phonetic: 'ˈkɒnsɪkwəntli', example: 'He was late; consequently, he missed the train.' },
      { word: 'Furthermore', mean: 'Hơn nữa / Ngoài ra', phonetic: 'ˌfɜːrðərˈmɔːr', example: 'Furthermore, the research shows clear benefits.' },
      { word: 'Nevertheless', mean: 'Tuy nhiên / Dù vậy', phonetic: 'ˌnɛvərðəˈlɛs', example: 'It was raining; nevertheless, we went out.' },
      { word: 'Substantial', mean: 'Đáng kể / Lớn', phonetic: 'səbˈstænʃl', example: 'There has been a substantial improvement.' },
      { word: 'Controversial', mean: 'Gây tranh cãi', phonetic: 'ˌkɒntrəˈvɜːrʃl', example: 'This is a controversial issue.' },
      { word: 'Predominant', mean: 'Chiếm ưu thế / Nổi bật', phonetic: 'prɪˈdɒmɪnənt', example: 'English is the predominant language here.' },
      { word: 'Inevitable', mean: 'Không thể tránh khỏi', phonetic: 'ɪnˈɛvɪtəbl', example: 'Change is inevitable.' },
      { word: 'Elaborate', mean: 'Chi tiết / Giải thích thêm', phonetic: 'ɪˈlæbərət', example: 'Could you elaborate on that point?' },
      { word: 'Hypothesis', mean: 'Giả thuyết', phonetic: 'haɪˈpɒθɪsɪs', example: 'The scientist tested the hypothesis.' },
    ],
  });

  await LessonModel.create({
    courseId: course3._id,
    chapterId: ch3_1._id,
    title: 'Trắc nghiệm - Academic Words',
    order: 2,
    type: 'quiz',
    isFree: true,
    questions: [
      {
        question: '"Significant" có nghĩa là gì?',
        options: ['Nhỏ bé', 'Đáng kể / Quan trọng', 'Không rõ ràng', 'Tạm thời'],
        correctIndex: 1,
        explanation: 'Significant = Đáng kể, quan trọng, dùng nhiều trong IELTS writing.',
      },
      {
        question: 'Từ nào có nghĩa là "Hơn nữa"?',
        options: ['Nevertheless', 'Consequently', 'Furthermore', 'Substantial'],
        correctIndex: 2,
        explanation: 'Furthermore = Hơn nữa, thêm vào đó.',
      },
      {
        question: '"Inevitable" có nghĩa là gì?',
        options: ['Có thể tránh được', 'Không chắc chắn', 'Không thể tránh khỏi', 'Gây tranh cãi'],
        correctIndex: 2,
        explanation: 'Inevitable = Không thể tránh khỏi, tất yếu.',
      },
    ],
  });

  const ch3_2 = await ChapterModel.create({
    courseId: course3._id,
    title: 'IELTS Writing - Từ Vựng Theo Chủ Đề',
    description: 'Từ vựng theo các chủ đề thường gặp trong IELTS',
    order: 2,
    isFree: false,
    totalLessons: 2,
  });

  await LessonModel.create({
    courseId: course3._id,
    chapterId: ch3_2._id,
    title: 'Chủ đề Môi trường - Environment',
    order: 1,
    type: 'flashcard',
    words: [
      { word: 'Pollution', mean: 'Ô nhiễm', phonetic: 'pəˈluːʃn', example: 'Air pollution is a serious problem.' },
      { word: 'Deforestation', mean: 'Phá rừng', phonetic: 'ˌdiːˌfɒrɪˈsteɪʃn', example: 'Deforestation causes climate change.' },
      { word: 'Renewable', mean: 'Có thể tái tạo', phonetic: 'rɪˈnjuːəbl', example: 'Solar energy is renewable.' },
      { word: 'Sustainable', mean: 'Bền vững', phonetic: 'səˈsteɪnəbl', example: 'We need sustainable development.' },
      { word: 'Biodiversity', mean: 'Đa dạng sinh học', phonetic: 'ˌbaɪoʊdaɪˈvɜːrsɪti', example: 'Biodiversity is threatened by pollution.' },
      { word: 'Carbon footprint', mean: 'Lượng khí thải carbon', phonetic: 'ˈkɑːrbən ˈfʊtprɪnt', example: 'We must reduce our carbon footprint.' },
      { word: 'Ecosystem', mean: 'Hệ sinh thái', phonetic: 'ˈiːkoʊsɪstəm', example: 'The ecosystem is very fragile.' },
      { word: 'Conservation', mean: 'Bảo tồn', phonetic: 'ˌkɒnsəˈveɪʃn', example: 'Conservation of wildlife is important.' },
    ],
  });

  await LessonModel.create({
    courseId: course3._id,
    chapterId: ch3_2._id,
    title: 'Điền từ - Chủ đề Môi trường',
    order: 2,
    type: 'fill_blank',
    fillBlanks: [
      { sentence: 'Air ___ is one of the biggest problems in modern cities.', correctAnswer: 'pollution', hint: 'Ô nhiễm' },
      { sentence: 'We should use ___ energy sources like solar and wind power.', correctAnswer: 'renewable', hint: 'Có thể tái tạo' },
      { sentence: '___ development means meeting current needs without compromising future generations.', correctAnswer: 'Sustainable', hint: 'Bền vững' },
      { sentence: 'The ___ of the Amazon rainforest threatens many species.', correctAnswer: 'deforestation', hint: 'Phá rừng' },
    ],
  });

  console.log('📚 Created Course 3: Từ Vựng IELTS');

  // ==================== ENROLLMENT ====================
  // Học viên 1 đăng ký cả 2 khóa miễn phí và có phí
  await EnrollmentModel.create({
    courseId: course1._id,
    studentAccountId: studentAccounts[0]._id,
    studentName: studentUsers[0].name,
    status: 'active',
    paymentStatus: 'free',
    progressPercent: 67,
    completedLessons: 6,
    totalLessons: 9,
    enrolledAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
  });

  await EnrollmentModel.create({
    courseId: course2._id,
    studentAccountId: studentAccounts[0]._id,
    studentName: studentUsers[0].name,
    status: 'active',
    paymentStatus: 'paid',
    paidAmount: 299,
    progressPercent: 33,
    completedLessons: 2,
    totalLessons: 6,
    enrolledAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
  });

  // Học viên 2 đăng ký khóa 1 và 3
  await EnrollmentModel.create({
    courseId: course1._id,
    studentAccountId: studentAccounts[1]._id,
    studentName: studentUsers[1].name,
    status: 'active',
    paymentStatus: 'free',
    progressPercent: 100,
    completedLessons: 9,
    totalLessons: 9,
    enrolledAt: new Date(Date.now() - 14 * 24 * 3600 * 1000),
    completedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
  });

  await EnrollmentModel.create({
    courseId: course3._id,
    studentAccountId: studentAccounts[1]._id,
    studentName: studentUsers[1].name,
    status: 'active',
    paymentStatus: 'paid',
    paidAmount: 499,
    progressPercent: 50,
    completedLessons: 2,
    totalLessons: 4,
    enrolledAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
  });

  // Học viên 3 đăng ký khóa 1
  await EnrollmentModel.create({
    courseId: course1._id,
    studentAccountId: studentAccounts[2]._id,
    studentName: studentUsers[2].name,
    status: 'active',
    paymentStatus: 'free',
    progressPercent: 22,
    completedLessons: 2,
    totalLessons: 9,
    enrolledAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
  });

  console.log('🎓 Created enrollments');

  console.log('\n✅ SEED DATA HOÀN THÀNH!\n');
  console.log('=====================================');
  console.log('📧 TÀI KHOẢN DEMO:');
  console.log('  Giáo viên 1: teacher1@demo.com / 123456');
  console.log('  Giáo viên 2: teacher2@demo.com / 123456');
  console.log('  Học viên 1:  student1@demo.com / 123456');
  console.log('  Học viên 2:  student2@demo.com / 123456');
  console.log('  Học viên 3:  student3@demo.com / 123456');
  console.log('=====================================');
  console.log('📚 KHÓA HỌC:');
  console.log('  1. Tiếng Anh Giao Tiếp Cơ Bản (Miễn phí - A1)');
  console.log('  2. Tiếng Anh Văn Phòng Chuyên Nghiệp (299 xu - B1)');
  console.log('  3. Từ Vựng IELTS Nâng Cao (499 xu - C1)');
  console.log('=====================================\n');

  await mongoose.disconnect();
  console.log('👋 Disconnected from MongoDB');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ SEED ERROR:', err);
  process.exit(1);
});