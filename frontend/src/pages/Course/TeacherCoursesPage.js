import TeacherCourses from 'components/Course/TeacherCourses';
import useTitle from 'hooks/useTitle';
import React from 'react';

function TeacherCoursesPage() {
  useTitle('Quản lý khóa học');
  return <TeacherCourses />;
}

export default TeacherCoursesPage;