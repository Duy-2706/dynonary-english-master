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

exports.updateTeacher = async (req, res) => {
  try {
    const { name, subject } = req.body;
    const user = await adminService.updateTeacher(req.params.id, { name, subject });
    return res.status(200).json({ user });
  } catch (error) {
    if (error.message.includes('tồn tại') || error.message.includes('giáo viên')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    await adminService.deleteTeacher(req.params.id, req.user.accountId);
    return res.status(200).json({ ok: true });
  } catch (error) {
    if (error.message.includes('tồn tại') || error.message.includes('giáo viên') || error.message.includes('chính mình')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};


exports.createTeachers = async (req, res) => {
  try {
    const { teachers } = req.body;
    if (!Array.isArray(teachers) || teachers.length === 0) {
      return res.status(400).json({ message: 'Danh sách giáo viên không hợp lệ' });
    }
    const results = await adminService.adminCreateTeachers(teachers);
    return res.status(200).json({ results });
  } catch (error) {
    console.error('ADMIN CREATE TEACHERS ERROR:', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.createStudents = async (req, res) => {
  try {
    const { students, classroomId, classroomName } = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: 'Danh sách học sinh không hợp lệ' });
    }
    const results = await adminService.adminCreateStudents(students, classroomId || '', classroomName || '');
    return res.status(200).json({ results });
  } catch (error) {
    console.error('ADMIN CREATE STUDENTS ERROR:', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.getClassrooms = async (req, res) => {
  try {
    const classrooms = await adminService.getAdminClassrooms();
    return res.status(200).json({ classrooms });
  } catch (error) {
    console.error('ADMIN GET CLASSROOMS ERROR:', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.createClassroom = async (req, res) => {
  try {
    const { name, grade, teacherAccountId, teacherName } = req.body;
    if (!name) return res.status(400).json({ message: 'Tên lớp không được để trống' });
    const classroom = await adminService.adminCreateClassroom({ name, grade, teacherAccountId, teacherName });
    return res.status(200).json({ classroom });
  } catch (error) {
    console.error('ADMIN CREATE CLASSROOM ERROR:', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.lockUser = async (req, res) => {
  try {
    await adminService.lockUser(req.params.id, req.user.accountId);

    return res.status(200).json({
      message: 'Khóa tài khoản thành công',
    });
  } catch (error) {
    if (
      error.message.includes('tồn tại') ||
      error.message.includes('chính mình')
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error('ADMIN LOCK USER ERROR:', error);

    return res.status(503).json({
      message: 'Lỗi dịch vụ',
    });
  }
};

exports.unlockUser = async (req, res) => {
  try {
    await adminService.unlockUser(req.params.id, req.user.accountId);

    return res.status(200).json({
      message: 'Mở khóa tài khoản thành công',
    });
  } catch (error) {
    if (
      error.message.includes('tồn tại') ||
      error.message.includes('chính mình')
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error('ADMIN UNLOCK USER ERROR:', error);

    return res.status(503).json({
      message: 'Lỗi dịch vụ',
    });
  }
};
