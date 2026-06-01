import gameApi from 'apis/gameApi';
import GameSetup from 'components/PlayGames/GameSetup';
import { playComplete, playCorrect, playWrong } from 'helper/gameSound';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';
const N = 20;
const T = 10;

const CSS = `
  @keyframes bbBallFly {
    0% {
      left: 16%;
      bottom: 40px;
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
    40% {
      left: 46%;
      bottom: 235px;
      transform: scale(.8) rotate(220deg);
      opacity: 1;
    }
    100% {
      left: 77%;
      bottom: 180px;
      transform: scale(.5) rotate(460deg);
      opacity: 0;
    }
  }

  @keyframes bbHoopShake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    80% { transform: translateX(-3px); }
  }

  @keyframes bbPop {
    0% { transform: scale(.92); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes bbSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .bb-ball-fly {
    position: absolute;
    animation: bbBallFly 1.15s ease-in forwards;
    z-index: 9;
    pointer-events: none;
  }

  .bb-hoop-shake {
    animation: bbHoopShake .45s ease;
  }

  .bb-pop {
    animation: bbPop .28s ease;
  }

  .bb-spinner {
    width: 58px;
    height: 58px;
    border: 6px solid rgba(255,255,255,.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: bbSpin .8s linear infinite;
    margin: 0 auto 18px;
  }
`;

