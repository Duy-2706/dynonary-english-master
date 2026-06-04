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
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import courseApi from 'apis/courseApi';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';

const useStyle = makeStyles(() => ({
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 12% 18%, rgba(25,199,168,.22) 0 4px, transparent 5px),
      radial-gradient(circle at 86% 24%, rgba(255,191,31,.16) 0 5px, transparent 6px),
      radial-gradient(circle at 34% 74%, rgba(255,255,255,.10) 0 3px, transparent 4px),
      linear-gradient(180deg, #063c46 0%, #042b33 100%)
    `,
    backgroundSize: '90px 90px, 130px 130px, 110px 110px, auto',
    padding: '38px 0 90px',
    fontFamily: GAME_FONT,
  },

  wrapper: {
    maxWidth: 1180,
    margin: '0 auto',
    padding: '0 34px',
  },

  headerCard: {
    background: 'linear-gradient(180deg,#ffffff 0%,#eefdf9 100%)',
    borderRadius: 38,
    border: '7px solid rgba(255,255,255,.96)',
    boxShadow: '0 12px 0 rgba(7,148,127,.55), 0 24px 48px rgba(0,0,0,.22)',
    padding: '32px 38px',
    marginBottom: 30,
    position: 'relative',
    overflow: 'hidden',
  },

  headerDecor: {
    position: 'absolute',
    right: 38,
    top: 20,
    fontSize: '5.4rem',
    opacity: 0.13,
    transform: 'rotate(-10deg)',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 2,
  },

  backBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '4px solid #19c7a8 !important',
    borderRadius: '999px !important',
    padding: '11px 22px !important',
    fontSize: '1.08rem !important',
    fontWeight: '900 !important',
    fontFamily: `${GAME_FONT} !important`,
    textTransform: 'none !important',
    boxShadow: '0 6px 0 rgba(7,148,127,.20) !important',
  },

  lessonTitle: {
    fontWeight: 900,
    fontSize: 'clamp(2.4rem, 4.4vw, 4.5rem)',
    flex: 1,
    color: '#06434b',
    margin: 0,
    lineHeight: 0.95,
    textShadow: '0 4px 0 rgba(25,199,168,.18)',
  },

  contentCard: {
    background: '#fff',
    borderRadius: 36,
    border: '7px solid rgba(255,255,255,.95)',
    padding: 34,
    boxShadow: '0 12px 0 rgba(7,148,127,.38), 0 24px 48px rgba(0,0,0,.20)',
  },

  tabsWrap: {
    marginBottom: 30,
  },

  tabs: {
    background: '#fff',
    borderRadius: 999,
    border: '4px solid #d6f3ed',
    padding: 5,
    boxShadow: '0 6px 0 rgba(7,148,127,.12)',
    '& .MuiTab-root': {
      fontFamily: GAME_FONT,
      fontSize: '1.12rem',
      fontWeight: 900,
      textTransform: 'none',
      borderRadius: 999,
      minHeight: 52,
      color: '#07545c',
    },
    '& .Mui-selected': {
      color: '#fff !important',
      background: 'linear-gradient(180deg,#19c7a8,#07947f)',
      boxShadow: '0 5px 0 rgba(0,0,0,.12)',
    },
    '& .MuiTabs-indicator': {
      display: 'none',
    },
  },

  lockNote: {
    color: '#9b5c00',
    fontSize: '1.08rem',
    fontWeight: 900,
    padding: '12px 16px',
    marginTop: 12,
    background: '#fff8e1',
    border: '3px solid #ffcf45',
    borderRadius: 18,
  },

  videoWrap: {
    position: 'relative',
    width: '100%',
    maxWidth: 900,
    margin: '0 auto 26px',
    borderRadius: 30,
    overflow: 'hidden',
    boxShadow: '0 10px 0 rgba(7,148,127,.32), 0 22px 42px rgba(0,0,0,.22)',
    backgroundColor: '#000',
    paddingTop: '56.25%',
    border: '6px solid #19c7a8',
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
    color: '#06434b',
    fontSize: '1.18rem',
    marginBottom: 22,
    fontWeight: 900,
    lineHeight: 1.5,
  },

  watchedNote: {
    textAlign: 'center',
    color: '#057a55',
    fontWeight: 900,
    fontSize: '1.18rem',
    background: '#d4f5eb',
    border: '4px solid #a8e8db',
    padding: '14px 18px',
    borderRadius: 22,
    maxWidth: 720,
    margin: '0 auto',
  },

  mainBtn: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00) !important',
    color: '#fff !important',
    border: '4px solid #fff !important',
    borderRadius: '999px !important',
    padding: '13px 28px !important',
    fontSize: '1.12rem !important',
    fontWeight: '900 !important',
    fontFamily: `${GAME_FONT} !important`,
    textTransform: 'none !important',
    boxShadow: '0 7px 0 #bd5f00 !important',
    textShadow: '0 2px 0 rgba(0,0,0,.18)',
  },

  secondaryBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '4px solid #19c7a8 !important',
    borderRadius: '999px !important',
    padding: '13px 26px !important',
    fontSize: '1.12rem !important',
    fontWeight: '900 !important',
    fontFamily: `${GAME_FONT} !important`,
    textTransform: 'none !important',
    boxShadow: '0 7px 0 rgba(7,148,127,.20) !important',
  },

  theoryWrap: {
    maxWidth: 900,
    margin: '0 auto',
    lineHeight: 1.85,
    fontSize: '1.22rem',
    color: '#06434b',
    fontWeight: 800,
    '& h1': {
      fontSize: '2.4rem',
      fontWeight: 900,
      marginBottom: 18,
      color: '#06434b',
    },
    '& h2': {
      fontSize: '2rem',
      fontWeight: 900,
      marginBottom: 14,
      marginTop: 28,
      color: '#07947f',
    },
    '& h3': {
      fontSize: '1.65rem',
      fontWeight: 900,
      marginBottom: 12,
      marginTop: 22,
      color: '#06434b',
    },
    '& p': {
      marginBottom: 14,
    },
    '& table': {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
      marginBottom: 22,
      border: '4px solid #d6f3ed',
      borderRadius: 22,
      overflow: 'hidden',
    },
    '& th': {
      backgroundColor: '#07947f',
      color: '#fff',
      padding: '14px 18px',
      textAlign: 'left',
      fontSize: '1.12rem',
      fontWeight: 900,
    },
    '& td': {
      padding: '13px 18px',
      borderBottom: '2px solid #eef7f5',
      fontSize: '1.08rem',
      fontWeight: 800,
    },
    '& tr:nth-child(even)': {
      backgroundColor: '#f3fffc',
    },
    '& .highlight': {
      backgroundColor: '#fff3cd',
      padding: '4px 9px',
      borderRadius: 9,
      fontWeight: 900,
      color: '#9b5c00',
    },
    '& .example': {
      color: '#07947f',
      fontStyle: 'italic',
      fontWeight: 900,
    },
    '& ul': {
      paddingLeft: 28,
      marginBottom: 16,
    },
    '& li': {
      marginBottom: 9,
    },
    '& .rule-box': {
      border: '4px solid #19c7a8',
      borderRadius: 24,
      padding: 22,
      marginBottom: 22,
      backgroundColor: '#eefdf9',
      boxShadow: '0 6px 0 rgba(7,148,127,.14)',
    },
    '& .warning-box': {
      border: '4px solid #ffcf45',
      borderRadius: 24,
      padding: 22,
      marginBottom: 22,
      backgroundColor: '#fff8e1',
      color: '#7a5200',
      boxShadow: '0 6px 0 rgba(184,120,0,.14)',
    },
  },

  materialCard: {
    padding: '18px 20px',
    borderRadius: 24,
    marginBottom: 12,
    border: '4px solid #d6f3ed',
    backgroundColor: '#f7fffd',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    boxShadow: '0 6px 0 rgba(7,148,127,.10)',
  },

  materialTitle: {
    fontWeight: 900,
    color: '#06434b',
    fontSize: '1.18rem',
  },

  materialText: {
    color: '#07545c',
    fontSize: '1.02rem',
    margin: '4px 0 0',
    fontWeight: 800,
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
    fontSize: '1.08rem',
    color: '#06434b',
    marginBottom: 10,
    fontWeight: 900,
  },

  progressBar: {
    height: '14px !important',
    borderRadius: '999px !important',
    backgroundColor: '#dff7f2 !important',
    border: '2px solid #bdeee5',
    '& .MuiLinearProgress-bar': {
      borderRadius: 999,
      background: 'linear-gradient(90deg,#19c7a8,#ffdf3b)',
    },
  },

  flashcard: {
    width: '100%',
    maxWidth: 720,
    minHeight: 330,
    borderRadius: 34,
    boxShadow: '0 10px 0 rgba(7,148,127,.32), 0 22px 42px rgba(0,0,0,.18)',
    background: 'linear-gradient(180deg,#ffffff,#eefdf9)',
    border: '6px solid #19c7a8',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    cursor: 'pointer',
    transition: 'transform .22s cubic-bezier(.34,1.56,.64,1)',
    '&:hover': {
      transform: 'translateY(-6px) scale(1.018)',
    },
  },

  wordText: {
    fontSize: 'clamp(3rem, 6vw, 5rem)',
    fontWeight: 900,
    marginBottom: 10,
    textAlign: 'center',
    color: '#06434b',
    lineHeight: .95,
    textShadow: '0 4px 0 rgba(25,199,168,.18)',
  },

  phoneticText: {
    color: '#07947f',
    fontSize: '1.45rem',
    marginBottom: 18,
    fontWeight: 900,
  },

  meanText: {
    fontSize: '1.55rem',
    color: '#06434b',
    textAlign: 'center',
    fontWeight: 900,
    lineHeight: 1.45,
  },

  exampleText: {
    fontSize: '1.15rem',
    color: '#07545c',
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
    fontWeight: 800,
  },

  tapHint: {
    color: '#07545c',
    fontSize: '1.18rem',
    marginTop: 10,
    fontWeight: 900,
    opacity: .75,
  },

  actionRow: {
    display: 'flex',
    gap: 18,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  btnKnown: {
    background: 'linear-gradient(180deg,#36e27d,#0ca84f) !important',
    color: '#fff !important',
    fontWeight: '900 !important',
    padding: '14px 38px !important',
    borderRadius: '999px !important',
    minWidth: '170px !important',
    border: '4px solid #fff !important',
    fontSize: '1.12rem !important',
    fontFamily: `${GAME_FONT} !important`,
    textTransform: 'none !important',
    boxShadow: '0 7px 0 #087a3c !important',
  },

  btnUnknown: {
    background: 'linear-gradient(180deg,#ffffff,#ffe2f1) !important',
    border: '4px solid #ff1493 !important',
    color: '#9b0054 !important',
    fontWeight: '900 !important',
    padding: '14px 38px !important',
    borderRadius: '999px !important',
    minWidth: '170px !important',
    fontSize: '1.12rem !important',
    fontFamily: `${GAME_FONT} !important`,
    textTransform: 'none !important',
    boxShadow: '0 7px 0 rgba(155,0,84,.18) !important',
  },

  quizWrap: {
    maxWidth: 840,
    margin: '0 auto',
  },

  questionNum: {
    color: '#07947f',
    fontSize: '1.12rem',
    marginBottom: 10,
    fontWeight: 900,
  },

  questionText: {
    fontSize: '1.55rem',
    fontWeight: 900,
    marginBottom: 24,
    lineHeight: 1.5,
    color: '#06434b',
    background: '#eefdf9',
    border: '4px solid #d6f3ed',
    borderRadius: 26,
    padding: '22px 24px',
    boxShadow: '0 6px 0 rgba(7,148,127,.12)',
  },

  optionBtn: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '18px 22px',
    marginBottom: 14,
    borderRadius: 24,
    border: '4px solid #d6f3ed',
    cursor: 'pointer',
    fontSize: '1.18rem',
    transition: 'all .2s',
    backgroundColor: '#fff',
    color: '#06434b',
    fontFamily: GAME_FONT,
    fontWeight: 900,
    boxShadow: '0 6px 0 rgba(7,148,127,.10)',
    '&:hover': {
      borderColor: '#19c7a8',
      backgroundColor: '#f3fffc',
      transform: 'translateY(-2px)',
    },
  },

  optionCorrect: {
    borderColor: '#36e27d !important',
    background: '#d4f5eb !important',
    color: '#057a55 !important',
  },

  optionWrong: {
    borderColor: '#ff8a8a !important',
    background: '#fde8e4 !important',
    color: '#dc2626 !important',
  },

  explanation: {
    marginTop: 16,
    padding: '16px 20px',
    borderRadius: 22,
    backgroundColor: '#fff8e1',
    color: '#7a5200',
    border: '4px solid #ffcf45',
    fontSize: '1.12rem',
    fontWeight: 900,
    lineHeight: 1.5,
    boxShadow: '0 6px 0 rgba(184,120,0,.14)',
  },

  fillWrap: {
    maxWidth: 840,
    margin: '0 auto',
  },

  sentenceText: {
    fontSize: '1.55rem',
    fontWeight: 900,
    marginBottom: 18,
    lineHeight: 1.7,
    color: '#06434b',
    background: '#eefdf9',
    border: '4px solid #d6f3ed',
    borderRadius: 26,
    padding: '22px 24px',
    boxShadow: '0 6px 0 rgba(7,148,127,.12)',
  },

  hintText: {
    color: '#9b5c00',
    marginBottom: 14,
    fontSize: '1.12rem',
    background: '#fff8e1',
    border: '3px solid #ffcf45',
    borderRadius: 18,
    padding: '12px 16px',
    fontWeight: 900,
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '17px 20px',
    borderRadius: 22,
    border: '4px solid #d6f3ed',
    fontSize: '1.18rem',
    marginBottom: 14,
    outline: 'none',
    fontFamily: GAME_FONT,
    fontWeight: 900,
    color: '#06434b',
    boxShadow: '0 5px 0 rgba(7,148,127,.10)',
    '&:focus': {
      borderColor: '#19c7a8',
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
    fontSize: 'clamp(2.6rem, 5vw, 4.4rem)',
    fontWeight: 900,
    margin: '0 0 10px',
    color: '#06434b',
    lineHeight: 0.95,
    textShadow: '0 4px 0 rgba(25,199,168,.18)',
  },

  resultLessonTitle: {
    color: '#07545c',
    marginBottom: 18,
    fontWeight: 900,
    fontSize: '1.18rem',
  },

  resultScore: {
    fontSize: 'clamp(4rem, 7vw, 6rem)',
    fontWeight: 900,
    color: '#ff8a00',
    marginBottom: 8,
    lineHeight: 1,
    textShadow: '0 4px 0 rgba(184,79,0,.16)',
  },

  resultMessage: {
    marginBottom: 28,
    fontSize: '1.3rem',
    fontWeight: 900,
    color: '#06434b',
  },

  statRow: {
    display: 'flex',
    gap: 18,
    marginBottom: 34,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  statBox: {
    padding: '20px 28px',
    borderRadius: 24,
    minWidth: 120,
    border: '4px solid',
    textAlign: 'center',
    boxShadow: '0 6px 0 rgba(0,0,0,.10)',
  },

  statNumber: {
    fontSize: '2rem',
    fontWeight: 900,
  },

  statLabel: {
    fontSize: '1rem',
    fontWeight: 900,
    color: '#07545c',
  },

  lockWrap: {
    textAlign: 'center',
    padding: '70px 24px',
    border: '5px dashed #ffcf45',
    borderRadius: 30,
    maxWidth: 620,
    margin: '0 auto',
    background: '#fff8e1',
    color: '#7a5200',
    boxShadow: '0 8px 0 rgba(184,120,0,.16)',
  },

  lockTitle: {
    fontSize: '1.8rem',
    fontWeight: 900,
    color: '#7a5200',
    margin: '0 0 12px',
  },

  lockText: {
    color: '#7a5200',
    fontSize: '1.15rem',
    fontWeight: 900,
    lineHeight: 1.5,
  },

  loading: {
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#042b33',
  },

  notFound: {
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#042b33',
    color: '#fff',
    fontFamily: GAME_FONT,
    fontSize: '1.4rem',
    fontWeight: 900,
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
          <p>📺 Xem video bài giảng xong rồi nhấn nút bên dưới để mở bài tập.</p>

          <Button
            variant="contained"
            className={classes.mainBtn}
            style={{ marginTop: 8 }}
            onClick={handleWatched}
          >
            ✅ Tôi đã xem xong video
          </Button>
        </div>
      )}

      {watched && (
        <p className={classes.watchedNote}>
          ✅ Đã xem video — Hãy chuyển sang tab Bài tập để luyện tập!
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
              color: '#06434b',
              fontSize: '1.7rem',
            }}
          >
            📎 Tài liệu đính kèm
          </h3>

          {materials.map((m, i) => (
            <div key={i} className={classes.materialCard}>
              <span style={{ fontSize: 34 }}>📄</span>

              <div style={{ flex: 1 }}>
                <div className={classes.materialTitle}>{m.title}</div>
                {m.content && <p className={classes.materialText}>{m.content}</p>}
              </div>

              {m.fileUrl && (
                <a
                  href={m.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '10px 18px',
                    background: 'linear-gradient(180deg,#19c7a8,#07947f)',
                    color: '#fff',
                    borderRadius: 999,
                    textDecoration: 'none',
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    border: '3px solid #fff',
                    boxShadow: '0 5px 0 #087565',
                  }}
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
            style={{ width: 140, height: 120, objectFit: 'cover', borderRadius: 12, marginBottom: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
            onError={(e) => { e.target.style.display = 'none'; }}
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
          <div className={classes.tapHint}>👆 Nhấn để xem nghĩa</div>
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
          <span>✅ {correct} đúng</span>
        </div>

        <LinearProgress className={classes.progressBar} variant="determinate" value={percent} />
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
          <span>✅ {correct} đúng</span>
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

      {item.hint && <p className={classes.hintText}>💡 Gợi ý: {item.hint}</p>}

      <input
        className={classes.input}
        style={{
          borderColor:
            feedback === 'correct'
              ? '#36e27d'
              : feedback === 'wrong'
              ? '#ff8a8a'
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
            color: '#dc2626',
            marginBottom: 14,
            fontSize: '1.12rem',
            fontWeight: 900,
          }}
        >
          ❌ Đáp án đúng: <strong>{item.correctAnswer}</strong>
        </p>
      )}

      {feedback === 'correct' && (
        <p
          style={{
            color: '#057a55',
            marginBottom: 14,
            fontSize: '1.12rem',
            fontWeight: 900,
          }}
        >
          ✅ Chính xác!
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
    if (percent === 100) return '🏆 Xuất sắc! Bạn làm đúng tất cả!';
    if (percent >= 80) return '🎉 Rất tốt! Tiếp tục phát huy!';
    if (percent >= 60) return '💪 Khá ổn! Hãy ôn lại phần chưa nắm!';
    return '📚 Cần cố gắng thêm! Làm lại nhé!';
  };

  return (
    <div className={classes.resultWrap}>
      <h1 className={classes.resultTitle}>Hoàn Thành Bài Học!</h1>

      <p className={classes.resultLessonTitle}>{lessonTitle}</p>

      <div className={classes.resultScore}>{percent}%</div>

      <p className={classes.resultMessage}>{getMessage()}</p>

      <div className={classes.statRow}>
        <div
          className={classes.statBox}
          style={{ borderColor: '#36e27d', backgroundColor: '#d4f5eb' }}
        >
          <div className={classes.statNumber} style={{ color: '#057a55' }}>{correct}</div>
          <div className={classes.statLabel}>✅ Đúng</div>
        </div>

        <div
          className={classes.statBox}
          style={{ borderColor: '#ff8a8a', backgroundColor: '#fde8e4' }}
        >
          <div className={classes.statNumber} style={{ color: '#dc2626' }}>{total - correct}</div>
          <div className={classes.statLabel}>❌ Sai</div>
        </div>

        <div
          className={classes.statBox}
          style={{ borderColor: '#19c7a8', backgroundColor: '#eefdf9' }}
        >
          <div className={classes.statNumber} style={{ color: '#07947f' }}>{total}</div>
          <div className={classes.statLabel}>📝 Tổng</div>
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
            Mua khóa để học tiếp
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
  const { isAuth } = useSelector((s) => s.userInfo);

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

  const getTabs = () => {
    const tabs = [];

    if (lesson?.videoUrl) tabs.push({ label: '📺 Video', icon: <PlayCircleIcon /> });
    if (lesson?.content || lesson?.materials?.length > 0) {
      tabs.push({ label: '📖 Lý thuyết', icon: <MenuBookIcon /> });
    }
    if (lesson?.hasExercise !== false) {
      tabs.push({ label: '✏️ Bài tập', icon: <AssignmentIcon /> });
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
        <CircularProgress style={{ color: '#fff' }} size={58} thickness={5} />
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
          <div className={classes.headerDecor}>📖</div>

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
                        disabled={i === tabs.length - 1 && !canDoExercise()}
                      />
                    ))}
                  </Tabs>

                  {!canDoExercise() && (
                    <p className={classes.lockNote}>
                      🔒 Xem xong video mới có thể làm bài tập.
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
                        <LockIcon style={{ fontSize: 64, color: '#ff9800', marginBottom: 14 }} />

                        <h3 className={classes.lockTitle}>Hãy xem video trước!</h3>

                        <p className={classes.lockText}>
                          Bạn cần xem hết video bài giảng rồi mới làm bài tập được nhé.
                        </p>

                        <Button
                          variant="contained"
                          className={classes.mainBtn}
                          style={{ marginTop: 18 }}
                          onClick={() => setTab(0)}
                        >
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
                                color: '#057a55',
                                fontSize: '1.28rem',
                                fontWeight: 900,
                                marginBottom: 18,
                              }}
                            >
                              ✅ Bài này chỉ có video. Nhấn hoàn thành để lưu tiến độ!
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