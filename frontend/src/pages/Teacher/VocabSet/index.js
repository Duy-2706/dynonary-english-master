import React, { useEffect, useRef, useState } from 'react';
import vocabSetApi from 'apis/vocabSetApi';
import classroomApi from 'apis/classroomApi';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SchoolIcon from '@material-ui/icons/School';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

import { makeStyles } from '@material-ui/core/styles';
import useTitle from 'hooks/useTitle';
import useScrollTop from 'hooks/useScrollTop';
import * as XLSX from 'xlsx';

const GF = '"Baloo 2","Nunito",sans-serif';

const GRADE_LEVELS = ['1', '2', '3', '4', '5'];
const UNITS = Array.from({ length: 20 }, (_, i) => `Unit ${i + 1}`);

const WORD_TYPES = [
  { value: 'n', label: 'n' },
  { value: 'v', label: 'v' },
  { value: 'adj', label: 'adj' },
  { value: 'adv', label: 'adv' },
  { value: 'pro', label: 'pro' },
  { value: 'pre', label: 'pre' },
  { value: 'conj', label: 'conj' },
  { value: 'det', label: 'det' },
  { value: 'phrase', label: 'phrase' },
];

const EMPTY_WORD = () => ({
  word: '',
  type: 'n',
  phonetic: '',
  meaning: '',
});

const EMPTY_FORM = () => ({
  title: '',
  gradeLevel: '3',
  unit: 'Unit 1',
  classroomIds: [],
  words: [EMPTY_WORD()],
  status: 'draft',
});

const useStyle = makeStyles(() => ({
  page: {
    height: 'calc(100vh - 112px)',
    minHeight: 620,
    background: 'transparent',
    fontFamily: GF,
    overflow: 'hidden',
  },

  wrap: {
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
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

  heroTitle: {
    fontSize: '1.9rem',
    fontWeight: 900,
    color: '#06434b',
    margin: 0,
    fontFamily: GF,
    lineHeight: 1.12,
    letterSpacing: '-0.025em',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },

  heroSub: {
    color: '#07545c',
    fontWeight: 800,
    fontSize: '1rem',
    marginTop: 8,
    lineHeight: 1.45,
    maxWidth: 760,
  },

  layout: {
    flex: 1,
    minHeight: 0,
    display: 'grid',
    gridTemplateColumns: '315px minmax(0, 1fr)',
    gap: 22,
    overflow: 'hidden',
  },

  sidebar: {
    background: '#fff',
    borderRadius: 22,
    border: '3px solid #d6f3ed',
    boxShadow: '0 6px 0 rgba(7,148,127,.10), 0 14px 28px rgba(15,23,42,.07)',
    padding: 18,
    minHeight: 0,
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  createBtn: {
    width: '100%',
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00) !important',
    color: '#fff !important',
    border: '3px solid #fff !important',
    borderRadius: '999px !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    textTransform: 'none !important',
    fontSize: '.96rem !important',
    padding: '10px 14px !important',
    boxShadow: '0 5px 0 #bd5f00 !important',
    marginBottom: '14px !important',
  },

  filterLabel: {
    fontWeight: 900,
    fontSize: '.82rem',
    color: '#07545c',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 7,
  },

  filterRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    marginBottom: 12,
  },

  smallControl: {
    '& label': {
      fontFamily: GF,
      fontSize: '.92rem',
      fontWeight: 850,
      color: '#06434b',
    },
    '& .MuiSelect-root': {
      fontFamily: GF,
      fontSize: '.92rem',
      fontWeight: 800,
      color: '#06434b',
      paddingTop: 11,
      paddingBottom: 11,
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 13,
      background: '#fff',
      '& fieldset': {
        borderWidth: 2,
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

  sideTitle: {
    fontWeight: 900,
    fontSize: '1rem',
    color: '#06434b',
    margin: '0 0 10px',
    fontFamily: GF,
    flexShrink: 0,
  },

  setList: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    paddingRight: 4,
  },

  setItem: {
    borderRadius: 16,
    border: '2.5px solid #d6f3ed',
    padding: '12px 13px',
    marginBottom: 10,
    cursor: 'pointer',
    background: '#fff',
    transition: 'all .15s',
    '&:hover': {
      background: '#f3fffc',
      borderColor: '#19c7a8',
    },
  },

  setItemActive: {
    background: '#eefdf9 !important',
    borderColor: '#19c7a8 !important',
    boxShadow: '0 4px 0 rgba(7,148,127,.16)',
  },

  setItemTitle: {
    fontWeight: 900,
    color: '#06434b',
    fontSize: '1rem',
    lineHeight: 1.25,
    paddingRight: 6,
  },

  setItemMeta: {
    color: '#07545c',
    fontSize: '.84rem',
    fontWeight: 750,
    marginTop: 5,
    lineHeight: 1.35,
  },

  statusChip: {
    height: 'auto !important',
    borderRadius: '999px !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    fontSize: '.7rem !important',
    padding: '2px 2px !important',
  },

  editor: {
    background: '#fff',
    borderRadius: 22,
    border: '3px solid #d6f3ed',
    boxShadow: '0 6px 0 rgba(7,148,127,.10), 0 14px 28px rgba(15,23,42,.07)',
    padding: 0,
    minHeight: 0,
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  editorHeader: {
    padding: '18px 22px',
    borderBottom: '3px solid #eef7f5',
    background: 'linear-gradient(180deg,#ffffff,#f8fffd)',
    flexShrink: 0,
  },

  editorTitle: {
    fontWeight: 900,
    fontSize: '1.35rem',
    color: '#06434b',
    margin: 0,
    fontFamily: GF,
    lineHeight: 1.2,
  },

  editorSub: {
    color: '#07545c',
    marginTop: 5,
    fontWeight: 750,
    fontSize: '.92rem',
    lineHeight: 1.35,
  },

  editorScroll: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: '22px 24px',
  },

  field: {
    marginBottom: '16px !important',
    width: '100%',
    '& label': {
      fontFamily: GF,
      fontWeight: 850,
      color: '#06434b',
      fontSize: '.98rem',
    },
    '& input, & textarea': {
      fontFamily: GF,
      fontWeight: 750,
      color: '#06434b',
      fontSize: '1rem',
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

  fc: {
    marginBottom: '16px !important',
    width: '100%',
    '& label': {
      fontFamily: GF,
      fontWeight: 850,
      color: '#06434b',
      fontSize: '.98rem',
    },
    '& .MuiSelect-root': {
      fontFamily: GF,
      fontWeight: 750,
      color: '#06434b',
      fontSize: '1rem',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 14,
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

  sectionTitle: {
    fontWeight: 900,
    color: '#06434b',
    fontSize: '1.14rem',
    marginBottom: 12,
    lineHeight: 1.2,
  },

  wordTableWrap: {
    border: '2.5px solid #d6f3ed',
    borderRadius: 16,
    overflow: 'hidden',
    background: '#fff',
    marginBottom: 14,
  },

  wordHeader: {
    display: 'grid',
    gridTemplateColumns: '1.15fr 98px 126px 1.2fr 44px',
    gap: 8,
    padding: '10px 12px',
    background: '#eefdf9',
    borderBottom: '2px solid #d6f3ed',
  },

  wordRow: {
    display: 'grid',
    gridTemplateColumns: '1.15fr 98px 126px 1.2fr 44px',
    gap: 8,
    alignItems: 'center',
    padding: '9px 12px',
    borderBottom: '1px solid #eef7f5',
    '&:last-child': {
      borderBottom: 'none',
    },
  },

  wordHeaderCell: {
    fontWeight: 900,
    color: '#07545c',
    fontSize: '.78rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },

  wordInput: {
    padding: '9px 10px',
    border: '2px solid #d6f3ed',
    borderRadius: 10,
    fontSize: '.94rem',
    fontFamily: GF,
    width: '100%',
    boxSizing: 'border-box',
    fontWeight: 750,
    color: '#06434b',
    outline: 'none',
    background: '#fff',
  },

  wordSelect: {
    padding: '9px 8px',
    border: '2px solid #d6f3ed',
    borderRadius: 10,
    fontFamily: GF,
    fontWeight: 750,
    color: '#06434b',
    fontSize: '.94rem',
    width: '100%',
    background: '#fff',
    outline: 'none',
  },

  toolbar: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 16,
    marginTop: 8,
  },

  addWordBtn: {
    background: 'linear-gradient(180deg,#fff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '2.5px solid #19c7a8 !important',
    borderRadius: '999px !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    textTransform: 'none !important',
    fontSize: '.9rem !important',
    padding: '8px 14px !important',
  },

  importBtn: {
    background: 'linear-gradient(180deg,#fff,#fffbeb) !important',
    color: '#92400e !important',
    border: '2.5px solid #fbbf24 !important',
    borderRadius: '999px !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    textTransform: 'none !important',
    fontSize: '.9rem !important',
    padding: '8px 14px !important',
  },

  previewBtn: {
    background: 'linear-gradient(180deg,#fff,#f0fdf4) !important',
    color: '#065f46 !important',
    border: '2.5px solid #34d399 !important',
    borderRadius: '999px !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    textTransform: 'none !important',
    fontSize: '.9rem !important',
    padding: '8px 14px !important',
  },

  noteBox: {
    background: '#fffbeb',
    border: '2px solid #fbbf24',
    borderRadius: 12,
    padding: '10px 14px',
    marginBottom: 18,
    fontSize: '.84rem',
    color: '#92400e',
    fontWeight: 750,
    lineHeight: 1.45,
  },

  footerActions: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 14,
    borderTop: '3px solid #eef7f5',
  },

  saveDraftBtn: {
    background: 'linear-gradient(180deg,#fff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '3px solid #19c7a8 !important',
    borderRadius: '999px !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    textTransform: 'none !important',
    fontSize: '.94rem !important',
    padding: '9px 18px !important',
    boxShadow: '0 4px 0 rgba(7,148,127,.16) !important',
  },

  publishBtn: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00) !important',
    color: '#fff !important',
    border: '3px solid #fff !important',
    borderRadius: '999px !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    textTransform: 'none !important',
    fontSize: '.94rem !important',
    padding: '9px 20px !important',
    boxShadow: '0 5px 0 #bd5f00 !important',
  },

  deleteBtn: {
    background: '#fff1f1 !important',
    border: '2.5px solid #ffb7b7 !important',
    color: '#e53935 !important',
    borderRadius: '999px !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    textTransform: 'none !important',
    fontSize: '.9rem !important',
    padding: '8px 14px !important',
  },

  emptyEditor: {
    flex: 1,
    textAlign: 'center',
    padding: '60px 20px',
    color: '#07545c',
    fontWeight: 800,
    fontSize: '1rem',
    lineHeight: 1.55,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    background: '#eefdf9',
    border: '3px solid #d6f3ed',
    color: '#07947f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  toast: {
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
    boxShadow: '0 16px 36px rgba(15,23,42,.15)',
    fontFamily: GF,
  },

  previewPaper: {
    borderRadius: 24,
    border: '4px solid #19c7a8',
    fontFamily: GF,
    overflow: 'hidden',
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

function WInput({ value, onChange, placeholder, style }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        padding: '9px 10px',
        border: '2px solid #d6f3ed',
        borderRadius: 10,
        fontSize: '.94rem',
        fontFamily: GF,
        width: '100%',
        boxSizing: 'border-box',
        fontWeight: 750,
        color: '#06434b',
        outline: 'none',
        background: '#fff',
        ...style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#19c7a8';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#d6f3ed';
      }}
    />
  );
}

function FlashcardPreview({ open, onClose, words }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (open) {
      setIdx(0);
      setFlipped(false);
    }
  }, [open]);

  useEffect(() => {
    setFlipped(false);
  }, [idx]);

  if (!words || words.length === 0) return null;

  const card = words[idx];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 24,
          border: '4px solid #19c7a8',
          fontFamily: GF,
          overflow: 'hidden',
        },
      }}
    >
      <div
        style={{
          padding: '18px 22px',
          background: 'linear-gradient(180deg,#19c7a8,#07947f)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            color: '#fff',
            fontWeight: 900,
            fontSize: '1.08rem',
            fontFamily: GF,
          }}
        >
          Xem trước Flashcard ({idx + 1}/{words.length})
        </span>

        <IconButton onClick={onClose} size="small" style={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </div>

      <DialogContent style={{ padding: 22, background: '#f3fffc' }}>
        <div
          onClick={() => setFlipped((v) => !v)}
          style={{
            cursor: 'pointer',
            minHeight: 190,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            background: flipped
              ? 'linear-gradient(180deg,#fffbeb,#fff)'
              : 'linear-gradient(180deg,#eefdf9,#fff)',
            border: '4px solid',
            borderColor: flipped ? '#fbbf24' : '#19c7a8',
            boxShadow: flipped
              ? '0 5px 0 #bd7800'
              : '0 5px 0 rgba(7,148,127,.18)',
            transition: 'all .25s',
            padding: 30,
          }}
        >
          {!flipped ? (
            <>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: '#06434b',
                  marginBottom: 8,
                }}
              >
                {card.word}
              </div>

              {card.phonetic && (
                <div
                  style={{
                    color: '#07947f',
                    fontSize: '1rem',
                    fontWeight: 750,
                    marginBottom: 6,
                  }}
                >
                  /{card.phonetic}/
                </div>
              )}

              {card.type && (
                <Chip
                  label={card.type}
                  size="small"
                  style={{
                    background: '#d4f5eb',
                    color: '#057a55',
                    fontWeight: 850,
                    fontFamily: GF,
                  }}
                />
              )}

              <div
                style={{
                  color: '#888',
                  fontSize: '.82rem',
                  marginTop: 14,
                  fontWeight: 750,
                }}
              >
                Nhấn để xem nghĩa
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: '1.55rem',
                  fontWeight: 900,
                  color: '#92400e',
                  marginBottom: 8,
                }}
              >
                {card.meaning}
              </div>

              <div
                style={{
                  color: '#06434b',
                  fontSize: '1rem',
                  fontWeight: 750,
                  marginBottom: 6,
                }}
              >
                {card.word}
              </div>

              {card.phonetic && (
                <div style={{ color: '#07947f', fontSize: '.9rem' }}>
                  /{card.phonetic}/
                </div>
              )}

              <div
                style={{
                  color: '#888',
                  fontSize: '.82rem',
                  marginTop: 14,
                  fontWeight: 750,
                }}
              >
                Nhấn để xem từ
              </div>
            </>
          )}
        </div>
      </DialogContent>

      <DialogActions
        style={{
          padding: '12px 22px 18px',
          background: '#f3fffc',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <Button
          disabled={idx === 0}
          onClick={() => setIdx(idx - 1)}
          style={{
            background: '#eefdf9',
            border: '2.5px solid #19c7a8',
            borderRadius: 999,
            fontWeight: 900,
            fontFamily: GF,
            textTransform: 'none',
            color: '#056d5e',
            padding: '8px 20px',
          }}
        >
          Trước
        </Button>

        <Button
          disabled={idx === words.length - 1}
          onClick={() => setIdx(idx + 1)}
          style={{
            background: 'linear-gradient(180deg,#19c7a8,#07947f)',
            border: 'none',
            borderRadius: 999,
            fontWeight: 900,
            fontFamily: GF,
            textTransform: 'none',
            color: '#fff',
            padding: '8px 20px',
            boxShadow: '0 4px 0 rgba(7,148,127,.3)',
          }}
        >
          Tiếp
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function TeacherVocabSetPage() {
  useTitle('Quản lý từ vựng');
  useScrollTop();

  const classes = useStyle();
  const loadingRef = useRef(false);
  const fileRef = useRef(null);

  const [sets, setSets] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM());
  const [isNew, setIsNew] = useState(false);

  const [filterGrade, setFilterGrade] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

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

  const load = async () => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const [sRes, cRes] = await Promise.all([
        vocabSetApi.getMyVocabSets(),
        classroomApi.getMyClassrooms(),
      ]);

      setSets(sRes.data?.sets || []);
      setClassrooms(cRes.data?.classrooms || []);
    } catch {
      showToast(
        'error',
        'Không tải được dữ liệu',
        'Danh sách bộ từ hoặc lớp học chưa được tải.',
      );
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSelectSet = (set) => {
    setSelected(set);
    setIsNew(false);

    setForm({
      title: set.title || '',
      gradeLevel: set.gradeLevel || '3',
      unit: set.unit || 'Unit 1',
      classroomIds: set.classroomIds || [],
      words: set.words?.length ? set.words : [EMPTY_WORD()],
      status: set.status || 'draft',
    });
  };

  const handleNew = () => {
    setSelected(null);
    setIsNew(true);
    setForm(EMPTY_FORM());
  };

  const handleSave = async (status) => {
    if (!form.title.trim()) {
      showToast(
        'error',
        'Thiếu tên bộ từ',
        'Bạn cần nhập tên bộ từ trước khi lưu.',
      );
      return;
    }

    const cleanedWords = form.words.filter((word) => word.word.trim());

    if (cleanedWords.length === 0) {
      showToast(
        'error',
        'Chưa có từ vựng',
        'Bạn cần nhập ít nhất một từ trước khi lưu.',
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        status,
        words: cleanedWords,
      };

      if (isNew) {
        const res = await vocabSetApi.createVocabSet(payload);
        const created = res.data.set;

        setSets((prev) => [created, ...prev]);
        setSelected(created);
        setIsNew(false);

        showToast(
          'success',
          'Đã tạo bộ từ',
          'Bộ từ mới đã được thêm vào danh sách.',
        );
      } else {
        const res = await vocabSetApi.updateVocabSet(selected._id, payload);
        const updated = res.data.set;

        setSets((prev) =>
          prev.map((item) => (item._id === updated._id ? updated : item)),
        );
        setSelected(updated);

        showToast(
          'success',
          'Đã lưu bộ từ',
          'Thông tin bộ từ đã được cập nhật.',
        );
      }

      setForm((prev) => ({
        ...prev,
        status,
      }));
    } catch {
      showToast(
        'error',
        'Không thể lưu bộ từ',
        'Vui lòng kiểm tra lại hoặc thử lại sau.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm(`Xóa bộ từ "${selected.title}"?`)) return;

    try {
      await vocabSetApi.deleteVocabSet(selected._id);

      setSets((prev) => prev.filter((item) => item._id !== selected._id));
      setSelected(null);
      setIsNew(false);
      setForm(EMPTY_FORM());

      showToast(
        'delete',
        'Đã xóa bộ từ',
        'Bộ từ đã được xóa khỏi danh sách.',
      );
    } catch {
      showToast(
        'error',
        'Không thể xóa bộ từ',
        'Vui lòng thử lại sau.',
      );
    }
  };

  const addWord = () => {
    setForm((prev) => ({
      ...prev,
      words: [...prev.words, EMPTY_WORD()],
    }));
  };

  const removeWord = (index) => {
    setForm((prev) => ({
      ...prev,
      words: prev.words.filter((_, idx) => idx !== index),
    }));
  };

  const updateWord = (index, field, value) => {
    setForm((prev) => {
      const words = [...prev.words];

      words[index] = {
        ...words[index],
        [field]: value,
      };

      return {
        ...prev,
        words,
      };
    });
  };

  const handleExcelFile = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(ev.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          defval: '',
        });

        const startRow = rows[0]?.[0]?.toString().toLowerCase().includes('word')
          ? 1
          : 0;

        const parsed = rows
          .slice(startRow)
          .filter((row) => row[0]?.toString().trim())
          .map((row) => ({
            word: row[0]?.toString().trim() || '',
            type: row[1]?.toString().trim() || 'n',
            phonetic: row[2]?.toString().trim() || '',
            meaning: row[3]?.toString().trim() || '',
          }));

        if (parsed.length > 0) {
          setForm((prev) => ({
            ...prev,
            words: [...prev.words.filter((word) => word.word.trim()), ...parsed],
          }));

          showToast(
            'success',
            'Import thành công',
            `Đã thêm ${parsed.length} từ từ file Excel.`,
          );
        } else {
          showToast(
            'error',
            'File chưa đúng định dạng',
            'Không tìm thấy từ vựng trong file Excel.',
          );
        }
      } catch {
        showToast(
          'error',
          'Không đọc được file',
          'Vui lòng kiểm tra lại định dạng file Excel.',
        );
      }
    };

    reader.readAsBinaryString(file);
    event.target.value = '';
  };

  const filtered = sets.filter((set) => {
    if (filterGrade && set.gradeLevel !== filterGrade) return false;
    if (filterUnit && set.unit !== filterUnit) return false;

    return true;
  });

  if (loading) {
    return (
      <div
        style={{
          height: 'calc(100vh - 112px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'transparent',
        }}
      >
        <CircularProgress style={{ color: '#19c7a8' }} size={48} />
      </div>
    );
  }

  return (
    <div className={classes.page}>
      <TeacherToast
        toast={toast}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            show: false,
          }))
        }
      />

      <div className={classes.wrap}>
        <div className={classes.hero}>
          <div className={classes.heroDecor}>
            <MenuBookIcon style={{ fontSize: 72 }} />
          </div>

          <h1 className={classes.heroTitle}>
            <MenuBookIcon style={{ fontSize: 31, color: '#07947f' }} />
            Quản lý từ vựng
          </h1>

          <p className={classes.heroSub}>
            Tạo bộ từ vựng theo lớp và đơn vị, gán cho lớp học để học sinh luyện tập.
          </p>
        </div>

        <div className={classes.layout}>
          <div className={classes.sidebar}>
            <Button
              startIcon={<AddIcon />}
              className={classes.createBtn}
              onClick={handleNew}
            >
              Tạo bộ từ mới
            </Button>

            <div className={classes.filterLabel}>Lọc theo</div>

            <div className={classes.filterRow}>
              <FormControl
                variant="outlined"
                size="small"
                className={classes.smallControl}
              >
                <InputLabel>Khối</InputLabel>

                <Select
                  value={filterGrade}
                  onChange={(event) => setFilterGrade(event.target.value)}
                  label="Khối"
                >
                  <MenuItem value="">Tất cả</MenuItem>

                  {GRADE_LEVELS.map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      Khối {grade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                variant="outlined"
                size="small"
                className={classes.smallControl}
              >
                <InputLabel>Unit</InputLabel>

                <Select
                  value={filterUnit}
                  onChange={(event) => setFilterUnit(event.target.value)}
                  label="Unit"
                >
                  <MenuItem value="">Tất cả</MenuItem>

                  {UNITS.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <p className={classes.sideTitle}>{filtered.length} bộ từ</p>

            <div className={classes.setList}>
              {filtered.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    color: '#07545c',
                    fontWeight: 800,
                    padding: '24px 0',
                    fontSize: '.95rem',
                    lineHeight: 1.45,
                  }}
                >
                  Chưa có bộ từ nào.
                </div>
              )}

              {filtered.map((set) => (
                <div
                  key={set._id}
                  className={`${classes.setItem} ${
                    selected?._id === set._id ? classes.setItemActive : ''
                  }`}
                  onClick={() => handleSelectSet(set)}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 8,
                    }}
                  >
                    <div className={classes.setItemTitle}>{set.title}</div>

                    <Chip
                      size="small"
                      label={set.status === 'published' ? 'Xuất bản' : 'Nháp'}
                      className={classes.statusChip}
                      style={{
                        background:
                          set.status === 'published' ? '#d4f5eb' : '#fff8e1',
                        color:
                          set.status === 'published' ? '#057a55' : '#92400e',
                      }}
                    />
                  </div>

                  <div className={classes.setItemMeta}>
                    Khối {set.gradeLevel} · {set.unit} · {set.words?.length || 0} từ
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={classes.editor}>
            {!isNew && !selected ? (
              <div className={classes.emptyEditor}>
                <div className={classes.emptyIcon}>
                  <MenuBookIcon style={{ fontSize: 32 }} />
                </div>

                <div>
                  Chọn một bộ từ để chỉnh sửa,
                  <br />
                  hoặc nhấn “Tạo bộ từ mới”.
                </div>
              </div>
            ) : (
              <>
                <div className={classes.editorHeader}>
                  <h2 className={classes.editorTitle}>
                    {isNew ? 'Tạo bộ từ mới' : `Chỉnh sửa: ${selected?.title}`}
                  </h2>

                  <div className={classes.editorSub}>
                    Nhập thông tin bộ từ, gán lớp học và quản lý danh sách từ vựng.
                  </div>
                </div>

                <div className={classes.editorScroll}>
                  <TextField
                    className={classes.field}
                    label="Tên bộ từ *"
                    variant="outlined"
                    value={form.title}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        title: event.target.value,
                      })
                    }
                  />

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 14,
                    }}
                  >
                    <FormControl variant="outlined" className={classes.fc}>
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
                        {GRADE_LEVELS.map((grade) => (
                          <MenuItem key={grade} value={grade}>
                            Khối {grade}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl variant="outlined" className={classes.fc}>
                      <InputLabel>Unit</InputLabel>

                      <Select
                        value={form.unit}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            unit: event.target.value,
                          })
                        }
                        label="Unit"
                      >
                        {UNITS.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <FormControl variant="outlined" className={classes.fc}>
                    <InputLabel>Gán cho lớp</InputLabel>

                    <Select
                      multiple
                      value={form.classroomIds}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          classroomIds: event.target.value,
                        })
                      }
                      label="Gán cho lớp"
                      renderValue={(selectedIds) =>
                        selectedIds
                          .map(
                            (classroomId) =>
                              classrooms.find((item) => item._id === classroomId)
                                ?.name || classroomId,
                          )
                          .join(', ')
                      }
                    >
                      {classrooms.map((classroom) => (
                        <MenuItem
                          key={classroom._id}
                          value={classroom._id}
                          style={{
                            fontFamily: GF,
                            fontWeight: 750,
                          }}
                        >
                          {classroom.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <div className={classes.sectionTitle}>
                    Danh sách từ vựng ({form.words.length} từ)
                  </div>

                  <div className={classes.wordTableWrap}>
                    <div className={classes.wordHeader}>
                      {['Từ vựng', 'Loại', 'Phiên âm', 'Nghĩa tiếng Việt', ''].map(
                        (head) => (
                          <div key={head} className={classes.wordHeaderCell}>
                            {head}
                          </div>
                        ),
                      )}
                    </div>

                    {form.words.map((word, index) => (
                      <div key={index} className={classes.wordRow}>
                        <WInput
                          value={word.word}
                          onChange={(value) => updateWord(index, 'word', value)}
                          placeholder="Từ vựng"
                        />

                        <select
                          value={word.type}
                          onChange={(event) =>
                            updateWord(index, 'type', event.target.value)
                          }
                          className={classes.wordSelect}
                        >
                          {WORD_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>

                        <WInput
                          value={word.phonetic}
                          onChange={(value) =>
                            updateWord(index, 'phonetic', value)
                          }
                          placeholder="Phiên âm"
                        />

                        <WInput
                          value={word.meaning}
                          onChange={(value) =>
                            updateWord(index, 'meaning', value)
                          }
                          placeholder="Nghĩa"
                        />

                        <IconButton
                          size="small"
                          onClick={() => removeWord(index)}
                          style={{
                            background: '#fff1f1',
                            border: '2px solid #ffb7b7',
                            color: '#e53935',
                            borderRadius: 10,
                            width: 36,
                            height: 36,
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    ))}
                  </div>

                  <div className={classes.toolbar}>
                    <Button
                      startIcon={<AddIcon />}
                      className={classes.addWordBtn}
                      onClick={addWord}
                    >
                      Thêm từ
                    </Button>

                    <Button
                      startIcon={<CloudUploadIcon />}
                      className={classes.importBtn}
                      onClick={() => fileRef.current?.click()}
                    >
                      Import Excel
                    </Button>

                    <input
                      ref={fileRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      style={{ display: 'none' }}
                      onChange={handleExcelFile}
                    />

                    <Button
                      startIcon={<VisibilityIcon />}
                      className={classes.previewBtn}
                      onClick={() => setPreviewOpen(true)}
                      disabled={!form.words.some((word) => word.word.trim())}
                    >
                      Xem trước Flashcard
                    </Button>
                  </div>

                  <div className={classes.noteBox}>
                    Định dạng Excel: cột A = Từ vựng · cột B = Loại từ · cột C =
                    Phiên âm · cột D = Nghĩa tiếng Việt.
                  </div>

                  <div className={classes.footerActions}>
                    <Button
                      startIcon={<SaveIcon />}
                      className={classes.saveDraftBtn}
                      onClick={() => handleSave('draft')}
                      disabled={saving}
                    >
                      Lưu nháp
                    </Button>

                    <Button
                      startIcon={
                        saving ? (
                          <CircularProgress size={17} style={{ color: '#fff' }} />
                        ) : (
                          <PublishIcon />
                        )
                      }
                      className={classes.publishBtn}
                      onClick={() => handleSave('published')}
                      disabled={saving}
                    >
                      Xuất bản
                    </Button>

                    {!isNew && selected && (
                      <Button
                        startIcon={<DeleteIcon />}
                        className={classes.deleteBtn}
                        onClick={handleDelete}
                        disabled={saving}
                      >
                        Xóa bộ từ
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <FlashcardPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        words={form.words.filter((word) => word.word.trim())}
      />
    </div>
  );
}

export default TeacherVocabSetPage;