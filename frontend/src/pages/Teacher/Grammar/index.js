import grammarApi from 'apis/grammarApi';
import useTitle from 'hooks/useTitle';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const GRADE_LEVELS = ['all', '6', '7', '8', '9', '10', '11', '12'];
const GRADE_LABELS = {
  all: 'Tất cả khối', '6': 'Khối 6', '7': 'Khối 7', '8': 'Khối 8',
  '9': 'Khối 9', '10': 'Khối 10', '11': 'Khối 11', '12': 'Khối 12',
};
const MONTHS = ['', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

const EMPTY_FORM = {
  title: '', description: '', videoUrl: '', content: '',
  gradeLevel: 'all', topic: '', module: '',
  weekNumber: '', month: '', year: new Date().getFullYear(),
  exercises: [], status: 'draft',
};

const EMPTY_EX = { question: '', type: 'mcq', options: ['', '', '', ''], answer: '', explanation: '' };

const S = {
  page: { minHeight: '100vh', background: '#f4f6fb', fontFamily: "'Segoe UI', sans-serif", display: 'flex' },
  sidebar: {
    width: 280, background: '#1a1a2e', color: '#fff', padding: '24px 0',
    flexShrink: 0, height: '100vh', position: 'sticky', top: 0, overflowY: 'auto',
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
    background: active ? 'rgba(102,126,234,0.15)' : 'transparent',
    transition: 'all 0.15s',
  }),
  lessonItemTitle: { fontSize: '0.9rem', fontWeight: 600, color: '#eee', marginBottom: 3, lineHeight: 1.3 },
  lessonItemMeta: { fontSize: '0.75rem', color: '#888' },
  statusDot: (status) => ({
    display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
    background: status === 'published' ? '#00b894' : '#f39c12', marginRight: 4,
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
    transition: 'border-color 0.2s',
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
  divider: { height: 1, background: '#f0f0f0', margin: '24px 0' },
  sectionTitle: { fontWeight: 800, color: '#333', fontSize: '1rem', margin: '0 0 16px' },
  exCard: {
    border: '1.5px solid #e8e8f0', borderRadius: 12, padding: '18px',
    marginBottom: 14, background: '#fafafe',
  },
  exRow: { display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 },
  removeBtn: {
    background: '#fee2e2', color: '#e17055', border: 'none', borderRadius: 6,
    padding: '6px 12px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
    whiteSpace: 'nowrap',
  },
  addExBtn: {
    background: '#ede9ff', color: '#667eea', border: 'none', borderRadius: 8,
    padding: '10px 18px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
    marginRight: 10,
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
  noAccess: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#f4f6fb', flexDirection: 'column', gap: 12,
  },
};

function TeacherGrammarPage() {
  useTitle('Quản lý ngữ pháp');
  const userInfo = useSelector((s) => s.userInfo);
  const history = useHistory();

  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState(null); // lesson being edited
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState('');

  const isAllowed = userInfo?.role === 'teacher' || userInfo?.role === 'admin';

  const loadLessons = useCallback(async () => {
    try {
      const res = await grammarApi.getMyLessons();
      setLessons(res.data?.lessons || []);
    } catch {
      setLessons([]);
    }
  }, []);

  useEffect(() => { if (isAllowed) loadLessons(); }, [isAllowed, loadLessons]);

  const handleNew = () => {
    setSelected(null);
    setForm(EMPTY_FORM);
    setMsg('');
  };

  const handleSelect = (lesson) => {
    setSelected(lesson);
    setForm({ ...EMPTY_FORM, ...lesson });
    setMsg('');
  };

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // ── Exercise helpers ──
  const addExercise = (type) => {
    setForm((prev) => ({
      ...prev,
      exercises: [...prev.exercises, { ...EMPTY_EX, id: `new_${Date.now()}`, type }],
    }));
  };

  const updateEx = (idx, key, value) => {
    setForm((prev) => {
      const exs = [...prev.exercises];
      exs[idx] = { ...exs[idx], [key]: value };
      return { ...prev, exercises: exs };
    });
  };

  const updateExOption = (idx, optIdx, value) => {
    setForm((prev) => {
      const exs = [...prev.exercises];
      const opts = [...(exs[idx].options || [])];
      opts[optIdx] = value;
      exs[idx] = { ...exs[idx], options: opts };
      return { ...prev, exercises: exs };
    });
  };

  const removeEx = (idx) => {
    setForm((prev) => ({ ...prev, exercises: prev.exercises.filter((_, i) => i !== idx) }));
  };

  // ── Save ──
  const handleSave = async (statusOverride) => {
    setSaving(true);
    setMsg('');
    try {
      const payload = { ...form };
      if (statusOverride) payload.status = statusOverride;
      if (selected) {
        await grammarApi.updateLesson(selected.id, payload);
        setMsg('✅ Đã lưu thay đổi!');
      } else {
        const res = await grammarApi.createLesson(payload);
        setSelected(res.data.lesson);
        setMsg('✅ Tạo bài học thành công!');
      }
      await loadLessons();
    } catch {
      setMsg('❌ Lỗi khi lưu. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected || !window.confirm('Xóa bài học này?')) return;
    setDeleting(true);
    try {
      await grammarApi.deleteLesson(selected.id);
      setSelected(null);
      setForm(EMPTY_FORM);
      await loadLessons();
      setMsg('🗑️ Đã xóa bài học.');
    } catch {
      setMsg('❌ Không thể xóa.');
    } finally {
      setDeleting(false);
    }
  };

  if (!isAllowed) {
    return (
      <div style={S.noAccess}>
        <div style={{ fontSize: '3rem' }}>🚫</div>
        <div style={{ fontWeight: 700, color: '#555' }}>Chỉ giáo viên mới có thể truy cập trang này.</div>
        <button style={S.saveBtn('#667eea')} onClick={() => history.push('/')}>Về trang chủ</button>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.sidebarTitle}>📖 Bài học của tôi</div>
        <button style={S.addBtn} onClick={handleNew}>+ Tạo bài mới</button>
        {lessons.length === 0 && (
          <div style={{ padding: '12px 20px', color: '#666', fontSize: '0.85rem' }}>
            Chưa có bài học nào
          </div>
        )}
        {lessons.map((l) => (
          <div key={l.id} style={S.lessonItem(selected?.id === l.id)} onClick={() => handleSelect(l)}>
            <div style={S.lessonItemTitle}>{l.title || 'Chưa đặt tên'}</div>
            <div style={S.lessonItemMeta}>
              <span style={S.statusDot(l.status)} />
              {l.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
              {' · '}{GRADE_LABELS[l.gradeLevel] || l.gradeLevel}
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={S.main}>
        <div style={S.mainHeader}>
          <h1 style={S.mainTitle}>
            {selected ? '✏️ Chỉnh sửa bài học' : '➕ Tạo bài học mới'}
          </h1>
        </div>

        {msg && (
          <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 8, background: msg.startsWith('✅') ? '#d4f5eb' : '#fde8e4', color: msg.startsWith('✅') ? '#00b894' : '#e17055', fontWeight: 700 }}>
            {msg}
          </div>
        )}

        <div style={S.formCard}>
          {/* Basic info */}
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
              <input style={S.input} placeholder="VD: Thì, Câu điều kiện, Mệnh đề..." value={form.topic} onChange={(e) => setField('topic', e.target.value)} />
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
              <input style={S.input} type="number" min="2020" max="2030" value={form.year} onChange={(e) => setField('year', e.target.value)} />
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
            <label style={S.fieldLabel}>Nội dung lý thuyết (hỗ trợ HTML)</label>
            <textarea style={S.textarea} placeholder="Nhập nội dung lý thuyết, có thể dùng <b>, <ul>, <li>..." value={form.content} onChange={(e) => setField('content', e.target.value)} />
          </div>

          <div style={S.divider} />

          {/* Exercises */}
          <div style={S.sectionTitle}>✏️ Bài tập ({form.exercises.length} câu)</div>

          {form.exercises.map((ex, idx) => (
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
                    <input
                      key={oi}
                      style={{ ...S.input, marginBottom: 6 }}
                      placeholder={`Lựa chọn ${String.fromCharCode(65 + oi)}`}
                      value={opt}
                      onChange={(e) => updateExOption(idx, oi, e.target.value)}
                    />
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
                  <input style={S.input} placeholder="Giải thích tại sao đáp án này đúng..." value={ex.explanation} onChange={(e) => updateEx(idx, 'explanation', e.target.value)} />
                </div>
              </div>
            </div>
          ))}

          <div>
            <button style={S.addExBtn} onClick={() => addExercise('mcq')}>+ Trắc nghiệm</button>
            <button style={S.addExBtn} onClick={() => addExercise('fill_blank')}>+ Điền từ</button>
          </div>

          <div style={S.btnRow}>
            <button style={S.saveBtn('rgba(102,126,234,0.15)')} onClick={() => handleSave('draft')} disabled={saving}>
              {saving ? '...' : '💾 Lưu nháp'}
            </button>
            <button style={S.saveBtn('linear-gradient(135deg,#667eea,#764ba2)')} onClick={() => handleSave('published')} disabled={saving}>
              {saving ? '...' : '🚀 Xuất bản'}
            </button>
            {selected && (
              <button style={S.deleteBtn} onClick={handleDelete} disabled={deleting}>
                {deleting ? '...' : '🗑️ Xóa bài học'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherGrammarPage;
