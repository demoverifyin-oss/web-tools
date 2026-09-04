(()=>{
'use strict';

if(window.__WEBTOOLS){
  window.__WEBTOOLS.remove();
  delete window.__WEBTOOLS;
  return;
}

const root=document.createElement('div');
window.__WEBTOOLS=root;

const esc=v=>String(v??'')
  .replace(/&/g,'&amp;')
  .replace(/</g,'&lt;')
  .replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;');

const Z=2147483647;

/* ---------- Minimal line-icon set (no emoji, single stroke, currentColor) ---------- */
const ic=(paths,size=18)=>`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const ICONS={
  brand:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
  search:'<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  close:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  overview:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  download:'<path d="M12 3v12"/><polyline points="7 10 12 15 17 10"/><path d="M5 21h14a2 2 0 0 0 2-2v-2"/><path d="M3 17v2a2 2 0 0 0 2 2"/>',
  pdf:'<path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 15h2a2 2 0 0 0 0-4H8v7"/><path d="M13 11v7h1a3.5 3.5 0 0 0 0-7z"/><line x1="19" y1="11" x2="16" y2="11"/><line x1="16" y1="11" x2="16" y2="18"/>',
  links:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  images:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  forms:'<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><polyline points="9 14 11 16 15 12"/>',
  headings:'<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
  inspector:'<circle cx="12" cy="12" r="9"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>',
  localStorage:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M20 12c0 1.66-3.58 3-8 3s-8-1.34-8-3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/>',
  sessionStorage:'<path d="M22 18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  performance:'<polyline points="22 12 18 12 15 20 9 4 6 12 2 12"/>',
  resources:'<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  cookies:'<path d="M12 22s7-3.5 7-9V6l-7-3-7 3v7c0 5.5 7 9 7 9z"/>',
  copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  source:'<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  scripts:'<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>'
};

const css=`
:root{
  --wt-panel:#101216f5;
  --wt-card:#171a1f;
  --wt-border:#252932;
  --wt-border-soft:#1c2028;
  --wt-text:#eef0f4;
  --wt-text-dim:#868f9f;
  --wt-accent:#6f93f2;
  --wt-accent-soft:#6f93f21c;
  --wt-radius:16px;
  --wt-safe-b:env(safe-area-inset-bottom,0px);
  --wt-syn-tag:#ff7b72;
  --wt-syn-attr:#d2a8ff;
  --wt-syn-string:#a5d6ff;
  --wt-syn-punct:#8b949e;
  --wt-syn-comment:#8b949e;
}

#wt-app{
  position:fixed;
  right:16px;
  bottom:calc(16px + var(--wt-safe-b));
  z-index:${Z};
  font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,ui-sans-serif,system-ui,"Segoe UI",sans-serif;
  color:var(--wt-text);
  -webkit-tap-highlight-color:transparent;
}

#wt-launch{
  display:flex;
  align-items:center;
  gap:8px;
  border:1px solid #ffffff14;
  background:linear-gradient(160deg,#181b21,#0c0e12);
  color:#fff;
  border-radius:999px;
  padding:12px 17px;
  font-size:13.5px;
  font-weight:600;
  letter-spacing:.01em;
  box-shadow:0 10px 28px #0009,inset 0 1px 0 #ffffff10;
  cursor:pointer;
  transition:transform .15s ease;
}
#wt-launch:active{transform:scale(.96)}
#wt-launch svg{opacity:.9}

#wt-panel{
  display:none;
  position:fixed;
  right:16px;
  bottom:calc(76px + var(--wt-safe-b));
  left:auto;
  width:380px;
  max-width:calc(100vw - 32px);
  max-height:74vh;
  overflow:hidden;
  background:var(--wt-panel);
  backdrop-filter:blur(22px) saturate(160%);
  -webkit-backdrop-filter:blur(22px) saturate(160%);
  border:1px solid var(--wt-border);
  border-radius:var(--wt-radius);
  box-shadow:0 25px 70px #000c,0 0 0 1px #ffffff08 inset;
  animation:wt-pop .18s cubic-bezier(.2,.9,.3,1.3);
}
@keyframes wt-pop{
  from{opacity:0;transform:translateY(8px) scale(.97)}
  to{opacity:1;transform:translateY(0) scale(1)}
}

#wt-head{
  padding:17px 17px 13px;
  border-bottom:1px solid var(--wt-border-soft);
  display:flex;
  align-items:center;
  justify-content:space-between;
}
#wt-title{
  font-size:15.5px;
  font-weight:700;
  display:flex;
  align-items:center;
  gap:8px;
}
#wt-title svg{color:var(--wt-accent)}
#wt-sub{
  color:var(--wt-text-dim);
  font-size:11px;
  margin-top:3px;
  font-weight:500;
}
#wt-close{
  background:#ffffff0d;
  color:#cfd4de;
  border:1px solid #ffffff14;
  width:29px;
  height:29px;
  border-radius:9px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  transition:background .15s;
}
#wt-close:active{background:#ffffff1f}

#wt-search-wrap{
  margin:13px;
  position:relative;
  display:flex;
  align-items:center;
}
#wt-search{
  width:100%;
  box-sizing:border-box;
  background:#0000003d;
  border:1px solid var(--wt-border);
  color:#fff;
  padding:10px 12px 10px 34px;
  border-radius:11px;
  outline:none;
  font-size:13.5px;
  transition:border-color .15s,background .15s;
}
#wt-search::placeholder{color:#6d7482}
#wt-search:focus{border-color:var(--wt-accent);background:#00000055}
#wt-search-ico{
  position:absolute;
  left:11px;
  color:var(--wt-text-dim);
  display:flex;
  pointer-events:none;
}

#wt-tools{
  padding:0 11px 13px;
  overflow:auto;
  max-height:52vh;
  display:grid;
  gap:5px;
}

