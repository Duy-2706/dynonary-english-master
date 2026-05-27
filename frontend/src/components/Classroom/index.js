import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import SchoolIcon from '@material-ui/icons/School';
import Skeleton from '@material-ui/lab/Skeleton';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import ClassroomCard from './ClassroomCard';
import ClassroomFormModal from './ClassroomFormModal';
import useStyle from './style';

function Classroom({
  loading,
  submitting,
  classrooms,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const classes = useStyle();
  const [openForm, setOpenForm] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);

  const handleOpenCreate = () => {
    setEditingClassroom(null);
    setOpenForm(true);
  };

  const handleOpenEdit = (classroom) => {
    setEditingClassroom(classroom);
    setOpenForm(true);
  };

  const handleSubmit = async (formData) => {
    if (editingClassroom) {
      await onUpdate(editingClassroom._id, formData);
    } else {
      await onCreate(formData);
    }

    setOpenForm(false);
    setEditingClassroom(null);
  };

  return (
    <div className="container classroom-page">
      <section className={classes.hero}>
        <div>
          <p className={classes.eyebrow}>TEACHER CLASSROOM</p>
          <h1 className={classes.title}>Quản lý lớp học của bạn</h1>
          <p className={classes.description}>
            Tạo lớp riêng cho giáo viên, quản lý thông tin lớp học, mã lớp và
            danh sách học viên trong một không gian học tập sinh động.
          </p>

          <Button
            className={`${classes.createBtn} _btn _btn-primary`}
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleOpenCreate}>
            Tạo lớp mới
          </Button>
        </div>

        <div className={classes.heroIconWrap}>
          <SchoolIcon className={classes.heroIcon} />
        </div>
      </section>

      {loading ? (
        <Grid container spacing={4}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item}>
              <Skeleton
                variant="rect"
                animation="wave"
                className={classes.skeleton}
              />
            </Grid>
          ))}
        </Grid>
      ) : classrooms.length > 0 ? (
        <Grid container spacing={4}>
          {classrooms.map((classroom) => (
            <Grid item xs={12} md={6} lg={4} key={classroom._id}>
              <ClassroomCard
                classroom={classroom}
                onEdit={handleOpenEdit}
                onDelete={onDelete}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <div className={classes.emptyBox}>
          <SchoolIcon className={classes.emptyIcon} />
          <h2>Chưa có lớp học nào</h2>
          <p>Hãy tạo lớp đầu tiên để bắt đầu quản lý học viên của bạn.</p>
          <Button
            className="_btn _btn-primary"
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleOpenCreate}>
            Tạo lớp học
          </Button>
        </div>
      )}

      <ClassroomFormModal
        open={openForm}
        submitting={submitting}
        initialData={editingClassroom}
        onClose={() => {
          setOpenForm(false);
          setEditingClassroom(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

Classroom.propTypes = {
  loading: PropTypes.bool,
  submitting: PropTypes.bool,
  classrooms: PropTypes.array,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};

Classroom.defaultProps = {
  loading: false,
  submitting: false,
  classrooms: [],
  onCreate: function () {},
  onUpdate: function () {},
  onDelete: function () {},
};

export default Classroom;