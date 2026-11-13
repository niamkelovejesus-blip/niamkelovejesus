/* ===== Mur de Prière : table Supabase "prayers" + temps réel ===== */
(function(){
  var wall=document.getElementById('prayerWall');if(!wall)return;
  var $=function(id){return document.getElementById(id);};
  var list=$('pwList'),form=$('pwForm'),login=$('pwLogin'),live=$('pwLive'),liveT=$('pwLiveT'),txt=$('pwText'),ref=$('pwRef'),cnt=$('pwCount'),send=$('pwSend');
  var rows=[],kind='priere',ME=null,poll=null,LIMIT=60;
  function sb(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient;var pc=null;try{pc=window.parent.supabaseClient;}catch(e){}if(pc)return pc;if(window.supabase&&window.supabase.createClient){window.__nlj_sb=window.__nlj_sb||window.supabase.createClient('https://qxxhbfoqlreiqyshbpqp.supabase.co','sb_publishable_OK9ncVWB2Ih8xZ5fzqEQWg_mSV6vCoe');return window.__nlj_sb;}}catch(e){}return null;}function rd(){try{if(window.__nlj_rd)return window.__nlj_rd;if(window.supabase&&window.supabase.createClient){window.__nlj_rd=window.supabase.createClient('https://qxxhbfoqlreiqyshbpqp.supabase.co','sb_publishable_OK9ncVWB2Ih8xZ5fzqEQWg_mSV6vCoe',{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false,storageKey:'nlj-public-read'}});return window.__nlj_rd;}}catch(e){}return sb();}
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
  function toast(m){try{showToast(m);}catch(e){}}
  function ago(d){var s=Math.max(0,(Date.now()-new Date(d).getTime())/1000);if(s<45)return "à l'instant";var m=Math.round(s/60);if(m<60)return 'il y a '+m+' min';var h=Math.round(m/60);if(h<24)return 'il y a '+h+' h';var j=Math.round(h/24);if(j<30)return 'il y a '+j+' j';return new Date(d).toLocaleDateString('fr-FR');}
  function item(r){
    var mine=ME&&r.user_id&&r.user_id===ME.id,v=r.kind==='verset';
    return '<article class="pw-item '+(v?'verse':'prayer')+'" data-id="'+esc(r.id)+'"><div class="pw-ih"><span>'+(v?'📖':'🙏')+'</span><b>'+esc(r.author_name||'Membre')+'</b><time datetime="'+esc(r.created_at)+'">'+esc(ago(r.created_at))+'</time>'+(mine?'<button type="button" class="pw-del" data-del="'+esc(r.id)+'" title="Supprimer" aria-label="Supprimer">✕</button>':'')+'</div>'+
      (v?'<blockquote>« '+esc(r.content)+' »'+(r.reference?'<cite>'+esc(r.reference)+'</cite>':'')+'</blockquote>':'<p>'+esc(r.content)+'</p>')+social(r)+'</article>';
  }
  var SOC={l:{},c:{}},OPENC={};
  function social(r){var id=String(r.id),L=SOC.l[id]||[],C=SOC.c[id]||[],me=!!(ME&&L.indexOf(ME.id)>-1);
    var h='<div class="pw-act"><button type="button" class="pw-like'+(me?' on':'')+'" data-like="'+esc(id)+'" aria-pressed="'+(me?'true':'false')+'">'+(me?'❤️':'🤍')+' <span>'+L.length+'</span> J\'aime</button><button type="button" class="pw-cm" data-cm="'+esc(id)+'">💬 <span>'+C.length+'</span> Commenter</button></div>';
    if(OPENC[id]){h+='<div class="pw-cbox">'+C.map(function(x){return '<div class="pw-c"><b>'+esc(x.author_name||'Membre')+'</b><time>'+esc(ago(x.created_at))+'</time>'+(ME&&x.user_id===ME.id?'<button type="button" class="pw-cdel" data-cdel="'+esc(x.id)+'" data-pid="'+esc(id)+'" aria-label="Supprimer">✕</button>':'')+'<p>'+esc(x.content)+'</p></div>';}).join('')+(ME?'<div class="pw-cf"><input type="text" maxlength="500" placeholder="Écris un commentaire…" data-cin="'+esc(id)+'"><button type="button" data-csend="'+esc(id)+'">Envoyer</button></div>':'<p class="pw-empty">Connecte-toi pour commenter.</p>')+'</div>';}
    return h;}
  async function loadSocial(){var c=rd();if(!c||!rows.length)return;var ids=rows.map(function(x){return x.id;});
    try{var a=await c.from('prayer_likes').select('prayer_id,user_id').in('prayer_id',ids);var b=await c.from('prayer_comments').select('id,prayer_id,user_id,author_name,content,created_at').in('prayer_id',ids).order('created_at',{ascending:true});
      if(a.error||b.error){console.warn('social:',(a.error||b.error).message);return;}
      SOC.l={};SOC.c={};(a.data||[]).forEach(function(x){var k=String(x.prayer_id);(SOC.l[k]=SOC.l[k]||[]).push(x.user_id);});(b.data||[]).forEach(function(x){var k=String(x.prayer_id);(SOC.c[k]=SOC.c[k]||[]).push(x);});render();}catch(e){}}
  function render(){
    if(!rows.length){list.innerHTML='<p class="pw-empty">Aucune prière pour l\'instant. Sois le premier à déposer une prière ou un verset 🙏</p>';return;}
    var ae=document.activeElement,kv=ae&&ae.getAttribute?ae.getAttribute('data-cin'):null,kval=kv?ae.value:'';var h=rows.map(item).join('');if(list._h===h&&!list.querySelector('.pw-empty'))return;list._h=h;list.innerHTML=h;if(kv){var ni=list.querySelector('[data-cin="'+kv+'"]');if(ni){ni.value=kval;ni.focus();}}
  }
  function sortRows(){rows.sort(function(a,b){return new Date(b.created_at)-new Date(a.created_at);});if(rows.length>200)rows.length=200;}
  function upsert(r){if(!r||!r.id)return;if(r.visible===false){remove(r.id);return;}var i=rows.findIndex(function(x){return x.id===r.id;});if(i>=0)rows[i]=r;else rows.push(r);sortRows();render();}
  function remove(id){rows=rows.filter(function(x){return x.id!==id;});render();}
  function setLive(on,t){live.classList.toggle('on',!!on);liveT.textContent=t;}
  async function load(){
    var c=rd();if(!c){if(rows.length){return;}list.innerHTML='<p class="pw-empty">Le mur de prière est indisponible (connexion au serveur impossible).</p>';setLive(false,'Hors ligne');return;}
    var r=await c.from('prayers').select('id,user_id,author_name,kind,content,reference,visible,created_at').eq('visible',true).order('created_at',{ascending:false}).limit(LIMIT);
    if(r.error){console.warn('prayers:',r.error.message);if(rows.length){return;}list.innerHTML='<p class="pw-empty">Le mur de prière est momentanément indisponible.</p>';setLive(false,'Hors ligne');return;}
    rows=r.data||[];render();loadSocial();
  }
  function startPolling(){if(poll)return;poll=setInterval(load,20000);}
  function subscribe(){
    var c=sb();if(!c)return;
    c.channel('nlj-prayers')
     .on('postgres_changes',{event:'INSERT',schema:'public',table:'prayers'},function(p){upsert(p.new);})
     .on('postgres_changes',{event:'UPDATE',schema:'public',table:'prayers'},function(p){upsert(p.new);})
     .on('postgres_changes',{event:'DELETE',schema:'public',table:'prayers'},function(p){if(p.old&&p.old.id)remove(p.old.id);})
     .subscribe(function(st){
       if(st==='SUBSCRIBED'){setLive(true,'En direct');startPolling();}
       else if(st==='CHANNEL_ERROR'||st==='TIMED_OUT'||st==='CLOSED'){setLive(false,'Reconnexion…');startPolling();}
     });
  }
  function applyAuth(){var on=!!ME;form.hidden=!on;login.hidden=on;render();}
  async function initAuth(){
    var c=sb();if(!c){applyAuth();return;}
    try{var s=await c.auth.getSession();ME=(s.data&&s.data.session&&s.data.session.user)||null;}catch(e){ME=null;}
    applyAuth();
    c.auth.onAuthStateChange(function(ev,sess){ME=(sess&&sess.user)||null;applyAuth();});
  }
  /* formulaire */
  form.querySelectorAll('[data-kind]').forEach(function(b){b.addEventListener('click',function(){
    kind=b.getAttribute('data-kind');
    form.querySelectorAll('[data-kind]').forEach(function(x){x.classList.toggle('on',x===b);});
    ref.hidden=kind!=='verset';txt.placeholder=kind==='verset'?'Écris le verset…':'Partage ta prière…';
  });});
  txt.addEventListener('input',function(){cnt.textContent=txt.value.length+'/5000';});
  form.addEventListener('submit',async function(e){
    e.preventDefault();
    var c=sb(),body=txt.value.trim();
    if(!c||!ME){toast('🔒 Connecte-toi pour publier');return;}
    if(!body){return;}
    send.disabled=true;
    var name=(ME.user_metadata&&ME.user_metadata.name)||'Membre';
    var r=await c.from('prayers').insert([{user_id:ME.id,author_name:String(name).slice(0,60),kind:kind,content:body.slice(0,5000),reference:kind==='verset'&&ref.value.trim()?ref.value.trim().slice(0,60):null}]).select().single();
    send.disabled=false;
    if(r.error){console.warn('prayers insert:',r.error.message);toast('❌ Publication impossible pour le moment');return;}
    txt.value='';ref.value='';cnt.textContent='0/5000';upsert(r.data);toast(kind==='verset'?'📖 Verset publié':'🙏 Prière publiée');
  });
  list.addEventListener('click',async function(e){
    var b=e.target.closest('[data-del]');if(!b)return;
    var id=b.getAttribute('data-del'),c=sb();if(!c||!confirm('Supprimer cette publication ?'))return;
    var r=await c.from('prayers').delete().eq('id',id);
    if(r.error){toast('❌ Suppression impossible');return;}remove(id);
  });
  $('pwGoLogin').addEventListener('click',function(){try{parent.postMessage({nlj:'go',page:'p1',id:'login'},'*');}catch(e){}});
  setInterval(function(){if(rows.length)render();},60000);
  list.addEventListener('click',async function(e){
    var t=e.target.closest('[data-like],[data-cm],[data-csend],[data-cdel]');if(!t)return;
    if(t.hasAttribute('data-cm')){var i0=t.getAttribute('data-cm');OPENC[i0]=!OPENC[i0];render();return;}
    var c=sb();if(!c||!ME){toast('🔒 Connecte-toi pour participer');return;}
    if(t.hasAttribute('data-like')){var id=t.getAttribute('data-like'),Ls=SOC.l[id]=SOC.l[id]||[],ix=Ls.indexOf(ME.id);
      if(ix>-1){Ls.splice(ix,1);render();var r1=await c.from('prayer_likes').delete().eq('prayer_id',id).eq('user_id',ME.id);if(r1.error){Ls.push(ME.id);render();toast('❌ Action impossible');}}
      else{Ls.push(ME.id);render();var r2=await c.from('prayer_likes').insert([{prayer_id:id,user_id:ME.id}]);if(r2.error&&r2.error.code!=='23505'){var j=Ls.indexOf(ME.id);if(j>-1)Ls.splice(j,1);render();toast('❌ Action impossible');}}
      return;}
    if(t.hasAttribute('data-csend')){var pid=t.getAttribute('data-csend'),inp=list.querySelector('[data-cin="'+pid+'"]'),v=inp&&inp.value.trim();if(!v)return;t.disabled=true;
      var nm=(ME.user_metadata&&ME.user_metadata.name)||'Membre';
      var r3=await c.from('prayer_comments').insert([{prayer_id:pid,user_id:ME.id,author_name:String(nm).slice(0,60),content:v.slice(0,500)}]).select().single();t.disabled=false;
      if(r3.error||!r3.data){toast('❌ Commentaire impossible');return;}
      (SOC.c[pid]=SOC.c[pid]||[]).push(r3.data);render();return;}
    if(t.hasAttribute('data-cdel')){var pp=t.getAttribute('data-pid'),cid=t.getAttribute('data-cdel');var r4=await c.from('prayer_comments').delete().eq('id',cid);if(r4.error){toast('❌ Suppression impossible');return;}
      SOC.c[pp]=(SOC.c[pp]||[]).filter(function(x){return String(x.id)!==cid;});render();}
  });
  list.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.matches&&e.target.matches('[data-cin]')){e.preventDefault();var b=list.querySelector('[data-csend="'+e.target.getAttribute('data-cin')+'"]');if(b)b.click();}});
  initAuth();load().then(subscribe);startPolling();
})();
