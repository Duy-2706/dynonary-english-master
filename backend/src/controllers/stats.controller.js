const statsService = require('../services/stats.service');

exports.getStudentStats = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const stats = await statsService.getStudentStats(req.user.accountId);
    return res.status(200).json({ stats });
  } catch (error) {
    console.error('STUDENT STATS ERROR:', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.getTeacherStats = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const stats = await statsService.getTeacherStats(req.user.accountId);
    return res.status(200).json({ stats });
  } catch (error) {
    console.error('TEACHER STATS ERROR:', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};