.wt-tool{
  width:100%;
  text-align:left;
  display:flex;
  align-items:center;
  gap:12px;
  padding:10px 11px;
  background:#ffffff05;
  border:1px solid transparent;
  color:var(--wt-text);
  border-radius:12px;
  cursor:pointer;
  transition:.15s;
}
.wt-tool:hover{background:var(--wt-accent-soft);border-color:#6f93f230}
.wt-tool:active{transform:scale(.985)}
.wt-tool-ico{
  flex:0 0 auto;
  width:32px;
  height:32px;
  border-radius:9px;
  background:#ffffff08;
  border:1px solid var(--wt-border-soft);
  display:flex;
  align-items:center;
  justify-content:center;
  color:var(--wt-text-dim);
}
.wt-tool-body{min-width:0}
.wt-tool-title{
  font-size:13px;
  font-weight:600;
}
.wt-tool-desc{
  color:var(--wt-text-dim);
  font-size:11px;
  margin-top:2px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}

#wt-modal{
  position:fixed;
  inset:0;
  z-index:${Z};
  background:#050608cc;
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
  display:flex;
  align-items:flex-end;
  justify-content:center;
  animation:wt-fade .15s ease;
}
@keyframes wt-fade{from{opacity:0}to{opacity:1}}

#wt-box{
  width:min(880px,100%);
  max-height:88vh;
  overflow:hidden;
  background:var(--wt-panel);
  backdrop-filter:blur(24px) saturate(160%);
  -webkit-backdrop-filter:blur(24px) saturate(160%);
  border:1px solid var(--wt-border);
  border-radius:20px 20px 0 0;
  box-shadow:0 -20px 60px #000d;
  animation:wt-slide .2s cubic-bezier(.2,.9,.3,1.1);
  padding-bottom:var(--wt-safe-b);
}
@keyframes wt-slide{
  from{transform:translateY(24px);opacity:0}
  to{transform:translateY(0);opacity:1}
}

#wt-box-grip{
  width:34px;
  height:4px;
  background:#ffffff24;
  border-radius:99px;
  margin:9px auto 0;
}

#wt-box-head{
  padding:11px 17px 13px;
  border-bottom:1px solid var(--wt-border-soft);
  display:flex;
  justify-content:space-between;
  align-items:center;
}
#wt-box-title{
  font-size:14.5px;
  font-weight:700;
}
#wt-box-close{
  border:1px solid var(--wt-border);
  background:#ffffff0d;
  color:#e2e5eb;
  border-radius:9px;
  padding:6px 11px;
  cursor:pointer;
  font-size:12px;
  font-weight:600;
}
#wt-box-close:active{background:#ffffff1f}

#wt-content{
  padding:15px 17px 20px;
  overflow:auto;
  max-height:calc(88vh - 74px);
}

.wt-card{
  background:var(--wt-card);
  border:1px solid var(--wt-border-soft);
  border-radius:12px;
  padding:12px 13px;
  margin-bottom:8px;
}
.wt-label{
  color:var(--wt-text-dim);
  font-size:9.5px;
  text-transform:uppercase;
  letter-spacing:.07em;
  margin-bottom:5px;
  font-weight:700;
}
.wt-value{
  color:var(--wt-text);
  font-size:12.5px;
  line-height:1.5;
  word-break:break-word;
}
.wt-url{
  color:var(--wt-accent);
  text-decoration:none;
  word-break:break-all;
}
.wt-url:hover{text-decoration:underline}
.wt-copy{
  float:right;
  background:#ffffff0d;
  border:1px solid var(--wt-border);
  color:#dce1e8;
  border-radius:8px;
  padding:5px 10px;
  cursor:pointer;
  font-size:10.5px;
  font-weight:600;
  transition:background .15s;
}
.wt-copy:active{background:#ffffff1f}

.wt-stat-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:8px;
}
.wt-stat{
  background:var(--wt-card);
  border:1px solid var(--wt-border-soft);
  border-radius:12px;
  padding:13px;
}
.wt-stat-num{
  font-size:20px;
  font-weight:800;
  color:var(--wt-text);
}
.wt-stat-label{
  color:var(--wt-text-dim);
  font-size:10.5px;
  margin-top:3px;
  font-weight:600;
}

.wt-table{
  width:100%;
  border-collapse:collapse;
  font-size:11.5px;
}
.wt-table th,.wt-table td{
  border-bottom:1px solid var(--wt-border-soft);
  padding:8px 7px;
  text-align:left;
  vertical-align:top;
}
.wt-table th{
  color:var(--wt-text-dim);
  font-weight:700;
  font-size:10px;
  text-transform:uppercase;
  letter-spacing:.04em;
}
.wt-preview{
  width:100%;
  max-height:220px;
  object-fit:contain;
  background:#050608;
  border-radius:9px;
  margin-top:8px;
  border:1px solid var(--wt-border-soft);
}

.wt-empty{
  text-align:center;
  color:var(--wt-text-dim);
  font-size:12px;
  padding:24px 10px;
}

.wt-progress{
  height:6px;
  background:#ffffff0a;
  border:1px solid var(--wt-border-soft);
  border-radius:99px;
  overflow:hidden;
  margin-top:10px;
}
.wt-progress-bar{
  width:0%;
  height:100%;
  background:var(--wt-accent);
  transition:width .18s ease;
}
.wt-status{
  color:var(--wt-text-dim);
  font-size:11px;
  margin-top:8px;
}
.wt-note{
  color:var(--wt-text-dim);
  font-size:11px;
  line-height:1.55;
}

.wt-badge{
  display:inline-block;
  font-size:9px;
  font-weight:700;
  padding:2px 7px;
  border-radius:99px;
  background:#ffffff0d;
  border:1px solid var(--wt-border-soft);
  color:var(--wt-text-dim);
  margin-left:5px;
  text-transform:uppercase;
  letter-spacing:.03em;
  white-space:nowrap;
}
.wt-badge-accent{
  color:var(--wt-accent);
  border-color:#6f93f240;
  background:#6f93f214;
}
.wt-badge-warn{
  color:#f0b429;
  border-color:#f0b42940;
  background:#f0b42914;
}

