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

/* ---------- MAX Z-INDEX (fix: modal now guaranteed on top) ---------- */
const Z=2147483647;

const css=`
:root{
  --wt-bg:#0b0c0f;
  --wt-panel:#111318f2;
  --wt-card:#181b21;
  --wt-border:#262a32;
  --wt-border-soft:#1e2229;
  --wt-text:#f2f4f8;
  --wt-text-dim:#8b93a3;
  --wt-accent:#7c9eff;
  --wt-accent-soft:#7c9eff22;
  --wt-radius:18px;
}

#wt-app{
  position:fixed;
  right:16px;
  bottom:16px;
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
  background:linear-gradient(160deg,#1a1d24,#0e1015);
  color:#fff;
  border-radius:999px;
  padding:12px 18px;
  font-size:14px;
  font-weight:600;
  letter-spacing:.01em;
  box-shadow:0 10px 30px #0009,inset 0 1px 0 #ffffff12;
  cursor:pointer;
  transition:transform .15s ease,box-shadow .15s ease;
}
#wt-launch:active{transform:scale(.96)}
#wt-launch .wt-ico{font-size:16px}

#wt-panel{
  display:none;
  position:absolute;
  right:0;
  bottom:64px;
  width:min(380px,calc(100vw - 28px));
  max-height:76vh;
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
  padding:18px 18px 14px;
  border-bottom:1px solid var(--wt-border-soft);
  display:flex;
  align-items:center;
  justify-content:space-between;
}
#wt-title{
  font-size:16px;
  font-weight:700;
  display:flex;
  align-items:center;
  gap:7px;
}
#wt-title .wt-crown{font-size:15px}
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
  width:30px;
  height:30px;
  border-radius:10px;
  cursor:pointer;
  font-size:13px;
  display:flex;
  align-items:center;
  justify-content:center;
  transition:background .15s;
}
#wt-close:active{background:#ffffff1f}

#wt-search-wrap{
  margin:14px;
  position:relative;
}
#wt-search{
  width:100%;
  box-sizing:border-box;
  background:#0000003d;
  border:1px solid var(--wt-border);
  color:#fff;
  padding:11px 12px 11px 34px;
  border-radius:12px;
  outline:none;
  font-size:13.5px;
  transition:border-color .15s,background .15s;
}
#wt-search:focus{border-color:var(--wt-accent);background:#00000055}
#wt-search-ico{
  position:absolute;
  left:11px;
  top:50%;
  transform:translateY(-50%);
  opacity:.5;
  font-size:13px;
  pointer-events:none;
}

#wt-tools{
  padding:0 12px 14px;
  overflow:auto;
  max-height:54vh;
  display:grid;
  gap:6px;
}

.wt-tool{
  width:100%;
  text-align:left;
  display:flex;
  align-items:center;
  gap:12px;
  padding:11px 12px;
  background:#ffffff05;
  border:1px solid transparent;
  color:var(--wt-text);
  border-radius:13px;
  cursor:pointer;
  transition:.15s;
}
.wt-tool:hover{background:var(--wt-accent-soft);border-color:#7c9eff33}
.wt-tool:active{transform:scale(.985)}
.wt-tool-ico{
  flex:0 0 auto;
  width:34px;
  height:34px;
  border-radius:10px;
  background:#ffffff08;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:16px;
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

/* ---------- MODAL (higher paint order + equal max z-index = always on top) ---------- */
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
  border-radius:22px 22px 0 0;
  box-shadow:0 -20px 60px #000d;
  animation:wt-slide .2s cubic-bezier(.2,.9,.3,1.1);
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
  font-size:15px;
  font-weight:700;
}
#wt-box-close{
  border:1px solid var(--wt-border);
  background:#ffffff0d;
  color:#e2e5eb;
  border-radius:10px;
  padding:7px 12px;
  cursor:pointer;
  font-size:12.5px;
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
  border-radius:13px;
  padding:13px 14px;
  margin-bottom:9px;
}
.wt-label{
  color:var(--wt-text-dim);
  font-size:10px;
  text-transform:uppercase;
  letter-spacing:.07em;
  margin-bottom:5px;
  font-weight:700;
}
.wt-value{
  color:var(--wt-text);
  font-size:13px;
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
  border-radius:9px;
  padding:5px 10px;
  cursor:pointer;
  font-size:11px;
  font-weight:600;
  transition:background .15s;
}
.wt-copy:active{background:#ffffff1f}

.wt-stat-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:9px;
}
.wt-stat{
  background:var(--wt-card);
  border:1px solid var(--wt-border-soft);
  border-radius:13px;
  padding:14px;
}
.wt-stat-num{
  font-size:21px;
  font-weight:800;
  background:linear-gradient(135deg,#fff,#9db4ff);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}
.wt-stat-label{
  color:var(--wt-text-dim);
  font-size:11px;
  margin-top:3px;
  font-weight:600;
}

.wt-table{
  width:100%;
  border-collapse:collapse;
  font-size:12px;
}
.wt-table th,.wt-table td{
  border-bottom:1px solid var(--wt-border-soft);
  padding:9px 7px;
  text-align:left;
  vertical-align:top;
}
.wt-table th{
  color:var(--wt-text-dim);
  font-weight:700;
  font-size:10.5px;
  text-transform:uppercase;
  letter-spacing:.04em;
}
.wt-preview{
  width:100%;
  max-height:230px;
  object-fit:contain;
  background:#050608;
  border-radius:10px;
  margin-top:8px;
  border:1px solid var(--wt-border-soft);
}

.wt-empty{
  text-align:center;
  color:var(--wt-text-dim);
  font-size:12.5px;
  padding:26px 10px;
}

::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-thumb{background:#ffffff22;border-radius:99px}

@media(max-width:600px){
  #wt-app{right:12px;bottom:14px}
  #wt-panel{
    right:auto;
    left:50%;
    transform:translateX(-50%);
    width:calc(100vw - 22px);
  }
  #wt-box{border-radius:20px 20px 0 0}
}
`;

const style=document.createElement('style');
style.id='wt-style';
style.textContent=css;
document.head.appendChild(style);

root.id='wt-app';

root.innerHTML=`
<button id="wt-launch"><span class="wt-ico">⚡</span>Web Tools</button>

<div id="wt-panel">
  <div id="wt-head">
    <div>
      <div id="wt-title"><span class="wt-crown">✦</span>Web Tools</div>
      <div id="wt-sub">Browser inspection toolkit</div>
    </div>
    <button id="wt-close">✕</button>
  </div>

  <div id="wt-search-wrap">
    <span id="wt-search-ico">🔍</span>
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

  // Appended last -> always paints above #wt-app even at equal z-index
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

const addTool=(icon,title,description,fn)=>{
  const b=document.createElement('button');
  b.className='wt-tool';
  b.dataset.search=(title+' '+description).toLowerCase();
  b.innerHTML=`
    <div class="wt-tool-ico">${icon}</div>
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
      b.textContent=ok?'Copied ✓':'Failed';
      setTimeout(()=>b.textContent='Copy',1200);
    };
  });
};

addTool(
  '📄','Page Overview',
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
  '🔗','Links',
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
  '🖼️','Images',
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
  '📝','Forms',
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
  '🧭','Headings',
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
  '🎯','DOM Inspector',
  'Tap an element to inspect basic DOM information',
  ()=>{
    let active=true;

    const st=document.createElement('style');
    st.id='wt-inspector-style';
    st.textContent='[data-wt-highlight]{outline:3px solid #7c9eff!important;outline-offset:2px!important;cursor:crosshair!important}';
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

addTool('💾','Local Storage','View current site localStorage keys and values',()=>storageViewer('Local Storage',localStorage));
addTool('🗂️','Session Storage','View current site sessionStorage keys and values',()=>storageViewer('Session Storage',sessionStorage));

addTool(
  '⏱️','Performance',
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
  '📦','Resources',
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
  '🍪','Cookies',
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
  '📋','Copy Page Text',
  'Copy visible page text to clipboard',
  async()=>{
    const ok=await copy(document.body.innerText||'');
    alert(ok?'Visible page text copied.':'Clipboard permission denied.');
  }
);

addTool(
  '⚙️','Scripts',
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
