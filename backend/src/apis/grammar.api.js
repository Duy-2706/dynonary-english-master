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

module.exports = grammarApi;
