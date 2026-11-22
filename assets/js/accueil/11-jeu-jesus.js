/* Bouton « Jouer » dans la carte « Jeux bibliques » de l'accueil → ouvre le jeu « De Bethléem au Retour » (page 6 de la coque).
   Pour retirer ce bouton : enlever la ligne <script> correspondante dans pages/accueil.html. */
(function(){
  var FR=true;try{FR=(localStorage.getItem('niamke_lang')||'fr').toLowerCase()==='fr';}catch(e){}
  var T=FR?'✝️ Jouer : De Bethléem au Retour':'✝️ Play: From Bethlehem to His Return';
  var st=document.createElement('style');
  st.textContent='.nlj-jeu-btn{align-self:flex-start;margin-top:4px;display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 20px;border:0;border-radius:999px;background:#0f2a4a;color:#f5d98b;font:700 14px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer;transition:opacity .15s}.nlj-jeu-btn:hover{opacity:.9}.nlj-jeu-btn:focus-visible{outline:3px solid #c9a227;outline-offset:3px}';
  (document.head||document.documentElement).appendChild(st);
  function go(){try{parent.postMessage({nlj:'go',page:'p6',id:''},'*');}catch(e){}}
  function run(){
    var c=document.getElementById('games');
    if(!c||document.getElementById('nlj-jeu-btn'))return;
    var b=document.createElement('button');
    b.type='button';b.id='nlj-jeu-btn';b.className='nlj-jeu-btn';b.textContent=T;
    b.addEventListener('click',go);
    c.appendChild(b);
  }
  var tm;
  new MutationObserver(function(){clearTimeout(tm);tm=setTimeout(run,120);}).observe(document.body||document.documentElement,{childList:true,subtree:true});
  run();
})();
