import adminApi from 'apis/adminApi';
import statsApi from 'apis/statsApi';
import useTitle from 'hooks/useTitle';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const S = {
  page: {
    minHeight: '100vh',
    background: '#f5f7fb',
    fontFamily:
      "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
    padding: '32px 24px 56px',
    color: '#172033',
  },

  maxW: {
    maxWidth: 1180,
    margin: '0 auto',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 20,
    marginBottom: 24,
  },

  headerText: {
    minWidth: 0,
  },

  title: {
    fontSize: '1.9rem',
    fontWeight: 800,
    color: '#111827',
    margin: '0 0 8px',
    letterSpacing: '-0.02em',
  },

  subtitle: {
    color: '#6b7280',
    fontSize: '0.98rem',
    margin: 0,
    lineHeight: 1.5,
  },

  headerBadge: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    color: '#374151',
    borderRadius: 999,
    padding: '8px 14px',
    fontSize: '0.86rem',
    fontWeight: 700,
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
    whiteSpace: 'nowrap',
  },

  tabs: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 6,
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
    width: 'fit-content',
  },

  tab: (active) => ({
    padding: '10px 18px',
    borderRadius: 9,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.92rem',
    background: active ? '#1d4ed8' : 'transparent',
    color: active ? '#ffffff' : '#4b5563',
    transition: 'all .16s ease',
  }),

  subTabs: {
    display: 'flex',
    gap: 8,
    marginBottom: 22,
    flexWrap: 'wrap',
  },

  subTab: (active) => ({
    padding: '9px 16px',
    borderRadius: 999,
    border: active ? '1px solid #1d4ed8' : '1px solid #d1d5db',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.88rem',
    background: active ? '#eff6ff' : '#ffffff',
    color: active ? '#1d4ed8' : '#4b5563',
    boxShadow: active ? '0 1px 2px rgba(29, 78, 216, .08)' : 'none',
  }),

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
    gap: 16,
    marginBottom: 24,
  },

  statCard: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    padding: '20px 20px',
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
  },

  statTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  statLabel: {
    fontSize: '0.88rem',
    color: '#6b7280',
    fontWeight: 700,
    margin: 0,
    lineHeight: 1.35,
  },

  statNum: {
    fontSize: '2rem',
    fontWeight: 800,
    margin: 0,
    color: '#111827',
    lineHeight: 1,
    letterSpacing: '-0.03em',
  },

  statAccent: (color = '#1d4ed8') => ({
    width: 38,
    height: 38,
    borderRadius: 10,
    background: `${color}14`,
    border: `1px solid ${color}26`,
    color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: '0.86rem',
  }),

  section: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    padding: '22px 24px',
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
    marginBottom: 20,
  },

  sectionHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    fontWeight: 800,
    color: '#111827',
    fontSize: '1.02rem',
    margin: 0,
  },

  sectionDesc: {
    color: '#6b7280',
    fontSize: '0.86rem',
    margin: 0,
  },

  tableWrap: {
    width: '100%',
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },

  th: {
    textAlign: 'left',
    padding: '11px 12px',
    color: '#6b7280',
    fontWeight: 800,
    borderBottom: '1px solid #e5e7eb',
    background: '#f9fafb',
    whiteSpace: 'nowrap',
  },

  td: {
    padding: '13px 12px',
    borderBottom: '1px solid #f1f5f9',
    color: '#374151',
    verticalAlign: 'middle',
  },

  index: {
    color: '#9ca3af',
    fontWeight: 800,
    width: 42,
  },

  rowName: {
    fontWeight: 700,
    color: '#111827',
  },

  muted: {
    color: '#6b7280',
    fontSize: '0.84rem',
  },

  badge: (tone = 'default') => {
    const map = {
      success: {
        background: '#ecfdf5',
        color: '#047857',
        border: '#a7f3d0',
      },
      warning: {
        background: '#fffbeb',
        color: '#b45309',
        border: '#fde68a',
      },
      info: {
        background: '#eff6ff',
        color: '#1d4ed8',
        border: '#bfdbfe',
      },
      danger: {
        background: '#fef2f2',
        color: '#b91c1c',
        border: '#fecaca',
      },
      neutral: {
        background: '#f3f4f6',
        color: '#374151',
        border: '#e5e7eb',
      },
      default: {
        background: '#f8fafc',
        color: '#475569',
        border: '#e2e8f0',
      },
    };

    const c = map[tone] || map.default;

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: c.background,
      color: c.color,
      border: `1px solid ${c.border}`,
      borderRadius: 999,
      padding: '4px 10px',
      fontSize: '0.78rem',
      fontWeight: 800,
      lineHeight: 1,
      whiteSpace: 'nowrap',
    };
  },

  barWrap: {
    width: 150,
    height: 8,
    borderRadius: 999,
    background: '#e5e7eb',
    overflow: 'hidden',
  },

  bar: (pct, color = '#1d4ed8') => ({
    height: '100%',
    borderRadius: 999,
    background: color,
    width: `${Math.min(100, Math.max(0, pct || 0))}%`,
    transition: 'width .35s ease',
  }),

  chartWrap: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 12,
    height: 150,
    paddingTop: 12,
  },

  chartItem: {
    flex: 1,
    minWidth: 54,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 7,
  },

  chartValue: {
    fontSize: '0.78rem',
    fontWeight: 800,
    color: '#1d4ed8',
  },

  chartBar: (h) => ({
    width: '100%',
    height: h,
    minHeight: 5,
    background: '#1d4ed8',
    borderRadius: '6px 6px 0 0',
  }),

  chartLabel: {
    fontSize: '0.74rem',
    color: '#6b7280',
    whiteSpace: 'nowrap',
  },

  chipWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },

  chip: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    color: '#334155',
    borderRadius: 999,
    padding: '8px 13px',
    fontWeight: 800,
    fontSize: '0.86rem',
  },

  loading: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    padding: '48px 24px',
    textAlign: 'center',
    color: '#6b7280',
    fontWeight: 700,
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
  },

  empty: {
    background: '#ffffff',
    border: '1px dashed #cbd5e1',
    borderRadius: 14,
    padding: '48px 24px',
    textAlign: 'center',
    color: '#64748b',
    fontWeight: 700,
  },

  noAccess: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 14,
    background: '#f5f7fb',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
    color: '#172033',
  },

  loginBtn: {
    padding: '10px 22px',
    borderRadius: 10,
    border: 'none',
    background: '#1d4ed8',
    color: '#fff',
    fontWeight: 800,
    cursor: 'pointer',
    fontSize: '0.92rem',
  },
};

