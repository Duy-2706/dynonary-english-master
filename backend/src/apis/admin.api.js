const adminApi = require('express').Router();
const adminController = require('../controllers/admin.controller');
const { jwtAuthentication, requireRole } = require('../middlewares/passport.middleware');


const adminOnly = [jwtAuthentication, requireRole('admin')];

adminApi.get('/users', ...adminOnly, adminController.getUsers);
adminApi.put('/users/:id/role', ...adminOnly, adminController.updateUserRole);
adminApi.get('/stats', ...adminOnly, adminController.getSystemStats);

adminApi.post('/seed-grammar', ...adminOnly, adminController.seedGrammarTenses);
module.exports = adminApi;
