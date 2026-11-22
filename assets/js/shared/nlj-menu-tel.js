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
