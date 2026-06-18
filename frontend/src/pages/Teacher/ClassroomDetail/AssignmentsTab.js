import grammarApi from 'apis/grammarApi';
import React, { useCallback, useEffect, useState } from 'react';

const GRADE_LEVELS = ['all', '1', '2', '3', '4', '5'];

const GRADE_LABELS = {
  all: 'Tất cả khối',
  1: 'Khối 1',
  2: 'Khối 2',
  3: 'Khối 3',
  4: 'Khối 4',
  5: 'Khối 5',
};

const EMPTY_EX = {
  question: '',
  type: 'mcq',
  options: ['', '', '', ''],
  answer: '',
  explanation: '',
};

function emptyForm(classroomId, classroomName) {
  return {
    title: '',
    description: '',
    classroomId,
    classroomName,
    gradeLevel: 'all',
    weekNumber: '',
    year: new Date().getFullYear(),
    startDate: '',
    dueDate: '',
    durationMinutes: '',
    showResultOnly: true,
    exercises: [],
    status: 'active',
    lessonId: '',
  };
}

const COLORS = {
  navy: '#0f172a',
  blue: '#1d4ed8',
  blueDark: '#1e40af',
  green: '#059669',
  red: '#dc2626',
  orange: '#d97706',
  slate: '#64748b',
  border: '#dbe4ef',
  bg: '#f5f7fb',
};

