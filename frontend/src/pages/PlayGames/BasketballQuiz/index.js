import gameApi from 'apis/gameApi';
import GameSetup from 'components/PlayGames/GameSetup';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const CSS = `
  @keyframes throwBall { 0%{bottom:60px;left:50%;transform:translateX(-50%) scale(1);opacity:1} 70%{bottom:72%;left:50%;transform:translateX(-50%) scale(0.7);opacity:1} 100%{bottom:70%;left:50%;transform:translateX(-50%) scale(0.4);opacity:0} }
  @keyframes hoopShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .bb-fly{position:absolute;font-size:2.4rem;animation:throwBall 1.5s ease forwards;z-index:10;pointer-events:none}
  .bb-shake{animation:hoopShake 0.5s ease 1s}
  .bb-spin{width:48px;height:48px;border:5px solid rgba(243,156,18,0.25);border-top-color:#f39c12;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px}
`;

const COLORS = ['#e74c3c','#3498db','#2ecc71','#f39c12'];
const N = 20, T = 10;

function BasketballQuizGame({ packInfo, wordList }) {
  const [pack, setPack] = useState([]);
  const [cur, setCur] = useState(0);
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(T);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('loading');
  const [showBall, setShowBall] = useState(false);
  const [shake, setShake] = useState(false);
  const [err, setErr] = useState(null);
  const timerRef = useRef(null);
  const advRef = useRef(null);

  const buildChoices = (item) => [...(item.wrongList||[]).slice(0,3).map(w=>w.word||w), item.word].sort(()=>Math.random()-0.5);

  const init = useCallback(async () => {
    setStatus('loading'); setErr(null); setCur(0); setScore(0); setSelected(null); setShowBall(false); setShake(false);
    try {
      let p;
      if (wordList?.length) {
        p = wordList.slice(0, N);
      } else {
        const { type='-1', level='-1', specialty='-1', topics=[] } = packInfo || {};
        const res = await gameApi.getWordPackCWG(type, level, specialty, topics, N);
        p = (res.data.wordPack||[]).slice(0,N);
      }
      setPack(p); setChoices(buildChoices(p[0])); setTimer(T); setStatus('playing');
    } catch { setErr('Không thể tải. Thử lại!'); }
  }, [packInfo, wordList]);

  useEffect(()=>{init();},[init]);

  useEffect(()=>{
    if(status!=='playing'){clearInterval(timerRef.current);return;}
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(timerRef.current);advance(false,'__timeout__');return 0;}return t-1;}),1000);
    return()=>clearInterval(timerRef.current);
  },[status,cur]);

  const advance = useCallback((correct, sel) => {
    setSelected(sel);
    clearTimeout(advRef.current);
    advRef.current = setTimeout(()=>{
      setCur(prev=>{
        const next=prev+1;
        if(next>=pack.length){setStatus('done');return prev;}
        setChoices(buildChoices(pack[next])); setSelected(null); setShowBall(false); setShake(false); setTimer(T); setStatus('playing');
        return next;
      });
    },1500);
  },[pack]);

  const handleAnswer = useCallback((choice)=>{
    if(status!=='playing')return;
    clearInterval(timerRef.current);
    const item=pack[cur];
    const ok=choice===item.word;
    setStatus('animating');
    if(ok){
      const gain=200+Math.round((timer/T)*100);
      setScore(s=>s+gain);
      setShowBall(true);
      setTimeout(()=>setShake(true),1000);
    }
    advance(ok,choice);
  },[status,pack,cur,timer,advance]);

  const getState=(choice)=>{
    if(status==='playing')return 'idle';
    if(choice===pack[cur]?.word)return 'correct';
    if(choice===selected)return 'wrong';
    return 'dim';
  };

  if(status==='loading'&&!err)return<div style={{minHeight:'100vh',background:'#1a0a00',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><style>{CSS}</style><div className="bb-spin"/><span style={{color:'rgba(255,255,255,0.7)'}}>Đang tải...</span></div>;
  if(err)return<div style={{minHeight:'100vh',background:'#1a0a00',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}><style>{CSS}</style><span style={{color:'#e74c3c'}}>{err}</span><button onClick={init} style={{background:'linear-gradient(135deg,#f39c12,#e67e22)',color:'#fff',border:'none',padding:'12px 28px',borderRadius:20,fontWeight:800,cursor:'pointer'}}>Thử lại</button></div>;
  if(status==='done'){
    const max=N*300,pct=Math.round(score/max*100);
    return<div style={{minHeight:'100vh',background:'#1a0a00',display:'flex',alignItems:'center',justifyContent:'center'}}><style>{CSS}</style>
      <div style={{background:'linear-gradient(135deg,#3d1a00,#5d2a00)',borderRadius:24,padding:'40px 48px',textAlign:'center',border:'2px solid rgba(243,156,18,0.4)',maxWidth:360,width:'90%'}}>
        <div style={{fontSize:'3rem'}}>{pct>=80?'🏆':pct>=50?'🌟':'💪'}</div>
        <h2 style={{color:'#f39c12',fontWeight:900,fontSize:'2rem',margin:'8px 0'}}>Trận đấu kết thúc!</h2>
        <div style={{color:'#fff',fontSize:'3rem',fontWeight:900,margin:'8px 0'}}>{score}</div>
        <p style={{color:'rgba(255,255,255,0.6)',marginBottom:28}}>{N} câu · Tối đa {max} điểm</p>
        <button onClick={init} style={{background:'linear-gradient(135deg,#f39c12,#e67e22)',color:'#fff',border:'none',borderRadius:30,padding:'14px 40px',fontSize:'1.1rem',fontWeight:800,cursor:'pointer'}}>Chơi lại</button>
      </div>
    </div>;
  }

  const item=pack[cur];
  const pct=(timer/T)*100;

  return(
    <div style={{minHeight:'100vh',background:'#1a0a00',display:'flex',flexDirection:'column',alignItems:'center',padding:'24px 16px',boxSizing:'border-box'}}>
      <style>{CSS}</style>
      <h1 style={{color:'#f39c12',fontWeight:900,fontSize:'clamp(1.5rem,4vw,2rem)',margin:'0 0 10px',textShadow:'0 2px 12px rgba(243,156,18,0.5)'}}>🏀 Ném bóng từ vựng</h1>
      <div style={{display:'flex',gap:16,marginBottom:16}}>
        <span style={{background:'rgba(255,255,255,0.1)',padding:'5px 16px',borderRadius:20,color:'#fff',fontWeight:700}}>Câu {cur+1}/{pack.length}</span>
        <span style={{background:'rgba(255,255,255,0.1)',padding:'5px 16px',borderRadius:20,color:'#ffd54f',fontWeight:700}}>⭐ {score}</span>
        <span style={{background:'rgba(255,255,255,0.1)',padding:'5px 16px',borderRadius:20,color:timer>5?'#2ecc71':timer>3?'#f39c12':'#e74c3c',fontWeight:700}}>⏱ {timer}s</span>
      </div>
      <div style={{position:'relative',width:'100%',maxWidth:420,height:200,marginBottom:20,background:'linear-gradient(180deg,#2d1200,#3d1a00)',borderRadius:20,border:'2px solid rgba(255,140,0,0.3)',overflow:'visible'}}>
        <div style={{position:'absolute',top:18,left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',zIndex:5}}>
          <span className={shake?'bb-shake':''} style={{fontSize:'3rem',lineHeight:1}}>🥅</span>
          <div style={{width:4,height:40,background:'linear-gradient(180deg,#888,#555)',borderRadius:2,marginTop:2}}/>
        </div>
        <div style={{position:'absolute',bottom:16,left:'10%',right:'10%',height:2,background:'rgba(255,140,0,0.25)',borderRadius:1}}/>
        {!showBall&&<div style={{position:'absolute',bottom:24,left:'50%',transform:'translateX(-50%)',fontSize:'2.4rem',zIndex:5}}>🏀</div>}
        {showBall&&<span className="bb-fly">🏀</span>}
      </div>
      <div style={{width:'100%',maxWidth:420,height:10,background:'rgba(255,255,255,0.08)',borderRadius:5,marginBottom:20,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${pct}%`,background:pct>50?'linear-gradient(90deg,#2ecc71,#27ae60)':pct>25?'linear-gradient(90deg,#f39c12,#e67e22)':'linear-gradient(90deg,#e74c3c,#c0392b)',borderRadius:5,transition:'width 1s linear'}}/>
      </div>
      <div style={{background:'rgba(255,255,255,0.06)',borderRadius:16,padding:'18px 24px',marginBottom:20,width:'100%',maxWidth:420,textAlign:'center',border:'1px solid rgba(255,255,255,0.1)'}}>
        <div style={{color:'rgba(255,255,255,0.55)',fontSize:'0.8rem',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:8}}>Từ nào có nghĩa là:</div>
        <div style={{color:'#fff',fontSize:'clamp(1.1rem,3vw,1.5rem)',fontWeight:800}}>"{item?.mean}"</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,width:'100%',maxWidth:420}}>
        {choices.map((c,i)=>{
          const st=getState(c);
          const bg=st==='correct'?'#2ecc71':st==='wrong'?'#555':st==='dim'?'rgba(255,255,255,0.05)':COLORS[i%4];
          const border=st==='correct'?'2px solid #2ecc71':st==='wrong'?'2px solid #e74c3c':'2px solid transparent';
          return<button key={i} onClick={()=>handleAnswer(c)} disabled={status!=='playing'} style={{background:`linear-gradient(135deg,${bg}dd,${bg}99)`,color:'#fff',border,borderRadius:14,padding:'14px 10px',fontSize:'clamp(0.85rem,2.5vw,1rem)',fontWeight:700,cursor:status==='playing'?'pointer':'default',transition:'all 0.2s',boxShadow:`0 4px 16px ${bg}44`}}>{c}</button>;
        })}
      </div>
      {status==='animating'&&selected&&(
        <div style={{width:'100%',maxWidth:420,textAlign:'center',padding:'10px',borderRadius:12,marginTop:14,fontWeight:800,fontSize:'1.1rem',color:'#fff',background:selected===item.word?'rgba(46,204,113,0.3)':'rgba(231,76,60,0.3)',border:`1px solid ${selected===item.word?'#2ecc71':'#e74c3c'}`}}>
          {selected===item.word?`✅ Chính xác!`:selected==='__timeout__'?`⏰ Hết giờ! Đáp án: "${item.word}"`:`❌ Sai! Đáp án: "${item.word}"`}
        </div>
      )}
    </div>
  );
}

function BasketballPage() {
  const location = useLocation();
  const [packInfo, setPackInfo] = useState(location.state?.packInfo || null);
  const [wordList, setWordList] = useState(location.state?.wordList || null);

  const handleStart = (info) => {
    if (info.wordList) setWordList(info.wordList);
    else setPackInfo(info);
  };

  if (!packInfo && !wordList) {
    return <GameSetup title="🏀 Ném Bóng Từ Vựng — Chọn chủ đề" onStart={handleStart} />;
  }
  return <BasketballQuizGame packInfo={packInfo} wordList={wordList} />;
}

export default BasketballPage;