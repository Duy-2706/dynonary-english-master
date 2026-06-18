import adminApi from 'apis/adminApi';
import useTitle from 'hooks/useTitle';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const COLORS = {
  blue: '#2563eb',
  green: '#059669',
  orange: '#d97706',
  purple: '#7c3aed',
  red: '#dc2626',
};

const VN_MAP = {
  à: 'a', á: 'a', ả: 'a', ã: 'a', ạ: 'a', ă: 'a', ắ: 'a', ặ: 'a',ằ: 'a', ẵ: 'a', ẳ: 'a',
  â: 'a', ấ: 'a', ầ: 'a', ẩ: 'a', ẫ: 'a', ậ: 'a',
  è: 'e', é: 'e', ẻ: 'e',ẽ: 'e', ẹ: 'e', ê: 'e', ế: 'e', ề: 'e',ể: 'e',ễ: 'e',ệ: 'e',
  ì: 'i', í: 'i', ỉ: 'i',ĩ: 'i',ị: 'i',
  ò: 'o', ó: 'o',ỏ: 'o',õ: 'o',ọ: 'o', ô: 'o',ố: 'o',ồ: 'o',ổ: 'o',ỗ: 'o',ộ: 'o',
  ơ: 'o',ớ: 'o',ờ: 'o',ở: 'o',ỡ: 'o',ợ: 'o',
  ù: 'u',ú: 'u',ủ: 'u',ũ: 'u',ụ: 'u', ư: 'u',ứ: 'u',ừ: 'u',ử: 'u',ữ: 'u',ự: 'u',
 ỳ: 'y',ý: 'y',ỷ: 'y',ỹ: 'y',ỵ: 'y', đ: 'd',
};

const nvn = (s = '') =>
  s.toLowerCase().split('').map((c) => VN_MAP[c] || c).join('').replace(/[^a-z0-9]/g, '');

const previewTeacherEmail = (name = '') => {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (!p.length) return '';
  return `${nvn(p[p.length - 1])}${p.slice(0, -1).map((x) => nvn(x)[0] || '').join('')}gv@gmail.com`;
};

const previewStudentEmail = (name = '', dob = '') => {
  const p = name.trim().split(/\s+/).filter(Boolean);
  const last = p.length ? nvn(p[p.length - 1]) : 'hs';
  const init = p.slice(0, -1).map((x) => nvn(x)[0] || '').join('');
  const d = dob.replace(/-/g, '/').split('/');
  const suf = d.length === 3 ? `${d[0].padStart(2, '0')}${d[1].padStart(2, '0')}${d[2].slice(-2)}` : '';
  return `${last}${init}${suf}@gmail.com`;
};

