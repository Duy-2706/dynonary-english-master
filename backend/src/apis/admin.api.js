const adminApi = require('express').Router();
const adminController = require('../controllers/admin.controller');
const { jwtAuthentication, requireRole } = require('../middlewares/passport.middleware');


const adminOnly = [jwtAuthentication, requireRole('admin')];

adminApi.get('/users', ...adminOnly, adminController.getUsers);
adminApi.put('/users/:id/role', ...adminOnly, adminController.updateUserRole);
adminApi.get('/stats', ...adminOnly, adminController.getSystemStats);
adminApi.get('/stats/courses', ...adminOnly, adminController.getCourseStats);
adminApi.get('/stats/games', ...adminOnly, adminController.getGameStats);
adminApi.post('/track/course-view/:courseId', jwtAuthentication, adminController.trackCourseView);

adminApi.post('/seed-grammar', ...adminOnly, adminController.seedGrammarTenses);
module.exports = adminApi;
