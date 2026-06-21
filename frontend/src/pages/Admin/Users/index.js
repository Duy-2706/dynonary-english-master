import adminApi from 'apis/adminApi';
import { ROUTES } from 'constant';
import useTitle from 'hooks/useTitle';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

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

const ADMIN_MENU = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    desc: 'Tổng quan hệ thống',
    icon: 'dashboard',
  },
  {
    id: 'accounts',
    label: 'Quản lý tài khoản',
    desc: 'Người dùng, giáo viên, học sinh',
    icon: 'users',
  },
  {
    id: 'statistics',
    label: 'Thống kê báo cáo',
    desc: 'Biểu đồ và số liệu vận hành',
    icon: 'chart',
  },
  {
    id: 'systemData',
    label: 'Quản trị dữ liệu',
    desc: 'Lớp học, ngữ pháp, khóa học',
    icon: 'folder',
  },
];

const TABS = ADMIN_MENU;

const getValidTab = (tab) => {
  return ADMIN_MENU.some((item) => item.id === tab) ? tab : 'dashboard';
};

const S = {
  page: {
    minHeight: '100vh',
    background: '#f3f7fb',
    fontFamily: "'Inter','Segoe UI',Roboto,Arial,sans-serif",
    color: '#172033',
  },

  maxW: {
    maxWidth: 1280,
    margin: '0 auto',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 22,
    marginBottom: 24,
    flexWrap: 'wrap',
    background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#0369a1 100%)',
    borderRadius: 20,
    padding: '28px 32px',
    boxShadow: '0 18px 40px rgba(15,23,42,.18)',
  },

  title: {
    fontSize: '2.65rem',
    fontWeight: 950,
    color: '#fff',
    margin: '0 0 12px',
    letterSpacing: '-.03em',
  },

  subtitle: {
    color: '#dbeafe',
    fontSize: '1.18rem',
    margin: 0,
    lineHeight: 1.7,
    fontWeight: 650,
  },

  headerMeta: {
    background: 'rgba(255,255,255,.15)',
    border: '1px solid rgba(255,255,255,.28)',
    borderRadius: 999,
    padding: '10px 18px',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 800,
  },

  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: 18,
    marginBottom: 24,
  },

  statCard: (c = COLORS.blue) => ({
    minHeight: 106,
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderTop: `5px solid ${c}`,
    borderRadius: 16,
    padding: '17px 19px',
    boxShadow: '0 14px 30px rgba(15,23,42,.08)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }),

  statTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
  },

  statLabel: {
    color: '#475569',
    fontSize: '.98rem',
    fontWeight: 850,
    margin: 0,
    lineHeight: 1.35,
  },

  statNum: {
    color: '#0f172a',
    fontSize: '1.95rem',
    fontWeight: 950,
    lineHeight: 1,
    letterSpacing: '-.04em',
  },

  statCode: (c = COLORS.blue) => ({
    width: 42,
    height: 42,
    borderRadius: 11,
    background: `${c}12`,
    border: `1px solid ${c}26`,
    color: c,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '.9rem',
    fontWeight: 900,
  }),

  controlsCard: {
    background: 'rgba(255,255,255,.96)',
    border: '1px solid #dbeafe',
    borderLeft: '6px solid #2563eb',
    borderRadius: 16,
    padding: 18,
    boxShadow: '0 8px 24px rgba(37,99,235,.08)',
    marginBottom: 18,
  },

  controls: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  searchInput: {
    flex: 1,
    minWidth: 280,
    padding: '13px 15px',
    borderRadius: 11,
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
    outline: 'none',
    background: '#fff',
    color: '#111827',
    fontFamily: 'inherit',
  },

  tableCard: {
    background: '#fff',
    border: '1px solid #dbeafe',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 12px 30px rgba(15,23,42,.10)',
  },

  tableWrap: {
    width: '100%',
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '1rem',
  },

  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontWeight: 900,
    fontSize: '1rem',
    color: '#e0f2fe',
    background: '#0f172a',
    borderBottom: '1px solid #1e293b',
    textTransform: 'uppercase',
    letterSpacing: '.035em',
    whiteSpace: 'nowrap',
  },

  td: {
    padding: '15px 16px',
    color: '#374151',
    borderBottom: '1px solid #eef2ff',
    verticalAlign: 'middle',
    background: '#fff',
    fontSize: '1.05rem',
  },

  index: {
    color: '#94a3b8',
    fontWeight: 850,
    width: 52,
  },

  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minWidth: 200,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    objectFit: 'cover',
    background: '#e5e7eb',
    border: '1px solid #e5e7eb',
  },

  avatarFallback: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: '#eff6ff',
    color: '#1d4ed8',
    border: '1px solid #bfdbfe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
  },

  userName: {
    fontWeight: 900,
    color: '#111827',
    lineHeight: 1.3,
    fontSize: '1.02rem',
  },

  lockedText: {
    display: 'block',
    marginTop: 4,
    color: '#b91c1c',
    fontSize: '.84rem',
    fontWeight: 800,
  },

  muted: {
    color: '#64748b',
    fontSize: '.96rem',
  },

  badge: (tone = 'default') => {
    const m = {
      success: ['#ecfdf5', '#047857', '#a7f3d0'],
      info: ['#eff6ff', '#1d4ed8', '#bfdbfe'],
      warning: ['#fffbeb', '#b45309', '#fde68a'],
      danger: ['#fef2f2', '#b91c1c', '#fecaca'],
      neutral: ['#f3f4f6', '#374151', '#e5e7eb'],
      default: ['#f8fafc', '#475569', '#e2e8f0'],
    };

    const c = m[tone] || m.default;

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: c[0],
      color: c[1],
      border: `1px solid ${c[2]}`,
      borderRadius: 999,
      padding: '6px 12px',
      fontSize: '.88rem',
      fontWeight: 900,
      lineHeight: 1,
      whiteSpace: 'nowrap',
    };
  },

  roleSelect: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #cbd5e1',
    fontSize: '.96rem',
    cursor: 'pointer',
    background: '#fff',
    color: '#111827',
    fontFamily: 'inherit',
    fontWeight: 800,
    outline: 'none',
  },

  actionBtn: (locked, disabled) => ({
    padding: '10px 14px',
    borderRadius: 10,
    border: locked ? '1px solid #059669' : '1px solid #dc2626',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 900,
    fontSize: '.92rem',
    background: locked ? '#ecfdf5' : '#fef2f2',
    color: locked ? '#047857' : '#b91c1c',
    opacity: disabled ? .65 : 1,
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  }),

  loadingCell: {
    textAlign: 'center',
    padding: 52,
    color: '#6b7280',
    fontWeight: 800,
    background: '#fff',
    fontSize: '1rem',
  },

  emptyCell: {
    textAlign: 'center',
    padding: 52,
    color: '#64748b',
    fontWeight: 800,
    background: '#fff',
    fontSize: '1rem',
  },

  pagination: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },

  pageBtn: (active) => ({
    minWidth: 42,
    padding: '10px 14px',
    borderRadius: 10,
    border: active ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
    cursor: 'pointer',
    fontWeight: 900,
    fontSize: '.95rem',
    background: active ? '#1d4ed8' : '#fff',
    color: active ? '#fff' : '#374151',
    fontFamily: 'inherit',
  }),

  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,23,42,.64)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 20,
  },

  modal: {
    background: '#fff',
    borderRadius: 22,
    padding: 30,
    maxWidth: 920,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 26px 70px rgba(15,23,42,.32)',
  },

  noAccess: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 16,
    background: '#f5f7fb',
    fontFamily: "'Inter','Segoe UI',Roboto,Arial,sans-serif",
    color: '#172033',
    padding: 24,
    textAlign: 'center',
  },

  homeBtn: {
    padding: '13px 24px',
    borderRadius: 12,
    border: 'none',
    background: '#1d4ed8',
    color: '#fff',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '1rem',
  },

  toastWrap: {
    position: 'fixed',
    top: 24,
    right: 24,
    zIndex: 99999,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    pointerEvents: 'none',
  },

  toastBox: (type = 'success') => {
    const c = {
      success: ['#ecfdf5', '#10b981', '#047857'],
      error: ['#fef2f2', '#ef4444', '#b91c1c'],
      warning: ['#fffbeb', '#f59e0b', '#92400e'],
      info: ['#eff6ff', '#2563eb', '#1d4ed8'],
    }[type] || ['#ecfdf5', '#10b981', '#047857'];

    return {
      width: 380,
      maxWidth: 'calc(100vw - 40px)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
      padding: '16px 18px',
      borderRadius: 18,
      background: c[0],
      border: `2px solid ${c[1]}`,
      color: c[2],
      boxShadow: '0 18px 44px rgba(15,23,42,.22)',
      pointerEvents: 'auto',
      animation: 'toastSlide .22s ease-out',
    };
  },

  toastIcon: (type = 'success') => {
    const bg = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#2563eb',
    }[type] || '#10b981';

    return {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: bg,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 900,
      flexShrink: 0,
      boxShadow: '0 6px 14px rgba(15,23,42,.16)',
    };
  },

  confirmBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,23,42,.58)',
    zIndex: 99998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  confirmBox: {
    width: 480,
    maxWidth: 'calc(100vw - 40px)',
    background: '#fff',
    borderRadius: 24,
    padding: 30,
    boxShadow: '0 28px 80px rgba(15,23,42,.34)',
    border: '1px solid #e2e8f0',
  },

  sectionHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 18,
    flexWrap: 'wrap',
  },

  sectionTitle: {
    margin: '0 0 8px',
    fontSize: '2rem',
    fontWeight: 950,
    color: '#0f172a',
    letterSpacing: '-.03em',
  },

  sectionSub: {
    margin: 0,
    color: '#64748b',
    fontSize: '1.08rem',
    fontWeight: 700,
    lineHeight: 1.65,
  },

  panel: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 18,
    padding: 22,
    boxShadow: '0 12px 28px rgba(15,23,42,.08)',
    marginBottom: 18,
  },

  cardTitle: {
    margin: '0 0 20px',
    color: '#0f172a',
    fontWeight: 950,
    fontSize: '1.22rem',
    letterSpacing: '-.02em',
  },

  smallTitle: {
    margin: '20px 0 12px',
    color: '#0f172a',
    fontWeight: 950,
    fontSize: '1.05rem',
  },

  primaryBtn: {
    border: 'none',
    borderRadius: 12,
    padding: '12px 18px',
    background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
    color: '#fff',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 10px 20px rgba(37,99,235,.24)',
  },

  alert: {
    marginTop: 14,
    border: '1px solid',
    borderRadius: 12,
    padding: '12px 14px',
    fontWeight: 800,
  },

  chartGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 22,
    alignItems: 'stretch',
  },

  chartCard: {
    minHeight: 360,
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 22,
    padding: 26,
    boxShadow: '0 16px 38px rgba(15,23,42,.09)',
    display: 'flex',
    flexDirection: 'column',
  },

  chartRowLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    color: '#334155',
    fontWeight: 900,
    marginBottom: 8,
    fontSize: '.98rem',
  },

  barTrack: {
    height: 18,
    borderRadius: 999,
    background: '#e2e8f0',
    overflow: 'hidden',
  },

  barFill: {
    height: '100%',
    borderRadius: 999,
    background: 'linear-gradient(90deg,#2563eb,#38bdf8)',
  },
};

