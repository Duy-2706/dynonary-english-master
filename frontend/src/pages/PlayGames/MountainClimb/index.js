import gameApi from 'apis/gameApi';
import GameSetup from 'components/PlayGames/GameSetup';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const CSS = `
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .climber { animation: bounce 1.8s ease-in-out infinite; }
`;

const COLORS = ['#6c5ce7','#e17055','#00b894','#0984e3'];
const N = 15;

function MountainGame({ packInfo, wordList }) {
  const [pack, setPack] = useState([]);
  const [cur, setCur] = useState(0);
  const [choices, setChoices] = useState([]);
  const [steps, setSteps] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selIdx, setSelIdx] = useState(null);
  const [status, setStatus] = useState('loading');
  const [feedback, setFeedback] = useState(null);
  const advRef = useRef(null);

  const buildC = (item) => [...(item.wrongList||[]).slice(0,3).map(w=>w.word), item.word].sort(()=>Math.random()-0.5);

  const init = useCallback(async()=>{
    setStatus('loading'); setCur(0); setSteps(0); setScore(0); setStreak(0); setSelIdx(null); setFeedback(null);
    try {
      let p;
      if (wordList?.length) {
        p = wordList.slice(0, N);
      } else {
        const { type='-1', level='-1', specialty='-1', topics=[] } = packInfo || {};
        const res = await gameApi.getWordPackCWG(type, level, specialty, topics, N);
        p = (res?.data?.wordPack||[]).slice(0,N);
      }
      setPack(p); setChoices(buildC(p[0])); setStatus('playing');
    } catch { setStatus('error'); }
  },[packInfo, wordList]);

  useEffect(()=>{init(); return()=>{if(advRef.current)clearTimeout(advRef.current);};},[init]);

  const handleChoice = useCallback((word, idx)=>{
    if(status!=='playing')return;
    const item=pack[cur];
    const ok=word===item.word;
    setSelIdx(idx); setStatus('answered');
    if(ok){
      const ns=streak+1;
      setStreak(ns);
      const bonus=ns>0&&ns%3===0?100:0;
      setScore(s=>s+100+bonus);
      setSteps(p=>Math.min(p+1,N));
      setFeedback({ok:true,correct:item.word,bonus});
    } else {
      setStreak(0); setSteps(p=>Math.max(0,p-1));
      setFeedback({ok:false,correct:item.word});
    }
    advRef.current=setTimeout(()=>{
      const next=cur+1;
      if(next>=pack.length){setStatus('done');return;}
      setCur(next); setChoices(buildC(pack[next])); setSelIdx(null); setFeedback(null); setStatus('playing');
    }, ok?800:1000);
  },[status,pack,cur,streak]);

  const getState=(word,idx)=>{
    if(status!=='answered')return 'idle';
    if(word===pack[cur]?.word)return 'correct';
    if(idx===selIdx)return 'wrong';
    return 'dim';
  };

  const pct=steps/N;

  if(status==='loading')return<div style={{minHeight:'100vh',background:'linear-gradient(160deg,#1a1a2e,#16213e)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'1.2rem'}}>Đang tải...</div>;
  if(status==='error')return<div style={{minHeight:'100vh',background:'linear-gradient(160deg,#1a1a2e,#16213e)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}><span style={{color:'#ef5350'}}>Lỗi tải dữ liệu!</span><button onClick={init} style={{background:'linear-gradient(135deg,#00b894,#00cec9)',color:'#fff',border:'none',padding:'12px 28px',borderRadius:20,fontWeight:800,cursor:'pointer'}}>Thử lại</button></div>;
  if(status==='done'){
    const max=N*100, p2=score/max;
    return<div style={{minHeight:'100vh',background:'linear-gradient(160deg,#1a1a2e,#16213e)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{background:'#16213e',borderRadius:28,padding:'48px 40px',textAlign:'center',border:'1px solid rgba(255,255,255,0.1)',maxWidth:440,width:'100%',animation:'fadeIn 0.4s ease'}}>
        <style>{CSS}</style>
        <span style={{fontSize:'4rem',display:'block',marginBottom:12}}>{p2>=0.8?'🏆':p2>=0.5?'🌟':'💪'}</span>
        <h2 style={{color:'#fff',fontSize:'1.8rem',fontWeight:900,margin:'0 0 8px'}}>Hoàn thành!</h2>
        <p style={{color:'rgba(255,255,255,0.55)',marginBottom:4}}>Bạn leo tới {steps}/{N} bậc</p>
        <div style={{color:'#ffd32a',fontSize:'2.6rem',fontWeight:900,margin:'12px 0 4px'}}>{score} điểm</div>
        <p style={{color:'rgba(255,255,255,0.45)',marginBottom:28}}>Tối đa {max} điểm</p>
        <button onClick={init} style={{background:'linear-gradient(135deg,#00b894,#00cec9)',color:'#fff',border:'none',borderRadius:30,padding:'14px 40px',fontSize:'1.05rem',fontWeight:800,cursor:'pointer'}}>Chơi lại 🏔️</button>
      </div>
    </div>;
  }

  const item=pack[cur];

  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#1a1a2e,#16213e)',display:'flex',flexDirection:'column',alignItems:'center',padding:'28px 16px',boxSizing:'border-box'}}>
      <style>{CSS}</style>
      <h1 style={{color:'#fff',fontSize:'clamp(1.5rem,4vw,2.2rem)',fontWeight:900,margin:'0 0 6px',textAlign:'center'}}>🏔️ Leo núi tiếng Anh</h1>
      <div style={{display:'flex',gap:14,marginBottom:22,flexWrap:'wrap',justifyContent:'center'}}>
        <span style={{background:'rgba(255,255,255,0.1)',padding:'5px 16px',borderRadius:20,color:'#fff',fontWeight:700}}>Câu {cur+1}/{N}</span>
        <span style={{background:'rgba(255,211,42,0.2)',padding:'5px 16px',borderRadius:20,color:'#fff',fontWeight:700}}>⭐ {score}</span>
        <span style={{background:streak>=3?'linear-gradient(90deg,#f9ca24,#f0932b)':'rgba(255,255,255,0.1)',padding:'5px 16px',borderRadius:20,color:'#fff',fontWeight:700,transition:'background 0.3s'}}>🔥 {streak} liên tiếp{streak>=3?' +100!':''}</span>
      </div>
      <div style={{display:'flex',gap:28,alignItems:'flex-start',width:'100%',maxWidth:660}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
          <span style={{fontSize:'2rem',marginBottom:6}}>🏔️</span>
          <div style={{width:28,height:220,background:'#2d3436',borderRadius:14,position:'relative',overflow:'visible',boxShadow:'inset 0 2px 8px rgba(0,0,0,0.4)'}}>
            <div style={{position:'absolute',bottom:0,left:0,right:0,height:`${Math.max(0,Math.min(100,pct*100))}%`,background:'linear-gradient(180deg,#00cec9,#00b894)',borderRadius:14,transition:'height 0.5s cubic-bezier(.34,1.56,.64,1)'}}/>
            <div className="climber" style={{position:'absolute',left:'50%',bottom:`calc(${Math.max(0,Math.min(100,pct*100))}% - 4px)`,transform:'translateX(-50%)',fontSize:'1.6rem',lineHeight:1,transition:'bottom 0.5s cubic-bezier(.34,1.56,.64,1)',zIndex:2}}>🧗</div>
          </div>
          <span style={{color:'rgba(255,255,255,0.55)',fontSize:'0.78rem',fontWeight:700,marginTop:8}}>{Math.round(pct*100)}%</span>
        </div>
        <div style={{flex:1,background:'#16213e',borderRadius:20,padding:'28px 24px',border:'1px solid rgba(255,255,255,0.07)'}}>
          <div style={{color:'rgba(255,255,255,0.5)',fontSize:'0.8rem',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:8}}>Từ nào có nghĩa là:</div>
          <div style={{color:'#fff',fontSize:'clamp(1.1rem,3vw,1.4rem)',fontWeight:800,marginBottom:24}}>"{item?.mean}"</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {choices.map((c,i)=>{
              const st=getState(c,i);
              const bg=st==='correct'?'#00b894':st==='wrong'?'#e17055':st==='dim'?'rgba(255,255,255,0.07)':COLORS[i%4];
              const border=st==='correct'?'2px solid #00cec9':st==='wrong'?'2px solid #d63031':'2px solid transparent';
              return<button key={i} onClick={()=>handleChoice(c,i)} disabled={status==='answered'} style={{background:bg,color:'#fff',border,borderRadius:14,padding:'14px 12px',fontSize:'clamp(0.85rem,2.5vw,1rem)',fontWeight:700,cursor:st==='idle'?'pointer':'default',transition:'all 0.15s',boxShadow:`0 4px 16px ${bg}55`}}>{c}</button>;
            })}
          </div>
          {feedback&&(
            <div style={{marginTop:16,padding:'10px 16px',borderRadius:10,background:feedback.ok?'rgba(0,184,148,0.18)':'rgba(225,112,85,0.18)',color:feedback.ok?'#55efc4':'#fab1a0',fontWeight:700,fontSize:'0.95rem',textAlign:'center',animation:'fadeIn 0.25s ease'}}>
              {feedback.ok?(feedback.bonus?`✅ Chính xác! +100 🔥 Streak +${feedback.bonus}!`:'✅ Chính xác! +100 điểm'):`❌ Sai! Đáp án: "${feedback.correct}"`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MountainPage() {
  const location = useLocation();
  const [packInfo, setPackInfo] = useState(location.state?.packInfo || null);
  const [wordList, setWordList] = useState(location.state?.wordList || null);

  const handleStart = (info) => {
    if (info.wordList) setWordList(info.wordList);
    else setPackInfo(info);
  };

  if (!packInfo && !wordList) {
    return <GameSetup title="🏔️ Leo Núi Từ Vựng — Chọn chủ đề" onStart={handleStart} />;
  }
  return <MountainGame packInfo={packInfo} wordList={wordList} />;
}

export default MountainPage;
