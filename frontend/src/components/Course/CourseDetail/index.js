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
import SchoolIcon from '@material-ui/icons/School';
import PeopleIcon from '@material-ui/icons/People';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import courseApi from 'apis/courseApi';
import { ROUTES } from 'constant';
import PaymentModal from 'components/Payment/PaymentModal';

const LEVEL_COLORS = {
  A1: '#059669',
  A2: '#2563eb',
  B1: '#d97706',
  B2: '#7c3aed',
  C1: '#dc2626',
  C2: '#0891b2',
  'Tất cả': '#475569',
};

const useStyle = makeStyles(() => ({
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 8% 12%, rgba(37,99,235,.10) 0 260px, transparent 261px),
      radial-gradient(circle at 92% 8%, rgba(14,165,233,.12) 0 240px, transparent 241px),
      radial-gradient(circle at 82% 88%, rgba(16,185,129,.10) 0 280px, transparent 281px),
      linear-gradient(180deg, #eef4ff 0%, #f6f8fc 46%, #eef7f3 100%)
    `,
    padding: '34px 0 70px',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
  },

  wrapper: {
    width: 'min(1240px, calc(100% - 48px))',
    margin: '0 auto',
  },

  backBtn: {
    marginBottom: '20px !important',
    background: '#ffffff !important',
    color: '#334155 !important',
    border: '1px solid #cbd5e1 !important',
    borderRadius: '11px !important',
    padding: '10px 18px !important',
    fontSize: '1rem !important',
    fontWeight: '800 !important',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif !important",
    textTransform: 'none !important',
    boxShadow: '0 6px 16px rgba(15,23,42,.06) !important',
    '&:hover': {
      background: '#f8fafc !important',
      borderColor: '#94a3b8 !important',
    },
  },

  hero: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0369a1 100%)',
    borderRadius: 22,
    padding: '34px 36px',
    marginBottom: 26,
    boxShadow: '0 18px 42px rgba(15,23,42,0.18)',
    color: '#ffffff',
  },

  heroGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 340px',
    gap: 28,
    alignItems: 'start',
  },

  levelChip: {
    height: '32px !important',
    borderRadius: '999px !important',
    color: '#ffffff !important',
    border: '1px solid rgba(255,255,255,.32) !important',
    fontWeight: '800 !important',
    fontSize: '0.9rem !important',
    marginBottom: '16px !important',
  },

  courseTitle: {
    fontSize: 'clamp(2.25rem, 4vw, 3.7rem)',
    fontWeight: 900,
    color: '#ffffff',
    margin: '0 0 16px',
    lineHeight: 1.12,
    letterSpacing: '-0.04em',
  },

  description: {
    color: '#dbeafe',
    fontSize: '1.08rem',
    fontWeight: 500,
    lineHeight: 1.75,
    margin: '0 0 24px',
    maxWidth: 760,
  },

  metaGrid: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },

  metaPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,.14)',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,.24)',
    borderRadius: 999,
    padding: '9px 14px',
    fontSize: '0.98rem',
    fontWeight: 750,
  },

  enrollCard: {
    background: '#ffffff',
    borderRadius: 18,
    border: '1px solid rgba(255,255,255,.35)',
    padding: 24,
    boxShadow: '0 14px 34px rgba(15,23,42,.22)',
    color: '#0f172a',
  },

  priceLabel: {
    color: '#64748b',
    fontSize: '0.9rem',
    fontWeight: 800,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },

  price: {
    color: '#0f172a',
    fontSize: '2rem',
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: 20,
    letterSpacing: '-0.03em',
  },

  enrollBtn: {
    width: '100%',
    background: '#1d4ed8 !important',
    color: '#fff !important',
    fontWeight: '850 !important',
    borderRadius: '11px !important',
    padding: '12px 18px !important',
    fontSize: '1rem !important',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif !important",
    textTransform: 'none !important',
    boxShadow: '0 8px 18px rgba(29,78,216,.26) !important',
    '&:hover': {
      background: '#1e40af !important',
    },
  },

  enrolledBtn: {
    width: '100%',
    background: '#059669 !important',
    color: '#fff !important',
    fontWeight: '850 !important',
    borderRadius: '11px !important',
    padding: '12px 18px !important',
    fontSize: '1rem !important',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif !important",
    textTransform: 'none !important',
  },

  pendingBtn: {
    width: '100%',
    background: '#64748b !important',
    color: '#fff !important',
    fontWeight: '850 !important',
    borderRadius: '11px !important',
    padding: '12px 18px !important',
    fontSize: '1rem !important',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif !important",
    textTransform: 'none !important',
  },

  pendingNote: {
    color: '#92400e',
    fontSize: '0.96rem',
    marginTop: 14,
    textAlign: 'center',
    fontWeight: 700,
    lineHeight: 1.55,
    background: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: 12,
    padding: '10px 12px',
  },

  contentCard: {
    background: '#ffffff',
    borderRadius: 20,
    border: '1px solid #dbe4ef',
    padding: 30,
    boxShadow: '0 12px 30px rgba(15,23,42,0.10)',
  },

  sectionTitle: {
    fontWeight: 900,
    margin: '0 0 24px',
    fontSize: '1.55rem',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    letterSpacing: '-0.02em',
  },

  emptyBox: {
    textAlign: 'center',
    padding: 54,
    color: '#64748b',
    border: '1px dashed #cbd5e1',
    borderRadius: 16,
    background: '#f8fafc',
    fontWeight: 750,
    fontSize: '1.06rem',
    lineHeight: 1.6,
  },

  accordion: {
    borderRadius: '16px !important',
    marginBottom: '16px !important',
    overflow: 'hidden',
    border: '1px solid #dbe4ef',
    boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
    '&:before': {
      display: 'none',
    },
  },

  accordionSummary: {
    background: '#f8fafc !important',
    padding: '10px 20px !important',
    minHeight: '78px !important',
    borderBottom: '1px solid #e2e8f0',
  },

  chapterHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    width: '100%',
  },

  chapterOrder: {
    background: '#1d4ed8',
    color: '#fff',
    borderRadius: 12,
    width: 46,
    height: 46,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    fontWeight: 900,
    flexShrink: 0,
    boxShadow: '0 6px 14px rgba(29,78,216,.22)',
  },

  chapterTitle: {
    fontWeight: 900,
    fontSize: '1.25rem',
    color: '#0f172a',
    lineHeight: 1.35,
  },

  chapterMeta: {
    color: '#64748b',
    fontSize: '0.98rem',
    fontWeight: 650,
    marginTop: 4,
  },

  lessonItem: {
    borderRadius: '14px !important',
    border: '1px solid #e2e8f0',
    marginBottom: 10,
    background: '#ffffff',
    padding: '12px 14px !important',
    transition: 'all .16s ease',
    '&:hover': {
      background: '#eff6ff',
      borderColor: '#bfdbfe',
    },
  },

  lessonLocked: {
    opacity: 0.72,
    background: '#f8fafc',
  },

  playIcon: {
    color: '#1d4ed8',
    fontSize: '30px !important',
  },

  lockIcon: {
    color: '#94a3b8',
    fontSize: '28px !important',
  },

  lessonPrimary: {
    fontSize: '1.06rem',
    fontWeight: 850,
    color: '#0f172a',
    lineHeight: 1.45,
  },

  lessonSecondary: {
    fontSize: '0.96rem',
    color: '#64748b',
    fontWeight: 600,
    lineHeight: 1.45,
  },

  freeLessonChip: {
    display: 'inline-block',
    fontSize: '.78rem',
    color: '#047857',
    fontWeight: 850,
    marginLeft: 9,
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    padding: '4px 9px',
    borderRadius: 999,
    verticalAlign: 'middle',
  },

  lockedTag: {
    fontSize: '0.9rem',
    color: '#92400e',
    fontWeight: 850,
    whiteSpace: 'nowrap',
    border: '1px solid #fde68a',
    background: '#fffbeb',
    padding: '6px 11px',
    borderRadius: 999,
  },

  loading: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f5f7fb',
  },

  notFound: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f5f7fb',
    color: '#334155',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
    fontSize: '1.15rem',
    fontWeight: 800,
  },

  '@media (max-width: 960px)': {
    heroGrid: {
      gridTemplateColumns: '1fr',
    },
    enrollCard: {
      maxWidth: 420,
    },
  },
}));

function getLevelColor(level) {
  return LEVEL_COLORS[level] || LEVEL_COLORS['Tất cả'];
}

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
  const [paymentOpen, setPaymentOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);

      try {
        const res = await courseApi.getCourseDetail(id);
        if (mounted && res.status === 200) setCourse(res.data.course);
      } catch (e) {}

      if (isAuth) {
        try {
          const enrollRes = await courseApi.getStudentCourses();

          if (mounted && enrollRes.status === 200) {
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

      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [id, isAuth]);

  const handleEnroll = async () => {
    if (!isAuth) {
      history.push(ROUTES.LOGIN);
      return;
    }

    // Khóa học có phí → mở modal thanh toán
    if (course && !course.isFree) {
      setPaymentOpen(true);
      return;
    }
    setEnrolling(true);

    try {
      const res = await courseApi.enrollCourse(id);

      if (res.status === 200) {
        setIsEnrolled(true);
        dispatch(setMessage({ type: 'success', message: 'Đăng ký thành công! Bạn có thể học ngay.' }));
      }
    } catch (e) {
      dispatch(setMessage({
        type: 'error',
        message: e.response?.data?.message || 'Lỗi đăng ký.',
      }));
    }

    setEnrolling(false);
  };

  const handlePaymentSuccess = () => {
    setIsEnrolled(true);
    setIsPending(false);
  };


  const handleLearnLesson = (lessonId, canAccess) => {
    if (!canAccess) {
      dispatch(setMessage({ type: 'warning', message: 'Bạn cần đăng ký khóa học để học bài này.' }));
      return;
    }

    history.push(`/courses/${id}/learn/${lessonId}`);
  };

  const getLessonTypeLabel = (type) => {
    switch (type) {
      case 'video':
        return 'Video + bài tập';
      case 'flashcard':
        return 'Flashcard từ vựng';
      case 'quiz':
        return 'Trắc nghiệm';
      case 'fill_blank':
        return 'Điền từ';
      case 'text':
        return 'Lý thuyết';
      case 'mixed':
        return 'Kết hợp';
      default:
        return 'Bài học';
    }
  };

  if (loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress style={{ color: '#1d4ed8' }} size={54} thickness={4.5} />
      </div>
    );
  }

  if (!course) {
    return <div className={classes.notFound}>Không tìm thấy khóa học.</div>;
  }

  const isTeacherOfCourse = role === 'teacher';
  const levelColor = getLevelColor(course.level);

  return (
    <div className={classes.page}>
      <div className={classes.wrapper}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => history.push('/courses')}
          className={classes.backBtn}
        >
          Quay lại khóa học
        </Button>

        <div className={classes.hero}>
          <div className={classes.heroGrid}>
            <div>
              <Chip
                label={course.level || 'Chưa phân loại'}
                className={classes.levelChip}
                style={{ background: levelColor }}
              />

              <h1 className={classes.courseTitle}>{course.title}</h1>

              <p className={classes.description}>
                {course.description || 'Khóa học giúp học sinh học tiếng Anh theo từng bài, dễ hiểu và dễ luyện tập.'}
              </p>

              <div className={classes.metaGrid}>
                <span className={classes.metaPill}>
                  <PersonIcon style={{ fontSize: 20 }} />
                  Giáo viên: <strong>{course.teacherName || '—'}</strong>
                </span>

                <span className={classes.metaPill}>
                  <BookIcon style={{ fontSize: 20 }} />
                  {course.totalLessons || 0} bài học
                </span>

                <span className={classes.metaPill}>
                  <PeopleIcon style={{ fontSize: 20 }} />
                  {course.totalStudents || 0} học viên
                </span>

                <span className={classes.metaPill}>
                  <SchoolIcon style={{ fontSize: 20 }} />
                  Cấp độ: {course.level || '—'}
                </span>
              </div>
            </div>

            <div className={classes.enrollCard}>
              <div className={classes.priceLabel}>Học phí</div>

              <div className={classes.price}>
                {course.isFree
                  ? 'Miễn phí'
                  : new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(course.price || 0)}
              </div>

              {isTeacherOfCourse ? (
                <Button className={classes.enrolledBtn} variant="contained" disabled>
                  Giáo viên quản lý
                </Button>
              ) : isEnrolled ? (
                <Button className={classes.enrolledBtn} variant="contained" disabled>
                  Đã đăng ký
                </Button>
              ) : isPending ? (
                <Button className={classes.pendingBtn} variant="contained" disabled>
                  Đang chờ duyệt
                </Button>
              ) : (
                <Button
                  className={classes.enrollBtn}
                  variant="contained"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? (
                    <CircularProgress size={22} style={{ color: '#fff' }} />
                  ) : course.isFree ? (
                    'Đăng ký miễn phí'
                  ) : (
                    'Đăng ký học ngay'
                  )}
                </Button>
              )}

              {isPending && (
                <p className={classes.pendingNote}>
                  Yêu cầu của bạn đang được giáo viên xem xét.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className={classes.contentCard}>
          <h2 className={classes.sectionTitle}>
            <BookIcon style={{ fontSize: 28, color: '#1d4ed8' }} />
            Nội dung khóa học
          </h2>

          {!course.chapters || course.chapters.length === 0 ? (
            <div className={classes.emptyBox}>
              Khóa học chưa có nội dung.
            </div>
          ) : (
            course.chapters.map((chapter) => (
              <Accordion
                key={chapter._id}
                defaultExpanded={chapter.order === 1}
                className={classes.accordion}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className={classes.accordionSummary}
                >
                  <div className={classes.chapterHeader}>
                    <span className={classes.chapterOrder}>{chapter.order}</span>

                    <div>
                      <div className={classes.chapterTitle}>{chapter.title}</div>
                      <div className={classes.chapterMeta}>
                        {chapter.lessons?.length || 0} bài học
                        {chapter.isFree ? ' · Có thể xem thử' : ''}
                      </div>
                    </div>
                  </div>
                </AccordionSummary>

                <AccordionDetails style={{ padding: '16px 20px 22px' }}>
                  <List dense style={{ width: '100%' }}>
                    {chapter.lessons?.map((lesson) => {
                      const canAccess =
                        lesson.isFree || course.isFree || isEnrolled || isTeacherOfCourse;

                      return (
                        <ListItem
                          key={lesson._id}
                          className={`${classes.lessonItem} ${
                            !canAccess ? classes.lessonLocked : ''
                          }`}
                          button
                          onClick={() => handleLearnLesson(lesson._id, canAccess)}
                        >
                          <ListItemIcon style={{ minWidth: 46 }}>
                            {canAccess ? (
                              <PlayCircleIcon className={classes.playIcon} />
                            ) : (
                              <LockIcon className={classes.lockIcon} />
                            )}
                          </ListItemIcon>

                          <ListItemText
                            primary={
                              <span className={classes.lessonPrimary}>
                                Bài {lesson.order}: {lesson.title}
                                {lesson.isFree && (
                                  <span className={classes.freeLessonChip}>Xem thử</span>
                                )}
                              </span>
                            }
                            secondary={
                              <span className={classes.lessonSecondary}>
                                {getLessonTypeLabel(lesson.type)}
                                {lesson.timeLimit > 0 && ` · ${lesson.timeLimit} phút`}
                                {lesson.videoUrl && ' · Có video'}
                              </span>
                            }
                          />

                          {!canAccess && (
                            <span className={classes.lockedTag}>
                              {isPending ? 'Chờ duyệt' : 'Đăng ký để học'}
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

            {/* Modal thanh toán */}
            <PaymentModal
              open={paymentOpen}
              onClose={() => setPaymentOpen(false)}
              courseId={id}
              courseTitle={course?.title}
              amount={course?.price}
              courseRoute={`/courses/${id}/detail`}
              onSuccess={() => { handlePaymentSuccess(); setPaymentOpen(false); }}
            />
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;