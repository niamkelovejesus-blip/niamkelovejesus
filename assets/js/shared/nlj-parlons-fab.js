/* Boutons flottants en bas à gauche, pour ne pas gêner WhatsApp / messagerie (bas à droite) :
   - 📖 Bible (toutes les pages sauf la Bible elle-même) → page 5 de la coque
   - « Parlons de Jésus » (Rencontre et Premium ; l'accueil a le sien : accueil/08-parlons.js) → page 4 */
(function(){
var PG=document.documentElement.getAttribute('data-nlj-page')||'';
var ACC=/accueil/.test(location.pathname);
if(PG==='bible'||document.getElementById('nlj-bible'))return;
var WANT_P=(PG!=='parlons'&&!ACC&&!document.getElementById('nlj-parlons'));
var FR=true;try{FR=(localStorage.getItem('niamke_lang')||'fr').toLowerCase()==='fr';}catch(e){}
var t1=FR?'Parlons de Jésus':'Let’s talk about Jesus';
var t2=FR?'Cliquez ici pour parler de Jésus':'Click here to talk about Jesus';
var st=document.createElement('style');
st.textContent='#nlj-parlons.nlj-L{position:fixed;left:14px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:39;display:inline-flex;align-items:center;gap:10px;max-width:calc(100vw - 100px);padding:6px 18px 6px 6px;border-radius:999px;background:#fff;color:#0f2a4a;text-align:left;cursor:pointer;border:2px solid #c9a77a;box-shadow:0 10px 28px rgba(15,42,74,.28);transition:transform .2s,box-shadow .2s;animation:nljAnge 3.2s ease-in-out infinite;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}'
+'#nlj-parlons.nlj-L img{flex:none;width:46px;height:46px;border-radius:50%;object-fit:cover;border:2px solid #c9a77a;background:#fbf7ec}'
+'#nlj-parlons.nlj-L .nlj-pt{display:flex;flex-direction:column;gap:1px;min-width:0}'
+'#nlj-parlons.nlj-L b{font:800 14px/1.2 system-ui,sans-serif;color:#1f6fd1}'
+'#nlj-parlons.nlj-L small{font:600 11px/1.25 system-ui,sans-serif;color:#0f2a4a}'
+'#nlj-parlons.nlj-L:hover{animation-play-state:paused;transform:translateY(-3px)}'
+'#nlj-parlons.nlj-L:focus-visible{outline:3px solid #c9a77a;outline-offset:3px}'
+'@keyframes nljAnge{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}'
+'@media(max-width:720px){#nlj-parlons.nlj-L{left:10px;bottom:calc(12px + env(safe-area-inset-bottom,0px));gap:8px;padding:5px 12px 5px 5px;max-width:calc(100vw - 90px)}#nlj-parlons.nlj-L img{width:40px;height:40px}#nlj-parlons.nlj-L b{font-size:13px}#nlj-parlons.nlj-L small{display:none}}'
+'#nlj-bible{position:fixed;'+(ACC?'right:18px;bottom:calc(150px + env(safe-area-inset-bottom,0px))':'left:14px;bottom:calc(18px + env(safe-area-inset-bottom,0px))')+';z-index:39;display:inline-flex;align-items:center;gap:8px;padding:0 18px 0 8px;height:48px;border-radius:999px;border:2px solid #c9a77a;background:#0f2a4a;color:#fff;cursor:pointer;box-shadow:0 10px 28px rgba(15,42,74,.28);font:800 14px/1 system-ui,-apple-system,"Segoe UI",sans-serif;transition:transform .2s}'
+'#nlj-bible i{font-style:normal;font-size:22px;width:34px;height:34px;border-radius:50%;background:#c9a227;display:grid;place-items:center}'
+'#nlj-bible:hover{transform:translateY(-3px)}#nlj-bible:focus-visible{outline:3px solid #c9a77a;outline-offset:3px}'
+'#nlj-parlons.nlj-L{left:14px;bottom:calc(76px + env(safe-area-inset-bottom,0px))}'
+(ACC?'@media(max-width:720px){#nlj-bible{right:12px;bottom:196px;height:44px;font-size:13px}#nlj-bible i{width:30px;height:30px;font-size:19px}}':'@media(max-width:720px){#nlj-bible{left:10px;bottom:calc(12px + env(safe-area-inset-bottom,0px));height:44px;font-size:13px}#nlj-bible i{width:30px;height:30px;font-size:19px}#nlj-parlons.nlj-L{left:10px;bottom:calc(64px + env(safe-area-inset-bottom,0px));max-width:calc(100vw - 20px)}}')
+'#nlj-parlons.nlj-L.nlj-mini{padding:5px;max-width:none;left:8px}'
+'#nlj-parlons.nlj-L.nlj-mini .nlj-pt{display:none}'
+'#nlj-parlons.nlj-L.nlj-mini:hover,#nlj-parlons.nlj-L.nlj-mini:focus-visible{padding:6px 18px 6px 6px;max-width:calc(100vw - 100px)}'
+'#nlj-parlons.nlj-L.nlj-mini:hover .nlj-pt,#nlj-parlons.nlj-L.nlj-mini:focus-visible .nlj-pt{display:flex}'
+'#nlj-bible.nlj-mini{padding:0 7px;gap:0;left:8px}'
+'#nlj-bible.nlj-mini span{display:none}'
+'#nlj-bible.nlj-mini:hover,#nlj-bible.nlj-mini:focus-visible{padding:0 18px 0 8px;gap:8px}'
+'#nlj-bible.nlj-mini:hover span,#nlj-bible.nlj-mini:focus-visible span{display:inline}'
+'@media(prefers-reduced-motion:reduce){#nlj-parlons.nlj-L{animation:none;transition:none}}';
document.head.appendChild(st);

/* Dans Rencontre et Premium, « Parlons de Jésus » et « Apprenons la Bible » s'ouvrent PAR-DESSUS la page, sans la quitter.
   La croix ✕ (ou la flèche retour du téléphone) referme simplement la fenêtre : on reste sur la même page. */
var LOCAL=(PG!=='parlons'&&PG!=='bible'&&!ACC);
var ov=null,fr=null,curP='',pend='',pushed=false,ign=false;
function ovUrl(p){return p==='p5'?'bible.html':'parlons-avec-jesus.html';}
function ovClose(viaPop){
  if(!ov)return;
  try{ov.parentNode.removeChild(ov);}catch(e){}
  ov=null;fr=null;curP='';pend='';
  if(!viaPop&&pushed){pushed=false;ign=true;try{history.back();}catch(e){ign=false;}}
  else pushed=false;
}
function ovGo(p){
  curP=p;
  try{fr.contentWindow.location.replace(ovUrl(p));}catch(e){fr.src=ovUrl(p);}
}
function ovOpen(p,ref){
  try{
    if(!ov){
      ov=document.createElement('div');ov.id='nlj-ov';
      ov.style.cssText='position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147483000;background:#0f2a4a';
      fr=document.createElement('iframe');
      fr.setAttribute('title',p==='p5'?(FR?'La Bible':'The Bible'):(FR?'Parlons avec Jésus':'Talk with Jesus'));
      fr.setAttribute('allow','clipboard-write');
      fr.style.cssText='position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;border:0;background:#fff';
      fr.addEventListener('load',function(){
        try{var b=fr.contentDocument.getElementById('back');if(b)b.onclick=function(e){if(e)e.preventDefault();ovClose(false);};}catch(x){}
      });
      ov.appendChild(fr);document.body.appendChild(ov);
      try{history.pushState({nljov:1},'');pushed=true;}catch(e){pushed=false;}
      pend=ref||'';ovGo(p);
    }else{
      pend=ref||'';
      if(curP===p){if(p==='p5'&&pend){fr.contentWindow.postMessage({nlj:'bible',q:pend},'*');pend='';}}
      else ovGo(p);
    }
    return true;
  }catch(e){return false;}
}
if(LOCAL){
  window.addEventListener('message',function(e){
    if(!fr||e.source!==fr.contentWindow)return;
    var d=e.data;if(!d||!d.nlj)return;
    if(d.nlj==='go'&&(d.page==='p4'||d.page==='p5'))ovOpen(d.page,'');
    else if(d.nlj==='bible-open')ovOpen('p5',String(d.ref||''));
    else if(d.nlj==='bible-ready'&&pend){try{fr.contentWindow.postMessage({nlj:'bible',q:pend},'*');}catch(x){}pend='';}
  });
  window.addEventListener('popstate',function(){if(ign){ign=false;return;}if(ov){pushed=false;ovClose(true);}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ov)ovClose(false);});
}
function go(){if(LOCAL&&ovOpen('p4',''))return;try{parent.postMessage({nlj:'go',page:'p4',id:''},'*');}catch(e){}}
function addBible(){
  var k=document.createElement('button');
  k.id='nlj-bible';k.type='button';k.innerHTML='<i aria-hidden="true">📖</i><span></span>';k.lastChild.textContent=FR?'Apprenons la Bible':'Let’s learn the Bible';k.setAttribute('aria-label',FR?'Apprenons la Bible — ouvrir la Bible':'Let’s learn the Bible — open the Bible');
  k.addEventListener('click',function(){if(LOCAL&&ovOpen('p5',''))return;try{parent.postMessage({nlj:'go',page:'p5',id:''},'*');}catch(e){}});
  document.body.appendChild(k);
}
function add(){
  addBible();
  if(!WANT_P||document.getElementById('nlj-parlons'))return;
  var b=document.createElement('button');
  b.id='nlj-parlons';b.className='nlj-L';b.type='button';b.setAttribute('aria-label',t1+' — '+t2);
  b.innerHTML='<img src="../assets/img/ange-parlons.jpg" alt="" width="46" height="46" decoding="async"><span class="nlj-pt"><b>'+t1+'</b><small>'+t2+'</small></span>';
  b.addEventListener('click',go);
  document.body.appendChild(b);
}
function mini(){['nlj-parlons','nlj-bible'].forEach(function(i){var e=document.getElementById(i);if(e)e.classList.add('nlj-mini');});}
if(LOCAL)setTimeout(mini,7000);
if(document.body)add();else document.addEventListener('DOMContentLoaded',add);
})();
