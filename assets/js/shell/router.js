var TITLES={p1:'Niamké Love Jésus — Rencontre chrétienne centrée sur Jésus-Christ',p2:'Rencontre — Niamké Love Jésus',p3:'Mon Premium — Niamké Love Jésus'};
var URLS={p1:'pages/accueil.html',p2:'pages/rencontre.html',p3:'pages/premium.html'};
function navFrame(f,u){try{f.contentWindow.location.replace(u);}catch(e){f.src=u;}}
var NAMES={p1:'accueil',p2:'rencontre',p3:'premium'},BYNAME={accueil:'p1',rencontre:'p2',premium:'p3'};
var loaded={},loadedLang={},cur=null,STATE={known:false,premium:false,plan:'',user:false};
function lang(){try{return(localStorage.getItem('niamke_lang')||'fr').toLowerCase();}catch(e){return 'fr';}}
function load(p,cb){
  var f=document.getElementById(p);
  if(!loaded[p]||loadedLang[p]!==lang()){loaded[p]=true;loadedLang[p]=lang();f.onload=function(){if(cb)setTimeout(cb,300);};navFrame(f,URLS[p]);}
  else if(cb)cb();
}
function _show(p,id,pop){
  if(cur&&loaded[cur])loadedLang[cur]=lang();
  cur=p;try{document.title=TITLES[p];}catch(e){}
  ['p1','p2','p3'].forEach(function(k){document.getElementById(k).classList.toggle('on',k===p);});
  if(!pop){try{history.pushState({p:p},'','#'+NAMES[p]);}catch(e){}}
  load(p,function(){try{document.getElementById(p).contentWindow.postMessage({nlj:'scroll',id:id||''},'*');if(p==='p2'&&window.FILTERS)document.getElementById(p).contentWindow.postMessage({nlj:'filters',church:FILTERS.church,gender:FILTERS.gender,search:FILTERS.search,ageMin:FILTERS.ageMin,ageMax:FILTERS.ageMax},'*');}catch(e){}});
}

/* Page 2 (Rencontre) réservée aux membres : sans session Supabase valide, retour à la page 1 + connexion */
var GATE_P2=true;
function hasSession(){try{var c=window.supabaseClient;if(!c)return Promise.resolve(false);return c.auth.getSession().then(function(r){return !!(r&&r.data&&r.data.session);}).catch(function(){return false;});}catch(e){return Promise.resolve(false);}}
function openLogin(notice){var n=0;(function t(){var w=document.getElementById('p1').contentWindow;if(w&&w.NLJ_AUTH){w.NLJ_AUTH.open('login',notice||'need');return;}if(++n<40)setTimeout(t,150);})();}
function show(p,id,pop){
  if(GATE_P2&&p==='p2'){hasSession().then(function(ok){if(ok){_show(p,id,pop);}else{try{history.replaceState({p:'p1'},'','#accueil');}catch(e){}_show('p1','',true);openLogin('need');}});return;}
  _show(p,id,pop);
}
function wipePrivate(){['p2','p3'].forEach(function(k){loaded[k]=false;try{navFrame(document.getElementById(k),'about:blank');}catch(e){}});STATE={known:false,premium:false,plan:'',user:false};}
function sendState(){
  if(!STATE.known)return;
  try{document.getElementById('p3').contentWindow.postMessage({nlj:'state',premium:STATE.premium,plan:STATE.plan,user:STATE.user},'*');}catch(e){}
}
window.addEventListener('message',function(e){
  var ok=['p1','p2','p3'].some(function(k){return document.getElementById(k).contentWindow===e.source;});
  if(!ok)return;
  var d=e.data;if(!d||!d.nlj)return;
  if(d.nlj==='go'&&NAMES[d.page])show(d.page,d.id);
  else if(d.nlj==='state'){STATE={known:true,premium:!!d.premium,plan:d.plan||'',user:!!d.user};sendState();}
  else if(d.nlj==='need-state')sendState();
  else if(d.nlj==='filters'){window.FILTERS={church:d.church||'',gender:d.gender||'',search:d.search||'',ageMin:d.ageMin,ageMax:d.ageMax};show('p2','profilesGrid');}
  else if(d.nlj==='legal')showLegal(d.doc);
  else if(d.nlj==='authed'){loaded.p2=false;show('p2','');}
  else if(d.nlj==='noauth'){if(cur==='p2'){_show('p1','',true);openLogin('need');}}
  else if(d.nlj==='logout'){wipePrivate();_show('p1');}
});
window.addEventListener('popstate',function(e){
  var p=(e.state&&e.state.p)||BYNAME[(location.hash||'').slice(1)]||'p1';show(p,'',true);
});
var hadHash=!!(location.hash||'').slice(1);
var rec=/type=recovery/.test(location.hash||'');
var start=rec?'p2':(BYNAME[(location.hash||'').slice(1)]||'p1');
try{history.replaceState({p:start},'',rec?location.href:'#'+NAMES[start]);}catch(e){}
show(start,'',true);
/* Déjà connecté dans CET onglet (ex. actualisation, retour de paiement) : on rouvre l'espace membre. Après fermeture de la page, la session n'existe plus → mot de passe redemandé. */
if(!rec&&start==='p1'){hasSession().then(function(ok){if(ok){try{history.replaceState({p:'p2'},'','#rencontre');}catch(e){}show('p2','',true);}});}
/* la page 2 se charge en arrière-plan pour connaître la session (Premium, connexion) */
setTimeout(function(){load('p2');},3500);
