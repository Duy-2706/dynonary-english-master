import TeacherCourseDetail from 'components/Course/TeacherCourseDetail';
import useTitle from 'hooks/useTitle';
import React from 'react';

function TeacherCourseDetailPage() {
  useTitle('Quản lý khóa học');
  return <TeacherCourseDetail />;
}

export default TeacherCourseDetailPage;