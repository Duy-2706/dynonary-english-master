const classroomApi = require('express').Router();
const classroomController = require('../controllers/classroom.controller');
const vocabSetController = require('../controllers/vocabSet.controller');

classroomApi.get('/', classroomController.getMyClassrooms);
classroomApi.post('/', classroomController.createClassroom);
classroomApi.put('/:id', classroomController.updateClassroom);
classroomApi.delete('/:id', classroomController.deleteClassroom);
classroomApi.get('/:id/activity', classroomController.getActivity);
classroomApi.get('/:id/weekly-report', classroomController.getWeeklyReport);
classroomApi.post('/:id/weekly-evaluation', classroomController.upsertWeeklyEvaluation);
classroomApi.get('/:id', classroomController.getClassroomById);
classroomApi.get('/:id/vocab-sets', vocabSetController.getClassroomVocabSets);


module.exports = classroomApi;