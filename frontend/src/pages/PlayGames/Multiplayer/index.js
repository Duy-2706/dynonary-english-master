import gameApi from 'apis/gameApi';
import gameRoomApi from 'apis/gameRoomApi';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateGuestId() {
  const id = 'guest_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('dyno_guest_id', id);
  return id;
}

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';

const AVATARS = ['🦁', '🐸', '🦊', '🐼', '🐨', '🦄', '🐯', '🦋', '🐙', '🦕'];

function pickAvatar(uid) {
  let hash = 0;
  for (let i = 0; i < uid.length; i++) hash = uid.charCodeAt(i) + ((hash << 5) - hash);
  return AVATARS[Math.abs(hash) % AVATARS.length];
}

function getMedal(index) {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  if (index === 2) return '🥉';
  return `${index + 1}.`;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 14% 18%, rgba(25,199,168,.18) 0 4px, transparent 5px),
      radial-gradient(circle at 82% 22%, rgba(255,138,0,.16) 0 5px, transparent 6px),
      radial-gradient(circle at 28% 72%, rgba(255,20,147,.12) 0 4px, transparent 5px),
      linear-gradient(180deg, #05090d 0%, #071217 45%, #05090d 100%)
    `,
    backgroundSize: '90px 90px, 130px 130px, 110px 110px, auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 18px',
    fontFamily: GAME_FONT,
    color: '#f6fffd',
    boxSizing: 'border-box',
  },

  card: {
    background: 'linear-gradient(180deg, rgba(18,31,38,.98), rgba(10,19,24,.98))',
    border: '6px solid rgba(25,199,168,.65)',
    borderRadius: 38,
    padding: '46px 42px',
    width: '100%',
    maxWidth: 680,
    boxShadow: '0 14px 0 rgba(25,199,168,.25), 0 32px 68px rgba(0,0,0,.55)',
  },

  title: {
    color: '#ffffff',
    fontSize: 'clamp(3.2rem, 5.8vw, 5.2rem)',
    fontWeight: 900,
    textAlign: 'center',
    margin: '0 0 36px',
    lineHeight: 0.95,
    letterSpacing: '.2px',
    textShadow: '0 6px 0 rgba(25,199,168,.38), 0 14px 28px rgba(0,0,0,.6)',
  },

  label: {
    color: '#ffffff',
    fontSize: '1.35rem',
    marginBottom: 12,
    display: 'block',
    fontWeight: 900,
    textShadow: '0 2px 0 rgba(0,0,0,.35)',
  },

  input: {
    width: '100%',
    padding: '21px 24px',
    borderRadius: 24,
    border: '4px solid rgba(25,199,168,.7)',
    background: '#071217',
    color: '#ffffff',
    fontSize: '1.35rem',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 26,
    fontFamily: GAME_FONT,
    fontWeight: 900,
    boxShadow: '0 8px 0 rgba(25,199,168,.16)',
  },

  inputFocus: {
    borderColor: '#ffdf3b',
    boxShadow: '0 8px 0 rgba(255,138,0,.25), 0 0 0 5px rgba(255,223,59,.16)',
  },

  btn: (bg, disabled) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '20px 30px',
    borderRadius: 999,
    border: '5px solid #fff',
    background: disabled ? '#4b5563' : bg,
    color: '#fff',
    fontWeight: 900,
    fontSize: '1.35rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: '100%',
    marginTop: 8,
    opacity: disabled ? 0.7 : 1,
    fontFamily: GAME_FONT,
    textShadow: '0 3px 0 rgba(0,0,0,.28)',
    boxShadow: disabled ? 'none' : '0 10px 0 rgba(0,0,0,.32), 0 20px 36px rgba(0,0,0,.35)',
  }),

  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    margin: '34px 0',
    color: '#d8fffa',
    fontSize: '1.22rem',
    fontWeight: 900,
  },

  dividerLine: {
    flex: 1,
    height: 3,
    background: 'rgba(25,199,168,.38)',
    borderRadius: 999,
  },

  row: {
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
  },

  pinDisplay: {
    fontFamily: 'monospace',
    fontSize: '4.2rem',
    fontWeight: 900,
    color: '#ffffff',
    letterSpacing: '0.28em',
    textAlign: 'center',
    margin: '18px 0 10px',
    textShadow: '0 6px 0 #bd5f00, 0 0 26px rgba(247,183,49,.48)',
  },

  pinHint: {
    textAlign: 'center',
    color: '#d8fffa',
    fontSize: '1.2rem',
    marginBottom: 32,
    fontWeight: 900,
  },

  sectionTitle: {
    color: '#ffffff',
    fontSize: '1.35rem',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 18,
  },

  playerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '17px 20px',
    borderRadius: 22,
    background: 'linear-gradient(180deg,#111e25,#091217)',
    marginBottom: 14,
    border: '4px solid rgba(10,132,255,.45)',
    boxShadow: '0 8px 0 rgba(10,132,255,.16)',
  },

  playerAvatar: {
    fontSize: '2.2rem',
  },

  playerName: {
    color: '#ffffff',
    fontWeight: 900,
    flex: 1,
    fontSize: '1.35rem',
  },

  hostBadge: {
    background: 'linear-gradient(180deg,#ff4fa3,#c40075)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 900,
    padding: '6px 14px',
    borderRadius: 999,
    letterSpacing: '.3px',
    border: '3px solid #fff',
    boxShadow: '0 5px 0 #7c004b',
  },

  errorMsg: {
    color: '#ffb7b7',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: 18,
    minHeight: 26,
    fontWeight: 900,
  },

  questionBox: {
    background: 'linear-gradient(180deg,#111e25,#091217)',
    borderRadius: 32,
    padding: '34px 30px',
    textAlign: 'center',
    marginBottom: 28,
    border: '5px solid rgba(10,132,255,.48)',
    boxShadow: '0 10px 0 rgba(10,132,255,.18), 0 22px 42px rgba(0,0,0,.36)',
  },

  questionMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    color: '#d8fffa',
    fontSize: '1.3rem',
    fontWeight: 900,
    gap: 14,
    flexWrap: 'wrap',
  },

  questionMean: {
    fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
    fontWeight: 900,
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 1.15,
    textShadow: '0 5px 0 rgba(0,0,0,.32)',
  },

  choicesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 18,
    marginBottom: 28,
  },

  choiceBtn: (state) => {
    const base = {
      padding: '24px 16px',
      borderRadius: 28,
      border: '5px solid #fff',
      fontWeight: 900,
      fontSize: '1.4rem',
      cursor: state === 'idle' ? 'pointer' : 'default',
      width: '100%',
      fontFamily: GAME_FONT,
      color: '#fff',
      textShadow: '0 3px 0 rgba(0,0,0,.28)',
      boxShadow: '0 9px 0 rgba(0,0,0,.3)',
      transition: 'transform .18s ease, filter .18s ease',
    };

    if (state === 'correct') {
      return {
        ...base,
        background: 'linear-gradient(180deg,#36e27d,#0ca84f)',
        borderColor: '#fff',
      };
    }

    if (state === 'wrong') {
      return {
        ...base,
        background: 'linear-gradient(180deg,#ff6b6b,#d63031)',
        borderColor: '#fff',
      };
    }

    if (state === 'dim') {
      return {
        ...base,
        background: 'linear-gradient(180deg,#475569,#1f2937)',
        borderColor: '#8da3b8',
        color: '#d7e2ee',
      };
    }

    return {
      ...base,
      background: 'linear-gradient(180deg,#14252d,#0d1a20)',
      borderColor: '#ff4fa3',
      color: '#ffffff',
      boxShadow: '0 9px 0 rgba(255,20,147,.24), 0 16px 28px rgba(0,0,0,.3)',
    };
  },

  timerBar: (pct) => ({
    height: 18,
    borderRadius: 999,
    background: `linear-gradient(to right, ${
      pct > 50 ? '#36e27d' : pct > 20 ? '#ffdf3b' : '#ff4fa3'
    } ${pct}%, #1f2937 ${pct}%)`,
    marginBottom: 10,
    border: '3px solid rgba(255,255,255,.18)',
    boxShadow: '0 6px 0 rgba(0,0,0,.22)',
    transition: 'background 0.5s',
  }),

  timerText: (pct) => ({
    textAlign: 'right',
    fontSize: '1.2rem',
    color: pct > 50 ? '#72ffad' : pct > 20 ? '#ffdf3b' : '#ff8abf',
    marginBottom: 24,
    fontWeight: 900,
  }),

  leaderboardRow: (rank) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '16px 20px',
    borderRadius: 22,
    background:
      rank === 0
        ? 'linear-gradient(180deg, rgba(247,183,49,.22), rgba(39,25,0,.9))'
        : rank === 1
        ? 'linear-gradient(180deg, rgba(192,192,192,.15), rgba(17,30,37,.94))'
        : 'linear-gradient(180deg, rgba(205,127,50,.15), rgba(17,30,37,.94))',
    marginBottom: 12,
    border: `4px solid ${
      rank === 0 ? 'rgba(247,183,49,.6)' : rank === 1 ? 'rgba(192,192,192,.4)' : 'rgba(205,127,50,.4)'
    }`,
    boxShadow: '0 8px 0 rgba(0,0,0,.22)',
  }),

  resultRow: (rank) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    padding: '19px 20px',
    borderRadius: 26,
    background:
      rank === 0
        ? 'linear-gradient(180deg, rgba(247,183,49,.24), rgba(39,25,0,.9))'
        : 'linear-gradient(180deg,#111e25,#091217)',
    marginBottom: 16,
    border: `4px solid ${rank === 0 ? '#f7b731' : 'rgba(10,132,255,.45)'}`,
    boxShadow: '0 8px 0 rgba(0,0,0,.22)',
  }),

  myScoreBox: {
    background: 'linear-gradient(180deg, rgba(255,79,163,.2), rgba(17,30,37,.94))',
    border: '4px solid #ff4fa3',
    borderRadius: 28,
    padding: '24px',
    textAlign: 'center',
    margin: '28px 0',
    color: '#fff',
    fontSize: '1.4rem',
    fontWeight: 900,
    boxShadow: '0 9px 0 rgba(255,20,147,.2)',
  },

  rowBtns: {
    display: 'flex',
    gap: 18,
  },

  tabRow: {
    display: 'flex',
    border: '4px solid rgba(25,199,168,.5)',
    borderRadius: 999,
    marginBottom: 34,
    padding: 7,
    background: '#071217',
    boxShadow: '0 8px 0 rgba(25,199,168,.14)',
  },

  tab: (active) => ({
    flex: 1,
    padding: '18px 12px',
    fontWeight: 900,
    fontSize: '1.22rem',
    background: active
      ? 'linear-gradient(180deg,#ffdf3b,#ff8a00)'
      : 'transparent',
    border: active ? '4px solid #fff' : '4px solid transparent',
    cursor: 'pointer',
    color: active ? '#fff' : '#d8fffa',
    borderRadius: 999,
    fontFamily: GAME_FONT,
    textShadow: active ? '0 3px 0 rgba(0,0,0,.25)' : 'none',
    boxShadow: active ? '0 7px 0 #bd5f00' : 'none',
  }),

  soloInfoBox: {
    background: 'linear-gradient(180deg,#111e25,#091217)',
    borderRadius: 28,
    padding: '24px 26px',
    marginBottom: 24,
    border: '5px solid rgba(10,132,255,.48)',
    boxShadow: '0 9px 0 rgba(10,132,255,.16)',
  },

  progressBar: (pct) => ({
    height: 14,
    borderRadius: 999,
    background: `linear-gradient(to right, #ff4fa3 ${pct}%, #1f2937 ${pct}%)`,
    marginBottom: 7,
    border: '3px solid rgba(255,255,255,.16)',
  }),

  coinBox: {
    background: 'linear-gradient(180deg, rgba(247,183,49,.18), rgba(39,25,0,.9))',
    border: '4px solid #f7b731',
    borderRadius: 26,
    padding: '18px 22px',
    textAlign: 'center',
    marginTop: 18,
    color: '#ffdf3b',
    fontWeight: 900,
    fontSize: '1.35rem',
    boxShadow: '0 9px 0 rgba(189,120,0,.24)',
  },

  resumeBanner: {
    background: 'linear-gradient(180deg,#123a2b,#0b241b)',
    border: '4px solid #36e27d',
    borderRadius: 22,
    padding: '14px 18px',
    marginBottom: 18,
    fontSize: '1.22rem',
    color: '#72ffad',
    textAlign: 'center',
    fontWeight: 900,
  },

  attemptRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    padding: '14px 16px',
    borderRadius: 20,
    background: 'linear-gradient(180deg,#111e25,#091217)',
    marginBottom: 10,
    fontSize: '1.08rem',
    border: '4px solid rgba(10,132,255,.34)',
    fontWeight: 900,
    flexWrap: 'wrap',
  },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TimerBar({ timer, total = 20 }) {
  const pct = Math.round((timer / total) * 100);

  return (
    <>
      <div style={S.timerBar(pct)} />
      <p style={S.timerText(pct)}>⏱️ {timer}s</p>
    </>
  );
}

