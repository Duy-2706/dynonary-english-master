const grammarService = require('../services/grammar.service');

exports.getLessons = async (req, res) => {
  try {
    const { gradeLevel, topic, module: mod, status = 'published', year, month, weekNumber } = req.query;
    const lessons = await grammarService.getLessons({ status, gradeLevel, topic, module: mod, year, month, weekNumber });
    return res.status(200).json({ lessons });
  } catch (error) {
    console.error('GET GRAMMAR LESSONS ERROR:', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.getMyLessons = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const lessons = await grammarService.getLessons({ teacherAccountId: req.user.accountId });
    return res.status(200).json({ lessons });
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.getLesson = async (req, res) => {
  try {
    const lesson = await grammarService.getLessonById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Không tìm thấy bài học' });
    return res.status(200).json({ lesson });
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.createLesson = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const lesson = await grammarService.createLesson(req.user.accountId, req.user.name, req.body);
    return res.status(201).json({ lesson });
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const lesson = await grammarService.updateLesson(req.params.id, req.user.accountId, req.body);
    return res.status(200).json({ lesson });
  } catch (error) {
    if (error.message === 'Không có quyền') return res.status(403).json({ message: error.message });
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    await grammarService.deleteLesson(req.params.id, req.user.accountId);
    return res.status(200).json({ ok: true });
  } catch (error) {
    if (error.message === 'Không có quyền') return res.status(403).json({ message: error.message });
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.submitProgress = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const result = await grammarService.submitProgress(req.params.id, req.user.accountId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.getTopics = async (req, res) => {
  try {
    const topics = await grammarService.getTopics();
    return res.status(200).json({ topics });
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const assignment = await grammarService.createAssignment(req.user.accountId, req.user.name || '', req.body);
    return res.status(201).json({ assignment });
  } catch (error) {
    console.error('CREATE ASSIGNMENT ERROR:', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.getTeacherAssignments = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const assignments = await grammarService.getTeacherAssignments(req.user.accountId);
    return res.status(200).json({ assignments });
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.getClassroomAssignments = async (req, res) => {
  try {
    const assignments = await grammarService.getClassroomAssignments(req.params.classroomId);
    return res.status(200).json({ assignments });
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const assignment = await grammarService.updateAssignment(req.params.id, req.user.accountId, req.body);
    return res.status(200).json({ assignment });
  } catch (error) {
    if (error.message === 'Không có quyền') return res.status(403).json({ message: error.message });
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    await grammarService.deleteAssignment(req.params.id, req.user.accountId);
    return res.status(200).json({ ok: true });
  } catch (error) {
    if (error.message === 'Không có quyền') return res.status(403).json({ message: error.message });
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const result = await grammarService.submitAssignment(
      req.params.id,
      req.user.accountId,
      req.body.studentName || req.user.name || '',
      req.body,
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.getAssignmentSubmissions = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const submissions = await grammarService.getAssignmentSubmissions(req.params.id, req.user.accountId);
    return res.status(200).json({ submissions });
  } catch (error) {
    if (error.message === 'Không có quyền') return res.status(403).json({ message: error.message });
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const submissions = await grammarService.getMySubmissions(req.user.accountId);
    return res.status(200).json({ submissions });
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};