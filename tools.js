(() => {
'use strict';

if (window.__WEBTOOLS) {
  window.__WEBTOOLS.remove();
  delete window.__WEBTOOLS;
  return;
}

const root = document.createElement('div');
window.__WEBTOOLS = root;

const esc = v => String(v ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const Z = 2147483647;

/* ---------- Minimal line-icon set ---------- */
const ic = (paths, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const ICONS = {
  brand: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
  drag: '<circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/>',
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  overview: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  download: '<path d="M12 3v12"/><polyline points="7 10 12 15 17 10"/><path d="M5 21h14a2 2 0 0 0 2-2v-2"/><path d="M3 17v2a2 2 0 0 0 2 2"/>',
  pdf: '<path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 15h2a2 2 0 0 0 0-4H8v7"/><path d="M13 11v7h1a3.5 3.5 0 0 0 0-7z"/><line x1="19" y1="11" x2="16" y2="11"/><line x1="16" y1="11" x2="16" y2="18"/>',
  links: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  images: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  forms: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><polyline points="9 14 11 16 15 12"/>',
  headings: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
  inspector: '<circle cx="12" cy="12" r="9"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>',
  localStorage: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M20 12c0 1.66-3.58 3-8 3s-8-1.34-8-3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/>',
  sessionStorage: '<path d="M22 18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  performance: '<polyline points="22 12 18 12 15 20 9 4 6 12 2 12"/>',
  resources: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  cookies: '<path d="M12 22s7-3.5 7-9V6l-7-3-7 3v7c0 5.5 7 9 7 9z"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  source: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  scripts: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>'
};

const css = `
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
  touch-action:none;
}

#wt-launch{
  display:flex;
  align-items:center;
  gap:8px;
  border:1px solid #ffffff14;
  background:linear-gradient(160deg,#181b21,#0c0e12);
  color:#fff;
  border-radius:999px;
  padding:12px 14px 12px 17px;
  font-size:13.5px;
  font-weight:600;
  letter-spacing:.01em;
  box-shadow:0 10px 28px #0009,inset 0 1px 0 #ffffff10;
  cursor:grab;
  transition:transform .15s ease,box-shadow .15s ease;
  user-select:none;
}
#wt-launch.wt-dragging{
  cursor:grabbing;
  transform:scale(1.04);
  box-shadow:0 16px 40px #000c,inset 0 1px 0 #ffffff10;
}
#wt-launch:active:not(.wt-dragging){transform:scale(.96)}
#wt-launch svg{opacity:.9;pointer-events:none}
#wt-launch span{pointer-events:none}
#wt-drag-hint{
  opacity:.45;
  margin-left:2px;
  display:flex;
}

#wt-panel{
  display:none;
  position:fixed;
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
  z-index:${Z};
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
  display:flex;
  flex-direction:column;
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
  flex:0 0 auto;
}

#wt-box-head{
  padding:11px 17px 13px;
  border-bottom:1px solid var(--wt-border-soft);
  display:flex;
  justify-content:space-between;
  align-items:center;
  flex:0 0 auto;
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
  flex:1 1 auto;
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
.wt-domain{
  display:inline-block;
  background:#ffffff0d;
  border:1px solid var(--wt-border-soft);
  color:var(--wt-text-dim);
  font-size:10px;
  font-weight:700;
  padding:2px 7px;
  border-radius:999px;
  margin-bottom:5px;
}
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
  white-space:nowrap;
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
  padding:9px 7px;
  text-align:left;
  vertical-align:top;
}
.wt-table tr:hover td{background:#ffffff05}
.wt-table th{
  color:var(--wt-text-dim);
  font-weight:700;
  font-size:10px;
  text-transform:uppercase;
  letter-spacing:.04em;
  position:sticky;
  top:0;
  background:var(--wt-panel);
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

/* ---- sticky source-code toolbar + highlighted code ---- */
#wt-content.wt-source-content{padding-top:0}
.wt-source-bar{
  position:sticky;
  top:0;
  z-index:4;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
  padding:12px 0 10px;
  margin-bottom:6px;
  background:linear-gradient(var(--wt-panel) 78%, transparent);
}
.wt-source-bar .wt-copy{float:none}
.wt-source-meta{
  color:var(--wt-text-dim);
  font-size:11px;
  font-weight:600;
}
.wt-code-wrap{
  background:#0b0d11;
  border:1px solid var(--wt-border-soft);
  border-radius:12px;
  overflow:auto;
}
.wt-code-wrap pre{
  margin:0;
  padding:13px;
}
.wt-code-wrap code{
  font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
  font-size:11.5px;
  line-height:1.6;
  white-space:pre;
}
.hljs{background:transparent!important;padding:0!important;color:#c9d1d9}

::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-thumb{background:#ffffff22;border-radius:99px}

@media(max-width:600px){
  #wt-box{border-radius:18px 18px 0 0}
}

@media print{
  #wt-app,
  #wt-modal{
    display:none!important;
  }
}
`;

const style = document.createElement('style');
style.id = 'wt-style';
style.textContent = css;
document.head.appendChild(style);

root.id = 'wt-app';

root.innerHTML = `
<button id="wt-launch" title="Drag to move · Tap to open">
  ${ic(ICONS.brand, 16)}<span>Web Tools</span><span id="wt-drag-hint">${ic(ICONS.drag, 13)}</span>
</button>

<div id="wt-panel">
  <div id="wt-head">
    <div>
      <div id="wt-title">${ic(ICONS.brand, 15)}Web Tools</div>
      <div id="wt-sub">Browser inspection toolkit</div>
    </div>
    <button id="wt-close">${ic(ICONS.close, 15)}</button>
  </div>

  <div id="wt-search-wrap">
    <span id="wt-search-ico">${ic(ICONS.search, 15)}</span>
    <input id="wt-search" placeholder="Search tools...">
  </div>

  <div id="wt-tools"></div>
</div>
`;

document.body.appendChild(root);

const launch = root.querySelector('#wt-launch');
const panel = root.querySelector('#wt-panel');
const tools = root.querySelector('#wt-tools');
const search = root.querySelector('#wt-search');

/* =========================================================
   MODAL HELPERS
   ========================================================= */

const modal = (title, html) => {
  const old = document.getElementById('wt-modal');
  if (old) old.remove();

  const m = document.createElement('div');
  m.id = 'wt-modal';

  m.innerHTML = `
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

  m.querySelector('#wt-box-close').onclick = () => m.remove();

  m.addEventListener('click', e => {
    if (e.target === m) m.remove();
  });

  return m;
};

const setModalStatus = (m, status, progress) => {
  if (!m) return;

  const statusEl = m.querySelector('[data-wt-status]');
  const bar = m.querySelector('[data-wt-progress]');

  if (statusEl) statusEl.textContent = status;
  if (bar && typeof progress === 'number') {
    bar.style.width = Math.max(0, Math.min(100, progress)) + '%';
  }
};

const copy = async text => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
};

const urlHTML = url => {
  const safe = esc(url);
  return `<a class="wt-url" href="${safe}" target="_blank" rel="noopener noreferrer">${safe}</a>`;
};

const hostnameOf = url => {
  try { return new URL(url, location.href).hostname; } catch { return ''; }
};

const addTool = (iconKey, title, description, fn) => {
  const b = document.createElement('button');
  b.className = 'wt-tool';
  b.dataset.search = (title + ' ' + description).toLowerCase();
  b.innerHTML = `
    <div class="wt-tool-ico">${ic(ICONS[iconKey], 17)}</div>
    <div class="wt-tool-body">
      <div class="wt-tool-title">${esc(title)}</div>
      <div class="wt-tool-desc">${esc(description)}</div>
    </div>
  `;
  b.onclick = fn;
  tools.appendChild(b);
};

const card = (label, value, copyValue) => {
  return `
    <div class="wt-card">
      <div class="wt-label">${esc(label)}</div>
      <div class="wt-value">
        ${copyValue !== undefined
          ? `<button class="wt-copy" data-copy="${esc(copyValue)}">Copy</button>`
          : ''}
        ${value}
      </div>
    </div>
  `;
};

const empty = text => `<div class="wt-empty">${esc(text)}</div>`;

const bindCopies = () => {
  document.querySelectorAll('#wt-content .wt-copy').forEach(b => {
    b.onclick = async () => {
      const ok = await copy(b.dataset.copy);
      b.textContent = ok ? 'Copied' : 'Failed';
      setTimeout(() => b.textContent = 'Copy', 1200);
    };
  });
};

/* =========================================================
   PAGE OVERVIEW
   ========================================================= */

addTool(
  'overview', 'Page Overview',
  'Title, URL, domain and document statistics',
  () => {
    const rows = [
      ['Title', esc(document.title)],
      ['URL', urlHTML(location.href)],
      ['Domain', esc(location.hostname)],
      ['Protocol', esc(location.protocol)],
      ['Path', esc(location.pathname)],
      ['Referrer', esc(document.referrer || '(none)')]
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
      ${rows.map(x => card(x[0], x[1], x[1])).join('')}`
    );

    bindCopies();
  }
);

/* =========================================================
   SHARED SCRIPT/CSS LOADER
   ========================================================= */

const loadScriptOnce = (src) => {
  return new Promise((resolve, reject) => {
    const existing = [...document.scripts].find(s => s.src === src);

    if (existing) {
      if (existing.dataset.wtLoaded) { resolve(); return; }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Script failed to load.')), { once: true });
      return;
    }

    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => { s.dataset.wtLoaded = '1'; resolve(); };
    s.onerror = () => reject(new Error('Script failed to load.'));
    document.head.appendChild(s);
  });
};

const loadStyleOnce = (href, id) => {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
};

let hljsLoadPromise = null;

const loadHLJS = () => {
  if (window.hljs) return Promise.resolve(window.hljs);

  if (hljsLoadPromise) return hljsLoadPromise;

  hljsLoadPromise = (async () => {
    loadStyleOnce(
      'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css',
      'wt-hljs-theme'
    );

    await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js');

    if (!window.hljs) throw new Error('Highlighter unavailable.');

    if (!window.hljs.getLanguage('xml')) {
      await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/xml.min.js');
    }

    return window.hljs;
  })();

  return hljsLoadPromise;
};

/* =========================================================
   FRONTEND ZIP EXPORT
   ========================================================= */

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  return table;
})();

