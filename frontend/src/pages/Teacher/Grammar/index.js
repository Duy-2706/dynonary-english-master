import adminApi from 'apis/adminApi';
import grammarApi from 'apis/grammarApi';
import useTitle from 'hooks/useTitle';
import React, { useCallback, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import AddIcon from '@material-ui/icons/Add';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteIcon from '@material-ui/icons/Delete';
import ErrorIcon from '@material-ui/icons/Error';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PublishIcon from '@material-ui/icons/Publish';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';

const GF = '"Baloo 2","Nunito",sans-serif';

const GRADE_LEVELS = ['all', '1', '2', '3', '4', '5'];

const GRADE_LABELS = {
  all: 'Tất cả khối',
  1: 'Khối 1',
  2: 'Khối 2',
  3: 'Khối 3',
  4: 'Khối 4',
  5: 'Khối 5',
};

const MONTHS = [
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

const EMPTY_FORM = {
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
  status: 'draft',
};

const EMPTY_ASSIGN_FORM = {
  title: '',
  description: '',
  classroomId: '',
  classroomName: '',
  gradeLevel: 'all',
  weekNumber: '',
  year: new Date().getFullYear(),
  dueDate: '',
  exercises: [],
  status: 'active',
  lessonId: '',
};

const EMPTY_EX = {
  question: '',
  type: 'mcq',
  options: ['', '', '', ''],
  answer: '',
  explanation: '',
};

const COLORS = {
  dark: '#063c46',
  dark2: '#042b33',
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
    height: 'calc(100vh - 112px)',
    minHeight: 620,
    background: 'transparent',
    fontFamily: GF,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  pageOuter: {
    minHeight: '100vh',
    background:
      'linear-gradient(180deg, #eafff9 0%, #f8fffd 46%, #eefdf9 100%)',
    fontFamily: GF,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  modebar: {
    flexShrink: 0,
    display: 'flex',
    gap: 10,
    background: 'linear-gradient(180deg,#ffffff,#f3fffc)',
    padding: '16px 18px',
    borderRadius: 22,
    border: '3px solid #d6f3ed',
    boxShadow: '0 6px 0 rgba(7,148,127,.10), 0 14px 28px rgba(15,23,42,.07)',
    marginBottom: 18,
  },

  modeBtn: (active) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    padding: '10px 18px',
    border: active ? '3px solid #19c7a8' : '3px solid #d6f3ed',
    cursor: 'pointer',
    fontWeight: 900,
    fontSize: '.96rem',
    fontFamily: GF,
    background: active
      ? 'linear-gradient(180deg,#19c7a8,#07947f)'
      : 'linear-gradient(180deg,#ffffff,#f8fffd)',
    color: active ? '#ffffff' : '#056d5e',
    borderRadius: 999,
    boxShadow: active
      ? '0 5px 0 rgba(7,148,127,.24)'
      : '0 4px 0 rgba(7,148,127,.08)',
    transition: 'all 0.15s ease',
  }),

  body: {
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

  sidebarTitle: {
    flexShrink: 0,
    color: COLORS.text,
    fontWeight: 900,
    fontSize: '1.08rem',
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    lineHeight: 1.25,
  },

  addBtn: {
    flexShrink: 0,
    width: '100%',
    border: '3px solid #fff',
    borderRadius: 999,
    cursor: 'pointer',
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    fontFamily: GF,
    fontWeight: 900,
    fontSize: '.94rem',
    padding: '10px 14px',
    marginBottom: 14,
    boxShadow: '0 5px 0 #bd5f00',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  list: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    paddingRight: 4,
  },

  lessonItem: (active) => ({
    padding: '12px 13px',
    cursor: 'pointer',
    borderRadius: 16,
    border: active ? '2.5px solid #19c7a8' : '2.5px solid #d6f3ed',
    background: active ? '#eefdf9' : '#ffffff',
    boxShadow: active ? '0 4px 0 rgba(7,148,127,.16)' : 'none',
    marginBottom: 10,
    transition: 'all .15s ease',
  }),

  lessonItemTitle: {
    fontSize: '1rem',
    fontWeight: 900,
    color: COLORS.text,
    marginBottom: 5,
    lineHeight: 1.28,
  },

  lessonItemMeta: {
    fontSize: '.82rem',
    color: COLORS.sub,
    fontWeight: 750,
    lineHeight: 1.35,
  },

  statusDot: (status) => ({
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background:
      status === 'published' || status === 'active'
        ? COLORS.green
        : COLORS.orange,
    marginRight: 6,
  }),

  main: {
    minWidth: 0,
    minHeight: 0,
    maxHeight: '100%',
    overflow: 'hidden',
    background: '#fff',
    borderRadius: 22,
    border: '3px solid #d6f3ed',
    boxShadow: '0 6px 0 rgba(7,148,127,.10), 0 14px 28px rgba(15,23,42,.07)',
    display: 'flex',
    flexDirection: 'column',
  },

  mainHeader: {
    flexShrink: 0,
    padding: '18px 22px',
    borderBottom: '3px solid #eef7f5',
    background: 'linear-gradient(180deg,#ffffff,#f8fffd)',
  },

  mainTitle: {
    fontSize: '1.35rem',
    fontWeight: 900,
    color: COLORS.text,
    margin: 0,
    lineHeight: 1.2,
  },

  mainSub: {
    marginTop: 5,
    color: COLORS.sub,
    fontWeight: 750,
    fontSize: '.92rem',
    lineHeight: 1.35,
  },

  mainScroll: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: '22px 24px',
  },

  formCard: {
    background: '#fff',
    borderRadius: 20,
    padding: 0,
  },

  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
  },

  row3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 12,
  },

  fieldBlock: {
    marginBottom: 16,
  },

  fieldLabel: {
    display: 'block',
    fontWeight: 900,
    color: COLORS.text,
    fontSize: '.94rem',
    marginBottom: 7,
    lineHeight: 1.3,
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    borderRadius: 13,
    border: '2.5px solid #d6f3ed',
    fontSize: '.96rem',
    outline: 'none',
    fontFamily: GF,
    fontWeight: 750,
    color: COLORS.text,
    background: '#ffffff',
  },

  select: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    borderRadius: 13,
    border: '2.5px solid #d6f3ed',
    fontSize: '.96rem',
    background: '#fff',
    fontFamily: GF,
    fontWeight: 750,
    color: COLORS.text,
    outline: 'none',
  },

  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    borderRadius: 13,
    border: '2.5px solid #d6f3ed',
    fontSize: '.96rem',
    outline: 'none',
    minHeight: 92,
    resize: 'vertical',
    fontFamily: GF,
    fontWeight: 750,
    color: COLORS.text,
    background: '#fff',
    lineHeight: 1.5,
  },

  quillWrap: {
    borderRadius: 16,
    border: '2.5px solid #d6f3ed',
    overflow: 'hidden',
    marginBottom: 0,
    background: '#fff',
  },

  divider: {
    height: 3,
    background: '#d6f3ed',
    borderRadius: 999,
    margin: '24px 0',
  },

  sectionTitle: {
    fontWeight: 900,
    color: COLORS.text,
    fontSize: '1.12rem',
    margin: '0 0 14px',
    lineHeight: 1.25,
  },

  exCard: {
    border: '2.5px solid #d6f3ed',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    background: 'linear-gradient(180deg,#ffffff,#f8fffd)',
    boxShadow: '0 4px 0 rgba(7,148,127,.07)',
  },

  exRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },

  exIndex: {
    minWidth: 36,
    height: 36,
    borderRadius: 12,
    background: 'linear-gradient(180deg,#19c7a8,#07947f)',
    color: '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    border: '2.5px solid #fff',
    boxShadow: '0 3px 0 rgba(7,148,127,.18)',
  },

  removeBtn: {
    background: '#fff1f1',
    color: COLORS.red,
    border: '2.5px solid #ffb7b7',
    borderRadius: 999,
    padding: '8px 13px',
    cursor: 'pointer',
    fontWeight: 900,
    fontSize: '.86rem',
    whiteSpace: 'nowrap',
    fontFamily: GF,
    marginLeft: 'auto',
  },

  addExBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eefdf9)',
    color: '#056d5e',
    border: '2.5px solid #19c7a8',
    borderRadius: 999,
    padding: '9px 15px',
    cursor: 'pointer',
    fontWeight: 900,
    fontSize: '.9rem',
    marginRight: 8,
    marginBottom: 8,
    fontFamily: GF,
    boxShadow: '0 4px 0 rgba(7,148,127,.12)',
  },

  btnRow: {
    display: 'flex',
    gap: 10,
    marginTop: 22,
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  saveBtn: (type) => {
    const map = {
      draft: {
        background: 'linear-gradient(180deg,#ffffff,#eefdf9)',
        color: '#056d5e',
        border: '2.5px solid #19c7a8',
        shadow: '0 4px 0 rgba(7,148,127,.12)',
      },
      active: {
        background: 'linear-gradient(180deg,#19c7a8,#07947f)',
        color: '#fff',
        border: '2.5px solid #fff',
        shadow: '0 5px 0 rgba(7,148,127,.24)',
      },
      delete: {
        background: '#fff1f1',
        color: COLORS.red,
        border: '2.5px solid #ffb7b7',
        shadow: '0 4px 0 rgba(141,22,22,.09)',
      },
      dark: {
        background: 'linear-gradient(180deg,#063c46,#042b33)',
        color: '#fff',
        border: '2.5px solid #063c46',
        shadow: '0 5px 0 rgba(15,23,42,.16)',
      },
    };

    const c = map[type] || map.active;

    return {
      padding: '10px 18px',
      borderRadius: 999,
      border: c.border,
      cursor: 'pointer',
      background: c.background,
      color: c.color,
      fontWeight: 900,
      fontSize: '.92rem',
      fontFamily: GF,
      boxShadow: c.shadow,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
    };
  },

  subCard: {
    marginTop: 20,
    borderTop: '3px solid #eef7f5',
    paddingTop: 18,
  },

  subHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
    flexWrap: 'wrap',
  },

  subTitle: {
    fontWeight: 900,
    fontSize: '1.08rem',
    color: COLORS.text,
  },

  tableWrap: {
    border: '2.5px solid #d6f3ed',
    borderRadius: 18,
    overflow: 'auto',
    maxHeight: 310,
    background: '#fff',
  },

  subTable: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    fontSize: '.9rem',
  },

  subTh: {
    padding: '10px 12px',
    textAlign: 'left',
    fontWeight: 900,
    fontSize: '.78rem',
    color: '#ffffff',
    background: '#07947f',
    borderBottom: '1px solid #087565',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    whiteSpace: 'nowrap',
    fontFamily: GF,
    position: 'sticky',
    top: 0,
    zIndex: 2,
  },

  subTd: {
    padding: '10px 12px',
    color: COLORS.text,
    borderBottom: '1px solid #e3f7f3',
    verticalAlign: 'middle',
    fontWeight: 750,
    background: '#fff',
    fontFamily: GF,
    whiteSpace: 'nowrap',
  },

  emptyText: {
    color: COLORS.sub,
    fontSize: '.95rem',
    textAlign: 'center',
    padding: '24px 0',
    fontWeight: 850,
    background: '#f8fffd',
    border: '2.5px dashed #d6f3ed',
    borderRadius: 16,
  },

  note: {
    marginTop: 5,
    fontSize: '.82rem',
    color: COLORS.slate,
    fontWeight: 750,
    lineHeight: 1.4,
  },
};

