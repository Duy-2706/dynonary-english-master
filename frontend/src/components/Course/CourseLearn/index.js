import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PlayCircleIcon from '@material-ui/icons/PlayCircleFilled';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LockIcon from '@material-ui/icons/Lock';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import courseApi from 'apis/courseApi';

const useStyle = makeStyles((theme) => ({
  wrapper: { padding: '24px 0', minHeight: '80vh' },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  lessonTitle: { fontWeight: 700, fontSize: '1.3rem', flex: 1 },

  // Video
  videoWrap: {
    position: 'relative',
    width: '100%',
    maxWidth: 800,
    margin: '0 auto 24px',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    backgroundColor: '#000',
    paddingTop: '56.25%', // 16:9
  },
  videoIframe: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    border: 'none',
  },
  videoNote: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
    marginBottom: 16,
  },

  // Tabs
  tabsWrap: {
    marginBottom: 24,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },

  // Lý thuyết
  theoryWrap: {
    maxWidth: 800,
    margin: '0 auto',
    lineHeight: 1.8,
    fontSize: '1rem',
    '& h2': { fontSize: '1.4rem', fontWeight: 700, marginBottom: 12, marginTop: 24, color: theme.palette.primary.main },
    '& h3': { fontSize: '1.2rem', fontWeight: 600, marginBottom: 8, marginTop: 16 },
    '& table': { width: '100%', borderCollapse: 'collapse', marginBottom: 16 },
    '& th': { backgroundColor: theme.palette.primary.main, color: '#fff', padding: '10px 14px', textAlign: 'left' },
    '& td': { padding: '8px 14px', borderBottom: `1px solid ${theme.palette.divider}` },
    '& tr:nth-child(even)': { backgroundColor: theme.palette.action.hover },
    '& .highlight': { backgroundColor: '#fff3e0', padding: '2px 6px', borderRadius: 4, fontWeight: 600 },
    '& .example': { color: theme.palette.primary.main, fontStyle: 'italic' },
    '& ul': { paddingLeft: 20, marginBottom: 12 },
    '& li': { marginBottom: 6 },
    '& .rule-box': {
      border: `2px solid ${theme.palette.primary.main}`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      backgroundColor: theme.palette.primary.main + '08',
    },
    '& .warning-box': {
      border: '2px solid #ff9800',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      backgroundColor: '#fff8e1',
    },
  },

  // Flashcard
  flashcardWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 },
  flashcard: {
    width: '100%',
    maxWidth: 600,
    minHeight: 260,
    borderRadius: 24,
    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': { transform: 'scale(1.02)' },
  },
  wordText: { fontSize: '2.2rem', fontWeight: 700, marginBottom: 8, textAlign: 'center' },
  phoneticText: { color: theme.palette.primary.main, fontSize: '1.1rem', marginBottom: 12 },
  meanText: { fontSize: '1.2rem', color: theme.palette.text.secondary, textAlign: 'center' },
  exampleText: { fontSize: '0.9rem', color: '#888', fontStyle: 'italic', marginTop: 8, textAlign: 'center' },
  actionRow: { display: 'flex', gap: 16, justifyContent: 'center' },
  btnKnown: {
    backgroundColor: '#4caf50 !important', color: '#fff !important',
    fontWeight: '700 !important', padding: '12px 36px !important',
    borderRadius: '30px !important', minWidth: '150px !important',
  },
  btnUnknown: {
    borderColor: '#e91e63 !important', borderWidth: '2px !important',
    color: '#e91e63 !important', fontWeight: '700 !important',
    padding: '12px 36px !important', borderRadius: '30px !important',
    minWidth: '150px !important',
  },

  // Quiz
  quizWrap: { maxWidth: 720, margin: '0 auto' },
  questionNum: { color: theme.palette.text.secondary, fontSize: '0.9rem', marginBottom: 8 },
  questionText: { fontSize: '1.2rem', fontWeight: 600, marginBottom: 20, lineHeight: 1.6 },
  optionBtn: {
    display: 'block', width: '100%', textAlign: 'left',
    padding: '14px 20px', marginBottom: 10, borderRadius: 12,
    border: `2px solid ${theme.palette.divider}`,
    cursor: 'pointer', fontSize: '1rem', transition: 'all 0.2s',
    backgroundColor: theme.palette.background.paper,
    '&:hover': { borderColor: theme.palette.primary.main, backgroundColor: theme.palette.primary.main + '11' },
  },
  optionCorrect: { borderColor: '#4caf50 !important', backgroundColor: '#e8f5e9 !important', color: '#2e7d32 !important' },
  optionWrong: { borderColor: '#e91e63 !important', backgroundColor: '#fce4ec !important', color: '#c62828 !important' },
  explanation: { marginTop: 12, padding: '10px 16px', borderRadius: 8, backgroundColor: '#e3f2fd', color: '#1565c0', fontSize: '0.9rem' },

  // Fill blank
  fillWrap: { maxWidth: 720, margin: '0 auto' },
  sentenceText: { fontSize: '1.2rem', fontWeight: 600, marginBottom: 16, lineHeight: 1.8 },
  input: {
    width: '100%', padding: '14px 20px', borderRadius: 12,
    border: `2px solid ${theme.palette.divider}`, fontSize: '1rem',
    marginBottom: 12, outline: 'none',
    '&:focus': { borderColor: theme.palette.primary.main },
  },

  // Result
  resultWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', textAlign: 'center' },
  resultTitle: { fontSize: '2rem', fontWeight: 700, marginBottom: 8 },
  resultScore: { fontSize: '3.5rem', fontWeight: 700, color: theme.palette.primary.main, marginBottom: 8 },
  statRow: { display: 'flex', gap: 16, marginBottom: 32, justifyContent: 'center', flexWrap: 'wrap' },
  statBox: { padding: '16px 24px', borderRadius: 12, minWidth: 100, border: '2px solid', textAlign: 'center' },

  // Lock
  lockWrap: {
    textAlign: 'center', padding: '60px 20px',
    border: `2px dashed ${theme.palette.divider}`,
    borderRadius: 20, maxWidth: 500, margin: '0 auto',
  },

  // Progress bar
  progressWrap: { marginBottom: 16 },
  progressText: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: theme.palette.text.secondary, marginBottom: 6 },
}));

