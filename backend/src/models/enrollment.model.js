const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrollmentSchema = new Schema({
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
  studentName: { type: String, default: '' },
  // Trạng thái đăng ký
    status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'active',
    },
  // Thanh toán
    paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'free', 'refunded'],
    default: 'free',
    },
  paidAmount: { type: Number, default: 0 },
  // Tiến độ tổng
  progressPercent: { type: Number, default: 0 },
  completedLessons: { type: Number, default: 0 },
  totalLessons: { type: Number, default: 0 },

  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
});

// Mỗi học viên chỉ đăng ký 1 lần / 1 khóa
enrollmentSchema.index({ courseId: 1, studentAccountId: 1 }, { unique: true });

module.exports = mongoose.model('enrollment', enrollmentSchema, 'enrollments');