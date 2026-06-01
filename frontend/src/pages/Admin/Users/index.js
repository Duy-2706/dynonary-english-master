import adminApi from 'apis/adminApi';
import useTitle from 'hooks/useTitle';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const ROLE_CONFIG = {
  student: { label: 'Học sinh', color: '#00b894', bg: '#d4f5eb' },
  teacher: { label: 'Giáo viên', color: '#667eea', bg: '#ede9ff' },
  admin: { label: 'Admin', color: '#e17055', bg: '#fde8e4' },
};

const S = {
  page: { minHeight: '100vh', background: '#f4f6fb', fontFamily: "'Segoe UI', sans-serif", padding: '32px 24px' },
  header: { maxWidth: 1100, margin: '0 auto 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 },
  title: { fontSize: '1.8rem', fontWeight: 900, color: '#333', margin: 0 },
  statsRow: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  statCard: (bg, color) => ({
    background: bg, color, borderRadius: 12, padding: '12px 20px',
    fontWeight: 800, fontSize: '1.1rem', textAlign: 'center',
  }),
  statLabel: { fontSize: '0.75rem', fontWeight: 600, display: 'block', opacity: 0.8 },
  controls: { maxWidth: 1100, margin: '0 auto 20px', display: 'flex', gap: 12, flexWrap: 'wrap' },
  searchInput: {
    flex: 1, minWidth: 220, padding: '10px 14px', borderRadius: 10,
    border: '1.5px solid #e0e0e0', fontSize: '0.92rem', outline: 'none',
  },
  table: { maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' },
  thead: { background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff' },
  th: { padding: '14px 18px', textAlign: 'left', fontWeight: 700, fontSize: '0.88rem' },
  tr: (even) => ({ background: even ? '#fafafe' : '#fff', borderBottom: '1px solid #f0f0f0' }),
  td: { padding: '14px 18px', fontSize: '0.9rem', color: '#444' },
  roleBadge: (role) => ({
    display: 'inline-block',
    background: ROLE_CONFIG[role]?.bg || '#eee',
    color: ROLE_CONFIG[role]?.color || '#555',
    borderRadius: 20, padding: '3px 12px', fontSize: '0.8rem', fontWeight: 700,
  }),
  roleSelect: {
    padding: '6px 10px', borderRadius: 8, border: '1.5px solid #e0e0e0',
    fontSize: '0.85rem', cursor: 'pointer', background: '#fff',
  },
  pagination: { maxWidth: 1100, margin: '20px auto 0', display: 'flex', justifyContent: 'center', gap: 8 },
  pageBtn: (active) => ({
    padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700,
    background: active ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#f0f0f0',
    color: active ? '#fff' : '#555',
  }),
  noAccess: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexDirection: 'column', gap: 12, background: '#f4f6fb',
  },
  msgBanner: (ok) => ({
    maxWidth: 1100, margin: '0 auto 16px', padding: '10px 16px', borderRadius: 8, fontWeight: 700,
    background: ok ? '#d4f5eb' : '#fde8e4', color: ok ? '#00b894' : '#e17055',
  }),
};

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
  const [msg, setMsg] = useState(null); // { ok, text }
  const [updating, setUpdating] = useState(null); // userId being updated

  const isAdmin = userInfo?.role === 'admin';

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ page, limit: 20, search });
      const data = res.data;
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setUsers([]);
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
    if (isAdmin) { loadUsers(); loadStats(); }
  }, [isAdmin, loadUsers, loadStats]);

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId);
    setMsg(null);
    try {
      await adminApi.updateUserRole(userId, newRole);
      setMsg({ ok: true, text: 'Cập nhật quyền thành công!' });
      loadUsers();
    } catch (err) {
      setMsg({ ok: false, text: err?.response?.data?.message || 'Lỗi khi cập nhật quyền.' });
    } finally {
      setUpdating(null);
    }
  };

  if (!isAdmin) {
    return (
      <div style={S.noAccess}>
        <div style={{ fontSize: '3rem' }}>🔒</div>
        <div style={{ fontWeight: 700, color: '#555' }}>Chỉ admin mới có thể truy cập trang này.</div>
        <button style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#667eea', color: '#fff', fontWeight: 700, cursor: 'pointer' }} onClick={() => history.push('/')}>
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>👥 Quản lý người dùng</h1>
          <div style={{ color: '#888', fontSize: '0.9rem', marginTop: 4 }}>Tổng: {total} người dùng</div>
        </div>
        {systemStats && (
          <div style={S.statsRow}>
            <div style={S.statCard('#ede9ff', '#667eea')}>
              {systemStats.totalWords}<span style={S.statLabel}>Từ vựng</span>
            </div>
            <div style={S.statCard('#fde8e4', '#e17055')}>
              {systemStats.totalTeachers}<span style={S.statLabel}>Giáo viên</span>
            </div>
            <div style={S.statCard('#d4f5eb', '#00b894')}>
              {systemStats.totalStudents}<span style={S.statLabel}>Học sinh</span>
            </div>
            <div style={S.statCard('#fff5e6', '#f39c12')}>
              {systemStats.totalCourses}<span style={S.statLabel}>Khóa học</span>
            </div>
            <div style={S.statCard('#fce4ec', '#e91e63')}>
              {systemStats.totalGrammarLessons}<span style={S.statLabel}>Bài ngữ pháp</span>
            </div>
          </div>
        )}
      </div>

      {msg && <div style={S.msgBanner(msg.ok)}>{msg.ok ? '✅' : '❌'} {msg.text}</div>}

      <div style={S.controls}>
        <input
          style={S.searchInput}
          placeholder="🔍 Tìm theo tên hoặc username..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div style={S.table}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={S.thead}>
            <tr>
              <th style={S.th}>#</th>
              <th style={S.th}>Tên</th>
              <th style={S.th}>Username</th>
              <th style={S.th}>Xu</th>
              <th style={S.th}>Quyền hiện tại</th>
              <th style={S.th}>Thay đổi quyền</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>⏳ Đang tải...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>Không tìm thấy người dùng</td></tr>
            ) : (
              users.map((u, i) => (
                <tr key={u.id} style={S.tr(i % 2 === 0)}>
                  <td style={S.td}>{(page - 1) * 20 + i + 1}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>
                    {u.avt && <img src={u.avt} alt="" style={{ width: 28, height: 28, borderRadius: '50%', marginRight: 8, verticalAlign: 'middle', objectFit: 'cover' }} />}
                    {u.name || '—'}
                  </td>
                  <td style={S.td}>{u.username || '—'}</td>
                  <td style={S.td}>{u.coin ?? '—'}</td>
                  <td style={S.td}>
                    <span style={S.roleBadge(u.role)}>
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
                    {updating === u.id && <span style={{ marginLeft: 8, color: '#aaa', fontSize: '0.8rem' }}>...</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={S.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} style={S.pageBtn(p === page)} onClick={() => setPage(p)}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminUsersPage;
