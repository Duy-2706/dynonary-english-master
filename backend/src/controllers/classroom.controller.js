const classroomService = require('../services/classroom.service');

function checkAuth(req, res) {
  if (!res.locals.isAuth || !req.user) {
    res.status(401).json({ message: 'Bạn cần đăng nhập để sử dụng chức năng này.' });
    return false;
  }

  return true;
}

exports.createClassroom = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;

    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Tên lớp học không được để trống.' });
    }

    const classroom = await classroomService.createClassroom(req.user, req.body);

    return res.status(200).json({
      message: 'Tạo lớp học thành công.',
      classroom,
    });
  } catch (error) {
    console.error('CREATE CLASSROOM ERROR:', error);
    return res.status(500).json({ message: 'Lỗi tạo lớp học, thử lại sau.' });
  }
};

exports.getMyClassrooms = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;

    const classrooms = await classroomService.getMyClassrooms(req.user);

    return res.status(200).json({ classrooms });
  } catch (error) {
    console.error('GET CLASSROOMS ERROR:', error);
    return res.status(500).json({ message: 'Lỗi lấy danh sách lớp học.' });
  }
};

exports.updateClassroom = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;

    const { id } = req.params;

    const classroom = await classroomService.updateClassroom(
      req.user,
      id,
      req.body,
    );

    if (!classroom) {
      return res.status(404).json({ message: 'Không tìm thấy lớp học.' });
    }

    return res.status(200).json({
      message: 'Cập nhật lớp học thành công.',
      classroom,
    });
  } catch (error) {
    console.error('UPDATE CLASSROOM ERROR:', error);
    return res.status(500).json({ message: 'Lỗi cập nhật lớp học.' });
  }
};

exports.deleteClassroom = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;

    const { id } = req.params;

    const result = await classroomService.deleteClassroom(req.user, id);

    if (!result.deletedCount) {
      return res.status(404).json({ message: 'Không tìm thấy lớp học.' });
    }

    return res.status(200).json({ message: 'Xóa lớp học thành công.' });
  } catch (error) {
    console.error('DELETE CLASSROOM ERROR:', error);
    return res.status(500).json({ message: 'Lỗi xóa lớp học.' });
  }
};