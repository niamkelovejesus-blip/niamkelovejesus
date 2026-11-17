/* Menu déroulant du téléphone (page Rencontre) : le bouton « ☰ Menu » ouvre/ferme la liste.
   La liste se referme toute seule quand on touche une page ou qu'on touche à côté. */
(function(){
  function set(open){
    var l=document.getElementById('nlj-links'),b=document.getElementById('nlj-menu-btn');
    if(!l||!b)return;
    l.classList.toggle('open',open);
    b.setAttribute('aria-expanded',open?'true':'false');
    var s=b.querySelector('.nlj-t');if(s)s.textContent=open?'✕ Fermer':'☰ Menu';
  }
  document.addEventListener('click',function(e){
    var l=document.getElementById('nlj-links');if(!l)return;
    if(e.target.closest('#nlj-menu-btn')){set(!l.classList.contains('open'));return;}
    if(l.classList.contains('open')){set(false);}
  });
})();

/* Message vocal du tchat : bouton 🗑 « Annuler » pendant l'enregistrement.
   Si on se trompe en parlant, on touche 🗑 : l'enregistrement est jeté et rien n'est envoyé. */
(function(){
  var last=null;
  try{
    var P=window.MediaRecorder&&MediaRecorder.prototype,st=P&&P.start;
    if(st){P.start=function(){last=this;return st.apply(this,arguments);};}
  }catch(e){}
  var css=document.createElement('style');
  css.textContent='#chatMicCancel{flex:none;width:46px;height:46px;border-radius:50%;border:1px solid #fca5a5;background:#fee2e2;color:#b91c1c;font-size:1.15rem;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0}#chatMicCancel[hidden]{display:none!important}';
  document.head.appendChild(css);
  function cancelRec(){
    var mr=last;if(!mr||mr.state==='inactive')return;
    try{mr.ondataavailable=null;}catch(e){}   /* rien n'est gardé : le message ne part pas */
    try{mr.stop();}catch(e){}
    try{if(window.showToast)window.showToast('🗑 Enregistrement annulé');}catch(e){}
  }
  function init(){
    var mic=document.getElementById('chatMic');if(!mic||document.getElementById('chatMicCancel'))return;
    var b=document.createElement('button');
    b.type='button';b.id='chatMicCancel';b.hidden=true;b.textContent='🗑';
    b.title='Annuler cet enregistrement';b.setAttribute('aria-label','Annuler cet enregistrement');
    mic.insertAdjacentElement('afterend',b);
    b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();cancelRec();b.hidden=true;});
    function sync(){b.hidden=!mic.classList.contains('rec');}
    new MutationObserver(sync).observe(mic,{attributes:true,attributeFilter:['class']});
    sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
