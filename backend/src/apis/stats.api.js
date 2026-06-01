const statsApi = require('express').Router();
const statsController = require('../controllers/stats.controller');
const { jwtAuthentication, requireRole } = require('../middlewares/passport.middleware');

statsApi.get('/student', jwtAuthentication, statsController.getStudentStats);
statsApi.get('/teacher', jwtAuthentication, requireRole('teacher', 'admin'), statsController.getTeacherStats);

module.exports = statsApi;
