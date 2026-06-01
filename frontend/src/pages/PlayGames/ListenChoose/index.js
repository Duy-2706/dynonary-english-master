import gameApi from 'apis/gameApi';
import GameSetup from 'components/PlayGames/GameSetup';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const CSS = `
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
  .lc-spin{animation:spin 0.9s linear infinite}
  .lc-pulse{animation:pulse 1.2s ease infinite}
`;
const N = 20;

function buildSet(pack, correct) {
  const wrong = pack.filter(w=>w.word!==correct.word).sort(()=>Math.random()-0.5).slice(0,3);
  return [...wrong, correct].sort(()=>Math.random()-0.5).map(w=>({
    word: w.word, picture: w.picture||'',
    audioUrl: w.audioUrl||`https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(w.word)}`,
    isCorrect: w.word===correct.word,
  }));
}

function ListenChooseGame({ packInfo, wordList }) {
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

  const playAudio = useCallback((url)=>{
    try{if(audioRef.current)audioRef.current.pause(); const a=new Audio(url); audioRef.current=a; a.play().catch(()=>{});}catch{}
  },[]);

  useEffect(()=>{
    (async()=>{
      try{
        let p;
        if (wordList?.length) {
          p = wordList.filter(w => w.picture).slice(0, 20);
          if (!p.length) p = wordList.slice(0, 20);
        } else {
          const { type='-1', level='-1', specialty='-1', topics=[] } = packInfo || {};
          const res = await gameApi.getWordPackFG(type, level, specialty, topics);
          p = (res.data?.wordPack||[]).filter(w=>w.picture||w.audioUrl);
        }
        if(p.length<4){setStatus('done');return;}
        const qs=p.sort(()=>Math.random()-0.5).slice(0,N);
        setPack(p); setQuestions(qs);
        const s=buildSet(p,qs[0]); setQset(s);
        setStatus('playing');
        setTimeout(()=>playAudio(s.find(x=>x.isCorrect)?.audioUrl||''),400);
      }catch{setStatus('done');}
    })();
  },[playAudio]);

  const handleSelect=(idx)=>{
    if(answered)return;
    setSelIdx(idx); setAnswered(true);
    if(qset[idx]?.isCorrect)setScore(s=>s+200);
    setTimeout(()=>{
      const next=cur+1;
      if(next>=questions.length){setStatus('done');return;}
      setCur(next);
      const s=buildSet(pack,questions[next]); setQset(s);
      setSelIdx(null); setAnswered(false);
      setTimeout(()=>playAudio(s.find(x=>x.isCorrect)?.audioUrl||''),300);
    },1800);
  };

  const correctItem=qset.find(q=>q.isCorrect);

  const cardStyle=(idx)=>{
    const base={borderRadius:16,overflow:'hidden',cursor:answered?'default':'pointer',border:'3px solid transparent',transition:'all 0.25s',background:'#16213e',transform:hovered===idx&&!answered?'scale(1.04)':'scale(1)'};
    if(answered){
      if(qset[idx]?.isCorrect)return{...base,border:'3px solid #00b894',boxShadow:'0 0 20px rgba(0,184,148,0.5)'};
      if(idx===selIdx)return{...base,border:'3px solid #e17055',opacity:0.7};
    }
    if(hovered===idx&&!answered)return{...base,border:'3px solid #a55eea'};
    return base;
  };

  if(status==='loading')return<div style={{minHeight:'100vh',background:'#1a1a2e',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><style>{CSS}</style><div className="lc-spin" style={{width:52,height:52,border:'5px solid rgba(165,94,234,0.3)',borderTopColor:'#a55eea',borderRadius:'50%',marginBottom:16}}/><p style={{color:'#a55eea',fontSize:'1.2rem'}}>Đang tải...</p></div>;

  if(status==='done')return(
    <div style={{minHeight:'100vh',background:'#1a1a2e',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{background:'#16213e',borderRadius:24,padding:'48px 40px',textAlign:'center',maxWidth:480,width:'100%',border:'1px solid rgba(165,94,234,0.4)'}}>
        <div style={{fontSize:'4rem',marginBottom:16}}>{score>=3200?'🏆':score>=1600?'⭐':'💪'}</div>
        <h2 style={{color:'#fff',fontSize:'2rem',fontWeight:900,margin:'0 0 8px'}}>Hoàn thành!</h2>
        <div style={{background:'linear-gradient(135deg,#a55eea,#7c4dff)',borderRadius:16,padding:'20px 32px',margin:'24px auto',display:'inline-block'}}>
          <span style={{color:'#fff',fontSize:'2.8rem',fontWeight:900}}>⭐ {score}</span>
          <span style={{color:'rgba(255,255,255,0.7)',fontSize:'1rem',display:'block'}}>điểm</span>
        </div>
        <br/>
        <button onClick={()=>window.location.reload()} style={{padding:'12px 32px',borderRadius:12,border:'none',background:'linear-gradient(135deg,#a55eea,#7c4dff)',color:'#fff',fontSize:'1rem',fontWeight:700,cursor:'pointer'}}>🔄 Chơi lại</button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:'100vh',background:'#1a1a2e',padding:'24px 16px',boxSizing:'border-box'}}>
      <style>{CSS}</style>
      <div style={{maxWidth:700,margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24,background:'#16213e',borderRadius:16,padding:'16px 24px',border:'1px solid rgba(165,94,234,0.3)'}}>
          <div>
            <h1 style={{color:'#fff',fontSize:'1.4rem',fontWeight:900,margin:0}}>🔊 Nghe và chọn</h1>
            <p style={{color:'rgba(255,255,255,0.5)',margin:0,fontSize:'0.85rem'}}>Câu {cur+1}/{questions.length}</p>
          </div>
          <div style={{color:'#f7b731',fontWeight:900,fontSize:'1.6rem'}}>⭐ {score}</div>
        </div>
        <div style={{textAlign:'center',marginBottom:28}}>
          <p style={{color:'rgba(255,255,255,0.6)',marginBottom:12}}>Nghe từ và chọn hình ảnh đúng</p>
          <button className="lc-pulse" onClick={()=>correctItem&&playAudio(correctItem.audioUrl)} style={{width:80,height:80,borderRadius:'50%',border:'none',background:'linear-gradient(135deg,#a55eea,#7c4dff)',color:'#fff',fontSize:'2.4rem',cursor:'pointer',boxShadow:'0 8px 24px rgba(165,94,234,0.5)'}}>🔊</button>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.8rem',marginTop:8}}>Nhấn để nghe lại</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          {qset.map((item,idx)=>(
            <div key={idx} style={{...cardStyle(idx),position:'relative'}} onClick={()=>handleSelect(idx)} onMouseEnter={()=>!answered&&setHovered(idx)} onMouseLeave={()=>setHovered(null)}>
              {item.picture
                ?<img src={item.picture} alt="" style={{width:'100%',height:180,objectFit:'cover',display:'block'}} onError={e=>{e.target.style.display='none';}}/>
                :<div style={{width:'100%',height:180,background:`hsl(${idx*90},60%,25%)`,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'#fff',fontWeight:700,textAlign:'center',padding:8}}>{item.word}</span></div>
              }
              {answered&&item.isCorrect&&<div style={{position:'absolute',top:8,right:8,background:'#00b894',borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900}}>✓</div>}
              {answered&&idx===selIdx&&!item.isCorrect&&<div style={{position:'absolute',top:8,right:8,background:'#e17055',borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900}}>✗</div>}
            </div>
          ))}
        </div>
        {answered&&(
          <div style={{textAlign:'center',marginTop:20,padding:'12px 24px',borderRadius:12,background:qset[selIdx]?.isCorrect?'rgba(0,184,148,0.15)':'rgba(225,112,85,0.15)',border:`1px solid ${qset[selIdx]?.isCorrect?'#00b894':'#e17055'}`}}>
            <span style={{color:qset[selIdx]?.isCorrect?'#00b894':'#e17055',fontWeight:700,fontSize:'1.1rem'}}>
              {qset[selIdx]?.isCorrect?'✅ Chính xác! +200 điểm':`❌ Sai! Đáp án đúng: "${correctItem?.word}"`}
            </span>
          </div>
        )}
      </div>
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
