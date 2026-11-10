(function(){
  /* Menu : met en surbrillance la section visible */
  var IDS=['accueil','rencontre','versets','jeux','musique','videos','premium'];
  var ticking=false;
  function spy(){
    ticking=false;
    var cur=null,y=(window.pageYOffset||0)+(parseInt(getComputedStyle(document.documentElement).scrollPaddingTop)||0)+40;
    IDS.forEach(function(id){var el=document.getElementById(id);if(el&&el.offsetParent!==null&&el.getBoundingClientRect().height>0&&el.getBoundingClientRect().top+window.pageYOffset<=y)cur=id;});
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(function(a){a.classList.toggle('active',cur&&a.getAttribute('href')==='#'+cur);});
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(spy);}},{passive:true});
  window.addEventListener('load',spy);

  /* Membres : rechargement automatique de la liste (connexion, retour sur l'onglet, toutes les 60 s) */
  async function refreshProfiles(){
    try{
      if(typeof backendGetProfiles!=='function')return;
      var r=await backendGetProfiles();
      if(r){profiles=r;renderProfiles();if(typeof updateStats==='function')updateStats();}
    }catch(e){console.warn('refreshProfiles',e);}
  }
  window.nljRefreshProfiles=refreshProfiles;
  setInterval(function(){if(!document.hidden)refreshProfiles();},60000);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)refreshProfiles();});
  try{if(typeof supabaseClient!=='undefined'&&supabaseClient)supabaseClient.auth.onAuthStateChange(function(){setTimeout(refreshProfiles,400);});}catch(e){}
})();
