const grammarApi = require('express').Router();
const grammarController = require('../controllers/grammar.controller');
const { jwtAuthentication, requireRole } = require('../middlewares/passport.middleware');

// Public
grammarApi.get('/lessons', grammarController.getLessons);
grammarApi.get('/topics', grammarController.getTopics);
grammarApi.get('/lessons/:id', grammarController.getLesson);

// Teacher / Admin
grammarApi.get('/my-lessons', jwtAuthentication, grammarController.getMyLessons);
// grammarApi.post('/lessons', jwtAuthentication, requireRole('teacher', 'admin'), grammarController.createLesson);
// grammarApi.put('/lessons/:id', jwtAuthentication, requireRole('teacher', 'admin'), grammarController.updateLesson);
// grammarApi.delete('/lessons/:id', jwtAuthentication, requireRole('teacher', 'admin'), grammarController.deleteLesson);
grammarApi.post('/lessons', jwtAuthentication, grammarController.createLesson);
grammarApi.put('/lessons/:id', jwtAuthentication, grammarController.updateLesson);
grammarApi.delete('/lessons/:id', jwtAuthentication, grammarController.deleteLesson);

// Student progress
grammarApi.post('/lessons/:id/progress', jwtAuthentication, grammarController.submitProgress);

// Assignments – teacher CRUD
grammarApi.post('/assignments', jwtAuthentication, grammarController.createAssignment);
grammarApi.get('/assignments/mine', jwtAuthentication, grammarController.getTeacherAssignments);
grammarApi.put('/assignments/:id', jwtAuthentication, grammarController.updateAssignment);
grammarApi.delete('/assignments/:id', jwtAuthentication, grammarController.deleteAssignment);
grammarApi.get('/assignments/:id/submissions', jwtAuthentication, grammarController.getAssignmentSubmissions);

// Assignments – student
grammarApi.get('/assignments/classroom/:classroomId', jwtAuthentication, grammarController.getClassroomAssignments);
grammarApi.post('/assignments/:id/submit', jwtAuthentication, grammarController.submitAssignment);
grammarApi.get('/submissions/mine', jwtAuthentication, grammarController.getMySubmissions);

// Lesson-linked classroom assignments (shown inside lesson detail)
grammarApi.get('/lessons/:lessonId/classroom-assignments/:classroomId', grammarController.getLessonClassroomAssignments);

module.exports = grammarApi;
