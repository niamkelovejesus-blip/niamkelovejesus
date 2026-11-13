(function(){
  var NLJ=window.NLJ={user:null,premium:false,plan:'',admin:false,liked:new Set()};
  function $(id){return document.getElementById(id);}
  function esc(s){return escapeHTML(s==null?'':s);}
  function notify(){try{window.NLJ_MUSIC&&window.NLJ_MUSIC.refresh();}catch(e){}try{parent.postMessage({nlj:'state',premium:NLJ.premium,plan:NLJ.plan,user:!!NLJ.user},'*');}catch(e){}}
  function requireLogin(msg){
    if(!USE_SUPABASE){showToast('⚠️ Service indisponible : vérifie ta connexion internet');return false;}
    if(!NLJ.user){showToast(msg||'Connecte-toi pour continuer');var a=$('auth');if(a)a.scrollIntoView({behavior:'smooth'});return false;}
    return true;
  }
  window.NLJ_REQUIRE_LOGIN=function(){return requireLogin('Crée ton profil ou connecte-toi avant de passer Premium');};

  /* ---------- compte, abonnement, rôle ---------- */
  async function refreshPremium(){
    NLJ.premium=false;NLJ.plan='';
    if(!USE_SUPABASE||!NLJ.user){return;}
    try{
      var s=await supabaseClient.from('subscriptions').select('plan,expires_at').eq('user_id',NLJ.user.id).maybeSingle();
      if(s.data&&(!s.data.expires_at||new Date(s.data.expires_at)>new Date())){NLJ.premium=true;NLJ.plan=s.data.plan||'';}
    }catch(e){}
    try{localStorage.removeItem('niamke_premium_active');}catch(e){}
  }
  async function loadAccount(){
    NLJ.admin=false;NLJ.liked=new Set();
    await refreshPremium();
    if(USE_SUPABASE&&NLJ.user){
      try{var a=await supabaseClient.rpc('is_admin');NLJ.admin=(a.data===true);}catch(e){}
      try{var l=await supabaseClient.from('likes').select('profile_id');(l.data||[]).forEach(function(x){NLJ.liked.add(x.profile_id);});}catch(e){}
    }
    try{localStorage.removeItem('niamke_premium_active');}catch(e){}
    renderAuth();renderProfiles();adminVisibility();notify();nljBadgeInit();
  }
  function renderAuth(){
    var box=$('authStatus'),form=$('loginForm');if(!box||!form)return;
    if(NLJ.user){
      box.style.display='block';form.style.display='none';
      box.innerHTML='<p style="margin:0 0 6px"><strong>Connecté</strong> : '+esc(NLJ.user.email)+'</p>'+
        '<p style="margin:0 0 14px">'+(NLJ.premium?'⭐ Premium '+esc(NLJ.plan):'Plan Découverte (gratuit)')+'</p>'+
        '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn btn-primary btn-sm" data-nlj="msgs">💬 Mes messages</button>'+
        (NLJ.premium?'':'<button type="button" class="btn btn-gold btn-sm" data-nlj="premium">⭐ Devenir Premium</button>')+
        '<button type="button" class="btn btn-outline btn-sm" data-nlj="logout">Se déconnecter</button></div>';
    }else{box.style.display='none';box.innerHTML='';form.style.display='';}
  }
  document.addEventListener('click',async function(e){
    var b=e.target.closest('[data-nlj]');if(!b)return;
    var a=b.getAttribute('data-nlj');
    if(a==='logout'){try{await supabaseClient.auth.signOut();}catch(x){}}
    else if(a==='msgs'){openChat(null);}
    else if(a==='premium'){openPremium();}
  });

  /* ---------- connexion ---------- */
  var lf=$('loginForm');
  if(lf){lf.addEventListener('submit',async function(e){
    e.preventDefault();e.stopImmediatePropagation();
    if(!USE_SUPABASE){showToast('⚠️ Service indisponible : vérifie ta connexion internet');return;}
    var email=$('loginEmail').value.trim().toLowerCase(),pass=$('loginPassword').value;
    try{
      var r=await supabaseClient.auth.signInWithPassword({email:email,password:pass});
      if(r.error){showToast(/confirm/i.test(r.error.message)?"❌ Confirme d'abord ton email":"❌ Identifiants incorrects");return;}
      lf.reset();showToast("✅ Bienvenue en Jésus");
      var rc=$('rencontre');if(rc)rc.scrollIntoView({behavior:'smooth'});
    }catch(err){showToast("❌ Connexion impossible");}
  },true);}

  /* ---------- likes ---------- */
  window.likeProfile=async function(i){
    var p=profiles[i];if(!p)return;
    if(!requireLogin('Connecte-toi pour liker un profil en Jésus'))return;
    if(p.user_id&&p.user_id===NLJ.user.id){showToast("C'est ton propre profil 🙂");return;}
    if(NLJ.liked.has(p.id)){showToast('❤️ Tu as déjà liké '+p.name);return;}
    var r=await supabaseClient.from('likes').insert([{user_id:NLJ.user.id,profile_id:p.id}]);
    if(r.error){
      if(r.error.code==='23505'){NLJ.liked.add(p.id);renderProfiles();showToast('❤️ Tu as déjà liké '+p.name);}
      else if(!NLJ.premium&&/limit|nlj_/i.test(r.error.message||'')){showToast('❤️ Limite de 10 likes par jour atteinte. Passe en Premium pour des likes illimités.');}
      else{showToast('❌ Like impossible : '+(r.error.message||r.error.code||'erreur inconnue'));}
      return;
    }
    p.points=(p.points||0)+1;NLJ.liked.add(p.id);renderProfiles();
    showToast('❤️ Liké en Jésus : '+p.name);
    if(NLJ.premium&&p.user_id)setTimeout(function(){openChat(p.user_id);},400);
  };

  /* ---------- tchat réel ---------- */
  var chat={msgs:[],inv:{},blocks:{},rem:null,remKind:'',current:null,timer:null,channel:null};
  var FREE_LIMIT=20,PENDING_LIMIT=3;
  function invState(u){if(chat.blocks&&chat.blocks[u])return 'blocked';var i=chat.inv&&chat.inv[u];if(!i)return 'none';if(i.status==='accepted')return 'accepted';var out=i.sender_id===(NLJ.user&&NLJ.user.id);if(i.status==='declined')return out?'declined_out':'declined_in';return out?'pending_out':'pending_in';}
  function invLabel(u){var s=invState(u);return s==='blocked'?'🚫 Membre bloqué':s==='pending_in'?'✉️ Invitation reçue':s==='pending_out'?'⏳ Invitation envoyée':s==='declined_in'?'Invitation refusée':s==='declined_out'?'Invitation refusée':s==='none'?'Invitation à envoyer':'Nouvelle conversation';}
  async function loadInvites(){
    if(!NLJ.user)return;
    var r=await supabaseClient.from('conversation_invites').select('id,sender_id,receiver_id,status,created_at');
    if(!r.error&&r.data){var m={};r.data.forEach(function(i){m[i.sender_id===NLJ.user.id?i.receiver_id:i.sender_id]=i;});chat.inv=m;}
    else if(r.error){console.warn('invitations (lecture):',r.error);}
    var b=await supabaseClient.from('member_blocks').select('blocked_id').eq('blocker_id',NLJ.user.id);
    if(!b.error&&b.data){var bm={};b.data.forEach(function(x){bm[x.blocked_id]=1;});chat.blocks=bm;}
  }
  async function profileComplete(){
    try{var r=await supabaseClient.from('profiles').select('name,age,photo_url').eq('user_id',NLJ.user.id).maybeSingle();var p=r.data;return !!(p&&p.name&&p.age&&p.photo_url);}catch(e){return true;}
  }
  async function toggleBlock(){
    var u=chat.current;if(!u)return;
    if(chat.blocks[u]){var d=await supabaseClient.from('member_blocks').delete().eq('blocker_id',NLJ.user.id).eq('blocked_id',u);if(d.error){showToast('❌ Action impossible');return;}showToast('✅ Membre débloqué');}
    else{if(!confirm("Bloquer "+nameOf(u)+" ? Ce membre ne pourra plus t'écrire ni t'inviter."))return;var r=await supabaseClient.from('member_blocks').insert([{blocker_id:NLJ.user.id,blocked_id:u}]);if(r.error&&r.error.code!=='23505'){showToast('❌ Blocage impossible');return;}showToast('🚫 Membre bloqué');}
    await loadInvites();renderContacts();renderMsgs();setSub();
  }
  async function reportChat(){
    var u=chat.current;if(!u)return;var why=prompt('Pourquoi signales-tu ce membre ?');if(!why||!why.trim())return;
    var p=profiles.find(function(x){return x.user_id===u;});
    var r=await supabaseClient.from('reports').insert([{reporter_id:NLJ.user.id,profile_id:p?p.id:null,reported_user:u,reason:why.trim().slice(0,500)}]);
    showToast(r.error?'❌ Signalement non envoyé':'🚩 Signalement envoyé, merci');
  }
  document.addEventListener('click',function(e){var t=e.target&&e.target.closest&&e.target.closest('#chatBlock,#chatReport');if(!t)return;if(t.id==='chatBlock')toggleBlock();else reportChat();});
  function todayISO(){var d=new Date();d.setUTCHours(0,0,0,0);return d.toISOString();}
  async function countMsgs(to,since){
    try{var q=supabaseClient.from('messages').select('id',{count:'exact',head:true}).eq('sender_id',NLJ.user.id).eq('receiver_id',to);if(since)q=q.gte('created_at',since);var r=await q;return r.error?0:(r.count||0);}catch(e){return 0;}
  }
  async function sendInvite(u){
    if(!(await profileComplete())){showToast('📸 Complète ton profil (prénom, âge et photo) avant d\'envoyer une invitation');try{var pr=document.getElementById('profil');if(pr)pr.scrollIntoView({behavior:'smooth'});}catch(e){}return;}
    var r=await supabaseClient.from('conversation_invites').insert([{sender_id:NLJ.user.id,receiver_id:u,status:'pending'}]);
    if(r.error&&r.error.code!=='23505'){showToast('❌ Invitation non envoyée');return;}
    await loadInvites();renderContacts();renderMsgs();setSub();if(!r.error)showToast('✉️ Invitation envoyée');
  }
  async function answerInvite(u,ok){
    var i=chat.inv[u];if(!i)return;
    var r=await supabaseClient.from('conversation_invites').update({status:ok?'accepted':'declined',responded_at:new Date().toISOString()}).eq('id',i.id);
    if(r.error){showToast('❌ Action impossible');return;}
    await loadInvites();renderContacts();renderMsgs();setSub();showToast(ok?'✅ Invitation acceptée':'Invitation refusée');
  }
  document.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('[data-inv]');if(!b||!chat.current)return;var a=b.getAttribute('data-inv');if(a==='send')sendInvite(chat.current);else if(a==='accept')answerInvite(chat.current,true);else if(a==='decline')answerInvite(chat.current,false);});
  function nameOf(uid){var p=profiles.find(function(x){return x.user_id===uid;});return p?p.name:'Membre';}
  function partnerOf(m){return m.sender_id===NLJ.user.id?m.receiver_id:m.sender_id;}
  function timeOf(m){try{return new Date(m.created_at).toLocaleString('fr-FR',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit'});}catch(e){return '';}}
  async function loadMessages(){
    await loadInvites();
    var r=await supabaseClient.from('messages').select('id,sender_id,receiver_id,body,created_at').order('created_at',{ascending:true}).limit(1000);
    if(!r.error&&r.data)chat.msgs=r.data;else if(r.error){console.warn('messages (lecture):',r.error);if(!window.__nljMsgWarned){window.__nljMsgWarned=1;try{showToast('⚠️ Messages indisponibles : '+r.error.message);}catch(e){}}}
  }
  function contactList(){
    var seen={},order=[];
    chat.msgs.slice().reverse().forEach(function(m){var u=partnerOf(m);if(!seen[u]){seen[u]=1;order.push(u);}});
    Object.keys(chat.inv||{}).forEach(function(u){if(!seen[u]){seen[u]=1;order.push(u);}});
    if(chat.current&&!seen[chat.current])order.unshift(chat.current);
    return order;
  }
  function photoOf(u){var p=profiles.find(function(x){return x.user_id===u;});return p&&p.photo?p.photo:'';}
  function avHtml(u){var ph=photoOf(u);return '<span class="mg-av">'+(ph?'<img src="'+esc(ph)+'" alt="">':esc(nameOf(u).charAt(0).toUpperCase()))+'</span>';}
  function lrKey(){return 'nlj_lastread_'+(NLJ.user?NLJ.user.id:'');}
  function lrGet(){try{return JSON.parse(localStorage.getItem(lrKey())||'{}');}catch(e){return {};}}
  function markRead(u){var r=lrGet();r[u]=new Date().toISOString();try{localStorage.setItem(lrKey(),JSON.stringify(r));}catch(e){}}
  function isUnread(m,r){return m.receiver_id===NLJ.user.id&&new Date(m.created_at)>new Date(r[m.sender_id]||0);}
  function unreadOf(u){var r=lrGet();return chat.msgs.filter(function(m){return m.sender_id===u&&isUnread(m,r);}).length;}
  function updBadge(){var n=0;if(NLJ.user){var r=lrGet();n=chat.msgs.filter(function(m){return isUnread(m,r);}).length;Object.keys(chat.inv||{}).forEach(function(u){if(invState(u)==='pending_in')n++;});}
    document.querySelectorAll('.msg-badge').forEach(function(e){e.textContent=n>99?'99+':n;e.style.display=n?'':'none';});}
  function shortT(m){try{var d=new Date(m.created_at);return d.toDateString()===new Date().toDateString()?d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}):d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'});}catch(e){return '';}}
  function nljBadgeInit(){
    if(!NLJ.user||!USE_SUPABASE){chat.msgs=[];updBadge();return;}
    loadMessages().then(updBadge);
    if(!window._nljBT)window._nljBT=setInterval(function(){if(NLJ.user&&!document.hidden&&!panelOpen())loadMessages().then(updBadge);},15000);document.addEventListener('visibilitychange',function(){if(!document.hidden&&NLJ.user)loadMessages().then(function(){updBadge();if(panelOpen()){renderContacts();renderMsgs();}});});
  }
  function renderContacts(){
    var c=$('chatContacts'),list=contactList(),pn=$('chatPanel');
    pn.classList.toggle('prem',!!NLJ.premium);pn.classList.toggle('th',!!chat.current);
    if(!list.length){c.innerHTML='<p class="mg-empty">Aucune conversation pour le moment.<br>Ouvre un profil et clique sur <b>💬 Écrire</b>.</p>';updBadge();return;}
    c.innerHTML=list.map(function(u){
      var last=chat.msgs.filter(function(m){return partnerOf(m)===u;}).pop(),un=unreadOf(u);
      return '<div class="mg-ct'+(u===chat.current?' on':'')+(un?' un':'')+'" data-chat="'+esc(u)+'">'+avHtml(u)+'<div class="mg-ci"><b>'+esc(nameOf(u))+'</b><span>'+(last?(last.sender_id===NLJ.user.id?'Toi : ':'')+esc(previewOf(last)):invLabel(u))+'</span></div>'+(last?'<time>'+esc(shortT(last))+'</time>':'')+(un?'<i class="mg-dot">'+un+'</i>':'')+'</div>';
    }).join('');
    updBadge();
  }
  function renderMsgs(){
    var box=$('chatMessages');
    if(!chat.current){$('chatTitle').textContent='Messages';$('chatAv').innerHTML='<span class="mg-av">💬</span>';box.innerHTML='<div class="mg-empty big"><div>💬</div><b>Tes messages</b><p>Choisis une conversation, ou écris à un membre depuis sa carte de profil.</p></div>';return;}
    markRead(chat.current);renderContacts();
    $('chatTitle').textContent=nameOf(chat.current);$('chatAv').innerHTML=avHtml(chat.current);
    var list=chat.msgs.filter(function(m){return partnerOf(m)===chat.current;});
    var st=invState(chat.current);
    if(st==='blocked'){box.innerHTML='<div class="mg-inv big"><div style="font-size:2.2rem">🚫</div><p><b>Tu as bloqué '+esc(nameOf(chat.current))+'</b></p><p style="margin-top:8px">Ce membre ne peut plus t\'écrire. Tu peux le débloquer avec le bouton ✅ en haut.</p></div>';applyComposer();return;}
    if(st==='none'){box.innerHTML='<div class="mg-inv big"><div style="font-size:2.2rem">✉️</div><p><b>Envoie d\'abord une invitation à '+esc(nameOf(chat.current))+'</b></p><p style="margin-top:8px">Si elle n\'est pas acceptée, tu pourras envoyer '+PENDING_LIMIT+' messages maximum. Si elle est acceptée : '+FREE_LIMIT+' messages par jour chacun.</p><button type="button" class="btn btn-gold" data-inv="send">✉️ Envoyer une invitation</button></div>';applyComposer();return;}
    var banner=st==='pending_in'||st==='declined_in'?'<div class="mg-inv"><b>'+esc(nameOf(chat.current))+'</b> t\'a envoyé une invitation.<br>Accepte pour pouvoir répondre.<br><button type="button" class="btn btn-gold btn-sm" data-inv="accept">✅ Accepter</button>'+(st==='pending_in'?'<button type="button" class="btn btn-outline btn-sm" data-inv="decline">Refuser</button>':'')+'</div>':st==='pending_out'||st==='declined_out'?'<div class="mg-inv">⏳ Invitation '+(st==='declined_out'?'refusée':'en attente')+' : <b>'+Math.max(0,PENDING_LIMIT-list.filter(function(m){return m.sender_id===NLJ.user.id;}).length)+'/'+PENDING_LIMIT+'</b> messages restants tant qu\'elle n\'est pas acceptée.</div>':'';
    box.innerHTML=banner+(list.length?list.map(function(m){var me=m.sender_id===NLJ.user.id;
      return '<div class="mg-b '+(me?'me':'them')+'"><div>'+bodyHtml(m)+'</div><time>'+esc(timeOf(m))+'</time>'+(me?'<button type="button" class="mg-del" data-mdel="'+esc(String(m.id))+'" title="Supprimer ce message" aria-label="Supprimer ce message">🗑</button>':'')+'</div>';}).join(''):'<div class="mg-empty big"><div>🙏</div><b>Dis bonjour à '+esc(nameOf(chat.current))+'</b><p>Écris le premier message, au nom de Jésus.</p></div>');
    applyComposer();box.scrollTop=box.scrollHeight;hydrateVoice(box);
  }
  async function deleteMsg(id){
    var m=chat.msgs.find(function(x){return String(x.id)===String(id);});
    if(!m||!NLJ.user||m.sender_id!==NLJ.user.id)return;
    if(!confirm('Supprimer ce message ?'))return;
    var r=await supabaseClient.from('messages').delete().eq('id',m.id).eq('sender_id',NLJ.user.id).select('id');
    if(r.error||!r.data||!r.data.length){showToast('❌ Suppression impossible'+(r.error?' : '+r.error.message:' (droit de suppression non activé sur le serveur)'));return;}
    if(typeof m.body==='string'&&m.body.indexOf('voice:')===0){try{await supabaseClient.storage.from('voice').remove([m.body.slice(6)]);}catch(e){}}
    chat.msgs=chat.msgs.filter(function(x){return String(x.id)!==String(m.id);});
    renderContacts();renderMsgs();showToast('🗑 Message supprimé');
  }
  document.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('[data-mdel]');if(!b)return;e.preventDefault();e.stopPropagation();deleteMsg(b.getAttribute('data-mdel'));});
  function panelOpen(){var p=$('chatPanel');return p&&!p.classList.contains('hidden');}
  function stopLive(){if(chat.timer){clearInterval(chat.timer);chat.timer=null;}if(chat.channel){try{supabaseClient.removeChannel(chat.channel);}catch(e){}chat.channel=null;}}
  function startLive(){
    stopLive();
    chat.timer=setInterval(async function(){if(!panelOpen()||document.hidden)return;var n=chat.msgs.length;await loadMessages();if(chat.msgs.length!==n){renderContacts();renderMsgs();}},6000);
    try{
      chat.channel=supabaseClient.channel('nlj-messages').on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},function(p){
        var m=p.new;if(!m||chat.msgs.some(function(x){return x.id===m.id;}))return;
        if(m.sender_id===NLJ.user.id||m.receiver_id===NLJ.user.id){chat.msgs.push(m);renderContacts();renderMsgs();}
      }).on('postgres_changes',{event:'DELETE',schema:'public',table:'messages'},function(p){var o=p.old;if(!o||o.id==null)return;var n=chat.msgs.length;chat.msgs=chat.msgs.filter(function(x){return String(x.id)!==String(o.id);});if(chat.msgs.length!==n){renderContacts();renderMsgs();}}).subscribe();
    }catch(e){}
  }
  function lockUI(){
    var p=$('chatPanel');p.classList.remove('hidden');
    $('chatTitle').textContent='💳 Tchat réservé aux abonnés en Jésus';
    $('chatSubtitle').textContent='Passe en Premium pour tchater en Jésus';
    $('chatContacts').innerHTML='<div style="padding:16px;text-align:center"><div style="font-size:2.5rem">🔒</div><h4 style="margin:10px 0">Tchat réservé Premium en Jésus</h4><p style="font-size:.85rem;color:var(--muted)">Le tchat est réservé aux abonnés. Choisis un abonnement pour écrire aux membres.</p><div style="margin-top:16px;display:grid;gap:8px"><button class="btn btn-gold" data-nlj="premium">💳 Voir les abonnements - 9 000 F</button></div></div>';
    $('chatMessages').innerHTML='<div style="padding:20px;text-align:center;color:var(--muted)"><p>💬 <strong>Pourquoi le tchat est réservé aux abonnés ?</strong></p><p style="font-size:.85rem;margin-top:10px">Pour éviter les faux profils et garder une communauté sérieuse tournée vers le mariage.</p><p style="font-size:.85rem;margin-top:10px">✅ Mensuel : 9 000 F<br>✅ Alliance 6 mois : 15 000 F<br>✅ Éternelle 12 mois : 30 000 F</p></div>';
    /* fenêtre plein écran : pas de défilement de la page derrière */
  }
  /* ---------- Tchat : gratuit = 20 messages/jour sans coordonnées ; Premium = texte + vocal ---------- */
    var DIGIT_WORDS=/^(zero|un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|one|two|three|four|five|seven|eight|nine|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|dois|quatro|oito|nove)$/;
  function contactCheck(t){
    var n=String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
    if(/\d(?:[\s.\-_()]*\d){6,}/.test(n))return 'phone';
    if(/(^|\D)\+\s*\d{2,3}/.test(n))return 'phone';
    var run=0,toks=n.split(/[^a-z0-9]+/);
    for(var i=0;i<toks.length;i++){if(!toks[i])continue;if(/^\d+$/.test(toks[i])||DIGIT_WORDS.test(toks[i])){run++;if(run>=5)return 'phone';}else run=0;}
    if(/[a-z0-9._%+-]+\s*(@|\(at\)|\[at\]|arobase)\s*[a-z0-9.-]+/.test(n)||/arobase/.test(n))return 'email';
    if(/(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|fr|io|me|ly|co|info)\b)/.test(n))return 'link';
    if(/\b(whats ?app|watsap|telegram|viber|snap(chat)?|insta(gram)?|facebook|messenger|tiktok|skype|wechat)\b/.test(n))return 'app';
    return '';
  }
  function applyComposer(){
    var st=chat.current?invState(chat.current):'none',off=!chat.current||st==='none'||st==='pending_in'||st==='declined_in'||st==='blocked';
    var bb=$('chatBlock'),rb=$('chatReport');if(bb){bb.style.display=chat.current?'':'none';bb.title=st==='blocked'?'Débloquer ce membre':'Bloquer ce membre';bb.textContent=st==='blocked'?'✅':'🚫';}if(rb)rb.style.display=chat.current?'':'none';
    var inp=$('chatInput'),btn=document.querySelector('#chatForm .mg-send');
    if(inp){inp.disabled=off;inp.required=!off;inp.placeholder=off?(st==='blocked'?'Membre bloqué':st==='none'?'Envoie d\'abord une invitation…':'Accepte l\'invitation pour répondre…'):'Écrire un message…';}
    if(btn)btn.disabled=off;
  }
  async function setSub(){
    var el=$('chatSubtitle'),note=$('chatNote'),mic=$('chatMic');applyComposer();
    var u=chat.current,st=u?invState(u):'accepted',txt='',nt='';chat.rem=null;chat.remKind='';
    if(u&&st==='blocked'){txt='🚫 Membre bloqué';nt='Tu as bloqué ce membre.';}
    else if(u&&st==='none'){txt='✉️ Invitation requise';nt="Envoie une invitation pour commencer la conversation.";}
    else if(u&&(st==='pending_in'||st==='declined_in')){txt='✉️ Invitation reçue';nt="Accepte l'invitation pour pouvoir répondre.";}
    else if(u&&st!=='accepted'){var k=await countMsgs(u);chat.rem=Math.max(0,PENDING_LIMIT-k);chat.remKind='pending';txt='⏳ Invitation non acceptée - '+Math.max(0,PENDING_LIMIT-k)+'/'+PENDING_LIMIT+' messages restants';nt="Tant que l'invitation n'est pas acceptée : "+PENDING_LIMIT+" messages maximum (ils ne comptent pas dans la limite quotidienne).";}
    else if(NLJ.premium){txt='✅ Premium - messages écrits et vocaux illimités';nt='⭐ Premium : messages écrits et vocaux, sans limite.';}
    else{var n=u?await countMsgs(u,todayISO()):0;if(u){chat.rem=Math.max(0,FREE_LIMIT-n);chat.remKind='free';}txt=(u&&FREE_LIMIT-n<=2?'⚠️ ':'')+'🎁 Gratuit - '+Math.max(0,FREE_LIMIT-n)+'/'+FREE_LIMIT+" messages restants aujourd'hui dans cette conversation";
      nt="Version gratuite : "+FREE_LIMIT+" messages par jour dans chaque conversation (remise à zéro chaque jour à minuit), sans numéro de téléphone ni autre coordonnée. Messages vocaux et échange de contacts réservés aux Premium ⭐";}
    el.textContent=txt;if(note)note.textContent=nt;
    if(mic)mic.style.opacity=NLJ.premium?1:.5;
  }
  function isVoice(m){return typeof m.body==='string'&&m.body.indexOf('voice:')===0;}
  function bodyHtml(m){
    if(!isVoice(m))return callHtml(m.body)||esc(m.body);
    if(!NLJ.premium)return '🔒 Message vocal — réservé aux membres Premium ⭐';
    return '<audio controls controlsList="nodownload" preload="none" data-voice="'+esc(m.body.slice(6))+'" style="max-width:100%"></audio>';
  }
  function previewOf(m){return isVoice(m)?'🎤 Message vocal':String(m.body).substring(0,28);}
  async function hydrateVoice(box){
    var els=box.querySelectorAll('audio[data-voice]');
    for(var i=0;i<els.length;i++){
      try{var s=await supabaseClient.storage.from('voice').createSignedUrl(els[i].getAttribute('data-voice'),3600);if(s&&s.data&&s.data.signedUrl)els[i].src=s.data.signedUrl;}catch(e){}
    }
  }
  var rec=null;
  function stopRec(){if(rec&&rec.mr&&rec.mr.state!=='inactive')rec.mr.stop();}
  async function micClick(){
    var mic=$('chatMic');
    if(!NLJ.user||!chat.current){showToast('Choisis d\'abord une conversation');return;}
    if(!NLJ.premium){showToast('🎤 Les messages vocaux sont réservés aux membres Premium ⭐');return;}
    if(invState(chat.current)!=='accepted'){showToast('✉️ Invitation acceptée requise pour les vocaux');return;}
    if(rec){stopRec();return;}
    if(!navigator.mediaDevices||!window.MediaRecorder){showToast("Enregistrement vocal non pris en charge par ce navigateur");return;}
    var stream;try{stream=await navigator.mediaDevices.getUserMedia({audio:true});}catch(e){showToast("🎤 Autorise le micro pour envoyer un message vocal");return;}
    var mime='',cand=['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg'];
    for(var i=0;i<cand.length;i++){if(MediaRecorder.isTypeSupported(cand[i])){mime=cand[i];break;}}
    var mr=mime?new MediaRecorder(stream,{mimeType:mime}):new MediaRecorder(stream),chunks=[],t0=Date.now(),to=chat.current;
    rec={mr:mr};
    var tick=setInterval(function(){var s=Math.floor((Date.now()-t0)/1000);mic.textContent='⏹ '+Math.floor(s/60)+':'+('0'+(s%60)).slice(-2);if(s>=120)stopRec();},500);
    mr.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data);};
    mr.onstop=async function(){
      clearInterval(tick);stream.getTracks().forEach(function(t){t.stop();});mic.textContent='🎤';rec=null;
      if(Date.now()-t0<800||!chunks.length)return;
      var type=(mr.mimeType||mime||'audio/webm').split(';')[0],ext=type.indexOf('mp4')>=0?'m4a':type.indexOf('ogg')>=0?'ogg':'webm';
      var path=NLJ.user.id+'/'+Date.now()+'.'+ext;
      showToast('🎤 Envoi du message vocal…');
      var up=await supabaseClient.storage.from('voice').upload(path,new Blob(chunks,{type:type}),{contentType:type});
      if(up.error){showToast('❌ Envoi vocal impossible : '+((up.error&&up.error.message)||'serveur'));return;}
      var r=await supabaseClient.from('messages').insert([{sender_id:NLJ.user.id,receiver_id:to,body:'voice:'+path}]).select('id,sender_id,receiver_id,body,created_at').single();
      if(r.error||!r.data){showToast('❌ Message vocal non envoyé : '+((r.error&&r.error.message)||''));return;}
      if(!chat.msgs.some(function(x){return x.id===r.data.id;}))chat.msgs.push(r.data);
      renderContacts();renderMsgs();
    };
    mr.start();
  }
  document.addEventListener('click',function(e){if(e.target&&e.target.id==='chatMic')micClick();});
  /* ===== Appel vidéo 1 à 1 (Premium) : salle Jitsi privée, lien envoyé dans la conversation ===== */
  var CALL_PRE='📹 Appel vidéo : https://meet.jit.si/';
  function rnd(n){var a=new Uint8Array(n),s='',c='abcdefghjkmnpqrstuvwxyz23456789',i;if(window.crypto&&crypto.getRandomValues)crypto.getRandomValues(a);else for(i=0;i<n;i++)a[i]=Math.floor(Math.random()*256);for(i=0;i<n;i++)s+=c[a[i]%c.length];return s;}
  function callHtml(b){if(typeof b!=='string'||b.indexOf(CALL_PRE)!==0)return '';var room=b.slice(CALL_PRE.length);if(!/^[A-Za-z0-9_-]{8,40}$/.test(room))return '';return '📹 Appel vidéo <a class="btn btn-gold btn-sm" href="https://meet.jit.si/'+room+'" target="_blank" rel="noopener noreferrer" style="margin-left:6px">Rejoindre</a>';}
  function myFirstName(){try{var m=NLJ.user.user_metadata||{};return m.first_name||m.name||'';}catch(e){return '';}}
  async function videoClick(){
    if(!NLJ.user||!chat.current){showToast("Choisis d'abord une conversation");return;}
    if(!NLJ.premium){showToast('📹 Les appels vidéo sont réservés aux membres Premium ⭐');return;}
    if(invState(chat.current)!=='accepted'){showToast('✉️ Invitation acceptée requise pour appeler');return;}
    var w=window.open('about:blank','_blank'),room='NLJ-'+rnd(18),nm=myFirstName();
    var r=await supabaseClient.from('messages').insert([{sender_id:NLJ.user.id,receiver_id:chat.current,body:CALL_PRE+room}]).select('id,sender_id,receiver_id,body,created_at').single();
    if(r.error||!r.data){if(w)w.close();showToast('❌ Appel non envoyé : '+((r.error&&r.error.message)||''));return;}
    if(!chat.msgs.some(function(x){return x.id===r.data.id;}))chat.msgs.push(r.data);
    renderContacts();renderMsgs();
    var link='https://meet.jit.si/'+room+(nm?'#userInfo.displayName=%22'+encodeURIComponent(nm)+'%22':'');
    if(w)w.location.href=link;else showToast('📹 Appel envoyé : clique sur « Rejoindre » dans la conversation');
  }
  (function(){var f=$('chatForm'),m=$('chatMic');if(f&&m&&!$('chatVideo')){var b=document.createElement('button');b.type='button';b.id='chatVideo';b.className=m.className;b.title='Appel vidéo (Premium)';b.textContent='📹';m.insertAdjacentElement('afterend',b);}})();
  document.addEventListener('click',function(e){if(e.target&&e.target.id==='chatVideo')videoClick();});

  /* ===== Notification « quelqu'un a aimé ton profil » ===== */
  (function(){try{
    var KEY='nlj_likes_seen:',list=[],notified={},pill=null;
    function uid(){return window.NLJ&&NLJ.user?NLJ.user.id:null;}
    function es(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
    function seen(){try{return localStorage.getItem(KEY+uid())||'';}catch(e){return '';}}
    function isNew(x){var s=seen();return !s||(x.created_at&&x.created_at>s);}
    function mark(){var m='';list.forEach(function(x){if(x.created_at&&x.created_at>m)m=x.created_at;});try{localStorage.setItem(KEY+uid(),m||new Date().toISOString());}catch(e){}}
    function paint(){
      var n=list.filter(isNew).length;
      if(!pill){pill=document.createElement('button');pill.type='button';pill.style.cssText='position:fixed;left:12px;bottom:64px;z-index:1900;border:0;border-radius:999px;padding:9px 14px;background:#be123c;color:#fff;font:700 13px system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.28);cursor:pointer;display:none';pill.onclick=openList;document.body.appendChild(pill);}
      if(!list.length){pill.style.display='none';return;}
      pill.style.display='block';
      pill.textContent=n?'❤️ '+n+(n>1?' nouveaux likes':' nouveau like'):'❤️ '+list.length+(list.length>1?' likes reçus':' like reçu');
    }
    function row(x){
      var sub=[x.age?es(x.age)+' ans':'',x.city?es(x.city):''].filter(Boolean).join(' · '),d='';
      try{d=new Date(x.created_at).toLocaleDateString('fr-FR');}catch(e){}
      var av=x.photo_url?'<img src="'+es(x.photo_url)+'" alt="" style="width:44px;height:44px;border-radius:50%;object-fit:cover">':'<span style="width:44px;height:44px;border-radius:50%;background:#e2e8f0;display:grid;place-items:center;font-weight:800">'+es(String(x.name||'?').charAt(0).toUpperCase())+'</span>';
      return '<div style="display:flex;gap:10px;align-items:center;padding:10px 0;border-top:1px solid #eef2f7">'+av+'<div style="flex:1;min-width:0"><b>'+es(x.name||'Un membre')+'</b>'+(isNew(x)?' <span style="background:#be123c;color:#fff;border-radius:99px;padding:1px 7px;font-size:11px">nouveau</span>':'')+'<div style="font-size:12px;color:#6b7a8c">'+sub+(sub&&d?' · ':'')+d+'</div></div>'+(x.liker_user_id?'<button type="button" data-chat="'+es(x.liker_user_id)+'" style="border:1px solid #c9a77a;background:#fff;border-radius:10px;padding:6px 10px;cursor:pointer">💬</button>':'')+'</div>';
    }
    function openList(){
      var o=document.createElement('div');
      o.style.cssText='position:fixed;inset:0;z-index:2100;background:rgba(15,42,74,.6);display:flex;align-items:center;justify-content:center;padding:16px';
      o.innerHTML='<div style="background:#fff;color:#0f2a4a;border-radius:16px;max-width:460px;width:100%;max-height:80vh;overflow:auto;padding:20px;font-family:system-ui,sans-serif"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><b style="font-size:18px">❤️ Ils ont aimé ton profil</b><button type="button" data-x="1" style="border:0;background:none;font-size:26px;cursor:pointer">×</button></div>'+list.map(row).join('')+'</div>';
      o.addEventListener('click',function(e){
        if(e.target===o||(e.target.getAttribute&&e.target.getAttribute('data-x'))){o.remove();return;}
        var b=e.target.closest?e.target.closest('[data-chat]'):null;
        if(b){o.remove();try{window.openChat(b.getAttribute('data-chat'));}catch(x){}}
      });
      document.body.appendChild(o);mark();paint();
    }
    async function poll(){
      if(!uid()||document.hidden||typeof supabaseClient==='undefined'||!supabaseClient)return;
      try{
        var r=await supabaseClient.rpc('my_likes_received');
        if(r.error)return;
        list=r.data||[];
        var fresh=list.filter(function(x){return isNew(x)&&!notified[x.liker_user_id+x.created_at];});
        fresh.forEach(function(x){notified[x.liker_user_id+x.created_at]=1;});
        if(fresh.length)showToast(fresh.length===1?'❤️ '+(fresh[0].name||'Un membre')+' a aimé ton profil !':'❤️ '+fresh.length+' personnes ont aimé ton profil !');
        paint();
      }catch(e){}
    }
    setInterval(poll,45000);
    var iv=setInterval(function(){if(uid()){clearInterval(iv);poll();}},1500);
  }catch(e){console.warn('likes:',e);}})();

  /* ===== Prière de groupe en vidéo (salle commune du jour, réservée aux membres connectés) ===== */
  (function(){try{
    var w=document.getElementById('prayerWall');if(!w||document.getElementById('nljPrayerCall'))return;
    var btn='border:0;border-radius:10px;padding:9px 14px;font-weight:700;cursor:pointer;';
    var c=document.createElement('div');c.id='nljPrayerCall';
    c.style.cssText='background:linear-gradient(135deg,#0f2a4a,#163a64);color:#fff;border-radius:16px;padding:16px;margin-bottom:14px';
    c.innerHTML='<div style="font-weight:800;font-size:1.05rem;margin-bottom:4px">🎥 Prière en groupe en vidéo</div><p style="margin:0 0 12px;font-size:.88rem;opacity:.9">Rejoins la salle de prière commune avec ta caméra et ton micro pour prier ensemble en direct. La salle change chaque jour.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" data-pc="join" style="'+btn+'background:#c9a227;color:#1b1400">Rejoindre la salle</button><button type="button" data-pc="copy" style="'+btn+'background:rgba(255,255,255,.15);color:#fff">Copier le lien</button></div>';
    w.insertBefore(c,w.firstChild);
    c.addEventListener('click',async function(e){
      var b=e.target.closest?e.target.closest('[data-pc]'):null;if(!b)return;
      if(!(window.NLJ&&NLJ.user)){showToast('Connecte-toi pour rejoindre la prière en vidéo');return;}
      var act=b.getAttribute('data-pc'),win=act==='join'?window.open('about:blank','_blank'):null,room='NiamkeLoveJesus-Priere';
      try{var r=await supabaseClient.rpc('prayer_room');if(!r.error&&r.data)room=r.data;}catch(x){}
      var url='https://meet.jit.si/'+room;
      if(act==='copy'){try{await navigator.clipboard.writeText(url);showToast('Lien de la salle copié');}catch(x){showToast(url);}return;}
      var nm=myFirstName();
      if(win)win.location.href=url+(nm?'#userInfo.displayName=%22'+encodeURIComponent(nm)+'%22':'');else showToast('Autorise les fenêtres pop-up pour ouvrir la salle');
    });
  }catch(e){console.warn('prayer call:',e);}})();

  window.openChat=async function(uid){
    if(!requireLogin('Connecte-toi pour tchater en Jésus'))return;
    if(!NLJ.premium){await refreshPremium();notify();renderAuth();}
    if(uid&&uid===NLJ.user.id){showToast("C'est ton propre profil 🙂");return;}
    chat.current=uid||null;
    var p=$('chatPanel');p.classList.remove('hidden');
    $('chatTitle').textContent=uid?nameOf(uid)+' en Jésus':'Mes messages';
    setSub();
    await loadMessages();renderContacts();renderMsgs();startLive();
    /* fenêtre plein écran : pas de défilement de la page derrière */
  };
  window.closeChatPanel=function(){var p=$('chatPanel');if(p)p.classList.add('hidden');stopLive();};
  $('chatContacts').addEventListener('click',function(e){var d=e.target.closest('[data-chat]');if(d)openChat(d.getAttribute('data-chat'));});
  $('chatBack').addEventListener('click',function(){chat.current=null;renderContacts();renderMsgs();});
  $('chatForm').addEventListener('submit',async function(e){
    e.preventDefault();e.stopImmediatePropagation();
    var inp=$('chatInput'),v=inp.value.trim();
    if(!v||!chat.current||!NLJ.user)return;
    if(v.length>1000){showToast('Message trop long (1000 caractères maximum)');return;}
    if(v.toLowerCase().indexOf('voice:')===0){showToast('Message invalide');return;}
    var st=invState(chat.current);
    if(st==='none'){showToast('✉️ Envoie d\'abord une invitation à ce membre');return;}
    if(st==='pending_in'||st==='declined_in'){showToast('✉️ Accepte d\'abord son invitation pour répondre');return;}
    if(!NLJ.premium&&contactCheck(v)){showToast('🚫 Numéros de téléphone et autres coordonnées interdits en version gratuite. Passe en Premium ⭐');return;}
    if(st!=='accepted'){if(await countMsgs(chat.current)>=PENDING_LIMIT){showToast('✉️ Invitation non acceptée : '+PENDING_LIMIT+' messages maximum');return;}}
    else if(!NLJ.premium&&await countMsgs(chat.current,todayISO())>=FREE_LIMIT){showToast('🎁 Limite de '+FREE_LIMIT+' messages par jour dans cette conversation. Remise à zéro à minuit.');return;}
    var r=await supabaseClient.from('messages').insert([{sender_id:NLJ.user.id,receiver_id:chat.current,body:v}]).select('id,sender_id,receiver_id,body,created_at').single();
    if(r.error||!r.data){console.error('messages (envoi):',r.error);var em=(r.error&&r.error.message)||'',cd=(r.error&&r.error.code)||'',why;if(/nlj_blocked/.test(em))why="ce membre ne peut pas recevoir tes messages";else if(/nlj_invite_required/.test(em))why="invitation requise";else if(/nlj_accept_required/.test(em))why="accepte d'abord l'invitation";else if(/nlj_pending_limit/.test(em))why="invitation non acceptée : "+PENDING_LIMIT+" messages maximum";else if(/nlj_daily_limit/.test(em))why="limite de "+FREE_LIMIT+" messages par jour atteinte dans cette conversation";else if(cd==='23503')why="ce membre n'a pas de compte valide";else if(cd==='42501'||/row-level security/i.test(em))why=NLJ.premium?"envoi refusé par la base de données (droits à vérifier)":"limite quotidienne atteinte, coordonnées interdites ou droits refusés";else why=em||'erreur inconnue';showToast('❌ Message non envoyé : '+why);return;}
    inp.value='';
    if(!chat.msgs.some(function(x){return x.id===r.data.id;}))chat.msgs.push(r.data);
    renderContacts();renderMsgs();await setSub();
    if(chat.remKind==='free'&&chat.rem===1){var W="⚠️ Attention : il te reste 1 seul message gratuit aujourd'hui dans cette conversation (limite de "+FREE_LIMIT+" par jour). Passe en Premium pour écrire sans limite.";try{var ne=$('chatNote');if(ne){ne.textContent=W;ne.style.color='#b45309';ne.style.fontWeight='700';}}catch(e){}showToast(W);}else if(chat.rem!=null&&((chat.remKind==='free'&&chat.rem<=2)||(chat.remKind==='pending'&&chat.rem<=1))){var r0=chat.rem,pl=r0>1?'s':'';showToast(r0===0?(chat.remKind==='pending'?'✉️ Dernier message avant l\'acceptation de ton invitation':'🎁 Dernier message gratuit utilisé aujourd\'hui. Reviens demain ou passe en Premium ⭐'):'⚠️ Plus que '+r0+' message'+pl+(chat.remKind==='free'?' gratuit'+pl+' aujourd\'hui':' avant acceptation'));}
  },true);

  /* ---------- paiements ---------- */
  window.backendRecordPayment=async function(email,plan,amount,provider,details){
    if(!USE_SUPABASE)return false;
    var r=await supabaseClient.from('payments').insert([{email:(NLJ.user&&NLJ.user.email)||email||null,user_id:NLJ.user?NLJ.user.id:null,plan:plan,amount:amount,provider:provider,details:details||null,status:'pending'}]);
    return !r.error;
  };

  /* ---------- administration ---------- */
  var MONTHS={'Mensuel':1,'Alliance':6,'Éternelle':12};
  function adminVisibility(){
    var s=$('admin'),nav=document.querySelector('.nav-links');
    if(s)s.style.display=NLJ.admin?'':'none';
    var l=document.getElementById('nljAdminLink');
    if(NLJ.admin&&nav&&!l){var a=document.createElement('a');a.id='nljAdminLink';a.href='#admin';a.textContent='🛠️ Admin';nav.appendChild(a);}
    if(!NLJ.admin&&l)l.remove();
    if(NLJ.admin)adminRefresh();
  }
  async function adminRefresh(){
    try{
      var pr=await supabaseClient.rpc('admin_profiles'),pa=await supabaseClient.rpc('admin_payments');
      var P=pr.data||[],Y=pa.data||[];
      var row=function(p){return '<div style="display:flex;gap:10px;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eef2f7;flex-wrap:wrap"><div><strong>'+esc(p.name)+', '+esc(p.age)+' ans</strong><div class="profile-meta">'+esc(p.confession||p.church)+' • '+esc(p.email)+' • '+esc(p.status)+'</div></div><div style="display:flex;gap:6px">'+
        (p.status==='approved'?'<button class="btn btn-outline btn-sm" data-adm="pending" data-id="'+p.id+'">⏸️ Suspendre</button>':'<button class="btn btn-primary btn-sm" data-adm="approved" data-id="'+p.id+'">✅ Approuver</button>')+
        '<button class="btn btn-danger btn-sm" data-adm="delete" data-id="'+p.id+'">🗑️ Supprimer</button></div></div>';};
      var pend=P.filter(function(p){return p.status==='pending';});
      $('adminPending').innerHTML=pend.length?pend.map(row).join(''):'<p style="color:var(--muted)">Aucun profil en attente.</p>';
      $('adminAll').innerHTML=P.length?P.map(row).join(''):'<p style="color:var(--muted)">Aucun profil.</p>';
      $('adminPayments').innerHTML=Y.length?Y.map(function(y){
        var d=y.details||{};
        return '<div style="display:flex;gap:10px;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eef2f7;flex-wrap:wrap"><div><strong>'+esc(y.plan)+' • '+esc(y.amount)+' F</strong> • '+esc(y.provider)+'<div class="profile-meta">'+esc(y.email||'(sans compte)')+(d.prenom?' • '+esc(d.prenom+' '+(d.nom||'')):'')+(d.ville?' • '+esc(d.ville):'')+' • '+esc(y.status)+' • '+esc(new Date(y.created_at).toLocaleDateString('fr-FR'))+'</div></div><div style="display:flex;gap:6px">'+
          (y.status==='pending'?'<button class="btn btn-gold btn-sm" data-pay="activate" data-id="'+y.id+'" data-plan="'+esc(y.plan)+'">⭐ Activer Premium</button><button class="btn btn-outline btn-sm" data-pay="reject" data-id="'+y.id+'">Refuser</button>':'')+'</div></div>';
      }).join(''):'<p style="color:var(--muted)">Aucune demande de paiement.</p>';
    }catch(e){}
  }
  var adm=$('admin');
  if(adm)adm.addEventListener('click',async function(e){
    var b=e.target.closest('[data-adm],[data-pay]');if(!b)return;
    var rawId=b.getAttribute('data-id'),id=/^\d+$/.test(rawId)?parseInt(rawId,10):rawId,r;
    if(b.hasAttribute('data-adm')){
      var act=b.getAttribute('data-adm');
      if(act==='delete'){if(!confirm('Supprimer définitivement ce profil ?'))return;r=await supabaseClient.rpc('admin_delete_member',{p_id:String(id)});}
      else r=await supabaseClient.rpc('admin_set_status',{p_id:id,p_status:act});
    }else{
      if(b.getAttribute('data-pay')==='activate'){
        var plan=b.getAttribute('data-plan'),months=MONTHS[plan]||parseInt(prompt('Durée en mois ?','1'),10);
        if(!months)return;
        r=await supabaseClient.rpc('admin_activate_premium',{p_payment_id:id,p_months:months});
      }else r=await supabaseClient.rpc('admin_reject_payment',{p_payment_id:id});
    }
    if(r&&r.error){showToast('❌ '+r.error.message);return;}
    showToast('✅ Fait');adminRefresh();
    try{var rr=await backendGetProfiles();if(rr){profiles=rr;renderProfiles();updateStats();}}catch(x){}
  });

  /* ---------- démarrage ---------- */
  (async function(){
    var old=$('moderation');if(old)old.style.display='none';
    document.querySelectorAll('a[href="#moderation"]').forEach(function(a){a.style.display='none';});
    if(!USE_SUPABASE){renderAuth();notify();return;}
    try{var r=await backendGetProfiles();if(r){profiles=r;renderProfiles();updateStats();}}catch(e){}
    try{var s=await supabaseClient.auth.getSession();NLJ.user=(s.data&&s.data.session)?s.data.session.user:null;}catch(e){}
    await loadAccount();
    supabaseClient.auth.onAuthStateChange(function(ev,session){
      if(ev==='INITIAL_SESSION')return;
      NLJ.user=session?session.user:null;
      if(!NLJ.user){stopLive();window.closeChatPanel();chat.msgs=[];}
      setTimeout(loadAccount,0);
    });
  })();
})();
