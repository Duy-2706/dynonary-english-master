import CourseLearn from 'components/Course/CourseLearn';
import useTitle from 'hooks/useTitle';
import React from 'react';

function CourseLearnPage() {
  useTitle('Học bài');
  return <CourseLearn />;
}

export default CourseLearnPage;