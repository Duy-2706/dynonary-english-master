const courseService = require('../services/course.service');

function checkAuth(req, res) {
  if (!res.locals.isAuth || !req.user) {
    res.status(401).json({ message: 'Ban can dang nhap.' });
    return false;
  }
  return true;
}

// ===== COURSE =====
exports.createCourse = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const course = await courseService.createCourse(req.user, req.body);
    return res.status(200).json({ message: 'Tao khoa hoc thanh cong.', course });
  } catch (error) {
    console.error('createCourse error:', error.message);
    return res.status(500).json({ message: 'Loi tao khoa hoc.' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const course = await courseService.updateCourse(req.params.id, req.user.accountId, req.body);
    if (!course) return res.status(404).json({ message: 'Khong tim thay khoa hoc.' });
    return res.status(200).json({ message: 'Cap nhat thanh cong.', course });
  } catch (error) {
    console.error('updateCourse error:', error.message);
    return res.status(500).json({ message: 'Loi cap nhat.' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    await courseService.deleteCourse(req.params.id, req.user.accountId);
    return res.status(200).json({ message: 'Xoa khoa hoc thanh cong.' });
  } catch (error) {
    console.error('deleteCourse error:', error.message);
    return res.status(500).json({ message: 'Loi xoa.' });
  }
};

exports.getTeacherCourses = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const courses = await courseService.getTeacherCourses(req.user.accountId);
    return res.status(200).json({ courses });
  } catch (error) {
    console.error('getTeacherCourses error:', error.message);
    return res.status(500).json({ message: 'Loi lay danh sach.' });
  }
};

exports.getPublishedCourses = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const data = await courseService.getPublishedCourses(parseInt(page), parseInt(limit));
    return res.status(200).json(data);
  } catch (error) {
    console.error('getPublishedCourses error:', error.message);
    return res.status(500).json({ message: 'Loi lay danh sach.' });
  }
};

exports.getCourseDetail = async (req, res) => {
  try {
    const course = await courseService.getCourseDetail(req.params.id);
    if (!course) return res.status(404).json({ message: 'Khong tim thay khoa hoc.' });
    return res.status(200).json({ course });
  } catch (error) {
    console.error('getCourseDetail error:', error.message);
    return res.status(500).json({ message: 'Loi lay chi tiet.' });
  }
};

// ===== CHAPTER =====
exports.createChapter = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const chapter = await courseService.createChapter(req.params.courseId, req.user.accountId, req.body);
    if (!chapter) return res.status(403).json({ message: 'Khong co quyen.' });
    return res.status(200).json({ message: 'Tao chuong thanh cong.', chapter });
  } catch (error) {
    console.error('createChapter error:', error.message);
    return res.status(500).json({ message: 'Loi tao chuong.' });
  }
};

exports.updateChapter = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const chapter = await courseService.updateChapter(req.params.id, req.params.courseId, req.user.accountId, req.body);
    if (!chapter) return res.status(404).json({ message: 'Khong tim thay chuong.' });
    return res.status(200).json({ message: 'Cap nhat chuong thanh cong.', chapter });
  } catch (error) {
    console.error('updateChapter error:', error.message);
    return res.status(500).json({ message: 'Loi cap nhat chuong.' });
  }
};

exports.deleteChapter = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    await courseService.deleteChapter(req.params.id, req.params.courseId, req.user.accountId);
    return res.status(200).json({ message: 'Xoa chuong thanh cong.' });
  } catch (error) {
    console.error('deleteChapter error:', error.message);
    return res.status(500).json({ message: 'Loi xoa chuong.' });
  }
};

// ===== LESSON =====
exports.createLesson = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const lesson = await courseService.createLesson(req.params.chapterId, req.params.courseId, req.user.accountId, req.body);
    if (!lesson) return res.status(403).json({ message: 'Khong co quyen.' });
    return res.status(200).json({ message: 'Tao bai hoc thanh cong.', lesson });
  } catch (error) {
    console.error('createLesson error:', error.message);
    return res.status(500).json({ message: 'Loi tao bai hoc.' });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const lesson = await courseService.updateLesson(req.params.id, req.params.courseId, req.user.accountId, req.body);
    if (!lesson) return res.status(404).json({ message: 'Khong tim thay bai hoc.' });
    return res.status(200).json({ message: 'Cap nhat bai hoc thanh cong.', lesson });
  } catch (error) {
    console.error('updateLesson error:', error.message);
    return res.status(500).json({ message: 'Loi cap nhat bai hoc.' });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    await courseService.deleteLesson(req.params.id, req.params.courseId, req.user.accountId);
    return res.status(200).json({ message: 'Xoa bai hoc thanh cong.' });
  } catch (error) {
    console.error('deleteLesson error:', error.message);
    return res.status(500).json({ message: 'Loi xoa bai hoc.' });
  }
};

