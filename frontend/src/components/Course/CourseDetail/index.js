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
import StarIcon from '@material-ui/icons/Star';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import courseApi from 'apis/courseApi';
import { ROUTES } from 'constant';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';

const LEVEL_COLORS = {
  A1: ['#19c7a8', '#07947f'],
  A2: ['#0a84ff', '#00439d'],
  B1: ['#ff8a00', '#bd5f00'],
  B2: ['#ff1493', '#9b0054'],
  C1: ['#7b1cff', '#360087'],
  C2: ['#34c759', '#087a3c'],
  'Tất cả': ['#19c7a8', '#07947f'],
};

const useStyle = makeStyles(() => ({
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 12% 18%, rgba(25,199,168,.22) 0 4px, transparent 5px),
      radial-gradient(circle at 86% 24%, rgba(255,191,31,.16) 0 5px, transparent 6px),
      radial-gradient(circle at 34% 74%, rgba(255,255,255,.10) 0 3px, transparent 4px),
      linear-gradient(180deg, #063c46 0%, #042b33 100%)
    `,
    backgroundSize: '90px 90px, 130px 130px, 110px 110px, auto',
    padding: '42px 0 90px',
    fontFamily: GAME_FONT,
  },

  wrapper: {
    maxWidth: 1380,
    margin: '0 auto',
    padding: '0 34px',
  },

  backBtn: {
    marginBottom: '22px !important',
    background: 'linear-gradient(180deg,#ffffff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '4px solid #19c7a8 !important',
    borderRadius: '999px !important',
    padding: '11px 22px !important',
    fontSize: '1.08rem !important',
    fontWeight: '900 !important',
    fontFamily: `${GAME_FONT} !important`,
    textTransform: 'none !important',
    boxShadow: '0 6px 0 rgba(7,148,127,.20) !important',
  },

  hero: {
    background: 'linear-gradient(180deg,#ffffff 0%,#eefdf9 100%)',
    borderRadius: 40,
    border: '7px solid rgba(255,255,255,.96)',
    boxShadow: '0 12px 0 rgba(7,148,127,.55), 0 24px 48px rgba(0,0,0,.22)',
    padding: '42px',
    marginBottom: 38,
    position: 'relative',
    overflow: 'hidden',
  },

  heroDecor: {
    position: 'absolute',
    right: 44,
    top: 28,
    fontSize: '6rem',
    opacity: 0.13,
    transform: 'rotate(-10deg)',
  },

  heroGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 340px',
    gap: 34,
    position: 'relative',
    zIndex: 2,
  },

  heroLeft: {
    minWidth: 0,
  },

  levelChip: {
    height: 'auto !important',
    borderRadius: '999px !important',
    color: '#fff !important',
    border: '4px solid #fff !important',
    fontFamily: `${GAME_FONT} !important`,
    fontWeight: '900 !important',
    fontSize: '1.12rem !important',
    padding: '7px 8px !important',
    boxShadow: '0 6px 0 rgba(0,0,0,.18)',
    textShadow: '0 2px 0 rgba(0,0,0,.18)',
    marginBottom: '18px !important',
  },

  courseTitle: {
    fontSize: 'clamp(3rem, 5vw, 5.2rem)',
    fontWeight: 900,
    color: '#06434b',
    margin: '0 0 18px',
    lineHeight: 0.92,
    textShadow: '0 4px 0 rgba(25,199,168,.18)',
  },

  description: {
    color: '#07545c',
    fontSize: '1.28rem',
    fontWeight: 850,
    lineHeight: 1.6,
    margin: '0 0 22px',
  },

  metaGrid: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
  },

  metaPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#fff',
    color: '#06434b',
    border: '3px solid #d6f3ed',
    borderRadius: 999,
    padding: '10px 16px',
    fontSize: '1.08rem',
    fontWeight: 900,
    boxShadow: '0 5px 0 rgba(7,148,127,.12)',
  },

  enrollCard: {
    background: 'linear-gradient(180deg,#ffffff,#fff8e1)',
    borderRadius: 32,
    border: '6px solid #ffcf45',
    padding: 28,
    boxShadow: '0 10px 0 #bd7800, 0 22px 42px rgba(0,0,0,.18)',
    alignSelf: 'start',
  },

  priceLabel: {
    color: '#9b5c00',
    fontSize: '1.08rem',
    fontWeight: 900,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  price: {
    color: '#ff8a00',
    fontSize: '2.7rem',
    fontWeight: 900,
    lineHeight: 1,
    marginBottom: 22,
    textShadow: '0 3px 0 rgba(184,79,0,.14)',
  },

  enrollBtn: {
    width: '100%',
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00) !important',
    color: '#fff !important',
    border: '4px solid #fff !important',
    fontWeight: '900 !important',
    borderRadius: '999px !important',
    padding: '15px 18px !important',
    fontSize: '1.18rem !important',
    fontFamily: `${GAME_FONT} !important`,
    textTransform: 'none !important',
    boxShadow: '0 8px 0 #bd5f00 !important',
    textShadow: '0 2px 0 rgba(0,0,0,.18)',
  },

  enrolledBtn: {
    width: '100%',
    background: 'linear-gradient(180deg,#36e27d,#0ca84f) !important',
    color: '#fff !important',
    border: '4px solid #fff !important',
    fontWeight: '900 !important',
    borderRadius: '999px !important',
    padding: '15px 18px !important',
    fontSize: '1.18rem !important',
    fontFamily: `${GAME_FONT} !important`,
    textTransform: 'none !important',
    boxShadow: '0 8px 0 #087a3c !important',
  },

  pendingBtn: {
    width: '100%',
    background: 'linear-gradient(180deg,#9aa8b8,#64748b) !important',
    color: '#fff !important',
    border: '4px solid #fff !important',
    fontWeight: '900 !important',
    borderRadius: '999px !important',
    padding: '15px 18px !important',
    fontSize: '1.12rem !important',
    fontFamily: `${GAME_FONT} !important`,
    textTransform: 'none !important',
    boxShadow: '0 8px 0 #475569 !important',
  },

  pendingNote: {
    color: '#7a5200',
    fontSize: '1.05rem',
    marginTop: 14,
    textAlign: 'center',
    fontWeight: 900,
    lineHeight: 1.45,
  },

  contentCard: {
    background: '#fff',
    borderRadius: 36,
    border: '7px solid rgba(255,255,255,.95)',
    padding: 34,
    boxShadow: '0 12px 0 rgba(7,148,127,.38), 0 24px 48px rgba(0,0,0,.20)',
  },

  sectionTitle: {
    fontWeight: 900,
    margin: '0 0 26px',
    fontSize: '2.2rem',
    color: '#06434b',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textShadow: '0 3px 0 rgba(25,199,168,.12)',
  },

  emptyBox: {
    textAlign: 'center',
    padding: 58,
    color: '#07545c',
    border: '5px dashed #d6f3ed',
    borderRadius: 30,
    background: '#f7fffd',
    fontWeight: 900,
    fontSize: '1.28rem',
    lineHeight: 1.5,
  },

  accordion: {
    borderRadius: '30px !important',
    marginBottom: '20px !important',
    overflow: 'hidden',
    border: '5px solid #d6f3ed',
    boxShadow: '0 8px 0 rgba(7,148,127,.18), 0 16px 32px rgba(0,0,0,.12)',
    '&:before': {
      display: 'none',
    },
  },

  accordionSummary: {
    background: 'linear-gradient(180deg,#eefdf9,#ffffff) !important',
    padding: '12px 24px !important',
    minHeight: '82px !important',
  },

  chapterHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },

  chapterOrder: {
    background: 'linear-gradient(180deg,#19c7a8,#07947f)',
    color: '#fff',
    borderRadius: '50%',
    width: 52,
    height: 52,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.35rem',
    fontWeight: 900,
    flexShrink: 0,
    border: '4px solid #fff',
    boxShadow: '0 5px 0 rgba(0,0,0,.14)',
  },

  chapterTitle: {
    fontWeight: 900,
    fontSize: '1.55rem',
    color: '#06434b',
    lineHeight: 1.2,
  },

  chapterMeta: {
    color: '#07545c',
    fontSize: '1.08rem',
    fontWeight: 800,
    marginTop: 5,
  },

  lessonItem: {
    borderRadius: '24px !important',
    border: '4px solid #eef7f5',
    marginBottom: 14,
    background: '#fff',
    padding: '13px 18px !important',
    boxShadow: '0 5px 0 rgba(7,148,127,.08)',
    transition: 'all .18s ease',
    '&:hover': {
      background: '#f3fffc',
      borderColor: '#19c7a8',
      transform: 'translateY(-2px)',
    },
  },

  lessonLocked: {
    opacity: 0.68,
    background: '#f8fafc',
  },

  playIcon: {
    color: '#19c7a8',
    fontSize: '34px !important',
    filter: 'drop-shadow(0 2px 0 rgba(0,0,0,.12))',
  },

  lockIcon: {
    color: '#94a3b8',
    fontSize: '30px !important',
  },

  lessonPrimary: {
    fontSize: '1.22rem',
    fontWeight: 900,
    color: '#06434b',
    lineHeight: 1.35,
  },

  lessonSecondary: {
    fontSize: '1.05rem',
    color: '#07545c',
    fontWeight: 800,
    lineHeight: 1.4,
  },

  freeLessonChip: {
    display: 'inline-block',
    fontSize: '.9rem',
    color: '#057a55',
    fontWeight: 900,
    marginLeft: 10,
    backgroundColor: '#d4f5eb',
    border: '2px solid #a8e8db',
    padding: '3px 9px',
    borderRadius: 999,
    verticalAlign: 'middle',
  },

  lockedTag: {
    fontSize: '1rem',
    color: '#b84f00',
    fontWeight: 900,
    whiteSpace: 'nowrap',
    border: '3px solid #ffcf45',
    background: '#fff8e1',
    padding: '5px 12px',
    borderRadius: 999,
  },

  loading: {
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#042b33',
  },

  notFound: {
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#042b33',
    color: '#fff',
    fontFamily: GAME_FONT,
    fontSize: '1.4rem',
    fontWeight: 900,
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

function getLevelGradient(level) {
  const colors = LEVEL_COLORS[level] || LEVEL_COLORS['Tất cả'];
  return `linear-gradient(180deg, ${colors[0]}, ${colors[1]})`;
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

    setEnrolling(true);

    try {
      const res = await courseApi.enrollCourse(id);

      if (res.status === 200) {
        if (res.data.isPending) {
          setIsPending(true);
          dispatch(setMessage({ type: 'info', message: 'Đã gửi yêu cầu! Chờ giáo viên duyệt.' }));
        } else {
          setIsEnrolled(true);
          dispatch(setMessage({ type: 'success', message: 'Đăng ký thành công! Bạn có thể học ngay.' }));
        }
      }
    } catch (e) {
      dispatch(setMessage({
        type: 'error',
        message: e.response?.data?.message || 'Lỗi đăng ký.',
      }));
    }

    setEnrolling(false);
  };

  const handleLearnLesson = (lessonId, canAccess) => {
    if (!canAccess) {
      dispatch(setMessage({ type: 'warning', message: 'Bạn cần đăng ký khóa học để học bài này!' }));
      return;
    }

    history.push(`/courses/${id}/learn/${lessonId}`);
  };

  const getLessonTypeLabel = (type) => {
    switch (type) {
      case 'video':
        return 'Video + Bài tập';
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
        <CircularProgress style={{ color: '#fff' }} size={58} thickness={5} />
      </div>
    );
  }

  if (!course) {
    return <div className={classes.notFound}>Không tìm thấy khóa học.</div>;
  }

  const isTeacherOfCourse = role === 'teacher';
  const levelGradient = getLevelGradient(course.level);

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
          <div className={classes.heroDecor}>🎓</div>

          <div className={classes.heroGrid}>
            <div className={classes.heroLeft}>
              <Chip
                label={`🎯 ${course.level}`}
                className={classes.levelChip}
                style={{ background: levelGradient }}
              />

              <h1 className={classes.courseTitle}>{course.title}</h1>

              <p className={classes.description}>
                {course.description || 'Khóa học giúp bạn học tiếng Anh theo từng bài, dễ hiểu và dễ luyện tập.'}
              </p>

              <div className={classes.metaGrid}>
                <span className={classes.metaPill}>
                  <PersonIcon style={{ fontSize: 22 }} />
                  Giáo viên: <strong>{course.teacherName}</strong>
                </span>

                <span className={classes.metaPill}>
                  <BookIcon style={{ fontSize: 22 }} />
                  {course.totalLessons} bài học
                </span>

                <span className={classes.metaPill}>
                  <PeopleIcon style={{ fontSize: 22 }} />
                  {course.totalStudents} học viên
                </span>

                <span className={classes.metaPill}>
                  <SchoolIcon style={{ fontSize: 22 }} />
                  Cấp độ: {course.level}
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
                  Đã đăng ký · Đang học
                </Button>
              ) : isPending ? (
                <Button className={classes.pendingBtn} variant="contained" disabled>
                  Đang chờ giáo viên duyệt
                </Button>
              ) : (
                <Button
                  className={classes.enrollBtn}
                  variant="contained"
                  onClick={handleEnroll}
                  disabled={enrolling}
                  startIcon={!enrolling ? <StarIcon /> : null}
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
            <BookIcon style={{ fontSize: 34 }} />
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

                <AccordionDetails style={{ padding: '16px 22px 22px' }}>
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
                          <ListItemIcon style={{ minWidth: 48 }}>
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
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;