.wt-code-wrap{
  position:relative;
  max-height:58vh;
  overflow:auto;
  background:#0a0c10;
  border:1px solid var(--wt-border-soft);
  border-radius:12px;
}
.wt-code-toolbar{
  position:sticky;
  top:0;
  z-index:2;
  display:flex;
  justify-content:flex-end;
  padding:8px 10px;
  background:#0a0c10ee;
  backdrop-filter:blur(6px);
  border-bottom:1px solid var(--wt-border-soft);
}
.wt-code-toolbar .wt-copy{float:none}
.wt-code{
  margin:0;
  padding:14px;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
  font-size:11.5px;
  line-height:1.65;
  color:#c9d1d9;
  white-space:pre;
}
.wt-c-tag{color:var(--wt-syn-tag)}
.wt-c-attr{color:var(--wt-syn-attr)}
.wt-c-string{color:var(--wt-syn-string)}
.wt-c-punct{color:var(--wt-syn-punct)}
.wt-c-comment{color:var(--wt-syn-comment);font-style:italic}

::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-thumb{background:#ffffff22;border-radius:99px}

@media(max-width:600px){
  #wt-app{right:12px}
  #wt-panel{
    right:11px;
    max-width:calc(100vw - 22px);
    width:calc(100vw - 22px);
  }
  #wt-box{border-radius:18px 18px 0 0}
}

@media print{
  #wt-app,
  #wt-modal{
    display:none!important;
  }
}
`;

const style=document.createElement('style');
style.id='wt-style';
style.textContent=css;
document.head.appendChild(style);

root.id='wt-app';

root.innerHTML=`
<button id="wt-launch">${ic(ICONS.brand,16)}Web Tools</button>

<div id="wt-panel">
  <div id="wt-head">
    <div>
      <div id="wt-title">${ic(ICONS.brand,15)}Web Tools</div>
      <div id="wt-sub">Browser inspection toolkit</div>
    </div>
    <button id="wt-close">${ic(ICONS.close,15)}</button>
  </div>

  <div id="wt-search-wrap">
    <span id="wt-search-ico">${ic(ICONS.search,15)}</span>
    <input id="wt-search" placeholder="Search tools...">
  </div>

  <div id="wt-tools"></div>
