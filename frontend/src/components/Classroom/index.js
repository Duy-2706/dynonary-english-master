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
import ClassroomDetailPage from '../../pages/Teacher/ClassroomDetail';
import useStyle from './style';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import vocabSetApi from 'apis/vocabSetApi';
import { useHistory } from 'react-router-dom';

function StudentClassroomAssignments({ classroom, studentInfo }) {
  const dispatch = useDispatch();
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notified, setNotified] = useState(false);

  const load = useCallback(async () => {
    if (!classroom?.id && !classroom?._id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const classroomId = classroom.id || classroom._id;

      const [aRes, sRes] = await Promise.all([
        grammarApi.getClassroomAssignments(classroomId),
        grammarApi.getMySubmissions(),
      ]);

      setAssignments(aRes.data?.assignments || []);
      setMySubmissions(sRes.data?.submissions || []);
    } catch {
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [classroom?.id, classroom?._id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (notified || loading || assignments.length === 0) return;

    const notice = getExpiryNotice(assignments, mySubmissions);

    if (notice) {
      dispatch(
        setMessage({
          type: notice.type,
          message: notice.message,
          duration: 8000,
        }),
      );

      setNotified(true);
    }
  }, [assignments, mySubmissions, loading, notified, dispatch]);

  if (loading) return null;
  if (assignments.length === 0) return null;

  const getSubmission = (id) =>
    mySubmissions.find((submission) => submission.assignmentId === id) || null;

  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ marginBottom: 16 }}>Bài tập của lớp ({assignments.length})</h3>

      {assignments.map((assignment) => (
        <InlineAssignment
          key={assignment.id}
          assignment={assignment}
          existingSubmission={getSubmission(assignment.id)}
          userInfo={studentInfo}
          onSubmitted={load}
        />
      ))}
    </div>
  );
}

