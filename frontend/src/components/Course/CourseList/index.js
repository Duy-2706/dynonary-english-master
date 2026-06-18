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
import BookIcon from '@material-ui/icons/Book';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PeopleIcon from '@material-ui/icons/People';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import courseApi from 'apis/courseApi';

const TEACHER_COLORS = [
  '#2563eb',
  '#059669',
  '#7c3aed',
  '#d97706',
  '#0891b2',
  '#dc2626',
  '#475569',
];

function teacherColor(name = '') {
  let h = 0;

  for (let i = 0; i < name.length; i += 1) {
    h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  }

  return TEACHER_COLORS[Math.abs(h) % TEACHER_COLORS.length];
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

function formatMoney(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value || 0);
}

const useStyle = makeStyles(() => ({
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 8% 12%, rgba(37,99,235,.10) 0 260px, transparent 261px),
      radial-gradient(circle at 92% 8%, rgba(14,165,233,.12) 0 240px, transparent 241px),
      radial-gradient(circle at 82% 88%, rgba(16,185,129,.10) 0 280px, transparent 281px),
      linear-gradient(180deg, #eef4ff 0%, #f6f8fc 46%, #eef7f3 100%)
    `,
    padding: '34px 0 64px',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
  },

  container: {
    width: 'min(1220px, calc(100% - 48px))',
    margin: '0 auto',
  },

  hero: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0369a1 100%)',
    borderRadius: 22,
    padding: '32px 34px',
    marginBottom: 26,
    boxShadow: '0 18px 42px rgba(15,23,42,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    flexWrap: 'wrap',
  },

  heroTitle: {
    fontSize: '2.35rem',
    fontWeight: 850,
    color: '#ffffff',
    margin: '0 0 10px',
    letterSpacing: '-0.035em',
    lineHeight: 1.15,
  },

  heroSubtitle: {
    color: '#dbeafe',
    fontSize: '1.08rem',
    margin: 0,
    lineHeight: 1.65,
    fontWeight: 500,
    maxWidth: 720,
  },

  heroBadge: {
    background: 'rgba(255,255,255,.15)',
    border: '1px solid rgba(255,255,255,.28)',
    borderRadius: 999,
    padding: '10px 18px',
    color: '#ffffff',
    fontSize: '0.98rem',
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },

  sectionHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    margin: '0 0 18px',
    flexWrap: 'wrap',
  },

  sectionTitle: {
    fontSize: '1.35rem',
    fontWeight: 850,
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-0.02em',
  },

  sectionDesc: {
    fontSize: '1rem',
    color: '#64748b',
    margin: '6px 0 0',
    lineHeight: 1.55,
    fontWeight: 500,
  },

  loading: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyCard: {
    background: '#ffffff',
    border: '1px solid #dbeafe',
    borderRadius: 18,
    padding: '70px 28px',
    textAlign: 'center',
    color: '#64748b',
    boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
  },

  emptyText: {
    margin: '14px 0 0',
    fontSize: '1.05rem',
    fontWeight: 650,
    color: '#475569',
  },

  teacherCard: {
    height: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    border: '1px solid #dbe4ef',
    boxShadow: '0 10px 26px rgba(15,23,42,0.08)',
    transition: 'transform .18s ease, box-shadow .18s ease, border-color .18s ease',
    cursor: 'pointer',
    background: '#ffffff',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 18px 38px rgba(15,23,42,0.14)',
      borderColor: '#bfdbfe',
    },
  },

  teacherCardTop: {
    padding: '24px 24px 18px',
    background: '#ffffff',
    borderBottom: '1px solid #eef2ff',
  },

  teacherIdentity: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },

  teacherAvatar: {
    width: 62,
    height: 62,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '1.15rem',
    fontWeight: 900,
    flexShrink: 0,
    boxShadow: '0 8px 18px rgba(15,23,42,.15)',
  },

  teacherName: {
    fontWeight: 850,
    fontSize: '1.18rem',
    color: '#0f172a',
    lineHeight: 1.35,
    marginBottom: 4,
  },

  teacherRole: {
    fontSize: '0.98rem',
    color: '#64748b',
    fontWeight: 650,
  },

  chipWrap: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },

  teacherBottom: {
    padding: '16px 24px 20px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    background: '#f8fafc',
  },

  metricBox: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 13,
    padding: '12px 12px',
  },

  metricLabel: {
    color: '#64748b',
    fontSize: '0.88rem',
    fontWeight: 750,
    marginBottom: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },

  metricValue: {
    color: '#0f172a',
    fontSize: '1.18rem',
    fontWeight: 850,
  },

  teacherAction: {
    padding: '0 24px 22px',
    background: '#f8fafc',
  },

  courseCard: {
    borderRadius: 18,
    overflow: 'hidden',
    border: '1px solid #dbe4ef',
    boxShadow: '0 10px 26px rgba(15,23,42,0.08)',
    transition: 'transform .18s ease, box-shadow .18s ease, border-color .18s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    background: '#ffffff',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 18px 38px rgba(15,23,42,0.14)',
      borderColor: '#bfdbfe',
    },
  },

  media: {
    height: 210,
    backgroundColor: '#eff6ff',
  },

  mediaFallback: {
    height: 210,
    background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #dbeafe',
  },

  cardContent: {
    flex: 1,
    padding: '20px 22px 14px !important',
  },

  courseTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },

  courseTitle: {
    fontWeight: 850,
    fontSize: '1.25rem',
    margin: '0 0 12px',
    lineHeight: 1.45,
    color: '#0f172a',
    letterSpacing: '-0.015em',
  },

  courseMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#64748b',
    fontSize: '0.98rem',
    marginBottom: 8,
    fontWeight: 650,
    flexWrap: 'wrap',
  },

  description: {
    fontSize: '1rem',
    color: '#475569',
    margin: '12px 0 0',
    lineHeight: 1.65,
    fontWeight: 450,
  },

  cardActions: {
    padding: '16px 22px 22px !important',
    borderTop: '1px solid #eef2ff',
    background: '#f8fafc',
  },

  price: {
    fontWeight: 850,
    fontSize: '1.08rem',
    color: '#1d4ed8',
  },

  freeTag: {
    fontWeight: 850,
    fontSize: '1.08rem',
    color: '#047857',
    background: '#ecfdf5',
    border: '1px solid #a7f3d0',
    padding: '6px 11px',
    borderRadius: 999,
  },

  primaryButton: {
    marginLeft: 'auto',
    borderRadius: 10,
    textTransform: 'none',
    fontWeight: 850,
    fontSize: '0.98rem',
    padding: '8px 16px',
    background: '#1d4ed8',
    color: '#fff',
    boxShadow: '0 6px 14px rgba(29,78,216,.24)',
    '&:hover': {
      background: '#1e40af',
      boxShadow: '0 8px 18px rgba(29,78,216,.28)',
    },
  },

  fullButton: {
    width: '100%',
    borderRadius: 11,
    textTransform: 'none',
    fontWeight: 850,
    fontSize: '1rem',
    padding: '10px 16px',
    background: '#1d4ed8',
    color: '#fff',
    boxShadow: '0 6px 14px rgba(29,78,216,.24)',
    '&:hover': {
      background: '#1e40af',
      boxShadow: '0 8px 18px rgba(29,78,216,.28)',
    },
  },

  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 18px',
    borderRadius: 11,
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    color: '#334155',
    cursor: 'pointer',
    fontWeight: 850,
    fontSize: '1rem',
    fontFamily: 'inherit',
    boxShadow: '0 6px 16px rgba(15,23,42,.06)',
    marginBottom: 18,
    '&:hover': {
      background: '#f8fafc',
      borderColor: '#94a3b8',
    },
  },

  teacherHeader: {
    background: '#ffffff',
    border: '1px solid #dbe4ef',
    borderRadius: 20,
    padding: '24px 28px',
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    flexWrap: 'wrap',
    boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
  },

  teacherHeaderAvatar: {
    width: 72,
    height: 72,
    borderRadius: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '1.35rem',
    fontWeight: 900,
    flexShrink: 0,
    boxShadow: '0 8px 18px rgba(15,23,42,.16)',
  },

  teacherHeaderName: {
    fontSize: '1.55rem',
    fontWeight: 900,
    color: '#0f172a',
    letterSpacing: '-0.025em',
    lineHeight: 1.25,
  },

  teacherHeaderMeta: {
    color: '#64748b',
    fontSize: '1.02rem',
    marginTop: 5,
    fontWeight: 650,
  },
}));

function LevelChip({ label }) {
  return (
    <Chip
      label={label || 'Chưa phân loại'}
      size="small"
      style={{
        background: '#eff6ff',
        color: '#1d4ed8',
        border: '1px solid #bfdbfe',
        fontWeight: 850,
        fontSize: '0.86rem',
        height: 28,
      }}
    />
  );
}

function TeacherCard({ teacher, onClick }) {
  const classes = useStyle();
  const color = teacherColor(teacher.name);
  const levels = [...new Set(teacher.courses.map((c) => c.level).filter(Boolean))];

  return (
    <Card className={classes.teacherCard} onClick={onClick}>
      <div className={classes.teacherCardTop}>
        <div className={classes.teacherIdentity}>
          <div className={classes.teacherAvatar} style={{ background: color }}>
            {getInitials(teacher.name)}
          </div>

          <div>
            <div className={classes.teacherName}>{teacher.name || 'Giáo viên'}</div>
            <div className={classes.teacherRole}>Giảng viên phụ trách khóa học</div>
          </div>
        </div>

        <div className={classes.chipWrap}>
          {levels.length > 0 ? (
            levels.slice(0, 5).map((lv) => <LevelChip key={lv} label={lv} />)
          ) : (
            <Chip
              label="Chưa có cấp độ"
              size="small"
              style={{
                background: '#f1f5f9',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                fontWeight: 800,
                fontSize: '0.86rem',
                height: 28,
              }}
            />
          )}
        </div>
      </div>

      <div className={classes.teacherBottom}>
        <div className={classes.metricBox}>
          <div className={classes.metricLabel}>
            <MenuBookIcon style={{ fontSize: 18, color: '#2563eb' }} />
            Khóa học
          </div>
          <div className={classes.metricValue}>{teacher.courses.length}</div>
        </div>

        <div className={classes.metricBox}>
          <div className={classes.metricLabel}>
            <PeopleIcon style={{ fontSize: 18, color: '#059669' }} />
            Học viên
          </div>
          <div className={classes.metricValue}>{teacher.totalStudents}</div>
        </div>
      </div>

      <div className={classes.teacherAction}>
        <Button
          variant="contained"
          className={classes.fullButton}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          Xem khóa học
        </Button>
      </div>
    </Card>
  );
}

function CourseCard({ course, onView }) {
  const classes = useStyle();

  return (
    <Card className={classes.courseCard} onClick={() => onView(course._id)}>
      {course.thumbnail ? (
        <CardMedia className={classes.media} image={course.thumbnail} title={course.title} />
      ) : (
        <div className={classes.mediaFallback}>
          <BookIcon style={{ fontSize: 76, color: '#93c5fd' }} />
        </div>
      )}

      <CardContent className={classes.cardContent}>
        <div className={classes.courseTop}>
          <LevelChip label={course.level} />

          <Chip
            label={course.isFree ? 'Miễn phí' : 'Trả phí'}
            size="small"
            style={{
              background: course.isFree ? '#ecfdf5' : '#fff7ed',
              color: course.isFree ? '#047857' : '#c2410c',
              border: course.isFree ? '1px solid #a7f3d0' : '1px solid #fed7aa',
              fontWeight: 850,
              fontSize: '0.86rem',
              height: 28,
            }}
          />
        </div>

        <h3 className={classes.courseTitle}>{course.title}</h3>

        <div className={classes.courseMeta}>
          <MenuBookIcon style={{ fontSize: 19, color: '#2563eb' }} />
          <span>{course.totalLessons || 0} bài học</span>
          <span>·</span>
          <PeopleIcon style={{ fontSize: 19, color: '#059669' }} />
          <span>{course.totalStudents || 0} học viên</span>
        </div>

        <p className={classes.description}>
          {course.description
            ? `${course.description.slice(0, 120)}${course.description.length > 120 ? '...' : ''}`
            : 'Khóa học chưa có mô tả chi tiết.'}
        </p>
      </CardContent>

      <CardActions className={classes.cardActions}>
        {course.isFree ? (
          <span className={classes.freeTag}>Miễn phí</span>
        ) : (
          <span className={classes.price}>{formatMoney(course.price)}</span>
        )}

        <Button
          variant="contained"
          className={classes.primaryButton}
          onClick={(e) => {
            e.stopPropagation();
            onView(course._id);
          }}
        >
          Chi tiết
        </Button>
      </CardActions>
    </Card>
  );
}

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

        if (res.status === 200) {
          setCourses(res.data.courses || []);
        }
      } catch (e) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const teacherMap = {};

  courses.forEach((c) => {
    const tid = c.teacherAccountId || c.teacherName || 'unknown';

    if (!teacherMap[tid]) {
      teacherMap[tid] = {
        id: tid,
        name: c.teacherName || 'Giáo viên chưa xác định',
        courses: [],
        totalStudents: 0,
      };
    }

    teacherMap[tid].courses.push(c);
    teacherMap[tid].totalStudents += c.totalStudents || 0;
  });

  const teachers = Object.values(teacherMap).sort(
    (a, b) => b.courses.length - a.courses.length,
  );

  const selectedTeacher = selectedTeacherId ? teacherMap[selectedTeacherId] : null;

  const totalStudents = teachers.reduce((sum, t) => sum + (t.totalStudents || 0), 0);

  const goToDetail = (id) => history.push(`/courses/${id}/detail`);

  if (loading) {
    return (
      <div className={classes.page}>
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (!selectedTeacher) {
    return (
      <div className={classes.page}>
        <div className={classes.container}>
          <div className={classes.hero}>
            <div>
              <h1 className={classes.heroTitle}>Khóa học tiếng Anh</h1>
              <p className={classes.heroSubtitle}>
                Chọn giáo viên để xem danh sách khóa học đã được xuất bản trong hệ thống.
              </p>
            </div>

            <div className={classes.heroBadge}>
              {teachers.length} giáo viên · {courses.length} khóa học · {totalStudents} học viên
            </div>
          </div>

          <div className={classes.sectionHead}>
            <div>
              <h2 className={classes.sectionTitle}>Danh sách giáo viên</h2>
              <p className={classes.sectionDesc}>
                Mỗi giáo viên có thể phụ trách một hoặc nhiều khóa học khác nhau.
              </p>
            </div>
          </div>

          {teachers.length === 0 ? (
            <div className={classes.emptyCard}>
              <SchoolIcon style={{ fontSize: 72, opacity: 0.28 }} />
              <p className={classes.emptyText}>Chưa có khóa học nào được xuất bản.</p>
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
      </div>
    );
  }

  const color = teacherColor(selectedTeacher.name);

  return (
    <div className={classes.page}>
      <div className={classes.container}>
        <button className={classes.backBtn} onClick={() => setSelectedTeacherId(null)}>
          <ArrowBackIcon style={{ fontSize: 20 }} />
          Tất cả giáo viên
        </button>

        <div className={classes.teacherHeader}>
          <div className={classes.teacherHeaderAvatar} style={{ background: color }}>
            {getInitials(selectedTeacher.name)}
          </div>

          <div>
            <div className={classes.teacherHeaderName}>{selectedTeacher.name}</div>
            <div className={classes.teacherHeaderMeta}>
              {selectedTeacher.courses.length} khóa học · {selectedTeacher.totalStudents} học viên
            </div>
          </div>
        </div>

        <div className={classes.sectionHead}>
          <div>
            <h2 className={classes.sectionTitle}>Khóa học của giáo viên</h2>
            <p className={classes.sectionDesc}>
              Danh sách các khóa học đang được xuất bản và có thể truy cập.
            </p>
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
    </div>
  );
}

export default CourseList;