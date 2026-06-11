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
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PeopleIcon from '@material-ui/icons/People';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import courseApi from 'apis/courseApi';

const AVATAR_GRADS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  'linear-gradient(135deg,#fda085,#f6d365)',
  'linear-gradient(135deg,#89f7fe,#66a6ff)',
];

function teacherColor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return AVATAR_GRADS[Math.abs(h) % AVATAR_GRADS.length];
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

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
    cursor: 'pointer',
    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' },
  },
  media: { height: 200, backgroundColor: '#e3f2fd' },
  cardContent: { flex: 1, padding: '16px !important' },
  courseTitle: { fontWeight: 700, fontSize: '1.25rem', marginBottom: 10, lineHeight: 1.4 },
  courseMeta: {
    display: 'flex', alignItems: 'center', gap: 6,
    color: theme.palette.text.secondary, fontSize: '0.95rem', marginBottom: 6,
  },
  price: { fontWeight: 700, fontSize: '1.15rem', color: theme.palette.primary.main },
  freeTag: { fontWeight: 700, fontSize: '1.15rem', color: '#4caf50' },
  loading: { display: 'flex', justifyContent: 'center', padding: 60 },
  empty: { textAlign: 'center', padding: 60, color: theme.palette.text.secondary },

  // Teacher card styles
  teacherCard: {
    borderRadius: 20,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.06)',
    '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 36px rgba(0,0,0,0.14)' },
  },
  teacherCardTop: {
    padding: '28px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  teacherCardBottom: {
    padding: '14px 20px 18px',
    borderTop: '1px solid rgba(0,0,0,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '8px 20px', borderRadius: 24, border: 'none',
    background: 'rgba(0,0,0,0.06)', color: 'inherit',
    cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
    fontFamily: 'inherit',
    '&:hover': { background: 'rgba(0,0,0,0.10)' },
  },
}));

// ─── Teacher card ─────────────────────────────────────────────────────────────
function TeacherCard({ teacher, onClick }) {
  const classes = useStyle();
  const grad = teacherColor(teacher.name);
  const levels = [...new Set(teacher.courses.map((c) => c.level).filter(Boolean))];

  return (
    <Card className={classes.teacherCard} onClick={onClick}>
      <div className={classes.teacherCardTop} style={{ background: grad }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.7rem', fontWeight: 900, color: '#fff',
          marginBottom: 12, border: '3px solid rgba(255,255,255,0.5)',
        }}>
          {getInitials(teacher.name)}
        </div>
        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: 4 }}>
          {teacher.name}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>Giáo viên</div>
      </div>

      <div style={{ padding: '14px 20px 10px', display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {levels.map((lv) => (
          <Chip key={lv} label={lv} size="small" color="primary" style={{ fontWeight: 700 }} />
        ))}
        {levels.length === 0 && <span style={{ fontSize: '0.8rem', color: '#aaa' }}>—</span>}
      </div>

      <div className={classes.teacherCardBottom}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.88rem', color: '#555', fontWeight: 600 }}>
          <MenuBookIcon style={{ fontSize: 16, color: '#667eea' }} />
          {teacher.courses.length} khóa học
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.88rem', color: '#555', fontWeight: 600 }}>
          <PeopleIcon style={{ fontSize: 16, color: '#43e97b' }} />
          {teacher.totalStudents} học viên
        </div>
        <Button variant="contained" size="small" className="_btn _btn-primary" style={{ borderRadius: 20, fontSize: '0.78rem' }}>
          Xem khóa học
        </Button>
      </div>
    </Card>
  );
}