const CHOICE_COLORS = ['#ff4d4f', '#1e90ff', '#2ed573', '#ffa502'];

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 18% 20%, rgba(255,255,255,.28), transparent 16%),
      radial-gradient(circle at 80% 12%, rgba(255,223,90,.28), transparent 20%),
      radial-gradient(circle at 72% 82%, rgba(255,255,255,.16), transparent 18%),
      linear-gradient(135deg, #ff5c00 0%, #ff8a00 44%, #ffb100 100%)
    `,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 16px 40px',
    boxSizing: 'border-box',
    fontFamily: GAME_FONT,
    overflowX: 'hidden',
  },

  topBar: {
    width: '100%',
    maxWidth: 820,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
    flexWrap: 'wrap',
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

  title: {
    color: '#fff',
    fontWeight: 900,
    fontSize: 'clamp(2.35rem, 5vw, 4.4rem)',
    margin: '0 0 12px',
    textAlign: 'center',
    textShadow: '0 6px 0 #8f2600, 0 12px 24px rgba(0,0,0,.28)',
    lineHeight: 0.95,
  },

  statBar: {
    display: 'flex',
    gap: 14,
    marginBottom: 18,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  stat: {
    background: '#fff',
    color: '#9b3200',
    padding: '8px 18px',
    borderRadius: 999,
    border: '3px solid #ffe6b0',
    fontWeight: 900,
    fontSize: '1.05rem',
    boxShadow: '0 5px 0 rgba(111,39,0,.35)',
  },

  arena: {
    position: 'relative',
    width: '100%',
    maxWidth: 820,
    height: 360,
    marginBottom: 22,
    background: `
      radial-gradient(circle at 50% 80%, rgba(255,255,255,.22), transparent 26%),
      repeating-linear-gradient(
        135deg,
        rgba(255,255,255,.08) 0 10px,
        transparent 10px 24px
      ),
      linear-gradient(180deg, #ffa015, #f05b00)
    `,
    borderRadius: 38,
    border: '6px solid #fff',
    boxShadow: '0 10px 0 #a73a00, 0 22px 45px rgba(0,0,0,.28)',
    overflow: 'hidden',
  },

  arenaDots: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 200,
    height: 200,
    background:
      'radial-gradient(circle, rgba(255,240,190,.5) 0 3px, transparent 4px)',
    backgroundSize: '16px 16px',
    opacity: 0.45,
    zIndex: 1,
  },

  arenaText: {
    position: 'absolute',
    left: 28,
    top: 28,
    color: '#fff',
    fontSize: 'clamp(2rem, 4.4vw, 4rem)',
    fontWeight: 900,
    lineHeight: 0.9,
    textShadow: '0 6px 0 #8f2600, 0 12px 20px rgba(0,0,0,.24)',
    zIndex: 4,
    maxWidth: 360,
  },

  streakLine: {
    position: 'absolute',
    left: 240,
    top: 70,
    width: 300,
    height: 8,
    borderRadius: 999,
    background: 'linear-gradient(90deg, rgba(255,255,255,0), #fff3a0, rgba(255,255,255,0))',
    boxShadow: '0 0 18px rgba(255,255,255,.45)',
    transform: 'rotate(-18deg)',
    zIndex: 2,
  },

  streakLine2: {
    position: 'absolute',
    left: 210,
    top: 120,
    width: 350,
    height: 6,
    borderRadius: 999,
    background: 'linear-gradient(90deg, rgba(255,255,255,0), #fff6bf, rgba(255,255,255,0))',
    boxShadow: '0 0 18px rgba(255,255,255,.4)',
    transform: 'rotate(-15deg)',
    zIndex: 2,
  },

  hoopWrap: {
    position: 'absolute',
    right: 34,
    top: 34,
    width: 230,
    height: 240,
    zIndex: 7,
  },

  board: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 170,
    height: 124,
    borderRadius: 22,
    background: 'linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,.35))',
    border: '8px solid #fff',
    boxShadow: '0 8px 0 rgba(0,0,0,.22)',
  },

  boardShine: {
    position: 'absolute',
    left: 16,
    top: 14,
    width: 90,
    height: 24,
    borderRadius: 999,
    background: 'rgba(255,255,255,.45)',
    transform: 'rotate(-14deg)',
  },

  boardInner: {
    position: 'absolute',
    right: 38,
    top: 32,
    width: 60,
    height: 44,
    border: '6px solid rgba(245,90,0,.55)',
    borderRadius: 12,
  },

  rimShadow: {
    position: 'absolute',
    right: 16,
    top: 112,
    width: 130,
    height: 16,
    borderRadius: 999,
    background: 'rgba(0,0,0,.18)',
    filter: 'blur(3px)',
  },

  rim: {
    position: 'absolute',
    right: 12,
    top: 100,
    width: 136,
    height: 24,
    borderRadius: 999,
    background: 'linear-gradient(180deg,#ff9f43,#f05b00)',
    border: '4px solid #fff',
    boxShadow: '0 6px 0 rgba(0,0,0,.22)',
  },

  support: {
    position: 'absolute',
    right: 76,
    top: 124,
    width: 12,
    height: 38,
    borderRadius: 999,
    background: 'linear-gradient(180deg,#cfd5dd,#8d96a4)',
  },

  floorLine: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    height: 4,
    borderRadius: 999,
    background: 'rgba(255,255,255,.38)',
  },

  timerOuter: {
    width: '100%',
    maxWidth: 820,
    height: 16,
    background: 'rgba(255,255,255,.35)',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 22,
    border: '3px solid rgba(255,255,255,.7)',
    boxShadow: '0 5px 0 rgba(111,39,0,.25)',
  },

  timerInner: (pct) => ({
    height: '100%',
    width: `${pct}%`,
    background:
      pct > 50
        ? 'linear-gradient(90deg,#34c759,#13a538)'
        : pct > 25
        ? 'linear-gradient(90deg,#ffdf3b,#ff8a00)'
        : 'linear-gradient(90deg,#ff6b6b,#d63031)',
    borderRadius: 999,
    transition: 'width 1s linear',
  }),

  questionBox: {
    width: '100%',
    maxWidth: 820,
    background: '#fff',
    borderRadius: 32,
    padding: '24px 28px',
    marginBottom: 20,
    border: '5px solid #ffcf45',
    boxShadow: '0 8px 0 #bd5f00',
    textAlign: 'center',
    boxSizing: 'border-box',
  },

  questionLabel: {
    color: '#bd5f00',
    fontWeight: 900,
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  questionText: {
    color: '#5c2200',
    fontSize: 'clamp(1.45rem, 3vw, 2.2rem)',
    fontWeight: 900,
    marginTop: 6,
  },

  choices: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 16,
    width: '100%',
    maxWidth: 820,
  },

  feedback: (ok) => ({
    width: '100%',
    maxWidth: 820,
    textAlign: 'center',
    padding: '14px 18px',
    borderRadius: 20,
    marginTop: 18,
    fontWeight: 900,
    fontSize: '1.15rem',
    color: '#fff',
    background: ok
      ? 'linear-gradient(180deg,#36e27d,#0ca84f)'
      : 'linear-gradient(180deg,#ff6b6b,#d63031)',
    border: '4px solid #fff',
    boxShadow: '0 6px 0 rgba(0,0,0,.22)',
  }),

  endPage: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ff5c00 0%, #ff8a00 48%, #ffb100 100%)',
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
    border: '6px solid #ffcf45',
    boxShadow: '0 10px 0 #a73a00, 0 22px 45px rgba(0,0,0,.28)',
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
    boxShadow: '0 7px 0 #bd5f00',
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

function Ball3D({ size = 82, style = {} }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'relative',
        background: 'radial-gradient(circle at 28% 24%, #ffd86f, #ff8a00 52%, #a63c00 100%)',
        border: `${Math.max(4, Math.round(size * 0.06))}px solid #6e2400`,
        boxShadow: '0 9px 0 rgba(0,0,0,.22), inset -8px -12px 16px rgba(0,0,0,.18)',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '14%',
          top: '14%',
          width: '24%',
          height: '12%',
          borderRadius: 999,
          background: 'rgba(255,255,255,.35)',
          transform: 'rotate(-18deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '48%',
          top: '-2%',
          width: '8%',
          height: '104%',
          background: '#5a1b00',
          borderRadius: 999,
          transform: 'rotate(18deg)',
          opacity: 0.92,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '18%',
          top: '42%',
          width: '70%',
          height: '8%',
          background: '#5a1b00',
          borderRadius: 999,
          transform: 'rotate(-18deg)',
          opacity: 0.92,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '18%',
          top: '18%',
          width: '72%',
          height: '56%',
          border: '6px solid transparent',
          borderTopColor: '#5a1b00',
          borderRadius: '50%',
          transform: 'rotate(14deg)',
          opacity: 0.95,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '10%',
          top: '20%',
          width: '76%',
          height: '52%',
          border: '6px solid transparent',
          borderBottomColor: '#5a1b00',
          borderRadius: '50%',
          transform: 'rotate(14deg)',
          opacity: 0.95,
        }}
      />
    </div>
  );
}

