import React, { useEffect, useMemo, useState } from 'react';
import adminApi from 'apis/adminApi';
import RichTextEditor from '../../../pages/Admin/Users/RichTextEditor';

import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LinearProgress from '@material-ui/core/LinearProgress';
import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import PeopleIcon from '@material-ui/icons/People';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SchoolIcon from '@material-ui/icons/School';
import DoneIcon from '@material-ui/icons/Done';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { useHistory, useParams } from 'react-router-dom';
import courseApi from 'apis/courseApi';

const GF = '"Baloo 2","Nunito",sans-serif';

const LESSON_TYPES = [
  { value: 'video', label: 'Video + Bài tập' },
  { value: 'flashcard', label: 'Flashcard' },
  { value: 'quiz', label: 'Trắc nghiệm' },
  { value: 'fill_blank', label: 'Điền từ' },
  { value: 'text', label: 'Lý thuyết' },
  { value: 'mixed', label: 'Kết hợp' },
  { value: 'grammar', label: 'Bài học ngữ pháp' },
];

const GRADE_LEVELS_L = ['all', '1', '2', '3', '4', '5'];

const GRADE_LABELS_L = {
  all: 'Tất cả',
  1: 'Khối 1',
  2: 'Khối 2',
  3: 'Khối 3',
  4: 'Khối 4',
  5: 'Khối 5',
};

const MONTHS_L = [
  '',
  'T1',
  'T2',
  'T3',
  'T4',
  'T5',
  'T6',
  'T7',
  'T8',
  'T9',
  'T10',
  'T11',
  'T12',
];

const CHAPTER_PAGE_SIZE = 4;

const EMPTY_GRAMMAR_EX = () => ({
  question: '',
  type: 'mcq',
  options: ['', '', '', ''],
  answer: '',
  explanation: '',
});