// ─── Course card ──────────────────────────────────────────────────────────────
function CourseCard({ course, onView }) {
  const classes = useStyle();
  return (
    <Card className={classes.card} onClick={() => onView(course._id)}>
      {course.thumbnail ? (
        <CardMedia className={classes.media} image={course.thumbnail} title={course.title} />
      ) : (
        <div className={classes.media} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookIcon style={{ fontSize: 64, color: '#90caf9' }} />
        </div>
      )}
      <CardContent className={classes.cardContent}>
        <Chip label={course.level} size="small" color="primary" style={{ marginBottom: 8 }} />
        <h3 className={classes.courseTitle}>{course.title}</h3>
        <div className={classes.courseMeta}>
          <MenuBookIcon style={{ fontSize: 18 }} />
          <span>{course.totalLessons} bài học</span>
          <span style={{ margin: '0 4px' }}>·</span>
          <PeopleIcon style={{ fontSize: 18 }} />
          <span>{course.totalStudents} học viên</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: 8, lineHeight: 1.5 }}>
          {course.description?.slice(0, 90)}{course.description?.length > 90 ? '...' : ''}
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
          onClick={(e) => { e.stopPropagation(); onView(course._id); }}>
          Xem khóa học
        </Button>
      </CardActions>
    </Card>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
function CourseList() {
  const classes = useStyle();
  const history = useHistory();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await courseApi.getPublishedCourses(1, 500);
        if (res.status === 200) setCourses(res.data.courses || []);
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  // Auto-group courses by teacher — no admin config needed
  const teacherMap = {};
  courses.forEach((c) => {
    const tid = c.teacherAccountId || c.teacherName;
    if (!teacherMap[tid]) {
      teacherMap[tid] = { id: tid, name: c.teacherName, courses: [], totalStudents: 0 };
    }
    teacherMap[tid].courses.push(c);
    teacherMap[tid].totalStudents += c.totalStudents || 0;
  });
  const teachers = Object.values(teacherMap).sort((a, b) => b.courses.length - a.courses.length);

  const selectedTeacher = selectedTeacherId ? teacherMap[selectedTeacherId] : null;

  const goToDetail = (id) => history.push(`/courses/${id}/detail`);

  if (loading) {
    return <div className={classes.loading}><CircularProgress /></div>;
  }

  // ── Teacher list view ──────────────────────────────────────────────────────
  if (!selectedTeacher) {
    return (
      <div className={`container ${classes.wrapper}`}>
        <h1 className={classes.pageTitle}>📚 Khóa học tiếng Anh</h1>
        <p className={classes.pageSubtitle}>
          Chọn giáo viên để xem các khóa học phù hợp với bạn
        </p>

        {teachers.length === 0 ? (
          <div className={classes.empty}>
            <SchoolIcon style={{ fontSize: 64, opacity: 0.3 }} />
            <p>Chưa có khóa học nào được xuất bản.</p>
          </div>
        ) : (
          <Grid container spacing={3}>
            {teachers.map((t) => (
              <Grid item xs={12} sm={6} md={4} key={t.id}>
                <TeacherCard teacher={t} onClick={() => setSelectedTeacherId(t.id)} />
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    );
  }

  // ── Teacher's courses view ─────────────────────────────────────────────────
  const grad = teacherColor(selectedTeacher.name);
  return (
    <div className={`container ${classes.wrapper}`}>
      {/* Back + teacher header */}
      <div style={{ marginBottom: 28 }}>
        <button className={classes.backBtn} onClick={() => setSelectedTeacherId(null)}>
          <ArrowBackIcon style={{ fontSize: 18 }} /> Tất cả giáo viên
        </button>

        <div style={{
          marginTop: 20, borderRadius: 20, padding: '24px 28px',
          background: grad, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)', border: '3px solid rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 900, color: '#fff', flexShrink: 0,
          }}>
            {getInitials(selectedTeacher.name)}
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>{selectedTeacher.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginTop: 2 }}>
              {selectedTeacher.courses.length} khóa học · {selectedTeacher.totalStudents} học viên
            </div>
          </div>
        </div>
      </div>

      <Grid container spacing={3}>
        {selectedTeacher.courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <CourseCard course={course} onView={goToDetail} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default CourseList;
