import gameApi from 'apis/gameApi';
import GameSetup from 'components/PlayGames/GameSetup';
import { playComplete, playCorrect, playWrong } from 'helper/gameSound';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';
const N = 20;
const TIMER = 30;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildChips(word) {
  return shuffle(
    String(word || '')
      .replace(/\s/g, '')
      .split('')
      .map((l, i) => ({ letter: l, id: `${i}-${l}-${Math.random()}` }))
  );
}

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 18% 20%, rgba(255,255,255,.24), transparent 16%),
      radial-gradient(circle at 80% 14%, rgba(255,223,90,.26), transparent 18%),
      linear-gradient(135deg,#ff5c00 0%,#ff8a00 48%,#ffb100 100%)
    `,
    padding: '24px 16px 42px',
    boxSizing: 'border-box',
    fontFamily: GAME_FONT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  shell: {
    width: '100%',
    maxWidth: 880,
  },

  topBar: {
    marginBottom: 12,
  },

  backBtn: {
    background: 'linear-gradient(180deg,#ffffff,#ffe9ba)',
    color: '#9b3200',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 rgba(111,39,0,.22)',
  },

  card: {
    background: '#fff',
    borderRadius: 38,
    padding: '34px',
    width: '100%',
    border: '6px solid #ff7a00',
    boxShadow: '0 10px 0 #b84f00, 0 24px 48px rgba(0,0,0,.28)',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },

  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
    marginBottom: 20,
    position: 'relative',
    zIndex: 2,
  },

  title: {
    color: '#ff7a00',
    fontSize: 'clamp(2rem,4vw,3.4rem)',
    fontWeight: 900,
    margin: 0,
    lineHeight: .95,
    textShadow: '0 3px 0 rgba(184,79,0,.18)',
  },

  statGroup: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },

  stat: (bg = 'linear-gradient(180deg,#ffdf3b,#ff8a00)') => ({
    background: bg,
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 999,
    border: '3px solid #fff',
    fontSize: '1rem',
    fontWeight: 900,
    boxShadow: '0 5px 0 rgba(111,39,0,.25)',
  }),

  progressOuter: {
    height: 18,
    background: '#ffe2bd',
    borderRadius: 999,
    marginBottom: 26,
    border: '3px solid #ffc56f',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2,
  },

  progressInner: (pct) => ({
    height: '100%',
    width: `${pct}%`,
    background:
      pct > 50
        ? 'linear-gradient(90deg,#36e27d,#0ca84f)'
        : pct > 25
        ? 'linear-gradient(90deg,#ffdf3b,#ff8a00)'
        : 'linear-gradient(90deg,#ff6b6b,#d63031)',
    borderRadius: 999,
    transition: 'width 1s linear',
  }),

  meaningBox: {
    background: 'linear-gradient(180deg,#fff8ea,#ffe2bd)',
    border: '5px solid #ffc56f',
    borderRadius: 30,
    padding: '24px 26px',
    marginBottom: 24,
    textAlign: 'center',
    boxShadow: '0 7px 0 rgba(184,79,0,.18)',
    position: 'relative',
    zIndex: 2,
  },

  label: {
    color: '#b84f00',
    fontWeight: 900,
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  meaning: {
    color: '#5c2200',
    fontSize: 'clamp(1.45rem,3vw,2.15rem)',
    fontWeight: 900,
    marginTop: 6,
  },

  answerBox: {
    minHeight: 70,
    background: '#fff',
    border: '4px dashed #ffc56f',
    borderRadius: 24,
    padding: '14px',
    marginBottom: 24,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
  },

  chip: (selected = false) => ({
    background: selected
      ? 'linear-gradient(180deg,#ffdf3b,#ff8a00)'
      : 'linear-gradient(180deg,#ffffff,#ffe8b4)',
    color: selected ? '#fff' : '#8a3b00',
    border: '4px solid #fff',
    borderRadius: 18,
    padding: '10px 18px',
    fontSize: '1.35rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: selected ? '0 6px 0 #b84f00' : '0 6px 0 rgba(184,79,0,.20)',
    textShadow: selected ? '0 2px 0 rgba(0,0,0,.20)' : 'none',
  }),

  actionRow: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 2,
  },

  grayBtn: {
    background: 'linear-gradient(180deg,#b0b0b0,#777)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '13px 24px',
    fontSize: '1.08rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 rgba(0,0,0,.22)',
  },

  checkBtn: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '13px 28px',
    fontSize: '1.08rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 #b84f00',
  },

  feedback: (ok) => ({
    textAlign: 'center',
    marginTop: 18,
    padding: '14px 18px',
    borderRadius: 20,
    background: ok
      ? 'linear-gradient(180deg,#36e27d,#0ca84f)'
      : 'linear-gradient(180deg,#ff6b6b,#d63031)',
    color: '#fff',
    fontWeight: 900,
    fontSize: '1.12rem',
    border: '4px solid #fff',
    boxShadow: '0 6px 0 rgba(0,0,0,.22)',
  }),

  endPage: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#ff5c00 0%,#ff8a00 48%,#ffb100 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    fontFamily: GAME_FONT,
  },

  endCard: {
    background: '#fff',
    borderRadius: 36,
    padding: '46px 42px',
    textAlign: 'center',
    border: '6px solid #ff7a00',
    boxShadow: '0 10px 0 #b84f00, 0 22px 45px rgba(0,0,0,.28)',
    maxWidth: 480,
    width: '100%',
  },

  endButtons: {
    display: 'flex',
    gap: 14,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 24,
  },

  mainBtn: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '14px 30px',
    fontSize: '1.15rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 7px 0 #b84f00',
  },

  secondaryBtn: {
    background: 'linear-gradient(180deg,#ffffff,#ffe9ba)',
    color: '#9b3200',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '14px 30px',
    fontSize: '1.15rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 7px 0 rgba(111,39,0,.18)',
  },
};

function WordOrderGame({ packInfo, wordList }) {
  const history = useHistory();
  const [wordPack, setWordPack] = useState([]);
  const [current, setCurrent] = useState(0);
  const [assembled, setAssembled] = useState([]);
  const [available, setAvailable] = useState([]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('loading');
  const [feedback, setFeedback] = useState(null);
  const [timer, setTimer] = useState(TIMER);
  const timerRef = useRef(null);

  const init = useCallback(async () => {
    clearInterval(timerRef.current);

    setStatus('loading');
    setCurrent(0);
    setAssembled([]);
    setAvailable([]);
    setScore(0);
    setFeedback(null);
    setTimer(TIMER);

    try {
      let pack;

      if (wordList?.length) {
        pack = wordList.slice(0, N);
      } else {
        const { type = '-1', level = '-1', specialty = '-1', topics = [] } = packInfo || {};
        const res = await gameApi.getWordPackCWG(type, level, specialty, topics, N);
        pack = res?.data?.wordPack || [];
      }

      if (!pack.length) {
        setStatus('done');
        return;
      }

      setWordPack(pack);
      setAvailable(buildChips(pack[0].word));
      setStatus('playing');
    } catch {
      setStatus('done');
    }
  }, [packInfo, wordList]);

  useEffect(() => {
    init();
    return () => clearInterval(timerRef.current);
  }, [init]);

  const handleCheck = useCallback(
    (timedOut = false) => {
      clearInterval(timerRef.current);
      setStatus('checking');

      const entry = wordPack[current];
      const attempt = assembled.map((c) => c.letter).join('');
      const ok = !timedOut && attempt.toLowerCase() === entry.word.toLowerCase();

      setFeedback(ok);

      if (ok) {
        playCorrect();
        setScore((s) => s + 100 + Math.round((timer / TIMER) * 50));
      } else {
        playWrong();
      }

      setTimeout(() => {
        const next = current + 1;

        if (next >= wordPack.length) {
          playComplete();
          setStatus('done');
          return;
        }

        setCurrent(next);
        setAvailable(buildChips(wordPack[next].word));
        setAssembled([]);
        setFeedback(null);
        setTimer(TIMER);
        setStatus('playing');
      }, 1400);
    },
    [assembled, current, timer, wordPack]
  );

  useEffect(() => {
    if (status !== 'playing') {
      clearInterval(timerRef.current);
      return;
    }

    clearInterval(timerRef.current);
    setTimer(TIMER);

    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleCheck(true);
          return 0;
        }

        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [current, status, handleCheck]);

  if (status === 'loading') {
    return (
      <div style={S.endPage}>
        <div style={{ textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: '1.4rem' }}>
          🔡 Đang xáo chữ...
        </div>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div style={S.endPage}>
        <div style={S.endCard}>
          <div style={{ fontSize: '4.4rem' }}>{score >= 1500 ? '🏆' : score >= 800 ? '🌟' : '💪'}</div>
          <h2 style={{ color: '#ff7a00', fontSize: '2.3rem', fontWeight: 900, margin: '8px 0' }}>
            Hoàn thành!
          </h2>
          <div style={{ color: '#ff8a00', fontSize: '3.5rem', fontWeight: 900 }}>{score} điểm</div>

          <div style={S.endButtons}>
            <button onClick={init} style={S.mainBtn}>Chơi lại</button>
            <button onClick={() => history.push('/games')} style={S.secondaryBtn}>Về kho game</button>
          </div>
        </div>
      </div>
    );
  }

  const entry = wordPack[current];
  const pct = (timer / TIMER) * 100;

  return (
    <div style={S.page}>
      <div style={S.shell}>
        <div style={S.topBar}>
          <button style={S.backBtn} onClick={() => history.push('/games')}>
            ← Về kho game
          </button>
        </div>

        <div style={S.card}>
          <div style={S.titleRow}>
            <h1 style={S.title}>Sắp Xếp Chữ Cái</h1>

            <div style={S.statGroup}>
              <span style={S.stat()}>Câu {current + 1}/{wordPack.length}</span>
              <span style={S.stat()}>⭐ {score}</span>
              <span
                style={S.stat(
                  timer > 15
                    ? 'linear-gradient(180deg,#36e27d,#0ca84f)'
                    : timer > 8
                    ? 'linear-gradient(180deg,#ffdf3b,#ff8a00)'
                    : 'linear-gradient(180deg,#ff6b6b,#d63031)'
                )}
              >
                ⏱ {timer}s
              </span>
            </div>
          </div>

          <div style={S.progressOuter}>
            <div style={S.progressInner(pct)} />
          </div>

          <div style={S.meaningBox}>
            <div style={S.label}>Sắp xếp thành từ có nghĩa là</div>
            <div style={S.meaning}>"{entry?.mean}"</div>
            {entry?.phonetic && (
              <div style={{ color: '#ff7a00', fontSize: '1.15rem', fontWeight: 900, marginTop: 8 }}>
                {entry.phonetic}
              </div>
            )}
          </div>

          <div style={S.answerBox}>
            {assembled.length === 0 && (
              <span style={{ color: '#b84f00', opacity: .45, fontWeight: 900 }}>
                Nhấn chữ bên dưới để ghép từ...
              </span>
            )}

            {assembled.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setAssembled((prev) => prev.filter((x) => x.id !== c.id));
                  setAvailable((prev) => [...prev, c]);
                }}
                style={S.chip(true)}
              >
                {c.letter}
              </button>
            ))}
          </div>

          <div style={{ ...S.answerBox, borderStyle: 'solid', background: '#fff8ea' }}>
            {available.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setAvailable((prev) => prev.filter((x) => x.id !== c.id));
                  setAssembled((prev) => [...prev, c]);
                }}
                style={S.chip(false)}
              >
                {c.letter}
              </button>
            ))}
          </div>

          <div style={S.actionRow}>
            <button
              onClick={() => {
                setAvailable((prev) => [...prev, ...assembled]);
                setAssembled([]);
              }}
              style={S.grayBtn}
            >
              Xóa
            </button>

            <button onClick={() => handleCheck(true)} style={S.grayBtn}>
              Bỏ qua
            </button>

            <button
              onClick={() => handleCheck(false)}
              disabled={assembled.length === 0 || status === 'checking'}
              style={{
                ...S.checkBtn,
                opacity: assembled.length === 0 || status === 'checking' ? .65 : 1,
              }}
            >
              Kiểm tra
            </button>
          </div>

          {feedback !== null && (
            <div style={S.feedback(feedback)}>
              {feedback
                ? `✅ Chính xác! +${100 + Math.round((timer / TIMER) * 50)} điểm`
                : `❌ Sai rồi! Đáp án: ${entry?.word}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WordOrderPage() {
  const location = useLocation();
  const [packInfo, setPackInfo] = useState(location.state?.packInfo || null);
  const [wordList, setWordList] = useState(location.state?.wordList || null);

  const handleStart = (info) => {
    if (info.wordList) setWordList(info.wordList);
    else setPackInfo(info);
  };

  if (!packInfo && !wordList) {
    return <GameSetup title="📝 Sắp Xếp Chữ Cái — Chọn chủ đề" onStart={handleStart} />;
  }

  return <WordOrderGame packInfo={packInfo} wordList={wordList} />;
}

export default WordOrderPage;