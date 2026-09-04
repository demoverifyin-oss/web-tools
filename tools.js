(() => {
'use strict';

/* =========================================================
   WEB TOOLS PRO
   Advanced browser inspection toolkit
   Version 2.0
   ========================================================= */

if (window.__WEBTOOLS_PRO__) {
  const existing = document.getElementById('wt-pro-app');
  const existingLaunch = existing?.querySelector('#wt-pro-launch');
  if (existingLaunch) {
    existingLaunch.focus();
    existingLaunch.click();
  }
  return;
}

/* =========================================================
   CORE
   ========================================================= */

const APP_ID = 'wt-pro-app';
const STYLE_ID = 'wt-pro-style';
const Z = 2147483647;

const state = {
  theme: 'dark',
  inspector: false,
  panelOpen: false,
  modalOpen: false,
  tools: [],
  inspectorCleanup: null
};

const root = document.createElement('div');
root.id = APP_ID;

window.__WEBTOOLS_PRO__ = {
  remove() {
    try {
      state.inspectorCleanup?.();
    } catch {}

    document.getElementById(APP_ID)?.remove();
    document.getElementById(STYLE_ID)?.remove();
    document.getElementById('wt-pro-modal')?.remove();
    document.getElementById('wt-pro-toast-container')?.remove();
  }
};

/* =========================================================
   HELPERS
   ========================================================= */

const esc = value =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const escAttr = esc;

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

const isElement = node =>
  node && node.nodeType === Node.ELEMENT_NODE;

const safeJSON = value => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const formatBytes = bytes => {
  if (!Number.isFinite(bytes)) return 'Unknown';

  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(2)} MB`;

  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
};

const formatNumber = n =>
  Number(n || 0).toLocaleString();

const truncate = (value, length = 300) => {
  const text = String(value ?? '');
  return text.length > length
    ? text.slice(0, length) + '…'
    : text;
};

const absoluteURL = value => {
  try {
    return new URL(value, location.href).href;
  } catch {
    return '';
  }
};

const isSameOrigin = value => {
  try {
    return new URL(value, location.href).origin === location.origin;
  } catch {
    return false;
  }
};

const copyText = async text => {
  try {
    await navigator.clipboard.writeText(String(text ?? ''));
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');

      ta.value = String(text ?? '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';

      document.body.appendChild(ta);

      ta.focus();
      ta.select();

      const result = document.execCommand('copy');

      ta.remove();

      return result;
    } catch {
      return false;
    }
  }
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');

  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  a.style.display = 'none';

  document.body.appendChild(a);

  a.click();

  a.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 30000);
};

const safeFilename = name =>
  String(name || 'file')
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160) || 'file';

/* =========================================================
   ICON SYSTEM
   ========================================================= */

const icon = (paths, size = 18) => `
<svg
  width="${size}"
  height="${size}"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.6"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
${paths}
</svg>`;

const ICONS = {

  brand: `
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>
  `,

  dashboard: `
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
  `,

  search: `
    <circle cx="11" cy="11" r="7"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  `,

  close: `
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  `,

  download: `
    <path d="M12 3v12"/>
    <polyline points="7 10 12 15 17 10"/>
    <path d="M5 21h14"/>
  `,

  pdf: `
    <path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <path d="M8 15h2a2 2 0 0 0 0-4H8v7"/>
    <path d="M13 11v7h1a3.5 3.5 0 0 0 0-7z"/>
  `,

  links: `
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  `,

  images: `
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  `,

  forms: `
    <rect x="4" y="3" width="16" height="18" rx="2"/>
    <line x1="8" y1="8" x2="16" y2="8"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <line x1="8" y1="16" x2="13" y2="16"/>
  `,

  headings: `
    <polyline points="4 7 4 4 20 4 20 7"/>
    <line x1="9" y1="20" x2="15" y2="20"/>
    <line x1="12" y1="4" x2="12" y2="20"/>
  `,

  inspector: `
    <circle cx="12" cy="12" r="8"/>
    <line x1="12" y1="2" x2="12" y2="5"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="2" y1="12" x2="5" y2="12"/>
    <line x1="19" y1="12" x2="22" y2="12"/>
  `,

  storage: `
    <ellipse cx="12" cy="5" rx="8" ry="3"/>
    <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/>
    <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>
  `,

  session: `
    <path d="M22 18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  `,

  performance: `
    <polyline points="22 12 18 12 15 20 9 4 6 12 2 12"/>
  `,

  resources: `
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  `,

  cookies: `
    <path d="M12 22s7-3.5 7-9V6l-7-3-7 3v7c0 5.5 7 9 7 9z"/>
  `,

  source: `
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  `,

  code: `
    <polyline points="8 9 4 12 8 15"/>
    <polyline points="16 9 20 12 16 15"/>
    <line x1="14" y1="5" x2="10" y2="19"/>
  `,

  seo: `
    <circle cx="11" cy="11" r="7"/>
    <line x1="20" y1="20" x2="16" y2="16"/>
    <path d="M8 11h6"/>
  `,

  accessibility: `
    <circle cx="12" cy="5" r="2"/>
    <path d="M5 9h14"/>
    <path d="M12 9v11"/>
    <path d="M8 20l4-5 4 5"/>
  `,

  copy: `
    <rect x="9" y="9" width="12" height="12" rx="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  `,

  text: `
    <path d="M4 6V4h16v2"/>
    <line x1="12" y1="4" x2="12" y2="20"/>
    <line x1="8" y1="20" x2="16" y2="20"/>
  `,

  theme: `
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/>
    <path d="M12 20v2"/>
    <path d="M4.93 4.93l1.41 1.41"/>
    <path d="M17.66 17.66l1.41 1.41"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="M4.93 19.07l1.41-1.41"/>
    <path d="M17.66 6.34l1.41-1.41"/>
  `,

  chart: `
    <line x1="4" y1="20" x2="4" y2="10"/>
    <line x1="10" y1="20" x2="10" y2="4"/>
    <line x1="16" y1="20" x2="16" y2="13"/>
    <line x1="22" y1="20" x2="22" y2="7"/>
  `
};

/* =========================================================
   CSS
   ========================================================= */

const css = `
#${APP_ID},
#wt-pro-modal,
#wt-pro-toast-container {
  --wt-bg: #0e1014;
  --wt-bg2: #15181e;
  --wt-bg3: #1b1f27;
  --wt-border: #282e38;
  --wt-border-soft: #20252e;
  --wt-text: #f1f4f8;
  --wt-muted: #8d96a5;
  --wt-accent: #7c9df5;
  --wt-accent-soft: #7c9df51c;
  --wt-green: #6fd69b;
  --wt-yellow: #e8bc62;
  --wt-red: #f27676;
  --wt-radius: 15px;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "SF Pro Text",
    Inter,
    ui-sans-serif,
    system-ui,
    "Segoe UI",
    sans-serif;
}

#${APP_ID} *,
#wt-pro-modal *,
#wt-pro-toast-container * {
  box-sizing: border-box;
}

#${APP_ID} {
  all: initial;
  position: fixed !important;
  right: 16px;
  bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  z-index: ${Z};
  color: var(--wt-text);
  -webkit-tap-highlight-color: transparent;
}

#wt-pro-launch {
  all: unset;
  display: flex !important;
  align-items: center;
  gap: 8px;
  border: 1px solid #ffffff16;
  background: linear-gradient(145deg, #1d2129, #0a0c10);
  color: white;
  border-radius: 999px;
  padding: 12px 17px;
  cursor: pointer !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  line-height: 1.2 !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: relative !important;
  z-index: 2147483647 !important;
  box-shadow:
    0 12px 35px #000b,
    inset 0 1px 0 #ffffff12;
  transition: .16s ease;
}

#wt-pro-launch:hover {
  transform: translateY(-1px);
  border-color: #ffffff25;
}

#wt-pro-launch:active {
  transform: scale(.97);
}

#wt-pro-panel {
  display: none;
  position: fixed;
  right: 16px;
  bottom: calc(76px + env(safe-area-inset-bottom, 0px));
  width: 410px;
  max-width: calc(100vw - 30px);
  max-height: 78vh;
  overflow: hidden;
  border: 1px solid var(--wt-border);
  border-radius: 18px;
  background: #101319f5;
  backdrop-filter: blur(25px) saturate(150%);
  -webkit-backdrop-filter: blur(25px) saturate(150%);
  box-shadow: 0 30px 90px #000d;
}

#wt-pro-panel.open {
  display: block;
  animation: wtProPop .18s cubic-bezier(.2,.9,.3,1.2);
}

@keyframes wtProPop {
  from {
    opacity: 0;
    transform: translateY(8px) scale(.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.wt-pro-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 16px;
  border-bottom: 1px solid var(--wt-border-soft);
}

.wt-pro-brand {
  display: flex;
  align-items: center;
  gap: 9px;
}

.wt-pro-brand-icon {
  color: var(--wt-accent);
}

.wt-pro-title {
  font-size: 15px;
  font-weight: 800;
}

.wt-pro-subtitle {
  color: var(--wt-muted);
  font-size: 10px;
  margin-top: 2px;
}

.wt-pro-head-actions {
  display: flex;
  gap: 5px;
}

.wt-pro-icon-btn {
  width: 30px;
  height: 30px;
  border: 1px solid var(--wt-border);
  border-radius: 9px;
  background: #ffffff08;
  color: var(--wt-muted);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.wt-pro-icon-btn:hover {
  background: var(--wt-accent-soft);
  color: var(--wt-text);
}

.wt-pro-search {
  padding: 12px;
  border-bottom: 1px solid var(--wt-border-soft);
}

.wt-pro-search-box {
  position: relative;
}

.wt-pro-search-box svg {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--wt-muted);
  pointer-events: none;
}

#wt-pro-search {
  width: 100%;
  border: 1px solid var(--wt-border);
  outline: none;
  background: #080a0e88;
  color: var(--wt-text);
  border-radius: 11px;
  padding: 10px 12px 10px 34px;
  font-size: 13px;
}

#wt-pro-search:focus {
  border-color: var(--wt-accent);
}

.wt-pro-categories {
  display: flex;
  gap: 5px;
  padding: 0 12px 9px;
  overflow-x: auto;
  scrollbar-width: none;
}

.wt-pro-categories::-webkit-scrollbar {
  display: none;
}

.wt-pro-category {
  flex: 0 0 auto;
  border: 1px solid var(--wt-border);
  background: transparent;
  color: var(--wt-muted);
  border-radius: 999px;
  padding: 5px 9px;
  cursor: pointer;
  font-size: 10px;
  font-weight: 700;
}

.wt-pro-category.active {
  color: var(--wt-accent);
  background: var(--wt-accent-soft);
  border-color: #7c9df540;
}

#wt-pro-tools {
  overflow: auto;
  max-height: 57vh;
  padding: 0 10px 12px;
}

.wt-pro-section-title {
  color: var(--wt-muted);
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .08em;
  padding: 10px 5px 5px;
}

.wt-pro-tool {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 9px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 12px;
  color: var(--wt-text);
  text-align: left;
  cursor: pointer;
  transition: .14s ease;
}

.wt-pro-tool:hover {
  background: var(--wt-accent-soft);
  border-color: #7c9df52d;
}

.wt-pro-tool:active {
  transform: scale(.985);
}

.wt-pro-tool-icon {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: grid;
  place-items: center;
  border: 1px solid var(--wt-border-soft);
  border-radius: 9px;
  background: #ffffff07;
  color: var(--wt-muted);
}

.wt-pro-tool-main {
  min-width: 0;
  flex: 1;
}

.wt-pro-tool-title {
  font-size: 12.5px;
  font-weight: 700;
}

.wt-pro-tool-desc {
  margin-top: 2px;
  color: var(--wt-muted);
  font-size: 10.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wt-pro-tool-arrow {
  color: #596171;
}

.wt-pro-footer {
  padding: 9px 13px;
  border-top: 1px solid var(--wt-border-soft);
  color: var(--wt-muted);
  font-size: 9px;
  display: flex;
  justify-content: space-between;
}

/* modal */

#wt-pro-modal {
  position: fixed;
  inset: 0;
  z-index: ${Z};
  background: #030508d9;
  backdrop-filter: blur(11px);
  -webkit-backdrop-filter: blur(11px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

#wt-pro-modal-box {
  width: min(1000px, 100%);
  max-height: 90vh;
  overflow: hidden;
  border: 1px solid var(--wt-border);
  border-bottom: 0;
  border-radius: 20px 20px 0 0;
  background: #101319fa;
  box-shadow: 0 -25px 90px #000e;
  animation: wtProSlide .2s cubic-bezier(.2,.9,.3,1.1);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

@keyframes wtProSlide {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.wt-pro-grip {
  width: 36px;
  height: 4px;
  border-radius: 99px;
  background: #ffffff25;
  margin: 9px auto 0;
}

.wt-pro-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 17px;
  border-bottom: 1px solid var(--wt-border-soft);
}

.wt-pro-modal-title {
  font-size: 14px;
  font-weight: 800;
}

.wt-pro-close {
  border: 1px solid var(--wt-border);
  border-radius: 9px;
  padding: 7px 11px;
  background: #ffffff08;
  color: var(--wt-text);
  cursor: pointer;
  font-size: 11px;
  font-weight: 700;
}

#wt-pro-content {
  overflow: auto;
  max-height: calc(90vh - 65px);
  padding: 15px 17px 25px;
}

.wt-card {
  background: var(--wt-bg2);
  border: 1px solid var(--wt-border-soft);
  border-radius: 13px;
  padding: 12px;
  margin-bottom: 8px;
}

.wt-label {
  color: var(--wt-muted);
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .07em;
  margin-bottom: 5px;
}

.wt-value {
  color: var(--wt-text);
  font-size: 12px;
  line-height: 1.55;
  word-break: break-word;
}

.wt-muted {
  color: var(--wt-muted);
}

.wt-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.wt-stat {
  background: var(--wt-bg2);
  border: 1px solid var(--wt-border-soft);
  border-radius: 13px;
  padding: 13px;
}

.wt-stat-number {
  font-size: 20px;
  font-weight: 850;
}

.wt-stat-label {
  color: var(--wt-muted);
  margin-top: 3px;
  font-size: 10px;
  font-weight: 600;
}

.wt-url {
  color: var(--wt-accent);
  text-decoration: none;
  word-break: break-all;
}

.wt-url:hover {
  text-decoration: underline;
}

.wt-copy {
  float: right;
  border: 1px solid var(--wt-border);
  border-radius: 8px;
  padding: 5px 9px;
  background: #ffffff08;
  color: var(--wt-text);
  cursor: pointer;
  font-size: 10px;
  font-weight: 700;
}

.wt-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 99px;
  border: 1px solid var(--wt-border);
  background: #ffffff08;
  color: var(--wt-muted);
  font-size: 8px;
  font-weight: 800;
  text-transform: uppercase;
  margin-left: 4px;
}

.wt-ok {
  color: var(--wt-green);
  border-color: #6fd69b40;
  background: #6fd69b12;
}

.wt-warn {
  color: var(--wt-yellow);
  border-color: #e8bc6240;
  background: #e8bc6212;
}

.wt-error {
  color: var(--wt-red);
  border-color: #f2767640;
  background: #f2767612;
}

.wt-table-wrap {
  overflow: auto;
  border: 1px solid var(--wt-border-soft);
  border-radius: 12px;
}

.wt-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  min-width: 620px;
}

.wt-table th,
.wt-table td {
  padding: 8px;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid var(--wt-border-soft);
}

.wt-table th {
  color: var(--wt-muted);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: .04em;
}

.wt-table tr:last-child td {
  border-bottom: 0;
}

.wt-empty {
  text-align: center;
  color: var(--wt-muted);
  padding: 35px 10px;
  font-size: 12px;
}

#wt-pro-app .wt-code-wrap,
#wt-pro-modal .wt-code-wrap {
  display: block !important;
  overflow: auto !important;
  max-height: 68vh !important;
  background: #080a0e !important;
  border: 1px solid var(--wt-border-soft) !important;
  border-radius: 12px !important;
  box-sizing: border-box !important;
}


/* =========================================================
   ISOLATED PAGE SOURCE VIEWER
   ========================================================= */

#wt-pro-modal .wt-source-viewer {
  display: flex !important;
  flex-direction: column !important;
  width: 100% !important;
  height: 68vh !important;
  min-height: 300px !important;
  overflow: hidden !important;
  background: #080a0e !important;
  border: 1px solid var(--wt-border-soft) !important;
  border-radius: 12px !important;
  box-sizing: border-box !important;
}

#wt-pro-modal .wt-source-toolbar {
  position: relative !important;
  top: auto !important;
  flex: 0 0 auto !important;
  min-height: 42px !important;
  padding: 7px 10px !important;
  align-items: center !important;
  justify-content: space-between !important;
  background: #101319 !important;
  border-bottom: 1px solid var(--wt-border-soft) !important;
  box-sizing: border-box !important;
}

#wt-pro-modal .wt-source-info {
  margin-left: auto !important;
  padding-left: 10px !important;
  color: var(--wt-muted) !important;
  font-size: 10px !important;
  line-height: 1.3 !important;
  white-space: nowrap !important;
}

#wt-pro-modal .wt-source-frame {
  display: block !important;
  flex: 1 1 auto !important;
  width: 100% !important;
  height: 100% !important;
  min-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  outline: 0 !important;
  background: #080a0e !important;
  box-sizing: border-box !important;
}

.wt-code-toolbar {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 8px;
  background: #080a0eee;
  border-bottom: 1px solid var(--wt-border-soft);
  display: flex;
  justify-content: flex-end;
}

#wt-pro-app .wt-code,
#wt-pro-modal .wt-code {
  display: block !important;

  margin: 0 !important;
  padding: 12px !important;

  color: #c9d1d9 !important;

  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Consolas,
    monospace !important;

  font-size: 11px !important;
  line-height: 1.35 !important;

  white-space: pre !important;
  tab-size: 2 !important;

  letter-spacing: 0 !important;
  word-spacing: normal !important;

  font-weight: 400 !important;

  box-sizing: border-box !important;
}

.wt-s-tag {
  color: #ff7b72;
}

.wt-s-attr {
  color: #d2a8ff;
}

.wt-s-string {
  color: #a5d6ff;
}

.wt-s-punct {
  color: #8b949e;
}

.wt-s-comment {
  color: #8b949e;
  font-style: italic;
}

.wt-progress {
  height: 6px;
  border-radius: 99px;
  overflow: hidden;
  background: #ffffff09;
  margin-top: 10px;
}

.wt-progress-bar {
  height: 100%;
  width: 0;
  background: var(--wt-accent);
  transition: width .18s ease;
}

.wt-status {
  color: var(--wt-muted);
  font-size: 10.5px;
  margin-top: 8px;
}

.wt-tree {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  line-height: 1.7;
  color: var(--wt-text);
}

.wt-tree .dim {
  color: var(--wt-muted);
}

.wt-tree .tag {
  color: #ff7b72;
}

.wt-tree .attr {
  color: #d2a8ff;
}

.wt-tree .value {
  color: #a5d6ff;
}

.wt-preview {
  display: block;
  width: 100%;
  max-height: 260px;
  object-fit: contain;
  background: #050608;
  border: 1px solid var(--wt-border-soft);
  border-radius: 10px;
  margin-top: 8px;
}

.wt-inspector-highlight {
  outline: 3px solid #7c9df5 !important;
  outline-offset: 3px !important;
  cursor: crosshair !important;
}

.wt-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.wt-list {
  margin: 0;
  padding-left: 18px;
  color: var(--wt-text);
  font-size: 12px;
  line-height: 1.8;
}

.wt-health {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px;
  border: 1px solid var(--wt-border-soft);
  border-radius: 11px;
  margin-bottom: 7px;
}

.wt-health-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  flex: 0 0 auto;
}

#wt-pro-toast-container {
  position: fixed;
  right: 18px;
  bottom: 82px;
  z-index: ${Z + 2};
  display: flex;
  flex-direction: column;
  gap: 7px;
  pointer-events: none;
}

.wt-toast {
  background: #171a20f5;
  border: 1px solid var(--wt-border);
  color: var(--wt-text);
  border-radius: 11px;
  padding: 10px 12px;
  box-shadow: 0 15px 40px #000b;
  font-size: 11px;
  animation: wtToastIn .18s ease;
}

@keyframes wtToastIn {
  from {
    opacity: 0;
    transform: translateY(7px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media(max-width:600px) {
  #${APP_ID} {
    right: 10px;
  }

  #wt-pro-panel {
    right: 10px;
    width: calc(100vw - 20px);
    max-width: none;
  }

  #wt-pro-modal-box {
    border-radius: 18px 18px 0 0;
  }

  .wt-two,
  .wt-grid {
    grid-template-columns: 1fr;
  }
}

@media print {
  #${APP_ID},
  #wt-pro-modal,
  #wt-pro-toast-container {
    display: none !important;
  }
}
`;

const style = document.createElement('style');
style.id = STYLE_ID;
style.textContent = css;

document.head.appendChild(style);

/* =========================================================
   UI
   ========================================================= */

root.innerHTML = `
<button
  id="wt-pro-launch"
  type="button"
  aria-label="Open Web Tools Pro"
  title="Web Tools Pro — Alt + Shift + W"
>
  ${icon(ICONS.brand, 16)}
  <span>Web Tools Pro</span>
</button>

<div id="wt-pro-panel">

  <div class="wt-pro-head">

    <div class="wt-pro-brand">
      <div class="wt-pro-brand-icon">
        ${icon(ICONS.brand, 17)}
      </div>

      <div>
        <div class="wt-pro-title">Web Tools Pro</div>
        <div class="wt-pro-subtitle">
          Advanced browser inspection toolkit
        </div>
      </div>
    </div>

    <div class="wt-pro-head-actions">

      <button
        class="wt-pro-icon-btn"
        id="wt-pro-theme"
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        ${icon(ICONS.theme, 15)}
      </button>

      <button
        class="wt-pro-icon-btn"
        id="wt-pro-close"
        title="Close"
        aria-label="Close"
      >
        ${icon(ICONS.close, 15)}
      </button>

    </div>

  </div>

  <div class="wt-pro-search">

    <div class="wt-pro-search-box">
      ${icon(ICONS.search, 15)}

      <input
        id="wt-pro-search"
        type="search"
        autocomplete="off"
        spellcheck="false"
        placeholder="Search tools..."
        aria-label="Search tools"
      >
    </div>

  </div>

  <div class="wt-pro-categories">

    <button class="wt-pro-category active" data-category="all">
      All
    </button>

    <button class="wt-pro-category" data-category="page">
      Page
    </button>

    <button class="wt-pro-category" data-category="audit">
      Audit
    </button>

    <button class="wt-pro-category" data-category="network">
      Network
    </button>

    <button class="wt-pro-category" data-category="storage">
      Storage
    </button>

    <button class="wt-pro-category" data-category="export">
      Export
    </button>

  </div>

  <div id="wt-pro-tools"></div>

  <div class="wt-pro-footer">
    <span>Alt + Shift + W</span>
    <span>v2.0</span>
  </div>

</div>
`;

document.body.appendChild(root);

const panel = root.querySelector('#wt-pro-panel');
const toolsContainer = root.querySelector('#wt-pro-tools');
const searchInput = root.querySelector('#wt-pro-search');

/* =========================================================
   TOAST
   ========================================================= */

const toast = message => {

  let container = document.getElementById(
    'wt-pro-toast-container'
  );

  if (!container) {
    container = document.createElement('div');
    container.id = 'wt-pro-toast-container';
    document.body.appendChild(container);
  }

  const item = document.createElement('div');

  item.className = 'wt-toast';
  item.textContent = message;

  container.appendChild(item);

  setTimeout(() => {
    item.remove();
  }, 2200);
};

/* =========================================================
   MODAL
   ========================================================= */

const closeModal = () => {
  document.getElementById('wt-pro-modal')?.remove();
  state.modalOpen = false;
};

const openModal = (title, html) => {

  closeModal();

  const modal = document.createElement('div');

  modal.id = 'wt-pro-modal';

  modal.innerHTML = `
    <div id="wt-pro-modal-box">

      <div class="wt-pro-grip"></div>

      <div class="wt-pro-modal-head">

        <div class="wt-pro-modal-title">
          ${esc(title)}
        </div>

        <button
          class="wt-pro-close"
          type="button"
          data-close-modal
        >
          Close
        </button>

      </div>

      <div id="wt-pro-content">
        ${html}
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  state.modalOpen = true;

  modal.querySelector('[data-close-modal]')
    .addEventListener('click', closeModal);

  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal();
    }
  });

  bindCopyButtons(modal);

  return modal;
};

const setModalHTML = html => {
  const content = document.querySelector('#wt-pro-content');

  if (content) {
    content.innerHTML = html;
    bindCopyButtons(document.getElementById('wt-pro-modal'));
  }
};

/* =========================================================
   CARD HELPERS
   ========================================================= */

const urlHTML = url => {
  const value = String(url ?? '');

  return `
    <a
      class="wt-url"
      href="${escAttr(value)}"
      target="_blank"
      rel="noopener noreferrer"
    >
      ${esc(value)}
    </a>
  `;
};

const card = (label, value, copyValue) => `
  <div class="wt-card">

    <div class="wt-label">
      ${esc(label)}
    </div>

    <div class="wt-value">

      ${
        copyValue !== undefined
          ? `
            <button
              class="wt-copy"
              type="button"
              data-copy="${escAttr(copyValue)}"
            >
              Copy
            </button>
          `
          : ''
      }

      ${value}

    </div>

  </div>
`;

const stat = (number, label) => `
  <div class="wt-stat">
    <div class="wt-stat-number">
      ${esc(number)}
    </div>
    <div class="wt-stat-label">
      ${esc(label)}
    </div>
  </div>
`;

const empty = text =>
  `<div class="wt-empty">${esc(text)}</div>`;

const bindCopyButtons = container => {

  if (!container) return;

  container
    .querySelectorAll('[data-copy]')
    .forEach(button => {

      button.addEventListener('click', async () => {

        const ok = await copyText(
          button.getAttribute('data-copy') || ''
        );

        const old = button.textContent;

        button.textContent = ok
          ? 'Copied'
          : 'Failed';

        if (ok) toast('Copied to clipboard');

        setTimeout(() => {
          button.textContent = old;
        }, 1200);

      });

    });
};

/* =========================================================
   TOOL REGISTRATION
   ========================================================= */

const addTool = ({
  icon: iconName,
  title,
  description,
  category,
  keywords = '',
  action
}) => {

  state.tools.push({
    iconName,
    title,
    description,
    category,
    keywords: `${title} ${description} ${keywords}`.toLowerCase(),
    action
  });

};

const renderTools = () => {

  const query =
    searchInput.value.trim().toLowerCase();

  const activeCategory =
    document.querySelector(
      '.wt-pro-category.active'
    )?.dataset.category || 'all';

  const filtered = state.tools.filter(tool => {

    const categoryMatch =
      activeCategory === 'all' ||
      tool.category === activeCategory;

    const searchMatch =
      !query ||
      tool.keywords.includes(query);

    return categoryMatch && searchMatch;
  });

  const groups = {};

  filtered.forEach(tool => {

    if (!groups[tool.category]) {
      groups[tool.category] = [];
    }

    groups[tool.category].push(tool);
  });

  if (!filtered.length) {
    toolsContainer.innerHTML =
      empty('No matching tools.');
    return;
  }

  toolsContainer.innerHTML = '';

  const categoryOrder = [
    'page',
    'audit',
    'network',
    'storage',
    'export'
  ];

  categoryOrder.forEach(category => {

    if (!groups[category]?.length) {
      return;
    }

    const heading = document.createElement('div');

    heading.className =
      'wt-pro-section-title';

    heading.textContent =
      category;

    toolsContainer.appendChild(heading);

    groups[category].forEach(tool => {

      const button =
        document.createElement('button');

      button.type = 'button';
      button.className = 'wt-pro-tool';

      button.innerHTML = `
        <div class="wt-pro-tool-icon">
          ${icon(ICONS[tool.iconName] || ICONS.code, 17)}
        </div>

        <div class="wt-pro-tool-main">

          <div class="wt-pro-tool-title">
            ${esc(tool.title)}
          </div>

          <div class="wt-pro-tool-desc">
            ${esc(tool.description)}
          </div>

        </div>

        <div class="wt-pro-tool-arrow">
          ›
        </div>
      `;

      button.addEventListener(
        'click',
        () => {
          try {
            tool.action();
          } catch (error) {
            console.error(error);
            toast('Tool failed to execute');
          }
        }
      );

      toolsContainer.appendChild(button);
    });

  });

};

/* =========================================================
   HTML HIGHLIGHTER
   ========================================================= */

const highlightAttributes = input => {

  let output = '';
  let last = 0;

  const regex =
    /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g;

  let match;

  while ((match = regex.exec(input))) {

    output += esc(
      input.slice(last, match.index)
    );

    output += `
      <span class="wt-s-attr">
        ${esc(match[1])}
      </span>
    `;

    if (match[3] !== undefined) {

      output += `
        <span class="wt-s-punct">=</span>
        <span class="wt-s-string">
          ${esc(match[3])}
        </span>
      `;
    }

    last = regex.lastIndex;
  }

  output += esc(input.slice(last));

  return output;
};

const highlightTag = tag => {

  const closing =
    tag.startsWith('</');

  const open =
    closing ? '</' : '<';

  const selfClosing =
    tag.endsWith('/>');

  const close =
    selfClosing ? '/>' : '>';

  const inner =
    tag.slice(
      open.length,
      tag.length - close.length
    );

  const match =
    inner.match(
      /^[a-zA-Z][a-zA-Z0-9:-]*/
    );

  const name =
    match?.[0] || '';

  const attributes =
    inner.slice(name.length);

  return `
    <span class="wt-s-punct">
      ${esc(open)}
    </span>

    <span class="wt-s-tag">
      ${esc(name)}
    </span>

    ${highlightAttributes(attributes)}

    <span class="wt-s-punct">
      ${esc(close)}
    </span>
  `;
};

const highlightHTML = html => {

  const regex =
    /<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>/g;

  let output = '';
  let last = 0;

  let match;

  while ((match = regex.exec(html))) {

    output += esc(
      html.slice(last, match.index)
    );

    const token = match[0];

    if (token.startsWith('<!--')) {

      output += `
        <span class="wt-s-comment">
          ${esc(token)}
        </span>
      `;

    } else {

      output += highlightTag(token);
    }

    last = regex.lastIndex;
  }

  output += esc(html.slice(last));

  return output;
};

/* =========================================================
   PAGE OVERVIEW
   ========================================================= */

addTool({
  icon: 'dashboard',
  title: 'Page Overview',
  description: 'Complete page statistics and document information',
  category: 'page',
  keywords: 'title url domain protocol path viewport language charset',
  action: () => {

    const htmlSize =
      new Blob([
        document.documentElement.outerHTML
      ]).size;

    const viewport =
      `${window.innerWidth} × ${window.innerHeight}`;

    openModal(
      'Page Overview',

      `
      <div class="wt-grid">

        ${stat(document.links.length, 'Links')}
        ${stat(document.images.length, 'Images')}
        ${stat(document.forms.length, 'Forms')}
        ${stat(document.scripts.length, 'Scripts')}
        ${stat(document.querySelectorAll('*').length, 'DOM Elements')}
        ${stat(formatBytes(htmlSize), 'HTML Size')}

      </div>

      <br>

      ${card('Title', esc(document.title || '(untitled)'))}

      ${card(
        'URL',
        urlHTML(location.href),
        location.href
      )}

      ${card(
        'Domain',
        esc(location.hostname)
      )}

      ${card(
        'Protocol',
        esc(location.protocol)
      )}

      ${card(
        'Path',
        esc(location.pathname)
      )}

      ${card(
        'Language',
        esc(document.documentElement.lang || '(not specified)')
      )}

      ${card(
        'Charset',
        esc(document.characterSet || '(unknown)')
      )}

      ${card(
        'Viewport',
        esc(viewport)
      )}

      ${card(
        'Referrer',
        esc(document.referrer || '(none)')
      )}
      `
    );
  }
});

/* =========================================================
   DASHBOARD
   ========================================================= */

addTool({
  icon: 'chart',
  title: 'Live Dashboard',
  description: 'Quick health overview of the current page',
  category: 'page',
  keywords: 'dashboard health summary metrics',
  action: () => {

    const images =
      [...document.images];

    const missingAlt =
      images.filter(
        img =>
          !img.hasAttribute('alt') ||
          !img.getAttribute('alt')?.trim()
      ).length;

    const links =
      [...document.links];

    const externalLinks =
      links.filter(
        a => !isSameOrigin(a.href)
      ).length;

    const headings =
      [...document.querySelectorAll(
        'h1,h2,h3,h4,h5,h6'
      )];

    const h1Count =
      document.querySelectorAll('h1').length;

    const forms =
      [...document.forms];

    const requiredFields =
      forms.reduce(
        (sum, form) =>
          sum +
          [...form.elements]
            .filter(el => el.required)
            .length,
        0
      );

    const resourceCount =
      performance.getEntriesByType('resource').length;

    openModal(
      'Live Dashboard',

      `
      <div class="wt-grid">

        ${stat(
          document.querySelectorAll('*').length,
          'DOM Nodes'
        )}

        ${stat(
          document.links.length,
          'Links'
        )}

        ${stat(
          images.length,
          'Images'
        )}

        ${stat(
          headings.length,
          'Headings'
        )}

        ${stat(
          resourceCount,
          'Resources'
        )}

        ${stat(
          document.scripts.length,
          'Scripts'
        )}

      </div>

      <br>

      <div class="wt-card">

        <div class="wt-label">
          Page Health
        </div>

        <div class="wt-health ${
          h1Count === 1
            ? 'wt-ok'
            : 'wt-warn'
        }">

          <span class="wt-health-dot"></span>

          <span>
            H1 count:
            <strong>${h1Count}</strong>
          </span>

        </div>

        <div class="wt-health ${
          missingAlt === 0
            ? 'wt-ok'
            : 'wt-warn'
        }">

          <span class="wt-health-dot"></span>

          <span>
            Missing image alt:
            <strong>${missingAlt}</strong>
          </span>

        </div>

        <div class="wt-health ${
          externalLinks === 0
            ? 'wt-ok'
            : 'wt-warn'
        }">

          <span class="wt-health-dot"></span>

          <span>
            External links:
            <strong>${externalLinks}</strong>
          </span>

        </div>

        <div class="wt-health wt-ok">

          <span class="wt-health-dot"></span>

          <span>
            Required form fields:
            <strong>${requiredFields}</strong>
          </span>

        </div>

      </div>
      `
    );
  }
});

/* =========================================================
   DOM INSPECTOR
   ========================================================= */

const stopInspector = () => {

  state.inspector = false;

  try {
    state.inspectorCleanup?.();
  } catch {}

  state.inspectorCleanup = null;

  document
    .querySelectorAll('.wt-inspector-highlight')
    .forEach(el =>
      el.classList.remove(
        'wt-inspector-highlight'
      )
    );
};

const startInspector = () => {

  stopInspector();

  state.inspector = true;

  let lastElement = null;

  const mouseOver = event => {

    const element = event.target;

    if (
      !isElement(element) ||
      root.contains(element) ||
      element.closest('#wt-pro-modal')
    ) {
      return;
    }

    if (lastElement) {
      lastElement.classList.remove(
        'wt-inspector-highlight'
      );
    }

    lastElement = element;

    element.classList.add(
      'wt-inspector-highlight'
    );
  };

  const mouseOut = event => {

    if (
      isElement(event.target)
    ) {
      event.target.classList.remove(
        'wt-inspector-highlight'
      );
    }
  };

  const click = event => {

    const element = event.target;

    if (
      !isElement(element) ||
      root.contains(element) ||
      element.closest('#wt-pro-modal')
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    inspectElement(element);

    stopInspector();
  };

  document.addEventListener(
    'mouseover',
    mouseOver,
    true
  );

  document.addEventListener(
    'mouseout',
    mouseOut,
    true
  );

  document.addEventListener(
    'click',
    click,
    true
  );

  state.inspectorCleanup = () => {

    document.removeEventListener(
      'mouseover',
      mouseOver,
      true
    );

    document.removeEventListener(
      'mouseout',
      mouseOut,
      true
    );

    document.removeEventListener(
      'click',
      click,
      true
    );
  };

  toast(
    'Inspector enabled — click an element'
  );
};

const inspectElement = element => {

  const rect =
    element.getBoundingClientRect();

  const styles =
    getComputedStyle(element);

  const attributes =
    [...element.attributes];

  const outerHTML =
    element.outerHTML;

  const classes =
    typeof element.className === 'string'
      ? element.className
      : '';

  openModal(
    `Element — <${element.tagName.toLowerCase()}>`,

    `
    <div class="wt-grid">

      ${stat(
        Math.round(rect.width) + ' px',
        'Width'
      )}

      ${stat(
        Math.round(rect.height) + ' px',
        'Height'
      )}

      ${stat(
        element.children.length,
        'Children'
      )}

      ${stat(
        attributes.length,
        'Attributes'
      )}

    </div>

    <br>

    ${card(
      'Tag',
      esc(element.tagName.toLowerCase())
    )}

    ${card(
      'ID',
      esc(element.id || '(none)')
    )}

    ${card(
      'Classes',
      esc(classes || '(none)')
    )}

    ${card(
      'Text',
      esc(
        truncate(
          element.innerText ||
          element.textContent ||
          '',
          2500
        )
      )
    )}

    <div class="wt-card">

      <div class="wt-label">
        Attributes
      </div>

      ${
        attributes.length
          ? `
          <div class="wt-table-wrap">
            <table class="wt-table">
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>

              ${attributes.map(attr => `
                <tr>
                  <td>${esc(attr.name)}</td>
                  <td>${esc(attr.value)}</td>
                </tr>
              `).join('')}

            </table>
          </div>
          `
          : empty('No attributes.')
      }

    </div>

    <div class="wt-card">

      <div class="wt-label">
        Computed Style
      </div>

      <div class="wt-table-wrap">

        <table class="wt-table">

          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>

          ${[
            'display',
            'position',
            'width',
            'height',
            'margin',
            'padding',
            'font-family',
            'font-size',
            'font-weight',
            'line-height',
            'color',
            'background-color',
            'border',
            'z-index',
            'opacity'
          ].map(property => `
            <tr>
              <td>${esc(property)}</td>
              <td>${esc(styles.getPropertyValue(property))}</td>
            </tr>
          `).join('')}

        </table>

      </div>

    </div>

    <div class="wt-card">

      <div class="wt-label">
        Element HTML
      </div>

      <button
        class="wt-copy"
        data-copy="${escAttr(outerHTML)}"
      >
        Copy HTML
      </button>

      <div class="wt-code-wrap">
        <pre class="wt-code">${highlightHTML(
          outerHTML
        )}</pre>
      </div>

    </div>
    `
  );
};

/* =========================================================
   ACCESSIBILITY AUDIT
   ========================================================= */

addTool({
  icon: 'accessibility',
  title: 'Accessibility Audit',
  description: 'Check common accessibility issues',
  category: 'audit',
  keywords: 'a11y aria alt labels buttons forms accessibility',
  action: () => {

    const issues = [];

    const images =
      [...document.images];

    images.forEach((img, index) => {

      if (!img.hasAttribute('alt')) {

        issues.push({
          type: 'error',
          issue: `Image ${index + 1} has no alt attribute`,
          element: img
        });

      }

    });

    const inputs =
      [...document.querySelectorAll(
        'input,textarea,select'
      )];

    inputs.forEach((input, index) => {

      const id = input.id;

      const hasLabel =
        id &&
        document.querySelector(
          `label[for="${CSS.escape(id)}"]`
        );

      const aria =
        input.getAttribute('aria-label') ||
        input.getAttribute('aria-labelledby');

      const placeholder =
        input.getAttribute('placeholder');

      if (
        !hasLabel &&
        !aria &&
        !placeholder &&
        input.type !== 'hidden'
      ) {

        issues.push({
          type: 'warn',
          issue:
            `Form control ${index + 1} may have no accessible label`,
          element: input
        });

      }

    });

    const buttons =
      [...document.querySelectorAll(
        'button,[role="button"]'
      )];

    buttons.forEach((button, index) => {

      const text =
        button.innerText?.trim();

      const aria =
        button.getAttribute('aria-label') ||
        button.getAttribute('aria-labelledby');

      if (!text && !aria) {

        issues.push({
          type: 'warn',
          issue:
            `Button ${index + 1} has no accessible name`,
          element: button
        });

      }

    });

    const htmlLang =
      document.documentElement.lang;

    if (!htmlLang) {

      issues.push({
        type: 'warn',
        issue: 'Document has no lang attribute'
      });

    }

    const h1 =
      document.querySelectorAll('h1').length;

    if (h1 !== 1) {

      issues.push({
        type: 'warn',
        issue:
          `Expected one H1, found ${h1}`
      });

    }

    const score =
      Math.max(
        0,
        100 -
        issues.filter(
          x => x.type === 'error'
        ).length * 12 -
        issues.filter(
          x => x.type === 'warn'
        ).length * 5
      );

    openModal(
      'Accessibility Audit',

      `
      <div class="wt-grid">

        ${stat(score + '%', 'Approx. Health')}
        ${stat(issues.length, 'Issues')}
        ${stat(
          issues.filter(
            x => x.type === 'error'
          ).length,
          'Errors'
        )}
        ${stat(
          issues.filter(
            x => x.type === 'warn'
          ).length,
          'Warnings'
        )}

      </div>

      <br>

      ${
        issues.length
          ? issues.map(item => `
            <div class="wt-health ${
              item.type === 'error'
                ? 'wt-error'
                : 'wt-warn'
            }">

              <span class="wt-health-dot"></span>

              <span>
                ${esc(item.issue)}
              </span>

            </div>
          `).join('')
          : `
            <div class="wt-health wt-ok">
              <span class="wt-health-dot"></span>
              <span>No common accessibility issues detected.</span>
            </div>
          `
      }

      <div class="wt-card">

        <div class="wt-label">
          Note
        </div>

        <div class="wt-value">
          This is a lightweight browser-side audit,
          not a complete WCAG compliance test.
        </div>

      </div>
      `
    );
  }
});

/* =========================================================
   SEO AUDIT
   ========================================================= */

addTool({
  icon: 'seo',
  title: 'SEO Audit',
  description: 'Analyze title, description, headings, canonical and robots',
  category: 'audit',
  keywords: 'seo search engine metadata canonical robots description',
  action: () => {

    const getMeta = name =>
      document.querySelector(
        `meta[name="${name}"]`
      )?.content || '';

    const title =
      document.title.trim();

    const description =
      getMeta('description').trim();

    const canonical =
      document.querySelector(
        'link[rel="canonical"]'
      )?.href || '';

    const robots =
      getMeta('robots');

    const viewport =
      getMeta('viewport');

    const h1 =
      [...document.querySelectorAll('h1')];

    const ogTitle =
      document.querySelector(
        'meta[property="og:title"]'
      )?.content || '';

    const ogDescription =
      document.querySelector(
        'meta[property="og:description"]'
      )?.content || '';

    const ogImage =
      document.querySelector(
        'meta[property="og:image"]'
      )?.content || '';

    const checks = [
      [
        !!title,
        'Title present'
      ],
      [
        !!description,
        'Meta description present'
      ],
      [
        h1.length === 1,
        'Exactly one H1'
      ],
      [
        !!canonical,
        'Canonical URL present'
      ],
      [
        !!viewport,
        'Viewport meta present'
      ],
      [
        !!ogTitle,
        'Open Graph title present'
      ],
      [
        !!ogDescription,
        'Open Graph description present'
      ],
      [
        !!ogImage,
        'Open Graph image present'
      ]
    ];

    const passed =
      checks.filter(x => x[0]).length;

    openModal(
      'SEO Audit',

      `
      <div class="wt-grid">

        ${stat(
          `${passed}/${checks.length}`,
          'Checks Passed'
        )}

        ${stat(
          h1.length,
          'H1 Count'
        )}

        ${stat(
          title.length,
          'Title Characters'
        )}

        ${stat(
          description.length,
          'Description Characters'
        )}

      </div>

      <br>

      ${checks.map(([ok, label]) => `
        <div class="wt-health ${
          ok ? 'wt-ok' : 'wt-warn'
        }">

          <span class="wt-health-dot"></span>

          <span>
            ${esc(label)}
          </span>

        </div>
      `).join('')}

      <br>

      ${card(
        'Title',
        esc(title || '(missing)')
      )}

      ${card(
        'Description',
        esc(description || '(missing)')
      )}

      ${card(
        'Canonical',
        canonical
          ? urlHTML(canonical)
          : '<span class="wt-muted">(missing)</span>'
      )}

      ${card(
        'Robots',
        esc(robots || '(not specified)')
      )}

      ${card(
        'Open Graph Title',
        esc(ogTitle || '(missing)')
      )}

      ${card(
        'Open Graph Description',
        esc(ogDescription || '(missing)')
      )}

      ${card(
        'Open Graph Image',
        ogImage
          ? urlHTML(ogImage)
          : '<span class="wt-muted">(missing)</span>'
      )}
      `
    );
  }
});

/* =========================================================
   LINKS
   ========================================================= */

addTool({
  icon: 'links',
  title: 'Links',
  description: 'Inspect internal, external and security properties',
  category: 'page',
  keywords: 'href external internal target noopener noreferrer',
  action: () => {

    const links =
      [...document.links];

    openModal(
      'Links',

      links.length
        ? `
        <div class="wt-table-wrap">

          <table class="wt-table">

            <tr>
              <th>#</th>
              <th>Text</th>
              <th>Destination</th>
              <th>Type</th>
              <th>Security</th>
            </tr>

            ${links.map((a, index) => {

              const external =
                !isSameOrigin(a.href);

              const newTab =
                a.target === '_blank';

              const rel =
                a.rel || '';

              const unsafe =
                newTab &&
                !/\bnoopener\b/i.test(rel);

              return `
                <tr>

                  <td>${index + 1}</td>

                  <td>
                    ${esc(
                      truncate(
                        a.innerText.trim() ||
                        '(no text)',
                        120
                      )
                    )}
                  </td>

                  <td>
                    ${urlHTML(a.href)}
                  </td>

                  <td>

                    <span class="wt-badge ${
                      external
                        ? 'wt-warn'
                        : 'wt-ok'
                    }">
                      ${
                        external
                          ? 'External'
                          : 'Internal'
                      }
                    </span>

                    ${
                      newTab
                        ? `
                          <span class="wt-badge">
                            New tab
                          </span>
                        `
                        : ''
                    }

                  </td>

                  <td>

                    ${
                      unsafe
                        ? `
                          <span class="wt-badge wt-error">
                            Missing noopener
                          </span>
                        `
                        : `
                          <span class="wt-badge wt-ok">
                            OK
                          </span>
                        `
                    }

                  </td>

                </tr>
              `;

            }).join('')}

          </table>

        </div>
        `
        : empty('No links found.')
    );
  }
});

/* =========================================================
   IMAGES
   ========================================================= */

addTool({
  icon: 'images',
  title: 'Images',
  description: 'Inspect images, dimensions, alt text and loading',
  category: 'page',
  keywords: 'img image alt width height lazy loading',
  action: () => {

    const images =
      [...document.images];

    openModal(
      'Images',

      images.length
        ? images.map((img, index) => {

          const alt =
            img.getAttribute('alt');

          const status =
            !img.complete
              ? 'Loading'
              : img.naturalWidth === 0
                ? 'Failed'
                : 'Loaded';

          return `
            <div class="wt-card">

              <div class="wt-label">
                Image ${index + 1}
              </div>

              <div class="wt-value">

                ${
                  alt !== null
                    ? `
                      <span class="wt-badge wt-ok">
                        Alt present
                      </span>
                    `
                    : `
                      <span class="wt-badge wt-error">
                        Missing alt
                      </span>
                    `
                }

                <span class="wt-badge">
                  ${esc(status)}
                </span>

              </div>

              <br>

              ${urlHTML(img.currentSrc || img.src)}

              ${
                img.src
                  ? `
                    <img
                      class="wt-preview"
                      src="${escAttr(img.currentSrc || img.src)}"
                      loading="lazy"
                      alt=""
                    >
                  `
                  : ''
              }

              ${card(
                'Natural Dimensions',
                `${img.naturalWidth || 0} × ${
                  img.naturalHeight || 0
                }`
              )}

              ${card(
                'Rendered Dimensions',
                `${Math.round(img.getBoundingClientRect().width)} × ${
                  Math.round(img.getBoundingClientRect().height)
                }`
              )}

              ${card(
                'Alt Text',
                esc(
                  alt === null
                    ? '(missing)'
                    : alt || '(empty)'
                )
              )}

            </div>
          `;

        }).join('')
        : empty('No images found.')
    );
  }
});

/* =========================================================
   FORMS
   ========================================================= */

addTool({
  icon: 'forms',
  title: 'Forms',
  description: 'Inspect actions, methods, controls and validation',
  category: 'page',
  keywords: 'form input select textarea required validation action method',
  action: () => {

    const forms =
      [...document.forms];

    openModal(
      'Forms',

      forms.length
        ? forms.map((form, index) => {

          const fields =
            [...form.elements];

          const required =
            fields.filter(
              field => field.required
            ).length;

          return `
            <div class="wt-card">

              <div class="wt-label">
                Form ${index + 1}
              </div>

              ${card(
                'Action',
                urlHTML(form.action)
              )}

              ${card(
                'Method',
                esc(
                  (
                    form.method ||
                    'get'
                  ).toUpperCase()
                )
              )}

              ${card(
                'Fields',
                `${fields.length}`
              )}

              ${card(
                'Required',
                `${required}`
              )}

              ${
                fields.length
                  ? `
                    <div class="wt-table-wrap">

                      <table class="wt-table">

                        <tr>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Required</th>
                        </tr>

                        ${fields.map(field => `
                          <tr>

                            <td>
                              ${esc(
                                field.name ||
                                field.id ||
                                '(unnamed)'
                              )}
                            </td>

                            <td>
                              ${esc(
                                field.type ||
                                field.tagName
                              )}
                            </td>

                            <td>
                              ${
                                field.required
                                  ? `
                                    <span class="wt-badge wt-warn">
                                      Required
                                    </span>
                                  `
                                  : 'No'
                              }
                            </td>

                          </tr>
                        `).join('')}

                      </table>

                    </div>
                  `
                  : ''
              }

            </div>
          `;

        }).join('')
        : empty('No forms found.')
    );
  }
});

/* =========================================================
   HEADINGS
   ========================================================= */

addTool({
  icon: 'headings',
  title: 'Heading Structure',
  description: 'Analyze H1-H6 hierarchy and heading text',
  category: 'page',
  keywords: 'h1 h2 h3 h4 h5 h6 outline hierarchy',
  action: () => {

    const headings =
      [...document.querySelectorAll(
        'h1,h2,h3,h4,h5,h6'
      )];

    openModal(
      'Heading Structure',

      headings.length
        ? headings.map((heading, index) => {

          const level =
            Number(
              heading.tagName.substring(1)
            );

          return `
            <div class="wt-card">

              <div class="wt-label">
                H${level} — ${index + 1}
              </div>

              <div class="wt-value">

                <span class="wt-badge ${
                  level === 1
                    ? 'wt-ok'
                    : ''
                }">
                  Level ${level}
                </span>

                ${esc(
                  truncate(
                    heading.innerText.trim(),
                    500
                  )
                )}

              </div>

            </div>
          `;

        }).join('')
        : empty('No headings found.')
    );
  }
});

/* =========================================================
   SCRIPTS
   ========================================================= */

addTool({
  icon: 'code',
  title: 'Scripts',
  description: 'List inline and external JavaScript',
  category: 'network',
  keywords: 'javascript js script src inline module async defer',
  action: () => {

    const scripts =
      [...document.scripts];

    openModal(
      'Scripts',

      scripts.length
        ? `
          <div class="wt-table-wrap">

            <table class="wt-table">

              <tr>
                <th>#</th>
                <th>Source</th>
                <th>Type</th>
                <th>Async</th>
                <th>Defer</th>
              </tr>

              ${scripts.map((script, index) => `
                <tr>

                  <td>${index + 1}</td>

                  <td>
                    ${
                      script.src
                        ? urlHTML(script.src)
                        : '(inline script)'
                    }
                  </td>

                  <td>
                    ${esc(
                      script.type ||
                      'classic'
                    )}
                  </td>

                  <td>
                    ${
                      script.async
                        ? 'Yes'
                        : 'No'
                    }
                  </td>

                  <td>
                    ${
                      script.defer
                        ? 'Yes'
                        : 'No'
                    }
                  </td>

                </tr>
              `).join('')}

            </table>

          </div>
        `
        : empty('No scripts found.')
    );
  }
});

/* =========================================================
   RESOURCES
   ========================================================= */

addTool({
  icon: 'resources',
  title: 'Network Resources',
  description: 'Inspect resources currently recorded by Performance API',
  category: 'network',
  keywords: 'network fetch resource performance waterfall xhr css js img',
  action: () => {

    const resources =
      performance.getEntriesByType('resource');

    openModal(
      'Network Resources',

      resources.length
        ? `
          <div class="wt-grid">

            ${stat(
              resources.length,
              'Resources'
            )}

            ${stat(
              formatBytes(
                resources.reduce(
                  (sum, resource) =>
                    sum +
                    (
                      resource.transferSize ||
                      0
                    ),
                  0
                )
              ),
              'Transfer Size'
            )}

          </div>

          <br>

          <div class="wt-table-wrap">

            <table class="wt-table">

              <tr>
                <th>#</th>
                <th>Initiator</th>
                <th>Duration</th>
                <th>Transfer</th>
                <th>URL</th>
              </tr>

              ${resources.map((resource, index) => `
                <tr>

                  <td>${index + 1}</td>

                  <td>
                    ${esc(
                      resource.initiatorType ||
                      'unknown'
                    )}
                  </td>

                  <td>
                    ${resource.duration.toFixed(1)} ms
                  </td>

                  <td>
                    ${formatBytes(
                      resource.transferSize ||
                      0
                    )}
                  </td>

                  <td>
                    ${urlHTML(resource.name)}
                  </td>

                </tr>
              `).join('')}

            </table>

          </div>
        `
        : empty(
          'No Performance Resource Timing entries available.'
        )
    );
  }
});

/* =========================================================
   PERFORMANCE
   ========================================================= */

addTool({
  icon: 'performance',
  title: 'Performance',
  description: 'Navigation timing, paint and memory metrics',
  category: 'network',
  keywords: 'performance timing dns ttfb dom load paint memory',
  action: () => {

    const navigation =
      performance.getEntriesByType(
        'navigation'
      )[0];

    const paints =
      performance.getEntriesByType(
        'paint'
      );

    const firstPaint =
      paints.find(
        x => x.name === 'first-paint'
      );

    const firstContentfulPaint =
      paints.find(
        x => x.name === 'first-contentful-paint'
      );

    const memory =
      performance.memory;

    if (!navigation) {

      openModal(
        'Performance',
        empty(
          'Navigation Timing API unavailable.'
        )
      );

      return;
    }

    openModal(
      'Performance',

      `
      <div class="wt-grid">

        ${stat(
          Math.round(
            navigation.domainLookupEnd -
            navigation.domainLookupStart
          ) + ' ms',
          'DNS'
        )}

        ${stat(
          Math.round(
            navigation.responseStart -
            navigation.requestStart
          ) + ' ms',
          'Request'
        )}

        ${stat(
          Math.round(
            navigation.responseEnd -
            navigation.responseStart
          ) + ' ms',
          'Response'
        )}

        ${stat(
          Math.round(
            navigation.domInteractive
          ) + ' ms',
          'DOM Interactive'
        )}

        ${stat(
          Math.round(
            navigation.domComplete
          ) + ' ms',
          'DOM Complete'
        )}

        ${stat(
          firstContentfulPaint
            ? Math.round(
                firstContentfulPaint.startTime
              ) + ' ms'
            : 'N/A',
          'FCP'
        )}

      </div>

      <br>

      ${firstPaint
        ? card(
            'First Paint',
            `${firstPaint.startTime.toFixed(1)} ms`
          )
        : ''
      }

      ${
        memory
          ? `
            <div class="wt-card">

              <div class="wt-label">
                JavaScript Memory
              </div>

              ${card(
                'Used JS Heap',
                formatBytes(
                  memory.usedJSHeapSize
                )
              )}

              ${card(
                'Total JS Heap',
                formatBytes(
                  memory.totalJSHeapSize
                )
              )}

              ${card(
                'Heap Limit',
                formatBytes(
                  memory.jsHeapSizeLimit
                )
              )}

            </div>
          `
          : `
            <div class="wt-card">
              <div class="wt-label">
                JavaScript Memory
              </div>
              <div class="wt-value">
                Performance.memory is not available in this browser.
              </div>
            </div>
          `
      }
      `
    );
  }
});

/* =========================================================
   LOCAL STORAGE
   ========================================================= */

const storageInfo = (name, storage) => {

  const entries = [];

  try {

    for (
      let i = 0;
      i < storage.length;
      i++
    ) {

      const key =
        storage.key(i);

      const value =
        storage.getItem(key);

      entries.push({
        key,
        value,
        bytes:
          new Blob([value || '']).size
      });

    }

  } catch (error) {

    openModal(
      name,
      card(
        'Error',
        esc(error.message)
      )
    );

    return;
  }

  const totalBytes =
    entries.reduce(
      (sum, entry) =>
        sum + entry.bytes,
      0
    );

  openModal(
    name,

    `
    <div class="wt-grid">

      ${stat(
        entries.length,
        'Keys'
      )}

      ${stat(
        formatBytes(totalBytes),
        'Value Size'
      )}

    </div>

    <br>

    ${
      entries.length
        ? entries.map(entry => `
          <div class="wt-card">

            <button
              class="wt-copy"
              data-copy="${escAttr(entry.value)}"
            >
              Copy
            </button>

            <div class="wt-label">
              ${esc(entry.key)}
            </div>

            <div class="wt-value">
              ${esc(entry.value)}
            </div>

            <div class="wt-muted">
              ${formatBytes(entry.bytes)}
            </div>

          </div>
        `).join('')
        : empty(
          'Storage is empty.'
        )
    }
    `
  );
};

addTool({
  icon: 'storage',
  title: 'Local Storage',
  description: 'Inspect localStorage keys, values and size',
  category: 'storage',
  keywords: 'localstorage local storage persistent',
  action: () =>
    storageInfo(
      'Local Storage',
      localStorage
    )
});

/* =========================================================
   SESSION STORAGE
   ========================================================= */

addTool({
  icon: 'session',
  title: 'Session Storage',
  description: 'Inspect sessionStorage keys, values and size',
  category: 'storage',
  keywords: 'sessionstorage session storage temporary',
  action: () =>
    storageInfo(
      'Session Storage',
      sessionStorage
    )
});

/* =========================================================
   COOKIES
   ========================================================= */

addTool({
  icon: 'cookies',
  title: 'Cookies',
  description: 'Inspect cookie availability and metadata safely',
  category: 'storage',
  keywords: 'cookie cookies secure httponly samesite',
  action: () => {

    const cookieString =
      document.cookie || '';

    const cookies =
      cookieString
        ? cookieString
            .split(';')
            .map(x => x.trim())
            .filter(Boolean)
        : [];

    openModal(
      'Cookies',

      `
      ${card(
        'Cookie API',
        navigator.cookieEnabled
          ? `
            <span class="wt-badge wt-ok">
              Enabled
            </span>
          `
          : `
            <span class="wt-badge wt-error">
              Disabled
            </span>
          `
      )}

      ${card(
        'Readable Cookie Count',
        cookies.length
      )}

      <div class="wt-card">

        <div class="wt-label">
          Security
        </div>

        <div class="wt-value">
          Cookie values are intentionally not displayed.
          HttpOnly cookies cannot be read through document.cookie.
        </div>

      </div>

      <div class="wt-card">

        <div class="wt-label">
          Cookie Names
        </div>

        ${
          cookies.length
            ? `
              <ul class="wt-list">
                ${cookies.map(cookie => {
                  const name =
                    cookie.split('=')[0];

                  return `
                    <li>
                      ${esc(name)}
                    </li>
                  `;
                }).join('')}
              </ul>
            `
            : empty(
              'No readable cookies.'
            )
        }

      </div>
      `
    );
  }
});

/* =========================================================
   PAGE SOURCE
   ========================================================= */

addTool({
  icon: 'source',
  title: 'Page Source',
  description: 'View current DOM HTML with syntax highlighting',
  category: 'page',
  keywords: 'source html dom markup code',
  action: () => {

    const html =
      document.documentElement.outerHTML;

    const sourceLines =
      html.split(/\r\n|\r|\n/).length;

    const sourceSize =
      new Blob([html]).size;

    /*
     * Render the source inside an isolated iframe.
     * The host page's CSS cannot affect elements inside
     * this iframe, so global span/pre/div rules cannot
     * create the large vertical gaps seen on some sites.
     */
    const highlightedSource =
      highlightHTML(html);

    const sourceDocument = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-height: 100% !important;
    background: #080a0e !important;
    color: #c9d1d9 !important;
  }

  body {
    overflow: auto !important;
  }

  pre {
    display: block !important;
    margin: 0 !important;
    padding: 16px !important;
    min-width: max-content !important;

    background: #080a0e !important;
    color: #c9d1d9 !important;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      "Liberation Mono",
      monospace !important;

    font-size: 12px !important;
    line-height: 1.5 !important;
    font-weight: 400 !important;
    letter-spacing: normal !important;
    word-spacing: normal !important;

    white-space: pre !important;
    tab-size: 2 !important;
  }

  pre span {
    display: inline !important;
    margin: 0 !important;
    padding: 0 !important;
    line-height: inherit !important;
    font: inherit !important;
    letter-spacing: normal !important;
    word-spacing: normal !important;
    white-space: pre !important;
    vertical-align: baseline !important;
  }

  .wt-s-tag { color: #ff7b72 !important; }
  .wt-s-attr { color: #d2a8ff !important; }
  .wt-s-string { color: #a5d6ff !important; }
  .wt-s-comment { color: #8b949e !important; }
  .wt-s-text { color: #c9d1d9 !important; }
  .wt-s-punct { color: #79c0ff !important; }
</style>
</head>
<body>
<pre>${highlightedSource}</pre>
</body>
</html>`;

    openModal(
      'Document HTML',

      `
      <div class="wt-source-viewer">

        <div class="wt-code-toolbar wt-source-toolbar">

          <button
            class="wt-copy"
            data-copy="${escAttr(html)}"
          >
            Copy HTML
          </button>

          <span class="wt-source-info">
            ${formatBytes(sourceSize)} · ${formatNumber(sourceLines)} lines
          </span>

        </div>

        <iframe
          class="wt-source-frame"
          sandbox
          srcdoc="${escAttr(sourceDocument)}"
          title="Document HTML source"
        ></iframe>

      </div>
      `
    );
  }
});

/* =========================================================
   COPY PAGE TEXT
   ========================================================= */

addTool({
  icon: 'text',
  title: 'Copy Page Text',
  description: 'Copy visible text from the current page',
  category: 'page',
  keywords: 'copy text visible content clipboard',
  action: async () => {

    const text =
      document.body.innerText || '';

    const ok =
      await copyText(text);

    toast(
      ok
        ? 'Page text copied'
        : 'Clipboard permission denied'
    );
  }
});

/* =========================================================
   META / HEAD INSPECTOR
   ========================================================= */

addTool({
  icon: 'code',
  title: 'Head Metadata',
  description: 'Inspect meta tags, links, title and structured metadata',
  category: 'page',
  keywords: 'head meta title charset favicon manifest preload',
  action: () => {

    const meta =
      [...document.head.querySelectorAll(
        'meta'
      )];

    const links =
      [...document.head.querySelectorAll(
        'link'
      )];

    openModal(
      'Head Metadata',

      `
      ${card(
        'Title',
        esc(document.title || '(empty)')
      )}

      <div class="wt-card">

        <div class="wt-label">
          Meta Tags
        </div>

        ${
          meta.length
            ? `
              <div class="wt-table-wrap">

                <table class="wt-table">

                  <tr>
                    <th>Name</th>
                    <th>Property</th>
                    <th>Content</th>
                  </tr>

                  ${meta.map(item => `
                    <tr>

                      <td>
                        ${esc(
                          item.getAttribute('name') ||
                          ''
                        )}
                      </td>

                      <td>
                        ${esc(
                          item.getAttribute('property') ||
                          ''
                        )}
                      </td>

                      <td>
                        ${esc(
                          truncate(
                            item.content || '',
                            500
                          )
                        )}
                      </td>

                    </tr>
                  `).join('')}

                </table>

              </div>
            `
            : empty('No meta tags.')
        }

      </div>

      <div class="wt-card">

        <div class="wt-label">
          Head Links
        </div>

        ${
          links.length
            ? `
              <div class="wt-table-wrap">

                <table class="wt-table">

                  <tr>
                    <th>Rel</th>
                    <th>Type</th>
                    <th>Href</th>
                  </tr>

                  ${links.map(link => `
                    <tr>

                      <td>
                        ${esc(
                          link.rel || ''
                        )}
                      </td>

                      <td>
                        ${esc(
                          link.type || ''
                        )}
                      </td>

                      <td>
                        ${link.href
                          ? urlHTML(link.href)
                          : ''
                        }
                      </td>

                    </tr>
                  `).join('')}

                </table>

              </div>
            `
            : empty('No head links.')
        }

      </div>
      `
    );
  }
});

/* =========================================================
   DOWNLOAD PAGE PDF
   ========================================================= */

addTool({
  icon: 'pdf',
  title: 'Print / PDF',
  description: 'Open the browser print dialog for PDF export',
  category: 'export',
  keywords: 'pdf print save pdf document',
  action: () => {

    panel.classList.remove('open');

    closeModal();

    setTimeout(() => {

      try {
        window.print();
      } catch {
        toast(
          'Print dialog could not be opened'
        );
      }

    }, 50);
  }
});

/* =========================================================
   ZIP EXPORT
   ========================================================= */

const crcTable = (() => {

  const table =
    new Uint32Array(256);

  for (
    let n = 0;
    n < 256;
    n++
  ) {

    let c = n;

    for (
      let k = 0;
      k < 8;
      k++
    ) {

      c =
        c & 1
          ? 0xedb88320 ^ (c >>> 1)
          : c >>> 1;
    }

    table[n] = c >>> 0;
  }

  return table;

})();

const crc32 = data => {

  let crc =
    0xffffffff;

  for (
    let i = 0;
    i < data.length;
    i++
  ) {

    crc =
      crcTable[
        (crc ^ data[i]) & 0xff
      ] ^
      (crc >>> 8);
  }

  return (
    crc ^
    0xffffffff
  ) >>> 0;
};

const uint16 = value => {

  const array =
    new Uint8Array(2);

  new DataView(
    array.buffer
  ).setUint16(
    0,
    value,
    true
  );

  return array;
};

const uint32 = value => {

  const array =
    new Uint8Array(4);

  new DataView(
    array.buffer
  ).setUint32(
    0,
    value >>> 0,
    true
  );

  return array;
};

const concatBytes = arrays => {

  const total =
    arrays.reduce(
      (sum, array) =>
        sum + array.length,
      0
    );

  const result =
    new Uint8Array(total);

  let offset = 0;

  arrays.forEach(array => {

    result.set(
      array,
      offset
    );

    offset += array.length;

  });

  return result;
};

const createStoredZip = entries => {

  const encoder =
    new TextEncoder();

  const localParts = [];
  const centralParts = [];

  let offset = 0;

  entries.forEach(entry => {

    const name =
      encoder.encode(entry.name);

    const data =
      entry.data instanceof Uint8Array
        ? entry.data
        : new Uint8Array(entry.data);

    const crc =
      crc32(data);

    const localHeader =
      concatBytes([

        uint32(0x04034b50),
        uint16(20),
        uint16(0x0800),
        uint16(0),
        uint16(0),
        uint16(0),
        uint32(crc),
        uint32(data.length),
        uint32(data.length),
        uint16(name.length),
        uint16(0),
        name

      ]);

    localParts.push(
      localHeader,
      data
    );

    const centralHeader =
      concatBytes([

        uint32(0x02014b50),
        uint16(20),
        uint16(20),
        uint16(0x0800),
        uint16(0),
        uint16(0),
        uint16(0),
        uint32(crc),
        uint32(data.length),
        uint32(data.length),
        uint16(name.length),
        uint16(0),
        uint16(0),
        uint16(0),
        uint16(0),
        uint32(0),
        uint32(offset),
        name

      ]);

    centralParts.push(
      centralHeader
    );

    offset +=
      localHeader.length +
      data.length;
  });

  const local =
    concatBytes(localParts);

  const central =
    concatBytes(centralParts);

  const end =
    concatBytes([

      uint32(0x06054b50),
      uint16(0),
      uint16(0),
      uint16(entries.length),
      uint16(entries.length),
      uint32(central.length),
      uint32(local.length),
      uint16(0)

    ]);

  return new Blob(
    [local, central, end],
    {
      type: 'application/zip'
    }
  );
};

const loadJSZip = () =>
  new Promise((resolve, reject) => {

    if (window.JSZip) {
      resolve(window.JSZip);
      return;
    }

    const existing =
      [...document.scripts].find(
        script =>
          script.src.includes(
            'jszip'
          )
      );

    if (existing) {

      existing.addEventListener(
        'load',
        () =>
          window.JSZip
            ? resolve(window.JSZip)
            : reject(
                new Error(
                  'JSZip unavailable'
                )
              ),
        { once: true }
      );

      existing.addEventListener(
        'error',
        () =>
          reject(
            new Error(
              'JSZip failed'
            )
          ),
        { once: true }
      );

      return;
    }

    const script =
      document.createElement(
        'script'
      );

    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';

    script.async = true;

    script.onload = () => {

      if (window.JSZip) {
        resolve(window.JSZip);
      } else {
        reject(
          new Error(
            'JSZip unavailable'
          )
        );
      }

    };

    script.onerror = () => {
      reject(
        new Error(
          'Unable to load JSZip'
        )
      );
    };

    document.head.appendChild(script);

  });

const fetchWithTimeout = async (
  url,
  timeout = 10000
) => {

  const controller =
    new AbortController();

  const timer =
    setTimeout(
      () => controller.abort(),
      timeout
    );

  try {

    const response =
      await fetch(url, {
        credentials: 'same-origin',
        cache: 'default',
        signal: controller.signal
      });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    return {
      url: response.url || url,
      type:
        response.headers.get(
          'content-type'
        ) || '',
      data:
        new Uint8Array(
          await response.arrayBuffer()
        )
    };

  } finally {
    clearTimeout(timer);
  }
};

const collectExportResources = () => {

  const map =
    new Map();

  const add = (
    value,
    type = 'asset'
  ) => {

    const absolute =
      absoluteURL(value);

    if (!absolute) return;

    if (!/^https?:$/i.test(
      new URL(absolute).protocol
    )) {
      return;
    }

    if (!isSameOrigin(absolute)) {
      return;
    }

    if (!map.has(absolute)) {
      map.set(
        absolute,
        {
          url: absolute,
          type
        }
      );
    }

  };

  document.querySelectorAll(
    'script[src]'
  ).forEach(script => {

    add(
      script.src,
      'js'
    );

  });

  document.querySelectorAll(
    'link[href]'
  ).forEach(link => {

    const rel =
      link.rel.toLowerCase();

    if (
      rel.includes('stylesheet')
    ) {

      add(
        link.href,
        'css'
      );

    } else {

      add(
        link.href,
        'asset'
      );

    }

  });

  document.querySelectorAll(
    'img[src],video[src],audio[src],iframe[src],source[src]'
  ).forEach(element => {

    add(
      element.currentSrc ||
      element.src,
      'asset'
    );

  });

  document.querySelectorAll(
    '[poster]'
  ).forEach(element => {

    add(
      element.getAttribute(
        'poster'
      ),
      'asset'
    );

  });

  document.querySelectorAll(
    '[srcset]'
  ).forEach(element => {

    const srcset =
      element.getAttribute(
        'srcset'
      ) || '';

    srcset
      .split(',')
      .forEach(part => {

        const candidate =
          part.trim()
            .split(/\s+/)[0];

        if (candidate) {
          add(
            candidate,
            'asset'
          );
        }

      });

  });

  try {

    performance
      .getEntriesByType('resource')
      .forEach(entry => {

        if (!entry?.name) {
          return;
        }

        const type =
          entry.initiatorType === 'script'
            ? 'js'
            : entry.initiatorType === 'css'
              ? 'css'
              : 'asset';

        add(
          entry.name,
          type
        );

      });

  } catch {}

  return [
    ...map.values()
  ];
};

const rewriteHTML = (
  documentClone,
  mapping
) => {

  const rewrite =
    value => {

      const absolute =
        absoluteURL(value);

      return (
        mapping.get(
          absolute
        ) || value
      );
    };

  documentClone
    .querySelectorAll(
      'script[src]'
    )
    .forEach(element => {

      const original =
        element.getAttribute(
          'src'
        );

      element.setAttribute(
        'src',
        rewrite(original)
      );

    });

  documentClone
    .querySelectorAll(
      'link[href]'
    )
    .forEach(element => {

      const original =
        element.getAttribute(
          'href'
        );

      const replaced =
        rewrite(original);

      element.setAttribute(
        'href',
        replaced
      );

    });

  documentClone
    .querySelectorAll(
      'img[src],video[src],audio[src],iframe[src],source[src]'
    )
    .forEach(element => {

      const original =
        element.getAttribute(
          'src'
        );

      element.setAttribute(
        'src',
        rewrite(original)
      );

    });

  documentClone
    .querySelectorAll(
      '[poster]'
    )
    .forEach(element => {

      const original =
        element.getAttribute(
          'poster'
        );

      element.setAttribute(
        'poster',
        rewrite(original)
      );

    });

  documentClone
    .querySelectorAll(
      '[srcset]'
    )
    .forEach(element => {

      const srcset =
        element.getAttribute(
          'srcset'
        ) || '';

      const rewritten =
        srcset
          .split(',')
          .map(part => {

            const bits =
              part.trim()
                .split(/\s+/);

            if (!bits[0]) {
              return part;
            }

            bits[0] =
              rewrite(bits[0]);

            return bits.join(' ');

          })
          .join(', ');

      element.setAttribute(
        'srcset',
        rewritten
      );

    });
};

const rewriteCSS = (
  text,
  cssURL,
  mapping
) => {

  return text.replace(
    /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
    (full, quote, value) => {

      const raw =
        value.trim();

      if (
        !raw ||
        raw.startsWith('data:') ||
        raw.startsWith('#') ||
        raw.startsWith('blob:')
      ) {
        return full;
      }

      const absolute =
        absoluteURL(
          new URL(
            raw,
            cssURL
          ).href
        );

      const mapped =
        mapping.get(
          absolute
        );

      return mapped
        ? `url("${mapped}")`
        : full;
    }
  );
};

const sanitizeExportDOM = () => {

  const clone =
    document.documentElement.cloneNode(
      true
    );

  clone
    .querySelectorAll(
      '#wt-pro-app,#wt-pro-modal,#wt-pro-toast-container,#wt-pro-style'
    )
    .forEach(
      element => element.remove()
    );

  clone
    .querySelectorAll(
      'input,textarea,select'
    )
    .forEach(element => {

      if (
        element.tagName ===
        'TEXTAREA'
      ) {

        element.textContent = '';

      }

      if (
        element.tagName ===
        'INPUT'
      ) {

        const type =
          (
            element.getAttribute(
              'type'
            ) || ''
          ).toLowerCase();

        if (
          type === 'checkbox' ||
          type === 'radio'
        ) {

          element.removeAttribute(
            'checked'
          );

        } else {

          element.removeAttribute(
            'value'
          );

        }

      }

    });

  return clone;
};

const exportFrontend = async () => {

  const filename =
    `${safeFilename(
      location.hostname ||
      'page'
    )}-frontend.zip`;

  const modal =
    openModal(
      'Frontend ZIP Export',

      `
      <div class="wt-card">

        <div class="wt-label">
          Status
        </div>

        <div
          class="wt-value"
          data-export-status
        >
          Preparing...
        </div>

        <div class="wt-progress">
          <div
            class="wt-progress-bar"
            data-export-progress
          ></div>
        </div>

        <div class="wt-status">
          Same-origin browser-accessible resources
          will be collected.
        </div>

      </div>
      `
    );

  const status =
    modal.querySelector(
      '[data-export-status]'
    );

  const progress =
    modal.querySelector(
      '[data-export-progress]'
    );

  const update = (
    message,
    percent
  ) => {

    if (status) {
      status.textContent =
        message;
    }

    if (progress) {
      progress.style.width =
        `${Math.max(
          0,
          Math.min(
            100,
            percent
          )
        )}%`;
    }

  };

  try {

    update(
      'Collecting resources...',
      5
    );

    const resources =
      collectExportResources();

    const mapping =
      new Map();

    const used =
      new Set([
        'index.html',
        'manifest.json'
      ]);

    const entries = [];

    const extension = (
      url,
      type
    ) => {

      try {

        const pathname =
          new URL(url)
            .pathname;

        const basename =
          decodeURIComponent(
            pathname
              .split('/')
              .pop() ||
              'resource'
          );

        const clean =
          safeFilename(
            basename
          );

        if (
          clean.includes('.')
        ) {
          return clean;
        }

        if (type === 'js') {
          return `${clean}.js`;
        }

        if (type === 'css') {
          return `${clean}.css`;
        }

        return clean;

      } catch {

        return (
          type === 'js'
            ? 'script.js'
            : type === 'css'
              ? 'style.css'
              : 'resource'
        );

      }

    };

    const uniquePath =
      (
        path,
        usedSet
      ) => {

        if (!usedSet.has(path)) {
          usedSet.add(path);
          return path;
        }

        const dot =
          path.lastIndexOf('.');

        const base =
          dot > 0
            ? path.slice(0, dot)
            : path;

        const ext =
          dot > 0
            ? path.slice(dot)
            : '';

        let index = 2;
        let candidate;

        do {

          candidate =
            `${base}-${index}${ext}`;

          index++;

        } while (
          usedSet.has(candidate)
        );

        usedSet.add(candidate);

        return candidate;
      };

    resources.forEach(resource => {

      const folder =
        resource.type === 'js'
          ? 'js'
          : resource.type === 'css'
            ? 'css'
            : 'assets';

      const path =
        uniquePath(
          `${folder}/${extension(
            resource.url,
            resource.type
          )}`,
          used
        );

      mapping.set(
        resource.url,
        path
      );

      resource.exportPath =
        path;

    });

    let completed = 0;
    let skipped = 0;

    for (
      const resource of resources
    ) {

      try {

        update(
          `Fetching ${completed + 1}/${resources.length}`,
          10 +
          (
            completed /
            Math.max(
              resources.length,
              1
            )
          ) * 70
        );

        const response =
          await fetchWithTimeout(
            resource.url
          );

        let data =
          response.data;

        if (
          resource.type === 'css'
        ) {

          const text =
            new TextDecoder()
              .decode(data);

          const rewritten =
            rewriteCSS(
              text,
              resource.url,
              mapping
            );

          data =
            new TextEncoder()
              .encode(rewritten);

        }

        entries.push({
          name:
            resource.exportPath,
          data
        });

      } catch {

        skipped++;

      }

      completed++;
    }

    const clone =
      sanitizeExportDOM();

    rewriteHTML(
      clone,
      mapping
    );

    const html =
      '<!DOCTYPE html>\n' +
      clone.outerHTML;

    entries.unshift({
      name: 'index.html',
      data:
        new TextEncoder()
          .encode(html)
    });

    const manifest = {
      exporter: 'Web Tools Pro',
      version: '2.0',
      exportedAt:
        new Date().toISOString(),
      page: {
        url: location.href,
        title: document.title,
        origin: location.origin
      },
      resources: entries.map(
        entry => entry.name
      ),
      skippedResources: skipped
    };

    entries.push({
      name: 'manifest.json',
      data:
        new TextEncoder()
          .encode(
            JSON.stringify(
              manifest,
              null,
              2
            )
          )
    });

    update(
      'Building ZIP...',
      88
    );

    let zipBlob;

    try {

      const JSZip =
        await loadJSZip();

      const zip =
        new JSZip();

      entries.forEach(entry => {

        zip.file(
          entry.name,
          entry.data
        );

      });

      zipBlob =
        await zip.generateAsync({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: {
            level: 6
          }
        });

    } catch {

      zipBlob =
        createStoredZip(entries);

    }

    update(
      'Downloading...',
      97
    );

    downloadBlob(
      zipBlob,
      filename
    );

    update(
      skipped
        ? `Completed — ${skipped} resource(s) skipped`
        : 'Export completed successfully',
      100
    );

    const content =
      modal.querySelector(
        '#wt-pro-content'
      );

    content.insertAdjacentHTML(
      'beforeend',
      `
      ${card(
        'Filename',
        esc(filename)
      )}

      ${card(
        'Files',
        entries.length
      )}

      ${card(
        'Skipped',
        skipped
      )}

      <div class="wt-card">

        <div class="wt-label">
          Important
        </div>

        <div class="wt-value">
          Browser security restrictions can prevent
          cross-origin or protected resources from being
          exported. Server-side/backend source code,
          HTTP-only cookies, credentials and authorization
          headers are not included.
        </div>

      </div>
      `
    );

  } catch (error) {

    setModalHTML(
      `
      <div class="wt-card">

        <div class="wt-label">
          Export Failed
        </div>

        <div class="wt-value">
          ${esc(
            error?.message ||
            'Unknown export error'
          )}
        </div>

      </div>

      <div class="wt-card">

        <div class="wt-value">
          The original page was not modified.
        </div>

      </div>
      `
    );

  }
};

addTool({
  icon: 'download',
  title: 'Download Frontend ZIP',
  description: 'Export HTML, CSS, JS and same-origin assets',
  category: 'export',
  keywords: 'download zip frontend export html css javascript assets',
  action: exportFrontend
});

/* =========================================================
   EVENT HANDLERS
   ========================================================= */

searchInput.addEventListener(
  'input',
  renderTools
);

root.querySelectorAll(
  '.wt-pro-category'
).forEach(button => {

  button.addEventListener(
    'click',
    () => {

      root
        .querySelectorAll(
          '.wt-pro-category'
        )
        .forEach(
          item =>
            item.classList.remove(
              'active'
            )
        );

      button.classList.add(
        'active'
      );

      renderTools();
    }
  );

});

root.querySelector(
  '#wt-pro-launch'
).addEventListener(
  'click',
  () => {

    state.panelOpen =
      !state.panelOpen;

    panel.classList.toggle(
      'open',
      state.panelOpen
    );

    if (state.panelOpen) {
      searchInput.focus();
    }

  }
);

root.querySelector(
  '#wt-pro-close'
).addEventListener(
  'click',
  () => {

    state.panelOpen = false;

    panel.classList.remove(
      'open'
    );

  }
);

root.querySelector('#wt-pro-theme').addEventListener(
  'click',
  () => {
    state.theme =
      state.theme === 'dark'
        ? 'light'
        : 'dark';

    const lightTheme = {
      '--wt-bg': '#ffffff',
      '--wt-bg2': '#f5f7fa',
      '--wt-bg3': '#eef1f5',
      '--wt-border': '#d7dce3',
      '--wt-border-soft': '#e5e9ef',
      '--wt-text': '#171a1f',
      '--wt-muted': '#687181',
      '--wt-accent': '#4f6fd8',
      '--wt-accent-soft': '#4f6fd81c',
      '--wt-green': '#18864b',
      '--wt-yellow': '#a66a00',
      '--wt-red': '#c73d3d'
    };

    const darkTheme = {
      '--wt-bg': '#0e1014',
      '--wt-bg2': '#15181e',
      '--wt-bg3': '#1b1f27',
      '--wt-border': '#282e38',
      '--wt-border-soft': '#20252e',
      '--wt-text': '#f1f4f8',
      '--wt-muted': '#8d96a5',
      '--wt-accent': '#7c9df5',
      '--wt-accent-soft': '#7c9df51c',
      '--wt-green': '#6fd69b',
      '--wt-yellow': '#e8bc62',
      '--wt-red': '#f27676'
    };

    const theme =
      state.theme === 'light'
        ? lightTheme
        : darkTheme;

    Object.entries(theme).forEach(
      ([property, value]) => {
        root.style.setProperty(
          property,
          value
        );
      }
    );

    toast(
      state.theme === 'light'
        ? 'Light theme selected'
        : 'Dark theme selected'
    );
  }
);

/* =========================================================
   OUTSIDE CLICK
   ========================================================= */

document.addEventListener(
  'click',
  event => {

    if (!state.panelOpen) {
      return;
    }

    if (
      root.contains(
        event.target
      )
    ) {
      return;
    }

    if (
      event.target.closest?.(
        '#wt-pro-modal'
      )
    ) {
      return;
    }

    state.panelOpen = false;

    panel.classList.remove(
      'open'
    );

  },
  true
);

/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

document.addEventListener(
  'keydown',
  event => {

    if (
      event.altKey &&
      event.shiftKey &&
      event.code === 'KeyW'
    ) {
      event.preventDefault();
      event.stopPropagation();

      state.panelOpen =
        !state.panelOpen;

      panel.classList.toggle(
        'open',
        state.panelOpen
      );

      if (state.panelOpen) {
        searchInput.focus();
      }

      return;
    }

    if (
      event.key === 'Escape'
    ) {

      if (state.inspector) {
        stopInspector();
        toast(
          'Inspector disabled'
        );
        return;
      }

      if (state.modalOpen) {
        closeModal();
        return;
      }

      if (state.panelOpen) {

        state.panelOpen = false;

        panel.classList.remove(
          'open'
        );

      }

    }

  },
  true
);

/* =========================================================
   INSPECTOR TOOL
   ========================================================= */

addTool({
  icon: 'inspector',
  title: 'DOM Inspector',
  description: 'Click any page element to inspect it',
  category: 'page',
  keywords: 'dom inspect element css computed style dimensions',
  action: startInspector
});

/* =========================================================
   RENDER
   ========================================================= */

renderTools();

/* =========================================================
   INITIAL MESSAGE
   ========================================================= */

toast(
  'Web Tools Pro loaded — Alt + Shift + W'
);

})();
