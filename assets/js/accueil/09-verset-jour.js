/* Verset du jour + Prière du jour (accueil) — v2
   Une carte avant la section « Couples ». Le verset vient de assets/bible/versets-du-jour.json,
   la prière change automatiquement chaque jour (liste ci-dessous). La carte se met à jour à minuit.
   Le texte est en français : la traduction automatique du site (nlj-translate) le traduit. */
(function(){
var PRIERES=[
"Seigneur, merci pour ce nouveau jour. Guide mes pas, garde mon cœur pur et donne-moi la force d'aimer comme Tu aimes. Amen.",
"Père céleste, je Te confie cette journée. Mets Ta paix dans mon esprit et Ta joie dans mon cœur. Amen.",
"Jésus, Tu es mon berger : avec Toi, je ne manque de rien. Conduis-moi aujourd'hui sur le bon chemin. Amen.",
"Seigneur, apprends-moi la patience. Que mes paroles soient douces et que mes actes parlent de Toi. Amen.",
"Père, je Te remets mes inquiétudes. Tu prends soin de moi chaque jour. Fortifie ma foi. Amen.",
"Dieu d'amour, bénis ma famille, mes amis et tous ceux que j'aime. Protège-les et garde-les dans Ta grâce. Amen.",
"Seigneur, pardonne-moi mes fautes comme je pardonne à ceux qui m'ont blessé. Guéris mon cœur. Amen.",
"Jésus, éclaire mes décisions aujourd'hui. Donne-moi la sagesse de choisir ce qui Te plaît. Amen.",
"Père, merci pour la vie, la santé et le pain de ce jour. Aide-moi à partager avec ceux qui n'ont pas. Amen.",
"Seigneur, rends-moi courageux. Quand j'ai peur, rappelle-moi que Tu es toujours avec moi. Amen.",
"Esprit Saint, remplis-moi de Ta présence. Fais grandir en moi l'amour, la joie et la paix. Amen.",
"Dieu fidèle, Tu connais mes désirs. Prépare le bon moment et la bonne personne, selon Ta volonté. Amen.",
"Seigneur, garde mes yeux et mon cœur. Que mes relations soient honnêtes, respectueuses et centrées sur Toi. Amen.",
"Père, je Te loue pour Ta fidélité. Même dans l'attente, je sais que Tu agis pour mon bien. Amen.",
"Jésus, donne du repos à ceux qui sont fatigués. Console les malades et fortifie les faibles. Amen.",
"Seigneur, enlève de moi l'orgueil et la jalousie. Remplis-moi d'humilité et de reconnaissance. Amen.",
"Dieu tout-puissant, protège mon pays et ceux qui le dirigent. Donne-nous la paix et l'unité. Amen.",
"Père, que mon travail d'aujourd'hui Te glorifie. Bénis l'œuvre de mes mains. Amen.",
"Seigneur, ouvre mes oreilles pour T'entendre et mon cœur pour obéir. Parle, Ton serviteur écoute. Amen.",
"Jésus, Tu es la lumière du monde. Chasse les ténèbres de ma vie et marche devant moi. Amen.",
"Père, merci pour Ta grâce qui me relève chaque fois que je tombe. Je me confie en Toi. Amen.",
"Seigneur, aide-moi à dire la vérité avec amour et à rester fidèle à mes promesses. Amen.",
"Dieu de paix, calme les tempêtes de ma vie. Je me repose dans Tes bras ce jour. Amen.",
"Jésus, apprends-moi à prier sans cesse et à Te chercher en premier. Que Ton règne vienne dans ma vie. Amen.",
"Père, bénis les couples et les familles. Unis ceux qui s'aiment dans la foi, le respect et la fidélité. Amen.",
"Seigneur, donne-moi un cœur reconnaissant. Pour tout ce que Tu as fait, je Te dis merci. Amen.",
"Esprit Saint, fortifie-moi contre la tentation. Que je marche aujourd'hui dans la sainteté et la liberté. Amen.",
"Dieu d'espérance, relève ceux qui ont perdu courage. Redonne-leur le sourire et la confiance en demain. Amen.",
"Père, que ma vie soit un témoignage de Ton amour. Utilise-moi pour bénir quelqu'un aujourd'hui. Amen.",
"Seigneur Jésus, je Te remets cette journée et cette nuit. Garde-moi sous Ta protection. Amen.",
"Père, Tu es bon et Ta miséricorde dure à toujours. Merci d'être mon Dieu. Amen."
];
var st=document.createElement('style');
st.textContent='#nlj-vdj{background:#fbf7ec;padding:34px 16px;border-top:1px solid #f0e6d8}'
+'#nlj-vdj .wrap{max-width:760px;margin:0 auto;display:grid;gap:16px}'
+'#nlj-vdj .in{text-align:center;border-radius:18px;padding:26px 22px;box-shadow:0 14px 40px rgba(15,42,74,.18)}'
+'#nlj-vdj .v{background:#0f2a4a;color:#fff;border-bottom:4px solid #c9a227}'
+'#nlj-vdj .p{background:#fff;color:#0f2a4a;border:1px solid #e9dcb8;border-bottom:4px solid #c9a227}'
+'#nlj-vdj small{display:block;font:700 11px/1.2 system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;margin-bottom:12px}'
+'#nlj-vdj .v small{color:#e7d9a6}#nlj-vdj .p small{color:#a07d12}'
+'#nlj-vdj .dt{display:block;font:500 .8rem system-ui,sans-serif;opacity:.75;margin-bottom:10px}'
+'#nlj-vdj p{margin:0 0 12px;font:italic 1.25rem/1.55 Georgia,"Times New Roman",serif}'
+'#nlj-vdj .p p{font-size:1.1rem}'
+'#nlj-vdj b{display:block;font:600 .9rem system-ui,sans-serif;color:#cfd8e6}'
+'#nlj-vdj button{margin:16px 5px 0;font:700 .9rem system-ui,sans-serif;padding:10px 20px;border-radius:999px;border:0;background:#c9a227;color:#0f2a4a;cursor:pointer}'
+'#nlj-vdj .p button{background:#0f2a4a;color:#fff}'
+'#nlj-vdj button:focus-visible{outline:3px solid #c9a227;outline-offset:2px}';
document.head.appendChild(st);

var card=null,verses=null,dayKey='';
function today(){var d=new Date();return {k:Math.floor((d-new Date(d.getFullYear(),0,0))/864e5),key:d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()};}
function dateTxt(){
  var l='fr';try{l=(localStorage.getItem('niamke_lang')||'fr').toLowerCase().slice(0,2);}catch(e){}
  try{return new Date().toLocaleDateString(l==='zh'?'zh-CN':l,{weekday:'long',day:'numeric',month:'long',year:'numeric'});}catch(e){return '';}
}
function build(){
  var t=today(),v=verses[t.k%verses.length],ref=v[0]+' '+v[1]+':'+v[2];
  dayKey=t.key;
  var s=document.createElement('section');s.id='nlj-vdj';s.setAttribute('aria-label','Verset et prière du jour');
  s.innerHTML='<div class="wrap">'
  +'<div class="in v"><small>Verset du jour</small><span class="dt"></span><p class="vt"></p><b class="vr"></b><button type="button" class="bo">📖 Lire dans la Bible</button></div>'
  +'<div class="in p"><small>Prière du jour</small><p class="pt"></p><button type="button" class="pc">🙏 Amen</button></div>'
  +'</div>';
  s.querySelector('.dt').textContent=dateTxt();
  s.querySelector('.vt').textContent='« '+v[3]+' »';
  s.querySelector('.vr').textContent=ref+' · Louis Segond 1910';
  s.querySelector('.pt').textContent=PRIERES[(t.k*7)%PRIERES.length];
  s.querySelector('.bo').addEventListener('click',function(){try{parent.postMessage({nlj:'bible-open',ref:ref},'*');}catch(e){}});
  s.querySelector('.pc').addEventListener('click',function(){
    var b=this,txt=s.querySelector('.pt').textContent;
    try{if(navigator.share){navigator.share({text:txt});return;}}catch(e){}
    try{navigator.clipboard.writeText(txt);b.textContent='✅ Copié';setTimeout(function(){b.textContent='🙏 Amen';},1800);}catch(e){}
  });
  return s;
}
function place(){
  if(!card||document.getElementById('nlj-vdj'))return;
  var a=document.getElementById('couples');
  if(a&&a.parentNode)a.parentNode.insertBefore(card,a);
}
function refresh(){
  if(!verses||today().key===dayKey)return;
  var old=document.getElementById('nlj-vdj');if(old)old.remove();
  card=build();place();
}
fetch('../assets/bible/versets-du-jour.json').then(function(r){return r.ok?r.json():null;}).then(function(j){
  if(!Array.isArray(j)||!j.length)return;
  verses=j;card=build();place();
  var root=document.getElementById('root');
  if(root&&window.MutationObserver){var t;new MutationObserver(function(){clearTimeout(t);t=setTimeout(place,120);}).observe(root,{childList:true,subtree:true});}
  document.addEventListener('visibilitychange',refresh);
  setInterval(refresh,60000);
}).catch(function(){});
})();

