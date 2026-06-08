import grammarApi from 'apis/grammarApi';
import useTitle from 'hooks/useTitle';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const GRADE_LEVELS = ['all', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const GRADE_LABELS = {
  all: 'Tất cả',
  '1': 'Khối 1', '2': 'Khối 2', '3': 'Khối 3', '4': 'Khối 4', '5': 'Khối 5',
  '6': 'Khối 6', '7': 'Khối 7', '8': 'Khối 8', '9': 'Khối 9',
};
const MONTHS = ['', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

const SITE_GRAD = 'linear-gradient(135deg, #102f4e 0%, #6fc7e1 100%)';

const S = {
  page: { minHeight: '100vh', background: 'var(--bg-color-main)' },
  hero: { background: SITE_GRAD, padding: '40px 24px 60px', textAlign: 'center', color: '#fff' },
  heroTitle: { fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, margin: '0 0 10px' },
  heroSub: { fontSize: '1.05rem', opacity: 0.85, margin: 0 },
  body: { maxWidth: 1100, margin: '-32px auto 0', padding: '0 20px 60px' },
  assignSection: {
    background: 'var(--bg-color-sec)', borderRadius: 20, padding: '20px 24px',
    boxShadow: 'var(--box-shadow)', marginBottom: 22,
    border: '2px solid rgba(102,126,234,0.25)',
  },
  assignHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 },
  assignTitle: { fontWeight: 900, fontSize: '1.05rem', color: 'var(--text-color)', margin: 0 },
  assignGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 },
  assignCard: (urgency) => ({
    borderRadius: 14, padding: '16px 18px', cursor: 'pointer',
    border: `2px solid ${urgency === 'urgent' ? '#fca5a5' : urgency === 'warning' ? '#fde68a' : urgency === 'done' ? '#a7f3d0' : urgency === 'expired' ? '#e2e8f0' : '#bfdbfe'}`,
    background: urgency === 'urgent' ? '#fef2f2' : urgency === 'warning' ? '#fffbeb' : urgency === 'done' ? '#ecfdf5' : urgency === 'expired' ? '#f8fafc' : '#eff6ff',
    transition: 'transform 0.15s, box-shadow 0.15s',
  }),
  assignCardTitle: { fontWeight: 800, fontSize: '0.95rem', marginBottom: 4, color: '#0f172a', lineHeight: 1.3 },
  assignCardClass: { fontSize: '0.8rem', color: '#64748b', marginBottom: 8 },
  deadline: (urgency) => ({
    fontSize: '0.82rem', fontWeight: 700,
    color: urgency === 'urgent' ? '#b91c1c' : urgency === 'warning' ? '#b45309' : urgency === 'done' ? '#047857' : urgency === 'expired' ? '#94a3b8' : '#1d4ed8',
  }),
  filterCard: {
    background: 'var(--bg-color-sec)', borderRadius: 20, padding: '24px 28px',
    boxShadow: 'var(--box-shadow)', marginBottom: 28,
  },
  gradeTabs: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  gradeTab: (active) => ({
    padding: '7px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
    fontWeight: 700, fontSize: '0.88rem',
    background: active ? SITE_GRAD : 'var(--light-grey)',
    color: active ? '#fff' : 'var(--label-color)',
    transition: 'all 0.18s',
  }),
  filterRow: { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' },
  select: {
    padding: '8px 12px', borderRadius: 10, border: '1.5px solid var(--border-color)',
    background: 'var(--bg-color-sec)', color: 'var(--text-color)', fontSize: '0.9rem', cursor: 'pointer', outline: 'none',
  },
  searchInput: {
    flex: 1, minWidth: 200, padding: '8px 14px', borderRadius: 10,
    border: '1.5px solid var(--border-color)', background: 'var(--bg-color-sec)',
    color: 'var(--text-color)', fontSize: '0.9rem', outline: 'none',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 },
  card: {
    background: 'var(--bg-color-sec)', borderRadius: 16, overflow: 'hidden',
    boxShadow: 'var(--box-shadow)', cursor: 'pointer', transition: 'transform 0.18s, box-shadow 0.18s',
    border: '1px solid var(--border-color)',
  },
  cardTop: (color) => ({ background: color, padding: '20px 20px 14px', position: 'relative' }),
  cardGradeBadge: {
    display: 'inline-block', background: 'rgba(255,255,255,0.25)', color: '#fff',
    borderRadius: 20, padding: '3px 12px', fontSize: '0.78rem', fontWeight: 700, marginBottom: 8,
  },
  cardTitle: { color: '#fff', fontWeight: 800, fontSize: '1.05rem', margin: '0 0 4px' },
  cardTopic: { color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', margin: 0 },
  cardBody: { padding: '14px 20px 18px' },
  cardMeta: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 },
  metaChip: (bg, color) => ({
    background: bg, color, borderRadius: 20, padding: '3px 10px', fontSize: '0.78rem', fontWeight: 600,
  }),
  cardDesc: { color: 'var(--label-color)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    zIndex: 9000, padding: '24px 16px', overflowY: 'auto',
  },
  modal: {
    background: 'var(--bg-color-sec)', borderRadius: 20, width: '100%', maxWidth: 800,
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)', marginTop: 20,
  },
  modalHeader: { background: SITE_GRAD, padding: '24px 28px', borderRadius: '20px 20px 0 0', color: '#fff' },
  modalClose: {
    float: 'right', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
    borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700,
  },
  modalBody: { padding: '28px' },
  videoWrap: { position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: 24, borderRadius: 12, overflow: 'hidden' },
  videoIframe: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' },
  sectionTitle: { color: 'var(--text-color)', fontWeight: 800, fontSize: '1.05rem', margin: '0 0 12px' },
  contentBox: {
    background: 'var(--bg-color-accent)', borderRadius: 12, padding: '16px 20px', marginBottom: 24,
    lineHeight: 1.7, color: 'var(--text-color)', fontSize: '0.95rem',
  },
  exCard: { border: '1.5px solid var(--border-color)', borderRadius: 12, padding: '16px 18px', marginBottom: 14 },
  exQuestion: { fontWeight: 700, color: 'var(--text-color)', marginBottom: 12, fontSize: '0.95rem' },
  optionBtn: (state) => ({
    display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', marginBottom: 8,
    borderRadius: 8, border: '1.5px solid', cursor: state === 'idle' ? 'pointer' : 'default',
    fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.15s',
    borderColor: state === 'correct' ? 'var(--right-color)' : state === 'wrong' ? 'var(--error-color)' : state === 'reveal' ? 'var(--right-color)' : 'var(--border-color)',
    background: state === 'correct' ? '#d4f5eb' : state === 'wrong' ? '#fde8e4' : state === 'reveal' ? '#d4f5eb' : 'var(--bg-color-sec)',
    color: state === 'correct' || state === 'reveal' ? 'var(--right-color)' : state === 'wrong' ? 'var(--error-color)' : 'var(--text-color)',
  }),
  fillInput: (state) => ({
    width: '100%', boxSizing: 'border-box', padding: '9px 14px', borderRadius: 8,
    border: `1.5px solid ${state === 'correct' ? 'var(--right-color)' : state === 'wrong' ? 'var(--error-color)' : 'var(--border-color)'}`,
    background: state === 'correct' ? '#d4f5eb' : state === 'wrong' ? '#fde8e4' : 'var(--bg-color-sec)',
    color: 'var(--text-color)', fontSize: '0.9rem', outline: 'none', marginBottom: 8,
  }),
  checkBtn: { background: SITE_GRAD, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' },
  explanation: (ok) => ({
    marginTop: 8, padding: '8px 12px', borderRadius: 8,
    background: ok ? '#d4f5eb' : '#fde8e4', color: ok ? 'var(--right-color)' : 'var(--error-color)', fontSize: '0.85rem', fontWeight: 600,
  }),
  submitBtn: { background: SITE_GRAD, color: '#fff', border: 'none', borderRadius: 12, padding: '13px 32px', fontWeight: 800, cursor: 'pointer', fontSize: '1rem', marginTop: 8 },
  resultBox: { background: SITE_GRAD, color: '#fff', borderRadius: 16, padding: '24px', textAlign: 'center', marginTop: 20 },
  emptyMsg: { textAlign: 'center', color: 'var(--grey)', padding: '60px 0', fontSize: '1rem' },
  loadingMsg: { textAlign: 'center', color: 'var(--grey)', padding: '60px 0', fontSize: '1rem' },
};

const CARD_COLORS = [
  'linear-gradient(135deg, #102f4e, #1a6985)',
  'linear-gradient(135deg, #ffa883, #ff7043)',
  'linear-gradient(135deg, #6fc7e1, #38b2cc)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #ffa883, #ffcc80)',
  'linear-gradient(135deg, #1a6985, #6fc7e1)',
];

function toYouTubeEmbed(url) {
  if (!url) return '';
  const m = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  return url;
}

function fmtDatetime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

// ─── Deadline countdown hook ──────────────────────────────────────────────────
function getTimeLeft(dueDate) {
  if (!dueDate) return null;
  const diff = new Date(dueDate) - Date.now();
  if (diff <= 0) return { expired: true, urgent: false, warning: false };
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, expired: false, urgent: diff < 3600000, warning: diff < 86400000 };
}

