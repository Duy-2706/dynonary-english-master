import grammarApi from 'apis/grammarApi';
import useTitle from 'hooks/useTitle';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DeadlineDisplay, InlineAssignment, getExpiryNotice } from 'components/Assignment/StudentAssignment';
import { setMessage } from 'redux/slices/message.slice';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';

const GRADE_LEVELS = ['all', '1', '2', '3', '4', '5'];

const GRADE_LABELS = {
  all: 'Tất cả',
  1: 'Khối 1',
  2: 'Khối 2',
  3: 'Khối 3',
  4: 'Khối 4',
  5: 'Khối 5',
};

const MONTHS = [
  '',
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

const GRAMMAR_CONTENT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800;900&family=Nunito:wght@400;600;700;800;900&display=swap');

.grammar-modal-scroll::-webkit-scrollbar,
.grammar-html-content::-webkit-scrollbar {
  width: 10px;
}

.grammar-modal-scroll::-webkit-scrollbar-track,
.grammar-html-content::-webkit-scrollbar-track {
  background: #eefdf9;
  border-radius: 999px;
}

.grammar-modal-scroll::-webkit-scrollbar-thumb,
.grammar-html-content::-webkit-scrollbar-thumb {
  background: #19c7a8;
  border-radius: 999px;
}

.grammar-html-content {
  font-family: 'Baloo 2', 'Nunito', sans-serif;
  font-size: 1.22rem;
  line-height: 1.85;
  font-weight: 500;
  color: #06434b;
  word-break: break-word;
}
  .grammar-html-content strong,
.grammar-html-content b {
  font-weight: 900;
}

.grammar-html-content p,
.grammar-html-content div,
.grammar-html-content span,
.grammar-html-content li,
.grammar-html-content td {
  font-weight: inherit;
}

.grammar-html-content * {
  max-width: 100%;
  box-sizing: border-box;
}

.grammar-html-content p {
  margin: 10px 0;
}

.grammar-html-content h1 {
  color: #06434b;
  font-size: 2.25rem;
  margin: 16px 0 14px;
  font-weight: 900;
  line-height: 1.25;
}

.grammar-html-content h2 {
  color: #07947f;
  font-size: 1.85rem;
  margin: 18px 0 12px;
  font-weight: 900;
  line-height: 1.3;
}

.grammar-html-content h3 {
  margin: 16px 0 10px;
  color: #06434b;
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 1.35;
}

.grammar-html-content ul,
.grammar-html-content ol {
  padding-left: 32px;
  margin: 12px 0;
}

.grammar-html-content li {
  margin-bottom: 8px;
}

.grammar-html-content blockquote {
  border-left: 7px solid #19c7a8;
  margin: 16px 0;
  padding: 14px 20px;
  background: #eefdf9;
  border-radius: 0 18px 18px 0;
  color: #07545c;
  font-weight: 800;
}

.grammar-html-content table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  margin: 18px 0;
  font-size: 1.05rem;
  border: 3px solid #bdeee5;
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
}

.grammar-html-content th,
.grammar-html-content td {
  border-bottom: 2px solid #eef7f5;
  border-right: 2px solid #eef7f5;
  padding: 13px 16px;
  text-align: left;
  vertical-align: middle;
}

.grammar-html-content th:last-child,
.grammar-html-content td:last-child {
  border-right: none;
}

.grammar-html-content tr:last-child td {
  border-bottom: none;
}

.grammar-html-content th {
  background: #8ab5e6;
  color: #082f49;
  font-weight: 900;
}

.grammar-html-content tr:nth-child(even) td {
  background: #f3fffc;
}

.grammar-html-content img {
  max-width: 100%;
  height: auto;
  border-radius: 18px;
  display: block;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
}

.grammar-html-content > img {
  width: auto;
  max-width: 100%;
  margin: 18px auto;
}

.grammar-html-content .rt-img {
  display: block;
  max-width: 100%;
  min-width: 80px;
  margin: 18px auto;
  border-radius: 18px;
  line-height: 0;
  overflow: hidden;
}

.grammar-html-content .rt-img img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  border-radius: 18px;
}

.grammar-html-content a {
  color: #0f766e;
  font-weight: 900;
}

