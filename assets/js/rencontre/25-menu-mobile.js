/* Menu téléphone de la page Rencontre : bouton « ☰ Menu » qui déroule la liste des rubriques.
   - Actif seulement sur petit écran (la mise en page est décidée par le CSS : rencontre-couleurs.css, ≤700px).
   - La pastille rouge reprend le nombre de messages non lus du bouton « 💬 Messages ».
   - Aucun autre script n'est modifié. Pour retirer ce menu : enlever la ligne <script> de pages/rencontre.html. */
(function(){
  'use strict';
  function init(){
    var nav=document.querySelector('header .nav-links');
    if(!nav||document.getElementById('nljMenuBtn'))return;

    var btn=document.createElement('button');
    btn.type='button';btn.id='nljMenuBtn';btn.className='nlj-menu-btn';
    btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls','nljNavList');
    btn.innerHTML='<span class="nlj-menu-ic" aria-hidden="true">☰</span><span class="nlj-menu-tx">Menu</span><i class="nlj-menu-badge" hidden>0</i><span class="nlj-menu-car" aria-hidden="true">▾</span>';
    nav.id=nav.id||'nljNavList';
    nav.classList.add('nlj-collapsed');
    nav.parentNode.insertBefore(btn,nav);

    function setOpen(on){
      nav.classList.toggle('nlj-open',on);
      btn.classList.toggle('on',on);
      btn.setAttribute('aria-expanded',on?'true':'false');
    }
    btn.addEventListener('click',function(e){e.preventDefault();setOpen(!nav.classList.contains('nlj-open'));});
    /* un clic sur une rubrique referme le menu */
    nav.addEventListener('click',function(e){if(e.target.closest('a,button'))setOpen(false);});
    /* un clic ailleurs ou la touche Échap referme aussi */
    document.addEventListener('click',function(e){if(!e.target.closest('#nljMenuBtn')&&!e.target.closest('#nljNavList'))setOpen(false);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')setOpen(false);});

    /* pastille = messages non lus */
    var bdg=btn.querySelector('.nlj-menu-badge');
    function sync(){
      var src=nav.querySelector('.msg-badge'),n=0;
      if(src){
        var shown=src.style.display!=='none'&&getComputedStyle(src).display!=='none';
        n=shown?parseInt((src.textContent||'').replace(/\D/g,''),10)||0:0;
      }
      bdg.textContent=n>99?'99+':String(n);
      bdg.hidden=!n;
    }
    sync();
    var src=nav.querySelector('.msg-badge');
    if(src&&window.MutationObserver){
      new MutationObserver(sync).observe(src,{attributes:true,childList:true,characterData:true,subtree:true});
    }
    setInterval(sync,4000); /* filet de sécurité */
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