const ROLE_CONFIG = {
  student: { label: 'Học sinh', tone: 'success' },
  teacher: { label: 'Giáo viên', tone: 'info' },
  admin: { label: 'Admin', tone: 'warning' },
};

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 8% 12%, rgba(37,99,235,.10) 0 260px, transparent 261px),
      radial-gradient(circle at 92% 8%, rgba(14,165,233,.12) 0 240px, transparent 241px),
      linear-gradient(180deg, #eef4ff 0%, #f6f8fc 46%, #eef7f3 100%)
    `,
    fontFamily: "'Inter','Segoe UI',Roboto,Arial,sans-serif",
    padding: '30px 24px 54px',
    color: '#172033',
  },
  maxW: { maxWidth: 1280, margin: '0 auto' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 22, marginBottom: 24,
    flexWrap: 'wrap', background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#0369a1 100%)',
    borderRadius: 20, padding: '28px 32px', boxShadow: '0 18px 40px rgba(15,23,42,.18)',
  },
  title: { fontSize: '2.25rem', fontWeight: 900, color: '#fff', margin: '0 0 10px' },
  subtitle: { color: '#dbeafe', fontSize: '1.08rem', margin: 0, lineHeight: 1.6, fontWeight: 500 },
  headerMeta: {
    background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.28)', borderRadius: 999,
    padding: '10px 18px', color: '#fff', fontSize: '1rem', fontWeight: 800,
  },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 16, marginBottom: 22 },
  statCard: (c = COLORS.blue) => ({
    background: `linear-gradient(180deg,#fff 0%,${c}10 100%)`, border: `1px solid ${c}33`,
    borderTop: `5px solid ${c}`, borderRadius: 16, padding: '18px 20px', boxShadow: '0 8px 22px rgba(15,23,42,.08)',
  }),
  statTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 10 },
  statLabel: { color: '#475569', fontSize: '1rem', fontWeight: 800, margin: 0 },
  statNum: { color: '#0f172a', fontSize: '2rem', fontWeight: 900, lineHeight: 1 },
  statCode: (c = COLORS.blue) => ({
    width: 42, height: 42, borderRadius: 11, background: `${c}12`, border: `1px solid ${c}26`,
    color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem', fontWeight: 900,
  }),
  controlsCard: {
    background: 'rgba(255,255,255,.96)', border: '1px solid #dbeafe', borderLeft: '6px solid #2563eb',
    borderRadius: 16, padding: 18, boxShadow: '0 8px 24px rgba(37,99,235,.08)', marginBottom: 18,
  },
  controls: { display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' },
  searchInput: {
    flex: 1, minWidth: 280, padding: '13px 15px', borderRadius: 11, border: '1px solid #cbd5e1',
    fontSize: '1rem', outline: 'none', background: '#fff', color: '#111827', fontFamily: 'inherit',
  },
  seedBtn: (disabled) => ({
    padding: '13px 18px', borderRadius: 11, border: '1px solid #0f766e',
    background: disabled ? '#99f6e4' : 'linear-gradient(135deg,#0f766e,#059669)', color: '#fff',
    fontWeight: 850, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .8 : 1,
    whiteSpace: 'nowrap', fontFamily: 'inherit', fontSize: '1rem',
  }),
  tableCard: { background: '#fff', border: '1px solid #dbeafe', borderRadius: 16, overflow: 'hidden', boxShadow: '0 12px 30px rgba(15,23,42,.10)' },
  tableWrap: { width: '100%', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '1rem' },
  th: {
    padding: '14px 16px', textAlign: 'left', fontWeight: 900, fontSize: '.88rem', color: '#e0f2fe',
    background: '#0f172a', borderBottom: '1px solid #1e293b', textTransform: 'uppercase', letterSpacing: '.035em', whiteSpace: 'nowrap',
  },
  td: { padding: '15px 16px', color: '#374151', borderBottom: '1px solid #eef2ff', verticalAlign: 'middle', background: '#fff', fontSize: '1rem' },
  index: { color: '#94a3b8', fontWeight: 850, width: 52 },
  userCell: { display: 'flex', alignItems: 'center', gap: 12, minWidth: 200 },
  avatar: { width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', background: '#e5e7eb', border: '1px solid #e5e7eb' },
  avatarFallback: {
    width: 42, height: 42, borderRadius: '50%', background: '#eff6ff', color: '#1d4ed8',
    border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900,
  },
  userName: { fontWeight: 900, color: '#111827', lineHeight: 1.3, fontSize: '1.02rem' },
  lockedText: { display: 'block', marginTop: 4, color: '#b91c1c', fontSize: '.84rem', fontWeight: 800 },
  muted: { color: '#64748b', fontSize: '.96rem' },
  badge: (tone = 'default') => {
    const m = {
      success: ['#ecfdf5', '#047857', '#a7f3d0'], info: ['#eff6ff', '#1d4ed8', '#bfdbfe'],
      warning: ['#fffbeb', '#b45309', '#fde68a'], danger: ['#fef2f2', '#b91c1c', '#fecaca'],
      neutral: ['#f3f4f6', '#374151', '#e5e7eb'], default: ['#f8fafc', '#475569', '#e2e8f0'],
    };
    const c = m[tone] || m.default;
    return {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: c[0], color: c[1],
      border: `1px solid ${c[2]}`, borderRadius: 999, padding: '6px 12px', fontSize: '.88rem',
      fontWeight: 900, lineHeight: 1, whiteSpace: 'nowrap',
    };
  },
  roleSelect: {
    padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '.96rem',
    cursor: 'pointer', background: '#fff', color: '#111827', fontFamily: 'inherit', fontWeight: 800, outline: 'none',
  },
  actionBtn: (locked, disabled) => ({
    padding: '10px 14px', borderRadius: 10, border: locked ? '1px solid #059669' : '1px solid #dc2626',
    cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 900, fontSize: '.92rem',
    background: locked ? '#ecfdf5' : '#fef2f2', color: locked ? '#047857' : '#b91c1c',
    opacity: disabled ? .65 : 1, fontFamily: 'inherit', whiteSpace: 'nowrap',
  }),
  loadingCell: { textAlign: 'center', padding: 52, color: '#6b7280', fontWeight: 800, background: '#fff', fontSize: '1rem' },
  emptyCell: { textAlign: 'center', padding: 52, color: '#64748b', fontWeight: 800, background: '#fff', fontSize: '1rem' },
  pagination: { marginTop: 20, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' },
  pageBtn: (active) => ({
    minWidth: 42, padding: '10px 14px', borderRadius: 10, border: active ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
    cursor: 'pointer', fontWeight: 900, fontSize: '.95rem', background: active ? '#1d4ed8' : '#fff',
    color: active ? '#fff' : '#374151', fontFamily: 'inherit',
  }),
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(15,23,42,.64)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
  },
  modal: {
    background: '#fff', borderRadius: 22, padding: 30, maxWidth: 920, width: '100%',
    maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 26px 70px rgba(15,23,42,.32)',
  },
  noAccess: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexDirection: 'column', gap: 16, background: '#f5f7fb', fontFamily: "'Inter','Segoe UI',Roboto,Arial,sans-serif",
    color: '#172033', padding: 24, textAlign: 'center',
  },
  homeBtn: {
    padding: '13px 24px', borderRadius: 12, border: 'none', background: '#1d4ed8',
    color: '#fff', fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem',
  },
  toastWrap: {
    position: 'fixed', top: 24, right: 24, zIndex: 99999, display: 'flex',
    flexDirection: 'column', gap: 12, pointerEvents: 'none',
  },
  toastBox: (type = 'success') => {
    const c = {
      success: ['#ecfdf5', '#10b981', '#047857'],
      error: ['#fef2f2', '#ef4444', '#b91c1c'],
      warning: ['#fffbeb', '#f59e0b', '#92400e'],
      info: ['#eff6ff', '#2563eb', '#1d4ed8'],
    }[type] || ['#ecfdf5', '#10b981', '#047857'];

    return {
      width: 380, maxWidth: 'calc(100vw - 40px)', display: 'flex', alignItems: 'flex-start',
      gap: 14, padding: '16px 18px', borderRadius: 18, background: c[0], border: `2px solid ${c[1]}`,
      color: c[2], boxShadow: '0 18px 44px rgba(15,23,42,.22)', pointerEvents: 'auto',
      animation: 'toastSlide .22s ease-out',
    };
  },
  toastIcon: (type = 'success') => {
    const bg = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#2563eb' }[type] || '#10b981';
    return {
      width: 34, height: 34, borderRadius: '50%', background: bg, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900,
      flexShrink: 0, boxShadow: '0 6px 14px rgba(15,23,42,.16)',
    };
  },
  confirmBackdrop: {
    position: 'fixed', inset: 0, background: 'rgba(15,23,42,.58)', zIndex: 99998,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  confirmBox: {
    width: 480, maxWidth: 'calc(100vw - 40px)', background: '#fff', borderRadius: 24,
    padding: 30, boxShadow: '0 28px 80px rgba(15,23,42,.34)', border: '1px solid #e2e8f0',
  },
};

const inp = {
  padding: '13px 15px', borderRadius: 11, border: '1px solid #cbd5e1', fontSize: '1rem',
  fontFamily: "'Inter','Segoe UI',Roboto,Arial,sans-serif", outline: 'none', background: '#fff',
  color: '#111827', fontWeight: 650, lineHeight: 1.4,
};

const TABS = [
  { id: 'users', label: 'Người dùng' },
  { id: 'classes', label: 'Lớp học' },
  { id: 'teachers', label: 'Giáo viên' },
  { id: 'students', label: 'Học sinh' },
  { id: 'grammar', label: 'Ngữ pháp' },
];

function formatNumber(v) {
  return v == null ? 0 : Number(v).toLocaleString('vi-VN');
}

function getInitial(name, username, email) {
  return (name || username || email || 'U').trim().charAt(0).toUpperCase();
}

function TabBar({ active, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap', background: 'rgba(255,255,255,.86)',
      padding: 8, borderRadius: 16, border: '1px solid #dbeafe', boxShadow: '0 8px 24px rgba(15,23,42,.08)',
    }}>
      {TABS.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding: '13px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 900,
          fontSize: '1rem', fontFamily: 'inherit', background: active === t.id ? '#1d4ed8' : 'transparent',
          color: active === t.id ? '#fff' : '#334155',
        }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icon = toast.type === 'success' ? '✓' : toast.type === 'info' ? 'i' : '!';

  return (
    <div style={S.toastWrap}>
      <div style={S.toastBox(toast.type)}>
        <div style={S.toastIcon(toast.type)}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.02rem', fontWeight: 900, marginBottom: 4 }}>{toast.title}</div>
          {toast.message && <div style={{ fontSize: '.94rem', lineHeight: 1.45, fontWeight: 650 }}>{toast.message}</div>}
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{ border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 900, lineHeight: 1, padding: 0 }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  loading = false,
  danger = false,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div style={S.confirmBackdrop} onClick={(e) => e.target === e.currentTarget && !loading && onCancel()}>
      <div style={S.confirmBox}>
        <div style={{
          width: 62, height: 62, borderRadius: '50%', background: danger ? '#fee2e2' : '#eff6ff',
          color: danger ? '#dc2626' : '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: '1.7rem', margin: '0 auto 16px',
        }}>
          {danger ? '!' : '?'}
        </div>

        <div style={{ textAlign: 'center', fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', marginBottom: 10 }}>
          {title}
        </div>

        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '1rem', lineHeight: 1.65, fontWeight: 600, marginBottom: 24 }}>
          {message}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '13px 22px', borderRadius: 13, border: '1px solid #cbd5e1', background: '#f8fafc',
              color: '#475569', fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', fontSize: '1rem',
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '13px 24px', borderRadius: 13, border: 'none', background: danger ? '#dc2626' : '#2563eb',
              color: '#fff', fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', fontSize: '1rem', opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? 'Đang xử lý...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalHead({ title, onClose }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
      <h2 style={{ margin: 0, fontSize: '1.55rem', fontWeight: 900, color: '#0f172a' }}>{title}</h2>
      <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#64748b', lineHeight: 1 }}>×</button>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontWeight: 850, marginBottom: 8, fontSize: '1rem', color: '#374151' }}>{label}</label>
      {children}
    </div>
  );
}

function UsersTab({ systemStats, notify }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [lockingUser, setLockingUser] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ page, limit: 20, search });
      setUsers(res.data.users || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setUsers([]);
      setTotal(0);
      setTotalPages(1);
      notify?.('error', 'Tải danh sách người dùng thất bại', 'Không thể lấy dữ liệu người dùng.');
    } finally {
      setLoading(false);
    }
  }, [page, search, notify]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId);
    try {
      await adminApi.updateUserRole(userId, newRole);
      notify?.('success', 'Cập nhật quyền thành công', 'Quyền người dùng đã được thay đổi.');
      loadUsers();
    } catch (err) {
      notify?.('error', 'Cập nhật quyền thất bại', err?.response?.data?.message || 'Không thể cập nhật quyền.');
    } finally {
      setUpdating(null);
    }
  };

  const handleSeedGrammar = async () => {
    setSeeding(true);
    try {
      const res = await adminApi.seedGrammarTenses();
      notify?.('success', 'Tạo dữ liệu ngữ pháp mẫu thành công', res.data?.message || 'Đã tạo dữ liệu ngữ pháp mẫu.');
    } catch (err) {
      notify?.('error', 'Tạo dữ liệu ngữ pháp mẫu thất bại', err?.response?.data?.message || 'Không thể tạo dữ liệu.');
    } finally {
      setSeeding(false);
    }
  };

  const handleLock = async (userId, isLocked) => {
    setLockingUser(userId);
    try {
      if (isLocked) {
        await adminApi.unlockUser(userId);
        notify?.('success', 'Mở khóa người dùng thành công', 'Người dùng đã được mở khóa.');
      } else {
        await adminApi.lockUser(userId);
        notify?.('success', 'Khóa người dùng thành công', 'Người dùng đã được khóa.');
      }
      loadUsers();
    } catch (err) {
      notify?.('error', 'Thay đổi trạng thái thất bại', err?.response?.data?.message || 'Không thể thay đổi trạng thái.');
    } finally {
      setLockingUser(null);
    }
  };

  const statCards = systemStats
    ? [
        { label: 'Từ vựng', value: systemStats.totalWords, code: 'TV', color: COLORS.blue },
        { label: 'Giáo viên', value: systemStats.totalTeachers, code: 'GV', color: COLORS.purple },
        { label: 'Học sinh', value: systemStats.totalStudents, code: 'HS', color: COLORS.green },
        { label: 'Khóa học', value: systemStats.totalCourses, code: 'KH', color: COLORS.orange },
        { label: 'Bài ngữ pháp', value: systemStats.totalGrammarLessons, code: 'NP', color: COLORS.red },
      ]
    : [];

  return (
    <>
      {statCards.length > 0 && (
        <div style={S.statsRow}>
          {statCards.map((x) => (
            <div key={x.label} style={S.statCard(x.color)}>
              <div style={S.statTop}>
                <p style={S.statLabel}>{x.label}</p>
                <div style={S.statCode(x.color)}>{x.code}</div>
              </div>
              <div style={S.statNum}>{formatNumber(x.value)}</div>
            </div>
          ))}
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

          <button style={S.seedBtn(seeding)} disabled={seeding} onClick={handleSeedGrammar}>
            {seeding ? 'Đang tạo dữ liệu...' : 'Tạo dữ liệu ngữ pháp mẫu'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 10, color: '#475569', fontSize: '1rem', fontWeight: 850 }}>
        Tổng: {formatNumber(total)} người dùng
      </div>

      <div style={S.tableCard}>
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                {['#', 'Người dùng', 'Email', 'Username', 'Xu', 'Quyền', 'Thay đổi quyền', 'Trạng thái', 'Thao tác'].map((h, i) => (
                  <th key={h} style={{ ...S.th, ...(i === 4 ? { textAlign: 'right' } : {}) }}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={S.loadingCell}>Đang tải dữ liệu...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={9} style={S.emptyCell}>Không tìm thấy người dùng phù hợp.</td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr key={u.id}>
                    <td style={{ ...S.td, ...S.index }}>{(page - 1) * 20 + i + 1}</td>

                    <td style={S.td}>
                      <div style={S.userCell}>
                        {u.avt ? (
                          <img src={u.avt} alt="" style={S.avatar} />
                        ) : (
                          <div style={S.avatarFallback}>{getInitial(u.name, u.username, u.email)}</div>
                        )}

                        <div>
                          <div style={S.userName}>{u.name || '—'}</div>
                          {u.isLocked && <span style={S.lockedText}>Đang bị khóa</span>}
                        </div>
                      </div>
                    </td>

                    <td style={S.td}><span style={S.muted}>{u.email || '—'}</span></td>
                    <td style={S.td}><span style={S.muted}>{u.username || '—'}</span></td>
                    <td style={{ ...S.td, textAlign: 'right', fontWeight: 900 }}>{u.coin ?? '—'}</td>

                    <td style={S.td}>
                      <span style={S.badge(ROLE_CONFIG[u.role]?.tone || 'neutral')}>
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
                        {lockingUser === u.id ? 'Đang xử lý' : u.isLocked ? 'Mở khóa' : 'Khóa'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div style={S.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} style={S.pageBtn(p === page)} onClick={() => setPage(p)}>
              {p}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function ClassroomsTab({ notify }) {
  const [classrooms, setClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', grade: '', teacherAccountId: '', teacherName: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, uRes] = await Promise.all([
        adminApi.getClassrooms(),
        adminApi.getUsers({ limit: 200 }),
      ]);
      setClassrooms(cRes.data?.classrooms || []);
      setTeachers((uRes.data?.users || []).filter((u) => u.role === 'teacher'));
    } catch {
      setClassrooms([]);
      notify?.('error', 'Tải danh sách lớp thất bại', 'Không thể lấy dữ liệu lớp học.');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      notify?.('warning', 'Thiếu tên lớp', 'Vui lòng nhập tên lớp trước khi tạo.');
      return;
    }

    setCreating(true);

    try {
      await adminApi.createClassroom(form);
      notify?.('success', 'Tạo lớp thành công', `Lớp "${form.name}" đã được tạo.`);
      setForm({ name: '', grade: '', teacherAccountId: '', teacherName: '' });
      load();
    } catch (err) {
      notify?.('error', 'Tạo lớp thất bại', err?.response?.data?.message || 'Không thể tạo lớp.');
    } finally {
      setCreating(false);
    }
  };

  const btn = (disabled) => ({
    padding: '13px 20px', borderRadius: 11, border: 'none', background: disabled ? '#93c5fd' : '#1d4ed8',
    color: '#fff', fontWeight: 900, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '1rem',
  });

  return (
    <>
      <div style={{ ...S.controlsCard, marginBottom: 22 }}>
        <div style={{ fontWeight: 900, marginBottom: 14, color: '#1e3a8a', fontSize: '1.15rem' }}>
          Tạo lớp học mới
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            style={{ ...inp, width: 190 }}
            placeholder="Tên lớp, ví dụ: 1A"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />

          <input
            style={{ ...inp, width: 130 }}
            placeholder="Khối"
            value={form.grade}
            onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
          />

          <select
            style={{ ...inp, width: 320 }}
            value={form.teacherAccountId}
            onChange={(e) => {
              const t = teachers.find((x) => x.accountId === e.target.value);
              setForm((f) => ({
                ...f,
                teacherAccountId: e.target.value,
                teacherName: t?.name || '',
              }));
            }}
          >
            <option value="">— Chọn giáo viên chủ nhiệm —</option>
            {teachers.map((t) => (
              <option key={t.accountId} value={t.accountId}>
                {t.name}
              </option>
            ))}
          </select>

          <button style={btn(creating)} disabled={creating} onClick={handleCreate}>
            {creating ? 'Đang tạo...' : 'Tạo lớp'}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={S.loadingCell}>Đang tải dữ liệu...</div>
      ) : (
        <div style={S.tableCard}>
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  {['#', 'Tên lớp', 'Khối', 'Giáo viên chủ nhiệm', 'Sĩ số', 'Trạng thái'].map((h) => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {classrooms.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={S.emptyCell}>Chưa có lớp học nào.</td>
                  </tr>
                ) : (
                  classrooms.map((cls, i) => (
                    <tr key={cls.id}>
                      <td style={{ ...S.td, ...S.index }}>{i + 1}</td>
                      <td style={{ ...S.td, fontWeight: 900 }}>{cls.name}</td>
                      <td style={S.td}>{cls.grade || '—'}</td>
                      <td style={S.td}>{cls.teacherName || <span style={S.muted}>Chưa gán</span>}</td>
                      <td style={S.td}>{(cls.students || []).length} học sinh</td>
                      <td style={S.td}><span style={S.badge('success')}>{cls.status || 'active'}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

function TeachersTab({ notify }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createRows, setCreateRows] = useState([{ name: '', subject: 'Tiếng Anh' }]);
  const [creating, setCreating] = useState(false);
  const [createResults, setCreateResults] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', subject: '' });
  const [editing, setEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const xlsxRef = useRef(null);

  const loadTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ limit: 500 });
      setTeachers((res.data?.users || []).filter((u) => u.role === 'teacher'));
    } catch {
      setTeachers([]);
      notify?.('error', 'Tải danh sách giáo viên thất bại', 'Không thể lấy dữ liệu giáo viên.');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  const smallButton = (tone = 'blue') => {
    const m = {
      blue: ['#eff6ff', '#bfdbfe', '#1d4ed8'],
      red: ['#fef2f2', '#fecaca', '#b91c1c'],
      green: ['#ecfdf5', '#a7f3d0', '#047857'],
      purple: ['#f5f3ff', '#c4b5fd', '#6d28d9'],
      gray: ['#f8fafc', '#cbd5e1', '#475569'],
    };

    const c = m[tone] || m.blue;

    return {
      padding: '11px 15px', borderRadius: 11, border: `1px solid ${c[1]}`, background: c[0],
      color: c[2], fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', fontSize: '.95rem',
    };
  };

  const downloadTemplate = () => {
    import('xlsx').then((XLSX) => {
      const data = [['Họ và tên', 'Môn dạy'], ['Nguyễn Thị Dương', 'Tiếng Anh'], ['Trần Văn Minh', 'Toán']];
      const ws = XLSX.utils.aoa_to_sheet(data);
      ws['!cols'] = [{ wch: 32 }, { wch: 20 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'GiaoVien');
      XLSX.writeFile(wb, 'mau_giao_vien.xlsx');
    });
  };

  const handleXlsx = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    import('xlsx').then((XLSX) => {
      const reader = new FileReader();

      reader.onload = (ev) => {
        try {
          const wb = XLSX.read(new Uint8Array(ev.target.result), { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

          const parsed = rows
            .slice(1)
            .filter((r) => r[0])
            .map((r) => ({
              name: String(r[0]).trim(),
              subject: String(r[1] || 'Tiếng Anh').trim(),
            }));

          if (parsed.length) {
            setCreateRows(parsed);
            notify?.('success', 'Import Excel thành công', `Đã đọc ${parsed.length} giáo viên từ file Excel.`);
          } else {
            notify?.('warning', 'Không đọc được dữ liệu', 'Kiểm tra lại định dạng file Excel.');
          }
        } catch {
          notify?.('error', 'Lỗi đọc file Excel', 'Không thể đọc dữ liệu trong file.');
        }
      };

      reader.readAsArrayBuffer(file);
    });

    e.target.value = '';
  };

  const handleCreate = async () => {
    const valid = createRows.filter((r) => r.name.trim());

    if (!valid.length) {
      notify?.('warning', 'Thiếu tên giáo viên', 'Nhập ít nhất một tên giáo viên trước khi tạo.');
      return;
    }

    setCreating(true);
    setCreateResults(null);

    try {
      const res = await adminApi.createTeachers(valid);
      setCreateResults(res.data?.results || []);
      notify?.('success', 'Tạo tài khoản giáo viên thành công', `Đã xử lý ${res.data?.results?.length || 0} tài khoản.`);
      setCreateRows([{ name: '', subject: 'Tiếng Anh' }]);
      loadTeachers();
    } catch (err) {
      notify?.('error', 'Tạo tài khoản giáo viên thất bại', err?.response?.data?.message || 'Không thể tạo tài khoản.');
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (t) => {
    setEditTarget(t);
    setEditForm({ name: t.name || '', subject: t.subject || '' });
  };

  const handleEdit = async () => {
    if (!editTarget) return;

    if (!editForm.name.trim()) {
      notify?.('warning', 'Thiếu tên giáo viên', 'Vui lòng nhập họ tên giáo viên.');
      return;
    }

    setEditing(true);

    try {
      await adminApi.updateTeacher(editTarget.id, editForm);
      notify?.('success', 'Cập nhật giáo viên thành công', `Thông tin "${editForm.name}" đã được lưu.`);
      setEditTarget(null);
      loadTeachers();
    } catch (err) {
      notify?.('error', 'Cập nhật giáo viên thất bại', err?.response?.data?.message || 'Không thể cập nhật.');
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      const name = deleteTarget.name;
      await adminApi.deleteTeacher(deleteTarget.id);
      notify?.('success', 'Xóa giáo viên thành công', `Tài khoản "${name}" đã được xóa.`);
      setDeleteTarget(null);
      loadTeachers();
    } catch (err) {
      notify?.('error', 'Xóa giáo viên thất bại', err?.response?.data?.message || 'Không thể xóa tài khoản.');
    } finally {
      setDeleting(false);
    }
  };

  const copyResults = () => {
    if (!createResults) return;

    navigator.clipboard
      .writeText(
        createResults
          .filter((r) => !r.skipped)
          .map((r) => `${r.name}\t${r.email}\t${r.password}`)
          .join('\n'),
      )
      .then(() => notify?.('success', 'Đã copy danh sách', 'Thông tin tài khoản đã được sao chép.'))
      .catch(() => notify?.('error', 'Copy thất bại', 'Không thể sao chép dữ liệu.'));
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontWeight: 900, color: '#1e3a8a', fontSize: '1.15rem' }}>
          Danh sách giáo viên ({teachers.length})
        </div>

        <button
          onClick={() => {
            setShowCreate(true);
            setCreateResults(null);
            setCreateRows([{ name: '', subject: 'Tiếng Anh' }]);
          }}
          style={{
            padding: '13px 20px', borderRadius: 12, border: 'none', background: '#1d4ed8',
            color: '#fff', fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem',
          }}
        >
          Tạo tài khoản giáo viên
        </button>
      </div>

      <div style={S.tableCard}>
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                {['#', 'Họ và tên', 'Email', 'Môn dạy', 'Username', 'Thao tác'].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={S.loadingCell}>Đang tải dữ liệu...</td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={S.emptyCell}>Chưa có giáo viên nào.</td>
                </tr>
              ) : (
                teachers.map((t, i) => (
                  <tr key={t.id}>
                    <td style={{ ...S.td, ...S.index }}>{i + 1}</td>
                    <td style={{ ...S.td, fontWeight: 900 }}>{t.name || '—'}</td>
                    <td style={S.td}><span style={S.muted}>{t.email || '—'}</span></td>
                    <td style={S.td}>{t.subject || <span style={S.muted}>—</span>}</td>
                    <td style={S.td}><span style={S.muted}>{t.username || '—'}</span></td>
                    <td style={S.td}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(t)} style={smallButton('blue')}>Sửa</button>
                        <button onClick={() => setDeleteTarget(t)} style={smallButton('red')}>Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && setShowCreate(false)}>
          <div style={S.modal}>
            <ModalHead title="Tạo tài khoản giáo viên" onClose={() => setShowCreate(false)} />

            <div style={{ marginBottom: 16, padding: '13px 15px', background: '#eff6ff', borderRadius: 12, color: '#1d4ed8', fontWeight: 800 }}>
              Mật khẩu mặc định: <code style={{ background: '#dbeafe', padding: '4px 8px', borderRadius: 6 }}>GiaoVien@TCA123</code>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <button onClick={downloadTemplate} style={smallButton('green')}>Tải Excel mẫu</button>
              <button onClick={() => xlsxRef.current?.click()} style={smallButton('purple')}>Import Excel</button>
              <input ref={xlsxRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={handleXlsx} />
            </div>

            <div style={{ overflowX: 'auto', marginBottom: 16 }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    {['#', 'Họ và tên', 'Môn dạy', 'Email xem trước', ''].map((h) => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {createRows.map((r, i) => (
                    <tr key={i}>
                      <td style={{ ...S.td, ...S.index }}>{i + 1}</td>

                      <td style={S.td}>
                        <input
                          style={{ ...inp, width: 260 }}
                          placeholder="Nguyễn Thị Dương"
                          value={r.name}
                          onChange={(e) =>
                            setCreateRows((prev) =>
                              prev.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x),
                            )
                          }
                        />
                      </td>

                      <td style={S.td}>
                        <input
                          style={{ ...inp, width: 180 }}
                          placeholder="Tiếng Anh"
                          value={r.subject}
                          onChange={(e) =>
                            setCreateRows((prev) =>
                              prev.map((x, idx) => idx === i ? { ...x, subject: e.target.value } : x),
                            )
                          }
                        />
                      </td>

                      <td style={S.td}>
                        <span style={{ ...S.muted, fontFamily: 'monospace' }}>
                          {r.name ? previewTeacherEmail(r.name) : '—'}
                        </span>
                      </td>

                      <td style={S.td}>
                        {createRows.length > 1 && (
                          <button
                            onClick={() => setCreateRows((prev) => prev.filter((_, idx) => idx !== i))}
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 900, fontSize: '1.4rem' }}
                          >
                            ×
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: createResults ? 22 : 0 }}>
              <button onClick={() => setCreateRows((p) => [...p, { name: '', subject: 'Tiếng Anh' }])} style={smallButton('gray')}>
                Thêm dòng
              </button>

              <button onClick={handleCreate} disabled={creating} style={{ ...smallButton('blue'), background: creating ? '#93c5fd' : '#1d4ed8', color: '#fff' }}>
                {creating ? 'Đang tạo...' : 'Tạo tài khoản'}
              </button>
            </div>

            {createResults && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: 900, color: '#047857' }}>Kết quả ({createResults.length})</span>
                  <button onClick={copyResults} style={smallButton('gray')}>Copy tất cả</button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        {['Tên', 'Email', 'Mật khẩu', 'Trạng thái'].map((h) => (
                          <th key={h} style={S.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {createResults.map((r, i) => (
                        <tr key={i}>
                          <td style={{ ...S.td, fontWeight: 900 }}>{r.name}</td>
                          <td style={S.td}><code>{r.email}</code></td>
                          <td style={S.td}>{r.skipped ? '—' : <code>{r.password}</code>}</td>
                          <td style={S.td}>
                            {r.skipped ? <span style={S.badge('warning')}>{r.reason}</span> : <span style={S.badge('success')}>Đã tạo</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {editTarget && (
        <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && setEditTarget(null)}>
          <div style={{ ...S.modal, maxWidth: 560 }}>
            <ModalHead title="Chỉnh sửa giáo viên" onClose={() => setEditTarget(null)} />

            <Field label="Họ và tên">
              <input
                style={{ ...inp, width: '100%', boxSizing: 'border-box' }}
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>

            <Field label="Môn dạy">
              <input
                style={{ ...inp, width: '100%', boxSizing: 'border-box' }}
                value={editForm.subject}
                onChange={(e) => setEditForm((f) => ({ ...f, subject: e.target.value }))}
              />
            </Field>

            <div style={{ marginBottom: 22, padding: '12px 14px', background: '#f8fafc', borderRadius: 10, color: '#64748b' }}>
              Email: <code>{editTarget.email}</code>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditTarget(null)} style={smallButton('gray')}>Hủy</button>
              <button onClick={handleEdit} disabled={editing} style={{ ...smallButton('blue'), background: editing ? '#93c5fd' : '#1d4ed8', color: '#fff' }}>
                {editing ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        danger
        loading={deleting}
        title="Xóa tài khoản giáo viên?"
        message={`Bạn sắp xóa tài khoản "${deleteTarget?.name || ''}". Hành động này không thể hoàn tác.`}
        confirmText="Xóa tài khoản"
        cancelText="Giữ lại"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

const EMPTY_STUDENT = () => ({ name: '', dob: '', email: '', password: '12345678a' });

function formatDobInput(raw) {
  const d = raw.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return d.slice(0, 2) + '/' + d.slice(2);
  return d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4);
}

function StudentsTab({ notify }) {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [rows, setRows] = useState([EMPTY_STUDENT()]);
  const [creating, setCreating] = useState(false);
  const [results, setResults] = useState(null);
  const [pasteText, setPasteText] = useState('');
  const [showPaste, setShowPaste] = useState(false);
  const xlsxRef = useRef(null);

  useEffect(() => {
    adminApi
      .getClassrooms()
      .then((res) => setClassrooms(res.data?.classrooms || []))
      .catch(() => notify?.('error', 'Tải danh sách lớp thất bại', 'Không thể lấy dữ liệu lớp học.'));
  }, [notify]);

  const selectedClassObj = classrooms.find((c) => c.id === selectedClass);
  const setRow = (i, field, val) => setRows((prev) => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  const addRow = () => setRows((prev) => [...prev, EMPTY_STUDENT()]);
  const removeRow = (i) => setRows((prev) => prev.filter((_, idx) => idx !== i));

  const downloadStudentTemplate = () => {
    import('xlsx').then((XLSX) => {
      const data = [['Họ và tên', 'Ngày sinh (dd/mm/yyyy)'], ['Nguyễn Văn An', '05/03/2015'], ['Trần Thị Bích', '12/07/2015']];
      const ws = XLSX.utils.aoa_to_sheet(data);
      ws['!cols'] = [{ wch: 32 }, { wch: 22 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'HocSinh');
      XLSX.writeFile(wb, 'mau_hoc_sinh.xlsx');
    });
  };

  const handleXlsx = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    import('xlsx').then((XLSX) => {
      const reader = new FileReader();

      reader.onload = (ev) => {
        try {
          const wb = XLSX.read(new Uint8Array(ev.target.result), { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rowsData = XLSX.utils.sheet_to_json(ws, { header: 1 });

          const parsed = rowsData
            .slice(1)
            .filter((r) => r[0])
            .map((r) => {
              const name = String(r[0]).trim();
              const dob = String(r[1] || '').trim();

              return {
                name,
                dob,
                email: previewStudentEmail(name, dob),
                password: '12345678a',
              };
            });

          if (parsed.length) {
            setRows(parsed);
            notify?.('success', 'Import Excel thành công', `Đã đọc ${parsed.length} học sinh từ file Excel.`);
          } else {
            notify?.('warning', 'Không đọc được dữ liệu', 'Kiểm tra lại định dạng file Excel.');
          }
        } catch {
          notify?.('error', 'Lỗi đọc file Excel', 'Không thể đọc dữ liệu trong file.');
        }
      };

      reader.readAsArrayBuffer(file);
    });

    e.target.value = '';
  };

  const parsePaste = () => {
    const parsed = pasteText
      .trim()
      .split('\n')
      .filter((l) => l.trim())
      .map((line) => {
        const p = line.split(/[\t,;]+/).map((s) => s.trim());
        const name = p[0] || '';
        const dob = p[1] || '';

        return {
          name,
          dob,
          email: previewStudentEmail(name, dob),
          password: '12345678a',
        };
      })
      .filter((r) => r.name);

    if (parsed.length) {
      setRows(parsed);
      setShowPaste(false);
      setPasteText('');
      notify?.('success', 'Nhập danh sách thành công', `Đã nhập ${parsed.length} học sinh.`);
    } else {
      notify?.('warning', 'Không đọc được dữ liệu', 'Mỗi dòng cần có dạng: Họ tên [tab] ngày sinh.');
    }
  };

  const handleCreate = async () => {
    if (!selectedClass) {
      notify?.('warning', 'Chưa chọn lớp', 'Vui lòng chọn lớp trước khi tạo tài khoản học sinh.');
      return;
    }

    const valid = rows
      .filter((r) => r.name.trim())
      .map((r) => ({
        name: r.name.trim(),
        dob: r.dob.trim(),
        email: r.email.trim() || previewStudentEmail(r.name, r.dob),
        password: r.password.trim() || '12345678a',
      }));

    if (!valid.length) {
      notify?.('warning', 'Thiếu học sinh', 'Nhập ít nhất một học sinh trước khi tạo tài khoản.');
      return;
    }

    setCreating(true);
    setResults(null);

    try {
      const res = await adminApi.createStudents(valid, selectedClass, selectedClassObj?.name || '');
      setResults(res.data?.results || []);
      notify?.('success', 'Tạo tài khoản học sinh thành công', `Đã xử lý ${res.data?.results?.length || 0} học sinh.`);
      setRows([EMPTY_STUDENT()]);
    } catch (err) {
      notify?.('error', 'Tạo tài khoản học sinh thất bại', err?.response?.data?.message || 'Không thể tạo tài khoản.');
    } finally {
      setCreating(false);
    }
  };

  const copyAll = () => {
    if (!results) return;

    navigator.clipboard
      .writeText(
        results
          .filter((r) => !r.skipped)
          .map((r) => `${r.name}\t${r.dob}\t${r.email}\t${r.password}`)
          .join('\n'),
      )
      .then(() => notify?.('success', 'Đã copy danh sách', 'Thông tin tài khoản học sinh đã được sao chép.'))
      .catch(() => notify?.('error', 'Copy thất bại', 'Không thể sao chép dữ liệu.'));
  };

  const miniBtn = (tone = 'gray') => {
    const m = {
      green: ['#ecfdf5', '#059669', '#047857'],
      purple: ['#f5f3ff', '#7c3aed', '#6d28d9'],
      gray: ['#f8fafc', '#94a3b8', '#475569'],
      blue: ['#eff6ff', '#1d4ed8', '#1d4ed8'],
    };

    const c = m[tone] || m.gray;

    return {
      padding: '11px 15px', borderRadius: 11, border: `1px solid ${c[1]}`, background: c[0],
      fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', color: c[2], fontSize: '.95rem',
    };
  };

  return (
    <>
      <div style={S.controlsCard}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 900, marginBottom: 10, color: '#1e3a8a', fontSize: '1.1rem' }}>
            Chọn lớp
          </div>

          <select style={{ ...inp, minWidth: 320 }} value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">— Chọn lớp —</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.teacherName ? ` (${c.teacherName})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <button onClick={downloadStudentTemplate} style={miniBtn('green')}>Tải Excel mẫu</button>
          <button onClick={() => xlsxRef.current?.click()} style={miniBtn('purple')}>Import Excel</button>
          <input ref={xlsxRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={handleXlsx} />
          <button onClick={() => setShowPaste((v) => !v)} style={miniBtn('gray')}>Dán từ Excel</button>
        </div>

        {showPaste && (
          <div style={{ marginBottom: 16 }}>
            <textarea
              rows={5}
              style={{ ...inp, width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'Consolas, monospace', lineHeight: 1.6 }}
              placeholder={'Nguyễn Văn An\t05/03/2015\nTrần Thị Bích\t12/07/2015\n...'}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />

            <button onClick={parsePaste} style={{ ...miniBtn('blue'), marginTop: 10, background: '#0369a1', color: '#fff', border: 'none' }}>
              Nhập danh sách
            </button>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ ...S.table, marginBottom: 16 }}>
            <thead>
              <tr>
                {['#', 'Họ và tên', 'Ngày sinh', 'Email xem trước', 'Mật khẩu', ''].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...S.td, ...S.index }}>{i + 1}</td>

                  <td style={S.td}>
                    <input
                      style={{ ...inp, width: 240 }}
                      placeholder="Nguyễn Văn An"
                      value={r.name}
                      onChange={(e) => setRow(i, 'name', e.target.value)}
                    />
                  </td>

                  <td style={S.td}>
                    <input
                      style={{ ...inp, width: 170 }}
                      placeholder="05/03/2015"
                      value={r.dob}
                      onChange={(e) => setRow(i, 'dob', formatDobInput(e.target.value))}
                    />
                  </td>

                  <td style={S.td}>
                    <input
                      style={{ ...inp, width: 270, fontFamily: 'Consolas, monospace', fontSize: '.94rem' }}
                      placeholder={previewStudentEmail(r.name, r.dob) || 'email@gmail.com'}
                      value={r.email}
                      onChange={(e) => setRow(i, 'email', e.target.value)}
                    />
                  </td>

                  <td style={S.td}>
                    <input
                      style={{ ...inp, width: 160, fontFamily: 'Consolas, monospace', fontSize: '.94rem' }}
                      placeholder="12345678a"
                      value={r.password}
                      onChange={(e) => setRow(i, 'password', e.target.value)}
                    />
                  </td>

                  <td style={S.td}>
                    {rows.length > 1 && (
                      <button
                        onClick={() => removeRow(i)}
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 900, fontSize: '1.4rem' }}
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={addRow} style={miniBtn('gray')}>Thêm dòng</button>

          <button
            onClick={handleCreate}
            disabled={creating}
            style={{ ...miniBtn('blue'), background: creating ? '#93c5fd' : '#1d4ed8', color: '#fff' }}
          >
            {creating ? 'Đang tạo...' : `Tạo tài khoản${selectedClassObj ? ` (${selectedClassObj.name})` : ''}`}
          </button>
        </div>
      </div>

      {results && (
        <div style={S.tableCard}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 900, color: '#1e3a8a', fontSize: '1.1rem' }}>
              Kết quả ({results.length})
            </span>

            <button onClick={copyAll} style={miniBtn('gray')}>Copy tất cả</button>
          </div>

          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  {['Tên', 'Ngày sinh', 'Lớp', 'Email', 'Mật khẩu', 'Trạng thái'].map((h) => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {results.map((r, i) => (
                  <tr key={i}>
                    <td style={{ ...S.td, fontWeight: 900 }}>{r.name}</td>
                    <td style={S.td}>{r.dob || '—'}</td>
                    <td style={S.td}>{r.classroomName || '—'}</td>
                    <td style={S.td}><code>{r.email}</code></td>
                    <td style={S.td}>{r.skipped ? '—' : <code>{r.password}</code>}</td>
                    <td style={S.td}>
                      {r.skipped ? <span style={S.badge('warning')}>{r.reason}</span> : <span style={S.badge('success')}>Đã tạo</span>}
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

const GE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Nunito:wght@400;600;700;800;900&display=swap');
.ge-editor{border:1px solid #cbd5e1;border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 10px 26px rgba(15,23,42,.08)}
.ge-toolbar{position:sticky;top:0;z-index:20;display:flex;gap:7px;padding:10px;background:#f8fafc;border-bottom:1px solid #dbe4ef;flex-wrap:wrap;align-items:center}
.ge-btn,.ge-sel{height:40px;border:1px solid #cbd5e1;border-radius:10px;background:#fff;color:#334155;font-weight:850;font-size:1rem;font-family:inherit;cursor:pointer}
.ge-btn{min-width:40px;padding:0 12px}.ge-sel{padding:0 10px}.ge-sep{width:1px;height:28px;background:#dbe4ef;margin:0 3px}
.ge-content{height:430px;overflow:auto;padding:24px 28px;outline:none;font-size:1.28rem;line-height:1.85;color:#0f172a;font-family:'Baloo 2','Nunito','Inter','Segoe UI',sans-serif;background:#fff}
.ge-content h1{font-size:2.35rem;line-height:1.25;margin:20px 0 12px;color:#0f172a;font-weight:900}
.ge-content h2{font-size:1.9rem;line-height:1.3;margin:18px 0 10px;color:#1d4ed8;font-weight:900}
.ge-content h3{font-size:1.55rem;line-height:1.35;margin:16px 0 10px;color:#334155;font-weight:850}
.ge-content p{margin:10px 0}.ge-content ul,.ge-content ol{padding-left:38px;margin:12px 0}.ge-content li{margin:7px 0}
.ge-content table{border-collapse:collapse;width:100%;margin:18px 0;font-size:1.08rem;table-layout:fixed;background:#fff}
.ge-content th,.ge-content td{border:2px solid #cbd5e1;padding:12px 14px;text-align:left;word-break:break-word;overflow-wrap:break-word}
.ge-content th{background:#eff6ff;color:#1e3a8a;font-weight:900}.ge-content tr:nth-child(even) td{background:#f8fafc}
.ge-content blockquote{border-left:6px solid #2563eb;margin:18px 0;padding:14px 18px;background:#eff6ff;border-radius:0 14px 14px 0;color:#334155;font-weight:750}
.ge-content hr{border:none;border-top:2px solid #e2e8f0;margin:22px 0}
.rt-img{position:relative;display:block;width:70%;max-width:100%;min-width:90px;min-height:60px;resize:both;overflow:hidden;margin:18px auto;border-radius:12px;line-height:0;border:3px solid transparent;cursor:pointer;background:#fff}
.rt-img img{width:100%;height:100%;display:block;border-radius:10px;object-fit:contain;pointer-events:none}
.rt-img.selected{border-color:#2563eb;box-shadow:0 0 0 5px rgba(37,99,235,.16)}
.rt-img.selected::after{content:'';position:absolute;right:0;bottom:0;width:18px;height:18px;background:#2563eb;border-radius:8px 0 8px 0;cursor:nwse-resize}
.ge-content > img{max-width:100%;width:70%;height:auto;display:block;margin:18px auto;border-radius:12px;cursor:pointer}
`;

const FONT_FAMILIES = [
  ['Baloo 2', "'Baloo 2', cursive"],
  ['Nunito', "'Nunito', sans-serif"],
  ['Inter', "'Inter','Segoe UI',sans-serif"],
  ['Arial', 'Arial,sans-serif'],
  ['Times', "'Times New Roman',serif"],
  ['Georgia', 'Georgia,serif'],
  ['Verdana', 'Verdana,sans-serif'],
  ['Courier', "'Courier New',monospace"],
];

const FONT_SIZES = [
  '8px', '9px', '10px', '11px', '12px', '13px', '14px', '15px',
  '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px',
  '32px', '36px', '40px', '42px', '48px', '56px', '64px', '72px',
];

function RichTextEditor({ value, onChange, onUploadImage, notify }) {
  const editorRef = useRef(null);
  const fileRef = useRef(null);
  const savedRangeRef = useRef(null);
  const [showHtml, setShowHtml] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImgWrap, setSelectedImgWrap] = useState(null);

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = value || '';
  }, [value]);

  const updateContent = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const saveSel = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0).cloneRange();
  };

  const restoreSel = () => {
    if (!savedRangeRef.current) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRangeRef.current);
  };

  const exec = (cmd, val = null) => {
    if (showHtml) return;
    editorRef.current.focus();
    restoreSel();
    document.execCommand(cmd, false, val);
    updateContent();
  };

  const insertHTML = (html) => {
    if (showHtml) return;
    editorRef.current.focus();
    restoreSel();
    document.execCommand('insertHTML', false, html);
    updateContent();
  };

  const setFontSize = (px) => {
    editorRef.current.focus();
    restoreSel();
    document.execCommand('fontSize', false, '7');
    editorRef.current.querySelectorAll('font[size="7"]').forEach((el) => {
      const span = document.createElement('span');
      span.style.fontSize = px;
      span.innerHTML = el.innerHTML;
      el.parentNode.replaceChild(span, el);
    });
    updateContent();
  };

  const getCell = () => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return null;
    let node = sel.anchorNode;
    if (node?.nodeType === 3) node = node.parentElement;
    return node?.closest?.('td,th') || null;
  };

  const insertTable = () => {
    let html = '<table><thead><tr>';
    for (let c = 0; c < 3; c += 1) html += `<th>Tiêu đề ${c + 1}</th>`;
    html += '</tr></thead><tbody>';

    for (let r = 1; r < 3; r += 1) {
      html += '<tr>';
      for (let c = 0; c < 3; c += 1) html += '<td>Nội dung</td>';
      html += '</tr>';
    }

    html += '</tbody></table><p><br/></p>';
    insertHTML(html);
    notify?.('success', 'Chèn bảng thành công', 'Bảng 3 x 3 đã được thêm vào nội dung.');
  };

  const tableAction = (type) => {
    const cell = getCell();

    if (!cell) {
      notify?.('warning', 'Chưa chọn ô trong bảng', 'Bạn cần đặt con trỏ vào một ô trong bảng trước.');
      return;
    }

    const row = cell.parentElement;
    const table = cell.closest('table');
    const idx = cell.cellIndex;

    if (type === 'row+') {
      const clone = row.cloneNode(true);
      Array.from(clone.cells).forEach((c) => {
        c.innerHTML = '&nbsp;';
      });
      row.parentNode.insertBefore(clone, row.nextSibling);
      notify?.('success', 'Đã thêm hàng', 'Một hàng mới đã được thêm vào bảng.');
    }

    if (type === 'col+') {
      Array.from(table.rows).forEach((r) => {
        const c = r.insertCell(idx + 1);
        c.innerHTML = '&nbsp;';
      });
      notify?.('success', 'Đã thêm cột', 'Một cột mới đã được thêm vào bảng.');
    }

    if (type === 'row-') {
      row.remove();
      notify?.('success', 'Đã xóa hàng', 'Hàng đã chọn đã được xóa.');
    }

    if (type === 'col-') {
      Array.from(table.rows).forEach((r) => r.cells[idx] && r.deleteCell(idx));
      notify?.('success', 'Đã xóa cột', 'Cột đã chọn đã được xóa.');
    }

    if (type === 'del') {
      table.remove();
      notify?.('success', 'Đã xóa bảng', 'Bảng đã được xóa khỏi nội dung.');
    }

    updateContent();
  };

  const imageAction = (type) => {
    if (!selectedImgWrap) {
      notify?.('warning', 'Chưa chọn ảnh', 'Bạn hãy bấm vào ảnh trước khi căn chỉnh hoặc xóa ảnh.');
      return;
    }

    selectedImgWrap.style.display = 'block';

    if (type === 'left') {
      selectedImgWrap.style.marginLeft = '0';
      selectedImgWrap.style.marginRight = 'auto';
    }

    if (type === 'center') {
      selectedImgWrap.style.marginLeft = 'auto';
      selectedImgWrap.style.marginRight = 'auto';
    }

    if (type === 'right') {
      selectedImgWrap.style.marginLeft = 'auto';
      selectedImgWrap.style.marginRight = '0';
    }

    if (['25', '50', '75', '100'].includes(type)) {
      selectedImgWrap.style.width = `${type}%`;
      selectedImgWrap.style.height = 'auto';
    }

    if (type === 'del') {
      selectedImgWrap.remove();
      setSelectedImgWrap(null);
      notify?.('success', 'Đã xóa ảnh', 'Ảnh đã được xóa khỏi nội dung.');
    } else {
      notify?.('success', 'Đã chỉnh ảnh', 'Căn chỉnh ảnh đã được áp dụng.');
    }

    selectedImgWrap.style.marginTop = '18px';
    selectedImgWrap.style.marginBottom = '18px';
    updateContent();
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();

    reader.onload = async (ev) => {
      try {
        const url = await onUploadImage(ev.target.result);
        insertHTML(`
          <div class="rt-img" contenteditable="false" style="width:70%;height:auto;margin:18px auto;">
            <img src="${url}" alt="" />
          </div><p><br/></p>
        `);
        notify?.('success', 'Chèn ảnh thành công', 'Ảnh đã được thêm vào nội dung bài học.');
      } catch {
        notify?.('error', 'Tải ảnh thất bại', 'Không thể upload ảnh. Kiểm tra Firebase Storage hoặc API upload ảnh.');
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const onEditorClick = (e) => {
    if (!editorRef.current) return;

    editorRef.current
      .querySelectorAll('.rt-img.selected')
      .forEach((x) => x.classList.remove('selected'));

    let wrap = e.target.closest?.('.rt-img');

    if (!wrap && e.target.tagName === 'IMG') {
      const img = e.target;
      const box = document.createElement('div');

      box.className = 'rt-img';
      box.setAttribute('contenteditable', 'false');

      const imgWidth = img.style.width || img.getAttribute('width');
      const naturalWidth = img.naturalWidth || 600;
      const editorWidth = editorRef.current.clientWidth || 900;

      let percent = 70;

      if (imgWidth && String(imgWidth).includes('%')) {
        percent = parseInt(imgWidth, 10) || 70;
      } else if (imgWidth && !Number.isNaN(Number.parseInt(imgWidth, 10))) {
        percent = Math.min(100, Math.round((Number.parseInt(imgWidth, 10) / editorWidth) * 100));
      } else if (naturalWidth) {
        percent = Math.min(100, Math.round((naturalWidth / editorWidth) * 100));
      }

      box.style.width = `${percent}%`;
      box.style.height = 'auto';
      box.style.margin = img.style.margin || '18px auto';

      img.removeAttribute('width');
      img.removeAttribute('height');
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.display = 'block';
      img.style.objectFit = 'contain';

      img.parentNode.insertBefore(box, img);
      box.appendChild(img);

      wrap = box;
      updateContent();
    }

    if (wrap) {
      wrap.classList.add('selected');
      setSelectedImgWrap(wrap);
    } else {
      setSelectedImgWrap(null);
    }
  };

  return (
    <div className="ge-editor">
      <style>{GE_CSS}</style>

      <div className="ge-toolbar">
        <select className="ge-sel" defaultValue="" onChange={(e) => {
          if (e.target.value) exec('fontName', e.target.value);
          e.target.value = '';
        }}>
          <option value="" disabled>Font</option>
          {FONT_FAMILIES.map(([label, val]) => (
            <option key={label} value={val}>{label}</option>
          ))}
        </select>

        <select className="ge-sel" defaultValue="" onChange={(e) => {
          if (e.target.value) setFontSize(e.target.value);
          e.target.value = '';
        }}>
          <option value="" disabled>Size</option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select className="ge-sel" defaultValue="" onChange={(e) => {
          if (e.target.value) exec('formatBlock', e.target.value);
          e.target.value = '';
        }}>
          <option value="" disabled>Đoạn</option>
          <option value="P">Text</option>
          <option value="H1">H1</option>
          <option value="H2">H2</option>
          <option value="H3">H3</option>
        </select>

        <span className="ge-sep" />
        <button className="ge-btn" title="Đậm" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('bold')}><b>B</b></button>
        <button className="ge-btn" title="Nghiêng" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('italic')}><i>I</i></button>
        <button className="ge-btn" title="Gạch chân" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('underline')}><u>U</u></button>
        <button className="ge-btn" title="Gạch ngang" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('strikeThrough')}><s>S</s></button>

        <span className="ge-sep" />
        <button className="ge-btn" title="Căn trái" onClick={() => exec('justifyLeft')}>↤</button>
        <button className="ge-btn" title="Căn giữa" onClick={() => exec('justifyCenter')}>↔</button>
        <button className="ge-btn" title="Căn phải" onClick={() => exec('justifyRight')}>↦</button>
        <button className="ge-btn" title="Căn đều" onClick={() => exec('justifyFull')}>☰</button>

        <span className="ge-sep" />
        <button className="ge-btn" title="Danh sách" onClick={() => exec('insertUnorderedList')}>•</button>
        <button className="ge-btn" title="Số thứ tự" onClick={() => exec('insertOrderedList')}>1.</button>
        <button className="ge-btn" title="Thụt lề" onClick={() => exec('indent')}>⇥</button>
        <button className="ge-btn" title="Bỏ thụt" onClick={() => exec('outdent')}>⇤</button>

        <label className="ge-btn" title="Màu chữ" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          A
          <input type="color" onMouseDown={saveSel} onChange={(e) => exec('foreColor', e.target.value)} style={{ width: 22, height: 24, border: 'none', padding: 0 }} />
        </label>

        <label className="ge-btn" title="Tô nền" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          ▧
          <input type="color" onMouseDown={saveSel} onChange={(e) => exec('hiliteColor', e.target.value)} style={{ width: 22, height: 24, border: 'none', padding: 0 }} />
        </label>

        <select className="ge-sel" defaultValue="" onChange={(e) => {
          if (e.target.value === 'table') insertTable();
          if (e.target.value === 'img') fileRef.current?.click();
          if (e.target.value === 'quote') exec('formatBlock', 'BLOCKQUOTE');
          if (e.target.value === 'hr') insertHTML('<hr/><p><br/></p>');
          e.target.value = '';
        }}>
          <option value="" disabled>Chèn</option>
          <option value="img">{uploading ? 'Đang tải ảnh...' : 'Ảnh'}</option>
          <option value="table">Bảng 3x3</option>
          <option value="quote">Trích dẫn</option>
          <option value="hr">Đường kẻ</option>
        </select>

        <select className="ge-sel" defaultValue="" onChange={(e) => {
          if (e.target.value) tableAction(e.target.value);
          e.target.value = '';
        }}>
          <option value="" disabled>Bảng</option>
          <option value="row+">Thêm hàng</option>
          <option value="col+">Thêm cột</option>
          <option value="row-">Xóa hàng</option>
          <option value="col-">Xóa cột</option>
          <option value="del">Xóa bảng</option>
        </select>

        <select className="ge-sel" defaultValue="" onChange={(e) => {
          if (e.target.value) imageAction(e.target.value);
          e.target.value = '';
        }}>
          <option value="" disabled>Ảnh</option>
          <option value="left">Căn trái</option>
          <option value="center">Căn giữa</option>
          <option value="right">Căn phải</option>
          <option value="25">25%</option>
          <option value="50">50%</option>
          <option value="75">75%</option>
          <option value="100">100%</option>
          <option value="del">Xóa ảnh</option>
        </select>

        <button className="ge-btn" title="HTML" onClick={() => {
          if (showHtml && editorRef.current) editorRef.current.innerHTML = value || '';
          setShowHtml((v) => !v);
        }}>
          {'</>'}
        </button>

        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
      </div>

      <div
        ref={editorRef}
        contentEditable={!showHtml}
        suppressContentEditableWarning
        onInput={updateContent}
        onMouseUp={() => {
          saveSel();
          updateContent();
        }}
        onKeyUp={saveSel}
        onClick={onEditorClick}
        className="ge-content"
        style={{ display: showHtml ? 'none' : 'block' }}
      />

      {showHtml && (
        <textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (editorRef.current) editorRef.current.innerHTML = e.target.value;
          }}
          style={{
            display: 'block', width: '100%', boxSizing: 'border-box', height: 430, padding: '20px 24px',
            border: 'none', resize: 'none', fontFamily: 'Consolas, monospace', fontSize: '1rem',
            lineHeight: 1.7, outline: 'none', color: '#1e293b', background: '#f8fafc',
          }}
        />
      )}
    </div>
  );
}

const GL = ['all', '1', '2', '3', '4', '5'];
const GL_LABEL = { all: 'Tất cả', 1: 'Khối 1', 2: 'Khối 2', 3: 'Khối 3', 4: 'Khối 4', 5: 'Khối 5' };
const MONTHS_G = ['', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

const EMPTY_GL = {
  title: '',
  description: '',
  videoUrl: '',
  content: '',
  gradeLevel: 'all',
  topic: '',
  module: '',
  weekNumber: '',
  month: '',
  year: new Date().getFullYear(),
  exercises: [],
  status: 'published',
};

const EMPTY_EX_G = {
  question: '',
  type: 'mcq',
  options: ['', '', '', ''],
  answer: '',
  explanation: '',
};

const Gs = {
  panel: {
    height: 'calc(100vh - 220px)', minHeight: 650, display: 'grid', gridTemplateColumns: '330px minmax(0,1fr)',
    background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 18px 46px rgba(15,23,42,.16)',
    border: '1px solid #dbeafe',
  },
  side: { minHeight: 0, background: 'linear-gradient(180deg,#0f172a,#111827)', display: 'flex', flexDirection: 'column' },
  sideTop: { flexShrink: 0, padding: 18, borderBottom: '1px solid rgba(255,255,255,.10)' },
  sideList: { flex: 1, minHeight: 0, overflowY: 'auto', paddingTop: 8 },
  add: {
    display: 'block', width: '100%', padding: '14px 16px', background: '#2563eb', color: '#fff',
    border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 900, fontSize: '1rem',
    marginBottom: 12, fontFamily: 'inherit',
  },
  search: {
    width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 11,
    border: '1px solid rgba(255,255,255,.16)', background: 'rgba(255,255,255,.08)',
    color: '#fff', fontSize: '1rem', outline: 'none', fontFamily: 'inherit', fontWeight: 700,
  },
  tab: (a) => ({
    padding: '8px 11px', border: 'none', borderRadius: 9, cursor: 'pointer', fontWeight: 850,
    fontSize: '.9rem', background: a ? '#2563eb' : 'rgba(255,255,255,.10)', color: '#fff',
    marginRight: 6, marginTop: 10, fontFamily: 'inherit',
  }),
  item: (a) => ({
    padding: '15px 18px', cursor: 'pointer', borderLeft: a ? '5px solid #60a5fa' : '5px solid transparent',
    background: a ? 'rgba(37,99,235,.28)' : 'transparent', transition: 'all .12s',
  }),
  itemTitle: { fontSize: '1.02rem', fontWeight: 850, color: '#f8fafc', marginBottom: 6, lineHeight: 1.35 },
  itemMeta: { fontSize: '.9rem', color: '#cbd5e1', lineHeight: 1.45, fontWeight: 650 },
  main: { minHeight: 0, display: 'flex', flexDirection: 'column', background: '#f8fafc' },
  head: {
    flexShrink: 0, padding: '18px 22px', background: '#fff', borderBottom: '1px solid #e2e8f0',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
  },
  title: { fontWeight: 900, color: '#0f172a', fontSize: '1.35rem', lineHeight: 1.3 },
  body: { flex: 1, minHeight: 0, overflowY: 'auto', padding: 22 },
  card: { background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,.08)' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 },
  inp: {
    width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: 11,
    border: '1.5px solid #dbe4ef', fontSize: '1rem', outline: 'none',
    fontFamily: 'inherit', color: '#0f172a', fontWeight: 600,
  },
  ex: { border: '1.5px solid #dbe4ef', borderRadius: 14, padding: 18, marginBottom: 18, background: '#f8fafc' },
  btn: {
    padding: '12px 20px', borderRadius: 11, border: 'none', cursor: 'pointer',
    fontWeight: 900, fontSize: '1rem', background: '#2563eb', color: '#fff', fontFamily: 'inherit',
  },
  del: {
    padding: '12px 18px', borderRadius: 11, border: 'none', cursor: 'pointer',
    fontWeight: 900, fontSize: '1rem', background: '#fee2e2', color: '#b91c1c', fontFamily: 'inherit',
  },
  empty: {
    height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', color: '#64748b', fontSize: '1.15rem', lineHeight: 1.7,
  },
};

function GrammarAdminTab({ notify }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_GL);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [filterGrade, setFilterGrade] = useState('all');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await adminApi.getGrammarLessons();
      setLessons(r.data?.lessons || []);
    } catch {
      notify?.('error', 'Tải bài học thất bại', 'Không thể lấy danh sách bài ngữ pháp.');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    load();
  }, [load]);

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const open = (l) => {
    setSelected(l);
    setIsNew(false);
    setForm({ ...EMPTY_GL, ...l, exercises: l.exercises || [] });
  };

  const newLesson = () => {
    setSelected(null);
    setIsNew(true);
    setForm(EMPTY_GL);
  };

  const save = async () => {
    if (!form.title.trim()) {
      notify?.('warning', 'Thiếu tiêu đề bài học', 'Vui lòng nhập tiêu đề trước khi lưu.');
      return;
    }

    setSaving(true);

    try {
      if (isNew) {
        await adminApi.createGrammarLesson(form);
        notify?.('success', 'Tạo bài học thành công', `Bài "${form.title}" đã được thêm vào hệ thống.`);
        setIsNew(false);
      } else {
        await adminApi.updateGrammarLesson(selected.id, form);
        notify?.('success', 'Lưu thay đổi thành công', `Bài "${form.title}" đã được cập nhật.`);
      }

      await load();
    } catch (err) {
      notify?.('error', 'Lưu bài học thất bại', err?.response?.data?.message || 'Không thể lưu bài học. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const del = () => {
    if (!selected) return;
    setConfirmDelete(true);
  };

  const confirmDeleteLesson = async () => {
    if (!selected) return;

    setDeleting(true);

    try {
      const deletedTitle = selected.title;

      await adminApi.deleteGrammarLesson(selected.id);

      setSelected(null);
      setIsNew(false);
      setForm(EMPTY_GL);
      setConfirmDelete(false);

      notify?.('success', 'Xóa bài học thành công', `Bài "${deletedTitle}" đã được xóa khỏi hệ thống.`);
      await load();
    } catch (err) {
      notify?.('error', 'Xóa bài học thất bại', err?.response?.data?.message || 'Không thể xóa bài học. Vui lòng thử lại.');
    } finally {
      setDeleting(false);
    }
  };

  const upload = async (base64) => {
    const r = await adminApi.uploadGrammarImage(base64);
    const url = r.data?.url;
    if (!url) throw new Error('No URL');
    return url;
  };

  const addEx = (type) =>
    setForm((f) => ({
      ...f,
      exercises: [
        ...f.exercises,
        { ...EMPTY_EX_G, type, options: type === 'mcq' ? ['', '', '', ''] : [] },
      ],
    }));

  const updEx = (i, k, v) =>
    setForm((f) => {
      const exs = [...f.exercises];
      exs[i] = { ...exs[i], [k]: v };
      return { ...f, exercises: exs };
    });

  const updOpt = (i, j, v) =>
    setForm((f) => {
      const exs = [...f.exercises];
      const opts = [...exs[i].options];
      opts[j] = v;
      exs[i] = { ...exs[i], options: opts };
      return { ...f, exercises: exs };
    });

  const rmEx = (i) => {
    setForm((f) => ({ ...f, exercises: f.exercises.filter((_, idx) => idx !== i) }));
    notify?.('success', 'Đã xóa câu hỏi', 'Câu hỏi đã được xóa khỏi bài học. Nhớ bấm Lưu để cập nhật.');
  };

  const getUnitNumber = (lesson) => {
    const text = `${lesson.module || ''} ${lesson.title || ''}`;
    const match = text.match(/unit\s*(\d+)/i);
    return match ? parseInt(match[1], 10) : 999;
  };

  const filtered = lessons
    .filter((l) => {
      const matchGrade = filterGrade === 'all' || l.gradeLevel === filterGrade;
      if (!matchGrade) return false;
      if (!search.trim()) return true;

      const q = search.toLowerCase().trim();

      return (
        (l.title || '').toLowerCase().includes(q) ||
        (l.topic || '').toLowerCase().includes(q) ||
        (l.module || '').toLowerCase().includes(q) ||
        (l.description || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const ga = a.gradeLevel === 'all' ? 99 : parseInt(a.gradeLevel, 10) || 99;
      const gb = b.gradeLevel === 'all' ? 99 : parseInt(b.gradeLevel, 10) || 99;
      if (ga !== gb) return ga - gb;

      const ua = getUnitNumber(a);
      const ub = getUnitNumber(b);
      if (ua !== ub) return ua - ub;

      const wa = parseInt(a.weekNumber, 10) || 0;
      const wb = parseInt(b.weekNumber, 10) || 0;
      if (wa !== wb) return wa - wb;

      return (a.title || '').localeCompare(b.title || '', 'vi', {
        numeric: true,
        sensitivity: 'base',
      });
    });

  return (
    <div style={Gs.panel}>
      <aside style={Gs.side}>
        <div style={Gs.sideTop}>
          <button style={Gs.add} onClick={newLesson}>+ Thêm bài học</button>

          <input
            style={Gs.search}
            placeholder="Tìm bài học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div>
            {GL.map((g) => (
              <button key={g} style={Gs.tab(filterGrade === g)} onClick={() => setFilterGrade(g)}>
                {GL_LABEL[g]}
              </button>
            ))}
          </div>
        </div>

        <div style={Gs.sideList}>
          {loading && <div style={{ color: '#94a3b8', padding: 22, fontSize: '1.05rem' }}>Đang tải...</div>}

          {!loading && !filtered.length && (
            <div style={{ color: '#94a3b8', padding: 22, fontSize: '1.05rem' }}>Không có bài học.</div>
          )}

          {filtered.map((l) => (
            <div key={l.id} style={Gs.item(selected?.id === l.id)} onClick={() => open(l)}>
              <div style={Gs.itemTitle}>
                {l.status === 'published' ? '●' : '○'} {l.title}
              </div>

              <div style={Gs.itemMeta}>
                {GL_LABEL[l.gradeLevel] || l.gradeLevel} · {l.topic || '—'}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main style={Gs.main}>
        <div style={Gs.head}>
          <div style={Gs.title}>
            {isNew ? 'Tạo bài học mới' : selected ? `Chỉnh sửa: ${selected.title}` : 'Quản lý bài học ngữ pháp'}
          </div>

          {(isNew || selected) && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={Gs.btn} onClick={save} disabled={saving}>
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>

              {!isNew && (
                <button style={Gs.del} onClick={del} disabled={deleting}>
                  {deleting ? 'Đang xóa...' : 'Xóa'}
                </button>
              )}
            </div>
          )}
        </div>

        <div style={Gs.body}>
          {!(isNew || selected) ? (
            <div style={Gs.empty}>
              <div>
                <b>Chọn bài học để chỉnh sửa</b>
                <br />
                hoặc nhấn “Thêm bài học” để tạo nội dung mới.
              </div>
            </div>
          ) : (
            <div style={Gs.card}>
              <div style={Gs.grid2}>
                <Field label="Tiêu đề *">
                  <input
                    style={Gs.inp}
                    value={form.title}
                    onChange={(e) => setF('title', e.target.value)}
                    placeholder="VD: Unit 1 – In the school playground"
                  />
                </Field>

                <Field label="Khối lớp">
                  <select style={Gs.inp} value={form.gradeLevel} onChange={(e) => setF('gradeLevel', e.target.value)}>
                    {GL.map((g) => (
                      <option key={g} value={g}>{GL_LABEL[g]}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div style={Gs.grid3}>
                <Field label="Chủ điểm">
                  <input style={Gs.inp} value={form.topic} onChange={(e) => setF('topic', e.target.value)} />
                </Field>

                <Field label="Module">
                  <input style={Gs.inp} value={form.module} onChange={(e) => setF('module', e.target.value)} />
                </Field>

                <Field label="Trạng thái">
                  <select style={Gs.inp} value={form.status} onChange={(e) => setF('status', e.target.value)}>
                    <option value="published">Đã xuất bản</option>
                    <option value="draft">Nháp</option>
                  </select>
                </Field>
              </div>

              <div style={Gs.grid3}>
                <Field label="Tuần">
                  <input style={Gs.inp} type="number" value={form.weekNumber} onChange={(e) => setF('weekNumber', e.target.value)} />
                </Field>

                <Field label="Tháng">
                  <select style={Gs.inp} value={form.month} onChange={(e) => setF('month', e.target.value)}>
                    {MONTHS_G.map((m, i) => (
                      <option key={i} value={i}>{m || '—'}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Năm">
                  <input style={Gs.inp} type="number" value={form.year} onChange={(e) => setF('year', Number(e.target.value))} />
                </Field>
              </div>

              <Field label="Mô tả ngắn">
                <input style={Gs.inp} value={form.description} onChange={(e) => setF('description', e.target.value)} />
              </Field>

              <Field label="URL Video YouTube">
                <input
                  style={Gs.inp}
                  value={form.videoUrl}
                  onChange={(e) => setF('videoUrl', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </Field>

              <Field label="Nội dung lý thuyết">
                <RichTextEditor
                  key={selected?.id || (isNew ? '__new__' : '__empty__')}
                  value={form.content}
                  onChange={(v) => setF('content', v)}
                  onUploadImage={upload}
                  notify={notify}
                />

                <div style={{ fontSize: '1rem', color: '#64748b', marginTop: 10, fontWeight: 650 }}>
                  Chọn ảnh rồi kéo góc xanh của ảnh để đổi kích thước như Word. Chèn bảng sẽ tự tạo bảng 3x3.
                </div>
              </Field>

              <div style={{ height: 1, background: '#e2e8f0', margin: '26px 0' }} />
              <div style={{ ...Gs.title, fontSize: '1.28rem', marginBottom: 14 }}>
                Bài tập ({form.exercises.length})
              </div>

              {form.exercises.map((ex, i) => (
                <div key={i} style={Gs.ex}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
                    <select
                      style={{ ...Gs.inp, width: 170, flex: 'none' }}
                      value={ex.type}
                      onChange={(e) => updEx(i, 'type', e.target.value)}
                    >
                      <option value="mcq">Trắc nghiệm</option>
                      <option value="fill_blank">Điền từ</option>
                    </select>

                    <input
                      style={{ ...Gs.inp, flex: 1 }}
                      placeholder="Câu hỏi..."
                      value={ex.question}
                      onChange={(e) => updEx(i, 'question', e.target.value)}
                    />

                    <button style={Gs.del} onClick={() => rmEx(i)}>Xóa</button>
                  </div>

                  {ex.type === 'mcq' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                      {(ex.options || ['', '', '', '']).map((o, j) => (
                        <input
                          key={j}
                          style={Gs.inp}
                          placeholder={`Đáp án ${j + 1}`}
                          value={o}
                          onChange={(e) => updOpt(i, j, e.target.value)}
                        />
                      ))}
                    </div>
                  )}

                  <div style={Gs.grid2}>
                    <Field label="Đáp án đúng">
                      {ex.type === 'mcq' ? (
                        <select style={Gs.inp} value={ex.answer} onChange={(e) => updEx(i, 'answer', e.target.value)}>
                          <option value="">— Chọn —</option>
                          {(ex.options || []).filter((o) => o.trim()).map((o, j) => (
                            <option key={j} value={o}>{o}</option>
                          ))}
                        </select>
                      ) : (
                        <input style={Gs.inp} value={ex.answer} onChange={(e) => updEx(i, 'answer', e.target.value)} />
                      )}
                    </Field>

                    <Field label="Giải thích">
                      <input style={Gs.inp} value={ex.explanation} onChange={(e) => updEx(i, 'explanation', e.target.value)} />
                    </Field>
                  </div>
                </div>
              ))}

              <button
                style={{ ...Gs.btn, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', marginRight: 10 }}
                onClick={() => addEx('mcq')}
              >
                + Trắc nghiệm
              </button>

              <button
                style={{ ...Gs.btn, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
                onClick={() => addEx('fill_blank')}
              >
                + Điền từ
              </button>
            </div>
          )}
        </div>
      </main>

      <ConfirmDialog
        open={confirmDelete}
        danger
        loading={deleting}
        title="Xóa bài học này?"
        message={`Bạn sắp xóa bài "${selected?.title || ''}". Hành động này không thể hoàn tác.`}
        confirmText="Xóa bài học"
        cancelText="Giữ lại"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={confirmDeleteLesson}
      />
    </div>
  );
}

function AdminUsersPage() {
  useTitle('Quản lý người dùng');

  const userInfo = useSelector((s) => s.userInfo);
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('users');
  const [systemStats, setSystemStats] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = useCallback((type, title, message = '') => {
    setToast({ type, title, message });

    window.clearTimeout(window.__adminToastTimer);
    window.__adminToastTimer = window.setTimeout(() => {
      setToast(null);
    }, 3200);
  }, []);

  const isAdmin = userInfo?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      adminApi.getSystemStats().then((res) => setSystemStats(res.data?.stats)).catch(() => {});
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div style={S.noAccess}>
        <div style={{
          width: 54, height: 54, borderRadius: '50%', background: '#fee2e2', border: '1px solid #fecaca',
          color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: '1.25rem',
        }}>
          !
        </div>

        <div style={{ fontWeight: 900, color: '#374151', fontSize: '1.12rem' }}>
          Chỉ admin mới có thể truy cập trang này.
        </div>

        <button style={S.homeBtn} onClick={() => history.push('/')}>
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <style>
        {`
          @keyframes toastSlide {
            from { opacity: 0; transform: translateX(24px) translateY(-8px); }
            to { opacity: 1; transform: translateX(0) translateY(0); }
          }
        `}
      </style>

      <div style={S.maxW}>
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Quản trị hệ thống</h1>
            <p style={S.subtitle}>
              Quản lý tài khoản, lớp học, giáo viên, học sinh và dữ liệu học tập toàn hệ thống.
            </p>
          </div>

          {systemStats && (
            <div style={S.headerMeta}>{formatNumber(systemStats.totalUsers)} người dùng</div>
          )}
        </div>

        <TabBar active={activeTab} onChange={setActiveTab} />

        {activeTab === 'users' && <UsersTab systemStats={systemStats} notify={notify} />}
        {activeTab === 'classes' && <ClassroomsTab notify={notify} />}
        {activeTab === 'teachers' && <TeachersTab notify={notify} />}
        {activeTab === 'students' && <StudentsTab notify={notify} />}
        {activeTab === 'grammar' && <GrammarAdminTab notify={notify} />}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default AdminUsersPage;