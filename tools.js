(()=>{
'use strict';

if(window.__WEBTOOLS_LOADING__) return;
window.__WEBTOOLS_LOADING__=true;

const BASE='https://demoverifyin-oss.github.io/web-tools/';

const loadCSS=href=>new Promise((resolve,reject)=>{
  const old=document.querySelector(`link[data-webtools-css="${href}"]`);
  if(old) return resolve();

  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=BASE+href+'?v='+Date.now();
  link.dataset.webtoolsCss=href;

  link.onload=resolve;
  link.onerror=()=>reject(new Error('CSS failed: '+href));

  document.head.appendChild(link);
});

const loadJS=src=>new Promise((resolve,reject)=>{
  const script=document.createElement('script');

  script.src=BASE+src+'?v='+Date.now();
  script.async=false;

  script.onload=resolve;
  script.onerror=()=>reject(new Error('JS failed: '+src));

  document.head.appendChild(script);
});

(async()=>{
  try{

    await loadCSS('styles.css');

    await loadJS('core.js');
    await loadJS('page-tools.js');
    await loadJS('dev-tools.js');
    await loadJS('storage-tools.js');

    window.__WEBTOOLS_LOADING__=false;

    if(typeof window.WebToolsInit==='function'){
      window.WebToolsInit();
    }

  }catch(error){

    window.__WEBTOOLS_LOADING__=false;

    console.error('[WebTools]',error);

    alert(
      'Web Tools load failed.\n\n'+
      error.message
    );
  }
})();
})();