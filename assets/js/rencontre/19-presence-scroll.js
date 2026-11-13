/* === Niamké Love Jésus — 19 : membres « en ligne » (point vert) + blocage du défilement derrière les fenêtres === */

/* ---------- 1) Membres connectés : point vert (Supabase Realtime Presence) ---------- */
(function(){
  var online=new Set();
  var channel=null,myId=null;

  function apply(){
    document.querySelectorAll('#profilesGrid .profile.pc[data-uid]').forEach(function(c){
      c.classList.toggle('is-online',online.has(c.getAttribute('data-uid')));
    });
    document.querySelectorAll('.mg-ct[data-chat]').forEach(function(c){
      c.classList.toggle('is-online',online.has(c.getAttribute('data-chat')));
    });
  }
  window.nljApplyPresence=apply;

  function sync(){
    online=new Set();
    var st=channel.presenceState();
    Object.keys(st).forEach(function(k){(st[k]||[]).forEach(function(m){if(m&&m.uid)online.add(String(m.uid));});});
    document.documentElement.classList.add('nlj-pres-ready');
    apply();
  }

  function stop(){
    try{if(channel&&window.supabaseClient)supabaseClient.removeChannel(channel);}catch(e){}
    channel=null;myId=null;online=new Set();document.documentElement.classList.remove('nlj-pres-ready');apply();
  }

  function start(session){
    try{
      if(typeof supabaseClient==='undefined'||!supabaseClient||!session||!session.user)return stop();
      if(channel&&myId===session.user.id)return;
      stop();
      myId=session.user.id;
      channel=supabaseClient.channel('nlj-en-ligne',{config:{presence:{key:myId}}});
      channel.on('presence',{event:'sync'},sync)
             .subscribe(function(status){
               if(status==='SUBSCRIBED'){try{channel.track({uid:myId,t:Date.now()});}catch(e){}}
             });
    }catch(e){console.warn('presence',e);}
  }

  function init(){
    try{
      if(typeof supabaseClient==='undefined'||!supabaseClient)return;
      supabaseClient.auth.getSession().then(function(r){start(r&&r.data&&r.data.session);});
      supabaseClient.auth.onAuthStateChange(function(ev,session){
        if(ev==='SIGNED_OUT'||!session)stop();else start(session);
      });
      /* quand l'onglet revient au premier plan, on se remet « en ligne » */
      document.addEventListener('visibilitychange',function(){
        if(!channel)return;
        try{if(document.hidden)channel.untrack();else channel.track({uid:myId,t:Date.now()});}catch(e){}
      });
      window.addEventListener('pagehide',function(){try{if(channel)channel.untrack();}catch(e){}});
    }catch(e){console.warn('presence init',e);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* la liste des contacts de la discussion est redessinée souvent : on remet les points */
(function(){
  function hook(){
    var box=document.getElementById('chatContacts');if(!box||box._nljP)return;box._nljP=1;
    new MutationObserver(function(){if(window.nljApplyPresence)window.nljApplyPresence();}).observe(box,{childList:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();
