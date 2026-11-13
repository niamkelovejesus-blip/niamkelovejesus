/* Suppression de compte et de toutes les données (RGPD, art. 17). La suppression réelle est faite par la fonction SQL delete_my_account (voir supabase_securite.sql).
   Le lien est discret, tout en bas de la page (dans le pied de page), visible seulement pour un membre connecté, et demande une double confirmation. */
(function(){
  function sb(){try{return window.supabaseClient||window.parent.supabaseClient;}catch(e){return window.supabaseClient;}}
  var host=document.querySelector('footer .container')||document.querySelector('footer');
  if(!host)return;
  var wrap=document.createElement('div');
  wrap.style.cssText='display:none;margin:28px 0 8px;padding-top:14px;border-top:1px solid rgba(255,255,255,.18);text-align:center';
  var b=document.createElement('button');
  b.type='button';b.textContent='Supprimer mon compte et mes données';
  b.setAttribute('style','background:none;border:0;color:inherit;opacity:.55;font:12px system-ui,sans-serif;text-decoration:underline;cursor:pointer;padding:4px 8px');
  wrap.appendChild(b);host.appendChild(wrap);

  /* visible seulement si un membre est connecté */
  (async function(){
    try{var c=sb();if(!c)return;var s=await c.auth.getSession();if(s&&s.data&&s.data.session)wrap.style.display='block';}catch(e){}
  })();

  b.addEventListener('click',async function(){
    var c=sb(); if(!c)return;
    if(!window.confirm('Voulez-vous vraiment supprimer votre compte ?\n\nVotre profil, vos photos, vos messages et votre abonnement seront effacés définitivement.'))return;
    var r=window.prompt('Dernière confirmation. Cette action est définitive.\nPour confirmer, tapez SUPPRIMER :');
    if(r!=='SUPPRIMER')return;
    b.disabled=true;
    var res=await c.rpc('delete_my_account');
    if(res.error){alert('Suppression impossible : '+res.error.message);b.disabled=false;return;}
    try{await c.auth.signOut();}catch(e){}
    try{window.parent.postMessage({nlj:'logout'},'*');}catch(e){}
  });
})();
