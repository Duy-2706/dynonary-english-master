import grammarApi from 'apis/grammarApi';
import useTitle from 'hooks/useTitle';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const GRADE_LEVELS = ['all', '6', '7', '8', '9', '10', '11', '12'];
const GRADE_LABELS = {
  all: 'Tất cả',
  '6': 'Khối 6', '7': 'Khối 7', '8': 'Khối 8', '9': 'Khối 9',
  '10': 'Khối 10', '11': 'Khối 11', '12': 'Khối 12',
};
const MONTHS = ['', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

const S = {
  page: { minHeight: '100vh', background: '#f0f4f8', fontFamily: "'Segoe UI', sans-serif" },
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 24px 60px',
    textAlign: 'center',
    color: '#fff',
  },
  heroTitle: { fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, margin: '0 0 10px' },
  heroSub: { fontSize: '1.05rem', opacity: 0.85, margin: 0 },
  body: { maxWidth: 1100, margin: '-32px auto 0', padding: '0 20px 60px' },
  filterCard: {
    background: '#fff', borderRadius: 20, padding: '24px 28px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginBottom: 28,
  },
  gradeTabs: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  gradeTab: (active) => ({
    padding: '7px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
    fontWeight: 700, fontSize: '0.88rem',
    background: active ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#f0f4f8',
    color: active ? '#fff' : '#555',
    transition: 'all 0.18s',
  }),
  filterRow: { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' },
  select: {
    padding: '8px 12px', borderRadius: 10, border: '1.5px solid #e0e0e0',
    background: '#fff', fontSize: '0.9rem', cursor: 'pointer', outline: 'none',
  },
  searchInput: {
    flex: 1, minWidth: 200, padding: '8px 14px', borderRadius: 10,
    border: '1.5px solid #e0e0e0', fontSize: '0.9rem', outline: 'none',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 },
  card: {
    background: '#fff', borderRadius: 16, overflow: 'hidden',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)', cursor: 'pointer',
    transition: 'transform 0.18s, box-shadow 0.18s',
    border: '1px solid #f0f0f0',
  },
  cardTop: (color) => ({
    background: color, padding: '20px 20px 14px', position: 'relative',
  }),
  cardGradeBadge: {
    display: 'inline-block', background: 'rgba(255,255,255,0.25)',
    color: '#fff', borderRadius: 20, padding: '3px 12px', fontSize: '0.78rem',
    fontWeight: 700, marginBottom: 8,
  },
  cardTitle: { color: '#fff', fontWeight: 800, fontSize: '1.05rem', margin: '0 0 4px' },
  cardTopic: { color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', margin: 0 },
  cardBody: { padding: '14px 20px 18px' },
  cardMeta: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 },
  metaChip: (bg, color) => ({
    background: bg, color, borderRadius: 20, padding: '3px 10px', fontSize: '0.78rem', fontWeight: 600,
  }),
  cardDesc: { color: '#666', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 },
  // Lesson detail modal
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    zIndex: 9000, padding: '24px 16px', overflowY: 'auto',
  },
  modal: {
    background: '#fff', borderRadius: 20, width: '100%', maxWidth: 800,
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)', marginTop: 20,
  },
  modalHeader: {
    background: 'linear-gradient(135deg,#667eea,#764ba2)',
    padding: '24px 28px', borderRadius: '20px 20px 0 0', color: '#fff',
  },
  modalClose: {
    float: 'right', background: 'rgba(255,255,255,0.2)', border: 'none',
    color: '#fff', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer',
    fontSize: '1.1rem', fontWeight: 700,
  },
  modalBody: { padding: '28px' },
  videoWrap: {
    position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: 24, borderRadius: 12, overflow: 'hidden',
  },
  videoIframe: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' },
  sectionTitle: { color: '#333', fontWeight: 800, fontSize: '1.05rem', margin: '0 0 12px' },
  contentBox: {
    background: '#f8f9ff', borderRadius: 12, padding: '16px 20px', marginBottom: 24,
    lineHeight: 1.7, color: '#444', fontSize: '0.95rem',
  },
  exCard: {
    border: '1.5px solid #e8e8f0', borderRadius: 12, padding: '16px 18px', marginBottom: 14,
  },
  exQuestion: { fontWeight: 700, color: '#333', marginBottom: 12, fontSize: '0.95rem' },
  optionBtn: (state) => ({
    display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px',
    marginBottom: 8, borderRadius: 8, border: '1.5px solid',
    cursor: state === 'idle' ? 'pointer' : 'default',
    fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.15s',
    borderColor: state === 'correct' ? '#00b894' : state === 'wrong' ? '#e17055' : state === 'reveal' ? '#00b894' : '#e0e0e0',
    background: state === 'correct' ? '#d4f5eb' : state === 'wrong' ? '#fde8e4' : state === 'reveal' ? '#d4f5eb' : '#fff',
    color: state === 'correct' || state === 'reveal' ? '#00b894' : state === 'wrong' ? '#e17055' : '#444',
  }),
  fillInput: (state) => ({
    width: '100%', boxSizing: 'border-box', padding: '9px 14px', borderRadius: 8,
    border: `1.5px solid ${state === 'correct' ? '#00b894' : state === 'wrong' ? '#e17055' : '#e0e0e0'}`,
    background: state === 'correct' ? '#d4f5eb' : state === 'wrong' ? '#fde8e4' : '#fff',
    fontSize: '0.9rem', outline: 'none', marginBottom: 8,
  }),
  checkBtn: {
    background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff',
    border: 'none', borderRadius: 8, padding: '9px 20px', fontWeight: 700,
    cursor: 'pointer', fontSize: '0.9rem',
  },
  explanation: (ok) => ({
    marginTop: 8, padding: '8px 12px', borderRadius: 8,
    background: ok ? '#d4f5eb' : '#fde8e4', color: ok ? '#00b894' : '#e17055',
    fontSize: '0.85rem', fontWeight: 600,
  }),
  submitBtn: {
    background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff',
    border: 'none', borderRadius: 12, padding: '13px 32px', fontWeight: 800,
    cursor: 'pointer', fontSize: '1rem', marginTop: 8,
  },
  resultBox: {
    background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff',
    borderRadius: 16, padding: '24px', textAlign: 'center', marginTop: 20,
  },
  emptyMsg: { textAlign: 'center', color: '#aaa', padding: '60px 0', fontSize: '1rem' },
  loadingMsg: { textAlign: 'center', color: '#888', padding: '60px 0', fontSize: '1rem' },
};

