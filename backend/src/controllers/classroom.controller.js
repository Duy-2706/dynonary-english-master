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

    if (!result) {
      return res.status(404).json({ message: 'Không tìm thấy lớp học.' });
    }

    return res.status(200).json({ message: 'Xóa lớp học thành công.' });
  } catch (error) {
    console.error('DELETE CLASSROOM ERROR:', error);
    return res.status(500).json({ message: 'Lỗi xóa lớp học.' });
  }


    const result = await classroomService.deleteClassroom(req.user, id);

    if (!result.deletedCount) {
    if (!result) {
      return res.status(404).json({ message: 'Không tìm thấy lớp học.' });
    }

    console.error('DELETE CLASSROOM ERROR:', error);
    return res.status(500).json({ message: 'Lỗi xóa lớp học.' });
  }
};

exports.getClassroomById = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const { id } = req.params;
    const classroom = await classroomService.getClassroomById(req.user, id);
    if (!classroom)
      return res.status(404).json({ message: 'Không tìm thấy lớp học.' });
    return res.status(200).json({ classroom });
  } catch (error) {
    console.error('GET CLASSROOM BY ID ERROR:', error);
    return res.status(500).json({ message: 'Lỗi lấy thông tin lớp học.' });
  }
};

exports.getActivity = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const { id } = req.params;
    const activity = await classroomService.getClassroomActivity(req.user, id);
    if (!activity)
      return res.status(404).json({ message: 'Không tìm thấy lớp học.' });
    return res.status(200).json({ activity });
  } catch (error) {
    console.error('GET ACTIVITY ERROR:', error);
    return res.status(500).json({ message: 'Lỗi lấy thông tin hoạt động.' });
  }
};

exports.getWeeklyReport = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const { id } = req.params;
    const { weekNumber, year } = req.query;
    const report = await classroomService.getWeeklyReport(
      req.user,
      id,
      weekNumber,
      year,
    );
    if (!report)
      return res.status(404).json({ message: 'Không tìm thấy lớp học.' });
    return res.status(200).json(report);
  } catch (error) {
    console.error('GET WEEKLY REPORT ERROR:', error);
    return res.status(500).json({ message: 'Lỗi lấy báo cáo tuần.' });
  }
};

exports.upsertWeeklyEvaluation = async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const { id } = req.params;
    const evaluation = await classroomService.upsertWeeklyEvaluation(
      req.user,
      id,
      req.body,
    );
    if (!evaluation)
      return res.status(404).json({ message: 'Không tìm thấy lớp học.' });
    return res
      .status(200)
      .json({ message: 'Đánh giá đã được lưu.', evaluation });
  } catch (error) {
    console.error('UPSERT EVAL ERROR:', error);
    return res.status(500).json({ message: 'Lỗi lưu đánh giá.' });
  }
};