const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question: { type: String, required: true },
  options: [String],
  correctIndex: { type: Number, required: true },
  explanation: { type: String, default: '' },
});

const lessonWordSchema = new Schema({
  word: { type: String, required: true },
  mean: { type: String, required: true },
  phonetic: { type: String, default: '' },
  picture: { type: String, default: '' },
  example: { type: String, default: '' },
});

const fillBlankSchema = new Schema({
  sentence: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  hint: { type: String, default: '' },
});

// Tài liệu đính kèm
const materialSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' }, // nội dung HTML/text
  fileUrl: { type: String, default: '' }, // link file
});

const lessonSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, required: true, ref: 'course' },
  chapterId: { type: Schema.Types.ObjectId, required: true, ref: 'chapter' },
  title: { type: String, required: true, trim: true, maxLength: 150 },
  order: { type: Number, required: true, default: 1 },
  type: {
    type: String,
    enum: ['video', 'flashcard', 'quiz', 'fill_blank', 'text', 'mixed'],
    default: 'video',
  },

  // ===== NỘI DUNG =====
  // Video YouTube (embed URL)
  videoUrl: { type: String, default: '' },
  // Lý thuyết HTML hiển thị trước khi làm bài
  content: { type: String, default: '' },
  // Tài liệu đính kèm
  materials: [materialSchema],

  // ===== BÀI TẬP =====
  words: [lessonWordSchema],
  questions: [questionSchema],
  fillBlanks: [fillBlankSchema],

  // Bài có video không cần làm bài tập thì set hasExercise = false
  hasExercise: { type: Boolean, default: true },
  // Bài demo miễn phí
  isFree: { type: Boolean, default: false },
  timeLimit: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('lesson', lessonSchema, 'lessons');