function Leaderboard({ players, guestId }) {
  const sorted = Object.entries(players || {}).sort((a, b) => b[1].score - a[1].score);

  return (
    <div>
      <p style={S.sectionTitle}>👤 Xếp hạng live</p>

      {sorted.map(([uid, p], i) => (
        <div key={uid} style={S.leaderboardRow(i)}>
          <span style={{ fontSize: '1.45rem', minWidth: 34 }}>{getMedal(i)}</span>

          <span style={{ fontSize: '1.45rem' }}>{p.avatar || pickAvatar(uid)}</span>

          <span
            style={{
              color: uid === guestId ? '#ffdf3b' : '#fff',
              fontWeight: 900,
              flex: 1,
              fontSize: '1.05rem',
            }}
          >
            {p.name}
          </span>

          <span style={{ color: '#ffdf3b', fontWeight: 900 }}>{p.score} pts</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

function MultiplayerPage() {
  const history = useHistory();
  const location = useLocation();
  const userInfo = useSelector((state) => state.userInfo);
  const isLoggedIn = Boolean(userInfo?.isAuth);
  const [isHostOverride, setIsHostOverride] = useState(false);

  const [guestId] = useState(() => {
    if (isLoggedIn && userInfo?.accountId) return userInfo.accountId;

    const stored = localStorage.getItem('dyno_guest_id');
    if (stored) return stored;

    return generateGuestId();
  });

  const [tab, setTab] = useState('live');

  const [view, setView] = useState('lobby');
  const [guestName, setGuestName] = useState(
    () => userInfo?.name || localStorage.getItem('dyno_guest_name') || ''
  );
  const [pin, setPin] = useState('');
  const [joinPin, setJoinPin] = useState('');
  const [room, setRoom] = useState(null);
  const [myScore, setMyScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  const [roomCode, setRoomCode] = useState('');
  const [soloRoom, setSoloRoom] = useState(null);
  const [soloView, setSoloView] = useState('enter');
  const [soloSession, setSoloSession] = useState(null);
  const [soloQIndex, setSoloQIndex] = useState(0);
  const [soloScore, setSoloScore] = useState(0);
  const [soloCorrect, setSoloCorrect] = useState(0);
  const [soloIncorrect, setSoloIncorrect] = useState(0);
  const [soloSelected, setSoloSelected] = useState(null);
  const [soloSubmitted, setSoloSubmitted] = useState(false);
  const [soloTimer, setSoloTimer] = useState(20);
  const [attempts, setAttempts] = useState([]);
  const [soloCoinsEarned, setSoloCoinsEarned] = useState(0);
  const [resumed, setResumed] = useState(false);

  const prevQuestionRef = useRef(0);
  const timerRef = useRef(null);
  const pollRef = useRef(null);
  const answerStartRef = useRef(Date.now());
  const soloTimerRef = useRef(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    setTimer(20);
    answerStartRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }

        return t - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startSoloTimer = useCallback((limit = 20) => {
    if (soloTimerRef.current) clearInterval(soloTimerRef.current);

    setSoloTimer(limit);
    answerStartRef.current = Date.now();

    soloTimerRef.current = setInterval(() => {
      setSoloTimer((t) => {
        if (t <= 1) {
          clearInterval(soloTimerRef.current);
          setSoloSubmitted(true);
          return 0;
        }

        return t - 1;
      });
    }, 1000);
  }, []);

  const stopSoloTimer = useCallback(() => {
    if (soloTimerRef.current) clearInterval(soloTimerRef.current);
  }, []);

  const fetchRoom = useCallback(async (roomPin) => {
    try {
      const res = await gameApi.getRoom(roomPin);
      return res.data.room;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (view !== 'waiting' && view !== 'playing') return undefined;

    const roomPin = pin;

    pollRef.current = setInterval(async () => {
      const data = await fetchRoom(roomPin);
      if (!data) return;

      setRoom((prev) => {
        if (view === 'playing' && prev && data.currentQuestion !== prevQuestionRef.current) {
          prevQuestionRef.current = data.currentQuestion;
          setSelectedAnswer(null);
          setSubmitted(false);
          startTimer();
        }

        return data;
      });

      if (data.status === 'playing' && view === 'waiting') {
        prevQuestionRef.current = data.currentQuestion;
        setView('playing');
        startTimer();
      }

      if (data.status === 'ended') {
        clearInterval(pollRef.current);
        stopTimer();
        setView('results');
      }

      if (data.players && data.players[guestId]) {
        setMyScore(data.players[guestId].score);
      }
    }, 2000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [view, pin, fetchRoom, guestId, startTimer, stopTimer]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
      if (soloTimerRef.current) clearInterval(soloTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const state = location.state;
    if (!state?.pin) return;

    const initFromState = async () => {
      setPin(state.pin);
      setIsHostOverride(true);

      if (state.isHost) {
        try {
          const res = await gameApi.getRoom(state.pin);
          const roomData = res.data.room;

          if (roomData) {
            setRoom(roomData);
            setView('waiting');
          }
        } catch {}
      } else {
        setJoinPin(state.pin);
      }
    };

    initFromState();
  }, [location.state]);

  const saveName = (name) => localStorage.setItem('dyno_guest_name', name);

  const handleCreateRoom = async () => {
    if (!guestName.trim()) {
      setError('Bạn chưa nhập tên!');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const packRes = await gameApi.getWordPackCWG();
      const wordPack = packRes.data.wordPack;

      const res = await gameApi.createRoom({
        hostId: guestId,
        hostName: guestName.trim(),
        gameType: 'mcq',
        wordPack,
      });

      const created = res.data.room;

      setRoom(created);
      setPin(created.pin);
      saveName(guestName.trim());
      setView('waiting');
    } catch {
      setError('Không thể tạo phòng. Thử lại nhé!');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!guestName.trim()) {
      setError('Bạn chưa nhập tên!');
      return;
    }

    if (!joinPin.trim()) {
      setError('Nhập mã phòng đi bạn!');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await gameApi.joinRoom({
        pin: joinPin.trim(),
        userId: guestId,
        userName: guestName.trim(),
      });

      const joined = res.data.room;

      setRoom(joined);
      setPin(joined.pin || joinPin.trim());
      saveName(guestName.trim());
      setView('waiting');
    } catch {
      setError('Không tìm thấy phòng. Kiểm tra mã lại nhé!');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    if (!room) return;

    setLoading(true);

    try {
      const hostId = isHostOverride ? room.hostId || guestId : guestId;
      await gameApi.startRoom({ roomId: room.id, hostId });
    } catch {
      setError('Không thể bắt đầu. Thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (choice) => {
    if (submitted || !room) return;

    const timeMs = Date.now() - answerStartRef.current;

    setSelectedAnswer(choice);
    setSubmitted(true);
    stopTimer();

    try {
      await gameApi.submitAnswer({
        pin,
        userId: guestId,
        questionIndex: room.currentQuestion,
        answer: choice,
        timeMs,
      });
    } catch {}
  };

  const handleNextQuestion = async () => {
    if (!room) return;

    setLoading(true);

    try {
      const hostId = isHostOverride ? room.hostId || guestId : guestId;
      await gameApi.nextQuestion({ roomId: room.id, hostId });
    } catch {
      setError('Không thể chuyển câu. Thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAgain = () => {
    setView('lobby');
    setRoom(null);
    setPin('');
    setJoinPin('');
    setSelectedAnswer(null);
    setSubmitted(false);
    setMyScore(0);
    setError('');
    prevQuestionRef.current = 0;
  };

  const handleEnterSoloRoom = async () => {
    if (!roomCode.trim()) {
      setError('Nhập mã phòng!');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await gameRoomApi.getRoomByCode(roomCode.trim().toUpperCase());
      const foundRoom = res.data.room;

      if (!foundRoom.questions?.length) {
        setError('Phòng này chưa có câu hỏi nào.');
        setLoading(false);
        return;
      }

      setSoloRoom(foundRoom);

      if (isLoggedIn) {
        try {
          const aRes = await gameRoomApi.getAttempts(foundRoom.roomCode);
          setAttempts(aRes.data.attempts || []);
        } catch {
          setAttempts([]);
        }
      }
    } catch {
      setError('Không tìm thấy phòng. Kiểm tra mã lại nhé!');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSolo = async () => {
    if (!soloRoom) return;

    setLoading(true);

    try {
      let session = null;
      let resumedFlag = false;

      if (isLoggedIn) {
        const res = await gameRoomApi.startOrResumeProgress({
          roomCode: soloRoom.roomCode,
          totalQuestions: soloRoom.questions.length,
        });

        session = res.data.session;
        resumedFlag = res.data.resumed;

        setSoloSession(session);
        setResumed(resumedFlag);
        setSoloQIndex(session.currentQuestion || 0);
        setSoloScore(session.score || 0);
        setSoloCorrect(session.correctCount || 0);
        setSoloIncorrect(session.incorrectCount || 0);
      } else {
        setSoloQIndex(0);
        setSoloScore(0);
        setSoloCorrect(0);
        setSoloIncorrect(0);
      }

      setSoloSelected(null);
      setSoloSubmitted(false);
      setSoloView('playing');
      startSoloTimer(soloRoom.questions[session?.currentQuestion || 0]?.timeLimit || 20);
    } catch {
      setError('Lỗi khi bắt đầu. Thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleSoloAnswer = async (choice) => {
    if (soloSubmitted || !soloRoom) return;

    stopSoloTimer();
    setSoloSelected(choice);
    setSoloSubmitted(true);

    const currentQ = soloRoom.questions[soloQIndex];
    const isCorrect =
      choice.trim().toLowerCase() === (currentQ.answer || '').trim().toLowerCase();

    const elapsed = Math.min(Date.now() - answerStartRef.current, 20000);
    const speedRatio = 1 - elapsed / 20000;
    const gain = isCorrect ? Math.round(500 + 500 * speedRatio) : 0;
    const newScore = soloScore + gain;
    const newCorrect = soloCorrect + (isCorrect ? 1 : 0);
    const newIncorrect = soloIncorrect + (isCorrect ? 0 : 1);

    setSoloScore(newScore);
    setSoloCorrect(newCorrect);
    setSoloIncorrect(newIncorrect);

    if (isLoggedIn && soloSession) {
      try {
        await gameRoomApi.updateProgress(soloSession.id, {
          currentQuestion: soloQIndex,
          score: newScore,
          correctCount: newCorrect,
          incorrectCount: newIncorrect,
        });
      } catch {}
    }
  };

  const handleSoloNext = async () => {
    const nextIdx = soloQIndex + 1;
    const total = soloRoom?.questions?.length || 0;

    if (nextIdx >= total) {
      if (isLoggedIn && soloSession) {
        try {
          const res = await gameRoomApi.completeProgress(soloSession.id);
          setSoloCoinsEarned(res.data?.coinsAwarded || 0);

          const aRes = await gameRoomApi.getAttempts(soloRoom.roomCode);
          setAttempts(aRes.data.attempts || []);
        } catch {}
      }

      stopSoloTimer();
      setSoloView('results');
      return;
    }

    const nextQ = soloRoom.questions[nextIdx];

    setSoloQIndex(nextIdx);
    setSoloSelected(null);
    setSoloSubmitted(false);
    startSoloTimer(nextQ?.timeLimit || 20);

    if (isLoggedIn && soloSession) {
      try {
        await gameRoomApi.updateProgress(soloSession.id, {
          currentQuestion: nextIdx,
        });
      } catch {}
    }
  };

  const handleSoloRestart = () => {
    setSoloView('enter');
    setSoloRoom(null);
    setSoloSession(null);
    setSoloQIndex(0);
    setSoloScore(0);
    setSoloCorrect(0);
    setSoloIncorrect(0);
    setSoloSelected(null);
    setSoloSubmitted(false);
    setSoloCoinsEarned(0);
    setResumed(false);
    setRoomCode('');
  };

  const currentQ = room?.questions?.[room.currentQuestion] || null;
  const isHost = (room && room.hostId === guestId) || isHostOverride;

  const getChoiceState = (choice) => {
    if (!submitted) return 'idle';
    if (currentQ && choice === currentQ.correct) return 'correct';
    if (choice === selectedAnswer) return 'wrong';
    return 'dim';
  };

  const getSoloChoiceState = (choice) => {
    if (!soloSubmitted) return 'idle';

    const correct = soloRoom?.questions?.[soloQIndex]?.answer;

    if (choice === correct) return 'correct';
    if (choice === soloSelected) return 'wrong';

    return 'dim';
  };

  const inputStyle = (name) => ({
    ...S.input,
    ...(focusedInput === name ? S.inputFocus : {}),
  });

  if (tab === 'solo') {
    if (soloView === 'enter') {
      return (
        <div style={S.page}>
          <div style={S.card}>
            <h1 style={S.title}>📚 Luyện Tập</h1>

            <div style={S.tabRow}>
              <button style={S.tab(false)} onClick={() => setTab('live')}>
                🔴 Phòng trực tiếp
              </button>

              <button style={S.tab(true)}>📚 Luyện tập</button>
            </div>

            {soloRoom ? (
              <>
                <div style={S.soloInfoBox}>
                  <div
                    style={{
                      color: '#fff',
                      fontWeight: 900,
                      fontSize: '1.35rem',
                      marginBottom: 6,
                      lineHeight: 1.2,
                    }}
                  >
                    {soloRoom.title}
                  </div>

                  {soloRoom.teacherName && (
                    <div style={{ color: '#b7d8d4', fontSize: '1rem', fontWeight: 850 }}>
                      👨‍🏫 {soloRoom.teacherName}
                    </div>
                  )}

                  <div style={{ color: '#ffdf3b', fontSize: '1rem', marginTop: 7, fontWeight: 900 }}>
                    {soloRoom.questions?.length || 0} câu hỏi
                  </div>
                </div>

                {attempts.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={S.sectionTitle}>Lịch sử lần chơi</p>

                    {attempts.slice(-3).map((a) => (
                      <div key={a.id} style={S.attemptRow}>
                        <span style={{ color: '#b7d8d4' }}>Lần {a.attemptNumber}</span>
                        <span style={{ color: '#72ffad' }}>{a.correctCount || 0} đúng</span>
                        <span style={{ color: '#ff8abf' }}>{a.incorrectCount || 0} sai</span>
                        <span style={{ color: '#ffdf3b' }}>{a.score || 0} pts</span>
                        <span style={{ color: a.status === 'completed' ? '#72ffad' : '#ffdf3b' }}>
                          {a.status === 'completed' ? '✅' : '⏳'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {!isLoggedIn && (
                  <p
                    style={{
                      color: '#ffdf3b',
                      fontSize: '1rem',
                      marginBottom: 14,
                      textAlign: 'center',
                      fontWeight: 900,
                    }}
                  >
                    ⚠️ Đăng nhập để lưu tiến độ và nhận xu
                  </p>
                )}

                <button
                  style={S.btn('linear-gradient(180deg,#ffdf3b,#ff8a00)', loading)}
                  onClick={handleStartSolo}
                  disabled={loading}
                >
                  🚀 Bắt đầu luyện tập
                </button>

                <button
                  style={{
                    ...S.btn('linear-gradient(180deg,#14252d,#0d1a20)', false),
                    marginTop: 10,
                    border: '4px solid rgba(25,199,168,.7)',
                    boxShadow: '0 7px 0 rgba(25,199,168,.14)',
                  }}
                  onClick={() => {
                    setSoloRoom(null);
                    setRoomCode('');
                  }}
                >
                  ← Đổi phòng
                </button>
              </>
            ) : (
              <>
                <label style={S.label}>Mã phòng của giáo viên:</label>

                <input
                  style={inputStyle('roomCode')}
                  placeholder="VD: ABC123"
                  value={roomCode}
                  maxLength={8}
                  onFocus={() => setFocusedInput('roomCode')}
                  onBlur={() => setFocusedInput(null)}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleEnterSoloRoom()}
                />

                <button
                  style={S.btn('linear-gradient(180deg,#ffdf3b,#ff8a00)', loading)}
                  onClick={handleEnterSoloRoom}
                  disabled={loading}
                >
                  🔍 Tìm phòng
                </button>
              </>
            )}

            {error && <p style={S.errorMsg}>⚠️ {error}</p>}
          </div>
        </div>
      );
    }

    if (soloView === 'playing' && soloRoom) {
      const totalQ = soloRoom.questions.length;
      const currentSoloQ = soloRoom.questions[soloQIndex];
      const progressPct = Math.round((soloQIndex / totalQ) * 100);

      return (
        <div style={S.page}>
          <div style={{ ...S.card, maxWidth: 660 }}>
            <div style={S.questionMeta}>
              <span style={{ color: '#ffdf3b' }}>📚 {soloRoom.title}</span>
              <span style={{ color: '#ff4fa3' }}>⭐ {soloScore} pts</span>
            </div>

            {resumed && <div style={S.resumeBanner}>↩️ Tiếp tục từ câu {soloQIndex + 1}</div>}

            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1rem',
                  color: '#b7d8d4',
                  marginBottom: 6,
                  fontWeight: 900,
                }}
              >
                <span>Câu {soloQIndex + 1}/{totalQ}</span>
                <span>{progressPct}%</span>
              </div>

              <div style={S.progressBar(progressPct)} />
            </div>

            <TimerBar timer={soloTimer} total={currentSoloQ?.timeLimit || 20} />

            <div style={S.questionBox}>
              <p style={{ color: '#b7d8d4', fontSize: '1.05rem', marginBottom: 9, fontWeight: 900 }}>
                Đáp án là gì?
              </p>

              <p style={S.questionMean}>"{currentSoloQ.question}"</p>

              {currentSoloQ.hint && (
                <p style={{ color: '#ffdf3b', fontSize: '1.05rem', margin: 0, fontWeight: 900 }}>
                  💡 {currentSoloQ.hint}
                </p>
              )}
            </div>

            <div style={S.choicesGrid}>
              {(currentSoloQ.choices || []).map((choice) => (
                <button
                  key={choice}
                  style={S.choiceBtn(soloSubmitted ? getSoloChoiceState(choice) : 'idle')}
                  onClick={() => handleSoloAnswer(choice)}
                  disabled={soloSubmitted}
                >
                  {choice}
                </button>
              ))}
            </div>

            {soloSubmitted && (
              <p
                style={{
                  textAlign: 'center',
                  color: soloSelected === currentSoloQ.answer ? '#72ffad' : '#ff8abf',
                  fontWeight: 900,
                  marginBottom: 14,
                  fontSize: '1.12rem',
                }}
              >
                {soloSelected === currentSoloQ.answer
                  ? '🎉 Chính xác!'
                  : `😅 Sai rồi! Đáp án: ${currentSoloQ.answer}`}
              </p>
            )}

            {soloSubmitted && (
              <button
                style={S.btn('linear-gradient(180deg,#ffdf3b,#ff8a00)', false)}
                onClick={handleSoloNext}
              >
                {soloQIndex + 1 >= totalQ ? '🏁 Kết thúc' : '→ Câu tiếp theo'}
              </button>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: 18,
                fontSize: '1rem',
                fontWeight: 900,
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <span style={{ color: '#72ffad' }}>✅ {soloCorrect} đúng</span>
              <span style={{ color: '#ff8abf' }}>❌ {soloIncorrect} sai</span>
              <span style={{ color: '#b7d8d4' }}>📊 {totalQ - soloQIndex - 1} còn lại</span>
            </div>
          </div>
        </div>
      );
    }

    if (soloView === 'results') {
      const totalQ = soloRoom?.questions?.length || 0;
      const pct = totalQ > 0 ? Math.round((soloCorrect / totalQ) * 100) : 0;

      return (
        <div style={S.page}>
          <div style={S.card}>
            <h1 style={S.title}>🏆 Kết Quả Luyện Tập</h1>

            <div style={S.myScoreBox}>
              <div
                style={{
                  fontSize: '4rem',
                  fontWeight: 900,
                  color: '#ffdf3b',
                  lineHeight: 1,
                  textShadow: '0 4px 0 #bd5f00',
                }}
              >
                {pct}%
              </div>

              <div style={{ color: '#d8fffa', fontSize: '1.08rem', marginTop: 10, fontWeight: 900 }}>
                {pct === 100
                  ? '🏆 Xuất sắc! Trả lời đúng tất cả!'
                  : pct >= 70
                  ? '🎉 Rất tốt!'
                  : '💪 Cố gắng thêm nhé!'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
              {[
                { label: '✅ Đúng', val: soloCorrect, color: '#72ffad' },
                { label: '❌ Sai', val: soloIncorrect, color: '#ff8abf' },
                { label: '⭐ Điểm', val: soloScore, color: '#ffdf3b' },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(180deg,#111e25,#091217)',
                    borderRadius: 18,
                    padding: '14px 8px',
                    textAlign: 'center',
                    border: '3px solid rgba(10,132,255,.42)',
                    boxShadow: '0 6px 0 rgba(10,132,255,.14)',
                  }}
                >
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color }}>{s.val}</div>
                  <div style={{ color: '#b7d8d4', fontSize: '.9rem', fontWeight: 900 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {isLoggedIn && soloCoinsEarned > 0 && (
              <div style={S.coinBox}>
                🪙 Bạn nhận được <span style={{ fontSize: '1.25rem' }}>{soloCoinsEarned} xu</span>!
              </div>
            )}

            {!isLoggedIn && (
              <p style={{ color: '#ffdf3b', fontSize: '1rem', textAlign: 'center', marginTop: 12, fontWeight: 900 }}>
                Đăng nhập để nhận xu và lưu kết quả
              </p>
            )}

            <div style={{ ...S.rowBtns, marginTop: 24 }}>
              <button
                style={{ ...S.btn('linear-gradient(180deg,#ffdf3b,#ff8a00)', false), flex: 1 }}
                onClick={handleSoloRestart}
              >
                🔄 Chơi lại
              </button>

              <button
                style={{
                  ...S.btn('linear-gradient(180deg,#14252d,#0d1a20)', false),
                  flex: 1,
                  border: '4px solid rgba(25,199,168,.7)',
                }}
                onClick={() => history.push('/games')}
              >
                🏠 Về game
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  if (view === 'lobby') {
    return (
      <div style={S.page}>
        <div style={S.card}>
          <h1 style={S.title}>🎮 Chơi Cùng Bạn Bè</h1>

          <div style={S.tabRow}>
            <button style={S.tab(true)}>🔴 Phòng trực tiếp</button>
            <button style={S.tab(false)} onClick={() => setTab('solo')}>
              📚 Luyện tập
            </button>
          </div>

          <label style={S.label}>Nhập tên của bạn:</label>

          <input
            style={inputStyle('name')}
            placeholder="Tên hiển thị..."
            value={guestName}
            maxLength={30}
            onFocus={() => setFocusedInput('name')}
            onBlur={() => setFocusedInput(null)}
            onChange={(e) => setGuestName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
          />

          <button
            style={S.btn('linear-gradient(180deg,#ffdf3b,#ff8a00)', loading)}
            onClick={handleCreateRoom}
            disabled={loading}
          >
            🏠 Tạo phòng mới
          </button>

          <div style={S.divider}>
            <div style={S.dividerLine} />
            <span>hoặc</span>
            <div style={S.dividerLine} />
          </div>

          <label style={S.label}>Mã phòng:</label>

          <div style={S.row}>
            <input
              style={{ ...inputStyle('pin'), marginBottom: 0, flex: 1 }}
              placeholder="Nhập mã 6 chữ số..."
              value={joinPin}
              maxLength={10}
              onFocus={() => setFocusedInput('pin')}
              onBlur={() => setFocusedInput(null)}
              onChange={(e) => setJoinPin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
            />

            <button
              style={{
                ...S.btn('linear-gradient(180deg,#14252d,#0d1a20)', loading),
                width: 'auto',
                marginTop: 0,
                border: '4px solid #ff4fa3',
              }}
              onClick={handleJoinRoom}
              disabled={loading}
            >
              Vào phòng
            </button>
          </div>

          {error && <p style={S.errorMsg}>⚠️ {error}</p>}
        </div>
      </div>
    );
  }

  if (view === 'waiting') {
    const players = room ? room.players || {} : {};
    const playerList = Object.entries(players);

    return (
      <div style={S.page}>
        <div style={S.card}>
          <h1 style={S.title}>🎮 Phòng Chờ</h1>

          <p
            style={{
              color: '#b7d8d4',
              textAlign: 'center',
              marginBottom: 6,
              fontSize: '1.05rem',
              fontWeight: 900,
            }}
          >
            Chia sẻ mã PIN với bạn bè!
          </p>

          <div style={S.pinDisplay}>{pin}</div>

          <p style={S.pinHint}>Bạn bè nhập mã này để vào phòng</p>

          <p style={S.sectionTitle}>Người chơi ({playerList.length}):</p>

          {playerList.length === 0 && (
            <p style={{ color: '#b7d8d4', textAlign: 'center', marginBottom: 16, fontWeight: 900 }}>
              Đang chờ người chơi...
            </p>
          )}

          {playerList.map(([uid, p]) => (
            <div key={uid} style={S.playerRow}>
              <span style={S.playerAvatar}>{p.avatar || pickAvatar(uid)}</span>

              <span style={S.playerName}>{p.name}</span>

              {uid === room.hostId && <span style={S.hostBadge}>Chủ phòng</span>}

              {uid === guestId && uid !== room.hostId && (
                <span
                  style={{
                    ...S.hostBadge,
                    background: 'linear-gradient(180deg,#0a84ff,#00439d)',
                    boxShadow: '0 4px 0 #00306f',
                  }}
                >
                  Bạn
                </span>
              )}
            </div>
          ))}

          {isHost && (
            <button
              style={{
                ...S.btn('linear-gradient(180deg,#ffdf3b,#ff8a00)', loading || playerList.length < 1),
                marginTop: 18,
              }}
              onClick={handleStart}
              disabled={loading || playerList.length < 1}
            >
              🚀 Bắt đầu
            </button>
          )}

          {!isHost && (
            <p
              style={{
                color: '#b7d8d4',
                textAlign: 'center',
                marginTop: 18,
                fontSize: '1.05rem',
                fontWeight: 900,
              }}
            >
              ⏳ Đang chờ chủ phòng bắt đầu...
            </p>
          )}

          {error && <p style={S.errorMsg}>⚠️ {error}</p>}
        </div>
      </div>
    );
  }

  if (view === 'playing') {
    const totalQ = room && room.questions ? room.questions.length : 0;
    const qIndex = room ? room.currentQuestion : 0;

    if (isHost) {
      const answeredCount = Object.values(room?.players || {}).filter((p) => p.answered).length;
      const playerCount = Object.keys(room?.players || {}).length;

      return (
        <div style={S.page}>
          <div style={{ ...S.card, maxWidth: 700 }}>
            <div style={S.questionMeta}>
              <span style={{ color: '#ffdf3b' }}>Câu {qIndex + 1}/{totalQ}</span>

              <span
                style={{
                  background: 'linear-gradient(180deg,#ff4fa3,#c40075)',
                  color: '#fff',
                  fontSize: '.9rem',
                  fontWeight: 900,
                  padding: '6px 12px',
                  borderRadius: 999,
                  border: '3px solid #fff',
                  boxShadow: '0 5px 0 #7c004b',
                }}
              >
                👁 Giáo viên
              </span>
            </div>

            <TimerBar timer={timer} total={20} />

            {currentQ ? (
              <>
                <div style={S.questionBox}>
                  <p style={{ color: '#b7d8d4', fontSize: '1.05rem', marginBottom: 9, fontWeight: 900 }}>
                    Câu hỏi
                  </p>

                  <p style={S.questionMean}>"{currentQ.mean}"</p>

                  {currentQ.phonetic && (
                    <p style={{ color: '#ffdf3b', fontSize: '1.05rem', margin: 0, fontWeight: 900 }}>
                      {currentQ.phonetic}
                    </p>
                  )}
                </div>

                <div style={S.choicesGrid}>
                  {(currentQ.choices || []).map((choice) => (
                    <div
                      key={choice}
                      style={{
                        ...S.choiceBtn(choice === currentQ.correct ? 'correct' : 'dim'),
                        cursor: 'default',
                      }}
                    >
                      {choice === currentQ.correct && '✓ '}
                      {choice}
                    </div>
                  ))}
                </div>

                <p
                  style={{
                    textAlign: 'center',
                    color: '#b7d8d4',
                    fontSize: '1.05rem',
                    margin: '0 0 18px',
                    fontWeight: 900,
                  }}
                >
                  ✅ {answeredCount}/{playerCount} học sinh đã trả lời
                </p>
              </>
            ) : (
              <p style={{ color: '#b7d8d4', textAlign: 'center', padding: '36px 0', fontWeight: 900 }}>
                ⏳ Đang tải câu hỏi...
              </p>
            )}

            <button
              style={{
                ...S.btn('linear-gradient(180deg,#ffdf3b,#ff8a00)', loading),
                marginBottom: 22,
              }}
              onClick={handleNextQuestion}
              disabled={loading}
            >
              {qIndex + 1 >= totalQ ? '🏁 Kết thúc' : '→ Câu tiếp theo'}
            </button>

            <Leaderboard players={room?.players || {}} guestId={guestId} />

            {error && <p style={S.errorMsg}>⚠️ {error}</p>}
          </div>
        </div>
      );
    }

    return (
      <div style={S.page}>
        <div style={{ ...S.card, maxWidth: 660 }}>
          <div style={S.questionMeta}>
            <span style={{ color: '#ffdf3b' }}>
              Câu {qIndex + 1}/{totalQ}
            </span>

            <span style={{ color: '#ff4fa3' }}>⭐ {myScore} điểm</span>
          </div>

          <TimerBar timer={timer} total={20} />

          {currentQ ? (
            <>
              <div style={S.questionBox}>
                <p style={{ color: '#b7d8d4', fontSize: '1.05rem', marginBottom: 9, fontWeight: 900 }}>
                  Nghĩa là gì?
                </p>

                <p style={S.questionMean}>"{currentQ.mean}"</p>

                {currentQ.phonetic && (
                  <p style={{ color: '#ffdf3b', fontSize: '1.05rem', margin: 0, fontWeight: 900 }}>
                    {currentQ.phonetic}
                  </p>
                )}
              </div>

              <div style={S.choicesGrid}>
                {(currentQ.choices || []).map((choice) => (
                  <button
                    key={choice}
                    style={S.choiceBtn(submitted ? getChoiceState(choice) : 'idle')}
                    onClick={() => handleAnswer(choice)}
                    disabled={submitted}
                  >
                    {choice}
                  </button>
                ))}
              </div>

              {submitted && (
                <p
                  style={{
                    textAlign: 'center',
                    color: selectedAnswer === currentQ.correct ? '#72ffad' : '#ff8abf',
                    fontWeight: 900,
                    marginBottom: 14,
                    fontSize: '1.12rem',
                  }}
                >
                  {selectedAnswer === currentQ.correct
                    ? '🎉 Chính xác! +điểm'
                    : `😅 Sai rồi! Đáp án: ${currentQ.correct}`}
                </p>
              )}
            </>
          ) : (
            <p style={{ color: '#b7d8d4', textAlign: 'center', padding: '36px 0', fontWeight: 900 }}>
              ⏳ Đang tải câu hỏi...
            </p>
          )}

          {room && room.players && <Leaderboard players={room.players} guestId={guestId} />}

          {error && <p style={S.errorMsg}>⚠️ {error}</p>}
        </div>
      </div>
    );
  }

  if (view === 'results') {
    const players = room ? room.players || {} : {};
    const sorted = Object.entries(players).sort((a, b) => b[1].score - a[1].score);

    return (
      <div style={S.page}>
        <div style={S.card}>
          <h1 style={S.title}>🏆 Kết Quả Cuối Cùng</h1>

          <div style={{ marginBottom: 10 }}>
            {sorted.map(([uid, p], i) => (
              <div key={uid} style={S.resultRow(i)}>
                <span style={{ fontSize: '1.6rem', minWidth: 36 }}>{getMedal(i)}</span>

                <span style={{ fontSize: '1.5rem' }}>{p.avatar || pickAvatar(uid)}</span>

                <span
                  style={{
                    color: uid === guestId ? '#ffdf3b' : '#fff',
                    fontWeight: 900,
                    flex: 1,
                    fontSize: '1.1rem',
                  }}
                >
                  {p.name}
                </span>

                <span style={{ color: '#ffdf3b', fontWeight: 900, fontSize: '1.12rem' }}>
                  {p.score} điểm
                </span>
              </div>
            ))}
          </div>

          <div style={S.myScoreBox}>
            Điểm của bạn:{' '}
            <span style={{ color: '#ffdf3b', fontSize: '1.35rem' }}>{myScore} điểm</span> 🎉
          </div>

          <div style={S.rowBtns}>
            <button
              style={{ ...S.btn('linear-gradient(180deg,#ffdf3b,#ff8a00)', false), flex: 1 }}
              onClick={handlePlayAgain}
            >
              🔄 Chơi lại
            </button>

            <button
              style={{
                ...S.btn('linear-gradient(180deg,#14252d,#0d1a20)', false),
                flex: 1,
                border: '4px solid rgba(25,199,168,.7)',
              }}
              onClick={() => history.push('/games')}
            >
              Về game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default MultiplayerPage;