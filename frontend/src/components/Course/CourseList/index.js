import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import SchoolIcon from '@material-ui/icons/School';
import PersonIcon from '@material-ui/icons/Person';
import BookIcon from '@material-ui/icons/Book';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PeopleIcon from '@material-ui/icons/People';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import courseApi from 'apis/courseApi';

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

  hero: {
    background: 'linear-gradient(180deg,#ffffff 0%,#eefdf9 100%)',
    borderRadius: 38,
    border: '7px solid rgba(255,255,255,.96)',
    boxShadow: '0 12px 0 rgba(7,148,127,.55), 0 24px 48px rgba(0,0,0,.22)',
    padding: '44px 48px',
    marginBottom: 44,
    position: 'relative',
    overflow: 'hidden',
  },

  heroDecor: {
    position: 'absolute',
    right: 42,
    top: 22,
    fontSize: '6rem',
    opacity: 0.14,
    transform: 'rotate(-10deg)',
  },

  heroBadge: {
    display: 'inline-block',
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '9px 20px',
    fontWeight: 900,
    fontSize: '1.12rem',
    boxShadow: '0 7px 0 #bd5f00',
    textShadow: '0 2px 0 rgba(0,0,0,.18)',
    marginBottom: 18,
  },

  pageTitle: {
    fontSize: 'clamp(3.2rem, 5.6vw, 5.6rem)',
    fontWeight: 900,
    margin: 0,
    lineHeight: 0.9,
    color: '#06434b',
    letterSpacing: '.2px',
    textShadow: '0 4px 0 rgba(25,199,168,.18)',
  },

  pageSubtitle: {
    color: '#07685d',
    margin: '18px 0 0',
    fontSize: '1.38rem',
    fontWeight: 900,
    lineHeight: 1.45,
    maxWidth: 760,
  },

  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: 90,
  },

  empty: {
    background: '#fff',
    borderRadius: 34,
    padding: 74,
    textAlign: 'center',
    border: '6px dashed #19c7a8',
    boxShadow: '0 10px 0 rgba(7,148,127,.35), 0 22px 45px rgba(0,0,0,.18)',
    color: '#06434b',
    fontSize: '1.35rem',
    fontWeight: 900,
  },

  courseCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '34px !important',
    border: '6px solid #19c7a8',
    boxShadow: '0 10px 0 #07947f, 0 22px 40px rgba(0,0,0,.24)',
    overflow: 'hidden',
    background: '#fff',
    transition: 'transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .22s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-8px) scale(1.018)',
      boxShadow: '0 14px 0 #07947f, 0 30px 56px rgba(0,0,0,.30)',
    },
  },

  mediaWrap: {
    position: 'relative',
    height: 230,
    overflow: 'hidden',
    background: 'linear-gradient(135deg,#19c7a8,#087565)',
  },

  media: {
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'transform .25s ease',
  },

  placeholderMedia: {
    height: '100%',
    background: `
      radial-gradient(circle at 22% 20%, rgba(255,255,255,.28), transparent 18%),
      linear-gradient(135deg,#19c7a8,#087565)
    `,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mediaOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.34) 100%)',
  },

  levelChip: {
    position: 'absolute',
    top: 16,
    left: 16,
    height: 'auto !important',
    borderRadius: '999px !important',
    border: '4px solid #fff !important',
    color: '#fff !important',
    fontFamily: `${GAME_FONT} !important`,
    fontWeight: '900 !important',
    fontSize: '1.02rem !important',
    padding: '6px 5px !important',
    boxShadow: '0 6px 0 rgba(0,0,0,.20)',
    textShadow: '0 2px 0 rgba(0,0,0,.18)',
  },

  freeBadge: {
    position: 'absolute',
    right: 16,
    top: 16,
    background: 'linear-gradient(180deg,#36e27d,#0ca84f)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '7px 16px',
    fontWeight: 900,
    fontSize: '1rem',
    boxShadow: '0 6px 0 #087a3c',
    textShadow: '0 2px 0 rgba(0,0,0,.18)',
  },

  cardContent: {
    flex: 1,
    padding: '26px !important',
  },

  courseTitle: {
    fontWeight: 900,
    fontSize: '1.85rem',
    margin: '0 0 16px',
    lineHeight: 1.15,
    color: '#06434b',
  },

  courseMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#07545c',
    fontSize: '1.16rem',
    fontWeight: 900,
    marginBottom: 9,
    lineHeight: 1.45,
  },

  description: {
    fontSize: '1.08rem',
    color: '#24474c',
    marginTop: 16,
    lineHeight: 1.6,
    fontWeight: 800,
  },

  price: {
    display: 'inline-block',
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    borderRadius: 999,
    padding: '9px 17px',
    fontSize: '1.12rem',
    fontWeight: 900,
    border: '3px solid #fff',
    boxShadow: '0 5px 0 #bd5f00',
    textShadow: '0 2px 0 rgba(0,0,0,.18)',
  },

  freeTag: {
    display: 'inline-block',
    background: 'linear-gradient(180deg,#36e27d,#0ca84f)',
    color: '#fff',
    borderRadius: 999,
    padding: '9px 17px',
    fontSize: '1.12rem',
    fontWeight: 900,
    border: '3px solid #fff',
    boxShadow: '0 5px 0 #087a3c',
    textShadow: '0 2px 0 rgba(0,0,0,.18)',
  },

  cardActions: {
    padding: '0 24px 26px !important',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },

  viewBtn: {
    marginLeft: 'auto !important',
    background: 'linear-gradient(180deg,#19c7a8,#07947f) !important',
    color: '#fff !important',
    border: '4px solid #fff !important',
    borderRadius: '999px !important',
    padding: '11px 20px !important',
    fontSize: '1.08rem !important',
    fontWeight: '900 !important',
    fontFamily: `${GAME_FONT} !important`,
    textTransform: 'none !important',
    boxShadow: '0 6px 0 #087565 !important',
    textShadow: '0 2px 0 rgba(0,0,0,.18)',
  },
}));

