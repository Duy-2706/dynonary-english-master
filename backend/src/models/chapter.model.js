const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chapterSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'course',
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 150,
  },
  description: {
    type: String,
    trim: true,
    maxLength: 500,
    default: '',
  },
  order: {
    type: Number,
    required: true,
    default: 1,
  },
  // Bài học đầu tiên miễn phí, còn lại phải mua
  isFree: {
    type: Boolean,
    default: false,
  },
  totalLessons: {
    type: Number,
    default: 0,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('chapter', chapterSchema, 'chapters');