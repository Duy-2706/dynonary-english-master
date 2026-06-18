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
import ReplayIcon from '@material-ui/icons/Replay';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import courseApi from 'apis/courseApi';

const useStyle = makeStyles(() => ({
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 8% 12%, rgba(37,99,235,.10) 0 260px, transparent 261px),
      radial-gradient(circle at 92% 8%, rgba(14,165,233,.12) 0 240px, transparent 241px),
      radial-gradient(circle at 82% 88%, rgba(16,185,129,.10) 0 280px, transparent 281px),
      linear-gradient(180deg, #eef4ff 0%, #f6f8fc 46%, #eef7f3 100%)
    `,
    padding: '34px 0 72px',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
  },

  wrapper: {
    width: 'min(1180px, calc(100% - 48px))',
    margin: '0 auto',
  },

  headerCard: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0369a1 100%)',
    borderRadius: 22,
    padding: '30px 34px',
    marginBottom: 24,
    boxShadow: '0 18px 42px rgba(15,23,42,0.18)',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    flexWrap: 'wrap',
  },

  backBtn: {
    background: 'rgba(255,255,255,.14) !important',
    color: '#ffffff !important',
    border: '1px solid rgba(255,255,255,.28) !important',
    borderRadius: '11px !important',
    padding: '10px 18px !important',
    fontSize: '1rem !important',
    fontWeight: '800 !important',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif !important",
    textTransform: 'none !important',
    boxShadow: 'none !important',
    '&:hover': {
      background: 'rgba(255,255,255,.20) !important',
    },
  },

  lessonTitle: {
    fontWeight: 900,
    fontSize: 'clamp(2rem, 3.7vw, 3.45rem)',
    flex: 1,
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.14,
    letterSpacing: '-0.04em',
  },

  contentCard: {
    background: '#ffffff',
    borderRadius: 20,
    border: '1px solid #dbe4ef',
    padding: 30,
    boxShadow: '0 12px 30px rgba(15,23,42,0.10)',
  },

  tabsWrap: {
    marginBottom: 28,
  },

  tabs: {
    background: '#f8fafc',
    borderRadius: 14,
    border: '1px solid #dbe4ef',
    padding: 6,
    '& .MuiTab-root': {
      fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
      fontSize: '1rem',
      fontWeight: 850,
      textTransform: 'none',
      borderRadius: 10,
      minHeight: 48,
      color: '#475569',
    },
    '& .Mui-selected': {
      color: '#ffffff !important',
      background: '#1d4ed8',
      boxShadow: '0 6px 16px rgba(29,78,216,.22)',
    },
    '& .MuiTabs-indicator': {
      display: 'none',
    },
  },

  lockNote: {
    color: '#92400e',
    fontSize: '0.98rem',
    fontWeight: 750,
    padding: '12px 15px',
    marginTop: 12,
    background: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: 12,
  },

  videoWrap: {
    position: 'relative',
    width: '100%',
    maxWidth: 900,
    margin: '0 auto 24px',
    borderRadius: 18,
    overflow: 'hidden',
    boxShadow: '0 16px 38px rgba(15,23,42,.16)',
    backgroundColor: '#000',
    paddingTop: '56.25%',
    border: '1px solid #dbe4ef',
  },

  videoIframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },

  videoNote: {
    textAlign: 'center',
    color: '#334155',
    fontSize: '1.05rem',
    marginBottom: 22,
    fontWeight: 650,
    lineHeight: 1.6,
  },

  watchedNote: {
    textAlign: 'center',
    color: '#047857',
    fontWeight: 800,
    fontSize: '1rem',
    background: '#ecfdf5',
    border: '1px solid #a7f3d0',
    padding: '13px 16px',
    borderRadius: 13,
    maxWidth: 720,
    margin: '0 auto',
  },

  mainBtn: {
    background: '#1d4ed8 !important',
    color: '#fff !important',
    borderRadius: '11px !important',
    padding: '11px 24px !important',
    fontSize: '1rem !important',
    fontWeight: '850 !important',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif !important",
    textTransform: 'none !important',
    boxShadow: '0 8px 18px rgba(29,78,216,.24) !important',
    '&:hover': {
      background: '#1e40af !important',
    },
  },

  secondaryBtn: {
    background: '#ffffff !important',
    color: '#334155 !important',
    border: '1px solid #cbd5e1 !important',
    borderRadius: '11px !important',
    padding: '11px 22px !important',
    fontSize: '1rem !important',
    fontWeight: '850 !important',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif !important",
    textTransform: 'none !important',
    boxShadow: '0 6px 16px rgba(15,23,42,.06) !important',
    '&:hover': {
      background: '#f8fafc !important',
    },
  },

  theoryWrap: {
    maxWidth: 900,
    margin: '0 auto',
    lineHeight: 1.8,
    fontSize: '1.06rem',
    color: '#334155',
    fontWeight: 500,
    '& h1': {
      fontSize: '2.05rem',
      fontWeight: 900,
      marginBottom: 18,
      color: '#0f172a',
      letterSpacing: '-0.025em',
    },
    '& h2': {
      fontSize: '1.65rem',
      fontWeight: 900,
      marginBottom: 14,
      marginTop: 28,
      color: '#1d4ed8',
      letterSpacing: '-0.02em',
    },
    '& h3': {
      fontSize: '1.35rem',
      fontWeight: 850,
      marginBottom: 12,
      marginTop: 22,
      color: '#0f172a',
    },
    '& p': {
      marginBottom: 14,
    },
    '& table': {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
      marginBottom: 22,
      border: '1px solid #dbe4ef',
      borderRadius: 14,
      overflow: 'hidden',
    },
    '& th': {
      backgroundColor: '#0f172a',
      color: '#fff',
      padding: '13px 16px',
      textAlign: 'left',
      fontSize: '0.98rem',
      fontWeight: 850,
    },
    '& td': {
      padding: '13px 16px',
      borderBottom: '1px solid #eef2ff',
      fontSize: '0.98rem',
      fontWeight: 500,
    },
    '& tr:nth-child(even)': {
      backgroundColor: '#f8fafc',
    },
    '& .highlight': {
      backgroundColor: '#fffbeb',
      padding: '3px 8px',
      borderRadius: 7,
      fontWeight: 800,
      color: '#92400e',
    },
    '& .example': {
      color: '#047857',
      fontStyle: 'italic',
      fontWeight: 750,
    },
    '& ul': {
      paddingLeft: 28,
      marginBottom: 16,
    },
    '& li': {
      marginBottom: 8,
    },
    '& .rule-box': {
      border: '1px solid #bfdbfe',
      borderRadius: 14,
      padding: 20,
      marginBottom: 20,
      backgroundColor: '#eff6ff',
    },
    '& .warning-box': {
      border: '1px solid #fde68a',
      borderRadius: 14,
      padding: 20,
      marginBottom: 20,
      backgroundColor: '#fffbeb',
      color: '#92400e',
    },
  },

  materialCard: {
    padding: '16px 18px',
    borderRadius: 14,
    marginBottom: 12,
    border: '1px solid #dbe4ef',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },

  materialTitle: {
    fontWeight: 850,
    color: '#0f172a',
    fontSize: '1.05rem',
  },

  materialText: {
    color: '#64748b',
    fontSize: '0.98rem',
    margin: '4px 0 0',
    fontWeight: 500,
  },

  materialLink: {
    padding: '9px 16px',
    background: '#1d4ed8',
    color: '#fff',
    borderRadius: 10,
    textDecoration: 'none',
    fontSize: '0.96rem',
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },

  flashcardWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
  },

  progressWrap: {
    marginBottom: 18,
    width: '100%',
  },

  progressText: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1rem',
    color: '#334155',
    marginBottom: 10,
    fontWeight: 800,
  },

  progressBar: {
    height: '12px !important',
    borderRadius: '999px !important',
    backgroundColor: '#e2e8f0 !important',
    '& .MuiLinearProgress-bar': {
      borderRadius: 999,
      background: '#1d4ed8',
    },
  },

  flashcard: {
    width: '100%',
    maxWidth: 720,
    minHeight: 320,
    borderRadius: 20,
    boxShadow: '0 16px 38px rgba(15,23,42,.14)',
    background: '#ffffff',
    border: '1px solid #dbe4ef',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 42,
    cursor: 'pointer',
    transition: 'transform .18s ease, box-shadow .18s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 20px 44px rgba(15,23,42,.18)',
    },
  },

  wordText: {
    fontSize: 'clamp(2.8rem, 5.4vw, 4.6rem)',
    fontWeight: 900,
    marginBottom: 12,
    textAlign: 'center',
    color: '#0f172a',
    lineHeight: 1,
    letterSpacing: '-0.04em',
  },

  phoneticText: {
    color: '#1d4ed8',
    fontSize: '1.28rem',
    marginBottom: 18,
    fontWeight: 800,
  },

  meanText: {
    fontSize: '1.35rem',
    color: '#0f172a',
    textAlign: 'center',
    fontWeight: 850,
    lineHeight: 1.45,
  },

  exampleText: {
    fontSize: '1.05rem',
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
    fontWeight: 600,
    lineHeight: 1.55,
  },

  tapHint: {
    color: '#64748b',
    fontSize: '1.05rem',
    marginTop: 10,
    fontWeight: 750,
  },

  actionRow: {
    display: 'flex',
    gap: 14,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  btnKnown: {
    background: '#059669 !important',
    color: '#fff !important',
    fontWeight: '850 !important',
    padding: '12px 30px !important',
    borderRadius: '11px !important',
    minWidth: '160px !important',
    fontSize: '1rem !important',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif !important",
    textTransform: 'none !important',
    boxShadow: '0 8px 18px rgba(5,150,105,.22) !important',
    '&:hover': {
      background: '#047857 !important',
    },
  },

  btnUnknown: {
    background: '#ffffff !important',
    border: '1px solid #ef4444 !important',
    color: '#b91c1c !important',
    fontWeight: '850 !important',
    padding: '12px 30px !important',
    borderRadius: '11px !important',
    minWidth: '160px !important',
    fontSize: '1rem !important',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif !important",
    textTransform: 'none !important',
    '&:hover': {
      background: '#fef2f2 !important',
    },
  },

  quizWrap: {
    maxWidth: 840,
    margin: '0 auto',
  },

  questionNum: {
    color: '#1d4ed8',
    fontSize: '1rem',
    marginBottom: 10,
    fontWeight: 850,
  },

  questionText: {
    fontSize: '1.28rem',
    fontWeight: 850,
    marginBottom: 24,
    lineHeight: 1.55,
    color: '#0f172a',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: 16,
    padding: '20px 22px',
  },

  optionBtn: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '16px 18px',
    marginBottom: 12,
    borderRadius: 14,
    border: '1px solid #dbe4ef',
    cursor: 'pointer',
    fontSize: '1.06rem',
    transition: 'all .16s',
    backgroundColor: '#fff',
    color: '#0f172a',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
    fontWeight: 700,
    '&:hover': {
      borderColor: '#bfdbfe',
      backgroundColor: '#eff6ff',
    },
  },

  optionCorrect: {
    borderColor: '#10b981 !important',
    background: '#ecfdf5 !important',
    color: '#047857 !important',
  },

  optionWrong: {
    borderColor: '#fca5a5 !important',
    background: '#fef2f2 !important',
    color: '#b91c1c !important',
  },

  explanation: {
    marginTop: 16,
    padding: '15px 18px',
    borderRadius: 14,
    backgroundColor: '#fffbeb',
    color: '#92400e',
    border: '1px solid #fde68a',
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: 1.55,
  },

  fillWrap: {
    maxWidth: 840,
    margin: '0 auto',
  },

  sentenceText: {
    fontSize: '1.28rem',
    fontWeight: 850,
    marginBottom: 18,
    lineHeight: 1.65,
    color: '#0f172a',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: 16,
    padding: '20px 22px',
  },

  hintText: {
    color: '#92400e',
    marginBottom: 14,
    fontSize: '1rem',
    background: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: 12,
    padding: '12px 15px',
    fontWeight: 750,
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '15px 17px',
    borderRadius: 13,
    border: '1px solid #cbd5e1',
    fontSize: '1.06rem',
    marginBottom: 14,
    outline: 'none',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
    fontWeight: 700,
    color: '#0f172a',
    '&:focus': {
      borderColor: '#1d4ed8',
      boxShadow: '0 0 0 3px rgba(29,78,216,.12)',
    },
  },

  resultWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px 22px',
    textAlign: 'center',
  },

  resultTitle: {
    fontSize: 'clamp(2.25rem, 4.6vw, 4rem)',
    fontWeight: 900,
    margin: '0 0 12px',
    color: '#0f172a',
    lineHeight: 1.08,
    letterSpacing: '-0.04em',
  },

  resultLessonTitle: {
    color: '#64748b',
    marginBottom: 18,
    fontWeight: 700,
    fontSize: '1.06rem',
  },

  resultScore: {
    fontSize: 'clamp(3.6rem, 6vw, 5.4rem)',
    fontWeight: 900,
    color: '#1d4ed8',
    marginBottom: 10,
    lineHeight: 1,
    letterSpacing: '-0.04em',
  },

  resultMessage: {
    marginBottom: 28,
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#334155',
  },

  statRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 32,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  statBox: {
    padding: '18px 26px',
    borderRadius: 16,
    minWidth: 120,
    border: '1px solid',
    textAlign: 'center',
    background: '#ffffff',
  },

  statNumber: {
    fontSize: '1.8rem',
    fontWeight: 900,
  },

  statLabel: {
    fontSize: '0.95rem',
    fontWeight: 800,
    color: '#64748b',
  },

  lockWrap: {
    textAlign: 'center',
    padding: '64px 24px',
    border: '1px dashed #fde68a',
    borderRadius: 18,
    maxWidth: 620,
    margin: '0 auto',
    background: '#fffbeb',
    color: '#92400e',
  },

  lockTitle: {
    fontSize: '1.55rem',
    fontWeight: 900,
    color: '#92400e',
    margin: '0 0 12px',
  },

  lockText: {
    color: '#92400e',
    fontSize: '1.05rem',
    fontWeight: 650,
    lineHeight: 1.6,
  },

  loading: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f5f7fb',
  },

  notFound: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f5f7fb',
    color: '#334155',
    fontFamily: "'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
    fontSize: '1.15rem',
    fontWeight: 800,
  },
}));

function getYoutubeEmbedUrl(url) {
  if (!url) return '';

  if (url.includes('embed')) return url;

  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([^&\n?#]+)/);

  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : url;
}

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
          <p>Xem xong video bài giảng, nhấn nút bên dưới để mở phần bài tập.</p>

          <Button
            variant="contained"
            className={classes.mainBtn}
            style={{ marginTop: 8 }}
            onClick={handleWatched}
          >
            Tôi đã xem xong video
          </Button>
        </div>
      )}

      {watched && (
        <p className={classes.watchedNote}>
          Đã xác nhận xem video. Bạn có thể chuyển sang phần bài tập.
        </p>
      )}
    </div>
  );
}

function TheorySection({ content, materials }) {
  const classes = useStyle();

  return (
    <div>
      {content && (
        <div className={classes.theoryWrap} dangerouslySetInnerHTML={{ __html: content }} />
      )}

      {materials?.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3
            style={{
              fontWeight: 900,
              marginBottom: 16,
              color: '#0f172a',
              fontSize: '1.35rem',
            }}
          >
            Tài liệu đính kèm
          </h3>

          {materials.map((m, i) => (
            <div key={i} className={classes.materialCard}>
              <MenuBookIcon style={{ fontSize: 30, color: '#1d4ed8' }} />

              <div style={{ flex: 1 }}>
                <div className={classes.materialTitle}>{m.title}</div>
                {m.content && <p className={classes.materialText}>{m.content}</p>}
              </div>

              {m.fileUrl && (
                <a
                  href={m.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={classes.materialLink}
                >
                  Xem / Tải
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
      onComplete({
        knownWords: newKnown,
        unknownWords: newUnknown,
        correctCount: newKnown.length,
        totalCount: words.length,
      });
    } else {
      if (isKnown) setKnown(newKnown);
      else setUnknown(newUnknown);

      setCurrent(current + 1);
    }
  };

  return (
    <div className={classes.flashcardWrap}>
      <div className={classes.progressWrap} style={{ maxWidth: 720 }}>
        <div className={classes.progressText}>
          <span>Từ {current + 1} / {words.length}</span>
          <span>{percent}%</span>
        </div>

        <LinearProgress className={classes.progressBar} variant="determinate" value={percent} />
      </div>

      <div className={classes.flashcard} onClick={() => setShowMean(!showMean)}>
        {word.picture && (
          <img
            src={word.picture}
            alt={word.word}
            style={{
              width: 150,
              height: 124,
              objectFit: 'cover',
              borderRadius: 14,
              marginBottom: 14,
              boxShadow: '0 8px 22px rgba(15,23,42,0.14)',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}

        <div className={classes.wordText}>{word.word}</div>

        {word.phonetic && <div className={classes.phoneticText}>/{word.phonetic}/</div>}

        {showMean ? (
          <>
            <div className={classes.meanText}>{word.mean}</div>
            {word.example && <div className={classes.exampleText}>"{word.example}"</div>}
          </>
        ) : (
          <div className={classes.tapHint}>Nhấn vào thẻ để xem nghĩa</div>
        )}
      </div>

      <div className={classes.actionRow}>
        <Button
          variant="outlined"
          className={classes.btnUnknown}
          startIcon={<CloseIcon />}
          onClick={() => handleAnswer(false)}
        >
          Chưa biết
        </Button>

        <Button
          variant="contained"
          className={classes.btnKnown}
          startIcon={<CheckIcon />}
          onClick={() => handleAnswer(true)}
        >
          Đã biết
        </Button>
      </div>
    </div>
  );
}

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

    if (isCorrect) setCorrect((c) => c + 1);

    setShowExplain(true);

    setTimeout(() => {
      setSelected(null);
      setShowExplain(false);

      if (current + 1 >= questions.length) {
        onComplete({
          correctCount: correct + (isCorrect ? 1 : 0),
          totalCount: questions.length,
        });
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
          <span>{correct} câu đúng</span>
        </div>

        <LinearProgress className={classes.progressBar} variant="determinate" value={percent} />
      </div>

      <p className={classes.questionNum}>Câu {current + 1}</p>

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
          <strong>Giải thích:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
}

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

    if (isCorrect) setCorrect((c) => c + 1);

    setTimeout(() => {
      setFeedback(null);
      setAnswer('');

      if (current + 1 >= fillBlanks.length) {
        onComplete({
          correctCount: correct + (isCorrect ? 1 : 0),
          totalCount: fillBlanks.length,
        });
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
          <span>{correct} câu đúng</span>
        </div>

        <LinearProgress
          className={classes.progressBar}
          variant="determinate"
          value={Math.round((current / fillBlanks.length) * 100)}
        />
      </div>

      <div className={classes.sentenceText}>
        {item.sentence.replace('___', '________')}
      </div>

      {item.hint && <p className={classes.hintText}>Gợi ý: {item.hint}</p>}

      <input
        className={classes.input}
        style={{
          borderColor:
            feedback === 'correct'
              ? '#10b981'
              : feedback === 'wrong'
              ? '#fca5a5'
              : undefined,
        }}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Nhập câu trả lời..."
        disabled={feedback !== null}
        autoFocus
      />

      {feedback === 'wrong' && (
        <p
          style={{
            color: '#b91c1c',
            marginBottom: 14,
            fontSize: '1rem',
            fontWeight: 750,
          }}
        >
          Đáp án đúng: <strong>{item.correctAnswer}</strong>
        </p>
      )}

      {feedback === 'correct' && (
        <p
          style={{
            color: '#047857',
            marginBottom: 14,
            fontSize: '1rem',
            fontWeight: 750,
          }}
        >
          Chính xác.
        </p>
      )}

      <Button
        variant="contained"
        className={classes.mainBtn}
        onClick={handleSubmit}
        disabled={!answer.trim() || feedback !== null}
      >
        Kiểm tra
      </Button>
    </div>
  );
}

function LessonResult({ result, lessonTitle, onNext, onReplay, nextLessonLocked }) {
  const classes = useStyle();

  const total = result.totalCount || (result.knownWords?.length + result.unknownWords?.length) || 0;
  const correct = result.correctCount || result.knownWords?.length || 0;
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  const getMessage = () => {
    if (percent === 100) return 'Bạn đã hoàn thành xuất sắc bài học.';
    if (percent >= 80) return 'Kết quả rất tốt. Hãy tiếp tục bài học tiếp theo.';
    if (percent >= 60) return 'Kết quả ổn. Bạn nên ôn lại các phần chưa chắc.';
    return 'Bạn cần ôn lại nội dung bài học và làm lại để cải thiện kết quả.';
  };

  return (
    <div className={classes.resultWrap}>
      <h1 className={classes.resultTitle}>Hoàn thành bài học</h1>

      <p className={classes.resultLessonTitle}>{lessonTitle}</p>

      <div className={classes.resultScore}>{percent}%</div>

      <p className={classes.resultMessage}>{getMessage()}</p>

      <div className={classes.statRow}>
        <div
          className={classes.statBox}
          style={{ borderColor: '#a7f3d0', backgroundColor: '#ecfdf5' }}
        >
          <div className={classes.statNumber} style={{ color: '#047857' }}>{correct}</div>
          <div className={classes.statLabel}>Đúng</div>
        </div>

        <div
          className={classes.statBox}
          style={{ borderColor: '#fecaca', backgroundColor: '#fef2f2' }}
        >
          <div className={classes.statNumber} style={{ color: '#b91c1c' }}>{total - correct}</div>
          <div className={classes.statLabel}>Sai</div>
        </div>

        <div
          className={classes.statBox}
          style={{ borderColor: '#bfdbfe', backgroundColor: '#eff6ff' }}
        >
          <div className={classes.statNumber} style={{ color: '#1d4ed8' }}>{total}</div>
          <div className={classes.statLabel}>Tổng</div>
        </div>
      </div>

      <div className={classes.actionRow}>
        <Button
          variant="outlined"
          className={classes.secondaryBtn}
          onClick={onReplay}
          startIcon={<ReplayIcon />}
        >
          Làm lại
        </Button>

        {nextLessonLocked ? (
          <Button
            variant="contained"
            className={classes.mainBtn}
            startIcon={<LockIcon />}
            onClick={onNext}
          >
            Đăng ký khóa học để học tiếp
          </Button>
        ) : (
          <Button
            variant="contained"
            className={classes.mainBtn}
            startIcon={<NavigateNextIcon />}
            onClick={onNext}
          >
            Bài tiếp theo
          </Button>
        )}
      </div>
    </div>
  );
}

function CourseLearn() {
  const classes = useStyle();
  const { id: courseId, lessonId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [videoWatched, setVideoWatched] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [result, setResult] = useState(null);
  const [key, setKey] = useState(0);
  const [nextLessonInfo, setNextLessonInfo] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setIsDone(false);
      setResult(null);
      setTab(0);
      setVideoWatched(false);

      try {
        const res = await courseApi.getLessonDetail(lessonId);

        if (mounted && res.status === 200) {
          setLesson(res.data.lesson);
          setNextLessonInfo(res.data.nextLesson || null);
        }
      } catch (e) {
        dispatch(setMessage({ type: 'error', message: 'Không tải được bài học.' }));
      }

      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [lessonId, dispatch]);

  const handleComplete = async (resultData) => {
    setResult(resultData);
    setIsDone(true);

    try {
      await courseApi.updateLessonProgress(courseId, lessonId, {
        status: 'completed',
        correctCount: resultData.correctCount || resultData.knownWords?.length || 0,
        totalCount:
          resultData.totalCount ||
          (resultData.knownWords?.length + resultData.unknownWords?.length) ||
          0,
        knownWords: resultData.knownWords || [],
        unknownWords: resultData.unknownWords || [],
      });
    } catch (e) {}
  };

  const handleReplay = () => {
    setIsDone(false);
    setResult(null);
    setKey((k) => k + 1);
    setTab(0);
    setVideoWatched(false);
  };

  const handleNext = () => {
    if (nextLessonInfo && !nextLessonInfo.locked) {
      history.push(`/courses/${courseId}/learn/${nextLessonInfo._id}`);
    } else {
      history.push(`/courses/${courseId}/detail`);
    }
  };

  const getTabs = () => {
    const tabs = [];

    if (lesson?.videoUrl) tabs.push({ label: 'Video', icon: <PlayCircleIcon /> });

    if (lesson?.content || lesson?.materials?.length > 0) {
      tabs.push({ label: 'Lý thuyết', icon: <MenuBookIcon /> });
    }

    if (lesson?.hasExercise !== false) {
      tabs.push({ label: 'Bài tập', icon: <AssignmentIcon /> });
    }

    return tabs;
  };

  const canDoExercise = () => {
    if (!lesson?.videoUrl) return true;
    return videoWatched;
  };

  if (loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress style={{ color: '#1d4ed8' }} size={54} thickness={4.5} />
      </div>
    );
  }

  if (!lesson) {
    return <div className={classes.notFound}>Không tìm thấy bài học.</div>;
  }

  const tabs = getTabs();

  return (
    <div className={classes.page}>
      <div className={classes.wrapper}>
        <div className={classes.headerCard}>
          <div className={classes.header}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => history.push(`/courses/${courseId}/detail`)}
              className={classes.backBtn}
            >
              Quay lại
            </Button>

            <h1 className={classes.lessonTitle}>{lesson.title}</h1>
          </div>
        </div>

        <div className={classes.contentCard}>
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
              {tabs.length > 1 && (
                <div className={classes.tabsWrap}>
                  <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    className={classes.tabs}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {tabs.map((t, i) => (
                      <Tab
                        key={i}
                        label={t.label}
                        icon={t.icon}
                        disabled={i === tabs.length - 1 && !canDoExercise()}
                      />
                    ))}
                  </Tabs>

                  {!canDoExercise() && (
                    <p className={classes.lockNote}>
                      Cần xem xong video trước khi làm bài tập.
                    </p>
                  )}
                </div>
              )}

              <div key={key}>
                {tabs[tab]?.label?.includes('Video') && lesson.videoUrl && (
                  <VideoSection
                    videoUrl={lesson.videoUrl}
                    onWatched={() => setVideoWatched(true)}
                  />
                )}

                {tabs[tab]?.label?.includes('Lý thuyết') && (
                  <TheorySection content={lesson.content} materials={lesson.materials} />
                )}

                {tabs[tab]?.label?.includes('Bài tập') && (
                  <>
                    {!canDoExercise() ? (
                      <div className={classes.lockWrap}>
                        <LockIcon style={{ fontSize: 58, color: '#d97706', marginBottom: 14 }} />

                        <h3 className={classes.lockTitle}>Chưa mở bài tập</h3>

                        <p className={classes.lockText}>
                          Bạn cần xem xong video bài giảng trước khi bắt đầu làm bài tập.
                        </p>

                        <Button
                          variant="contained"
                          className={classes.mainBtn}
                          style={{ marginTop: 18 }}
                          onClick={() => setTab(0)}
                        >
                          Xem video
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
                          <FillBlankMode
                            fillBlanks={lesson.fillBlanks}
                            onComplete={handleComplete}
                          />
                        )}

                        {lesson.type === 'mixed' && (
                          <>
                            {lesson.words?.length > 0 && (
                              <FlashcardMode words={lesson.words} onComplete={handleComplete} />
                            )}

                            {lesson.questions?.length > 0 && (
                              <QuizMode questions={lesson.questions} onComplete={handleComplete} />
                            )}
                          </>
                        )}

                        {lesson.type === 'video' && (
                          <div style={{ textAlign: 'center', padding: 48 }}>
                            <p
                              style={{
                                color: '#047857',
                                fontSize: '1.15rem',
                                fontWeight: 800,
                                marginBottom: 18,
                              }}
                            >
                              Bài học này chỉ có video. Nhấn hoàn thành để lưu tiến độ.
                            </p>

                            <Button
                              variant="contained"
                              className={classes.mainBtn}
                              onClick={() => handleComplete({ correctCount: 1, totalCount: 1 })}
                            >
                              Đánh dấu hoàn thành
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {tabs.length === 1 && tabs[0]?.label?.includes('Bài tập') && (
                  <>
                    {lesson.type === 'flashcard' && lesson.words?.length > 0 && (
                      <FlashcardMode words={lesson.words} onComplete={handleComplete} />
                    )}

                    {lesson.type === 'quiz' && lesson.questions?.length > 0 && (
                      <QuizMode questions={lesson.questions} onComplete={handleComplete} />
                    )}

                    {lesson.type === 'fill_blank' && lesson.fillBlanks?.length > 0 && (
                      <FillBlankMode
                        fillBlanks={lesson.fillBlanks}
                        onComplete={handleComplete}
                      />
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseLearn;