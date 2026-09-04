(()=>{
'use strict';

if(window.__WEBTOOLS){
  window.__WEBTOOLS.destroy();
  return;
}

const BASE='https://demoverifyin-oss.github.io/web-tools/';
const files=['styles.js','core.js','page-tools.js','dev-tools.js','storage-tools.js'];

const load=src=>new Promise((resolve,reject)=>{
  const s=document.createElement('script');
  s.src=BASE+src+'?v='+Date.now();
  s.onload=resolve;
  s.onerror=reject;
  document.documentElement.appendChild(s);
});

(async()=>{
  try{
    for(const file of files) await load(file);
  }catch(e){
    console.error('Web Tools failed to load:',e);
    delete window.__WEBTOOLS;
  }
})();
})();