function Hoop3D({ shake }) {
  return (
    <div style={S.hoopWrap}>
      <div style={S.board}>
        <div style={S.boardShine} />
        <div style={S.boardInner} />
      </div>

      <div className={shake ? 'bb-hoop-shake' : ''}>
        <div style={S.rimShadow} />
        <div style={S.rim} />
        <div style={S.support} />
      </div>

      {[
        { left: 28, top: 122, rotate: -18 },
        { left: 48, top: 122, rotate: -10 },
        { left: 68, top: 122, rotate: -2 },
        { left: 88, top: 122, rotate: 6 },
        { left: 108, top: 122, rotate: 14 },
      ].map((line, idx) => (
        <div
          key={`v-${idx}`}
          style={{
            position: 'absolute',
            left: line.left,
            top: line.top,
            width: 5,
            height: 88,
            borderRadius: 999,
            background: '#fff',
            transform: `rotate(${line.rotate}deg)`,
            opacity: 0.9,
          }}
        />
      ))}

      {[
        { top: 144, width: 110, left: 20 },
        { top: 166, width: 96, left: 28 },
        { top: 188, width: 78, left: 38 },
      ].map((line, idx) => (
        <div
          key={`h-${idx}`}
          style={{
            position: 'absolute',
            left: line.left,
            top: line.top,
            width: line.width,
            height: 4,
            borderRadius: 999,
            background: '#fff',
            opacity: 0.88,
          }}
        />
      ))}
    </div>
  );
}

function buildChoices(item) {
  if (!item) return [];
  return [...(item.wrongList || []).slice(0, 3).map((w) => w.word || w), item.word].sort(
    () => Math.random() - 0.5
  );
}

