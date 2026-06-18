import grammarApi from 'apis/grammarApi';
import React, { useEffect, useState } from 'react';

const COLORS = {
  navy: '#0f172a',
  blue: '#1d4ed8',
  blueDark: '#1e40af',
  green: '#059669',
  red: '#dc2626',
  orange: '#d97706',
  slate: '#64748b',
  border: '#dbe4ef',
  bg: '#f8fafc',
};

const SITE_GRAD = 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0369a1 100%)';

const S = {
  classAssignCard: (urgency) => {
    const map = {
      urgent: { border: '#fecaca', bg: '#fef2f2', accent: COLORS.red },
      warning: { border: '#fed7aa', bg: '#fff7ed', accent: COLORS.orange },
      done: { border: '#a7f3d0', bg: '#ecfdf5', accent: COLORS.green },
      expired: { border: '#e2e8f0', bg: '#f8fafc', accent: COLORS.slate },
      normal: { border: '#bfdbfe', bg: '#eff6ff', accent: COLORS.blue },
    };

    const c = map[urgency] || map.normal;

    return {
      borderRadius: 22,
      padding: '26px 28px',
      marginBottom: 20,
      border: `1px solid ${c.border}`,
      borderLeft: `8px solid ${c.accent}`,
      background: c.bg,
      cursor: urgency !== 'expired' ? 'pointer' : 'default',
      transition: 'transform .16s ease, box-shadow .16s ease',
      boxShadow: '0 10px 24px rgba(15,23,42,0.08)',
      fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
      fontSize: '21px',
    };
  },

  deadline: (urgency) => ({
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '1.24rem',
    fontWeight: 850,
    lineHeight: 1.5,
    color:
      urgency === 'urgent'
        ? '#b91c1c'
        : urgency === 'warning'
        ? '#c2410c'
        : urgency === 'done'
        ? '#047857'
        : urgency === 'expired'
        ? '#64748b'
        : '#1d4ed8',
  }),

  exCard: {
    border: '1px solid #dbe4ef',
    borderRadius: 20,
    padding: '26px 28px',
    marginBottom: 22,
    background: '#ffffff',
    boxShadow: '0 8px 20px rgba(15,23,42,0.06)',
  },

  exQuestion: {
    fontWeight: 900,
    color: COLORS.navy,
    marginBottom: 20,
    fontSize: '1.45rem',
    lineHeight: 1.6,
  },

  optionBtn: (state) => ({
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '20px 22px',
    marginBottom: 15,
    borderRadius: 18,
    border: '1px solid',
    cursor: state === 'idle' || state === 'reveal' ? 'pointer' : 'default',
    fontWeight: 800,
    fontSize: '1.3rem',
    lineHeight: 1.5,
    transition: 'all .15s ease',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
    borderColor:
      state === 'correct'
        ? '#10b981'
        : state === 'wrong'
        ? '#fca5a5'
        : state === 'reveal'
        ? '#93c5fd'
        : '#dbe4ef',
    background:
      state === 'correct'
        ? '#ecfdf5'
        : state === 'wrong'
        ? '#fef2f2'
        : state === 'reveal'
        ? '#eff6ff'
        : '#ffffff',
    color:
      state === 'correct'
        ? '#047857'
        : state === 'wrong'
        ? '#b91c1c'
        : state === 'reveal'
        ? '#1d4ed8'
        : COLORS.navy,
  }),

  fillInput: (state) => ({
    width: '100%',
    boxSizing: 'border-box',
    padding: '20px 22px',
    borderRadius: 18,
    border: `1px solid ${
      state === 'correct'
        ? '#10b981'
        : state === 'wrong'
        ? '#fca5a5'
        : '#cbd5e1'
    }`,
    background:
      state === 'correct'
        ? '#ecfdf5'
        : state === 'wrong'
        ? '#fef2f2'
        : '#ffffff',
    color: COLORS.navy,
    fontSize: '1.3rem',
    fontWeight: 750,
    outline: 'none',
    marginBottom: 15,
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
  }),

  checkBtn: {
    background: COLORS.blue,
    color: '#fff',
    border: 'none',
    borderRadius: 15,
    padding: '18px 36px',
    fontWeight: 900,
    cursor: 'pointer',
    fontSize: '1.28rem',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
    boxShadow: '0 9px 20px rgba(29,78,216,.24)',
  },

  explanation: (ok) => ({
    marginTop: 15,
    padding: '18px 20px',
    borderRadius: 18,
    background: ok ? '#ecfdf5' : '#fef2f2',
    color: ok ? '#047857' : '#b91c1c',
    border: ok ? '1px solid #a7f3d0' : '1px solid #fecaca',
    fontSize: '1.22rem',
    fontWeight: 800,
    lineHeight: 1.6,
  }),

  submitBtn: {
    background: COLORS.blue,
    color: '#fff',
    border: 'none',
    borderRadius: 15,
    padding: '18px 38px',
    fontWeight: 900,
    cursor: 'pointer',
    fontSize: '1.3rem',
    marginTop: 16,
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
    boxShadow: '0 9px 20px rgba(29,78,216,.24)',
  },

  resultBox: {
    background: SITE_GRAD,
    color: '#fff',
    borderRadius: 22,
    padding: '36px',
    textAlign: 'center',
    marginTop: 28,
    boxShadow: '0 18px 38px rgba(15,23,42,.22)',
  },

  timerBadge: (low) => ({
    display: 'inline-flex',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 18,
    padding: '12px 18px',
    borderRadius: 999,
    fontSize: '1.2rem',
    fontWeight: 900,
    background: low ? '#fef2f2' : '#eff6ff',
    color: low ? '#b91c1c' : '#1d4ed8',
    border: low ? '1px solid #fecaca' : '1px solid #bfdbfe',
  }),

  actionBtn: (submitted) => ({
    padding: '15px 26px',
    borderRadius: 15,
    border: submitted ? '1px solid #a7f3d0' : '1px solid #1d4ed8',
    cursor: 'pointer',
    fontWeight: 900,
    fontSize: '1.22rem',
    background: submitted ? '#ecfdf5' : COLORS.blue,
    color: submitted ? '#047857' : '#ffffff',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
    boxShadow: submitted ? 'none' : '0 9px 20px rgba(29,78,216,.22)',
  }),

  infoBox: (type = 'default') => {
    const map = {
      error: {
        bg: '#fef2f2',
        color: '#b91c1c',
        border: '#fecaca',
      },
      warning: {
        bg: '#fff7ed',
        color: '#c2410c',
        border: '#fed7aa',
      },
      info: {
        bg: '#eff6ff',
        color: '#1d4ed8',
        border: '#bfdbfe',
      },
      muted: {
        bg: '#f8fafc',
        color: '#475569',
        border: '#e2e8f0',
      },
      default: {
        bg: '#f8fafc',
        color: '#334155',
        border: '#e2e8f0',
      },
    };

    const c = map[type] || map.default;

    return {
      marginBottom: 16,
      padding: '18px 20px',
      borderRadius: 18,
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      fontWeight: 800,
      fontSize: '1.2rem',
      lineHeight: 1.65,
    };
  },
};

