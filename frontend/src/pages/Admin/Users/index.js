import adminApi from 'apis/adminApi';
import useTitle from 'hooks/useTitle';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const VN_MAP = {
  à:'a',á:'a',ả:'a',ã:'a',ạ:'a',ă:'a',ắ:'a',ặ:'a',ằ:'a',ẵ:'a',ẳ:'a',
  â:'a',ấ:'a',ầ:'a',ẩ:'a',ẫ:'a',ậ:'a',è:'e',é:'e',ẻ:'e',ẽ:'e',ẹ:'e',
  ê:'e',ế:'e',ề:'e',ể:'e',ễ:'e',ệ:'e',ì:'i',í:'i',ỉ:'i',ĩ:'i',ị:'i',
  ò:'o',ó:'o',ỏ:'o',õ:'o',ọ:'o',ô:'o',ố:'o',ồ:'o',ổ:'o',ỗ:'o',ộ:'o',
  ơ:'o',ớ:'o',ờ:'o',ở:'o',ỡ:'o',ợ:'o',ù:'u',ú:'u',ủ:'u',ũ:'u',ụ:'u',
  ư:'u',ứ:'u',ừ:'u',ử:'u',ữ:'u',ự:'u',ỳ:'y',ý:'y',ỷ:'y',ỹ:'y',ỵ:'y',đ:'d',
};
const nvn = (s = '') => s.toLowerCase().split('').map((c) => VN_MAP[c] || c).join('').replace(/[^a-z0-9]/g, '');
function previewTeacherEmail(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  const last = nvn(parts[parts.length - 1]);
  const init = parts.slice(0, parts.length - 1).map((p) => nvn(p)[0] || '').join('');
  return `${last}${init}gv@gmail.com`;
}
function previewStudentEmail(name = '', dob = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const last = parts.length ? nvn(parts[parts.length - 1]) : 'hs';
  const init = parts.slice(0, parts.length - 1).map((p) => nvn(p)[0] || '').join('');
  const dp = dob.replace(/-/g, '/').split('/');
  const suf = dp.length === 3 ? `${dp[0].padStart(2,'0')}${dp[1].padStart(2,'0')}${dp[2].slice(-2)}` : '';
  return `${last}${init}${suf}@gmail.com`;
}
function previewStudentPw(dob = '') {
  const dp = dob.replace(/-/g, '/').split('/');
  if (dp.length === 3) {
    const dd = dp[0].padStart(2,'0'), mm = dp[1].padStart(2,'0');
    const yyyy = dp[2].length === 2 ? `20${dp[2]}` : dp[2];
    return `TCA@${dd}${mm}${yyyy}`;
  }
  return 'TCA@123456';
}

