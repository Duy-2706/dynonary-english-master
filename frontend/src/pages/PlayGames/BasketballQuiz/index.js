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
      left: 29%;
      bottom: 118px;
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }

    38% {
      left: 50%;
      bottom: 250px;
      transform: scale(.86) rotate(190deg);
      opacity: 1;
    }

    72% {
      left: 73%;
      bottom: 226px;
      transform: scale(.66) rotate(365deg);
      opacity: 1;
    }

    100% {
      left: 79%;
      bottom: 184px;
      transform: scale(.46) rotate(520deg);
      opacity: 0;
    }
  }

  @keyframes bbHoopShake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-3px); }
    50% { transform: translateX(3px); }
    80% { transform: translateX(-2px); }
  }

  @keyframes bbPop {
    0% { transform: scale(.94); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes bbSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes monkeySwing {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
  }

  .bb-ball-fly {
    position: absolute;
    animation: bbBallFly 1.15s ease-in forwards;
    z-index: 12;
    pointer-events: none;
  }

  .bb-hoop-shake {
    animation: bbHoopShake .45s ease;
  }

  .bb-pop {
    animation: bbPop .25s ease;
  }

  .bb-spinner {
    width: 52px;
    height: 52px;
    border: 6px solid rgba(255,255,255,.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: bbSpin .8s linear infinite;
    margin: 0 auto 16px;
  }

  .monkey-swing {
    animation: monkeySwing 1.8s ease-in-out infinite;
    transform-origin: 50% 10%;
  }

  @media (max-width: 980px) {
    .basket-main-layout {
      grid-template-columns: 1fr !important;
    }

    .basket-arena {
      height: 330px !important;
    }

    .basket-choices {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
  }

  @media (max-width: 620px) {
    .basket-page {
      padding: 14px 12px 30px !important;
    }

    .basket-arena {
      height: 300px !important;
      border-radius: 28px !important;
    }

    .basket-choices {
      grid-template-columns: 1fr !important;
    }
  }
`;

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 18% 20%, rgba(255,255,255,.24), transparent 16%),
      radial-gradient(circle at 80% 12%, rgba(255,223,90,.24), transparent 20%),
      radial-gradient(circle at 72% 82%, rgba(255,255,255,.13), transparent 18%),
      linear-gradient(135deg, #ff5c00 0%, #ff8a00 44%, #ffb100 100%)
    `,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '14px 16px 32px',
    boxSizing: 'border-box',
    fontFamily: GAME_FONT,
    overflowX: 'hidden',
  },

  topBar: {
    width: '100%',
    maxWidth: 1180,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
  },

  backBtn: {
    background: 'linear-gradient(180deg,#ffffff,#ffe9ba)',
    color: '#8a2f00',
    border: '3px solid #fff',
    borderRadius: 999,
    padding: '8px 18px',
    fontSize: '.92rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 5px 0 rgba(111,39,0,.20)',
    textShadow: 'none',
  },

  title: {
    color: '#fff',
    fontWeight: 900,
    fontSize: 'clamp(1.85rem, 4vw, 3.35rem)',
    margin: '0 0 8px',
    textAlign: 'center',
    textShadow: '0 2px 0 rgba(143,38,0,.38)',
    lineHeight: 0.95,
  },

  statBar: {
    display: 'flex',
    gap: 10,
    marginBottom: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  stat: {
    background: '#fff',
    color: '#8a2f00',
    padding: '6px 14px',
    borderRadius: 999,
    border: '3px solid #ffe6b0',
    fontWeight: 900,
    fontSize: '.92rem',
    boxShadow: '0 4px 0 rgba(111,39,0,.26)',
    textShadow: 'none',
  },

  mainLayout: {
    width: '100%',
    maxWidth: 1180,
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.35fr) minmax(330px, .65fr)',
    gap: 18,
    alignItems: 'stretch',
  },

  arena: {
    position: 'relative',
    width: '100%',
    height: 420,
    background: `
      radial-gradient(circle at 50% 80%, rgba(255,255,255,.20), transparent 26%),
      repeating-linear-gradient(
        135deg,
        rgba(255,255,255,.075) 0 10px,
        transparent 10px 24px
      ),
      linear-gradient(180deg, #ffa015, #f05b00)
    `,
    borderRadius: 38,
    border: '6px solid #fff',
    boxShadow: '0 9px 0 #a73a00, 0 20px 38px rgba(0,0,0,.25)',
    overflow: 'hidden',
  },

  arenaDots: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 220,
    height: 220,
    background:
      'radial-gradient(circle, rgba(255,240,190,.45) 0 3px, transparent 4px)',
    backgroundSize: '16px 16px',
    opacity: 0.42,
    zIndex: 1,
  },

  arenaText: {
    position: 'absolute',
    left: 26,
    top: 26,
    color: '#fff',
    fontSize: 'clamp(1.65rem, 3.2vw, 3rem)',
    fontWeight: 900,
    lineHeight: 0.9,
    textShadow: '0 2px 0 rgba(143,38,0,.42)',
    zIndex: 4,
    maxWidth: 300,
  },

  streakLine: {
    position: 'absolute',
    left: 218,
    top: 78,
    width: 340,
    height: 8,
    borderRadius: 999,
    background: 'linear-gradient(90deg, rgba(255,255,255,0), #fff3a0, rgba(255,255,255,0))',
    boxShadow: '0 0 16px rgba(255,255,255,.38)',
    transform: 'rotate(-18deg)',
    zIndex: 2,
  },

  streakLine2: {
    position: 'absolute',
    left: 202,
    top: 128,
    width: 390,
    height: 5,
    borderRadius: 999,
    background: 'linear-gradient(90deg, rgba(255,255,255,0), #fff6bf, rgba(255,255,255,0))',
    boxShadow: '0 0 16px rgba(255,255,255,.34)',
    transform: 'rotate(-15deg)',
    zIndex: 2,
  },

  hoopWrap: {
    position: 'absolute',
    right: 28,
    top: 30,
    width: 235,
    height: 250,
    zIndex: 8,
  },

  monkeyWrap: {
    position: 'absolute',
    left: '14%',
    bottom: 18,
    width: 165,
    height: 190,
    zIndex: 9,
  },

  floorLine: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    height: 4,
    borderRadius: 999,
    background: 'rgba(255,255,255,.35)',
    zIndex: 3,
  },

  sidePanel: {
    width: '100%',
    background: '#fff',
    borderRadius: 28,
    padding: '20px',
    border: '5px solid #ffcf45',
    boxShadow: '0 7px 0 #bd5f00',
    boxSizing: 'border-box',
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  timerOuter: {
    width: '100%',
    height: 14,
    background: '#ffe8b6',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 16,
    border: '3px solid #ffffff',
    boxShadow: '0 4px 0 rgba(111,39,0,.20)',
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
    background: 'linear-gradient(180deg,#fffaf0,#fff4d8)',
    borderRadius: 22,
    padding: '16px 18px',
    marginBottom: 16,
    border: '4px solid #ffe1a0',
    textAlign: 'center',
    boxSizing: 'border-box',
  },

  questionLabel: {
    color: '#a94700',
    fontWeight: 900,
    fontSize: '.82rem',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadow: 'none',
  },

  questionText: {
    color: '#4a2100',
    fontSize: 'clamp(1.25rem, 2.3vw, 1.75rem)',
    fontWeight: 900,
    marginTop: 5,
    lineHeight: 1.15,
    textShadow: 'none',
  },

  choices: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 10,
    width: '100%',
  },

  choiceBtn: (background, st, textColor = '#4a2100') => ({
    background,
    color: textColor,
    border: '4px solid #ffffff',
    borderRadius: 18,
    padding: '12px 12px',
    fontSize: '1.05rem',
    fontWeight: 900,
    fontFamily: GAME_FONT,
    cursor: st === 'idle' ? 'pointer' : 'default',
    boxShadow: '0 5px 0 rgba(111,39,0,.16)',
    textShadow: 'none',
    transition: 'transform .15s ease, filter .15s ease',
    lineHeight: 1.15,
  }),

  feedback: (ok) => ({
    width: '100%',
    textAlign: 'center',
    padding: '11px 14px',
    borderRadius: 18,
    marginTop: 14,
    fontWeight: 900,
    fontSize: '.98rem',
    color: '#fff',
    background: ok
      ? 'linear-gradient(180deg,#36e27d,#0ca84f)'
      : 'linear-gradient(180deg,#ff6b6b,#d63031)',
    border: '3px solid #fff',
    boxShadow: '0 5px 0 rgba(0,0,0,.22)',
    lineHeight: 1.25,
    textShadow: 'none',
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
    borderRadius: 30,
    padding: '36px 32px',
    textAlign: 'center',
    border: '5px solid #ffcf45',
    boxShadow: '0 8px 0 #a73a00, 0 20px 40px rgba(0,0,0,.25)',
    maxWidth: 430,
    width: '100%',
  },

  endButtons: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 22,
  },

  mainBtn: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    border: '3px solid #fff',
    borderRadius: 999,
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 #bd5f00',
    textShadow: 'none',
  },

  secondaryBtn: {
    background: 'linear-gradient(180deg,#ffffff,#ffe9ba)',
    color: '#9b3200',
    border: '3px solid #fff',
    borderRadius: 999,
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 rgba(111,39,0,.18)',
    textShadow: 'none',
  },
};

