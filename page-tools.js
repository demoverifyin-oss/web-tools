(()=>{
'use strict';

const {
 modal,copy,esc,urlHTML,card,bindCopies,addTool
}=window.__WEBTOOLS;

addTool(
 'Page',
 'Page Overview',
 'URL, domain, document statistics and metadata',
 'P',
 ()=>{
  const meta=[...document.querySelectorAll('meta')]
   .map(x=>({
    name:x.getAttribute('name')||x.getAttribute('property')||'',
    content:x.getAttribute('content')||''
   }))
   .filter(x=>x.name);

  modal('Page Overview',`
   <div class="wt-grid">
    <div class="wt-stat">
     <div class="wt-stat-num">${document.links.length}</div>
     <div class="wt-stat-label">Links</div>
    </div>
    <div class="wt-stat">
     <div class="wt-stat-num">${document.images.length}</div>
     <div class="wt-stat-label">Images</div>
    </div>
    <div class="wt-stat">
     <div class="wt-stat-num">${document.forms.length}</div>
     <div class="wt-stat-label">Forms</div>
    </div>
    <div class="wt-stat">
     <div class="wt-stat-num">${document.scripts.length}</div>
     <div class="wt-stat-label">Scripts</div>
    </div>
   </div>

   <br>

   ${card('Title',esc(document.title),document.title)}
   ${card('URL',urlHTML(location.href),location.href)}
   ${card('Domain',esc(location.hostname),location.hostname)}
   ${card('Protocol',esc(location.protocol),location.protocol)}
   ${card('Path',esc(location.pathname),location.pathname)}
   ${card('Referrer',esc(document.referrer||'(none)'))}

   <div class="wt-card">
    <div class="wt-label">Meta Tags</div>
    ${
     meta.length
      ? `<div class="wt-table-wrap"><table class="wt-table">
       <tr><th>Name</th><th>Content</th></tr>
       ${meta.map(x=>`
        <tr>
         <td>${esc(x.name)}</td>
         <td>${esc(x.content)}</td>
        </tr>
       `).join('')}
      </table></div>`
      : `<div class="wt-value">No named meta tags found.</div>`
    }
   </div>
  `);

  bindCopies();
 }
);

addTool(
 'Page',
 'Links',
 'All links with clickable destinations',
 'L',
 ()=>{
  const links=[...document.links];

  modal('Links',links.length
   ? `<div class="wt-table-wrap"><table class="wt-table">
    <tr><th>#</th><th>Text</th><th>Destination</th></tr>
    ${links.map((a,i)=>`
     <tr>
      <td>${i+1}</td>
      <td>${esc(a.innerText.trim()||'(no text)')}</td>
      <td>${urlHTML(a.href)}</td>
     </tr>
    `).join('')}
   </table></div>`
   : `<div class="wt-empty">No links found.</div>`
  );
 }
);

addTool(
 'Page',
 'Images',
 'Preview images and inspect their source URLs',
 'I',
 ()=>{
  const images=[...document.images];

  modal('Images',images.length
   ? images.map((img,i)=>`
    <div class="wt-card">
     <div class="wt-label">Image ${i+1}</div>
     <div class="wt-value">${urlHTML(img.src)}</div>
     <img class="wt-preview"
       src="${esc(img.src)}"
       loading="lazy"
       onerror="this.style.display='none'">
     <div class="wt-value" style="margin-top:8px">
      ${img.naturalWidth||'?'} × ${img.naturalHeight||'?'}
     </div>
    </div>
   `).join('')
   : `<div class="wt-empty">No images found.</div>`
  );
 }
);

addTool(
 'Page',
 'Forms',
 'Inspect form structure without displaying entered values',
 'F',
 ()=>{
  const forms=[...document.forms];

  modal('Forms',forms.length
   ? forms.map((form,i)=>`
    <div class="wt-card">
     <div class="wt-label">Form ${i+1}</div>
     <div class="wt-value">
      <strong>Action:</strong> ${urlHTML(form.action)}<br>
      <strong>Method:</strong> ${esc((form.method||'get').toUpperCase())}<br>
      <strong>Fields:</strong> ${form.elements.length}
     </div>

     <br>

     <div class="wt-table-wrap">
      <table class="wt-table">
       <tr><th>Name</th><th>Type</th><th>Tag</th></tr>
       ${[...form.elements].map(el=>`
        <tr>
         <td>${esc(el.name||'(none)')}</td>
         <td>${esc(el.type||'(none)')}</td>
         <td>${esc(el.tagName)}</td>
        </tr>
       `).join('')}
      </table>
     </div>
    </div>
   `).join('')
   : `<div class="wt-empty">No forms found.</div>`
  );
 }
);

addTool(
 'Page',
 'Headings',
 'Inspect H1 through H6 document structure',
 'H',
 ()=>{
  const headings=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];

  modal('Headings',headings.length
   ? headings.map((h,i)=>`
    <div class="wt-card">
     <div class="wt-label">${h.tagName} · ${i+1}</div>
     <div class="wt-value">${esc(h.innerText.trim()||'(empty)')}</div>
    </div>
   `).join('')
   : `<div class="wt-empty">No headings found.</div>`
  );
 }
);

addTool(
 'Page',
 'Copy Page Text',
 'Copy visible text from the current page',
 'T',
 async()=>{
  const ok=await copy(document.body.innerText||'');
  alert(ok?'Visible page text copied.':'Clipboard permission denied.');
 }
);

})();