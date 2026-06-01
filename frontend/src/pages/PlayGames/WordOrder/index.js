import gameApi from 'apis/gameApi';
import GameSetup from 'components/PlayGames/GameSetup';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildChips(word) {
  return shuffle(word.replace(/\s/g, '').split('').map((l, i) => ({ letter: l, id: `${i}-${l}` })));
}

function WordOrderGame({ packInfo, wordList }) {
  const [wordPack, setWordPack] = useState([]);
  const [current, setCurrent] = useState(0);
  const [assembled, setAssembled] = useState([]);
  const [available, setAvailable] = useState([]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('loading');
  const [feedback, setFeedback] = useState(null);
  const [timer, setTimer] = useState(30);
  const timerRef = useRef(null);

  useEffect(() => {
    if (wordList?.length) {
      const pack = wordList.slice(0, 20);
      setWordPack(pack);
      if (pack[0]) setAvailable(buildChips(pack[0].word));
      setStatus('playing');
      return;
    }
    const { type='-1', level='-1', specialty='-1', topics=[] } = packInfo || {};
    gameApi.getWordPackCWG(type, level, specialty, topics, 20).then(res => {
      const pack = res?.data?.wordPack || [];
      setWordPack(pack);
      if (pack[0]) setAvailable(buildChips(pack[0].word));
      setStatus('playing');
    }).catch(() => setStatus('done'));
  }, []);

  useEffect(() => {
    if (status !== 'playing') return clearInterval(timerRef.current);
    setTimer(30);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleCheck(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, status]);

  const handleCheck = useCallback((timedOut = false) => {
    clearInterval(timerRef.current);
    setStatus('checking');
    const entry = wordPack[current];
    const attempt = assembled.map(c => c.letter).join('');
    const ok = !timedOut && attempt.toLowerCase() === entry.word.toLowerCase();
    setFeedback(ok);
    if (ok) setScore(s => s + 100 + Math.round((timer / 30) * 50));
    setTimeout(() => {
      const next = current + 1;
      if (next >= wordPack.length) { setStatus('done'); return; }
      setCurrent(next);
      setAvailable(buildChips(wordPack[next].word));
      setAssembled([]);
      setFeedback(null);
      setStatus('playing');
    }, 1500);
  }, [assembled, current, timer, wordPack]);

  if (status === 'loading') return <div style={{ minHeight: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem' }}>Đang tải...</div>;

  if (status === 'done') return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#16213e', borderRadius: 24, padding: '48px 40px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '3rem' }}>{score >= 1500 ? '🏆' : score >= 800 ? '🌟' : '💪'}</div>
        <h2 style={{ color: '#fff', fontSize: '2rem', margin: '16px 0 8px' }}>Hoàn thành!</h2>
        <div style={{ color: '#e94560', fontSize: '3rem', fontWeight: 900, margin: '16px 0' }}>{score} điểm</div>
        <Link to="/games" style={{ display: 'inline-block', background: '#e94560', color: '#fff', padding: '12px 32px', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>Chơi game khác</Link>
      </div>
    </div>
  );

  const entry = wordPack[current];
  const pct = (timer / 30) * 100;

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#16213e', borderRadius: 24, padding: '36px 32px', width: '100%', maxWidth: 560, border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ color: '#e94560', fontSize: '1.3rem', fontWeight: 800 }}>📝 Sắp xếp chữ cái</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ background: '#0f3460', color: '#fff', padding: '4px 12px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 700 }}>Câu {current+1}/{wordPack.length}</span>
            <span style={{ background: '#e94560', color: '#fff', padding: '4px 12px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 700 }}>⭐{score}</span>
            <span style={{ background: timer > 15 ? '#26de81' : timer > 8 ? '#f7b731' : '#fc5c65', color: '#fff', padding: '4px 12px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 700 }}>⏱{timer}s</span>
          </div>
        </div>
        <div style={{ height: 6, background: `linear-gradient(90deg,#e94560 ${pct}%,rgba(255,255,255,0.08) ${pct}%)`, borderRadius: 3, marginBottom: 24 }} />
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: 4 }}>NGHĨA</div>
        <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, marginBottom: 6 }}>{entry?.mean}</div>
        {entry?.phonetic && <div style={{ color: '#e94560', fontSize: '0.95rem', marginBottom: 24 }}>{entry.phonetic}</div>}
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: 8 }}>ĐÁP ÁN:</div>
        <div style={{ minHeight: 52, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '10px 14px', marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {assembled.length === 0 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem' }}>Nhấn chữ bên dưới...</span>}
          {assembled.map(c => (
            <button key={c.id} onClick={() => { setAssembled(prev => prev.filter(x => x.id !== c.id)); setAvailable(prev => [...prev, c]); }}
              style={{ background: '#e94560', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer' }}>{c.letter}</button>
          ))}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: 8 }}>CHỌN CHỮ CÁI:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28, justifyContent: 'center' }}>
          {available.map(c => (
            <button key={c.id} onClick={() => { setAvailable(prev => prev.filter(x => x.id !== c.id)); setAssembled(prev => [...prev, c]); }}
              style={{ background: '#0f3460', color: '#fff', border: '2px solid #e94560', borderRadius: 10, padding: '10px 16px', fontSize: '1.15rem', fontWeight: 700, cursor: 'pointer' }}>{c.letter}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => { setAvailable(prev => [...prev, ...assembled]); setAssembled([]); }} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>Xóa</button>
          <button onClick={() => handleCheck(true)} style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>Bỏ qua</button>
          <button onClick={() => handleCheck(false)} disabled={assembled.length === 0 || status === 'checking'}
            style={{ background: '#e94560', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>Kiểm tra</button>
        </div>
        {feedback !== null && (
          <div style={{ textAlign: 'center', marginTop: 16, fontWeight: 800, fontSize: '1.1rem', color: feedback ? '#26de81' : '#fc5c65' }}>
            {feedback ? `✅ Chính xác! +${100 + Math.round((timer/30)*50)} điểm` : `❌ Sai! Đáp án: ${entry?.word}`}
          </div>
        )}
      </div>
    </div>
  );
}

function WordOrderPage() {
  const location = useLocation();
  const [packInfo, setPackInfo] = useState(location.state?.packInfo || null);
  const [wordList, setWordList] = useState(location.state?.wordList || null);

  const handleStart = (info) => {
    if (info.wordList) setWordList(info.wordList);
    else setPackInfo(info);
  };

  if (!packInfo && !wordList) {
    return <GameSetup title="📝 Sắp Xếp Chữ Cái — Chọn chủ đề" onStart={handleStart} />;
  }
  return <WordOrderGame packInfo={packInfo} wordList={wordList} />;
}

export default WordOrderPage;
