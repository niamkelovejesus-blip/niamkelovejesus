/* Bouton « ⭐ Premium » en haut de la page d'accueil, à côté de « Inscription » / « Connexion ».
   - Téléphone : à côté de « Connexion » (le bouton « Inscription » n'existe pas sur petit écran).
   - Ordinateur : entre « Inscription » et « Connexion ».
   - Pas encore inscrit : on ouvre la fenêtre d'inscription avec un message.
   - Déjà connecté : on ouvre la page « Mon Premium ».
   Pour retirer ce bouton : enlever la ligne <script> de pages/accueil.html. */
(function(){
  var FR=true;try{FR=(localStorage.getItem('niamke_lang')||'fr').toLowerCase()==='fr';}catch(e){}
  var NOTE=FR?'Inscris-toi gratuitement pour devenir Premium.':'Sign up for free to become Premium.';

  var st=document.createElement('style');
  st.textContent='.nlj-hprem{display:inline-flex;align-items:center;justify-content:center;height:36px;padding:0 14px;border:0;border-radius:999px;background:var(--navy,#0f2a4a);color:#f5d98b;font-size:13px;font-weight:700;white-space:nowrap;cursor:pointer;transition:opacity .15s}.nlj-hprem:hover{opacity:.9}@media(max-width:420px){.nlj-hprem{padding:0 10px;font-size:12px}}';
  (document.head||document.documentElement).appendChild(st);

  function sb(){try{return window.parent.supabaseClient||window.supabaseClient||null;}catch(e){return window.supabaseClient||null;}}

  async function onClick(){
    var ok=false;
    try{var s=sb();if(s){var r=await s.auth.getSession();ok=!!(r&&r.data&&r.data.session);}}catch(e){}
    if(ok){try{parent.postMessage({nlj:'go',page:'p3'},'*');}catch(e){}}
    else{try{window.NLJ_AUTH.open('signup',NOTE);}catch(e){}}
  }

  function run(){
    var lg=document.querySelector('button.nlj-login');
    if(!lg||!lg.parentNode||document.getElementById('nlj-hprem'))return;
    var b=document.createElement('button');
    b.type='button';b.id='nlj-hprem';b.className='nlj-hprem';b.textContent='⭐ Premium';
    b.addEventListener('click',onClick);
    lg.parentNode.insertBefore(b,lg);
  }

  var tm;
  new MutationObserver(function(){clearTimeout(tm);tm=setTimeout(run,120);}).observe(document.body||document.documentElement,{childList:true,subtree:true});
  run();
})();
