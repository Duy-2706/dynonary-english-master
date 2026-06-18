import adminApi from 'apis/adminApi';
import grammarApi from 'apis/grammarApi';
import useTitle from 'hooks/useTitle';
import React, { useCallback, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const GRADE_LEVELS = ['all', '1', '2', '3', '4', '5'];
const GRADE_LABELS = {
  all: 'Tất cả khối',
  '1': 'Khối 1', '2': 'Khối 2', '3': 'Khối 3', '4': 'Khối 4', '5': 'Khối 5',
};
const MONTHS = ['', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

const EMPTY_FORM = {
  title: '', description: '', videoUrl: '', content: '',
  gradeLevel: 'all', topic: '', module: '',
  weekNumber: '', month: '', year: new Date().getFullYear(),
  exercises: [], status: 'draft',
};

const EMPTY_ASSIGN_FORM = {
  title: '', description: '', classroomId: '', classroomName: '',
  gradeLevel: 'all', weekNumber: '', year: new Date().getFullYear(),
  dueDate: '', exercises: [], status: 'active', lessonId: '',
};

const EMPTY_EX = { question: '', type: 'mcq', options: ['', '', '', ''], answer: '', explanation: '' };

const S = {
  page: { minHeight: '100vh', background: '#f4f6fb', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' },
  modebar: {
    display: 'flex', gap: 0, background: '#1a1a2e', padding: '0 24px',
    borderBottom: '2px solid #667eea', flexShrink: 0,
  },
  modeBtn: (active) => ({
    padding: '14px 24px', border: 'none', cursor: 'pointer', fontWeight: 800,
    fontSize: '0.92rem', fontFamily: 'inherit', background: 'transparent',
    color: active ? '#667eea' : '#888',
    borderBottom: active ? '3px solid #667eea' : '3px solid transparent',
    transition: 'all 0.15s',
  }),
  body: { display: 'flex', flex: 1, minHeight: 0 },
  sidebar: {
    width: 280, background: '#1a1a2e', color: '#fff', padding: '24px 0',
    flexShrink: 0, height: 'calc(100vh - 51px)', position: 'sticky', top: 0, overflowY: 'auto',
  },
  sidebarTitle: { padding: '0 20px 16px', fontWeight: 900, fontSize: '1.1rem', color: '#667eea' },
  addBtn: {
    margin: '0 16px 16px', display: 'block', padding: '10px 16px',
    background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff',
    border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
    width: 'calc(100% - 32px)', textAlign: 'center',
  },
  lessonItem: (active) => ({
    padding: '12px 20px', cursor: 'pointer', borderLeft: active ? '3px solid #667eea' : '3px solid transparent',
    background: active ? 'rgba(102,126,234,0.15)' : 'transparent', transition: 'all 0.15s',
  }),
  lessonItemTitle: { fontSize: '0.9rem', fontWeight: 600, color: '#eee', marginBottom: 3, lineHeight: 1.3 },
  lessonItemMeta: { fontSize: '0.75rem', color: '#888' },
  statusDot: (s) => ({
    display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
    background: s === 'published' || s === 'active' ? '#00b894' : '#f39c12', marginRight: 4,
  }),
  main: { flex: 1, padding: '28px 32px', overflowY: 'auto' },
  mainHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  mainTitle: { fontSize: '1.6rem', fontWeight: 900, color: '#333', margin: 0 },
  formCard: { background: '#fff', borderRadius: 16, padding: '28px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  row3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 },
  fieldLabel: { display: 'block', fontWeight: 700, color: '#555', fontSize: '0.85rem', marginBottom: 6 },
  input: {
    width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8,
    border: '1.5px solid #e0e0e0', fontSize: '0.92rem', outline: 'none',
  },
  select: {
    width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8,
    border: '1.5px solid #e0e0e0', fontSize: '0.92rem', background: '#fff',
  },
  textarea: {
    width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8,
    border: '1.5px solid #e0e0e0', fontSize: '0.9rem', outline: 'none',
    minHeight: 120, resize: 'vertical', fontFamily: 'inherit',
  },
  quillWrap: {
    borderRadius: 8, border: '1.5px solid #e0e0e0', overflow: 'hidden',
    marginBottom: 0,
  },
  divider: { height: 1, background: '#f0f0f0', margin: '24px 0' },
  sectionTitle: { fontWeight: 800, color: '#333', fontSize: '1rem', margin: '0 0 16px' },
  exCard: {
    border: '1.5px solid #e8e8f0', borderRadius: 12, padding: '18px',
    marginBottom: 14, background: '#fafafe',
  },
  exRow: { display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 },
  removeBtn: {
    background: '#fee2e2', color: '#e17055', border: 'none', borderRadius: 6,
    padding: '6px 12px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap',
  },
  addExBtn: {
    background: '#ede9ff', color: '#667eea', border: 'none', borderRadius: 8,
    padding: '10px 18px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', marginRight: 10,
  },
  btnRow: { display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' },
  saveBtn: (bg) => ({
    padding: '12px 28px', borderRadius: 10, border: 'none', cursor: 'pointer',
    background: bg, color: '#fff', fontWeight: 800, fontSize: '0.95rem',
  }),
  deleteBtn: {
    padding: '12px 20px', borderRadius: 10, border: '2px solid #e17055',
    cursor: 'pointer', background: 'transparent', color: '#e17055',
    fontWeight: 700, fontSize: '0.9rem', marginLeft: 'auto',
  },
  subTable: { width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', marginTop: 12 },
  subTh: {
    padding: '9px 12px', textAlign: 'left', fontWeight: 800, fontSize: '0.76rem',
    color: '#e0f2fe', background: '#0f172a', borderBottom: '1px solid #1e293b',
    textTransform: 'uppercase', letterSpacing: '0.03em', whiteSpace: 'nowrap',
  },
  subTd: { padding: '10px 12px', color: '#374151', borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' },
  exportBtn: {
    padding: '9px 18px', borderRadius: 8, border: '1px solid #059669',
    background: '#ecfdf5', color: '#047857', fontWeight: 700, cursor: 'pointer',
    fontFamily: 'inherit', fontSize: '0.86rem',
  },
  msgBox: (ok) => ({
    marginBottom: 16, padding: '10px 16px', borderRadius: 8,
    background: ok ? '#d4f5eb' : '#fde8e4', color: ok ? '#00b894' : '#e17055', fontWeight: 700,
  }),
};

function stripFontAttrs(node, delta) {
  // Remove font-family and font-size from every pasted op so site font is preserved
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
    // Strip all inline styles (including font-family, font-size from Word/browser) on paste
    matchVisual: false,
    matchers: [
      [Node.ELEMENT_NODE, stripFontAttrs],
    ],
  },
};

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'align',
  'link', 'image',
  'blockquote', 'code-block',
];

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
  const removeEx = (idx) => onChange(exercises.filter((_, i) => i !== idx));

  return (
    <div>
      <div style={S.sectionTitle}>✏️ Bài tập ({exercises.length} câu)</div>
      {exercises.map((ex, idx) => (
        <div key={ex.id || idx} style={S.exCard}>
          <div style={S.exRow}>
            <strong style={{ color: '#667eea', minWidth: 24 }}>#{idx + 1}</strong>
            <select style={{ ...S.select, flex: '0 0 150px' }} value={ex.type} onChange={(e) => updateEx(idx, 'type', e.target.value)}>
              <option value="mcq">Trắc nghiệm</option>
              <option value="fill_blank">Điền vào chỗ trống</option>
            </select>
            <button style={S.removeBtn} onClick={() => removeEx(idx)}>✕ Xóa</button>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={S.fieldLabel}>Câu hỏi</label>
            <input style={S.input} placeholder="Nhập câu hỏi..." value={ex.question} onChange={(e) => updateEx(idx, 'question', e.target.value)} />
          </div>
          {ex.type === 'mcq' && (
            <div style={{ marginBottom: 10 }}>
              <label style={S.fieldLabel}>Các lựa chọn (A, B, C, D)</label>
              {(ex.options || ['', '', '', '']).map((opt, oi) => (
                <input key={oi} style={{ ...S.input, marginBottom: 6 }}
                  placeholder={`Lựa chọn ${String.fromCharCode(65 + oi)}`}
                  value={opt} onChange={(e) => updateOpt(idx, oi, e.target.value)} />
              ))}
            </div>
          )}
          <div style={S.row2}>
            <div>
              <label style={S.fieldLabel}>Đáp án đúng</label>
              {ex.type === 'mcq' ? (
                <select style={S.select} value={ex.answer} onChange={(e) => updateEx(idx, 'answer', e.target.value)}>
                  <option value="">-- Chọn đáp án --</option>
                  {(ex.options || []).filter(Boolean).map((opt, oi) => (
                    <option key={oi} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input style={S.input} placeholder="Nhập đáp án..." value={ex.answer} onChange={(e) => updateEx(idx, 'answer', e.target.value)} />
              )}
            </div>
            <div>
              <label style={S.fieldLabel}>Giải thích (tùy chọn)</label>
              <input style={S.input} placeholder="Giải thích đáp án..." value={ex.explanation} onChange={(e) => updateEx(idx, 'explanation', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <div>
        <button style={S.addExBtn} onClick={() => addEx('mcq')}>+ Trắc nghiệm</button>
        <button style={S.addExBtn} onClick={() => addEx('fill_blank')}>+ Điền từ</button>
      </div>
    </div>
  );
}

function fmtDatetime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
}

function toInputDatetime(iso) {
  if (!iso) return '';
  return iso.slice(0, 16);
}

function LessonsSection() {
  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState('');

  const loadLessons = useCallback(async () => {
    try {
      const res = await grammarApi.getMyLessons();
      setLessons(res.data?.lessons || []);
    } catch { setLessons([]); }
  }, []);

  useEffect(() => { loadLessons(); }, [loadLessons]);

  const handleNew = () => { setSelected(null); setForm(EMPTY_FORM); setMsg(''); };
  const handleSelect = (l) => { setSelected(l); setForm({ ...EMPTY_FORM, ...l }); setMsg(''); };
  const setField = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async (statusOverride) => {
    setSaving(true); setMsg('');
    try {
      const payload = { ...form };
      if (statusOverride) payload.status = statusOverride;
      if (selected) {
        const res = await grammarApi.updateLesson(selected.id, payload);
        setSelected(res.data.lesson); setForm({ ...EMPTY_FORM, ...res.data.lesson });
        setMsg('✅ Đã lưu thay đổi!');
      } else {
        const res = await grammarApi.createLesson(payload);
        setSelected(res.data.lesson); setForm({ ...EMPTY_FORM, ...res.data.lesson });
        setMsg('✅ Tạo bài học thành công!');
      }
      await loadLessons();
    } catch (err) {
      setMsg('❌ Lỗi: ' + (err?.response?.data?.message || err?.message || 'Thử lại.'));
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected || !window.confirm('Xóa bài học này?')) return;
    setDeleting(true);
    try {
      await grammarApi.deleteLesson(selected.id);
      setSelected(null); setForm(EMPTY_FORM); await loadLessons();
      setMsg('🗑️ Đã xóa bài học.');
    } catch { setMsg('❌ Không thể xóa.'); }
    finally { setDeleting(false); }
  };

  return (
    <div style={S.body}>
      <div style={S.sidebar}>
        <div style={S.sidebarTitle}>📖 Bài học của tôi</div>
        <button style={S.addBtn} onClick={handleNew}>+ Tạo bài mới</button>
        {lessons.length === 0 && <div style={{ padding: '12px 20px', color: '#666', fontSize: '0.85rem' }}>Chưa có bài học nào</div>}
        {lessons.map((l) => (
          <div key={l.id} style={S.lessonItem(selected?.id === l.id)} onClick={() => handleSelect(l)}>
            <div style={S.lessonItemTitle}>{l.title || 'Chưa đặt tên'}</div>
            <div style={S.lessonItemMeta}>
              <span style={S.statusDot(l.status)} />
              {l.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}{' · '}{GRADE_LABELS[l.gradeLevel] || l.gradeLevel}
            </div>
          </div>
        ))}
      </div>
      <div style={S.main}>
        <div style={S.mainHeader}>
          <h1 style={S.mainTitle}>{selected ? '✏️ Chỉnh sửa bài học' : '➕ Tạo bài học mới'}</h1>
        </div>
        {msg && <div style={S.msgBox(msg.startsWith('✅') || msg.startsWith('🗑️'))}>{msg}</div>}
        <div style={S.formCard}>
          <div style={{ marginBottom: 16 }}>
            <label style={S.fieldLabel}>Tiêu đề bài học *</label>
            <input style={S.input} placeholder="VD: Thì hiện tại đơn - Present Simple" value={form.title} onChange={(e) => setField('title', e.target.value)} />
          </div>
          <div style={{ ...S.row2, marginBottom: 16 }}>
            <div>
              <label style={S.fieldLabel}>Khối lớp</label>
              <select style={S.select} value={form.gradeLevel} onChange={(e) => setField('gradeLevel', e.target.value)}>
                {GRADE_LEVELS.map((g) => <option key={g} value={g}>{GRADE_LABELS[g]}</option>)}
              </select>
            </div>
            <div>
              <label style={S.fieldLabel}>Chủ đề (Topic)</label>
              <input style={S.input} placeholder="VD: Thì, Câu điều kiện..." value={form.topic} onChange={(e) => setField('topic', e.target.value)} />
            </div>
          </div>
          <div style={{ ...S.row3, marginBottom: 16 }}>
            <div>
              <label style={S.fieldLabel}>Module / Chương</label>
              <input style={S.input} placeholder="VD: Chương 1" value={form.module} onChange={(e) => setField('module', e.target.value)} />
            </div>
            <div>
              <label style={S.fieldLabel}>Tuần học</label>
              <input style={S.input} type="number" min="1" max="52" placeholder="1-52" value={form.weekNumber} onChange={(e) => setField('weekNumber', e.target.value)} />
            </div>
            <div>
              <label style={S.fieldLabel}>Tháng</label>
              <select style={S.select} value={form.month} onChange={(e) => setField('month', e.target.value)}>
                <option value="">-- Chọn tháng --</option>
                {MONTHS.slice(1).map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
              </select>
            </div>
          </div>
          <div style={{ ...S.row2, marginBottom: 16 }}>
            <div>
              <label style={S.fieldLabel}>Năm học</label>
              <input style={S.input} type="number" min="2020" max="2035" value={form.year} onChange={(e) => setField('year', e.target.value)} />
            </div>
            <div>
              <label style={S.fieldLabel}>Video URL (YouTube)</label>
              <input style={S.input} placeholder="https://youtube.com/watch?v=..." value={form.videoUrl} onChange={(e) => setField('videoUrl', e.target.value)} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={S.fieldLabel}>Mô tả ngắn</label>
            <input style={S.input} placeholder="Mô tả nội dung bài học..." value={form.description} onChange={(e) => setField('description', e.target.value)} />
          </div>
          <div style={{ marginBottom: 16 }}>
             <label style={S.fieldLabel}>Nội dung lý thuyết</label>
            <div style={S.quillWrap}>
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(val) => setField('content', val)}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                placeholder="Nhập nội dung lý thuyết..."
                style={{ minHeight: 220 }}
              />
            </div>
          </div>
          <div style={S.divider} />
          <ExerciseBuilder exercises={form.exercises} onChange={(exs) => setField('exercises', exs)} />
          <div style={S.btnRow}>
            <button style={S.saveBtn('rgba(102,126,234,0.15)')} onClick={() => handleSave('draft')} disabled={saving}>{saving ? '...' : '💾 Lưu nháp'}</button>
            <button style={S.saveBtn('linear-gradient(135deg,#667eea,#764ba2)')} onClick={() => handleSave('published')} disabled={saving}>{saving ? '...' : '🚀 Xuất bản'}</button>
            {selected && <button style={S.deleteBtn} onClick={handleDelete} disabled={deleting}>{deleting ? '...' : '🗑️ Xóa bài học'}</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function AssignmentsSection() {
  const [assignments, setAssignments] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_ASSIGN_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState('');
  const [submissions, setSubmissions] = useState(null);
  const [loadingSub, setLoadingSub] = useState(false);
  const [lessons, setLessons] = useState([]);

  const load = useCallback(async () => {
    try {
      const [aRes, cRes, lRes] = await Promise.all([grammarApi.getMyAssignments(), adminApi.getClassrooms(), grammarApi.getMyLessons()]);
      setAssignments(aRes.data?.assignments || []);
      setClassrooms(cRes.data?.classrooms || []);
      setLessons(lRes.data?.lessons || []);
    } catch { setAssignments([]); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleNew = () => { setSelected(null); setForm(EMPTY_ASSIGN_FORM); setMsg(''); setSubmissions(null); };

  const handleSelect = (a) => {
    setSelected(a);
    setForm({ ...EMPTY_ASSIGN_FORM, ...a, dueDate: toInputDatetime(a.dueDate) });
    setMsg(''); setSubmissions(null);
  };

  const setField = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleClassroomChange = (id) => {
    const cls = classrooms.find((c) => c.id === id);
    setForm((prev) => ({ ...prev, classroomId: id, classroomName: cls?.name || '' }));
  };

  const handleSave = async (statusOverride) => {
    if (!form.title.trim()) { setMsg('⚠️ Nhập tiêu đề bài tập.'); return; }
    if (!form.classroomId) { setMsg('⚠️ Chọn lớp để giao bài.'); return; }
    setSaving(true); setMsg('');
    try {
      const payload = { ...form, dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null };
      if (statusOverride) payload.status = statusOverride;
      if (selected) {
        const res = await grammarApi.updateAssignment(selected.id, payload);
        setSelected(res.data.assignment);
        setForm({ ...EMPTY_ASSIGN_FORM, ...res.data.assignment, dueDate: toInputDatetime(res.data.assignment.dueDate) });
        setMsg('✅ Đã cập nhật bài tập!');
      } else {
        const res = await grammarApi.createAssignment(payload);
        setSelected(res.data.assignment);
        setForm({ ...EMPTY_ASSIGN_FORM, ...res.data.assignment, dueDate: toInputDatetime(res.data.assignment.dueDate) });
        setMsg('✅ Đã tạo bài tập!');
      }
      await load();
    } catch (err) {
      setMsg('❌ Lỗi: ' + (err?.response?.data?.message || 'Thử lại.'));
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected || !window.confirm('Xóa bài tập này?')) return;
    setDeleting(true);
    try {
      await grammarApi.deleteAssignment(selected.id);
      setSelected(null); setForm(EMPTY_ASSIGN_FORM); setSubmissions(null); await load();
      setMsg('🗑️ Đã xóa bài tập.');
    } catch { setMsg('❌ Không thể xóa.'); }
    finally { setDeleting(false); }
  };

  const handleLoadSubmissions = async () => {
    if (!selected) return;
    setLoadingSub(true);
    try {
      const res = await grammarApi.getSubmissions(selected.id);
      setSubmissions(res.data?.submissions || []);
    } catch { setSubmissions([]); }
    finally { setLoadingSub(false); }
  };

  const exportExcel = () => {
    if (!submissions || !selected) return;
    import('xlsx').then((XLSX) => {
      const rows = [['STT', 'Học sinh', 'Điểm', 'Tổng điểm', '% Đúng', 'Nộp muộn', 'Thời gian nộp']];
      submissions.forEach((s, i) => {
        const pct = s.maxScore ? Math.round((s.score / s.maxScore) * 100) : 0;
        rows.push([i + 1, s.studentName || s.studentAccountId, s.score, s.maxScore, `${pct}%`, s.isLate ? 'Muộn' : 'Đúng hạn', fmtDatetime(s.submittedAt)]);
      });
      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws['!cols'] = [{ wch: 5 }, { wch: 28 }, { wch: 8 }, { wch: 10 }, { wch: 8 }, { wch: 10 }, { wch: 20 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Diem');
      XLSX.writeFile(wb, `diem_${selected.title.replace(/\s+/g, '_')}.xlsx`);
    });
  };

  return (
    <div style={S.body}>
      <div style={S.sidebar}>
        <div style={S.sidebarTitle}>📋 Bài tập giao lớp</div>
        <button style={S.addBtn} onClick={handleNew}>+ Tạo bài tập mới</button>
        {assignments.length === 0 && <div style={{ padding: '12px 20px', color: '#666', fontSize: '0.85rem' }}>Chưa có bài tập nào</div>}
        {assignments.map((a) => (
          <div key={a.id} style={S.lessonItem(selected?.id === a.id)} onClick={() => handleSelect(a)}>
            <div style={S.lessonItemTitle}>{a.title || 'Chưa đặt tên'}</div>
            <div style={S.lessonItemMeta}>
              <span style={S.statusDot(a.status)} />
              {a.classroomName || '—'}{' · '}
              {a.dueDate ? fmtDatetime(a.dueDate) : 'Không hạn'}
            </div>
          </div>
        ))}
      </div>

      <div style={S.main}>
        <div style={S.mainHeader}>
          <h1 style={S.mainTitle}>{selected ? '✏️ Chỉnh sửa bài tập' : '➕ Tạo bài tập mới'}</h1>
        </div>
        {msg && <div style={S.msgBox(msg.startsWith('✅') || msg.startsWith('🗑️'))}>{msg}</div>}

        <div style={S.formCard}>
          <div style={{ marginBottom: 16 }}>
            <label style={S.fieldLabel}>Tiêu đề bài tập *</label>
            <input style={S.input} placeholder="VD: Bài tập tuần 5 - Thì hiện tại đơn" value={form.title} onChange={(e) => setField('title', e.target.value)} />
          </div>

          <div style={{ ...S.row2, marginBottom: 16 }}>
            <div>
              <label style={S.fieldLabel}>Lớp giao bài *</label>
              <select style={S.select} value={form.classroomId} onChange={(e) => handleClassroomChange(e.target.value)}>
                <option value="">-- Chọn lớp --</option>
                {classrooms.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={S.fieldLabel}>Khối lớp</label>
              <select style={S.select} value={form.gradeLevel} onChange={(e) => setField('gradeLevel', e.target.value)}>
                {GRADE_LEVELS.map((g) => <option key={g} value={g}>{GRADE_LABELS[g]}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={S.fieldLabel}>Gắn với bài học ngữ pháp (tùy chọn)</label>
            <select style={S.select} value={form.lessonId} onChange={(e) => setField('lessonId', e.target.value)}>
              <option value="">-- Không gắn với bài học cụ thể --</option>
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>{l.title}{l.gradeLevel !== 'all' ? ` (${GRADE_LABELS[l.gradeLevel] || l.gradeLevel})` : ''}</option>
              ))}
            </select>
            <div style={{ marginTop: 5, fontSize: '0.8rem', color: '#888' }}>
              Khi chọn bài học, học sinh sẽ thấy bài tập này ngay trong trang chi tiết bài học đó.
            </div>
          </div>

          <div style={{ ...S.row3, marginBottom: 16 }}>
            <div>
              <label style={S.fieldLabel}>Hạn nộp bài *</label>
              <input style={S.input} type="datetime-local" value={form.dueDate} onChange={(e) => setField('dueDate', e.target.value)} />
            </div>
            <div>
              <label style={S.fieldLabel}>Tuần học</label>
              <input style={S.input} type="number" min="1" max="52" placeholder="1-52" value={form.weekNumber} onChange={(e) => setField('weekNumber', e.target.value)} />
            </div>
            <div>
              <label style={S.fieldLabel}>Năm học</label>
              <input style={S.input} type="number" min="2020" max="2035" value={form.year} onChange={(e) => setField('year', e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={S.fieldLabel}>Mô tả / Hướng dẫn</label>
            <textarea style={{ ...S.textarea, minHeight: 80 }} placeholder="Hướng dẫn làm bài..." value={form.description} onChange={(e) => setField('description', e.target.value)} />
          </div>

          <div style={S.divider} />
          <ExerciseBuilder exercises={form.exercises} onChange={(exs) => setField('exercises', exs)} />

          <div style={S.btnRow}>
            <button style={S.saveBtn('rgba(102,126,234,0.15)')} onClick={() => handleSave('draft')} disabled={saving}>{saving ? '...' : '💾 Lưu nháp'}</button>
            <button style={S.saveBtn('linear-gradient(135deg,#667eea,#764ba2)')} onClick={() => handleSave('active')} disabled={saving}>{saving ? '...' : '🚀 Kích hoạt'}</button>
            {selected && <button style={S.deleteBtn} onClick={handleDelete} disabled={deleting}>{deleting ? '...' : '🗑️ Xóa bài tập'}</button>}
          </div>
        </div>

        {selected && (
          <div style={{ ...S.formCard, marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#333' }}>
                📊 Điểm học sinh {submissions ? `(${submissions.length} bài nộp)` : ''}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={S.saveBtn('linear-gradient(135deg,#667eea,#764ba2)')} onClick={handleLoadSubmissions} disabled={loadingSub}>
                  {loadingSub ? 'Đang tải...' : '🔄 Tải điểm'}
                </button>
                {submissions && submissions.length > 0 && (
                  <button style={S.exportBtn} onClick={exportExcel}>📥 Xuất Excel</button>
                )}
              </div>
            </div>

            {submissions === null && (
              <div style={{ color: '#888', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
                Nhấn "Tải điểm" để xem kết quả của học sinh.
              </div>
            )}
            {submissions !== null && submissions.length === 0 && (
              <div style={{ color: '#888', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
                Chưa có học sinh nào nộp bài.
              </div>
            )}
            {submissions !== null && submissions.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={S.subTable}>
                  <thead>
                    <tr>
                      {['#', 'Học sinh', 'Điểm', 'Tổng', '%', 'Trạng thái', 'Thời gian nộp'].map((h) => (
                        <th key={h} style={S.subTh}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s, i) => {
                      const pct = s.maxScore ? Math.round((s.score / s.maxScore) * 100) : 0;
                      return (
                        <tr key={s.id}>
                          <td style={S.subTd}>{i + 1}</td>
                          <td style={{ ...S.subTd, fontWeight: 700 }}>{s.studentName || s.studentAccountId}</td>
                          <td style={{ ...S.subTd, fontWeight: 800, color: '#1d4ed8' }}>{s.score}</td>
                          <td style={S.subTd}>{s.maxScore}</td>
                          <td style={{ ...S.subTd, fontWeight: 700, color: pct >= 80 ? '#047857' : pct >= 50 ? '#d97706' : '#b91c1c' }}>{pct}%</td>
                          <td style={S.subTd}>
                            <span style={{
                              padding: '3px 10px', borderRadius: 999, fontSize: '0.76rem', fontWeight: 700,
                              background: s.isLate ? '#fff7ed' : '#ecfdf5',
                              color: s.isLate ? '#c2410c' : '#047857',
                              border: s.isLate ? '1px solid #fed7aa' : '1px solid #a7f3d0',
                            }}>
                              {s.isLate ? '⚠️ Muộn' : '✓ Đúng hạn'}
                            </span>
                          </td>
                          <td style={{ ...S.subTd, color: '#64748b', fontSize: '0.84rem' }}>{fmtDatetime(s.submittedAt)}</td>
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

function TeacherGrammarPage() {
  useTitle('Quản lý ngữ pháp');
  const [mode, setMode] = useState('lessons');

  return (
    <div style={S.page}>
      <div style={S.modebar}>
        <button style={S.modeBtn(mode === 'lessons')} onClick={() => setMode('lessons')}>📖 Bài học lý thuyết</button>
        <button style={S.modeBtn(mode === 'assignments')} onClick={() => setMode('assignments')}>📋 Bài tập giao lớp</button>
      </div>
      {mode === 'lessons' && <LessonsSection />}
      {mode === 'assignments' && <AssignmentsSection />}
    </div>
  );
}

export default TeacherGrammarPage;