.grammar-html-content hr {
  border: none;
  border-top: 3px solid #d6f3ed;
  margin: 26px 0;
}
`;

const CARD_COLORS = [
  'linear-gradient(135deg, #19c7a8 0%, #07947f 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00c6ff 100%)',
  'linear-gradient(135deg, #ffb347 0%, #ff8a00 100%)',
  'linear-gradient(135deg, #ff7eb3 0%, #ff1493 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)',
  'linear-gradient(135deg, #34c759 0%, #0ca84f 100%)',
];

const S = {
 page: {
  minHeight: '100vh',
  background: `
    radial-gradient(circle at 10% 14%, rgba(255,255,255,.28) 0 4px, transparent 5px),
    radial-gradient(circle at 88% 12%, rgba(255,223,90,.18) 0 6px, transparent 7px),
    radial-gradient(circle at 72% 78%, rgba(255,255,255,.18) 0 5px, transparent 6px),
    linear-gradient(180deg, #0b6774 0%, #118596 45%, #0d6f7e 100%)
  `,
  backgroundSize: '90px 90px, 130px 130px, 120px 120px, auto',
  fontFamily: GAME_FONT,
  paddingBottom: 72,
},

  hero: {
    padding: '46px 24px 86px',
    textAlign: 'center',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
  },

  heroBubbleLeft: {
    position: 'absolute',
    left: '8%',
    top: 30,
    width: 120,
    height: 120,
    borderRadius: '50%',
    background: 'rgba(255,255,255,.10)',
    border: '3px solid rgba(255,255,255,.18)',
  },

  heroBubbleRight: {
    position: 'absolute',
    right: '10%',
    top: 56,
    width: 92,
    height: 92,
    borderRadius: '50%',
    background: 'rgba(255,240,160,.14)',
    border: '3px solid rgba(255,255,255,.18)',
  },

  heroTitle: {
    position: 'relative',
    zIndex: 2,
    fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
    fontWeight: 900,
    margin: '0 0 12px',
    lineHeight: 1,
    color: '#ffffff',
    textShadow: '0 2px 8px rgba(0,0,0,.12)',
  },

heroSub: {
  position: 'relative',
  zIndex: 2,
  fontSize: 'clamp(1.05rem, 2vw, 1.35rem)',
  margin: 0,
  fontWeight: 800,
  lineHeight: 1.55,
  color: '#eefefe',
  textShadow: '0 1px 4px rgba(0,0,0,.08)',
  opacity: 1,
},

  manageBtn: {
    position: 'relative',
    zIndex: 2,
    marginTop: 22,
    padding: '12px 24px',
    borderRadius: 999,
    border: '4px solid rgba(255,255,255,.95)',
    background: 'linear-gradient(180deg,#ffffff,#eefdf9)',
    color: '#056d5e',
    fontWeight: 900,
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: GAME_FONT,
    boxShadow: '0 7px 0 rgba(7,148,127,.35)',
  },

  body: {
    maxWidth: 1180,
    margin: '-54px auto 0',
    padding: '0 22px',
    position: 'relative',
    zIndex: 3,
  },

  panel: {
    background: 'linear-gradient(180deg,#ffffff 0%,#eefdf9 100%)',
    borderRadius: 32,
    padding: '26px 28px',
    boxShadow: '0 12px 0 rgba(7,148,127,.38), 0 24px 48px rgba(0,0,0,.20)',
    border: '7px solid rgba(255,255,255,.95)',
    marginBottom: 28,
  },

  assignHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 10,
  },

  assignTitle: {
    fontWeight: 900,
    fontSize: '1.35rem',
    color: '#06434b',
    margin: 0,
  },

  assignGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))',
    gap: 16,
  },

  assignCard: (urgency) => ({
    borderRadius: 24,
    padding: '18px 20px',
    cursor: 'pointer',
    border: `4px solid ${
      urgency === 'urgent'
        ? '#ff8a8a'
        : urgency === 'warning'
        ? '#ffcf45'
        : urgency === 'done'
        ? '#a8e8db'
        : urgency === 'expired'
        ? '#dbe4ef'
        : '#9fe8dc'
    }`,
    background:
      urgency === 'urgent'
        ? '#fde8e4'
        : urgency === 'warning'
        ? '#fff8e1'
        : urgency === 'done'
        ? '#d4f5eb'
        : urgency === 'expired'
        ? '#f8fafc'
        : '#f3fffc',
    boxShadow: '0 6px 0 rgba(0,0,0,.08)',
    transition: 'transform .15s, box-shadow .15s',
  }),

  assignCardTitle: {
    fontWeight: 900,
    fontSize: '1.05rem',
    marginBottom: 6,
    color: '#06434b',
    lineHeight: 1.3,
  },

  assignCardClass: {
    fontSize: '0.92rem',
    color: '#07545c',
    marginBottom: 8,
    fontWeight: 800,
  },

  filterCard: {
    background: '#ffffff',
    borderRadius: 34,
    padding: '34px 38px',
    boxShadow: '0 10px 0 rgba(7,148,127,.26), 0 20px 42px rgba(0,0,0,.16)',
    border: '6px solid #d6f3ed',
    marginBottom: 34,
  },

  filterTitle: {
  color: '#06434b',
  fontSize: '1.65rem',
  fontWeight: 900,
  margin: '0 0 22px',
  },

  gradeTabs: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
    marginBottom: 26,
  },

 gradeTab: (active) => ({
  padding: '15px 30px',
  borderRadius: 999,
  border: active ? '5px solid #ffffff' : '4px solid #d6f3ed',
  cursor: 'pointer',
  fontWeight: 900,
  fontSize: '1.25rem',
  background: active
    ? 'linear-gradient(180deg,#19c7a8,#07947f)'
    : 'linear-gradient(180deg,#ffffff,#f3fffc)',
  color: active ? '#ffffff' : '#07545c',
  boxShadow: active ? '0 7px 0 rgba(7,148,127,.38)' : '0 5px 0 rgba(7,148,127,.10)',
  fontFamily: GAME_FONT,
  minWidth: 120,
  }),

  filterRow: {
    display: 'flex',
    gap: 18,
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  select: {
  padding: '18px 22px',
  borderRadius: 20,
  border: '4px solid #d6f3ed',
  background: '#ffffff',
  color: '#06434b',
  fontSize: '1.22rem',
  fontWeight: 850,
  cursor: 'pointer',
  outline: 'none',
  fontFamily: GAME_FONT,
  boxShadow: '0 5px 0 rgba(7,148,127,.10)',
  minWidth: 190,
},

  searchInput: {
  flex: 1,
  minWidth: 360,
  padding: '18px 22px',
  borderRadius: 20,
  border: '4px solid #d6f3ed',
  background: '#ffffff',
  color: '#06434b',
  fontSize: '1.22rem',
  fontWeight: 850,
  outline: 'none',
  fontFamily: GAME_FONT,
  boxShadow: '0 5px 0 rgba(7,148,127,.10)',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
    gap: 22,
  },

  card: {
    background: '#ffffff',
    borderRadius: 28,
    overflow: 'hidden',
    boxShadow: '0 9px 0 rgba(7,148,127,.26), 0 20px 38px rgba(0,0,0,.16)',
    cursor: 'pointer',
    transition: 'transform .18s, box-shadow .18s',
    border: '6px solid rgba(255,255,255,.96)',
  },

  cardTop: (color) => ({
    background: color,
    padding: '24px 22px 20px',
    position: 'relative',
    minHeight: 130,
  }),

  cardGradeBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,.26)',
    color: '#ffffff',
    borderRadius: 999,
    padding: '6px 13px',
    fontSize: '0.9rem',
    fontWeight: 900,
    marginBottom: 12,
    border: '2px solid rgba(255,255,255,.34)',
  },

  cardTitle: {
    color: '#ffffff',
    fontWeight: 900,
    fontSize: '1.8rem',
    margin: '0 0 10px',
    lineHeight: 1.25,
    textShadow: '0 2px 0 rgba(0,0,0,.14)',
  },

  cardTopic: {
    color: 'rgba(255,255,255,.9)',
    fontSize: '1.5rem',
    margin: 0,
    fontWeight: 800,
  },

  cardBody: {
    padding: '18px 22px 22px',
  },

  cardMeta: {
    display: 'flex',
    gap: 9,
    flexWrap: 'wrap',
    marginBottom: 12,
  },

  metaChip: (bg, color) => ({
    background: bg,
    color,
    borderRadius: 999,
    padding: '6px 11px',
    fontSize: '1.3rem',
    fontWeight: 900,
    border: '2px solid rgba(255,255,255,.8)',
  }),

  cardDesc: {
    color: '#07545c',
    fontSize: '1.3rem',
    lineHeight: 1.55,
    margin: 0,
    fontWeight: 750,
  },

  teacherLine: {
    marginTop: 12,
    fontSize: '1.1rem',
    color: '#07947f',
    fontWeight: 900,
  },

  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(4, 43, 51, .76)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9000,
    padding: '18px',
    overflow: 'hidden',
  },

  modal: {
    background: '#ffffff',
    borderRadius: 32,
    width: 'min(1180px, calc(100vw - 36px))',
    height: 'calc(100vh - 36px)',
    maxHeight: 'calc(100vh - 36px)',
    boxShadow: '0 28px 80px rgba(0,0,0,.38)',
    border: '7px solid rgba(255,255,255,.95)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  modalHeader: {
    flexShrink: 0,
    background: 'linear-gradient(135deg,#19c7a8,#07947f)',
    padding: '26px 32px',
    color: '#ffffff',
    position: 'relative',
  },

  modalClose: {
    position: 'absolute',
    top: 18,
    right: 22,
    background: 'rgba(255,255,255,.22)',
    border: '3px solid rgba(255,255,255,.36)',
    color: '#ffffff',
    borderRadius: '50%',
    width: 42,
    height: 42,
    cursor: 'pointer',
    fontSize: '1.35rem',
    fontWeight: 900,
    lineHeight: 1,
  },

  modalMeta: {
    fontSize: '1rem',
    opacity: 0.92,
    marginBottom: 8,
    fontWeight: 800,
    paddingRight: 54,
  },

  modalTitle: {
    margin: 0,
    fontWeight: 900,
    fontSize: '2rem',
    lineHeight: 1.25,
    textShadow: '0 2px 0 rgba(0,0,0,.14)',
    paddingRight: 54,
  },

  modalTeacher: {
    fontSize: '1rem',
    opacity: 0.9,
    marginTop: 7,
    fontWeight: 800,
  },

  modalBody: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: '30px 34px 38px',
    overscrollBehavior: 'contain',
  },

  videoWrap: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    marginBottom: 26,
    borderRadius: 24,
    overflow: 'hidden',
    border: '5px solid #19c7a8',
    boxShadow: '0 8px 0 rgba(7,148,127,.22), 0 18px 34px rgba(0,0,0,.16)',
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
  color: '#06434b',
  fontWeight: 900,
  fontSize: '1.85rem',
  margin: '0 0 20px',
},

  contentBox: {
    background: '#f3fffc',
    borderRadius: 28,
    padding: '26px 30px',
    marginBottom: 28,
    border: '4px solid #d6f3ed',
    boxShadow: '0 10px 28px rgba(7,148,127,.08)',
  },

  divider: {
    height: 3,
    background: '#d6f3ed',
    margin: '30px 0',
    borderRadius: 999,
  },

  classAssignSection: {
    marginTop: 10,
    background: '#eefdf9',
    borderRadius: 24,
    padding: '22px 24px',
    border: '4px solid #d6f3ed',
  },

  classAssignHeader: {
    fontWeight: 900,
    fontSize: '1.25rem',
    color: '#06434b',
    marginBottom: 16,
  },

 exCard: {
  border: '4px solid #d6f3ed',
  borderRadius: 26,
  padding: '24px 26px',
  marginBottom: 22,
  background: '#ffffff',
  boxShadow: '0 6px 0 rgba(7,148,127,.08)',
},

exQuestion: {
  fontWeight: 900,
  color: '#06434b',
  marginBottom: 18,
  fontSize: '1.35rem',
  lineHeight: 1.55,
},

 optionBtn: (state) => ({
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '18px 22px',
  marginBottom: 14,
  borderRadius: 18,
  border: '3px solid',
  cursor: state === 'idle' ? 'pointer' : 'default',
  fontWeight: 850,
  fontSize: '1.25rem',
  transition: 'all .15s',
  fontFamily: GAME_FONT,
  lineHeight: 1.45,
  borderColor:
    state === 'correct'
      ? '#36e27d'
      : state === 'wrong'
      ? '#ff8a8a'
      : state === 'reveal'
      ? '#36e27d'
      : '#d6f3ed',
  background:
    state === 'correct'
      ? '#d4f5eb'
      : state === 'wrong'
      ? '#fde8e4'
      : state === 'reveal'
      ? '#d4f5eb'
      : '#ffffff',
  color:
    state === 'correct' || state === 'reveal'
      ? '#057a55'
      : state === 'wrong'
      ? '#dc2626'
      : '#06434b',
}),

  fillInput: (state) => ({
  width: '100%',
  boxSizing: 'border-box',
  padding: '18px 22px',
  borderRadius: 18,
  border: `3px solid ${
    state === 'correct' ? '#36e27d' : state === 'wrong' ? '#ff8a8a' : '#d6f3ed'
  }`,
  background:
    state === 'correct' ? '#d4f5eb' : state === 'wrong' ? '#fde8e4' : '#ffffff',
  color: '#06434b',
  fontSize: '1.25rem',
  fontWeight: 850,
  outline: 'none',
  marginBottom: 14,
  fontFamily: GAME_FONT,
  lineHeight: 1.45,
}),

  checkBtn: {
  background: 'linear-gradient(180deg,#19c7a8,#07947f)',
  color: '#ffffff',
  border: '3px solid #ffffff',
  borderRadius: 999,
  padding: '14px 26px',
  fontWeight: 900,
  cursor: 'pointer',
  fontSize: '1.2rem',
  fontFamily: GAME_FONT,
  boxShadow: '0 5px 0 rgba(7,148,127,.28)',
},

explanation: (ok) => ({
  marginTop: 14,
  padding: '16px 20px',
  borderRadius: 18,
  background: ok ? '#d4f5eb' : '#fde8e4',
  color: ok ? '#057a55' : '#dc2626',
  fontSize: '1.18rem',
  fontWeight: 850,
  lineHeight: 1.55,
}),

  resultBox: {
    background: 'linear-gradient(135deg,#19c7a8,#07947f)',
    color: '#ffffff',
    borderRadius: 24,
    padding: '26px',
    textAlign: 'center',
    marginTop: 20,
    border: '4px solid #ffffff',
    boxShadow: '0 8px 0 rgba(7,148,127,.28)',
  },

  emptyMsg: {
    textAlign: 'center',
    color: '#ffffff',
    padding: '70px 0',
    fontSize: '1.25rem',
    fontWeight: 900,
  },

  loadingMsg: {
    textAlign: 'center',
    color: '#ffffff',
    padding: '70px 0',
    fontSize: '1.25rem',
    fontWeight: 900,
  },
};

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

  const getOptionState = (opt) => {
    if (!checked) return 'idle';
    if (opt === exercise.answer) return selected === opt ? 'correct' : 'reveal';
    if (opt === selected) return 'wrong';
    return 'idle';
  };

  const fillCorrect = fillValue.trim().toLowerCase() === exercise.answer.trim().toLowerCase();

  return (
    <div style={S.exCard}>
      <div style={S.exQuestion}>
        {index + 1}. {exercise.question}
      </div>

      {exercise.type === 'mcq' ? (
        <>
          {exercise.options.map((opt, i) => (
            <button
              key={i}
              style={S.optionBtn(getOptionState(opt))}
              onClick={() => {
                if (!checked) {
                  setSelected(opt);
                  setChecked(true);
                }
              }}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}

          {checked && exercise.explanation && (
            <div style={S.explanation(selected === exercise.answer)}>
              {exercise.explanation}
            </div>
          )}
        </>
      ) : (
        <>
          <input
            style={S.fillInput(checked ? (fillCorrect ? 'correct' : 'wrong') : 'idle')}
            value={fillValue}
            onChange={(e) => !checked && setFillValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !checked && setChecked(true)}
            placeholder="Nhập đáp án..."
            disabled={checked}
          />

          {!checked && (
            <button style={S.checkBtn} onClick={() => setChecked(true)}>
              Kiểm tra
            </button>
          )}

          {checked && (
            <div style={S.explanation(fillCorrect)}>
              {fillCorrect ? 'Chính xác!' : `Sai rồi. Đáp án đúng là: ${exercise.answer}`}
              {exercise.explanation ? ` — ${exercise.explanation}` : ''}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function LessonClassAssignments({ lesson, userInfo }) {
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const classroomId = userInfo?.classroomId || '';

  const load = useCallback(async () => {
    if (!classroomId || !lesson?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [aRes, sRes] = await Promise.all([
        grammarApi.getLessonClassroomAssignments(lesson.id, classroomId),
        grammarApi.getMySubmissions(),
      ]);

      setAssignments(aRes.data?.assignments || []);
      setMySubmissions(sRes.data?.submissions || []);
    } catch {
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [lesson?.id, classroomId]);

  useEffect(() => {
    load();
  }, [load]);

  if (!classroomId) return null;

  if (loading) {
    return (
      <div style={{ padding: '12px 0', color: '#07545c', fontSize: '1rem', fontWeight: 900 }}>
        Đang tải bài tập...
      </div>
    );
  }

  if (assignments.length === 0) return null;

  const getSubmission = (id) => mySubmissions.find((s) => s.assignmentId === id) || null;

  return (
    <>
      <div style={S.divider} />

      <div style={S.classAssignSection}>
        <div style={S.classAssignHeader}>Bài tập của lớp ({assignments.length} bài)</div>

        {assignments.map((a) => (
          <InlineAssignment
            key={a.id}
            assignment={a}
            existingSubmission={getSubmission(a.id)}
            userInfo={userInfo}
            onSubmitted={load}
          />
        ))}
      </div>
    </>
  );
}

function StudentAssignmentsSection({ userInfo }) {
  const dispatch = useDispatch();
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notified, setNotified] = useState(false);
  const classroomId = userInfo?.classroomId || '';

  const load = useCallback(async () => {
    if (!classroomId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [aRes, sRes] = await Promise.all([
        grammarApi.getClassroomAssignments(classroomId),
        grammarApi.getMySubmissions(),
      ]);

      setAssignments(aRes.data?.assignments || []);
      setMySubmissions(sRes.data?.submissions || []);
    } catch {
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [classroomId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (notified || loading || assignments.length === 0) return;

    const notice = getExpiryNotice(assignments, mySubmissions);

    if (notice) {
      dispatch(setMessage({ type: notice.type, message: notice.message, duration: 8000 }));
      setNotified(true);
    }
  }, [assignments, mySubmissions, loading, notified, dispatch]);

  if (!classroomId || loading || assignments.length === 0) return null;

  const pending = assignments.filter((a) => {
    const sub = mySubmissions.find((s) => s.assignmentId === a.id);
    if (sub) return false;
    if (!a.dueDate) return true;
    return new Date(a.dueDate) > Date.now();
  });

  if (pending.length === 0) return null;

  const getUrgency = (a) => {
    if (!a.dueDate) return 'normal';

    const diff = new Date(a.dueDate) - Date.now();

    if (diff <= 0) return 'expired';
    if (diff < 3600000) return 'urgent';
    if (diff < 86400000) return 'warning';

    return 'normal';
  };

  return (
    <div style={S.panel}>
      <div style={S.assignHeader}>
        <h2 style={S.assignTitle}>Bài tập chưa hoàn thành ({pending.length})</h2>
      </div>

      <div style={S.assignGrid}>
        {pending.map((a) => {
          const urgency = getUrgency(a);

          return (
            <div
              key={a.id}
              style={S.assignCard(urgency)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,.13)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 6px 0 rgba(0,0,0,.08)';
              }}
            >
              <div style={S.assignCardTitle}>{a.title}</div>

              <div style={S.assignCardClass}>
                {a.classroomName}
                {a.weekNumber ? ` · Tuần ${a.weekNumber}` : ''}
              </div>

              <DeadlineDisplay dueDate={a.dueDate} isDone={false} />

              <div style={{ marginTop: 9, fontSize: '0.9rem', color: '#07545c', fontWeight: 800 }}>
                {a.exercises?.length || 0} câu · Mở bài học để làm bài
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LessonModal({ lesson, userInfo, onClose }) {
  const embedUrl = toYouTubeEmbed(lesson.videoUrl);

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    const oldPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = oldOverflow;
      document.body.style.paddingRight = oldPaddingRight;
    };
  }, []);

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <style>{GRAMMAR_CONTENT_CSS}</style>

      <div style={S.modal}>
        <div style={S.modalHeader}>
          <button style={S.modalClose} onClick={onClose}>
            ×
          </button>

          <div style={S.modalMeta}>
            {GRADE_LABELS[lesson.gradeLevel] || lesson.gradeLevel}
            {lesson.topic ? ` · ${lesson.topic}` : ''}
            {lesson.module ? ` · ${lesson.module}` : ''}
          </div>

          <h2 style={S.modalTitle}>{lesson.title}</h2>

          <div style={S.modalTeacher}>{lesson.teacherName}</div>
        </div>

        <div style={S.modalBody} className="grammar-modal-scroll">
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
              <div style={S.sectionTitle}>Lý thuyết</div>
              <div
                className="grammar-html-content"
                style={S.contentBox}
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </>
          )}

          {lesson.exercises && lesson.exercises.length > 0 && (
            <>
              <div style={S.sectionTitle}>
                Bài tập luyện tập ({lesson.exercises.length} câu)
              </div>

              {lesson.exercises.map((ex, i) => (
                <ExerciseItem key={ex.id || i} exercise={ex} index={i} />
              ))}
            </>
          )}

          <LessonClassAssignments lesson={lesson} userInfo={userInfo} />
        </div>
      </div>
    </div>
  );
}

function GrammarPage() {
  useTitle('Ngữ pháp tiếng Anh');

  const history = useHistory();
  const userInfo = useSelector((s) => s.userInfo);

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [gradeFilter, setGradeFilter] = useState('all');
  //const [topicFilter, setTopicFilter] = useState('');
  //const [monthFilter, setMonthFilter] = useState('');
  //const [yearFilter, setYearFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(null);
  //const [moduleFilter, setModuleFilter] = useState('');

  // const load = useCallback(async () => {
  //   setLoading(true);

  //   try {
  //     const params = { status: 'published' };

  //     if (gradeFilter !== 'all') params.gradeLevel = gradeFilter;
  //     if (monthFilter) params.month = monthFilter;
  //     if (yearFilter) params.year = yearFilter;

  //     const res = await grammarApi.getLessons(params);

  //     setLessons(res.data?.lessons || []);
  //   } catch {
  //     setLessons([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [gradeFilter, monthFilter, yearFilter]);

  const load = useCallback(async () => {
  setLoading(true);

  try {
    const res = await grammarApi.getLessons({ status: 'published' });
    setLessons(res.data?.lessons || []);
  } catch {
    setLessons([]);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    load();
  }, [load]);

  // const allTopics = [...new Set(lessons.filter((l) => l.topic).map((l) => l.topic))].sort((a, b) =>
  //   a.localeCompare(b),
  // );

  // const allModules = [...new Set(lessons.filter((l) => l.module).map((l) => l.module))].sort((a, b) =>
  //   a.localeCompare(b),
  // );

  // const filtered = lessons
  //   .filter((l) => {
  //     if (topicFilter && l.topic !== topicFilter) return false;
  //     if (moduleFilter && l.module !== moduleFilter) return false;

  //     if (search) {
  //       const q = search.toLowerCase();

  //       return (
  //         (l.title || '').toLowerCase().includes(q) ||
  //         (l.topic || '').toLowerCase().includes(q) ||
  //         (l.module || '').toLowerCase().includes(q)
  //       );
  //     }

  //     return true;
  //   })

  //   .sort((a, b) => {
  //   const ga = a.gradeLevel === 'all' ? 99 : parseInt(a.gradeLevel, 10) || 99;
  //   const gb = b.gradeLevel === 'all' ? 99 : parseInt(b.gradeLevel, 10) || 99;

  //   if (ga !== gb) return ga - gb;

  //   const getUnitNumber = (lesson) => {
  //     const text = `${lesson.module || ''} ${lesson.title || ''}`;
  //     const match = text.match(/unit\s*(\d+)/i);
  //     return match ? parseInt(match[1], 10) : 999;
  //   };

  //   const ua = getUnitNumber(a);
  //   const ub = getUnitNumber(b);

  //   if (ua !== ub) return ua - ub;

  //   const wa = parseInt(a.weekNumber, 10) || 0;
  //   const wb = parseInt(b.weekNumber, 10) || 0;

  //   if (wa !== wb) return wa - wb;

  //   return (a.title || '').localeCompare(b.title || '', 'vi', {
  //     numeric: true,
  //     sensitivity: 'base',
  //   });
  // });


  const filtered = lessons
  .filter((l) => {
    if (!search.trim()) return true;

    const q = search.toLowerCase().trim();

    return (
      (l.title || '').toLowerCase().includes(q) ||
      (l.topic || '').toLowerCase().includes(q) ||
      (l.module || '').toLowerCase().includes(q) ||
      (l.description || '').toLowerCase().includes(q)
    );
  })
  .sort((a, b) => {
    const ga = a.gradeLevel === 'all' ? 99 : parseInt(a.gradeLevel, 10) || 99;
    const gb = b.gradeLevel === 'all' ? 99 : parseInt(b.gradeLevel, 10) || 99;

    if (ga !== gb) return ga - gb;

    const getUnitNumber = (lesson) => {
      const text = `${lesson.module || ''} ${lesson.title || ''}`;
      const match = text.match(/unit\s*(\d+)/i);
      return match ? parseInt(match[1], 10) : 999;
    };

    const ua = getUnitNumber(a);
    const ub = getUnitNumber(b);

    if (ua !== ub) return ua - ub;

    return (a.title || '').localeCompare(b.title || '', 'vi', {
      numeric: true,
      sensitivity: 'base',
    });
  });

  // const currentYear = new Date().getFullYear();
  // const years = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <div style={S.page}>
      <div style={S.hero}>
        <div style={S.heroBubbleLeft} />
        <div style={S.heroBubbleRight} />

        <h1 style={S.heroTitle}>Ngữ pháp tiếng Anh</h1>

        <p style={S.heroSub}>
          Học ngữ pháp theo khối lớp, chủ đề và bài tập tương tác
        </p>

        <button onClick={() => history.push('/teacher/grammar')} style={S.manageBtn}>
          Quản lý bài học ngữ pháp
        </button>
      </div>

      <div style={S.body}>
        <StudentAssignmentsSection userInfo={userInfo} />

        {/* <div style={S.filterCard}>
          <h2 style={S.filterTitle}>Chọn bài học phù hợp</h2>

          <div style={S.gradeTabs}>
            {GRADE_LEVELS.map((g) => (
              <button
                key={g}
                style={S.gradeTab(gradeFilter === g)}
                onClick={() => setGradeFilter(g)}
              >
                {GRADE_LABELS[g]}
              </button>
            ))}
          </div>

          <div style={S.filterRow}>
            <input
              style={S.searchInput}
              placeholder="Tìm kiếm bài học..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              style={S.select}
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
            >
              <option value="">Tất cả Unit</option>
              {allModules.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

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

            <select
              style={S.select}
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <option value="">Tất cả tháng</option>
              {MONTHS.slice(1).map((m, i) => (
                <option key={i + 1} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>

            <select
              style={S.select}
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="">Tất cả năm</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div> */}


        <div style={S.filterCard}>
          <h2 style={S.filterTitle}>Tìm kiếm bài học</h2>

          <div style={S.filterRow}>
            <input
              style={S.searchInput}
              placeholder="Nhập tên bài học, Unit, chủ đề..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={S.loadingMsg}>Đang tải bài học...</div>
        ) : filtered.length === 0 ? (
          <div style={S.emptyMsg}>Chưa có bài học nào. Giáo viên sẽ thêm sớm!</div>
        ) : (
          <div style={S.grid}>
            {filtered.map((lesson, idx) => (
              <div
                key={lesson.id}
                style={S.card}
                onClick={() => setSelectedLesson(lesson)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 0 rgba(7,148,127,.28), 0 24px 46px rgba(0,0,0,.20)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow =
                    '0 9px 0 rgba(7,148,127,.26), 0 20px 38px rgba(0,0,0,.16)';
                }}
              >
                <div style={S.cardTop(CARD_COLORS[idx % CARD_COLORS.length])}>
                  <div style={S.cardGradeBadge}>
                    {GRADE_LABELS[lesson.gradeLevel] || lesson.gradeLevel}
                  </div>

                  <p style={S.cardTitle}>{lesson.title}</p>
                  <p style={S.cardTopic}>{lesson.topic || lesson.module || ''}</p>
                </div>

                <div style={S.cardBody}>
                  <div style={S.cardMeta}>
                    {lesson.videoUrl && (
                      <span style={S.metaChip('#eefdf9', '#07947f')}>Video</span>
                    )}

                    {lesson.exercises?.length > 0 && (
                      <span style={S.metaChip('#e8f9f5', '#00b894')}>
                        {lesson.exercises.length} bài tập
                      </span>
                    )}

                    {lesson.month && (
                      <span style={S.metaChip('#fff5e6', '#f39c12')}>
                        {MONTHS[lesson.month]} {lesson.year || ''}
                      </span>
                    )}
                  </div>

                  <p style={S.cardDesc}>
                    {lesson.description || 'Nhấn để xem bài học.'}
                  </p>

                  <div style={S.teacherLine}>{lesson.teacherName}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          userInfo={userInfo}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </div>
  );
}

export default GrammarPage;