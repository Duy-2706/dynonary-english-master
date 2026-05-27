const ClassroomModel = require('../models/classroom.model');

function generateClassCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

exports.createClassroom = async (teacher, data) => {
  const { name, description = '', level = 'A1' } = data;

  let classCode = generateClassCode();
  let exists = await ClassroomModel.exists({ classCode });

  while (exists) {
    classCode = generateClassCode();
    exists = await ClassroomModel.exists({ classCode });
  }

  const classroom = await ClassroomModel.create({
    teacherAccountId: teacher.accountId,
    teacherUsername: teacher.username,
    name,
    description,
    level,
    classCode,
  });

  return classroom;
};

exports.getMyClassrooms = async (teacher) => {
  return await ClassroomModel.find({
    teacherAccountId: teacher.accountId,
  }).sort({ createdAt: -1 });
};

exports.updateClassroom = async (teacher, classroomId, data) => {
  const { name, description, level, status } = data;

  const updated = await ClassroomModel.findOneAndUpdate(
    {
      _id: classroomId,
      teacherAccountId: teacher.accountId,
    },
    {
      name,
      description,
      level,
      status,
      updatedAt: new Date(),
    },
    { new: true },
  );

  return updated;
};

exports.deleteClassroom = async (teacher, classroomId) => {
  return await ClassroomModel.deleteOne({
    _id: classroomId,
    teacherAccountId: teacher.accountId,
  });
};