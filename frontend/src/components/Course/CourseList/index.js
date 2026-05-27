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
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import courseApi from 'apis/courseApi';
import { ROUTES } from 'constant';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PeopleIcon from '@material-ui/icons/People';

const useStyle = makeStyles((theme) => ({
  wrapper: { padding: '32px 0' },
  pageTitle: {
    fontSize: '2.2rem',  // tăng từ 2rem
    fontWeight: 700,
    marginBottom: 8,
  },
  pageSubtitle: {
    color: theme.palette.text.secondary,
    marginBottom: 32,
    fontSize: '1.05rem',  // thêm
  },
  card: {
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    },
  },
  media: { height: 200, backgroundColor: '#e3f2fd' },  // tăng từ 180
  cardContent: { flex: 1, padding: '16px !important' },
    courseTitle: {
    fontWeight: 700,
    fontSize: '1.25rem',  // tăng
    marginBottom: 10,
    lineHeight: 1.4,
    },
    courseMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: theme.palette.text.secondary,
    fontSize: '0.95rem',  // tăng
    marginBottom: 6,
    },
    price: {
    fontWeight: 700,
    fontSize: '1.15rem',  // tăng
    color: theme.palette.primary.main,
    },
    freeTag: {
    fontWeight: 700,
    fontSize: '1.15rem',  // tăng
    color: '#4caf50',
    },
  loading: { display: 'flex', justifyContent: 'center', padding: 60 },
  empty: { textAlign: 'center', padding: 60, color: theme.palette.text.secondary },
}));

function CourseList() {
  const classes = useStyle();
  const history = useHistory();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await courseApi.getPublishedCourses();
        if (res.status === 200) setCourses(res.data.courses || []);
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

    const goToDetail = (id) => {
    history.push(`/courses/${id}/detail`);
    };

  if (loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={`container ${classes.wrapper}`}>
      <h1 className={classes.pageTitle}>📚 Khóa học tiếng Anh</h1>
      <p className={classes.pageSubtitle}>
        Chọn khóa học phù hợp và bắt đầu hành trình chinh phục tiếng Anh!
      </p>

      {courses.length === 0 ? (
        <div className={classes.empty}>
          <SchoolIcon style={{ fontSize: 64, opacity: 0.3 }} />
          <p>Chưa có khóa học nào được xuất bản.</p>
        </div>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card
                className={classes.card}
                onClick={() => goToDetail(course._id)}>
                {course.thumbnail ? (
                  <CardMedia
                    className={classes.media}
                    image={course.thumbnail}
                    title={course.title}
                  />
                ) : (
                  <div
                    className={classes.media}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <BookIcon style={{ fontSize: 64, color: '#90caf9' }} />
                  </div>
                )}
                <CardContent className={classes.cardContent}>
                  <Chip
                    label={course.level}
                    size="small"
                    color="primary"
                    className={classes.levelChip}
                  />
                  <h3 className={classes.courseTitle}>{course.title}</h3>
                  <div className={classes.courseMeta}>
                    <PersonIcon style={{ fontSize: 18 }} />
                    <span>{course.teacherName}</span>
                    </div>
                    <div className={classes.courseMeta}>
                    <MenuBookIcon style={{ fontSize: 18 }} />
                    <span>{course.totalLessons} bài học</span>
                    <span style={{ margin: '0 4px' }}>·</span>
                    <PeopleIcon style={{ fontSize: 18 }} />
                    <span>{course.totalStudents} học viên</span>
                    </div>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginTop: 8 }}>
                    {course.description?.slice(0, 80)}
                    {course.description?.length > 80 ? '...' : ''}
                  </p>
                </CardContent>
                <CardActions style={{ padding: '8px 16px 16px' }}>
                 {course.isFree ? (
            <span className={classes.freeTag}>Miễn phí</span>
            ) : (
            <span className={classes.price}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
            </span>
            )}
                  <Button
                    variant="contained"
                    className="_btn _btn-primary"
                    style={{ marginLeft: 'auto' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToDetail(course._id);
                    }}>
                    Xem khóa học
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default CourseList;