function Ball3D({ size = 56, style = {} }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        ...style,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        style={{
          display: 'block',
          filter: 'drop-shadow(0 6px 0 rgba(0,0,0,.18))',
        }}
      >
        <defs>
          <radialGradient id="basketBallOrange" cx="32%" cy="25%" r="72%">
            <stop offset="0%" stopColor="#ffb347" />
            <stop offset="48%" stopColor="#f47c20" />
            <stop offset="100%" stopColor="#c65312" />
          </radialGradient>
        </defs>

        {/* thân bóng */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#basketBallOrange)"
          stroke="#7a3510"
          strokeWidth="4"
        />

        {/* sọc ngang giữa */}
        <path
          d="M7 50 H93"
          fill="none"
          stroke="#6f2d0d"
          strokeWidth="4.2"
          strokeLinecap="round"
        />

        {/* sọc dọc giữa */}
        <path
          d="M50 6 V94"
          fill="none"
          stroke="#6f2d0d"
          strokeWidth="4.2"
          strokeLinecap="round"
        />

        {/* sọc cong trái */}
        <path
          d="M27 12 C38 30 38 70 27 88"
          fill="none"
          stroke="#6f2d0d"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* sọc cong phải */}
        <path
          d="M73 12 C62 30 62 70 73 88"
          fill="none"
          stroke="#6f2d0d"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* highlight nhẹ */}
        <ellipse
          cx="34"
          cy="25"
          rx="13"
          ry="8"
          fill="rgba(255,255,255,.22)"
          transform="rotate(-22 34 25)"
        />
      </svg>
    </div>
  );
}

