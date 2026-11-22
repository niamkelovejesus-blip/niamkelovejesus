/* Bouton flottant « 📖 Apprenons la Bible » → page 5 de la coque (toutes les pages sauf la Bible elle-même).
   Fichier indépendant de « Parlons de Jésus » (nlj-parlons-fab.js). */
(function(){
var PG=document.documentElement.getAttribute('data-nlj-page')||'';
var ACC=/accueil/.test(location.pathname);
if(PG==='bible'||document.getElementById('nlj-bible'))return;
var FR=true;try{FR=(localStorage.getItem('niamke_lang')||'fr').toLowerCase()==='fr';}catch(e){}
var st=document.createElement('style');
st.textContent=''
+'#nlj-bible{position:fixed;'+(ACC?'right:18px;bottom:calc(150px + env(safe-area-inset-bottom,0px))':'left:14px;bottom:calc(18px + env(safe-area-inset-bottom,0px))')+';z-index:39;display:inline-flex;align-items:center;gap:8px;padding:0 18px 0 8px;height:48px;border-radius:999px;border:2px solid #c9a77a;background:#0f2a4a;color:#fff;cursor:pointer;box-shadow:0 10px 28px rgba(15,42,74,.28);font:800 14px/1 system-ui,-apple-system,"Segoe UI",sans-serif;transition:transform .2s}'
+'#nlj-bible i{font-style:normal;font-size:22px;width:34px;height:34px;border-radius:50%;background:#c9a227;display:grid;place-items:center}'
+'#nlj-bible:hover{transform:translateY(-3px)}#nlj-bible:focus-visible{outline:3px solid #c9a77a;outline-offset:3px}'
+(ACC?'@media(max-width:720px){#nlj-bible{right:12px;bottom:196px;height:44px;font-size:13px}#nlj-bible i{width:30px;height:30px;font-size:19px}}':'@media(max-width:720px){#nlj-bible{left:10px;bottom:calc(12px + env(safe-area-inset-bottom,0px));height:44px;font-size:13px}#nlj-bible i{width:30px;height:30px;font-size:19px}}')
+'@media(prefers-reduced-motion:reduce){#nlj-bible{transition:none}}';
document.head.appendChild(st);
function addBible(){
  var k=document.createElement('button');
  k.id='nlj-bible';k.type='button';k.innerHTML='<i aria-hidden="true">📖</i><span></span>';k.lastChild.textContent=FR?'Apprenons la Bible':'Let’s learn the Bible';k.setAttribute('aria-label',FR?'Apprenons la Bible — ouvrir la Bible':'Let’s learn the Bible — open the Bible');
  k.addEventListener('click',function(){try{parent.postMessage({nlj:'go',page:'p5',id:''},'*');}catch(e){}});
  document.body.appendChild(k);
}
function add(){addBible();}
if(document.body)add();else document.addEventListener('DOMContentLoaded',add);
})();