exports.getLessonDetail = async (req, res) => {
  try {
    const studentAccountId = req.user?.accountId || null;
    const data = await courseService.getLessonDetail(req.params.id, studentAccountId);
    if (!data) return res.status(404).json({ message: 'Khong tim thay bai hoc.' });
    return res.status(200).json(data);
  } catch (error) {
    console.error('getLessonDetail error:', error.message);
    return res.status(500).json({ message: 'Loi lay chi tiet bai hoc.' });
  }
};

// ===== ENROLLMENT =====
exports.enrollCourse = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;

    const student = {
      accountId: req.user.accountId,
      name: req.user.name || req.user.username || 'Hoc vien',
    };

    const result = await courseService.enrollCourse(req.params.courseId, student);
    if (result.error) return res.status(400).json({ message: result.error });

    const msg = result.isPending
      ? 'Da gui yeu cau! Cho giao vien duyet.'
      : 'Dang ky thanh cong! Ban co the hoc ngay.';

    return res.status(200).json({
      message: msg,
      enrollment: result.enrollment,
      isPending: result.isPending,
    });
  } catch (error) {
    console.error('enrollCourse error:', error.message);
    return res.status(500).json({ message: 'Loi dang ky: ' + error.message });
  }
};

exports.getStudentCourses = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const enrollments = await courseService.getStudentCourses(req.user.accountId);
    return res.status(200).json({ enrollments });
  } catch (error) {
    console.error('getStudentCourses error:', error.message);
    return res.status(500).json({ message: 'Loi lay danh sach khoa hoc.' });
  }
};

// ===== PROGRESS =====
exports.updateLessonProgress = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const progress = await courseService.updateLessonProgress(
      req.params.lessonId, req.params.courseId, req.user.accountId, req.body,
    );
    return res.status(200).json({ message: 'Cap nhat tien do thanh cong.', progress });
  } catch (error) {
    console.error('updateLessonProgress error:', error.message);
    return res.status(500).json({ message: 'Loi cap nhat tien do.' });
  }
};

// ===== PENDING ENROLLMENTS =====
exports.getPendingEnrollments = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const list = await courseService.getPendingEnrollments(req.user.accountId);
    return res.status(200).json({ list });
  } catch (error) {
    console.error('getPendingEnrollments error:', error.message);
    return res.status(500).json({ message: 'Loi lay danh sach cho duyet.' });
  }
};

exports.approveEnrollment = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const result = await courseService.approveEnrollment(req.params.enrollmentId, req.user.accountId);
    if (!result) return res.status(403).json({ message: 'Khong co quyen hoac khong tim thay.' });
    return res.status(200).json({ message: 'Da duyet hoc vien thanh cong.', enrollment: result });
  } catch (error) {
    console.error('approveEnrollment error:', error.message);
    return res.status(500).json({ message: 'Loi duyet.' });
  }
};

exports.rejectEnrollment = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const result = await courseService.rejectEnrollment(req.params.enrollmentId, req.user.accountId);
    if (!result) return res.status(403).json({ message: 'Khong co quyen hoac khong tim thay.' });
    return res.status(200).json({ message: 'Da tu choi hoc vien.' });
  } catch (error) {
    console.error('rejectEnrollment error:', error.message);
    return res.status(500).json({ message: 'Loi tu choi.' });
  }
};


exports.getStudentsProgress = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const result = await courseService.getStudentsProgress(req.params.courseId, req.user.accountId);
    if (!result) return res.status(403).json({ message: 'Khong co quyen hoac khong tim thay khoa hoc.' });
    return res.status(200).json(result);
  } catch (error) {
    console.error('getStudentsProgress error:', error.message);
    return res.status(500).json({ message: 'Loi lay tien do hoc sinh.' });
  }
};