import gameApi from 'apis/gameApi';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';
const Q_SEC = 20;
const MEDALS = ['🥇', '🥈', '🥉'];
const COLORS = ['#ff4d4f', '#0a84ff', '#28c76f', '#ffb400'];

const CSS = `
  @keyframes mpSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes mpPop {
    0% { transform: scale(.86); opacity: 0; }
    70% { transform: scale(1.06); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes mpPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: .72; }
  }

  .mp-spin { animation: mpSpin .9s linear infinite; }
  .mp-pop { animation: mpPop .28s ease forwards; }
  .mp-pulse { animation: mpPulse 1.2s ease infinite; }
`;

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 18% 20%, rgba(255,255,255,.22), transparent 16%),
      radial-gradient(circle at 80% 14%, rgba(255,223,90,.20), transparent 18%),
      linear-gradient(135deg,#005ce6 0%,#0a84ff 48%,#35c8ff 100%)
    `,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    boxSizing: 'border-box',
    fontFamily: GAME_FONT,
  },

  playPage: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 18% 20%, rgba(255,255,255,.22), transparent 16%),
      radial-gradient(circle at 80% 14%, rgba(255,223,90,.20), transparent 18%),
      linear-gradient(135deg,#005ce6 0%,#0a84ff 48%,#35c8ff 100%)
    `,
    padding: '24px 16px 42px',
    boxSizing: 'border-box',
    fontFamily: GAME_FONT,
  },

  card: {
    background: '#fff',
    border: '6px solid #0a84ff',
    borderRadius: 36,
    padding: '42px 38px',
    maxWidth: 520,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 10px 0 #00439d, 0 22px 45px rgba(0,0,0,.28)',
    boxSizing: 'border-box',
  },

  title: {
    color: '#0a84ff',
    fontSize: 'clamp(2rem,4vw,3.2rem)',
    fontWeight: 900,
    margin: '0 0 8px',
    lineHeight: .95,
    textShadow: '0 3px 0 rgba(0,67,157,.16)',
  },

  sub: {
    color: '#073b75',
    fontWeight: 900,
    marginBottom: 28,
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '15px 18px',
    borderRadius: 20,
    border: '4px solid #cceeff',
    background: '#fff',
    color: '#073b75',
    fontSize: '1.1rem',
    fontWeight: 900,
    marginBottom: 18,
    outline: 'none',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 rgba(0,67,157,.12)',
  },

  mainBtn: {
    background: 'linear-gradient(180deg,#0a84ff,#00439d)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '14px 30px',
    fontSize: '1.15rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 7px 0 #00306f',
  },

  secondaryBtn: {
    background: 'linear-gradient(180deg,#ffffff,#dff4ff)',
    color: '#00439d',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '14px 30px',
    fontSize: '1.15rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 7px 0 rgba(0,67,157,.18)',
  },

  panel: {
    background: '#fff',
    borderRadius: 28,
    border: '5px solid #0a84ff',
    boxShadow: '0 8px 0 #00439d, 0 18px 34px rgba(0,0,0,.24)',
    padding: '24px',
    boxSizing: 'border-box',
  },

  stat: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 999,
    border: '3px solid #fff',
    fontWeight: 900,
    boxShadow: '0 5px 0 #bd5f00',
  },
};

