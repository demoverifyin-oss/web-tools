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

/* ---------- clean line-icon set (no emoji) ---------- */
const ic={
  bolt:'<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>',
  doc:'<path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5"/>',
  link:'<path d="M9 15 15 9"/><path d="M7 12 4.5 14.5a3.5 3.5 0 0 0 5 5L12 17"/><path d="M17 12l2.5-2.5a3.5 3.5 0 0 0-5-5L12 7"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 15l-5-5-4 4-3-3-5 5"/>',
  form:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  heading:'<path d="M6 4v16M18 4v16M6 12h12"/>',
  target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
  disk:'<path d="M4 4h13l3 3v13H4z"/><path d="M8 4v6h8V4M8 15h8"/>',
  folder:'<path d="M3 6h6l2 2h10v11H3z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  box:'<path d="M12 3 3 8v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  cookie:'<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1"/><circle cx="14" cy="9" r="1"/><circle cx="13" cy="14" r="1"/>',
  copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  code:'<path d="M9 6 3 12l6 6M15 6l6 6-6 6"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  close:'<path d="M6 6l12 12M18 6 6 18"/>',
  zip:'<path d="M4 3h16v4H4z"/><path d="M4 7h16v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M10 7v2M14 7v2M10 11v2M14 11v2M10 15v2M14 15v2"/>',
  pdf:'<path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5"/><path d="M12 11v6M9 15l3 3 3-3"/>'
};
const svg=(name,size=17)=>`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ic[name]}</svg>`;

const css=`
:root{
  --wt-bg:#0b0c0f;
  --wt-panel:#111318f5;
  --wt-card:#181b21;
  --wt-border:#262a32;
  --wt-border-soft:#1e2229;
  --wt-text:#f2f4f8;
  --wt-text-dim:#8b93a3;
  --wt-accent:#6e8fef;
  --wt-accent-soft:#6e8fef1f;
  --wt-radius:16px;
}

#wt-app{
  position:fixed;
  right:16px;
  bottom:16px;
  z-index:${Z};
  font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,ui-sans-serif,system-ui,"Segoe UI",sans-serif;
  color:var(--wt-text);
  -webkit-tap-highlight-color:transparent;
  max-width:calc(100vw - 32px);
}

#wt-launch{
  display:flex;
  align-items:center;
  gap:8px;
  border:1px solid #ffffff14;
  background:linear-gradient(160deg,#1a1d24,#0e1015);
  color:#fff;
  border-radius:999px;
  padding:12px 18px;
  font-size:13.5px;
  font-weight:600;
  letter-spacing:.01em;
  box-shadow:0 10px 30px #0009,inset 0 1px 0 #ffffff12;
  cursor:pointer;
  transition:transform .15s ease;
}
#wt-launch:active{transform:scale(.96)}
#wt-launch svg{flex:0 0 auto}

#wt-panel{
  display:none;
  position:fixed;
  right:16px;
  bottom:74px;
  left:16px;
  margin:0 auto;
  width:min(380px,calc(100vw - 32px));
  max-height:70vh;
  overflow:hidden;
  background:var(--wt-panel);
  backdrop-filter:blur(22px) saturate(160%);
  -webkit-backdrop-filter:blur(22px) saturate(160%);
  border:1px solid var(--wt-border);
  border-radius:var(--wt-radius);
  box-shadow:0 25px 70px #000c,0 0 0 1px #ffffff08 inset;
  animation:wt-pop .16s ease;
}
@keyframes wt-pop{
  from{opacity:0;transform:translateY(8px)}
  to{opacity:1;transform:translateY(0)}
}

#wt-head{
  padding:16px 16px 12px;
  border-bottom:1px solid var(--wt-border-soft);
  display:flex;
  align-items:center;
  justify-content:space-between;
}
#wt-title{
  font-size:15px;
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
  width:28px;
  height:28px;
  border-radius:9px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
}
#wt-close:active{background:#ffffff1f}

#wt-search-wrap{
  margin:12px 14px;
  position:relative;
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
  font-size:13px;
  transition:border-color .15s,background .15s;
}
#wt-search:focus{border-color:var(--wt-accent);background:#00000055}
#wt-search-ico{
  position:absolute;
  left:11px;
  top:50%;
  transform:translateY(-50%);
  opacity:.5;
  display:flex;
  pointer-events:none;
}

#wt-tools{
  padding:0 10px 12px;
  overflow:auto;
  max-height:50vh;
  display:grid;
  gap:4px;
}

.wt-tool{
  width:100%;
  text-align:left;
  display:flex;
  align-items:center;
  gap:11px;
  padding:10px 10px;
  background:transparent;
  border:1px solid transparent;
  color:var(--wt-text);
  border-radius:11px;
  cursor:pointer;
  transition:.15s;
}
.wt-tool:hover{background:var(--wt-accent-soft);border-color:#6e8fef2e}
.wt-tool:active{transform:scale(.99)}
.wt-tool-ico{
  flex:0 0 auto;
  width:32px;
  height:32px;
  border-radius:9px;
  background:#ffffff08;
  display:flex;
  align-items:center;
  justify-content:center;
  color:var(--wt-accent);
}
.wt-tool-body{min-width:0}
.wt-tool-title{
  font-size:12.5px;
  font-weight:600;
}
.wt-tool-desc{
  color:var(--wt-text-dim);
  font-size:10.5px;
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
  animation:wt-slide .2s ease;
}
@keyframes wt-slide{
  from{transform:translateY(24px);opacity:0}
  to{transform:translateY(0);opacity:1}
}

#wt-box-grip{
  width:36px;
  height:4px;
  background:#ffffff26;
  border-radius:99px;
  margin:10px auto 0;
}

#wt-box-head{
  padding:12px 18px 14px;
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
  padding:7px 12px;
  cursor:pointer;
  font-size:12px;
  font-weight:600;
}
#wt-box-close:active{background:#ffffff1f}

#wt-content{
  padding:16px 18px 22px;
  overflow:auto;
  max-height:calc(88vh - 78px);
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
  font-size:10px;
  text-transform:uppercase;
  letter-spacing:.06em;
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
  font-size:19px;
  font-weight:800;
  color:#fff;
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
  padding:8px 6px;
  text-align:left;
  vertical-align:top;
}
.wt-table th{
  color:var(--wt-text-dim);
  font-weight:700;
  font-size:10px;
  text-transform:uppercase;
  letter-spacing:.03em;
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

::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-thumb{background:#ffffff22;border-radius:99px}

@media(max-width:600px){
  #wt-box{border-radius:18px 18px 0 0}
}
`;

