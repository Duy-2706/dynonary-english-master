import gameApi from 'apis/gameApi';
import GameSetup from 'components/PlayGames/GameSetup';
import { playComplete, playCorrect, playWrong } from 'helper/gameSound';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';
const N = 20;

const CSS = `
  @keyframes flPop {
    0% { transform: scale(.94); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .fl-pop {
    animation: flPop .24s ease;
  }

  @media (max-width: 980px) {
    .fill-main-layout {
      grid-template-columns: 1fr !important;
    }

    .fill-input-row {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 640px) {
    .fill-page {
      padding: 18px 12px 34px !important;
    }

    .fill-card {
      padding: 22px 18px !important;
      border-radius: 28px !important;
    }

    .fill-letter-box {
      width: 44px !important;
      height: 52px !important;
      font-size: 1.55rem !important;
      border-radius: 15px !important;
    }
  }
`;

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 14% 18%, rgba(25,199,168,.18) 0 4px, transparent 5px),
      radial-gradient(circle at 82% 22%, rgba(255,138,0,.16) 0 5px, transparent 6px),
      radial-gradient(circle at 28% 72%, rgba(255,20,147,.13) 0 4px, transparent 5px),
      radial-gradient(circle at 92% 76%, rgba(25,199,168,.12) 0 4px, transparent 5px),
      linear-gradient(180deg, #05090d 0%, #260044 48%, #430878 100%)
    `,
    backgroundSize: '90px 90px, 130px 130px, 110px 110px, 120px 120px, auto',
    padding: '18px 28px 36px',
    boxSizing: 'border-box',
    fontFamily: GAME_FONT,
  },

  topBar: {
    width: '100%',
    maxWidth: 1320,
    margin: '0 auto 12px',
  },

  backBtn: {
    display: 'inline-block',
    background: 'linear-gradient(180deg,#ffffff,#efe8ff)',
    color: '#4a1178',
    border: '4px solid #ffffff',
    borderRadius: 999,
    padding: '12px 26px',
    fontSize: '1.35rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 rgba(42,0,69,.22)',
    textDecoration: 'none',
  },

  card: {
    width: '100%',
    maxWidth: 1320,
    margin: '0 auto',
    background: 'linear-gradient(180deg,#ffffff,#f7f2ff)',
    borderRadius: 36,
    padding: '26px 34px 32px',
    border: '6px solid rgba(255,255,255,.98)',
    boxShadow: '0 10px 0 #36005e, 0 24px 44px rgba(0,0,0,.24)',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },

  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 18,
    flexWrap: 'wrap',
    marginBottom: 16,
    position: 'relative',
    zIndex: 2,
  },

  title: {
    color: '#7b1cff',
    fontSize: 'clamp(2.4rem, 4.8vw, 4.1rem)',
    fontWeight: 900,
    margin: 0,
    lineHeight: 0.95,
    textShadow: '0 3px 0 rgba(54,0,135,.13)',
  },

  statGroup: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },

  stat: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    padding: '11px 24px',
    borderRadius: 999,
    border: '4px solid #fff',
    fontSize: '1.42rem',
    fontWeight: 900,
    boxShadow: '0 6px 0 #bd5f00',
  },

  progressOuter: {
    height: 18,
    background: '#e9d9ff',
    borderRadius: 999,
    marginBottom: 22,
    border: '4px solid #ffffff',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2,
    boxShadow: '0 5px 0 rgba(54,0,94,.16)',
  },

  progressInner: (pct) => ({
    height: '100%',
    width: `${pct}%`,
    background: 'linear-gradient(90deg,#7b1cff,#ff4fa3,#ff8a00)',
    borderRadius: 999,
    transition: 'width .35s ease',
  }),

  mainLayout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.25fr) minmax(360px, .75fr)',
    gap: 24,
    alignItems: 'stretch',
    position: 'relative',
    zIndex: 2,
  },

  leftPanel: {
    background: 'linear-gradient(180deg,#ffffff,#f4ecff)',
    border: '5px solid #e7d7ff',
    borderRadius: 30,
    padding: '24px 26px',
    boxShadow: '0 8px 0 rgba(54,0,94,.12)',
  },

  rightPanel: {
    background: 'linear-gradient(180deg,#17252d,#0b1419)',
    border: '5px solid rgba(25,199,168,.62)',
    borderRadius: 30,
    padding: '24px 26px',
    boxShadow: '0 8px 0 rgba(25,199,168,.16)',
    color: '#ffffff',
  },

  label: {
    color: '#4c1178',
    fontWeight: 900,
    fontSize: '1.35rem',
    letterSpacing: 0.2,
    marginBottom: 10,
  },

  meaning: {
    color: '#1e1b4b',
    fontSize: 'clamp(2rem, 3.3vw, 3rem)',
    fontWeight: 900,
    lineHeight: 1.15,
    marginBottom: 24,
  },

  letterWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  letterBox: (blanked, flash) => ({
    width: 58,
    height: 66,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 900,
    background: blanked
      ? flash || 'linear-gradient(180deg,#ffdf3b,#ff8a00)'
      : 'linear-gradient(180deg,#0a84ff,#00439d)',
    color: '#fff',
    border: '4px solid #fff',
    boxShadow: blanked
      ? '0 7px 0 #bd5f00'
      : '0 7px 0 #00306f',
    transition: 'background .25s ease, transform .2s ease',
    textShadow: 'none',
  }),

  nonLetter: {
    color: '#4c1178',
    fontSize: '2rem',
    fontWeight: 900,
    alignSelf: 'center',
  },

  inputLabel: {
    color: '#d8fffa',
    fontSize: '1.35rem',
    fontWeight: 900,
    lineHeight: 1.3,
    marginBottom: 14,
  },

  inputRow: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 14,
  },

  input: (flash) => ({
    minWidth: 0,
    background: '#ffffff',
    border: `5px solid ${flash || '#19c7a8'}`,
    borderRadius: 24,
    padding: '18px 22px',
    fontSize: '1.7rem',
    fontWeight: 900,
    color: '#17252d',
    outline: 'none',
    letterSpacing: 4,
    fontFamily: GAME_FONT,
    boxShadow: '0 8px 0 rgba(25,199,168,.18)',
    boxSizing: 'border-box',
    width: '100%',
  }),

  buttonRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
  },

  skipBtn: {
    background: 'linear-gradient(180deg,#475569,#1f2937)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '16px 22px',
    fontSize: '1.35rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 7px 0 rgba(0,0,0,.28)',
  },

  checkBtn: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '16px 22px',
    fontSize: '1.35rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 7px 0 #bd5f00',
  },

  feedback: (ok) => ({
    marginTop: 18,
    padding: '18px 22px',
    borderRadius: 24,
    background: ok
      ? 'linear-gradient(180deg,#36e27d,#0ca84f)'
      : 'linear-gradient(180deg,#ff6b6b,#d63031)',
    color: '#fff',
    fontWeight: 900,
    fontSize: '1.55rem',
    textAlign: 'center',
    border: '4px solid #fff',
    boxShadow: '0 7px 0 rgba(0,0,0,.22)',
    lineHeight: 1.25,
  }),

  helperText: {
    color: '#bff8ee',
    fontSize: '1.18rem',
    fontWeight: 850,
    lineHeight: 1.45,
    marginTop: 14,
  },

  endPage: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 14% 18%, rgba(25,199,168,.18) 0 4px, transparent 5px),
      radial-gradient(circle at 82% 22%, rgba(255,138,0,.16) 0 5px, transparent 6px),
      radial-gradient(circle at 28% 72%, rgba(255,20,147,.13) 0 4px, transparent 5px),
      linear-gradient(180deg, #05090d 0%, #260044 48%, #430878 100%)
    `,
    backgroundSize: '90px 90px, 130px 130px, 110px 110px, auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    fontFamily: GAME_FONT,
    boxSizing: 'border-box',
  },

  loadingText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 900,
    fontSize: '1.8rem',
  },

  endCard: {
    background: 'linear-gradient(180deg,#ffffff,#f7f2ff)',
    borderRadius: 36,
    padding: '46px 42px',
    textAlign: 'center',
    border: '6px solid rgba(255,255,255,.98)',
    boxShadow: '0 10px 0 #36005e, 0 24px 44px rgba(0,0,0,.24)',
    maxWidth: 560,
    width: '100%',
  },

  endTitle: {
    color: '#7b1cff',
    fontSize: '3.4rem',
    fontWeight: 900,
    margin: '8px 0',
    lineHeight: 1,
  },

  endScore: {
    color: '#ff8a00',
    fontSize: '4.2rem',
    fontWeight: 900,
    lineHeight: 1,
    marginTop: 12,
  },

  endText: {
    color: '#4c1178',
    fontWeight: 900,
    fontSize: '1.45rem',
    lineHeight: 1.3,
    margin: '18px 0 0',
  },

  endButtons: {
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 28,
  },

  mainBtn: {
    display: 'inline-block',
    background: 'linear-gradient(180deg,#d056ff,#7b1cff)',
    color: '#fff',
    padding: '18px 36px',
    borderRadius: 999,
    textDecoration: 'none',
    fontWeight: 900,
    fontSize: '1.7rem',
    border: '4px solid #fff',
    boxShadow: '0 8px 0 #360087',
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
    }, 1300);
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

        <div style={S.loadingText}>
          Đang chuẩn bị từ vựng...
        </div>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div style={S.endPage}>
        <style>{CSS}</style>

        <div style={S.endCard} className="fl-pop">
          <h2 style={S.endTitle}>
            Hoàn thành!
          </h2>

          <div style={S.endScore}>
            {score} điểm
          </div>

          <p style={S.endText}>
            Bạn đã hoàn thành trò chơi điền chữ.
          </p>

          <div style={S.endButtons}>
            <Link to="/games" style={S.mainBtn}>
              Về kho game
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const entry = wordPack[current];
  const pct = Math.round(((current + 1) / wordPack.length) * 100);

  return (
    <div style={S.page} className="fill-page">
      <style>{CSS}</style>

      <div style={S.topBar}>
        <Link to="/games" style={S.backBtn}>
          Về kho game
        </Link>
      </div>

      <div style={S.card} className="fill-card fl-pop">
        <div style={S.titleRow}>
          <h1 style={S.title}>
            Điền từ còn thiếu
          </h1>

          <div style={S.statGroup}>
            <span style={S.stat}>
              Câu {current + 1}/{wordPack.length}
            </span>

            <span style={S.stat}>
              {score} điểm
            </span>
          </div>
        </div>

        <div style={S.progressOuter}>
          <div style={S.progressInner(pct)} />
        </div>

        <div style={S.mainLayout} className="fill-main-layout">
          <div style={S.leftPanel}>
            <div style={S.label}>
              Điền chữ còn thiếu cho từ có nghĩa là
            </div>

            <div style={S.meaning}>
              “{entry?.mean}”
            </div>

            <div style={S.letterWrap}>
              {blankedWord.map((item, i) =>
                !/[a-zA-Z]/.test(item.letter) ? (
                  <span key={i} style={S.nonLetter}>
                    {item.letter}
                  </span>
                ) : (
                  <div
                    key={i}
                    style={S.letterBox(item.blanked, flash)}
                    className="fill-letter-box"
                  >
                    {item.blanked ? '_' : item.letter}
                  </div>
                )
              )}
            </div>
          </div>

          <div style={S.rightPanel}>
            <div style={S.inputLabel}>
              Nhập các chữ bị thiếu theo đúng thứ tự
            </div>

            <div style={S.inputRow} className="fill-input-row">
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

              <div style={S.buttonRow}>
                <button
                  onClick={handleSkip}
                  disabled={status === 'checking'}
                  style={S.skipBtn}
                >
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
            </div>

            <div style={S.helperText}>
              Nhìn phần nghĩa, đoán từ tiếng Anh rồi nhập đúng các chữ đang bị ẩn.
            </div>

            {feedback && (
              <div style={S.feedback(feedback === 'correct')} className="fl-pop">
                {feedback === 'correct'
                  ? 'Chính xác! +100 điểm'
                  : `Sai rồi! Đáp án đúng: ${blankedLetters}`}
              </div>
            )}
          </div>
        </div>
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