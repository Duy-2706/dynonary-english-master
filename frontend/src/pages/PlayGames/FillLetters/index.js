import gameApi from 'apis/gameApi';
import GameSetup from 'components/PlayGames/GameSetup';
import { playComplete, playCorrect, playWrong } from 'helper/gameSound';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function buildBlanked(word) {
  const letters = word.split('');
  const alphaIdx = letters.map((c, i) => /[a-zA-Z]/.test(c) ? i : -1).filter(i => i !== -1);
  const n = Math.max(1, Math.min(4, Math.round(alphaIdx.length * 0.35)));
  const blankSet = new Set([...alphaIdx].sort(() => Math.random() - 0.5).slice(0, n));
  return {
    blankedWord: letters.map((letter, i) => ({ letter, blanked: blankSet.has(i) })),
    blankedLetters: letters.filter((_, i) => blankSet.has(i)).join('').toLowerCase(),
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
    if (wordList?.length) {
      const pack = wordList.slice(0, 20);
      setWordPack(pack);
      if (pack[0]) { const b = buildBlanked(pack[0].word); setBlankedWord(b.blankedWord); setBlankedLetters(b.blankedLetters); }
      setStatus('playing');
      return;
    }
    const { type='-1', level='-1', specialty='-1', topics=[] } = packInfo || {};
    gameApi.getWordPackCWG(type, level, specialty, topics, 20).then(res => {
      const pack = res?.data?.wordPack || [];
      setWordPack(pack);
      if (pack[0]) { const b = buildBlanked(pack[0].word); setBlankedWord(b.blankedWord); setBlankedLetters(b.blankedLetters); }
      setStatus('playing');
    }).catch(() => setStatus('done'));
  }, []);

  const advance = useCallback((idx, pack) => {
    const next = idx + 1;
    setTimeout(() => {
      setFlash(null);
      if (next >= pack.length) { playComplete(); setStatus('done'); return; }
      setCurrent(next);
      const b = buildBlanked(pack[next].word);
      setBlankedWord(b.blankedWord); setBlankedLetters(b.blankedLetters);
      setInput(''); setFeedback(null); setStatus('playing');
    }, 1600);
  }, []);

  const handleCheck = useCallback(() => {
    if (status !== 'playing') return;
    setStatus('checking');
    const ok = input.trim().toLowerCase() === blankedLetters;
    setFeedback(ok ? 'correct' : 'wrong');
    setFlash(ok ? '#26de81' : '#fc5c65');
    if (ok) { playCorrect(); setScore(s => s + 100); } else { playWrong(); }
    advance(current, wordPack);
  }, [status, input, blankedLetters, current, wordPack, advance]);

  const handleSkip = useCallback(() => {
    if (status !== 'playing') return;
    setStatus('checking');
    setFeedback('wrong'); setFlash('#fc5c65');
    advance(current, wordPack);
  }, [status, current, wordPack, advance]);

  if (status === 'loading') return <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f0c29,#302b63)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Đang tải...</div>;

  if (status === 'done') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f0c29,#302b63)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 24, padding: '52px 40px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.12)', maxWidth: 400 }}>
        <div style={{ fontSize: '3.5rem' }}>{score >= 1500 ? '🏆' : score >= 800 ? '🌟' : '💪'}</div>
        <h2 style={{ color: '#fff', fontSize: '1.8rem', margin: '12px 0' }}>Hoàn thành!</h2>
        <div style={{ color: '#f7b731', fontSize: '3.5rem', fontWeight: 900 }}>{score} điểm</div>
        <Link to="/games" style={{ display: 'inline-block', marginTop: 24, background: 'linear-gradient(135deg,#f7b731,#f0932b)', color: '#1a1a2e', padding: '14px 36px', borderRadius: 14, textDecoration: 'none', fontWeight: 900 }}>Chơi game khác</Link>
      </div>
    </div>
  );

  const entry = wordPack[current];
  const pct = Math.round((current / wordPack.length) * 100);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 24, padding: '36px 32px', width: '100%', maxWidth: 560, border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ color: '#f7b731', fontSize: '1.3rem', fontWeight: 900 }}>✏️ Điền chữ còn thiếu</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '4px 12px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 700 }}>Câu {current+1}/{wordPack.length}</span>
            <span style={{ background: '#f7b731', color: '#1a1a2e', padding: '4px 12px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 700 }}>⭐{score}</span>
          </div>
        </div>
        <div style={{ height: 5, background: `linear-gradient(90deg,#f7b731 ${pct}%,rgba(255,255,255,0.08) ${pct}%)`, borderRadius: 3, marginBottom: 24 }} />
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', marginBottom: 4 }}>NGHĨA</div>
        <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, marginBottom: 28 }}>{entry?.mean}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 28 }}>
          {blankedWord.map((item, i) => (
            !/[a-zA-Z]/.test(item.letter)
              ? <span key={i} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.3rem', alignSelf: 'center' }}>{item.letter}</span>
              : <div key={i} style={{ width: 44, height: 52, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, background: item.blanked ? (flash || '#f7b731') : 'rgba(255,255,255,0.15)', color: item.blanked ? '#1a1a2e' : '#fff', border: `2px solid ${item.blanked ? (flash || '#f7b731') : 'rgba(255,255,255,0.12)'}`, transition: 'background 0.3s' }}>{item.blanked ? '_' : item.letter}</div>
          ))}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', marginBottom: 8 }}>Nhập chữ bị thiếu (theo thứ tự):</div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && input.trim() && handleCheck()} disabled={status === 'checking'}
            autoFocus autoComplete="off" spellCheck={false} placeholder={`${blankedLetters.length} chữ cái`}
            style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: `2px solid ${flash || 'rgba(255,255,255,0.2)'}`, borderRadius: 12, padding: '12px 18px', fontSize: '1.2rem', fontWeight: 700, color: '#fff', outline: 'none', letterSpacing: 2, transition: 'border-color 0.3s' }} />
          <button onClick={handleSkip} disabled={status === 'checking'} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}>Bỏ qua</button>
          <button onClick={handleCheck} disabled={status === 'checking' || !input.trim()} style={{ background: 'linear-gradient(135deg,#f7b731,#f0932b)', color: '#1a1a2e', border: 'none', borderRadius: 12, padding: '12px 20px', fontWeight: 900, cursor: 'pointer' }}>Kiểm tra</button>
        </div>
        {feedback && (
          <div style={{ padding: '12px 16px', borderRadius: 12, background: feedback === 'correct' ? 'rgba(38,222,129,0.15)' : 'rgba(252,92,101,0.15)', color: feedback === 'correct' ? '#26de81' : '#fc5c65', fontWeight: 700, textAlign: 'center', border: `1px solid ${feedback === 'correct' ? 'rgba(38,222,129,0.4)' : 'rgba(252,92,101,0.4)'}` }}>
            {feedback === 'correct' ? '✅ Chính xác! +100 điểm' : `❌ Sai! Đáp án đúng: ${blankedLetters}`}
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
    return <GameSetup title="✏️ Điền Chữ Còn Thiếu — Chọn chủ đề" onStart={handleStart} />;
  }
  return <FillLettersGame packInfo={packInfo} wordList={wordList} />;
}

export default FillLettersPage;
