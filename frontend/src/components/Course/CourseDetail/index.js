import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlayCircleIcon from '@material-ui/icons/PlayCircleFilled';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import BookIcon from '@material-ui/icons/Book';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import courseApi from 'apis/courseApi';
import { ROUTES } from 'constant';

const useStyle = makeStyles((theme) => ({
  wrapper: { padding: '32px 0' },
  header: {
    background: 'linear-gradient(135deg, #6dc6fdb9 0%, #283593 100%)',
    color: '#fff',
    borderRadius: 20,
    padding: '40px',
    marginBottom: 32,
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 24,
  },
  headerLeft: { flex: 1, minWidth: 280 },
  courseTitle: { fontSize: '2rem', fontWeight: 700, marginBottom: 12 },
  courseMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    opacity: 0.85,
    marginBottom: 8,
    fontSize: '1rem',
  },
  headerRight: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
    minWidth: 260,
    backdropFilter: 'blur(10px)',
  },
  price: { fontSize: '2rem', fontWeight: 700, marginBottom: 16 },
  enrollBtn: {
    width: '100%',
    backgroundColor: '#fff !important',
    color: '#1a237e !important',
    fontWeight: '700 !important',
    borderRadius: '30px !important',
    padding: '12px !important',
    fontSize: '1rem !important',
  },
  pendingBtn: {
    width: '100%',
    backgroundColor: 'rgba(255,152,0,0.85) !important',
    color: '#fff !important',
    fontWeight: '700 !important',
    borderRadius: '30px !important',
    padding: '12px !important',
    fontSize: '0.95rem !important',
  },
  chapterTitle: { fontWeight: 700, fontSize: '1.1rem' },
  lessonItem: {
    borderRadius: 8,
    marginBottom: 6,
    border: '1px solid transparent',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      border: `1px solid ${theme.palette.divider}`,
    },
  },
  lessonPrimary: { fontSize: '1rem', fontWeight: 500 },
  lessonSecondary: { fontSize: '0.9rem' },
  loading: { display: 'flex', justifyContent: 'center', padding: 60 },
  sectionTitle: { fontWeight: 700, marginBottom: 16, fontSize: '1.3rem' },
}));