const S = {
  body: {
    display: 'grid',
    gridTemplateColumns: '360px minmax(0, 1fr)',
    gap: 28,
    alignItems: 'start',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
    fontSize: '20px',
  },

  sidebar: {
    background: '#ffffff',
    border: '1px solid #dbe4ef',
    borderRadius: 22,
    padding: 22,
    boxShadow: '0 12px 32px rgba(15,23,42,0.10)',
    position: 'sticky',
    top: 20,
  },

  sidebarTitle: {
    fontWeight: 900,
    fontSize: '1.55rem',
    color: COLORS.navy,
    marginBottom: 8,
    letterSpacing: '-0.015em',
    lineHeight: 1.25,
  },

  sidebarSub: {
    color: COLORS.slate,
    fontSize: '1.18rem',
    lineHeight: 1.55,
    fontWeight: 600,
    marginBottom: 18,
  },

  addBtn: {
    display: 'block',
    width: '100%',
    padding: '16px 20px',
    marginBottom: 20,
    background: COLORS.blue,
    color: '#fff',
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer',
    fontWeight: 850,
    fontSize: '1.28rem',
    fontFamily: 'inherit',
    boxShadow: '0 10px 20px rgba(29,78,216,.24)',
  },

  item: (active) => ({
    padding: '18px 18px',
    borderRadius: 16,
    cursor: 'pointer',
    marginBottom: 12,
    border: active ? '1px solid #93c5fd' : '1px solid #e2e8f0',
    background: active ? '#eff6ff' : '#ffffff',
    boxShadow: active ? '0 10px 22px rgba(29,78,216,.13)' : 'none',
    transition: 'all .16s ease',
  }),

  itemTitle: {
    fontSize: '1.28rem',
    fontWeight: 850,
    color: COLORS.navy,
    marginBottom: 8,
    lineHeight: 1.4,
  },

  itemMeta: {
    fontSize: '1.08rem',
    color: COLORS.slate,
    fontWeight: 650,
    lineHeight: 1.5,
  },

  statusDot: (s) => ({
    display: 'inline-block',
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: s === 'active' ? COLORS.green : COLORS.orange,
    marginRight: 9,
  }),

  main: {
    minWidth: 0,
  },

  pageHead: {
    margin: '0 0 22px',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0369a1 100%)',
    borderRadius: 22,
    padding: '30px 34px',
    color: '#ffffff',
    boxShadow: '0 18px 38px rgba(15,23,42,0.18)',
  },

  pageTitle: {
    margin: 0,
    fontWeight: 900,
    fontSize: '2.35rem',
    letterSpacing: '-0.03em',
    lineHeight: 1.2,
  },

  pageDesc: {
    margin: '10px 0 0',
    color: '#dbeafe',
    fontSize: '1.28rem',
    fontWeight: 500,
    lineHeight: 1.6,
  },

  formCard: {
    background: '#fff',
    borderRadius: 22,
    padding: 32,
    boxShadow: '0 12px 32px rgba(15,23,42,0.10)',
    border: '1px solid #dbe4ef',
  },

  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },

  row3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 18,
  },

  fieldLabel: {
    display: 'block',
    fontWeight: 850,
    color: '#334155',
    fontSize: '1.25rem',
    marginBottom: 10,
    lineHeight: 1.35,
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '17px 18px',
    borderRadius: 14,
    border: '1px solid #cbd5e1',
    fontSize: '1.25rem',
    outline: 'none',
    color: COLORS.navy,
    background: '#ffffff',
    fontFamily: 'inherit',
    fontWeight: 600,
    lineHeight: 1.35,
  },

  select: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '17px 18px',
    borderRadius: 14,
    border: '1px solid #cbd5e1',
    fontSize: '1.25rem',
    background: '#fff',
    color: COLORS.navy,
    outline: 'none',
    fontFamily: 'inherit',
    fontWeight: 600,
    lineHeight: 1.35,
  },

  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '17px 18px',
    borderRadius: 14,
    border: '1px solid #cbd5e1',
    fontSize: '1.25rem',
    outline: 'none',
    minHeight: 120,
    resize: 'vertical',
    fontFamily: 'inherit',
    color: COLORS.navy,
    lineHeight: 1.65,
    fontWeight: 600,
  },

  helperText: {
    marginTop: 9,
    fontSize: '1.08rem',
    color: COLORS.slate,
    fontWeight: 600,
    lineHeight: 1.55,
  },

  divider: {
    height: 1,
    background: '#e2e8f0',
    margin: '32px 0',
  },

  sectionTitle: {
    fontWeight: 900,
    color: COLORS.navy,
    fontSize: '1.7rem',
    margin: '0 0 22px',
    letterSpacing: '-0.015em',
    lineHeight: 1.25,
  },

  exCard: {
    border: '1px solid #dbe4ef',
    borderRadius: 20,
    padding: 26,
    marginBottom: 22,
    background: '#f8fafc',
  },

  exRow: {
    display: 'flex',
    gap: 14,
    alignItems: 'center',
    marginBottom: 18,
    flexWrap: 'wrap',
  },

  exIndex: {
    color: COLORS.blue,
    minWidth: 46,
    height: 46,
    borderRadius: 12,
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: '1.15rem',
  },

  removeBtn: {
    background: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    borderRadius: 12,
    padding: '12px 18px',
    cursor: 'pointer',
    fontWeight: 850,
    fontSize: '1.12rem',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
    marginLeft: 'auto',
  },

  addExBtn: {
    background: '#eff6ff',
    color: COLORS.blue,
    border: '1px solid #bfdbfe',
    borderRadius: 13,
    padding: '15px 22px',
    cursor: 'pointer',
    fontWeight: 850,
    fontSize: '1.2rem',
    marginRight: 12,
    marginBottom: 10,
    fontFamily: 'inherit',
  },

  btnRow: {
    display: 'flex',
    gap: 14,
    marginTop: 32,
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  saveBtn: (type) => {
    const map = {
      draft: {
        background: '#ffffff',
        color: COLORS.blue,
        border: '1px solid #bfdbfe',
        boxShadow: 'none',
      },
      active: {
        background: COLORS.blue,
        color: '#ffffff',
        border: '1px solid #1d4ed8',
        boxShadow: '0 10px 20px rgba(29,78,216,.24)',
      },
      score: {
        background: COLORS.navy,
        color: '#ffffff',
        border: '1px solid #0f172a',
        boxShadow: '0 10px 20px rgba(15,23,42,.20)',
      },
    };

    const c = map[type] || map.active;

    return {
      padding: '16px 30px',
      borderRadius: 14,
      border: c.border,
      cursor: 'pointer',
      background: c.background,
      color: c.color,
      fontWeight: 850,
      fontSize: '1.24rem',
      fontFamily: 'inherit',
      boxShadow: c.boxShadow,
    };
  },

  deleteBtn: {
    padding: '16px 26px',
    borderRadius: 14,
    border: '1px solid #fecaca',
    cursor: 'pointer',
    background: '#fef2f2',
    color: '#b91c1c',
    fontWeight: 850,
    fontSize: '1.24rem',
    marginLeft: 'auto',
    fontFamily: 'inherit',
  },

  subTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '1.18rem',
    marginTop: 14,
  },

  subTh: {
    padding: '16px 18px',
    textAlign: 'left',
    fontWeight: 850,
    fontSize: '1rem',
    color: '#e0f2fe',
    background: COLORS.navy,
    borderBottom: '1px solid #1e293b',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    whiteSpace: 'nowrap',
  },

  subTd: {
    padding: '17px 18px',
    color: '#374151',
    borderBottom: '1px solid #eef2ff',
    verticalAlign: 'middle',
    background: '#ffffff',
    lineHeight: 1.45,
  },

  msgBox: (ok) => ({
    marginBottom: 18,
    padding: '16px 18px',
    borderRadius: 14,
    background: ok ? '#ecfdf5' : '#fef2f2',
    color: ok ? '#047857' : '#b91c1c',
    border: ok ? '1px solid #a7f3d0' : '1px solid #fecaca',
    fontWeight: 850,
    fontSize: '1.18rem',
    lineHeight: 1.5,
  }),

  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 22,
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 14,
    padding: '16px 18px',
  },

  checkboxLabel: {
    fontWeight: 750,
    color: '#334155',
    fontSize: '1.18rem',
    cursor: 'pointer',
    lineHeight: 1.5,
  },

  emptyText: {
    color: COLORS.slate,
    fontSize: '1.16rem',
    fontWeight: 650,
    lineHeight: 1.6,
    background: '#f8fafc',
    border: '1px dashed #cbd5e1',
    borderRadius: 14,
    padding: 18,
  },

  scoreHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    gap: 14,
    flexWrap: 'wrap',
  },

  scoreTitle: {
    fontWeight: 900,
    fontSize: '1.62rem',
    color: COLORS.navy,
  },

  statusBadge: (late) => ({
    padding: '8px 14px',
    borderRadius: 999,
    fontSize: '1rem',
    fontWeight: 850,
    background: late ? '#fff7ed' : '#ecfdf5',
    color: late ? '#c2410c' : '#047857',
    border: late ? '1px solid #fed7aa' : '1px solid #a7f3d0',
    display: 'inline-flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  }),
};

function fmtDatetime(iso) {
  if (!iso) return '—';

  const d = new Date(iso);

  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

function toInputDatetime(iso) {
  if (!iso) return '';
  return iso.slice(0, 16);
}

function ExerciseBuilder({ exercises, onChange }) {
  const addEx = (type) => {
    onChange([...exercises, { ...EMPTY_EX, id: `new_${Date.now()}`, type }]);
  };

  const updateEx = (idx, key, val) => {
    const exs = [...exercises];
    exs[idx] = { ...exs[idx], [key]: val };
    onChange(exs);
  };

  const updateOpt = (idx, oi, val) => {
    const exs = [...exercises];
    const opts = [...(exs[idx].options || [])];

    opts[oi] = val;
    exs[idx] = { ...exs[idx], options: opts };

    onChange(exs);
  };

  const removeEx = (idx) => {
    onChange(exercises.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div style={S.sectionTitle}>Bài tập ({exercises.length} câu)</div>

      {exercises.map((ex, idx) => (
        <div key={ex.id || idx} style={S.exCard}>
          <div style={S.exRow}>
            <strong style={S.exIndex}>#{idx + 1}</strong>

            <select
              style={{ ...S.select, flex: '0 0 240px' }}
              value={ex.type}
              onChange={(e) => updateEx(idx, 'type', e.target.value)}
            >
              <option value="mcq">Trắc nghiệm</option>
              <option value="fill_blank">Điền vào chỗ trống</option>
            </select>

            <button style={S.removeBtn} onClick={() => removeEx(idx)}>
              Xóa câu hỏi
            </button>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={S.fieldLabel}>Câu hỏi</label>

            <input
              style={S.input}
              placeholder="Nhập nội dung câu hỏi..."
              value={ex.question}
              onChange={(e) => updateEx(idx, 'question', e.target.value)}
            />
          </div>

          {ex.type === 'mcq' && (
            <div style={{ marginBottom: 18 }}>
              <label style={S.fieldLabel}>Các lựa chọn A, B, C, D</label>

              {(ex.options || ['', '', '', '']).map((opt, oi) => (
                <input
                  key={oi}
                  style={{ ...S.input, marginBottom: 12 }}
                  placeholder={`Lựa chọn ${String.fromCharCode(65 + oi)}`}
                  value={opt}
                  onChange={(e) => updateOpt(idx, oi, e.target.value)}
                />
              ))}
            </div>
          )}

          <div style={S.row2}>
            <div>
              <label style={S.fieldLabel}>Đáp án đúng</label>

              {ex.type === 'mcq' ? (
                <select
                  style={S.select}
                  value={ex.answer}
                  onChange={(e) => updateEx(idx, 'answer', e.target.value)}
                >
                  <option value="">Chọn đáp án</option>

                  {(ex.options || []).filter(Boolean).map((opt, oi) => (
                    <option key={oi} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  style={S.input}
                  placeholder="Nhập đáp án đúng..."
                  value={ex.answer}
                  onChange={(e) => updateEx(idx, 'answer', e.target.value)}
                />
              )}
            </div>

            <div>
              <label style={S.fieldLabel}>Giải thích</label>

              <input
                style={S.input}
                placeholder="Giải thích đáp án nếu cần..."
                value={ex.explanation}
                onChange={(e) => updateEx(idx, 'explanation', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <div>
        <button style={S.addExBtn} onClick={() => addEx('mcq')}>
          Thêm câu trắc nghiệm
        </button>

        <button style={S.addExBtn} onClick={() => addEx('fill_blank')}>
          Thêm câu điền từ
        </button>
      </div>
    </div>
  );
}

function AssignmentsTab({ classroom }) {
  const classroomId = classroom?.id || classroom?._id;
  const classroomName = classroom?.name || '';

  const [assignments, setAssignments] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm(classroomId, classroomName));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState('');
  const [submissions, setSubmissions] = useState(null);
  const [loadingSub, setLoadingSub] = useState(false);

  const [topicFilter, setTopicFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [weekFilter, setWeekFilter] = useState('');

  const load = useCallback(async () => {
    if (!classroomId) return;

    try {
      const [aRes, lRes] = await Promise.all([
        grammarApi.getClassroomAssignmentsForManage(classroomId),
        grammarApi.getMyLessons(),
      ]);

      setAssignments(aRes.data?.assignments || []);
      setLessons(lRes.data?.lessons || []);
    } catch {
      setAssignments([]);
    }
  }, [classroomId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleNew = () => {
    setSelected(null);
    setForm(emptyForm(classroomId, classroomName));
    setMsg('');
    setSubmissions(null);
    setTopicFilter('');
    setModuleFilter('');
    setWeekFilter('');
  };

  const handleSelect = (a) => {
    setSelected(a);

    setForm({
      ...emptyForm(classroomId, classroomName),
      ...a,
      startDate: toInputDatetime(a.startDate),
      dueDate: toInputDatetime(a.dueDate),
      showResultOnly: a.showResultOnly !== false,
    });

    setMsg('');
    setSubmissions(null);
  };

  const setField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const allTopics = [...new Set(lessons.filter((l) => l.topic).map((l) => l.topic))].sort((a, b) =>
    a.localeCompare(b),
  );

  const allModules = [...new Set(lessons.filter((l) => l.module).map((l) => l.module))].sort((a, b) =>
    a.localeCompare(b),
  );

  const allWeeks = [...new Set(lessons.filter((l) => l.weekNumber).map((l) => l.weekNumber))].sort(
    (a, b) => a - b,
  );

  const filteredLessons = lessons.filter((l) => {
    if (topicFilter && l.topic !== topicFilter) return false;
    if (moduleFilter && l.module !== moduleFilter) return false;
    if (weekFilter && String(l.weekNumber) !== String(weekFilter)) return false;
    return true;
  });

  const isSuccessMsg =
    msg.startsWith('Đã') || msg.includes('thành công') || msg.includes('xóa');

  const handleSave = async (statusOverride) => {
    if (!form.title.trim()) {
      setMsg('Nhập tiêu đề bài tập.');
      return;
    }

    setSaving(true);
    setMsg('');

    try {
      const payload = {
        ...form,
        classroomId,
        classroomName,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null,
      };

      if (statusOverride) payload.status = statusOverride;

      if (selected) {
        const res = await grammarApi.updateAssignment(selected.id, payload);
        handleSelect(res.data.assignment);
        setMsg('Đã cập nhật bài tập thành công.');
      } else {
        const res = await grammarApi.createAssignment(payload);
        handleSelect(res.data.assignment);
        setMsg('Đã tạo bài tập thành công.');
      }

      await load();
    } catch (err) {
      setMsg(`Lỗi: ${err?.response?.data?.message || 'Vui lòng thử lại.'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected || !window.confirm('Xóa bài tập này?')) return;

    setDeleting(true);

    try {
      await grammarApi.deleteAssignment(selected.id);
      setSelected(null);
      setForm(emptyForm(classroomId, classroomName));
      setSubmissions(null);
      await load();
      setMsg('Đã xóa bài tập.');
    } catch {
      setMsg('Không thể xóa bài tập.');
    } finally {
      setDeleting(false);
    }
  };

  const handleLoadSubmissions = async () => {
    if (!selected) return;

    setLoadingSub(true);

    try {
      const res = await grammarApi.getSubmissions(selected.id);
      setSubmissions(res.data?.submissions || []);
    } catch {
      setSubmissions([]);
    } finally {
      setLoadingSub(false);
    }
  };

  return (
    <div style={S.body}>
      <div style={S.sidebar}>
        <div style={S.sidebarTitle}>Bài tập của lớp {classroomName}</div>

        <div style={S.sidebarSub}>
          Quản lý danh sách bài tập đã giao, bản nháp và thời hạn nộp bài của học sinh.
        </div>

        <button style={S.addBtn} onClick={handleNew}>
          Tạo bài tập mới
        </button>

        {assignments.length === 0 && (
          <div style={S.emptyText}>
            Chưa có bài tập nào cho lớp này.
          </div>
        )}

        {assignments.map((a) => (
          <div
            key={a.id}
            style={S.item(selected?.id === a.id)}
            onClick={() => handleSelect(a)}
          >
            <div style={S.itemTitle}>{a.title || 'Chưa đặt tên'}</div>

            <div style={S.itemMeta}>
              <span style={S.statusDot(a.status)} />
              {a.status === 'active' ? 'Đang giao' : 'Bản nháp'}
              {' · '}
              {a.dueDate ? fmtDatetime(a.dueDate) : 'Không hạn'}
            </div>
          </div>
        ))}
      </div>

      <div style={S.main}>
        <div style={S.pageHead}>
          <h2 style={S.pageTitle}>
            {selected ? 'Chỉnh sửa bài tập' : 'Tạo bài tập mới'}
          </h2>

          <p style={S.pageDesc}>
            Thiết lập bài tập ngữ pháp, thời hạn nộp bài, câu hỏi và theo dõi kết quả học sinh.
          </p>
        </div>

        {msg && <div style={S.msgBox(isSuccessMsg)}>{msg}</div>}

        <div style={S.formCard}>
          <div style={{ marginBottom: 22 }}>
            <label style={S.fieldLabel}>Tiêu đề bài tập *</label>

            <input
              style={S.input}
              placeholder="VD: Bài tập tuần 5 - Thì hiện tại đơn"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
            />
          </div>

          <div style={{ ...S.row3, marginBottom: 22 }}>
            <div>
              <label style={S.fieldLabel}>Lọc theo chủ đề</label>

              <select
                style={S.select}
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
              >
                <option value="">Tất cả chủ đề</option>

                {allTopics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={S.fieldLabel}>Lọc theo chương</label>

              <select
                style={S.select}
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
              >
                <option value="">Tất cả chương</option>

                {allModules.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={S.fieldLabel}>Lọc theo buổi</label>

              <select
                style={S.select}
                value={weekFilter}
                onChange={(e) => setWeekFilter(e.target.value)}
              >
                <option value="">Tất cả buổi</option>

                {allWeeks.map((w) => (
                  <option key={w} value={w}>
                    Buổi {w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={S.fieldLabel}>Gắn với bài học ngữ pháp</label>

            <select
              style={S.select}
              value={form.lessonId}
              onChange={(e) => setField('lessonId', e.target.value)}
            >
              <option value="">Không gắn với bài học cụ thể</option>

              {filteredLessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                  {l.topic ? ` · ${l.topic}` : ''}
                  {l.module ? ` · ${l.module}` : ''}
                  {l.weekNumber ? ` · Buổi ${l.weekNumber}` : ''}
                </option>
              ))}
            </select>

            <div style={S.helperText}>
              Có thể dùng các bộ lọc trên để tìm nhanh bài học theo chủ đề, chương hoặc buổi học.
            </div>
          </div>

          <div style={{ ...S.row2, marginBottom: 22 }}>
            <div>
              <label style={S.fieldLabel}>Khối lớp</label>

              <select
                style={S.select}
                value={form.gradeLevel}
                onChange={(e) => setField('gradeLevel', e.target.value)}
              >
                {GRADE_LEVELS.map((g) => (
                  <option key={g} value={g}>
                    {GRADE_LABELS[g]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={S.fieldLabel}>Tuần học</label>

              <input
                style={S.input}
                type="number"
                min="1"
                max="52"
                placeholder="1-52"
                value={form.weekNumber}
                onChange={(e) => setField('weekNumber', e.target.value)}
              />
            </div>
          </div>

          <div style={{ ...S.row3, marginBottom: 22 }}>
            <div>
              <label style={S.fieldLabel}>Mở từ ngày</label>

              <input
                style={S.input}
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => setField('startDate', e.target.value)}
              />
            </div>

            <div>
              <label style={S.fieldLabel}>Hạn nộp *</label>

              <input
                style={S.input}
                type="datetime-local"
                value={form.dueDate}
                onChange={(e) => setField('dueDate', e.target.value)}
              />
            </div>

            <div>
              <label style={S.fieldLabel}>Thời gian làm bài</label>

              <input
                style={S.input}
                type="number"
                min="1"
                placeholder="VD: 30"
                value={form.durationMinutes}
                onChange={(e) => setField('durationMinutes', e.target.value)}
              />
            </div>
          </div>

          <div style={S.checkboxRow}>
            <input
              type="checkbox"
              id="showResultOnly"
              checked={form.showResultOnly}
              onChange={(e) => setField('showResultOnly', e.target.checked)}
              style={{ width: 24, height: 24 }}
            />

            <label htmlFor="showResultOnly" style={S.checkboxLabel}>
              Học sinh chỉ xem điểm số, không xem lại chi tiết bài làm
            </label>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={S.fieldLabel}>Mô tả / Hướng dẫn</label>

            <textarea
              style={S.textarea}
              placeholder="Nhập hướng dẫn làm bài cho học sinh..."
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </div>

          <div style={S.divider} />

          <ExerciseBuilder
            exercises={form.exercises}
            onChange={(exs) => setField('exercises', exs)}
          />

          <div style={S.btnRow}>
            <button
              style={S.saveBtn('draft')}
              onClick={() => handleSave('draft')}
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : 'Lưu nháp'}
            </button>

            <button
              style={S.saveBtn('active')}
              onClick={() => handleSave('active')}
              disabled={saving}
            >
              {saving ? 'Đang giao...' : 'Giao bài'}
            </button>

            {selected && (
              <button style={S.deleteBtn} onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Đang xóa...' : 'Xóa bài tập'}
              </button>
            )}
          </div>
        </div>

        {selected && (
          <div style={{ ...S.formCard, marginTop: 28 }}>
            <div style={S.scoreHead}>
              <div style={S.scoreTitle}>
                Điểm học sinh {submissions ? `(${submissions.length} bài nộp)` : ''}
              </div>

              <button
                style={S.saveBtn('score')}
                onClick={handleLoadSubmissions}
                disabled={loadingSub}
              >
                {loadingSub ? 'Đang tải...' : 'Tải điểm'}
              </button>
            </div>

            {submissions === null && (
              <div style={S.emptyText}>
                Nhấn “Tải điểm” để xem kết quả làm bài của học sinh.
              </div>
            )}

            {submissions !== null && submissions.length === 0 && (
              <div style={S.emptyText}>
                Chưa có học sinh nào nộp bài.
              </div>
            )}

            {submissions !== null && submissions.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={S.subTable}>
                  <thead>
                    <tr>
                      {['#', 'Học sinh', 'Điểm', 'Tổng', '%', 'Trạng thái', 'Thời gian nộp'].map(
                        (h) => (
                          <th key={h} style={S.subTh}>
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {submissions.map((s, i) => {
                      const pct = s.maxScore ? Math.round((s.score / s.maxScore) * 100) : 0;

                      return (
                        <tr key={s.id}>
                          <td style={S.subTd}>{i + 1}</td>

                          <td style={{ ...S.subTd, fontWeight: 800 }}>
                            {s.studentName || s.studentAccountId}
                          </td>

                          <td style={{ ...S.subTd, fontWeight: 900, color: COLORS.blue }}>
                            {s.score}
                          </td>

                          <td style={S.subTd}>{s.maxScore}</td>

                          <td
                            style={{
                              ...S.subTd,
                              fontWeight: 850,
                              color: pct >= 80 ? COLORS.green : pct >= 50 ? COLORS.orange : '#b91c1c',
                            }}
                          >
                            {pct}%
                          </td>

                          <td style={S.subTd}>
                            <span style={S.statusBadge(s.isLate)}>
                              {s.isLate ? 'Muộn' : 'Đúng hạn'}
                            </span>
                          </td>

                          <td style={{ ...S.subTd, color: COLORS.slate, fontSize: '1.08rem' }}>
                            {fmtDatetime(s.submittedAt)}
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
  );
}

export default AssignmentsTab;