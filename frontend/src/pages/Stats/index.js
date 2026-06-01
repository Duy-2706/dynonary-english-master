import statsApi from 'apis/statsApi';
import useTitle from 'hooks/useTitle';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const S = {
  page: { minHeight: '100vh', background: '#f4f6fb', fontFamily: "'Segoe UI', sans-serif", padding: '32px 24px' },
  maxW: { maxWidth: 1100, margin: '0 auto' },
  header: { marginBottom: 28 },
  title: { fontSize: '1.8rem', fontWeight: 900, color: '#333', margin: '0 0 6px' },
  subtitle: { color: '#888', fontSize: '0.95rem', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 },
  statCard: (gradient) => ({
    background: gradient, borderRadius: 16, padding: '22px 20px',
    color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  }),
  statNum: { fontSize: '2.2rem', fontWeight: 900, margin: '0 0 4px', lineHeight: 1 },
  statLabel: { fontSize: '0.85rem', opacity: 0.88, margin: 0 },
  section: {
    background: '#fff', borderRadius: 16, padding: '24px 28px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)', marginBottom: 20,
  },
  sectionTitle: { fontWeight: 800, color: '#333', fontSize: '1.05rem', margin: '0 0 16px' },
  courseRow: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  courseName: { flex: 1, fontWeight: 600, color: '#333', fontSize: '0.9rem' },
  progressBar: (pct) => ({
    height: 8, borderRadius: 4, background: '#f0f0f0', flex: '0 0 150px', position: 'relative', overflow: 'hidden',
  }),
  progressFill: (pct, color) => ({
    position: 'absolute', top: 0, left: 0, bottom: 0,
    width: `${Math.min(100, pct)}%`, background: color, borderRadius: 4,
    transition: 'width 0.5s',
  }),
  pctText: { minWidth: 40, textAlign: 'right', color: '#667eea', fontWeight: 700, fontSize: '0.88rem' },
  badge: (bg, color) => ({
    background: bg, color, borderRadius: 20, padding: '3px 10px', fontSize: '0.78rem', fontWeight: 600,
  }),
  gradeGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  gradeChip: { background: '#ede9ff', color: '#667eea', borderRadius: 20, padding: '6px 14px', fontWeight: 700, fontSize: '0.88rem' },
  tabs: { display: 'flex', gap: 8, marginBottom: 24 },
  tab: (active) => ({
    padding: '9px 20px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
    background: active ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#f0f0f0',
    color: active ? '#fff' : '#555',
  }),
  noAccess: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexDirection: 'column', gap: 12, background: '#f4f6fb',
  },
};

const GRADIENTS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
];

