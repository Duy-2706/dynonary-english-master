import gameApi from 'apis/gameApi';
import GameSetup from 'components/PlayGames/GameSetup';
import { playComplete, playCorrect, playWrong } from 'helper/gameSound';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ensureImage, prefetchImage } from '../../../components/Flashcard/imageCache';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';
const N = 20;

const CSS = `
  @keyframes lcSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes lcPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.06); }
  }

  @keyframes lcPop {
    0% { transform: scale(.92); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .lc-spin {
    animation: lcSpin .9s linear infinite;
  }

  .lc-pulse {
    animation: lcPulse 1.35s ease infinite;
  }

  .lc-pop {
    animation: lcPop .28s ease;
  }

  @media (max-width: 1100px) {
    .listen-grid-responsive {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
  }

  @media (max-width: 640px) {
    .listen-grid-responsive {
      grid-template-columns: 1fr !important;
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
      linear-gradient(180deg, #260044 0%, #430878 46%, #6416a8 100%)
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
  },

  header: {
    maxWidth: 1320,
    margin: '0 auto 16px',
    background: 'linear-gradient(180deg,#ffffff,#f7f2ff)',
    borderRadius: 34,
    border: '6px solid rgba(255,255,255,.98)',
    boxShadow: '0 9px 0 #36005e, 0 22px 40px rgba(0,0,0,.22)',
    padding: '20px 34px 18px',
    boxSizing: 'border-box',
    textAlign: 'center',
  },

  title: {
    color: '#7b1cff',
    fontWeight: 900,
    fontSize: 'clamp(2.3rem,5vw,4.1rem)',
    margin: '0 0 6px',
    lineHeight: 0.95,
    textShadow: '0 3px 0 rgba(54,0,135,.13)',
  },

  sub: {
    color: '#4c1178',
    fontWeight: 900,
    fontSize: '1.55rem',
    margin: 0,
    lineHeight: 1.2,
  },

  statBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
    marginTop: 14,
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

  soundBox: {
    maxWidth: 1320,
    margin: '0 auto 16px',
    textAlign: 'center',
  },

  soundBtn: {
    width: 78,
    height: 78,
    borderRadius: '50%',
    border: '5px solid #fff',
    background: 'linear-gradient(180deg,#a855f7,#6b21a8)',
    color: '#fff',
    fontSize: '1.32rem',
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 7px 0 #3b0764, 0 16px 26px rgba(0,0,0,.23)',
    position: 'relative',
    fontFamily: GAME_FONT,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  soundHint: {
    color: '#fff',
    fontWeight: 900,
    fontSize: '1.32rem',
    margin: '9px 0 0',
    textShadow: 'none',
    lineHeight: 1.15,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 18,
    maxWidth: 1320,
    margin: '0 auto',
  },

  imageCard: (state, hovered) => ({
    borderRadius: 28,
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
    transform: hovered && state === 'idle' ? 'translateY(-6px) scale(1.018)' : 'none',
    boxShadow:
      state === 'correct'
        ? '0 8px 0 #087d42, 0 18px 30px rgba(0,0,0,.24)'
        : state === 'wrong'
        ? '0 8px 0 #9b1d22, 0 18px 30px rgba(0,0,0,.24)'
        : '0 8px 0 #360087, 0 18px 30px rgba(0,0,0,.22)',
    position: 'relative',
  }),

  image: {
    width: '100%',
    height: 210,
    objectFit: 'cover',
    display: 'block',
  },

  imageLoading: {
    width: '100%',
    height: 210,
    background: 'linear-gradient(180deg,#ffffff,#f7f2ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4c1178',
    fontWeight: 900,
    fontSize: '1.85rem',
    textAlign: 'center',
    padding: 18,
    boxSizing: 'border-box',
  },

  mark: (ok) => ({
    position: 'absolute',
    top: 12,
    right: 12,
    background: ok ? '#28c76f' : '#ff4d4f',
    borderRadius: '50%',
    width: 46,
    height: 46,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 900,
    fontSize: '1.8rem',
    border: '4px solid #fff',
    boxShadow: '0 5px 0 rgba(0,0,0,.2)',
  }),

  feedback: (ok) => ({
    maxWidth: 1320,
    margin: '20px auto 0',
    padding: '18px 24px',
    borderRadius: 26,
    background: ok
      ? 'linear-gradient(180deg,#36e27d,#0ca84f)'
      : 'linear-gradient(180deg,#ff6b6b,#d63031)',
    color: '#fff',
    fontWeight: 900,
    fontSize: '1.6rem',
    textAlign: 'center',
    border: '4px solid #fff',
    boxShadow: '0 7px 0 rgba(0,0,0,.22)',
    lineHeight: 1.25,
  }),

  endPage: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 14% 18%, rgba(25,199,168,.18) 0 4px, transparent 5px),
      radial-gradient(circle at 82% 22%, rgba(255,138,0,.16) 0 5px, transparent 6px),
      radial-gradient(circle at 28% 72%, rgba(255,20,147,.13) 0 4px, transparent 5px),
      linear-gradient(180deg, #260044 0%, #430878 46%, #6416a8 100%)
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

  endButtons: {
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 28,
  },

  mainBtn: {
    background: 'linear-gradient(180deg,#d056ff,#7b1cff)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '18px 36px',
    fontSize: '1.7rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 8px 0 #360087',
  },

  secondaryBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eee0ff)',
    color: '#4c008c',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '18px 36px',
    fontSize: '1.7rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 8px 0 rgba(47,0,110,.18)',
  },
};

function speakWord(word) {
  try {
    window.speechSynthesis.cancel();
    const u = new window.SpeechSynthesisUtterance(word);
    u.lang = 'en-US';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  } catch {}
}

function buildSet(pack, correct) {
  const wrong = pack
    .filter((w) => w.word !== correct.word)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return [...wrong, correct]
    .sort(() => Math.random() - 0.5)
    .map((w) => ({
      word: w.word,
      isCorrect: w.word === correct.word,
    }));
}

function AnswerCard({
  item,
  idx,
  state,
  hovered,
  onSelect,
  onHover,
  onLeave,
  answered,
  selectedIndex,
}) {
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (!item.word) return;

    setImgSrc(null);
    ensureImage(item.word, (src) => setImgSrc(src));
  }, [item.word]);

  return (
    <div
      style={{
        ...S.imageCard(state, hovered),
        opacity: state === 'dim' ? 0.6 : 1,
      }}
      onClick={() => onSelect(idx)}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {imgSrc ? (
        <img src={imgSrc} alt="" style={S.image} />
      ) : (
        <div style={S.imageLoading}>
          {item.word}
        </div>
      )}

      {answered && item.isCorrect && (
        <div style={S.mark(true)}>
          ✓
        </div>
      )}

      {answered && idx === selectedIndex && !item.isCorrect && (
        <div style={S.mark(false)}>
          ×
        </div>
      )}
    </div>
  );
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

  const init = useCallback(async () => {
    setStatus('loading');
    setCur(0);
    setScore(0);
    setSelIdx(null);
    setAnswered(false);

    try {
      let p;

      if (wordList?.length) {
        p = wordList.slice(0, 40);
      } else {
        const { type = '-1', level = '-1', specialty = '-1', topics = [] } = packInfo || {};
        const res = await gameApi.getWordPackFG(type, level, specialty, topics);
        p = res?.data?.wordPack || [];
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

      p.slice(0, 8).forEach((w) => prefetchImage(w.word));

      setTimeout(() => speakWord(qs[0].word), 400);
    } catch {
      setStatus('done');
    }
  }, [packInfo, wordList]);

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
      setHovered(null);

      if (next + 4 < pack.length) prefetchImage(pack[next + 4].word);

      setTimeout(() => speakWord(questions[next].word), 300);
    }, 1600);
  };

  const correctWord = questions[cur]?.word || '';

  if (status === 'loading') {
    return (
      <div style={S.endPage}>
        <style>{CSS}</style>

        <div style={S.loadingText}>
          <div
            className="lc-spin"
            style={{
              width: 68,
              height: 68,
              border: '7px solid rgba(255,255,255,.35)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              margin: '0 auto 22px',
            }}
          />

          Đang tải...
        </div>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div style={S.endPage}>
        <style>{CSS}</style>

        <div style={S.endCard} className="lc-pop">
          <h2 style={S.endTitle}>
            Hoàn thành!
          </h2>

          <div style={S.endScore}>
            {score} điểm
          </div>

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

  return (
    <div style={S.page}>
      <style>{CSS}</style>

      <div style={S.topBar}>
        <button style={S.backBtn} onClick={() => history.push('/games')}>
          Về kho game
        </button>
      </div>

      <div style={S.header}>
        <h1 style={S.title}>
          Nghe Và Chọn
        </h1>

        <p style={S.sub}>
          Nghe từ tiếng Anh rồi chọn hình ảnh đúng
        </p>

        <div style={S.statBar}>
          <span style={S.stat}>
            Câu {cur + 1}/{questions.length}
          </span>

          <span style={S.stat}>
            {score} điểm
          </span>
        </div>
      </div>

      <div style={S.soundBox}>
        <button
          className="lc-pulse"
          onClick={() => speakWord(correctWord)}
          style={S.soundBtn}
        >
          Nghe
        </button>

        <p style={S.soundHint}>
          Nhấn để nghe lại
        </p>
      </div>

      <div style={S.grid} className="listen-grid-responsive">
        {qset.map((item, idx) => {
          let state = 'idle';

          if (answered) {
            if (item.isCorrect) state = 'correct';
            else if (idx === selIdx) state = 'wrong';
            else state = 'dim';
          }

          return (
            <AnswerCard
              key={`${cur}-${idx}`}
              item={item}
              idx={idx}
              state={state}
              hovered={hovered === idx}
              answered={answered}
              selectedIndex={selIdx}
              onSelect={handleSelect}
              onHover={() => !answered && setHovered(idx)}
              onLeave={() => setHovered(null)}
            />
          );
        })}
      </div>

      {answered && (
        <div style={S.feedback(qset[selIdx]?.isCorrect)} className="lc-pop">
          {qset[selIdx]?.isCorrect
            ? 'Chính xác! +200 điểm'
            : `Sai rồi! Đáp án đúng: "${correctWord}"`}
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
    return <GameSetup title="Nghe Và Chọn — Chọn chủ đề" onStart={handleStart} />;
  }

  return <ListenChooseGame packInfo={packInfo} wordList={wordList} />;
}

export default ListenChoosePage;