function useCountdown(dueDate) {
  const [t, setT] = useState(() => getTimeLeft(dueDate));
  useEffect(() => {
    const timer = setInterval(() => setT(getTimeLeft(dueDate)), 1000);
    return () => clearInterval(timer);
  }, [dueDate]);
  return t;
}

function DeadlineDisplay({ dueDate, isDone }) {
  const t = useCountdown(dueDate);
  if (isDone) return <span style={S.deadline('done')}>✓ Đã nộp</span>;
  if (!t) return null;
  if (t.expired) return <span style={S.deadline('expired')}>⏰ Đã hết hạn ({fmtDatetime(dueDate)})</span>;
  const urgency = t.urgent ? 'urgent' : t.warning ? 'warning' : 'normal';
  const label = t.d > 0 ? `${t.d}n ${t.h}g` : t.h > 0 ? `${t.h}g ${t.m}p` : `${t.m}p ${t.s}s`;
  const prefix = t.urgent ? '🔴 Còn ' : t.warning ? '🟡 Còn ' : '🟢 Còn ';
  return <span style={S.deadline(urgency)}>{prefix}{label} · Hạn: {fmtDatetime(dueDate)}</span>;
}

// ─── Exercise item (for common lessons - no tracking) ─────────────────────────
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
      <div style={S.exQuestion}>{index + 1}. {exercise.question}</div>
      {exercise.type === 'mcq' ? (
        <>
          {exercise.options.map((opt, i) => (
            <button key={i} style={S.optionBtn(getOptionState(opt))} onClick={() => { if (!checked) { setSelected(opt); setChecked(true); } }}>
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}
          {checked && exercise.explanation && <div style={S.explanation(selected === exercise.answer)}>💡 {exercise.explanation}</div>}
        </>
      ) : (
        <>
          <input style={S.fillInput(checked ? (fillCorrect ? 'correct' : 'wrong') : 'idle')}
            value={fillValue} onChange={(e) => !checked && setFillValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !checked && setChecked(true)}
            placeholder="Nhập đáp án..." disabled={checked} />
          {!checked && <button style={S.checkBtn} onClick={() => setChecked(true)}>Kiểm tra</button>}
          {checked && <div style={S.explanation(fillCorrect)}>{fillCorrect ? '✅ Chính xác!' : `❌ Sai! Đáp án: ${exercise.answer}`}{exercise.explanation ? ` — ${exercise.explanation}` : ''}</div>}
        </>
      )}
    </div>
  );
}

