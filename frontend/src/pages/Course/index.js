import CourseList from 'components/Course/CourseList';
import useTitle from 'hooks/useTitle';
import React from 'react';

function CoursePage() {
  useTitle('Khóa học');
  return <CourseList />;
}

export default CoursePage;