const useStyle = makeStyles(() => ({
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
    color: '#07947f',
    opacity: 0.1,
    transform: 'rotate(-10deg)',
  },

  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 2,
  },

  backBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '3px solid #19c7a8 !important',
    borderRadius: '999px !important',
    padding: '9px 16px !important',
    fontSize: '.94rem !important',
    fontWeight: '900 !important',
    fontFamily: `${GF} !important`,
    textTransform: 'none !important',
    boxShadow: '0 4px 0 rgba(7,148,127,.18) !important',
    flexShrink: 0,
  },

  pageTitle: {
    fontSize: '1.9rem',
    fontWeight: 900,
    flex: 1,
    color: '#06434b',
    margin: 0,
    lineHeight: 1.12,
    letterSpacing: '-0.025em',
  },

  chipsRow: {
    display: 'flex',
    gap: 9,
    flexWrap: 'wrap',
    marginTop: 13,
  },

  heroChip: {
    height: 'auto !important',
    borderRadius: '999px !important',
    background: '#d4f5eb !important',
    color: '#057a55 !important',
    border: '2.5px solid #a8e8db !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    fontSize: '.86rem !important',
    padding: '4px 4px !important',
  },

  contentScroll: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    paddingRight: 4,
  },

  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 18,
  },

  sectionCard: {
    background: '#fff',
    borderRadius: 24,
    padding: 22,
    border: '3px solid #d6f3ed',
    boxShadow: '0 6px 0 rgba(7,148,127,.10), 0 14px 28px rgba(15,23,42,.07)',
    marginBottom: 18,
  },

  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#06434b',
    fontWeight: 900,
    fontSize: '1.28rem',
    margin: '0 0 16px',
    lineHeight: 1.2,
    flexWrap: 'wrap',
  },

  pendingCard: {
    background: 'linear-gradient(180deg,#fff8e1,#ffffff)',
    borderRadius: 24,
    padding: 22,
    border: '3px solid #ffcf45',
    boxShadow: '0 6px 0 rgba(189,120,0,.18), 0 14px 28px rgba(15,23,42,.07)',
    marginBottom: 18,
  },

  pendingTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#9b5c00',
    fontWeight: 900,
    fontSize: '1.22rem',
    margin: '0 0 14px',
    lineHeight: 1.2,
  },

  pendingList: {
    maxHeight: 245,
    overflowY: 'auto',
    paddingRight: 4,
  },

  pendingItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    padding: '13px 0',
    borderBottom: '2px solid rgba(255,207,69,.32)',
    '&:last-child': {
      borderBottom: 'none',
    },
  },

  pendingName: {
    fontSize: '1rem',
    fontWeight: 900,
    color: '#4b3300',
  },

  pendingMeta: {
    color: '#8a6400',
    fontSize: '.88rem',
    marginTop: 3,
    fontWeight: 750,
  },

  approveBtn: {
    background: 'linear-gradient(180deg,#36e27d,#0ca84f) !important',
    color: '#fff !important',
    border: '2.5px solid #fff !important',
    borderRadius: '999px !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    fontSize: '.86rem !important',
    textTransform: 'none !important',
    boxShadow: '0 4px 0 #087a3c !important',
  },

  rejectBtn: {
    background: 'linear-gradient(180deg,#ffffff,#fff3cd) !important',
    color: '#b84f00 !important',
    border: '2.5px solid #ffcf45 !important',
    borderRadius: '999px !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    fontSize: '.86rem !important',
    textTransform: 'none !important',
    boxShadow: '0 4px 0 rgba(184,79,0,.18) !important',
  },

  studentList: {
    maxHeight: 330,
    overflowY: 'auto',
    paddingRight: 4,
  },

  studentCard: {
    background: 'linear-gradient(180deg,#ffffff,#f8fffd)',
    borderRadius: 18,
    padding: '15px 16px',
    marginBottom: 12,
    border: '2.5px solid #d6f3ed',
    boxShadow: '0 4px 0 rgba(7,148,127,.08)',
    cursor: 'pointer',
    transition: 'transform .18s ease, box-shadow .18s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 0 rgba(7,148,127,.12)',
    },
  },

  studentCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },

  avatar: {
    background: 'linear-gradient(180deg,#19c7a8,#07947f) !important',
    width: '40px !important',
    height: '40px !important',
    fontSize: '1rem !important',
    fontWeight: '900 !important',
    border: '2.5px solid #fff',
    boxShadow: '0 3px 0 rgba(0,0,0,.12)',
    fontFamily: `${GF} !important`,
  },

  studentName: {
    fontWeight: 900,
    fontSize: '1.02rem',
    color: '#06434b',
    lineHeight: 1.25,
  },

  studentMeta: {
    fontSize: '.88rem',
    color: '#07545c',
    fontWeight: 750,
    marginTop: 3,
    lineHeight: 1.4,
  },

  progressLabel: {
    fontSize: '.96rem',
    fontWeight: 900,
    color: '#07947f',
    minWidth: 62,
    textAlign: 'right',
  },

  progressBar: {
    marginTop: 10,
    borderRadius: 999,
    height: '9px !important',
    backgroundColor: '#dff7f2 !important',
    '& .MuiLinearProgress-bar': {
      borderRadius: 999,
      background: 'linear-gradient(90deg,#19c7a8,#ffdf3b)',
    },
  },

  lessonProgressBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTop: '2px solid #eef7f5',
    maxHeight: 220,
    overflowY: 'auto',
  },

  lessonProgressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 0',
    borderBottom: '1px solid #eef7f5',
    fontSize: '.88rem',
    color: '#06434b',
    fontWeight: 750,
    '&:last-child': {
      borderBottom: 'none',
    },
  },

  refreshBtn: {
    marginLeft: 'auto !important',
    background: 'linear-gradient(180deg,#ffffff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '2.5px solid #19c7a8 !important',
    borderRadius: '999px !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    fontSize: '.86rem !important',
    textTransform: 'none !important',
  },

  emptyBox: {
    textAlign: 'center',
    padding: 34,
    color: '#07545c',
    border: '3px dashed #d6f3ed',
    borderRadius: 22,
    background: '#f7fffd',
    fontWeight: 850,
    fontSize: '1rem',
    lineHeight: 1.5,
  },

  accordion: {
    borderRadius: '20px !important',
    marginBottom: '14px !important',
    overflow: 'hidden',
    border: '3px solid #d6f3ed',
    boxShadow: '0 5px 0 rgba(7,148,127,.10), 0 12px 24px rgba(15,23,42,.06)',
    '&:before': {
      display: 'none',
    },
  },

  accordionSummary: {
    background: 'linear-gradient(180deg,#eefdf9,#ffffff) !important',
    padding: '7px 16px !important',
    minHeight: '60px !important',
  },

  chapterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },

  chapterLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 11,
    minWidth: 0,
  },

  chapterOrder: {
    background: 'linear-gradient(180deg,#19c7a8,#07947f)',
    color: '#fff',
    borderRadius: '50%',
    width: 38,
    height: 38,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: 900,
    flexShrink: 0,
    border: '3px solid #fff',
    boxShadow: '0 3px 0 rgba(0,0,0,.10)',
  },

  chapterTitle: {
    fontWeight: 900,
    fontSize: '1.08rem',
    color: '#06434b',
    lineHeight: 1.25,
  },

  chapterMeta: {
    color: '#07545c',
    fontSize: '.88rem',
    fontWeight: 750,
    marginLeft: 6,
  },

  iconBtn: {
    background: '#fff !important',
    border: '2.5px solid #d6f3ed !important',
    marginLeft: '4px !important',
    boxShadow: '0 3px 0 rgba(7,148,127,.08)',
  },

  iconBtnDelete: {
    background: '#fff1f1 !important',
    border: '2.5px solid #ffb7b7 !important',
    color: '#e53935 !important',
    marginLeft: '4px !important',
    boxShadow: '0 3px 0 rgba(141,22,22,.10)',
  },

  lessonItem: {
    borderRadius: '16px !important',
    border: '2px solid #eef7f5',
    marginBottom: 9,
    background: '#fff',
    padding: '8px 13px !important',
    boxShadow: '0 3px 0 rgba(7,148,127,.06)',
    '&:hover': {
      background: '#f3fffc',
      borderColor: '#19c7a8',
    },
  },

  lessonPrimary: {
    fontSize: '.96rem',
    fontWeight: 900,
    color: '#06434b',
    lineHeight: 1.25,
  },

  lessonSecondary: {
    fontSize: '.84rem',
    color: '#07545c',
    fontWeight: 750,
    lineHeight: 1.35,
  },

  addLessonBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '2.5px solid #19c7a8 !important',
    borderRadius: '999px !important',
    padding: '8px 16px !important',
    fontSize: '.9rem !important',
    fontWeight: '900 !important',
    fontFamily: `${GF} !important`,
    textTransform: 'none !important',
    boxShadow: '0 4px 0 rgba(7,148,127,.14) !important',
  },

  addChapterBtn: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00) !important',
    color: '#fff !important',
    border: '3px solid #fff !important',
    borderRadius: '999px !important',
    padding: '10px 20px !important',
    fontSize: '.96rem !important',
    fontWeight: '900 !important',
    fontFamily: `${GF} !important`,
    textTransform: 'none !important',
    boxShadow: '0 5px 0 #bd5f00 !important',
    marginTop: '6px !important',
  },

  pagination: {
    flexShrink: 0,
    marginTop: 14,
    padding: '11px 14px',
    background: '#f8fffd',
    borderRadius: 18,
    border: '2.5px solid #d6f3ed',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },

  pageText: {
    color: '#07545c',
    fontWeight: 850,
    fontSize: '.9rem',
  },

  pageBtns: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },

  pageBtn: {
    minWidth: '36px !important',
    width: '36px !important',
    height: '36px !important',
    borderRadius: '12px !important',
    border: '2.5px solid #19c7a8 !important',
    background: '#eefdf9 !important',
    color: '#056d5e !important',
    boxShadow: '0 3px 0 rgba(7,148,127,.14) !important',
  },

  dialogPaper: {
    borderRadius: '24px !important',
    border: '4px solid #19c7a8',
    boxShadow: '0 8px 0 #07947f, 0 18px 42px rgba(0,0,0,.20)',
    overflow: 'hidden',
    fontFamily: GF,
  },

  dialogTitle: {
    background: 'linear-gradient(180deg,#19c7a8,#07947f)',
    color: '#fff',
    fontFamily: GF,
    '& h2': {
      fontSize: '1.35rem',
      fontWeight: 900,
    },
  },

  dialogContent: {
    padding: '24px !important',
    background: '#f3fffc',
  },

  dialogActions: {
    padding: '16px 24px 22px !important',
    background: '#f3fffc',
  },

  formField: {
    marginBottom: '16px !important',
    width: '100%',
    '& label': {
      fontFamily: GF,
      fontSize: '.98rem',
      fontWeight: 850,
      color: '#06434b',
    },
    '& input': {
      fontFamily: GF,
      fontSize: '1rem',
      fontWeight: 750,
      color: '#06434b',
    },
    '& textarea': {
      fontFamily: GF,
      fontSize: '1rem',
      fontWeight: 750,
      color: '#06434b',
      lineHeight: 1.45,
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 14,
      background: '#fff',
      '& fieldset': {
        borderWidth: 2.5,
        borderColor: '#d6f3ed',
      },
      '&:hover fieldset': {
        borderColor: '#19c7a8',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#19c7a8',
      },
    },
  },

  formControl: {
    marginBottom: '16px !important',
    width: '100%',
    '& label': {
      fontFamily: GF,
      fontSize: '.98rem',
      fontWeight: 850,
      color: '#06434b',
    },
    '& .MuiSelect-root': {
      fontFamily: GF,
      fontSize: '1rem',
      fontWeight: 750,
      color: '#06434b',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 14,
      background: '#fff',
      '& fieldset': {
        borderWidth: 2.5,
        borderColor: '#d6f3ed',
      },
      '&:hover fieldset': {
        borderColor: '#19c7a8',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#19c7a8',
      },
    },
  },

  switchLabel: {
    '& .MuiFormControlLabel-label': {
      fontFamily: GF,
      fontSize: '1rem',
      fontWeight: 850,
      color: '#06434b',
    },
  },

  tabs: {
    marginBottom: 18,
    background: '#fff',
    borderRadius: 999,
    border: '2.5px solid #d6f3ed',
    padding: 4,
    '& .MuiTab-root': {
      fontFamily: GF,
      fontSize: '.92rem',
      fontWeight: 900,
      textTransform: 'none',
      borderRadius: 999,
      minHeight: 42,
    },
    '& .Mui-selected': {
      color: '#07947f !important',
    },
    '& .MuiTabs-indicator': {
      display: 'none',
    },
  },

  miniBox: {
    border: '2.5px solid #d6f3ed',
    borderRadius: 18,
    padding: 15,
    marginBottom: 13,
    background: '#fff',
    boxShadow: '0 4px 0 rgba(7,148,127,.08)',
  },

  miniTitle: {
    fontWeight: 900,
    color: '#06434b',
    fontSize: '1rem',
    marginBottom: 10,
  },

  cancelDialogBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '2.5px solid #19c7a8 !important',
    borderRadius: '999px !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    fontSize: '.92rem !important',
    padding: '8px 18px !important',
    textTransform: 'none !important',
  },

  saveDialogBtn: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00) !important',
    color: '#fff !important',
    border: '2.5px solid #fff !important',
    borderRadius: '999px !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    fontSize: '.92rem !important',
    padding: '8px 20px !important',
    textTransform: 'none !important',
    boxShadow: '0 5px 0 #bd5f00 !important',
  },

  loading: {
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#042b33',
  },

  notFound: {
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#042b33',
    color: '#fff',
    fontFamily: GF,
    fontSize: '1.1rem',
    fontWeight: 900,
  },
}));

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
          color: ok ? '#07947f' : '#e53935',
          flexShrink: 0,
        }}
      >
        {ok ? <CheckCircleIcon /> : <ErrorIcon />}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            color: ok ? '#06434b' : '#7f1d1d',
            fontSize: '.98rem',
            fontWeight: 900,
            lineHeight: 1.25,
          }}
        >
          {toast.title}
        </div>

        <div
          style={{
            color: '#64748b',
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
          color: '#64748b',
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

function ChapterForm({ open, onClose, onSubmit, initialData }) {
  const classes = useStyle();

  const [form, setForm] = useState({
    title: '',
    description: '',
    isFree: false,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        isFree: initialData.isFree || false,
      });
    } else {
      setForm({
        title: '',
        description: '',
        isFree: false,
      });
    }
  }, [initialData, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle className={classes.dialogTitle}>
        {initialData ? 'Sửa chương' : 'Thêm chương mới'}
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <TextField
          className={classes.formField}
          label="Tên chương *"
          value={form.title}
          onChange={(event) =>
            setForm({
              ...form,
              title: event.target.value,
            })
          }
          variant="outlined"
        />

        <TextField
          className={classes.formField}
          label="Mô tả"
          value={form.description}
          onChange={(event) =>
            setForm({
              ...form,
              description: event.target.value,
            })
          }
          variant="outlined"
          multiline
          minRows={3}
        />

        <FormControlLabel
          className={classes.switchLabel}
          control={
            <Switch
              checked={form.isFree}
              onChange={(event) =>
                setForm({
                  ...form,
                  isFree: event.target.checked,
                })
              }
              color="primary"
            />
          }
          label="Xem thử miễn phí"
        />
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose} className={classes.cancelDialogBtn}>
          Hủy
        </Button>

        <Button
          onClick={() => onSubmit(form)}
          variant="contained"
          className={classes.saveDialogBtn}
          disabled={!form.title.trim()}
        >
          {initialData ? 'Lưu' : 'Thêm chương'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function LessonForm({ open, onClose, onSubmit, initialData }) {
  const classes = useStyle();

  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({
    title: '',
    type: 'video',
    videoUrl: '',
    content: '',
    isFree: false,
    timeLimit: 0,
    hasExercise: true,
    words: [],
    questions: [],
    fillBlanks: [],
    gradeLevel: 'all',
    topic: '',
    module: '',
    weekNumber: '',
    month: '',
    year: new Date().getFullYear(),
    description: '',
    status: 'published',
    grammarExercises: [],
  });

  useEffect(() => {
    if (!open) return;

    if (initialData && initialData._id) {
      setForm({
        title: initialData.title || '',
        type: initialData.type || 'video',
        videoUrl: initialData.videoUrl || '',
        content: initialData.content || '',
        isFree: initialData.isFree || false,
        timeLimit: initialData.timeLimit || 0,
        hasExercise: initialData.hasExercise !== false,
        words: Array.isArray(initialData.words) ? initialData.words : [],
        questions: Array.isArray(initialData.questions)
          ? initialData.questions
          : [],
        fillBlanks: Array.isArray(initialData.fillBlanks)
          ? initialData.fillBlanks
          : [],
        gradeLevel: initialData.gradeLevel || 'all',
        topic: initialData.topic || '',
        module: initialData.module || '',
        weekNumber: initialData.weekNumber || '',
        month: initialData.month || '',
        year: initialData.year || new Date().getFullYear(),
        description: initialData.description || '',
        status: initialData.status || 'published',
        grammarExercises: Array.isArray(initialData.grammarExercises)
          ? initialData.grammarExercises
          : [],
      });
    } else {
      setForm({
        title: '',
        type: 'video',
        videoUrl: '',
        content: '',
        isFree: false,
        timeLimit: 0,
        hasExercise: true,
        words: [],
        questions: [],
        fillBlanks: [],
        gradeLevel: 'all',
        topic: '',
        module: '',
        weekNumber: '',
        month: '',
        year: new Date().getFullYear(),
        description: '',
        status: 'published',
        grammarExercises: [],
      });
    }

    setTab(0);
  }, [open, initialData?._id]);

  const isGrammar = form.type === 'grammar';

  const addWord = () =>
    setForm({
      ...form,
      words: [
        ...form.words,
        {
          word: '',
          mean: '',
          phonetic: '',
          picture: '',
          example: '',
        },
      ],
    });

  const updateWord = (index, field, value) => {
    const words = [...form.words];

    words[index] = {
      ...words[index],
      [field]: value,
    };

    setForm({
      ...form,
      words,
    });
  };

  const removeWord = (index) =>
    setForm({
      ...form,
      words: form.words.filter((_, idx) => idx !== index),
    });

  const addQuestion = () =>
    setForm({
      ...form,
      questions: [
        ...form.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctIndex: 0,
          explanation: '',
        },
      ],
    });

  const updateQuestion = (index, field, value) => {
    const questions = [...form.questions];

    questions[index] = {
      ...questions[index],
      [field]: value,
    };

    setForm({
      ...form,
      questions,
    });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const questions = [...form.questions];

    questions[questionIndex].options[optionIndex] = value;

    setForm({
      ...form,
      questions,
    });
  };

  const removeQuestion = (index) =>
    setForm({
      ...form,
      questions: form.questions.filter((_, idx) => idx !== index),
    });

  const addFillBlank = () =>
    setForm({
      ...form,
      fillBlanks: [
        ...form.fillBlanks,
        {
          sentence: '',
          correctAnswer: '',
          hint: '',
        },
      ],
    });

  const updateFillBlank = (index, field, value) => {
    const fillBlanks = [...form.fillBlanks];

    fillBlanks[index] = {
      ...fillBlanks[index],
      [field]: value,
    };

    setForm({
      ...form,
      fillBlanks,
    });
  };

  const removeFillBlank = (index) =>
    setForm({
      ...form,
      fillBlanks: form.fillBlanks.filter((_, idx) => idx !== index),
    });

  const addGrammarEx = (type) =>
    setForm((prev) => ({
      ...prev,
      grammarExercises: [
        ...prev.grammarExercises,
        {
          ...EMPTY_GRAMMAR_EX(),
          type,
          options: type === 'mcq' ? ['', '', '', ''] : [],
        },
      ],
    }));

  const updGrammarEx = (index, key, value) =>
    setForm((prev) => {
      const exercises = [...prev.grammarExercises];

      exercises[index] = {
        ...exercises[index],
        [key]: value,
      };

      return {
        ...prev,
        grammarExercises: exercises,
      };
    });

  const updGrammarOpt = (index, optionIndex, value) =>
    setForm((prev) => {
      const exercises = [...prev.grammarExercises];
      const options = [...exercises[index].options];

      options[optionIndex] = value;

      exercises[index] = {
        ...exercises[index],
        options,
      };

      return {
        ...prev,
        grammarExercises: exercises,
      };
    });

  const rmGrammarEx = (index) =>
    setForm((prev) => ({
      ...prev,
      grammarExercises: prev.grammarExercises.filter((_, idx) => idx !== index),
    }));

  const handleUploadImage = async (base64) => {
    const response = await adminApi.uploadGrammarImage(base64);
    const url = response.data?.url;

    if (!url) throw new Error('No URL');

    return url;
  };

  const getYoutubePreview = (url) => {
    if (!url) return '';

    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([^&\n?#]+)/,
    );

    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    if (url.includes('drive.google.com')) return url.replace('/view', '/preview');

    return url;
  };

  const showQuiz =
    !isGrammar &&
    (form.type === 'quiz' || form.type === 'video' || form.type === 'mixed');

  const showFlashcard =
    !isGrammar && (form.type === 'flashcard' || form.type === 'mixed');

  const showFillBlank =
    !isGrammar &&
    (form.type === 'fill_blank' || form.type === 'video' || form.type === 'mixed');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle className={classes.dialogTitle}>
        {initialData ? 'Sửa bài học' : 'Thêm bài học mới'}
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          className={classes.tabs}
        >
          <Tab label="Thông tin" />
          <Tab label={isGrammar ? 'Nội dung' : 'Video & Nội dung'} />
          <Tab label="Bài tập" />
        </Tabs>

        {tab === 0 && (
          <div>
            <TextField
              className={classes.formField}
              label="Tên bài học *"
              value={form.title}
              onChange={(event) =>
                setForm({
                  ...form,
                  title: event.target.value,
                })
              }
              variant="outlined"
            />

            <div style={{ marginBottom: 18 }}>
              <div className={classes.miniTitle}>Loại bài học</div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      type: 'video',
                    })
                  }
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    borderRadius: 14,
                    cursor: 'pointer',
                    fontWeight: 900,
                    fontSize: '.95rem',
                    fontFamily: GF,
                    border: `2.5px solid ${
                      !isGrammar ? '#19c7a8' : '#d6f3ed'
                    }`,
                    background: !isGrammar ? '#eefdf9' : '#fafafa',
                    color: !isGrammar ? '#06434b' : '#888',
                  }}
                >
                  Bài học từ vựng
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      type: 'grammar',
                    })
                  }
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    borderRadius: 14,
                    cursor: 'pointer',
                    fontWeight: 900,
                    fontSize: '.95rem',
                    fontFamily: GF,
                    border: `2.5px solid ${
                      isGrammar ? '#19c7a8' : '#d6f3ed'
                    }`,
                    background: isGrammar ? '#eefdf9' : '#fafafa',
                    color: isGrammar ? '#06434b' : '#888',
                  }}
                >
                  Bài học ngữ pháp
                </button>
              </div>
            </div>

            {isGrammar ? (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel>Khối lớp</InputLabel>

                    <Select
                      value={form.gradeLevel}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          gradeLevel: event.target.value,
                        })
                      }
                      label="Khối lớp"
                    >
                      {GRADE_LEVELS_L.map((grade) => (
                        <MenuItem key={grade} value={grade}>
                          {GRADE_LABELS_L[grade]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel>Trạng thái</InputLabel>

                    <Select
                      value={form.status}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          status: event.target.value,
                        })
                      }
                      label="Trạng thái"
                    >
                      <MenuItem value="published">Đã xuất bản</MenuItem>
                      <MenuItem value="draft">Nháp</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <TextField
                    label="Chủ điểm ngữ pháp"
                    value={form.topic}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        topic: event.target.value,
                      })
                    }
                    variant="outlined"
                    className={classes.formField}
                    placeholder="VD: Động từ To Be"
                  />

                  <TextField
                    label="Module / Unit"
                    value={form.module}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        module: event.target.value,
                      })
                    }
                    variant="outlined"
                    className={classes.formField}
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <TextField
                    label="Tuần"
                    type="number"
                    value={form.weekNumber}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        weekNumber: event.target.value,
                      })
                    }
                    variant="outlined"
                    className={classes.formField}
                  />

                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel>Tháng</InputLabel>

                    <Select
                      value={form.month}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          month: event.target.value,
                        })
                      }
                      label="Tháng"
                    >
                      <MenuItem value="">—</MenuItem>

                      {MONTHS_L.slice(1).map((month, index) => (
                        <MenuItem key={index + 1} value={index + 1}>
                          {month}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Năm"
                    type="number"
                    value={form.year}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        year: Number(event.target.value),
                      })
                    }
                    variant="outlined"
                    className={classes.formField}
                  />
                </div>

                <TextField
                  label="Mô tả ngắn"
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  variant="outlined"
                  className={classes.formField}
                />

                <FormControlLabel
                  className={classes.switchLabel}
                  control={
                    <Switch
                      checked={form.isFree}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          isFree: event.target.checked,
                        })
                      }
                      color="primary"
                    />
                  }
                  label="Xem thử miễn phí"
                />
              </>
            ) : (
              <>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel>Loại bài học</InputLabel>

                  <Select
                    value={form.type}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        type: event.target.value,
                      })
                    }
                    label="Loại bài học"
                  >
                    <MenuItem value="video">Video bài giảng + Bài tập</MenuItem>
                    <MenuItem value="quiz">Chỉ trắc nghiệm</MenuItem>
                    <MenuItem value="fill_blank">Chỉ điền từ</MenuItem>
                    <MenuItem value="flashcard">Chỉ flashcard từ vựng</MenuItem>
                    <MenuItem value="mixed">Kết hợp nhiều loại</MenuItem>
                    <MenuItem value="text">Chỉ lý thuyết/tài liệu</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  className={classes.formField}
                  label="Thời gian làm bài (phút, 0 = không giới hạn)"
                  type="number"
                  value={form.timeLimit}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      timeLimit: Number(event.target.value),
                    })
                  }
                  variant="outlined"
                />

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <FormControlLabel
                    className={classes.switchLabel}
                    control={
                      <Switch
                        checked={form.isFree}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            isFree: event.target.checked,
                          })
                        }
                        color="primary"
                      />
                    }
                    label="Xem thử miễn phí"
                  />

                  <FormControlLabel
                    className={classes.switchLabel}
                    control={
                      <Switch
                        checked={form.hasExercise}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            hasExercise: event.target.checked,
                          })
                        }
                        color="primary"
                      />
                    }
                    label="Có bài tập"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {tab === 1 && (
          <div>
            <div className={classes.miniTitle}>Video bài giảng</div>

            <p
              style={{
                color: '#07545c',
                fontSize: '.94rem',
                fontWeight: 750,
                marginBottom: 12,
              }}
            >
              Dán link YouTube hoặc Google Drive. Drive cần bật “Anyone with the
              link can view”.
            </p>

            <TextField
              className={classes.formField}
              label="Link video"
              value={form.videoUrl}
              onChange={(event) =>
                setForm({
                  ...form,
                  videoUrl: event.target.value,
                })
              }
              variant="outlined"
              placeholder="https://www.youtube.com/watch?v=..."
            />

            {form.videoUrl && getYoutubePreview(form.videoUrl) && (
              <div
                style={{
                  marginBottom: 20,
                  borderRadius: 18,
                  overflow: 'hidden',
                  maxWidth: 560,
                  position: 'relative',
                  paddingTop: '32%',
                  border: '3px solid #d6f3ed',
                }}
              >
                <iframe
                  src={getYoutubePreview(form.videoUrl)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allowFullScreen
                  title="preview"
                />
              </div>
            )}

            <div className={classes.miniTitle}>Nội dung lý thuyết</div>

            <RichTextEditor
              key={initialData?._id || form.type || '__new__'}
              value={form.content}
              onChange={(value) =>
                setForm({
                  ...form,
                  content: value,
                })
              }
              onUploadImage={handleUploadImage}
            />
          </div>
        )}

        {tab === 2 && (
          <div>
            {isGrammar ? (
              <>
                <div className={classes.miniTitle}>
                  Bài tập ({form.grammarExercises.length} câu)
                </div>

                {form.grammarExercises.map((exercise, index) => (
                  <div key={index} className={classes.miniBox}>
                    <div
                      style={{
                        display: 'flex',
                        gap: 10,
                        alignItems: 'flex-start',
                        marginBottom: 12,
                      }}
                    >
                      <FormControl
                        variant="outlined"
                        size="small"
                        style={{ minWidth: 150, flexShrink: 0 }}
                      >
                        <InputLabel>Loại</InputLabel>

                        <Select
                          value={exercise.type}
                          onChange={(event) =>
                            updGrammarEx(index, 'type', event.target.value)
                          }
                          label="Loại"
                        >
                          <MenuItem value="mcq">Trắc nghiệm</MenuItem>
                          <MenuItem value="fill_blank">Điền từ</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        label="Câu hỏi *"
                        value={exercise.question}
                        onChange={(event) =>
                          updGrammarEx(index, 'question', event.target.value)
                        }
                        variant="outlined"
                        size="small"
                        style={{ flex: 1 }}
                        multiline
                      />

                      <IconButton
                        size="small"
                        className={classes.iconBtnDelete}
                        onClick={() => rmGrammarEx(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>

                    {exercise.type === 'mcq' && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: 10,
                          marginBottom: 12,
                        }}
                      >
                        {(exercise.options || ['', '', '', '']).map(
                          (option, optionIndex) => (
                            <TextField
                              key={optionIndex}
                              label={`Đáp án ${optionIndex + 1}`}
                              value={option}
                              onChange={(event) =>
                                updGrammarOpt(
                                  index,
                                  optionIndex,
                                  event.target.value,
                                )
                              }
                              variant="outlined"
                              size="small"
                            />
                          ),
                        )}
                      </div>
                    )}

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 12,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 900,
                            color: '#06434b',
                            fontSize: '.92rem',
                            marginBottom: 8,
                          }}
                        >
                          Đáp án đúng
                        </div>

                        {exercise.type === 'mcq' ? (
                          <FormControl
                            variant="outlined"
                            size="small"
                            style={{ width: '100%' }}
                          >
                            <Select
                              value={exercise.answer}
                              onChange={(event) =>
                                updGrammarEx(index, 'answer', event.target.value)
                              }
                              displayEmpty
                              renderValue={(value) =>
                                value || '— Chọn đáp án đúng —'
                              }
                            >
                              <MenuItem value="">— Chọn đáp án đúng —</MenuItem>

                              {(exercise.options || [])
                                .filter((option) => option.trim())
                                .map((option, optionIndex) => (
                                  <MenuItem key={optionIndex} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <TextField
                            value={exercise.answer}
                            onChange={(event) =>
                              updGrammarEx(index, 'answer', event.target.value)
                            }
                            variant="outlined"
                            size="small"
                            style={{ width: '100%' }}
                          />
                        )}
                      </div>

                      <TextField
                        label="Giải thích"
                        value={exercise.explanation}
                        onChange={(event) =>
                          updGrammarEx(index, 'explanation', event.target.value)
                        }
                        variant="outlined"
                        size="small"
                      />
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => addGrammarEx('mcq')}
                    className={classes.addLessonBtn}
                  >
                    Thêm trắc nghiệm
                  </Button>

                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => addGrammarEx('fill_blank')}
                    className={classes.addLessonBtn}
                  >
                    Thêm điền từ
                  </Button>
                </div>
              </>
            ) : form.type === 'text' ? (
              <div className={classes.emptyBox}>
                Bài “Chỉ lý thuyết” không cần bài tập. Chuyển sang loại khác nếu
                muốn thêm bài tập.
              </div>
            ) : (
              <>
                {showFlashcard && (
                  <div style={{ marginBottom: 22 }}>
                    <div className={classes.miniTitle}>
                      Flashcard từ vựng ({form.words.length} từ)
                    </div>

                    {form.words.map((word, index) => (
                      <div key={index} className={classes.miniBox}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 10,
                          }}
                        >
                          <div className={classes.miniTitle}>Từ {index + 1}</div>

                          <IconButton
                            size="small"
                            onClick={() => removeWord(index)}
                            className={classes.iconBtnDelete}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 12,
                          }}
                        >
                          <TextField
                            label="Từ vựng *"
                            value={word.word}
                            onChange={(event) =>
                              updateWord(index, 'word', event.target.value)
                            }
                            variant="outlined"
                            size="small"
                            className={classes.formField}
                          />

                          <TextField
                            label="Nghĩa *"
                            value={word.mean}
                            onChange={(event) =>
                              updateWord(index, 'mean', event.target.value)
                            }
                            variant="outlined"
                            size="small"
                            className={classes.formField}
                          />

                          <TextField
                            label="Phiên âm"
                            value={word.phonetic}
                            onChange={(event) =>
                              updateWord(index, 'phonetic', event.target.value)
                            }
                            variant="outlined"
                            size="small"
                            className={classes.formField}
                          />

                          <TextField
                            label="Ví dụ"
                            value={word.example}
                            onChange={(event) =>
                              updateWord(index, 'example', event.target.value)
                            }
                            variant="outlined"
                            size="small"
                            className={classes.formField}
                          />
                        </div>

                        <TextField
                          label="Link ảnh"
                          value={word.picture}
                          onChange={(event) =>
                            updateWord(index, 'picture', event.target.value)
                          }
                          variant="outlined"
                          size="small"
                          className={classes.formField}
                        />
                      </div>
                    ))}

                    <Button
                      startIcon={<AddIcon />}
                      onClick={addWord}
                      className={classes.addLessonBtn}
                    >
                      Thêm từ
                    </Button>
                  </div>
                )}

                {showQuiz && (
                  <div style={{ marginBottom: 22 }}>
                    <div className={classes.miniTitle}>
                      Câu hỏi trắc nghiệm ({form.questions.length} câu)
                    </div>

                    {form.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className={classes.miniBox}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 10,
                          }}
                        >
                          <div className={classes.miniTitle}>
                            Câu {questionIndex + 1}
                          </div>

                          <IconButton
                            size="small"
                            onClick={() => removeQuestion(questionIndex)}
                            className={classes.iconBtnDelete}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>

                        <TextField
                          label="Câu hỏi *"
                          value={question.question}
                          onChange={(event) =>
                            updateQuestion(
                              questionIndex,
                              'question',
                              event.target.value,
                            )
                          }
                          variant="outlined"
                          size="small"
                          className={classes.formField}
                          multiline
                        />

                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            style={{
                              display: 'flex',
                              gap: 10,
                              alignItems: 'center',
                              marginBottom: 10,
                            }}
                          >
                            <input
                              type="radio"
                              name={`q${questionIndex}`}
                              checked={question.correctIndex === optionIndex}
                              onChange={() =>
                                updateQuestion(
                                  questionIndex,
                                  'correctIndex',
                                  optionIndex,
                                )
                              }
                              style={{
                                cursor: 'pointer',
                                width: 18,
                                height: 18,
                              }}
                            />

                            <span
                              style={{
                                minWidth: 30,
                                fontWeight: 900,
                                color: '#06434b',
                                fontSize: '.96rem',
                              }}
                            >
                              {['A', 'B', 'C', 'D'][optionIndex]}.
                            </span>

                            <TextField
                              label={`Đáp án ${
                                ['A', 'B', 'C', 'D'][optionIndex]
                              }`}
                              value={option}
                              onChange={(event) =>
                                updateOption(
                                  questionIndex,
                                  optionIndex,
                                  event.target.value,
                                )
                              }
                              variant="outlined"
                              size="small"
                              className={classes.formField}
                              style={{ marginBottom: 0 }}
                            />
                          </div>
                        ))}

                        <TextField
                          label="Giải thích đáp án"
                          value={question.explanation}
                          onChange={(event) =>
                            updateQuestion(
                              questionIndex,
                              'explanation',
                              event.target.value,
                            )
                          }
                          variant="outlined"
                          size="small"
                          className={classes.formField}
                        />
                      </div>
                    ))}

                    <Button
                      startIcon={<AddIcon />}
                      onClick={addQuestion}
                      className={classes.addLessonBtn}
                    >
                      Thêm câu hỏi
                    </Button>
                  </div>
                )}

                {showFillBlank && (
                  <div>
                    <div className={classes.miniTitle}>
                      Câu điền từ ({form.fillBlanks.length} câu)
                    </div>

                    {form.fillBlanks.map((fillBlank, index) => (
                      <div key={index} className={classes.miniBox}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 10,
                          }}
                        >
                          <div className={classes.miniTitle}>
                            Câu {index + 1}
                          </div>

                          <IconButton
                            size="small"
                            onClick={() => removeFillBlank(index)}
                            className={classes.iconBtnDelete}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>

                        <TextField
                          label="Câu có chỗ trống *"
                          value={fillBlank.sentence}
                          onChange={(event) =>
                            updateFillBlank(
                              index,
                              'sentence',
                              event.target.value,
                            )
                          }
                          variant="outlined"
                          size="small"
                          className={classes.formField}
                          placeholder="She ___ to school every day."
                          multiline
                        />

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 12,
                          }}
                        >
                          <TextField
                            label="Đáp án đúng *"
                            value={fillBlank.correctAnswer}
                            onChange={(event) =>
                              updateFillBlank(
                                index,
                                'correctAnswer',
                                event.target.value,
                              )
                            }
                            variant="outlined"
                            size="small"
                            className={classes.formField}
                          />

                          <TextField
                            label="Gợi ý"
                            value={fillBlank.hint}
                            onChange={(event) =>
                              updateFillBlank(index, 'hint', event.target.value)
                            }
                            variant="outlined"
                            size="small"
                            className={classes.formField}
                          />
                        </div>
                      </div>
                    ))}

                    <Button
                      startIcon={<AddIcon />}
                      onClick={addFillBlank}
                      className={classes.addLessonBtn}
                    >
                      Thêm câu điền từ
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose} className={classes.cancelDialogBtn}>
          Hủy
        </Button>

        <Button
          onClick={() => onSubmit(form)}
          variant="contained"
          className={classes.saveDialogBtn}
          disabled={!form.title.trim()}
        >
          {initialData ? 'Lưu thay đổi' : 'Thêm bài học'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function TeacherCourseDetail({ embedded = false, courseId: courseIdProp, onBack }) {
  const classes = useStyle();
  const params = useParams();
  const history = useHistory();

  const courseId = courseIdProp || params.id;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [chapterDialog, setChapterDialog] = useState({
    open: false,
    data: null,
  });

  const [lessonDialog, setLessonDialog] = useState({
    open: false,
    data: null,
    chapterId: null,
  });

  const [pendingList, setPendingList] = useState([]);
  const [studentsProgress, setStudentsProgress] = useState([]);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [chapterPage, setChapterPage] = useState(1);

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
    }, 2600);
  };

  const loadCourse = async () => {
    setLoading(true);

    try {
      const res = await courseApi.getCourseDetail(courseId);

      if (res.status === 200) {
        setCourse(res.data.course);
      }
    } catch {
      setCourse(null);
    }

    setLoading(false);
  };

  const loadPending = async () => {
    try {
      const res = await courseApi.getPendingEnrollments();

      if (res.status === 200) {
        const filtered = (res.data.list || []).filter((enrollment) => {
          const currentCourseId = enrollment.courseId?._id || enrollment.courseId;

          return (
            currentCourseId === courseId ||
            currentCourseId?.toString() === courseId
          );
        });

        setPendingList(filtered);
      }
    } catch {
      setPendingList([]);
    }
  };

  const loadStudentsProgress = async () => {
    try {
      const res = await courseApi.getStudentsProgress(courseId);

      if (res.status === 200) {
        setStudentsProgress(res.data.students || []);
      }
    } catch {
      setStudentsProgress([]);
    }
  };

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    loadCourse();
    loadPending();
    loadStudentsProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    setChapterPage(1);
  }, [course?.chapters?.length]);

  const handleApprove = async (enrollmentId) => {
    try {
      await courseApi.approveEnrollment(enrollmentId);

      setPendingList((prev) =>
        prev.filter((enrollment) => enrollment._id !== enrollmentId),
      );

      showToast(
        'success',
        'Đã duyệt học viên',
        'Học viên đã được thêm vào khóa học.',
      );
    } catch {
      showToast('error', 'Không thể duyệt', 'Vui lòng thử lại sau.');
    }
  };

  const handleReject = async (enrollmentId) => {
    try {
      await courseApi.rejectEnrollment(enrollmentId);

      setPendingList((prev) =>
        prev.filter((enrollment) => enrollment._id !== enrollmentId),
      );

      showToast(
        'delete',
        'Đã từ chối học viên',
        'Yêu cầu tham gia khóa học đã được xử lý.',
      );
    } catch {
      showToast('error', 'Không thể từ chối', 'Vui lòng thử lại sau.');
    }
  };

  const handleChapterSubmit = async (formData) => {
    try {
      if (chapterDialog.data) {
        await courseApi.updateChapter(
          courseId,
          chapterDialog.data._id,
          formData,
        );

        showToast(
          'success',
          'Cập nhật chương thành công',
          'Thông tin chương đã được lưu lại.',
        );
      } else {
        await courseApi.createChapter(courseId, formData);

        showToast(
          'success',
          'Thêm chương thành công',
          'Chương mới đã được thêm vào khóa học.',
        );
      }

      setChapterDialog({
        open: false,
        data: null,
      });

      loadCourse();
    } catch {
      showToast('error', 'Có lỗi xảy ra', 'Không thể lưu chương.');
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm('Xóa chương này sẽ xóa tất cả bài học bên trong. Tiếp tục?')) {
      return;
    }

    try {
      await courseApi.deleteChapter(courseId, chapterId);

      showToast(
        'delete',
        'Xóa chương thành công',
        'Chương đã được xóa khỏi khóa học.',
      );

      loadCourse();
    } catch {
      showToast('error', 'Lỗi xóa chương', 'Vui lòng thử lại sau.');
    }
  };

  const handleLessonSubmit = async (formData) => {
    try {
      if (lessonDialog.data) {
        await courseApi.updateLesson(courseId, lessonDialog.data._id, formData);

        showToast(
          'success',
          'Cập nhật bài học thành công',
          'Bài học đã được lưu lại.',
        );
      } else {
        await courseApi.createLesson(courseId, lessonDialog.chapterId, formData);

        showToast(
          'success',
          'Thêm bài học thành công',
          'Bài học mới đã được thêm vào chương.',
        );
      }

      setLessonDialog({
        open: false,
        data: null,
        chapterId: null,
      });

      loadCourse();
    } catch {
      showToast('error', 'Có lỗi xảy ra', 'Không thể lưu bài học.');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài học này?')) return;

    try {
      await courseApi.deleteLesson(courseId, lessonId);

      showToast(
        'delete',
        'Xóa bài học thành công',
        'Bài học đã được xóa khỏi chương.',
      );

      loadCourse();
    } catch {
      showToast('error', 'Lỗi xóa bài học', 'Vui lòng thử lại sau.');
    }
  };

  const chapters = course?.chapters || [];
  const totalChapterPages = Math.max(
    1,
    Math.ceil(chapters.length / CHAPTER_PAGE_SIZE),
  );

  const visibleChapters = useMemo(() => {
    const start = (chapterPage - 1) * CHAPTER_PAGE_SIZE;

    return chapters.slice(start, start + CHAPTER_PAGE_SIZE);
  }, [chapters, chapterPage]);

  if (loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress style={{ color: '#fff' }} size={50} thickness={5} />
      </div>
    );
  }

  if (!course) {
    return <div className={classes.notFound}>Không tìm thấy khóa học.</div>;
  }

  return (
    <div className={embedded ? classes.embeddedPage : classes.page}>
      <div className={embedded ? classes.embeddedWrapper : classes.wrapper}>
        <TeacherToast
          toast={toast}
          onClose={() =>
            setToast((prev) => ({
              ...prev,
              show: false,
            }))
          }
        />

        <div className={classes.hero}>
          <div className={classes.heroDecor}>
            <SchoolIcon style={{ fontSize: 72 }} />
          </div>

          <div className={classes.header}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                if (onBack) {
                  onBack();
                  return;
                }

                history.push('/teacher/courses');
              }}
              className={classes.backBtn}
            >
              Quay lại
            </Button>

            <div style={{ flex: 1, minWidth: 280 }}>
              <h1 className={classes.pageTitle}>{course.title}</h1>

              <div className={classes.chipsRow}>
                <Chip className={classes.heroChip} label={course.level || '—'} />

                <Chip
                  className={classes.heroChip}
                  label={course.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                />

                <Chip
                  className={classes.heroChip}
                  label={`${course.totalChapters || 0} chương`}
                />

                <Chip
                  className={classes.heroChip}
                  label={`${course.totalLessons || 0} bài học`}
                />

                <Chip
                  className={classes.heroChip}
                  label={`${course.totalStudents || 0} học viên`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={embedded ? classes.contentScroll : undefined}>
          <div className={classes.mainGrid}>
            {pendingList.length > 0 && (
              <div className={classes.pendingCard}>
                <div className={classes.pendingTitle}>
                  <PeopleIcon />
                  Học viên chờ duyệt ({pendingList.length} người)
                </div>

                <div className={classes.pendingList}>
                  {pendingList.map((enrollment) => (
                    <div key={enrollment._id} className={classes.pendingItem}>
                      <div>
                        <div className={classes.pendingName}>
                          {enrollment.studentName}
                        </div>

                        <div className={classes.pendingMeta}>
                          Xin vào: {enrollment.courseId?.title || 'Khóa học này'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <Button
                          size="small"
                          variant="contained"
                          className={classes.approveBtn}
                          startIcon={<CheckIcon />}
                          onClick={() => handleApprove(enrollment._id)}
                        >
                          Duyệt
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          className={classes.rejectBtn}
                          startIcon={<CloseIcon />}
                          onClick={() => handleReject(enrollment._id)}
                        >
                          Từ chối
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={classes.sectionCard}>
              <div className={classes.sectionTitle}>
                <SchoolIcon />
                Học sinh đã đăng ký ({studentsProgress.length} người)

                <Button
                  size="small"
                  variant="outlined"
                  className={classes.refreshBtn}
                  onClick={loadStudentsProgress}
                >
                  Làm mới
                </Button>
              </div>

              {studentsProgress.length === 0 ? (
                <div className={classes.emptyBox}>
                  Chưa có học sinh nào đăng ký khóa học này.
                </div>
              ) : (
                <div className={classes.studentList}>
                  {studentsProgress.map((student) => (
                    <div
                      key={student.studentAccountId}
                      className={classes.studentCard}
                      onClick={() =>
                        setExpandedStudent(
                          expandedStudent === student.studentAccountId
                            ? null
                            : student.studentAccountId,
                        )
                      }
                    >
                      <div className={classes.studentCardHeader}>
                        <Avatar className={classes.avatar}>
                          {student.studentName
                            ? student.studentName[0].toUpperCase()
                            : '?'}
                        </Avatar>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className={classes.studentName}>
                            {student.studentName}
                          </div>

                          <div className={classes.studentMeta}>
                            Hoàn thành: {student.completedLessons}/
                            {student.totalLessons} bài ·{' '}
                            {student.progressPercent}% · Đăng ký:{' '}
                            {student.enrolledAt
                              ? new Date(student.enrolledAt).toLocaleDateString(
                                  'vi-VN',
                                )
                              : '—'}
                          </div>
                        </div>

                        <div
                          className={classes.progressLabel}
                          style={{
                            color:
                              student.progressPercent === 100
                                ? '#0ca84f'
                                : '#07947f',
                          }}
                        >
                          {student.progressPercent === 100
                            ? 'Xong'
                            : `${student.progressPercent}%`}
                        </div>
                      </div>

                      <LinearProgress
                        className={classes.progressBar}
                        variant="determinate"
                        value={student.progressPercent}
                      />

                      <Collapse in={expandedStudent === student.studentAccountId}>
                        <div className={classes.lessonProgressBox}>
                          <div
                            style={{
                              fontWeight: 900,
                              fontSize: '.98rem',
                              marginBottom: 8,
                              color: '#06434b',
                            }}
                          >
                            Chi tiết từng bài:
                          </div>

                          {student.lessons.map((lesson) => (
                            <div
                              key={lesson.lessonId}
                              className={classes.lessonProgressRow}
                            >
                              {lesson.status === 'completed' ? (
                                <DoneIcon
                                  style={{ color: '#4caf50', fontSize: 18 }}
                                />
                              ) : lesson.status === 'in_progress' ? (
                                <HourglassEmptyIcon
                                  style={{ color: '#ff9800', fontSize: 18 }}
                                />
                              ) : (
                                <FiberManualRecordIcon
                                  style={{ color: '#ccc', fontSize: 16 }}
                                />
                              )}

                              <span style={{ flex: 1 }}>
                                Bài {lesson.lessonOrder}: {lesson.lessonTitle}
                              </span>

                              <span
                                style={{
                                  fontSize: '.84rem',
                                  color:
                                    lesson.status === 'completed'
                                      ? '#4caf50'
                                      : lesson.status === 'in_progress'
                                      ? '#ff9800'
                                      : '#aaa',
                                  fontWeight: 900,
                                }}
                              >
                                {lesson.status === 'completed'
                                  ? 'Hoàn thành'
                                  : lesson.status === 'in_progress'
                                  ? 'Đang học'
                                  : 'Chưa học'}
                              </span>

                              {lesson.completedAt && (
                                <span
                                  style={{
                                    fontSize: '.82rem',
                                    color: '#888',
                                    marginLeft: 6,
                                  }}
                                >
                                  {new Date(lesson.completedAt).toLocaleDateString(
                                    'vi-VN',
                                  )}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </Collapse>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={classes.sectionCard}>
              <div className={classes.sectionTitle}>
                Danh sách chương và bài học
              </div>

              {!chapters || chapters.length === 0 ? (
                <div className={classes.emptyBox}>
                  <p style={{ margin: 0 }}>Khóa học chưa có chương nào.</p>

                  <p style={{ margin: '8px 0 0', color: '#087565' }}>
                    Hãy thêm chương đầu tiên.
                  </p>
                </div>
              ) : (
                visibleChapters.map((chapter) => (
                  <Accordion
                    key={chapter._id}
                    defaultExpanded
                    className={classes.accordion}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      className={classes.accordionSummary}
                    >
                      <div className={classes.chapterHeader}>
                        <div className={classes.chapterLeft}>
                          <span className={classes.chapterOrder}>
                            {chapter.order}
                          </span>

                          <div>
                            <span className={classes.chapterTitle}>
                              {chapter.title}
                            </span>

                            <span className={classes.chapterMeta}>
                              ({chapter.lessons?.length || 0} bài)
                            </span>

                            {chapter.isFree && (
                              <Chip
                                size="small"
                                label="Xem thử"
                                style={{
                                  marginLeft: 8,
                                  backgroundColor: '#d4f5eb',
                                  color: '#057a55',
                                  fontSize: '.78rem',
                                  fontWeight: 900,
                                  fontFamily: GF,
                                }}
                              />
                            )}
                          </div>
                        </div>

                        <div
                          style={{ display: 'flex', gap: 4 }}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <IconButton
                            size="small"
                            className={classes.iconBtn}
                            onClick={() =>
                              setChapterDialog({
                                open: true,
                                data: chapter,
                              })
                            }
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            className={classes.iconBtnDelete}
                            onClick={() => handleDeleteChapter(chapter._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                    </AccordionSummary>

                    <AccordionDetails
                      style={{
                        flexDirection: 'column',
                        padding: '14px 16px 18px',
                      }}
                    >
                      <List dense>
                        {chapter.lessons?.map((lesson) => (
                          <ListItem key={lesson._id} className={classes.lessonItem}>
                            <ListItemText
                              primary={
                                <span className={classes.lessonPrimary}>
                                  Bài {lesson.order}: {lesson.title}

                                  {lesson.isFree && (
                                    <Chip
                                      size="small"
                                      label="Xem thử"
                                      style={{
                                        marginLeft: 8,
                                        backgroundColor: '#d4f5eb',
                                        color: '#057a55',
                                        fontSize: '.75rem',
                                        fontWeight: 900,
                                        fontFamily: GF,
                                      }}
                                    />
                                  )}
                                </span>
                              }
                              secondary={
                                <span className={classes.lessonSecondary}>
                                  {LESSON_TYPES.find(
                                    (type) => type.value === lesson.type,
                                  )?.label || lesson.type}
                                  {lesson.timeLimit > 0 &&
                                    ` · ${lesson.timeLimit} phút`}
                                  {lesson.videoUrl && ' · Có video'}
                                </span>
                              }
                            />

                            <ListItemSecondaryAction>
                              <IconButton
                                size="small"
                                className={classes.iconBtn}
                                onClick={() =>
                                  setLessonDialog({
                                    open: true,
                                    data: lesson,
                                    chapterId: chapter._id,
                                  })
                                }
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>

                              <IconButton
                                size="small"
                                className={classes.iconBtnDelete}
                                onClick={() => handleDeleteLesson(lesson._id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>

                      <Button
                        startIcon={<AddIcon />}
                        variant="outlined"
                        size="small"
                        className={classes.addLessonBtn}
                        onClick={() =>
                          setLessonDialog({
                            open: true,
                            data: null,
                            chapterId: chapter._id,
                          })
                        }
                      >
                        Thêm bài học
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                ))
              )}

              {chapters.length > CHAPTER_PAGE_SIZE && (
                <div className={classes.pagination}>
                  <div className={classes.pageText}>
                    Trang {chapterPage}/{totalChapterPages} · Hiển thị{' '}
                    {visibleChapters.length}/{chapters.length} chương
                  </div>

                  <div className={classes.pageBtns}>
                    <Button
                      className={classes.pageBtn}
                      disabled={chapterPage <= 1}
                      onClick={() =>
                        setChapterPage((prev) => Math.max(1, prev - 1))
                      }
                    >
                      <NavigateBeforeIcon />
                    </Button>

                    <Button
                      className={classes.pageBtn}
                      disabled={chapterPage >= totalChapterPages}
                      onClick={() =>
                        setChapterPage((prev) =>
                          Math.min(totalChapterPages, prev + 1),
                        )
                      }
                    >
                      <NavigateNextIcon />
                    </Button>
                  </div>
                </div>
              )}

              <Button
                startIcon={<AddIcon />}
                variant="contained"
                className={classes.addChapterBtn}
                onClick={() =>
                  setChapterDialog({
                    open: true,
                    data: null,
                  })
                }
              >
                Thêm chương mới
              </Button>
            </div>
          </div>
        </div>

        <ChapterForm
          open={chapterDialog.open}
          onClose={() =>
            setChapterDialog({
              open: false,
              data: null,
            })
          }
          onSubmit={handleChapterSubmit}
          initialData={chapterDialog.data}
        />

        <LessonForm
          open={lessonDialog.open}
          onClose={() =>
            setLessonDialog({
              open: false,
              data: null,
              chapterId: null,
            })
          }
          onSubmit={handleLessonSubmit}
          initialData={lessonDialog.data}
        />
      </div>
    </div>
  );
}

export default TeacherCourseDetail;