// ─── Assignment exercise item (tracks answers for submission) ─────────────────
function AssignmentExItem({ exercise, index, answer, onChange, submitted }) {
  const [fillValue, setFillValue] = useState(answer || '');
  const isCorrect = submitted && answer ? answer.trim().toLowerCase() === exercise.answer.trim().toLowerCase() : null;

  const handleOption = (opt) => {
    if (submitted) return;
    onChange(opt);
  };

  const getOptionState = (opt) => {
    if (!submitted) return answer === opt ? 'reveal' : 'idle';
    if (opt === exercise.answer) return answer === opt ? 'correct' : 'reveal';
    if (opt === answer) return 'wrong';
    return 'idle';
  };

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
          {submitted && exercise.explanation && <div style={S.explanation(isCorrect)}>💡 {exercise.explanation}</div>}
        </>
      ) : (
        <>
          <input style={S.fillInput(submitted ? (isCorrect ? 'correct' : 'wrong') : 'idle')}
            value={fillValue}
            onChange={(e) => { if (!submitted) { setFillValue(e.target.value); onChange(e.target.value); } }}
            placeholder="Nhập đáp án..."
            disabled={submitted} />
          {submitted && <div style={S.explanation(isCorrect)}>{isCorrect ? '✅ Chính xác!' : `❌ Sai! Đáp án: ${exercise.answer}`}{exercise.explanation ? ` — ${exercise.explanation}` : ''}</div>}
        </>
      )}
    </div>
  );
}

