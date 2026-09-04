(()=>{
'use strict';

const {
 modal,esc,addTool
}=window.__WEBTOOLS;

const inspectStorage=(title,store)=>{
 let rows=[];

 try{
  for(let i=0;i<store.length;i++){
   const key=store.key(i);

   rows.push({
    key,
    length:String(store.getItem(key)||'').length
   });
  }
 }catch(e){
  modal(title,`
   <div class="wt-card">
    <div class="wt-label">Error</div>
    <div class="wt-value">${esc(e.message)}</div>
   </div>
  `);
  return;
 }

 modal(title,rows.length
  ? `
   <div class="wt-card">
    <div class="wt-label">Entries</div>
    <div class="wt-value">${rows.length}</div>
   </div>

   <div class="wt-table-wrap">
    <table class="wt-table">
     <tr>
      <th>#</th>
      <th>Key</th>
      <th>Value Length</th>
     </tr>
     ${rows.map((r,i)=>`
      <tr>
       <td>${i+1}</td>
       <td>${esc(r.key)}</td>
       <td>${r.length} characters</td>
      </tr>
     `).join('')}
    </table>
   </div>

   <div class="wt-card" style="margin-top:10px">
    <div class="wt-label">Privacy</div>
    <div class="wt-value">
     Values are intentionally not displayed.
    </div>
   </div>
  `
  : `<div class="wt-empty">Storage is empty.</div>`
 );
};

addTool(
 'Storage',
 'Local Storage',
 'Inspect keys and value sizes without exposing values',
 'LS',
 ()=>inspectStorage('Local Storage',localStorage)
);

addTool(
 'Storage',
 'Session Storage',
 'Inspect keys and value sizes without exposing values',
 'SS',
 ()=>inspectStorage('Session Storage',sessionStorage)
);

addTool(
 'Storage',
 'Storage Support',
 'Check browser storage availability',
 'ST',
 ()=>{
  let local=true;
  let session=true;

  try{
   const k='__wt_test__';
   localStorage.setItem(k,'1');
   localStorage.removeItem(k);
  }catch{
   local=false;
  }

  try{
   const k='__wt_test__';
   sessionStorage.setItem(k,'1');
   sessionStorage.removeItem(k);
  }catch{
   session=false;
  }

  modal('Storage Support',
   `<div class="wt-grid">
    <div class="wt-stat">
     <div class="wt-stat-num">${local?'OK':'NO'}</div>
     <div class="wt-stat-label">Local Storage</div>
    </div>
    <div class="wt-stat">
     <div class="wt-stat-num">${session?'OK':'NO'}</div>
     <div class="wt-stat-label">Session Storage</div>
    </div>
   </div>`
  );
 }
);

})();