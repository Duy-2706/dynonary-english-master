import React, { useEffect, useRef, useState } from 'react';

const GE_CSS = `
.ge-content { min-height: 240px; padding: 16px 18px; outline: none; font-size: 1rem; line-height: 1.85; color: #1a202c; font-family: 'Inter','Segoe UI',sans-serif; }
.ge-content p { margin: 7px 0; }
.ge-content strong { font-weight: 800; }
.ge-content em { font-style: italic; }
.ge-content s { text-decoration: line-through; }
.ge-content ul, .ge-content ol { padding-left: 24px; margin: 8px 0; }
.ge-content li { margin: 4px 0; }
.ge-content table { border-collapse: collapse; width: 100%; margin: 14px 0; font-size: 0.98rem; table-layout: fixed; }
.ge-content th, .ge-content td { border: 1px solid #d1d5db; padding: 10px 13px; text-align: left; word-break: break-word; overflow-wrap: break-word; }
.ge-content th { background: #f1f5f9; font-weight: 700; }
.ge-content blockquote { border-left: 4px solid #2563eb; margin: 12px 0; padding: 10px 15px; background: #eff6ff; border-radius: 0 8px 8px 0; color: #334155; }
.ge-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 10px 4px; cursor: pointer; transition: outline 0.1s; }
.ge-content img:hover { outline: 2px solid #2563eb; }
.ge-content img.ge-img-selected { outline: 3px solid #2563eb; }
`;

const FONT_FAMILIES = [
  { label: 'Arial', value: 'Arial,sans-serif' },
  { label: 'Times New Roman', value: "'Times New Roman',serif" },
  { label: 'Georgia', value: 'Georgia,serif' },
  { label: 'Courier New', value: "'Courier New',monospace" },
  { label: 'Segoe UI', value: "'Segoe UI',sans-serif" },
  { label: 'Verdana', value: 'Verdana,sans-serif' },
  { label: 'Tahoma', value: 'Tahoma,sans-serif' },
];