// ─── Assignment modal ─────────────────────────────────────────────────────────
function AssignmentModal({ assignment, existingSubmission, userInfo, onClose, onSubmitted }) {
  const [answers, setAnswers] = useState(() => {
    if (existingSubmission) {
      const m = {};
      (existingSubmission.answers || []).forEach((a) => { m[a.questionId] = a.answer; });
      return m;
    }
    return {};
  });
  const [submitted, setSubmitted] = useState(!!existingSubmission);
  const [result, setResult] = useState(existingSubmission ? { score: existingSubmission.score, maxScore: existingSubmission.maxScore } : null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const isExpired = assignment.dueDate && new Date() > new Date(assignment.dueDate);

  const setAnswer = (questionId, val) => setAnswers((prev) => ({ ...prev, [questionId]: val }));

  const handleSubmit = async () => {
    setSubmitting(true); setMsg('');
    try {
      const answerList = (assignment.exercises || []).map((ex) => ({ questionId: ex.id, answer: answers[ex.id] || '' }));
      const res = await grammarApi.submitAssignment(assignment.id, {
        answers: answerList,
        studentName: userInfo?.name || '',
      });
      setResult({ score: res.data.score, maxScore: res.data.maxScore });
      setSubmitted(true);
      onSubmitted && onSubmitted();
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Lỗi khi nộp bài. Thử lại.');
    } finally { setSubmitting(false); }
  };

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        <div style={S.modalHeader}>
          <button style={S.modalClose} onClick={onClose}>✕</button>
          <div style={{ fontSize: '0.82rem', opacity: 0.8, marginBottom: 6 }}>
            📋 Bài tập · {assignment.classroomName}
            {assignment.dueDate ? ` · Hạn: ${fmtDatetime(assignment.dueDate)}` : ''}
          </div>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: '1.35rem' }}>{assignment.title}</h2>
          {assignment.description && <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: 4 }}>{assignment.description}</div>}
        </div>
        <div style={S.modalBody}>
          {msg && <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 8, background: '#fde8e4', color: '#e17055', fontWeight: 700 }}>{msg}</div>}

          {isExpired && !submitted && (
            <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 8, background: '#fff7ed', color: '#c2410c', fontWeight: 700, border: '1px solid #fed7aa' }}>
              ⚠️ Bài tập đã hết hạn. Bài nộp sẽ bị đánh dấu muộn.
            </div>
          )}

          {assignment.exercises && assignment.exercises.length > 0 && (
            <>
              <div style={S.sectionTitle}>✏️ Bài tập ({assignment.exercises.length} câu)</div>
              {assignment.exercises.map((ex, i) => (
                <AssignmentExItem key={ex.id || i} exercise={ex} index={i}
                  answer={answers[ex.id]}
                  onChange={(val) => setAnswer(ex.id, val)}
                  submitted={submitted} />
              ))}
            </>
          )}

          {!submitted && assignment.exercises?.length > 0 && (
            <button style={S.submitBtn} onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Đang nộp...' : '📤 Nộp bài'}
            </button>
          )}

          {result && (
            <div style={S.resultBox}>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}>{result.score}/{result.maxScore}</div>
              <div style={{ fontSize: '1.1rem', marginTop: 4 }}>
                {result.maxScore > 0 ? Math.round((result.score / result.maxScore) * 100) : 0}% chính xác
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.85, marginTop: 8 }}>
                {result.score === result.maxScore ? '🎉 Xuất sắc! Hoàn thành toàn bộ bài tập.' : result.score >= result.maxScore * 0.7 ? '👍 Tốt! Xem lại các câu sai bên trên.' : '💪 Cố gắng hơn! Xem lại bài lý thuyết.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Student assignments section ──────────────────────────────────────────────
function StudentAssignmentsSection({ userInfo }) {
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAssignment, setActiveAssignment] = useState(null);

  const classroomId = userInfo?.classroomId || '';

  const load = useCallback(async () => {
    if (!classroomId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [aRes, sRes] = await Promise.all([
        grammarApi.getClassroomAssignments(classroomId),
        grammarApi.getMySubmissions(),
      ]);
      setAssignments(aRes.data?.assignments || []);
      setMySubmissions(sRes.data?.submissions || []);
    } catch { setAssignments([]); }
    finally { setLoading(false); }
  }, [classroomId]);

  useEffect(() => { load(); }, [load]);

  if (!classroomId) return null;
  if (loading) return null;
  if (assignments.length === 0) return null;

  const getSubmission = (assignmentId) => mySubmissions.find((s) => s.assignmentId === assignmentId) || null;

  const getUrgency = (assignment) => {
    const sub = getSubmission(assignment.id);
    if (sub) return 'done';
    if (!assignment.dueDate) return 'normal';
    const diff = new Date(assignment.dueDate) - Date.now();
    if (diff <= 0) return 'expired';
    if (diff < 3600000) return 'urgent';
    if (diff < 86400000) return 'warning';
    return 'normal';
  };

  const activeAssignmentSub = activeAssignment ? getSubmission(activeAssignment.id) : null;

  return (
    <>
      <div style={S.assignSection}>
        <div style={S.assignHeader}>
          <h2 style={S.assignTitle}>📌 Bài tập của tôi ({assignments.length})</h2>
        </div>
        <div style={S.assignGrid}>
          {assignments.map((a) => {
            const urgency = getUrgency(a);
            const sub = getSubmission(a.id);
            return (
              <div key={a.id} style={S.assignCard(urgency)}
                onClick={() => setActiveAssignment(a)}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.10)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={S.assignCardTitle}>{a.title}</div>
                <div style={S.assignCardClass}>🏫 {a.classroomName}{a.weekNumber ? ` · Tuần ${a.weekNumber}` : ''}</div>
                <DeadlineDisplay dueDate={a.dueDate} isDone={!!sub} />
                {sub && (
                  <div style={{ marginTop: 6, fontSize: '0.8rem', fontWeight: 700, color: '#047857' }}>
                    Điểm: {sub.score}/{sub.maxScore} ({sub.maxScore > 0 ? Math.round((sub.score / sub.maxScore) * 100) : 0}%)
                    {sub.isLate ? ' · ⚠️ Nộp muộn' : ''}
                  </div>
                )}
                <div style={{ marginTop: 8, fontSize: '0.78rem', color: '#64748b' }}>
                  {a.exercises?.length || 0} câu · Nhấn để làm bài
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeAssignment && (
        <AssignmentModal
          assignment={activeAssignment}
          existingSubmission={activeAssignmentSub}
          userInfo={userInfo}
          onClose={() => setActiveAssignment(null)}
          onSubmitted={load}
        />
      )}
    </>
  );
}

// ─── Common lesson modal ──────────────────────────────────────────────────────
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
          <div style={{ fontSize: '0.85rem', opacity: 0.75, marginTop: 4 }}>Giáo viên: {lesson.teacherName}</div>
        </div>
        <div style={S.modalBody}>
          {embedUrl && (
            <div style={S.videoWrap}>
              <iframe style={S.videoIframe} src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen title={lesson.title} />
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
              {lesson.exercises.map((ex, i) => <ExerciseItem key={ex.id || i} exercise={ex} index={i} />)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function GrammarPage() {
  useTitle('Ngữ pháp tiếng Anh');
  const history = useHistory();
  const userInfo = useSelector((s) => s.userInfo);
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
    } catch { setLessons([]); }
    finally { setLoading(false); }
  }, [gradeFilter, monthFilter, yearFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { grammarApi.getTopics().then((res) => setTopics(res.data?.topics || {})).catch(() => {}); }, []);

  const allTopics = [...new Set(Object.values(topics).flat())];
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
        <button onClick={() => history.push('/teacher/grammar')}
          style={{ marginTop: 16, padding: '10px 24px', borderRadius: 20, border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
          ✏️ Quản lý bài học ngữ pháp
        </button>
      </div>

      <div style={S.body}>
        {/* Student assignment section */}
        <StudentAssignmentsSection userInfo={userInfo} />

        {/* Common lessons filter */}
        <div style={S.filterCard}>
          <div style={S.gradeTabs}>
            {GRADE_LEVELS.map((g) => (
              <button key={g} style={S.gradeTab(gradeFilter === g)} onClick={() => setGradeFilter(g)}>
                {GRADE_LABELS[g]}
              </button>
            ))}
          </div>
          <div style={S.filterRow}>
            <input style={S.searchInput} placeholder="🔍 Tìm kiếm bài học..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
              <div key={lesson.id} style={S.card} onClick={() => setSelectedLesson(lesson)}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.14)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={S.cardTop(CARD_COLORS[idx % CARD_COLORS.length])}>
                  <div style={S.cardGradeBadge}>{GRADE_LABELS[lesson.gradeLevel] || lesson.gradeLevel}</div>
                  <p style={S.cardTitle}>{lesson.title}</p>
                  <p style={S.cardTopic}>{lesson.topic || lesson.module || ''}</p>
                </div>
                <div style={S.cardBody}>
                  <div style={S.cardMeta}>
                    {lesson.videoUrl && <span style={S.metaChip('var(--bg-color-accent)', 'var(--primary-color)')}>🎬 Video</span>}
                    {lesson.exercises?.length > 0 && <span style={S.metaChip('#e8f9f5', '#00b894')}>✏️ {lesson.exercises.length} bài tập</span>}
                    {lesson.month && <span style={S.metaChip('#fff5e6', '#f39c12')}>{MONTHS[lesson.month]} {lesson.year || ''}</span>}
                  </div>
                  <p style={S.cardDesc}>{lesson.description || 'Nhấn để xem bài học.'}</p>
                  <div style={{ marginTop: 10, fontSize: '0.8rem', color: '#aaa' }}>👨‍🏫 {lesson.teacherName}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedLesson && <LessonModal lesson={selectedLesson} onClose={() => setSelectedLesson(null)} />}
    </div>
  );
}

export default GrammarPage;
