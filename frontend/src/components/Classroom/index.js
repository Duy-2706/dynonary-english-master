import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import SchoolIcon from '@material-ui/icons/School';
import Skeleton from '@material-ui/lab/Skeleton';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import grammarApi from 'apis/grammarApi';
import { setMessage } from 'redux/slices/message.slice';
import { InlineAssignment, getExpiryNotice } from 'components/Assignment/StudentAssignment';
import ClassroomCard from './ClassroomCard';
import ClassroomFormModal from './ClassroomFormModal';
import useStyle from './style';

function StudentClassroomAssignments({ classroom, studentInfo }) {
  const dispatch = useDispatch();
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notified, setNotified] = useState(false);

  const load = useCallback(async () => {
    if (!classroom?.id) { setLoading(false); return; }
    setLoading(true);
    try {
      const [aRes, sRes] = await Promise.all([
        grammarApi.getClassroomAssignments(classroom.id),
        grammarApi.getMySubmissions(),
      ]);
      setAssignments(aRes.data?.assignments || []);
      setMySubmissions(sRes.data?.submissions || []);
    } catch {
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [classroom?.id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (notified || loading || assignments.length === 0) return;
    const notice = getExpiryNotice(assignments, mySubmissions);
    if (notice) {
      dispatch(setMessage({ type: notice.type, message: notice.message, duration: 8000 }));
      setNotified(true);
    }
  }, [assignments, mySubmissions, loading, notified, dispatch]);

  if (loading) return null;
  if (assignments.length === 0) return null;

  const getSubmission = (id) => mySubmissions.find((s) => s.assignmentId === id) || null;

  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ marginBottom: 16 }}>Bài tập của lớp ({assignments.length})</h3>
      {assignments.map((a) => (
        <InlineAssignment
          key={a.id}
          assignment={a}
          existingSubmission={getSubmission(a.id)}
          userInfo={studentInfo}
          onSubmitted={load}
        />
      ))}
    </div>
  );
}

function StudentClassroomView({ loading, classroom, studentInfo }) {
  const classes = useStyle();
  if (loading) {
    return (
      <Grid container spacing={4} style={{ marginTop: 8 }}>
        {[1, 2].map((i) => (
          <Grid item xs={12} md={6} key={i}>
            <Skeleton variant="rect" animation="wave" className={classes.skeleton} />
          </Grid>
        ))}
      </Grid>
    );
  }
  if (!classroom) {
    return (
      <div className={classes.emptyBox}>
        <SchoolIcon className={classes.emptyIcon} />
        <h2>Bạn chưa được thêm vào lớp học nào</h2>
        <p>Hãy liên hệ giáo viên để được thêm vào lớp.</p>
      </div>
    );
  }
  const students = classroom.students || [];
  return (
    <div className="container classroom-page">
      <section className={classes.hero}>
        <div>
          <p className={classes.eyebrow}>LỚP HỌC CỦA TÔI</p>
          <h1 className={classes.title}>Lớp {classroom.name}</h1>
          <p className={classes.description}>
            Giáo viên: <strong>{classroom.teacherName || '—'}</strong>
            {classroom.level ? ` · Cấp độ: ${classroom.level}` : ''}
            {classroom.description ? ` · ${classroom.description}` : ''}
          </p>
        </div>
        <div className={classes.heroIconWrap}>
          <SchoolIcon className={classes.heroIcon} />
        </div>
      </section>

      <StudentClassroomAssignments classroom={classroom} studentInfo={studentInfo} />

      <h3 style={{ marginBottom: 16 }}>Danh sách học sinh ({students.length})</h3>
      {students.length === 0 ? (
        <p style={{ color: '#888' }}>Chưa có học sinh nào trong lớp.</p>
      ) : (
        <Grid container spacing={2}>
          {students.map((s, i) => (
            <Grid item xs={12} sm={6} md={4} key={s.accountId || i}>
              <div style={{
                background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
                padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', background: '#eff6ff',
                  color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1rem', flexShrink: 0,
                }}>
                  {(s.name || '?').trim().charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#111827' }}>{s.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{s.username || ''}</div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

function Classroom({
  loading,
  submitting,
  classrooms,
  role,
  studentInfo,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const classes = useStyle();
  const [openForm, setOpenForm] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);

    if (role === 'student') {
    return (
      <StudentClassroomView
        loading={loading}
        classroom={classrooms[0] || null}
        studentInfo={studentInfo}
      />
    );
  }


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
  role: PropTypes.string,
  studentInfo: PropTypes.object,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};

Classroom.defaultProps = {
  loading: false,
  submitting: false,
  classrooms: [],
  studentInfo: null,
  onCreate: function () {},
  onUpdate: function () {},
  onDelete: function () {},
};

export default Classroom;