const style=document.createElement('style');
style.id='wt-style';
style.textContent=css;
document.head.appendChild(style);

root.id='wt-app';

root.innerHTML=`
<button id="wt-launch">${svg('bolt')}<span>Web Tools</span></button>

<div id="wt-panel">
  <div id="wt-head">
    <div>
      <div id="wt-title">${svg('bolt',15)}Web Tools</div>
      <div id="wt-sub">Browser inspection toolkit</div>
    </div>
    <button id="wt-close">${svg('close',14)}</button>
  </div>

  <div id="wt-search-wrap">
    <span id="wt-search-ico">${svg('search',14)}</span>
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
};

/* progress-style modal (no close button, used during ZIP export) */
const progressModal=title=>{
  const old=document.getElementById('wt-modal');
  if(old)old.remove();

  const m=document.createElement('div');
  m.id='wt-modal';

  m.innerHTML=`
    <div id="wt-box">
      <div id="wt-box-grip"></div>
      <div id="wt-box-head">
        <div id="wt-box-title">${esc(title)}</div>
      </div>
      <div id="wt-content">
        <div class="wt-card"><div class="wt-value" id="wt-progress-text">Starting...</div></div>
      </div>
    </div>
  `;

  document.body.appendChild(m);

  return{
    set:text=>{
      const el=m.querySelector('#wt-progress-text');
      if(el)el.textContent=text;
    },
    close:()=>m.remove()
  };
};

const copy=async text=>{
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch{
    return false;
  }
};

const urlHTML=url=>{
  const safe=esc(url);
  return `<a class="wt-url" href="${safe}" target="_blank" rel="noopener noreferrer">${safe}</a>`;
};

const addTool=(icon,title,description,fn)=>{
  const b=document.createElement('button');
  b.className='wt-tool';
  b.dataset.search=(title+' '+description).toLowerCase();
  b.innerHTML=`
    <div class="wt-tool-ico">${svg(icon)}</div>
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
      setTimeout(()=>b.textContent='Copy',1200);
    };
  });
};

/* ==================================================
   HELPERS — Frontend ZIP export
   ================================================== */

const loadJSZip=()=>new Promise((resolve,reject)=>{
  if(window.JSZip){resolve(window.JSZip);return;}
  const s=document.createElement('script');
  s.src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  s.onload=()=>resolve(window.JSZip);
  s.onerror=()=>reject(new Error('load-failed'));
  document.head.appendChild(s);
});

const fetchAsBlob=async url=>{
  try{
    const res=await fetch(url,{credentials:'same-origin'});
    if(!res.ok)return null;
    return await res.blob();
  }catch{
    return null;
  }
};