function RichTextEditor({ value, onChange, onUploadImage }) {
  const editorRef = useRef(null);
  const [showHtml, setShowHtml] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [showTableDlg, setShowTableDlg] = useState(false);
  const [showTableMgmt, setShowTableMgmt] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const [imgPending, setImgPending] = useState(null);
  const [imgSize, setImgSize] = useState('100%');
  const [imgAlign, setImgAlign] = useState('center');
  const [selImg, setSelImg] = useState(null);
  const [imgToolbar, setImgToolbar] = useState(null);
  const savedRangeRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = value || '';
    // eslint-disable-next-line
  }, []);

  const notify = () => { if (editorRef.current) onChange(editorRef.current.innerHTML); };

  const exec = (cmd, val = null) => {
    if (showHtml) return;
    editorRef.current.focus();
    document.execCommand(cmd, false, val);
    notify();
  };

  const setFontFamily = (family) => {
    if (!family || showHtml) return;
    editorRef.current.focus();
    document.execCommand('styleWithCSS', false, true);
    document.execCommand('fontName', false, family);
    notify();
  };

  const setFontSize = (px) => {
    if (showHtml) return;
    editorRef.current.focus();
    document.execCommand('fontSize', false, '7');
    editorRef.current.querySelectorAll('font[size="7"]').forEach((el) => {
      const span = document.createElement('span');
      span.style.fontSize = px;
      span.innerHTML = el.innerHTML;
      el.parentNode.replaceChild(span, el);
    });
    notify();
  };

  const insertTable = () => {
    const r = Math.max(1, tableRows), c = Math.max(1, tableCols);
    let h = '<table><thead><tr>';
    for (let i = 0; i < c; i++) h += `<th>Tiêu đề ${i + 1}</th>`;
    h += '</tr></thead><tbody>';
    for (let i = 0; i < r - 1; i++) { h += '<tr>'; for (let j = 0; j < c; j++) h += '<td>Nội dung</td>'; h += '</tr>'; }
    h += '</tbody></table><p></p>';
    editorRef.current.focus();
    document.execCommand('insertHTML', false, h);
    notify();
    setShowTableDlg(false);
  };

  const tableAction = (action) => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const cell = sel.getRangeAt(0).startContainer.nodeType === 3
      ? sel.getRangeAt(0).startContainer.parentElement
      : sel.getRangeAt(0).startContainer;
    const td = cell.closest('td,th');
    const tr = td?.closest('tr');
    const table = td?.closest('table');
    if (!table) return;
    if (action === 'deleteTable') { table.remove(); notify(); return; }
    if (action === 'addRowBelow' || action === 'addRowAbove') {
      const newRow = tr.cloneNode(true);
      newRow.querySelectorAll('td,th').forEach((c) => { c.innerHTML = ''; });
      if (action === 'addRowBelow') tr.parentNode.insertBefore(newRow, tr.nextSibling);
      else tr.parentNode.insertBefore(newRow, tr);
      notify(); return;
    }
    if (action === 'deleteRow') { if (table.querySelectorAll('tr').length > 1) tr.remove(); notify(); return; }
    if (action === 'addColRight' || action === 'addColLeft') {
      const colIdx = Array.from(tr.cells).indexOf(td);
      table.querySelectorAll('tr').forEach((row) => {
        const newCell = document.createElement(row.querySelector('th') ? 'th' : 'td');
        const ref = row.cells[colIdx];
        if (action === 'addColRight') row.insertBefore(newCell, ref?.nextSibling || null);
        else row.insertBefore(newCell, ref || null);
      });
      notify(); return;
    }
    if (action === 'deleteCol') {
      const colIdx = Array.from(tr.cells).indexOf(td);
      if (tr.cells.length > 1) {
        table.querySelectorAll('tr').forEach((row) => { if (row.cells[colIdx]) row.cells[colIdx].remove(); });
      }
      notify();
    }
  };

  const handleImageFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const url = await onUploadImage(ev.target.result);
        setImgPending(url);
        setImgSize('100%');
        setImgAlign('center');
      } catch {
        alert('Lỗi upload ảnh. Kiểm tra cấu hình Firebase Storage.');
      } finally { setUploading(false); }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const insertPendingImg = () => {
    if (!imgPending) return;
    const marginStyle =
      imgAlign === 'center' ? 'margin:10px auto;' :
      imgAlign === 'right'  ? 'margin:10px 0 10px auto;' :
                              'margin:10px auto 10px 0;';
    const html = `<img src="${imgPending}" alt="" style="width:${imgSize};height:auto;border-radius:8px;display:block;${marginStyle}"/>`;
    editorRef.current.focus();
    const s = window.getSelection();
    if (savedRangeRef.current) { s.removeAllRanges(); s.addRange(savedRangeRef.current); }
    document.execCommand('insertHTML', false, html);
    notify();
    setImgPending(null);
  };

  const handleEditorClick = (e) => {
    if (e.target.tagName === 'IMG') {
      const img = e.target;
      editorRef.current.querySelectorAll('img.ge-img-selected').forEach((i) => i.classList.remove('ge-img-selected'));
      img.classList.add('ge-img-selected');
      setSelImg(img);
      const rect = img.getBoundingClientRect();
      const wrapRect = e.currentTarget.closest('[data-ge-wrap]')?.getBoundingClientRect() || e.currentTarget.getBoundingClientRect();
      setImgToolbar({ top: rect.top - wrapRect.top - 44, left: Math.max(0, rect.left - wrapRect.left) });
    } else {
      editorRef.current.querySelectorAll('img.ge-img-selected').forEach((i) => i.classList.remove('ge-img-selected'));
      setSelImg(null);
      setImgToolbar(null);
    }
  };

  const applyImgStyle = (size, align) => {
    if (!selImg) return;
    selImg.style.width = size;
    selImg.style.height = 'auto';
    selImg.style.display = 'block';
    if (align === 'center') selImg.style.margin = '10px auto';
    else if (align === 'right') selImg.style.margin = '10px 0 10px auto';
    else selImg.style.margin = '10px auto 10px 0';
    notify();
  };

  const TB = (onClick, label, title, style = {}) => (
    <button type="button" title={title} onClick={onClick} style={{ padding: '5px 9px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', color: '#374151', lineHeight: 1.4, minWidth: 28, ...style }}>
      {label}
    </button>
  );
  const SEP = () => <div style={{ width: 1, height: 20, background: '#d1d5db', margin: '0 2px', flexShrink: 0 }} />;

  return (
    <div data-ge-wrap style={{ border: '1.5px solid #dbe4ef', borderRadius: 10, overflow: 'visible', background: '#fff', position: 'relative' }}>
      <style>{GE_CSS}</style>

      <div style={{ display: 'flex', gap: 4, padding: '7px 9px', background: '#f8fafc', borderBottom: '1.5px solid #dbe4ef', flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Font family */}
        <select onChange={(e) => { setFontFamily(e.target.value); e.target.value = ''; }} defaultValue="" title="Font chữ"
          style={{ padding: '4px 6px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', fontSize: '0.82rem', cursor: 'pointer', color: '#374151', height: 30, maxWidth: 110 }}>
          <option value="" disabled>Font chữ</option>
          {FONT_FAMILIES.map((f) => <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>)}
        </select>

        {/* Font size */}
        <select onChange={(e) => { if (e.target.value) { setFontSize(e.target.value); e.target.value = ''; } }} defaultValue="" title="Cỡ chữ"
          style={{ padding: '4px 6px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', fontSize: '0.82rem', cursor: 'pointer', color: '#374151', height: 30, width: 66 }}>
          <option value="" disabled>Cỡ</option>
          {['10px','12px','14px','16px','18px','20px','24px','28px','32px','36px','48px'].map((s) => <option key={s} value={s}>{s.replace('px','')}</option>)}
        </select>

        {/* Heading */}
        <select onChange={(e) => { if (e.target.value) { exec('formatBlock', e.target.value); e.target.value = ''; } }} defaultValue="" title="Kiểu đoạn"
          style={{ padding: '4px 6px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', fontSize: '0.82rem', cursor: 'pointer', color: '#374151', height: 30, width: 72 }}>
          <option value="" disabled>Kiểu</option>
          <option value="p">Đoạn văn</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
        </select>

        <SEP />
        {TB(() => exec('bold'),          <b>B</b>,  'Đậm')}
        {TB(() => exec('italic'),        <i>I</i>,  'Nghiêng')}
        {TB(() => exec('underline'),     <u>U</u>,  'Gạch chân')}
        {TB(() => exec('strikeThrough'), <s>S</s>,  'Gạch ngang')}

        <label title="Màu chữ" style={{ display:'flex', alignItems:'center', gap:2, cursor:'pointer', padding:'3px 7px', border:'1px solid #d1d5db', borderRadius:6, background:'#fff', fontSize:'0.82rem', fontWeight:700, color:'#374151', height:30, boxSizing:'border-box' }}>
          <span style={{ fontWeight:800, fontSize:'0.88rem' }}>A</span>
          <input type="color" defaultValue="#e17055"
            onChange={(e) => { editorRef.current.focus(); document.execCommand('styleWithCSS',false,true); document.execCommand('foreColor',false,e.target.value); notify(); }}
            style={{ width:14, height:14, border:'none', padding:0, cursor:'pointer', borderRadius:2 }} />
        </label>

        <label title="Màu nền chữ" style={{ display:'flex', alignItems:'center', gap:2, cursor:'pointer', padding:'3px 7px', border:'1px solid #d1d5db', borderRadius:6, background:'#fff', fontSize:'0.82rem', fontWeight:700, color:'#374151', height:30, boxSizing:'border-box' }}>
          <span style={{ textDecoration:'underline', textDecorationColor:'#f59e0b', textDecorationThickness:3, fontSize:'0.88rem' }}>A</span>
          <input type="color" defaultValue="#fef08a"
            onChange={(e) => { editorRef.current.focus(); document.execCommand('styleWithCSS',false,true); document.execCommand('hiliteColor',false,e.target.value); notify(); }}
            style={{ width:14, height:14, border:'none', padding:0, cursor:'pointer', borderRadius:2 }} />
        </label>

        <SEP />
        {TB(() => exec('justifyLeft'),   '⬅', 'Căn trái')}
        {TB(() => exec('justifyCenter'), '⊙', 'Căn giữa')}
        {TB(() => exec('justifyRight'),  '➡', 'Căn phải')}
        {TB(() => exec('justifyFull'),   '☰', 'Căn đều')}
        <SEP />
        {TB(() => exec('formatBlock','BLOCKQUOTE'), '❝', 'Trích dẫn')}
        {TB(() => { if (showHtml) return; editorRef.current.focus(); document.execCommand('insertHorizontalRule', false, null); notify(); }, '─', 'Đường kẻ ngang')}
        {TB(() => exec('insertUnorderedList'),      '•≡', 'Danh sách')}
        {TB(() => exec('insertOrderedList'),        '1≡', 'Danh sách số')}
        {TB(() => exec('indent'),  '⇥', 'Thụt lề')}
        {TB(() => exec('outdent'), '⇤', 'Bỏ thụt lề')}
        <SEP />

        {/* Chèn bảng */}
        <div style={{ position:'relative' }}>
          {TB(() => setShowTableDlg((v) => !v), '▦', 'Chèn bảng')}
          {showTableDlg && (
            <div style={{ position:'absolute', top:'110%', left:0, background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:10, padding:14, zIndex:300, boxShadow:'0 8px 24px rgba(0,0,0,0.14)', minWidth:200 }}>
              <div style={{ fontWeight:800, fontSize:'0.88rem', marginBottom:10, color:'#0f172a' }}>Kích thước bảng</div>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:11 }}>
                <input type="number" min={1} max={10} value={tableRows} onChange={(e) => setTableRows(Number(e.target.value))} style={{ width:50, padding:'6px 7px', border:'1px solid #d1d5db', borderRadius:5, fontSize:'0.88rem' }} />
                <span style={{ fontSize:'0.82rem', color:'#64748b' }}>hàng ×</span>
                <input type="number" min={1} max={8} value={tableCols} onChange={(e) => setTableCols(Number(e.target.value))} style={{ width:50, padding:'6px 7px', border:'1px solid #d1d5db', borderRadius:5, fontSize:'0.88rem' }} />
                <span style={{ fontSize:'0.82rem', color:'#64748b' }}>cột</span>
              </div>
              <button onClick={insertTable} style={{ width:'100%', padding:'8px', background:'#2563eb', color:'#fff', border:'none', borderRadius:7, cursor:'pointer', fontWeight:700, fontSize:'0.88rem' }}>Chèn bảng</button>
            </div>
          )}
        </div>

        {/* Quản lý bảng */}
        <div style={{ position:'relative' }}>
          {TB(() => setShowTableMgmt((v) => !v), '⊞', 'Quản lý bảng', { background:'#f0fdf4', borderColor:'#22c55e', color:'#15803d' })}
          {showTableMgmt && (
            <div style={{ position:'absolute', top:'110%', left:0, background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:10, padding:10, zIndex:300, boxShadow:'0 8px 24px rgba(0,0,0,0.14)', minWidth:170 }}>
              {[
                ['Thêm hàng trên', () => tableAction('addRowAbove')],
                ['Thêm hàng dưới', () => tableAction('addRowBelow')],
                ['Xóa hàng', () => tableAction('deleteRow')],
                ['Thêm cột trái', () => tableAction('addColLeft')],
                ['Thêm cột phải', () => tableAction('addColRight')],
                ['Xóa cột', () => tableAction('deleteCol')],
                ['Xóa bảng', () => tableAction('deleteTable')],
              ].map(([lbl, fn]) => (
                <button key={lbl} type="button" onClick={() => { fn(); setShowTableMgmt(false); }}
                  style={{ display:'block', width:'100%', padding:'7px 10px', textAlign:'left', border:'none', background:'none', cursor:'pointer', fontSize:'0.86rem', color:'#374151', fontWeight:600, borderRadius:5 }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                >{lbl}</button>
              ))}
            </div>
          )}
        </div>
        <SEP />

        {TB(() => fileRef.current?.click(), uploading ? '⏳' : '🖼', 'Chèn ảnh', { background:'#f5f3ff', borderColor:'#7c3aed', color:'#6d28d9', opacity:uploading?0.6:1, cursor:uploading?'not-allowed':'pointer', fontSize:'1rem' })}
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleImageFile} />

        <div style={{ marginLeft:'auto' }}>
          {TB(
            showHtml ? () => { if (editorRef.current) editorRef.current.innerHTML = value || ''; setShowHtml(false); } : () => setShowHtml(true),
            showHtml ? '👁' : '</>',
            'Toggle HTML',
            showHtml ? { background:'#dcfce7', borderColor:'#16a34a', color:'#16a34a', fontSize:'1rem' } : { background:'#fef9c3', borderColor:'#ca8a04', color:'#854d0e', fontFamily:'monospace' },
          )}
        </div>
      </div>

      <div ref={editorRef} contentEditable={!showHtml} suppressContentEditableWarning onInput={notify} onClick={handleEditorClick} className="ge-content" style={{ display:showHtml?'none':'block' }} />

      {selImg && imgToolbar && (
        <div style={{ position:'absolute', top:imgToolbar.top, left:imgToolbar.left, zIndex:500, background:'#1e293b', borderRadius:8, padding:'5px 7px', display:'flex', gap:3, boxShadow:'0 4px 16px rgba(0,0,0,0.28)', flexWrap:'wrap', maxWidth:360, alignItems:'center' }}>
          <span style={{ color:'#94a3b8', fontSize:'0.7rem', marginRight:2 }}>Size:</span>
          {[['25%','XS'],['50%','S'],['75%','M'],['100%','L']].map(([sz,lb]) => (
            <button key={sz} type="button" onClick={() => applyImgStyle(sz, selImg.style.marginLeft==='auto'&&selImg.style.marginRight==='auto'?'center':selImg.style.marginLeft==='auto'?'right':'left')}
              style={{ padding:'2px 7px', border:'none', borderRadius:4, background:selImg.style.width===sz?'#3b82f6':'#334155', color:'#fff', cursor:'pointer', fontWeight:700, fontSize:'0.72rem' }}>{lb}</button>
          ))}
          <div style={{ width:1, height:16, background:'#475569', margin:'0 2px' }} />
          <span style={{ color:'#94a3b8', fontSize:'0.7rem', marginRight:2 }}>Căn:</span>
          {[['left','⬅'],['center','⊙'],['right','➡']].map(([al,ic]) => (
            <button key={al} type="button" onClick={() => applyImgStyle(selImg.style.width||'100%', al)}
              style={{ padding:'2px 7px', border:'none', borderRadius:4, background:'#334155', color:'#fff', cursor:'pointer', fontSize:'0.82rem' }}>{ic}</button>
          ))}
        </div>
      )}

      {showHtml && (
        <textarea value={value} onChange={(e) => { onChange(e.target.value); if (editorRef.current) editorRef.current.innerHTML = e.target.value; }}
          style={{ display:'block', width:'100%', boxSizing:'border-box', minHeight:240, padding:'14px 16px', border:'none', resize:'vertical', fontFamily:'monospace', fontSize:'0.9rem', outline:'none', color:'#1e293b', background:'#f8fafc' }} />
      )}

      {imgPending && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(15,23,42,0.55)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', borderRadius:16, padding:'24px', width:420, maxWidth:'90vw', boxShadow:'0 20px 60px rgba(0,0,0,0.28)' }}>
            <div style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:16, color:'#0f172a' }}>🖼 Chèn ảnh</div>
            <img src={imgPending} alt="" style={{ width:'100%', maxHeight:180, objectFit:'contain', borderRadius:8, border:'1px solid #e2e8f0', marginBottom:16, background:'#f8fafc' }} />
            <div style={{ marginBottom:14 }}>
              <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#334155', marginBottom:8 }}>Kích thước</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
                {[['25%','Nhỏ'],['50%','Vừa'],['75%','Lớn'],['100%','Full']].map(([sz,lb]) => (
                  <button key={sz} type="button" onClick={() => setImgSize(sz)}
                    style={{ padding:'8px 4px', border:`2px solid ${imgSize===sz?'#2563eb':'#e2e8f0'}`, borderRadius:8, background:imgSize===sz?'#eff6ff':'#fff', color:imgSize===sz?'#1d4ed8':'#64748b', cursor:'pointer', fontWeight:700, fontSize:'0.82rem', textAlign:'center' }}>
                    <div style={{ fontSize:'0.72rem', marginBottom:2 }}>{sz}</div><div>{lb}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#334155', marginBottom:8 }}>Căn lề</div>
              <div style={{ display:'flex', gap:8 }}>
                {[['left','⬅ Trái'],['center','⊙ Giữa'],['right','➡ Phải']].map(([al,lb]) => (
                  <button key={al} type="button" onClick={() => setImgAlign(al)}
                    style={{ flex:1, padding:'9px 4px', border:`2px solid ${imgAlign===al?'#2563eb':'#e2e8f0'}`, borderRadius:8, background:imgAlign===al?'#eff6ff':'#fff', color:imgAlign===al?'#1d4ed8':'#64748b', cursor:'pointer', fontWeight:700, fontSize:'0.88rem' }}>
                    {lb}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button type="button" onClick={() => setImgPending(null)} style={{ flex:1, padding:'11px', border:'1.5px solid #e2e8f0', borderRadius:10, background:'#fff', color:'#64748b', cursor:'pointer', fontWeight:700 }}>Hủy</button>
              <button type="button" onClick={insertPendingImg} style={{ flex:2, padding:'11px', border:'none', borderRadius:10, background:'#2563eb', color:'#fff', cursor:'pointer', fontWeight:800, fontSize:'0.98rem' }}>✅ Chèn ảnh</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RichTextEditor;