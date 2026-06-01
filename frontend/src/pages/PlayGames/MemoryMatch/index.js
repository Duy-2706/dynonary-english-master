import gameApi from 'apis/gameApi';
import GameSetup from 'components/PlayGames/GameSetup';
import { playComplete, playCorrect, playWrong } from 'helper/gameSound';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';
const TOTAL = 8;

const CSS = `
  .mm-scene {
    perspective: 900px;
  }

  .mm-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform .45s cubic-bezier(.34,1.56,.64,1);
  }

  .mm-inner.flipped {
    transform: rotateY(180deg);
  }

  .mm-face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
    word-break: break-word;
    overflow: hidden;
  }

  .mm-back {
    background:
      radial-gradient(circle at 28% 22%, rgba(255,255,255,.38), transparent 18%),
      linear-gradient(180deg,#ff5fa2,#d10075);
    border: 5px solid #fff;
    box-shadow: inset -8px -10px 16px rgba(0,0,0,.15);
  }

  .mm-en {
    background:
      radial-gradient(circle at 28% 22%, rgba(255,255,255,.34), transparent 18%),
      linear-gradient(180deg,#ffdf3b,#ff8a00);
    transform: rotateY(180deg);
    border: 5px solid #fff;
    box-shadow: inset -8px -10px 16px rgba(0,0,0,.16);
  }

  .mm-vn {
    background:
      radial-gradient(circle at 28% 22%, rgba(255,255,255,.34), transparent 18%),
      linear-gradient(180deg,#0a84ff,#00439d);
    transform: rotateY(180deg);
    border: 5px solid #fff;
    box-shadow: inset -8px -10px 16px rgba(0,0,0,.16);
  }

  .mm-matched .mm-en,
  .mm-matched .mm-vn {
    opacity: .72;
    filter: saturate(.85);
  }

  @keyframes mmPop {
    0% { transform: scale(.92); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .mm-pop {
    animation: mmPop .28s ease;
  }
`;

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 18% 20%, rgba(255,255,255,.22), transparent 16%),
      radial-gradient(circle at 80% 16%, rgba(255,223,90,.24), transparent 18%),
      linear-gradient(135deg,#ff1493 0%,#ff4fac 48%,#ff86c8 100%)
    `,
    padding: '24px 16px 42px',
    boxSizing: 'border-box',
    fontFamily: GAME_FONT,
  },

  topBar: {
    width: '100%',
    maxWidth: 860,
    margin: '0 auto 12px',
  },

  backBtn: {
    background: 'linear-gradient(180deg,#ffffff,#ffe2f1)',
    color: '#9b0054',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 rgba(155,0,84,.22)',
  },

  title: {
    color: '#fff',
    fontWeight: 900,
    fontSize: 'clamp(2.3rem,5vw,4.3rem)',
    margin: '0 0 14px',
    textAlign: 'center',
    lineHeight: .95,
    textShadow: '0 6px 0 #9b0054, 0 12px 24px rgba(0,0,0,.26)',
  },

  stats: {
    display: 'flex',
    gap: 14,
    marginBottom: 24,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  stat: {
    background: '#fff',
    color: '#9b0054',
    padding: '8px 18px',
    borderRadius: 999,
    border: '3px solid #ffe2f1',
    fontWeight: 900,
    fontSize: '1.05rem',
    boxShadow: '0 5px 0 rgba(155,0,84,.28)',
  },

  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    width: '100%',
    maxWidth: 760,
    margin: '0 auto',
    background: '#fff',
    borderRadius: 36,
    padding: 22,
    border: '6px solid #ff1493',
    boxShadow: '0 10px 0 #9b0054, 0 22px 42px rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },

  endOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(46,0,35,.78)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: 24,
  },

  endCard: {
    background: '#fff',
    borderRadius: 36,
    padding: '46px 42px',
    textAlign: 'center',
    border: '6px solid #ff1493',
    boxShadow: '0 10px 0 #9b0054, 0 22px 45px rgba(0,0,0,.28)',
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
    background: 'linear-gradient(180deg,#ffffff,#ffe2f1)',
    color: '#9b0054',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '14px 30px',
    fontSize: '1.15rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 7px 0 rgba(155,0,84,.18)',
  },
};

function buildCards(pack) {
  return [...pack.flatMap((item, i) => [
    { id: `en-${i}`, pairId: i, content: item.word, type: 'en' },
    { id: `vn-${i}`, pairId: i, content: item.mean, type: 'vn' },
  ])]
    .sort(() => Math.random() - 0.5)
    .map((c) => ({ ...c, flipped: false, matched: false }));
}

function MemoryMatchGame({ packInfo, wordList }) {
  const history = useHistory();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('loading');
  const block = useRef(false);

  const init = useCallback(async () => {
    setStatus('loading');
    block.current = false;
    setFlipped([]);
    setMatched(0);
    setMoves(0);
    setScore(0);

    try {
      let pack;

      if (wordList?.length) {
        pack = wordList.slice(0, TOTAL);
      } else {
        const { type = '-1', level = '-1', specialty = '-1', topics = [] } = packInfo || {};
        const res = await gameApi.getWordPackCWG(type, level, specialty, topics, TOTAL);
        pack = (res?.data?.wordPack || []).slice(0, TOTAL);
      }

      if (!pack.length) {
        setStatus('error');
        return;
      }

      setCards(buildCards(pack));
      setStatus('playing');
    } catch {
      setStatus('error');
    }
  }, [packInfo, wordList]);

  useEffect(() => {
    init();
  }, [init]);

  const handleClick = useCallback(
    (id) => {
      if (block.current || status !== 'playing') return;

      setFlipped((prev) => {
        if (prev.includes(id) || prev.length >= 2) return prev;

        const next = [...prev, id];

        if (next.length === 2) {
          block.current = true;
          setMoves((m) => m + 1);

          setTimeout(() => {
            setCards((cs) => {
              const [a, b] = next.map((x) => cs.find((c) => c.id === x));

              if (a?.pairId === b?.pairId) {
                playCorrect();
                setScore((s) => s + 100);

                setMatched((m) => {
                  if (m + 1 >= TOTAL) {
                    playComplete();
                    setStatus('done');
                  }
                  return m + 1;
                });

                const updated = cs.map((c) =>
                  next.includes(c.id) ? { ...c, matched: true, flipped: true } : c
                );

                setFlipped([]);
                block.current = false;
                return updated;
              }

              playWrong();

              const updated = cs.map((c) =>
                next.includes(c.id) ? { ...c, flipped: false } : c
              );

              setFlipped([]);
              block.current = false;
              return updated;
            });
          }, 900);
        }

        return next;
      });

      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));
    },
    [status]
  );

  if (status === 'loading') {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{CSS}</style>
        <div style={{ color: '#fff', fontWeight: 900, fontSize: '1.4rem' }}>
          🃏 Đang xáo thẻ...
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{CSS}</style>
        <div style={S.endCard}>
          <div style={{ fontSize: '4rem' }}>😢</div>
          <h2 style={{ color: '#d63031', fontWeight: 900 }}>Lỗi tải dữ liệu</h2>
          <div style={S.endButtons}>
            <button onClick={init} style={S.mainBtn}>Thử lại</button>
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

      <h1 style={S.title}>Lật Thẻ Ghi Nhớ</h1>

      <div style={S.stats}>
        <span style={S.stat}>Đã ghép: {matched}/{TOTAL}</span>
        <span style={S.stat}>⭐ {score}</span>
        <span style={S.stat}>🔄 {moves} lượt</span>
      </div>

      <div style={S.board}>
        {cards.map((card) => (
          <div
            key={card.id}
            className="mm-scene"
            style={{
              width: '100%',
              paddingBottom: '100%',
              position: 'relative',
              cursor: card.matched ? 'default' : 'pointer',
            }}
            onClick={() => !card.matched && handleClick(card.id)}
          >
            <div style={{ position: 'absolute', inset: 0 }}>
              <div
                className={`mm-inner${card.flipped || card.matched ? ' flipped' : ''}${
                  card.matched ? ' mm-matched' : ''
                }`}
                style={{ width: '100%', height: '100%' }}
              >
                <div className="mm-face mm-back">
                  <span
                    style={{
                      fontSize: 'clamp(2rem,5vw,3.2rem)',
                      color: '#fff',
                      fontWeight: 900,
                      textShadow: '0 4px 0 rgba(0,0,0,.22)',
                    }}
                  >
                    ?
                  </span>
                </div>

                <div className={`mm-face ${card.type === 'en' ? 'mm-en' : 'mm-vn'}`}>
                  <span
                    style={{
                      color: '#fff',
                      fontWeight: 900,
                      fontSize: 'clamp(.72rem,2.2vw,1.05rem)',
                      lineHeight: 1.2,
                      textShadow: '0 2px 0 rgba(0,0,0,.25)',
                    }}
                  >
                    {card.content}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {status === 'done' && (
        <div style={S.endOverlay}>
          <div style={S.endCard} className="mm-pop">
            <div style={{ fontSize: '4.4rem' }}>🎉</div>
            <h2 style={{ color: '#ff1493', fontSize: '2.3rem', fontWeight: 900, margin: '8px 0' }}>
              Hoàn thành!
            </h2>
            <div style={{ color: '#ff8a00', fontSize: '2rem', fontWeight: 900 }}>
              ⭐ {score} điểm · 🔄 {moves} lượt
            </div>

            <div style={S.endButtons}>
              <button onClick={init} style={S.mainBtn}>Chơi lại</button>
              <button onClick={() => history.push('/games')} style={S.secondaryBtn}>Về kho game</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MemoryMatchPage() {
  const location = useLocation();
  const [packInfo, setPackInfo] = useState(location.state?.packInfo || null);
  const [wordList, setWordList] = useState(location.state?.wordList || null);

  const handleStart = (info) => {
    if (info.wordList) setWordList(info.wordList);
    else setPackInfo(info);
  };

  if (!packInfo && !wordList) {
    return <GameSetup title="🃏 Lật Thẻ Ghi Nhớ — Chọn chủ đề" onStart={handleStart} />;
  }

  return <MemoryMatchGame packInfo={packInfo} wordList={wordList} />;
}

export default MemoryMatchPage;