function getId(item) {
  return item?.id || item?._id;
}

function stripFontAttrs(node, delta) {
  delta.ops = delta.ops.map((op) => {
    if (op.attributes) {
      delete op.attributes.font;
      delete op.attributes.size;

      if (op.attributes.color === 'windowtext') delete op.attributes.color;
      if (Object.keys(op.attributes).length === 0) delete op.attributes;
    }

    return op;
  });

  return delta;
}

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'image'],
    ['blockquote', 'code-block'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
    matchers: [[Node.ELEMENT_NODE, stripFontAttrs]],
  },
};

const QUILL_FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'list',
  'bullet',
  'align',
  'link',
  'image',
  'blockquote',
  'code-block',
];

function TeacherGrammarToast({ toast, onClose }) {
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

function fmtDatetime(iso) {
  if (!iso) return '—';

  const d = new Date(iso);

  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${d.getFullYear()} ${d
    .getHours()
    .toString()
    .padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function toInputDatetime(iso) {
  if (!iso) return '';
  return iso.slice(0, 16);
}

function Field({ label, children, style }) {
  return (
    <div style={{ ...S.fieldBlock, ...style }}>
      <label style={S.fieldLabel}>{label}</label>
      {children}
    </div>
  );
}

function ExerciseBuilder({ exercises, onChange }) {
  const addEx = (type) => {
    onChange([
      ...exercises,
      {
        ...EMPTY_EX,
        id: `new_${Date.now()}`,
        type,
        options: type === 'mcq' ? ['', '', '', ''] : [],
      },
    ]);
  };

  const updateEx = (idx, key, value) => {
    const next = [...exercises];

    next[idx] = {
      ...next[idx],
      [key]: value,
    };

    onChange(next);
  };

  const updateOpt = (idx, optionIndex, value) => {
    const next = [...exercises];
    const options = [...(next[idx].options || ['', '', '', ''])];

    options[optionIndex] = value;

    next[idx] = {
      ...next[idx],
      options,
    };

    onChange(next);
  };

  const removeEx = (idx) => {
    onChange(exercises.filter((_, index) => index !== idx));
  };

  return (
    <div>
      <div style={S.sectionTitle}>Bài tập ({exercises.length} câu)</div>

      {exercises.map((exercise, idx) => (
        <div key={exercise.id || idx} style={S.exCard}>
          <div style={S.exRow}>
            <strong style={S.exIndex}>#{idx + 1}</strong>

            <select
              style={{
                ...S.select,
                flex: '0 0 190px',
              }}
              value={exercise.type}
              onChange={(event) => updateEx(idx, 'type', event.target.value)}
            >
              <option value="mcq">Trắc nghiệm</option>
              <option value="fill_blank">Điền vào chỗ trống</option>
            </select>

            <button
              type="button"
              style={S.removeBtn}
              onClick={() => removeEx(idx)}
            >
              Xóa câu
            </button>
          </div>

          <Field label="Câu hỏi">
            <input
              style={S.input}
              placeholder="Nhập nội dung câu hỏi..."
              value={exercise.question}
              onChange={(event) =>
                updateEx(idx, 'question', event.target.value)
              }
            />
          </Field>

          {exercise.type === 'mcq' && (
            <Field label="Các lựa chọn A, B, C, D">
              {(exercise.options || ['', '', '', '']).map((option, optionIndex) => (
                <input
                  key={optionIndex}
                  style={{
                    ...S.input,
                    marginBottom: optionIndex === 3 ? 0 : 8,
                  }}
                  placeholder={`Lựa chọn ${String.fromCharCode(65 + optionIndex)}`}
                  value={option}
                  onChange={(event) =>
                    updateOpt(idx, optionIndex, event.target.value)
                  }
                />
              ))}
            </Field>
          )}

          <div style={S.row2}>
            <Field label="Đáp án đúng">
              {exercise.type === 'mcq' ? (
                <select
                  style={S.select}
                  value={exercise.answer}
                  onChange={(event) =>
                    updateEx(idx, 'answer', event.target.value)
                  }
                >
                  <option value="">Chọn đáp án</option>

                  {(exercise.options || []).filter(Boolean).map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  style={S.input}
                  placeholder="Nhập đáp án..."
                  value={exercise.answer}
                  onChange={(event) =>
                    updateEx(idx, 'answer', event.target.value)
                  }
                />
              )}
            </Field>

            <Field label="Giải thích">
              <input
                style={S.input}
                placeholder="Giải thích đáp án nếu cần..."
                value={exercise.explanation}
                onChange={(event) =>
                  updateEx(idx, 'explanation', event.target.value)
                }
              />
            </Field>
          </div>
        </div>
      ))}

      <div>
        <button
          type="button"
          style={S.addExBtn}
          onClick={() => addEx('mcq')}
        >
          Thêm trắc nghiệm
        </button>

        <button
          type="button"
          style={S.addExBtn}
          onClick={() => addEx('fill_blank')}
        >
          Thêm điền từ
        </button>
      </div>
    </div>
  );
}

function LessonsSection() {
  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const loadLessons = useCallback(async () => {
    try {
      const res = await grammarApi.getMyLessons();

      setLessons(res.data?.lessons || []);
    } catch {
      setLessons([]);
      showToast(
        'error',
        'Không tải được bài học',
        'Danh sách bài học ngữ pháp chưa được tải.',
      );
    }
  }, []);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  const handleNew = () => {
    setSelected(null);
    setForm({
      ...EMPTY_FORM,
      year: new Date().getFullYear(),
    });
  };

  const handleSelect = (lesson) => {
    setSelected(lesson);

    setForm({
      ...EMPTY_FORM,
      ...lesson,
    });
  };

  const setField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (statusOverride) => {
    if (!form.title.trim()) {
      showToast(
        'error',
        'Thiếu tiêu đề bài học',
        'Bạn cần nhập tiêu đề trước khi lưu.',
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
      };

      if (statusOverride) payload.status = statusOverride;

      if (selected) {
        const res = await grammarApi.updateLesson(getId(selected), payload);
        const updated = res.data.lesson;

        setSelected(updated);
        setForm({
          ...EMPTY_FORM,
          ...updated,
        });

        showToast(
          'success',
          'Đã lưu bài học',
          'Thông tin bài học ngữ pháp đã được cập nhật.',
        );
      } else {
        const res = await grammarApi.createLesson(payload);
        const created = res.data.lesson;

        setSelected(created);
        setForm({
          ...EMPTY_FORM,
          ...created,
        });

        showToast(
          'success',
          'Tạo bài học thành công',
          'Bài học mới đã được thêm vào danh sách.',
        );
      }

      await loadLessons();
    } catch (err) {
      showToast(
        'error',
        'Không thể lưu bài học',
        err?.response?.data?.message || 'Vui lòng thử lại.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected || !window.confirm('Xóa bài học này?')) return;

    setDeleting(true);

    try {
      await grammarApi.deleteLesson(getId(selected));

      setSelected(null);
      setForm({
        ...EMPTY_FORM,
        year: new Date().getFullYear(),
      });

      await loadLessons();

      showToast(
        'delete',
        'Đã xóa bài học',
        'Bài học đã được xóa khỏi danh sách.',
      );
    } catch {
      showToast(
        'error',
        'Không thể xóa bài học',
        'Vui lòng kiểm tra lại hoặc thử lại sau.',
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={S.body}>
      <TeacherGrammarToast
        toast={toast}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            show: false,
          }))
        }
      />

      <div style={S.sidebar}>
        <div style={S.sidebarTitle}>
          <MenuBookIcon style={{ fontSize: 20 }} />
          Bài học của tôi
        </div>

        <button type="button" style={S.addBtn} onClick={handleNew}>
          <AddIcon style={{ fontSize: 18 }} />
          Tạo bài mới
        </button>

        <div style={S.list}>
          {lessons.length === 0 && (
            <div style={S.emptyText}>Chưa có bài học nào.</div>
          )}

          {lessons.map((lesson) => (
            <div
              key={getId(lesson)}
              style={S.lessonItem(getId(selected) === getId(lesson))}
              onClick={() => handleSelect(lesson)}
            >
              <div style={S.lessonItemTitle}>
                {lesson.title || 'Chưa đặt tên'}
              </div>

              <div style={S.lessonItemMeta}>
                <span style={S.statusDot(lesson.status)} />
                {lesson.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                {' · '}
                {GRADE_LABELS[lesson.gradeLevel] || lesson.gradeLevel || '—'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.main}>
        <div style={S.mainHeader}>
          <h1 style={S.mainTitle}>
            {selected ? 'Chỉnh sửa bài học' : 'Tạo bài học mới'}
          </h1>

          <div style={S.mainSub}>
            Soạn lý thuyết, thêm video và tạo bài tập luyện tập cho học sinh.
          </div>
        </div>

        <div style={S.mainScroll}>
          <div style={S.formCard}>
            <Field label="Tiêu đề bài học *">
              <input
                style={S.input}
                placeholder="VD: Thì hiện tại đơn - Present Simple"
                value={form.title}
                onChange={(event) => setField('title', event.target.value)}
              />
            </Field>

            <div style={S.row2}>
              <Field label="Khối lớp">
                <select
                  style={S.select}
                  value={form.gradeLevel}
                  onChange={(event) => setField('gradeLevel', event.target.value)}
                >
                  {GRADE_LEVELS.map((grade) => (
                    <option key={grade} value={grade}>
                      {GRADE_LABELS[grade]}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Chủ đề">
                <input
                  style={S.input}
                  placeholder="VD: Thì, câu điều kiện, bị động..."
                  value={form.topic}
                  onChange={(event) => setField('topic', event.target.value)}
                />
              </Field>
            </div>

            <div style={S.row3}>
              <Field label="Module / Chương">
                <input
                  style={S.input}
                  placeholder="VD: Chương 1"
                  value={form.module}
                  onChange={(event) => setField('module', event.target.value)}
                />
              </Field>

              <Field label="Tuần học">
                <input
                  style={S.input}
                  type="number"
                  min="1"
                  max="52"
                  placeholder="1-52"
                  value={form.weekNumber}
                  onChange={(event) => setField('weekNumber', event.target.value)}
                />
              </Field>

              <Field label="Tháng">
                <select
                  style={S.select}
                  value={form.month}
                  onChange={(event) => setField('month', event.target.value)}
                >
                  <option value="">Chọn tháng</option>

                  {MONTHS.slice(1).map((month, index) => (
                    <option key={index + 1} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div style={S.row2}>
              <Field label="Năm học">
                <input
                  style={S.input}
                  type="number"
                  min="2020"
                  max="2035"
                  value={form.year}
                  onChange={(event) => setField('year', event.target.value)}
                />
              </Field>

              <Field label="Video URL">
                <input
                  style={S.input}
                  placeholder="https://youtube.com/watch?v=..."
                  value={form.videoUrl}
                  onChange={(event) => setField('videoUrl', event.target.value)}
                />
              </Field>
            </div>

            <Field label="Mô tả ngắn">
              <input
                style={S.input}
                placeholder="Mô tả nội dung bài học..."
                value={form.description}
                onChange={(event) => setField('description', event.target.value)}
              />
            </Field>

            <Field label="Nội dung lý thuyết">
              <div style={S.quillWrap}>
                <ReactQuill
                  theme="snow"
                  value={form.content}
                  onChange={(value) => setField('content', value)}
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  placeholder="Nhập nội dung lý thuyết..."
                />
              </div>
            </Field>

            <div style={S.divider} />

            <ExerciseBuilder
              exercises={form.exercises}
              onChange={(exercises) => setField('exercises', exercises)}
            />

            <div style={S.btnRow}>
              <button
                type="button"
                style={{
                  ...S.saveBtn('draft'),
                  opacity: saving ? 0.65 : 1,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
                onClick={() => handleSave('draft')}
                disabled={saving}
              >
                <SaveIcon style={{ fontSize: 18 }} />
                {saving ? 'Đang lưu...' : 'Lưu nháp'}
              </button>

              <button
                type="button"
                style={{
                  ...S.saveBtn('active'),
                  opacity: saving ? 0.65 : 1,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
                onClick={() => handleSave('published')}
                disabled={saving}
              >
                <PublishIcon style={{ fontSize: 18 }} />
                {saving ? 'Đang xuất bản...' : 'Xuất bản'}
              </button>

              {selected && (
                <button
                  type="button"
                  style={{
                    ...S.saveBtn('delete'),
                    marginLeft: 'auto',
                    opacity: deleting ? 0.65 : 1,
                    cursor: deleting ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <DeleteIcon style={{ fontSize: 18 }} />
                  {deleting ? 'Đang xóa...' : 'Xóa bài học'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssignmentsSection() {
  const [assignments, setAssignments] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_ASSIGN_FORM);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [submissions, setSubmissions] = useState(null);
  const [loadingSub, setLoadingSub] = useState(false);

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

  const load = useCallback(async () => {
    try {
      const [assignmentRes, classroomRes, lessonRes] = await Promise.all([
        grammarApi.getMyAssignments(),
        adminApi.getClassrooms(),
        grammarApi.getMyLessons(),
      ]);

      setAssignments(assignmentRes.data?.assignments || []);
      setClassrooms(classroomRes.data?.classrooms || []);
      setLessons(lessonRes.data?.lessons || []);
    } catch {
      setAssignments([]);

      showToast(
        'error',
        'Không tải được dữ liệu',
        'Danh sách bài tập hoặc lớp học chưa được tải.',
      );
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleNew = () => {
    setSelected(null);
    setForm({
      ...EMPTY_ASSIGN_FORM,
      year: new Date().getFullYear(),
    });
    setSubmissions(null);
  };

  const handleSelect = (assignment) => {
    setSelected(assignment);

    setForm({
      ...EMPTY_ASSIGN_FORM,
      ...assignment,
      dueDate: toInputDatetime(assignment.dueDate),
    });

    setSubmissions(null);
  };

  const setField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClassroomChange = (id) => {
    const classroom = classrooms.find((item) => getId(item) === id);

    setForm((prev) => ({
      ...prev,
      classroomId: id,
      classroomName: classroom?.name || '',
    }));
  };

  const handleSave = async (statusOverride) => {
    if (!form.title.trim()) {
      showToast(
        'error',
        'Thiếu tiêu đề bài tập',
        'Bạn cần nhập tiêu đề trước khi lưu.',
      );
      return;
    }

    if (!form.classroomId) {
      showToast(
        'error',
        'Chưa chọn lớp học',
        'Bạn cần chọn lớp trước khi giao bài.',
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      };

      if (statusOverride) payload.status = statusOverride;

      if (selected) {
        const res = await grammarApi.updateAssignment(getId(selected), payload);
        const updated = res.data.assignment;

        setSelected(updated);
        setForm({
          ...EMPTY_ASSIGN_FORM,
          ...updated,
          dueDate: toInputDatetime(updated.dueDate),
        });

        showToast(
          'success',
          'Cập nhật bài tập thành công',
          'Thông tin bài tập đã được lưu lại.',
        );
      } else {
        const res = await grammarApi.createAssignment(payload);
        const created = res.data.assignment;

        setSelected(created);
        setForm({
          ...EMPTY_ASSIGN_FORM,
          ...created,
          dueDate: toInputDatetime(created.dueDate),
        });

        showToast(
          'success',
          'Tạo bài tập thành công',
          'Bài tập mới đã được giao cho lớp.',
        );
      }

      await load();
    } catch (err) {
      showToast(
        'error',
        'Không thể lưu bài tập',
        err?.response?.data?.message || 'Vui lòng thử lại.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected || !window.confirm('Xóa bài tập này?')) return;

    setDeleting(true);

    try {
      await grammarApi.deleteAssignment(getId(selected));

      setSelected(null);
      setForm({
        ...EMPTY_ASSIGN_FORM,
        year: new Date().getFullYear(),
      });
      setSubmissions(null);

      await load();

      showToast(
        'delete',
        'Đã xóa bài tập',
        'Bài tập đã được xóa khỏi danh sách.',
      );
    } catch {
      showToast(
        'error',
        'Không thể xóa bài tập',
        'Vui lòng kiểm tra lại hoặc thử lại sau.',
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleLoadSubmissions = async () => {
    if (!selected) return;

    setLoadingSub(true);

    try {
      const res = await grammarApi.getSubmissions(getId(selected));

      setSubmissions(res.data?.submissions || []);

      showToast(
        'success',
        'Đã tải điểm học sinh',
        'Kết quả nộp bài đã được cập nhật.',
      );
    } catch {
      setSubmissions([]);

      showToast(
        'error',
        'Không tải được điểm',
        'Vui lòng thử lại sau.',
      );
    } finally {
      setLoadingSub(false);
    }
  };

  const exportExcel = () => {
    if (!submissions || !selected) return;

    import('xlsx').then((XLSX) => {
      const rows = [
        [
          'STT',
          'Học sinh',
          'Điểm',
          'Tổng điểm',
          '% Đúng',
          'Nộp muộn',
          'Thời gian nộp',
        ],
      ];

      submissions.forEach((submission, index) => {
        const pct = submission.maxScore
          ? Math.round((submission.score / submission.maxScore) * 100)
          : 0;

        rows.push([
          index + 1,
          submission.studentName || submission.studentAccountId,
          submission.score,
          submission.maxScore,
          `${pct}%`,
          submission.isLate ? 'Muộn' : 'Đúng hạn',
          fmtDatetime(submission.submittedAt),
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, 'Diem');
      XLSX.writeFile(
        wb,
        `diem_${selected.title.replace(/\s+/g, '_')}.xlsx`,
      );
    });
  };

  return (
    <div style={S.body}>
      <TeacherGrammarToast
        toast={toast}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            show: false,
          }))
        }
      />

      <div style={S.sidebar}>
        <div style={S.sidebarTitle}>
          <AssignmentIcon style={{ fontSize: 20 }} />
          Bài tập giao lớp
        </div>

        <button type="button" style={S.addBtn} onClick={handleNew}>
          <AddIcon style={{ fontSize: 18 }} />
          Tạo bài tập mới
        </button>

        <div style={S.list}>
          {assignments.length === 0 && (
            <div style={S.emptyText}>Chưa có bài tập nào.</div>
          )}

          {assignments.map((assignment) => (
            <div
              key={getId(assignment)}
              style={S.lessonItem(getId(selected) === getId(assignment))}
              onClick={() => handleSelect(assignment)}
            >
              <div style={S.lessonItemTitle}>
                {assignment.title || 'Chưa đặt tên'}
              </div>

              <div style={S.lessonItemMeta}>
                <span style={S.statusDot(assignment.status)} />
                {assignment.classroomName || '—'} ·{' '}
                {assignment.dueDate
                  ? fmtDatetime(assignment.dueDate)
                  : 'Không hạn'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.main}>
        <div style={S.mainHeader}>
          <h1 style={S.mainTitle}>
            {selected ? 'Chỉnh sửa bài tập' : 'Tạo bài tập mới'}
          </h1>

          <div style={S.mainSub}>
            Giao bài cho lớp học và theo dõi kết quả nộp bài của học sinh.
          </div>
        </div>

        <div style={S.mainScroll}>
          <div style={S.formCard}>
            <Field label="Tiêu đề bài tập *">
              <input
                style={S.input}
                placeholder="VD: Bài tập tuần 5 - Thì hiện tại đơn"
                value={form.title}
                onChange={(event) => setField('title', event.target.value)}
              />
            </Field>

            <div style={S.row2}>
              <Field label="Lớp giao bài *">
                <select
                  style={S.select}
                  value={form.classroomId}
                  onChange={(event) => handleClassroomChange(event.target.value)}
                >
                  <option value="">Chọn lớp</option>

                  {classrooms.map((classroom) => (
                    <option key={getId(classroom)} value={getId(classroom)}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Khối lớp">
                <select
                  style={S.select}
                  value={form.gradeLevel}
                  onChange={(event) => setField('gradeLevel', event.target.value)}
                >
                  {GRADE_LEVELS.map((grade) => (
                    <option key={grade} value={grade}>
                      {GRADE_LABELS[grade]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Gắn với bài học ngữ pháp">
              <select
                style={S.select}
                value={form.lessonId}
                onChange={(event) => setField('lessonId', event.target.value)}
              >
                <option value="">Không gắn với bài học cụ thể</option>

                {lessons.map((lesson) => (
                  <option key={getId(lesson)} value={getId(lesson)}>
                    {lesson.title}
                  </option>
                ))}
              </select>

              <div style={S.note}>
                Khi chọn bài học, học sinh sẽ thấy bài tập này ở phần bài học
                tương ứng.
              </div>
            </Field>

            <div style={S.row3}>
              <Field label="Hạn nộp bài *">
                <input
                  style={S.input}
                  type="datetime-local"
                  value={form.dueDate}
                  onChange={(event) => setField('dueDate', event.target.value)}
                />
              </Field>

              <Field label="Tuần học">
                <input
                  style={S.input}
                  type="number"
                  min="1"
                  max="52"
                  value={form.weekNumber}
                  onChange={(event) => setField('weekNumber', event.target.value)}
                />
              </Field>

              <Field label="Năm học">
                <input
                  style={S.input}
                  type="number"
                  min="2020"
                  max="2035"
                  value={form.year}
                  onChange={(event) => setField('year', event.target.value)}
                />
              </Field>
            </div>

            <Field label="Mô tả / Hướng dẫn">
              <textarea
                style={S.textarea}
                placeholder="Hướng dẫn làm bài..."
                value={form.description}
                onChange={(event) => setField('description', event.target.value)}
              />
            </Field>

            <div style={S.divider} />

            <ExerciseBuilder
              exercises={form.exercises}
              onChange={(exercises) => setField('exercises', exercises)}
            />

            <div style={S.btnRow}>
              <button
                type="button"
                style={{
                  ...S.saveBtn('draft'),
                  opacity: saving ? 0.65 : 1,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
                onClick={() => handleSave('draft')}
                disabled={saving}
              >
                <SaveIcon style={{ fontSize: 18 }} />
                {saving ? 'Đang lưu...' : 'Lưu nháp'}
              </button>

              <button
                type="button"
                style={{
                  ...S.saveBtn('active'),
                  opacity: saving ? 0.65 : 1,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
                onClick={() => handleSave('active')}
                disabled={saving}
              >
                <PublishIcon style={{ fontSize: 18 }} />
                {saving ? 'Đang kích hoạt...' : 'Kích hoạt'}
              </button>

              {selected && (
                <button
                  type="button"
                  style={{
                    ...S.saveBtn('delete'),
                    marginLeft: 'auto',
                    opacity: deleting ? 0.65 : 1,
                    cursor: deleting ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <DeleteIcon style={{ fontSize: 18 }} />
                  {deleting ? 'Đang xóa...' : 'Xóa bài tập'}
                </button>
              )}
            </div>

            {selected && (
              <div style={S.subCard}>
                <div style={S.subHead}>
                  <div style={S.subTitle}>
                    Điểm học sinh{' '}
                    {submissions ? `(${submissions.length} bài nộp)` : ''}
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      style={{
                        ...S.saveBtn('dark'),
                        opacity: loadingSub ? 0.65 : 1,
                        cursor: loadingSub ? 'not-allowed' : 'pointer',
                      }}
                      onClick={handleLoadSubmissions}
                      disabled={loadingSub}
                    >
                      <RefreshIcon style={{ fontSize: 18 }} />
                      {loadingSub ? 'Đang tải...' : 'Tải điểm'}
                    </button>

                    {submissions && submissions.length > 0 && (
                      <button
                        type="button"
                        style={S.saveBtn('draft')}
                        onClick={exportExcel}
                      >
                        <CloudDownloadIcon style={{ fontSize: 18 }} />
                        Xuất Excel
                      </button>
                    )}
                  </div>
                </div>

                {submissions === null && (
                  <div style={S.emptyText}>
                    Nhấn “Tải điểm” để xem kết quả làm bài của học sinh.
                  </div>
                )}

                {submissions !== null && submissions.length === 0 && (
                  <div style={S.emptyText}>Chưa có học sinh nào nộp bài.</div>
                )}

                {submissions !== null && submissions.length > 0 && (
                  <div style={S.tableWrap}>
                    <table style={S.subTable}>
                      <thead>
                        <tr>
                          {[
                            '#',
                            'Học sinh',
                            'Điểm',
                            'Tổng',
                            '%',
                            'Trạng thái',
                            'Thời gian nộp',
                          ].map((head) => (
                            <th key={head} style={S.subTh}>
                              {head}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {submissions.map((submission, index) => {
                          const pct = submission.maxScore
                            ? Math.round(
                                (submission.score / submission.maxScore) * 100,
                              )
                            : 0;

                          return (
                            <tr key={getId(submission) || index}>
                              <td style={S.subTd}>{index + 1}</td>

                              <td style={S.subTd}>
                                {submission.studentName ||
                                  submission.studentAccountId}
                              </td>

                              <td style={S.subTd}>{submission.score}</td>

                              <td style={S.subTd}>{submission.maxScore}</td>

                              <td
                                style={{
                                  ...S.subTd,
                                  color:
                                    pct >= 80
                                      ? COLORS.green
                                      : pct >= 50
                                      ? COLORS.orange
                                      : '#b91c1c',
                                  fontWeight: 900,
                                }}
                              >
                                {pct}%
                              </td>

                              <td style={S.subTd}>
                                {submission.isLate ? 'Muộn' : 'Đúng hạn'}
                              </td>

                              <td style={S.subTd}>
                                {fmtDatetime(submission.submittedAt)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherGrammarPage({ embedded = false }) {
  useTitle('Quản lý ngữ pháp');

  const [mode, setMode] = useState('lessons');

  return (
    <div style={embedded ? S.page : S.pageOuter} className="teacher-grammar-page">
      <style>
        {`
          .teacher-grammar-page,
          .teacher-grammar-page * {
            box-sizing: border-box;
          }

          .teacher-grammar-page .ql-toolbar.ql-snow {
            border: none;
            border-bottom: 2.5px solid #d6f3ed;
            background: #f8fffd;
            font-family: ${GF};
          }

          .teacher-grammar-page .ql-container.ql-snow {
            border: none;
            font-family: ${GF};
            font-size: 0.96rem;
            font-weight: 700;
            color: #06434b;
          }

          .teacher-grammar-page .ql-editor {
            min-height: 210px;
            max-height: 330px;
            overflow-y: auto;
            line-height: 1.55;
          }

          .teacher-grammar-page .ql-editor * {
            font-family: ${GF} !important;
          }
        `}
      </style>

      <div style={S.modebar}>
        <button
          type="button"
          style={S.modeBtn(mode === 'lessons')}
          onClick={() => setMode('lessons')}
        >
          <MenuBookIcon style={{ fontSize: 19 }} />
          Bài học lý thuyết
        </button>

        <button
          type="button"
          style={S.modeBtn(mode === 'assignments')}
          onClick={() => setMode('assignments')}
        >
          <AssignmentIcon style={{ fontSize: 19 }} />
          Bài tập giao lớp
        </button>
      </div>

      {mode === 'lessons' && <LessonsSection />}
      {mode === 'assignments' && <AssignmentsSection />}
    </div>
  );
}

export default TeacherGrammarPage;