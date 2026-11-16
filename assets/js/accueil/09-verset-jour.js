/* Verset du jour (accueil) : une carte avant la section « Couples », choisie dans assets/bible/versets-du-jour.json
   (textes Louis Segond 1910). Un clic ouvre le passage dans la Bible du site. */
(function(){
var FR=true;try{FR=(localStorage.getItem('niamke_lang')||'fr').toLowerCase()==='fr';}catch(e){}
var st=document.createElement('style');
st.textContent='#nlj-vdj{background:#fbf7ec;padding:34px 16px;border-top:1px solid #f0e6d8}'
+'#nlj-vdj .in{max-width:720px;margin:0 auto;text-align:center;background:#0f2a4a;color:#fff;border-radius:18px;padding:26px 22px;border-bottom:4px solid #c9a227;box-shadow:0 14px 40px rgba(15,42,74,.18)}'
+'#nlj-vdj small{display:block;color:#e7d9a6;font:700 11px/1.2 system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;margin-bottom:12px}'
+'#nlj-vdj p{margin:0 0 12px;font:italic 1.25rem/1.55 Georgia,"Times New Roman",serif}'
+'#nlj-vdj b{display:block;font:600 .9rem system-ui,sans-serif;color:#cfd8e6}'
+'#nlj-vdj button{margin-top:16px;font:700 .9rem system-ui,sans-serif;padding:10px 20px;border-radius:999px;border:0;background:#c9a227;color:#0f2a4a;cursor:pointer}'
+'#nlj-vdj button:focus-visible{outline:3px solid #fff;outline-offset:2px}';
document.head.appendChild(st);
var card=null;
function build(v){
  var s=document.createElement('section');s.id='nlj-vdj';s.setAttribute('aria-label',FR?'Verset du jour':'Verse of the day');
  var ref=v[0]+' '+v[1]+':'+v[2];
  s.innerHTML='<div class="in"><small>'+(FR?'Verset du jour':'Verse of the day')+'</small><p></p><b></b><button type="button"></button></div>';
  s.querySelector('p').textContent='« '+v[3]+' »';
  s.querySelector('b').textContent=ref+' · Louis Segond 1910';
  var b=s.querySelector('button');b.textContent=FR?'📖 Lire dans la Bible':'📖 Read in the Bible';
  b.addEventListener('click',function(){try{parent.postMessage({nlj:'bible-open',ref:ref},'*');}catch(e){}});
  return s;
}
function place(){
  if(!card)return;
  if(document.getElementById('nlj-vdj'))return;
  var anchor=document.getElementById('couples');
  if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(card,anchor);
}
fetch('../assets/bible/versets-du-jour.json').then(function(r){return r.ok?r.json():null;}).then(function(j){
  if(!Array.isArray(j)||!j.length)return;
  var d=new Date(),k=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5);
  card=build(j[k%j.length]);place();
  /* l'appli de l'accueil peut redessiner la page : on remet la carte si elle disparaît */
  var root=document.getElementById('root');
  if(root&&window.MutationObserver){var t;new MutationObserver(function(){clearTimeout(t);t=setTimeout(place,120);}).observe(root,{childList:true,subtree:true});}
}).catch(function(){});
})();
