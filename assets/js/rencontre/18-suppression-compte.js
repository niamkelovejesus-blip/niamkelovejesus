/* Suppression de compte et de toutes les données (RGPD, art. 17). La suppression réelle est faite par la fonction SQL delete_my_account (voir supabase_securite.sql). */
(function(){
  function sb(){try{return window.supabaseClient||window.parent.supabaseClient;}catch(e){return window.supabaseClient;}}
  var b=document.createElement('button');
  b.type='button';b.textContent='Supprimer mon compte et mes données';
  b.setAttribute('style','position:fixed;left:10px;bottom:10px;z-index:40;background:#fff;color:#8a1f1f;border:1px solid #d9b0b0;border-radius:8px;padding:6px 10px;font:12px system-ui,sans-serif;cursor:pointer;opacity:.85');
  b.addEventListener('click',async function(){
    var c=sb(); if(!c)return;
    var r=window.prompt('Cette action est définitive : profil, photos, messages et abonnement seront effacés.\nPour confirmer, tape SUPPRIMER :');
    if(r!=='SUPPRIMER')return;
    b.disabled=true;
    var res=await c.rpc('delete_my_account');
    if(res.error){alert('Suppression impossible : '+res.error.message);b.disabled=false;return;}
    try{await c.auth.signOut();}catch(e){}
    try{window.parent.postMessage({nlj:'logout'},'*');}catch(e){}
  });
  document.body.appendChild(b);
})();