const CARD_COLORS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
];

function toYouTubeEmbed(url) {
  if (!url) return '';
  const m = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  return url;
}

function ExerciseItem({ exercise, index }) {
  const [selected, setSelected] = useState(null);
  const [fillValue, setFillValue] = useState('');
  const [checked, setChecked] = useState(false);

  const handleOption = (opt) => {
    if (checked) return;
    setSelected(opt);
    setChecked(true);
  };

  const handleFillCheck = () => {
    setChecked(true);
  };

  const getOptionState = (opt) => {
    if (!checked) return 'idle';
    if (opt === exercise.answer) return selected === opt ? 'correct' : 'reveal';
    if (opt === selected) return 'wrong';
    return 'idle';
  };

  const fillCorrect = fillValue.trim().toLowerCase() === exercise.answer.trim().toLowerCase();

  return (
    <div style={S.exCard}>
      <div style={S.exQuestion}>{index + 1}. {exercise.question}</div>
      {exercise.type === 'mcq' ? (
        <>
          {exercise.options.map((opt, i) => (
            <button key={i} style={S.optionBtn(getOptionState(opt))} onClick={() => handleOption(opt)}>
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}
          {checked && exercise.explanation && (
            <div style={S.explanation(selected === exercise.answer)}>
              💡 {exercise.explanation}
            </div>
          )}
        </>
      ) : (
        <>
          <input
            style={S.fillInput(checked ? (fillCorrect ? 'correct' : 'wrong') : 'idle')}
            value={fillValue}
            onChange={(e) => !checked && setFillValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !checked && handleFillCheck()}
            placeholder="Nhập đáp án..."
            disabled={checked}
          />
          {!checked && (
            <button style={S.checkBtn} onClick={handleFillCheck}>Kiểm tra</button>
          )}
          {checked && (
            <div style={S.explanation(fillCorrect)}>
              {fillCorrect ? '✅ Chính xác!' : `❌ Sai! Đáp án: ${exercise.answer}`}
              {exercise.explanation ? ` — ${exercise.explanation}` : ''}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function LessonModal({ lesson, onClose }) {
  const embedUrl = toYouTubeEmbed(lesson.videoUrl);

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        <div style={S.modalHeader}>
          <button style={S.modalClose} onClick={onClose}>✕</button>
          <div style={{ fontSize: '0.82rem', opacity: 0.8, marginBottom: 6 }}>
            {GRADE_LABELS[lesson.gradeLevel] || lesson.gradeLevel}
            {lesson.topic ? ` · ${lesson.topic}` : ''}
            {lesson.module ? ` · ${lesson.module}` : ''}
          </div>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: '1.35rem' }}>{lesson.title}</h2>
          <div style={{ fontSize: '0.85rem', opacity: 0.75, marginTop: 4 }}>
            Giáo viên: {lesson.teacherName}
          </div>
        </div>
        <div style={S.modalBody}>
          {embedUrl && (
            <div style={S.videoWrap}>
              <iframe
                style={S.videoIframe}
                src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lesson.title}
              />
            </div>
          )}
          {lesson.content && (
            <>
              <div style={S.sectionTitle}>📖 Lý thuyết</div>
              <div style={S.contentBox} dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </>
          )}
          {lesson.exercises && lesson.exercises.length > 0 && (
            <>
              <div style={S.sectionTitle}>✏️ Bài tập ({lesson.exercises.length} câu)</div>
              {lesson.exercises.map((ex, i) => (
                <ExerciseItem key={ex.id || i} exercise={ex} index={i} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GrammarPage() {
  useTitle('Ngữ pháp tiếng Anh');
  const history = useHistory();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [topics, setTopics] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { status: 'published' };
      if (gradeFilter !== 'all') params.gradeLevel = gradeFilter;
      if (monthFilter) params.month = monthFilter;
      if (yearFilter) params.year = yearFilter;
      const res = await grammarApi.getLessons(params);
      setLessons(res.data?.lessons || []);
    } catch {
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, [gradeFilter, monthFilter, yearFilter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    grammarApi.getTopics().then((res) => setTopics(res.data?.topics || {})).catch(() => {});
  }, []);

  const allTopics = [
    ...new Set(Object.values(topics).flat()),
  ];

  const filtered = lessons.filter((l) => {
    if (topicFilter && l.topic !== topicFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (l.title || '').toLowerCase().includes(q) || (l.topic || '').toLowerCase().includes(q);
    }
    return true;
  });

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <div style={S.page}>
      <div style={S.hero}>
        <h1 style={S.heroTitle}>📚 Ngữ pháp tiếng Anh</h1>
        <p style={S.heroSub}>Học ngữ pháp theo khối lớp, chủ đề và bài tập tương tác</p>
        <button
          onClick={() => history.push('/teacher/grammar')}
          style={{ marginTop: 16, padding: '10px 24px', borderRadius: 20, border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
          Quản lý bài học ngữ pháp
        </button>
      </div>

      <div style={S.body}>
        <div style={S.filterCard}>
          <div style={S.gradeTabs}>
            {GRADE_LEVELS.map((g) => (
              <button key={g} style={S.gradeTab(gradeFilter === g)} onClick={() => setGradeFilter(g)}>
                {GRADE_LABELS[g]}
              </button>
            ))}
          </div>
          <div style={S.filterRow}>
            <input
              style={S.searchInput}
              placeholder="🔍 Tìm kiếm bài học..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select style={S.select} value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
              <option value="">Tất cả chủ đề</option>
              {allTopics.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select style={S.select} value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
              <option value="">Tất cả tháng</option>
              {MONTHS.slice(1).map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
            </select>
            <select style={S.select} value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
              <option value="">Tất cả năm</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={S.loadingMsg}>⏳ Đang tải bài học...</div>
        ) : filtered.length === 0 ? (
          <div style={S.emptyMsg}>😊 Chưa có bài học nào. Giáo viên sẽ thêm sớm!</div>
        ) : (
          <div style={S.grid}>
            {filtered.map((lesson, idx) => (
              <div
                key={lesson.id}
                style={S.card}
                onClick={() => setSelectedLesson(lesson)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.14)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)';
                }}
              >
                <div style={S.cardTop(CARD_COLORS[idx % CARD_COLORS.length])}>
                  <div style={S.cardGradeBadge}>{GRADE_LABELS[lesson.gradeLevel] || lesson.gradeLevel}</div>
                  <p style={S.cardTitle}>{lesson.title}</p>
                  <p style={S.cardTopic}>{lesson.topic || lesson.module || ''}</p>
                </div>
                <div style={S.cardBody}>
                  <div style={S.cardMeta}>
                    {lesson.videoUrl && <span style={S.metaChip('#ede9ff', '#667eea')}>🎬 Video</span>}
                    {lesson.exercises?.length > 0 && (
                      <span style={S.metaChip('#e8f9f5', '#00b894')}>✏️ {lesson.exercises.length} bài tập</span>
                    )}
                    {lesson.month && (
                      <span style={S.metaChip('#fff5e6', '#f39c12')}>{MONTHS[lesson.month]} {lesson.year || ''}</span>
                    )}
                  </div>
                  <p style={S.cardDesc}>{lesson.description || 'Nhấn để xem bài học.'}</p>
                  <div style={{ marginTop: 10, fontSize: '0.8rem', color: '#aaa' }}>
                    👨‍🏫 {lesson.teacherName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedLesson && (
        <LessonModal lesson={selectedLesson} onClose={() => setSelectedLesson(null)} />
      )}
    </div>
  );
}

export default GrammarPage;
