/* ===== Profil membre : clic = toutes les infos sous la photo ===== */
(function(){
  var OPENP={};
  var TX={
    fr:{about:'Informations du membre',name:'Prénom',age:'Âge',yrs:'ans',city:'Ville',country:'Pays',church:'Église',gender:'Sexe',looking:'Recherche',verse:'Verset préféré',likes:"J'aime",since:'Membre depuis',none:'Non renseigné',zoom:'🔍 Agrandir la photo',Femme:'Femme',Homme:'Homme'},
    en:{about:'Member information',name:'First name',age:'Age',yrs:'years old',city:'City',country:'Country',church:'Church',gender:'Gender',looking:'Looking for',verse:'Favorite verse',likes:'Likes',since:'Member since',none:'Not provided',zoom:'🔍 Enlarge photo',Femme:'Woman',Homme:'Man'}
  };
  function lg(){var l='fr';try{l=(localStorage.getItem('niamke_lang')||'fr').toLowerCase().slice(0,2);}catch(e){}return TX[l]?l:(l==='fr'?'fr':'en');}
  function key(p){return String(p.id||p.user_id||p.name||'');}
  function getP(card){
    var b=card.querySelector('.pc-act button');var s=b?(b.getAttribute('onclick')||''):'';
    var i=parseInt(s.slice(s.indexOf('(')+1),10);
    return (typeof profiles!=='undefined'&&!isNaN(i))?profiles[i]:null;
  }
  function row(ic,label,val){
    return '<div class="pm-r"><span class="pm-i">'+ic+'</span><span class="pm-l">'+label+'</span><span class="pm-v">'+(val?escapeHTML(val):'<i>'+TX[lg()].none+'</i>')+'</span></div>';
  }
  function panel(p,card){
    var T=TX[lg()],l=lg();
    var ville=p.city||'',pays=p.country||'';
    var since='';
    if(p.since){try{since=new Date(p.since).toLocaleDateString(l==='fr'?'fr-FR':'en-GB',{month:'long',year:'numeric'});}catch(e){}}
    var ver=p.verse?'« '+p.verse+' »':'';
    var hasImg=!!card.querySelector('.pc-ph img');
    return '<div class="pc-more">'+
      '<div class="pm-h">📋 '+T.about+'</div>'+
      row('👤',T.name,p.name)+
      row('🎂',T.age,p.age?(p.age+' '+T.yrs):'')+
      row('📍',T.city,ville)+
      row('🌍',T.country,pays)+
      row('⛪',T.church,p.church||p.confession)+
      row('⚧',T.gender,p.gender?(T[p.gender]||p.gender):'')+
      row('💞',T.looking,p.looking?(T[p.looking]||p.looking):'')+
      row('📖',T.verse,ver)+
      row('❤️',T.likes,String(p.points||0))+
      row('📅',T.since,since)+
      (hasImg?'<button type="button" class="pm-zoom">'+T.zoom+'</button>':'')+
    '</div>';
  }
  function openCard(card,p){
    var ph=card.querySelector('.pc-ph');if(!ph||card.querySelector('.pc-more'))return;
    ph.insertAdjacentHTML('afterend',panel(p,card));card.classList.add('pc-open');OPENP[key(p)]=1;
  }
  function closeCard(card,p){
    var m=card.querySelector('.pc-more');if(m)m.remove();card.classList.remove('pc-open');if(p)delete OPENP[key(p)];
  }
  document.addEventListener('click',function(e){
    var card=e.target.closest&&e.target.closest('.profile.pc');if(!card)return;
    if(e.target.closest('.pm-zoom')){
      e.stopPropagation();
      var im=card.querySelector('.pc-ph img');
      if(im){var o=document.createElement('div');o.className='lbx';var x=document.createElement('img');x.src=im.src;x.alt='';o.appendChild(x);o.onclick=function(){o.remove();};document.body.appendChild(o);}
      return;
    }
    if(e.target.closest('.pc-act')||e.target.closest('.pc-more'))return;
    e.stopPropagation();
    var p=getP(card);if(!p)return;
    if(card.querySelector('.pc-more'))closeCard(card,p);else openCard(card,p);
  },true);
  function restore(){
    document.querySelectorAll('#profilesGrid .profile.pc').forEach(function(c){var p=getP(c);if(p&&OPENP[key(p)])openCard(c,p);});
  }
  if(typeof window.renderProfiles==='function'&&!window.renderProfiles.pm){
    var orig=window.renderProfiles;
    var w=function(){var r=orig.apply(this,arguments);try{restore();}catch(x){}return r;};
    w.pm=1;window.renderProfiles=w;
  }
})();
