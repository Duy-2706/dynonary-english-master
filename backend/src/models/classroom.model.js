const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classroomSchema = new Schema({
  teacherAccountId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'account',
  },

  teacherUsername: {
    type: String,
    required: true,
    trim: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 80,
  },

  description: {
    type: String,
    trim: true,
    maxLength: 300,
    default: '',
  },

  level: {
    type: String,
    enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Khác'],
    default: 'A1',
  },

  classCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },

  students: [
    {
      accountId: {
        type: Schema.Types.ObjectId,
        ref: 'account',
      },
      username: String,
      name: String,
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ClassroomModel = mongoose.model('classroom', classroomSchema, 'classrooms');

module.exports = ClassroomModel;