import gameApi from 'apis/gameApi';
import GameSetup from 'components/PlayGames/GameSetup';
import { playComplete, playCorrect, playWrong } from 'helper/gameSound';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';
const N = 20;

const CSS = `
  @keyframes flPop {
    0% { transform: scale(.92); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes flFloat {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    50% { transform: translateY(-8px) rotate(2deg); }
  }

  .fl-pop {
    animation: flPop .28s ease;
  }

  .fl-float {
    animation: flFloat 2.2s ease-in-out infinite;
  }
`;

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 18% 18%, rgba(255,255,255,.25), transparent 16%),
      radial-gradient(circle at 82% 16%, rgba(255,255,255,.20), transparent 18%),
      radial-gradient(circle at 65% 82%, rgba(255,220,0,.28), transparent 22%),
      linear-gradient(135deg, #48c8c8ba 0%, #61dbd3 48%, #bce5eb 100%)
    `,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    boxSizing: 'border-box',
    fontFamily: GAME_FONT,
    overflowX: 'hidden',
  },

  card: {
    width: '100%',
    maxWidth: 820,
    background: '#fff',
    borderRadius: 38,
    padding: '34px',
    border: '6px solid #008d95',
    boxShadow: '0 10px 0 #68cbb4, 0 24px 48px rgba(0,0,0,.28)',
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
    marginBottom: 22,
    position: 'relative',
    zIndex: 2,
  },

  title: {
    color: '#0003039e',
    fontSize: 'clamp(2rem, 4vw, 3.2rem)',
    fontWeight: 900,
    margin: 0,
    lineHeight: 0.95,
    textShadow: '0 3px 0 rgba(25, 61, 63, 0.18)',
  },

  statGroup: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },

  stat: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 999,
    border: '3px solid #fff',
    fontSize: '1rem',
    fontWeight: 900,
    boxShadow: '0 5px 0 #bd5f00',
  },

  progressOuter: {
    height: 18,
    background: '#379b8f',
    borderRadius: 999,
    marginBottom: 26,
    border: '3px solid #a3eed7',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2,
  },

  progressInner: (pct) => ({
    height: '100%',
    width: `${pct}%`,
    background: 'linear-gradient(90deg,#ffdf3b,#ff8a00)',
    borderRadius: 999,
    transition: 'width .35s ease',
  }),

  meaningBox: {
    background: 'linear-gradient(180deg,#fff6fb,#ffe1f1)',
    border: '5px solid #82f1ed',
    borderRadius: 30,
    padding: '24px 26px',
    marginBottom: 28,
    textAlign: 'center',
    boxShadow: '0 7px 0 rgba(16, 63, 66, 0.18)',
    position: 'relative',
    zIndex: 2,
  },

  label: {
    color: '#046d6d',
    fontWeight: 900,
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  meaning: {
    color: '#0e4743',
    fontSize: 'clamp(1.45rem, 3vw, 2.15rem)',
    fontWeight: 900,
    marginTop: 6,
  },

  letterWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 30,
    position: 'relative',
    zIndex: 2,
  },

  letterBox: (blanked, flash) => ({
    width: 54,
    height: 62,
    borderRadius: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.9rem',
    fontWeight: 900,
    background: blanked
      ? flash || 'linear-gradient(180deg,#ffdf3b,#ff8a00)'
      : 'linear-gradient(180deg,#0877ff,#00439d)',
    color: '#fff',
    border: '4px solid #fff',
    boxShadow: blanked
      ? '0 7px 0 #bd5f00'
      : '0 7px 0 #00306f',
    transition: 'background .25s ease, transform .2s ease',
    textShadow: '0 2px 0 rgba(0,0,0,.22)',
  }),

  inputLabel: {
    color: '#215c5e',
    fontSize: '1.05rem',
    fontWeight: 900,
    marginBottom: 10,
    position: 'relative',
    zIndex: 2,
  },

  inputRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    gap: 12,
    marginBottom: 20,
    position: 'relative',
    zIndex: 2,
  },

  input: (flash) => ({
    minWidth: 0,
    background: '#fff',
    border: `4px solid ${flash || '#aee8e2'}`,
    borderRadius: 20,
    padding: '15px 18px',
    fontSize: '1.25rem',
    fontWeight: 900,
    color: '#254046',
    outline: 'none',
    letterSpacing: 3,
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 rgba(51, 80, 81, 0.71)',
  }),

  skipBtn: {
    background: 'linear-gradient(180deg,#b0b0b0,#777)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 20,
    padding: '14px 20px',
    fontSize: '1.05rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 rgba(0,0,0,.22)',
  },

  checkBtn: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 20,
    padding: '14px 22px',
    fontSize: '1.05rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 #bd5f00',
  },

  feedback: (ok) => ({
    padding: '14px 18px',
    borderRadius: 22,
    background: ok
      ? 'linear-gradient(180deg,#36e27d,#0ca84f)'
      : 'linear-gradient(180deg,#ff6b6b,#d63031)',
    color: '#fff',
    fontWeight: 900,
    fontSize: '1.12rem',
    textAlign: 'center',
    border: '4px solid #fff',
    boxShadow: '0 6px 0 rgba(0,0,0,.22)',
    position: 'relative',
    zIndex: 2,
  }),

  decorStar: {
    position: 'absolute',
    right: 24,
    top: 24,
    fontSize: '3rem',
    opacity: 0.28,
    zIndex: 1,
  },

  decorCard1: {
    position: 'absolute',
    right: 42,
    bottom: 44,
    width: 96,
    height: 118,
    borderRadius: 22,
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    transform: 'rotate(10deg)',
    opacity: 0.14,
    zIndex: 1,
  },

  decorCard2: {
    position: 'absolute',
    left: 32,
    bottom: 46,
    width: 88,
    height: 108,
    borderRadius: 22,
    background: 'linear-gradient(180deg,#0877ff,#00439d)',
    transform: 'rotate(-12deg)',
    opacity: 0.13,
    zIndex: 1,
  },

  endPage: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ff3b8a 0%, #ff1493 48%, #ff7ab8 100%)',
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
    border: '6px solid #ff1493',
    boxShadow: '0 10px 0 #9b0054, 0 22px 45px rgba(0,0,0,.28)',
    maxWidth: 460,
    width: '100%',
  },

  mainBtn: {
    display: 'inline-block',
    marginTop: 24,
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    padding: '14px 38px',
    borderRadius: 999,
    textDecoration: 'none',
    fontWeight: 900,
    fontSize: '1.2rem',
    border: '4px solid #fff',
    boxShadow: '0 7px 0 #bd5f00',
  },
};

function buildBlanked(word) {
  const letters = String(word || '').split('');
  const alphaIdx = letters
    .map((c, i) => (/[a-zA-Z]/.test(c) ? i : -1))
    .filter((i) => i !== -1);

  const n = Math.max(1, Math.min(4, Math.round(alphaIdx.length * 0.35)));
  const blankSet = new Set([...alphaIdx].sort(() => Math.random() - 0.5).slice(0, n));

  return {
    blankedWord: letters.map((letter, i) => ({
      letter,
      blanked: blankSet.has(i),
    })),
    blankedLetters: letters
      .filter((_, i) => blankSet.has(i))
      .join('')
      .toLowerCase(),
  };
}

function FillLettersGame({ packInfo, wordList }) {
  const [wordPack, setWordPack] = useState([]);
  const [current, setCurrent] = useState(0);
  const [blankedWord, setBlankedWord] = useState([]);
  const [blankedLetters, setBlankedLetters] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('loading');
  const [feedback, setFeedback] = useState(null);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setStatus('loading');

      try {
        let pack;

        if (wordList?.length) {
          pack = wordList.slice(0, N);
        } else {
          const { type = '-1', level = '-1', specialty = '-1', topics = [] } = packInfo || {};
          const res = await gameApi.getWordPackCWG(type, level, specialty, topics, N);
          pack = res?.data?.wordPack || [];
        }

        if (!mounted) return;

        if (!pack.length) {
          setStatus('done');
          return;
        }

        setWordPack(pack);

        const first = buildBlanked(pack[0].word);
        setBlankedWord(first.blankedWord);
        setBlankedLetters(first.blankedLetters);
        setStatus('playing');
      } catch {
        if (mounted) setStatus('done');
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [packInfo, wordList]);

  const advance = useCallback((idx, pack) => {
    const next = idx + 1;

    setTimeout(() => {
      setFlash(null);

      if (next >= pack.length) {
        playComplete();
        setStatus('done');
        return;
      }

      setCurrent(next);

      const nextBlank = buildBlanked(pack[next].word);
      setBlankedWord(nextBlank.blankedWord);
      setBlankedLetters(nextBlank.blankedLetters);
      setInput('');
      setFeedback(null);
      setStatus('playing');
    }, 1400);
  }, []);

  const handleCheck = useCallback(() => {
    if (status !== 'playing') return;

    setStatus('checking');

    const ok = input.trim().toLowerCase() === blankedLetters;

    setFeedback(ok ? 'correct' : 'wrong');
    setFlash(ok ? '#36e27d' : '#ff6b6b');

    if (ok) {
      playCorrect();
      setScore((s) => s + 100);
    } else {
      playWrong();
    }

    advance(current, wordPack);
  }, [status, input, blankedLetters, current, wordPack, advance]);

  const handleSkip = useCallback(() => {
    if (status !== 'playing') return;

    setStatus('checking');
    setFeedback('wrong');
    setFlash('#ff6b6b');
    playWrong();
    advance(current, wordPack);
  }, [status, current, wordPack, advance]);

  if (status === 'loading') {
    return (
      <div style={S.endPage}>
        <style>{CSS}</style>
        <div style={{ textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: '1.4rem' }}>
          ✏️ Đang chuẩn bị từ vựng...
        </div>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div style={S.endPage}>
        <style>{CSS}</style>
        <div style={S.endCard} className="fl-pop">
          <div style={{ fontSize: '4.4rem' }}>{score >= 1500 ? '🏆' : score >= 800 ? '🌟' : '💪'}</div>
          <h2 style={{ color: '#14ffe7', fontSize: '2.3rem', fontWeight: 900, margin: '8px 0' }}>
            Hoàn thành!
          </h2>
          <div style={{ color: '#ff8a00', fontSize: '3.6rem', fontWeight: 900 }}>{score} điểm</div>
          <p style={{ color: '#64103e', fontWeight: 800, marginBottom: 8 }}>
            Bạn đã hoàn thành trò chơi điền chữ.
          </p>
          <Link to="/games" style={S.mainBtn}>
            Chơi game khác
          </Link>
        </div>
      </div>
    );
  }

  const entry = wordPack[current];
  const pct = Math.round(((current + 1) / wordPack.length) * 100);

  return (
    <div style={S.page}>
      <style>{CSS}</style>

      <div style={S.card} className="fl-pop">
        <div style={S.decorStar}>⭐</div>
        <div style={S.decorCard1} />
        <div style={S.decorCard2} />

        <div style={S.titleRow}>
          <h1 style={S.title}>Điền từ còn thiếu</h1>

          <div style={S.statGroup}>
            <span style={S.stat}>Câu {current + 1}/{wordPack.length}</span>
            <span style={S.stat}>⭐ {score}</span>
          </div>
        </div>

        <div style={S.progressOuter}>
          <div style={S.progressInner(pct)} />
        </div>

        <div style={S.meaningBox}>
          <div style={S.label}>Điền chữ còn thiếu cho từ có nghĩa là</div>
          <div style={S.meaning}>"{entry?.mean}"</div>
        </div>

        <div style={S.letterWrap}>
          {blankedWord.map((item, i) =>
            !/[a-zA-Z]/.test(item.letter) ? (
              <span
                key={i}
                style={{
                  color: '#008d95',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  alignSelf: 'center',
                }}
              >
                {item.letter}
              </span>
            ) : (
              <div key={i} style={S.letterBox(item.blanked, flash)}>
                {item.blanked ? '_' : item.letter}
              </div>
            )
          )}
        </div>

        <div style={S.inputLabel}>Nhập các chữ bị thiếu theo đúng thứ tự:</div>

        <div style={S.inputRow}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && input.trim() && handleCheck()}
            disabled={status === 'checking'}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            placeholder={`${blankedLetters.length} chữ cái`}
            style={S.input(flash)}
          />

          <button onClick={handleSkip} disabled={status === 'checking'} style={S.skipBtn}>
            Bỏ qua
          </button>

          <button
            onClick={handleCheck}
            disabled={status === 'checking' || !input.trim()}
            style={{
              ...S.checkBtn,
              opacity: status === 'checking' || !input.trim() ? 0.65 : 1,
            }}
          >
            Kiểm tra
          </button>
        </div>

        {feedback && (
          <div style={S.feedback(feedback === 'correct')} className="fl-pop">
            {feedback === 'correct'
              ? '✅ Chính xác! +100 điểm'
              : `❌ Sai rồi! Đáp án đúng: ${blankedLetters}`}
          </div>
        )}
      </div>
    </div>
  );
}

function FillLettersPage() {
  const location = useLocation();
  const [packInfo, setPackInfo] = useState(location.state?.packInfo || null);
  const [wordList, setWordList] = useState(location.state?.wordList || null);

  const handleStart = (info) => {
    if (info.wordList) setWordList(info.wordList);
    else setPackInfo(info);
  };

  if (!packInfo && !wordList) {
    return <GameSetup title="Điền Chữ Còn Thiếu — Chọn chủ đề" onStart={handleStart} />;
  }

  return <FillLettersGame packInfo={packInfo} wordList={wordList} />;
}

export default FillLettersPage;