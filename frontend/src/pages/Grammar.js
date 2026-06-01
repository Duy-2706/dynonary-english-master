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
const SITE_GRAD = '#1f5eff';

const SITE_BLUE = '#dce9f7';

const GAME_BG = '#042b33';
const GAME_TEAL = '#19c7a8';
const GAME_TEAL_DARK = '#08a98d';
const GAME_YELLOW = '#ffbf1f';
const GAME_ORANGE = '#ff8a00';
const GAME_WHITE = '#ffffff';

const S = {
  page: {
    minHeight: '100vh',
    background: GAME_BG,
    backgroundImage: `
      radial-gradient(circle at 15% 20%, rgba(25,199,168,.25) 0 4px, transparent 5px),
      radial-gradient(circle at 80% 30%, rgba(255,191,31,.18) 0 5px, transparent 6px),
      linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)
    `,
    backgroundSize: '90px 90px, 120px 120px, 60px 60px',
    fontFamily: '"Baloo 2", "Nunito", sans-serif',
  },

  hero: {
    background: 'linear-gradient(180deg, #063c46 0%, #042b33 100%)',
    padding: '72px 24px 110px',
    textAlign: 'center',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },

  heroTitle: {
    fontSize: 'clamp(4rem, 6vw, 7rem)',
    fontWeight: 900,
    lineHeight: 0.95,
    letterSpacing: '1px',
    margin: '0 0 18px',
    textTransform: 'uppercase',
    color: GAME_WHITE,
    textShadow: `
      0 6px 0 #00b894,
      0 12px 0 rgba(0,0,0,.25)
    `,
  },

  heroSub: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#20e0bd',
    margin: 0,
    textShadow: '0 3px 0 rgba(0,0,0,.25)',
  },

  teacherBtn: {
    marginTop: 28,
    padding: '14px 32px',
    borderRadius: 999,
    border: '3px solid #fff',
    background: `linear-gradient(180deg, ${GAME_YELLOW}, ${GAME_ORANGE})`,
    color: '#fff',
    fontWeight: 900,
    cursor: 'pointer',
    fontSize: '1.15rem',
    boxShadow: '0 7px 0 #d96d00, 0 14px 24px rgba(0,0,0,.25)',
    fontFamily: '"Baloo 2", "Nunito", sans-serif',
  },

  body: {
    maxWidth: 1450,
    margin: '-55px auto 0',
    padding: '0 24px 90px',
    position: 'relative',
    zIndex: 2,
  },

  filterCard: {
    background: '#0ec9aa',
    borderRadius: 34,
    padding: '30px',
    boxShadow: '0 12px 0 #07947f, 0 20px 45px rgba(0,0,0,.25)',
    marginBottom: 58,
    border: '4px solid rgba(255,255,255,.75)',
  },

  gradeTabs: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
    marginBottom: 28,
  },

  gradeTab: (active) => ({
    padding: '13px 25px',
    borderRadius: 999,
    border: active ? '3px solid #fff' : '3px solid rgba(255,255,255,.65)',
    cursor: 'pointer',
    fontWeight: 900,
    fontSize: '1.1rem',
    background: active
      ? `linear-gradient(180deg, ${GAME_YELLOW}, ${GAME_ORANGE})`
      : '#ffffff',
    color: active ? '#fff' : '#07424b',
    transition: '0.2s',
    boxShadow: active
      ? '0 6px 0 #c96500'
      : '0 5px 0 rgba(0,0,0,.16)',
    fontFamily: '"Baloo 2", "Nunito", sans-serif',
  }),

  filterRow: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  select: {
    padding: '15px 22px',
    borderRadius: 20,
    border: '3px solid #fff',
    background: '#fff',
    color: '#07424b',
    fontSize: '1.1rem',
    fontWeight: 900,
    cursor: 'pointer',
    outline: 'none',
    fontFamily: '"Baloo 2", "Nunito", sans-serif',
    boxShadow: '0 5px 0 rgba(0,0,0,.14)',
  },

  searchInput: {
    flex: 1,
    minWidth: 260,
    padding: '15px 22px',
    borderRadius: 20,
    border: '3px solid #fff',
    background: '#fff',
    color: '#07424b',
    fontSize: '1.1rem',
    fontWeight: 800,
    outline: 'none',
    fontFamily: '"Baloo 2", "Nunito", sans-serif',
    boxShadow: '0 5px 0 rgba(0,0,0,.14)',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 34,
  },

  card: {
    background: GAME_TEAL,
    borderRadius: 24,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all .22s ease',
    border: '4px solid rgba(255,255,255,.85)',
    boxShadow: '0 8px 0 #078a78, 0 18px 35px rgba(0,0,0,.28)',
  },

  cardTop: (bg) => ({
    background: bg,
    minHeight: 230,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '34px 24px',
    textAlign: 'center',
    position: 'relative',
  }),

  cardGradeBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    background: '#84c900',
    color: '#fff',
    borderRadius: 999,
    padding: '10px 18px',
    fontSize: '1rem',
    fontWeight: 900,
    transform: 'rotate(-10deg)',
    border: '3px solid #fff',
    boxShadow: '0 4px 0 rgba(0,0,0,.2)',
  },

  cardTitle: {
    fontSize: '2.05rem',
    fontWeight: 900,
    lineHeight: 1.05,
    color: '#fff',
    margin: '38px 0 14px',
    textShadow: '0 4px 0 rgba(0,0,0,.22)',
  },

  cardTopic: {
    fontSize: '1.25rem',
    color: '#fff',
    margin: 0,
    fontWeight: 800,
    opacity: 0.95,
  },

  cardBody: {
    padding: '24px',
    background: GAME_TEAL,
    color: '#fff',
  },

  cardMeta: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 18,
  },

  metaChip: (bg, color) => ({
    background: bg,
    color,
    borderRadius: 999,
    padding: '10px 16px',
    fontSize: '1rem',
    fontWeight: 900,
    border: '2px solid rgba(255,255,255,.75)',
  }),

  cardDesc: {
    color: '#fff',
    fontSize: '1.12rem',
    lineHeight: 1.55,
    fontWeight: 700,
    margin: 0,
  },

  teacherText: {
    marginTop: 14,
    fontSize: '1rem',
    color: 'rgba(255,255,255,.9)',
    fontWeight: 800,
  },

  loadingMsg: {
    textAlign: 'center',
    padding: '90px 0',
    fontSize: '1.6rem',
    color: '#fff',
    fontWeight: 900,
  },

  emptyMsg: {
    textAlign: 'center',
    padding: '90px 0',
    fontSize: '1.6rem',
    color: '#fff',
    fontWeight: 900,
  },

  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.65)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 9000,
    padding: '24px 16px',
    overflowY: 'auto',
  },

  modal: {
    background: '#fff',
    borderRadius: 34,
    width: '100%',
    maxWidth: 1000,
    marginTop: 20,
    overflow: 'hidden',
    border: '5px solid #19c7a8',
    boxShadow: '0 18px 50px rgba(0,0,0,.35)',
  },

  modalHeader: {
    background: 'linear-gradient(180deg, #19c7a8, #07947f)',
    padding: '40px',
    color: '#fff',
  },

  modalClose: {
    float: 'right',
    background: '#ff8a00',
    border: '3px solid #fff',
    color: '#fff',
    borderRadius: '50%',
    width: 52,
    height: 52,
    cursor: 'pointer',
    fontSize: '1.3rem',
    fontWeight: 900,
    boxShadow: '0 5px 0 #c96500',
  },

  modalBody: {
    padding: '40px',
    fontFamily: '"Nunito", sans-serif',
  },

  videoWrap: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    marginBottom: 30,
    borderRadius: 24,
    overflow: 'hidden',
    border: '4px solid #19c7a8',
  },

  videoIframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },

  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 900,
    marginBottom: 20,
    color: '#07424b',
    fontFamily: '"Baloo 2", "Nunito", sans-serif',
  },

  contentBox: {
    background: '#eefdf9',
    borderRadius: 24,
    padding: '30px',
    lineHeight: 2,
    fontSize: '1.12rem',
    marginBottom: 30,
    border: '3px solid #b6f4e8',
  },

  exCard: {
    border: '3px solid #b6f4e8',
    borderRadius: 22,
    padding: '26px',
    marginBottom: 22,
    background: '#fff',
  },

  exQuestion: {
    fontSize: '1.2rem',
    fontWeight: 900,
    marginBottom: 18,
    color: '#07424b',
  },

  optionBtn: (state) => ({
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '16px 20px',
    marginBottom: 12,
    borderRadius: 16,
    border: '3px solid #dff7f2',
    cursor: state === 'idle' ? 'pointer' : 'default',
    fontWeight: 900,
    fontSize: '1rem',
    background:
      state === 'correct'
        ? '#d4f5eb'
        : state === 'wrong'
        ? '#fde8e4'
        : '#fff',
    color: '#07424b',
    fontFamily: '"Nunito", sans-serif',
  }),

  fillInput: () => ({
    width: '100%',
    boxSizing: 'border-box',
    padding: '16px 18px',
    borderRadius: 16,
    border: '3px solid #dff7f2',
    fontSize: '1rem',
    marginBottom: 12,
    outline: 'none',
  }),

  checkBtn: {
    background: `linear-gradient(180deg, ${GAME_YELLOW}, ${GAME_ORANGE})`,
    color: '#fff',
    border: '3px solid #fff',
    borderRadius: 16,
    padding: '14px 26px',
    fontWeight: 900,
    cursor: 'pointer',
    fontSize: '1rem',
    boxShadow: '0 5px 0 #c96500',
  },

  explanation: (ok) => ({
    marginTop: 12,
    padding: '14px 18px',
    borderRadius: 16,
    background: ok ? '#d4f5eb' : '#fde8e4',
    color: ok ? '#0f766e' : '#dc2626',
    fontWeight: 900,
  }),
};

const CARD_COLORS = [
  'linear-gradient(135deg, #ff8a00, #ff4d2e)',
  'linear-gradient(135deg, #8bd400, #19c7a8)',
  'linear-gradient(135deg, #8e44ff, #24c6dc)',
  'linear-gradient(135deg, #ffca28, #ff7043)',
  'linear-gradient(135deg, #2f80ed, #00c2ff)',
  'linear-gradient(135deg, #ff5fa2, #ff8a00)',
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
        <h1 style={S.heroTitle}>Ngữ pháp tiếng Anh</h1>
        <p style={S.heroSub}>Học ngữ pháp theo khối lớp, chủ đề và bài tập tương tác</p>
        <button
          onClick={() => history.push('/teacher/grammar')}
          style={S.teacherBtn}
        >
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
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow =
                    '0 10px 0 #078a78, 0 24px 45px rgba(0,0,0,.36)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow =
                    '0 8px 0 #078a78, 0 18px 35px rgba(0,0,0,.28)';
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
                  <div style={S.teacherText}>
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