</div>
`;

document.body.appendChild(root);

const panel=root.querySelector('#wt-panel');
const tools=root.querySelector('#wt-tools');
const search=root.querySelector('#wt-search');

const modal=(title,html)=>{
  const old=document.getElementById('wt-modal');
  if(old)old.remove();

  const m=document.createElement('div');
  m.id='wt-modal';

  m.innerHTML=`
    <div id="wt-box">
      <div id="wt-box-grip"></div>
      <div id="wt-box-head">
        <div id="wt-box-title">${esc(title)}</div>
        <button id="wt-box-close">Close</button>
      </div>
      <div id="wt-content">${html}</div>
    </div>
  `;

  document.body.appendChild(m);

  m.querySelector('#wt-box-close').onclick=()=>m.remove();

  m.addEventListener('click',e=>{
    if(e.target===m)m.remove();
  });

  return m;
};

const setModalStatus=(m,status,progress)=>{
  if(!m)return;

  const statusEl=m.querySelector('[data-wt-status]');
  const bar=m.querySelector('[data-wt-progress]');

  if(statusEl)statusEl.textContent=status;
  if(bar&&typeof progress==='number'){
    bar.style.width=Math.max(0,Math.min(100,progress))+'%';
  }
};

const copy=async text=>{
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch{
    try{
      const ta=document.createElement('textarea');
      ta.value=text;
      ta.style.position='fixed';
      ta.style.opacity='0';
      document.body.appendChild(ta);
      ta.select();
      const ok=document.execCommand('copy');
      ta.remove();
      return ok;
    }catch{
      return false;
    }
  }
};

const urlHTML=url=>{
  const safe=esc(url);
  return `<a class="wt-url" href="${safe}" target="_blank" rel="noopener noreferrer">${safe}</a>`;
};

const addTool=(iconKey,title,description,fn)=>{
  const b=document.createElement('button');
  b.className='wt-tool';
  b.dataset.search=(title+' '+description).toLowerCase();
  b.innerHTML=`
    <div class="wt-tool-ico">${ic(ICONS[iconKey],17)}</div>
    <div class="wt-tool-body">
      <div class="wt-tool-title">${esc(title)}</div>
      <div class="wt-tool-desc">${esc(description)}</div>
    </div>
  `;
  b.onclick=fn;
  tools.appendChild(b);
};

const card=(label,value,copyValue)=>{
  return `
    <div class="wt-card">
      <div class="wt-label">${esc(label)}</div>
      <div class="wt-value">
        ${copyValue!==undefined
          ? `<button class="wt-copy" data-copy="${esc(copyValue)}">Copy</button>`
          : ''}
        ${value}
      </div>
    </div>
  `;
};

const empty=text=>`<div class="wt-empty">${esc(text)}</div>`;

const bindCopies=()=>{
  document.querySelectorAll('#wt-content .wt-copy').forEach(b=>{
    b.onclick=async()=>{
      const ok=await copy(b.dataset.copy);
      b.textContent=ok?'Copied':'Failed';
      setTimeout(()=>b.textContent=b.dataset.copy&&b.closest('.wt-code-toolbar')?'Copy HTML':'Copy',1200);
    };
  });
};

/* =========================================================
   LIGHTWEIGHT HTML SYNTAX HIGHLIGHTER
   (regex-based tokenizer, no external library, output is
   fully escaped before being wrapped in color spans)
   ========================================================= */

const highlightAttrs=attrsPart=>{
  let out='';
  let last=0;
  const attrRe=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g;
  let am;

  while((am=attrRe.exec(attrsPart))){
    out+=esc(attrsPart.slice(last,am.index));
    out+=`<span class="wt-c-attr">${esc(am[1])}</span>`;

    if(am[3]!==undefined){
      out+=`<span class="wt-c-punct">=</span><span class="wt-c-string">${esc(am[3])}</span>`;
    }

    last=attrRe.lastIndex;
  }

  out+=esc(attrsPart.slice(last));
  return out;
};

const highlightTag=tag=>{
  const isClose=tag.startsWith('</');
  const open=isClose?'</':'<';
  const selfClose=tag.endsWith('/>');
  const closer=selfClose?'/>':'>';
  const inner=tag.slice(open.length,tag.length-closer.length);
  const nameMatch=inner.match(/^[a-zA-Z][a-zA-Z0-9:-]*/);
  const name=nameMatch?nameMatch[0]:'';
  const attrsPart=inner.slice(name.length);

  return `<span class="wt-c-punct">${esc(open)}</span>`+
    `<span class="wt-c-tag">${esc(name)}</span>`+
    highlightAttrs(attrsPart)+
    `<span class="wt-c-punct">${esc(closer)}</span>`;
};

const highlightHTML=html=>{
  const re=/<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>/g;
  let out='';
  let last=0;
  let m;

  while((m=re.exec(html))){
    out+=esc(html.slice(last,m.index));
    const tok=m[0];

    out+=tok.startsWith('<!--')
      ?`<span class="wt-c-comment">${esc(tok)}</span>`
      :highlightTag(tok);

    last=re.lastIndex;
  }

  out+=esc(html.slice(last));
  return out;
};

/* =========================================================
   PAGE OVERVIEW
   ========================================================= */

addTool(
  'overview','Page Overview',
  'Title, URL, domain and document statistics',
  ()=>{
    const rows=[
      ['Title',esc(document.title)],
      ['URL',urlHTML(location.href)],
      ['Domain',esc(location.hostname)],
      ['Protocol',esc(location.protocol)],
      ['Path',esc(location.pathname)],
      ['Referrer',esc(document.referrer||'(none)')]
    ];

    modal(
      'Page Overview',
      `<div class="wt-stat-grid">
        <div class="wt-stat"><div class="wt-stat-num">${document.links.length}</div><div class="wt-stat-label">Links</div></div>
        <div class="wt-stat"><div class="wt-stat-num">${document.images.length}</div><div class="wt-stat-label">Images</div></div>
        <div class="wt-stat"><div class="wt-stat-num">${document.forms.length}</div><div class="wt-stat-label">Forms</div></div>
        <div class="wt-stat"><div class="wt-stat-num">${document.scripts.length}</div><div class="wt-stat-label">Scripts</div></div>
      </div>
      <br>
      ${rows.map(x=>card(x[0],x[1],x[1])).join('')}`
    );

    bindCopies();
  }
);

/* =========================================================
   FRONTEND ZIP EXPORT
   ========================================================= */

const loadScriptOnce=(src)=>{
  return new Promise((resolve,reject)=>{
    const existing=[...document.scripts].find(s=>s.src===src);

    if(existing){
      if(window.JSZip){
        resolve(window.JSZip);
        return;
      }

      existing.addEventListener('load',()=>resolve(window.JSZip),{once:true});
      existing.addEventListener('error',()=>reject(new Error('ZIP library could not be loaded.')),{once:true});
      return;
    }

    const s=document.createElement('script');
    s.src=src;
    s.async=true;
    s.onload=()=>{
      if(window.JSZip)resolve(window.JSZip);
      else reject(new Error('ZIP library loaded but was unavailable.'));
    };
    s.onerror=()=>reject(new Error('ZIP library could not be loaded.'));
    document.head.appendChild(s);
  });
};

/*
 * Native ZIP fallback.
 *
 * This writes a valid ZIP using stored (uncompressed) entries.
 * That keeps the exporter independent from third-party libraries if
 * a site blocks dynamic script loading through CSP.
 */
const crcTable=(()=>{
  const table=new Uint32Array(256);

  for(let n=0;n<256;n++){
    let c=n;

    for(let k=0;k<8;k++){
      c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);
    }

    table[n]=c>>>0;
  }

  return table;
})();

const crc32=data=>{
  let c=0xffffffff;

  for(let i=0;i<data.length;i++){
    c=crcTable[(c^data[i])&0xff]^(c>>>8);
  }

  return (c^0xffffffff)>>>0;
};

const u16=(n)=>{
  const a=new Uint8Array(2);
  const v=new DataView(a.buffer);
  v.setUint16(0,n,true);
  return a;
};

const u32=(n)=>{
  const a=new Uint8Array(4);
  const v=new DataView(a.buffer);
  v.setUint32(0,n>>>0,true);
  return a;
};

const concatBytes=parts=>{
  let total=0;

  for(const p of parts)total+=p.length;

  const out=new Uint8Array(total);
  let offset=0;

  for(const p of parts){
    out.set(p,offset);
    offset+=p.length;
  }

  return out;
};

const makeStoredZip=entries=>{
  const enc=new TextEncoder();
  const local=[];
  const central=[];
  let offset=0;

  for(const entry of entries){
    const nameBytes=enc.encode(entry.name);
    const data=entry.data instanceof Uint8Array
      ?entry.data
      :new Uint8Array(entry.data);

    const crc=crc32(data);

    const localHeader=concatBytes([
      u32(0x04034b50),
      u16(20),
      u16(0x0800),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(nameBytes.length),
      u16(0),
      nameBytes
    ]);

    local.push(localHeader,data);

    const centralHeader=concatBytes([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0x0800),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(nameBytes.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      nameBytes
    ]);

    central.push(centralHeader);

    offset+=localHeader.length+data.length;
  }

  const centralBytes=concatBytes(central);
  const localBytes=concatBytes(local);

  const end=concatBytes([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(entries.length),
    u16(entries.length),
    u32(centralBytes.length),
    u32(localBytes.length),
    u16(0)
  ]);

  return new Blob([localBytes,centralBytes,end],{type:'application/zip'});
};

const safeFileName=name=>{
  return String(name||'file')
    .replace(/[<>:"/\\|?*\x00-\x1f]/g,'-')
    .replace(/\s+/g,' ')
    .trim()
    .slice(0,180)||'file';
};

const resourceName=(url,fallback='resource')=>{
  try{
    const u=new URL(url,location.href);
    let name=decodeURIComponent(u.pathname.split('/').pop()||fallback);
    name=name.replace(/[?#].*$/,'');

    if(!name||name==='.'||name==='..')name=fallback;

    return safeFileName(name);
  }catch{
    return safeFileName(fallback);
  }
};

const uniquePath=(path,used)=>{
  if(!used.has(path)){
    used.add(path);
    return path;
  }

  const dot=path.lastIndexOf('.');
  const base=dot>0?path.slice(0,dot):path;
  const ext=dot>0?path.slice(dot):'';

  let i=2;

  while(used.has(`${base}-${i}${ext}`))i++;

  path=`${base}-${i}${ext}`;
  used.add(path);

  return path;
};

const isFetchableURL=url=>{
  try{
    const u=new URL(url,location.href);

    if(!/^https?:$/i.test(u.protocol)){
      return false;
    }

    return true;
  }catch{
    return false;
  }
};

const fetchResource=async(url,timeout=12000)=>{
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeout);

  try{
    const response=await fetch(url,{
      method:'GET',
      credentials:'same-origin',
      cache:'default',
      signal:controller.signal
    });

    if(!response.ok){
      throw new Error(`HTTP ${response.status}`);
    }

    if(response.type==='opaque'){
      throw new Error('Opaque response');
    }

    return {
      url:response.url||url,
      contentType:response.headers.get('content-type')||'',
      buffer:await response.arrayBuffer()
    };
  }finally{
    clearTimeout(timer);
  }
};

const collectFrontendResources=()=>{
  const list=[];
  const seen=new Set();

  const add=(url,type,element)=>{
    if(!url)return;

    try{
      const u=new URL(url,location.href);

      if(!/^https?:$/i.test(u.protocol))return;

      const key=u.href;

      if(seen.has(key))return;

      seen.add(key);

      list.push({url:key,type,element});
    }catch{}
  };

  document.querySelectorAll('link[href]').forEach(el=>{
    const rel=(el.getAttribute('rel')||'').toLowerCase();

    if(
      rel.includes('stylesheet')||
      rel.includes('icon')||
      rel.includes('manifest')||
      rel.includes('preload')||
      rel.includes('modulepreload')
    ){
      add(el.href,rel.includes('stylesheet')?'css':'asset',el);
    }
  });

  document.querySelectorAll('script[src]').forEach(el=>{
    add(el.src,'js',el);
  });

  document.querySelectorAll('img[src],source[src],video[src],audio[src],iframe[src]').forEach(el=>{
    add(el.src,'asset',el);
  });

  document.querySelectorAll('[srcset]').forEach(el=>{
    const value=el.getAttribute('srcset')||'';

    value.split(',').forEach(part=>{
      const candidate=part.trim().split(/\s+/)[0];
      if(candidate)add(candidate,'asset',el);
    });
  });

  document.querySelectorAll('[poster]').forEach(el=>{
    add(el.getAttribute('poster'),'asset',el);
  });

  document.querySelectorAll('link[href]').forEach(el=>{
    const href=el.href;

    if(href){
      const lower=href.toLowerCase();

      if(/\.(woff2?|ttf|otf|eot|svg|png|jpe?g|gif|webp|avif|ico|mp4|webm|mp3|wav)(\?|#|$)/i.test(lower)){
        add(href,'asset',el);
      }
    }
  });

  try{
    performance.getEntriesByType('resource').forEach(entry=>{
      const name=entry&&entry.name;

      if(!name)return;

      const type=entry.initiatorType==='script'
        ?'js'
        :entry.initiatorType==='css'
          ?'css'
          :'asset';

      add(name,type,null);
    });
  }catch{}

  return list;
};

const sanitizeExportDocument=()=>{
  const clone=document.documentElement.cloneNode(true);

  clone.querySelectorAll('#wt-app,#wt-modal,#wt-style').forEach(el=>el.remove());

  clone.querySelectorAll('input,textarea,select').forEach(el=>{
    try{
      if(el.tagName==='INPUT'){
        const type=(el.getAttribute('type')||'').toLowerCase();

        if(type==='checkbox'||type==='radio'){
          el.removeAttribute('checked');
        }else{
          el.removeAttribute('value');
        }
      }else if(el.tagName==='TEXTAREA'){
        el.textContent='';
      }else if(el.tagName==='SELECT'){
        el.querySelectorAll('option').forEach(option=>{
          option.removeAttribute('selected');
        });
      }
    }catch{}
  });

  return clone;
};

const pathForResource=(resource,used)=>{
  const name=resourceName(resource.url,'resource');
  let folder='assets';

  if(resource.type==='css')folder='css';
  if(resource.type==='js')folder='js';

  return uniquePath(`${folder}/${name}`,used);
};

const rewriteHTMLResourceReferences=(doc,mapping)=>{
  const rewrite=url=>{
    try{
      const absolute=new URL(url,location.href).href;
      return mapping.get(absolute)||url;
    }catch{
      return url;
    }
  };

  doc.querySelectorAll('link[href]').forEach(el=>{
    const original=el.getAttribute('href');
    if(!original)return;
    const replaced=rewrite(original);
    if(replaced!==original)el.setAttribute('href',replaced);
  });

  doc.querySelectorAll('script[src]').forEach(el=>{
    const original=el.getAttribute('src');
    if(!original)return;
    const replaced=rewrite(original);
    if(replaced!==original)el.setAttribute('src',replaced);
  });

  doc.querySelectorAll('img[src],source[src],video[src],audio[src],iframe[src]').forEach(el=>{
    const original=el.getAttribute('src');
    if(!original)return;
    const replaced=rewrite(original);
    if(replaced!==original)el.setAttribute('src',replaced);
  });

  doc.querySelectorAll('[poster]').forEach(el=>{
    const original=el.getAttribute('poster');
    if(!original)return;
    const replaced=rewrite(original);
    if(replaced!==original)el.setAttribute('poster',replaced);
  });

  doc.querySelectorAll('[srcset]').forEach(el=>{
    const original=el.getAttribute('srcset')||'';

    const replaced=original.split(',').map(part=>{
      const bits=part.trim().split(/\s+/);
      if(!bits[0])return part;
      bits[0]=rewrite(bits[0]);
      return bits.join(' ');
    }).join(', ');

    el.setAttribute('srcset',replaced);
  });
};

const rewriteCSSReferences=(cssText,cssURL,mapping)=>{
  return cssText.replace(
    /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
    (full,quote,value)=>{
      const raw=value.trim();

      if(!raw||raw.startsWith('data:')||raw.startsWith('#')||raw.startsWith('blob:')){
        return full;
      }

      try{
        const absolute=new URL(raw,cssURL).href;
        const mapped=mapping.get(absolute);
        if(mapped)return `url("${mapped}")`;
      }catch{}

      return full;
    }
  );
};

const makeTextBytes=text=>new TextEncoder().encode(text);

const downloadBlob=(blob,name)=>{
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');

  a.href=url;
  a.download=name;
  a.rel='noopener';
  a.style.display='none';

  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(()=>URL.revokeObjectURL(url),30000);
};

const createZipWithJSZip=async(JSZip,entries)=>{
  const zip=new JSZip();

  for(const entry of entries){
    zip.file(entry.name,entry.data);
  }

  return zip.generateAsync({
    type:'blob',
    compression:'DEFLATE',
    compressionOptions:{level:6}
  });
};

const exportFrontendZIP=async()=>{
  const filename=`${safeFileName(location.hostname||'page')}-frontend.zip`;

  const progressModal=modal(
    'Download Frontend ZIP',
    `<div class="wt-card">
      <div class="wt-label">Status</div>
      <div class="wt-value" data-wt-status>Preparing frontend...</div>
      <div class="wt-progress">
        <div class="wt-progress-bar" data-wt-progress></div>
      </div>
      <div class="wt-status">
        The export contains the currently loaded frontend and browser-accessible resources.
      </div>
    </div>`
  );

  let skipped=0;
  let completed=0;

  try{
    const used=new Set();
    const mapping=new Map();
    const resourceResults=[];

    setModalStatus(progressModal,'Preparing frontend...',5);

    const exportDocument=sanitizeExportDocument();

    setModalStatus(progressModal,'Collecting resources...',12);

    const resources=collectFrontendResources();

    for(let i=0;i<resources.length;i++){
      const resource=resources[i];

      try{
        if(!isFetchableURL(resource.url)){
          skipped++;
          continue;
        }

        const resourceURL=new URL(resource.url);

        if(resourceURL.origin!==location.origin){
          skipped++;
          continue;
        }

        const path=pathForResource(resource,used);
        resourceResults.push({resource,path});
        mapping.set(resourceURL.href,path);
      }catch{
        skipped++;
      }
    }

    const entries=[];

    for(const item of resourceResults){
      const resource=item.resource;

      try{
        const fetched=await fetchResource(resource.url);
        let data=new Uint8Array(fetched.buffer);

        if(resource.type==='css'){
          const text=new TextDecoder().decode(data);
          const rewritten=rewriteCSSReferences(text,resource.url,mapping);
          data=makeTextBytes(rewritten);
        }

        entries.push({name:item.path,data});
      }catch{
        skipped++;
      }

      completed++;

      const progress=15+Math.round((completed/Math.max(resourceResults.length,1))*55);

      setModalStatus(
        progressModal,
        `Collecting resources... ${completed}/${resourceResults.length}`,
        progress
      );
    }

    setModalStatus(progressModal,'Building ZIP...',75);

    rewriteHTMLResourceReferences(exportDocument,mapping);

    const html='<!DOCTYPE html>\n'+exportDocument.outerHTML;

    entries.unshift({name:'index.html',data:makeTextBytes(html)});

    let zipBlob;

    try{
      let JSZip=window.JSZip;

      if(!JSZip){
        try{
          JSZip=await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
        }catch{
          JSZip=null;
        }
      }

      zipBlob=JSZip
        ?await createZipWithJSZip(JSZip,entries)
        :makeStoredZip(entries);
    }catch{
      zipBlob=makeStoredZip(entries);
    }

    setModalStatus(progressModal,'Downloading...',95);

    downloadBlob(zipBlob,filename);

    setModalStatus(
      progressModal,
      skipped
        ? `Export completed with ${skipped} inaccessible resources skipped.`
        : 'Export completed successfully.',
      100
    );

    const content=progressModal.querySelector('#wt-content');

    if(content){
      content.insertAdjacentHTML(
        'beforeend',
        `<div class="wt-card">
          <div class="wt-label">Exported</div>
          <div class="wt-value">${esc(filename)}</div>
        </div>
        <div class="wt-card">
          <div class="wt-label">Privacy</div>
          <div class="wt-note">
            Cookies, localStorage, sessionStorage, authorization headers,
            browser credentials and live form values were not included.
            Backend/server-side source is not accessible through this export.
          </div>
        </div>`
      );
    }
  }catch(e){
    const message=e&&e.message?e.message:'The frontend export could not be completed.';
    const content=progressModal.querySelector('#wt-content');

    if(content){
      content.innerHTML=`
        <div class="wt-card">
          <div class="wt-label">Export failed</div>
          <div class="wt-value">${esc(message)}</div>
        </div>
        <div class="wt-card">
          <div class="wt-note">
            The page itself was not modified. Browser security restrictions
            can prevent individual resources from being retrieved.
          </div>
        </div>
      `;
    }
  }
};

addTool(
  'download','Download Frontend ZIP',
  'Export the loaded frontend HTML, CSS, JS and accessible assets',
  ()=>{
    exportFrontendZIP();
  }
);

/* =========================================================
   PAGE PDF
   ========================================================= */

const downloadPagePDF=()=>{
  try{
    panel.style.display='none';

    const currentModal=document.getElementById('wt-modal');
    if(currentModal)currentModal.remove();

    /*
     * The @media print rule in the main stylesheet already hides
     * #wt-app and #wt-modal from the printed/PDF output, so no
     * extra DOM manipulation is needed here — and nothing needs
     * to be manually restored afterwards.
     */
    window.print();
  }catch{
    modal(
      'Download Page as PDF',
      `<div class="wt-card">
        <div class="wt-label">Print unavailable</div>
        <div class="wt-value">
          This browser did not allow the print-to-PDF flow to start.
        </div>
      </div>`
    );
  }
};

addTool(
  'pdf','Download Page as PDF',
  'Save the current rendered page as a PDF',
  ()=>{
    downloadPagePDF();
  }
);

/* =========================================================
   DOM INSPECTOR
   ========================================================= */

addTool(
  'inspector','DOM Inspector',
  'Tap an element to inspect basic DOM information',
  ()=>{
    let active=true;

    const oldStyle=document.getElementById('wt-inspector-style');
    if(oldStyle)oldStyle.remove();

    const st=document.createElement('style');
    st.id='wt-inspector-style';
    st.textContent='[data-wt-highlight]{outline:3px solid #6f93f2!important;outline-offset:2px!important;cursor:crosshair!important}';
    document.head.appendChild(st);

    const over=e=>{
      if(!active||root.contains(e.target)||e.target.closest('#wt-modal'))return;
      try{e.target.setAttribute('data-wt-highlight','');}catch{}
    };

    const out=e=>{
      try{e.target.removeAttribute('data-wt-highlight');}catch{}
    };

    const click=e=>{
      if(!active||root.contains(e.target)||e.target.closest('#wt-modal'))return;

      e.preventDefault();
      e.stopPropagation();

      const el=e.target;

      modal(
        'Element',
        card('Tag',esc(el.tagName))+
        card('ID',esc(el.id||'(none)'))+
        card('Classes',esc(typeof el.className==='string'?el.className:'(none)'))+
        card('Text',esc((el.innerText||'').trim().slice(0,2000)))
      );

      bindCopies();
    };

    document.addEventListener('mouseover',over,true);
    document.addEventListener('mouseout',out,true);
    document.addEventListener('click',click,true);

    alert('Inspector enabled for 30 seconds. Tap an element.');

    setTimeout(()=>{
      active=false;

      document.removeEventListener('mouseover',over,true);
      document.removeEventListener('mouseout',out,true);
      document.removeEventListener('click',click,true);

      try{
        document.querySelectorAll('[data-wt-highlight]').forEach(el=>{
          el.removeAttribute('data-wt-highlight');
        });
      }catch{}

      st.remove();
    },30000);
  }
);

/* =========================================================
   PAGE SOURCE — sticky copy toolbar + color-coded HTML
   ========================================================= */

addTool(
  'source','Page Source',
  'Open the current document HTML in a readable, color-coded viewer',
  ()=>{
    const raw=document.documentElement.outerHTML;

    modal(
      'Document HTML',
      `<div class="wt-code-wrap">
        <div class="wt-code-toolbar">
          <button class="wt-copy" data-copy="${esc(raw)}">Copy HTML</button>
        </div>
        <pre class="wt-code"><code>${highlightHTML(raw)}</code></pre>
      </div>`
    );

    bindCopies();
  }
);

/* =========================================================
   COPY PAGE TEXT
   ========================================================= */

addTool(
  'copy','Copy Page Text',
  'Copy visible page text to clipboard',
  async()=>{
    const ok=await copy(document.body.innerText||'');
    alert(ok?'Visible page text copied.':'Clipboard permission denied.');
  }
);

/* =========================================================
   LINKS — now shows internal/external + new-tab badges
   ========================================================= */

addTool(
  'links','Links',
  'List all links, and mark internal vs external destinations',
  ()=>{
    const data=[...document.links];

    modal(
      'Links',
      data.length
      ? `<table class="wt-table">
          <tr><th>#</th><th>Text</th><th>Destination</th><th>Type</th></tr>
          ${data.map((a,i)=>{
            let internal=true;
            try{internal=new URL(a.href).origin===location.origin;}catch{}

            const badge=internal
              ?'<span class="wt-badge">Internal</span>'
              :'<span class="wt-badge wt-badge-accent">External</span>';

            const newTab=a.target==='_blank'
              ?'<span class="wt-badge">New tab</span>'
              :'';

            return `
            <tr>
              <td>${i+1}</td>
              <td>${esc(a.innerText.trim()||'(no text)')}</td>
              <td>${urlHTML(a.href)}</td>
              <td>${badge}${newTab}</td>
            </tr>`;
          }).join('')}
        </table>`
      : empty('No links found.')
    );
  }
);

/* =========================================================
   IMAGES — now flags missing alt text
   ========================================================= */

addTool(
  'images','Images',
  'View images with source URLs and accessibility alt text',
  ()=>{
    const data=[...document.images];

    modal(
      'Images',
      data.length
      ? data.map((img,i)=>{
        const alt=img.getAttribute('alt');
        const altHTML=alt
          ?`<div class="wt-value">${esc(alt)}</div>`
          :'<span class="wt-badge wt-badge-warn">Missing alt text</span>';

        return `
        <div class="wt-card">
          <div class="wt-label">Image ${i+1}</div>
          <div class="wt-value">${urlHTML(img.src)}</div>
          <img class="wt-preview" src="${esc(img.src)}" loading="lazy">
          <div class="wt-label" style="margin-top:8px">Dimensions</div>
          <div class="wt-value">${img.naturalWidth||'?'} × ${img.naturalHeight||'?'}</div>
          <div class="wt-label" style="margin-top:8px">Alt Text</div>
          ${altHTML}
        </div>
      `;}).join('')
      : empty('No images found.')
    );
  }
);

/* =========================================================
   FORMS — now shows required-field counts
   ========================================================= */

addTool(
  'forms','Forms',
  'Inspect forms, actions, methods and field details',
  ()=>{
    const data=[...document.forms];

    modal(
      'Forms',
      data.length
      ? data.map((f,i)=>{
        const required=[...f.elements].filter(e=>e.required).length;

        return `
        <div class="wt-card">
          <div class="wt-label">Form ${i+1}</div>
          <div class="wt-value">
            <strong>Action:</strong> ${urlHTML(f.action)}<br>
            <strong>Method:</strong> ${esc(f.method||'get')}<br>
            <strong>Fields:</strong> ${f.elements.length}
            ${required?`<span class="wt-badge wt-badge-accent">${required} required</span>`:''}
          </div>
          <br>
          <table class="wt-table">
            <tr><th>Name</th><th>Type</th><th>Tag</th></tr>
            ${[...f.elements].map(e=>`
              <tr>
                <td>${esc(e.name||'(none)')}${e.required?' <span class="wt-badge wt-badge-warn">Required</span>':''}</td>
                <td>${esc(e.type||'(none)')}</td>
                <td>${esc(e.tagName)}</td>
              </tr>`).join('')}
          </table>
        </div>
      `;}).join('')
      : empty('No forms found.')
    );
  }
);

/* =========================================================
   HEADINGS
   ========================================================= */

addTool(
  'headings','Headings',
  'View document heading structure',
  ()=>{
    const data=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];

    modal(
      'Headings',
      data.length
      ? data.map((h,i)=>`
        <div class="wt-card">
          <div class="wt-label">${h.tagName} — ${i+1}</div>
          <div class="wt-value">${esc(h.innerText.trim())}</div>
        </div>
      `).join('')
      : empty('No headings found.')
    );
  }
);

/* =========================================================
   SCRIPTS
   ========================================================= */

addTool(
  'scripts','Scripts',
  'List JavaScript files used by the page',
  ()=>{
    const data=[...document.scripts];

    modal(
      'Scripts',
      data.length
      ? data.map((s,i)=>`
        <div class="wt-card">
          <div class="wt-label">Script ${i+1}</div>
          <div class="wt-value">
            ${s.src?urlHTML(s.src):'(inline script)'}
          </div>
        </div>
      `).join('')
      : empty('No scripts found.')
    );
  }
);

/* =========================================================
   RESOURCES
   ========================================================= */

addTool(
  'resources','Resources',
  'Inspect resources loaded by the current page',
  ()=>{
    const data=performance.getEntriesByType('resource');

    modal(
      'Resources',
      data.length
      ? `<table class="wt-table">
          <tr><th>#</th><th>Type</th><th>Duration</th><th>Resource</th></tr>
          ${data.map((x,i)=>`
            <tr>
              <td>${i+1}</td>
              <td>${esc(x.initiatorType||'unknown')}</td>
              <td>${x.duration.toFixed(1)} ms</td>
              <td>${urlHTML(x.name)}</td>
            </tr>`).join('')}
        </table>`
      : empty('No resource entries available.')
    );
  }
);

/* =========================================================
   PERFORMANCE
   ========================================================= */

addTool(
  'performance','Performance',
  'Navigation timing and page load metrics',
  ()=>{
    const p=performance.getEntriesByType('navigation')[0];

    if(!p){
      modal('Performance',empty('Navigation timing unavailable.'));
      return;
    }

    modal(
      'Performance',
      `<div class="wt-stat-grid">
        <div class="wt-stat"><div class="wt-stat-num">${p.domainLookupEnd-p.domainLookupStart|0}<span style="font-size:11px"> ms</span></div><div class="wt-stat-label">DNS</div></div>
        <div class="wt-stat"><div class="wt-stat-num">${p.responseEnd-p.responseStart|0}<span style="font-size:11px"> ms</span></div><div class="wt-stat-label">Response</div></div>
        <div class="wt-stat"><div class="wt-stat-num">${p.domInteractive|0}<span style="font-size:11px"> ms</span></div><div class="wt-stat-label">DOM Interactive</div></div>
        <div class="wt-stat"><div class="wt-stat-num">${p.domComplete|0}<span style="font-size:11px"> ms</span></div><div class="wt-stat-label">DOM Complete</div></div>
      </div>`
    );
  }
);

/* =========================================================
   LOCAL STORAGE
   ========================================================= */

const storageViewer=(name,store)=>{
  let rows=[];

  try{
    for(let i=0;i<store.length;i++){
      const key=store.key(i);
      rows.push([key,store.getItem(key)]);
    }
  }catch(e){
    modal(name,`<div class="wt-card">${esc(e.message)}</div>`);
    return;
  }

  modal(
    name,
    rows.length
    ? rows.map(r=>`
      <div class="wt-card">
        <button class="wt-copy" data-copy="${esc(r[1])}">Copy</button>
        <div class="wt-label">${esc(r[0])}</div>
        <div class="wt-value">${esc(r[1])}</div>
      </div>
    `).join('')
    : empty('Storage is empty.')
  );

  bindCopies();
};

addTool(
  'localStorage','Local Storage',
  'View current site localStorage keys and values',
  ()=>storageViewer('Local Storage',localStorage)
);

/* =========================================================
   SESSION STORAGE
   ========================================================= */

addTool(
  'sessionStorage','Session Storage',
  'View current site sessionStorage keys and values',
  ()=>storageViewer('Session Storage',sessionStorage)
);

/* =========================================================
   COOKIES
   ========================================================= */

addTool(
  'cookies','Cookies',
  'Show cookie access status without exposing cookie values',
  ()=>{
    modal(
      'Cookies',
      card('Browser Cookie Support',navigator.cookieEnabled?'Enabled':'Disabled')+
      `<div class="wt-card">
        <div class="wt-label">Security</div>
        <div class="wt-value">Cookie values are intentionally not displayed.</div>
      </div>`
    );
  }
);

/* =========================================================
   SEARCH
   ========================================================= */

search.oninput=()=>{
  const q=search.value.toLowerCase().trim();

  tools.querySelectorAll('.wt-tool').forEach(b=>{
    b.style.display=!q||b.dataset.search.includes(q)?'flex':'none';
  });
};

/* =========================================================
   LAUNCHER / CLOSE
   ========================================================= */

root.querySelector('#wt-launch').onclick=()=>{
  panel.style.display=
    panel.style.display==='none'||!panel.style.display
      ?'block'
      :'none';
};

root.querySelector('#wt-close').onclick=()=>{
  panel.style.display='none';
};

/*
 * Clicking anywhere on the underlying page (outside the panel and
 * outside any open modal) closes the panel automatically, so the
 * floating tool never traps interaction with the site itself.
 */
document.addEventListener('click',e=>{
  if(panel.style.display!=='block')return;
  if(root.contains(e.target))return;
  if(e.target.closest && e.target.closest('#wt-modal'))return;
  panel.style.display='none';
},true);

document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;

  const openModal=document.getElementById('wt-modal');

  if(openModal){
    openModal.remove();
    return;
  }

  if(panel.style.display==='block'){
    panel.style.display='none';
  }
},true);

})();