// ===== HELPER: Convert YouTube URL to embed =====
function getYoutubeEmbedUrl(url) {
  if (!url) return '';
  if (url.includes('embed')) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([^&\n?#]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : url;
}

// ===== VIDEO COMPONENT =====
function VideoSection({ videoUrl, onWatched }) {
  const classes = useStyle();
  const [watched, setWatched] = useState(false);
  const embedUrl = getYoutubeEmbedUrl(videoUrl);

  const handleWatched = () => {
    setWatched(true);
    onWatched();
  };

  return (
    <div>
      <div className={classes.videoWrap}>
        <iframe
          className={classes.videoIframe}
          src={embedUrl}
          title="Bài giảng"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      {!watched && (
        <div className={classes.videoNote}>
          <p>📺 Xem video bài giảng xong rồi nhấn nút bên dưới để làm bài tập</p>
          <Button
            variant="contained"
            className="_btn _btn-primary"
            style={{ marginTop: 8 }}
            onClick={handleWatched}>
            ✅ Tôi đã xem xong video
          </Button>
        </div>
      )}
      {watched && (
        <p style={{ textAlign: 'center', color: '#4caf50', fontWeight: 600 }}>
          ✅ Đã xem video — Hãy chuyển sang tab Bài tập để luyện tập!
        </p>
      )}
    </div>
  );
}

// ===== THEORY COMPONENT =====
function TheorySection({ content, materials }) {
  const classes = useStyle();
  return (
    <div>
      {content && (
        <div className={classes.theoryWrap} dangerouslySetInnerHTML={{ __html: content }} />
      )}
      {materials?.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>📎 Tài liệu đính kèm</h3>
          {materials.map((m, i) => (
            <div key={i} style={{
              padding: '14px 16px', borderRadius: 10, marginBottom: 8,
              border: '1px solid #e0e0e0', backgroundColor: '#fafafa',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 24 }}>📄</span>
              <div style={{ flex: 1 }}>
                <strong>{m.title}</strong>
                {m.content && <p style={{ color: '#666', fontSize: '0.85rem', margin: '4px 0 0' }}>{m.content}</p>}
              </div>
              {m.fileUrl && (
                <a href={m.fileUrl} target="_blank" rel="noreferrer"
                  style={{ padding: '8px 16px', backgroundColor: '#1976d2', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                  📥 Xem / Tải
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== FLASHCARD MODE =====
function FlashcardMode({ words, onComplete }) {
  const classes = useStyle();
  const [current, setCurrent] = useState(0);
  const [showMean, setShowMean] = useState(false);
  const [known, setKnown] = useState([]);
  const [unknown, setUnknown] = useState([]);

  const word = words[current];
  const percent = Math.round((current / words.length) * 100);

  const handleAnswer = (isKnown) => {
    const newKnown = isKnown ? [...known, word.word] : known;
    const newUnknown = !isKnown ? [...unknown, word.word] : unknown;
    setShowMean(false);

    if (current + 1 >= words.length) {
      onComplete({ knownWords: newKnown, unknownWords: newUnknown, correctCount: newKnown.length, totalCount: words.length });
    } else {
      if (isKnown) setKnown(newKnown); else setUnknown(newUnknown);
      setCurrent(current + 1);
    }
  };

  return (
    <div className={classes.flashcardWrap}>
      <div className={classes.progressWrap} style={{ width: '100%', maxWidth: 600 }}>
        <div className={classes.progressText}>
          <span>Từ {current + 1} / {words.length}</span>
          <span>{percent}%</span>
        </div>
        <LinearProgress variant="determinate" value={percent} />
      </div>

      <div className={classes.flashcard} onClick={() => setShowMean(!showMean)}>
        <div className={classes.wordText}>{word.word}</div>
        {word.phonetic && <div className={classes.phoneticText}>/{word.phonetic}/</div>}
        {showMean ? (
          <>
            <div className={classes.meanText}>{word.mean}</div>
            {word.example && <div className={classes.exampleText}>"{word.example}"</div>}
          </>
        ) : (
          <div style={{ color: '#aaa', fontSize: '0.9rem', marginTop: 8 }}>👆 Nhấn để xem nghĩa</div>
        )}
      </div>

      <div className={classes.actionRow}>
        <Button variant="outlined" className={classes.btnUnknown} startIcon={<CloseIcon />} onClick={() => handleAnswer(false)}>
          Chưa biết
        </Button>
        <Button variant="contained" className={classes.btnKnown} startIcon={<CheckIcon />} onClick={() => handleAnswer(true)}>
          Đã biết
        </Button>
      </div>
    </div>
  );
}

// ===== QUIZ MODE =====
function QuizMode({ questions, onComplete }) {
  const classes = useStyle();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplain, setShowExplain] = useState(false);
  const [correct, setCorrect] = useState(0);

  const question = questions[current];
  const percent = Math.round((current / questions.length) * 100);

  const handleSelect = (index) => {
    if (selected !== null) return;
    setSelected(index);
    const isCorrect = index === question.correctIndex;
    if (isCorrect) setCorrect(c => c + 1);
    setShowExplain(true);

    setTimeout(() => {
      setSelected(null);
      setShowExplain(false);
      if (current + 1 >= questions.length) {
        onComplete({ correctCount: correct + (isCorrect ? 1 : 0), totalCount: questions.length });
      } else {
        setCurrent(current + 1);
      }
    }, 2000);
  };

  return (
    <div className={classes.quizWrap}>
      <div className={classes.progressWrap}>
        <div className={classes.progressText}>
          <span>Câu {current + 1} / {questions.length}</span>
          <span>✅ {correct} đúng</span>
        </div>
        <LinearProgress variant="determinate" value={percent} />
      </div>

      <p className={classes.questionNum}>Câu {current + 1}:</p>
      <div className={classes.questionText}>{question.question}</div>

      {question.options.map((option, index) => {
        let cls = classes.optionBtn;
        if (selected !== null) {
          if (index === question.correctIndex) cls += ` ${classes.optionCorrect}`;
          else if (index === selected && index !== question.correctIndex) cls += ` ${classes.optionWrong}`;
        }
        return (
          <button key={index} className={cls} onClick={() => handleSelect(index)}>
            <strong>{['A', 'B', 'C', 'D'][index]}.</strong> {option}
          </button>
        );
      })}

      {showExplain && question.explanation && (
        <div className={classes.explanation}>
          💡 <strong>Giải thích:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
}

// ===== FILL BLANK MODE =====
function FillBlankMode({ fillBlanks, onComplete }) {
  const classes = useStyle();
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(0);

  const item = fillBlanks[current];

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const isCorrect = answer.trim().toLowerCase() === item.correctAnswer.toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setCorrect(c => c + 1);

    setTimeout(() => {
      setFeedback(null);
      setAnswer('');
      if (current + 1 >= fillBlanks.length) {
        onComplete({ correctCount: correct + (isCorrect ? 1 : 0), totalCount: fillBlanks.length });
      } else {
        setCurrent(current + 1);
      }
    }, 1500);
  };

  return (
    <div className={classes.fillWrap}>
      <div className={classes.progressWrap}>
        <div className={classes.progressText}>
          <span>Câu {current + 1} / {fillBlanks.length}</span>
          <span>✅ {correct} đúng</span>
        </div>
        <LinearProgress variant="determinate" value={Math.round((current / fillBlanks.length) * 100)} />
      </div>

      <div className={classes.sentenceText}>
        {item.sentence.replace('___', '________')}
      </div>
      {item.hint && <p style={{ color: '#888', marginBottom: 12, fontSize: '0.9rem' }}>💡 Gợi ý: {item.hint}</p>}

      <input
        className={classes.input}
        style={{ borderColor: feedback === 'correct' ? '#4caf50' : feedback === 'wrong' ? '#e91e63' : undefined }}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Nhập câu trả lời..."
        disabled={feedback !== null}
        autoFocus
      />
      {feedback === 'wrong' && (
        <p style={{ color: '#e91e63', marginBottom: 12 }}>
          ❌ Đáp án đúng: <strong>{item.correctAnswer}</strong>
        </p>
      )}
      {feedback === 'correct' && (
        <p style={{ color: '#4caf50', marginBottom: 12 }}>✅ Chính xác!</p>
      )}
      <Button variant="contained" className="_btn _btn-primary" onClick={handleSubmit} disabled={!answer.trim() || feedback !== null}>
        Kiểm tra
      </Button>
    </div>
  );
}

// ===== RESULT =====
function LessonResult({ result, lessonTitle, onNext, onReplay, nextLessonLocked }) {
  const classes = useStyle();
  const total = result.totalCount || (result.knownWords?.length + result.unknownWords?.length) || 0;
  const correct = result.correctCount || result.knownWords?.length || 0;
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  const getMessage = () => {
    if (percent === 100) return '🏆 Xuất sắc! Bạn làm đúng tất cả!';
    if (percent >= 80) return '🎉 Rất tốt! Tiếp tục phát huy!';
    if (percent >= 60) return '💪 Khá ổn! Hãy ôn lại phần chưa nắm!';
    return '📚 Cần cố gắng thêm! Làm lại nhé!';
  };

  return (
    <div className={classes.resultWrap}>
      <h1 className={classes.resultTitle}>🎉 Hoàn thành bài học!</h1>
      <p style={{ color: '#888', marginBottom: 16 }}>{lessonTitle}</p>
      <div className={classes.resultScore}>{percent}%</div>
      <p style={{ marginBottom: 24, fontSize: '1.1rem' }}>{getMessage()}</p>

      <div className={classes.statRow}>
        <div className={classes.statBox} style={{ borderColor: '#4caf50', backgroundColor: '#e8f5e9' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#4caf50' }}>{correct}</div>
          <div style={{ fontSize: '0.85rem', color: '#888' }}>✅ Đúng</div>
        </div>
        <div className={classes.statBox} style={{ borderColor: '#e91e63', backgroundColor: '#fce4ec' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#e91e63' }}>{total - correct}</div>
          <div style={{ fontSize: '0.85rem', color: '#888' }}>❌ Sai</div>
        </div>
        <div className={classes.statBox} style={{ borderColor: '#1976d2', backgroundColor: '#e3f2fd' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1976d2' }}>{total}</div>
          <div style={{ fontSize: '0.85rem', color: '#888' }}>📝 Tổng</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="outlined" className="_btn _btn-stand" onClick={onReplay}>
          🔄 Làm lại
        </Button>
        {nextLessonLocked ? (
          <Button variant="contained" style={{ backgroundColor: '#ff9800', color: '#fff' }} startIcon={<LockIcon />} onClick={onNext}>
            🔓 Mua khóa để học tiếp
          </Button>
        ) : (
          <Button variant="contained" className="_btn _btn-primary" onClick={onNext}>
            ▶ Bài tiếp theo
          </Button>
        )}
      </div>
    </div>
  );
}

// ===== MAIN =====
function CourseLearn() {
  const classes = useStyle();
  const { id: courseId, lessonId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { isAuth } = useSelector(s => s.userInfo);

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [videoWatched, setVideoWatched] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [result, setResult] = useState(null);
  const [key, setKey] = useState(0);
  const [nextLessonInfo, setNextLessonInfo] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setIsDone(false);
      setResult(null);
      setTab(0);
      setVideoWatched(false);
      try {
        const res = await courseApi.getLessonDetail(lessonId);
        if (res.status === 200) {
          setLesson(res.data.lesson);
          setNextLessonInfo(res.data.nextLesson || null);
        }
      } catch (e) {}
      setLoading(false);
    })();
  }, [lessonId]);

  const handleComplete = async (resultData) => {
    setResult(resultData);
    setIsDone(true);
    try {
      await courseApi.updateLessonProgress(courseId, lessonId, {
        status: 'completed',
        correctCount: resultData.correctCount || resultData.knownWords?.length || 0,
        totalCount: resultData.totalCount || (resultData.knownWords?.length + resultData.unknownWords?.length) || 0,
        knownWords: resultData.knownWords || [],
        unknownWords: resultData.unknownWords || [],
      });
    } catch (e) {}
  };

  const handleReplay = () => {
    setIsDone(false);
    setResult(null);
    setKey(k => k + 1);
    setTab(lesson?.videoUrl ? 0 : lesson?.content ? 0 : 0);
    setVideoWatched(false);
  };

  const handleNext = () => {
    if (nextLessonInfo && !nextLessonInfo.locked) {
      history.push(`/courses/${courseId}/learn/${nextLessonInfo._id}`);
    } else if (nextLessonInfo?.locked) {
      history.push(`/courses/${courseId}/detail`);
    } else {
      history.push(`/courses/${courseId}/detail`);
    }
  };

  // Tab labels động theo nội dung bài
  const getTabs = () => {
    const tabs = [];
    if (lesson?.videoUrl) tabs.push({ label: '📺 Video', icon: <PlayCircleIcon /> });
    if (lesson?.content || lesson?.materials?.length > 0) tabs.push({ label: '📖 Lý thuyết', icon: <MenuBookIcon /> });
    if (lesson?.hasExercise !== false) tabs.push({ label: '✏️ Bài tập', icon: <AssignmentIcon /> });
    return tabs;
  };

  const canDoExercise = () => {
    if (!lesson?.videoUrl) return true; // Không có video → làm ngay
    return videoWatched; // Có video → phải xem xong
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><CircularProgress /></div>;
  if (!lesson) return <div className="container" style={{ padding: 60, textAlign: 'center' }}>Không tìm thấy bài học.</div>;

  const tabs = getTabs();

  return (
    <div className={`container ${classes.wrapper}`}>
      {/* Header */}
      <div className={classes.header}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => history.push(`/courses/${courseId}/detail`)}>
          Quay lại
        </Button>
        <span className={classes.lessonTitle}>{lesson.title}</span>
      </div>

      {isDone && result ? (
        <LessonResult
          result={result}
          lessonTitle={lesson.title}
          onNext={handleNext}
          onReplay={handleReplay}
          nextLessonLocked={nextLessonInfo?.locked}
        />
      ) : (
        <>
          {/* Tabs */}
          {tabs.length > 1 && (
            <div className={classes.tabsWrap}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} indicatorColor="primary" textColor="primary">
                {tabs.map((t, i) => (
                  <Tab key={i} label={t.label} disabled={i === tabs.length - 1 && !canDoExercise()} />
                ))}
              </Tabs>
              {!canDoExercise() && (
                <p style={{ color: '#ff9800', fontSize: '0.85rem', padding: '4px 0' }}>
                  🔒 Xem xong video mới có thể làm bài tập
                </p>
              )}
            </div>
          )}

          <div key={key}>
            {/* Tab Video */}
            {tabs[tab]?.label?.includes('Video') && lesson.videoUrl && (
              <VideoSection videoUrl={lesson.videoUrl} onWatched={() => setVideoWatched(true)} />
            )}

            {/* Tab Lý thuyết */}
            {tabs[tab]?.label?.includes('Lý thuyết') && (
              <TheorySection content={lesson.content} materials={lesson.materials} />
            )}

            {/* Tab Bài tập */}
            {tabs[tab]?.label?.includes('Bài tập') && (
              <>
                {!canDoExercise() ? (
                  <div className={classes.lockWrap}>
                    <LockIcon style={{ fontSize: 48, color: '#ff9800', marginBottom: 12 }} />
                    <h3>Hãy xem video trước!</h3>
                    <p style={{ color: '#888' }}>Bạn cần xem hết video bài giảng rồi mới làm bài tập được nhé.</p>
                    <Button variant="contained" style={{ marginTop: 16, backgroundColor: '#ff9800', color: '#fff' }}
                      onClick={() => setTab(0)}>
                      Xem video ngay
                    </Button>
                  </div>
                ) : (
                  <>
                    {lesson.type === 'flashcard' && lesson.words?.length > 0 && (
                      <FlashcardMode words={lesson.words} onComplete={handleComplete} />
                    )}
                    {lesson.type === 'quiz' && lesson.questions?.length > 0 && (
                      <QuizMode questions={lesson.questions} onComplete={handleComplete} />
                    )}
                    {lesson.type === 'fill_blank' && lesson.fillBlanks?.length > 0 && (
                      <FillBlankMode fillBlanks={lesson.fillBlanks} onComplete={handleComplete} />
                    )}
                    {lesson.type === 'mixed' && (
                      <>
                        {lesson.words?.length > 0 && <FlashcardMode words={lesson.words} onComplete={handleComplete} />}
                        {lesson.questions?.length > 0 && <QuizMode questions={lesson.questions} onComplete={handleComplete} />}
                      </>
                    )}
                    {lesson.type === 'video' && (
                      <div style={{ textAlign: 'center', padding: 40 }}>
                        <p style={{ color: '#4caf50', fontSize: '1.1rem' }}>✅ Bài này chỉ có video. Nhấn hoàn thành!</p>
                        <Button variant="contained" className="_btn _btn-primary" style={{ marginTop: 16 }}
                          onClick={() => handleComplete({ correctCount: 1, totalCount: 1 })}>
                          Đánh dấu hoàn thành
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* Không có tab (chỉ có 1 loại content) */}
            {tabs.length === 1 && tabs[0]?.label?.includes('Bài tập') && (
              <>
                {lesson.type === 'flashcard' && lesson.words?.length > 0 && <FlashcardMode words={lesson.words} onComplete={handleComplete} />}
                {lesson.type === 'quiz' && lesson.questions?.length > 0 && <QuizMode questions={lesson.questions} onComplete={handleComplete} />}
                {lesson.type === 'fill_blank' && lesson.fillBlanks?.length > 0 && <FillBlankMode fillBlanks={lesson.fillBlanks} onComplete={handleComplete} />}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CourseLearn;