const safeFileName=(url,fallbackExt)=>{
  try{
    const u=new URL(url,location.href);
    let name=u.pathname.split('/').filter(Boolean).pop()||'file';
    name=name.split('?')[0].split('#')[0];
    if(!name.includes('.')&&fallbackExt)name+='.'+fallbackExt;
    return name.replace(/[^a-zA-Z0-9._-]/g,'_')||('file.'+(fallbackExt||'bin'));
  }catch{
    return 'file'+(fallbackExt?'.'+fallbackExt:'');
  }
};

const exportFrontendZip=async()=>{
  const prog=progressModal('Download Frontend ZIP');
  let skipped=0;

  let JSZipLib;
  try{
    prog.set('Preparing frontend...');
    JSZipLib=await loadJSZip();
  }catch{
    prog.close();
    modal('Download Frontend ZIP',empty('Could not load the ZIP library — check your connection and try again.'));
    return;
  }

  try{
    const zip=new JSZipLib();

    const htmlClone=document.documentElement.cloneNode(true);

    const ownApp=htmlClone.querySelector('#wt-app');
    if(ownApp)ownApp.remove();
    const ownStyle=htmlClone.querySelector('#wt-style');
    if(ownStyle)ownStyle.remove();

    prog.set('Collecting resources...');

    let cssIndex=0;
    for(const link of[...htmlClone.querySelectorAll('link[rel="stylesheet"][href]')]){
      const href=link.getAttribute('href');
      if(!href)continue;
      try{
        const abs=new URL(href,location.href).href;
        const blob=await fetchAsBlob(abs);
        if(!blob){skipped++;continue;}
        const name=`assets/css/${++cssIndex}_${safeFileName(abs,'css')}`;
        zip.file(name,blob);
        link.setAttribute('href',name);
      }catch{
        skipped++;
      }
    }

    let jsIndex=0;
    for(const scr of[...htmlClone.querySelectorAll('script[src]')]){
      const src=scr.getAttribute('src');
      if(!src)continue;
      try{
        const abs=new URL(src,location.href).href;
        const blob=await fetchAsBlob(abs);
        if(!blob){skipped++;continue;}
        const name=`assets/js/${++jsIndex}_${safeFileName(abs,'js')}`;
        zip.file(name,blob);
        scr.setAttribute('src',name);
      }catch{
        skipped++;
      }
    }

    let imgIndex=0;
    for(const img of[...htmlClone.querySelectorAll('img[src]')]){
      const src=img.getAttribute('src');
      if(!src)continue;
      try{
        const abs=new URL(src,location.href).href;
        const blob=await fetchAsBlob(abs);
        if(!blob){skipped++;continue;}
        const name=`assets/img/${++imgIndex}_${safeFileName(abs,'png')}`;
        zip.file(name,blob);
        img.setAttribute('src',name);
      }catch{
        skipped++;
      }
    }

    prog.set('Building ZIP...');
    zip.file('index.html','<!DOCTYPE html>\n'+htmlClone.outerHTML);

    prog.set('Downloading...');
    const blob=await zip.generateAsync({type:'blob'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=`${(location.hostname||'page').replace(/[^a-zA-Z0-9.-]/g,'_')}-frontend.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    prog.close();
    modal(
      'Download Frontend ZIP',
      skipped>0
      ? card('Status',`Export completed with ${skipped} inaccessible resource${skipped===1?'':'s'} skipped.`)
      : card('Status','Export completed successfully.')
    );
  }catch(e){
    prog.close();
    modal('Download Frontend ZIP',empty('Export failed unexpectedly. Some resources on this page could not be processed.'));
  }
};

/* ==================================================
   HELPER — Page as PDF (print flow)
   ================================================== */

const exportPagePDF=()=>{
  const st=document.createElement('style');
  st.id='wt-print-style';
  st.textContent='@media print{#wt-app,#wt-modal{display:none!important}}';
  document.head.appendChild(st);

  const cleanup=()=>{
    const el=document.getElementById('wt-print-style');
    if(el)el.remove();
    window.removeEventListener('afterprint',cleanup);
  };

  window.addEventListener('afterprint',cleanup);
  setTimeout(cleanup,15000);

  window.print();
};

/* ==================================================
   TOOL REGISTRATION — ordered by priority
   ================================================== */

addTool(
  'doc','Page Overview',
  'Title, URL, domain and document statistics',
  ()=>{
    const rows=[
      ['Title',esc(document.title)],
      ['URL',urlHTML(location.href)],
      ['Domain',esc(location.hostname)],
      ['Protocol',esc(location.protocol)],
      ['Path',esc(location.pathname)],
      ['Referrer',esc(document.referrer||'(none)')],
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

addTool(
  'zip','Download Frontend ZIP',
  'Export the loaded frontend HTML, CSS, JS and accessible assets',
  ()=>exportFrontendZip()
);

addTool(
  'pdf','Download Page as PDF',
  'Save the current rendered page as a PDF',
  ()=>exportPagePDF()
);

addTool(
  'target','DOM Inspector',
  'Tap an element to inspect basic DOM information',
  ()=>{
    let active=true;

    const st=document.createElement('style');
    st.id='wt-inspector-style';
    st.textContent='[data-wt-highlight]{outline:3px solid #6e8fef!important;outline-offset:2px!important;cursor:crosshair!important}';
    document.head.appendChild(st);

    const over=e=>{
      if(!active||root.contains(e.target)||e.target.closest('#wt-modal'))return;
      e.target.setAttribute('data-wt-highlight','');
    };

    const out=e=>{
      e.target.removeAttribute('data-wt-highlight');
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
      st.remove();
    },30000);
  }
);

addTool(
  'code','Page Source',
  'Open the current document HTML in a readable viewer',
  ()=>{
    modal(
      'Document HTML',
      `<div class="wt-card">
        <button class="wt-copy" data-copy="${esc(document.documentElement.outerHTML)}">Copy HTML</button>
        <pre style="white-space:pre-wrap;word-break:break-word;color:#cdd3dd;font-size:11px;line-height:1.5">${esc(document.documentElement.outerHTML)}</pre>
      </div>`
    );
    bindCopies();
  }
);

addTool(
  'copy','Copy Page Text',
  'Copy visible page text to clipboard',
  async()=>{
    const ok=await copy(document.body.innerText||'');
    alert(ok?'Visible page text copied.':'Clipboard permission denied.');
  }
);

addTool(
  'link','Links',
  'List all links with clickable destinations',
  ()=>{
    const data=[...document.links];

    modal(
      'Links',
      data.length
      ? `<table class="wt-table">
          <tr><th>#</th><th>Text</th><th>Destination</th></tr>
          ${data.map((a,i)=>`
            <tr>
              <td>${i+1}</td>
              <td>${esc(a.innerText.trim()||'(no text)')}</td>
              <td>${urlHTML(a.href)}</td>
            </tr>`).join('')}
        </table>`
      : empty('No links found.')
    );
  }
);

addTool(
  'image','Images',
  'View images with clickable source URLs',
  ()=>{
    const data=[...document.images];

    modal(
      'Images',
      data.length
      ? data.map((img,i)=>`
        <div class="wt-card">
          <div class="wt-label">Image ${i+1}</div>
          <div class="wt-value">${urlHTML(img.src)}</div>
          <img class="wt-preview" src="${esc(img.src)}" loading="lazy">
          <div class="wt-label" style="margin-top:8px">Dimensions</div>
          <div class="wt-value">${img.naturalWidth||'?'} x ${img.naturalHeight||'?'}</div>
        </div>
      `).join('')
      : empty('No images found.')
    );
  }
);

addTool(
  'form','Forms',
  'Inspect forms, actions, methods and fields',
  ()=>{
    const data=[...document.forms];

    modal(
      'Forms',
      data.length
      ? data.map((f,i)=>`
        <div class="wt-card">
          <div class="wt-label">Form ${i+1}</div>
          <div class="wt-value">
            <strong>Action:</strong> ${urlHTML(f.action)}<br>
            <strong>Method:</strong> ${esc(f.method||'get')}<br>
            <strong>Fields:</strong> ${f.elements.length}
          </div>
          <br>
          <table class="wt-table">
            <tr><th>Name</th><th>Type</th><th>Tag</th></tr>
            ${[...f.elements].map(e=>`
              <tr>
                <td>${esc(e.name||'(none)')}</td>
                <td>${esc(e.type||'(none)')}</td>
                <td>${esc(e.tagName)}</td>
              </tr>`).join('')}
          </table>
        </div>
      `).join('')
      : empty('No forms found.')
    );
  }
);

addTool(
  'heading','Headings',
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

addTool(
  'gear','Scripts',
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

addTool(
  'box','Resources',
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

addTool(
  'clock','Performance',
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
    ? rows.map((r,i)=>`
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

addTool('disk','Local Storage','View current site localStorage keys and values',()=>storageViewer('Local Storage',localStorage));
addTool('folder','Session Storage','View current site sessionStorage keys and values',()=>storageViewer('Session Storage',sessionStorage));

addTool(
  'cookie','Cookies',
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

search.oninput=()=>{
  const q=search.value.toLowerCase().trim();

  tools.querySelectorAll('.wt-tool').forEach(b=>{
    b.style.display=!q||b.dataset.search.includes(q)?'flex':'none';
  });
};

root.querySelector('#wt-launch').onclick=()=>{
  panel.style.display=panel.style.display==='none'||!panel.style.display?'block':'none';
};

root.querySelector('#wt-close').onclick=()=>{
  panel.style.display='none';
};

})();
