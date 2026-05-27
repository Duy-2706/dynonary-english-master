const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  // Thông tin cơ bản
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 150,
  },
  description: {
    type: String,
    trim: true,
    maxLength: 1000,
    default: '',
  },
  thumbnail: {
    type: String,
    default: '',
  },
  level: {
    type: String,
    enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Tất cả'],
    default: 'A1',
  },
  // Giáo viên tạo khóa
  teacherAccountId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'account',
  },
  teacherName: {
    type: String,
    required: true,
    trim: true,
  },
  // Giá & trạng thái
  price: {
    type: Number,
    default: 0, // 0 = miễn phí
    min: 0,
  },
  isFree: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  // Thống kê
  totalStudents: {
    type: Number,
    default: 0,
  },
  totalChapters: {
    type: Number,
    default: 0,
  },
  totalLessons: {
    type: Number,
    default: 0,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('course', courseSchema, 'courses');