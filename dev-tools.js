(()=>{
'use strict';

const {
 modal,esc,urlHTML,card,bindCopies,addTool
}=window.__WEBTOOLS;

addTool(
 'Developer',
 'DOM Inspector',
 'Tap an element to inspect its basic structure',
 'D',
 ()=>{
  let active=true;

  const style=document.createElement('style');
  style.id='wt-inspector-style';
  style.textContent=`
   [data-wt-highlight]{
    outline:3px solid #7c9eff!important;
    outline-offset:2px!important;
    cursor:crosshair!important;
   }
  `;
  document.head.appendChild(style);

  const clear=()=>{
   document.querySelectorAll('[data-wt-highlight]')
    .forEach(x=>x.removeAttribute('data-wt-highlight'));
  };

  const over=e=>{
   if(!active||window.__WEBTOOLS.root.contains(e.target))return;
   if(e.target.closest('#wt-modal'))return;
   e.target.setAttribute('data-wt-highlight','');
  };

  const out=e=>{
   e.target.removeAttribute('data-wt-highlight');
  };

  const click=e=>{
   if(!active)return;
   if(window.__WEBTOOLS.root.contains(e.target))return;
   if(e.target.closest('#wt-modal'))return;

   e.preventDefault();
   e.stopPropagation();

   const el=e.target;

   modal(
    'Element',
    card('Tag',esc(el.tagName))+
    card('ID',esc(el.id||'(none)'))+
    card(
     'Classes',
     esc(typeof el.className==='string'
      ? el.className
      : '(none)')
    )+
    card(
     'Text',
     esc((el.innerText||'').trim().slice(0,2000))
    )
   );

   bindCopies();
  };

  document.addEventListener('mouseover',over,true);
  document.addEventListener('mouseout',out,true);
  document.addEventListener('click',click,true);

  alert('DOM Inspector enabled for 30 seconds.');

  setTimeout(()=>{
   active=false;
   clear();
   document.removeEventListener('mouseover',over,true);
   document.removeEventListener('mouseout',out,true);
   document.removeEventListener('click',click,true);
   style.remove();
  },30000);
 }
);

addTool(
 'Developer',
 'Performance',
 'Navigation timing and page-load metrics',
 'P',
 ()=>{
  const p=performance.getEntriesByType('navigation')[0];

  if(!p){
   modal('Performance',
    `<div class="wt-empty">Navigation timing unavailable.</div>`);
   return;
  }

  const dns=p.domainLookupEnd-p.domainLookupStart;
  const connection=p.connectEnd-p.connectStart;
  const response=p.responseEnd-p.responseStart;

  modal('Performance',`
   <div class="wt-grid">
    <div class="wt-stat">
     <div class="wt-stat-num">${dns.toFixed(0)}ms</div>
     <div class="wt-stat-label">DNS</div>
    </div>
    <div class="wt-stat">
     <div class="wt-stat-num">${connection.toFixed(0)}ms</div>
     <div class="wt-stat-label">Connection</div>
    </div>
    <div class="wt-stat">
     <div class="wt-stat-num">${response.toFixed(0)}ms</div>
     <div class="wt-stat-label">Response</div>
    </div>
    <div class="wt-stat">
     <div class="wt-stat-num">${p.domInteractive.toFixed(0)}ms</div>
     <div class="wt-stat-label">DOM Interactive</div>
    </div>
   </div>

   <br>

   ${card('DOM Complete',p.domComplete.toFixed(2)+' ms')}
   ${card('Load Event',p.loadEventEnd.toFixed(2)+' ms')}
   ${card('Transfer Size',
    p.transferSize!=null
     ? p.transferSize+' bytes'
     : 'Unavailable')}
  `);
 }
);

addTool(
 'Developer',
 'Resources',
 'List resources loaded by the current page',
 'R',
 ()=>{
  const resources=performance.getEntriesByType('resource');

  modal('Resources',resources.length
   ? `<div class="wt-table-wrap"><table class="wt-table">
    <tr><th>#</th><th>Type</th><th>Duration</th><th>Resource</th></tr>
    ${resources.map((x,i)=>`
     <tr>
      <td>${i+1}</td>
      <td>${esc(x.initiatorType||'unknown')}</td>
      <td>${x.duration.toFixed(1)} ms</td>
      <td>${urlHTML(x.name)}</td>
     </tr>
    `).join('')}
   </table></div>`
   : `<div class="wt-empty">No resource entries available.</div>`
  );
 }
);

addTool(
 'Developer',
 'Scripts',
 'List external and inline JavaScript elements',
 'JS',
 ()=>{
  const scripts=[...document.scripts];

  modal('Scripts',scripts.length
   ? scripts.map((s,i)=>`
    <div class="wt-card">
     <div class="wt-label">Script ${i+1}</div>
     <div class="wt-value">
      ${s.src
       ? urlHTML(s.src)
       : '<span class="wt-badge">Inline script</span>'}
     </div>
    </div>
   `).join('')
   : `<div class="wt-empty">No scripts found.</div>`
  );
 }
);

addTool(
 'Developer',
 'Stylesheets',
 'List stylesheets referenced by the page',
 'CSS',
 ()=>{
  const sheets=[...document.styleSheets];

  modal('Stylesheets',sheets.length
   ? sheets.map((s,i)=>`
    <div class="wt-card">
     <div class="wt-label">Stylesheet ${i+1}</div>
     <div class="wt-value">
      ${s.href
       ? urlHTML(s.href)
       : '<span class="wt-badge">Inline stylesheet</span>'}
     </div>
    </div>
   `).join('')
   : `<div class="wt-empty">No stylesheets found.</div>`
  );
 }
);

addTool(
 'Developer',
 'Viewport',
 'Current viewport, screen and device information',
 'V',
 ()=>{
  modal('Viewport',
   card('Viewport',
    `${innerWidth} × ${innerHeight}`)+
   card('Screen',
    `${screen.width} × ${screen.height}`)+
   card('Device Pixel Ratio',
    String(devicePixelRatio))+
   card('Language',
    esc(navigator.language||'(unknown)'))+
   card('Online',
    navigator.onLine?'Yes':'No')+
   card('User Agent',
    esc(navigator.userAgent))
  );
 }
);

})();