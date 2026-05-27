const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonProgressSchema = new Schema({
  lessonId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'lesson',
  },
  courseId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'course',
  },
  studentAccountId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'account',
  },
  // Trạng thái học bài
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started',
  },
  // Kết quả làm bài tập
  score: { type: Number, default: 0 },        // điểm đạt được
  maxScore: { type: Number, default: 0 },      // điểm tối đa
  correctCount: { type: Number, default: 0 },  // số câu đúng
  totalCount: { type: Number, default: 0 },    // tổng số câu
  // Từ vựng đã biết/chưa biết (cho flashcard)
  knownWords: [String],
  unknownWords: [String],

  startedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  updatedAt: { type: Date, default: Date.now },
});

lessonProgressSchema.index(
  { lessonId: 1, studentAccountId: 1 },
  { unique: true },
);

module.exports = mongoose.model(
  'lessonProgress',
  lessonProgressSchema,
  'lessonProgress',
);