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
  scripts:'<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
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

/* Panel is fixed to the VIEWPORT (not absolute to #wt-app) so it can never
   overflow off-screen regardless of the launcher button's own width. */
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
      setTimeout(()=>b.textContent='Copy',1200);
    };
  });
};

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
  'links','Links',
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
  'images','Images',
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
          <div class="wt-value">${img.naturalWidth||'?'} × ${img.naturalHeight||'?'}</div>
        </div>
      `).join('')
      : empty('No images found.')
    );
  }
);

addTool(
  'forms','Forms',
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

addTool(
  'inspector','DOM Inspector',
  'Tap an element to inspect basic DOM information',
  ()=>{
    let active=true;

    const st=document.createElement('style');
    st.id='wt-inspector-style';
    st.textContent='[data-wt-highlight]{outline:3px solid #6f93f2!important;outline-offset:2px!important;cursor:crosshair!important}';
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

addTool('localStorage','Local Storage','View current site localStorage keys and values',()=>storageViewer('Local Storage',localStorage));
addTool('sessionStorage','Session Storage','View current site sessionStorage keys and values',()=>storageViewer('Session Storage',sessionStorage));

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

addTool(
  'copy','Copy Page Text',
  'Copy visible page text to clipboard',
  async()=>{
    const ok=await copy(document.body.innerText||'');
    alert(ok?'Visible page text copied.':'Clipboard permission denied.');
  }
);

addTool(
  'source','Page Source',
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
