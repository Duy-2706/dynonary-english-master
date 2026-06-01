import gameApi from 'apis/gameApi';
import GameSetup from 'components/PlayGames/GameSetup';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const CSS = `
  .mm-scene { perspective: 600px; }
  .mm-inner { position:relative; width:100%; height:100%; transform-style:preserve-3d; transition:transform 0.4s ease; }
  .mm-inner.flipped { transform:rotateY(180deg); }
  .mm-face { position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden; border-radius:12px; display:flex; align-items:center; justify-content:center; padding:8px; box-sizing:border-box; text-align:center; word-break:break-word; }
  .mm-back { background:#1a237e; border:2px solid #3949ab; }
  .mm-en { background:linear-gradient(135deg,#e91e63,#ff5722); transform:rotateY(180deg); border:2px solid #ff8a65; }
  .mm-vn { background:linear-gradient(135deg,#2196f3,#00bcd4); transform:rotateY(180deg); border:2px solid #4fc3f7; }
  .mm-matched .mm-en, .mm-matched .mm-vn { border:2px solid #66bb6a; opacity:0.65; }
`;

function buildCards(pack) {
  return [...pack.flatMap((item, i) => [
    { id: `en-${i}`, pairId: i, content: item.word, type: 'en' },
    { id: `vn-${i}`, pairId: i, content: item.mean, type: 'vn' },
  ])].sort(() => Math.random() - 0.5).map(c => ({ ...c, flipped: false, matched: false }));
}

function MemoryMatchGame({ packInfo, wordList }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('loading');
  const block = useRef(false);
  const TOTAL = 8;

  const init = useCallback(async () => {
    setStatus('loading'); block.current = false;
    setFlipped([]); setMatched(0); setMoves(0); setScore(0);
    try {
      if (wordList?.length) {
        setCards(buildCards(wordList.slice(0, TOTAL)));
        setStatus('playing');
        return;
      }
      const { type='-1', level='-1', specialty='-1', topics=[] } = packInfo || {};
      const res = await gameApi.getWordPackCWG(type, level, specialty, topics, TOTAL);
      setCards(buildCards(res.data.wordPack.slice(0, TOTAL)));
      setStatus('playing');
    } catch { setStatus('error'); }
  }, [packInfo, wordList]);

  useEffect(() => { init(); }, [init]);

  const handleClick = useCallback((id) => {
    if (block.current || status !== 'playing') return;
    setFlipped(prev => {
      if (prev.includes(id) || prev.length >= 2) return prev;
      const next = [...prev, id];
      if (next.length === 2) {
        block.current = true;
        setMoves(m => m + 1);
        setTimeout(() => {
          setCards(cs => {
            const [a, b] = next.map(x => cs.find(c => c.id === x));
            if (a?.pairId === b?.pairId) {
              setScore(s => s + 100);
              setMatched(m => { if (m + 1 >= TOTAL) setStatus('done'); return m + 1; });
              const updated = cs.map(c => next.includes(c.id) ? { ...c, matched: true, flipped: true } : c);
              setFlipped([]); block.current = false;
              return updated;
            }
            const updated = cs.map(c => next.includes(c.id) ? { ...c, flipped: false } : c);
            setFlipped([]); block.current = false;
            return updated;
          });
        }, 1000);
      }
      return next;
    });
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
  }, [status]);

  if (status === 'loading') return <div style={{ minHeight: '100vh', background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem' }}>Đang tải...</div>;
  if (status === 'error') return <div style={{ minHeight: '100vh', background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef5350', fontSize: '1rem', flexDirection: 'column', gap: 16 }}><span>Lỗi tải dữ liệu</span><button onClick={init} style={{ background: '#e91e63', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, cursor: 'pointer', fontWeight: 700 }}>Thử lại</button></div>;

  return (
    <div style={{ minHeight: '100vh', background: '#121212', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 16px' }}>
      <style>{CSS}</style>
      <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 900, margin: '0 0 12px' }}>🃏 Lật thẻ ghi nhớ</h1>
      <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
        <span style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 18px', borderRadius: 20, color: '#fff', fontWeight: 700 }}>Đã ghép: {matched}/{TOTAL}</span>
        <span style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 18px', borderRadius: 20, color: '#ffd54f', fontWeight: 700 }}>⭐ {score}</span>
        <span style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 18px', borderRadius: 20, color: '#fff', fontWeight: 700 }}>🔄 {moves}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, width: '100%', maxWidth: 520 }}>
        {cards.map(card => (
          <div key={card.id} className="mm-scene" style={{ width: '100%', paddingBottom: '100%', position: 'relative', cursor: card.matched ? 'default' : 'pointer' }} onClick={() => !card.matched && handleClick(card.id)}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <div className={`mm-inner${card.flipped || card.matched ? ' flipped' : ''}${card.matched ? ' mm-matched' : ''}`} style={{ width: '100%', height: '100%' }}>
                <div className="mm-face mm-back"><span style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', color: '#7986cb', fontWeight: 900 }}>?</span></div>
                <div className={`mm-face ${card.type === 'en' ? 'mm-en' : 'mm-vn'}`}><span style={{ color: '#fff', fontWeight: 700, fontSize: 'clamp(0.55rem,2.2vw,0.85rem)', lineHeight: 1.3 }}>{card.content}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {status === 'done' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'linear-gradient(135deg,#1a237e,#283593)', borderRadius: 24, padding: '40px 48px', textAlign: 'center', border: '2px solid rgba(255,255,255,0.15)' }}>
            <div style={{ fontSize: '2.5rem', color: '#fff', fontWeight: 900, marginBottom: 8 }}>🎉 Hoàn thành!</div>
            <div style={{ color: '#ffd54f', fontWeight: 700, fontSize: '1.3rem', marginBottom: 24 }}>⭐ {score} điểm &nbsp;|&nbsp; 🔄 {moves} lượt</div>
            <button onClick={init} style={{ background: 'linear-gradient(135deg,#e91e63,#ff5722)', color: '#fff', border: 'none', borderRadius: 30, padding: '14px 36px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer' }}>Chơi lại</button>
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