/* ===== Titre d'accueil « Bienvenue à Niamké Love Jésus » (nouveau style, traduit dans les 21 langues) ===== */
(function(){
var T={fr:'Bienvenue à',en:'Welcome to',es:'Bienvenidos a',pt:'Bem-vindo ao',it:'Benvenuti a',de:'Willkommen bei',ar:'مرحبًا بكم في',zh:'欢迎来到',nl:'Welkom bij',ru:'Добро пожаловать в',ln:'Boyei malamu na',sw:'Karibu kwenye',hi:'आपका स्वागत है',id:'Selamat datang di',tl:'Maligayang pagdating sa',ko:'환영합니다',vi:'Chào mừng đến với',pl:'Witamy w',uk:'Ласкаво просимо до',ur:'خوش آمدید',ro:'Bun venit la'};
var st=document.createElement('style');
st.textContent='#home::before{content:none!important;display:none!important;animation:none!important}'
+'#nlj-bv{text-align:center;padding:26px 16px 8px}'
+'#nlj-bv .a{display:block;font:700 clamp(12px,2.1vw,16px)/1.3 system-ui,"Segoe UI",sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#0f2a4a;margin-bottom:2px}'
+'#nlj-bv[data-l=ar] .a,#nlj-bv[data-l=ur] .a,#nlj-bv[data-l=hi] .a,#nlj-bv[data-l=zh] .a,#nlj-bv[data-l=ko] .a{letter-spacing:.04em;text-transform:none;font-size:clamp(15px,2.6vw,20px)}'
+'#nlj-bv .n{display:block;font-family:"Great Vibes","Brush Script MT",cursive;font-weight:400;font-size:clamp(46px,9.5vw,108px);line-height:1.12;text-wrap:balance;'
+'background:linear-gradient(100deg,#8a5a12 0%,#c9a227 32%,#f3dc8f 50%,#c9a227 68%,#8a5a12 100%) 0 0/200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;'
+'filter:drop-shadow(0 2px 4px rgba(15,42,74,.22));animation:nljBvIn .9s ease-out both,nljBvShine 7s ease-in-out 1s infinite alternate}'
+'#nlj-bv .o{display:flex;align-items:center;justify-content:center;gap:12px;color:#c9a227;font-size:18px;margin-top:4px}'
+'#nlj-bv .o:before,#nlj-bv .o:after{content:"";width:clamp(50px,12vw,110px);height:1px;background:linear-gradient(90deg,transparent,#c9a227)}'
+'#nlj-bv .o:after{transform:scaleX(-1)}'
+'@keyframes nljBvIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}'
+'@keyframes nljBvShine{from{background-position:0 0}to{background-position:100% 0}}'
+'@media(prefers-reduced-motion:reduce){#nlj-bv .n{animation:none}}';
document.head.appendChild(st);
function lang(){var l='fr';try{l=(localStorage.getItem('niamke_lang')||'fr').toLowerCase().slice(0,2);}catch(e){}return T[l]?l:'fr';}
function make(){
  var l=lang(),d=document.createElement('div');
  d.id='nlj-bv';d.setAttribute('translate','no');d.className='notranslate';d.setAttribute('data-l',l);
  d.innerHTML='<span class="a"></span><span class="n">Niamké Love Jésus</span><span class="o">✝︎</span>';
  d.firstChild.textContent=T[l];
  return d;
}
function sync(){
  var h=document.getElementById('home');if(!h)return;
  var e=document.getElementById('nlj-bv'),l=lang();
  if(!e){h.insertBefore(make(),h.firstChild);return;}
  if(e.getAttribute('data-l')!==l){e.setAttribute('data-l',l);e.firstChild.textContent=T[l];}
}
sync();
var root=document.getElementById('root'),t;
if(root&&window.MutationObserver)new MutationObserver(function(){clearTimeout(t);t=setTimeout(sync,120);}).observe(root,{childList:true,subtree:true});
setInterval(sync,1500);
window.addEventListener('storage',sync);
})();