const inp = {
  padding: '13px 15px',
  borderRadius: 11,
  border: '1px solid #cbd5e1',
  fontSize: '1rem',
  fontFamily: "'Inter','Segoe UI',Roboto,Arial,sans-serif",
  outline: 'none',
  background: '#fff',
  color: '#111827',
  fontWeight: 650,
  lineHeight: 1.4,
};

function formatNumber(v) {
  if (v == null || v === '') return 0;

  if (typeof v === 'string') {
    if (v.includes('%')) return v;

    const numberValue = Number(v);

    if (Number.isNaN(numberValue)) return v;

    return numberValue.toLocaleString('vi-VN');
  }

  const numberValue = Number(v);

  if (Number.isNaN(numberValue)) return v;

  return numberValue.toLocaleString('vi-VN');
}

function getInitial(name, username, email) {
  return (name || username || email || 'U').trim().charAt(0).toUpperCase();
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
          width: 62,
          height: 62,
          borderRadius: '50%',
          background: danger ? '#fee2e2' : '#eff6ff',
          color: danger ? '#dc2626' : '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: '1.7rem',
          margin: '0 auto 16px',
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
              padding: '13px 22px',
              borderRadius: 13,
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#475569',
              fontWeight: 900,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              fontSize: '1rem',
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '13px 24px',
              borderRadius: 13,
              border: 'none',
              background: danger ? '#dc2626' : '#2563eb',
              color: '#fff',
              fontWeight: 900,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              fontSize: '1rem',
              opacity: loading ? 0.75 : 1,
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

function SvgIcon({ name, size = 20, color = 'currentColor' }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  if (name === 'dashboard') {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </svg>
    );
  }

  if (name === 'users') {
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (name === 'chart') {
    return (
      <svg {...common}>
        <path d="M3 3v18h18" />
        <rect x="7" y="12" width="3" height="5" rx="1" />
        <rect x="12" y="8" width="3" height="9" rx="1" />
        <rect x="17" y="5" width="3" height="12" rx="1" />
      </svg>
    );
  }

  if (name === 'folder') {
    return (
      <svg {...common}>
        <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    );
  }

  if (name === 'book') {
    return (
      <svg {...common}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
      </svg>
    );
  }

  if (name === 'student') {
    return (
      <svg {...common}>
        <path d="M22 10L12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c0 1.2 2.7 3 6 3s6-1.8 6-3v-5" />
      </svg>
    );
  }

  if (name === 'search') {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function SubTabBar({ tabs, active, onChange }) {
  return (
    <div className="admin-sub-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={active === tab.id ? 'active' : ''}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function AdminSidebar({ activeTab, onChange, systemStats }) {
  return (
    <aside className="admin-layout-sidebar">
      <div className="admin-layout-brand">
        <div className="admin-layout-logo">E</div>

        <div>
          <strong>EDWARDS</strong>
          <span>Admin System</span>
        </div>
      </div>

      <div className="admin-layout-menu">
        <p className="admin-layout-menu-title">Main menu</p>

        {ADMIN_MENU.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`admin-layout-menu-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onChange(item.id)}
          >
            <span className="admin-layout-menu-icon">
              <SvgIcon name={item.icon} size={20} />
            </span>

            <span className="admin-layout-menu-text">
              <strong>{item.label}</strong>
              <em>{item.desc}</em>
            </span>
          </button>
        ))}
      </div>

      {/* <div className="admin-layout-side-card">
        <span>Tổng người dùng</span>
        <strong>{formatNumber(systemStats?.totalUsers || 0)}</strong>
        <p>Hệ thống đang vận hành</p>
      </div> */}
    </aside>
  );
}

function AdminDashboardOverview({ systemStats, onChange }) {
  const cards = [
    {
      label: 'Tổng người dùng',
      value: systemStats?.totalUsers || 0,
      sub: 'Tất cả tài khoản',
      icon: 'users',
      color: '#2563eb',
      tab: 'accounts',
    },
    {
      label: 'Học sinh',
      value: systemStats?.totalStudents || 0,
      sub: 'Tài khoản học sinh',
      icon: 'student',
      color: '#059669',
      tab: 'accounts',
    },
    {
      label: 'Giáo viên',
      value: systemStats?.totalTeachers || 0,
      sub: 'Tài khoản giáo viên',
      icon: 'book',
      color: '#7c3aed',
      tab: 'accounts',
    },
    {
      label: 'Khóa học',
      value: systemStats?.totalCourses || 0,
      sub: 'Nội dung học tập',
      icon: 'folder',
      color: '#f97316',
      tab: 'systemData',
    },
  ];

  const actions = [
    {
      title: 'Quản lý tài khoản',
      desc: 'Tạo tài khoản, phân quyền, khóa hoặc mở tài khoản người dùng.',
      icon: 'users',
      tab: 'accounts',
      color: '#2563eb',
    },
    {
      title: 'Thống kê báo cáo',
      desc: 'Theo dõi người dùng, khóa học, lượt đăng ký và hoạt động game.',
      icon: 'chart',
      tab: 'statistics',
      color: '#7c3aed',
    },
    {
      title: 'Quản trị dữ liệu',
      desc: 'Quản lý lớp học, ngữ pháp, seed grammar và khóa học toàn hệ thống.',
      icon: 'folder',
      tab: 'systemData',
      color: '#0891b2',
    },
  ];

  return (
    <section>
      <div className="admin-dashboard-hero">
        <div>
          <p>ADMIN DASHBOARD</p>
          <h2>Trung tâm điều phối hệ thống</h2>
          <span>
            Quản trị toàn bộ website học tiếng Anh: tài khoản, báo cáo,
            lớp học, ngữ pháp, khóa học và dữ liệu vận hành.
          </span>
        </div>

        <button type="button" onClick={() => onChange('accounts')}>
          Quản lý tài khoản
        </button>
      </div>

      <div className="admin-dashboard-stat-grid">
        {cards.map((item) => (
          <button
            type="button"
            key={item.label}
            className="admin-dashboard-stat-card"
            onClick={() => onChange(item.tab)}
            style={{ '--main': item.color }}
          >
            <div>
              <span>{item.label}</span>
              <strong>{formatNumber(item.value)}</strong>
              <p>{item.sub}</p>
            </div>

            <em>
              <SvgIcon name={item.icon} size={22} />
            </em>
          </button>
        ))}
      </div>

      <div className="admin-dashboard-main-grid">
        <div className="admin-dashboard-chart-card">
          <div className="admin-dashboard-card-head">
            <div>
              <h3>Hoạt động hệ thống</h3>
              <p>Mô phỏng tổng quan vận hành trong tuần</p>
            </div>
            <span>•••</span>
          </div>

          <svg className="admin-dashboard-area" viewBox="0 0 760 280" preserveAspectRatio="none">
            <defs>
              <linearGradient id="adminAreaA" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.48" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
              </linearGradient>

              <linearGradient id="adminAreaB" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.04" />
              </linearGradient>
            </defs>

            <path
              d="M0,170 C70,145 100,190 160,130 C220,68 260,132 330,100 C390,72 420,168 488,125 C555,82 590,160 650,112 C710,64 735,120 760,92 L760,280 L0,280 Z"
              fill="url(#adminAreaA)"
            />

            <path
              d="M0,205 C70,176 112,215 170,168 C230,116 275,174 342,138 C405,104 438,205 502,156 C568,110 605,194 672,148 C724,112 742,165 760,140 L760,280 L0,280 Z"
              fill="url(#adminAreaB)"
            />

            <path
              d="M0,170 C70,145 100,190 160,130 C220,68 260,132 330,100 C390,72 420,168 488,125 C555,82 590,160 650,112 C710,64 735,120 760,92"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="5"
              strokeLinecap="round"
            />

            <path
              d="M0,205 C70,176 112,215 170,168 C230,116 275,174 342,138 C405,104 438,205 502,156 C568,110 605,194 672,148 C724,112 742,165 760,140"
              fill="none"
              stroke="#2563eb"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>

          <div className="admin-dashboard-chart-footer">
            <div>
              <strong>{formatNumber(systemStats?.totalWords || 0)}</strong>
              <span>Từ vựng</span>
            </div>

            <div>
              <strong>{formatNumber(systemStats?.totalGrammarLessons || 0)}</strong>
              <span>Bài ngữ pháp</span>
            </div>

            <div>
              <strong>{formatNumber(systemStats?.totalGameRooms || 0)}</strong>
              <span>Phòng game</span>
            </div>
          </div>
        </div>

        <div className="admin-dashboard-donut-card">
          <div className="admin-dashboard-card-head">
            <div>
              <h3>Cơ cấu người dùng</h3>
              <p>Phân bổ theo vai trò</p>
            </div>
            <span>•••</span>
          </div>

          <div className="admin-dashboard-donut-wrap">
            <div className="admin-dashboard-donut">
              <strong>{formatNumber(systemStats?.totalUsers || 0)}</strong>
              <span>users</span>
            </div>

            <div className="admin-dashboard-legend">
              <div>
                <i style={{ background: '#2563eb' }} />
                <span>Học sinh</span>
                <strong>{formatNumber(systemStats?.totalStudents || 0)}</strong>
              </div>

              <div>
                <i style={{ background: '#059669' }} />
                <span>Giáo viên</span>
                <strong>{formatNumber(systemStats?.totalTeachers || 0)}</strong>
              </div>

              <div>
                <i style={{ background: '#f97316' }} />
                <span>Admin</span>
                <strong>{formatNumber(systemStats?.totalAdmins || 0)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-action-grid">
        {actions.map((item) => (
          <button
            type="button"
            key={item.title}
            className="admin-dashboard-action-card"
            onClick={() => onChange(item.tab)}
            style={{ '--main': item.color, '--soft': `${item.color}18` }}
          >
            <em>
              <SvgIcon name={item.icon} size={24} />
            </em>

            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <strong>Mở chức năng →</strong>
          </button>
        ))}
      </div>
    </section>
  );
}

function AdminLayoutStyles() {
  return (
    <style>
      {`
        .admin-system-page,
        .admin-system-page * {
          font-family: 'Inter', 'Segoe UI', Roboto, Arial, sans-serif !important;
          box-sizing: border-box;
        }

        .admin-system-page {
          min-height: 100vh;
          margin: 0 calc((100vw - 100%) / -2);
          background: #f3f6fb;
          display: grid;
          grid-template-columns: 312px minmax(0, 1fr);
          align-items: stretch;
          color: #0f172a;
          font-size: 15.5px;
        }

        .admin-layout-sidebar {
          min-height: 100%;
          height: auto;
          background: #070b14;
          color: #e5edf7;
          padding: 24px 18px;
          box-shadow: 12px 0 34px rgba(15, 23, 42, .16);
          position: relative;
          align-self: stretch;
          display: flex;
          flex-direction: column;
        }

        .admin-layout-brand {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 0 10px 24px;
          border-bottom: 1px solid rgba(255,255,255,.09);
        }

        .admin-layout-logo {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: #111827;
          border: 1px solid rgba(255,255,255,.10);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.16rem;
          font-weight: 950;
        }

        .admin-layout-brand strong {
          display: block;
          color: #fff;
          font-size: 1.08rem;
          font-weight: 950;
          line-height: 1.1;
          letter-spacing: .01em;
        }

        .admin-layout-brand span {
          display: block;
          margin-top: 5px;
          color: #93a4b8;
          font-size: .82rem;
          font-weight: 750;
        }

        .admin-layout-menu {
          padding-top: 20px;
          flex: 1;
        }

        .admin-layout-menu-title {
          margin: 0 0 12px;
          padding: 0 10px;
          color: #7f8ea3;
          font-size: .76rem;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .admin-layout-menu-item {
          width: 100%;
          min-height: 64px;
          border: 1px solid transparent;
          border-radius: 17px;
          background: transparent;
          color: #cbd5e1;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 12px 12px;
          cursor: pointer;
          text-align: left;
          margin-bottom: 8px;
          transition: all .16s ease;
        }

        .admin-layout-menu-item:hover {
          background: rgba(255,255,255,.06);
          color: #fff;
        }

        .admin-layout-menu-item.active {
          background: #111827;
          border-color: rgba(255,255,255,.13);
          color: #fff;
          box-shadow: 0 12px 28px rgba(0,0,0,.22);
        }

        .admin-layout-menu-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: rgba(255,255,255,.07);
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 42px;
          color: #dbeafe;
        }

        .admin-layout-menu-item.active .admin-layout-menu-icon {
          background: #1d4ed8;
          color: #fff;
        }

        .admin-layout-menu-text strong {
          display: block;
          color: inherit;
          font-size: 1.125rem;
          font-weight: 900;
          line-height: 1.18;
        }

        .admin-layout-menu-text em {
          display: block;
          margin-top: 5px;
          color: #94a3b8;
          font-size: .96rem;
          font-style: normal;
          font-weight: 700;
          line-height: 1.3;
        }

        .admin-layout-menu-item.active .admin-layout-menu-text em {
          color: #cbd5e1;
        }

        .admin-layout-side-card {
          margin: 32px 8px 0;
          padding: 20px;
          border-radius: 20px;
          background: #111827;
          border: 1px solid rgba(255,255,255,.10);
        }

        .admin-layout-side-card strong {
          display: block;
          color: #fff;
          font-size: 1.85rem;
          font-weight: 950;
          margin: 8px 0 5px;
          letter-spacing: -.03em;
        }

        .admin-layout-side-card p {
          margin: 0;
          color: #cbd5e1;
          font-size: .82rem;
          font-weight: 750;
        }

        .admin-layout-main {
          min-width: 0;
          padding: 24px 30px 44px;
        }

        .admin-layout-topbar {
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 20px;
        }

        .admin-layout-search {
          flex: 1;
          max-width: 760px;
          height: 46px;
          border-radius: 10px;
          border: 1px solid #d8e2ee;
          background: #fff;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
          color: #64748b;
          box-shadow: 0 8px 18px rgba(15,23,42,.045);
        }

        .admin-layout-search input {
          border: none;
          outline: none;
          flex: 1;
          height: 100%;
          font-size: .96rem;
          color: #334155;
          background: transparent;
          font-weight: 650;
        }

        .admin-layout-user {
          min-width: 210px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .admin-layout-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #38bdf8);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 950;
          overflow: hidden;
        }

        .admin-layout-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .admin-layout-user strong {
          display: block;
          color: #0f172a;
          font-size: .94rem;
          font-weight: 900;
          line-height: 1.2;
        }

        .admin-layout-user span {
          color: #64748b;
          font-size: .78rem;
          font-weight: 750;
        }

        .admin-layout-page-head {
          display: none;
        }

        .admin-sub-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 18px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 8px;
          box-shadow: 0 8px 22px rgba(15,23,42,.045);
        }

        .admin-sub-tabs button {
          border: none;
          border-radius: 10px;
          padding: 10px 16px;
          font-weight: 850;
          cursor: pointer;
          background: transparent;
          color: #334155;
          font-size: .92rem;
        }

        .admin-sub-tabs button.active {
          background: #0f172a;
          color: #fff;
        }

        .admin-system-page h1,
        .admin-system-page h2,
        .admin-system-page h3,
        .admin-system-page h4,
        .admin-system-page p {
          letter-spacing: -.01em;
        }

        .admin-system-page h1 {
          font-size: 1.68rem !important;
          line-height: 1.22 !important;
          font-weight: 950 !important;
        }

        .admin-system-page h2 {
          font-size: 1.42rem !important;
          line-height: 1.25 !important;
          font-weight: 950 !important;
        }

        .admin-system-page h3 {
          font-size: 1.08rem !important;
          line-height: 1.32 !important;
          font-weight: 900 !important;
        }

        .admin-system-page table {
          font-size: .9rem !important;
        }

        .admin-system-page th {
          font-size: .78rem !important;
          letter-spacing: .05em;
        }

        .admin-system-page td {
          font-size: .88rem !important;
        }

        .admin-system-page input,
        .admin-system-page select,
        .admin-system-page textarea {
          font-size: .9rem !important;
        }

        .admin-dashboard-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          border-radius: 18px;
          padding: 25px 28px;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 58%, #0369a1 100%);
          color: #fff;
          box-shadow: 0 18px 42px rgba(15,23,42,.16);
          margin-bottom: 22px;
        }

        .admin-dashboard-hero p {
          margin: 0 0 8px;
          color: #bfdbfe;
          font-size: .76rem;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .admin-dashboard-hero h2 {
          margin: 0;
          color: #fff;
          font-size: 1.72rem !important;
          font-weight: 950;
        }

        .admin-dashboard-hero span {
          display: block;
          margin-top: 10px;
          max-width: 760px;
          color: #dbeafe;
          font-size: .96rem;
          line-height: 1.62;
          font-weight: 650;
        }

        .admin-dashboard-hero button {
          border: none;
          border-radius: 999px;
          min-height: 42px;
          padding: 0 18px;
          background: #fff;
          color: #0f172a;
          font-size: .9rem;
          font-weight: 900;
          cursor: pointer;
          white-space: nowrap;
        }

        .admin-dashboard-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 22px;
        }

        .admin-dashboard-stat-card {
          min-height: 116px;
          border: none;
          border-radius: 14px;
          padding: 18px;
          background: #fff;
          box-shadow: 0 14px 30px rgba(15,23,42,.08);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          text-align: left;
          cursor: pointer;
          border-top: 5px solid var(--main);
          transition: all .16s ease;
        }

        .admin-dashboard-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 42px rgba(15,23,42,.12);
        }

        .admin-dashboard-stat-card span {
          display: block;
          color: #475569;
          font-size: .96rem;
          font-weight: 850;
          margin-bottom: 10px;
        }

        .admin-dashboard-stat-card strong {
          display: block;
          color: #0f172a;
          font-size: 1.7rem;
          font-weight: 950;
          letter-spacing: -.04em;
        }

        .admin-dashboard-stat-card p {
          margin: 8px 0 0;
          color: #64748b;
          font-size: .96rem;
          line-height: 1.45;
          font-weight: 750;
        }

        .admin-dashboard-stat-card em {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: rgba(37,99,235,.10);
          color: var(--main);
          display: flex;
          align-items: center;
          justify-content: center;
          font-style: normal;
        }

        .admin-dashboard-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(330px, .8fr);
          gap: 22px;
          margin-bottom: 22px;
        }

        .admin-dashboard-chart-card,
        .admin-dashboard-donut-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 14px 30px rgba(15,23,42,.08);
          padding: 22px;
          min-height: 315px;
        }

        .admin-dashboard-card-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 18px;
        }

        .admin-dashboard-card-head h3 {
          margin: 0;
          color: #0f172a;
          font-size: 1.16rem !important;
          font-weight: 950;
        }

        .admin-dashboard-card-head p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: .96rem;
          line-height: 1.45;
          font-weight: 750;
        }

        .admin-dashboard-card-head span {
          color: #94a3b8;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .admin-dashboard-area {
          width: 100%;
          height: 200px;
          border-bottom: 1px solid #e2e8f0;
        }

        .admin-dashboard-chart-footer {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          text-align: center;
          gap: 10px;
          padding-top: 15px;
        }

        .admin-dashboard-chart-footer div {
          border-right: 1px solid #e2e8f0;
        }

        .admin-dashboard-chart-footer div:last-child {
          border-right: none;
        }

        .admin-dashboard-chart-footer strong {
          display: block;
          color: #0f172a;
          font-size: 1.05rem;
          font-weight: 950;
        }

        .admin-dashboard-chart-footer span {
          display: block;
          color: #64748b;
          font-size: .8rem;
          font-weight: 750;
          margin-top: 4px;
        }

        .admin-dashboard-donut-wrap {
          display: grid;
          grid-template-columns: 160px 1fr;
          gap: 22px;
          align-items: center;
          min-height: 220px;
        }

        .admin-dashboard-donut {
          width: 158px;
          height: 158px;
          border-radius: 50%;
          background: conic-gradient(#2563eb 0 72%, #059669 72% 92%, #f97316 92% 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 0 33px #fff, 0 10px 28px rgba(15,23,42,.08);
        }

        .admin-dashboard-donut strong {
          color: #0f172a;
          font-size: 1.2rem;
          font-weight: 950;
        }

        .admin-dashboard-donut span {
          color: #64748b;
          font-size: .74rem;
          font-weight: 850;
          text-transform: uppercase;
        }

        .admin-dashboard-legend {
          display: grid;
          gap: 13px;
        }

        .admin-dashboard-legend div {
          display: grid;
          grid-template-columns: 12px 1fr auto;
          gap: 10px;
          align-items: center;
          color: #475569;
          font-size: .96rem;
          line-height: 1.45;
          font-weight: 800;
        }

        .admin-dashboard-legend i {
          width: 11px;
          height: 11px;
          border-radius: 50%;
        }

        .admin-dashboard-legend strong {
          color: #0f172a;
          font-weight: 950;
        }

        .admin-dashboard-action-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .admin-dashboard-action-card {
          min-height: 190px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 14px 30px rgba(15,23,42,.07);
          padding: 20px;
          text-align: left;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all .16s ease;
        }

        .admin-dashboard-action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 42px rgba(15,23,42,.12);
        }

        .admin-dashboard-action-card::after {
          content: '';
          position: absolute;
          width: 140px;
          height: 140px;
          right: -72px;
          top: -72px;
          border-radius: 50%;
          background: var(--soft);
        }

        .admin-dashboard-action-card em {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: var(--soft);
          color: var(--main);
          display: flex;
          align-items: center;
          justify-content: center;
          font-style: normal;
          margin-bottom: 14px;
        }

        .admin-dashboard-action-card h3 {
          margin: 0 0 9px;
          color: #0f172a;
          font-size: 1.03rem !important;
          font-weight: 900;
        }

        .admin-dashboard-action-card p {
          margin: 0;
          color: #64748b;
          font-size: .88rem;
          line-height: 1.5;
          font-weight: 700;
        }

        .admin-dashboard-action-card strong {
          position: absolute;
          left: 20px;
          bottom: 18px;
          color: var(--main);
          font-size: .86rem;
          font-weight: 900;
        }

        @keyframes toastSlide {
          from { opacity: 0; transform: translateX(24px) translateY(-8px); }
          to { opacity: 1; transform: translateX(0) translateY(0); }
        }

        @media (max-width: 1200px) {
          .admin-system-page {
            grid-template-columns: 1fr;
          }

          .admin-layout-sidebar {
            position: relative;
            min-height: auto;
          }

          .admin-dashboard-stat-grid,
          .admin-dashboard-action-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .admin-dashboard-main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .admin-layout-main {
            padding: 18px;
          }

          .admin-layout-topbar,
          .admin-dashboard-hero {
            flex-direction: column;
            align-items: flex-start;
          }

          .admin-dashboard-stat-grid,
          .admin-dashboard-action-grid,
          .admin-dashboard-donut-wrap {
            grid-template-columns: 1fr;
          }

          .admin-layout-user {
            justify-content: flex-start;
          }
        }
      `}
    </style>
  );
}

function AdminLayoutExtraStyles() {
  return (
    <style>
      {`
        .admin-dashboard-area {
          width: 100%;
          height: 210px;
          border-bottom: 1px solid #e2e8f0;
        }

        .admin-dashboard-chart-footer {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          text-align: center;
          gap: 10px;
          padding-top: 16px;
        }

        .admin-dashboard-chart-footer div {
          border-right: 1px solid #e2e8f0;
        }

        .admin-dashboard-chart-footer div:last-child {
          border-right: none;
        }

        .admin-dashboard-chart-footer strong {
          display: block;
          color: #0f172a;
          font-size: 1.12rem;
          font-weight: 950;
        }

        .admin-dashboard-chart-footer span {
          display: block;
          color: #64748b;
          font-size: .96rem;
          line-height: 1.45;
          font-weight: 750;
          margin-top: 4px;
        }

        .admin-dashboard-donut-wrap {
          display: grid;
          grid-template-columns: 170px 1fr;
          gap: 24px;
          align-items: center;
          min-height: 230px;
        }

        .admin-dashboard-donut {
          width: 168px;
          height: 168px;
          border-radius: 50%;
          background: conic-gradient(#2563eb 0 72%, #059669 72% 92%, #f97316 92% 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 0 34px #fff, 0 10px 28px rgba(15, 23, 42, .08);
        }

        .admin-dashboard-donut strong {
          color: #0f172a;
          font-size: 1.35rem;
          font-weight: 950;
        }

        .admin-dashboard-donut span {
          color: #64748b;
          font-size: .8rem;
          font-weight: 850;
          text-transform: uppercase;
        }

        .admin-dashboard-legend {
          display: grid;
          gap: 14px;
        }

        .admin-dashboard-legend div {
          display: grid;
          grid-template-columns: 13px 1fr auto;
          gap: 10px;
          align-items: center;
          color: #475569;
          font-size: .98rem;
          font-weight: 800;
        }

        .admin-dashboard-legend i {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .admin-dashboard-legend strong {
          color: #0f172a;
          font-weight: 950;
        }

        .admin-dashboard-action-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .admin-dashboard-action-card {
          min-height: 210px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 14px 30px rgba(15, 23, 42, .07);
          padding: 22px;
          text-align: left;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all .16s ease;
        }

        .admin-dashboard-action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 42px rgba(15, 23, 42, .12);
        }

        .admin-dashboard-action-card::after {
          content: '';
          position: absolute;
          width: 150px;
          height: 150px;
          right: -75px;
          top: -75px;
          border-radius: 50%;
          background: var(--soft);
        }

        .admin-dashboard-action-card em {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: var(--soft);
          color: var(--main);
          display: flex;
          align-items: center;
          justify-content: center;
          font-style: normal;
          font-size: 1.5rem;
          margin-bottom: 16px;
        }

        .admin-dashboard-action-card h3 {
          margin: 0 0 10px;
          color: #0f172a;
          font-size: 1.22rem;
          font-weight: 950;
        }

        .admin-dashboard-action-card p {
          margin: 0;
          color: #64748b;
          font-size: 1rem;
          line-height: 1.55;
          font-weight: 700;
        }

        .admin-dashboard-action-card strong {
          position: absolute;
          left: 22px;
          bottom: 20px;
          color: var(--main);
          font-size: .96rem;
          font-weight: 950;
        }

        .admin-system-page button,
        .admin-system-page input,
        .admin-system-page select,
        .admin-system-page textarea,
        .admin-system-page table,
        .admin-system-page th,
        .admin-system-page td {
          font-family: 'Inter', 'Segoe UI', Roboto, Arial, sans-serif !important;
        }

        @keyframes toastSlide {
          from { opacity: 0; transform: translateX(24px) translateY(-8px); }
          to { opacity: 1; transform: translateX(0) translateY(0); }
        }

        @media (max-width: 1200px) {
          .admin-system-page {
            grid-template-columns: 1fr;
          }

          .admin-layout-sidebar {
            position: relative;
            min-height: auto;
          }

          .admin-dashboard-stat-grid,
          .admin-dashboard-action-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .admin-dashboard-main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .admin-layout-main {
            padding: 18px;
          }

          .admin-layout-topbar,
          .admin-layout-page-head,
          .admin-dashboard-hero {
            flex-direction: column;
            align-items: flex-start;
          }

          .admin-dashboard-stat-grid,
          .admin-dashboard-action-grid,
          .admin-dashboard-donut-wrap {
            grid-template-columns: 1fr;
          }

          .admin-layout-user {
            justify-content: flex-start;
          }
        }
      `}
    </style>
  );
}

function UsersTab({ systemStats, notify, currentAccountId }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [lockingUser, setLockingUser] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);

    try {
      const res = await adminApi.getUsers({ page, limit: 10, search });

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
                    <td style={{ ...S.td, ...S.index }}>{(page - 1) * 10 + i + 1}</td>

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
                      {u.accountId === currentAccountId ? (
                        <span style={S.badge('neutral')}>Tài khoản hiện tại</span>
                      ) : (
                        <button
                          style={S.actionBtn(u.isLocked, lockingUser === u.id)}
                          disabled={lockingUser === u.id}
                          onClick={() => handleLock(u.id, u.isLocked)}
                        >
                          {lockingUser === u.id ? 'Đang xử lý' : u.isLocked ? 'Mở khóa' : 'Khóa'}
                        </button>
                      )}
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
    padding: '13px 20px',
    borderRadius: 11,
    border: 'none',
    background: disabled ? '#93c5fd' : '#1d4ed8',
    color: '#fff',
    fontWeight: 900,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    fontSize: '1rem',
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
      padding: '11px 15px',
      borderRadius: 11,
      border: `1px solid ${c[1]}`,
      background: c[0],
      color: c[2],
      fontWeight: 900,
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: '.95rem',
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
            padding: '13px 20px',
            borderRadius: 12,
            border: 'none',
            background: '#1d4ed8',
            color: '#fff',
            fontWeight: 900,
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: '1rem',
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
              Mật khẩu mặc định: <code style={{ background: '#dbeafe', padding: '4px 8px', borderRadius: 6 }}>12345678a</code>
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
const EMPTY_STUDENT = () => ({
  name: '',
  dob: '',
  email: '',
  password: '12345678a',
});

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

  const setRow = (i, field, val) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, EMPTY_STUDENT()]);

  const removeRow = (i) => setRows((prev) => prev.filter((_, idx) => idx !== i));

  const miniBtn = (tone = 'gray') => {
    const m = {
      green: ['#ecfdf5', '#059669', '#047857'],
      purple: ['#f5f3ff', '#7c3aed', '#6d28d9'],
      gray: ['#f8fafc', '#94a3b8', '#475569'],
      blue: ['#eff6ff', '#1d4ed8', '#1d4ed8'],
    };

    const c = m[tone] || m.gray;

    return {
      padding: '11px 15px',
      borderRadius: 11,
      border: `1px solid ${c[1]}`,
      background: c[0],
      fontWeight: 900,
      cursor: 'pointer',
      fontFamily: 'inherit',
      color: c[2],
      fontSize: '.95rem',
    };
  };

  const downloadStudentTemplate = () => {
    import('xlsx').then((XLSX) => {
      const data = [
        ['Họ và tên', 'Ngày sinh (dd/mm/yyyy)'],
        ['Nguyễn Văn An', '05/03/2015'],
        ['Trần Thị Bích', '12/07/2015'],
      ];

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

  return (
    <>
      <div style={S.controlsCard}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 900, marginBottom: 10, color: '#1e3a8a', fontSize: '1.1rem' }}>
            Chọn lớp
          </div>

          <select
            style={{ ...inp, minWidth: 320 }}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
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
              style={{
                ...inp,
                width: '100%',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'Consolas, monospace',
                lineHeight: 1.6,
              }}
              placeholder={'Nguyễn Văn An\t05/03/2015\nTrần Thị Bích\t12/07/2015\n...'}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />

            <button
              onClick={parsePaste}
              style={{ ...miniBtn('blue'), marginTop: 10, background: '#0369a1', color: '#fff', border: 'none' }}
            >
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
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                          fontWeight: 900,
                          fontSize: '1.4rem',
                        }}
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
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
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
                      {r.skipped ? (
                        <span style={S.badge('warning')}>{r.reason}</span>
                      ) : (
                        <span style={S.badge('success')}>Đã tạo</span>
                      )}
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

function AccountManagementTab({ systemStats, notify, currentAccountId }) {
  const [tab, setTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'Danh sách người dùng' },
    { id: 'teachers', label: 'Tài khoản giáo viên' },
    { id: 'students', label: 'Tài khoản học sinh' },
  ];

  return (
    <section>
      <div style={S.sectionHead}>
        <div>
          <h2 style={S.sectionTitle}>Quản lý tài khoản</h2>
          <p style={S.sectionSub}>
            Quản lý người dùng, tạo tài khoản học sinh, tạo tài khoản giáo viên,
            đổi quyền và khóa / mở khóa tài khoản.
          </p>
        </div>
      </div>

      <SubTabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'users' && (
        <UsersTab
          systemStats={systemStats}
          notify={notify}
          currentAccountId={currentAccountId}
        />
      )}

      {tab === 'teachers' && (
        <TeachersTab notify={notify} />
      )}

      {tab === 'students' && (
        <StudentsTab notify={notify} />
      )}
    </section>
  );
}

function SeedGrammarPanel({ notify }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSeedGrammar = async () => {
    setLoading(true);
    setMsg(null);

    try {
      const res = await adminApi.seedGrammarTenses();

      setMsg({
        ok: true,
        text: res.data?.message || 'Đã tạo dữ liệu ngữ pháp mẫu.',
      });

      notify?.(
        'success',
        'Tạo dữ liệu ngữ pháp mẫu thành công',
        res.data?.message || 'Đã tạo dữ liệu ngữ pháp mẫu.',
      );
    } catch (err) {
      const message = err?.response?.data?.message || 'Không thể tạo dữ liệu mẫu.';

      setMsg({
        ok: false,
        text: message,
      });

      notify?.('error', 'Tạo dữ liệu thất bại', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.panel}>
      <div style={S.sectionHead}>
        <div>
          <h3 style={S.cardTitle}>Seed dữ liệu ngữ pháp</h3>
          <p style={S.sectionSub}>
            Tạo nhanh bộ dữ liệu mẫu gồm các thì tiếng Anh cơ bản cho hệ thống.
            Chức năng này phù hợp khi cần khởi tạo dữ liệu ban đầu cho website.
          </p>
        </div>

        <button
          style={{
            ...S.primaryBtn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          onClick={handleSeedGrammar}
          disabled={loading}
        >
          {loading ? 'Đang tạo...' : 'Tạo dữ liệu mẫu'}
        </button>
      </div>

      {msg && (
        <div
          style={{
            ...S.alert,
            background: msg.ok ? '#ecfdf5' : '#fef2f2',
            color: msg.ok ? '#047857' : '#b91c1c',
            borderColor: msg.ok ? '#a7f3d0' : '#fecaca',
          }}
        >
          {msg.text}
        </div>
      )}
    </div>
  );
}

function GrammarAdminTab({ notify }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const res = await adminApi.getGrammarLessons();
      setLessons(res.data?.lessons || []);
    } catch {
      setLessons([]);
      notify?.('error', 'Tải bài ngữ pháp thất bại', 'Không thể lấy danh sách bài ngữ pháp.');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div style={S.panel}>
      <div style={S.sectionHead}>
        <div>
          <h3 style={S.cardTitle}>Quản lý ngữ pháp</h3>
          <p style={S.sectionSub}>
            Danh sách bài học ngữ pháp trong hệ thống. Phần chỉnh sửa chi tiết có thể dùng trang quản lý ngữ pháp riêng.
          </p>
        </div>
      </div>

      <div style={S.tableCard}>
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                {['#', 'Tiêu đề', 'Khối', 'Chủ điểm', 'Trạng thái'].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={S.loadingCell}>Đang tải dữ liệu...</td>
                </tr>
              ) : lessons.length === 0 ? (
                <tr>
                  <td colSpan={5} style={S.emptyCell}>Chưa có bài ngữ pháp nào.</td>
                </tr>
              ) : (
                lessons.map((lesson, i) => (
                  <tr key={lesson.id || i}>
                    <td style={{ ...S.td, ...S.index }}>{i + 1}</td>
                    <td style={{ ...S.td, fontWeight: 900 }}>{lesson.title || '—'}</td>
                    <td style={S.td}>{lesson.gradeLevel || '—'}</td>
                    <td style={S.td}>{lesson.topic || '—'}</td>
                    <td style={S.td}>
                      <span style={S.badge(lesson.status === 'published' ? 'success' : 'warning')}>
                        {lesson.status || 'draft'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminCoursePanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    adminApi
      .getCourseStats()
      .then((res) => {
        if (mounted) setStats(res.data?.stats || null);
      })
      .catch(() => {
        if (mounted) setStats(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div style={S.panel}>Đang tải dữ liệu khóa học...</div>;
  }

  if (!stats) {
    return <div style={S.panel}>Không tải được dữ liệu khóa học.</div>;
  }

  return (
    <div style={S.panel}>
      <div style={S.sectionHead}>
        <div>
          <h3 style={S.cardTitle}>Quản lý khóa học</h3>
          <p style={S.sectionSub}>
            Theo dõi tổng quan khóa học, số lượt đăng ký, tỷ lệ hoàn thành
            và các khóa học có nhiều học viên nhất.
          </p>
        </div>
      </div>

      <div style={S.statsRow}>
        <StatCard label="Tổng khóa học" value={stats.totalCourses} color={COLORS.blue} />
        <StatCard label="Đã xuất bản" value={stats.publishedCourses} color={COLORS.green} />
        <StatCard label="Lượt đăng ký" value={stats.totalEnrollments} color={COLORS.purple} />
        <StatCard label="Tỷ lệ hoàn thành" value={`${stats.completionRate || 0}%`} color={COLORS.orange} />
      </div>

      <h4 style={S.smallTitle}>Top khóa học nổi bật</h4>

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Khóa học</th>
              <th style={S.th}>Trạng thái</th>
              <th style={S.th}>Đăng ký</th>
              <th style={S.th}>Hoàn thành</th>
              <th style={S.th}>Lượt xem</th>
            </tr>
          </thead>

          <tbody>
            {(stats.topCourses || []).map((course) => (
              <tr key={course.id}>
                <td style={S.td}>{course.title}</td>
                <td style={S.td}>{course.status}</td>
                <td style={S.td}>{course.enrollments}</td>
                <td style={S.td}>{course.completed}</td>
                <td style={S.td}>{course.viewCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SystemDataTab({ notify }) {
  const [tab, setTab] = useState('classes');

  const tabs = [
    { id: 'classes', label: 'Lớp học' },
    { id: 'grammar', label: 'Ngữ pháp' },
    { id: 'seed', label: 'Seed grammar' },
    { id: 'courses', label: 'Khóa học' },
  ];

  return (
    <section>
      <div style={S.sectionHead}>
        <div>
          <h2 style={S.sectionTitle}>Quản trị dữ liệu hệ thống</h2>
          <p style={S.sectionSub}>
            Quản lý dữ liệu nền của hệ thống như lớp học, bài ngữ pháp,
            dữ liệu mẫu và khóa học.
          </p>
        </div>
      </div>

      <SubTabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'classes' && (
        <ClassroomsTab notify={notify} />
      )}

      {tab === 'grammar' && (
        <GrammarAdminTab notify={notify} />
      )}

      {tab === 'seed' && (
        <SeedGrammarPanel notify={notify} />
      )}

      {tab === 'courses' && (
        <AdminCoursePanel notify={notify} />
      )}
    </section>
  );
}

function StatCard({ label, value, color = COLORS.blue }) {
  return (
    <div style={S.statCard(color)}>
      <div style={{ color, fontWeight: 900, fontSize: '.86rem', marginBottom: 8 }}>
        {label}
      </div>

      <div style={{ color: '#0f172a', fontWeight: 950, fontSize: '1.8rem' }}>
        {formatNumber(value)}
      </div>
    </div>
  );
}

function SimpleBarChart({ title, data = [], labelKey = 'label', valueKey = 'value' }) {
  const max = Math.max(...data.map((item) => Number(item[valueKey] || 0)), 1);

  return (
    <div style={S.chartCard}>
      <h3 style={S.cardTitle}>{title}</h3>

      <div style={{ display: 'grid', gap: 12 }}>
        {data.map((item) => {
          const value = Number(item[valueKey] || 0);
          const width = `${Math.max((value / max) * 100, 4)}%`;

          return (
            <div key={item[labelKey]}>
              <div style={S.chartRowLabel}>
                <span>{item[labelKey]}</span>
                <strong>{formatNumber(value)}</strong>
              </div>

              <div style={S.barTrack}>
                <div style={{ ...S.barFill, width }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SimplePieChart({ title, data = [] }) {
  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0) || 1;
  const colors = ['#2563eb', '#059669', '#d97706', '#7c3aed', '#dc2626'];

  let current = 0;

  const gradient = data
    .map((item, index) => {
      const start = current;
      const percent = (Number(item.value || 0) / total) * 100;
      current += percent;
      return `${colors[index % colors.length]} ${start}% ${current}%`;
    })
    .join(', ');

  return (
    <div style={S.chartCard}>
      <h3 style={S.cardTitle}>{title}</h3>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34, flex: 1, flexWrap: 'wrap' }}>
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: `conic-gradient(${gradient})`,
            boxShadow: 'inset 0 0 0 34px #fff, 0 18px 36px rgba(15,23,42,.12)',
            border: '1px solid #e2e8f0',
          }}
        />

        <div style={{ display: 'grid', gap: 14, minWidth: 180 }}>
          {data.map((item, index) => {
            const percent = Math.round((Number(item.value || 0) / total) * 100);

            return (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    background: colors[index % colors.length],
                    flexShrink: 0,
                  }}
                />

                <div>
                  <div style={{ fontWeight: 950, color: '#0f172a', fontSize: '1rem' }}>
                    {item.label}: {formatNumber(item.value)}
                  </div>

                  <div style={{ color: '#64748b', fontWeight: 750, fontSize: '.88rem' }}>
                    {percent}% tổng số
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SimpleLineChart({ title, data = [] }) {
  const width = 720;
  const height = 280;
  const padding = 44;
  const max = Math.max(...data.map((item) => Number(item.count || 0)), 1);

  const points = data.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const y = height - padding - (Number(item.count || 0) / max) * (height - padding * 2);

    return { ...item, x, y };
  });

  const path = points
    .map((p, index) => `${index === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <div style={S.chartCard}>
      <h3 style={S.cardTitle}>{title}</h3>

      <div style={{ flex: 1, overflowX: 'auto' }}>
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="2" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="2" />

          {[0, 0.25, 0.5, 0.75, 1].map((rate) => {
            const y = height - padding - rate * (height - padding * 2);

            return (
              <line
                key={rate}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#eef2f7"
                strokeWidth="1"
              />
            );
          })}

          <path d={path} fill="none" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p) => (
            <g key={p.month}>
              <circle cx={p.x} cy={p.y} r="7" fill="#2563eb" stroke="#fff" strokeWidth="3" />

              <text x={p.x} y={height - 12} fontSize="14" textAnchor="middle" fill="#475569" fontWeight="800">
                {p.month}
              </text>

              <text x={p.x} y={p.y - 14} fontSize="14" textAnchor="middle" fill="#0f172a" fontWeight="900">
                {p.count}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function StatisticsTab({ systemStats }) {
  const [courseStats, setCourseStats] = useState(null);
  const [gameStats, setGameStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      adminApi.getCourseStats(),
      adminApi.getGameStats(),
    ])
      .then(([courseRes, gameRes]) => {
        if (!mounted) return;

        setCourseStats(courseRes.data?.stats || null);
        setGameStats(gameRes.data?.stats || null);
      })
      .catch(() => {
        if (!mounted) return;

        setCourseStats(null);
        setGameStats(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const userPieData = [
    { label: 'Học sinh', value: systemStats?.totalStudents || 0 },
    { label: 'Giáo viên', value: systemStats?.totalTeachers || 0 },
    { label: 'Admin', value: systemStats?.totalAdmins || 0 },
  ];

  const courseStatusData = Object.entries(systemStats?.coursesByStatus || {}).map(
    ([label, value]) => ({ label, value }),
  );

  const gameData = (gameStats?.gameBreakdown || []).map((game) => ({
    label: game.gameName || 'Không tên',
    value: game.playerCount || 0,
  }));

  return (
    <section>
      <div style={S.sectionHead}>
        <div>
          <h2 style={S.sectionTitle}>Thống kê báo cáo</h2>
          <p style={S.sectionSub}>
            Theo dõi tổng quan người dùng, khóa học, lượt đăng ký và hoạt động game
            bằng các biểu đồ trực quan.
          </p>
        </div>
      </div>

      <div style={S.statsRow}>
        <StatCard label="Tổng người dùng" value={systemStats?.totalUsers || 0} color={COLORS.blue} />
        <StatCard label="Học sinh" value={systemStats?.totalStudents || 0} color={COLORS.green} />
        <StatCard label="Giáo viên" value={systemStats?.totalTeachers || 0} color={COLORS.purple} />
        <StatCard label="Khóa học" value={systemStats?.totalCourses || 0} color={COLORS.orange} />
        <StatCard label="Bài ngữ pháp" value={systemStats?.totalGrammarLessons || 0} color={COLORS.red} />
        <StatCard label="Phòng game" value={systemStats?.totalGameRooms || 0} color={COLORS.blue} />
      </div>

      {loading ? (
        <div style={S.panel}>Đang tải dữ liệu thống kê...</div>
      ) : (
        <div style={S.chartGrid}>
          <SimplePieChart title="Cơ cấu người dùng" data={userPieData} />

          <SimpleBarChart
            title="Khóa học theo trạng thái"
            data={courseStatusData}
          />

          <SimpleLineChart
            title="Lượt đăng ký khóa học theo tháng"
            data={courseStats?.enrollmentsByMonth || []}
          />

          <SimpleBarChart
            title="Số người chơi theo game"
            data={gameData}
          />

          <SimpleBarChart
            title="Top khóa học theo lượt đăng ký"
            data={(courseStats?.topCourses || []).map((course) => ({
              label: course.title,
              value: course.enrollments || 0,
            }))}
          />
        </div>
      )}
    </section>
  );
}

function AdminUsersPage() {
  useTitle('Quản lý hệ thống');

  const userInfo = useSelector((s) => s.userInfo);
  const history = useHistory();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return getValidTab(params.get('tab'));
  });

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
    const params = new URLSearchParams(location.search);
    setActiveTab(getValidTab(params.get('tab')));
  }, [location.search]);

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
    history.replace(`${ROUTES.ADMIN.USERS}?tab=${tab}`);
  };

  useEffect(() => {
    if (isAdmin) {
      adminApi
        .getSystemStats()
        .then((res) => setSystemStats(res.data?.stats))
        .catch(() => {});
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div style={S.noAccess}>
        <div style={{
          width: 54,
          height: 54,
          borderRadius: '50%',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: '1.25rem',
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

  const activeMenu = ADMIN_MENU.find((item) => item.id === activeTab) || ADMIN_MENU[0];

  return (
    <div style={S.page} className="admin-system-page">
      <AdminLayoutStyles />

      <AdminSidebar
        activeTab={activeTab}
        onChange={handleChangeTab}
        systemStats={systemStats}
      />

      <main className="admin-layout-main">
        <div className="admin-layout-topbar">
          <div className="admin-layout-search">
            <SvgIcon name="search" size={20} color="#475569" />
            <input placeholder="Tìm kiếm nhanh trong hệ thống..." />
          </div>

          {/* <div className="admin-layout-user">
            <div className="admin-layout-avatar">
              {userInfo?.avt ? (
                <img src={userInfo.avt} alt="" />
              ) : (
                getInitial(userInfo?.name, userInfo?.username, userInfo?.email)
              )}
            </div>

            <div>
              <strong>{userInfo?.name || 'Admin'}</strong>
              <span>Web Administrator</span>
            </div>
          </div> */}
        </div>

        {/* {activeTab !== 'dashboard' && (
          <div className="admin-layout-page-head">
            <div>
              <h1>{activeMenu.label}</h1>
              <p>{activeMenu.desc}</p>
            </div>

            <div className="admin-layout-pill">
              {formatNumber(systemStats?.totalUsers || 0)} người dùng
            </div>
          </div>
        )} */}

        <div className="admin-layout-content-card">
          {activeTab === 'dashboard' && (
            <AdminDashboardOverview
              systemStats={systemStats}
              onChange={handleChangeTab}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountManagementTab
              systemStats={systemStats}
              notify={notify}
              currentAccountId={userInfo?.accountId}
            />
          )}

          {activeTab === 'statistics' && (
            <StatisticsTab systemStats={systemStats} />
          )}

          {activeTab === 'systemData' && (
            <SystemDataTab notify={notify} />
          )}
        </div>
      </main>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default AdminUsersPage;