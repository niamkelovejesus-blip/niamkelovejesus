/* Fenêtre ouverte (connexion, discussion, modale, photo) : la page derrière ne défile plus */
(function(){
  if(window.__nljScrollLock)return;window.__nljScrollLock=true;
  var st=document.createElement('style');
  st.textContent='body.nlj-lock{position:fixed!important;left:0;right:0;width:100%;overflow:hidden!important}html.nlj-lock-html,html.nlj-lock-html body{overflow:hidden!important;overscroll-behavior:none!important}.nja-ov,#chatPanel,.modal-overlay,.lbx{overscroll-behavior:contain}';
  (document.head||document.documentElement).appendChild(st);
  var locked=false,savedY=0;
  function visible(sel){var l=document.querySelectorAll(sel);for(var i=0;i<l.length;i++)if(l[i].offsetParent!==null||getComputedStyle(l[i]).position==='fixed')return true;return false;}
  function anyOpen(){
    var p=document.getElementById('chatPanel');
    if(p&&!p.classList.contains('hidden'))return true;
    if(document.querySelector('.nja-ov.on'))return true;       /* connexion / inscription (accueil) */
    if(document.querySelector('.modal-overlay.open'))return true;
    if(document.querySelector('.lbx'))return true;
    return false;
  }
  function lock(){
    if(locked||!document.body)return;locked=true;
    savedY=window.pageYOffset||document.documentElement.scrollTop||0;
    document.body.style.top='-'+savedY+'px';
    document.body.classList.add('nlj-lock');document.documentElement.classList.add('nlj-lock-html');
  }
  function unlock(){
    if(!locked)return;locked=false;
    document.body.classList.remove('nlj-lock');document.documentElement.classList.remove('nlj-lock-html');document.body.style.top='';
    try{window.scrollTo({top:savedY,left:0,behavior:'instant'});}catch(e){window.scrollTo(0,savedY);}
  }
  function check(){if(anyOpen())lock();else unlock();}
  function scroller(el){
    while(el&&el!==document.body&&el!==document.documentElement){
      if(el.nodeType===1){var o=getComputedStyle(el).overflowY;if((o==='auto'||o==='scroll')&&el.scrollHeight>el.clientHeight+1)return el;}
      el=el.parentNode;
    }
    return null;
  }
  var y0=0;
  document.addEventListener('touchstart',function(e){check();y0=e.touches&&e.touches[0]?e.touches[0].clientY:0;},{passive:true,capture:true});
  /* le doigt qui glisse sur le fond, sur une zone non défilante, ou au bout d'une liste ne fait plus bouger la page derrière */
  document.addEventListener('touchmove',function(e){
    if(!locked)return;
    var sc=scroller(e.target);
    if(!sc){e.preventDefault();return;}
    var y=e.touches&&e.touches[0]?e.touches[0].clientY:y0,dy=y-y0;
    if(dy>0&&sc.scrollTop<=0)e.preventDefault();                                   /* tire vers le bas alors que la liste est tout en haut */
    else if(dy<0&&sc.scrollTop+sc.clientHeight>=sc.scrollHeight-1)e.preventDefault(); /* pousse vers le haut alors que la liste est tout en bas */
  },{passive:false});
  function init(){
    new MutationObserver(check).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
    check();
  }
  if(document.body)init();else document.addEventListener('DOMContentLoaded',init);
})();
