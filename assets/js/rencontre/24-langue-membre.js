/* Enregistre la langue choisie par le membre connecté (une seule fois par langue et par navigateur).
   Sert uniquement aux statistiques de l'admin. Si la table n'existe pas encore, on ne fait rien. */
(function(){
  try{
    var c=(typeof supabaseClient!=='undefined')?supabaseClient:null; if(!c||!c.auth)return;
    function lang(){var l='fr';try{l=(localStorage.getItem('niamke_lang')||'fr').toLowerCase().slice(0,5);}catch(e){}return l||'fr';}
    function send(u){
      if(!u||!u.id)return; var l=lang(), k='nlj_lang_sent_'+u.id;
      try{if(localStorage.getItem(k)===l)return;}catch(e){}
      c.from('member_lang').upsert({user_id:u.id,lang:l,updated_at:new Date().toISOString()},{onConflict:'user_id'}).then(function(r){
        if(r&&!r.error){try{localStorage.setItem(k,l);}catch(e){}}
      },function(){});
    }
    c.auth.getSession().then(function(r){send(r&&r.data&&r.data.session&&r.data.session.user);},function(){});
    c.auth.onAuthStateChange(function(ev,s){if(s&&s.user)setTimeout(function(){send(s.user);},0);});
  }catch(e){}
})();