const COLORS = {
  blue: '#1d4ed8',
  green: '#059669',
  orange: '#d97706',
  purple: '#7c3aed',
  red: '#dc2626',
  slate: '#475569',
};

function formatNumber(value) {
  if (value == null) return 0;
  return Number(value).toLocaleString('vi-VN');
}

function getStatusBadge(status) {
  if (status === 'published') {
    return <span style={S.badge('success')}>Xuất bản</span>;
  }

  return <span style={S.badge('warning')}>Nháp</span>;
}

function LoadingBox({ text = 'Đang tải dữ liệu...' }) {
  return <div style={S.loading}>{text}</div>;
}

function EmptyBox({ text = 'Chưa có dữ liệu thống kê.' }) {
  return <div style={S.empty}>{text}</div>;
}

// ─── Student ──────────────────────────────────────────────────────────────────

function StudentStats({ stats }) {
  const cards = [
    { label: 'Khóa học tham gia', value: stats.coursesEnrolled, code: 'KH', color: COLORS.blue },
    { label: 'Khóa đang học', value: stats.activeCourses, code: 'ĐH', color: COLORS.green },
    { label: 'Khóa hoàn thành', value: stats.completedCourses, code: 'HT', color: COLORS.orange },
    { label: 'Bài học hoàn thành', value: stats.lessonsCompleted, code: 'BH', color: COLORS.purple },
    { label: 'Bài ngữ pháp xong', value: stats.grammarLessonsCompleted, code: 'NP', color: COLORS.red },
    { label: 'Điểm ngữ pháp', value: stats.grammarTotalScore, code: 'Đ', color: COLORS.slate },
  ];

  return (
    <>
      <div style={S.grid}>
        {cards.map((c) => (
          <div key={c.label} style={S.statCard}>
            <div style={S.statTop}>
              <p style={S.statLabel}>{c.label}</p>
              <div style={S.statAccent(c.color)}>{c.code}</div>
            </div>
            <div style={S.statNum}>{formatNumber(c.value)}</div>
          </div>
        ))}
      </div>

      {stats.topHighscores?.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionHead}>
            <div>
              <h2 style={S.sectionTitle}>Điểm cao nhất</h2>
              <p style={S.sectionDesc}>Các kết quả nổi bật theo trò chơi</p>
            </div>
          </div>

          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>#</th>
                  <th style={S.th}>Trò chơi</th>
                  <th style={{ ...S.th, textAlign: 'right' }}>Điểm</th>
                </tr>
              </thead>
              <tbody>
                {stats.topHighscores.map((h, i) => (
                  <tr key={i}>
                    <td style={{ ...S.td, ...S.index }}>{i + 1}</td>
                    <td style={S.td}>
                      <span style={S.rowName}>{h.gameName || 'Game'}</span>
                    </td>
                    <td style={{ ...S.td, textAlign: 'right' }}>
                      <span style={S.badge('warning')}>{formatNumber(h.score)} điểm</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Teacher ──────────────────────────────────────────────────────────────────

function TeacherStats({ stats }) {
  const cards = [
    { label: 'Tổng khóa học', value: stats.totalCourses, code: 'KH', color: COLORS.blue },
    { label: 'Đã xuất bản', value: stats.publishedCourses, code: 'XB', color: COLORS.green },
    { label: 'Bài ngữ pháp', value: stats.totalGrammarLessons, code: 'NP', color: COLORS.purple },
    { label: 'Ngữ pháp xuất bản', value: stats.publishedGrammarLessons, code: 'NX', color: COLORS.orange },
    { label: 'Học sinh đăng ký', value: stats.totalStudentsEnrolled, code: 'HS', color: COLORS.red },
  ];

  return (
    <>
      <div style={S.grid}>
        {cards.map((c) => (
          <div key={c.label} style={S.statCard}>
            <div style={S.statTop}>
              <p style={S.statLabel}>{c.label}</p>
              <div style={S.statAccent(c.color)}>{c.code}</div>
            </div>
            <div style={S.statNum}>{formatNumber(c.value)}</div>
          </div>
        ))}
      </div>

      {stats.studentsPerCourse?.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionHead}>
            <div>
              <h2 style={S.sectionTitle}>Học sinh theo khóa học</h2>
              <p style={S.sectionDesc}>Theo dõi số lượng đăng ký và tiến độ trung bình</p>
            </div>
          </div>

          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Khóa học</th>
                  <th style={S.th}>Trạng thái</th>
                  <th style={{ ...S.th, textAlign: 'right' }}>Học sinh</th>
                  <th style={{ ...S.th, textAlign: 'right' }}>Hoàn thành</th>
                  <th style={S.th}>Tiến độ TB</th>
                  <th style={{ ...S.th, textAlign: 'right' }}>%</th>
                </tr>
              </thead>
              <tbody>
                {stats.studentsPerCourse.map((c) => (
                  <tr key={c.courseId}>
                    <td style={S.td}>
                      <span style={S.rowName}>{c.title}</span>
                    </td>
                    <td style={S.td}>{getStatusBadge(c.status)}</td>
                    <td style={{ ...S.td, textAlign: 'right' }}>{formatNumber(c.totalStudents)}</td>
                    <td style={{ ...S.td, textAlign: 'right' }}>{formatNumber(c.completedStudents)}</td>
                    <td style={S.td}>
                      <div style={S.barWrap}>
                        <div style={S.bar(c.avgProgress, COLORS.blue)} />
                      </div>
                    </td>
                    <td style={{ ...S.td, textAlign: 'right', fontWeight: 800 }}>
                      {c.avgProgress}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {stats.grammarByGrade && Object.keys(stats.grammarByGrade).length > 0 && (
        <div style={S.section}>
          <div style={S.sectionHead}>
            <div>
              <h2 style={S.sectionTitle}>Bài ngữ pháp theo khối</h2>
              <p style={S.sectionDesc}>Phân bổ nội dung ngữ pháp theo từng nhóm lớp</p>
            </div>
          </div>

          <div style={S.chipWrap}>
            {Object.entries(stats.grammarByGrade).map(([grade, count]) => (
              <div key={grade} style={S.chip}>
                {grade === 'all' ? 'Tất cả khối' : `Khối ${grade}`}: {formatNumber(count)}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Admin ────────────────────────────────────────────────────────────────────

const ACCOUNT_STAT_CONFIGS = [
  { key: 'totalUsers', label: 'Tổng người dùng', code: 'ND', color: COLORS.blue },
  { key: 'totalTeachers', label: 'Giáo viên', code: 'GV', color: COLORS.purple },
  { key: 'totalStudents', label: 'Học sinh', code: 'HS', color: COLORS.green },
  { key: 'totalAdmins', label: 'Admin', code: 'AD', color: COLORS.red },
  { key: 'totalWords', label: 'Từ vựng', code: 'TV', color: COLORS.orange },
  { key: 'totalCourses', label: 'Khóa học', code: 'KH', color: COLORS.blue },
  { key: 'totalGrammarLessons', label: 'Bài ngữ pháp', code: 'NP', color: COLORS.slate },
  { key: 'totalGameRooms', label: 'Phòng game', code: 'PG', color: COLORS.green },
];

function AdminAccountStats({ stats }) {
  const items = ACCOUNT_STAT_CONFIGS.filter((c) => stats[c.key] != null);

  return (
    <div style={S.grid}>
      {items.map((c) => (
        <div key={c.key} style={S.statCard}>
          <div style={S.statTop}>
            <p style={S.statLabel}>{c.label}</p>
            <div style={S.statAccent(c.color)}>{c.code}</div>
          </div>
          <div style={S.statNum}>{formatNumber(stats[c.key])}</div>
        </div>
      ))}
    </div>
  );
}

function AdminCourseStats({ stats }) {
  if (!stats) return <EmptyBox text="Chưa có dữ liệu khóa học." />;

  const maxEnroll = Math.max(...(stats.topCourses || []).map((c) => c.enrollments), 1);

  const cards = [
    { label: 'Tổng khóa học', value: stats.totalCourses, code: 'KH', color: COLORS.blue },
    { label: 'Đã xuất bản', value: stats.publishedCourses, code: 'XB', color: COLORS.green },
    { label: 'Tổng lượt đăng ký', value: stats.totalEnrollments, code: 'ĐK', color: COLORS.purple },
    { label: 'Tỉ lệ hoàn thành', value: `${stats.completionRate}%`, code: 'HT', color: COLORS.orange },
  ];

  return (
    <>
      <div style={S.grid}>
        {cards.map((c) => (
          <div key={c.label} style={S.statCard}>
            <div style={S.statTop}>
              <p style={S.statLabel}>{c.label}</p>
              <div style={S.statAccent(c.color)}>{c.code}</div>
            </div>
            <div style={S.statNum}>{c.value ?? 0}</div>
          </div>
        ))}
      </div>

      {stats.enrollmentsByMonth?.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionHead}>
            <div>
              <h2 style={S.sectionTitle}>Lượt đăng ký theo tháng</h2>
              <p style={S.sectionDesc}>Dữ liệu trong 6 tháng gần nhất</p>
            </div>
          </div>

          <div style={S.chartWrap}>
            {stats.enrollmentsByMonth.map(({ month, count }) => {
              const maxM = Math.max(...stats.enrollmentsByMonth.map((m) => m.count), 1);
              const h = Math.max(5, Math.round((count / maxM) * 110));

              return (
                <div key={month} style={S.chartItem}>
                  <span style={S.chartValue}>{formatNumber(count)}</span>
                  <div style={S.chartBar(h)} />
                  <span style={S.chartLabel}>{month.slice(5)}/{month.slice(0, 4)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {stats.topCourses?.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionHead}>
            <div>
              <h2 style={S.sectionTitle}>Top khóa học theo lượt đăng ký</h2>
              <p style={S.sectionDesc}>Danh sách khóa học có lượng học sinh đăng ký cao</p>
            </div>
          </div>

          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>#</th>
                  <th style={S.th}>Khóa học</th>
                  <th style={S.th}>Trạng thái</th>
                  <th style={{ ...S.th, textAlign: 'right' }}>Lượt xem</th>
                  <th style={S.th}>Đăng ký</th>
                  <th style={{ ...S.th, textAlign: 'right' }}>Học sinh</th>
                </tr>
              </thead>
              <tbody>
                {stats.topCourses.map((c, i) => (
                  <tr key={c.id}>
                    <td style={{ ...S.td, ...S.index }}>{i + 1}</td>
                    <td style={S.td}>
                      <span style={S.rowName}>{c.title}</span>
                    </td>
                    <td style={S.td}>{getStatusBadge(c.status)}</td>
                    <td style={{ ...S.td, textAlign: 'right' }}>
                      {formatNumber(c.viewCount)}
                    </td>
                    <td style={S.td}>
                      <div style={S.barWrap}>
                        <div style={S.bar((c.enrollments / maxEnroll) * 100, COLORS.green)} />
                      </div>
                    </td>
                    <td style={{ ...S.td, textAlign: 'right', fontWeight: 800 }}>
                      {formatNumber(c.enrollments)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

function AdminGameStats({ stats }) {
  if (!stats) return <EmptyBox text="Chưa có dữ liệu trò chơi." />;

  const maxPlayers = Math.max(...(stats.gameBreakdown || []).map((g) => g.playerCount), 1);

  const cards = [
    { label: 'Số loại game', value: stats.totalGames, code: 'G', color: COLORS.blue },
    { label: 'Tổng người chơi', value: stats.totalPlayers, code: 'NC', color: COLORS.green },
  ];

  return (
    <>
      <div style={S.grid}>
        {cards.map((c) => (
          <div key={c.label} style={S.statCard}>
            <div style={S.statTop}>
              <p style={S.statLabel}>{c.label}</p>
              <div style={S.statAccent(c.color)}>{c.code}</div>
            </div>
            <div style={S.statNum}>{formatNumber(c.value)}</div>
          </div>
        ))}
      </div>

      {stats.gameBreakdown?.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionHead}>
            <div>
              <h2 style={S.sectionTitle}>Thống kê theo trò chơi</h2>
              <p style={S.sectionDesc}>So sánh số người chơi và điểm số theo từng game</p>
            </div>
          </div>

          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>#</th>
                  <th style={S.th}>Trò chơi</th>
                  <th style={{ ...S.th, textAlign: 'right' }}>Điểm TB</th>
                  <th style={{ ...S.th, textAlign: 'right' }}>Điểm cao nhất</th>
                  <th style={S.th}>Người chơi</th>
                  <th style={{ ...S.th, textAlign: 'right' }}>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {stats.gameBreakdown.map((g, i) => (
                  <tr key={g.gameName || i}>
                    <td style={{ ...S.td, ...S.index }}>{i + 1}</td>
                    <td style={S.td}>
                      <span style={S.rowName}>{g.gameName || '—'}</span>
                    </td>
                    <td style={{ ...S.td, textAlign: 'right' }}>{formatNumber(g.avgScore)}</td>
                    <td style={{ ...S.td, textAlign: 'right' }}>{formatNumber(g.maxScore)}</td>
                    <td style={S.td}>
                      <div style={S.barWrap}>
                        <div style={S.bar((g.playerCount / maxPlayers) * 100, COLORS.purple)} />
                      </div>
                    </td>
                    <td style={{ ...S.td, textAlign: 'right', fontWeight: 800 }}>
                      {formatNumber(g.playerCount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {stats.topPlayers?.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionHead}>
            <div>
              <h2 style={S.sectionTitle}>Top người chơi</h2>
              <p style={S.sectionDesc}>Xếp hạng theo điểm cao nhất</p>
            </div>
          </div>

          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>#</th>
                  <th style={S.th}>Người chơi</th>
                  <th style={S.th}>Trò chơi</th>
                  <th style={{ ...S.th, textAlign: 'right' }}>Điểm</th>
                </tr>
              </thead>
              <tbody>
                {stats.topPlayers.map((p, i) => (
                  <tr key={i}>
                    <td style={{ ...S.td, ...S.index }}>{i + 1}</td>
                    <td style={S.td}>
                      <span style={S.rowName}>{p.username || 'Ẩn danh'}</span>
                    </td>
                    <td style={S.td}>
                      <span style={S.muted}>{p.gameName || '—'}</span>
                    </td>
                    <td style={{ ...S.td, textAlign: 'right' }}>
                      <span style={S.badge('warning')}>{formatNumber(p.score)} điểm</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

function AdminStats({
  accountStats,
  courseStats,
  gameStats,
  loadingCourse,
  loadingGame,
  onLoadCourse,
  onLoadGame,
}) {
  const [subTab, setSubTab] = useState('account');

  const handleSubTab = (t) => {
    setSubTab(t);

    if (t === 'course' && !courseStats && !loadingCourse) onLoadCourse();
    if (t === 'game' && !gameStats && !loadingGame) onLoadGame();
  };

  return (
    <>
      <div style={S.subTabs}>
        <button style={S.subTab(subTab === 'account')} onClick={() => handleSubTab('account')}>
          Tài khoản
        </button>

        <button style={S.subTab(subTab === 'course')} onClick={() => handleSubTab('course')}>
          Khóa học
        </button>

        <button style={S.subTab(subTab === 'game')} onClick={() => handleSubTab('game')}>
          Trò chơi
        </button>
      </div>

      {subTab === 'account' && accountStats && <AdminAccountStats stats={accountStats} />}

      {subTab === 'course' && (
        loadingCourse ? <LoadingBox /> : <AdminCourseStats stats={courseStats} />
      )}

      {subTab === 'game' && (
        loadingGame ? <LoadingBox /> : <AdminGameStats stats={gameStats} />
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function StatsPage() {
  useTitle('Thống kê');

  const userInfo = useSelector((s) => s.userInfo);
  const history = useHistory();

  const [tab, setTab] = useState('student');
  const [studentStats, setStudentStats] = useState(null);
  const [teacherStats, setTeacherStats] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [courseStats, setCourseStats] = useState(null);
  const [gameStats, setGameStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [loadingGame, setLoadingGame] = useState(false);

  const isTeacher = userInfo?.role === 'teacher' || userInfo?.role === 'admin';
  const isAdmin = userInfo?.role === 'admin';
  const isAuth = userInfo?.isAuth;

  useEffect(() => {
    if (!isAuth) return;

    setLoading(true);

    const promises = [
      statsApi
        .getStudentStats()
        .then((r) => setStudentStats(r.data?.stats))
        .catch(() => {}),
    ];

    if (isTeacher) {
      promises.push(
        statsApi
          .getTeacherStats()
          .then((r) => setTeacherStats(r.data?.stats))
          .catch(() => {})
      );
    }

    if (isAdmin) {
      promises.push(
        adminApi
          .getSystemStats()
          .then((r) => setAdminStats(r.data?.stats))
          .catch(() => {})
      );
    }

    Promise.all(promises).finally(() => setLoading(false));
  }, [isAuth, isTeacher, isAdmin]);

  const loadCourseStats = () => {
    setLoadingCourse(true);

    adminApi
      .getCourseStats()
      .then((r) => setCourseStats(r.data?.stats))
      .catch(() => {})
      .finally(() => setLoadingCourse(false));
  };

  const loadGameStats = () => {
    setLoadingGame(true);

    adminApi
      .getGameStats()
      .then((r) => setGameStats(r.data?.stats))
      .catch(() => {})
      .finally(() => setLoadingGame(false));
  };

  if (!isAuth) {
    return (
      <div style={S.noAccess}>
        <div style={{ fontSize: '2.4rem', color: '#9ca3af' }}>●</div>

        <div style={{ fontWeight: 800, color: '#374151', fontSize: '1.05rem' }}>
          Vui lòng đăng nhập để xem thống kê.
        </div>

        <button style={S.loginBtn} onClick={() => history.push('/login')}>
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.maxW}>
        <div style={S.header}>
          <div style={S.headerText}>
            <h1 style={S.title}>Thống kê hệ thống</h1>

            <p style={S.subtitle}>
              Theo dõi dữ liệu học tập, khóa học, trò chơi và hoạt động người dùng.
            </p>
          </div>

          {isAdmin && <div style={S.headerBadge}>Quyền quản trị</div>}
        </div>

        {isTeacher && (
          <div style={S.tabs}>
            <button style={S.tab(tab === 'student')} onClick={() => setTab('student')}>
              Của tôi
            </button>

            <button style={S.tab(tab === 'teacher')} onClick={() => setTab('teacher')}>
              Lớp học
            </button>

            {isAdmin && (
              <button style={S.tab(tab === 'admin')} onClick={() => setTab('admin')}>
                Hệ thống
              </button>
            )}
          </div>
        )}

        {loading ? (
          <LoadingBox />
        ) : tab === 'student' && studentStats ? (
          <StudentStats stats={studentStats} />
        ) : tab === 'teacher' && teacherStats ? (
          <TeacherStats stats={teacherStats} />
        ) : tab === 'admin' ? (
          <AdminStats
            accountStats={adminStats}
            courseStats={courseStats}
            gameStats={gameStats}
            loadingCourse={loadingCourse}
            loadingGame={loadingGame}
            onLoadCourse={loadCourseStats}
            onLoadGame={loadGameStats}
          />
        ) : (
          <EmptyBox />
        )}
      </div>
    </div>
  );
}

export default StatsPage;