const crc32 = data => {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = crcTable[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const u16 = n => { const a = new Uint8Array(2); new DataView(a.buffer).setUint16(0, n, true); return a; };
const u32 = n => { const a = new Uint8Array(4); new DataView(a.buffer).setUint32(0, n >>> 0, true); return a; };

const concatBytes = parts => {
  let total = 0;
  for (const p of parts) total += p.length;
  const out = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) { out.set(p, offset); offset += p.length; }
  return out;
};

const makeStoredZip = entries => {
  const enc = new TextEncoder();
  const local = [];
  const central = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = enc.encode(entry.name);
    const data = entry.data instanceof Uint8Array ? entry.data : new Uint8Array(entry.data);
    const crc = crc32(data);

    const localHeader = concatBytes([
      u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0),
      u32(crc), u32(data.length), u32(data.length),
      u16(nameBytes.length), u16(0), nameBytes
    ]);

    local.push(localHeader, data);

    const centralHeader = concatBytes([
      u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0),
      u32(crc), u32(data.length), u32(data.length),
      u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0),
      u32(0), u32(offset), nameBytes
    ]);

    central.push(centralHeader);
    offset += localHeader.length + data.length;
  }

  const centralBytes = concatBytes(central);
  const localBytes = concatBytes(local);

  const end = concatBytes([
    u32(0x06054b50), u16(0), u16(0),
    u16(entries.length), u16(entries.length),
    u32(centralBytes.length), u32(localBytes.length), u16(0)
  ]);

  return new Blob([localBytes, centralBytes, end], { type: 'application/zip' });
};

const safeFileName = name => String(name || 'file')
  .replace(/[<>:"/\\|?*\x00-\x1f]/g, '-')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 180) || 'file';

const resourceName = (url, fallback = 'resource') => {
  try {
    const u = new URL(url, location.href);
    let name = decodeURIComponent(u.pathname.split('/').pop() || fallback);
    name = name.replace(/[?#].*$/, '');
    if (!name || name === '.' || name === '..') name = fallback;
    return safeFileName(name);
  } catch { return safeFileName(fallback); }
};

const uniquePath = (path, used) => {
  if (!used.has(path)) { used.add(path); return path; }
  const dot = path.lastIndexOf('.');
  const base = dot > 0 ? path.slice(0, dot) : path;
  const ext = dot > 0 ? path.slice(dot) : '';
  let i = 2;
  while (used.has(`${base}-${i}${ext}`)) i++;
  path = `${base}-${i}${ext}`;
  used.add(path);
  return path;
};

const isFetchableURL = url => {
  try {
    const u = new URL(url, location.href);
    return /^https?:$/i.test(u.protocol);
  } catch { return false; }
};

const fetchResource = async (url, timeout = 12000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { method: 'GET', credentials: 'same-origin', cache: 'default', signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (response.type === 'opaque') throw new Error('Opaque response');

    return {
      url: response.url || url,
      contentType: response.headers.get('content-type') || '',
      buffer: await response.arrayBuffer()
    };
  } finally {
    clearTimeout(timer);
  }
};

const collectFrontendResources = () => {
  const list = [];
  const seen = new Set();

  const add = (url, type) => {
    if (!url) return;
    try {
      const u = new URL(url, location.href);
      if (!/^https?:$/i.test(u.protocol)) return;
      const key = u.href;
      if (seen.has(key)) return;
      seen.add(key);
      list.push({ url: key, type });
    } catch {}
  };

  document.querySelectorAll('link[href]').forEach(el => {
    const rel = (el.getAttribute('rel') || '').toLowerCase();
    if (rel.includes('stylesheet') || rel.includes('icon') || rel.includes('manifest') || rel.includes('preload') || rel.includes('modulepreload')) {
      add(el.href, rel.includes('stylesheet') ? 'css' : 'asset');
    }
  });

  document.querySelectorAll('script[src]').forEach(el => add(el.src, 'js'));
  document.querySelectorAll('img[src],source[src],video[src],audio[src],iframe[src]').forEach(el => add(el.src, 'asset'));

  document.querySelectorAll('[srcset]').forEach(el => {
    (el.getAttribute('srcset') || '').split(',').forEach(part => {
      const candidate = part.trim().split(/\s+/)[0];
      if (candidate) add(candidate, 'asset');
    });
  });

  document.querySelectorAll('[poster]').forEach(el => add(el.getAttribute('poster'), 'asset'));

  document.querySelectorAll('link[href]').forEach(el => {
    const href = el.href;
    if (href && /\.(woff2?|ttf|otf|eot|svg|png|jpe?g|gif|webp|avif|ico|mp4|webm|mp3|wav)(\?|#|$)/i.test(href.toLowerCase())) {
      add(href, 'asset');
    }
  });

  try {
    performance.getEntriesByType('resource').forEach(entry => {
      if (!entry || !entry.name) return;
      const type = entry.initiatorType === 'script' ? 'js' : entry.initiatorType === 'css' ? 'css' : 'asset';
      add(entry.name, type);
    });
  } catch {}

  return list;
};

const sanitizeExportDocument = () => {
  const clone = document.documentElement.cloneNode(true);
  clone.querySelectorAll('#wt-app,#wt-modal,#wt-style,#wt-hljs-theme').forEach(el => el.remove());

  clone.querySelectorAll('input,textarea,select').forEach(el => {
    try {
      if (el.tagName === 'INPUT') {
        const type = (el.getAttribute('type') || '').toLowerCase();
        if (type === 'checkbox' || type === 'radio') el.removeAttribute('checked');
        else el.removeAttribute('value');
      } else if (el.tagName === 'TEXTAREA') {
        el.textContent = '';
      } else if (el.tagName === 'SELECT') {
        el.querySelectorAll('option').forEach(o => o.removeAttribute('selected'));
      }
    } catch {}
  });

  return clone;
};

const pathForResource = (resource, used) => {
  const name = resourceName(resource.url, 'resource');
  let folder = 'assets';
  if (resource.type === 'css') folder = 'css';
  if (resource.type === 'js') folder = 'js';
  return uniquePath(`${folder}/${name}`, used);
};

const rewriteHTMLResourceReferences = (doc, mapping) => {
  const rewrite = url => {
    try {
      const absolute = new URL(url, location.href).href;
      return mapping.get(absolute) || url;
    } catch { return url; }
  };

  doc.querySelectorAll('link[href]').forEach(el => {
    const o = el.getAttribute('href'); if (!o) return;
    const r = rewrite(o); if (r !== o) el.setAttribute('href', r);
  });

  doc.querySelectorAll('script[src]').forEach(el => {
    const o = el.getAttribute('src'); if (!o) return;
    const r = rewrite(o); if (r !== o) el.setAttribute('src', r);
  });

  doc.querySelectorAll('img[src],source[src],video[src],audio[src],iframe[src]').forEach(el => {
    const o = el.getAttribute('src'); if (!o) return;
    const r = rewrite(o); if (r !== o) el.setAttribute('src', r);
  });

  doc.querySelectorAll('[poster]').forEach(el => {
    const o = el.getAttribute('poster'); if (!o) return;
    const r = rewrite(o); if (r !== o) el.setAttribute('poster', r);
  });

  doc.querySelectorAll('[srcset]').forEach(el => {
    const o = el.getAttribute('srcset') || '';
    const r = o.split(',').map(part => {
      const bits = part.trim().split(/\s+/);
      if (!bits[0]) return part;
      bits[0] = rewrite(bits[0]);
      return bits.join(' ');
    }).join(', ');
    el.setAttribute('srcset', r);
  });
};

const rewriteCSSReferences = (cssText, cssURL, mapping) => cssText.replace(
  /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
  (full, quote, value) => {
    const raw = value.trim();
    if (!raw || raw.startsWith('data:') || raw.startsWith('#') || raw.startsWith('blob:')) return full;
    try {
      const absolute = new URL(raw, cssURL).href;
      const mapped = mapping.get(absolute);
      if (mapped) return `url("${mapped}")`;
    } catch {}
    return full;
  }
);

const makeTextBytes = text => new TextEncoder().encode(text);

const downloadBlob = (blob, name) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
};

let jsZipLoadPromise = null;

const loadJSZip = () => {
  if (window.JSZip) return Promise.resolve(window.JSZip);
  if (jsZipLoadPromise) return jsZipLoadPromise;
  jsZipLoadPromise = loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js')
    .then(() => window.JSZip);
  return jsZipLoadPromise;
};

const createZipWithJSZip = async (JSZip, entries) => {
  const zip = new JSZip();
  for (const entry of entries) zip.file(entry.name, entry.data);
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
};

const exportFrontendZIP = async () => {
  const filename = `${safeFileName(location.hostname || 'page')}-frontend.zip`;

  const progressModal = modal(
    'Download Frontend ZIP',
    `<div class="wt-card">
      <div class="wt-label">Status</div>
      <div class="wt-value" data-wt-status>Preparing frontend...</div>
      <div class="wt-progress"><div class="wt-progress-bar" data-wt-progress></div></div>
      <div class="wt-status">The export contains the currently loaded frontend and browser-accessible resources.</div>
    </div>`
  );

  let skipped = 0;
  let completed = 0;

  try {
    const used = new Set();
    const mapping = new Map();
    const resourceResults = [];

    setModalStatus(progressModal, 'Preparing frontend...', 5);

    const exportDocument = sanitizeExportDocument();

    setModalStatus(progressModal, 'Collecting resources...', 12);

    const resources = collectFrontendResources();

    for (const resource of resources) {
      try {
        if (!isFetchableURL(resource.url)) { skipped++; continue; }
        const resourceURL = new URL(resource.url);
        if (resourceURL.origin !== location.origin) { skipped++; continue; }
        const path = pathForResource(resource, used);
        resourceResults.push({ resource, path });
        mapping.set(resourceURL.href, path);
      } catch { skipped++; }
    }

    const entries = [];

    for (const item of resourceResults) {
      const resource = item.resource;
      try {
        const fetched = await fetchResource(resource.url);
        let data = new Uint8Array(fetched.buffer);

        if (resource.type === 'css') {
          const text = new TextDecoder().decode(data);
          data = makeTextBytes(rewriteCSSReferences(text, resource.url, mapping));
        }

        entries.push({ name: item.path, data });
      } catch { skipped++; }

      completed++;
      const progress = 15 + Math.round((completed / Math.max(resourceResults.length, 1)) * 55);
      setModalStatus(progressModal, `Collecting resources... ${completed}/${resourceResults.length}`, progress);
    }

    setModalStatus(progressModal, 'Building ZIP...', 75);

    rewriteHTMLResourceReferences(exportDocument, mapping);

    const html = '<!DOCTYPE html>\n' + exportDocument.outerHTML;
    entries.unshift({ name: 'index.html', data: makeTextBytes(html) });

    let zipBlob;

    try {
      let JSZip = window.JSZip;
      if (!JSZip) { try { JSZip = await loadJSZip(); } catch { JSZip = null; } }
      zipBlob = JSZip ? await createZipWithJSZip(JSZip, entries) : makeStoredZip(entries);
    } catch {
      zipBlob = makeStoredZip(entries);
    }

    setModalStatus(progressModal, 'Downloading...', 95);
    downloadBlob(zipBlob, filename);

    setModalStatus(
      progressModal,
      skipped ? `Export completed with ${skipped} inaccessible resources skipped.` : 'Export completed successfully.',
      100
    );

    const content = progressModal.querySelector('#wt-content');
    if (content) {
      content.insertAdjacentHTML('beforeend', `
        <div class="wt-card"><div class="wt-label">Exported</div><div class="wt-value">${esc(filename)}</div></div>
        <div class="wt-card"><div class="wt-label">Privacy</div><div class="wt-note">Cookies, localStorage, sessionStorage, authorization headers, browser credentials and live form values were not included. Backend/server-side source is not accessible through this export.</div></div>
      `);
    }
  } catch (e) {
    const message = e && e.message ? e.message : 'The frontend export could not be completed.';
    const content = progressModal.querySelector('#wt-content');
    if (content) {
      content.innerHTML = `
        <div class="wt-card"><div class="wt-label">Export failed</div><div class="wt-value">${esc(message)}</div></div>
        <div class="wt-card"><div class="wt-note">The page itself was not modified. Browser security restrictions can prevent individual resources from being retrieved.</div></div>
      `;
    }
  }
};

addTool(
  'download', 'Download Frontend ZIP',
  'Export the loaded frontend HTML, CSS, JS and accessible assets',
  () => exportFrontendZIP()
);

/* =========================================================
   PAGE PDF
   ========================================================= */

const downloadPagePDF = () => {
  const printStyle = document.createElement('style');
  printStyle.id = 'wt-print-temp';
  printStyle.textContent = `
    @media print{
      #wt-app,#wt-modal,#wt-style,[data-wt-print-hide]{display:none!important}
      html,body{background:#fff!important}
    }
  `;

  let restored = false;
  const cleanup = () => {
    if (restored) return;
    restored = true;
    try { printStyle.remove(); } catch {}
    try { window.removeEventListener('afterprint', cleanup); } catch {}
  };

  try {
    document.head.appendChild(printStyle);
    root.style.display = 'none';
    const currentModal = document.getElementById('wt-modal');
    if (currentModal) currentModal.style.display = 'none';

    window.addEventListener('afterprint', cleanup, { once: true });
    window.print();
    setTimeout(cleanup, 60000);
  } catch {
    cleanup();
    root.style.display = '';
    const currentModal = document.getElementById('wt-modal');
    if (currentModal) currentModal.style.display = '';

    modal(
      'Download Page as PDF',
      `<div class="wt-card"><div class="wt-label">Print unavailable</div><div class="wt-value">This browser did not allow the print-to-PDF flow to start.</div></div>`
    );
  }
};

addTool(
  'pdf', 'Download Page as PDF',
  'Save the current rendered page as a PDF',
  () => downloadPagePDF()
);

/* =========================================================
   DOM INSPECTOR
   ========================================================= */

addTool(
  'inspector', 'DOM Inspector',
  'Tap an element to inspect basic DOM information',
  () => {
    let active = true;

    const oldStyle = document.getElementById('wt-inspector-style');
    if (oldStyle) oldStyle.remove();

    const st = document.createElement('style');
    st.id = 'wt-inspector-style';
    st.textContent = '[data-wt-highlight]{outline:3px solid #6f93f2!important;outline-offset:2px!important;cursor:crosshair!important}';
    document.head.appendChild(st);

    const over = e => {
      if (!active || root.contains(e.target) || e.target.closest('#wt-modal')) return;
      try { e.target.setAttribute('data-wt-highlight', ''); } catch {}
    };

    const out = e => { try { e.target.removeAttribute('data-wt-highlight'); } catch {} };

    const click = e => {
      if (!active || root.contains(e.target) || e.target.closest('#wt-modal')) return;
      e.preventDefault();
      e.stopPropagation();

      const el = e.target;

      modal(
        'Element',
        card('Tag', esc(el.tagName)) +
        card('ID', esc(el.id || '(none)')) +
        card('Classes', esc(typeof el.className === 'string' ? el.className : '(none)')) +
        card('Text', esc((el.innerText || '').trim().slice(0, 2000)))
      );

      bindCopies();
    };

    document.addEventListener('mouseover', over, true);
    document.addEventListener('mouseout', out, true);
    document.addEventListener('click', click, true);

    alert('Inspector enabled for 30 seconds. Tap an element.');

    setTimeout(() => {
      active = false;
      document.removeEventListener('mouseover', over, true);
      document.removeEventListener('mouseout', out, true);
      document.removeEventListener('click', click, true);
      try { document.querySelectorAll('[data-wt-highlight]').forEach(el => el.removeAttribute('data-wt-highlight')); } catch {}
      st.remove();
    }, 30000);
  }
);

/* =========================================================
   PAGE SOURCE — sticky copy bar + syntax highlighting
   ========================================================= */

addTool(
  'source', 'Page Source',
  'Open the current document HTML in a color-highlighted viewer',
  async () => {
    const rawHTML = document.documentElement.outerHTML;
    const byteLen = new Blob([rawHTML]).size;
    const sizeLabel = byteLen > 1024 * 1024
      ? (byteLen / (1024 * 1024)).toFixed(1) + ' MB'
      : (byteLen / 1024).toFixed(1) + ' KB';

    const m = modal(
      'Document HTML',
      `<div class="wt-source-bar">
        <div class="wt-source-meta">${sizeLabel} · loading highlighter...</div>
        <button class="wt-copy" data-copy="${esc(rawHTML)}">Copy HTML</button>
      </div>
      <div class="wt-code-wrap"><pre><code id="wt-source-code">${esc(rawHTML)}</code></pre></div>`
    );

    const contentEl = m.querySelector('#wt-content');
    if (contentEl) contentEl.classList.add('wt-source-content');

    bindCopies();

    try {
      const hljs = await loadHLJS();
      const codeEl = m.querySelector('#wt-source-code');
      const metaEl = m.querySelector('.wt-source-meta');

      if (codeEl && document.body.contains(codeEl)) {
        const result = hljs.highlight(rawHTML, { language: 'xml' });
        codeEl.innerHTML = result.value;
        codeEl.classList.add('hljs', 'language-xml');
      }

      if (metaEl && document.body.contains(metaEl)) {
        metaEl.textContent = `${sizeLabel} · ${rawHTML.split('\n').length} lines`;
      }
    } catch {
      const metaEl = m.querySelector('.wt-source-meta');
      if (metaEl && document.body.contains(metaEl)) {
        metaEl.textContent = `${sizeLabel} · highlighting unavailable`;
      }
    }
  }
);

/* =========================================================
   COPY PAGE TEXT
   ========================================================= */

addTool(
  'copy', 'Copy Page Text',
  'Copy visible page text to clipboard',
  async () => {
    const ok = await copy(document.body.innerText || '');
    alert(ok ? 'Visible page text copied.' : 'Clipboard permission denied.');
  }
);

/* =========================================================
   LINKS
   ========================================================= */

addTool(
  'links', 'Links',
  'List all links with clickable destinations',
  () => {
    const data = [...document.links];

    modal(
      'Links',
      data.length
      ? `<table class="wt-table">
          <tr><th>#</th><th>Text</th><th>Domain</th><th>Destination</th></tr>
          ${data.map((a, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${esc(a.innerText.trim() || '(no text)')}</td>
              <td>${esc(hostnameOf(a.href) || '—')}</td>
              <td>${urlHTML(a.href)}</td>
            </tr>`).join('')}
        </table>`
      : empty('No links found.')
    );
  }
);

/* =========================================================
   IMAGES
   ========================================================= */

addTool(
  'images', 'Images',
  'View images with clickable source URLs',
  () => {
    const data = [...document.images];

    modal(
      'Images',
      data.length
      ? data.map((img, i) => `
        <div class="wt-card">
          <div class="wt-label">Image ${i + 1}</div>
          <div class="wt-value">${urlHTML(img.src)}</div>
          <img class="wt-preview" src="${esc(img.src)}" loading="lazy">
          <div class="wt-label" style="margin-top:8px">Dimensions</div>
          <div class="wt-value">${img.naturalWidth || '?'} × ${img.naturalHeight || '?'}</div>
        </div>
      `).join('')
      : empty('No images found.')
    );
  }
);

/* =========================================================
   FORMS
   ========================================================= */

addTool(
  'forms', 'Forms',
  'Inspect forms, actions, methods and fields',
  () => {
    const data = [...document.forms];

    modal(
      'Forms',
      data.length
      ? data.map((f, i) => `
        <div class="wt-card">
          <div class="wt-label">Form ${i + 1}</div>
          <div class="wt-value">
            <strong>Action:</strong> ${urlHTML(f.action)}<br>
            <strong>Method:</strong> ${esc((f.method || 'get').toUpperCase())}<br>
            <strong>Fields:</strong> ${f.elements.length}
          </div>
          <br>
          <table class="wt-table">
            <tr><th>Name</th><th>Type</th><th>Tag</th></tr>
            ${[...f.elements].map(e => `
              <tr>
                <td>${esc(e.name || '(none)')}</td>
                <td>${esc(e.type || '(none)')}</td>
                <td>${esc(e.tagName)}</td>
              </tr>`).join('')}
          </table>
        </div>
      `).join('')
      : empty('No forms found.')
    );
  }
);

/* =========================================================
   HEADINGS
   ========================================================= */

addTool(
  'headings', 'Headings',
  'View document heading structure',
  () => {
    const data = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];

    modal(
      'Headings',
      data.length
      ? data.map((h, i) => `
        <div class="wt-card">
          <div class="wt-label">${h.tagName} — ${i + 1}</div>
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
  'scripts', 'Scripts',
  'List JavaScript files used by the page',
  () => {
    const data = [...document.scripts];

    modal(
      'Scripts',
      data.length
      ? data.map((s, i) => `
        <div class="wt-card">
          <div class="wt-label">Script ${i + 1}</div>
          <div class="wt-value">${s.src ? urlHTML(s.src) : '(inline script)'}</div>
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
  'resources', 'Resources',
  'Inspect resources loaded by the current page',
  () => {
    const data = performance.getEntriesByType('resource');

    modal(
      'Resources',
      data.length
      ? `<table class="wt-table">
          <tr><th>#</th><th>Type</th><th>Duration</th><th>Resource</th></tr>
          ${data.map((x, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${esc(x.initiatorType || 'unknown')}</td>
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
  'performance', 'Performance',
  'Navigation timing and page load metrics',
  () => {
    const p = performance.getEntriesByType('navigation')[0];

    if (!p) { modal('Performance', empty('Navigation timing unavailable.')); return; }

    modal(
      'Performance',
      `<div class="wt-stat-grid">
        <div class="wt-stat"><div class="wt-stat-num">${p.domainLookupEnd - p.domainLookupStart | 0}<span style="font-size:11px"> ms</span></div><div class="wt-stat-label">DNS</div></div>
        <div class="wt-stat"><div class="wt-stat-num">${p.responseEnd - p.responseStart | 0}<span style="font-size:11px"> ms</span></div><div class="wt-stat-label">Response</div></div>
        <div class="wt-stat"><div class="wt-stat-num">${p.domInteractive | 0}<span style="font-size:11px"> ms</span></div><div class="wt-stat-label">DOM Interactive</div></div>
        <div class="wt-stat"><div class="wt-stat-num">${p.domComplete | 0}<span style="font-size:11px"> ms</span></div><div class="wt-stat-label">DOM Complete</div></div>
      </div>`
    );
  }
);

/* =========================================================
   LOCAL / SESSION STORAGE
   ========================================================= */

const storageViewer = (name, store) => {
  let rows = [];

  try {
    for (let i = 0; i < store.length; i++) {
      const key = store.key(i);
      rows.push([key, store.getItem(key)]);
    }
  } catch (e) {
    modal(name, `<div class="wt-card">${esc(e.message)}</div>`);
    return;
  }

  modal(
    name,
    rows.length
    ? rows.map(r => `
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

addTool('localStorage', 'Local Storage', 'View current site localStorage keys and values', () => storageViewer('Local Storage', localStorage));
addTool('sessionStorage', 'Session Storage', 'View current site sessionStorage keys and values', () => storageViewer('Session Storage', sessionStorage));

/* =========================================================
   COOKIES
   ========================================================= */

addTool(
  'cookies', 'Cookies',
  'Show cookie access status without exposing cookie values',
  () => {
    modal(
      'Cookies',
      card('Browser Cookie Support', navigator.cookieEnabled ? 'Enabled' : 'Disabled') +
      `<div class="wt-card"><div class="wt-label">Security</div><div class="wt-value">Cookie values are intentionally not displayed.</div></div>`
    );
  }
);

/* =========================================================
   SEARCH
   ========================================================= */

search.oninput = () => {
  const q = search.value.toLowerCase().trim();
  tools.querySelectorAll('.wt-tool').forEach(b => {
    b.style.display = !q || b.dataset.search.includes(q) ? 'flex' : 'none';
  });
};

/* =========================================================
   DRAGGABLE LAUNCHER + SMART PANEL POSITIONING
   ========================================================= */

const DRAG_THRESHOLD = 6;
const MARGIN = 10;

let dragState = null;

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const lockAppToLeftTop = () => {
  // convert current right/bottom-anchored position into explicit left/top
  // so it can be freely dragged anywhere on screen.
  const rect = root.getBoundingClientRect();
  root.style.left = rect.left + 'px';
  root.style.top = rect.top + 'px';
  root.style.right = 'auto';
  root.style.bottom = 'auto';
};

const positionPanel = () => {
  const btnRect = launch.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  panel.style.display = 'block';
  const panelRect = panel.getBoundingClientRect();
  const pw = panelRect.width || 380;
  const ph = Math.min(panelRect.height || 420, vh * 0.74);

  // vertical: prefer opening above the button (like the original bottom-right
  // default), fall back to below if there isn't room above.
  const roomAbove = btnRect.top;
  const roomBelow = vh - btnRect.bottom;

  let top;
  if (roomAbove >= ph + MARGIN || roomAbove >= roomBelow) {
    top = btnRect.top - ph - 10;
  } else {
    top = btnRect.bottom + 10;
  }
  top = clamp(top, MARGIN, vh - ph - MARGIN);

  // horizontal: align panel's right edge to button's right edge by default,
  // clamp so it never runs off either side of the viewport.
  let left = btnRect.right - pw;
  left = clamp(left, MARGIN, vw - pw - MARGIN);

  panel.style.left = left + 'px';
  panel.style.top = top + 'px';
};

const openPanel = () => {
  panel.style.display = 'block';
  positionPanel();
};

const closePanel = () => {
  panel.style.display = 'none';
};

const togglePanel = () => {
  if (panel.style.display === 'block') closePanel();
  else openPanel();
};

launch.addEventListener('pointerdown', e => {
  if (e.button !== undefined && e.button !== 0) return;

  const rect = root.getBoundingClientRect();

  dragState = {
    pointerId: e.pointerId,
    startX: e.clientX,
    startY: e.clientY,
    originLeft: rect.left,
    originTop: rect.top,
    moved: false
  };

  launch.setPointerCapture(e.pointerId);
});

launch.addEventListener('pointermove', e => {
  if (!dragState || dragState.pointerId !== e.pointerId) return;

  const dx = e.clientX - dragState.startX;
  const dy = e.clientY - dragState.startY;

  if (!dragState.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
    dragState.moved = true;
    lockAppToLeftTop();
    // re-derive origin from the now-explicit left/top
    dragState.originLeft = parseFloat(root.style.left);
    dragState.originTop = parseFloat(root.style.top);
    launch.classList.add('wt-dragging');
    closePanel();
  }

  if (!dragState.moved) return;

  const rect = root.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let newLeft = dragState.originLeft + dx;
  let newTop = dragState.originTop + dy;

  newLeft = clamp(newLeft, MARGIN, vw - rect.width - MARGIN);
  newTop = clamp(newTop, MARGIN, vh - rect.height - MARGIN);

  root.style.left = newLeft + 'px';
  root.style.top = newTop + 'px';
});

const endDrag = e => {
  if (!dragState || dragState.pointerId !== e.pointerId) return;

  const wasDrag = dragState.moved;

  try { launch.releasePointerCapture(e.pointerId); } catch {}
  launch.classList.remove('wt-dragging');
  dragState = null;

  if (!wasDrag) {
    togglePanel();
  }
};

launch.addEventListener('pointerup', endDrag);
launch.addEventListener('pointercancel', endDrag);

root.querySelector('#wt-close').onclick = () => closePanel();

window.addEventListener('resize', () => {
  if (panel.style.display === 'block') positionPanel();
});

})();