function MonkeyPlayer() {
  return (
    <div style={S.monkeyWrap}>
      <svg viewBox="0 0 200 230" width="100%" height="100%">
        <ellipse cx="102" cy="207" rx="58" ry="14" fill="rgba(0,0,0,.16)" />

        <path
          d="M55 165 C20 145 21 104 52 104 C73 104 73 128 55 128 C43 128 37 119 43 111"
          fill="none"
          stroke="#7a3f1d"
          strokeWidth="14"
          strokeLinecap="round"
        />

        <g className="monkey-swing">
          <path
            d="M78 96 C58 76 43 68 35 78 C27 88 41 110 68 118"
            fill="none"
            stroke="#7a3f1d"
            strokeWidth="12"
            strokeLinecap="round"
          />

          <path
            d="M121 94 C139 76 159 70 166 82 C174 95 150 112 124 119"
            fill="none"
            stroke="#7a3f1d"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </g>

        <ellipse cx="100" cy="142" rx="48" ry="56" fill="#8b4d24" stroke="#5a2d13" strokeWidth="5" />
        <ellipse cx="101" cy="151" rx="30" ry="36" fill="#f3c58d" />

        <circle cx="100" cy="73" r="43" fill="#8b4d24" stroke="#5a2d13" strokeWidth="5" />
        <circle cx="59" cy="76" r="18" fill="#8b4d24" stroke="#5a2d13" strokeWidth="5" />
        <circle cx="141" cy="76" r="18" fill="#8b4d24" stroke="#5a2d13" strokeWidth="5" />
        <circle cx="59" cy="76" r="9" fill="#f3c58d" />
        <circle cx="141" cy="76" r="9" fill="#f3c58d" />

        <ellipse cx="100" cy="82" rx="31" ry="29" fill="#f3c58d" />
        <circle cx="88" cy="70" r="6" fill="#1f1209" />
        <circle cx="112" cy="70" r="6" fill="#1f1209" />

        <circle cx="90" cy="68" r="2" fill="#ffffff" />
        <circle cx="114" cy="68" r="2" fill="#ffffff" />

        <ellipse cx="100" cy="84" rx="8" ry="5" fill="#6b3518" />
        <path d="M84 93 Q100 108 116 93" fill="none" stroke="#6b3518" strokeWidth="4" strokeLinecap="round" />

        <path d="M84 196 L72 220" stroke="#5a2d13" strokeWidth="12" strokeLinecap="round" />
        <path d="M118 196 L130 220" stroke="#5a2d13" strokeWidth="12" strokeLinecap="round" />

        <path d="M88 35 C92 21 105 21 109 35" fill="none" stroke="#5a2d13" strokeWidth="5" strokeLinecap="round" />
        <path d="M92 31 C96 25 103 25 106 31" fill="none" stroke="#36b24a" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function Hoop3D({ shake }) {
  return (
    <div style={S.hoopWrap} className={shake ? 'bb-hoop-shake' : ''}>
      <svg viewBox="0 0 260 270" width="100%" height="100%">
        <defs>
          <linearGradient id="bbBoard" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.55" />
          </linearGradient>

          <linearGradient id="bbRim" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff9f43" />
            <stop offset="100%" stopColor="#f05b00" />
          </linearGradient>

          <filter id="bbShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="7" stdDeviation="1.6" floodColor="#000000" floodOpacity="0.22" />
          </filter>
        </defs>

        <rect
          x="40"
          y="12"
          width="178"
          height="126"
          rx="20"
          fill="url(#bbBoard)"
          stroke="#ffffff"
          strokeWidth="9"
          filter="url(#bbShadow)"
        />

        <rect
          x="104"
          y="47"
          width="62"
          height="46"
          rx="10"
          fill="none"
          stroke="rgba(245,90,0,.62)"
          strokeWidth="6"
        />

        <ellipse
          cx="135"
          cy="137"
          rx="72"
          ry="18"
          fill="rgba(0,0,0,.16)"
          opacity=".45"
        />

        <ellipse
          cx="135"
          cy="126"
          rx="78"
          ry="19"
          fill="url(#bbRim)"
          stroke="#ffffff"
          strokeWidth="7"
          filter="url(#bbShadow)"
        />

        <path
          d="M67 134 L88 228 L181 228 L203 134"
          fill="rgba(255,255,255,.12)"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity=".92"
        />

        <path d="M82 139 L103 228" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity=".9" />
        <path d="M107 140 L116 228" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity=".9" />
        <path d="M135 142 L135 228" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity=".9" />
        <path d="M163 140 L154 228" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity=".9" />
        <path d="M188 139 L167 228" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity=".9" />

        <path d="M80 160 L190 160" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity=".85" />
        <path d="M88 184 L181 184" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity=".85" />
        <path d="M98 207 L171 207" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity=".85" />

        <ellipse
          cx="135"
          cy="126"
          rx="77"
          ry="18"
          fill="none"
          stroke="#b53a00"
          strokeWidth="4"
          opacity=".65"
        />
      </svg>
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
      return undefined;
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

        <div
          style={{
            textAlign: 'center',
            color: '#fff',
            fontWeight: 900,
            fontSize: '1.1rem',
            textShadow: 'none',
          }}
        >
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
          <h2
            style={{
              color: '#d63031',
              margin: '0 0 18px',
              fontWeight: 900,
              fontSize: '1.55rem',
              textShadow: 'none',
            }}
          >
            {err}
          </h2>

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
          <h2
            style={{
              color: '#9b3200',
              fontSize: '2rem',
              fontWeight: 900,
              margin: '0 0 10px',
              textShadow: 'none',
            }}
          >
            Trận đấu kết thúc!
          </h2>

          <div
            style={{
              color: '#ff7a00',
              fontSize: '3rem',
              fontWeight: 900,
              textShadow: 'none',
            }}
          >
            {score}
          </div>

          <p
            style={{
              color: '#6b3a00',
              fontWeight: 800,
              marginBottom: 10,
              fontSize: '.95rem',
              textShadow: 'none',
            }}
          >
            {pack.length} câu · Tối đa {max} điểm · Đạt {pct}%
          </p>

          <div style={S.endButtons}>
            <button onClick={init} style={S.mainBtn}>
              Chơi lại
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
    <div style={S.page} className="basket-page">
      <style>{CSS}</style>

      <div style={S.topBar}>
        <button style={S.backBtn} onClick={() => history.push('/games')}>
          Về kho game
        </button>
      </div>

      <h1 style={S.title}>
        Ném Bóng Từ Vựng
      </h1>

      <div style={S.statBar}>
        <span style={S.stat}>Câu {cur + 1}/{pack.length}</span>
        <span style={S.stat}>{score} điểm</span>
        <span
          style={{
            ...S.stat,
            color: timer > 5 ? '#0b7a35' : timer > 3 ? '#9b5200' : '#b91c1c',
          }}
        >
          {timer}s
        </span>
      </div>

      <div style={S.mainLayout} className="basket-main-layout">
        <div style={S.arena} className="basket-arena">
          <div style={S.arenaDots} />
          <div style={S.streakLine} />
          <div style={S.streakLine2} />

          <div style={S.arenaText}>
            KHỈ
            <br />
            NÉM RỔ
          </div>

          <Hoop3D shake={shake} />

          <MonkeyPlayer />

          {!showBall && (
            <Ball3D
              size={56}
              style={{
                position: 'absolute',
                left: '29%',
                bottom: 118,
                zIndex: 11,
              }}
            />
          )}

          {showBall && (
            <div className="bb-ball-fly">
              <Ball3D size={56} />
            </div>
          )}

          <div style={S.floorLine} />
        </div>

        <div style={S.sidePanel}>
          <div style={S.timerOuter}>
            <div style={S.timerInner(pct)} />
          </div>

          <div style={S.questionBox}>
            <div style={S.questionLabel}>Từ nào có nghĩa là</div>

            <div style={S.questionText}>
              “{item?.mean}”
            </div>
          </div>

          <div style={S.choices} className="basket-choices">
            {choices.map((c, i) => {
              const st = getState(c);

              const background =
                st === 'correct'
                  ? 'linear-gradient(180deg,#d8ffe8,#8df0b3)'
                  : st === 'wrong'
                  ? 'linear-gradient(180deg,#ffe1e1,#ffaaaa)'
                  : st === 'dim'
                  ? 'linear-gradient(180deg,#eef2f6,#d5dde6)'
                  : i === 0
                  ? 'linear-gradient(180deg,#ffe6e6,#ffb8b8)'
                  : i === 1
                  ? 'linear-gradient(180deg,#e5f2ff,#b8dcff)'
                  : i === 2
                  ? 'linear-gradient(180deg,#ddffe9,#aaf2c4)'
                  : 'linear-gradient(180deg,#fff4cc,#ffe08a)';

              const textColor =
                st === 'correct'
                  ? '#075c2c'
                  : st === 'wrong'
                  ? '#8a1111'
                  : st === 'dim'
                  ? '#64748b'
                  : '#4a2100';

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(c)}
                  disabled={status !== 'playing'}
                  style={S.choiceBtn(background, st, textColor)}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {status === 'animating' && selected && (
            <div style={S.feedback(selectedOk)}>
              {selectedOk
                ? 'Chính xác! Bóng vào rổ!'
                : selected === '__timeout__'
                ? `Hết giờ! Đáp án: "${item.word}"`
                : `Sai rồi! Đáp án: "${item.word}"`}
            </div>
          )}
        </div>
      </div>
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
    return <GameSetup title="Ném Bóng Từ Vựng — Chọn chủ đề" onStart={handleStart} />;
  }

  return <BasketballQuizGame packInfo={packInfo} wordList={wordList} />;
}

export default BasketballPage;