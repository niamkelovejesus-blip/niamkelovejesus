/* Bouton flottant « Parlons de Jésus » pour les pages Rencontre et Premium
   (l'accueil a le sien : accueil/08-parlons.js). Ouvre le chat = page 4 de la coque.
   Placé en bas à gauche pour ne pas gêner WhatsApp / messagerie (bas à droite). */
(function(){
if(document.getElementById('nlj-parlons'))return;
if((document.documentElement.getAttribute('data-nlj-page')||'')==='parlons')return;
var FR=true;try{FR=(localStorage.getItem('niamke_lang')||'fr').toLowerCase()==='fr';}catch(e){}
var t1=FR?'Parlons de Jésus':'Let’s talk about Jesus';
var t2=FR?'Cliquez ici pour parler de Jésus':'Click here to talk about Jesus';
var st=document.createElement('style');
st.textContent='#nlj-parlons{position:fixed;left:14px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:39;display:inline-flex;align-items:center;gap:10px;max-width:calc(100vw - 100px);padding:6px 18px 6px 6px;border-radius:999px;background:#fff;color:#0f2a4a;text-align:left;cursor:pointer;border:2px solid #c9a77a;box-shadow:0 10px 28px rgba(15,42,74,.28);transition:transform .2s,box-shadow .2s;animation:nljAnge 3.2s ease-in-out infinite;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}'
+'#nlj-parlons img{flex:none;width:46px;height:46px;border-radius:50%;object-fit:cover;border:2px solid #c9a77a;background:#fbf7ec}'
+'#nlj-parlons .nlj-pt{display:flex;flex-direction:column;gap:1px;min-width:0}'
+'#nlj-parlons b{font:800 14px/1.2 system-ui,sans-serif;color:#1f6fd1}'
+'#nlj-parlons small{font:600 11px/1.25 system-ui,sans-serif;color:#0f2a4a}'
+'#nlj-parlons:hover{animation-play-state:paused;transform:translateY(-3px)}'
+'#nlj-parlons:focus-visible{outline:3px solid #c9a77a;outline-offset:3px}'
+'@keyframes nljAnge{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}'
+'@media(max-width:720px){#nlj-parlons{left:10px;bottom:calc(12px + env(safe-area-inset-bottom,0px));gap:8px;padding:5px 12px 5px 5px;max-width:calc(100vw - 90px)}#nlj-parlons img{width:40px;height:40px}#nlj-parlons b{font-size:13px}#nlj-parlons small{display:none}}'
+'@media(prefers-reduced-motion:reduce){#nlj-parlons{animation:none;transition:none}}';
document.head.appendChild(st);
function go(){try{parent.postMessage({nlj:'go',page:'p4',id:''},'*');}catch(e){}}
function add(){
  if(document.getElementById('nlj-parlons'))return;
  var b=document.createElement('button');
  b.id='nlj-parlons';b.type='button';b.setAttribute('aria-label',t1+' — '+t2);
  b.innerHTML='<img src="../assets/img/ange-parlons.jpg" alt="" width="46" height="46" decoding="async"><span class="nlj-pt"><b>'+t1+'</b><small>'+t2+'</small></span>';
  b.addEventListener('click',go);
  document.body.appendChild(b);
}
if(document.body)add();else document.addEventListener('DOMContentLoaded',add);
})();
