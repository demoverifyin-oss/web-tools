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

const css=`
#wt-app{
  position:fixed;
  right:18px;
  bottom:18px;
  z-index:2147483647;
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  color:#e8eaf0;
}
#wt-launch{
  border:1px solid #30343d;
  background:#111318;
  color:#fff;
  border-radius:12px;
  padding:11px 16px;
  font-size:14px;
  font-weight:600;
  box-shadow:0 8px 30px #0008;
  cursor:pointer;
}
#wt-panel{
  display:none;
  position:absolute;
  right:0;
  bottom:56px;
  width:min(390px,calc(100vw - 30px));
  max-height:78vh;
  overflow:hidden;
  background:#111318;
  border:1px solid #2c3038;
  border-radius:16px;
  box-shadow:0 20px 60px #000b;
}
#wt-head{
  padding:16px;
  border-bottom:1px solid #292d35;
  display:flex;
  align-items:center;
  justify-content:space-between;
}
#wt-title{
  font-size:16px;
  font-weight:700;
}
#wt-sub{
  color:#8e95a3;
  font-size:11px;
  margin-top:3px;
}
#wt-close{
  background:#1b1e24;
  color:#bfc5d0;
  border:1px solid #30343d;
  width:30px;
  height:30px;
  border-radius:8px;
  cursor:pointer;
}
#wt-search{
  margin:12px;
  width:calc(100% - 24px);
  box-sizing:border-box;
  background:#191c22;
  border:1px solid #30343d;
  color:#fff;
  padding:10px 12px;
  border-radius:9px;
  outline:none;
}
#wt-tools{
  padding:0 12px 12px;
  overflow:auto;
  max-height:58vh;
}
.wt-tool{
  width:100%;
  text-align:left;
  margin:5px 0;
  padding:11px 12px;
  background:#181b21;
  border:1px solid #292d35;
  color:#e8eaf0;
  border-radius:9px;
  cursor:pointer;
  transition:.15s;
}
.wt-tool:hover{
  background:#20242b;
  border-color:#454b57;
}
.wt-tool-title{
  font-size:13px;
  font-weight:600;
}
.wt-tool-desc{
  color:#858d9b;
  font-size:11px;
  margin-top:3px;
}
#wt-modal{
  position:fixed;
  inset:0;
  z-index:2147483646;
  background:#08090ccc;
  backdrop-filter:blur(8px);
  display:flex;
  align-items:center;
  justify-content:center;
  padding:18px;
}
#wt-box{
  width:min(900px,100%);
  max-height:90vh;
  overflow:hidden;
  background:#111318;
  border:1px solid #30343d;
  border-radius:16px;
  box-shadow:0 25px 80px #000d;
}
#wt-box-head{
  padding:15px 17px;
  border-bottom:1px solid #292d35;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
#wt-box-title{
  font-size:15px;
  font-weight:700;
}
#wt-box-close{
  border:1px solid #30343d;
  background:#191c22;
  color:#ddd;
  border-radius:8px;
  padding:6px 10px;
  cursor:pointer;
}
#wt-content{
  padding:16px;
  overflow:auto;
  max-height:calc(90vh - 62px);
}
.wt-card{
  background:#181b21;
  border:1px solid #292d35;
  border-radius:11px;
  padding:13px;
  margin-bottom:9px;
}
.wt-label{
  color:#858d9b;
  font-size:10px;
  text-transform:uppercase;
  letter-spacing:.06em;
  margin-bottom:5px;
}
.wt-value{
  color:#f2f4f8;
  font-size:13px;
  word-break:break-word;
}
.wt-url{
  color:#8ab4ff;
  text-decoration:none;
  word-break:break-all;
}
.wt-url:hover{text-decoration:underline}
.wt-copy{
  float:right;
  background:#22262e;
  border:1px solid #363b45;
  color:#dce1e8;
  border-radius:7px;
  padding:5px 8px;
  cursor:pointer;
  font-size:11px;
}
.wt-stat-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:9px;
}
.wt-stat{
  background:#181b21;
  border:1px solid #292d35;
  border-radius:10px;
  padding:13px;
}
.wt-stat-num{
  font-size:20px;
  font-weight:700;
}
.wt-stat-label{
  color:#858d9b;
  font-size:11px;
  margin-top:3px;
}
.wt-table{
  width:100%;
  border-collapse:collapse;
  font-size:12px;
}
.wt-table th,.wt-table td{
  border-bottom:1px solid #292d35;
  padding:9px 7px;
  text-align:left;
  vertical-align:top;
}
.wt-table th{
  color:#8d95a3;
  font-weight:600;
}
.wt-preview{
  width:100%;
  max-height:240px;
  object-fit:contain;
  background:#0b0c0f;
  border-radius:8px;
  margin-top:8px;
}
@media(max-width:600px){
  #wt-app{right:10px;bottom:10px}
  #wt-panel{width:calc(100vw - 20px)}
}
`;

