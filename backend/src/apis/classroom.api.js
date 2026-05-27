const classroomApi = require('express').Router();
const classroomController = require('../controllers/classroom.controller');

classroomApi.get('/', classroomController.getMyClassrooms);
classroomApi.post('/', classroomController.createClassroom);
classroomApi.put('/:id', classroomController.updateClassroom);
classroomApi.delete('/:id', classroomController.deleteClassroom);

module.exports = classroomApi;