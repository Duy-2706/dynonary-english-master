import gameApi from 'apis/gameApi';
import GameSetup from 'components/PlayGames/GameSetup';
import { playComplete, playCorrect, playWrong } from 'helper/gameSound';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';
const N = 20;

const CSS = `
  @keyframes lcSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes lcPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.12); }
  }

  @keyframes lcWave {
    0% { transform: scale(.7); opacity: .65; }
    100% { transform: scale(1.45); opacity: 0; }
  }

  @keyframes lcPop {
    0% { transform: scale(.92); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .lc-spin { animation: lcSpin .9s linear infinite; }
  .lc-pulse { animation: lcPulse 1.2s ease infinite; }
  .lc-pop { animation: lcPop .28s ease; }
`;

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 18% 20%, rgba(255,255,255,.22), transparent 16%),
      radial-gradient(circle at 78% 14%, rgba(255,223,90,.20), transparent 18%),
      linear-gradient(135deg,#4c00b0 0%,#7b1cff 48%,#b45cff 100%)
    `,
    padding: '24px 16px 42px',
    boxSizing: 'border-box',
    fontFamily: GAME_FONT,
  },

  topBar: {
    width: '100%',
    maxWidth: 820,
    margin: '0 auto 12px',
  },

  backBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eee0ff)',
    color: '#4c008c',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 rgba(47,0,110,.22)',
  },

  header: {
    maxWidth: 820,
    margin: '0 auto 22px',
    background: '#fff',
    borderRadius: 34,
    border: '6px solid #7b1cff',
    boxShadow: '0 9px 0 #360087, 0 20px 38px rgba(0,0,0,.24)',
    padding: '24px 28px',
    boxSizing: 'border-box',
    textAlign: 'center',
  },

  title: {
    color: '#7b1cff',
    fontWeight: 900,
    fontSize: 'clamp(2.3rem,5vw,4.1rem)',
    margin: '0 0 8px',
    lineHeight: .95,
    textShadow: '0 4px 0 rgba(54,0,135,.16)',
  },

  sub: {
    color: '#4c008c',
    fontWeight: 900,
    fontSize: '1.15rem',
    margin: 0,
  },

  statBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 18,
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

  soundBox: {
    maxWidth: 820,
    margin: '0 auto 24px',
    textAlign: 'center',
  },

  soundBtn: {
    width: 110,
    height: 110,
    borderRadius: '50%',
    border: '6px solid #fff',
    background: 'linear-gradient(180deg,#d056ff,#7b1cff)',
    color: '#fff',
    fontSize: '3.3rem',
    cursor: 'pointer',
    boxShadow: '0 9px 0 #360087, 0 18px 30px rgba(0,0,0,.25)',
    position: 'relative',
    fontFamily: GAME_FONT,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 18,
    maxWidth: 820,
    margin: '0 auto',
  },

  imageCard: (state, hovered) => ({
    borderRadius: 30,
    overflow: 'hidden',
    cursor: state === 'idle' ? 'pointer' : 'default',
    border:
      state === 'correct'
        ? '6px solid #28c76f'
        : state === 'wrong'
        ? '6px solid #ff4d4f'
        : hovered
        ? '6px solid #ffdf3b'
        : '6px solid #fff',
    transition: 'all .22s cubic-bezier(.34,1.56,.64,1)',
    background: '#fff',
    transform: hovered && state === 'idle' ? 'translateY(-6px) scale(1.025)' : 'none',
    boxShadow:
      state === 'correct'
        ? '0 9px 0 #087d42, 0 20px 34px rgba(0,0,0,.26)'
        : state === 'wrong'
        ? '0 9px 0 #9b1d22, 0 20px 34px rgba(0,0,0,.26)'
        : '0 9px 0 #360087, 0 20px 34px rgba(0,0,0,.24)',
    position: 'relative',
  }),

  feedback: (ok) => ({
    maxWidth: 820,
    margin: '22px auto 0',
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
  }),

  endPage: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#4c00b0 0%,#7b1cff 48%,#b45cff 100%)',
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
    border: '6px solid #7b1cff',
    boxShadow: '0 10px 0 #360087, 0 22px 45px rgba(0,0,0,.28)',
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
    background: 'linear-gradient(180deg,#d056ff,#7b1cff)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '14px 30px',
    fontSize: '1.15rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 7px 0 #360087',
  },

  secondaryBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eee0ff)',
    color: '#4c008c',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '14px 30px',
    fontSize: '1.15rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 7px 0 rgba(47,0,110,.18)',
  },
};

function buildSet(pack, correct) {
  const wrong = pack
    .filter((w) => w.word !== correct.word)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return [...wrong, correct]
    .sort(() => Math.random() - 0.5)
    .map((w) => ({
      word: w.word,
      picture: w.picture || '',
      audioUrl:
        w.audioUrl ||
        `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(
          w.word
        )}`,
      isCorrect: w.word === correct.word,
    }));
}

function ListenChooseGame({ packInfo, wordList }) {
  const history = useHistory();
  const [pack, setPack] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [cur, setCur] = useState(0);
  const [qset, setQset] = useState([]);
  const [score, setScore] = useState(0);
  const [selIdx, setSelIdx] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [status, setStatus] = useState('loading');
  const [hovered, setHovered] = useState(null);
  const audioRef = useRef(null);

  const playAudio = useCallback((url) => {
    try {
      if (audioRef.current) audioRef.current.pause();
      const a = new Audio(url);
      audioRef.current = a;
      a.play().catch(() => {});
    } catch {}
  }, []);

  const init = useCallback(async () => {
    setStatus('loading');
    setCur(0);
    setScore(0);
    setSelIdx(null);
    setAnswered(false);

    try {
      let p;

      if (wordList?.length) {
        p = wordList.filter((w) => w.picture).slice(0, N);
        if (!p.length) p = wordList.slice(0, N);
      } else {
        const { type = '-1', level = '-1', specialty = '-1', topics = [] } = packInfo || {};
        const res = await gameApi.getWordPackFG(type, level, specialty, topics);
        p = (res?.data?.wordPack || []).filter((w) => w.picture || w.audioUrl);
      }

      if (p.length < 4) {
        setStatus('done');
        return;
      }

      const qs = p.sort(() => Math.random() - 0.5).slice(0, N);
      const firstSet = buildSet(p, qs[0]);

      setPack(p);
      setQuestions(qs);
      setQset(firstSet);
      setStatus('playing');

      setTimeout(() => playAudio(firstSet.find((x) => x.isCorrect)?.audioUrl || ''), 400);
    } catch {
      setStatus('done');
    }
  }, [packInfo, wordList, playAudio]);

  useEffect(() => {
    init();
  }, [init]);

  const handleSelect = (idx) => {
    if (answered || status !== 'playing') return;

    setSelIdx(idx);
    setAnswered(true);

    if (qset[idx]?.isCorrect) {
      playCorrect();
      setScore((s) => s + 200);
    } else {
      playWrong();
    }

    setTimeout(() => {
      const next = cur + 1;

      if (next >= questions.length) {
        playComplete();
        setStatus('done');
        return;
      }

      setCur(next);

      const nextSet = buildSet(pack, questions[next]);
      setQset(nextSet);
      setSelIdx(null);
      setAnswered(false);

      setTimeout(() => playAudio(nextSet.find((x) => x.isCorrect)?.audioUrl || ''), 300);
    }, 1600);
  };

  const correctItem = qset.find((q) => q.isCorrect);

  if (status === 'loading') {
    return (
      <div style={S.endPage}>
        <style>{CSS}</style>
        <div style={{ textAlign: 'center', color: '#fff', fontWeight: 900 }}>
          <div
            className="lc-spin"
            style={{
              width: 58,
              height: 58,
              border: '6px solid rgba(255,255,255,.35)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              margin: '0 auto 18px',
            }}
          />
          Đang tải âm thanh...
        </div>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div style={S.endPage}>
        <style>{CSS}</style>
        <div style={S.endCard} className="lc-pop">
          <div style={{ fontSize: '4.4rem' }}>{score >= 3200 ? '🏆' : score >= 1600 ? '🌟' : '💪'}</div>
          <h2 style={{ color: '#7b1cff', fontSize: '2.3rem', fontWeight: 900, margin: '8px 0' }}>
            Hoàn thành!
          </h2>
          <div style={{ color: '#ff8a00', fontSize: '3.4rem', fontWeight: 900 }}>⭐ {score}</div>

          <div style={S.endButtons}>
            <button onClick={init} style={S.mainBtn}>Chơi lại</button>
            <button onClick={() => history.push('/games')} style={S.secondaryBtn}>Về kho game</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <style>{CSS}</style>

      <div style={S.topBar}>
        <button style={S.backBtn} onClick={() => history.push('/games')}>
          ← Về kho game
        </button>
      </div>

      <div style={S.header}>
        <h1 style={S.title}>Nghe Và Chọn</h1>
        <p style={S.sub}>Nghe từ tiếng Anh rồi chọn hình ảnh đúng</p>

        <div style={S.statBar}>
          <span style={S.stat}>Câu {cur + 1}/{questions.length}</span>
          <span style={S.stat}>⭐ {score}</span>
        </div>
      </div>

      <div style={S.soundBox}>
        <button
          className="lc-pulse"
          onClick={() => correctItem && playAudio(correctItem.audioUrl)}
          style={S.soundBtn}
        >
          🔊
        </button>
        <p style={{ color: '#fff', fontWeight: 900, textShadow: '0 3px 0 rgba(0,0,0,.22)' }}>
          Nhấn để nghe lại
        </p>
      </div>

      <div style={S.grid}>
        {qset.map((item, idx) => {
          let state = 'idle';
          if (answered) {
            if (item.isCorrect) state = 'correct';
            else if (idx === selIdx) state = 'wrong';
            else state = 'dim';
          }

          return (
            <div
              key={idx}
              style={{
                ...S.imageCard(state, hovered === idx),
                opacity: state === 'dim' ? .6 : 1,
              }}
              onClick={() => handleSelect(idx)}
              onMouseEnter={() => !answered && setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              {item.picture ? (
                <img
                  src={item.picture}
                  alt=""
                  style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: 220,
                    background: 'linear-gradient(180deg,#d056ff,#7b1cff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '1.5rem',
                    textShadow: '0 3px 0 rgba(0,0,0,.22)',
                  }}
                >
                  {item.word}
                </div>
              )}

              {answered && item.isCorrect && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: '#28c76f', borderRadius: '50%', width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, border: '4px solid #fff' }}>
                  ✓
                </div>
              )}

              {answered && idx === selIdx && !item.isCorrect && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: '#ff4d4f', borderRadius: '50%', width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, border: '4px solid #fff' }}>
                  ✕
                </div>
              )}
            </div>
          );
        })}
      </div>

      {answered && (
        <div style={S.feedback(qset[selIdx]?.isCorrect)} className="lc-pop">
          {qset[selIdx]?.isCorrect
            ? '✅ Chính xác! +200 điểm'
            : `❌ Sai rồi! Đáp án đúng: "${correctItem?.word}"`}
        </div>
      )}
    </div>
  );
}

function ListenChoosePage() {
  const location = useLocation();
  const [packInfo, setPackInfo] = useState(location.state?.packInfo || null);
  const [wordList, setWordList] = useState(location.state?.wordList || null);

  const handleStart = (info) => {
    if (info.wordList) setWordList(info.wordList);
    else setPackInfo(info);
  };

  if (!packInfo && !wordList) {
    return <GameSetup title="🔊 Nghe Và Chọn — Chọn chủ đề" onStart={handleStart} />;
  }

  return <ListenChooseGame packInfo={packInfo} wordList={wordList} />;
}

export default ListenChoosePage;