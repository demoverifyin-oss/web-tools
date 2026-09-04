
(()=>{
'use strict';

/* ============================================================
   ADVANCED WEB TOOLS — UNIFIED DEVTOOLS
   ------------------------------------------------------------
   Page-level DevTools-style toolkit.

   IMPORTANT BROWSER LIMITATIONS:
   - Cannot access Chrome/Firefox DevTools privileged APIs.
   - Cannot see arbitrary request headers from every browser request.
   - Cannot read cross-origin response bodies.
   - Cannot inspect server-side/backend source.
   - Network capture covers requests observable from page JS:
       fetch()
       XMLHttpRequest
       PerformanceResourceTiming
   ============================================================ */

if(window.__WEBTOOLS_V2){
  window.__WEBTOOLS_V2.destroy();
  return;
}

const state={
  network:[],
  console:[],
  selectedElement:null,
  networkEnabled:true,
  consoleEnabled:true,
  destroyed:false,
  original:{
    fetch:window.fetch,
    XHR:{
      open:XMLHttpRequest.prototype.open,
      send:XMLHttpRequest.prototype.send,
      setRequestHeader:XMLHttpRequest.prototype.setRequestHeader
    },
    console:{
      log:console.log,
      info:console.info,
      warn:console.warn,
      error:console.error,
      debug:console.debug
    }
  }
};

const root=document.createElement('div');
window.__WEBTOOLS_V2=root;

const Z=2147483647;

const esc=v=>String(v??'')
.replace(/&/g,'&amp;')
.replace(/</g,'&lt;')
.replace(/>/g,'&gt;')
.replace(/"/g,'&quot;');

const attrEsc=esc;

const ic=(paths,size=17)=>{
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="1.7"
    stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
};

const ICONS={
  brand:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
  search:'<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  close:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  network:'<circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="5" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M7.5 11l9-5"/><path d="M7.5 13l9 5"/>',
  source:'<polyline points="8 9 4 12 8 15"/><polyline points="16 9 20 12 16 15"/><line x1="14" y1="7" x2="10" y2="17"/>',
  console:'<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
  storage:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>',
  inspector:'<circle cx="12" cy="12" r="9"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>',
  elements:'<path d="M4 5h16M4 12h10M4 19h16"/><circle cx="18" cy="12" r="2"/>',
  css:'<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h5M8 16h8"/>',
  js:'<path d="M4 4h16v16H4z"/><path d="M9 17v-1.5a2 2 0 0 1 4 0V17"/><path d="M15 17v-4h2"/>',
  performance:'<polyline points="22 12 18 12 15 20 9 4 6 12 2 12"/>',
  overview:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  download:'<path d="M12 3v12"/><polyline points="7 10 12 15 17 10"/><path d="M5 21h14"/>',
  pdf:'<path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 15h2a2 2 0 0 0 0-4H8v7"/><path d="M13 11v7h1a3.5 3.5 0 0 0 0-7z"/>',
  links:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  images:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  forms:'<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
  headings:'<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
  resources:'<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22" x2="12" y2="12"/>',
  copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  refresh:'<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M20.49 15A9 9 0 0 1 5.64 18.36L1 14"/>',
  trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 15H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V3h6v3"/>',
  back:'<polyline points="15 18 9 12 15 6"/>',
  plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'
};

/* ============================================================
   CSS
   ============================================================ */

const css=`
#wt-v2{
  --bg:#0b0d10;
  --panel:#111419;
  --panel2:#171a20;
  --panel3:#1c2027;
  --border:#292e37;
  --border2:#20242b;
  --text:#e8ebef;
  --muted:#8b94a3;
  --blue:#78a2ff;
  --green:#63d297;
  --yellow:#e6b75c;
  --red:#ff7373;
  --purple:#c99cff;
  --cyan:#73d8e8;

  position:fixed;
  right:16px;
  bottom:16px;
  z-index:${Z};
  font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,system-ui,sans-serif;
  color:var(--text);
  font-size:13px;
}

#wt-v2 *{box-sizing:border-box}

#wt-launch{
  display:flex;
  align-items:center;
  gap:8px;
  border:1px solid #ffffff18;
  background:#101318;
  color:#fff;
  border-radius:999px;
  padding:11px 16px;
  font-weight:650;
  cursor:pointer;
  box-shadow:0 14px 38px #000b;
}

#wt-panel{
  display:none;
  position:fixed;
  right:16px;
  bottom:68px;
  width:470px;
  max-width:calc(100vw - 24px);
  height:min(720px,82vh);
  background:var(--bg);
  border:1px solid var(--border);
  border-radius:16px;
  box-shadow:0 30px 90px #000d;
  overflow:hidden;
}

#wt-panel.open{display:flex;flex-direction:column}

#wt-top{
  height:50px;
  flex:none;
  display:flex;
  align-items:center;
  gap:10px;
  padding:0 12px;
  border-bottom:1px solid var(--border);
  background:#0e1014;
}

#wt-brand{
  display:flex;
  align-items:center;
  gap:7px;
  font-weight:750;
  white-space:nowrap;
}

#wt-brand svg{color:var(--blue)}

#wt-search{
  flex:1;
  min-width:0;
  background:#080a0d;
  border:1px solid var(--border);
  color:#fff;
  border-radius:8px;
  padding:7px 9px;
  outline:none;
}

#wt-search:focus{border-color:#6f93f270}

.wt-icon-btn{
  width:30px;
  height:30px;
  border:1px solid var(--border);
  background:#ffffff07;
  color:var(--muted);
  border-radius:8px;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
}

.wt-icon-btn:hover{
  color:#fff;
  background:#ffffff0e;
}

#wt-tabs{
  flex:none;
  height:42px;
  display:flex;
  overflow:auto;
  border-bottom:1px solid var(--border);
  background:#0e1014;
}

.wt-tab{
  flex:none;
  border:0;
  border-bottom:2px solid transparent;
  background:none;
  color:var(--muted);
  padding:0 12px;
  font-size:11px;
  font-weight:650;
  cursor:pointer;
}

.wt-tab.active{
  color:#fff;
  border-bottom-color:var(--blue);
}

.wt-tab-badge{
  margin-left:4px;
  color:var(--blue);
}

#wt-toolbar{
  flex:none;
  min-height:42px;
  display:flex;
  align-items:center;
  gap:6px;
  padding:6px 9px;
  border-bottom:1px solid var(--border2);
  background:#12151a;
}

.wt-select,.wt-input{
  background:#090b0e;
  color:#dfe4eb;
  border:1px solid var(--border);
  border-radius:7px;
  padding:6px 8px;
  outline:none;
  font-size:11px;
}

.wt-input{min-width:0;flex:1}

.wt-small-btn{
  border:1px solid var(--border);
  background:#ffffff08;
  color:#cfd5de;
  border-radius:7px;
  padding:6px 9px;
  cursor:pointer;
  font-size:10.5px;
  font-weight:650;
}

.wt-small-btn:hover{background:#ffffff12}

.wt-small-btn.danger{color:var(--red)}

#wt-view{
  flex:1;
  min-height:0;
  overflow:auto;
  background:#0b0d10;
}

.wt-table{
  width:100%;
  border-collapse:collapse;
  table-layout:fixed;
}

.wt-table th,
.wt-table td{
  border-bottom:1px solid #191d23;
  padding:8px 7px;
  text-align:left;
  vertical-align:top;
  font-size:10.5px;
}

.wt-table th{
  position:sticky;
  top:0;
  z-index:2;
  background:#12151a;
  color:var(--muted);
  text-transform:uppercase;
  font-size:9px;
  letter-spacing:.05em;
}

.wt-row{cursor:pointer}
.wt-row:hover{background:#ffffff06}

.wt-url{
  color:var(--blue);
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  display:block;
}

.wt-method{
  color:var(--purple);
  font-weight:750;
}

.wt-status-ok{color:var(--green);font-weight:700}
.wt-status-bad{color:var(--red);font-weight:700}
.wt-status-neutral{color:var(--yellow);font-weight:700}

.wt-muted{color:var(--muted)}

.wt-card{
  margin:9px;
  padding:11px;
  background:var(--panel2);
  border:1px solid var(--border2);
  border-radius:10px;
}

.wt-card-title{
  font-size:10px;
  text-transform:uppercase;
  letter-spacing:.06em;
  color:var(--muted);
  font-weight:750;
  margin-bottom:6px;
}

.wt-value{
  color:#e6e9ee;
  line-height:1.55;
  word-break:break-word;
}

.wt-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:8px;
  padding:9px;
}

.wt-stat{
  background:var(--panel2);
  border:1px solid var(--border2);
  border-radius:10px;
  padding:12px;
}

.wt-num{
  font-size:19px;
  font-weight:800;
}

.wt-stat-label{
  color:var(--muted);
  font-size:9.5px;
  margin-top:3px;
}

.wt-code{
  margin:0;
  padding:13px;
  white-space:pre;
  overflow:auto;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-size:10.5px;
  line-height:1.65;
  color:#cdd5df;
}

.wt-code-wrap{
  margin:9px;
  border:1px solid var(--border2);
  border-radius:10px;
  overflow:auto;
  background:#080a0d;
}

.wt-code-head{
  position:sticky;
  top:0;
  z-index:3;
  padding:7px;
  display:flex;
  justify-content:flex-end;
  background:#101318ee;
  border-bottom:1px solid var(--border2);
}

.wt-copy{
  border:1px solid var(--border);
  background:#ffffff08;
  color:#d8dee7;
  border-radius:6px;
  padding:5px 8px;
  cursor:pointer;
  font-size:10px;
}

.wt-tag{color:#ff7b72}
.wt-attr{color:#d2a8ff}
.wt-string{color:#a5d6ff}
.wt-comment{color:#8b949e}
.wt-punct{color:#8b949e}

.wt-console{
  padding:4px 0;
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
  font-size:10.5px;
}

.wt-console-line{
  padding:7px 10px;
  border-bottom:1px solid #171b21;
  white-space:pre-wrap;
  word-break:break-word;
}

.wt-console-line.log{color:#d7dce4}
.wt-console-line.info{color:var(--cyan)}
.wt-console-line.warn{color:var(--yellow)}
.wt-console-line.error{color:var(--red)}
.wt-console-line.command{color:var(--purple)}
.wt-console-time{color:#66707f;margin-right:7px}

#wt-console-input{
  position:sticky;
  bottom:0;
  width:100%;
  border:0;
  border-top:1px solid var(--border);
  outline:none;
  background:#080a0d;
  color:#e7ebf0;
  padding:10px;
  font-family:ui-monospace,monospace;
  font-size:11px;
}

.wt-tree{
  padding:8px;
  font-family:ui-monospace,monospace;
  font-size:10.5px;
}

.wt-node{
  margin-left:14px;
  border-left:1px solid #252a32;
  padding-left:8px;
}

.wt-node-line{
  padding:4px 5px;
  border-radius:5px;
  cursor:pointer;
}

.wt-node-line:hover{background:#ffffff08}

.wt-node-name{color:#ff7b72}
.wt-node-attr{color:#d2a8ff}
.wt-node-text{color:#a5d6ff}

.wt-inspected{
  outline:2px solid var(--blue)!important;
  outline-offset:2px!important;
}

.wt-empty{
  padding:35px 15px;
  text-align:center;
  color:var(--muted);
  font-size:11px;
}

.wt-badge{
  display:inline-block;
  border:1px solid var(--border);
  background:#ffffff08;
  border-radius:999px;
  padding:2px 6px;
  font-size:8.5px;
  color:var(--muted);
}

.wt-badge.green{color:var(--green);border-color:#63d29730}
.wt-badge.red{color:var(--red);border-color:#ff737330}
.wt-badge.blue{color:var(--blue);border-color:#78a2ff30}

.wt-split{
  display:grid;
  grid-template-columns:1fr 1fr;
  min-height:100%;
}

.wt-list{
  border-right:1px solid var(--border);
  overflow:auto;
}

.wt-detail{
  overflow:auto;
  min-width:0;
}

.wt-list-item{
  padding:9px;
  border-bottom:1px solid #191d23;
  cursor:pointer;
}

.wt-list-item:hover,
.wt-list-item.active{
  background:#ffffff08;
}

.wt-list-title{
  font-size:10.5px;
  font-weight:700;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}

.wt-list-sub{
  margin-top:3px;
  color:var(--muted);
  font-size:9px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}

.wt-resource-body{
  padding:10px;
}

.wt-property{
  display:grid;
  grid-template-columns:90px 1fr;
  gap:8px;
  padding:6px 0;
  border-bottom:1px solid #1b1f25;
  font-size:10.5px;
}

.wt-property-key{color:var(--muted)}
.wt-property-value{word-break:break-word}

@media(max-width:650px){
  #wt-v2{right:8px;bottom:8px}
  #wt-panel{
    right:8px;
    bottom:60px;
    width:calc(100vw - 16px);
    height:82vh;
  }
}

@media print{
  #wt-v2{display:none!important}
}
`;

const style=document.createElement('style');
style.id='wt-v2-style';
style.textContent=css;
document.head.appendChild(style);

root.id='wt-v2';

root.innerHTML=`
<button id="wt-launch">
  ${ic(ICONS.brand,16)}
  Web Tools
</button>

<div id="wt-panel">

  <div id="wt-top">
    <div id="wt-brand">${ic(ICONS.brand,16)} DevTools</div>
    <input id="wt-search" placeholder="Search current panel...">
    <button class="wt-icon-btn" id="wt-refresh">${ic(ICONS.refresh,15)}</button>
    <button class="wt-icon-btn" id="wt-close">${ic(ICONS.close,15)}</button>
  </div>

  <div id="wt-tabs">
    <button class="wt-tab active" data-tab="overview">Overview</button>
    <button class="wt-tab" data-tab="network">Network <span class="wt-tab-badge" id="wt-network-count">0</span></button>
    <button class="wt-tab" data-tab="console">Console <span class="wt-tab-badge" id="wt-console-count">0</span></button>
    <button class="wt-tab" data-tab="elements">Elements</button>
    <button class="wt-tab" data-tab="source">Source</button>
    <button class="wt-tab" data-tab="storage">Storage</button>
    <button class="wt-tab" data-tab="resources">Resources</button>
  </div>

  <div id="wt-toolbar"></div>
  <div id="wt-view"></div>

</div>
`;

const panel=root.querySelector('#wt-panel');
const view=root.querySelector('#wt-view');
const toolbar=root.querySelector('#wt-toolbar');
const search=root.querySelector('#wt-search');

let currentTab='overview';

const formatBytes=n=>{
  if(!Number.isFinite(n)||n<0)return '—';
  if(n<1024)return `${n} B`;
  if(n<1024*1024)return `${(n/1024).toFixed(1)} KB`;
  return `${(n/1024/1024).toFixed(2)} MB`;
};

const formatMs=n=>{
  return Number.isFinite(n)?`${n.toFixed(1)} ms`:'—';
};

const copy=async text=>{
  try{
    await navigator.clipboard.writeText(String(text));
    return true;
  }catch{
    try{
      const ta=document.createElement('textarea');
      ta.value=String(text);
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

const htmlHighlight=html=>{
  const tagRe=/<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>/g;
  let out='';
  let last=0;
  let m;

  const attrs=s=>{
    let result='';
    let pos=0;

    const re=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g;
    let a;

    while((a=re.exec(s))){
      result+=esc(s.slice(pos,a.index));
      result+=`<span class="wt-attr">${esc(a[1])}</span>`;

      if(a[3]!==undefined){
        result+=`<span class="wt-punct">=</span><span class="wt-string">${esc(a[3])}</span>`;
      }

      pos=re.lastIndex;
    }

    result+=esc(s.slice(pos));
    return result;
  };

  while((m=tagRe.exec(html))){
    out+=esc(html.slice(last,m.index));

    const token=m[0];

    if(token.startsWith('<!--')){
      out+=`<span class="wt-comment">${esc(token)}</span>`;
    }else{
      const close=token.startsWith('</');
      const open=close?'</':'<';
      const ending=token.endsWith('/>')?'/': '';
      const inner=token.slice(open.length,token.length-(ending?2:1));
      const nm=inner.match(/^[a-zA-Z][a-zA-Z0-9:-]*/);
      const name=nm?nm[0]:'';
      const ap=inner.slice(name.length);

      out+=`<span class="wt-punct">${esc(open)}</span>`;
      out+=`<span class="wt-tag">${esc(name)}</span>`;
      out+=attrs(ap);
      out+=`<span class="wt-punct">${ending?'/':''}&gt;</span>`;
    }

    last=tagRe.lastIndex;
  }

  out+=esc(html.slice(last));
  return out;
};

/* ============================================================
   NETWORK CAPTURE
   ============================================================ */

const pushNetwork=item=>{
  if(state.destroyed)return;

  item.id=crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`;

  state.network.unshift(item);

  if(state.network.length>1000){
    state.network.length=1000;
  }

  updateBadges();

  if(currentTab==='network'){
    renderNetwork();
  }
};

const normalizeHeaders=headers=>{
  const out={};

  try{
    if(headers instanceof Headers){
      headers.forEach((v,k)=>out[k]=v);
    }else if(Array.isArray(headers)){
      headers.forEach(pair=>{
        if(pair&&pair.length>=2)out[pair[0]]=pair[1];
      });
    }else if(headers&&typeof headers==='object'){
      Object.keys(headers).forEach(k=>out[k]=headers[k]);
    }
  }catch{}

  return out;
};

/* FETCH */

window.fetch=async function(input,init){
  const started=performance.now();

  let url='';
  let method='GET';

  try{
    if(input instanceof Request){
      url=input.url;
      method=input.method||'GET';
    }else{
      url=new URL(String(input),location.href).href;
      method=(init&&init.method)||'GET';
    }
  }catch{
    url=String(input);
  }

  const request={
    kind:'fetch',
    url,
    method:String(method).toUpperCase(),
    start:Date.now(),
    duration:0,
    status:null,
    statusText:'',
    type:'fetch',
    size:0,
    error:null,
    requestHeaders:normalizeHeaders(init?.headers),
    responseHeaders:{}
  };

  try{
    const response=await state.original.fetch.apply(this,arguments);

    request.status=response.status;
    request.statusText=response.statusText;
    request.duration=performance.now()-started;

    response.headers.forEach((v,k)=>{
      request.responseHeaders[k]=v;
    });

    const len=response.headers.get('content-length');
    if(len)request.size=Number(len)||0;

    pushNetwork(request);

    return response;
  }catch(error){
    request.error=error?.message||String(error);
    request.duration=performance.now()-started;

    pushNetwork(request);

    throw error;
  }
};

/* XHR */

const xhrMeta=new WeakMap();

XMLHttpRequest.prototype.open=function(method,url){
  const meta={
    method:String(method||'GET').toUpperCase(),
    url:'',
    start:0,
    requestHeaders:{}
  };

  try{
    meta.url=new URL(String(url),location.href).href;
  }catch{
    meta.url=String(url);
  }

  xhrMeta.set(this,meta);

  return state.original.XHR.open.apply(this,arguments);
};

XMLHttpRequest.prototype.setRequestHeader=function(name,value){
  const meta=xhrMeta.get(this);

  if(meta){
    meta.requestHeaders[name]=value;
  }

  return state.original.XHR.setRequestHeader.apply(this,arguments);
};

XMLHttpRequest.prototype.send=function(body){
  const xhr=this;
  const meta=xhrMeta.get(xhr);

  if(meta){
    meta.start=performance.now();

    const finish=()=>{
      if(meta.__done)return;
      meta.__done=true;

      const item={
        kind:'xhr',
        url:meta.url,
        method:meta.method,
        start:Date.now(),
        duration:performance.now()-meta.start,
        status:xhr.status||0,
        statusText:xhr.statusText||'',
        type:'xhr',
        size:0,
        error:null,
        requestHeaders:meta.requestHeaders,
        responseHeaders:{}
      };

      try{
        const headers=xhr.getAllResponseHeaders()||'';

        headers.trim().split(/[\r\n]+/).forEach(line=>{
          const i=line.indexOf(':');

          if(i>0){
            const key=line.slice(0,i).trim().toLowerCase();
            const value=line.slice(i+1).trim();
            item.responseHeaders[key]=value;
          }
        });
      }catch{}

      try{
        const text=xhr.responseText;
        if(typeof text==='string')item.size=new Blob([text]).size;
      }catch{}

      pushNetwork(item);
    };

    xhr.addEventListener('loadend',finish,{once:true});
    xhr.addEventListener('error',finish,{once:true});
    xhr.addEventListener('abort',finish,{once:true});
  }

  return state.original.XHR.send.apply(this,arguments);
};

/* PERFORMANCE RESOURCES */

const collectPerformanceNetwork=()=>{
  try{
    performance.getEntriesByType('resource').forEach(e=>{
      const url=e.name;

      if(state.network.some(x=>x.performanceName===url)){
        return;
      }

      state.network.push({
        id:`perf-${Math.random()}`,
        kind:'resource',
        performanceName:url,
        url,
        method:'—',
        start:Date.now(),
        duration:e.duration||0,
        status:null,
        statusText:'',
        type:e.initiatorType||'resource',
        size:e.transferSize||e.encodedBodySize||0,
        error:null,
        requestHeaders:{},
        responseHeaders:{},
        fromPerformance:true
      });
    });

    state.network=state.network.slice(0,1000);
  }catch{}
};

collectPerformanceNetwork();

const networkObserver=window.PerformanceObserver
?new PerformanceObserver(list=>{
    list.getEntries().forEach(e=>{
      if(!state.network.some(x=>x.performanceName===e.name)){
        state.network.unshift({
          id:`perf-${Math.random()}`,
          performanceName:e.name,
          kind:'resource',
          url:e.name,
          method:'—',
          start:Date.now(),
          duration:e.duration||0,
          status:null,
          statusText:'',
          type:e.initiatorType||'resource',
          size:e.transferSize||e.encodedBodySize||0,
          error:null,
          requestHeaders:{},
          responseHeaders:{},
          fromPerformance:true
        });

        state.network=state.network.slice(0,1000);
      }
    });

    updateBadges();

    if(currentTab==='network')renderNetwork();
  })
:null;

try{
  networkObserver?.observe({entryTypes:['resource']});
}catch{}

/* ============================================================
   CONSOLE CAPTURE
   ============================================================ */

const serialize=v=>{
  try{
    if(typeof v==='string')return v;

    if(v instanceof Error){
      return `${v.name}: ${v.message}`;
    }

    if(typeof v==='object'){
      return JSON.stringify(v,null,2);
    }

    return String(v);
  }catch{
    return '[Unserializable value]';
  }
};

const pushConsole=(level,args)=>{
  state.console.push({
    id:`c-${Date.now()}-${Math.random()}`,
    level,
    time:new Date(),
    text:args.map(serialize).join(' ')
  });

  if(state.console.length>1000){
    state.console.shift();
  }

  updateBadges();

  if(currentTab==='console'){
    renderConsole();
  }
};

['log','info','warn','error','debug'].forEach(level=>{
  console[level]=function(...args){
    pushConsole(level,args);

    try{
      return state.original.console[level].apply(console,args);
    }catch{}
  };
});

/* ============================================================
   BADGES
   ============================================================ */

const updateBadges=()=>{
  const n=root.querySelector('#wt-network-count');
  const c=root.querySelector('#wt-console-count');

  if(n)n.textContent=state.network.length;
  if(c)c.textContent=state.console.length;
};

/* ============================================================
   TAB SYSTEM
   ============================================================ */

const tabs=[...root.querySelectorAll('.wt-tab')];

tabs.forEach(tab=>{
  tab.onclick=()=>{
    currentTab=tab.dataset.tab;

    tabs.forEach(t=>t.classList.toggle('active',t===tab));

    renderCurrent();
  };
});

root.querySelector('#wt-refresh').onclick=()=>{
  renderCurrent();
};

root.querySelector('#wt-close').onclick=()=>{
  panel.classList.remove('open');
};

root.querySelector('#wt-launch').onclick=()=>{
  panel.classList.toggle('open');
  if(panel.classList.contains('open')){
    renderCurrent();
  }
};

const setToolbar=html=>{
  toolbar.innerHTML=html;
};

const renderCurrent=()=>{
  switch(currentTab){
    case 'overview':renderOverview();break;
    case 'network':renderNetwork();break;
    case 'console':renderConsole();break;
    case 'elements':renderElements();break;
    case 'source':renderSource();break;
    case 'storage':renderStorage();break;
    case 'resources':renderResources();break;
  }
};

/* ============================================================
   OVERVIEW
   ============================================================ */

const renderOverview=()=>{
  setToolbar(`
    <button class="wt-small-btn" id="wt-overview-copy">Copy URL</button>
  `);

  view.innerHTML=`
    <div class="wt-grid">
      <div class="wt-stat">
        <div class="wt-num">${document.links.length}</div>
        <div class="wt-stat-label">Links</div>
      </div>

      <div class="wt-stat">
        <div class="wt-num">${document.images.length}</div>
        <div class="wt-stat-label">Images</div>
      </div>

      <div class="wt-stat">
        <div class="wt-num">${document.forms.length}</div>
        <div class="wt-stat-label">Forms</div>
      </div>

      <div class="wt-stat">
        <div class="wt-num">${document.scripts.length}</div>
        <div class="wt-stat-label">Scripts</div>
      </div>
    </div>

    ${[
      ['Title',document.title],
      ['URL',location.href],
      ['Origin',location.origin],
      ['Protocol',location.protocol],
      ['Host',location.host],
      ['Path',location.pathname],
      ['Referrer',document.referrer||'(none)'],
      ['Ready State',document.readyState],
      ['Viewport',`${innerWidth} × ${innerHeight}`],
      ['User Agent',navigator.userAgent]
    ].map(x=>`
      <div class="wt-card">
        <div class="wt-card-title">${esc(x[0])}</div>
        <div class="wt-value">${esc(x[1])}</div>
      </div>
    `).join('')}
  `;

  root.querySelector('#wt-overview-copy').onclick=async e=>{
    const ok=await copy(location.href);
    e.currentTarget.textContent=ok?'Copied':'Failed';
    setTimeout(()=>e.currentTarget.textContent='Copy URL',1000);
  };
};

/* ============================================================
   NETWORK
   ============================================================ */

let networkFilter='all';

const renderNetwork=()=>{
  setToolbar(`
    <select class="wt-select" id="wt-net-type">
      <option value="all">All</option>
      <option value="fetch">Fetch</option>
      <option value="xhr">XHR</option>
      <option value="script">Script</option>
      <option value="link">CSS</option>
      <option value="img">Images</option>
      <option value="resource">Resources</option>
    </select>

    <button class="wt-small-btn" id="wt-net-refresh">Refresh</button>
    <button class="wt-small-btn danger" id="wt-net-clear">Clear</button>
  `);

  const typeSelect=root.querySelector('#wt-net-type');
  typeSelect.value=networkFilter;

  typeSelect.onchange=()=>{
    networkFilter=typeSelect.value;
    renderNetwork();
  };

  root.querySelector('#wt-net-refresh').onclick=()=>{
    collectPerformanceNetwork();
    renderNetwork();
  };

  root.querySelector('#wt-net-clear').onclick=()=>{
    state.network=[];
    renderNetwork();
    updateBadges();
  };

  const filtered=state.network.filter(x=>{
    if(networkFilter==='all')return true;

    return x.type===networkFilter||
      x.kind===networkFilter||
      (networkFilter==='resource'&&x.kind==='resource');
  });

  if(!filtered.length){
    view.innerHTML=`<div class="wt-empty">
      No network entries captured yet.<br><br>
      Fetch/XHR requests made after this tool was installed are captured automatically.
    </div>`;
    return;
  }

  view.innerHTML=`
    <table class="wt-table">
      <thead>
        <tr>
          <th style="width:52px">Type</th>
          <th>Request</th>
          <th style="width:55px">Status</th>
          <th style="width:65px">Time</th>
          <th style="width:60px">Size</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map((x,i)=>`
          <tr class="wt-row" data-network-index="${i}">
            <td>${esc(x.type||x.kind||'—')}</td>
            <td>
              <span class="wt-method">${esc(x.method||'—')}</span>
              <span class="wt-url">${esc(x.url)}</span>
            </td>
            <td class="${
              x.status>=200&&x.status<400
              ?'wt-status-ok'
              :x.status>=400
                ?'wt-status-bad'
                :'wt-status-neutral'
            }">${x.status??'—'}</td>
            <td>${formatMs(x.duration)}</td>
            <td>${formatBytes(x.size)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  [...view.querySelectorAll('[data-network-index]')].forEach((row,i)=>{
    row.onclick=()=>{
      const item=filtered[i];
      showNetworkDetail(item);
    };
  });
};

const showNetworkDetail=item=>{
  const headers=(obj,title)=>`
    <div class="wt-card">
      <div class="wt-card-title">${title}</div>
      ${
        Object.keys(obj||{}).length
        ?Object.entries(obj).map(([k,v])=>`
          <div class="wt-property">
            <div class="wt-property-key">${esc(k)}</div>
            <div class="wt-property-value">${esc(v)}</div>
          </div>
        `).join('')
        :'<div class="wt-muted">Not exposed by the browser.</div>'
      }
    </div>
  `;

  view.innerHTML=`
    <div class="wt-card">
      <button class="wt-small-btn" id="wt-net-back">
        ${ic(ICONS.back,12)} Back
      </button>
      <button class="wt-small-btn" id="wt-net-copy">Copy URL</button>
    </div>

    ${[
      ['Type',item.type||item.kind],
      ['Method',item.method],
      ['URL',item.url],
      ['Status',item.status??'Not available'],
      ['Status Text',item.statusText||'—'],
      ['Duration',formatMs(item.duration)],
      ['Transfer Size',formatBytes(item.size)],
      ['Captured',new Date(item.start).toLocaleTimeString()],
      ['Source',item.fromPerformance?'Performance API':'Fetch/XHR interception']
    ].map(x=>`
      <div class="wt-card">
        <div class="wt-card-title">${esc(x[0])}</div>
        <div class="wt-value">${esc(x[1])}</div>
      </div>
    `).join('')}

    ${headers(item.requestHeaders,'Request Headers')}
    ${headers(item.responseHeaders,'Response Headers')}

    ${item.error?`
      <div class="wt-card">
        <div class="wt-card-title">Error</div>
        <div class="wt-value" style="color:var(--red)">${esc(item.error)}</div>
      </div>
    `:''}

    <div class="wt-card">
      <div class="wt-card-title">Browser limitation</div>
      <div class="wt-value wt-muted">
        This is page-level network inspection. It is not equivalent to the
        privileged Network panel in browser DevTools. Requests made by the
        browser outside APIs observable to page JavaScript may not expose
        request/response headers or bodies.
      </div>
    </div>
  `;

  root.querySelector('#wt-net-back').onclick=renderNetwork;

  root.querySelector('#wt-net-copy').onclick=async e=>{
    const ok=await copy(item.url);
    e.currentTarget.textContent=ok?'Copied':'Failed';
    setTimeout(()=>e.currentTarget.textContent='Copy URL',1000);
  };
};

/* ============================================================
   CONSOLE
   ============================================================ */

const renderConsole=()=>{
  setToolbar(`
    <button class="wt-small-btn" id="wt-console-clear">Clear</button>
    <button class="wt-small-btn" id="wt-console-info">Info</button>
  `);

  const lines=state.console;

  view.innerHTML=`
    <div class="wt-console">
      ${
        lines.length
        ?lines.map(x=>`
          <div class="wt-console-line ${esc(x.level)}">
            <span class="wt-console-time">${x.time.toLocaleTimeString()}</span>
            ${esc(x.text)}
          </div>
        `).join('')
        :`<div class="wt-empty">Console is empty.</div>`
      }
    </div>

    <input id="wt-console-input"
      autocomplete="off"
      spellcheck="false"
      placeholder="JavaScript expression — press Enter">
  `;

  root.querySelector('#wt-console-clear').onclick=()=>{
    state.console=[];
    renderConsole();
    updateBadges();
  };

  root.querySelector('#wt-console-info').onclick=()=>{
    pushConsole('info',[
      'Page-level console. JavaScript entered here executes in the page context.'
    ]);
  };

  const input=root.querySelector('#wt-console-input');

  input.onkeydown=e=>{
    if(e.key!=='Enter')return;

    const code=input.value.trim();

    if(!code)return;

    pushConsole('command',[`> ${code}`]);

    try{
      const result=(0,eval)(code);
      pushConsole('log',[result]);
    }catch(error){
      pushConsole('error',[error]);
    }

    input.value='';
  };

  view.scrollTop=view.scrollHeight;
};

/* ============================================================
   ELEMENTS / DOM INSPECTOR
   ============================================================ */

const nodeLabel=el=>{
  if(el.nodeType===3){
    const text=el.textContent.trim().replace(/\s+/g,' ');
    return text?`"${text.slice(0,100)}"`:'text';
  }

  if(el.nodeType!==1)return el.nodeName;

  let out=el.tagName.toLowerCase();

  if(el.id)out+=`#${el.id}`;

  if(typeof el.className==='string'&&el.className.trim()){
    out+=el.className.trim()
      .split(/\s+/)
      .slice(0,3)
      .map(x=>`.${x}`)
      .join('');
  }

  return out;
};

const renderTreeNode=(node,depth=0)=>{
  if(!node)return '';

  if(node.nodeType===3){
    const txt=node.textContent.trim();

    if(!txt)return '';

    return `
      <div class="wt-node" style="margin-left:${depth*14}px">
        <div class="wt-node-line wt-node-text">
          ${esc(txt.slice(0,150))}
        </div>
      </div>
    `;
  }

  if(node.nodeType!==1)return '';

  const children=[...node.childNodes]
    .slice(0,100)
    .map(n=>renderTreeNode(n,depth+1))
    .join('');

  return `
    <div class="wt-node" style="margin-left:${depth*14}px">
      <div class="wt-node-line" data-inspect-node>
        <span class="wt-node-name">${esc(node.tagName.toLowerCase())}</span>
        ${
          node.id
          ?` <span class="wt-node-attr">#${esc(node.id)}</span>`
          :''
        }
      </div>
      ${children}
    </div>
  `;
};

const renderElements=()=>{
  setToolbar(`
    <button class="wt-small-btn" id="wt-dom-picker">Pick Element</button>
    <button class="wt-small-btn" id="wt-dom-body">Body</button>
  `);

  view.innerHTML=`
    <div class="wt-card">
      <div class="wt-card-title">DOM</div>
      <div class="wt-value wt-muted">
        Select an element from the tree or use Pick Element.
      </div>
    </div>

    <div class="wt-tree">
      ${renderTreeNode(document.documentElement)}
    </div>
  `;

  root.querySelector('#wt-dom-body').onclick=()=>{
    showElementDetails(document.body);
  };

  root.querySelector('#wt-dom-picker').onclick=()=>{
    enablePicker();
  };

  [...view.querySelectorAll('[data-inspect-node]')].forEach((line)=>{
    line.onclick=e=>{
      e.stopPropagation();

      const label=line.querySelector('.wt-node-name')?.textContent;

      const candidates=[...document.querySelectorAll(label||'*')];

      if(candidates[0])showElementDetails(candidates[0]);
    };
  });
};

let pickerActive=false;

const enablePicker=()=>{
  if(pickerActive)return;

  pickerActive=true;

  const highlight=document.createElement('style');

  highlight.id='wt-picker-style';

  highlight.textContent=`
    [data-wt-picker-highlight]{
      outline:2px solid #78a2ff!important;
      outline-offset:2px!important;
      cursor:crosshair!important;
    }
  `;

  document.head.appendChild(highlight);

  const over=e=>{
    if(root.contains(e.target))return;

    e.target.setAttribute('data-wt-picker-highlight','');
  };

  const out=e=>{
    try{
      e.target.removeAttribute('data-wt-picker-highlight');
    }catch{}
  };

  const click=e=>{
    if(root.contains(e.target))return;

    e.preventDefault();
    e.stopPropagation();

    cleanup();

    showElementDetails(e.target);
  };

  const cleanup=()=>{
    pickerActive=false;

    document.removeEventListener('mouseover',over,true);
    document.removeEventListener('mouseout',out,true);
    document.removeEventListener('click',click,true);

    document.querySelectorAll('[data-wt-picker-highlight]')
      .forEach(x=>x.removeAttribute('data-wt-picker-highlight'));

    highlight.remove();
  };

  document.addEventListener('mouseover',over,true);
  document.addEventListener('mouseout',out,true);
  document.addEventListener('click',click,true);
};

const showElementDetails=el=>{
  state.selectedElement=el;

  if(!el)return;

  const attrs=el.attributes
    ?[...el.attributes]
    :[];

  const rect=el.getBoundingClientRect();

  view.innerHTML=`
    <div class="wt-card">
      <button class="wt-small-btn" id="wt-elements-back">Back</button>
    </div>

    <div class="wt-card">
      <div class="wt-card-title">Element</div>
      <div class="wt-value">
        ${esc(nodeLabel(el))}
      </div>
    </div>

    <div class="wt-card">
      <div class="wt-card-title">Geometry</div>
      ${[
        ['X',rect.x],
        ['Y',rect.y],
        ['Width',rect.width],
        ['Height',rect.height]
      ].map(x=>`
        <div class="wt-property">
          <div class="wt-property-key">${x[0]}</div>
          <div class="wt-property-value">${Number(x[1]).toFixed(1)} px</div>
        </div>
      `).join('')}
    </div>

    <div class="wt-card">
      <div class="wt-card-title">Attributes</div>
      ${
        attrs.length
        ?attrs.map(a=>`
          <div class="wt-property">
            <div class="wt-property-key">${esc(a.name)}</div>
            <div class="wt-property-value">${esc(a.value)}</div>
          </div>
        `).join('')
        :'<div class="wt-muted">No attributes.</div>'
      }
    </div>

    <div class="wt-card">
      <div class="wt-card-title">Text</div>
      <div class="wt-value">${esc((el.innerText||'').slice(0,4000))}</div>
    </div>

    <div class="wt-card">
      <div class="wt-card-title">HTML</div>
      <pre class="wt-code">${esc(el.outerHTML.slice(0,12000))}</pre>
    </div>

    <div class="wt-card">
      <div class="wt-card-title">Computed Display</div>
      <div class="wt-value">
        ${esc(getComputedStyle(el).display)}
      </div>
    </div>
  `;

  root.querySelector('#wt-elements-back').onclick=renderElements;
};

/* ============================================================
   SOURCE
   ============================================================ */

const renderSource=()=>{
  setToolbar(`
    <button class="wt-small-btn" id="wt-source-copy">Copy HTML</button>
    <button class="wt-small-btn" id="wt-source-refresh">Refresh</button>
  `);

  const raw=document.documentElement.outerHTML;

  view.innerHTML=`
    <div class="wt-card">
      <div class="wt-card-title">Current DOM Source</div>
      <div class="wt-value wt-muted">
        This is the current live DOM after JavaScript modifications.
        It is not necessarily identical to the original server response.
      </div>
    </div>

    <div class="wt-code-wrap">
      <div class="wt-code-head">
        <button class="wt-copy" id="wt-copy-source">Copy</button>
      </div>
      <pre class="wt-code">${htmlHighlight(raw)}</pre>
    </div>
  `;

  root.querySelector('#wt-source-copy').onclick=async()=>{
    await copy(raw);
  };

  root.querySelector('#wt-copy-source').onclick=async e=>{
    const ok=await copy(raw);
    e.currentTarget.textContent=ok?'Copied':'Failed';
    setTimeout(()=>e.currentTarget.textContent='Copy',900);
  };

  root.querySelector('#wt-source-refresh').onclick=renderSource;
};

/* ============================================================
   STORAGE EDITOR
   ============================================================ */

let storageType='local';

const renderStorage=()=>{
  setToolbar(`
    <select class="wt-select" id="wt-storage-type">
      <option value="local">Local Storage</option>
      <option value="session">Session Storage</option>
    </select>

    <button class="wt-small-btn" id="wt-storage-add">Add</button>
    <button class="wt-small-btn danger" id="wt-storage-clear">Clear</button>
  `);

  const select=root.querySelector('#wt-storage-type');
  select.value=storageType;

  select.onchange=()=>{
    storageType=select.value;
    renderStorage();
  };

  const store=storageType==='local'
    ?localStorage
    :sessionStorage;

  let rows=[];

  try{
    for(let i=0;i<store.length;i++){
      const key=store.key(i);

      if(key!==null){
        rows.push([key,store.getItem(key)]);
      }
    }
  }catch(e){
    view.innerHTML=`
      <div class="wt-card">
        <div class="wt-value" style="color:var(--red)">
          ${esc(e.message)}
        </div>
      </div>
    `;
    return;
  }

  view.innerHTML=`
    <div class="wt-card">
      <div class="wt-card-title">${storageType==='local'?'Local':'Session'} Storage</div>
      <div class="wt-value">${rows.length} item(s)</div>
    </div>

    ${
      rows.length
      ?rows.map((r,i)=>`
        <div class="wt-card">
          <div style="display:flex;gap:6px">
            <input
              class="wt-input"
              data-storage-key="${i}"
              value="${attrEsc(r[0])}"
              placeholder="Key"
            >
            <button class="wt-small-btn" data-storage-save="${i}">Save</button>
            <button class="wt-small-btn danger" data-storage-delete="${i}">Delete</button>
          </div>

          <textarea
            class="wt-input"
            data-storage-value="${i}"
            style="width:100%;margin-top:7px;min-height:75px;resize:vertical"
          >${esc(r[1])}</textarea>
        </div>
      `).join('')
      :'<div class="wt-empty">Storage is empty.</div>'
    }
  `;

  root.querySelector('#wt-storage-clear').onclick=()=>{
    if(confirm('Clear all storage items?')){
      store.clear();
      renderStorage();
    }
  };

  root.querySelector('#wt-storage-add').onclick=()=>{
    const key=prompt('Storage key:');

    if(key===null)return;

    const value=prompt('Storage value:','');

    if(value===null)return;

    try{
      store.setItem(key,value);
      renderStorage();
    }catch(e){
      alert(e.message);
    }
  };

  rows.forEach((r,i)=>{
    root.querySelector(`[data-storage-save="${i}"]`).onclick=()=>{
      const keyEl=root.querySelector(`[data-storage-key="${i}"]`);
      const valEl=root.querySelector(`[data-storage-value="${i}"]`);

      try{
        if(keyEl.value!==r[0]){
          store.removeItem(r[0]);
        }

        store.setItem(keyEl.value,valEl.value);
        renderStorage();
      }catch(e){
        alert(e.message);
      }
    };

    root.querySelector(`[data-storage-delete="${i}"]`).onclick=()=>{
      store.removeItem(r[0]);
      renderStorage();
    };
  });
};

/* ============================================================
   CSS / JS RESOURCES
   ============================================================ */

const getResources=()=>{
  const cssResources=[];
  const jsResources=[];

  [...document.querySelectorAll('link[rel~="stylesheet"][href]')]
    .forEach(x=>{
      cssResources.push({
        url:x.href,
        type:'css',
        element:x
      });
    });

  [...document.querySelectorAll('style')]
    .forEach((x,i)=>{
      cssResources.push({
        url:`inline-style-${i+1}`,
        type:'css-inline',
        element:x,
        content:x.textContent||''
      });
    });

  [...document.scripts]
    .forEach((x,i)=>{
      jsResources.push({
        url:x.src||`inline-script-${i+1}`,
        type:x.src?'js':'js-inline',
        element:x,
        content:x.src?'':x.textContent||''
      });
    });

  return [...cssResources,...jsResources];
};

let resourceFilter='all';

const renderResources=()=>{
  setToolbar(`
    <select class="wt-select" id="wt-resource-type">
      <option value="all">All</option>
      <option value="css">CSS</option>
      <option value="js">JavaScript</option>
    </select>
  `);

  const resources=getResources();

  const select=root.querySelector('#wt-resource-type');

  select.value=resourceFilter;

  select.onchange=()=>{
    resourceFilter=select.value;
    renderResources();
  };

  const filtered=resources.filter(r=>{
    if(resourceFilter==='all')return true;
    return r.type.startsWith(resourceFilter);
  });

  if(!filtered.length){
    view.innerHTML=`<div class="wt-empty">No resources found.</div>`;
    return;
  }

  view.innerHTML=`
    <div class="wt-split">
      <div class="wt-list">
        ${filtered.map((r,i)=>`
          <div class="wt-list-item" data-resource="${i}">
            <div class="wt-list-title">
              ${r.type.startsWith('css')?'CSS':'JS'}
              · ${esc(r.url)}
            </div>
            <div class="wt-list-sub">
              ${r.type.includes('inline')?'Inline resource':'External resource'}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="wt-detail" id="wt-resource-detail">
        <div class="wt-empty">Select a resource.</div>
      </div>
    </div>
  `;

  [...view.querySelectorAll('[data-resource]')].forEach((el,i)=>{
    el.onclick=()=>{
      view.querySelectorAll('.wt-list-item')
        .forEach(x=>x.classList.remove('active'));

      el.classList.add('active');

      showResource(filtered[i]);
    };
  });
};

const showResource=async resource=>{
  const detail=root.querySelector('#wt-resource-detail');

  if(!detail)return;

  detail.innerHTML=`
    <div class="wt-resource-body">
      <div class="wt-card-title">${resource.type}</div>
      <div class="wt-value">${esc(resource.url)}</div>
    </div>
    <div class="wt-empty">Loading...</div>
  `;

  let content=resource.content||'';

  if(!content&&resource.url&&/^https?:/i.test(resource.url)){
    try{
      const response=await fetch(resource.url,{credentials:'same-origin'});

      if(response.ok){
        content=await response.text();
      }else{
        content=`Unable to load resource. HTTP ${response.status}`;
      }
    }catch(e){
      content=`Unable to read resource from page context: ${e.message}`;
    }
  }

  detail.innerHTML=`
    <div class="wt-resource-body">
      <div class="wt-card">
        <div class="wt-card-title">Resource</div>
        <div class="wt-value">${esc(resource.url)}</div>
      </div>

      <div class="wt-card">
        <button class="wt-copy" id="wt-resource-copy">Copy</button>
        <div class="wt-card-title">Content</div>
      </div>

      <div class="wt-code-wrap">
        <pre class="wt-code">${esc(content.slice(0,200000))}</pre>
      </div>
    </div>
  `;

  root.querySelector('#wt-resource-copy').onclick=async e=>{
    const ok=await copy(content);
    e.currentTarget.textContent=ok?'Copied':'Failed';

    setTimeout(()=>{
      e.currentTarget.textContent='Copy';
    },900);
  };
};

/* ============================================================
   EXTRA TOOLS IN TOOLBAR / TAB LONGER FUNCTIONS
   ============================================================ */

/* Keyboard shortcut:
   Ctrl/Cmd + Shift + W toggles toolkit.
*/
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==='w'){
    e.preventDefault();
    panel.classList.toggle('open');

    if(panel.classList.contains('open')){
      renderCurrent();
    }
  }

  if(e.key==='Escape'){
    if(pickerActive)return;
    panel.classList.remove('open');
  }
},true);

/* Search current panel */

search.oninput=()=>{
  const q=search.value.toLowerCase().trim();

  if(currentTab==='network'){
    document.querySelectorAll('#wt-view .wt-row').forEach(row=>{
      row.style.display=
        !q||row.textContent.toLowerCase().includes(q)
        ?''
        :'none';
    });
  }else{
    document.querySelectorAll('#wt-view .wt-card,#wt-view .wt-list-item').forEach(el=>{
      el.style.display=
        !q||el.textContent.toLowerCase().includes(q)
        ?''
        :'none';
    });
  }
};

/* ============================================================
   DESTROY / CLEANUP
   ============================================================ */

state.destroy=()=>{
  state.destroyed=true;

  try{
    window.fetch=state.original.fetch;

    XMLHttpRequest.prototype.open=state.original.XHR.open;
    XMLHttpRequest.prototype.send=state.original.XHR.send;
    XMLHttpRequest.prototype.setRequestHeader=
      state.original.XHR.setRequestHeader;

    console.log=state.original.console.log;
    console.info=state.original.console.info;
    console.warn=state.original.console.warn;
    console.error=state.original.console.error;
    console.debug=state.original.console.debug;
  }catch{}

  try{
    networkObserver?.disconnect();
  }catch{}

  root.remove();

  style.remove();

  document.querySelectorAll('[data-wt-picker-highlight]')
    .forEach(x=>x.removeAttribute('data-wt-picker-highlight'));

  document.querySelector('#wt-picker-style')?.remove();
};

window.__WEBTOOLS_V2.destroy=state.destroy;

/* ============================================================
   INITIAL RENDER
   ============================================================ */

updateBadges();
renderOverview();

})();

