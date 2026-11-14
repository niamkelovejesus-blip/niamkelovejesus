/* ===== Rencontre : 5 invitations par jour maximum =====
   Ajout sans toucher à 04-membres-profils.js : on contrôle le clic « Envoyer une invitation »
   avant qu'il n'arrive au code existant. Le contrôle définitif est fait par le serveur
   (déclencheur SQL nlj_invite_daily_limit, voir supabase_mur_vocal.sql).
   Les « 3 messages avant acceptation » et le blocage ensuite existent déjà (nlj_pending_limit). */
(function(){
  if(window.__nljInvLimit)return;window.__nljInvLimit=1;
  var MAX_INV=5,PENDING=3,pass=false;
  function toast(m){try{showToast(m);}catch(e){}}
  function utcDay(){var d=new Date();d.setUTCHours(0,0,0,0);return d.toISOString();}
  async function sentToday(){
    try{
      var c=window.supabaseClient;if(!c||!window.NLJ||!NLJ.user)return 0;
      var r=await c.from('conversation_invites').select('id',{count:'exact',head:true}).eq('sender_id',NLJ.user.id).gte('created_at',utcDay());
      return r.error?0:(r.count||0);
    }catch(e){return 0;}
  }
  window.addEventListener('click',function(e){
    var b=e.target&&e.target.closest&&e.target.closest('[data-inv="send"]');
    if(!b||pass)return;
    e.stopImmediatePropagation();e.preventDefault();
    sentToday().then(function(n){
      if(n>=MAX_INV){toast('✉️ Limite atteinte : '+MAX_INV+' invitations par jour maximum. Reviens demain 🙏');return;}
      pass=true;try{b.click();}finally{pass=false;}
      if(n===MAX_INV-1)setTimeout(function(){toast('ℹ️ C\'était ta dernière invitation du jour ('+MAX_INV+'/'+MAX_INV+')');},1200);
    });
  },true);

  /* Message clair quand les 3 messages sont utilisés et que la personne n'a pas répondu */
  function lockNote(){
    try{
      var sub=document.getElementById('chatSubtitle'),note=document.getElementById('chatNote');if(!sub||!note)return;
      var re=new RegExp('(^|\\D)0/'+PENDING+'\\s+messages');
      var msg='🔒 Bloqué : tes '+PENDING+' messages sont utilisés. Attends que la personne accepte ton invitation.';
      var fix=function(){if(re.test(sub.textContent||'')&&note.textContent!==msg){note.textContent=msg;note.style.color='#b91c1c';note.style.fontWeight='700';}};
      new MutationObserver(function(){setTimeout(fix,0);}).observe(sub,{childList:true,characterData:true,subtree:true});
      new MutationObserver(function(){setTimeout(fix,0);}).observe(note,{childList:true,characterData:true,subtree:true});
    }catch(e){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',lockNote);else lockNote();
})();
