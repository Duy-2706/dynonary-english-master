import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import SchoolIcon from '@material-ui/icons/School';
import BookIcon from '@material-ui/icons/Book';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import courseApi from 'apis/courseApi';
import useTitle from 'hooks/useTitle';

const useStyle = makeStyles((theme) => ({
  wrapper: { padding: '32px 0' },
  pageTitle: { fontSize: '2.2rem', fontWeight: 700, marginBottom: 8 },
  pageSubtitle: { color: theme.palette.text.secondary, marginBottom: 32, fontSize: '1.05rem' },
  card: {
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' },
  },
  media: { height: 180, backgroundColor: '#e3f2fd' },
  cardContent: { flex: 1, padding: '16px !important' },
  courseTitle: { fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, lineHeight: 1.4 },
  progressLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: theme.palette.text.secondary, marginBottom: 4 },
  statusChip: { marginBottom: 8 },
  loading: { display: 'flex', justifyContent: 'center', padding: 60 },
  empty: { textAlign: 'center', padding: 60, color: theme.palette.text.secondary },
}));

const STATUS_LABEL = {
  active: { label: 'Đang học', color: 'primary' },
  completed: { label: 'Hoàn thành', color: 'default' },
  pending: { label: 'Chờ duyệt', color: 'default' },
  cancelled: { label: 'Đã hủy', color: 'default' },
};

function MyCoursesPage() {
  useTitle('Khóa học của tôi');
  const classes = useStyle();
  const history = useHistory();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await courseApi.getStudentCourses();
        if (res.status === 200) setEnrollments(res.data.enrollments || []);
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className={classes.loading}><CircularProgress /></div>;
  }

  return (
    <div className={`container ${classes.wrapper}`}>
      <h1 className={classes.pageTitle}>Khóa học của tôi</h1>
      <p className={classes.pageSubtitle}>Tiếp tục hành trình học tiếng Anh của bạn</p>

      {enrollments.length === 0 ? (
        <div className={classes.empty}>
          <SchoolIcon style={{ fontSize: 64, opacity: 0.3 }} />
          <p>Bạn chưa đăng ký khóa học nào.</p>
          <Button
            variant="contained"
            className="_btn _btn-primary"
            style={{ marginTop: 16 }}
            onClick={() => history.push('/courses')}>
            Khám phá khóa học
          </Button>
        </div>
      ) : (
        <Grid container spacing={3}>
          {enrollments.map((enrollment) => {
            const course = enrollment.courseId;
            if (!course) return null;
            const progress = enrollment.progressPercent || 0;
            const statusInfo = STATUS_LABEL[enrollment.status] || STATUS_LABEL.active;
            return (
              <Grid item xs={12} sm={6} md={4} key={enrollment.id || enrollment._id}>
                <Card className={classes.card}>
                  {course.thumbnail ? (
                    <CardMedia className={classes.media} image={course.thumbnail} title={course.title} />
                  ) : (
                    <div className={classes.media} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookIcon style={{ fontSize: 64, color: '#90caf9' }} />
                    </div>
                  )}
                  <CardContent className={classes.cardContent}>
                    <Chip className={classes.statusChip} label={statusInfo.label} color={statusInfo.color} size="small" />
                    <h3 className={classes.courseTitle}>{course.title}</h3>
                    <div className={classes.progressLabel}>
                      <span>Tiến độ</span>
                      <span>{progress}%</span>
                    </div>
                    <LinearProgress variant="determinate" value={progress} style={{ borderRadius: 4, height: 6 }} />
                    <p style={{ fontSize: '0.82rem', color: '#888', marginTop: 8 }}>
                      {enrollment.completedLessons || 0}/{enrollment.totalLessons || 0} bài học hoàn thành
                    </p>
                  </CardContent>
                  <CardActions style={{ padding: '8px 16px 16px' }}>
                    <Button
                      variant="contained"
                      className="_btn _btn-primary"
                      style={{ marginLeft: 'auto' }}
                      onClick={() => history.push(`/courses/${course._id || course.id}/detail`)}>
                      {progress > 0 ? 'Tiếp tục học' : 'Bắt đầu học'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </div>
  );
}

export default MyCoursesPage;