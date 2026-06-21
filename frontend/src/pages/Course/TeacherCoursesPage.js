import TeacherCourses from 'components/Course/TeacherCourses';
import useTitle from 'hooks/useTitle';
import React from 'react';

function TeacherCoursesPage({ embedded = false }) {
  useTitle('Quản lý khóa học');
  return <TeacherCourses embedded={embedded} />;
}

export default TeacherCoursesPage;