/* Carte « De Bethléem au Retour » sur l'accueil, à côté de « Jeux bibliques » et « Musique chrétienne »,
   avec le même aspect que les cartes de jeux de la page Rencontre → ouvre le jeu (page 6 de la coque).
   Pour la retirer : enlever la ligne <script> correspondante dans pages/accueil.html. */
(function(){
  var FR=true;try{FR=(localStorage.getItem('niamke_lang')||'fr').toLowerCase()==='fr';}catch(e){}
  var T1=FR?'De Bethléem au Retour':'From Bethlehem to His Return';
  var T2=FR?'Sa venue, sa mort, son avènement • 3 chapitres • ⭐⭐⭐':'His coming, His death, His return • 3 chapters • ⭐⭐⭐';
  var T3=FR?'▶️ Jouer':'▶️ Play';
  var st=document.createElement('style');
  st.textContent='#nlj-jeu-card{background:#fff;border-radius:20px;padding:28px;box-shadow:0 10px 30px rgba(15,42,74,.08);text-align:center;border:1px solid #eef2f7;display:flex;flex-direction:column;align-items:center;gap:8px}'
  +'#nlj-jeu-card .nlj-e{font-size:2.2rem;line-height:1.3}'
  +'#nlj-jeu-card h3{margin:0;font:700 1.25rem/1.25 Fraunces,Georgia,serif;color:#0f2a4a}'
  +'#nlj-jeu-card p{margin:0 0 10px;flex:1;color:#5b6675;font-size:.92rem;line-height:1.5}'
  +'#nlj-jeu-card button{display:inline-flex;align-items:center;justify-content:center;border:0;cursor:pointer;font:800 .92rem system-ui,-apple-system,"Segoe UI",sans-serif;padding:12px 20px;border-radius:999px;background:#0f2a4a;color:#fff;transition:.2s}'
  +'#nlj-jeu-card button:hover{opacity:.9}#nlj-jeu-card button:focus-visible{outline:3px solid #c9a227;outline-offset:3px}';
  (document.head||document.documentElement).appendChild(st);
  function go(){try{parent.postMessage({nlj:'go',page:'p6',id:''},'*');}catch(e){}}
  function run(){
    var g=document.getElementById('games');
    if(!g||!g.parentNode||document.getElementById('nlj-jeu-card'))return;
    var c=document.createElement('div');c.id='nlj-jeu-card';
    var e=document.createElement('div');e.className='nlj-e';e.setAttribute('aria-hidden','true');e.textContent='✝️';
    var h=document.createElement('h3');h.textContent=T1;
    var p=document.createElement('p');p.textContent=T2;
    var b=document.createElement('button');b.type='button';b.textContent=T3;b.addEventListener('click',go);
    c.appendChild(e);c.appendChild(h);c.appendChild(p);c.appendChild(b);
    g.parentNode.appendChild(c);
  }
  var tm;
  new MutationObserver(function(){clearTimeout(tm);tm=setTimeout(run,120);}).observe(document.body||document.documentElement,{childList:true,subtree:true});
  run();
})();
