import adminApi from 'apis/adminApi';
import useTitle from 'hooks/useTitle';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const ROLE_CONFIG = {
  student: {
    label: 'Học sinh',
    tone: 'success',
  },
  teacher: {
    label: 'Giáo viên',
    tone: 'info',
  },
  admin: {
    label: 'Admin',
    tone: 'danger',
  },
};

const COLORS = {
  blue: '#2563eb',
  green: '#059669',
  orange: '#d97706',
  purple: '#7c3aed',
  red: '#dc2626',
  cyan: '#0891b2',
  slate: '#475569',
};

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 8% 12%, rgba(37,99,235,.10) 0 260px, transparent 261px),
      radial-gradient(circle at 92% 8%, rgba(14,165,233,.12) 0 240px, transparent 241px),
      radial-gradient(circle at 80% 85%, rgba(16,185,129,.10) 0 280px, transparent 281px),
      linear-gradient(180deg, #eef4ff 0%, #f6f8fc 46%, #eef7f3 100%)
    `,
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
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
    gap: 24,
    marginBottom: 24,
    flexWrap: 'wrap',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0369a1 100%)',
    borderRadius: 18,
    padding: '26px 28px',
    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.18)',
  },

  title: {
    fontSize: '1.9rem',
    fontWeight: 800,
    color: '#ffffff',
    margin: '0 0 8px',
    letterSpacing: '-0.02em',
  },

  subtitle: {
    color: '#dbeafe',
    fontSize: '0.96rem',
    margin: 0,
    lineHeight: 1.5,
  },

  headerMeta: {
    background: 'rgba(255,255,255,.14)',
    border: '1px solid rgba(255,255,255,.26)',
    borderRadius: 999,
    padding: '8px 14px',
    color: '#ffffff',
    fontSize: '0.86rem',
    fontWeight: 700,
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
    whiteSpace: 'nowrap',
  },

  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 14,
    marginBottom: 22,
  },

  statCard: (color = COLORS.blue) => ({
    background: `linear-gradient(180deg, #ffffff 0%, ${color}10 100%)`,
    border: `1px solid ${color}33`,
    borderTop: `4px solid ${color}`,
    borderRadius: 14,
    padding: '16px 18px',
    boxShadow: '0 8px 22px rgba(15, 23, 42, 0.08)',
  }),

  statTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },

  statLabel: {
    color: '#475569',
    fontSize: '0.82rem',
    fontWeight: 700,
    margin: 0,
    lineHeight: 1.3,
  },

  statNum: {
    color: '#0f172a',
    fontSize: '1.65rem',
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-0.02em',
  },

  statCode: (color = COLORS.blue) => ({
    width: 34,
    height: 34,
    borderRadius: 9,
    background: `${color}12`,
    border: `1px solid ${color}26`,
    color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.78rem',
    fontWeight: 900,
    flexShrink: 0,
  }),

  msgBanner: (ok) => ({
    marginBottom: 16,
    padding: '12px 16px',
    borderRadius: 12,
    fontWeight: 700,
    fontSize: '0.9rem',
    background: ok ? '#ecfdf5' : '#fef2f2',
    color: ok ? '#047857' : '#b91c1c',
    border: ok ? '1px solid #a7f3d0' : '1px solid #fecaca',
  }),

  controlsCard: {
    background: 'rgba(255,255,255,.92)',
    border: '1px solid #dbeafe',
    borderLeft: '5px solid #2563eb',
    borderRadius: 14,
    padding: 16,
    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.08)',
    marginBottom: 18,
    backdropFilter: 'blur(8px)',
  },

  controls: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  searchInput: {
    flex: 1,
    minWidth: 260,
    padding: '11px 14px',
    borderRadius: 10,
    border: '1px solid #cbd5e1',
    fontSize: '0.92rem',
    outline: 'none',
    background: '#ffffff',
    color: '#111827',
    fontFamily: 'inherit',
  },

  seedBtn: (disabled) => ({
    padding: '11px 16px',
    borderRadius: 10,
    border: '1px solid #0f766e',
    background: disabled
      ? '#99f6e4'
      : 'linear-gradient(135deg, #0f766e 0%, #059669 100%)',
    color: '#ffffff',
    fontWeight: 800,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.8 : 1,
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    boxShadow: disabled ? 'none' : '0 8px 18px rgba(5,150,105,.22)',
  }),

  tableCard: {
    background: '#ffffff',
    border: '1px solid #dbeafe',
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.10)',
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
    padding: '12px 14px',
    textAlign: 'left',
    fontWeight: 800,
    fontSize: '0.78rem',
    color: '#e0f2fe',
    background: '#0f172a',
    borderBottom: '1px solid #1e293b',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    whiteSpace: 'nowrap',
  },

  td: {
    padding: '13px 14px',
    color: '#374151',
    borderBottom: '1px solid #eef2ff',
    verticalAlign: 'middle',
    background: '#ffffff',
  },

  index: {
    color: '#94a3b8',
    fontWeight: 800,
    width: 48,
  },

  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    minWidth: 180,
  },

  avatar: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    objectFit: 'cover',
    background: '#e5e7eb',
    border: '1px solid #e5e7eb',
    flexShrink: 0,
  },

  avatarFallback: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: '#eff6ff',
    color: '#1d4ed8',
    border: '1px solid #bfdbfe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '0.85rem',
    flexShrink: 0,
  },

  userName: {
    fontWeight: 800,
    color: '#111827',
    lineHeight: 1.25,
  },

  lockedText: {
    display: 'block',
    marginTop: 3,
    color: '#b91c1c',
    fontSize: '0.76rem',
    fontWeight: 700,
  },

  muted: {
    color: '#64748b',
    fontSize: '0.86rem',
  },

  badge: (tone = 'default') => {
    const map = {
      success: {
        background: '#ecfdf5',
        color: '#047857',
        border: '#a7f3d0',
      },
      info: {
        background: '#eff6ff',
        color: '#1d4ed8',
        border: '#bfdbfe',
      },
      warning: {
        background: '#fffbeb',
        color: '#b45309',
        border: '#fde68a',
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

  roleSelect: {
    padding: '8px 10px',
    borderRadius: 9,
    border: '1px solid #cbd5e1',
    fontSize: '0.86rem',
    cursor: 'pointer',
    background: '#ffffff',
    color: '#111827',
    fontFamily: 'inherit',
    fontWeight: 700,
    outline: 'none',
  },

  actionBtn: (locked, disabled) => ({
    padding: '8px 12px',
    borderRadius: 9,
    border: locked ? '1px solid #059669' : '1px solid #dc2626',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 800,
    fontSize: '0.82rem',
    background: locked ? '#ecfdf5' : '#fef2f2',
    color: locked ? '#047857' : '#b91c1c',
    opacity: disabled ? 0.65 : 1,
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  }),

  loadingCell: {
    textAlign: 'center',
    padding: 44,
    color: '#6b7280',
    fontWeight: 700,
    background: '#ffffff',
  },

  emptyCell: {
    textAlign: 'center',
    padding: 44,
    color: '#64748b',
    fontWeight: 700,
    background: '#ffffff',
  },

  pagination: {
    marginTop: 18,
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },

  pageBtn: (active) => ({
    minWidth: 38,
    padding: '8px 12px',
    borderRadius: 9,
    border: active ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
    cursor: 'pointer',
    fontWeight: 800,
    background: active ? '#1d4ed8' : '#ffffff',
    color: active ? '#ffffff' : '#374151',
    fontFamily: 'inherit',
  }),

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
    padding: 24,
    textAlign: 'center',
  },

  noAccessIcon: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    background: '#fee2e2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: '1rem',
  },

  homeBtn: {
    padding: '10px 22px',
    borderRadius: 10,
    border: 'none',
    background: '#1d4ed8',
    color: '#fff',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};

function formatNumber(value) {
  if (value == null) return 0;
  return Number(value).toLocaleString('vi-VN');
}

function getInitial(name, username, email) {
  const raw = name || username || email || 'U';
  return raw.trim().charAt(0).toUpperCase();
}

function AdminUsersPage() {
  useTitle('Quản lý người dùng');

  const userInfo = useSelector((s) => s.userInfo);
  const history = useHistory();

  const [users, setUsers] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [lockingUser, setLockingUser] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const isAdmin = userInfo?.role === 'admin';

  const loadUsers = useCallback(async () => {
    setLoading(true);

    try {
      const res = await adminApi.getUsers({
        page,
        limit: 20,
        search,
      });

      const data = res.data;

      setUsers(data.users || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setUsers([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  const loadStats = useCallback(async () => {
    try {
      const res = await adminApi.getSystemStats();
      setSystemStats(res.data?.stats);
    } catch {
      setSystemStats(null);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadStats();
    }
  }, [isAdmin, loadUsers, loadStats]);

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId);
    setMsg(null);

    try {
      await adminApi.updateUserRole(userId, newRole);

      setMsg({
        ok: true,
        text: 'Cập nhật quyền người dùng thành công.',
      });

      loadUsers();
    } catch (err) {
      setMsg({
        ok: false,
        text: err?.response?.data?.message || 'Không thể cập nhật quyền người dùng.',
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleSeedGrammar = async () => {
    setSeeding(true);
    setMsg(null);

    try {
      const res = await adminApi.seedGrammarTenses();

      setMsg({
        ok: true,
        text: res.data?.message || 'Đã tạo dữ liệu ngữ pháp mẫu.',
      });
    } catch (err) {
      setMsg({
        ok: false,
        text: err?.response?.data?.message || 'Không thể tạo dữ liệu ngữ pháp mẫu.',
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleLock = async (userId, isCurrentlyLocked) => {
    setLockingUser(userId);
    setMsg(null);

    try {
      if (isCurrentlyLocked) {
        await adminApi.unlockUser(userId);

        setMsg({
          ok: true,
          text: 'Đã mở khóa người dùng.',
        });
      } else {
        await adminApi.lockUser(userId);

        setMsg({
          ok: true,
          text: 'Đã khóa người dùng.',
        });
      }

      loadUsers();
    } catch (err) {
      setMsg({
        ok: false,
        text: err?.response?.data?.message || 'Không thể thay đổi trạng thái tài khoản.',
      });
    } finally {
      setLockingUser(null);
    }
  };

  if (!isAdmin) {
    return (
      <div style={S.noAccess}>
        <div style={S.noAccessIcon}>!</div>

        <div style={{ fontWeight: 800, color: '#374151', fontSize: '1.05rem' }}>
          Chỉ admin mới có thể truy cập trang này.
        </div>

        <button style={S.homeBtn} onClick={() => history.push('/')}>
          Về trang chủ
        </button>
      </div>
    );
  }

  const statCards = systemStats
    ? [
        {
          label: 'Từ vựng',
          value: systemStats.totalWords,
          code: 'TV',
          color: COLORS.blue,
        },
        {
          label: 'Giáo viên',
          value: systemStats.totalTeachers,
          code: 'GV',
          color: COLORS.purple,
        },
        {
          label: 'Học sinh',
          value: systemStats.totalStudents,
          code: 'HS',
          color: COLORS.green,
        },
        {
          label: 'Khóa học',
          value: systemStats.totalCourses,
          code: 'KH',
          color: COLORS.orange,
        },
        {
          label: 'Bài ngữ pháp',
          value: systemStats.totalGrammarLessons,
          code: 'NP',
          color: COLORS.red,
        },
      ]
    : [];

  return (
    <div style={S.page}>
      <div style={S.maxW}>
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Quản lý người dùng</h1>

            <p style={S.subtitle}>
              Quản lý tài khoản, phân quyền và trạng thái hoạt động của người dùng.
            </p>
          </div>

          <div style={S.headerMeta}>
            Tổng: {formatNumber(total)} người dùng
          </div>
        </div>

        {statCards.length > 0 && (
          <div style={S.statsRow}>
            {statCards.map((item) => (
              <div key={item.label} style={S.statCard(item.color)}>
                <div style={S.statTop}>
                  <p style={S.statLabel}>{item.label}</p>
                  <div style={S.statCode(item.color)}>{item.code}</div>
                </div>

                <div style={S.statNum}>
                  {formatNumber(item.value)}
                </div>
              </div>
            ))}
          </div>
        )}

        {msg && (
          <div style={S.msgBanner(msg.ok)}>
            {msg.text}
          </div>
        )}

        <div style={S.controlsCard}>
          <div style={S.controls}>
            <input
              style={S.searchInput}
              placeholder="Tìm theo tên, email hoặc username..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <button
              style={S.seedBtn(seeding)}
              disabled={seeding}
              onClick={handleSeedGrammar}
            >
              {seeding ? 'Đang tạo dữ liệu...' : 'Tạo dữ liệu ngữ pháp mẫu'}
            </button>
          </div>
        </div>

        <div style={S.tableCard}>
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>#</th>
                  <th style={S.th}>Người dùng</th>
                  <th style={S.th}>Email</th>
                  <th style={S.th}>Username</th>
                  <th style={{ ...S.th, textAlign: 'right' }}>Xu</th>
                  <th style={S.th}>Quyền</th>
                  <th style={S.th}>Thay đổi quyền</th>
                  <th style={S.th}>Trạng thái</th>
                  <th style={S.th}>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} style={S.loadingCell}>
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={S.emptyCell}>
                      Không tìm thấy người dùng phù hợp.
                    </td>
                  </tr>
                ) : (
                  users.map((u, i) => {
                    const roleTone = ROLE_CONFIG[u.role]?.tone || 'neutral';

                    return (
                      <tr key={u.id}>
                        <td style={{ ...S.td, ...S.index }}>
                          {(page - 1) * 20 + i + 1}
                        </td>

                        <td style={S.td}>
                          <div style={S.userCell}>
                            {u.avt ? (
                              <img src={u.avt} alt="" style={S.avatar} />
                            ) : (
                              <div style={S.avatarFallback}>
                                {getInitial(u.name, u.username, u.email)}
                              </div>
                            )}

                            <div>
                              <div style={S.userName}>{u.name || '—'}</div>

                              {u.isLocked && (
                                <span style={S.lockedText}>Tài khoản đang bị khóa</span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td style={S.td}>
                          <span style={S.muted}>{u.email || '—'}</span>
                        </td>

                        <td style={S.td}>
                          <span style={S.muted}>{u.username || '—'}</span>
                        </td>

                        <td style={{ ...S.td, textAlign: 'right', fontWeight: 800 }}>
                          {u.coin ?? '—'}
                        </td>

                        <td style={S.td}>
                          <span style={S.badge(roleTone)}>
                            {ROLE_CONFIG[u.role]?.label || u.role}
                          </span>
                        </td>

                        <td style={S.td}>
                          <select
                            style={S.roleSelect}
                            value={u.role}
                            disabled={updating === u.id}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          >
                            <option value="student">Học sinh</option>
                            <option value="teacher">Giáo viên</option>
                            <option value="admin">Admin</option>
                          </select>

                          {updating === u.id && (
                            <span style={{ marginLeft: 8, color: '#6b7280', fontSize: '0.82rem' }}>
                              Đang lưu...
                            </span>
                          )}
                        </td>

                        <td style={S.td}>
                          <span style={S.badge(u.isLocked ? 'danger' : 'success')}>
                            {u.isLocked ? 'Đã khóa' : 'Hoạt động'}
                          </span>
                        </td>

                        <td style={S.td}>
                          <button
                            style={S.actionBtn(u.isLocked, lockingUser === u.id)}
                            disabled={lockingUser === u.id}
                            onClick={() => handleLock(u.id, u.isLocked)}
                          >
                            {lockingUser === u.id
                              ? 'Đang xử lý'
                              : u.isLocked
                              ? 'Mở khóa'
                              : 'Khóa'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div style={S.pagination}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                style={S.pageBtn(p === page)}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;