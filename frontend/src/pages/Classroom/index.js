import ClassroomData from 'components/Classroom/data';
import useScrollTop from 'hooks/useScrollTop';
import useTitle from 'hooks/useTitle';
import React from 'react';

function ClassroomPage({ embedded = false }) {
  useTitle('Lớp học của tôi');
  useScrollTop();

  return <ClassroomData embedded={embedded} />;
}

export default ClassroomPage;