import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import EditIcon from '@material-ui/icons/Edit';
import ErrorIcon from '@material-ui/icons/Error';
import GradeIcon from '@material-ui/icons/Grade';
import PeopleIcon from '@material-ui/icons/People';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import SchoolIcon from '@material-ui/icons/School';

import classroomApi from 'apis/classroomApi';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AssignmentsTab from './AssignmentsTab';

const GF = '"Baloo 2","Nunito",sans-serif';

const COLORS = {
  dark: '#063c46',
  main: '#19c7a8',
  mainDark: '#07947f',
  mint: '#eefdf9',
  mint2: '#d6f3ed',
  yellow: '#ffdf3b',
  orange: '#ff8a00',
  green: '#0ca84f',
  red: '#e53935',
  text: '#06434b',
  sub: '#07545c',
  slate: '#64748b',
};

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 12% 18%, rgba(25,199,168,.18) 0 4px, transparent 5px),
      radial-gradient(circle at 86% 24%, rgba(255,191,31,.13) 0 5px, transparent 6px),
      linear-gradient(180deg, #063c46 0%, #042b33 100%)
    `,
    backgroundSize: '90px 90px, 130px 130px, auto',
    padding: '30px 0 56px',
    fontFamily: GF,
  },

  embeddedPage: {
    height: 'calc(100vh - 112px)',
    minHeight: 620,
    background: 'transparent',
    padding: 0,
    fontFamily: GF,
    overflow: 'hidden',
  },

  wrapper: {
    maxWidth: 1320,
    margin: '0 auto',
    padding: '0 28px',
  },

  embeddedWrapper: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  hero: {
    background: 'linear-gradient(180deg,#ffffff 0%,#f2fffc 100%)',
    borderRadius: 24,
    border: '4px solid #d6f3ed',
    boxShadow:
      '0 7px 0 rgba(7,148,127,.14), 0 14px 28px rgba(15,23,42,.07)',
    padding: '22px 26px',
    marginBottom: 18,
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
  },

  heroDecor: {
    position: 'absolute',
    right: 28,
    top: 18,
    color: COLORS.mainDark,
    opacity: 0.1,
    transform: 'rotate(-10deg)',
  },

  heroTop: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    position: 'relative',
    zIndex: 2,
  },

  backBtn: {
    width: 42,
    height: 42,
    border: '3px solid #19c7a8',
    borderRadius: 999,
    background: 'linear-gradient(180deg,#ffffff,#eefdf9)',
    color: COLORS.mainDark,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 0 rgba(7,148,127,.15)',
    flex: '0 0 42px',
    marginTop: 2,
  },

  title: {
    margin: 0,
    color: COLORS.text,
    fontSize: '1.9rem',
    fontWeight: 900,
    lineHeight: 1.12,
    letterSpacing: '-0.025em',
  },

  desc: {
    margin: '8px 0 0',
    color: COLORS.sub,
    fontSize: '1rem',
    lineHeight: 1.45,
    fontWeight: 800,
    maxWidth: 780,
  },

  chipsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    flexWrap: 'wrap',
    marginTop: 14,
  },

  chip: {
    borderRadius: 999,
    background: '#d4f5eb',
    color: '#057a55',
    border: '2.5px solid #a8e8db',
    padding: '6px 12px',
    fontWeight: 900,
    fontSize: '.9rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    lineHeight: 1.2,
  },

  chipYellow: {
    borderRadius: 999,
    background: '#fff3cd',
    color: '#9b5c00',
    border: '2.5px solid #ffe2a6',
    padding: '6px 12px',
    fontWeight: 900,
    fontSize: '.9rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    lineHeight: 1.2,
  },

  contentScroll: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    paddingRight: 4,
  },

  tabsWrap: {
    background: '#fff',
    borderRadius: 24,
    border: '4px solid #d6f3ed',
    boxShadow:
      '0 7px 0 rgba(7,148,127,.12), 0 14px 28px rgba(15,23,42,.07)',
    overflow: 'hidden',
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },

  tabs: {
    background: 'linear-gradient(180deg,#ffffff,#f3fffc)',
    borderBottom: '4px solid #d6f3ed',
    minHeight: 62,
    flexShrink: 0,
  },

  tabStyle: (active) => ({
    fontFamily: GF,
    fontWeight: 900,
    textTransform: 'none',
    color: active ? COLORS.mainDark : COLORS.slate,
    minHeight: 62,
    fontSize: '.96rem',
    lineHeight: 1.25,
  }),

  panel: {
    padding: 20,
    background: '#fff',
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },

  panelScroll: {
    height: '100%',
    minHeight: 360,
    maxHeight: 'calc(100vh - 335px)',
    overflowY: 'auto',
    paddingRight: 4,
  },

  emptyBox: {
    textAlign: 'center',
    padding: '38px 24px',
    color: COLORS.sub,
    background: '#f8fffd',
    border: '3px dashed #d6f3ed',
    borderRadius: 22,
    fontWeight: 850,
    fontSize: '1rem',
    lineHeight: 1.5,
  },

  tablePaper: {
    borderRadius: 20,
    border: '3px solid #d6f3ed',
    boxShadow: '0 5px 0 rgba(7,148,127,.09)',
    overflow: 'hidden',
  },

  tableContainer: {
    maxHeight: 'calc(100vh - 390px)',
    minHeight: 300,
    overflowY: 'auto',
  },

  tableHeadRow: {
    background: 'linear-gradient(180deg,#07947f,#056d5e)',
  },

  th: {
    color: '#ffffff',
    fontWeight: 900,
    fontSize: '.9rem',
    fontFamily: GF,
    borderBottom: 'none',
    padding: '12px 14px',
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: 0,
    zIndex: 2,
    background: '#07947f',
  },

  td: {
    color: COLORS.text,
    fontWeight: 800,
    fontSize: '.94rem',
    fontFamily: GF,
    borderBottom: '1px solid #e5f7f2',
    padding: '11px 14px',
    lineHeight: 1.4,
  },

  avatar: {
    background: 'linear-gradient(180deg,#19c7a8,#07947f)',
    color: '#fff',
    fontFamily: GF,
    fontWeight: 900,
    border: '2px solid #fff',
    boxShadow: '0 3px 0 rgba(0,0,0,.09)',
  },

  actionBtn: {
    borderRadius: 999,
    border: '2.5px solid #19c7a8',
    background: 'linear-gradient(180deg,#ffffff,#eefdf9)',
    color: COLORS.mainDark,
    fontFamily: GF,
    fontWeight: 900,
    padding: '8px 14px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    boxShadow: '0 4px 0 rgba(7,148,127,.13)',
    fontSize: '.92rem',
  },

  primaryBtn: {
    borderRadius: 999,
    border: '3px solid #fff',
    background: 'linear-gradient(180deg,#19c7a8,#07947f)',
    color: '#fff',
    fontFamily: GF,
    fontWeight: 900,
    padding: '9px 16px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    boxShadow: '0 5px 0 rgba(7,148,127,.25)',
    fontSize: '.94rem',
  },

  dialogPaper: {
    borderRadius: 24,
    border: '4px solid #19c7a8',
    boxShadow: '0 9px 0 #07947f, 0 22px 46px rgba(15,23,42,.22)',
    overflow: 'hidden',
    fontFamily: GF,
  },

  dialogTitle: {
    background: 'linear-gradient(180deg,#19c7a8,#07947f)',
    color: '#fff',
    padding: '18px 24px',
  },

  dialogContent: {
    padding: 24,
    background: '#f3fffc',
  },

  dialogActions: {
    padding: '16px 24px 22px',
    background: '#f3fffc',
  },

  inputStyle: {
    marginBottom: 16,
  },

  loadingBox: {
    minHeight: 360,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fffd',
    borderRadius: 24,
    border: '3px solid #d6f3ed',
  },

  notFound: {
    minHeight: 360,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    background: '#fff',
    color: COLORS.text,
    borderRadius: 24,
    border: '3px solid #d6f3ed',
    padding: 34,
    textAlign: 'center',
    fontWeight: 900,
  },
};

function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));

  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

  return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
}

function formatDate(value) {
  if (!value) return '—';

  const date = value?.toDate ? value.toDate() : new Date(value);

  return date.toLocaleDateString('vi-VN');
}

function formatDateTime(value) {
  if (!value) return 'Chưa hoạt động';

  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function TeacherToast({ toast, onClose }) {
  if (!toast?.show) return null;

  const ok = toast.type === 'success' || toast.type === 'delete';

  return (
    <div
      style={{
        position: 'fixed',
        top: 92,
        right: 28,
        zIndex: 9999,
        minWidth: 320,
        maxWidth: 430,
        borderRadius: 20,
        padding: '13px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: ok
          ? 'linear-gradient(135deg,#ecfdf5,#ffffff)'
          : 'linear-gradient(135deg,#fff1f2,#ffffff)',
        border: ok ? '3px solid #19c7a8' : '3px solid #ff8a8a',
        boxShadow: '0 16px 36px rgba(15,23,42,.15)',
        fontFamily: GF,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: ok ? '#d4f5eb' : '#ffe4e6',
          color: ok ? COLORS.mainDark : COLORS.red,
          flexShrink: 0,
        }}
      >
        {ok ? <CheckCircleIcon /> : <ErrorIcon />}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            color: ok ? COLORS.text : '#7f1d1d',
            fontSize: '.98rem',
            fontWeight: 900,
            lineHeight: 1.25,
          }}
        >
          {toast.title}
        </div>

        <div
          style={{
            color: COLORS.slate,
            fontSize: '.88rem',
            fontWeight: 750,
            lineHeight: 1.35,
            marginTop: 2,
          }}
        >
          {toast.message}
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        style={{
          width: 30,
          height: 30,
          border: 0,
          borderRadius: 999,
          background: '#f8fafc',
          color: COLORS.slate,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <CloseIcon style={{ fontSize: 17 }} />
      </button>
    </div>
  );
}

function TabPanel({ children, value, index }) {
  if (value !== index) return null;

  return <div style={S.panel}>{children}</div>;
}

function StatusChip({ active }) {
  return (
    <span
      style={{
        ...S.chip,
        background: active ? '#d4f5eb' : '#f8fafc',
        color: active ? '#057a55' : COLORS.slate,
        borderColor: active ? '#a8e8db' : '#e2e8f0',
      }}
    >
      <CheckCircleIcon style={{ fontSize: 15 }} />
      {active ? 'Đang mở' : 'Tạm đóng'}
    </span>
  );
}

function StudentsTab({ classroom }) {
  const students = classroom?.students || [];

  if (students.length === 0) {
    return (
      <div style={S.emptyBox}>
        <PeopleIcon style={{ fontSize: 48, opacity: 0.45, marginBottom: 10 }} />

        <div style={{ fontSize: '1.02rem', fontWeight: 900 }}>
          Chưa có học viên nào trong lớp.
        </div>

        <div style={{ marginTop: 6, color: COLORS.slate, fontSize: '.92rem' }}>
          Chia sẻ mã lớp <b>{classroom?.classCode}</b> để học viên tham gia.
        </div>
      </div>
    );
  }

  return (
    <TableContainer component={Paper} style={{ ...S.tablePaper, ...S.tableContainer }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow style={S.tableHeadRow}>
            <TableCell style={S.th}>#</TableCell>
            <TableCell style={S.th}>Họ tên</TableCell>
            <TableCell style={S.th}>Username</TableCell>
            <TableCell style={S.th}>Ngày tham gia</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {students.map((student, index) => (
            <TableRow key={student.accountId || index} hover>
              <TableCell style={S.td}>{index + 1}</TableCell>

              <TableCell style={S.td}>
                <Box display="flex" alignItems="center" style={{ gap: 9 }}>
                  <Avatar style={{ ...S.avatar, width: 32, height: 32 }}>
                    {(student.name || student.username || '?')[0].toUpperCase()}
                  </Avatar>

                  <span style={{ fontWeight: 900 }}>
                    {student.name || student.username}
                  </span>
                </Box>
              </TableCell>

              <TableCell style={S.td}>{student.username || '—'}</TableCell>

              <TableCell style={S.td}>{formatDate(student.joinedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ActivityTab({ classroomId }) {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classroomId) {
      setLoading(false);
      return;
    }

    classroomApi
      .getActivity(classroomId)
      .then((res) => {
        if (res.status === 200) {
          setActivity(res.data.activity || []);
        }
      })
      .catch(() => {
        setActivity([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [classroomId]);

  if (loading) {
    return (
      <div style={S.loadingBox}>
        <CircularProgress style={{ color: COLORS.mainDark }} size={42} />
      </div>
    );
  }

  if (activity.length === 0) {
    return (
      <div style={S.emptyBox}>
        <AssessmentIcon
          style={{ fontSize: 48, opacity: 0.45, marginBottom: 10 }}
        />

        <div style={{ fontSize: '1.02rem', fontWeight: 900 }}>
          Chưa có dữ liệu hoạt động.
        </div>
      </div>
    );
  }

  return (
    <TableContainer component={Paper} style={{ ...S.tablePaper, ...S.tableContainer }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow style={S.tableHeadRow}>
            <TableCell style={S.th}>#</TableCell>
            <TableCell style={S.th}>Học viên</TableCell>
            <TableCell style={S.th}>Bài đã nộp</TableCell>
            <TableCell style={S.th}>Tổng điểm</TableCell>
            <TableCell style={S.th}>Hoạt động gần nhất</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {activity.map((student, index) => (
            <TableRow key={student.accountId || index} hover>
              <TableCell style={S.td}>{index + 1}</TableCell>

              <TableCell style={S.td}>
                <Box display="flex" alignItems="center" style={{ gap: 9 }}>
                  <Avatar style={{ ...S.avatar, width: 32, height: 32 }}>
                    {(student.name || student.username || '?')[0].toUpperCase()}
                  </Avatar>

                  <div>
                    <div style={{ fontWeight: 900, lineHeight: 1.2 }}>
                      {student.name || student.username}
                    </div>

                    <div style={{ color: COLORS.slate, fontSize: '.82rem' }}>
                      {student.username}
                    </div>
                  </div>
                </Box>
              </TableCell>

              <TableCell style={S.td}>
                <span
                  style={{
                    ...S.chip,
                    padding: '4px 9px',
                    fontSize: '.82rem',
                    background:
                      student.submissionCount > 0 ? '#d4f5eb' : '#f8fafc',
                    color:
                      student.submissionCount > 0 ? '#057a55' : COLORS.slate,
                    borderColor:
                      student.submissionCount > 0 ? '#a8e8db' : '#e2e8f0',
                  }}
                >
                  {student.submissionCount} bài
                </span>
              </TableCell>

              <TableCell style={S.td}>
                {student.totalMaxScore > 0
                  ? `${student.totalScore} / ${student.totalMaxScore}`
                  : '—'}
              </TableCell>

              <TableCell style={S.td}>{formatDateTime(student.lastActive)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function WeeklyGradingTab({ classroomId, showToast }) {
  const now = new Date();

  const [weekNumber, setWeekNumber] = useState(getWeekNumber(now));
  const [year, setYear] = useState(now.getFullYear());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [evalForm, setEvalForm] = useState({
    teacherScore: '',
    teacherComment: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchReport = useCallback(() => {
    if (!classroomId) return;

    setLoading(true);

    classroomApi
      .getWeeklyReport(classroomId, weekNumber, year)
      .then((res) => {
        if (res.status === 200) {
          setReport(res.data);
        }
      })
      .catch(() => {
        setReport(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [classroomId, weekNumber, year]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleOpenEval = (student) => {
    setEditingStudent(student);
    setEvalForm({
      teacherScore: student.evaluation?.teacherScore ?? '',
      teacherComment: student.evaluation?.teacherComment ?? '',
    });
  };

  const handleSaveEval = async () => {
    if (!editingStudent) return;

    setSaving(true);

    try {
      await classroomApi.upsertWeeklyEvaluation(classroomId, {
        studentAccountId: editingStudent.accountId,
        studentName: editingStudent.name || editingStudent.username,
        weekNumber,
        year,
        teacherScore: evalForm.teacherScore,
        teacherComment: evalForm.teacherComment,
      });

      setEditingStudent(null);
      fetchReport();

      showToast(
        'success',
        'Đã lưu đánh giá',
        'Điểm và nhận xét tuần của học sinh đã được cập nhật.',
      );
    } catch {
      showToast(
        'error',
        'Không thể lưu đánh giá',
        'Vui lòng kiểm tra lại dữ liệu hoặc thử lại sau.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleExportExcel = async () => {
    if (!report) return;

    const xlsx = await import('xlsx');
    const assignments = report.assignments || [];

    const headerRow = [
      '#',
      'Họ tên',
      'Username',
      ...assignments.map(
        (assignment) =>
          assignment.assignmentTitle || assignment.title || 'Bài tập',
      ),
      'Tổng điểm',
      'Điểm GV',
      'Nhận xét GV',
    ];

    const dataRows = (report.report || []).map((student, index) => [
      index + 1,
      student.name || student.username,
      student.username,
      ...assignments.map((assignment) => {
        const studentAssignment = student.assignments?.find(
          (item) => item.assignmentId === assignment._id,
        );

        return studentAssignment?.submitted
          ? `${studentAssignment.score ?? 0}/${studentAssignment.maxScore ?? 0}`
          : 'Chưa nộp';
      }),
      student.totalMaxScore > 0
        ? `${student.totalScore}/${student.totalMaxScore}`
        : '—',
      student.evaluation?.teacherScore ?? '—',
      student.evaluation?.teacherComment ?? '',
    ]);

    const ws = xlsx.utils.aoa_to_sheet([headerRow, ...dataRows]);
    const wb = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(wb, ws, `Tuần ${weekNumber}`);
    xlsx.writeFile(wb, `BaoCao_Tuan${weekNumber}_${year}.xlsx`);

    showToast(
      'success',
      'Đã xuất Excel',
      'Báo cáo tuần đã được tải xuống thành công.',
    );
  };

  const weeks = Array.from({ length: 53 }, (_, index) => index + 1);
  const years = [2024, 2025, 2026, 2027];

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        style={{
          gap: 10,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
          <InputLabel>Tuần</InputLabel>

          <Select
            value={weekNumber}
            onChange={(event) => setWeekNumber(event.target.value)}
            label="Tuần"
          >
            {weeks.map((week) => (
              <MenuItem key={week} value={week}>
                Tuần {week}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" style={{ minWidth: 110 }}>
          <InputLabel>Năm</InputLabel>

          <Select
            value={year}
            onChange={(event) => setYear(event.target.value)}
            label="Năm"
          >
            {years.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <button
          type="button"
          style={{
            ...S.actionBtn,
            opacity: !report || loading ? 0.55 : 1,
            cursor: !report || loading ? 'not-allowed' : 'pointer',
          }}
          onClick={handleExportExcel}
          disabled={!report || loading}
        >
          <CloudDownloadIcon style={{ fontSize: 17 }} />
          Xuất Excel
        </button>

        <button
          type="button"
          style={S.actionBtn}
          onClick={fetchReport}
          disabled={loading}
        >
          <RefreshIcon style={{ fontSize: 17 }} />
          Làm mới
        </button>
      </Box>

      {loading ? (
        <div style={S.loadingBox}>
          <CircularProgress style={{ color: COLORS.mainDark }} size={42} />
        </div>
      ) : !report || report.report?.length === 0 ? (
        <div style={S.emptyBox}>
          <GradeIcon style={{ fontSize: 48, opacity: 0.45, marginBottom: 10 }} />

          <div style={{ fontSize: '1.02rem', fontWeight: 900 }}>
            Không có dữ liệu cho tuần này.
          </div>
        </div>
      ) : (
        <TableContainer component={Paper} style={{ ...S.tablePaper, ...S.tableContainer }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow style={S.tableHeadRow}>
                <TableCell style={S.th}>#</TableCell>
                <TableCell style={S.th}>Học viên</TableCell>

                {(report.assignments || []).map((assignment, index) => (
                  <TableCell key={index} align="center" style={S.th}>
                    {assignment.assignmentTitle || assignment.title || `Bài ${index + 1}`}
                  </TableCell>
                ))}

                <TableCell align="center" style={S.th}>
                  Tổng
                </TableCell>

                <TableCell align="center" style={S.th}>
                  Điểm GV
                </TableCell>

                <TableCell style={S.th}>Nhận xét</TableCell>

                <TableCell align="center" style={S.th}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {report.report.map((student, index) => (
                <TableRow key={student.accountId || index} hover>
                  <TableCell style={S.td}>{index + 1}</TableCell>

                  <TableCell style={{ ...S.td, whiteSpace: 'nowrap' }}>
                    <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                      <Avatar style={{ ...S.avatar, width: 30, height: 30 }}>
                        {(student.name || student.username || '?')[0].toUpperCase()}
                      </Avatar>

                      <span style={{ fontWeight: 900 }}>
                        {student.name || student.username}
                      </span>
                    </Box>
                  </TableCell>

                  {(student.assignments || []).map((assignment, index2) => (
                    <TableCell key={index2} align="center" style={S.td}>
                      {assignment.submitted ? (
                        <span
                          style={{
                            ...S.chip,
                            padding: '4px 8px',
                            fontSize: '.8rem',
                            background: '#d4f5eb',
                            color: '#057a55',
                            borderColor: '#a8e8db',
                          }}
                        >
                          {assignment.score ?? 0}/{assignment.maxScore ?? 0}
                        </span>
                      ) : (
                        <span
                          style={{
                            ...S.chip,
                            padding: '4px 8px',
                            fontSize: '.8rem',
                            background: '#f8fafc',
                            color: COLORS.slate,
                            borderColor: '#e2e8f0',
                          }}
                        >
                          Chưa nộp
                        </span>
                      )}
                    </TableCell>
                  ))}

                  <TableCell align="center" style={S.td}>
                    {student.totalMaxScore > 0
                      ? `${student.totalScore}/${student.totalMaxScore}`
                      : '—'}
                  </TableCell>

                  <TableCell align="center" style={S.td}>
                    {student.evaluation?.teacherScore != null ? (
                      <span
                        style={{
                          ...S.chip,
                          padding: '4px 10px',
                          fontSize: '.82rem',
                        }}
                      >
                        {student.evaluation.teacherScore}
                      </span>
                    ) : (
                      '—'
                    )}
                  </TableCell>

                  <TableCell style={{ ...S.td, maxWidth: 170 }}>
                    <Typography
                      variant="caption"
                      style={{
                        color: COLORS.slate,
                        fontFamily: GF,
                        fontWeight: 750,
                        fontSize: '.82rem',
                      }}
                      noWrap
                    >
                      {student.evaluation?.teacherComment || '—'}
                    </Typography>
                  </TableCell>

                  <TableCell align="center" style={S.td}>
                    <Tooltip title="Chấm điểm và nhận xét">
                      <IconButton size="small" onClick={() => handleOpenEval(student)}>
                        <EditIcon fontSize="small" style={{ color: COLORS.mainDark }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ style: S.dialogPaper }}
      >
        <DialogTitle style={S.dialogTitle}>
          <div style={{ fontWeight: 900, fontSize: '1.16rem' }}>
            Đánh giá học sinh
          </div>

          <div style={{ fontSize: '.9rem', color: '#d9fffa', marginTop: 3 }}>
            {editingStudent?.name || editingStudent?.username} · Tuần {weekNumber}/{year}
          </div>
        </DialogTitle>

        <DialogContent style={S.dialogContent}>
          <TextField
            label="Điểm giáo viên (0–10)"
            type="number"
            variant="outlined"
            fullWidth
            inputProps={{
              min: 0,
              max: 10,
              step: 0.5,
            }}
            value={evalForm.teacherScore}
            onChange={(event) =>
              setEvalForm((prev) => ({
                ...prev,
                teacherScore: event.target.value,
              }))
            }
            style={S.inputStyle}
          />

          <TextField
            label="Nhận xét"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={evalForm.teacherComment}
            onChange={(event) =>
              setEvalForm((prev) => ({
                ...prev,
                teacherComment: event.target.value,
              }))
            }
          />
        </DialogContent>

        <DialogActions style={S.dialogActions}>
          <Button
            onClick={() => setEditingStudent(null)}
            disabled={saving}
            style={{
              borderRadius: 999,
              fontFamily: GF,
              fontWeight: 900,
              color: COLORS.mainDark,
              textTransform: 'none',
            }}
          >
            Hủy
          </Button>

          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
            onClick={handleSaveEval}
            disabled={saving}
            style={{
              borderRadius: 999,
              background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
              color: '#fff',
              border: '3px solid #fff',
              fontFamily: GF,
              fontWeight: 900,
              boxShadow: '0 4px 0 #bd5f00',
              textTransform: 'none',
            }}
          >
            Lưu đánh giá
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function ClassroomDetailPage({ embedded = false, classroomId: classroomIdProp, onBack }) {
  const params = useParams();
  const history = useHistory();

  const classroomId = classroomIdProp || params.id;

  const [tab, setTab] = useState(0);
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showToast = (type, title, message) => {
    setToast({
      show: true,
      type,
      title,
      message,
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, 2400);
  };

  useEffect(() => {
    if (!classroomId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    classroomApi
      .getClassroomById(classroomId)
      .then((res) => {
        if (res.status === 200) {
          setClassroom(res.data.classroom);
        }
      })
      .catch(() => {
        setClassroom(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [classroomId]);

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    history.push('/classrooms');
  };

  if (loading) {
    return (
      <div style={embedded ? S.embeddedPage : S.page}>
        <div style={embedded ? S.embeddedWrapper : S.wrapper}>
          <div style={S.loadingBox}>
            <CircularProgress style={{ color: COLORS.mainDark }} size={46} />
          </div>
        </div>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div style={embedded ? S.embeddedPage : S.page}>
        <div style={embedded ? S.embeddedWrapper : S.wrapper}>
          <div style={S.notFound}>
            <SchoolIcon style={{ fontSize: 56, opacity: 0.35, marginBottom: 10 }} />

            <div style={{ fontSize: '1.02rem', marginBottom: 12 }}>
              Không tìm thấy lớp học hoặc bạn không có quyền truy cập.
            </div>

            <button type="button" style={S.primaryBtn} onClick={handleBack}>
              <ArrowBackIcon style={{ fontSize: 18 }} />
              Quay lại danh sách lớp
            </button>
          </div>
        </div>
      </div>
    );
  }

  const studentsCount = classroom.students?.length || 0;
  const active = classroom.status === 'active';

  return (
    <div style={embedded ? S.embeddedPage : S.page}>
      <div style={embedded ? S.embeddedWrapper : S.wrapper}>
        <TeacherToast
          toast={toast}
          onClose={() =>
            setToast((prev) => ({
              ...prev,
              show: false,
            }))
          }
        />

        <div style={S.hero}>
          <div style={S.heroDecor}>
            <SchoolIcon style={{ fontSize: 72 }} />
          </div>

          <div style={S.heroTop}>
            <button type="button" style={S.backBtn} onClick={handleBack}>
              <ArrowBackIcon style={{ fontSize: 22 }} />
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={S.title}>{classroom.name}</h1>

              <p style={S.desc}>
                Theo dõi học sinh, hoạt động học tập, điểm tuần và bài tập đã giao
                trong lớp.
              </p>

              <div style={S.chipsRow}>
                <span style={S.chip}>
                  <GradeIcon style={{ fontSize: 15 }} />
                  {classroom.level || 'Chưa chọn cấp độ'}
                </span>

                <StatusChip active={active} />

                <span style={S.chipYellow}>
                  <SchoolIcon style={{ fontSize: 15 }} />
                  Mã lớp: {classroom.classCode || '—'}
                </span>

                <span style={S.chip}>
                  <PeopleIcon style={{ fontSize: 15 }} />
                  {studentsCount} học viên
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={embedded ? { ...S.tabsWrap, minHeight: 0 } : S.tabsWrap}>
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            style={S.tabs}
          >
            <Tab
              icon={<PeopleIcon style={{ fontSize: 20 }} />}
              label="Học sinh"
              style={S.tabStyle(tab === 0)}
            />

            <Tab
              icon={<AssessmentIcon style={{ fontSize: 20 }} />}
              label="Hoạt động"
              style={S.tabStyle(tab === 1)}
            />

            <Tab
              icon={<GradeIcon style={{ fontSize: 20 }} />}
              label="Chấm điểm tuần"
              style={S.tabStyle(tab === 2)}
            />

            <Tab
              icon={<AssignmentIcon style={{ fontSize: 20 }} />}
              label="Bài tập"
              style={S.tabStyle(tab === 3)}
            />
          </Tabs>

          <TabPanel value={tab} index={0}>
            <div style={S.panelScroll}>
              <StudentsTab classroom={classroom} />
            </div>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <div style={S.panelScroll}>
              <ActivityTab classroomId={classroomId} />
            </div>
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <div style={S.panelScroll}>
              <WeeklyGradingTab classroomId={classroomId} showToast={showToast} />
            </div>
          </TabPanel>

          <TabPanel value={tab} index={3}>
            <AssignmentsTab classroom={classroom} />
          </TabPanel>
        </div>
      </div>
    </div>
  );
}

export default ClassroomDetailPage;