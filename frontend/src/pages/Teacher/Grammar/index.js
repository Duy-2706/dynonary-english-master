import grammarApi from 'apis/grammarApi';
import useTitle from 'hooks/useTitle';
import React, { useCallback, useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useHistory } from 'react-router-dom';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';

const GRADE_LEVELS = ['all', '6', '7', '8', '9', '10', '11', '12'];

const GRADE_LABELS = {
  all: 'Tất cả khối',
  6: 'Khối 6',
  7: 'Khối 7',
  8: 'Khối 8',
  9: 'Khối 9',
  10: 'Khối 10',
  11: 'Khối 11',
  12: 'Khối 12',
};

const MONTHS = ['', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

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

const EMPTY_EX = {
  question: '',
  type: 'mcq',
  options: ['', '', '', ''],
  answer: '',
  explanation: '',
};

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 12% 18%, rgba(25,199,168,.22) 0 4px, transparent 5px),
      radial-gradient(circle at 86% 24%, rgba(255,191,31,.16) 0 5px, transparent 6px),
      radial-gradient(circle at 34% 74%, rgba(255,255,255,.10) 0 3px, transparent 4px),
      linear-gradient(180deg, #063c46 0%, #042b33 100%)
    `,
    backgroundSize: '90px 90px, 130px 130px, 110px 110px, auto',
    fontFamily: GAME_FONT,
    display: 'flex',
    color: '#032f35',
  },

  sidebar: {
    width: 340,
    background: 'linear-gradient(180deg, #16c7ae 0%, #049178 100%)',
    color: '#fff',
    padding: '28px 0',
    flexShrink: 0,
    height: '100vh',
    position: 'sticky',
    top: 0,
    overflowY: 'auto',
    borderRight: '6px solid rgba(255,255,255,.65)',
    boxShadow: '10px 0 30px rgba(0,0,0,.22)',
  },

  sidebarTop: {
    padding: '0 24px 22px',
  },

  sidebarBadge: {
    display: 'inline-block',
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '8px 18px',
    fontWeight: 900,
    fontSize: '1.05rem',
    boxShadow: '0 6px 0 #bd5f00',
    marginBottom: 14,
    textShadow: '0 2px 0 rgba(0,0,0,.18)',
  },

  sidebarTitle: {
    fontWeight: 900,
    fontSize: '2.15rem',
    lineHeight: 1,
    color: '#fff',
    margin: 0,
    textShadow: '0 4px 0 rgba(0,0,0,.25)',
  },

  sidebarSub: {
    color: '#f4fffd',
    fontWeight: 900,
    fontSize: '1.08rem',
    marginTop: 10,
    lineHeight: 1.45,
    textShadow: '0 2px 0 rgba(0,0,0,.15)',
  },

  addBtn: {
    margin: '0 22px 22px',
    display: 'block',
    padding: '16px 20px',
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 999,
    cursor: 'pointer',
    fontWeight: 900,
    fontSize: '1.18rem',
    width: 'calc(100% - 44px)',
    textAlign: 'center',
    fontFamily: GAME_FONT,
    boxShadow: '0 8px 0 #bd5f00',
    textShadow: '0 2px 0 rgba(0,0,0,.2)',
  },

  emptySidebar: {
    margin: '14px 22px',
    padding: '20px',
    color: '#fff',
    fontSize: '1.05rem',
    fontWeight: 900,
    background: 'rgba(255,255,255,.16)',
    borderRadius: 22,
    border: '3px dashed rgba(255,255,255,.55)',
    lineHeight: 1.45,
  },

  lessonItem: (active) => ({
    margin: '0 18px 12px',
    padding: '17px 18px',
    cursor: 'pointer',
    borderRadius: 24,
    border: active ? '4px solid #fff' : '3px solid rgba(255,255,255,.34)',
    background: active ? 'rgba(255,255,255,.28)' : 'rgba(255,255,255,.13)',
    transition: 'all .18s ease',
    boxShadow: active ? '0 8px 0 rgba(0,0,0,.16)' : 'none',
  }),

  lessonItemTitle: {
    fontSize: '1.15rem',
    fontWeight: 900,
    color: '#fff',
    marginBottom: 7,
    lineHeight: 1.28,
    textShadow: '0 2px 0 rgba(0,0,0,.18)',
  },

  lessonItemMeta: {
    fontSize: '.95rem',
    color: '#f1fffc',
    fontWeight: 900,
    lineHeight: 1.35,
  },

  statusDot: (status) => ({
    display: 'inline-block',
    width: 11,
    height: 11,
    borderRadius: '50%',
    background: status === 'published' ? '#36e27d' : '#ffdf3b',
    marginRight: 8,
    boxShadow: '0 0 0 3px rgba(255,255,255,.35)',
  }),

  main: {
    flex: 1,
    padding: '38px 46px 80px',
    overflowY: 'auto',
  },

  hero: {
    background: 'linear-gradient(180deg, #ffffff 0%, #eefdf9 100%)',
    borderRadius: 36,
    border: '7px solid rgba(255,255,255,.96)',
    boxShadow: '0 12px 0 rgba(7,148,127,.55), 0 24px 48px rgba(0,0,0,.22)',
    padding: '38px 42px',
    marginBottom: 34,
    position: 'relative',
    overflow: 'hidden',
  },

  heroDecor: {
    position: 'absolute',
    right: 36,
    top: 26,
    fontSize: '5rem',
    opacity: 0.16,
    transform: 'rotate(-10deg)',
  },

  mainHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 22,
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 2,
  },

  mainTitle: {
    fontSize: 'clamp(3rem, 4.8vw, 4.8rem)',
    fontWeight: 900,
    color: '#06434b',
    margin: 0,
    lineHeight: 0.95,
    letterSpacing: '.2px',
    textShadow: '0 4px 0 rgba(25,199,168,.18)',
  },

  mainSub: {
    color: '#07685d',
    fontWeight: 900,
    fontSize: '1.25rem',
    margin: '14px 0 0',
    lineHeight: 1.45,
  },

  miniStats: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
  },

  miniStat: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '11px 20px',
    fontWeight: 900,
    fontSize: '1.08rem',
    boxShadow: '0 7px 0 #bd5f00',
    textShadow: '0 2px 0 rgba(0,0,0,.18)',
  },

  msg: (ok) => ({
    marginBottom: 22,
    padding: '16px 20px',
    borderRadius: 22,
    background: ok ? '#d4f5eb' : '#fde8e4',
    color: ok ? '#0f766e' : '#dc2626',
    fontWeight: 900,
    fontSize: '1.08rem',
    border: `4px solid ${ok ? '#a8e8db' : '#f9bdb4'}`,
    boxShadow: '0 6px 0 rgba(0,0,0,.10)',
  }),

  formCard: {
    background: '#fff',
    borderRadius: 36,
    padding: '42px',
    boxShadow: '0 12px 0 rgba(7,148,127,.42), 0 24px 48px rgba(0,0,0,.20)',
    border: '7px solid rgba(255,255,255,.95)',
  },

  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 22,
  },

  row3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 18,
  },

  fieldLabel: {
    display: 'block',
    fontWeight: 900,
    color: '#023b42',
    fontSize: '1.12rem',
    marginBottom: 10,
    lineHeight: 1.3,
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '17px 20px',
    borderRadius: 22,
    border: '4px solid #d6f3ed',
    fontSize: '1.18rem',
    outline: 'none',
    color: '#033b42',
    fontWeight: 900,
    fontFamily: GAME_FONT,
    transition: 'border-color .2s, box-shadow .2s',
    boxShadow: '0 5px 0 rgba(7,148,127,.10)',
    background: '#fff',
  },

  select: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '17px 20px',
    borderRadius: 22,
    border: '4px solid #d6f3ed',
    fontSize: '1.18rem',
    background: '#fff',
    color: '#033b42',
    fontWeight: 900,
    fontFamily: GAME_FONT,
    outline: 'none',
    boxShadow: '0 5px 0 rgba(7,148,127,.10)',
  },

  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '18px 20px',
    borderRadius: 26,
    border: '4px solid #d6f3ed',
    fontSize: '1.18rem',
    outline: 'none',
    minHeight: 190,
    resize: 'vertical',
    fontFamily: GAME_FONT,
    color: '#033b42',
    fontWeight: 900,
    lineHeight: 1.65,
    boxShadow: '0 5px 0 rgba(7,148,127,.10)',
    background: '#fff',
  },

  divider: {
    height: 5,
    background: 'linear-gradient(90deg,#19c7a8,#ffdf3b,#ff8a00)',
    margin: '36px 0',
    borderRadius: 999,
  },

  sectionTitle: {
    fontWeight: 900,
    color: '#023b42',
    fontSize: '1.65rem',
    margin: '0 0 22px',
  },

  exCard: {
    border: '5px solid #d6f3ed',
    borderRadius: 30,
    padding: '26px',
    marginBottom: 20,
    background: 'linear-gradient(180deg,#f3fffc,#ffffff)',
    boxShadow: '0 8px 0 rgba(7,148,127,.14)',
  },

  exRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },

  exNumber: {
    color: '#fff',
    background: 'linear-gradient(180deg,#19c7a8,#07947f)',
    minWidth: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: '1.15rem',
    border: '4px solid #fff',
    boxShadow: '0 5px 0 rgba(0,0,0,.16)',
  },

  removeBtn: {
    background: 'linear-gradient(180deg,#ff8a8a,#e53935)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '10px 18px',
    cursor: 'pointer',
    fontWeight: 900,
    fontSize: '1rem',
    whiteSpace: 'nowrap',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 rgba(141,22,22,.28)',
    textShadow: '0 2px 0 rgba(0,0,0,.18)',
  },

  addExBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eefdf9)',
    color: '#056d5e',
    border: '4px solid #19c7a8',
    borderRadius: 999,
    padding: '13px 24px',
    cursor: 'pointer',
    fontWeight: 900,
    fontSize: '1.12rem',
    marginRight: 12,
    marginBottom: 12,
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 rgba(7,148,127,.20)',
  },

  btnRow: {
    display: 'flex',
    gap: 16,
    marginTop: 32,
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  saveBtn: (type) => ({
    padding: '16px 34px',
    borderRadius: 999,
    border: '4px solid #fff',
    cursor: 'pointer',
    background:
      type === 'publish'
        ? 'linear-gradient(180deg,#ffdf3b,#ff8a00)'
        : 'linear-gradient(180deg,#19c7a8,#07947f)',
    color: '#fff',
    fontWeight: 900,
    fontSize: '1.18rem',
    fontFamily: GAME_FONT,
    boxShadow:
      type === 'publish'
        ? '0 8px 0 #bd5f00'
        : '0 8px 0 #087565',
    textShadow: '0 2px 0 rgba(0,0,0,.18)',
  }),

  deleteBtn: {
    padding: '16px 30px',
    borderRadius: 999,
    border: '4px solid #fff',
    cursor: 'pointer',
    background: 'linear-gradient(180deg,#ff8a8a,#e53935)',
    color: '#fff',
    fontWeight: 900,
    fontSize: '1.18rem',
    marginLeft: 'auto',
    fontFamily: GAME_FONT,
    boxShadow: '0 8px 0 rgba(141,22,22,.36)',
    textShadow: '0 2px 0 rgba(0,0,0,.18)',
  },

  noAccess: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#042b33',
    flexDirection: 'column',
    gap: 12,
    fontFamily: GAME_FONT,
  },
};

function TeacherGrammarPage() {
  useTitle('Quản lý ngữ pháp');

  // const userInfo = useSelector((s) => s.userInfo);
  // const history = useHistory();

  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState('');

  // const isAllowed = userInfo?.role === 'teacher' || userInfo?.role === 'admin';

  const loadLessons = useCallback(async () => {
    try {
      const res = await grammarApi.getMyLessons();
      setLessons(res.data?.lessons || []);
    } catch {
      setLessons([]);
    }
  }, []);

  // useEffect(() => { if (isAllowed) loadLessons(); }, [isAllowed, loadLessons]);
  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

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
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async (statusOverride) => {
    setSaving(true);
    setMsg('');

    try {
      const payload = { ...form };

      if (statusOverride) payload.status = statusOverride;

      if (selected) {
        const res = await grammarApi.updateLesson(selected.id, payload);
        setSelected(res.data.lesson);
        setForm({ ...EMPTY_FORM, ...res.data.lesson });
        setMsg('✅ Đã lưu thay đổi!');
      } else {
        const res = await grammarApi.createLesson(payload);
        const created = res.data.lesson;
        setSelected(created);
        setForm({ ...EMPTY_FORM, ...created });
        setMsg('✅ Tạo bài học thành công!');
      }

      await loadLessons();
    } catch (err) {
      setMsg(`❌ Lỗi khi lưu: ${err?.response?.data?.message || err?.message || 'Thử lại.'}`);
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
      setMsg('✅ Đã xóa bài học.');
    } catch {
      setMsg('❌ Không thể xóa.');
    } finally {
      setDeleting(false);
    }
  };

  // if (!isAllowed) {
  //   return (
  //     <div style={S.noAccess}>
  //       <div style={{ fontSize: '3rem' }}>🚫</div>
  //       <div style={{ fontWeight: 700, color: '#fff' }}>Chỉ giáo viên mới có thể truy cập trang này.</div>
  //       <button style={S.saveBtn('publish')} onClick={() => history.push('/')}>Về trang chủ</button>
  //     </div>
  //   );
  // }

  const publishedCount = lessons.filter((l) => l.status === 'published').length;
  const draftCount = lessons.length - publishedCount;

  return (
    <div style={S.page}>
      <div style={S.sidebar}>
        <div style={S.sidebarTop}>
          <div style={S.sidebarBadge}>TEACHER</div>
          <h2 style={S.sidebarTitle}>Grammar Studio</h2>
          <div style={S.sidebarSub}>Tạo bài học ngữ pháp sinh động cho học sinh</div>
        </div>

        <button style={S.addBtn} onClick={handleNew}>
          + Tạo bài mới
        </button>

        {lessons.length === 0 && (
          <div style={S.emptySidebar}>
            Chưa có bài học nào. Hãy tạo bài đầu tiên nhé!
          </div>
        )}

        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            style={S.lessonItem(selected?.id === lesson.id)}
            onClick={() => handleSelect(lesson)}
          >
            <div style={S.lessonItemTitle}>{lesson.title || 'Chưa đặt tên'}</div>
            <div style={S.lessonItemMeta}>
              <span style={S.statusDot(lesson.status)} />
              {lesson.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
              {' · '}
              {GRADE_LABELS[lesson.gradeLevel] || lesson.gradeLevel}
            </div>
          </div>
        ))}
      </div>

      <div style={S.main}>
        <div style={S.hero}>
          <div style={S.heroDecor}>✏️</div>

          <div style={S.mainHeader}>
            <div>
              <h1 style={S.mainTitle}>
                {selected ? 'Chỉnh Sửa Bài Học' : 'Tạo Bài Học Mới'}
              </h1>
              <p style={S.mainSub}>
                Đồng bộ nội dung, video và bài tập ngữ pháp theo từng khối lớp.
              </p>
            </div>

            <div style={S.miniStats}>
              <span style={S.miniStat}>📚 {lessons.length} bài</span>
              <span style={S.miniStat}>🚀 {publishedCount} xuất bản</span>
              <span style={S.miniStat}>📝 {draftCount} nháp</span>
            </div>
          </div>
        </div>

        {msg && <div style={S.msg(msg.startsWith('✅'))}>{msg}</div>}

        <div style={S.formCard}>
          <div style={{ marginBottom: 18 }}>
            <label style={S.fieldLabel}>Tiêu đề bài học *</label>
            <input
              style={S.input}
              placeholder="VD: Thì hiện tại đơn - Present Simple"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
            />
          </div>

          <div style={{ ...S.row2, marginBottom: 18 }}>
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
              <label style={S.fieldLabel}>Chủ đề (Topic)</label>
              <input
                style={S.input}
                placeholder="VD: Thì, Câu điều kiện, Mệnh đề..."
                value={form.topic}
                onChange={(e) => setField('topic', e.target.value)}
              />
            </div>
          </div>

          <div style={{ ...S.row3, marginBottom: 18 }}>
            <div>
              <label style={S.fieldLabel}>Module / Chương</label>
              <input
                style={S.input}
                placeholder="VD: Chương 1"
                value={form.module}
                onChange={(e) => setField('module', e.target.value)}
              />
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

            <div>
              <label style={S.fieldLabel}>Tháng</label>
              <select
                style={S.select}
                value={form.month}
                onChange={(e) => setField('month', e.target.value)}
              >
                <option value="">-- Chọn tháng --</option>
                {MONTHS.slice(1).map((m, i) => (
                  <option key={i + 1} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ ...S.row2, marginBottom: 18 }}>
            <div>
              <label style={S.fieldLabel}>Năm học</label>
              <input
                style={S.input}
                type="number"
                min="2020"
                max="2030"
                value={form.year}
                onChange={(e) => setField('year', e.target.value)}
              />
            </div>

            <div>
              <label style={S.fieldLabel}>Video URL (YouTube)</label>
              <input
                style={S.input}
                placeholder="https://youtube.com/watch?v=..."
                value={form.videoUrl}
                onChange={(e) => setField('videoUrl', e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={S.fieldLabel}>Mô tả ngắn</label>
            <input
              style={S.input}
              placeholder="Mô tả nội dung bài học..."
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={S.fieldLabel}>Nội dung lý thuyết (hỗ trợ HTML)</label>
            <textarea
              style={S.textarea}
              placeholder="Nhập nội dung lý thuyết, có thể dùng <b>, <ul>, <li>..."
              value={form.content}
              onChange={(e) => setField('content', e.target.value)}
            />
          </div>

          <div style={S.divider} />

          <div style={S.sectionTitle}>✏️ Bài tập ({form.exercises.length} câu)</div>

          {form.exercises.map((ex, idx) => (
            <div key={ex.id || idx} style={S.exCard}>
              <div style={S.exRow}>
                <strong style={S.exNumber}>{idx + 1}</strong>

                <select
                  style={{ ...S.select, flex: '0 0 190px' }}
                  value={ex.type}
                  onChange={(e) => updateEx(idx, 'type', e.target.value)}
                >
                  <option value="mcq">Trắc nghiệm</option>
                  <option value="fill_blank">Điền vào chỗ trống</option>
                </select>

                <button style={S.removeBtn} onClick={() => removeEx(idx)}>
                  ✕ Xóa
                </button>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={S.fieldLabel}>Câu hỏi</label>
                <input
                  style={S.input}
                  placeholder="Nhập câu hỏi..."
                  value={ex.question}
                  onChange={(e) => updateEx(idx, 'question', e.target.value)}
                />
              </div>

              {ex.type === 'mcq' && (
                <div style={{ marginBottom: 12 }}>
                  <label style={S.fieldLabel}>Các lựa chọn (A, B, C, D)</label>
                  {(ex.options || ['', '', '', '']).map((opt, optIndex) => (
                    <input
                      key={optIndex}
                      style={{ ...S.input, marginBottom: 8 }}
                      placeholder={`Lựa chọn ${String.fromCharCode(65 + optIndex)}`}
                      value={opt}
                      onChange={(e) => updateExOption(idx, optIndex, e.target.value)}
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
                      <option value="">-- Chọn đáp án --</option>
                      {(ex.options || []).filter(Boolean).map((opt, optIndex) => (
                        <option key={optIndex} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      style={S.input}
                      placeholder="Nhập đáp án..."
                      value={ex.answer}
                      onChange={(e) => updateEx(idx, 'answer', e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label style={S.fieldLabel}>Giải thích</label>
                  <input
                    style={S.input}
                    placeholder="Giải thích tại sao đáp án này đúng..."
                    value={ex.explanation}
                    onChange={(e) => updateEx(idx, 'explanation', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          <div>
            <button style={S.addExBtn} onClick={() => addExercise('mcq')}>
              + Trắc nghiệm
            </button>
            <button style={S.addExBtn} onClick={() => addExercise('fill_blank')}>
              + Điền từ
            </button>
          </div>

          <div style={S.btnRow}>
            <button
              style={S.saveBtn('draft')}
              onClick={() => handleSave('draft')}
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : '💾 Lưu nháp'}
            </button>

            <button
              style={S.saveBtn('publish')}
              onClick={() => handleSave('published')}
              disabled={saving}
            >
              {saving ? 'Đang xuất bản...' : '🚀 Xuất bản'}
            </button>

            {selected && (
              <button style={S.deleteBtn} onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Đang xóa...' : '🗑️ Xóa bài học'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherGrammarPage;