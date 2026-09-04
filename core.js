(()=>{
'use strict';

if(window.__WEBTOOLS_CORE__)return;
window.__WEBTOOLS_CORE__=true;

const esc=v=>String(v??'')
 .replace(/&/g,'&amp;')
 .replace(/</g,'&lt;')
 .replace(/>/g,'&gt;')
 .replace(/"/g,'&quot;')
 .replace(/'/g,'&#39;');

const root=document.createElement('div');
root.id='wt-app';

root.innerHTML=`
<button id="wt-launch">
 <span class="wt-launch-dot"></span>
 Web Tools
</button>

<div id="wt-panel">
 <div id="wt-header">
  <div class="wt-brand">
   <div class="wt-brand-mark">WT</div>
   <div>
    <div class="wt-brand-title">Web Tools</div>
    <div class="wt-brand-sub">Browser inspection toolkit</div>
   </div>
  </div>
  <button class="wt-header-btn" id="wt-close">×</button>
 </div>

 <div id="wt-search-wrap">
  <span id="wt-search-icon">⌕</span>
  <input id="wt-search" autocomplete="off" placeholder="Search tools">
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
  <div id="wt-modal-box">
   <div id="wt-modal-top"><div id="wt-grip"></div></div>
   <div id="wt-modal-head">
    <div id="wt-modal-title">${esc(title)}</div>
    <button id="wt-modal-close">Close</button>
   </div>
   <div id="wt-content">${html}</div>
  </div>
 `;

 document.body.appendChild(m);

 m.querySelector('#wt-modal-close').onclick=()=>m.remove();

 m.addEventListener('click',e=>{
  if(e.target===m)m.remove();
 });
};

const copy=async text=>{
 try{
  await navigator.clipboard.writeText(String(text));
  return true;
 }catch{
  return false;
 }
};

const urlHTML=url=>{
 const safe=esc(url);
 return `<a class="wt-url" href="${safe}" target="_blank" rel="noopener noreferrer">${safe}</a>`;
};

const card=(label,value,copyValue)=>{
 const copyButton=copyValue!==undefined
  ? `<button class="wt-copy" data-copy="${esc(copyValue)}">Copy</button>`
  : '';

 return `
 <div class="wt-card">
  <div class="wt-label">${esc(label)}</div>
  <div class="wt-value">${copyButton}${value}</div>
 </div>`;
};

const bindCopies=()=>{
 document.querySelectorAll('#wt-content .wt-copy').forEach(btn=>{
  btn.onclick=async()=>{
   const ok=await copy(btn.dataset.copy);
   btn.textContent=ok?'Copied':'Failed';
   setTimeout(()=>btn.textContent='Copy',1000);
  };
 });
};

const addTool=(section,title,description,icon,fn)=>{
 const sectionEl=[...tools.querySelectorAll('.wt-section')]
  .find(x=>x.dataset.section===section);

 let target=sectionEl;

 if(!target){
  target=document.createElement('div');
  target.className='wt-section';
  target.dataset.section=section;
  target.textContent=section;
  tools.appendChild(target);
 }

 const b=document.createElement('button');
 b.className='wt-tool';
 b.dataset.search=(title+' '+description+' '+section).toLowerCase();

 b.innerHTML=`
  <div class="wt-tool-icon">${icon}</div>
  <div style="min-width:0">
   <div class="wt-tool-title">${esc(title)}</div>
   <div class="wt-tool-desc">${esc(description)}</div>
  </div>
 `;

 b.onclick=fn;

 target.insertAdjacentElement('afterend',b);
};

search.oninput=()=>{
 const q=search.value.toLowerCase().trim();

 tools.querySelectorAll('.wt-tool').forEach(b=>{
  b.style.display=!q||b.dataset.search.includes(q)?'flex':'none';
 });

 tools.querySelectorAll('.wt-section').forEach(section=>{
  let visible=false;
  let next=section.nextElementSibling;

  while(next&&!next.classList.contains('wt-section')){
   if(next.classList.contains('wt-tool')&&next.style.display!=='none')
    visible=true;
   next=next.nextElementSibling;
  }

  section.style.display=visible?'block':'none';
 });
};

root.querySelector('#wt-launch').onclick=()=>{
 panel.style.display=panel.style.display==='block'?'none':'block';
};

root.querySelector('#wt-close').onclick=()=>{
 panel.style.display='none';
};

window.__WEBTOOLS={
 root,
 modal,
 copy,
 esc,
 urlHTML,
 card,
 bindCopies,
 addTool,

 destroy(){
  document.getElementById('wt-modal')?.remove();
  document.getElementById('wt-style')?.remove();
  root.remove();
  delete window.__WEBTOOLS;
  delete window.__WEBTOOLS_CORE__;
 }
};

})();