function BasketballQuizGame({ packInfo, wordList }) {
  const history = useHistory();
  const [pack, setPack] = useState([]);
  const [cur, setCur] = useState(0);
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(T);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('loading');
  const [showBall, setShowBall] = useState(false);
  const [shake, setShake] = useState(false);
  const [err, setErr] = useState(null);

  const timerRef = useRef(null);
  const advRef = useRef(null);

  const init = useCallback(async () => {
    clearInterval(timerRef.current);
    clearTimeout(advRef.current);

    setStatus('loading');
    setErr(null);
    setCur(0);
    setScore(0);
    setSelected(null);
    setShowBall(false);
    setShake(false);
    setTimer(T);

    try {
      let p;

      if (wordList?.length) {
        p = wordList.slice(0, N);
      } else {
        const { type = '-1', level = '-1', specialty = '-1', topics = [] } = packInfo || {};
        const res = await gameApi.getWordPackCWG(type, level, specialty, topics, N);
        p = (res?.data?.wordPack || []).slice(0, N);
      }

      if (!p.length) {
        setErr('Chưa có dữ liệu từ vựng cho chủ đề này.');
        return;
      }

      setPack(p);
      setChoices(buildChoices(p[0]));
      setStatus('playing');
    } catch {
      setErr('Không thể tải dữ liệu. Hãy thử lại!');
    }
  }, [packInfo, wordList]);

  useEffect(() => {
    init();

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(advRef.current);
    };
  }, [init]);

  const advance = useCallback(
    (sel) => {
      setSelected(sel);
      clearTimeout(advRef.current);

      advRef.current = setTimeout(() => {
        setCur((prev) => {
          const next = prev + 1;

          if (next >= pack.length) {
            playComplete();
            setStatus('done');
            return prev;
          }

          setChoices(buildChoices(pack[next]));
          setSelected(null);
          setShowBall(false);
          setShake(false);
          setTimer(T);
          setStatus('playing');

          return next;
        });
      }, 1400);
    },
    [pack]
  );

  useEffect(() => {
    if (status !== 'playing') {
      clearInterval(timerRef.current);
      return;
    }

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setStatus('animating');
          playWrong();
          advance('__timeout__');
          return 0;
        }

        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [status, cur, advance]);

  const handleAnswer = useCallback(
    (choice) => {
      if (status !== 'playing') return;

      clearInterval(timerRef.current);

      const item = pack[cur];
      const ok = choice === item.word;

      setStatus('animating');

      if (ok) {
        playCorrect();
        const gain = 200 + Math.round((timer / T) * 100);
        setScore((s) => s + gain);
        setShowBall(true);
        setTimeout(() => setShake(true), 850);
      } else {
        playWrong();
      }

      advance(choice);
    },
    [status, pack, cur, timer, advance]
  );

  const getState = (choice) => {
    if (status === 'playing') return 'idle';
    if (choice === pack[cur]?.word) return 'correct';
    if (choice === selected) return 'wrong';
    return 'dim';
  };

  if (status === 'loading' && !err) {
    return (
      <div style={S.endPage}>
        <style>{CSS}</style>
        <div style={{ textAlign: 'center', color: '#fff', fontWeight: 900 }}>
          <div className="bb-spinner" />
          Đang tải game...
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div style={S.endPage}>
        <style>{CSS}</style>
        <div style={S.endCard}>
          <div style={{ fontSize: '4rem' }}>😢</div>
          <h2 style={{ color: '#d63031', margin: '8px 0 20px', fontWeight: 900 }}>{err}</h2>
          <div style={S.endButtons}>
            <button onClick={init} style={S.mainBtn}>
              Thử lại
            </button>
            <button onClick={() => history.push('/games')} style={S.secondaryBtn}>
              Về kho game
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'done') {
    const max = pack.length * 300;
    const pct = Math.round((score / max) * 100);

    return (
      <div style={S.endPage}>
        <style>{CSS}</style>
        <div style={S.endCard} className="bb-pop">
          <div style={{ fontSize: '4.4rem' }}>{pct >= 80 ? '🏆' : pct >= 50 ? '🌟' : '💪'}</div>
          <h2 style={{ color: '#9b3200', fontSize: '2.3rem', fontWeight: 900, margin: '8px 0' }}>
            Trận đấu kết thúc!
          </h2>
          <div style={{ color: '#ff7a00', fontSize: '3.6rem', fontWeight: 900 }}>{score}</div>
          <p style={{ color: '#6b3a00', fontWeight: 800, marginBottom: 10 }}>
            {pack.length} câu · Tối đa {max} điểm
          </p>

          <div style={S.endButtons}>
            <button onClick={init} style={S.mainBtn}>
              Chơi lại 🏀
            </button>
            <button onClick={() => history.push('/games')} style={S.secondaryBtn}>
              Về kho game
            </button>
          </div>
        </div>
      </div>
    );
  }

  const item = pack[cur];
  const pct = (timer / T) * 100;
  const selectedOk = selected === item?.word;

  return (
    <div style={S.page}>
      <style>{CSS}</style>

      <div style={S.topBar}>
        <button style={S.backBtn} onClick={() => history.push('/games')}>
          ← Về kho game
        </button>
      </div>

      <h1 style={S.title}>Ném Bóng Từ Vựng</h1>

      <div style={S.statBar}>
        <span style={S.stat}>Câu {cur + 1}/{pack.length}</span>
        <span style={S.stat}>⭐ {score}</span>
        <span style={{ ...S.stat, color: timer > 5 ? '#0ca84f' : timer > 3 ? '#bd5f00' : '#d63031' }}>
          ⏱ {timer}s
        </span>
      </div>

      <div style={S.arena}>
        <div style={S.arenaDots} />
        <div style={S.streakLine} />
        <div style={S.streakLine2} />

        <div style={S.arenaText}>
          AI
          <br />
          NÉM TRÚNG
        </div>

        <Hoop3D shake={shake} />

        {!showBall && (
          <Ball3D
            size={88}
            style={{
              position: 'absolute',
              left: '16%',
              bottom: 40,
              zIndex: 8,
            }}
          />
        )}

        {showBall && (
          <div className="bb-ball-fly">
            <Ball3D size={88} />
          </div>
        )}

        <div style={S.floorLine} />
      </div>

      <div style={S.timerOuter}>
        <div style={S.timerInner(pct)} />
      </div>

      <div style={S.questionBox}>
        <div style={S.questionLabel}>Từ nào có nghĩa là</div>
        <div style={S.questionText}>"{item?.mean}"</div>
      </div>

      <div style={S.choices}>
        {choices.map((c, i) => {
          const st = getState(c);
          const baseColor = CHOICE_COLORS[i % CHOICE_COLORS.length];

          const background =
            st === 'correct'
              ? 'linear-gradient(180deg,#36e27d,#0ca84f)'
              : st === 'wrong'
              ? 'linear-gradient(180deg,#ff6b6b,#d63031)'
              : st === 'dim'
              ? 'linear-gradient(180deg,#b0b0b0,#777)'
              : `linear-gradient(180deg, ${baseColor}, ${baseColor}cc)`;

          return (
            <button
              key={i}
              onClick={() => handleAnswer(c)}
              disabled={status !== 'playing'}
              style={{
                background,
                color: '#fff',
                border: '4px solid #fff',
                borderRadius: 24,
                padding: '18px 14px',
                fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)',
                fontWeight: 900,
                fontFamily: GAME_FONT,
                cursor: status === 'playing' ? 'pointer' : 'default',
                boxShadow: '0 7px 0 rgba(0,0,0,.24)',
                textShadow: '0 2px 0 rgba(0,0,0,.25)',
                transition: 'transform .15s ease, filter .15s ease',
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      {status === 'animating' && selected && (
        <div style={S.feedback(selectedOk)}>
          {selectedOk
            ? '✅ Chính xác! Bóng vào rổ!'
            : selected === '__timeout__'
            ? `⏰ Hết giờ! Đáp án: "${item.word}"`
            : `❌ Sai rồi! Đáp án: "${item.word}"`}
        </div>
      )}
    </div>
  );
}

function BasketballPage() {
  const location = useLocation();
  const [packInfo, setPackInfo] = useState(location.state?.packInfo || null);
  const [wordList, setWordList] = useState(location.state?.wordList || null);

  const handleStart = (info) => {
    if (info.wordList) setWordList(info.wordList);
    else setPackInfo(info);
  };

  if (!packInfo && !wordList) {
    return <GameSetup title="🏀 Ném Bóng Từ Vựng — Chọn chủ đề" onStart={handleStart} />;
  }

  return <BasketballQuizGame packInfo={packInfo} wordList={wordList} />;
}

export default BasketballPage;