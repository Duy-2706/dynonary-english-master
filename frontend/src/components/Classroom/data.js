import classroomApi from 'apis/classroomApi';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import Classroom from '.';

function ClassroomData() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [classrooms, setClassrooms] = useState([]);

  const getClassrooms = async () => {
    try {
      setLoading(true);
      const apiRes = await classroomApi.getMyClassrooms();

      if (apiRes.status === 200) {
        setClassrooms(apiRes.data.classrooms || []);
      }
    } catch (error) {
      dispatch(
        setMessage({
          type: 'error',
          message:
            error.response?.data?.message || 'Không thể tải danh sách lớp học.',
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClassrooms();
  }, []);

  const handleCreate = async (data) => {
    try {
      setSubmitting(true);
      const apiRes = await classroomApi.createClassroom(data);

      if (apiRes.status === 200) {
        setClassrooms((prev) => [apiRes.data.classroom, ...prev]);
        dispatch(
          setMessage({
            type: 'success',
            message: 'Tạo lớp học thành công.',
            duration: 3000,
          }),
        );
      }
    } catch (error) {
      dispatch(
        setMessage({
          type: 'error',
          message: error.response?.data?.message || 'Tạo lớp học thất bại.',
        }),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      setSubmitting(true);
      const apiRes = await classroomApi.updateClassroom(id, data);

      if (apiRes.status === 200) {
        setClassrooms((prev) =>
          prev.map((item) =>
            item._id === id ? apiRes.data.classroom : item,
          ),
        );

        dispatch(
          setMessage({
            type: 'success',
            message: 'Cập nhật lớp học thành công.',
            duration: 3000,
          }),
        );
      }
    } catch (error) {
      dispatch(
        setMessage({
          type: 'error',
          message:
            error.response?.data?.message || 'Cập nhật lớp học thất bại.',
        }),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirm = window.confirm(
      'Bạn có chắc chắn muốn xóa lớp học này không?',
    );

    if (!isConfirm) return;

    try {
      const apiRes = await classroomApi.deleteClassroom(id);

      if (apiRes.status === 200) {
        setClassrooms((prev) => prev.filter((item) => item._id !== id));

        dispatch(
          setMessage({
            type: 'success',
            message: 'Xóa lớp học thành công.',
            duration: 3000,
          }),
        );
      }
    } catch (error) {
      dispatch(
        setMessage({
          type: 'error',
          message: error.response?.data?.message || 'Xóa lớp học thất bại.',
        }),
      );
    }
  };

  return (
    <Classroom
      loading={loading}
      submitting={submitting}
      classrooms={classrooms}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}

export default ClassroomData;