function getLevelGradient(level) {
  const colors = LEVEL_COLORS[level] || LEVEL_COLORS['Tất cả'];
  return `linear-gradient(180deg, ${colors[0]}, ${colors[1]})`;
}

function formatPrice(course) {
  if (course.isFree) return 'Miễn phí';

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(course.price || 0);
}

function CourseList() {
  const classes = useStyle();
  const history = useHistory();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);

      try {
        const res = await courseApi.getPublishedCourses();

        if (mounted && res.status === 200) {
          setCourses(res.data.courses || []);
        }
      } catch (e) {
        if (mounted) setCourses([]);
      }

      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const goToDetail = (id) => {
    history.push(`/courses/${id}/detail`);
  };

  return (
    <div className={classes.page}>
      <div className={classes.wrapper}>
        <div className={classes.hero}>
          <div className={classes.heroDecor}>📚</div>

          <div className={classes.heroBadge}>COURSE LIBRARY</div>

          <h1 className={classes.pageTitle}>Khóa Học Tiếng Anh</h1>

          <p className={classes.pageSubtitle}>
            Chọn khóa học phù hợp, học từng bài rõ ràng và luyện tập bằng video,
            flashcard, trắc nghiệm, điền từ.
          </p>
        </div>

        {loading ? (
          <div className={classes.loading}>
            <CircularProgress style={{ color: '#fff' }} size={58} thickness={5} />
          </div>
        ) : courses.length === 0 ? (
          <div className={classes.empty}>
            <SchoolIcon style={{ fontSize: 82, opacity: 0.45, marginBottom: 14 }} />
            <p style={{ margin: 0 }}>Chưa có khóa học nào được xuất bản.</p>
            <p style={{ margin: '10px 0 0', color: '#087565' }}>
              Hãy quay lại sau nhé!
            </p>
          </div>
        ) : (
          <Grid container spacing={4}>
            {courses.map((course) => {
              const levelGradient = getLevelGradient(course.level);

              return (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <Card
                    className={classes.courseCard}
                    onClick={() => goToDetail(course._id)}
                    style={{
                      borderColor: LEVEL_COLORS[course.level]?.[0] || '#19c7a8',
                      boxShadow: `0 10px 0 ${
                        LEVEL_COLORS[course.level]?.[1] || '#07947f'
                      }, 0 22px 40px rgba(0,0,0,.24)`,
                    }}
                  >
                    <div className={classes.mediaWrap}>
                      {course.thumbnail ? (
                        <CardMedia
                          className={classes.media}
                          image={course.thumbnail}
                          title={course.title}
                        />
                      ) : (
                        <div className={classes.placeholderMedia} style={{ background: levelGradient }}>
                          <BookIcon style={{ fontSize: 86, color: '#fff', opacity: 0.92 }} />
                        </div>
                      )}

                      <div className={classes.mediaOverlay} />

                      <Chip
                        label={course.level || 'Tất cả'}
                        size="small"
                        className={classes.levelChip}
                        style={{ background: levelGradient }}
                      />

                      {course.isFree && <div className={classes.freeBadge}>FREE</div>}
                    </div>

                    <CardContent className={classes.cardContent}>
                      <h3 className={classes.courseTitle}>{course.title}</h3>

                      <div className={classes.courseMeta}>
                        <PersonIcon style={{ fontSize: 22 }} />
                        <span>{course.teacherName || 'Giáo viên'}</span>
                      </div>

                      <div className={classes.courseMeta}>
                        <MenuBookIcon style={{ fontSize: 22 }} />
                        <span>{course.totalLessons || 0} bài học</span>
                      </div>

                      <div className={classes.courseMeta}>
                        <PeopleIcon style={{ fontSize: 22 }} />
                        <span>{course.totalStudents || 0} học viên</span>
                      </div>

                      <p className={classes.description}>
                        {course.description
                          ? `${course.description.slice(0, 110)}${
                              course.description.length > 110 ? '...' : ''
                            }`
                          : 'Khóa học giúp bạn luyện tiếng Anh theo từng bài học rõ ràng, dễ theo dõi.'}
                      </p>
                    </CardContent>

                    <CardActions
                      className={classes.cardActions}
                      onClick={(event) => event.stopPropagation()}
                    >
                      {course.isFree ? (
                        <span className={classes.freeTag}>Miễn phí</span>
                      ) : (
                        <span className={classes.price}>{formatPrice(course)}</span>
                      )}

                      <Button
                        variant="contained"
                        className={classes.viewBtn}
                        startIcon={<PlayArrowIcon />}
                        onClick={() => goToDetail(course._id)}
                      >
                        Xem khóa học
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </div>
    </div>
  );
}

export default CourseList;