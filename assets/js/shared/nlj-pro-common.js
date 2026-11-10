(function(){
  /* 1) Liens ancres (#musique, #jeux…) : dans une iframe srcdoc, href="#x" pointe vers la page PARENTE
        et rechargeait tout le site (retour à l'accueil). On les gère ici, sans quitter la page. */
  function hdrOffset(){
    try{
      var h=document.querySelector('header,nav.fixed,.nav-fixed');
      if(h){var p=getComputedStyle(h).position;if(p==='sticky'||p==='fixed')return Math.round(h.getBoundingClientRect().height)+8;}
    }catch(e){}
    return 8;
  }
  function setPad(){try{document.documentElement.style.scrollPaddingTop=hdrOffset()+'px';}catch(e){}}
  setPad();window.addEventListener('resize',setPad);window.addEventListener('load',setPad);
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;
    var h=a.getAttribute('href')||'';
    e.preventDefault();
    if(h.length<2)return;
    var id;try{id=decodeURIComponent(h.slice(1));}catch(x){id=h.slice(1);}
    var el=document.getElementById(id);
    if(el){setPad();el.scrollIntoView({behavior:'smooth',block:'start'});}
  });
  /* 2) Finitions : images et liens externes */
  function polish(){
    try{
      document.querySelectorAll('img:not([alt])').forEach(function(i){i.setAttribute('alt','');});
      document.querySelectorAll('a[target="_blank"]').forEach(function(a){
        var r=(a.getAttribute('rel')||'').split(/\s+/);
        ['noopener','noreferrer'].forEach(function(k){if(r.indexOf(k)<0)r.push(k);});
        a.setAttribute('rel',r.join(' ').trim());
      });
    }catch(e){}
  }
  polish();window.addEventListener('load',polish);
  try{new MutationObserver(function(){clearTimeout(window.__nljPT);window.__nljPT=setTimeout(polish,300);}).observe(document.body,{childList:true,subtree:true});}catch(e){}
})();