function CourseDetail() {
  const classes = useStyle();
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { isAuth, role } = useSelector((state) => state.userInfo);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Load course detail
        const res = await courseApi.getCourseDetail(id);
        if (res.status === 200) setCourse(res.data.course);
      } catch (e) {}

      // Check enrollment status nếu đã đăng nhập
      if (isAuth) {
        try {
          const enrollRes = await courseApi.getStudentCourses();
          if (enrollRes.status === 200) {
            const myEnrollment = (enrollRes.data.enrollments || []).find((e) => {
              const cId = e.courseId?._id || e.courseId;
              return cId === id || cId?.toString() === id;
            });
            if (myEnrollment) {
              setIsEnrolled(myEnrollment.status === 'active');
              setIsPending(myEnrollment.status === 'pending');
            }
          }
        } catch (e) {}
      }

      setLoading(false);
    })();
  }, [id, isAuth]);

  const handleEnroll = async () => {
    if (!isAuth) {
      history.push(ROUTES.LOGIN);
      return;
    }
    setEnrolling(true);
    try {
      const res = await courseApi.enrollCourse(id);
      if (res.status === 200) {
        if (res.data.isPending) {
          setIsPending(true);
          dispatch(setMessage({ type: 'info', message: 'Da gui yeu cau! Cho giao vien duyet.' }));
        } else {
          setIsEnrolled(true);
          dispatch(setMessage({ type: 'success', message: 'Dang ky thanh cong! Ban co the hoc ngay.' }));
        }
      }
    } catch (e) {
      dispatch(setMessage({
        type: 'error',
        message: e.response?.data?.message || 'Loi dang ky.',
      }));
    }
    setEnrolling(false);
  };

  const handleLearnLesson = (lessonId, canAccess) => {
    if (!canAccess) {
      dispatch(setMessage({ type: 'warning', message: 'Ban can dang ky khoa hoc de hoc bai nay!' }));
      return;
    }
    history.push(`/courses/${id}/learn/${lessonId}`);
  };

  const getLessonTypeLabel = (type) => {
    switch (type) {
      case 'video': return 'Video + Bai tap';
      case 'flashcard': return 'Flashcard tu vung';
      case 'quiz': return 'Trac nghiem';
      case 'fill_blank': return 'Dien tu';
      case 'text': return 'Ly thuyet';
      case 'mixed': return 'Ket hop';
      default: return 'Bai hoc';
    }
  };

  if (loading) return <div className={classes.loading}><CircularProgress /></div>;
  if (!course) return <div className="container" style={{ padding: 60, textAlign: 'center' }}>Khong tim thay khoa hoc.</div>;

  // Giáo viên tạo khóa này → luôn có quyền truy cập tất cả
  const isTeacherOfCourse = role === 'teacher';

  return (
    <div className={`container ${classes.wrapper}`}>
      {/* Header */}
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <Chip label={course.level} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: 12 }} />
          <h1 className={classes.courseTitle}>{course.title}</h1>
          <p style={{ opacity: 0.85, marginBottom: 16, fontSize: '1rem', lineHeight: 1.6 }}>{course.description}</p>
          <div className={classes.courseMeta}>
            <PersonIcon style={{ fontSize: 20 }} />
            <span>Giao vien: <strong>{course.teacherName}</strong></span>
          </div>
          <div className={classes.courseMeta}>
            <BookIcon style={{ fontSize: 20 }} />
            <span>{course.totalLessons} bai hoc</span>
            <span style={{ margin: '0 6px' }}>|</span>
            <span>{course.totalStudents} hoc vien</span>
            <span style={{ margin: '0 6px' }}>|</span>
            <span>Cap do: {course.level}</span>
          </div>
        </div>

        <div className={classes.headerRight}>
          <div className={classes.price}>
            {course.isFree
              ? 'Mien phi'
              : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price || 0)}
          </div>

          {/* Giáo viên → không cần đăng ký */}
          {isTeacherOfCourse ? (
            <Button className={classes.enrollBtn} variant="contained" disabled>
              Giao vien quan ly
            </Button>
          ) : isEnrolled ? (
            <Button className={classes.enrollBtn} variant="contained" disabled>
              Da dang ky - Dang hoc
            </Button>
          ) : isPending ? (
            <Button className={classes.pendingBtn} variant="contained" disabled>
              Dang cho giao vien duyet...
            </Button>
          ) : (
            <Button className={classes.enrollBtn} variant="contained" onClick={handleEnroll} disabled={enrolling}>
              {enrolling ? <CircularProgress size={20} /> : course.isFree ? 'Dang ky mien phi' : 'Dang ky hoc ngay'}
            </Button>
          )}

          {isPending && (
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', marginTop: 8, textAlign: 'center' }}>
              Yeu cau cua ban dang duoc xem xet
            </p>
          )}
        </div>
      </div>

      {/* Danh sach chuong/bai */}
      <h2 className={classes.sectionTitle}>Noi dung khoa hoc</h2>
      {!course.chapters || course.chapters.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Khoa hoc chua co noi dung.</div>
      ) : (
        course.chapters.map((chapter) => (
          <Accordion key={chapter._id} defaultExpanded={chapter.order === 1} style={{ marginBottom: 8 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: '#f5f5f5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  backgroundColor: '#1a237e', color: '#fff', borderRadius: '50%',
                  width: 28, height: 28, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
                }}>{chapter.order}</span>
                <div>
                  <span className={classes.chapterTitle}>{chapter.title}</span>
                  <span style={{ color: '#888', fontSize: '0.9rem', marginLeft: 8 }}>
                    ({chapter.lessons?.length || 0} bai)
                  </span>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails style={{ padding: '8px 16px 16px' }}>
              <List dense style={{ width: '100%' }}>
                {chapter.lessons?.map((lesson) => {
                  // Có quyền xem nếu:
                  // - Bài isFree
                  // - Khóa isFree
                  // - Đã được duyệt (isEnrolled = active)
                  // - Là giáo viên
                  const canAccess = lesson.isFree || course.isFree || isEnrolled || isTeacherOfCourse;
                  return (
                    <ListItem
                      key={lesson._id}
                      className={classes.lessonItem}
                      button
                      onClick={() => handleLearnLesson(lesson._id, canAccess)}
                      style={{ opacity: canAccess ? 1 : 0.65 }}>
                      <ListItemIcon style={{ minWidth: 40 }}>
                        {canAccess
                          ? <PlayCircleIcon style={{ color: '#1976d2', fontSize: 28 }} />
                          : <LockIcon style={{ color: '#bbb', fontSize: 24 }} />
                        }
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <span className={classes.lessonPrimary}>
                            Bai {lesson.order}: {lesson.title}
                            {lesson.isFree && (
                              <span style={{
                                fontSize: '0.75rem', color: '#4caf50', fontWeight: 700,
                                marginLeft: 8, backgroundColor: '#e8f5e9',
                                padding: '2px 6px', borderRadius: 4,
                              }}>Xem thu</span>
                            )}
                          </span>
                          }
                        secondary={
                          <span className={classes.lessonSecondary} style={{ color: '#888' }}>
                            {getLessonTypeLabel(lesson.type)}
                            {lesson.timeLimit > 0 && ` | ${lesson.timeLimit} phut`}
                          </span>
                        }
                      />
                      {!canAccess && (
                        <span style={{
                          fontSize: '0.82rem', color: '#ff9800', fontWeight: 600,
                          whiteSpace: 'nowrap', border: '1px solid #ff9800',
                          padding: '2px 8px', borderRadius: 12,
                        }}>
                          {isPending ? 'Cho duyet' : 'Mua khoa'}
                        </span>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </div>
  );
}

export default CourseDetail;