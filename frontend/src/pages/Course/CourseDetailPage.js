import CourseDetail from 'components/Course/CourseDetail';
import useTitle from 'hooks/useTitle';
import React from 'react';

function CourseDetailPage() {
  useTitle('Chi tiết khóa học');
  return <CourseDetail />;
}

export default CourseDetailPage;