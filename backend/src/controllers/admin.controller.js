const adminService = require('../services/admin.service');

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const result = await adminService.getUsers(Number(page), Number(limit), search);
    return res.status(200).json(result);
  } catch (error) {
    console.error('ADMIN GET USERS ERROR:', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await adminService.updateUserRole(req.params.id, role, req.user.accountId);
    return res.status(200).json({ user });
  } catch (error) {
    if (error.message.includes('chính mình') || error.message.includes('hợp lệ') || error.message.includes('tồn tại')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.getSystemStats = async (req, res) => {
  try {
    const stats = await adminService.getSystemStats();
    return res.status(200).json({ stats });
  } catch (error) {
    console.error('ADMIN STATS ERROR:', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.getCourseStats = async (req, res) => {
  try {
    const stats = await adminService.getCourseStats();
    return res.status(200).json({ stats });
  } catch (error) {
    console.error('ADMIN COURSE STATS ERROR:', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.getGameStats = async (req, res) => {
  try {
    const stats = await adminService.getGameStats();
    return res.status(200).json({ stats });
  } catch (error) {
    console.error('ADMIN GAME STATS ERROR:', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.trackCourseView = async (req, res) => {
  await adminService.trackCourseView(req.params.courseId);
  return res.status(200).json({ ok: true });
};


exports.seedGrammarTenses = async (req, res) => {
  try {
    const result = await adminService.seedGrammarTenses();
    return res.status(200).json(result);
  } catch (error) {
    console.error('ADMIN SEED GRAMMAR ERROR:', error);
    return res.status(503).json({ message: 'Lỗi khi tạo dữ liệu mẫu' });
  }
};