function StudentStats({ stats }) {
  const cards = [
    { label: 'Khóa học tham gia', value: stats.coursesEnrolled, icon: '📚' },
    { label: 'Khóa đang học', value: stats.activeCourses, icon: '▶️' },
    { label: 'Khóa hoàn thành', value: stats.completedCourses, icon: '✅' },
    { label: 'Bài học hoàn thành', value: stats.lessonsCompleted, icon: '🎓' },
    { label: 'Bài ngữ pháp xong', value: stats.grammarLessonsCompleted, icon: '📝' },
    { label: 'Điểm ngữ pháp', value: stats.grammarTotalScore, icon: '⭐' },
  ];

  return (
    <>
      <div style={S.grid}>
        {cards.map((c, i) => (
          <div key={i} style={S.statCard(GRADIENTS[i % GRADIENTS.length])}>
            <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{c.icon}</div>
            <div style={S.statNum}>{c.value ?? 0}</div>
            <p style={S.statLabel}>{c.label}</p>
          </div>
        ))}
      </div>
      {stats.topHighscores && stats.topHighscores.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionTitle}>🏆 Điểm cao nhất</div>
          {stats.topHighscores.map((h, i) => (
            <div key={h.id || i} style={{ ...S.courseRow, borderBottom: i < stats.topHighscores.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <span style={{ fontSize: '1.2rem', minWidth: 28 }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
              <span style={S.courseName}>{h.gameName || 'Game'}</span>
              <span style={S.badge('#fff5e6', '#f39c12')}>{h.score || 0} điểm</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function TeacherStats({ stats }) {
  const cards = [
    { label: 'Tổng khóa học', value: stats.totalCourses, icon: '📚' },
    { label: 'Đã xuất bản', value: stats.publishedCourses, icon: '🚀' },
    { label: 'Bài ngữ pháp', value: stats.totalGrammarLessons, icon: '📖' },
    { label: 'Đã xuất bản', value: stats.publishedGrammarLessons, icon: '✅' },
    { label: 'Học sinh đăng ký', value: stats.totalStudentsEnrolled, icon: '👥' },
  ];

  return (
    <>
      <div style={S.grid}>
        {cards.map((c, i) => (
          <div key={i} style={S.statCard(GRADIENTS[i % GRADIENTS.length])}>
            <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{c.icon}</div>
            <div style={S.statNum}>{c.value ?? 0}</div>
            <p style={S.statLabel}>{c.label}</p>
          </div>
        ))}
      </div>

      {stats.studentsPerCourse && stats.studentsPerCourse.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionTitle}>📊 Học sinh theo khóa học</div>
          {stats.studentsPerCourse.map((c, i) => (
            <div key={c.courseId} style={{ ...S.courseRow, borderBottom: i < stats.studentsPerCourse.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <div style={S.courseName}>
                {c.title}
                <span style={{ marginLeft: 8 }}>
                  <span style={S.badge(c.status === 'published' ? '#d4f5eb' : '#fff5e6', c.status === 'published' ? '#00b894' : '#f39c12')}>
                    {c.status === 'published' ? 'Xuất bản' : 'Nháp'}
                  </span>
                </span>
              </div>
              <span style={{ color: '#667eea', fontWeight: 700, fontSize: '0.9rem', minWidth: 80, textAlign: 'right' }}>
                {c.totalStudents} HS · {c.completedStudents} xong
              </span>
              <div style={S.progressBar(c.avgProgress)}>
                <div style={S.progressFill(c.avgProgress, 'linear-gradient(90deg,#667eea,#764ba2)')} />
              </div>
              <span style={S.pctText}>{c.avgProgress}%</span>
            </div>
          ))}
        </div>
      )}

      {stats.grammarByGrade && Object.keys(stats.grammarByGrade).length > 0 && (
        <div style={S.section}>
          <div style={S.sectionTitle}>📝 Bài ngữ pháp theo khối</div>
          <div style={S.gradeGrid}>
            {Object.entries(stats.grammarByGrade).map(([grade, count]) => (
              <div key={grade} style={S.gradeChip}>
                {grade === 'all' ? 'Tất cả khối' : `Khối ${grade}`}: <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function StatsPage() {
  useTitle('Thống kê');
  const userInfo = useSelector((s) => s.userInfo);
  const history = useHistory();

  const [tab, setTab] = useState('student'); // 'student' | 'teacher'
  const [studentStats, setStudentStats] = useState(null);
  const [teacherStats, setTeacherStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const isTeacher = userInfo?.role === 'teacher' || userInfo?.role === 'admin';
  const isAuth = userInfo?.isAuth;

  useEffect(() => {
    if (!isAuth) return;
    setLoading(true);
    const promises = [statsApi.getStudentStats().then((r) => setStudentStats(r.data?.stats)).catch(() => {})];
    if (isTeacher) {
      promises.push(statsApi.getTeacherStats().then((r) => setTeacherStats(r.data?.stats)).catch(() => {}));
    }
    Promise.all(promises).finally(() => setLoading(false));
  }, [isAuth, isTeacher]);

  if (!isAuth) {
    return (
      <div style={S.noAccess}>
        <div style={{ fontSize: '3rem' }}>🔒</div>
        <div style={{ fontWeight: 700, color: '#555' }}>Vui lòng đăng nhập để xem thống kê.</div>
        <button style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#667eea', color: '#fff', fontWeight: 700, cursor: 'pointer' }} onClick={() => history.push('/login')}>
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.maxW}>
        <div style={S.header}>
          <h1 style={S.title}>📊 Thống kê học tập</h1>
          <p style={S.subtitle}>Theo dõi tiến trình và kết quả học tập của bạn</p>
        </div>

        {isTeacher && (
          <div style={S.tabs}>
            <button style={S.tab(tab === 'student')} onClick={() => setTab('student')}>👤 Của tôi</button>
            <button style={S.tab(tab === 'teacher')} onClick={() => setTab('teacher')}>👨‍🏫 Lớp học</button>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa', fontSize: '1.1rem' }}>⏳ Đang tải dữ liệu...</div>
        ) : tab === 'student' && studentStats ? (
          <StudentStats stats={studentStats} />
        ) : tab === 'teacher' && teacherStats ? (
          <TeacherStats stats={teacherStats} />
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>Chưa có dữ liệu thống kê.</div>
        )}
      </div>
    </div>
  );
}

export default StatsPage;
