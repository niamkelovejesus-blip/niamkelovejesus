(function(){
/* Bouton flottant « Apprenons la Bible » de la PAGE D'ACCUEIL (page 1) uniquement, en bas à droite.
   Code indépendant : il n'utilise plus le script partagé nlj-parlons-fab.js (qui sert aux pages 2 et 3).
   Ouvre la Bible = page 5 de la coque (pages/bible.html). */
if(document.getElementById('nlj-bible-home'))return;
var FR=true;try{FR=(localStorage.getItem('niamke_lang')||'fr').toLowerCase()==='fr';}catch(e){}
var txt=FR?'Apprenons la Bible':'Let’s learn the Bible';
var st=document.createElement('style');
st.textContent='#nlj-bible-home{position:fixed;right:18px;bottom:calc(150px + env(safe-area-inset-bottom,0px));z-index:39;display:inline-flex;align-items:center;gap:8px;padding:0 18px 0 8px;height:48px;border-radius:999px;border:2px solid #c9a77a;background:#0f2a4a;color:#fff;cursor:pointer;box-shadow:0 10px 28px rgba(15,42,74,.28);font:800 14px/1 system-ui,-apple-system,"Segoe UI",sans-serif;transition:transform .2s;max-width:calc(100vw - 28px)}'
+'#nlj-bible-home i{font-style:normal;font-size:22px;width:34px;height:34px;border-radius:50%;background:#c9a227;display:grid;place-items:center;flex:none}'
+'#nlj-bible-home:hover{transform:translateY(-3px)}'
+'#nlj-bible-home:focus-visible{outline:3px solid #c9a77a;outline-offset:3px}'
+'@media(max-width:720px){#nlj-bible-home{right:12px;bottom:196px;height:44px;font-size:13px}#nlj-bible-home i{width:30px;height:30px;font-size:19px}}'
+'@media(prefers-reduced-motion:reduce){#nlj-bible-home{transition:none}}';
document.head.appendChild(st);
function go(){try{parent.postMessage({nlj:'go',page:'p5',id:''},'*');}catch(e){}}
function add(){
  if(document.getElementById('nlj-bible-home'))return;
  var k=document.createElement('button');
  k.id='nlj-bible-home';k.type='button';
  k.innerHTML='<i aria-hidden="true">📖</i><span></span>';
  k.lastChild.textContent=txt;
  k.setAttribute('aria-label',txt+(FR?' — ouvrir la Bible':' — open the Bible'));
  k.addEventListener('click',go);
  document.body.appendChild(k);
}
if(document.body)add();else document.addEventListener('DOMContentLoaded',add);
})();