export function fmtDatetime(iso) {
  if (!iso) return '';

  const d = new Date(iso);

  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

export function getTimeLeft(dueDate) {
  if (!dueDate) return null;

  const diff = new Date(dueDate) - Date.now();

  if (diff <= 0) return { expired: true, urgent: false, warning: false };

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return {
    d,
    h,
    m,
    s,
    expired: false,
    urgent: diff < 3600000,
    warning: diff < 86400000,
  };
}

export function useCountdown(dueDate) {
  const [t, setT] = useState(() => getTimeLeft(dueDate));

  useEffect(() => {
    const timer = setInterval(() => setT(getTimeLeft(dueDate)), 1000);
    return () => clearInterval(timer);
  }, [dueDate]);

  return t;
}

export function DeadlineDisplay({ dueDate, isDone }) {
  const t = useCountdown(dueDate);

  if (isDone) return <span style={S.deadline('done')}>Đã nộp</span>;
  if (!t) return null;

  if (t.expired) {
    return <span style={S.deadline('expired')}>Đã hết hạn ({fmtDatetime(dueDate)})</span>;
  }

  const urgency = t.urgent ? 'urgent' : t.warning ? 'warning' : 'normal';

  const label =
    t.d > 0
      ? `${t.d}n ${t.h}g`
      : t.h > 0
      ? `${t.h}g ${t.m}p`
      : `${t.m}p ${t.s}s`;

  const prefix = t.urgent
    ? 'Còn rất ít thời gian: '
    : t.warning
    ? 'Sắp hết hạn: '
    : 'Còn: ';

  return (
    <span style={S.deadline(urgency)}>
      {prefix}
      {label} · Hạn: {fmtDatetime(dueDate)}
    </span>
  );
}

export function getExpiryNotice(assignments, mySubmissions) {
  const pending = (assignments || []).filter((a) => {
    if ((mySubmissions || []).some((s) => s.assignmentId === a.id)) return false;
    return a.dueDate && new Date(a.dueDate) > Date.now();
  });

  let best = null;
  let bestDiff = Infinity;

  pending.forEach((a) => {
    const diff = new Date(a.dueDate) - Date.now();

    if (diff < 86400000 && diff < bestDiff) {
      best = a;
      bestDiff = diff;
    }
  });

  if (!best) return null;

  const urgent = bestDiff < 3600000;
  const h = Math.floor(bestDiff / 3600000);
  const m = Math.floor((bestDiff % 3600000) / 60000);
  const label = h > 0 ? `${h} giờ ${m} phút` : `${m} phút`;

  return {
    id: best.id,
    type: urgent ? 'error' : 'warning',
    message: `Bài tập "${best.title}" sắp hết hạn — còn ${label}.`,
  };
}

export function AssignmentExItem({ exercise, index, answer, onChange, submitted, hideReview }) {
  const [fillValue, setFillValue] = useState(answer || '');

  const isCorrect =
    submitted && answer
      ? answer.trim().toLowerCase() === exercise.answer.trim().toLowerCase()
      : null;

  const getOptionState = (opt) => {
    if (hideReview) return opt === answer ? 'reveal' : 'idle';
    if (!submitted) return answer === opt ? 'reveal' : 'idle';
    if (opt === exercise.answer) return answer === opt ? 'correct' : 'reveal';
    if (opt === answer) return 'wrong';
    return 'idle';
  };

  return (
    <div style={S.exCard}>
      <div style={S.exQuestion}>
        Câu {index + 1}. {exercise.question}
      </div>

      {exercise.type === 'mcq' ? (
        <>
          {exercise.options.map((opt, i) => (
            <button
              key={i}
              style={S.optionBtn(getOptionState(opt))}
              onClick={() => {
                if (!submitted) onChange(opt);
              }}
            >
              <strong>{String.fromCharCode(65 + i)}.</strong> {opt}
            </button>
          ))}

          {submitted && !hideReview && exercise.explanation && (
            <div style={S.explanation(isCorrect)}>
              <strong>Giải thích:</strong> {exercise.explanation}
            </div>
          )}
        </>
      ) : (
        <>
          <input
            style={S.fillInput(
              hideReview ? 'idle' : submitted ? (isCorrect ? 'correct' : 'wrong') : 'idle',
            )}
            value={fillValue}
            onChange={(e) => {
              if (!submitted) {
                setFillValue(e.target.value);
                onChange(e.target.value);
              }
            }}
            placeholder="Nhập đáp án..."
            disabled={submitted}
          />

          {submitted && !hideReview && (
            <div style={S.explanation(isCorrect)}>
              {isCorrect ? (
                'Chính xác.'
              ) : (
                <>
                  Sai. Đáp án đúng: <strong>{exercise.answer}</strong>
                </>
              )}
              {exercise.explanation ? ` — ${exercise.explanation}` : ''}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function InlineAssignment({ assignment, existingSubmission, userInfo, onSubmitted }) {
  const [open, setOpen] = useState(false);

  const [answers, setAnswers] = useState(() => {
    if (existingSubmission) {
      const m = {};

      (existingSubmission.answers || []).forEach((a) => {
        m[a.questionId] = a.answer;
      });

      return m;
    }

    return {};
  });

  const [submitted, setSubmitted] = useState(!!existingSubmission);

  const [result, setResult] = useState(
    existingSubmission
      ? {
          score: existingSubmission.score,
          maxScore: existingSubmission.maxScore,
        }
      : null,
  );

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [attemptEndAt, setAttemptEndAt] = useState(null);
  const [remainingSec, setRemainingSec] = useState(null);

  const isExpired = assignment.dueDate && new Date() > new Date(assignment.dueDate);
  const notYetOpen = assignment.startDate && new Date() < new Date(assignment.startDate);
  const hideReview = assignment.showResultOnly !== false;
  const t = useCountdown(assignment.dueDate);

  const urgency = submitted
    ? 'done'
    : !assignment.dueDate
    ? 'normal'
    : t?.expired
    ? 'expired'
    : t?.urgent
    ? 'urgent'
    : t?.warning
    ? 'warning'
    : 'normal';

  const handleSubmit = async () => {
    if (submitting || submitted) return;

    setSubmitting(true);
    setMsg('');

    try {
      const answerList = (assignment.exercises || []).map((ex) => ({
        questionId: ex.id,
        answer: answers[ex.id] || '',
      }));

      const res = await grammarApi.submitAssignment(assignment.id, {
        answers: answerList,
        studentName: userInfo?.name || '',
      });

      setResult({
        score: res.data.score,
        maxScore: res.data.maxScore,
      });

      setSubmitted(true);
      setAttemptEndAt(null);
      onSubmitted && onSubmitted();
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Lỗi khi nộp bài. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!attemptEndAt || submitted) return undefined;

    const tick = () => {
      const left = Math.max(0, Math.round((attemptEndAt - Date.now()) / 1000));

      setRemainingSec(left);

      if (left <= 0) handleSubmit();
    };

    tick();

    const id = setInterval(tick, 1000);

    return () => clearInterval(id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptEndAt, submitted]);

  const handleToggleOpen = () => {
    if (!open && !submitted && assignment.durationMinutes && !attemptEndAt) {
      setAttemptEndAt(Date.now() + assignment.durationMinutes * 60000);
    }

    setOpen(!open);
  };

  return (
    <div style={S.classAssignCard(urgency)}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 20,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 900,
              fontSize: '1.62rem',
              color: COLORS.navy,
              marginBottom: 10,
              lineHeight: 1.35,
            }}
          >
            {assignment.title}
          </div>

          <div
            style={{
              fontSize: '1.22rem',
              color: COLORS.slate,
              marginBottom: 12,
              fontWeight: 700,
              lineHeight: 1.5,
            }}
          >
            {assignment.weekNumber ? `Tuần ${assignment.weekNumber} · ` : ''}
            {assignment.exercises?.length || 0} câu
            {assignment.durationMinutes ? ` · ${assignment.durationMinutes} phút` : ''}
          </div>

          <DeadlineDisplay dueDate={assignment.dueDate} isDone={submitted} />

          {result && (
            <div
              style={{
                marginTop: 12,
                fontSize: '1.22rem',
                fontWeight: 900,
                color: '#047857',
              }}
            >
              Kết quả: {result.score}/{result.maxScore} (
              {result.maxScore > 0 ? Math.round((result.score / result.maxScore) * 100) : 0}%)
            </div>
          )}
        </div>

        {(!isExpired || submitted) && !notYetOpen ? (
          <button onClick={handleToggleOpen} style={S.actionBtn(submitted)}>
            {submitted ? (open ? 'Đóng' : 'Xem lại') : open ? 'Đóng' : 'Làm bài'}
          </button>
        ) : null}
      </div>

      {notYetOpen && (
        <div style={{ ...S.infoBox('info'), marginTop: 18, marginBottom: 0 }}>
          Bài tập mở từ: {fmtDatetime(assignment.startDate)}
        </div>
      )}

      {open && (
        <div style={{ marginTop: 26 }}>
          {msg && <div style={S.infoBox('error')}>{msg}</div>}

          {isExpired && !submitted && (
            <div style={S.infoBox('warning')}>
              Bài tập đã hết hạn. Bài nộp có thể bị đánh dấu muộn.
            </div>
          )}

          {!submitted && remainingSec != null && (
            <div style={S.timerBadge(remainingSec < 60)}>
              Còn lại {Math.floor(remainingSec / 60)}:
              {(remainingSec % 60).toString().padStart(2, '0')} để làm bài
            </div>
          )}

          {assignment.description && (
            <div style={{ ...S.infoBox('muted'), marginTop: 14 }}>
              {assignment.description}
            </div>
          )}

          {(!submitted || !hideReview) &&
            (assignment.exercises || []).map((ex, i) => (
              <AssignmentExItem
                key={ex.id || i}
                exercise={ex}
                index={i}
                answer={answers[ex.id]}
                onChange={(val) => setAnswers((prev) => ({ ...prev, [ex.id]: val }))}
                submitted={submitted}
                hideReview={hideReview}
              />
            ))}

          {submitted && hideReview && (
            <div style={S.infoBox('muted')}>
              Bạn chỉ có thể xem điểm số cho bài tập này. Giáo viên đã ẩn phần xem lại chi tiết bài làm.
            </div>
          )}

          {!submitted && assignment.exercises?.length > 0 && (
            <button style={S.submitBtn} onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Đang nộp...' : 'Nộp bài'}
            </button>
          )}

          {result && (
            <div style={S.resultBox}>
              <div style={{ fontSize: '3.2rem', fontWeight: 900, lineHeight: 1 }}>
                {result.score}/{result.maxScore}
              </div>

              <div style={{ fontSize: '1.42rem', marginTop: 14, fontWeight: 850 }}>
                {result.maxScore > 0 ? Math.round((result.score / result.maxScore) * 100) : 0}% chính xác
              </div>

              <div style={{ fontSize: '1.22rem', opacity: 0.92, marginTop: 14, fontWeight: 650 }}>
                {result.score === result.maxScore
                  ? 'Hoàn thành xuất sắc.'
                  : result.score >= result.maxScore * 0.7
                  ? 'Kết quả tốt. Hãy xem lại các câu chưa chắc.'
                  : 'Bạn nên ôn lại lý thuyết và luyện thêm.'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}