const ROLE_CONFIG = {
  student: { label: 'Học sinh', tone: 'success' },
  teacher: { label: 'Giáo viên', tone: 'info' },
  admin:   { label: 'Admin', tone: 'warning' },
};
const COLORS = {
  blue:'#2563eb', green:'#059669', orange:'#d97706',
  purple:'#7c3aed', red:'#dc2626', cyan:'#0891b2', slate:'#475569',
};
const S = {
  page: {
    minHeight:'100vh',
    background:`radial-gradient(circle at 8% 12%, rgba(37,99,235,.10) 0 260px, transparent 261px),
      radial-gradient(circle at 92% 8%, rgba(14,165,233,.12) 0 240px, transparent 241px),
      radial-gradient(circle at 80% 85%, rgba(16,185,129,.10) 0 280px, transparent 281px),
      linear-gradient(180deg, #eef4ff 0%, #f6f8fc 46%, #eef7f3 100%)`,
    fontFamily:"'Inter','Segoe UI',Roboto,Arial,sans-serif",
    padding:'32px 24px 56px', color:'#172033',
  },
  maxW:{ maxWidth:1180, margin:'0 auto' },
  header:{
    display:'flex', justifyContent:'space-between', alignItems:'flex-start',
    gap:24, marginBottom:24, flexWrap:'wrap',
    background:'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0369a1 100%)',
    borderRadius:18, padding:'26px 28px',
    boxShadow:'0 18px 40px rgba(15,23,42,0.18)',
  },
  title:{ fontSize:'1.9rem', fontWeight:800, color:'#ffffff', margin:'0 0 8px', letterSpacing:'-0.02em' },
  subtitle:{ color:'#dbeafe', fontSize:'0.96rem', margin:0, lineHeight:1.5 },
  headerMeta:{
    background:'rgba(255,255,255,.14)', border:'1px solid rgba(255,255,255,.26)',
    borderRadius:999, padding:'8px 14px', color:'#ffffff', fontSize:'0.86rem',
    fontWeight:700, whiteSpace:'nowrap',
  },
  statsRow:{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:14, marginBottom:22 },
  statCard:(color=COLORS.blue)=>({
    background:`linear-gradient(180deg,#ffffff 0%,${color}10 100%)`,
    border:`1px solid ${color}33`, borderTop:`4px solid ${color}`,
    borderRadius:14, padding:'16px 18px', boxShadow:'0 8px 22px rgba(15,23,42,0.08)',
  }),
  statTop:{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, gap:10 },
  statLabel:{ color:'#475569', fontSize:'0.82rem', fontWeight:700, margin:0, lineHeight:1.3 },
  statNum:{ color:'#0f172a', fontSize:'1.65rem', fontWeight:800, lineHeight:1, letterSpacing:'-0.02em' },
  statCode:(color=COLORS.blue)=>({
    width:34, height:34, borderRadius:9, background:`${color}12`,
    border:`1px solid ${color}26`, color,
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:'0.78rem', fontWeight:900, flexShrink:0,
  }),
  msgBanner:(ok)=>({
    marginBottom:16, padding:'12px 16px', borderRadius:12, fontWeight:700, fontSize:'0.9rem',
    background:ok?'#ecfdf5':'#fef2f2', color:ok?'#047857':'#b91c1c',
    border:ok?'1px solid #a7f3d0':'1px solid #fecaca',
  }),
  controlsCard:{
    background:'rgba(255,255,255,.92)', border:'1px solid #dbeafe',
    borderLeft:'5px solid #2563eb', borderRadius:14, padding:16,
    boxShadow:'0 8px 24px rgba(37,99,235,0.08)', marginBottom:18, backdropFilter:'blur(8px)',
  },
  controls:{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' },
  searchInput:{
    flex:1, minWidth:260, padding:'11px 14px', borderRadius:10,
    border:'1px solid #cbd5e1', fontSize:'0.92rem', outline:'none',
    background:'#ffffff', color:'#111827', fontFamily:'inherit',
  },
  seedBtn:(disabled)=>({
    padding:'11px 16px', borderRadius:10, border:'1px solid #0f766e',
    background:disabled?'#99f6e4':'linear-gradient(135deg,#0f766e 0%,#059669 100%)',
    color:'#ffffff', fontWeight:800, cursor:disabled?'not-allowed':'pointer',
    opacity:disabled?0.8:1, whiteSpace:'nowrap', fontFamily:'inherit', fontSize:'0.9rem',
    boxShadow:disabled?'none':'0 8px 18px rgba(5,150,105,.22)',
  }),
  tableCard:{
    background:'#ffffff', border:'1px solid #dbeafe', borderRadius:14,
    overflow:'hidden', boxShadow:'0 12px 30px rgba(15,23,42,0.10)',
  },
  tableWrap:{ width:'100%', overflowX:'auto' },
  table:{ width:'100%', borderCollapse:'collapse', fontSize:'0.9rem' },
  th:{
    padding:'12px 14px', textAlign:'left', fontWeight:800, fontSize:'0.78rem',
    color:'#e0f2fe', background:'#0f172a', borderBottom:'1px solid #1e293b',
    textTransform:'uppercase', letterSpacing:'0.03em', whiteSpace:'nowrap',
  },
  td:{ padding:'13px 14px', color:'#374151', borderBottom:'1px solid #eef2ff', verticalAlign:'middle', background:'#ffffff' },
  index:{ color:'#94a3b8', fontWeight:800, width:48 },
  userCell:{ display:'flex', alignItems:'center', gap:10, minWidth:180 },
  avatar:{ width:34, height:34, borderRadius:'50%', objectFit:'cover', background:'#e5e7eb', border:'1px solid #e5e7eb', flexShrink:0 },
  avatarFallback:{
    width:34, height:34, borderRadius:'50%', background:'#eff6ff', color:'#1d4ed8',
    border:'1px solid #bfdbfe', display:'flex', alignItems:'center', justifyContent:'center',
    fontWeight:800, fontSize:'0.85rem', flexShrink:0,
  },
  userName:{ fontWeight:800, color:'#111827', lineHeight:1.25 },
  lockedText:{ display:'block', marginTop:3, color:'#b91c1c', fontSize:'0.76rem', fontWeight:700 },
  muted:{ color:'#64748b', fontSize:'0.86rem' },
  badge:(tone='default')=>{
    const map={
      success:{background:'#ecfdf5',color:'#047857',border:'#a7f3d0'},
      info:{background:'#eff6ff',color:'#1d4ed8',border:'#bfdbfe'},
      warning:{background:'#fffbeb',color:'#b45309',border:'#fde68a'},
      danger:{background:'#fef2f2',color:'#b91c1c',border:'#fecaca'},
      neutral:{background:'#f3f4f6',color:'#374151',border:'#e5e7eb'},
      default:{background:'#f8fafc',color:'#475569',border:'#e2e8f0'},
    };
    const c=map[tone]||map.default;
    return{
      display:'inline-flex', alignItems:'center', justifyContent:'center',
      background:c.background, color:c.color, border:`1px solid ${c.border}`,
      borderRadius:999, padding:'4px 10px', fontSize:'0.78rem', fontWeight:800,
      lineHeight:1, whiteSpace:'nowrap',
    };
  },
  roleSelect:{
    padding:'8px 10px', borderRadius:9, border:'1px solid #cbd5e1', fontSize:'0.86rem',
    cursor:'pointer', background:'#ffffff', color:'#111827', fontFamily:'inherit', fontWeight:700, outline:'none',
  },
  actionBtn:(locked,disabled)=>({
    padding:'8px 12px', borderRadius:9,
    border:locked?'1px solid #059669':'1px solid #dc2626',
    cursor:disabled?'not-allowed':'pointer', fontWeight:800, fontSize:'0.82rem',
    background:locked?'#ecfdf5':'#fef2f2', color:locked?'#047857':'#b91c1c',
    opacity:disabled?0.65:1, fontFamily:'inherit', whiteSpace:'nowrap',
  }),
  loadingCell:{ textAlign:'center', padding:44, color:'#6b7280', fontWeight:700, background:'#ffffff' },
  emptyCell:{ textAlign:'center', padding:44, color:'#64748b', fontWeight:700, background:'#ffffff' },
  pagination:{ marginTop:18, display:'flex', justifyContent:'center', gap:8, flexWrap:'wrap' },
  pageBtn:(active)=>({
    minWidth:38, padding:'8px 12px', borderRadius:9,
    border:active?'1px solid #1d4ed8':'1px solid #cbd5e1',
    cursor:'pointer', fontWeight:800,
    background:active?'#1d4ed8':'#ffffff', color:active?'#ffffff':'#374151', fontFamily:'inherit',
  }),
  noAccess:{
    minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
    flexDirection:'column', gap:14, background:'#f5f7fb',
    fontFamily:"'Inter','Segoe UI',Roboto,Arial,sans-serif", color:'#172033', padding:24, textAlign:'center',
  },
  homeBtn:{ padding:'10px 22px', borderRadius:10, border:'none', background:'#1d4ed8', color:'#fff', fontWeight:800, cursor:'pointer', fontFamily:'inherit' },
  overlay:{
    position:'fixed', inset:0, background:'rgba(15,23,42,0.6)',
    display:'flex', alignItems:'center', justifyContent:'center',
    zIndex:1000, padding:16,
  },
  modal:{
    background:'#fff', borderRadius:18, padding:28,
    maxWidth:760, width:'100%', maxHeight:'90vh',
    overflowY:'auto', boxShadow:'0 24px 60px rgba(15,23,42,0.28)',
  },
};

function formatNumber(v){ return v==null?0:Number(v).toLocaleString('vi-VN'); }
function getInitial(name,username,email){ return(name||username||email||'U').trim().charAt(0).toUpperCase(); }

// ─── shared input/button styles used inside modals ────────────────────────────
const inp = {padding:'9px 11px',borderRadius:8,border:'1px solid #cbd5e1',fontSize:'0.88rem',fontFamily:'inherit',outline:'none',background:'#fff',color:'#111'};

const TABS=[
  {id:'users',   label:'👥 Danh sách'},
  {id:'classes', label:'🏫 Lớp học'},
  {id:'teachers',label:'👨‍🏫 Giáo viên'},
  {id:'students',label:'🎒 Tạo tài khoản HS'},
  {id:'grammar', label:'📚 Ngữ pháp'},
];

function TabBar({active,onChange}){
  return(
    <div style={{display:'flex',gap:6,marginBottom:22,flexWrap:'wrap'}}>
      {TABS.map((t)=>(
        <button key={t.id} onClick={()=>onChange(t.id)} style={{
          padding:'10px 18px',borderRadius:10,border:'none',cursor:'pointer',
          fontWeight:800,fontSize:'0.9rem',fontFamily:'inherit',
          background:active===t.id?'#1d4ed8':'rgba(255,255,255,.85)',
          color:active===t.id?'#fff':'#374151',
          boxShadow:active===t.id?'0 4px 14px rgba(29,78,216,.28)':'0 1px 4px rgba(15,23,42,.08)',
          backdropFilter:'blur(6px)',
        }}>{t.label}</button>
      ))}
    </div>
  );
}

// ─── Tab: Users ───────────────────────────────────────────────────────────────
function UsersTab({systemStats}){
  const[users,setUsers]=useState([]);
  const[search,setSearch]=useState('');
  const[page,setPage]=useState(1);
  const[totalPages,setTotalPages]=useState(1);
  const[total,setTotal]=useState(0);
  const[loading,setLoading]=useState(true);
  const[msg,setMsg]=useState(null);
  const[updating,setUpdating]=useState(null);
  const[lockingUser,setLockingUser]=useState(null);
  const[seeding,setSeeding]=useState(false);

  const loadUsers=useCallback(async()=>{
    setLoading(true);
    try{
      const res=await adminApi.getUsers({page,limit:20,search});
      setUsers(res.data.users||[]);
      setTotal(res.data.total||0);
      setTotalPages(res.data.totalPages||1);
    }catch{ setUsers([]);setTotal(0);setTotalPages(1); }
    finally{ setLoading(false); }
  },[page,search]);

  useEffect(()=>{loadUsers();},[loadUsers]);

  const handleRoleChange=async(userId,newRole)=>{
    setUpdating(userId);setMsg(null);
    try{
      await adminApi.updateUserRole(userId,newRole);
      setMsg({ok:true,text:'Cập nhật quyền người dùng thành công.'});
      loadUsers();
    }catch(err){ setMsg({ok:false,text:err?.response?.data?.message||'Không thể cập nhật quyền.'}); }
    finally{setUpdating(null);}
  };

  const handleSeedGrammar=async()=>{
    setSeeding(true);setMsg(null);
    try{
      const res=await adminApi.seedGrammarTenses();
      setMsg({ok:true,text:res.data?.message||'Đã tạo dữ liệu ngữ pháp mẫu.'});
    }catch(err){ setMsg({ok:false,text:err?.response?.data?.message||'Không thể tạo dữ liệu.'}); }
    finally{setSeeding(false);}
  };

  const handleLock=async(userId,isLocked)=>{
    setLockingUser(userId);setMsg(null);
    try{
      if(isLocked){await adminApi.unlockUser(userId);setMsg({ok:true,text:'Đã mở khóa người dùng.'});}
      else{await adminApi.lockUser(userId);setMsg({ok:true,text:'Đã khóa người dùng.'});}
      loadUsers();
    }catch(err){ setMsg({ok:false,text:err?.response?.data?.message||'Không thể thay đổi trạng thái.'}); }
    finally{setLockingUser(null);}
  };

  const statCards=systemStats?[
    {label:'Từ vựng',    value:systemStats.totalWords,         code:'TV',color:COLORS.blue},
    {label:'Giáo viên',  value:systemStats.totalTeachers,      code:'GV',color:COLORS.purple},
    {label:'Học sinh',   value:systemStats.totalStudents,      code:'HS',color:COLORS.green},
    {label:'Khóa học',   value:systemStats.totalCourses,       code:'KH',color:COLORS.orange},
    {label:'Bài ngữ pháp',value:systemStats.totalGrammarLessons,code:'NP',color:COLORS.red},
  ]:[];

  return(
    <>
      {statCards.length>0&&(
        <div style={S.statsRow}>
          {statCards.map((item)=>(
            <div key={item.label} style={S.statCard(item.color)}>
              <div style={S.statTop}>
                <p style={S.statLabel}>{item.label}</p>
                <div style={S.statCode(item.color)}>{item.code}</div>
              </div>
              <div style={S.statNum}>{formatNumber(item.value)}</div>
            </div>
          ))}
        </div>
      )}
      {msg&&<div style={S.msgBanner(msg.ok)}>{msg.text}</div>}
      <div style={S.controlsCard}>
        <div style={S.controls}>
          <input style={S.searchInput} placeholder="Tìm theo tên, email hoặc username..."
            value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1);}}/>
          <button style={S.seedBtn(seeding)} disabled={seeding} onClick={handleSeedGrammar}>
            {seeding?'Đang tạo...':'Tạo dữ liệu ngữ pháp mẫu'}
          </button>
        </div>
      </div>
      <div style={{marginBottom:6,color:'#64748b',fontSize:'0.86rem',fontWeight:600}}>Tổng: {formatNumber(total)} người dùng</div>
      <div style={S.tableCard}>
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                {['#','Người dùng','Email','Username','Xu','Quyền','Thay đổi quyền','Trạng thái','Thao tác'].map((h,i)=>(
                  <th key={h} style={{...S.th,...(i===4?{textAlign:'right'}:{})}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading?(<tr><td colSpan={9} style={S.loadingCell}>Đang tải dữ liệu...</td></tr>)
              :users.length===0?(<tr><td colSpan={9} style={S.emptyCell}>Không tìm thấy người dùng phù hợp.</td></tr>)
              :users.map((u,i)=>(
                <tr key={u.id}>
                  <td style={{...S.td,...S.index}}>{(page-1)*20+i+1}</td>
                  <td style={S.td}>
                    <div style={S.userCell}>
                      {u.avt?<img src={u.avt} alt="" style={S.avatar}/>:<div style={S.avatarFallback}>{getInitial(u.name,u.username,u.email)}</div>}
                      <div>
                        <div style={S.userName}>{u.name||'—'}</div>
                        {u.isLocked&&<span style={S.lockedText}>Đang bị khóa</span>}
                      </div>
                    </div>
                  </td>
                  <td style={S.td}><span style={S.muted}>{u.email||'—'}</span></td>
                  <td style={S.td}><span style={S.muted}>{u.username||'—'}</span></td>
                  <td style={{...S.td,textAlign:'right',fontWeight:800}}>{u.coin??'—'}</td>
                  <td style={S.td}><span style={S.badge(ROLE_CONFIG[u.role]?.tone||'neutral')}>{ROLE_CONFIG[u.role]?.label||u.role}</span></td>
                  <td style={S.td}>
                    <select style={S.roleSelect} value={u.role} disabled={updating===u.id}
                      onChange={(e)=>handleRoleChange(u.id,e.target.value)}>
                      <option value="student">Học sinh</option>
                      <option value="teacher">Giáo viên</option>
                      <option value="admin">Admin</option>
                    </select>
                    {updating===u.id&&<span style={{marginLeft:8,color:'#6b7280',fontSize:'0.82rem'}}>Đang lưu...</span>}
                  </td>
                  <td style={S.td}><span style={S.badge(u.isLocked?'danger':'success')}>{u.isLocked?'Đã khóa':'Hoạt động'}</span></td>
                  <td style={S.td}>
                    <button style={S.actionBtn(u.isLocked,lockingUser===u.id)} disabled={lockingUser===u.id} onClick={()=>handleLock(u.id,u.isLocked)}>
                      {lockingUser===u.id?'Đang xử lý':u.isLocked?'Mở khóa':'Khóa'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages>1&&(
        <div style={S.pagination}>
          {Array.from({length:totalPages},(_,i)=>i+1).map((p)=>(
            <button key={p} style={S.pageBtn(p===page)} onClick={()=>setPage(p)}>{p}</button>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Tab: Classrooms ─────────────────────────────────────────────────────────
function ClassroomsTab(){
  const[classrooms,setClassrooms]=useState([]);
  const[loading,setLoading]=useState(true);
  const[msg,setMsg]=useState(null);
  const[form,setForm]=useState({name:'',grade:'',teacherAccountId:'',teacherName:''});
  const[creating,setCreating]=useState(false);
  const[teachers,setTeachers]=useState([]);

  const load=useCallback(async()=>{
    setLoading(true);
    try{
      const[cRes,uRes]=await Promise.all([adminApi.getClassrooms(),adminApi.getUsers({limit:200})]);
      setClassrooms(cRes.data?.classrooms||[]);
      setTeachers((uRes.data?.users||[]).filter((u)=>u.role==='teacher'));
    }catch{setClassrooms([]);}
    finally{setLoading(false);}
  },[]);

  useEffect(()=>{load();},[load]);

  const handleCreate=async()=>{
    if(!form.name.trim()){setMsg({ok:false,text:'Tên lớp không được để trống.'});return;}
    setCreating(true);setMsg(null);
    try{
      await adminApi.createClassroom(form);
      setMsg({ok:true,text:`Đã tạo lớp ${form.name}.`});
      setForm({name:'',grade:'',teacherAccountId:'',teacherName:''});
      load();
    }catch(err){ setMsg({ok:false,text:err?.response?.data?.message||'Không thể tạo lớp.'}); }
    finally{setCreating(false);}
  };

  const fi={...inp,padding:'10px 12px'};
  const btn=(dis)=>({padding:'10px 18px',borderRadius:9,border:'none',background:dis?'#93c5fd':'#1d4ed8',color:'#fff',fontWeight:800,cursor:dis?'not-allowed':'pointer',fontFamily:'inherit',fontSize:'0.9rem'});

  return(
    <>
      {msg&&<div style={S.msgBanner(msg.ok)}>{msg.text}</div>}
      <div style={{...S.controlsCard,marginBottom:22}}>
        <div style={{fontWeight:800,marginBottom:12,color:'#1e3a8a',fontSize:'0.95rem'}}>Tạo lớp học mới</div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
          <input style={{...fi,width:140}} placeholder="Tên lớp (vd: 1A)" value={form.name} onChange={(e)=>setForm((f)=>({...f,name:e.target.value}))}/>
          <input style={{...fi,width:100}} placeholder="Khối (vd: 1)" value={form.grade} onChange={(e)=>setForm((f)=>({...f,grade:e.target.value}))}/>
          <select style={{...fi,width:220}} value={form.teacherAccountId}
            onChange={(e)=>{
              const t=teachers.find((x)=>x.accountId===e.target.value);
              setForm((f)=>({...f,teacherAccountId:e.target.value,teacherName:t?.name||''}));
            }}>
            <option value="">— Chọn GVCN (tuỳ chọn) —</option>
            {teachers.map((t)=><option key={t.accountId} value={t.accountId}>{t.name}</option>)}
          </select>
          <button style={btn(creating)} disabled={creating} onClick={handleCreate}>{creating?'Đang tạo...':'+ Tạo lớp'}</button>
        </div>
      </div>
      {loading?(<div style={{textAlign:'center',padding:40,color:'#6b7280',fontWeight:700}}>Đang tải...</div>):(
        <div style={S.tableCard}>
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead><tr>{['#','Tên lớp','Khối','GVCN','Sĩ số','Trạng thái'].map((h)=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {classrooms.length===0?(<tr><td colSpan={6} style={S.emptyCell}>Chưa có lớp học nào.</td></tr>)
                :classrooms.map((cls,i)=>(
                  <tr key={cls.id}>
                    <td style={{...S.td,...S.index}}>{i+1}</td>
                    <td style={{...S.td,fontWeight:800}}>{cls.name}</td>
                    <td style={S.td}>{cls.grade||'—'}</td>
                    <td style={S.td}>{cls.teacherName||<span style={S.muted}>Chưa gán</span>}</td>
                    <td style={S.td}>{(cls.students||[]).length} học sinh</td>
                    <td style={S.td}><span style={S.badge('success')}>{cls.status||'active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Tab: Teachers (create / edit / delete) ───────────────────────────────────
function TeachersTab(){
  const[teachers,setTeachers]=useState([]);
  const[loading,setLoading]=useState(true);
  const[msg,setMsg]=useState(null);

  // create modal
  const[showCreate,setShowCreate]=useState(false);
  const[createRows,setCreateRows]=useState([{name:'',subject:'Tiếng Anh'}]);
  const[creating,setCreating]=useState(false);
  const[createResults,setCreateResults]=useState(null);

  // edit modal
  const[editTarget,setEditTarget]=useState(null);
  const[editForm,setEditForm]=useState({name:'',subject:''});
  const[editing,setEditing]=useState(false);

  // delete modal
  const[deleteTarget,setDeleteTarget]=useState(null);
  const[deleting,setDeleting]=useState(false);

  const xlsxRef=useRef(null);

  const loadTeachers=useCallback(async()=>{
    setLoading(true);
    try{
      const res=await adminApi.getUsers({limit:500});
      setTeachers((res.data?.users||[]).filter((u)=>u.role==='teacher'));
    }catch{setTeachers([]);}
    finally{setLoading(false);}
  },[]);

  useEffect(()=>{loadTeachers();},[loadTeachers]);

  // ── Excel template download ──────────────────────────────────────────────────
  const downloadTemplate=()=>{
    import('xlsx').then((XLSX)=>{
      const data=[
        ['Họ và tên','Môn dạy'],
        ['Nguyễn Thị Dương','Tiếng Anh'],
        ['Trần Văn Minh','Toán'],
        ['Lê Thị Hoa','Tiếng Anh'],
      ];
      const ws=XLSX.utils.aoa_to_sheet(data);
      ws['!cols']=[{wch:32},{wch:20}];
      const wb=XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb,ws,'GiaoVien');
      XLSX.writeFile(wb,'mau_giao_vien.xlsx');
    });
  };

  // ── Excel upload ─────────────────────────────────────────────────────────────
  const handleXlsx=(e)=>{
    const file=e.target.files?.[0];
    if(!file)return;
    import('xlsx').then((XLSX)=>{
      const reader=new FileReader();
      reader.onload=(ev)=>{
        try{
          const wb=XLSX.read(new Uint8Array(ev.target.result),{type:'array'});
          const ws=wb.Sheets[wb.SheetNames[0]];
          const rows=XLSX.utils.sheet_to_json(ws,{header:1});
          const parsed=rows.slice(1)
            .filter((r)=>r[0])
            .map((r)=>({name:String(r[0]).trim(),subject:String(r[1]||'Tiếng Anh').trim()}));
          if(parsed.length){
            setCreateRows(parsed);
            setMsg({ok:true,text:`Đã đọc ${parsed.length} giáo viên từ file Excel.`});
          }else{
            setMsg({ok:false,text:'Không đọc được dữ liệu. Kiểm tra định dạng file.'});
          }
        }catch{
          setMsg({ok:false,text:'Lỗi đọc file Excel.'});
        }
      };
      reader.readAsArrayBuffer(file);
    });
    e.target.value='';
  };

  // ── Create ───────────────────────────────────────────────────────────────────
  const handleCreate=async()=>{
    const valid=createRows.filter((r)=>r.name.trim());
    if(!valid.length){setMsg({ok:false,text:'Nhập ít nhất một tên giáo viên.'});return;}
    setCreating(true);setCreateResults(null);
    try{
      const res=await adminApi.createTeachers(valid);
      setCreateResults(res.data?.results||[]);
      setMsg({ok:true,text:`Đã tạo ${res.data?.results?.length||0} tài khoản giáo viên.`});
      setCreateRows([{name:'',subject:'Tiếng Anh'}]);
      loadTeachers();
    }catch(err){ setMsg({ok:false,text:err?.response?.data?.message||'Lỗi khi tạo tài khoản.'}); }
    finally{setCreating(false);}
  };

  // ── Edit ─────────────────────────────────────────────────────────────────────
  const openEdit=(t)=>{ setEditTarget(t); setEditForm({name:t.name||'',subject:t.subject||''}); };

  const handleEdit=async()=>{
    if(!editTarget)return;
    setEditing(true);
    try{
      await adminApi.updateTeacher(editTarget.id,editForm);
      setMsg({ok:true,text:'Đã cập nhật thông tin giáo viên.'});
      setEditTarget(null);
      loadTeachers();
    }catch(err){ setMsg({ok:false,text:err?.response?.data?.message||'Không thể cập nhật.'}); }
    finally{setEditing(false);}
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete=async()=>{
    if(!deleteTarget)return;
    setDeleting(true);
    try{
      await adminApi.deleteTeacher(deleteTarget.id);
      setMsg({ok:true,text:`Đã xóa tài khoản ${deleteTarget.name}.`});
      setDeleteTarget(null);
      loadTeachers();
    }catch(err){ setMsg({ok:false,text:err?.response?.data?.message||'Không thể xóa tài khoản.'}); }
    finally{setDeleting(false);}
  };

  // ── copy helper ──────────────────────────────────────────────────────────────
  const copyResults=()=>{
    if(!createResults)return;
    navigator.clipboard.writeText(createResults.map((r)=>`${r.name}\t${r.email}\t${r.password}`).join('\n')).catch(()=>{});
  };

  return(
    <>
      {msg&&<div style={S.msgBanner(msg.ok)}>{msg.text}</div>}

      {/* Header + create button */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,flexWrap:'wrap',gap:10}}>
        <div style={{fontWeight:800,color:'#1e3a8a',fontSize:'1rem'}}>
          Danh sách giáo viên ({teachers.length})
        </div>
        <button
          onClick={()=>{setShowCreate(true);setCreateResults(null);setCreateRows([{name:'',subject:'Tiếng Anh'}]);}}
          style={{padding:'10px 20px',borderRadius:10,border:'none',background:'#1d4ed8',color:'#fff',fontWeight:800,cursor:'pointer',fontFamily:'inherit',fontSize:'0.9rem',boxShadow:'0 4px 14px rgba(29,78,216,.28)'}}>
          + Tạo tài khoản GV
        </button>
      </div>

      {/* Teacher list */}
      <div style={S.tableCard}>
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>{['#','Họ và tên','Email','Môn dạy','Username','Thao tác'].map((h)=><th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading?(<tr><td colSpan={6} style={S.loadingCell}>Đang tải...</td></tr>)
              :teachers.length===0?(<tr><td colSpan={6} style={S.emptyCell}>Chưa có giáo viên nào. Nhấn "+ Tạo tài khoản GV" để bắt đầu.</td></tr>)
              :teachers.map((t,i)=>(
                <tr key={t.id}>
                  <td style={{...S.td,...S.index}}>{i+1}</td>
                  <td style={{...S.td,fontWeight:700}}>{t.name||'—'}</td>
                  <td style={S.td}><span style={S.muted}>{t.email||'—'}</span></td>
                  <td style={S.td}>{t.subject||<span style={S.muted}>—</span>}</td>
                  <td style={S.td}><span style={S.muted}>{t.username||'—'}</span></td>
                  <td style={S.td}>
                    <div style={{display:'flex',gap:6}}>
                      <button onClick={()=>openEdit(t)}
                        style={{padding:'7px 12px',borderRadius:8,border:'1px solid #2563eb',background:'#eff6ff',color:'#1d4ed8',fontWeight:800,cursor:'pointer',fontSize:'0.82rem',fontFamily:'inherit'}}>
                        Sửa
                      </button>
                      <button onClick={()=>setDeleteTarget(t)}
                        style={{padding:'7px 12px',borderRadius:8,border:'1px solid #dc2626',background:'#fef2f2',color:'#b91c1c',fontWeight:800,cursor:'pointer',fontSize:'0.82rem',fontFamily:'inherit'}}>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Create Modal ─────────────────────────────────────────────────────── */}
      {showCreate&&(
        <div style={S.overlay} onClick={(e)=>{ if(e.target===e.currentTarget)setShowCreate(false); }}>
          <div style={S.modal}>
            {/* Modal header */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <h2 style={{margin:0,fontSize:'1.2rem',fontWeight:800,color:'#0f172a'}}>Tạo tài khoản giáo viên</h2>
              <button onClick={()=>setShowCreate(false)}
                style={{background:'none',border:'none',fontSize:'1.5rem',cursor:'pointer',color:'#64748b',lineHeight:1}}>✕</button>
            </div>

            {/* Default password notice */}
            <div style={{marginBottom:14,padding:'10px 14px',background:'#eff6ff',borderRadius:10,fontSize:'0.88rem',color:'#1d4ed8',fontWeight:600}}>
              Mật khẩu mặc định: <code style={{background:'#dbeafe',padding:'2px 7px',borderRadius:4}}>GiaoVien@TCA123</code>
            </div>

            {/* Excel actions */}
            <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
              <button onClick={downloadTemplate}
                style={{padding:'8px 14px',borderRadius:8,border:'1px solid #059669',background:'#ecfdf5',color:'#047857',fontWeight:700,cursor:'pointer',fontFamily:'inherit',fontSize:'0.86rem'}}>
                📥 Tải file Excel mẫu
              </button>
              <button onClick={()=>xlsxRef.current?.click()}
                style={{padding:'8px 14px',borderRadius:8,border:'1px solid #7c3aed',background:'#f5f3ff',color:'#6d28d9',fontWeight:700,cursor:'pointer',fontFamily:'inherit',fontSize:'0.86rem'}}>
                📂 Import từ Excel (.xlsx/.csv)
              </button>
              <input ref={xlsxRef} type="file" accept=".xlsx,.xls,.csv" style={{display:'none'}} onChange={handleXlsx}/>
            </div>

            {/* Input table */}
            <div style={{overflowX:'auto',marginBottom:14}}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>#</th>
                    <th style={S.th}>Họ và tên</th>
                    <th style={S.th}>Môn dạy</th>
                    <th style={S.th}>Email (xem trước)</th>
                    <th style={S.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {createRows.map((r,i)=>(
                    <tr key={i}>
                      <td style={{...S.td,...S.index}}>{i+1}</td>
                      <td style={S.td}>
                        <input style={{...inp,width:210}} placeholder="Nguyễn Thị Dương"
                          value={r.name}
                          onChange={(e)=>setCreateRows((prev)=>prev.map((x,idx)=>idx===i?{...x,name:e.target.value}:x))}/>
                      </td>
                      <td style={S.td}>
                        <input style={{...inp,width:140}} placeholder="Tiếng Anh"
                          value={r.subject}
                          onChange={(e)=>setCreateRows((prev)=>prev.map((x,idx)=>idx===i?{...x,subject:e.target.value}:x))}/>
                      </td>
                      <td style={S.td}>
                        <span style={{...S.muted,fontFamily:'monospace',fontSize:'0.82rem'}}>
                          {r.name?previewTeacherEmail(r.name):<i>—</i>}
                        </span>
                      </td>
                      <td style={S.td}>
                        {createRows.length>1&&(
                          <button onClick={()=>setCreateRows((prev)=>prev.filter((_,idx)=>idx!==i))}
                            style={{background:'none',border:'none',color:'#dc2626',cursor:'pointer',fontWeight:800,fontSize:'1rem'}}>✕</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div style={{display:'flex',gap:10,marginBottom:createResults?20:0}}>
              <button onClick={()=>setCreateRows((prev)=>[...prev,{name:'',subject:'Tiếng Anh'}])}
                style={{padding:'9px 16px',borderRadius:8,border:'1px dashed #94a3b8',background:'#f8fafc',fontWeight:700,cursor:'pointer',fontFamily:'inherit',color:'#475569'}}>
                + Thêm dòng
              </button>
              <button onClick={handleCreate} disabled={creating}
                style={{padding:'9px 22px',borderRadius:8,border:'none',background:creating?'#93c5fd':'#1d4ed8',color:'#fff',fontWeight:800,cursor:creating?'not-allowed':'pointer',fontFamily:'inherit'}}>
                {creating?'Đang tạo...':'Tạo tài khoản'}
              </button>
            </div>

            {/* Results */}
            {createResults&&(
              <div style={{marginTop:4}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                  <span style={{fontWeight:800,color:'#047857',fontSize:'0.95rem'}}>✓ Đã tạo {createResults.length} tài khoản</span>
                  <button onClick={copyResults}
                    style={{padding:'6px 12px',borderRadius:8,border:'1px solid #cbd5e1',background:'#f8fafc',fontWeight:700,cursor:'pointer',fontFamily:'inherit',fontSize:'0.82rem'}}>
                    📋 Copy tất cả
                  </button>
                </div>
                <div style={{overflowX:'auto'}}>
                  <table style={S.table}>
                    <thead><tr>{['Tên','Email','Mật khẩu'].map((h)=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {createResults.map((r,i)=>(
                        <tr key={i}>
                          <td style={{...S.td,fontWeight:700}}>{r.name}</td>
                          <td style={S.td}><code style={{fontSize:'0.85rem'}}>{r.email}</code></td>
                          <td style={S.td}><code style={{fontSize:'0.85rem'}}>{r.password}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Edit Modal ───────────────────────────────────────────────────────── */}
      {editTarget&&(
        <div style={S.overlay} onClick={(e)=>{ if(e.target===e.currentTarget)setEditTarget(null); }}>
          <div style={{...S.modal,maxWidth:460}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h2 style={{margin:0,fontSize:'1.1rem',fontWeight:800,color:'#0f172a'}}>Chỉnh sửa giáo viên</h2>
              <button onClick={()=>setEditTarget(null)}
                style={{background:'none',border:'none',fontSize:'1.5rem',cursor:'pointer',color:'#64748b',lineHeight:1}}>✕</button>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontWeight:700,marginBottom:6,fontSize:'0.88rem',color:'#374151'}}>Họ và tên</label>
              <input style={{...inp,width:'100%',boxSizing:'border-box'}}
                value={editForm.name} onChange={(e)=>setEditForm((f)=>({...f,name:e.target.value}))}/>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontWeight:700,marginBottom:6,fontSize:'0.88rem',color:'#374151'}}>Môn dạy</label>
              <input style={{...inp,width:'100%',boxSizing:'border-box'}}
                value={editForm.subject} onChange={(e)=>setEditForm((f)=>({...f,subject:e.target.value}))}/>
            </div>
            <div style={{marginBottom:20,padding:'8px 12px',background:'#f8fafc',borderRadius:8,fontSize:'0.84rem',color:'#64748b'}}>
              Email: <code>{editTarget.email}</code>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button onClick={()=>setEditTarget(null)}
                style={{padding:'9px 18px',borderRadius:8,border:'1px solid #cbd5e1',background:'#f8fafc',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Hủy</button>
              <button onClick={handleEdit} disabled={editing}
                style={{padding:'9px 22px',borderRadius:8,border:'none',background:editing?'#93c5fd':'#1d4ed8',color:'#fff',fontWeight:800,cursor:editing?'not-allowed':'pointer',fontFamily:'inherit'}}>
                {editing?'Đang lưu...':'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirm Modal ─────────────────────────────────────────────── */}
      {deleteTarget&&(
        <div style={S.overlay} onClick={(e)=>{ if(e.target===e.currentTarget)setDeleteTarget(null); }}>
          <div style={{...S.modal,maxWidth:400}}>
            <div style={{textAlign:'center',marginBottom:22}}>
              <div style={{width:54,height:54,borderRadius:'50%',background:'#fee2e2',border:'1px solid #fecaca',color:'#b91c1c',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:'1.4rem',margin:'0 auto 14px'}}>!</div>
              <div style={{fontWeight:800,fontSize:'1.05rem',color:'#0f172a',marginBottom:8}}>Xóa tài khoản giáo viên?</div>
              <div style={{color:'#64748b',fontSize:'0.9rem',lineHeight:1.6}}>
                Bạn sắp xóa tài khoản của <strong>{deleteTarget.name}</strong>
                <br/><span style={{fontFamily:'monospace',fontSize:'0.85rem'}}>{deleteTarget.email}</span>
                <br/>Hành động này <strong style={{color:'#b91c1c'}}>không thể hoàn tác</strong>.
              </div>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'center'}}>
              <button onClick={()=>setDeleteTarget(null)}
                style={{padding:'9px 24px',borderRadius:8,border:'1px solid #cbd5e1',background:'#f8fafc',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Hủy</button>
              <button onClick={handleDelete} disabled={deleting}
                style={{padding:'9px 24px',borderRadius:8,border:'none',background:deleting?'#fca5a5':'#dc2626',color:'#fff',fontWeight:800,cursor:deleting?'not-allowed':'pointer',fontFamily:'inherit'}}>
                {deleting?'Đang xóa...':'Xóa tài khoản'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Tab: Students ────────────────────────────────────────────────────────────
const EMPTY_STUDENT=()=>({name:'',dob:''});

function StudentsTab(){
  const[classrooms,setClassrooms]=useState([]);
  const[selectedClass,setSelectedClass]=useState('');
  const[rows,setRows]=useState([EMPTY_STUDENT()]);
  const[creating,setCreating]=useState(false);
  const[results,setResults]=useState(null);
  const[msg,setMsg]=useState(null);
  const[pasteText,setPasteText]=useState('');
  const[showPaste,setShowPaste]=useState(false);
  const fileRef=useRef(null);

  useEffect(()=>{
    adminApi.getClassrooms().then((res)=>setClassrooms(res.data?.classrooms||[])).catch(()=>{});
  },[]);

  const selectedClassObj=classrooms.find((c)=>c.id===selectedClass);
  const setRow=(i,field,val)=>setRows((prev)=>prev.map((r,idx)=>idx===i?{...r,[field]:val}:r));
  const addRow=()=>setRows((prev)=>[...prev,EMPTY_STUDENT()]);
  const removeRow=(i)=>setRows((prev)=>prev.filter((_,idx)=>idx!==i));

  const parsePaste=()=>{
    const lines=pasteText.trim().split('\n').filter((l)=>l.trim());
    const parsed=lines.map((line)=>{
      const parts=line.split(/[\t,;]+/).map((s)=>s.trim());
      return{name:parts[0]||'',dob:parts[1]||''};
    }).filter((r)=>r.name);
    if(parsed.length){setRows(parsed);setShowPaste(false);setPasteText('');}
    else setMsg({ok:false,text:'Không đọc được dữ liệu. Mỗi dòng: Họ tên [tab] ngày sinh (dd/mm/yyyy)'});
  };

  const handleCSV=(e)=>{
    const file=e.target.files?.[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const lines=(ev.target.result||'').split('\n').filter((l)=>l.trim());
      const parsed=lines.map((line)=>{
        const parts=line.split(/[,;]+/).map((s)=>s.trim().replace(/^"|"$/g,''));
        return{name:parts[0]||'',dob:parts[1]||''};
      }).filter((r)=>r.name&&!['họ tên','ho ten','name'].includes(r.name.toLowerCase()));
      if(parsed.length){setRows(parsed);setMsg({ok:true,text:`Đã đọc ${parsed.length} học sinh từ CSV.`});}
      else setMsg({ok:false,text:'File CSV không đúng định dạng.'});
    };
    reader.readAsText(file,'utf-8');
    e.target.value='';
  };

  const handleCreate=async()=>{
    if(!selectedClass){setMsg({ok:false,text:'Vui lòng chọn lớp.'});return;}
    const valid=rows.filter((r)=>r.name.trim());
    if(!valid.length){setMsg({ok:false,text:'Nhập ít nhất một học sinh.'});return;}
    setCreating(true);setMsg(null);setResults(null);
    try{
      const res=await adminApi.createStudents(valid,selectedClass,selectedClassObj?.name||'');
      setResults(res.data?.results||[]);
      setMsg({ok:true,text:`Đã tạo ${res.data?.results?.length||0} tài khoản học sinh.`});
      setRows([EMPTY_STUDENT()]);
    }catch(err){ setMsg({ok:false,text:err?.response?.data?.message||'Lỗi khi tạo tài khoản.'}); }
    finally{setCreating(false);}
  };

  const copyAll=()=>{
    if(!results)return;
    navigator.clipboard.writeText(results.map((r)=>`${r.name}\t${r.dob}\t${r.email}\t${r.password}`).join('\n')).catch(()=>{});
  };

  return(
    <>
      {msg&&<div style={S.msgBanner(msg.ok)}>{msg.text}</div>}
      <div style={S.controlsCard}>
        <div style={{marginBottom:16}}>
          <div style={{fontWeight:800,marginBottom:8,color:'#1e3a8a'}}>Chọn lớp</div>
          <select style={{...inp,minWidth:200}} value={selectedClass} onChange={(e)=>setSelectedClass(e.target.value)}>
            <option value="">— Chọn lớp —</option>
            {classrooms.map((c)=>(
              <option key={c.id} value={c.id}>{c.name}{c.teacherName?` (${c.teacherName})`:''}</option>
            ))}
          </select>
        </div>
        <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
          <button onClick={()=>setShowPaste((v)=>!v)}
            style={{padding:'8px 14px',borderRadius:8,border:'1px solid #94a3b8',background:'#f8fafc',fontWeight:700,cursor:'pointer',fontFamily:'inherit',fontSize:'0.86rem'}}>
            📋 Dán từ Excel
          </button>
          <button onClick={()=>fileRef.current?.click()}
            style={{padding:'8px 14px',borderRadius:8,border:'1px solid #94a3b8',background:'#f8fafc',fontWeight:700,cursor:'pointer',fontFamily:'inherit',fontSize:'0.86rem'}}>
            📂 Import CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv,.txt" style={{display:'none'}} onChange={handleCSV}/>
          <span style={{color:'#94a3b8',fontSize:'0.82rem',alignSelf:'center'}}>Định dạng: Họ tên, Ngày sinh (dd/mm/yyyy)</span>
        </div>
        {showPaste&&(
          <div style={{marginBottom:14}}>
            <textarea rows={6}
              style={{...inp,width:'100%',boxSizing:'border-box',resize:'vertical',fontFamily:'monospace'}}
              placeholder={'Nguyễn Văn An\t05/03/2015\nTrần Thị Bích\t12/07/2015\n...'}
              value={pasteText} onChange={(e)=>setPasteText(e.target.value)}/>
            <button onClick={parsePaste}
              style={{marginTop:6,padding:'8px 16px',borderRadius:8,border:'none',background:'#0369a1',color:'#fff',fontWeight:800,cursor:'pointer',fontFamily:'inherit'}}>
              Nhập danh sách
            </button>
          </div>
        )}
        <div style={{overflowX:'auto'}}>
          <table style={{...S.table,marginBottom:12}}>
            <thead>
              <tr>
                <th style={S.th}>#</th><th style={S.th}>Họ và tên</th>
                <th style={S.th}>Ngày sinh (dd/mm/yyyy)</th>
                <th style={S.th}>Email (xem trước)</th>
                <th style={S.th}>Mật khẩu (xem trước)</th>
                <th style={S.th}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={i}>
                  <td style={{...S.td,...S.index}}>{i+1}</td>
                  <td style={S.td}><input style={{...inp,width:200}} placeholder="Nguyễn Văn An" value={r.name} onChange={(e)=>setRow(i,'name',e.target.value)}/></td>
                  <td style={S.td}><input style={{...inp,width:140}} placeholder="05/03/2015" value={r.dob} onChange={(e)=>setRow(i,'dob',e.target.value)}/></td>
                  <td style={S.td}><span style={{...S.muted,fontFamily:'monospace',fontSize:'0.82rem'}}>{r.name||r.dob?previewStudentEmail(r.name,r.dob):<i>—</i>}</span></td>
                  <td style={S.td}><span style={{...S.muted,fontFamily:'monospace',fontSize:'0.82rem'}}>{r.dob?previewStudentPw(r.dob):<i>—</i>}</span></td>
                  <td style={S.td}>{rows.length>1&&<button onClick={()=>removeRow(i)} style={{background:'none',border:'none',color:'#dc2626',cursor:'pointer',fontWeight:800,fontSize:'1rem'}}>✕</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{display:'flex',gap:10}}>
          <button onClick={addRow}
            style={{padding:'9px 16px',borderRadius:8,border:'1px dashed #94a3b8',background:'#f8fafc',fontWeight:700,cursor:'pointer',fontFamily:'inherit',color:'#475569'}}>
            + Thêm dòng
          </button>
          <button onClick={handleCreate} disabled={creating}
            style={{padding:'9px 20px',borderRadius:8,border:'none',background:creating?'#93c5fd':'#1d4ed8',color:'#fff',fontWeight:800,cursor:creating?'not-allowed':'pointer',fontFamily:'inherit'}}>
            {creating?'Đang tạo...':`Tạo tài khoản${selectedClassObj?` (${selectedClassObj.name})`:''}`}
          </button>
        </div>
      </div>
      {results&&(
        <div style={S.tableCard}>
          <div style={{padding:'14px 16px',borderBottom:'1px solid #e2e8f0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontWeight:800,color:'#1e3a8a'}}>Tài khoản đã tạo ({results.length})</span>
            <button onClick={copyAll} style={{padding:'7px 14px',borderRadius:8,border:'1px solid #cbd5e1',background:'#f8fafc',fontWeight:700,cursor:'pointer',fontFamily:'inherit',fontSize:'0.85rem'}}>📋 Copy tất cả</button>
          </div>
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead><tr>{['Tên','Ngày sinh','Lớp','Email','Mật khẩu'].map((h)=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {results.map((r,i)=>(
                  <tr key={i}>
                    <td style={{...S.td,fontWeight:700}}>{r.name}</td>
                    <td style={S.td}>{r.dob||'—'}</td>
                    <td style={S.td}>{r.classroomName||'—'}</td>
                    <td style={S.td}><code style={{fontSize:'0.85rem'}}>{r.email}</code></td>
                    <td style={S.td}><code style={{fontSize:'0.85rem'}}>{r.password}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Rich text editor (WYSIWYG) ──────────────────────────────────────────────
const GE_CSS=`
.ge-content{min-height:200px;padding:14px 16px;outline:none;font-size:0.93rem;line-height:1.8;color:#1a202c;font-family:'Segoe UI',sans-serif;}
.ge-content p{margin:5px 0;}
.ge-content strong{font-weight:800;}
.ge-content em{font-style:italic;}
.ge-content s{text-decoration:line-through;}
.ge-content ul,.ge-content ol{padding-left:22px;margin:6px 0;}
.ge-content li{margin:3px 0;}
.ge-content table{border-collapse:collapse;width:100%;margin:12px 0;font-size:0.9rem;}
.ge-content th,.ge-content td{border:1px solid #d1d5db;padding:8px 12px;text-align:left;}
.ge-content th{background:#f1f5f9;font-weight:700;}
.ge-content blockquote{border-left:4px solid #667eea;margin:10px 0;padding:8px 14px;background:rgba(102,126,234,0.07);border-radius:0 8px 8px 0;color:#334155;}
.ge-content img{max-width:100%;height:auto;border-radius:8px;margin:8px 0;display:block;}
.ge-content [contenteditable=false]{pointer-events:none;}
`;

function RichTextEditor({value,onChange,onUploadImage}){
  const editorRef=useRef(null);
  const [showHtml,setShowHtml]=useState(false);
  const [tableRows,setTableRows]=useState(3);
  const [tableCols,setTableCols]=useState(3);
  const [showTableDlg,setShowTableDlg]=useState(false);
  const [uploading,setUploading]=useState(false);
  const fileRef=useRef(null);

  // On mount: set initial content
  useEffect(()=>{
    if(editorRef.current) editorRef.current.innerHTML=value||'';
    // eslint-disable-next-line
  },[]);

  const notify=()=>{if(editorRef.current) onChange(editorRef.current.innerHTML);};

  const exec=(cmd,val=null)=>{
    if(showHtml) return;
    editorRef.current.focus();
    document.execCommand(cmd,false,val);
    notify();
  };

  const setFontSize=(px)=>{
    if(showHtml)return;
    editorRef.current.focus();
    document.execCommand('fontSize',false,'7');
    editorRef.current.querySelectorAll('font[size="7"]').forEach(el=>{
      const span=document.createElement('span');
      span.style.fontSize=px;
      span.innerHTML=el.innerHTML;
      el.parentNode.replaceChild(span,el);
    });
    notify();
  };

  const insertTable=()=>{
    const r=Math.max(1,tableRows),c=Math.max(1,tableCols);
    let h='<table><thead><tr>';
    for(let i=0;i<c;i++) h+=`<th>Tiêu đề ${i+1}</th>`;
    h+='</tr></thead><tbody>';
    for(let i=0;i<r-1;i++){h+='<tr>';for(let j=0;j<c;j++) h+='<td>Nội dung</td>';h+='</tr>';}
    h+='</tbody></table><p></p>';
    editorRef.current.focus();
    document.execCommand('insertHTML',false,h);
    notify();
    setShowTableDlg(false);
  };

  const switchToHtml=()=>setShowHtml(true);
  const switchToVisual=()=>{
    if(editorRef.current) editorRef.current.innerHTML=value||'';
    setShowHtml(false);
  };

  const handleImageFile=async(e)=>{
    const file=e.target.files[0];if(!file)return;
    setUploading(true);
    const reader=new FileReader();
    reader.onload=async(ev)=>{
      try{
        const url=await onUploadImage(ev.target.result);
        const img=`<img src="${url}" alt="" style="max-width:100%;height:auto;border-radius:8px;margin:8px 0;display:block;"/>`;
        editorRef.current.focus();
        document.execCommand('insertHTML',false,img);
        notify();
      }catch{alert('Lỗi upload ảnh. Kiểm tra cấu hình Firebase Storage và env FIREBASE_STORAGE_BUCKET.');}
      finally{setUploading(false);}
    };
    reader.readAsDataURL(file);
    e.target.value='';
  };

  const TB=(onClick,label,title,style={})=>(
    <button type="button" title={title} onClick={onClick}
      style={{padding:'4px 9px',border:'1px solid #d1d5db',borderRadius:5,background:'#fff',
        cursor:'pointer',fontWeight:700,fontSize:'0.8rem',color:'#374151',lineHeight:1.4,...style}}>
      {label}
    </button>
  );

  return(
    <div style={{border:'1.5px solid #e0e0e0',borderRadius:8,overflow:'visible',background:'#fff'}}>
      <style>{GE_CSS}</style>
      {/* Toolbar */}
      <div style={{display:'flex',gap:3,padding:'6px 10px',background:'#f8f9fa',borderBottom:'1.5px solid #e0e0e0',flexWrap:'wrap',alignItems:'center'}}>
        {/* Font size */}
        <select onChange={e=>{if(e.target.value){setFontSize(e.target.value);e.target.value='';}}}
          defaultValue=""
          style={{padding:'3px 5px',border:'1px solid #d1d5db',borderRadius:5,background:'#fff',fontSize:'0.78rem',cursor:'pointer',color:'#374151',height:26}}>
          <option value="" disabled>Cỡ chữ</option>
          {['10px','12px','14px','16px','18px','20px','24px','28px','32px','36px','48px'].map(s=>(
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div style={{width:1,height:18,background:'#d1d5db',margin:'0 2px'}}/>
        {TB(()=>exec('bold'),<b>B</b>,'Đậm (Ctrl+B)')}
        {TB(()=>exec('italic'),<i>I</i>,'Nghiêng (Ctrl+I)')}
        {TB(()=>exec('underline'),<u>U</u>,'Gạch chân (Ctrl+U)')}
        {TB(()=>exec('strikeThrough'),<s>S</s>,'Gạch ngang')}
        <div style={{width:1,height:18,background:'#d1d5db',margin:'0 2px'}}/>
        {TB(()=>exec('justifyLeft'),'←','Căn trái')}
        {TB(()=>exec('justifyCenter'),'≡','Căn giữa')}
        {TB(()=>exec('justifyRight'),'→','Căn phải')}
        {TB(()=>exec('justifyFull'),'☰','Căn đều')}
        <div style={{width:1,height:18,background:'#d1d5db',margin:'0 2px'}}/>
        {TB(()=>exec('formatBlock','BLOCKQUOTE'),'❝','Trích dẫn')}
        {TB(()=>exec('insertUnorderedList'),'• ≡','Danh sách')}
        {TB(()=>exec('insertOrderedList'),'1. ≡','Danh sách số')}
        {TB(()=>exec('indent'),'→|','Thụt lề')}
        {TB(()=>exec('outdent'),'|←','Bỏ thụt lề')}
        <div style={{width:1,height:18,background:'#d1d5db',margin:'0 2px'}}/>
        {/* Table */}
        <div style={{position:'relative'}}>
          {TB(()=>setShowTableDlg(v=>!v),'⊞ Bảng','Chèn bảng')}
          {showTableDlg&&(
            <div style={{position:'absolute',top:'110%',left:0,background:'#fff',border:'1.5px solid #e0e0e0',borderRadius:10,padding:14,zIndex:200,boxShadow:'0 8px 24px rgba(0,0,0,0.12)',minWidth:190}}>
              <div style={{fontWeight:800,fontSize:'0.82rem',marginBottom:10,color:'#333'}}>Kích thước bảng</div>
              <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:10}}>
                <input type="number" min={1} max={10} value={tableRows} onChange={e=>setTableRows(Number(e.target.value))}
                  style={{width:48,padding:'5px 7px',border:'1px solid #d1d5db',borderRadius:5,fontSize:'0.82rem'}}/>
                <span style={{fontSize:'0.78rem',color:'#64748b'}}>hàng ×</span>
                <input type="number" min={1} max={8} value={tableCols} onChange={e=>setTableCols(Number(e.target.value))}
                  style={{width:48,padding:'5px 7px',border:'1px solid #d1d5db',borderRadius:5,fontSize:'0.82rem'}}/>
                <span style={{fontSize:'0.78rem',color:'#64748b'}}>cột</span>
              </div>
              <button onClick={insertTable} style={{width:'100%',padding:'7px',background:'#667eea',color:'#fff',border:'none',borderRadius:6,cursor:'pointer',fontWeight:700,fontSize:'0.82rem'}}>
                Chèn bảng
              </button>
            </div>
          )}
        </div>
        <div style={{width:1,height:18,background:'#d1d5db',margin:'0 2px'}}/>
        {/* Image upload */}
        {TB(()=>fileRef.current?.click(),uploading?'⏳':'📷 Ảnh','Upload ảnh lên Firebase Storage',{background:'#ede9ff',borderColor:'#667eea',color:'#667eea',opacity:uploading?0.6:1,cursor:uploading?'not-allowed':'pointer'})}
        <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleImageFile}/>
        {/* HTML toggle */}
        <div style={{marginLeft:'auto'}}>
          {TB(showHtml?switchToVisual:switchToHtml,showHtml?'👁 Visual':'</> HTML','Chỉnh sửa HTML thô',showHtml?{background:'#dcfce7',borderColor:'#16a34a',color:'#16a34a'}:{background:'#fef9c3',borderColor:'#ca8a04',color:'#854d0e'})}
        </div>
      </div>

      {/* Visual editor */}
      <div ref={editorRef} contentEditable={!showHtml} suppressContentEditableWarning
        onInput={notify}
        className="ge-content"
        style={{display:showHtml?'none':'block'}}
      />

      {/* HTML source view */}
      {showHtml&&(
        <textarea value={value} onChange={e=>{onChange(e.target.value);if(editorRef.current) editorRef.current.innerHTML=e.target.value;}}
          style={{display:'block',width:'100%',boxSizing:'border-box',minHeight:200,padding:'14px 16px',border:'none',resize:'vertical',fontFamily:'monospace',fontSize:'0.82rem',outline:'none',color:'#1e293b',background:'#f8fafc'}}
        />
      )}
    </div>
  );
}

// ─── Grammar admin tab ────────────────────────────────────────────────────────
const GL=['all','1','2','3','4','5','6','7','8','9'];
const GL_LABEL={all:'Tất cả','1':'Khối 1','2':'Khối 2','3':'Khối 3','4':'Khối 4','5':'Khối 5','6':'Khối 6','7':'Khối 7','8':'Khối 8','9':'Khối 9'};
const MONTHS_G=['','T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
const EMPTY_GL={title:'',description:'',videoUrl:'',content:'',gradeLevel:'all',topic:'',module:'',weekNumber:'',month:'',year:new Date().getFullYear(),exercises:[],status:'published'};
const EMPTY_EX_G={question:'',type:'mcq',options:['','','',''],answer:'',explanation:''};

const Gs={
  wrap:{display:'flex',gap:0,minHeight:'calc(100vh - 200px)',background:'#fff',borderRadius:16,overflow:'hidden',boxShadow:'0 2px 16px rgba(0,0,0,0.08)'},
  sidebar:{width:260,background:'#1a1a2e',flexShrink:0,overflowY:'auto',display:'flex',flexDirection:'column'},
  sidebarTop:{padding:'16px 14px 10px',borderBottom:'1px solid #2d2d4e'},
  addBtn:{display:'block',width:'100%',padding:'9px 12px',background:'linear-gradient(135deg,#667eea,#764ba2)',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700,fontSize:'0.88rem',marginBottom:8},
  gTab:(a)=>({padding:'5px 9px',border:'none',borderRadius:6,cursor:'pointer',fontWeight:700,fontSize:'0.75rem',background:a?'#667eea':'rgba(255,255,255,0.1)',color:'#fff',marginRight:4,marginBottom:4}),
  searchSide:{width:'100%',boxSizing:'border-box',padding:'7px 10px',borderRadius:6,border:'1px solid #2d2d4e',background:'rgba(255,255,255,0.06)',color:'#fff',fontSize:'0.82rem',outline:'none'},
  item:(a)=>({padding:'10px 14px',cursor:'pointer',borderLeft:a?'3px solid #667eea':'3px solid transparent',background:a?'rgba(102,126,234,0.15)':'transparent',transition:'all 0.12s'}),
  itemTitle:{fontSize:'0.85rem',fontWeight:600,color:'#eee',marginBottom:2,lineHeight:1.3},
  itemMeta:{fontSize:'0.72rem',color:'#888'},
  main:{flex:1,padding:'24px 28px',overflowY:'auto',background:'#f9fafc'},
  formCard:{background:'#fff',borderRadius:14,padding:'24px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'},
  row2:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14},
  row3:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12},
  lbl:{display:'block',fontWeight:700,color:'#555',fontSize:'0.82rem',marginBottom:5},
  inp:{width:'100%',boxSizing:'border-box',padding:'9px 11px',borderRadius:8,border:'1.5px solid #e0e0e0',fontSize:'0.88rem',outline:'none'},
  sel:{width:'100%',boxSizing:'border-box',padding:'9px 11px',borderRadius:8,border:'1.5px solid #e0e0e0',fontSize:'0.88rem',background:'#fff'},
  ta:{width:'100%',boxSizing:'border-box',padding:'9px 11px',borderRadius:8,border:'1.5px solid #e0e0e0',fontSize:'0.86rem',outline:'none',minHeight:140,resize:'vertical',fontFamily:'monospace'},
  divider:{height:1,background:'#f0f0f0',margin:'20px 0'},
  secTitle:{fontWeight:800,color:'#333',fontSize:'0.95rem',margin:'0 0 14px'},
  exCard:{border:'1.5px solid #e8e8f0',borderRadius:10,padding:'16px',marginBottom:12,background:'#fafafe'},
  exRow:{display:'flex',gap:8,alignItems:'center',marginBottom:8},
  rmBtn:{background:'#fee2e2',color:'#e17055',border:'none',borderRadius:6,padding:'5px 10px',cursor:'pointer',fontWeight:700,fontSize:'0.78rem',whiteSpace:'nowrap'},
  addExBtn:{background:'#ede9ff',color:'#667eea',border:'none',borderRadius:8,padding:'9px 16px',cursor:'pointer',fontWeight:700,fontSize:'0.86rem',marginRight:8},
  btnRow:{display:'flex',gap:10,marginTop:20,flexWrap:'wrap'},
  saveBtn:{padding:'10px 24px',borderRadius:9,border:'none',cursor:'pointer',fontWeight:800,fontSize:'0.9rem',background:'linear-gradient(135deg,#667eea,#764ba2)',color:'#fff'},
  delBtn:{padding:'10px 20px',borderRadius:9,border:'none',cursor:'pointer',fontWeight:800,fontSize:'0.9rem',background:'#fee2e2',color:'#e17055'},
  emptyState:{textAlign:'center',padding:'60px 20px',color:'#aaa'},
  uploadBtn:{padding:'6px 12px',borderRadius:6,border:'1.5px solid #667eea',background:'#ede9ff',color:'#667eea',cursor:'pointer',fontWeight:700,fontSize:'0.78rem',whiteSpace:'nowrap'},
  statusDot:(s)=>({display:'inline-block',width:6,height:6,borderRadius:'50%',background:s==='published'?'#00b894':'#f39c12',marginRight:4}),
};

function GrammarAdminTab(){
  const[lessons,setLessons]=useState([]);
  const[loading,setLoading]=useState(true);
  const[selected,setSelected]=useState(null);
  const[form,setForm]=useState(EMPTY_GL);
  const[isNew,setIsNew]=useState(false);
  const[saving,setSaving]=useState(false);
  const[deleting,setDeleting]=useState(false);
  const[msg,setMsg]=useState(null);
  const[filterGrade,setFilterGrade]=useState('all');
  const[search,setSearch]=useState('');

  const load=useCallback(async()=>{
    setLoading(true);
    try{const r=await adminApi.getGrammarLessons();setLessons(r.data?.lessons||[]);}
    catch{setMsg({ok:false,text:'Không tải được dữ liệu.'});}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{load();},[load]);

  const selectLesson=(l)=>{
    setSelected(l);setIsNew(false);setMsg(null);
    setForm({title:l.title||'',description:l.description||'',videoUrl:l.videoUrl||'',content:l.content||'',gradeLevel:l.gradeLevel||'all',topic:l.topic||'',module:l.module||'',weekNumber:l.weekNumber||'',month:l.month||'',year:l.year||new Date().getFullYear(),exercises:l.exercises||[],status:l.status||'published'});
  };
  const startNew=()=>{setSelected(null);setIsNew(true);setForm(EMPTY_GL);setMsg(null);};

  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));

  const handleSave=async()=>{
    if(!form.title.trim())return setMsg({ok:false,text:'Nhập tiêu đề bài học.'});
    setSaving(true);setMsg(null);
    try{
      if(isNew){await adminApi.createGrammarLesson(form);setMsg({ok:true,text:'Đã tạo bài học.'});setIsNew(false);}
      else{await adminApi.updateGrammarLesson(selected.id,form);setMsg({ok:true,text:'Đã lưu thay đổi.'});}
      await load();
    }catch{setMsg({ok:false,text:'Lỗi lưu bài học.'});}
    finally{setSaving(false);}
  };

  const handleDelete=async()=>{
    if(!selected||!window.confirm(`Xóa bài học "${selected.title}"?`))return;
    setDeleting(true);
    try{await adminApi.deleteGrammarLesson(selected.id);setSelected(null);setIsNew(false);setForm(EMPTY_GL);setMsg({ok:true,text:'Đã xóa.'});await load();}
    catch{setMsg({ok:false,text:'Lỗi xóa.'});}
    finally{setDeleting(false);}
  };

  const handleUploadImage=async(base64)=>{
    const r=await adminApi.uploadGrammarImage(base64);
    const url=r.data?.url;
    if(!url) throw new Error('No URL');
    return url;
  };

  const addEx=(type)=>setForm(f=>({...f,exercises:[...f.exercises,{...EMPTY_EX_G,type,options:type==='mcq'?['','','','']:[]}]}));
  const updEx=(i,k,v)=>setForm(f=>{const exs=[...f.exercises];exs[i]={...exs[i],[k]:v};return{...f,exercises:exs};});
  const updOpt=(i,j,v)=>setForm(f=>{const exs=[...f.exercises];const opts=[...exs[i].options];opts[j]=v;exs[i]={...exs[i],options:opts};return{...f,exercises:exs};});
  const rmEx=(i)=>setForm(f=>({...f,exercises:f.exercises.filter((_,idx)=>idx!==i)}));

  const filtered=lessons
    .filter(l=>{
      if(filterGrade!=='all'&&l.gradeLevel!==filterGrade)return false;
      if(search&&!l.title.toLowerCase().includes(search.toLowerCase()))return false;
      return true;
    })
    .sort((a,b)=>{
      const ga=a.gradeLevel==='all'?99:parseInt(a.gradeLevel)||99;
      const gb=b.gradeLevel==='all'?99:parseInt(b.gradeLevel)||99;
      if(ga!==gb)return ga-gb;
      const wa=parseInt(a.weekNumber)||0;
      const wb=parseInt(b.weekNumber)||0;
      if(wa!==wb)return wa-wb;
      return(a.title||'').localeCompare(b.title||'');
    });

  const showForm=isNew||selected;

  return(
    <div style={Gs.wrap}>
      {/* Sidebar */}
      <div style={Gs.sidebar}>
        <div style={Gs.sidebarTop}>
          <button style={Gs.addBtn} onClick={startNew}>+ Thêm bài học mới</button>
          <input style={Gs.searchSide} placeholder="Tìm bài học..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <div style={{marginTop:8,display:'flex',flexWrap:'wrap'}}>
            {GL.map(g=><button key={g} style={Gs.gTab(filterGrade===g)} onClick={()=>setFilterGrade(g)}>{GL_LABEL[g]}</button>)}
          </div>
        </div>
        <div style={{flex:1,overflowY:'auto',paddingTop:8}}>
          {loading&&<div style={{color:'#888',padding:'20px 14px',fontSize:'0.82rem'}}>Đang tải...</div>}
          {!loading&&filtered.length===0&&<div style={{color:'#888',padding:'20px 14px',fontSize:'0.82rem'}}>Không có bài học.</div>}
          {filtered.map(l=>(
            <div key={l.id} style={Gs.item(selected?.id===l.id)} onClick={()=>selectLesson(l)}>
              <div style={Gs.itemTitle}><span style={Gs.statusDot(l.status)}/>{l.title}</div>
              <div style={Gs.itemMeta}>{GL_LABEL[l.gradeLevel]||l.gradeLevel} · {l.topic||'–'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main editor */}
      <div style={Gs.main}>
        {msg&&<div style={{marginBottom:14,padding:'10px 14px',borderRadius:10,fontWeight:700,fontSize:'0.88rem',background:msg.ok?'#ecfdf5':'#fef2f2',color:msg.ok?'#047857':'#b91c1c',border:msg.ok?'1px solid #a7f3d0':'1px solid #fecaca'}}>{msg.text}</div>}

        {!showForm&&(
          <div style={Gs.emptyState}>
            <div style={{fontSize:'2.5rem',marginBottom:12}}>📚</div>
            <div style={{fontWeight:700,marginBottom:8}}>Chọn bài học để chỉnh sửa</div>
            <div style={{fontSize:'0.88rem'}}>hoặc nhấn "+ Thêm bài học mới"</div>
          </div>
        )}

        {showForm&&(
          <div style={Gs.formCard}>
            <div style={{fontWeight:900,fontSize:'1.1rem',color:'#333',marginBottom:20}}>
              {isNew?'Tạo bài học mới':'Chỉnh sửa: '+selected?.title}
            </div>

            <div style={Gs.row2}>
              <div><label style={Gs.lbl}>Tiêu đề *</label>
                <input style={Gs.inp} value={form.title} onChange={e=>setF('title',e.target.value)} placeholder="VD: Unit 1 – In the school playground"/></div>
              <div><label style={Gs.lbl}>Khối lớp</label>
                <select style={Gs.sel} value={form.gradeLevel} onChange={e=>setF('gradeLevel',e.target.value)}>
                  {GL.map(g=><option key={g} value={g}>{GL_LABEL[g]}</option>)}
                </select></div>
            </div>

            <div style={{...Gs.row3,marginTop:12}}>
              <div><label style={Gs.lbl}>Chủ điểm ngữ pháp</label>
                <input style={Gs.inp} value={form.topic} onChange={e=>setF('topic',e.target.value)} placeholder="VD: Động từ To Be"/></div>
              <div><label style={Gs.lbl}>Module</label>
                <input style={Gs.inp} value={form.module} onChange={e=>setF('module',e.target.value)}/></div>
              <div><label style={Gs.lbl}>Trạng thái</label>
                <select style={Gs.sel} value={form.status} onChange={e=>setF('status',e.target.value)}>
                  <option value="published">Đã xuất bản</option>
                  <option value="draft">Nháp</option>
                </select></div>
            </div>

            <div style={{...Gs.row3,marginTop:12}}>
              <div><label style={Gs.lbl}>Tuần</label>
                <input style={Gs.inp} type="number" value={form.weekNumber} onChange={e=>setF('weekNumber',e.target.value)}/></div>
              <div><label style={Gs.lbl}>Tháng</label>
                <select style={Gs.sel} value={form.month} onChange={e=>setF('month',e.target.value)}>
                  {MONTHS_G.map((m,i)=><option key={i} value={i}>{m||'–'}</option>)}
                </select></div>
              <div><label style={Gs.lbl}>Năm</label>
                <input style={Gs.inp} type="number" value={form.year} onChange={e=>setF('year',Number(e.target.value))}/></div>
            </div>

            <div style={{marginTop:12}}>
              <label style={Gs.lbl}>Mô tả ngắn</label>
              <input style={Gs.inp} value={form.description} onChange={e=>setF('description',e.target.value)} placeholder="Tóm tắt nội dung bài học"/>
            </div>

            <div style={{marginTop:12}}>
              <label style={Gs.lbl}>URL Video YouTube</label>
              <input style={Gs.inp} value={form.videoUrl} onChange={e=>setF('videoUrl',e.target.value)} placeholder="https://www.youtube.com/watch?v=..."/>
            </div>

            <div style={{marginTop:12}}>
              <label style={Gs.lbl}>Nội dung lý thuyết</label>
              <RichTextEditor
                key={selected?.id||(isNew?'__new__':'__empty__')}
                value={form.content}
                onChange={v=>setF('content',v)}
                onUploadImage={handleUploadImage}
              />
              <div style={{fontSize:'0.75rem',color:'#999',marginTop:4}}>Gõ nội dung bình thường. Dùng toolbar để in đậm, tạo bảng, chèn ảnh... Nút &lt;/&gt; HTML để xem/sửa mã thô.</div>
            </div>

            <div style={Gs.divider}/>

            {/* Exercises */}
            <div style={Gs.secTitle}>Bài tập ({form.exercises.length})</div>
            {form.exercises.map((ex,i)=>(
              <div key={i} style={Gs.exCard}>
                <div style={Gs.exRow}>
                  <select style={{...Gs.sel,width:140,flex:'none'}} value={ex.type} onChange={e=>updEx(i,'type',e.target.value)}>
                    <option value="mcq">Trắc nghiệm</option>
                    <option value="fill_blank">Điền từ</option>
                  </select>
                  <input style={{...Gs.inp,flex:1}} placeholder="Câu hỏi..." value={ex.question} onChange={e=>updEx(i,'question',e.target.value)}/>
                  <button style={Gs.rmBtn} onClick={()=>rmEx(i)}>Xóa</button>
                </div>
                {ex.type==='mcq'&&(
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:8}}>
                    {(ex.options||['','','','']).map((opt,j)=>(
                      <input key={j} style={Gs.inp} placeholder={`Đáp án ${j+1}`} value={opt} onChange={e=>updOpt(i,j,e.target.value)}/>
                    ))}
                  </div>
                )}
                <div style={Gs.row2}>
                  <div><label style={Gs.lbl}>Đáp án đúng</label>
                    <input style={Gs.inp} value={ex.answer} onChange={e=>updEx(i,'answer',e.target.value)}/></div>
                  <div><label style={Gs.lbl}>Giải thích</label>
                    <input style={Gs.inp} value={ex.explanation} onChange={e=>updEx(i,'explanation',e.target.value)}/></div>
                </div>
              </div>
            ))}
            <div>
              <button style={Gs.addExBtn} onClick={()=>addEx('mcq')}>+ Trắc nghiệm</button>
              <button style={Gs.addExBtn} onClick={()=>addEx('fill_blank')}>+ Điền từ</button>
            </div>

            <div style={Gs.btnRow}>
              <button style={Gs.saveBtn} disabled={saving} onClick={handleSave}>{saving?'Đang lưu...':'💾 Lưu bài học'}</button>
              {!isNew&&selected&&(
                <button style={Gs.delBtn} disabled={deleting} onClick={handleDelete}>{deleting?'Đang xóa...':'🗑 Xóa bài học'}</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function AdminUsersPage(){
  useTitle('Quản lý người dùng');
  const userInfo=useSelector((s)=>s.userInfo);
  const history=useHistory();
  const[activeTab,setActiveTab]=useState('users');
  const[systemStats,setSystemStats]=useState(null);
  const isAdmin=userInfo?.role==='admin';

  useEffect(()=>{
    if(isAdmin){
      adminApi.getSystemStats().then((res)=>setSystemStats(res.data?.stats)).catch(()=>{});
    }
  },[isAdmin]);

  if(!isAdmin){
    return(
      <div style={S.noAccess}>
        <div style={{width:52,height:52,borderRadius:'50%',background:'#fee2e2',border:'1px solid #fecaca',color:'#b91c1c',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:'1.2rem'}}>!</div>
        <div style={{fontWeight:800,color:'#374151',fontSize:'1.05rem'}}>Chỉ admin mới có thể truy cập trang này.</div>
        <button style={S.homeBtn} onClick={()=>history.push('/')}>Về trang chủ</button>
      </div>
    );
  }

  return(
    <div style={S.page}>
      <div style={S.maxW}>
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Quản trị hệ thống</h1>
            <p style={S.subtitle}>Quản lý tài khoản, lớp học và dữ liệu toàn hệ thống.</p>
          </div>
          {systemStats&&<div style={S.headerMeta}>{formatNumber(systemStats.totalUsers)} người dùng</div>}
        </div>
        <TabBar active={activeTab} onChange={setActiveTab}/>
        {activeTab==='users'   &&<UsersTab systemStats={systemStats}/>}
        {activeTab==='classes' &&<ClassroomsTab/>}
        {activeTab==='teachers'&&<TeachersTab/>}
        {activeTab==='students'&&<StudentsTab/>}
        {activeTab==='grammar' &&<GrammarAdminTab/>}
      </div>
    </div>
  );
}

export default AdminUsersPage;