function getGuestId() {
  try {
    let id = localStorage.getItem('dyno_guest_id');
    if (!id) {
      id = `guest_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('dyno_guest_id', id);
    }
    return id;
  } catch {
    return `guest_${Date.now()}`;
  }
}

function sortPlayers(players = {}) {
  return Object.entries(players)
    .map(([uid, p]) => ({ uid, ...p }))
    .sort((a, b) => b.score - a.score);
}

function MultiplayerPage() {
  const history = useHistory();
  const [guestId] = useState(getGuestId);
  const [name, setName] = useState('');
  const [joinPin, setJoinPin] = useState('');
  const [view, setView] = useState('lobby');
  const [room, setRoom] = useState(null);
  const [myScore, setMyScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(Q_SEC);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);

  const pollRef = useRef(null);
  const timerRef = useRef(null);
  const pinRef = useRef('');

  const pollRoom = useCallback(async () => {
    if (!pinRef.current) return;

    try {
      const res = await gameApi.getRoom(pinRef.current);
      const r = res.data?.room;
      if (!r) return;

      setRoom((prev) => {
        if (prev?.currentQuestion !== r.currentQuestion && r.status === 'playing') {
          setSubmitted(false);
          setSelected(null);
          setFeedback(null);
          setTimer(Q_SEC);
        }
        return r;
      });

      if (r.status === 'playing' && view === 'waiting') setView('playing');

      if (r.status === 'ended' && view !== 'results') {
        setView('results');
        clearInterval(pollRef.current);
        clearInterval(timerRef.current);
      }
    } catch {}
  }, [view]);

  useEffect(() => {
    if (view === 'waiting' || view === 'playing') {
      pollRef.current = setInterval(pollRoom, 2000);
      return () => clearInterval(pollRef.current);
    }
    return undefined;
  }, [view, pollRoom]);

  useEffect(() => {
    if (view !== 'playing' || submitted) return undefined;

    clearInterval(timerRef.current);
    setTimer(Q_SEC);

    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);

          if (!submitted) {
            setSubmitted(true);
            setFeedback({ ok: false, gain: 0 });

            gameApi
              .submitAnswer({
                pin: pinRef.current,
                userId: guestId,
                questionIndex: room?.currentQuestion || 0,
                answer: '',
                timeMs: Q_SEC * 1000,
              })
              .catch(() => {});
          }

          return 0;
        }

        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [room?.currentQuestion, view, submitted, guestId, room]);

  async function handleCreate() {
    if (!name.trim()) {
      setError('Nhập tên trước nhé!');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const packRes = await gameApi.getWordPackCWG('-1', '-1', '-1', [], 20);
      const raw = packRes.data?.wordPack || [];

      const wordPack = raw.map((item) => {
        const wrong = (item.wrongList || []).slice(0, 3).map((w) => w.word);

        return {
          word: item.word,
          mean: item.mean,
          phonetic: item.phonetic || '',
          picture: item.picture || '',
          audioUrl: item.audioUrl || '',
          choices: [...wrong, item.word].sort(() => Math.random() - 0.5),
          correct: item.word,
        };
      });

      const res = await gameApi.createRoom({
        hostId: guestId,
        hostName: name.trim(),
        gameType: 'mcq',
        wordPack,
      });

      const { id, pin } = res.data?.room || res.data || {};
      pinRef.current = pin;

      const rRes = await gameApi.getRoom(pin);
      setRoom({ ...rRes.data?.room, id });
      setView('waiting');
    } catch {
      setError('Tạo phòng thất bại!');
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!name.trim()) {
      setError('Nhập tên trước nhé!');
      return;
    }

    if (!joinPin.trim()) {
      setError('Nhập mã phòng!');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await gameApi.joinRoom({
        pin: joinPin.trim(),
        userId: guestId,
        userName: name.trim(),
      });

      pinRef.current = joinPin.trim();
      setRoom(res.data?.room);
      setView('waiting');
    } catch {
      setError('Không tìm thấy phòng!');
    } finally {
      setLoading(false);
    }
  }

  async function handleStart() {
    try {
      await gameApi.startRoom({ roomId: room.id, hostId: guestId });
    } catch {
      setError('Lỗi! Thử lại.');
    }
  }

  async function handleAnswer(choice) {
    if (submitted || !room) return;

    const timeMs = (Q_SEC - timer) * 1000;

    setSelected(choice);
    setSubmitted(true);
    clearInterval(timerRef.current);

    try {
      const res = await gameApi.submitAnswer({
        pin: pinRef.current,
        userId: guestId,
        questionIndex: room.currentQuestion,
        answer: choice,
        timeMs,
      });

      const { isCorrect, scoreGain, newScore } = res.data || {};

      setFeedback({ ok: isCorrect, gain: scoreGain || 0 });
      setMyScore(newScore || 0);
    } catch {
      setFeedback({ ok: false, gain: 0 });
    }
  }

  async function handleNext() {
    try {
      const res = await gameApi.nextQuestion({ roomId: room.id, hostId: guestId });
      if (res.data?.isEnd) {
        setView('results');
        clearInterval(pollRef.current);
      }
    } catch {}
  }

  const isHost = room?.hostId === guestId;
  const curQ = room?.questions?.[room?.currentQuestion];

  if (view === 'lobby') {
    return (
      <div style={S.page}>
        <style>{CSS}</style>

        <div style={S.card} className="mp-pop">
          <div style={{ fontSize: '4.2rem', marginBottom: 8 }}>🎮</div>
          <h1 style={S.title}>Chơi Cùng Bạn Bè</h1>
          <p style={S.sub}>Thi đấu từ vựng theo thời gian thực!</p>

          <input
            placeholder="Tên của bạn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={S.input}
          />

          <button
            onClick={handleCreate}
            disabled={loading}
            style={{ ...S.mainBtn, width: '100%', marginBottom: 18, opacity: loading ? .7 : 1 }}
          >
            {loading ? 'Đang tạo...' : '🏠 Tạo phòng mới'}
          </button>

          <div style={{ color: '#073b75', opacity: .55, fontWeight: 900, marginBottom: 18 }}>
            ── hoặc ──
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <input
              placeholder="Mã phòng"
              value={joinPin}
              onChange={(e) => setJoinPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              style={{
                ...S.input,
                marginBottom: 0,
                textAlign: 'center',
                letterSpacing: '.18em',
              }}
            />

            <button
              onClick={handleJoin}
              disabled={loading}
              style={{ ...S.secondaryBtn, padding: '12px 20px' }}
            >
              Vào
            </button>
          </div>

          <button
            onClick={() => history.push('/games')}
            style={{ ...S.secondaryBtn, marginTop: 20 }}
          >
            ← Về kho game
          </button>

          {error && <p style={{ color: '#d63031', marginTop: 16, fontWeight: 900 }}>{error}</p>}
        </div>
      </div>
    );
  }

  if (view === 'waiting') {
    const players = sortPlayers(room?.players || {});

    return (
      <div style={S.page}>
        <style>{CSS}</style>

        <div style={S.card} className="mp-pop">
          <p style={{ color: '#073b75', fontSize: '1rem', fontWeight: 900, marginBottom: 6 }}>
            Mã phòng
          </p>

          <div
            style={{
              color: '#ff8a00',
              fontSize: '3.2rem',
              fontWeight: 900,
              letterSpacing: '.22em',
              fontFamily: 'monospace',
              marginBottom: 8,
            }}
          >
            {room?.pin}
          </div>

          <p style={{ color: '#073b75', fontWeight: 800, marginBottom: 24 }}>
            Chia sẻ mã này với bạn bè!
          </p>

          <div style={{ ...S.panel, textAlign: 'left', marginBottom: 24, boxShadow: 'none' }}>
            <p style={{ color: '#0a84ff', fontWeight: 900, marginBottom: 12 }}>
              Người chơi ({players.length})
            </p>

            {players.map((p) => (
              <div
                key={p.uid}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 0',
                  borderBottom: '1px solid #dff4ff',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{p.avatar}</span>
                <span style={{ color: '#073b75', fontWeight: p.uid === room?.hostId ? 900 : 800 }}>
                  {p.name}
                </span>
                {p.uid === room?.hostId && (
                  <span
                    style={{
                      background: '#ff8a00',
                      color: '#fff',
                      fontSize: '.72rem',
                      fontWeight: 900,
                      padding: '3px 9px',
                      borderRadius: 999,
                    }}
                  >
                    CHỦ
                  </span>
                )}
                {p.uid === guestId && p.uid !== room?.hostId && (
                  <span style={{ color: '#0a84ff', fontWeight: 900 }}>(bạn)</span>
                )}
              </div>
            ))}
          </div>

          {isHost ? (
            <button onClick={handleStart} style={{ ...S.mainBtn, width: '100%' }}>
              🚀 Bắt đầu!
            </button>
          ) : (
            <div className="mp-pulse" style={{ color: '#073b75', fontWeight: 900 }}>
              ⏳ Chờ chủ phòng bắt đầu...
            </div>
          )}

          <button
            onClick={() => history.push('/games')}
            style={{ ...S.secondaryBtn, marginTop: 18 }}
          >
            Về kho game
          </button>

          {error && <p style={{ color: '#d63031', marginTop: 12, fontWeight: 900 }}>{error}</p>}
        </div>
      </div>
    );
  }

  if (view === 'playing') {
    const pct = (timer / Q_SEC) * 100;
    const timerColor = timer > 10 ? '#28c76f' : timer > 5 ? '#ff8a00' : '#d63031';

    return (
      <div style={S.playPage}>
        <style>{CSS}</style>

        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gap: 18 }}>
          <button
            onClick={() => history.push('/games')}
            style={{ ...S.secondaryBtn, justifySelf: 'start' }}
          >
            ← Về kho game
          </button>

          <div
            style={{
              ...S.panel,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ ...S.stat, background: 'linear-gradient(180deg,#0a84ff,#00439d)' }}>
              Câu {(room?.currentQuestion || 0) + 1}/{room?.questions?.length || 0}
            </span>

            <div style={{ textAlign: 'center' }}>
              <div style={{ color: timerColor, fontWeight: 900, fontSize: '2.4rem', lineHeight: 1 }}>
                {timer}
              </div>
              <div
                style={{
                  width: 130,
                  height: 10,
                  background: '#dff4ff',
                  borderRadius: 999,
                  marginTop: 6,
                  overflow: 'hidden',
                  border: '2px solid #fff',
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: timerColor,
                    transition: 'width 1s linear',
                  }}
                />
              </div>
            </div>

            <span style={S.stat}>⭐ {myScore}</span>
          </div>

          <div style={{ ...S.panel, textAlign: 'center' }}>
            <p
              style={{
                color: '#0a84ff',
                fontSize: '1rem',
                fontWeight: 900,
                marginBottom: 10,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Từ nào có nghĩa là
            </p>
            <h2
              style={{
                color: '#073b75',
                fontSize: 'clamp(1.6rem,4vw,2.5rem)',
                fontWeight: 900,
                margin: 0,
              }}
            >
              "{curQ?.mean}"
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {(curQ?.choices || []).map((c, i) => {
              let bg = COLORS[i % 4];
              let border = '4px solid #fff';

              if (submitted) {
                if (c === curQ?.correct) {
                  bg = '#28c76f';
                } else if (c === selected) {
                  bg = '#ff4d4f';
                } else {
                  bg = '#9aa8b8';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(c)}
                  disabled={submitted}
                  style={{
                    padding: '18px 12px',
                    borderRadius: 24,
                    border,
                    background: `linear-gradient(180deg,${bg},${bg}cc)`,
                    color: '#fff',
                    fontSize: 'clamp(1rem,2.5vw,1.25rem)',
                    fontWeight: 900,
                    fontFamily: GAME_FONT,
                    cursor: submitted ? 'default' : 'pointer',
                    boxShadow: '0 7px 0 rgba(0,0,0,.22)',
                    textShadow: '0 2px 0 rgba(0,0,0,.25)',
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div
              className="mp-pop"
              style={{
                textAlign: 'center',
                padding: '14px 20px',
                borderRadius: 22,
                background: feedback.ok
                  ? 'linear-gradient(180deg,#36e27d,#0ca84f)'
                  : 'linear-gradient(180deg,#ff6b6b,#d63031)',
                color: '#fff',
                fontWeight: 900,
                border: '4px solid #fff',
                boxShadow: '0 6px 0 rgba(0,0,0,.22)',
              }}
            >
              {feedback.ok
                ? `✅ Chính xác! +${feedback.gain} điểm`
                : `❌ Sai rồi! Đáp án: "${curQ?.correct}"`}
            </div>
          )}

          {isHost && submitted && (
            <button onClick={handleNext} style={{ ...S.mainBtn, width: '100%' }}>
              → Câu tiếp theo
            </button>
          )}

          {room?.players && (
            <div style={{ ...S.panel, boxShadow: '0 8px 0 #00439d' }}>
              <p style={{ color: '#0a84ff', fontWeight: 900, marginBottom: 10 }}>Bảng xếp hạng</p>

              {sortPlayers(room.players).map((p, i) => (
                <div
                  key={p.uid}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 12,
                    background: p.uid === guestId ? '#dff4ff' : 'transparent',
                  }}
                >
                  <span style={{ minWidth: 32 }}>{MEDALS[i] || `${i + 1}.`}</span>
                  <span style={{ fontSize: '1.3rem' }}>{p.avatar}</span>
                  <span
                    style={{
                      color: '#073b75',
                      flex: 1,
                      fontWeight: p.uid === guestId ? 900 : 800,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {p.name}
                  </span>
                  <span style={{ color: '#ff8a00', fontWeight: 900 }}>{p.score}</span>
                  {p.streak >= 3 && <span>🔥{p.streak}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'results') {
    const players = sortPlayers(room?.players || {});
    const myRank = players.findIndex((p) => p.uid === guestId) + 1;

    return (
      <div style={S.page}>
        <style>{CSS}</style>

        <div style={S.card} className="mp-pop">
          <div style={{ fontSize: '4.4rem' }}>{myRank === 1 ? '🏆' : MEDALS[myRank - 1] || '🎉'}</div>
          <h2 style={S.title}>Kết quả!</h2>
          <p style={{ color: '#073b75', fontWeight: 900, marginBottom: 24 }}>
            Bạn xếp hạng <b style={{ color: '#ff8a00' }}>{myRank}/{players.length}</b>
          </p>

          <div style={{ ...S.panel, textAlign: 'left', marginBottom: 24, boxShadow: 'none' }}>
            {players.map((p, i) => (
              <div
                key={p.uid}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px',
                  borderRadius: 14,
                  background: p.uid === guestId ? '#dff4ff' : 'transparent',
                }}
              >
                <span style={{ fontSize: '1.2rem', minWidth: 32 }}>{MEDALS[i] || `${i + 1}.`}</span>
                <span style={{ fontSize: '1.4rem' }}>{p.avatar}</span>
                <span style={{ color: '#073b75', flex: 1, fontWeight: p.uid === guestId ? 900 : 800 }}>
                  {p.name}
                </span>
                <span style={{ color: '#ff8a00', fontWeight: 900 }}>{p.score}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setView('lobby');
                setRoom(null);
                pinRef.current = '';
                setMyScore(0);
                setError('');
              }}
              style={S.mainBtn}
            >
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

  return null;
}

export default MultiplayerPage;