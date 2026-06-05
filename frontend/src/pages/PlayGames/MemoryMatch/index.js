import gameApi from 'apis/gameApi';
import GameSetup from 'components/PlayGames/GameSetup';
import { playComplete, playCorrect, playWrong } from 'helper/gameSound';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';
const TOTAL = 8;

const CSS = `
  .mm-scene {
    perspective: 1000px;
  }

  .mm-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform .38s cubic-bezier(.34,1.56,.64,1);
  }

  .mm-inner.flipped {
    transform: rotateY(180deg);
  }

  .mm-face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
    word-break: break-word;
    overflow: hidden;
  }

  .mm-face::before {
    content: "";
    position: absolute;
    inset: 8px;
    border-radius: 14px;
    pointer-events: none;
  }

  .mm-face::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(circle at 16% 18%, rgba(12,132,255,.07) 0 2px, transparent 3px),
      radial-gradient(circle at 78% 22%, rgba(25,199,168,.08) 0 2px, transparent 3px),
      radial-gradient(circle at 38% 74%, rgba(255,138,0,.07) 0 2px, transparent 3px);
    background-size: 34px 34px, 40px 40px, 38px 38px;
    opacity: .85;
  }

  .mm-back {
    background:
      linear-gradient(135deg, transparent 0 28%, rgba(25,199,168,.16) 28% 52%, transparent 52%),
      linear-gradient(180deg,#17252d 0%, #0b1419 100%);
    border: 4px solid rgba(25,199,168,.78);
    box-shadow:
      inset 0 0 0 3px rgba(255,255,255,.05),
      inset -6px -8px 14px rgba(0,0,0,.18),
      0 5px 0 rgba(25,199,168,.16);
  }

  .mm-back::before {
    border: 2px solid rgba(255,255,255,.12);
  }

  .mm-en,
  .mm-vn {
    transform: rotateY(180deg);
    background:
      linear-gradient(135deg, transparent 0 31%, rgba(10,132,255,.12) 31% 56%, transparent 56%),
      linear-gradient(180deg,#ffffff 0%, #eef7f4 100%);
    box-shadow:
      inset 0 0 0 3px rgba(255,255,255,.72),
      inset -6px -8px 13px rgba(0,0,0,.04),
      0 5px 0 rgba(0,0,0,.08);
  }

  .mm-en {
    border: 4px solid #ffb45c;
  }

  .mm-vn {
    border: 4px solid #49a8ff;
  }

  .mm-en::before {
    border: 2px solid rgba(255,138,0,.18);
  }

  .mm-vn::before {
    border: 2px solid rgba(10,132,255,.18);
  }

  .mm-card-text {
    position: relative;
    z-index: 2;
    color: #12313a;
    font-weight: 900;
    font-size: clamp(.88rem, 1.65vw, 1.22rem);
    line-height: 1.08;
    letter-spacing: 0;
    text-shadow: none;
    max-width: 100%;
  }

  .mm-card-type {
    position: absolute;
    left: 8px;
    top: 8px;
    z-index: 3;
    color: #ffffff;
    border-radius: 999px;
    padding: 3px 7px;
    font-size: .62rem;
    font-weight: 900;
    line-height: 1;
    border: 2px solid #fff;
  }

  .mm-card-type.en {
    background: linear-gradient(180deg,#ffb02e,#ef7200);
    box-shadow: 0 2px 0 rgba(181,85,0,.22);
  }

  .mm-card-type.vn {
    background: linear-gradient(180deg,#49a8ff,#0059b8);
    box-shadow: 0 2px 0 rgba(0,69,150,.22);
  }

  .mm-matched .mm-en,
  .mm-matched .mm-vn {
    opacity: .82;
    filter: saturate(.85);
  }

  .mm-matched .mm-en::after,
  .mm-matched .mm-vn::after {
    content: "✓";
    position: absolute;
    right: 7px;
    top: 7px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #1f9d45;
    border: 3px solid #ffffff;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 900;
    box-shadow: 0 3px 0 rgba(0,0,0,.16);
    opacity: 1;
  }

  @keyframes mmPop {
    0% { transform: scale(.94); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .mm-pop {
    animation: mmPop .24s ease;
  }

  @media (max-width: 860px) {
    .memory-board {
      grid-template-columns: repeat(4, 1fr) !important;
      gap: 10px !important;
      padding: 14px !important;
    }
  }

  @media (max-width: 620px) {
    .memory-board {
      grid-template-columns: repeat(3, 1fr) !important;
    }

    .mm-face {
      border-radius: 15px;
      padding: 8px;
    }

    .mm-card-text {
      font-size: clamp(.72rem, 3vw, 1rem);
      line-height: 1.05;
    }

    .mm-card-type {
      display: none;
    }

    .mm-matched .mm-en::after,
    .mm-matched .mm-vn::after {
      width: 22px;
      height: 22px;
      font-size: .86rem;
      border-width: 2px;
    }
  }
`;

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 14% 18%, rgba(25,199,168,.16) 0 4px, transparent 5px),
      radial-gradient(circle at 82% 22%, rgba(255,138,0,.12) 0 5px, transparent 6px),
      radial-gradient(circle at 28% 72%, rgba(255,20,147,.09) 0 4px, transparent 5px),
      linear-gradient(180deg, #05090d 0%, #071217 45%, #05090d 100%)
    `,
    backgroundSize: '90px 90px, 130px 130px, 110px 110px, auto',
    padding: '14px 16px 32px',
    boxSizing: 'border-box',
    fontFamily: GAME_FONT,
    color: '#ffffff',
  },

  topBar: {
    width: '100%',
    maxWidth: 980,
    margin: '0 auto 8px',
  },

  backBtn: {
    background: 'linear-gradient(180deg,#17252d,#0b1419)',
    color: '#d8fffa',
    border: '3px solid rgba(25,199,168,.75)',
    borderRadius: 999,
    padding: '8px 18px',
    fontSize: '.92rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 5px 0 rgba(25,199,168,.16)',
    textShadow: 'none',
  },

  title: {
    color: '#ffffff',
    fontWeight: 900,
    fontSize: 'clamp(1.85rem, 4vw, 3.35rem)',
    margin: '0 0 10px',
    textAlign: 'center',
    lineHeight: .95,
    letterSpacing: '.1px',
    textShadow: '0 2px 0 rgba(25,199,168,.32)',
  },

  stats: {
    display: 'flex',
    gap: 10,
    marginBottom: 14,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  stat: {
    background: 'linear-gradient(180deg,#f8fffc,#e9f4f1)',
    color: '#12313a',
    padding: '6px 14px',
    borderRadius: 999,
    border: '3px solid rgba(255,255,255,.94)',
    fontWeight: 900,
    fontSize: '.92rem',
    boxShadow: '0 4px 0 rgba(25,199,168,.18)',
    textShadow: 'none',
  },

  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    width: '100%',
    maxWidth: 880,
    margin: '0 auto',
    background: 'linear-gradient(180deg, rgba(18,31,38,.98), rgba(10,19,24,.98))',
    borderRadius: 28,
    padding: 16,
    border: '5px solid rgba(25,199,168,.56)',
    boxShadow: '0 8px 0 rgba(25,199,168,.18), 0 20px 42px rgba(0,0,0,.42)',
    boxSizing: 'border-box',
  },

  endOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,.76)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: 24,
    backdropFilter: 'blur(4px)',
  },

  endCard: {
    background: 'linear-gradient(180deg,#fbfffd,#eef7f4)',
    borderRadius: 30,
    padding: '36px 32px',
    textAlign: 'center',
    border: '5px solid rgba(25,199,168,.78)',
    boxShadow: '0 8px 0 rgba(25,199,168,.20), 0 24px 48px rgba(0,0,0,.32)',
    maxWidth: 440,
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
    background: 'linear-gradient(180deg,#17252d,#0b1419)',
    color: '#d8fffa',
    border: '3px solid rgba(25,199,168,.75)',
    borderRadius: 999,
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 rgba(25,199,168,.18)',
    textShadow: 'none',
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
          }, 850);
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

        <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.25rem', textShadow: 'none' }}>
          Đang xáo thẻ...
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{CSS}</style>

        <div style={S.endCard}>
          <h2 style={{ color: '#d63031', fontWeight: 900, fontSize: '1.6rem', marginTop: 0 }}>
            Lỗi tải dữ liệu
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

  return (
    <div style={S.page}>
      <style>{CSS}</style>

      <div style={S.topBar}>
        <button style={S.backBtn} onClick={() => history.push('/games')}>
          Về kho game
        </button>
      </div>

      <h1 style={S.title}>Lật Thẻ Ghi Nhớ</h1>

      <div style={S.stats}>
        <span style={S.stat}>Đã ghép: {matched}/{TOTAL}</span>
        <span style={S.stat}>Điểm: {score}</span>
        <span style={S.stat}>Lượt: {moves}</span>
      </div>

      <div style={S.board} className="memory-board">
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
                      fontSize: 'clamp(1.7rem, 4vw, 3rem)',
                      color: '#d8fffa',
                      fontWeight: 900,
                      textShadow: 'none',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    ?
                  </span>
                </div>

                <div className={`mm-face ${card.type === 'en' ? 'mm-en' : 'mm-vn'}`}>
                  <span className={`mm-card-type ${card.type === 'en' ? 'en' : 'vn'}`}>
                    {card.type === 'en' ? 'EN' : 'VI'}
                  </span>

                  <span className="mm-card-text">
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
            <h2
              style={{
                color: '#12313a',
                fontSize: '2rem',
                fontWeight: 900,
                margin: '0 0 10px',
                lineHeight: 1,
                textShadow: 'none',
              }}
            >
              Hoàn thành!
            </h2>

            <div style={{ color: '#12313a', fontSize: '1.2rem', fontWeight: 900 }}>
              {score} điểm · {moves} lượt
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
    return <GameSetup title="Lật Thẻ Ghi Nhớ — Chọn chủ đề" onStart={handleStart} />;
  }

  return <MemoryMatchGame packInfo={packInfo} wordList={wordList} />;
}

export default MemoryMatchPage;