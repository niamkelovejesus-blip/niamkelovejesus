/* ===== Mur vocal (questions-réponses en voix) + Mur admin doré épinglé =====
   Tables Supabase : voice_posts, voice_likes, admin_prayers, admin_prayer_reactions
   Stockage        : bucket public « mur-vocal »   (voir supabase_mur_vocal.sql)          */
(function(){
  var sec=document.getElementById('mur-vocal');if(!sec||sec.__mv)return;sec.__mv=1;
  var BUCKET='mur-vocal',MAXSEC=60,ME=null,ADM=[],REAC={},POSTS=[],LIKES={},OPEN={},poll=null;
  var URL_='https://qxxhbfoqlreiqyshbpqp.supabase.co',KEY='sb_publishable_OK9ncVWB2Ih8xZ5fzqEQWg_mSV6vCoe';

  /* ---------- clients Supabase (même méthode que le mur de prière) ---------- */
  function sb(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient;var pc=null;try{pc=window.parent.supabaseClient;}catch(e){}if(pc)return pc;if(window.supabase&&window.supabase.createClient){window.__nlj_sb=window.__nlj_sb||window.supabase.createClient(URL_,KEY);return window.__nlj_sb;}}catch(e){}return null;}
  function rd(){try{if(window.__nlj_rd)return window.__nlj_rd;if(window.supabase&&window.supabase.createClient){window.__nlj_rd=window.supabase.createClient(URL_,KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false,storageKey:'nlj-public-read'}});return window.__nlj_rd;}}catch(e){}return sb();}
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
  function toast(m){try{showToast(m);}catch(e){}}
  function ago(d){var s=Math.max(0,(Date.now()-new Date(d).getTime())/1000);if(s<45)return "à l'instant";var m=Math.round(s/60);if(m<60)return 'il y a '+m+' min';var h=Math.round(m/60);if(h<24)return 'il y a '+h+' h';var j=Math.round(h/24);if(j<30)return 'il y a '+j+' j';return new Date(d).toLocaleDateString('fr-FR');}
  function mmss(n){n=Math.max(0,Math.round(n||0));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0');}
  function aurl(path){var c=rd()||sb();return c?c.storage.from(BUCKET).getPublicUrl(path).data.publicUrl:'';}
  function myName(){return String((ME&&ME.user_metadata&&ME.user_metadata.name)||'Membre').slice(0,60);}

  /* ---------- squelette ---------- */
  sec.innerHTML='<div class="container"><div class="mv-wrap">'+
    '<h2 class="mv-title">🎙️ Mur vocal · Questions &amp; Réponses</h2>'+
    '<p class="mv-sub">Parle avec ta voix. Pas besoin d\'écrire. Appuie, parle, envoie.</p>'+
    '<div id="mvAdmin"></div>'+
    '<div class="mv-login" id="mvLogin" hidden>🔒 Connecte-toi pour parler et répondre.<br><button type="button" id="mvGoLogin">Se connecter</button></div>'+
    '<div class="mv-ask"><button type="button" class="mv-mic" id="mvAsk" aria-label="Poser une question avec ma voix">🎤</button><b>Appuie ici pour poser ta question</b>'+
    '<div class="mv-steps" aria-hidden="true"><span>🎤<small>Parle</small></span><span>→</span><span>⏹️<small>Arrête</small></span><span>→</span><span>✅<small>Envoie</small></span></div></div>'+
    '<div id="mvList" aria-live="polite"><p class="mv-empty">Chargement…</p></div></div></div>'+
    '<div class="mv-rec" id="mvRec" role="dialog" aria-modal="true" aria-label="Enregistrer un message vocal"></div>';
  var $=function(id){return document.getElementById(id);};
  var elAdmin=$('mvAdmin'),elList=$('mvList'),elRec=$('mvRec'),elLogin=$('mvLogin');

  /* ---------- lecteur audio unique (un seul son à la fois) ---------- */
  var AU=new Audio();AU.preload='none';var curPath=null;
  function paint(){sec.querySelectorAll('[data-play]').forEach(function(b){var p=b.getAttribute('data-play'),on=p===curPath,pl=on&&!AU.paused;b.classList.toggle('on',pl);var pb=b.querySelector('.mv-pb');if(pb)pb.textContent=pl?'⏸':'▶';var bar=b.querySelector('.mv-bar i');if(bar)bar.style.width=(on&&AU.duration&&isFinite(AU.duration))?Math.min(100,AU.currentTime/AU.duration*100)+'%':'0';});}
  ['play','pause','ended','timeupdate','emptied'].forEach(function(ev){AU.addEventListener(ev,paint);});
  AU.addEventListener('error',function(){if(curPath)toast('🔇 Impossible de lire ce message vocal');});
  function togglePlay(path){
    if(curPath===path){if(AU.paused)AU.play().catch(function(){});else AU.pause();return;}
    curPath=path;AU.src=aurl(path);AU.play().catch(function(){});paint();
  }
  function player(path,dur){return '<button type="button" class="mv-play" data-play="'+esc(path)+'" aria-label="Écouter"><span class="mv-pb">▶</span><span class="mv-bar"><i></i></span><span class="mv-dur">'+(dur?mmss(dur):'')+'</span></button>';}

  /* ---------- MUR ADMIN (doré, épinglé) ---------- */
  function react(id,kind){var r=(REAC[id]||{})[kind]||[];return r;}
  function adminItem(p,full){
    var a=react(p.id,'amen'),l=react(p.id,'like'),ma=!!(ME&&a.indexOf(ME.id)>-1),ml=!!(ME&&l.indexOf(ME.id)>-1);
    return '<div class="'+(full?'':'mv-oldi')+'">'+(p.title?'<h3>'+esc(p.title)+'</h3>':'')+'<time datetime="'+esc(p.created_at)+'">'+esc(ago(p.created_at))+'</time>'+
      (p.audio_path?'<div style="margin-top:10px">'+player(p.audio_path,0)+'</div>':'')+
      (p.body?'<div class="mv-text">'+esc(p.body)+'</div>':'')+
      '<div class="mv-react"><button type="button" class="amen'+(ma?' on':'')+'" data-ar="amen" data-pid="'+esc(p.id)+'" aria-pressed="'+ma+'">🙏 AMEN <span>'+a.length+'</span></button>'+
      '<button type="button" class="'+(ml?'on':'')+'" data-ar="like" data-pid="'+esc(p.id)+'" aria-pressed="'+ml+'">'+(ml?'❤️':'🤍')+' J\'aime <span>'+l.length+'</span></button></div></div>';
  }
  function renderAdmin(){
    var h='<section class="mv-admin" aria-label="Prière de l\'administrateur, épinglée"><span class="mv-pin">📌 ÉPINGLÉ · PRIÈRE DE L\'ADMIN</span>';
    if(!ADM.length)h+='<p class="mv-admin-empty">🙏 La prochaine prière arrive bientôt.</p>';
    else{h+=adminItem(ADM[0],true);
      if(ADM.length>1)h+='<details class="mv-old"><summary>📜 Prières précédentes ('+(ADM.length-1)+')</summary>'+ADM.slice(1).map(function(p){return adminItem(p,false);}).join('')+'</details>';}
    h+='</section>';
    if(elAdmin._h===h)return;elAdmin._h=h;elAdmin.innerHTML=h;paint();
  }

  /* ---------- QUESTIONS / RÉPONSES ---------- */
  function likeBtn(p){var L=LIKES[p.id]||[],me=!!(ME&&L.indexOf(ME.id)>-1);return '<button type="button" class="'+(me?'on':'')+'" data-like="'+esc(p.id)+'" aria-pressed="'+me+'">'+(me?'❤️':'🤍')+' J\'aime <span>'+L.length+'</span></button>';}
  function head(p){var mine=ME&&p.user_id===ME.id,nm=p.author_name||'Membre';
    return '<div class="mv-h"><span class="mv-av">'+esc(nm.charAt(0).toUpperCase())+'</span><div><b>'+esc(nm)+'</b><time>'+esc(ago(p.created_at))+'</time></div>'+(mine?'<button type="button" class="mv-del" data-del="'+esc(p.id)+'" aria-label="Supprimer">🗑️</button>':'')+'</div>';}
  function question(q){
    var reps=POSTS.filter(function(x){return x.parent_id===q.id;}).sort(function(a,b){return new Date(a.created_at)-new Date(b.created_at);});
    var h='<article class="mv-q">'+head(q)+player(q.audio_path,q.duration)+trHtml(q)+
      '<div class="mv-act">'+likeBtn(q)+'<button type="button" data-reply="'+esc(q.id)+'">🎤 Répondre</button>'+
      '<button type="button" class="'+(OPEN[q.id]?'on':'')+'" data-open="'+esc(q.id)+'">💬 '+reps.length+' réponse'+(reps.length>1?'s':'')+'</button></div>';
    if(OPEN[q.id]&&reps.length)h+='<div class="mv-rep">'+reps.map(function(r){return '<div class="mv-r">'+head(r)+player(r.audio_path,r.duration)+trHtml(r)+'<div class="mv-act">'+likeBtn(r)+'</div></div>';}).join('')+'</div>';
    return h+'</article>';
  }
  function renderList(){
    var qs=POSTS.filter(function(x){return !x.parent_id;}).sort(function(a,b){return new Date(b.created_at)-new Date(a.created_at);});
    var h=qs.length?qs.map(question).join(''):'<p class="mv-empty">🎤 Aucune question pour l\'instant.<br>Sois le premier à parler !</p>';
    if(elList._h===h)return;elList._h=h;elList.innerHTML=h;paint();
  }
  function applyAuth(){elLogin.hidden=!!ME;elAdmin._h=null;elList._h=null;renderAdmin();renderList();}

  /* ---------- chargement ---------- */
  function chunk(a,n){var o=[];for(var i=0;i<a.length;i+=n)o.push(a.slice(i,i+n));return o;}
  async function load(){
    var c=rd();if(!c){elList.innerHTML='<p class="mv-empty">Le mur vocal est indisponible (connexion impossible).</p>';return;}
    try{
      var ap=await c.from('admin_prayers').select('id,title,body,audio_path,created_at').eq('visible',true).order('created_at',{ascending:false}).limit(20);
      if(!ap.error){ADM=ap.data||[];REAC={};
        if(ADM.length){var rr=await c.from('admin_prayer_reactions').select('prayer_id,user_id,kind').in('prayer_id',ADM.map(function(x){return x.id;}));
          (rr.data||[]).forEach(function(x){var o=REAC[x.prayer_id]=REAC[x.prayer_id]||{};(o[x.kind]=o[x.kind]||[]).push(x.user_id);});}
        renderAdmin();}
      else console.warn('admin_prayers:',ap.error.message);
      var qs=await c.from('voice_posts').select('*').is('parent_id',null).eq('visible',true).order('created_at',{ascending:false}).limit(40);
      if(qs.error){console.warn('voice_posts:',qs.error.message);elList.innerHTML='<p class="mv-empty">Le mur vocal arrive bientôt 🙏</p>';return;}
      var all=qs.data||[],ids=all.map(function(x){return x.id;});
      if(ids.length){var rp=await c.from('voice_posts').select('*').in('parent_id',ids).eq('visible',true).order('created_at',{ascending:true}).limit(300);all=all.concat(rp.data||[]);}
      POSTS=all;LIKES={};
      var pids=all.map(function(x){return x.id;});
      for(var k=0,cs=chunk(pids,40);k<cs.length;k++){var lk=await c.from('voice_likes').select('post_id,user_id').in('post_id',cs[k]);(lk.data||[]).forEach(function(x){(LIKES[x.post_id]=LIKES[x.post_id]||[]).push(x.user_id);});}
      renderList();
    }catch(e){console.warn('mur vocal:',e);}
  }

  /* ---------- enregistreur vocal ---------- */
  var R={mr:null,chunks:[],stream:null,t0:0,tick:null,blob:null,dur:0,parent:null,busy:false};
  function pickMime(){var c=['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg;codecs=opus'];if(!window.MediaRecorder||!MediaRecorder.isTypeSupported)return '';for(var i=0;i<c.length;i++)if(MediaRecorder.isTypeSupported(c[i]))return c[i];return '';}

  /* ---------- transcription (texte du vocal, traduit ensuite par nlj-translate.js) ---------- */
  var SR_LANG={fr:'fr-FR',en:'en-US',es:'es-ES',pt:'pt-PT',it:'it-IT',de:'de-DE',ar:'ar-SA',zh:'zh-CN',nl:'nl-NL',ru:'ru-RU',sw:'sw-KE',hi:'hi-IN',id:'id-ID',tl:'fil-PH',ko:'ko-KR',vi:'vi-VN',pl:'pl-PL',uk:'uk-UA',ur:'ur-PK',ro:'ro-RO'};
  function myLang(){var l='fr';try{l=(localStorage.getItem('niamke_lang')||'fr').toLowerCase().slice(0,2);}catch(e){}return l;}
  function srStart(){
    R.tr='';R.sr=null;R.srOn=false;
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition,lg=SR_LANG[myLang()];
    if(!SR||!lg)return;
    try{
      var sr=new SR();sr.lang=lg;sr.continuous=true;sr.interimResults=false;R.sr=sr;R.srOn=true;
      sr.onresult=function(ev){for(var i=ev.resultIndex;i<ev.results.length;i++){if(ev.results[i].isFinal){R.tr+=(R.tr?' ':'')+String(ev.results[i][0].transcript||'').trim();}}};
      sr.onerror=function(ev){if(ev&&(ev.error==='not-allowed'||ev.error==='service-not-allowed'))R.srOn=false;};
      sr.onend=function(){if(R.srOn&&R.mr&&R.mr.state==='recording'){try{sr.start();}catch(e){}}};
      sr.start();
    }catch(e){R.sr=null;R.srOn=false;}
  }
  function srStop(){R.srOn=false;try{R.sr&&R.sr.stop();}catch(e){}R.sr=null;}
  function trHtml(p){var t=String(p&&p.transcript||'').trim();return t?'<div class=\"mv-tr\" lang=\"'+esc(p.transcript_lang||'')+'\">💬 '+esc(t)+'</div>':'';}
  function stopStream(){try{R.stream&&R.stream.getTracks().forEach(function(t){t.stop();});}catch(e){}R.stream=null;}
  function cleanup(){srStop();clearInterval(R.tick);try{if(R.mr&&R.mr.state!=='inactive'){R.mr.onstop=null;R.mr.stop();}}catch(e){}stopStream();R.mr=null;R.chunks=[];R.blob=null;R.dur=0;R.tr='';}
  function recUI(state,hint){
    var ta0=$('mvTr');if(ta0)R.tr=ta0.value;
    elRec.classList.toggle('recording',state==='rec');
    var title=R.parent?'🎤 Ta réponse en voix':'🎤 Ta question en voix';
    var h='<h4>'+title+'</h4>';
    if(state==='idle')h+='<div class="mv-timer">0:00</div><p class="mv-hint">'+esc(hint||'Appuie sur le bouton rouge et parle')+'</p><div class="mv-row"><button type="button" class="mv-big go" data-rec="start">🎤 Parler</button><button type="button" class="mv-big cancel" data-rec="cancel">✖ Fermer</button></div>';
    if(state==='rec')h+='<div class="mv-timer" id="mvTimer">0:00</div><p class="mv-hint">Je t\'écoute… (max '+MAXSEC+' secondes)</p><div class="mv-row"><button type="button" class="mv-big stop" data-rec="stop">⏹️ Terminer</button></div>';
    if(state==='review')h+='<div class="mv-timer">'+mmss(R.dur)+'</div><audio controls src="'+esc(R.url||'')+'"></audio><p class="mv-hint">Écoute, puis envoie.</p><label class="mv-trl" for="mvTr">📝 Texte de ton message (traduit pour les autres membres). Corrige-le si besoin :</label><textarea id="mvTr" class="mv-trbox" rows="3" maxlength="1200" translate="no"'+(R.busy?' disabled':'')+'>'+esc(R.tr||'')+'</textarea><div class="mv-row"><button type="button" class="mv-big send" data-rec="send"'+(R.busy?' disabled':'')+'>'+(R.busy?'⏳ Envoi…':'✅ Envoyer')+'</button><button type="button" class="mv-big redo" data-rec="redo"'+(R.busy?' disabled':'')+'>🔁 Refaire</button><button type="button" class="mv-big cancel" data-rec="cancel">✖ Annuler</button></div>';
    elRec.innerHTML=h;
  }
  function openRec(parent){
    if(!ME){elLogin.hidden=false;toast('🔒 Connecte-toi pour parler');try{elLogin.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}return;}
    if(!navigator.mediaDevices||!window.MediaRecorder){toast("🎤 Ton téléphone ne permet pas l'enregistrement ici. Essaie Chrome ou Safari à jour.");return;}
    AU.pause();cleanup();R.parent=parent||null;R.url=null;R.busy=false;recUI('idle');elRec.classList.add('open');
  }
  function closeRec(){cleanup();if(R.url){try{URL.revokeObjectURL(R.url);}catch(e){}R.url=null;}elRec.classList.remove('open','recording');}
  async function startRec(){
    var stream;try{stream=await navigator.mediaDevices.getUserMedia({audio:true});}catch(e){recUI('idle','🎤 Autorise le micro dans ton navigateur, puis réessaie.');return;}
    R.stream=stream;R.chunks=[];var mime=pickMime(),mr;
    try{mr=mime?new MediaRecorder(stream,{mimeType:mime}):new MediaRecorder(stream);}catch(e){stopStream();recUI('idle','🎤 Enregistrement impossible sur cet appareil.');return;}
    R.mr=mr;mr.ondataavailable=function(ev){if(ev.data&&ev.data.size)R.chunks.push(ev.data);};
    mr.onstop=function(){clearInterval(R.tick);srStop();stopStream();var type=(mr.mimeType||mime||'audio/webm');R.blob=new Blob(R.chunks,{type:type});R.dur=Math.max(0,Math.round((Date.now()-R.t0)/1000));
      if(R.dur<1||R.blob.size<500){R.blob=null;recUI('idle','Trop court. Parle un peu plus longtemps.');return;}
      R.url=URL.createObjectURL(R.blob);recUI('review');};
    R.t0=Date.now();mr.start();srStart();recUI('rec');
    R.tick=setInterval(function(){var s=(Date.now()-R.t0)/1000,t=$('mvTimer');if(t)t.textContent=mmss(s);if(s>=MAXSEC)try{mr.stop();}catch(e){}},250);
  }
  function stopRec(){try{if(R.mr&&R.mr.state==='recording')R.mr.stop();}catch(e){}}
  async function sendRec(){
    var c=sb();if(!c||!ME||!R.blob||R.busy)return;var ta1=$('mvTr');if(ta1)R.tr=ta1.value;R.busy=true;recUI('review');
    var type=String(R.blob.type||'audio/webm').split(';')[0].replace(/^video\//,'audio/');
    var ext=/mp4|m4a|aac/.test(type)?'m4a':/ogg/.test(type)?'ogg':'webm';
    if(ext==='m4a')type='audio/mp4';
    var path='membres/'+ME.id+'/'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.'+ext;
    var up=await c.storage.from(BUCKET).upload(path,R.blob,{contentType:type,cacheControl:'31536000',upsert:false});
    if(up.error){R.busy=false;recUI('review');console.warn('upload vocal:',up.error.message);toast("❌ Envoi impossible pour le moment");return;}
    var row={user_id:ME.id,author_name:myName(),parent_id:R.parent||null,audio_path:path,duration:R.dur},tx=String(R.tr||'').replace(/\s+/g,' ').trim().slice(0,1200);
    if(tx){row.transcript=tx;row.transcript_lang=myLang();}
    var ins=await c.from('voice_posts').insert([row]).select().single();
    if(ins.error&&tx&&/transcript/i.test(ins.error.message||'')){delete row.transcript;delete row.transcript_lang;ins=await c.from('voice_posts').insert([row]).select().single();}   /* colonne pas encore créée : on publie quand même le vocal */
    if(ins.error){try{await c.storage.from(BUCKET).remove([path]);}catch(e){}R.busy=false;recUI('review');
      toast(/nlj_voice_daily_limit/.test(ins.error.message||'')?'⏳ Tu as atteint la limite de 15 messages vocaux aujourd\'hui. Reviens demain 🙏':'❌ Publication impossible pour le moment');return;}
    var wasReply=R.parent;if(wasReply)OPEN[wasReply]=true;POSTS.push(ins.data);closeRec();renderList();toast(wasReply?'✅ Réponse envoyée':'✅ Question envoyée');
  }

  /* ---------- clics ---------- */
  sec.addEventListener('click',async function(e){
    var t=e.target.closest('button');if(!t)return;
    if(t.id==='mvAsk'){openRec(null);return;}
    if(t.id==='mvGoLogin'){try{parent.postMessage({nlj:'go',page:'p1',id:'login'},'*');}catch(x){}return;}
    if(t.hasAttribute('data-play')){togglePlay(t.getAttribute('data-play'));return;}
    if(t.hasAttribute('data-rec')){var a=t.getAttribute('data-rec');if(a==='start')startRec();else if(a==='stop')stopRec();else if(a==='redo'){cleanup();if(R.url){try{URL.revokeObjectURL(R.url);}catch(x){}R.url=null;}recUI('idle');}else if(a==='send')sendRec();else if(a==='cancel')closeRec();return;}
    if(t.hasAttribute('data-reply')){openRec(t.getAttribute('data-reply'));return;}
    if(t.hasAttribute('data-open')){var o=t.getAttribute('data-open');OPEN[o]=!OPEN[o];renderList();return;}
    var c=sb();
    if(t.hasAttribute('data-del')){var id=t.getAttribute('data-del');if(!c||!confirm('Supprimer ce message vocal ?'))return;
      var paths=POSTS.filter(function(x){return x.id===id||x.parent_id===id;}).map(function(x){return x.audio_path;});
      var d=await c.from('voice_posts').delete().eq('id',id);if(d.error){toast('❌ Suppression impossible');return;}
      try{await c.storage.from(BUCKET).remove(paths);}catch(x){}
      POSTS=POSTS.filter(function(x){return x.id!==id&&x.parent_id!==id;});renderList();return;}
    if(t.hasAttribute('data-like')){
      if(!c||!ME){toast('🔒 Connecte-toi pour participer');return;}
      var pid=t.getAttribute('data-like'),L=LIKES[pid]=LIKES[pid]||[],ix=L.indexOf(ME.id);
      if(ix>-1){L.splice(ix,1);renderList();var r1=await c.from('voice_likes').delete().eq('post_id',pid).eq('user_id',ME.id);if(r1.error){L.push(ME.id);renderList();toast('❌ Action impossible');}}
      else{L.push(ME.id);renderList();var r2=await c.from('voice_likes').insert([{post_id:pid,user_id:ME.id}]);if(r2.error&&r2.error.code!=='23505'){var j=L.indexOf(ME.id);if(j>-1)L.splice(j,1);renderList();toast('❌ Action impossible');}}
      return;}
    if(t.hasAttribute('data-ar')){
      if(!c||!ME){toast('🔒 Connecte-toi pour participer');return;}
      var kind=t.getAttribute('data-ar'),prid=t.getAttribute('data-pid'),o2=REAC[prid]=REAC[prid]||{},A=o2[kind]=o2[kind]||[],k2=A.indexOf(ME.id);
      if(k2>-1){A.splice(k2,1);renderAdmin();var r3=await c.from('admin_prayer_reactions').delete().eq('prayer_id',prid).eq('user_id',ME.id).eq('kind',kind);if(r3.error){A.push(ME.id);renderAdmin();toast('❌ Action impossible');}}
      else{A.push(ME.id);renderAdmin();var r4=await c.from('admin_prayer_reactions').insert([{prayer_id:prid,user_id:ME.id,kind:kind}]);if(r4.error&&r4.error.code!=='23505'){var j2=A.indexOf(ME.id);if(j2>-1)A.splice(j2,1);renderAdmin();toast('❌ Action impossible');}else if(!r4.error&&kind==='amen')toast('🙏 Amen !');}
    }
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&elRec.classList.contains('open'))closeRec();});

  /* ---------- connexion ---------- */
  async function initAuth(){
    var c=sb();if(!c){applyAuth();return;}
    try{var s=await c.auth.getSession();ME=(s.data&&s.data.session&&s.data.session.user)||null;}catch(e){ME=null;}
    applyAuth();
    c.auth.onAuthStateChange(function(ev,sess){var n=(sess&&sess.user)||null;if((n&&n.id)!==(ME&&ME.id)){ME=n;applyAuth();}});
  }
  setInterval(function(){if(!elRec.classList.contains('open'))load();},30000);
  setInterval(function(){renderList();},60000);
  initAuth();load();
})();
