import gameApi from 'apis/gameApi';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const CSS = `
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes pop{0%{transform:scale(0.7);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
  .mp-spin{animation:spin 0.9s linear infinite;border-radius:50%}
  .mp-pop{animation:pop 0.3s ease forwards}
  .mp-pulse{animation:pulse 1.2s ease infinite}
`;

const COLORS = ['#e74c3c','#3498db','#2ecc71','#f39c12'];
const Q_SEC = 20;

function getGuestId(){try{let id=localStorage.getItem('dyno_guest_id');if(!id){id='guest_'+Math.random().toString(36).substr(2,9);localStorage.setItem('dyno_guest_id',id);}return id;}catch{return 'guest_'+Date.now();}}

function sortPlayers(players={}){return Object.entries(players).map(([uid,p])=>({uid,...p})).sort((a,b)=>b.score-a.score);}

const MEDALS=['🥇','🥈','🥉'];

function MultiplayerPage(){
  const [guestId]=useState(getGuestId);
  const [name,setName]=useState('');
  const [joinPin,setJoinPin]=useState('');
  const [view,setView]=useState('lobby');
  const [room,setRoom]=useState(null);
  const [myScore,setMyScore]=useState(0);
  const [selected,setSelected]=useState(null);
  const [submitted,setSubmitted]=useState(false);
  const [timer,setTimer]=useState(Q_SEC);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [feedback,setFeedback]=useState(null);
  const pollRef=useRef(null);
  const timerRef=useRef(null);
  const pinRef=useRef('');
  const prevQRef=useRef(0);

  const pollRoom=useCallback(async()=>{
    if(!pinRef.current)return;
    try{
      const res=await gameApi.getRoom(pinRef.current);
      const r=res.data?.room;
      if(!r)return;
      setRoom(prev=>{
        if(prev?.currentQuestion!==r.currentQuestion&&r.status==='playing'){
          prevQRef.current=r.currentQuestion;
          setSubmitted(false);setSelected(null);setFeedback(null);setTimer(Q_SEC);
        }
        return r;
      });
      if(r.status==='playing'&&view==='waiting')setView('playing');
      if(r.status==='ended'&&view!=='results'){setView('results');clearInterval(pollRef.current);clearInterval(timerRef.current);}
    }catch{}
  },[view]);

  useEffect(()=>{
    if(view==='waiting'||view==='playing'){
      pollRef.current=setInterval(pollRoom,2000);
      return()=>clearInterval(pollRef.current);
    }
  },[view,pollRoom]);

  useEffect(()=>{
    if(view!=='playing'||submitted)return;
    clearInterval(timerRef.current);
    setTimer(Q_SEC);
    timerRef.current=setInterval(()=>setTimer(t=>{
      if(t<=1){clearInterval(timerRef.current);if(!submitted){setSubmitted(true);setFeedback({ok:false,gain:0});gameApi.submitAnswer({pin:pinRef.current,userId:guestId,questionIndex:room?.currentQuestion||0,answer:'',timeMs:Q_SEC*1000}).catch(()=>{});}return 0;}
      return t-1;
    }),1000);
    return()=>clearInterval(timerRef.current);
  },[room?.currentQuestion,view]);

  async function handleCreate(){
    if(!name.trim()){setError('Nhập tên trước nhé!');return;}
    setError('');setLoading(true);
    try{
      const packRes=await gameApi.getWordPackCWG('-1','-1','-1',[],20);
      const raw=packRes.data?.wordPack||[];
      const wordPack=raw.map(item=>{
        const w3=(item.wrongList||[]).slice(0,3).map(w=>w.word);
        return{word:item.word,mean:item.mean,phonetic:item.phonetic||'',picture:item.picture||'',audioUrl:item.audioUrl||'',choices:[...w3,item.word].sort(()=>Math.random()-0.5),correct:item.word};
      });
      const res=await gameApi.createRoom({hostId:guestId,hostName:name.trim(),gameType:'mcq',wordPack});
      const {id,pin}=res.data?.room||res.data||{};
      pinRef.current=pin;
      const rRes=await gameApi.getRoom(pin);
      setRoom({...rRes.data?.room,id});
      setView('waiting');
    }catch{setError('Tạo phòng thất bại!');}finally{setLoading(false);}
  }

  async function handleJoin(){
    if(!name.trim()){setError('Nhập tên trước nhé!');return;}
    if(!joinPin.trim()){setError('Nhập mã phòng!');return;}
    setError('');setLoading(true);
    try{
      const res=await gameApi.joinRoom({pin:joinPin.trim(),userId:guestId,userName:name.trim()});
      pinRef.current=joinPin.trim();
      setRoom(res.data?.room);
      setView('waiting');
    }catch{setError('Không tìm thấy phòng!');}finally{setLoading(false);}
  }

  async function handleStart(){
    try{await gameApi.startRoom({roomId:room.id,hostId:guestId});}catch{setError('Lỗi! Thử lại.');}
  }

  async function handleAnswer(choice){
    if(submitted||!room)return;
    const timeMs=(Q_SEC-timer)*1000;
    setSelected(choice);setSubmitted(true);clearInterval(timerRef.current);
    try{
      const res=await gameApi.submitAnswer({pin:pinRef.current,userId:guestId,questionIndex:room.currentQuestion,answer:choice,timeMs});
      const {isCorrect,scoreGain,newScore}=res.data||{};
      setFeedback({ok:isCorrect,gain:scoreGain||0});
      setMyScore(newScore||0);
    }catch{setFeedback({ok:false,gain:0});}
  }

  async function handleNext(){
    try{const res=await gameApi.nextQuestion({roomId:room.id,hostId:guestId});if(res.data?.isEnd){setView('results');clearInterval(pollRef.current);}}catch{}
  }

  const isHost=room?.hostId===guestId;
  const curQ=room?.questions?.[room?.currentQuestion];

  // LOBBY
  if(view==='lobby')return(
    <div style={{minHeight:'100vh',background:'#0f0f0f',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <style>{CSS}</style>
      <div style={{background:'#1a1a2e',border:'1px solid #e94560',borderRadius:24,padding:'48px 40px',maxWidth:460,width:'100%',textAlign:'center',boxShadow:'0 20px 60px rgba(0,0,0,0.6)'}}>
        <div style={{fontSize:'3.5rem',marginBottom:8}}>🎮</div>
        <h1 style={{color:'#e94560',fontSize:'2rem',fontWeight:900,margin:'0 0 6px'}}>Chơi cùng bạn bè</h1>
        <p style={{color:'rgba(255,255,255,0.5)',marginBottom:32}}>Thi đấu từ vựng thời gian thực!</p>
        <input placeholder="Tên của bạn" value={name} onChange={e=>setName(e.target.value)} style={{width:'100%',boxSizing:'border-box',padding:'14px 18px',borderRadius:12,border:'2px solid rgba(255,255,255,0.15)',background:'rgba(255,255,255,0.05)',color:'#fff',fontSize:'1.05rem',marginBottom:20,outline:'none'}}/>
        <button onClick={handleCreate} disabled={loading} style={{width:'100%',padding:'15px 0',borderRadius:12,border:'none',background:loading?'#555':'linear-gradient(135deg,#e94560,#c0392b)',color:'#fff',fontSize:'1.05rem',fontWeight:700,cursor:'pointer',marginBottom:20}}>
          {loading?'...':'🏠 Tạo phòng mới'}
        </button>
        <div style={{color:'rgba(255,255,255,0.3)',marginBottom:20}}>── hoặc ──</div>
        <div style={{display:'flex',gap:12}}>
          <input placeholder="Mã phòng (6 số)" value={joinPin} onChange={e=>setJoinPin(e.target.value.replace(/\D/g,'').slice(0,6))} style={{flex:1,padding:'14px 16px',borderRadius:12,border:'2px solid rgba(255,255,255,0.15)',background:'rgba(255,255,255,0.05)',color:'#fff',fontSize:'1.05rem',letterSpacing:'0.2em',textAlign:'center',outline:'none'}}/>
          <button onClick={handleJoin} disabled={loading} style={{padding:'14px 20px',borderRadius:12,border:'2px solid rgba(255,255,255,0.2)',background:'#0f3460',color:'#fff',fontWeight:700,cursor:'pointer'}}>Vào →</button>
        </div>
        {error&&<p style={{color:'#e74c3c',marginTop:16,fontSize:'0.9rem'}}>{error}</p>}
      </div>
    </div>
  );

  // WAITING
  if(view==='waiting'){
    const players=sortPlayers(room?.players||{});
    return(
      <div style={{minHeight:'100vh',background:'#0f0f0f',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
        <style>{CSS}</style>
        <div style={{background:'#1a1a2e',border:'1px solid #e94560',borderRadius:24,padding:'40px 36px',maxWidth:500,width:'100%',textAlign:'center',boxShadow:'0 20px 60px rgba(0,0,0,0.6)'}}>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:'0.85rem',marginBottom:6}}>Mã phòng</p>
          <div style={{color:'#f7b731',fontSize:'3rem',fontWeight:900,letterSpacing:'0.3em',fontFamily:'monospace',marginBottom:4}}>{room?.pin}</div>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.8rem',marginBottom:28}}>Chia sẻ mã này với bạn bè!</p>
          <div style={{background:'rgba(255,255,255,0.04)',borderRadius:16,padding:20,marginBottom:24,textAlign:'left'}}>
            <p style={{color:'rgba(255,255,255,0.5)',fontSize:'0.8rem',marginBottom:12,textTransform:'uppercase',letterSpacing:'0.1em'}}>Người chơi ({players.length})</p>
            {players.map(p=>(
              <div key={p.uid} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                <span style={{fontSize:'1.5rem'}}>{p.avatar}</span>
                <span style={{color:'#fff',fontWeight:p.uid===room?.hostId?700:400}}>{p.name}</span>
                {p.uid===room?.hostId&&<span style={{background:'#e94560',color:'#fff',fontSize:'0.65rem',fontWeight:800,padding:'2px 8px',borderRadius:20}}>CHỦ</span>}
                {p.uid===guestId&&p.uid!==room?.hostId&&<span style={{color:'rgba(255,255,255,0.4)',fontSize:'0.8rem'}}>(bạn)</span>}
              </div>
            ))}
          </div>
          {isHost
            ?<button onClick={handleStart} style={{width:'100%',padding:'16px 0',borderRadius:12,border:'none',background:'linear-gradient(135deg,#00b894,#00cec9)',color:'#fff',fontSize:'1.1rem',fontWeight:900,cursor:'pointer'}}>🚀 Bắt đầu!</button>
            :<div className="mp-pulse" style={{color:'rgba(255,255,255,0.5)'}}>⏳ Chờ chủ phòng bắt đầu...</div>
          }
          {error&&<p style={{color:'#e74c3c',marginTop:12}}>{error}</p>}
        </div>
      </div>
    );
  }

  // PLAYING
  if(view==='playing'){
    const pct=(timer/Q_SEC)*100;
    const tc=timer>10?'#00b894':timer>5?'#f7b731':'#e74c3c';
    return(
      <div style={{minHeight:'100vh',background:'#0f0f0f',padding:'20px 16px',boxSizing:'border-box'}}>
        <style>{CSS}</style>
        <div style={{maxWidth:800,margin:'0 auto',display:'grid',gap:16}}>
          <div style={{background:'#1a1a2e',borderRadius:16,padding:'16px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',border:'1px solid rgba(233,69,96,0.3)'}}>
            <span style={{color:'#fff',fontWeight:900,fontSize:'1.2rem'}}>Câu {(room?.currentQuestion||0)+1}/{room?.questions?.length||0}</span>
            <div style={{textAlign:'center'}}>
              <div style={{color:tc,fontWeight:900,fontSize:'2rem',lineHeight:1}}>{timer}</div>
              <div style={{width:100,height:6,background:'rgba(255,255,255,0.1)',borderRadius:3,marginTop:4,overflow:'hidden'}}>
                <div style={{width:`${pct}%`,height:'100%',background:tc,transition:'width 1s linear'}}/>
              </div>
            </div>
            <div style={{color:'#f7b731',fontWeight:900,fontSize:'1.4rem'}}>⭐ {myScore}</div>
          </div>
          <div style={{background:'#1a1a2e',borderRadius:20,padding:'32px 24px',textAlign:'center',border:'1px solid rgba(233,69,96,0.2)'}}>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.85rem',marginBottom:12,textTransform:'uppercase',letterSpacing:'0.1em'}}>Từ nào có nghĩa là</p>
            <h2 style={{color:'#fff',fontSize:'clamp(1.6rem,4vw,2.4rem)',fontWeight:900,margin:0}}>"{curQ?.mean}"</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {(curQ?.choices||[]).map((c,i)=>{
              let bg=COLORS[i%4],border='none';
              if(submitted){if(c===curQ?.correct){bg='#00b894';border='3px solid #00ff99';}else if(c===selected){bg='#555';border='3px solid #e74c3c';}else{bg='#2a2a2a';}}
              return<button key={i} onClick={()=>handleAnswer(c)} disabled={submitted} style={{padding:'18px 12px',borderRadius:14,border,background:bg,color:'#fff',fontSize:'clamp(0.9rem,2.5vw,1.1rem)',fontWeight:700,cursor:submitted?'default':'pointer',transition:'all 0.2s'}}>{c}</button>;
            })}
          </div>
          {feedback&&<div className="mp-pop" style={{textAlign:'center',padding:'14px 20px',borderRadius:14,background:feedback.ok?'rgba(0,184,148,0.15)':'rgba(231,76,60,0.15)',border:`1px solid ${feedback.ok?'#00b894':'#e74c3c'}`}}>
            <span style={{color:feedback.ok?'#00b894':'#e74c3c',fontWeight:700,fontSize:'1.1rem'}}>{feedback.ok?`✅ Chính xác! +${feedback.gain} điểm`:`❌ Sai! Đáp án: "${curQ?.correct}"`}</span>
          </div>}
          {isHost&&submitted&&<button onClick={handleNext} style={{width:'100%',padding:16,borderRadius:14,border:'none',background:'linear-gradient(135deg,#e94560,#c0392b)',color:'#fff',fontSize:'1rem',fontWeight:700,cursor:'pointer'}}>→ Câu tiếp theo</button>}
          {room?.players&&(
            <div style={{background:'#1a1a2e',borderRadius:16,padding:'16px 20px',border:'1px solid rgba(255,255,255,0.08)'}}>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.75rem',marginBottom:8,textTransform:'uppercase'}}>Bảng xếp hạng</p>
              {sortPlayers(room.players).map((p,i)=>(
                <div key={p.uid} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 0',borderRadius:8,background:p.uid===guestId?'rgba(233,69,96,0.1)':'transparent'}}>
                  <span style={{minWidth:28}}>{MEDALS[i]||`${i+1}.`}</span>
                  <span style={{fontSize:'1.2rem'}}>{p.avatar}</span>
                  <span style={{color:'#fff',flex:1,fontWeight:p.uid===guestId?700:400,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</span>
                  <span style={{color:'#f7b731',fontWeight:900}}>{p.score}</span>
                  {p.streak>=3&&<span>🔥{p.streak}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // RESULTS
  if(view==='results'){
    const players=sortPlayers(room?.players||{});
    const myRank=players.findIndex(p=>p.uid===guestId)+1;
    return(
      <div style={{minHeight:'100vh',background:'#0f0f0f',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
        <style>{CSS}</style>
        <div style={{background:'#1a1a2e',border:'1px solid #e94560',borderRadius:24,padding:'40px 36px',maxWidth:520,width:'100%',textAlign:'center',boxShadow:'0 20px 60px rgba(0,0,0,0.6)'}}>
          <div style={{fontSize:'3.5rem',marginBottom:8}}>{myRank===1?'🏆':MEDALS[myRank-1]||'🎉'}</div>
          <h2 style={{color:'#fff',fontSize:'2rem',fontWeight:900,margin:'0 0 6px'}}>Kết quả!</h2>
          <p style={{color:'rgba(255,255,255,0.5)',marginBottom:24}}>Bạn xếp hạng <b style={{color:'#f7b731'}}>{myRank}/{players.length}</b></p>
          <div style={{background:'rgba(255,255,255,0.04)',borderRadius:16,padding:20,marginBottom:24,textAlign:'left'}}>
            {players.map((p,i)=>(
              <div key={p.uid} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.06)',background:p.uid===guestId?'rgba(233,69,96,0.1)':'transparent',borderRadius:8}}>
                <span style={{fontSize:'1.2rem',minWidth:28}}>{MEDALS[i]||`${i+1}.`}</span>
                <span style={{fontSize:'1.4rem'}}>{p.avatar}</span>
                <span style={{color:'#fff',flex:1,fontWeight:p.uid===guestId?700:400}}>{p.name}</span>
                <span style={{color:'#f7b731',fontWeight:900,fontSize:'1rem'}}>{p.score}</span>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:12,justifyContent:'center'}}>
            <button onClick={()=>{setView('lobby');setRoom(null);pinRef.current='';setMyScore(0);setError('');}} style={{padding:'14px 28px',borderRadius:12,border:'none',background:'linear-gradient(135deg,#e94560,#c0392b)',color:'#fff',fontWeight:700,cursor:'pointer'}}>🔄 Chơi lại</button>
            <button onClick={()=>window.history.back()} style={{padding:'14px 28px',borderRadius:12,border:'2px solid rgba(255,255,255,0.2)',background:'transparent',color:'#fff',fontWeight:700,cursor:'pointer'}}>← Quay lại</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default MultiplayerPage;