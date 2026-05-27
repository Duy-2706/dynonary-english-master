require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  console.log('🗑️  Đã xóa dữ liệu cũ');

  // ===== TẠO TÀI KHOẢN =====
  const hashedPassword = await bcrypt.hash('123456', 10);
  const demoEmails = ['giaovien@thpt.com', 'hocsinh1@thpt.com', 'hocsinh2@thpt.com', 'hocsinh3@thpt.com'];

  for (const email of demoEmails) {
    const acc = await AccountModel.findOne({ email });
    if (acc) {
      await UserModel.deleteOne({ accountId: acc._id });
      await AccountModel.deleteOne({ email });
    }
  }

  // Giáo viên
  const teacherAcc = await AccountModel.create({ email: 'giaovien@thpt.com', password: hashedPassword, authType: 'local', createdDate: new Date() });
  await AccountModel.updateOne({ _id: teacherAcc._id }, { password: hashedPassword });
  const teacherUser = await UserModel.create({
    accountId: teacherAcc._id,
    name: 'Nguyễn Thị Hương Giang',
    username: 'giaovien_huonggiang',
    coin: 9999,
    role: 'teacher',
    avt: 'https://i.pravatar.cc/150?img=47',
  });

  // Học sinh
  const studentData = [
    { email: 'hocsinh1@thpt.com', name: 'Trần Văn Minh', username: 'hs_tranvanminh', avt: 'https://i.pravatar.cc/150?img=3' },
    { email: 'hocsinh2@thpt.com', name: 'Lê Thị Ngọc Anh', username: 'hs_lengocanh', avt: 'https://i.pravatar.cc/150?img=9' },
    { email: 'hocsinh3@thpt.com', name: 'Phạm Quốc Bảo', username: 'hs_phamquocbao', avt: 'https://i.pravatar.cc/150?img=11' },
  ];
  const studentAccounts = [], studentUsers = [];
  for (const s of studentData) {
    const acc = await AccountModel.create({ email: s.email, password: hashedPassword, authType: 'local', createdDate: new Date() });
    await AccountModel.updateOne({ _id: acc._id }, { password: hashedPassword });
    const user = await UserModel.create({ accountId: acc._id, name: s.name, username: s.username, coin: 200, role: 'student', avt: s.avt });
    studentAccounts.push(acc);
    studentUsers.push(user);
  }
  console.log('👤 Đã tạo tài khoản');

  // ===== KHÓA HỌC CHÍNH: ÔN THI THPT TIẾNG ANH =====
  const course = await CourseModel.create({
    title: 'Trọng Tâm Kiến Thức Ôn Thi THPT Quốc Gia Môn Tiếng Anh',
    description: 'Khóa học bám sát cấu trúc đề thi THPT Quốc Gia, bao gồm đầy đủ các dạng bài: Từ loại, Trật tự từ, Lượng từ, Liên từ, Từ vựng, Mệnh đề quan hệ, Đọc hiểu. Có bài tập trắc nghiệm và điền từ theo đúng cấu trúc đề thi.',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600',
    level: 'B1',
    teacherAccountId: teacherAcc._id,
    teacherName: 'Nguyễn Thị Hương Giang',
    price: 0,
    isFree: true,
    status: 'published',
    totalStudents: 3,
    totalChapters: 5,
    totalLessons: 15,
  });

  // ===================================================
  // CHƯƠNG 1: TỪ LOẠI (WORD FORMS)
  // ===================================================
  const ch1 = await ChapterModel.create({
    courseId: course._id,
    title: 'Chương 1: Dạng Bài Từ Loại (Word Forms)',
    description: 'Nhận biết và sử dụng đúng danh từ, động từ, tính từ, trạng từ thông qua các đuôi từ đặc trưng và vị trí trong câu.',
    order: 1,
    isFree: true,
    totalLessons: 3,
  });

  // Bài 1.1: Lý thuyết từ loại - Flashcard
  await LessonModel.create({
    courseId: course._id,
    chapterId: ch1._id,
    title: 'Bài 1: Nhận Biết Từ Loại Qua Đuôi Từ',
    order: 1,
    type: 'flashcard',
    isFree: true,
    content: 'Học các đuôi từ đặc trưng để nhận biết từ loại nhanh chóng trong bài thi.',
    words: [
      { word: '-ment → Danh từ', mean: 'achievement, development, entertainment, improvement, management', phonetic: '', example: 'The development of technology has changed our lives.' },
      { word: '-tion/-ation → Danh từ', mean: 'attention, education, imagination, communication, information', phonetic: '', example: 'Education is the key to success.' },
      { word: '-ness → Danh từ', mean: 'happiness, kindness, darkness, awareness, loneliness', phonetic: '', example: 'Happiness comes from within.' },
      { word: '-ity/-ty → Danh từ', mean: 'creativity, popularity, ability, electricity, nationality', phonetic: '', example: 'His creativity impressed everyone.' },
      { word: '-ise/-ize → Động từ', mean: 'popularize, modernize, organize, realize, recognize', phonetic: '', example: 'We need to modernize our system.' },
      { word: '-ful → Tính từ', mean: 'beautiful, useful, successful, careful, wonderful', phonetic: '', example: 'She has a beautiful smile.' },
      { word: '-less → Tính từ', mean: 'useless, careless, endless, hopeless, worthless', phonetic: '', example: 'The argument was endless.' },
      { word: '-able/-ible → Tính từ', mean: 'comfortable, reliable, responsible, possible, incredible', phonetic: '', example: 'He is a reliable person.' },
      { word: '-ous → Tính từ', mean: 'dangerous, famous, various, generous, mysterious', phonetic: '', example: 'It is dangerous to drive fast.' },
      { word: '-al → Tính từ', mean: 'natural, educational, traditional, cultural, environmental', phonetic: '', example: 'Environmental issues are serious.' },
      { word: '-ly → Trạng từ', mean: 'carefully, officially, naturally, successfully, differently', phonetic: '', example: 'She carefully checked the answer.' },
      { word: '-ing/-ed → Tính từ', mean: 'interesting/interested, boring/bored, exciting/excited, tiring/tired', phonetic: '', example: 'The movie was interesting. I was interested in it.' },
    ],
  });

  // Bài 1.2: Trắc nghiệm từ loại - từ đề thi thực tế
  await LessonModel.create({
    courseId: course._id,
    chapterId: ch1._id,
    title: 'Bài 2: Luyện Tập Trắc Nghiệm Từ Loại',
    order: 2,
    type: 'quiz',
    isFree: true,
    questions: [
      {
        question: 'The issue of climate change has received a lot of ______ recently.',
        options: ['attentive', 'attention', 'attend', 'attentively'],
        correctIndex: 1,
        explanation: 'Sau "a lot of" cần danh từ → "attention" (sự chú ý). Đuôi "-tion" là đuôi danh từ.',
      },
      {
        question: 'Swimming produces both ______ and physical benefits.',
        options: ['psychology', 'psychological', 'psychologist', 'psychologically'],
        correctIndex: 1,
        explanation: 'Trước danh từ "benefits" cần tính từ → "psychological" (thuộc về tâm lý). Đuôi "-al" là đuôi tính từ.',
      },
      {
        question: 'My friend is a good story writer; he has a rich ______.',
        options: ['imaginable', 'imagination', 'imagine', 'imaginative'],
        correctIndex: 1,
        explanation: 'Sau tính từ "rich" cần danh từ → "imagination" (trí tưởng tượng). Đuôi "-tion" là đuôi danh từ.',
      },
      {
        question: 'According to the present law, the authorities can give poachers a severe ______.',
        options: ['punishing', 'punish', 'punishable', 'punishment'],
        correctIndex: 3,
        explanation: 'Sau tính từ "severe" cần danh từ → "punishment" (hình phạt). Đuôi "-ment" là đuôi danh từ.',
      },
      {
        question: 'Many species of plants and animals are in ______ of extinction.',
        options: ['dangerous', 'endangered', 'danger', 'dangerously'],
        correctIndex: 2,
        explanation: 'Cụm cố định "in danger of" (có nguy cơ bị) → cần danh từ "danger".',
      },
      {
        question: 'The wedding day was ______ chosen by the parents of the groom.',
        options: ['careless', 'careful', 'carefully', 'care'],
        correctIndex: 2,
        explanation: 'Sau động từ "chosen" cần trạng từ → "carefully" (một cách cẩn thận). Đuôi "-ly" là đuôi trạng từ.',
      },
      {
        question: 'Josh\'s ambition is to become a ______ businessman like his father.',
        options: ['success', 'succeed', 'successfully', 'successful'],
        correctIndex: 3,
        explanation: 'Trước danh từ "businessman" cần tính từ → "successful" (thành công). Đuôi "-ful" là đuôi tính từ.',
      },
      {
        question: 'Project-based learning provides wonderful opportunities for students to develop their _____.',
        options: ['creative', 'creativity', 'create', 'creatively'],
        correctIndex: 1,
        explanation: 'Sau tính từ sở hữu "their" cần danh từ → "creativity" (sự sáng tạo). Đuôi "-ity" là đuôi danh từ.',
      },
      {
        question: 'It is believed that travelling is a good way to expand our _____ of the world.',
        options: ['knowledgeable', 'knowledgeably', 'knowledge', 'know'],
        correctIndex: 2,
        explanation: 'Sau tính từ sở hữu "our" cần danh từ → "knowledge" (kiến thức).',
      },
      {
        question: 'You should turn off the lights before going out to save _____.',
        options: ['electricity', 'electrify', 'electric', 'electrically'],
        correctIndex: 0,
        explanation: 'Sau động từ "save" cần danh từ → "electricity" (điện). Đuôi "-ity" là đuôi danh từ.',
      },
    ],
  });

  // Bài 1.3: Điền từ - đọc quảng cáo
  await LessonModel.create({
    courseId: course._id,
    chapterId: ch1._id,
    title: 'Bài 3: Điền Từ Loại Vào Đoạn Quảng Cáo',
    order: 3,
    type: 'fill_blank',
    isFree: true,
    fillBlanks: [
      {
        sentence: 'Education is the key to ___ (success/successful/successfully/succeed).',
        correctAnswer: 'success',
        hint: 'Sau giới từ "to" cần danh từ. Đuôi "-ess" là đuôi danh từ.',
      },
      {
        sentence: 'Our ___ programs offer interactive lessons. (innovate/innovation/innovator/innovative)',
        correctAnswer: 'innovative',
        hint: 'Trước danh từ "programs" cần tính từ. Đuôi "-ive" là đuôi tính từ.',
      },
      {
        sentence: 'Please find the document ___ to this email. (attach/attached/attachment/attaching)',
        correctAnswer: 'attached',
        hint: 'Dùng quá khứ phân từ (V-ed) sau danh từ → "attached" (đính kèm).',
      },
      {
        sentence: 'Maintaining a healthy lifestyle is not only ___ but also rewarding. (excite/excited/exciting/excitement)',
        correctAnswer: 'exciting',
        hint: 'Sau "is" + "not only" cần tính từ mô tả sự vật → "-ing adjective".',
      },
      {
        sentence: 'A well-rested mind is a focused and ___ mind. (production/productive/productively/produce)',
        correctAnswer: 'productive',
        hint: 'Sau "and" kết hợp với tính từ "focused" → cần tính từ. Đuôi "-ive" là đuôi tính từ.',
      },
      {
        sentence: 'Emergency shelters have been set up and medical ___ are available. (assist/assisted/assistance/assistant)',
        correctAnswer: 'assistance',
        hint: 'Sau tính từ "medical" cần danh từ → "assistance" (sự trợ giúp). Đuôi "-ance" là đuôi danh từ.',
      },
    ],
  });

  // ===================================================
  // CHƯƠNG 2: TRẬT TỰ TỪ (WORD ORDER)
  // ===================================================
  const ch2 = await ChapterModel.create({
    courseId: course._id,
    title: 'Chương 2: Dạng Bài Trật Tự Từ (Word Order)',
    description: 'Nắm vững quy tắc OSASCOMP và trật tự từ trong câu tiếng Anh để giải quyết dạng bài sắp xếp từ trong đề thi THPT.',
    order: 2,
    isFree: false,
    totalLessons: 3,
  });

  // Bài 2.1: Lý thuyết OSASCOMP
  await LessonModel.create({
    courseId: course._id,
    chapterId: ch2._id,
    title: 'Bài 1: Quy Tắc OSASCOMP - Trật Tự Tính Từ',
    order: 1,
    type: 'flashcard',
    isFree: true,
    words: [
      { word: 'O - Opinion (Nhận xét)', mean: 'beautiful, useful, interesting, lovely, delicious, handsome, luxurious', example: 'A beautiful old Japanese car (beautiful = Opinion)' },
      { word: 'S - Size (Kích cỡ)', mean: 'big, small, large, huge, tiny, long, short, tall', example: 'A small round table (small = Size)' },
      { word: 'A - Age (Tuổi tác)', mean: 'old, young, new, brand-new, ancient, modern', example: 'A beautiful old house (old = Age)' },
      { word: 'S - Shape (Hình dáng)', mean: 'round, square, flat, triangle, heart-shaped, cubic', example: 'A small round ball (round = Shape)' },
      { word: 'C - Color (Màu sắc)', mean: 'black, red, white, blue, yellow, cream, violet, purple', example: 'A brand-new black car (black = Color)' },
      { word: 'O - Origin (Nguồn gốc)', mean: 'Vietnamese, English, Indian, Thai, German, American', example: 'A beautiful old Japanese car (Japanese = Origin)' },
      { word: 'M - Material (Chất liệu)', mean: 'silk, gold, wooden, metal, plastic, leather, glass', example: 'A small wooden table (wooden = Material)' },
      { word: 'P - Purpose (Mục đích)', mean: 'sitting, sleeping, wedding, waiting, swimming', example: 'A comfortable sleeping bag (sleeping = Purpose)' },
      { word: 'Ví dụ OSASCOMP đầy đủ', mean: 'Opinion + Size + Age + Shape + Color + Origin + Material + Purpose + NOUN', example: 'A beautiful (O) large (S) old (A) round (S) black (C) Japanese (O) wooden (M) dining (P) table' },
      { word: 'Quy tắc: Danh từ + Danh từ', mean: 'Khi 2 danh từ đứng cạnh nhau → danh từ trước bổ nghĩa cho danh từ sau', example: 'plane journey (chuyến đi bằng máy bay), film industry (ngành công nghiệp phim)' },
      { word: 'Quy tắc: Tính từ + Cụm danh từ', mean: 'Tính từ luôn đứng TRƯỚC toàn bộ cụm danh từ', example: 'long plane journey (NOT: plane long journey)' },
      { word: 'Từ nối AND/OR/BUT', mean: 'Hai vế trước và sau and/or/but phải cùng chức năng ngữ pháp', example: 'strong and reliable (adj + adj), quickly and efficiently (adv + adv)' },
    ],
  });

  // Bài 2.2: Trắc nghiệm trật tự từ
  await LessonModel.create({
    courseId: course._id,
    chapterId: ch2._id,
    title: 'Bài 2: Luyện Tập Trắc Nghiệm Trật Tự Từ',
    order: 2,
    type: 'quiz',
    questions: [
      {
        question: 'This book presents a(n) ______ of life in a remote village.',
        options: ['account authentic personal', 'personal authentic account', 'authentic personal account', 'authentic account personal'],
        correctIndex: 2,
        explanation: 'Áp dụng OSASCOMP: Opinion (authentic) + Opinion (personal) + Noun (account) → "authentic personal account". Hai tính từ cùng loại Opinion thì xếp theo thứ tự tự nhiên hơn đứng trước.',
      },
      {
        question: 'The ______ sacrificed everything for his country\'s freedom.',
        options: ['national brave hero', 'brave hero national', 'hero brave national', 'brave national hero'],
        correctIndex: 3,
        explanation: 'Áp dụng OSASCOMP: Opinion (brave) + Origin (national) + Noun (hero) → "brave national hero".',
      },
      {
        question: 'Thanks to advanced technology, the ______ has revolutionized the way movies are made.',
        options: ['film modern industry', 'modern film industry', 'modern industry film', 'industry modern film'],
        correctIndex: 1,
        explanation: '"film industry" là cụm danh từ cố định (danh từ + danh từ). Tính từ "modern" đứng trước cụm danh từ → "modern film industry".',
      },
      {
        question: 'The ______ made it difficult for us to enjoy the rides without waiting in long lines.',
        options: ['crowded park theme', 'theme park crowded', 'crowded theme park', 'theme crowded park'],
        correctIndex: 2,
        explanation: '"theme park" là cụm danh từ cố định. Tính từ "crowded" đứng trước cụm danh từ → "crowded theme park".',
      },
      {
        question: 'Developing ______ helps individuals make better decisions.',
        options: ['independent thinking critical skills', 'critical independent thinking skills', 'critical thinking independent skills', 'independent critical thinking skills'],
        correctIndex: 3,
        explanation: '"critical thinking" là cụm danh từ cố định (tư duy phản biện). Tính từ "independent" đứng trước → "independent critical thinking skills".',
      },
      {
        question: 'The consequences of ______ can be devastating for ecosystems.',
        options: ['uncontrolled illegal hunting', 'uncontrolled hunting illegal', 'illegal hunting uncontrolled', 'hunting uncontrolled illegal'],
        correctIndex: 0,
        explanation: 'Áp dụng OSASCOMP: Opinion (uncontrolled) + Opinion (illegal) + Noun (hunting) → "uncontrolled illegal hunting". Uncontrolled có tính chất nhận xét tổng quát hơn illegal.',
      },
      {
        question: 'Some ______ have started offering healthier options to attract more health-conscious customers.',
        options: ['chains fast food', 'fast food chains', 'food chains fast', 'fast chains food'],
        correctIndex: 1,
        explanation: '"fast food" là cụm danh từ cố định (đồ ăn nhanh). Khi thêm "chains" → "fast food chains" (chuỗi cửa hàng đồ ăn nhanh).',
      },
      {
        question: 'Deforestation has resulted in ______ for countless species.',
        options: ['habitat massive loss', 'loss massive habitat', 'massive loss habitat', 'massive habitat loss'],
        correctIndex: 3,
        explanation: '"habitat loss" là cụm danh từ (mất môi trường sống). Tính từ "massive" đứng trước → "massive habitat loss".',
      },
    ],
  });

  // Bài 2.3: Điền trật tự từ
  await LessonModel.create({
    courseId: course._id,
    chapterId: ch2._id,
    title: 'Bài 3: Điền Cụm Từ Đúng Thứ Tự',
    order: 3,
    type: 'fill_blank',
    fillBlanks: [
      {
        sentence: 'Are these the questions you often ask before a long ___ journey? (plane/airplane)',
        correctAnswer: 'plane',
        hint: '"plane journey" là cụm danh từ. Tính từ "long" đứng trước toàn bộ cụm → long plane journey.',
      },
      {
        sentence: 'In today\'s competitive job market, having strong ___ skills is important. (soft/hard)',
        correctAnswer: 'soft',
        hint: '"soft skills" = kỹ năng mềm. Tính từ "strong" đứng trước cụm danh từ "soft skills".',
      },
      {
        sentence: 'Candidates need to showcase their qualifications during the challenging application ___.',
        correctAnswer: 'process',
        hint: '"application process" = quy trình ứng tuyển. Tính từ "challenging" đứng trước toàn bộ cụm.',
      },
      {
        sentence: 'The government hired a highly experienced urban ___ to design the new area.',
        correctAnswer: 'planner',
        hint: '"urban planner" = nhà quy hoạch đô thị. Các tính từ "highly experienced" đứng trước.',
      },
      {
        sentence: 'A diverse cultural ___ helps people develop respect for others.',
        correctAnswer: 'environment',
        hint: '"cultural environment" = môi trường văn hóa. Tính từ "diverse" đứng trước cụm danh từ.',
      },
    ],
  });

  // ===================================================
  // CHƯƠNG 3: LƯỢNG TỪ & LIÊN TỪ
  // ===================================================
  const ch3 = await ChapterModel.create({
    courseId: course._id,
    title: 'Chương 3: Lượng Từ & Liên Từ',
    description: 'Phân biệt many/much/few/little/another/other và các liên từ thông dụng trong bài thi THPT.',
    order: 3,
    isFree: false,
    totalLessons: 3,
  });

  // Bài 3.1: Flashcard lượng từ
  await LessonModel.create({
    courseId: course._id,
    chapterId: ch3._id,
    title: 'Bài 1: Phân Biệt Lượng Từ Quan Trọng',
    order: 1,
    type: 'flashcard',
    words: [
      { word: 'MANY vs MUCH', mean: 'MANY + danh từ đếm được số nhiều | MUCH + danh từ không đếm được', example: 'Many students / Much water' },
      { word: 'A FEW vs A LITTLE', mean: 'A FEW (một vài) + danh từ đếm được | A LITTLE (một chút) + danh từ không đếm được', example: 'a few friends / a little money' },
      { word: 'FEW vs LITTLE', mean: 'FEW (rất ít, gần như không có) + đếm được | LITTLE (rất ít) + không đếm được. Mang nghĩa tiêu cực!', example: 'Few people know this. / Little time left.' },
      { word: 'A LOT OF / LOTS OF / PLENTY OF', mean: 'Dùng được với cả danh từ đếm được và không đếm được', example: 'a lot of books / a lot of money' },
      { word: 'ANOTHER vs OTHER', mean: 'ANOTHER + danh từ số ÍT (thêm 1 cái khác) | OTHER + danh từ số NHIỀU hoặc không đếm được', example: 'another book / other books / other information' },
      { word: 'THE OTHER vs THE OTHERS', mean: 'THE OTHER: cái còn lại (trong 2 cái) | THE OTHERS: những cái còn lại (trong nhóm nhiều)', example: 'I have 2 cats. One is black, the other is white.' },
      { word: 'MOST vs MOST OF', mean: 'MOST + N (không có "the") | MOST OF + the/tính từ sở hữu + N', example: 'Most students / Most of the students' },
      { word: 'MOSTLY vs ALMOST', mean: 'MOSTLY (chủ yếu là) - trạng từ | ALMOST (gần như) - trạng từ bổ trợ', example: 'The class is mostly girls. / Almost every student passed.' },
      { word: 'EACH vs EVERY', mean: 'EACH (mỗi - xét từng cái riêng lẻ) | EVERY (mọi - xét tập hợp) | Cả hai + danh từ số ÍT', example: 'Each student has a book. / Every day is a new chance.' },
      { word: 'BOTH vs ALL vs NEITHER vs NONE', mean: 'BOTH (cả hai) | ALL (tất cả ≥3) | NEITHER (cả hai đều không) | NONE (không ai trong ≥3)', example: 'Both students passed. All five failed. Neither option works. None of them agreed.' },
      { word: 'EVERY + số đếm + danh từ số nhiều', mean: 'Diễn tả tần suất/khoảng cách đều đặn: "cứ mỗi... một lần"', example: 'Every four minutes a car is stolen. (Cứ 4 phút có 1 xe bị trộm)' },
      { word: 'A NUMBER OF vs THE NUMBER OF', mean: 'A number of + N số nhiều + động từ số nhiều | THE number of + N số nhiều + động từ số ÍT', example: 'A number of students ARE absent. / The number of students IS increasing.' },
    ],
  });

  // Bài 3.2: Trắc nghiệm lượng từ & liên từ
  await LessonModel.create({
    courseId: course._id,
    chapterId: ch3._id,
    title: 'Bài 2: Trắc Nghiệm Lượng Từ & Liên Từ',
    order: 2,
    type: 'quiz',
    questions: [
      {
        question: 'A small _______ of children are educated at home.',
        options: ['deal', 'amount', 'many', 'number'],
        correctIndex: 3,
        explanation: '"number" đi với danh từ đếm được "children" → "a number of children". "deal/amount" dùng với danh từ không đếm được.',
      },
      {
        question: 'You\'ve met Linda, but I have _______ sister who you haven\'t met, called Margaret.',
        options: ['another', 'other', 'others', 'the other'],
        correctIndex: 0,
        explanation: '"another" + danh từ số ÍT (sister) = thêm một người chị/em nữa chưa được nhắc đến.',
      },
      {
        question: 'She has two hats, one is black and _______ is white.',
        options: ['the other', 'the others', 'other', 'others'],
        correctIndex: 0,
        explanation: 'Trong 2 cái (two hats), cái còn lại dùng "the other".',
      },
      {
        question: 'I have four close friends, one of them is a lawyer, and _______ are teachers.',
        options: ['the other', 'the others', 'other', 'others'],
        correctIndex: 1,
        explanation: 'Trong nhóm 4 người, những người còn lại (số nhiều, đã xác định) dùng "the others".',
      },
      {
        question: 'Most artists find it _______ impossible to make a living from art alone.',
        options: ['almost', 'most of', 'hardly', 'whole'],
        correctIndex: 0,
        explanation: '"almost impossible" = gần như không thể. "Almost" bổ trợ cho tính từ "impossible".',
      },
      {
        question: 'We were bitten by mosquitoes _______ every night.',
        options: ['most', 'most of', 'mostly', 'almost'],
        correctIndex: 3,
        explanation: '"almost every night" = hầu như mỗi đêm. "Almost" bổ trợ cho "every".',
      },
      {
        question: 'The police want to interview _______ employee about the theft.',
        options: ['all', 'much', 'many', 'every'],
        correctIndex: 3,
        explanation: '"every" + danh từ đếm được số ÍT (employee) = mỗi nhân viên. "every employee" đúng ngữ pháp.',
      },
      {
        question: '_______ four minutes a car is stolen in this city.',
        options: ['Much', 'Every', 'Either', 'Neither'],
        correctIndex: 1,
        explanation: '"Every + số đếm + danh từ số nhiều" = cứ mỗi... → "Every four minutes" = cứ 4 phút.',
      },
      {
        question: 'In today\'s society, ______ economic struggles, people also face discrimination.',
        options: ['In addition', 'In addition to', 'Moreover', 'Furthermore'],
        correctIndex: 1,
        explanation: '"In addition to" là cụm giới từ, theo sau là danh từ/cụm danh từ "economic struggles". "In addition/Moreover/Furthermore" theo sau là mệnh đề.',
      },
      {
        question: '______ climate change and deforestation are threatening our environment, we must take action.',
        options: ['After', 'Before', 'Since', 'When'],
        correctIndex: 2,
        explanation: '"Since" (vì) diễn tả nguyên nhân-kết quả. Câu mang nghĩa: Vì biến đổi khí hậu đang đe dọa... nên chúng ta phải hành động.',
      },
    ],
  });

  // Bài 3.3: Điền liên từ
  await LessonModel.create({
    courseId: course._id,
    chapterId: ch3._id,
    title: 'Bài 3: Điền Liên Từ Vào Đoạn Văn',
    order: 3,
    type: 'fill_blank',
    fillBlanks: [
      {
        sentence: '___ financial instability, many families struggle to afford basic necessities. (Because/Due to/Although/However)',
        correctAnswer: 'Due to',
        hint: '"Due to" là cụm giới từ chỉ nguyên nhân, theo sau là danh từ "financial instability".',
      },
      {
        sentence: 'As a ___, children from low-income backgrounds lack educational opportunities.',
        correctAnswer: 'result',
        hint: '"As a result" = do đó, kết quả là. Đây là cụm từ nối chỉ kết quả.',
      },
      {
        sentence: '___ various efforts to reduce pollution, industrial activities continue to harm the planet.',
        correctAnswer: 'Despite',
        hint: '"Despite" = mặc dù, theo sau là danh từ/cụm danh từ. = In spite of.',
      },
      {
        sentence: 'Volunteers will plant trees in urban areas ___ that we can improve air quality.',
        correctAnswer: 'so',
        hint: '"so that" = để mà, nhằm mục đích. Diễn tả mục đích.',
      },
      {
        sentence: 'If you care about the planet, join us! ___, future generations will suffer.',
        correctAnswer: 'Otherwise',
        hint: '"Otherwise" = nếu không thì. Diễn tả hậu quả nếu không làm điều đã đề cập.',
      },
      {
        sentence: '___ the sake of future generations, we must take action!',
        correctAnswer: 'For',
        hint: '"For the sake of" = vì lợi ích của. Cụm giới từ chỉ mục đích.',
      },
    ],
  });

  // ===================================================
  // CHƯƠNG 4: TỪ VỰNG THEO NGỮ CẢNH
  // ===================================================
  const ch4 = await ChapterModel.create({
    courseId: course._id,
    title: 'Chương 4: Từ Vựng Theo Ngữ Cảnh',
    description: 'Luyện kỹ năng chọn từ đúng nghĩa theo ngữ cảnh - dạng bài chiếm nhiều điểm trong đề thi THPT.',
    order: 4,
    isFree: false,
    totalLessons: 3,
  });

  // Bài 4.1: Flashcard từ vựng hay nhầm lẫn
  await LessonModel.create({
    courseId: course._id,
    chapterId: ch4._id,
    title: 'Bài 1: Từ Vựng Hay Nhầm Lẫn Trong Đề Thi',
    order: 1,
    type: 'flashcard',
    words: [
      { word: 'industry (n)', mean: 'ngành công nghiệp (≠ company/factory)', example: 'Tourism is one of the fastest-growing industries in Vietnam.' },
      { word: 'campaign (n)', mean: 'chiến dịch, phong trào (marketing/awareness)', example: 'They run marketing campaigns to promote the brand.' },
      { word: 'schedule (n/v)', mean: 'lịch trình, thời gian biểu / sắp xếp lịch', example: 'Please schedule a meeting for next Monday.' },
      { word: 'deadline (n)', mean: 'hạn chót, thời hạn cuối cùng', example: 'The deadline for the project is Friday.' },
      { word: 'demand (n)', mean: 'nhu cầu (thị trường, xã hội)', example: 'There is a high demand for skilled workers.' },
      { word: 'aspects (n)', mean: 'khía cạnh (của một vấn đề)', example: 'Sleep is one of the most important aspects of health.' },
      { word: 'scholarships (n)', mean: 'học bổng (tiền hỗ trợ học tập)', example: 'Many scholarships are granted to outstanding students.' },
      { word: 'domestic (adj)', mean: 'thuộc về gia đình/nội địa (≠ international)', example: 'You will need to learn domestic skills at university.' },
      { word: 'budgeting (n)', mean: 'lập ngân sách, quản lý tài chính', example: 'Budgeting helps you control your spending.' },
      { word: 'victims (n)', mean: 'nạn nhân (của bắt nạt, tội phạm, thiên tai)', example: 'Girls are more likely to be victims of bullying.' },
      { word: 'overcome (v)', mean: 'vượt qua (khó khăn, nỗi sợ, thử thách)', example: 'Positive self-talk can help you overcome your fear.' },
      { word: 'contribute to (v)', mean: 'đóng góp vào, góp phần vào', example: 'Everyone can contribute to environmental protection.' },
      { word: 'capability (n)', mean: 'năng lực, khả năng (của con người)', example: 'The university helps students utilize their full capability.' },
      { word: 'reliable (adj)', mean: 'đáng tin cậy, đáng tin tưởng', example: 'You need a reliable source of information.' },
      { word: 'acquire (v)', mean: 'có được, đạt được (kỹ năng, kiến thức)', example: 'Students acquire academic achievements during their studies.' },
    ],
  });

  // Bài 4.2: Trắc nghiệm từ vựng theo ngữ cảnh
  await LessonModel.create({
    courseId: course._id,
    chapterId: ch4._id,
    title: 'Bài 2: Trắc Nghiệm Từ Vựng Theo Ngữ Cảnh',
    order: 2,
    type: 'quiz',
    questions: [
      {
        question: 'Tourism is getting more important, becoming one of the fastest-growing ________ in Vietnam.',
        options: ['companies', 'industries', 'factories', 'retailers'],
        correctIndex: 1,
        explanation: '"industry" = ngành (công nghiệp, du lịch...). "Tourism industry" = ngành du lịch. Không dùng "company/factory" vì đây nói đến toàn bộ lĩnh vực.',
      },
      {
        question: 'To increase the sales, you need to run marketing ________ to make your company widely known.',
        options: ['slogans', 'campaigns', 'titles', 'logos'],
        correctIndex: 1,
        explanation: '"campaigns" = chiến dịch. "Marketing campaigns" = chiến dịch marketing. "Slogans/logos" là thành phần trong campaign, không phải campaign.',
      },
      {
        question: 'Buy and consume fresh food. This reduces the need for long-distance food ______.',
        options: ['storage', 'transport', 'preservation', 'preparation'],
        correctIndex: 1,
        explanation: 'Từ khóa "long-distance" (đường dài) → liên quan đến "transport" (vận chuyển). Storage/preservation = bảo quản, không liên quan đến khoảng cách.',
      },
      {
        question: 'Sleep is one of the most important ________ of your mental and physical health.',
        options: ['features', 'aspects', 'subjects', 'areas'],
        correctIndex: 1,
        explanation: '"aspects" = khía cạnh. "Aspects of health" = các khía cạnh của sức khỏe. "Aspects" thường dùng khi đề cập đến một phần của chủ đề phức tạp.',
      },
      {
        question: 'When the ________ for skilled workers has risen, our vocational programmes provide practical courses.',
        options: ['pursuit', 'demand', 'interest', 'concern'],
        correctIndex: 1,
        explanation: '"demand for sth" = nhu cầu về cái gì. "Demand for skilled workers" = nhu cầu về công nhân lành nghề. Cụm cố định "demand for".',
      },
      {
        question: 'There are plenty of ________ granted to our students to encourage them to build a sustainable future.',
        options: ['scholarships', 'donations', 'assignments', 'activities'],
        correctIndex: 0,
        explanation: '"scholarships" = học bổng (được trao/granted). "Scholarships are granted" là cách dùng chuẩn. Donations = quyên góp, không được "granted".',
      },
      {
        question: 'Positive self-talk in a crisis is helpful. Telling yourself how brave you are can help you ______ your fear.',
        options: ['overuse', 'overcome', 'overwhelm', 'overtake'],
        correctIndex: 1,
        explanation: '"overcome fear" = vượt qua nỗi sợ. Đây là cụm từ cố định. "Overwhelm" = áp đảo (tiêu cực hơn), "overtake" = vượt qua (về tốc độ/vị trí).',
      },
      {
        question: 'Girls or younger students were more likely to be ________ of bullying.',
        options: ['preys', 'patients', 'sufferers', 'victims'],
        correctIndex: 3,
        explanation: '"victims of bullying" = nạn nhân của bắt nạt. Cụm cố định "be a victim of". "Sufferers" thường dùng cho bệnh tật.',
      },
    ],
  });

  // Bài 4.3: Điền từ vựng
  await LessonModel.create({
    courseId: course._id,
    chapterId: ch4._id,
    title: 'Bài 3: Điền Từ Vựng Vào Đoạn Văn Thực Tế',
    order: 3,
    type: 'fill_blank',
    fillBlanks: [
      {
        sentence: 'You will need to learn ___ skills. Your parents won\'t be there to cook or wash clothes for you.',
        correctAnswer: 'domestic',
        hint: '"Domestic skills" = kỹ năng gia đình (nấu ăn, giặt giũ...). Domestic = thuộc về nhà/gia đình.',
      },
      {
        sentence: 'At university, you\'ll probably have ___ to complete essays so time management is important.',
        correctAnswer: 'deadlines',
        hint: '"Deadlines" = hạn chót nộp bài. "Have deadlines" = có hạn chót cần hoàn thành.',
      },
      {
        sentence: 'Another skill students need is ___ to make sure to have enough money for food and books.',
        correctAnswer: 'budgeting',
        hint: '"Budgeting" = quản lý ngân sách/tài chính. "Budgeting skills" = kỹ năng quản lý tiền.',
      },
      {
        sentence: 'Building ___ is an important life skill. Join a society to make friends easier.',
        correctAnswer: 'relationships',
        hint: '"Building relationships" = xây dựng các mối quan hệ. Đây là cụm từ thông dụng.',
      },
      {
        sentence: 'The reason for the rapid development of tourism is an increasing ___ of foreign visitors.',
        correctAnswer: 'number',
        hint: '"A number of" + danh từ đếm được (visitors = người). "An increasing number of" = số lượng ngày càng tăng.',
      },
    ],
  });

  // ===================================================
  // CHƯƠNG 5: MỆNH ĐỀ QUAN HỆ & ĐỌC HIỂU
  // ===================================================
  const ch5 = await ChapterModel.create({
    courseId: course._id,
    title: 'Chương 5: Mệnh Đề Quan Hệ & Kỹ Năng Đọc Hiểu',
    description: 'Nắm vững mệnh đề quan hệ (who, which, that, whose, where, when) và các chiến thuật làm bài đọc hiểu đạt điểm cao.',
    order: 5,
    isFree: false,
    totalLessons: 3,
  });

  // Bài 5.1: Flashcard mệnh đề quan hệ
  await LessonModel.create({
    courseId: course._id,
    chapterId: ch5._id,
    title: 'Bài 1: Đại Từ Quan Hệ & Trạng Từ Quan Hệ',
    order: 1,
    type: 'flashcard',
    words: [
      { word: 'WHO', mean: 'Thay thế cho người (chủ ngữ hoặc tân ngữ)', example: 'The teacher WHO teaches us is very kind. (WHO = chủ ngữ)' },
      { word: 'WHOM', mean: 'Thay thế cho người (chỉ dùng làm TÂN NGỮ, trang trọng hơn WHO)', example: 'The student WHOM I met yesterday is my neighbor.' },
      { word: 'WHICH', mean: 'Thay thế cho vật, con vật, sự việc', example: 'The book WHICH I bought is very interesting.' },
      { word: 'THAT', mean: 'Thay thế cho người HOẶC vật (không dùng sau dấu phẩy)', example: 'The car THAT I bought is expensive.' },
      { word: 'WHOSE', mean: 'Thể hiện sở hữu (của ai/cái gì)', example: 'The student WHOSE father is a doctor won the prize.' },
      { word: 'WHERE', mean: 'Trạng từ quan hệ - thay thế cho nơi chốn', example: 'The city WHERE I was born is beautiful.' },
      { word: 'WHEN', mean: 'Trạng từ quan hệ - thay thế cho thời gian', example: 'I remember the day WHEN we first met.' },
      { word: 'WHY', mean: 'Trạng từ quan hệ - thay thế cho "the reason"', example: 'That is the reason WHY he was late.' },
      { word: 'Mệnh đề quan hệ XÁC ĐỊNH', mean: 'Không có dấu phẩy. Cần thiết để xác định danh từ đứng trước.', example: 'The woman WHO called you is my sister. (Không phân biệt được bà nào nếu bỏ mệnh đề)' },
      { word: 'Mệnh đề quan hệ KHÔNG XÁC ĐỊNH', mean: 'Có dấu phẩy. Chỉ bổ sung thêm thông tin. Không dùng THAT.', example: 'My sister, WHO is a doctor, lives in Hanoi. (Đã biết đó là ai, chỉ thêm thông tin)' },
      { word: 'Rút gọn mệnh đề quan hệ - V-ing', mean: 'Rút gọn khi đại từ quan hệ là chủ ngữ → dùng V-ing (chủ động)', example: 'The man WHO is standing there → The man STANDING there.' },
      { word: 'Rút gọn mệnh đề quan hệ - V-ed', mean: 'Rút gọn khi đại từ quan hệ là chủ ngữ → dùng V-ed (bị động)', example: 'The book WHICH was written by Tolstoy → The book WRITTEN by Tolstoy.' },
    ],
  });

  // Bài 5.2: Trắc nghiệm mệnh đề quan hệ
  await LessonModel.create({
    courseId: course._id,
    chapterId: ch5._id,
    title: 'Bài 2: Trắc Nghiệm Mệnh Đề Quan Hệ',
    order: 2,
    type: 'quiz',
    questions: [
      {
        question: 'The scientist ______ discovered penicillin was Alexander Fleming.',
        options: ['who', 'which', 'whose', 'whom'],
        correctIndex: 0,
        explanation: '"who" thay thế cho người (scientist) làm chủ ngữ của mệnh đề quan hệ (discovered).',
      },
      {
        question: 'The book ______ you recommended to me was excellent.',
        options: ['who', 'which', 'whose', 'when'],
        correctIndex: 1,
        explanation: '"which" thay thế cho vật (book). "who" chỉ dùng cho người.',
      },
      {
        question: 'The student ______ parents are both doctors studies very hard.',
        options: ['who', 'which', 'whose', 'whom'],
        correctIndex: 2,
        explanation: '"whose" thể hiện sở hữu: "whose parents" = cha mẹ của học sinh đó.',
      },
      {
        question: 'Paris is the city ______ I have always wanted to visit.',
        options: ['which', 'where', 'when', 'that'],
        correctIndex: 3,
        explanation: 'Sau "the city" + mệnh đề quan hệ bổ sung → dùng "that" hoặc "which". "That" đúng vì không có dấu phẩy và thay cho tân ngữ "the city" sau "visit".',
      },
      {
        question: 'The 1990s was the decade ______ the Internet became widely used.',
        options: ['which', 'where', 'when', 'whose'],
        correctIndex: 2,
        explanation: '"when" = trạng từ quan hệ thay thế cho thời gian "the decade".',
      },
      {
        question: 'The company, ______ was founded in 1990, is now the largest in Asia.',
        options: ['that', 'who', 'which', 'whose'],
        correctIndex: 2,
        explanation: 'Mệnh đề quan hệ không xác định (có dấu phẩy) → không dùng "that". Thay thế cho vật (company) → dùng "which".',
      },
      {
        question: 'The woman ______ is talking to your father is my teacher.',
        options: ['who', 'that', 'both A and B', 'which'],
        correctIndex: 2,
        explanation: 'Cả "who" và "that" đều đúng trong mệnh đề quan hệ xác định thay thế cho người làm chủ ngữ.',
      },
      {
        question: 'The report ______ by the committee was very detailed.',
        options: ['writing', 'written', 'wrote', 'to write'],
        correctIndex: 1,
        explanation: 'Rút gọn mệnh đề quan hệ bị động: "which was written" → "written". Dùng V-ed (quá khứ phân từ) khi bị động.',
      },
    ],
  });

  // Bài 5.3: Điền từ mệnh đề quan hệ
  await LessonModel.create({
    courseId: course._id,
    chapterId: ch5._id,
    title: 'Bài 3: Điền Từ Mệnh Đề Quan Hệ & Tổng Ôn',
    order: 3,
    type: 'fill_blank',
    fillBlanks: [
      {
        sentence: 'The man ___ called you yesterday is my uncle. (who/which/whose/whom)',
        correctAnswer: 'who',
        hint: '"who" thay thế cho người (man) làm chủ ngữ của mệnh đề quan hệ.',
      },
      {
        sentence: 'That is the reason ___ he decided to quit his job.',
        correctAnswer: 'why',
        hint: '"why" là trạng từ quan hệ, thay thế cho "the reason".',
      },
      {
        sentence: 'The village ___ I was born no longer exists.',
        correctAnswer: 'where',
        hint: '"where" là trạng từ quan hệ, thay thế cho nơi chốn (village).',
      },
      {
        sentence: 'My brother, ___ works in London, is visiting us next week.',
        correctAnswer: 'who',
        hint: 'Mệnh đề không xác định (có dấu phẩy), thay cho người → "who" (không dùng "that" sau dấu phẩy).',
      },
      {
        sentence: 'The laptop ___ in 2019 is still working perfectly. (bought/buying/buy/to buy)',
        correctAnswer: 'bought',
        hint: 'Rút gọn mệnh đề quan hệ bị động: "which was bought" → "bought" (V-ed).',
      },
      {
        sentence: 'Students ___ in the program will receive a certificate. (participating/participated/participate/to participate)',
        correctAnswer: 'participating',
        hint: 'Rút gọn mệnh đề quan hệ chủ động: "who are participating" → "participating" (V-ing).',
      },
    ],
  });

  console.log('📚 Đã tạo đầy đủ 5 chương, 15 bài học');

  // ===== ENROLLMENT =====
  for (let i = 0; i < 3; i++) {
    await EnrollmentModel.create({
      courseId: course._id,
      studentAccountId: studentAccounts[i]._id,
      studentName: studentUsers[i].name,
      status: 'active',
      paymentStatus: 'free',
      progressPercent: [45, 80, 20][i],
      completedLessons: [7, 12, 3][i],
      totalLessons: 15,
      enrolledAt: new Date(Date.now() - [10, 20, 3][i] * 24 * 3600 * 1000),
    });
  }

  // Thêm progress chi tiết cho học sinh 2 (đã học 80%)
  const ch1Lessons = await LessonModel.find({ chapterId: ch1._id });
  const ch2Lessons = await LessonModel.find({ chapterId: ch2._id });
  const ch3Lessons = await LessonModel.find({ chapterId: ch3._id });
  const doneLessons = [...ch1Lessons, ...ch2Lessons, ...ch3Lessons];

  for (const lesson of doneLessons) {
    await LessonProgressModel.create({
      lessonId: lesson._id,
      courseId: course._id,
      studentAccountId: studentAccounts[1]._id,
      status: 'completed',
      score: Math.floor(Math.random() * 3) + 7,
      maxScore: 10,
      correctCount: Math.floor(Math.random() * 3) + 7,
      totalCount: 10,
      completedAt: new Date(),
    });
  }

  console.log('🎓 Đã tạo enrollment và tiến độ học');

  console.log('\n✅ SEED THPT HOÀN THÀNH!\n');
  console.log('============================================');
  console.log('📧 TÀI KHOẢN DEMO:');
  console.log('  👩‍🏫 Giáo viên: giaovien@thpt.com / 123456');
  console.log('  🎓 Học sinh 1: hocsinh1@thpt.com / 123456');
  console.log('  🎓 Học sinh 2: hocsinh2@thpt.com / 123456');
  console.log('  🎓 Học sinh 3: hocsinh3@thpt.com / 123456');
  console.log('============================================');
  console.log('📚 KHÓA HỌC:');
  console.log('  Trọng Tâm Kiến Thức Ôn Thi THPT QG Tiếng Anh');
  console.log('  ✅ Chương 1: Từ Loại (3 bài - MIỄN PHÍ)');
  console.log('  ✅ Chương 2: Trật Tự Từ OSASCOMP (3 bài)');
  console.log('  ✅ Chương 3: Lượng Từ & Liên Từ (3 bài)');
  console.log('  ✅ Chương 4: Từ Vựng Theo Ngữ Cảnh (3 bài)');
  console.log('  ✅ Chương 5: Mệnh Đề Quan Hệ & Đọc Hiểu (3 bài)');
  console.log('============================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ LỖI:', err);
  process.exit(1);
});