const style=document.createElement('style');
style.id='wt-style';
style.textContent=css;
document.head.appendChild(style);

root.id='wt-app';

root.innerHTML=`
<button id="wt-launch">Web Tools</button>

<div id="wt-panel">
  <div id="wt-head">
    <div>
      <div id="wt-title">Web Tools</div>
      <div id="wt-sub">Browser inspection toolkit</div>
    </div>
    <button id="wt-close">Close</button>
  </div>

  <input id="wt-search" placeholder="Search tools...">

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

const addTool=(title,description,fn)=>{
  const b=document.createElement('button');
  b.className='wt-tool';
  b.dataset.search=(title+' '+description).toLowerCase();
  b.innerHTML=`
    <div class="wt-tool-title">${esc(title)}</div>
    <div class="wt-tool-desc">${esc(description)}</div>
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
  'Page Overview',
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
  'Links',
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
      : '<div class="wt-card">No links found.</div>'
    );
  }
);

addTool(
  'Images',
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
      : '<div class="wt-card">No images found.</div>'
    );
  }
);

addTool(
  'Forms',
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
      : '<div class="wt-card">No forms found.</div>'
    );
  }
);

addTool(
  'Headings',
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
      : '<div class="wt-card">No headings found.</div>'
    );
  }
);

addTool(
  'DOM Inspector',
  'Tap an element to inspect basic DOM information',
  ()=>{
    let active=true;

    const st=document.createElement('style');
    st.id='wt-inspector-style';
    st.textContent='[data-wt-highlight]{outline:3px solid #5b9cff!important;outline-offset:2px!important;cursor:crosshair!important}';
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
    : '<div class="wt-card">Storage is empty.</div>'
  );

  bindCopies();
};

addTool('Local Storage','View current site localStorage keys and values',()=>storageViewer('Local Storage',localStorage));
addTool('Session Storage','View current site sessionStorage keys and values',()=>storageViewer('Session Storage',sessionStorage));

addTool(
  'Performance',
  'Navigation timing and page load metrics',
  ()=>{
    const p=performance.getEntriesByType('navigation')[0];

    if(!p){
      modal('Performance','<div class="wt-card">Navigation timing unavailable.</div>');
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
  'Resources',
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
      : '<div class="wt-card">No resource entries available.</div>'
    );
  }
);

addTool(
  'Cookies',
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
  'Copy Page Text',
  'Copy visible page text to clipboard',
  async()=>{
    const ok=await copy(document.body.innerText||'');
    alert(ok?'Visible page text copied.':'Clipboard permission denied.');
  }
);

addTool(
  'Page Source',
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
  'Scripts',
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
      : '<div class="wt-card">No scripts found.</div>'
    );
  }
);

search.oninput=()=>{
  const q=search.value.toLowerCase().trim();

  tools.querySelectorAll('.wt-tool').forEach(b=>{
    b.style.display=!q||b.dataset.search.includes(q)?'block':'none';
  });
};

root.querySelector('#wt-launch').onclick=()=>{
  panel.style.display=panel.style.display==='none'?'block':'none';
};

root.querySelector('#wt-close').onclick=()=>{
  panel.style.display='none';
};

})();