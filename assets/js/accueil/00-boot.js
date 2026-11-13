/* Cache la page provisoire (HTML statique) jusqu'à ce que l'application soit affichée dans la bonne langue */
(function(){
  var de=document.documentElement;de.classList.add('nlj-boot');
  var st=document.createElement('style');st.textContent='html.nlj-boot #root{opacity:0!important}';
  (document.head||de).appendChild(st);
  var done=false;
  function fin(){if(done)return;done=true;de.classList.remove('nlj-boot');de.classList.add('nlj-booted');try{if(window.parent&&window.parent!==window)window.parent.postMessage({nlj:'app-ready'},'*');}catch(e){}}
  function watch(){
    var r=document.getElementById('root');if(!r){setTimeout(watch,30);return;}
    var first=r.firstElementChild;
    new MutationObserver(function(){if(r.firstElementChild!==first)setTimeout(fin,60);}).observe(r,{childList:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
  setTimeout(fin,2200);   /* sécurité */
})();