function VocabFlashcard({ open, onClose, vocabSet }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const words = vocabSet?.words || [];

  useEffect(() => {
    if (open) {
      setIdx(0);
      setFlipped(false);
    }
  }, [open]);

  useEffect(() => {
    setFlipped(false);
  }, [idx]);

  if (!vocabSet) return null;

  const card = words[idx];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 24,
          border: '4px solid #19c7a8',
        },
      }}
    >
      <div
        style={{
          padding: '16px 22px',
          background: 'linear-gradient(180deg,#19c7a8,#07947f)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            color: '#fff',
            fontWeight: 900,
            fontSize: '1.1rem',
          }}
        >
          {vocabSet.title} · {idx + 1}/{words.length}
        </span>

        <IconButton onClick={onClose} size="small" style={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </div>

      <DialogContent style={{ padding: 20, background: '#f3fffc' }}>
        {card ? (
          <div
            onClick={() => setFlipped((value) => !value)}
            style={{
              cursor: 'pointer',
              minHeight: 180,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              background: flipped
                ? 'linear-gradient(180deg,#fffbeb,#fff)'
                : 'linear-gradient(180deg,#eefdf9,#fff)',
              border: '4px solid',
              borderColor: flipped ? '#fbbf24' : '#19c7a8',
              padding: 28,
            }}
          >
            {!flipped ? (
              <>
                <div
                  style={{
                    fontSize: '2.2rem',
                    fontWeight: 900,
                    color: '#06434b',
                    marginBottom: 8,
                  }}
                >
                  {card.word}
                </div>

                {card.phonetic && (
                  <div
                    style={{
                      color: '#07947f',
                      fontSize: '1rem',
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                  >
                    /{card.phonetic}/
                  </div>
                )}

                {card.type && (
                  <Chip
                    label={card.type}
                    size="small"
                    style={{
                      background: '#d4f5eb',
                      color: '#057a55',
                      fontWeight: 800,
                    }}
                  />
                )}

                <div
                  style={{
                    color: '#aaa',
                    fontSize: '0.8rem',
                    marginTop: 14,
                    fontWeight: 700,
                  }}
                >
                  Nhấn để xem nghĩa
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: '1.7rem',
                    fontWeight: 900,
                    color: '#92400e',
                    marginBottom: 8,
                  }}
                >
                  {card.meaning}
                </div>

                <div
                  style={{
                    color: '#06434b',
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  {card.word}
                </div>

                {card.phonetic && (
                  <div style={{ color: '#07947f', fontSize: '0.9rem' }}>
                    /{card.phonetic}/
                  </div>
                )}

                <div
                  style={{
                    color: '#aaa',
                    fontSize: '0.8rem',
                    marginTop: 14,
                    fontWeight: 700,
                  }}
                >
                  Nhấn để xem từ
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#888', padding: 40 }}>
            Không có từ nào.
          </div>
        )}
      </DialogContent>

      <DialogActions
        style={{
          padding: '10px 20px 16px',
          background: '#f3fffc',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        <button
          disabled={idx === 0}
          onClick={() => setIdx(idx - 1)}
          style={{
            padding: '8px 22px',
            border: '2.5px solid #19c7a8',
            borderRadius: 999,
            fontWeight: 900,
            background: '#eefdf9',
            color: '#056d5e',
            cursor: idx === 0 ? 'not-allowed' : 'pointer',
            opacity: idx === 0 ? 0.5 : 1,
          }}
        >
          ← Trước
        </button>

        <button
          disabled={idx === words.length - 1}
          onClick={() => setIdx(idx + 1)}
          style={{
            padding: '8px 22px',
            border: 'none',
            borderRadius: 999,
            fontWeight: 900,
            background: 'linear-gradient(180deg,#19c7a8,#07947f)',
            color: '#fff',
            cursor: idx === words.length - 1 ? 'not-allowed' : 'pointer',
            opacity: idx === words.length - 1 ? 0.5 : 1,
            boxShadow: '0 4px 0 rgba(7,148,127,.3)',
          }}
        >
          Tiếp →
        </button>
      </DialogActions>
    </Dialog>
  );
}

function StudentClassroomVocabSets({ classroomId }) {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (!classroomId) {
      setLoading(false);
      return;
    }

    vocabSetApi
      .getClassroomVocabSets(classroomId)
      .then((res) => setSets(res.data?.sets || []))
      .catch(() => setSets([]))
      .finally(() => setLoading(false));
  }, [classroomId]);

  if (loading || sets.length === 0) return null;

  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ marginBottom: 16 }}>Từ vựng của lớp ({sets.length} bộ từ)</h3>

      <Grid container spacing={2}>
        {sets.map((set) => (
          <Grid item xs={12} sm={6} md={4} key={set._id}>
            <div
              onClick={() => history.push(`/vocab-set/${set._id}/learn`)}
              style={{
                background: 'linear-gradient(180deg,#eefdf9,#fff)',
                border: '3px solid #d6f3ed',
                borderRadius: 18,
                padding: '16px 18px',
                cursor: 'pointer',
                boxShadow: '0 4px 0 rgba(7,148,127,.12)',
                transition: 'all .15s',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.borderColor = '#19c7a8';
                event.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.borderColor = '#d6f3ed';
                event.currentTarget.style.transform = 'none';
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  color: '#06434b',
                  marginBottom: 6,
                }}
              >
                {set.title}
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <Chip
                  size="small"
                  label={`Khối ${set.gradeLevel}`}
                  style={{
                    background: '#d4f5eb',
                    color: '#057a55',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                  }}
                />

                <Chip
                  size="small"
                  label={set.unit}
                  style={{
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                  }}
                />

                <span
                  style={{
                    color: '#07545c',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                  }}
                >
                  {set.words?.length || 0} từ
                </span>
              </div>

              <div
                style={{
                  marginTop: 10,
                  color: '#19c7a8',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                }}
              >
                🃏 Nhấn để học flashcard →
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

function StudentClassroomView({ loading, classroom, studentInfo }) {
  const classes = useStyle();

  if (loading) {
    return (
      <Grid container spacing={4} style={{ marginTop: 8 }}>
        {[1, 2].map((item) => (
          <Grid item xs={12} md={6} key={item}>
            <Skeleton
              variant="rect"
              animation="wave"
              className={classes.skeleton}
            />
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

      <StudentClassroomAssignments
        classroom={classroom}
        studentInfo={studentInfo}
      />

      <StudentClassroomVocabSets classroomId={classroom.id || classroom._id} />

      <h3 style={{ marginBottom: 16 }}>Danh sách học sinh ({students.length})</h3>

      {students.length === 0 ? (
        <p style={{ color: '#888' }}>Chưa có học sinh nào trong lớp.</p>
      ) : (
        <Grid container spacing={2}>
          {students.map((student, index) => (
            <Grid item xs={12} sm={6} md={4} key={student.accountId || index}>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    flexShrink: 0,
                  }}
                >
                  {(student.name || '?').trim().charAt(0).toUpperCase()}
                </div>

                <div>
                  <div style={{ fontWeight: 700, color: '#111827' }}>
                    {student.name}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {student.username || ''}
                  </div>
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
  embedded,
}) {
  const classes = useStyle();

  const [openForm, setOpenForm] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [managingClassroomId, setManagingClassroomId] = useState('');

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

  const handleManage = (classroom) => {
    const classroomId = classroom?._id || classroom?.id;

    if (!classroomId) return;

    setManagingClassroomId(classroomId);
  };

  const handleSubmit = async (formData) => {
    if (editingClassroom) {
      await onUpdate(editingClassroom._id || editingClassroom.id, formData);
    } else {
      await onCreate(formData);
    }

    setOpenForm(false);
    setEditingClassroom(null);
  };

  if (managingClassroomId) {
    return (
      <ClassroomDetailPage
        embedded
        classroomId={managingClassroomId}
        onBack={() => setManagingClassroomId('')}
      />
    );
  }

  return (
    <div
      className={embedded ? 'classroom-page classroom-page-embedded' : 'container classroom-page'}
      style={
        embedded
          ? {
              width: '100%',
              maxWidth: '100%',
              padding: 0,
              margin: 0,
            }
          : undefined
      }
    >
      {!embedded && (
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
              onClick={handleOpenCreate}
            >
              Tạo lớp mới
            </Button>
          </div>

          <div className={classes.heroIconWrap}>
            <SchoolIcon className={classes.heroIcon} />
          </div>
        </section>
      )}

      {embedded && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 20,
          }}
        >
          <Button
            className={`${classes.createBtn} _btn _btn-primary`}
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleOpenCreate}
          >
            Tạo lớp mới
          </Button>
        </div>
      )}

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
              <Skeleton
                variant="rect"
                animation="wave"
                className={classes.skeleton}
              />
            </Grid>
          ))}
        </Grid>
      ) : classrooms.length > 0 ? (
        <Grid container spacing={3}>
          {classrooms.map((classroom) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={classroom._id || classroom.id}
            >
              <ClassroomCard
                classroom={classroom}
                onEdit={handleOpenEdit}
                onDelete={onDelete}
                onManage={handleManage}
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
            onClick={handleOpenCreate}
          >
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
  embedded: PropTypes.bool,
};

Classroom.defaultProps = {
  loading: false,
  submitting: false,
  classrooms: [],
  role: '',
  studentInfo: null,
  onCreate: function () {},
  onUpdate: function () {},
  onDelete: function () {},
  embedded: false,
};

export default Classroom;