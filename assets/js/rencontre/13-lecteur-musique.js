/* ===== Lecteur Musique + Versets publiés + Profil repliable ===== */
(function(){
  /* ---------- config ---------- */
  var ONLY_VERSE_AUTHORS=[]; /* ids utilisateur Supabase dont les versets s'affichent dans « Versets ». Vide = tous les versets publiés sur le Mur de prière. */
  var MT={fr:'fr',en:'en',es:'es',pt:'pt',it:'it',de:'de',ar:'ar',zh:'zh-CN',nl:'nl',ru:'ru'};
  var UI={
    fr:{pl:'Liste des chants',cnt:'chants',cnt1:'chant',comp:'Compositeur',lyr:'Paroles',dl:'Télécharger',lock:'Le téléchargement est réservé aux membres Premium ⭐',ok:'Téléchargement…',yrs:'ans',none:'Paroles non disponibles pour ce chant.',tr:'Traduit automatiquement',orig:'Voir l’original',tra:'Voir la traduction',trg:'Traduction…',empty:'Les chants arrivent bientôt',err:'Impossible de charger les chants'},
    en:{pl:'Playlist',cnt:'songs',cnt1:'song',comp:'Composer',lyr:'Lyrics',dl:'Download',lock:'Downloads are for Premium members ⭐',ok:'Downloading…',yrs:'yrs',none:'No lyrics available for this song.',tr:'Automatically translated',orig:'Show original',tra:'Show translation',trg:'Translating…',empty:'Songs are coming soon',err:'Unable to load songs'},
    es:{pl:'Lista de cantos',cnt:'cantos',cnt1:'canto',comp:'Compositor',lyr:'Letra',dl:'Descargar',lock:'Las descargas son para miembros Premium ⭐',ok:'Descargando…',yrs:'años',none:'No hay letra disponible para este canto.',tr:'Traducido automáticamente',orig:'Ver original',tra:'Ver traducción',trg:'Traduciendo…',empty:'Los cantos llegan pronto',err:'No se pudieron cargar los cantos'},
    pt:{pl:'Lista de cânticos',cnt:'cânticos',cnt1:'cântico',comp:'Compositor',lyr:'Letra',dl:'Baixar',lock:'Downloads só para membros Premium ⭐',ok:'A transferir…',yrs:'anos',none:'Letra indisponível para este cântico.',tr:'Traduzido automaticamente',orig:'Ver original',tra:'Ver tradução',trg:'A traduzir…',empty:'Os cânticos chegam em breve',err:'Não foi possível carregar os cânticos'},
    it:{pl:'Elenco dei canti',cnt:'canti',cnt1:'canto',comp:'Compositore',lyr:'Testo',dl:'Scarica',lock:'I download sono riservati ai membri Premium ⭐',ok:'Download…',yrs:'anni',none:'Testo non disponibile per questo canto.',tr:'Tradotto automaticamente',orig:'Mostra originale',tra:'Mostra traduzione',trg:'Traduzione…',empty:'I canti arrivano presto',err:'Impossibile caricare i canti'},
    de:{pl:'Liederliste',cnt:'Lieder',cnt1:'Lied',comp:'Komponist',lyr:'Text',dl:'Herunterladen',lock:'Downloads sind Premium-Mitgliedern vorbehalten ⭐',ok:'Wird geladen…',yrs:'J.',none:'Kein Text für dieses Lied verfügbar.',tr:'Automatisch übersetzt',orig:'Original zeigen',tra:'Übersetzung zeigen',trg:'Übersetzung…',empty:'Lieder kommen bald',err:'Lieder konnten nicht geladen werden'},
    ar:{pl:'قائمة الترانيم',cnt:'ترانيم',cnt1:'ترنيمة',comp:'الملحّن',lyr:'الكلمات',dl:'تحميل',lock:'التحميل مخصص لأعضاء بريميوم ⭐',ok:'جارٍ التحميل…',yrs:'سنة',none:'لا توجد كلمات لهذه الترنيمة.',tr:'ترجمة تلقائية',orig:'عرض الأصل',tra:'عرض الترجمة',trg:'جارٍ الترجمة…',empty:'الترانيم قادمة قريبًا',err:'تعذر تحميل الترانيم'},
    zh:{pl:'歌曲列表',cnt:'首歌曲',cnt1:'首歌曲',comp:'作曲',lyr:'歌词',dl:'下载',lock:'仅限高级会员下载 ⭐',ok:'下载中…',yrs:'岁',none:'这首歌暂无歌词。',tr:'自动翻译',orig:'查看原文',tra:'查看翻译',trg:'翻译中…',empty:'歌曲即将上线',err:'无法加载歌曲'},
    nl:{pl:'Lijst met liederen',cnt:'liederen',cnt1:'lied',comp:'Componist',lyr:'Tekst',dl:'Downloaden',lock:'Downloads zijn voor Premium-leden ⭐',ok:'Downloaden…',yrs:'jr',none:'Geen tekst beschikbaar voor dit lied.',tr:'Automatisch vertaald',orig:'Origineel tonen',tra:'Vertaling tonen',trg:'Vertalen…',empty:'Liederen komen binnenkort',err:'Liederen laden mislukt'},
    ru:{pl:'Список песен',cnt:'песен',cnt1:'песня',comp:'Композитор',lyr:'Текст',dl:'Скачать',lock:'Скачивание только для Premium ⭐',ok:'Загрузка…',yrs:'лет',none:'Для этой песни нет текста.',tr:'Автоперевод',orig:'Показать оригинал',tra:'Показать перевод',trg:'Перевод…',empty:'Песни скоро появятся',err:'Не удалось загрузить песни'}
  };

  /* ---------- utilitaires ---------- */
  function $(i){return document.getElementById(i);}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function sb(){try{if(typeof supabaseClient!=='undefined'&&supabaseClient)return supabaseClient;var pc=null;try{pc=window.parent.supabaseClient;}catch(e){}if(pc)return pc;if(window.supabase&&window.supabase.createClient){window.__nlj_sb=window.__nlj_sb||window.supabase.createClient('https://qxxhbfoqlreiqyshbpqp.supabase.co','sb_publishable_OK9ncVWB2Ih8xZ5fzqEQWg_mSV6vCoe');return window.__nlj_sb;}}catch(e){}return null;}function rd(){try{if(window.__nlj_rd)return window.__nlj_rd;if(window.supabase&&window.supabase.createClient){window.__nlj_rd=window.supabase.createClient('https://qxxhbfoqlreiqyshbpqp.supabase.co','sb_publishable_OK9ncVWB2Ih8xZ5fzqEQWg_mSV6vCoe',{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false,storageKey:'nlj-public-read'}});return window.__nlj_rd;}}catch(e){}return sb();}
  function toast(m){try{showToast(m);}catch(e){}}
  function lang(){var l='fr';try{l=(($('langSelect')||{}).value||localStorage.getItem('niamke_lang')||'fr').toLowerCase();}catch(e){}return UI[l]?l:'fr';}
  function L(){return UI[lang()];}
  function premium(){return !!(window.NLJ&&window.NLJ.premium);}
  function fmt(s){s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2);}
  function pick(o,keys){for(var i=0;i<keys.length;i++){if(o[keys[i]]!=null&&o[keys[i]]!=='')return o[keys[i]];}return '';}

  /* ---------- état ---------- */
  var TR=[],cur=0,playing=false,err='',audio=(function(){var v=document.createElement('video');v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.preload='metadata';v.controls=false;return v;})(),showOrig=false,trKey='',trLines=null,lyrTok=0;
  audio.preload='none';

  /* ---------- paroles ---------- */
  function parseLyrics(raw){
    if(!raw)return [];
    if(Array.isArray(raw))raw=raw.join('\n');
    var out=[];String(raw).split(/\r?\n/).forEach(function(l){
      l=l.trim();if(!l)return;
      var m=l.match(/^\[(\d+):(\d+(?:\.\d+)?)\]\s*(.*)$/);
      if(m){if(m[3])out.push({t:(+m[1])*60+parseFloat(m[2]),x:m[3]});}else out.push({t:null,x:l});
    });
    return out;
  }
  function translateLine(text,src,tgt){var mm='https://api.mymemory.translated.net/get?q='+encodeURIComponent(text)+'&langpair='+encodeURIComponent((src||'fr')+'|'+tgt);return fetch(mm).then(function(r){return r.json();}).then(function(j){var t=j&&j.responseData&&j.responseData.translatedText;if(j&&+j.responseStatus===200&&t&&!/MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(t))return t;throw 0;}).catch(function(){var g='https://translate.googleapis.com/translate_a/single?client=gtx&sl='+encodeURIComponent(src||'auto')+'&tl='+encodeURIComponent(tgt)+'&dt=t&q='+encodeURIComponent(text);return fetch(g).then(function(r){return r.json();}).then(function(j){return (j[0]||[]).map(function(x){return x[0];}).join('')||text;}).catch(function(){return text;});});}
  function trTitle(k){var src=MT[k.lang]||k.lang||'fr',tgt=MT[lang()]||lang();k.ttl='';if(src===tgt){renderPlayer();renderList();return;}var ck='nlj_tt_'+k.id+'_'+src+'_'+tgt,c=null;try{c=localStorage.getItem(ck);}catch(e){}if(c){k.ttl=c;renderPlayer();renderList();return;}translateLine(k.title,src,tgt).then(function(t){if(tgt!==(MT[lang()]||lang()))return;k.ttl=t;try{if(t!==k.title)localStorage.setItem(ck,t);}catch(e){}renderPlayer();renderList();});}
  async function translateAll(track,tgtLang){
    var src=MT[track.lang]||track.lang||'fr',tgt=MT[tgtLang]||tgtLang;
    if(src===tgt)return null;
    var pbL=track.lyrBy&&track.lyrBy[tgtLang];if(pbL){var pl=parseLyrics(pbL).map(function(x){return x.x;});if(pl.length===track.lyrics.length)return pl;}
    var ck='nlj_tr_'+track.id+'_'+src+'_'+tgt,cached=null;
    try{cached=JSON.parse(localStorage.getItem(ck)||'null');}catch(e){}
    if(cached&&cached.length===track.lyrics.length)return cached;
    var res=[];
    for(var i=0;i<track.lyrics.length;i+=6){
      var chunk=track.lyrics.slice(i,i+6);
      var part=await Promise.all(chunk.map(function(l){return translateLine(l.x,src,tgt);}));
      res=res.concat(part);
    }
    try{if(res.some(function(x,i){return x!==track.lyrics[i].x;}))localStorage.setItem(ck,JSON.stringify(res));}catch(e){}
    return res;
  }
  var TSM={fr:'Transcription du chant en cours…',en:'Transcribing the song…',es:'Transcribiendo el canto…',pt:'A transcrever o cântico…',it:'Trascrizione del canto…',de:'Das Lied wird transkribiert…',ar:'جارٍ تفريغ الترنيمة…',zh:'正在转写歌词…',nl:'Lied wordt getranscribeerd…',ru:'Распознавание текста песни…'};
  var AUTO_TS=false;var WL={fr:'french',en:'english',es:'spanish',pt:'portuguese',it:'italian',de:'german',ar:'arabic',zh:'chinese',nl:'dutch',ru:'russian'};
  function needTs(k){return AUTO_TS&&!!k&&!k.lyrics.length&&!k.tsBusy&&!k.tsDone&&(k.lang||'fr')!==lang();}
  function wfn(){var p=null;self.onmessage=async function(e){try{if(!p){var m=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2');p=await m.pipeline('automatic-speech-recognition','Xenova/whisper-base');}var r=await p(e.data.a,{language:e.data.l,task:'transcribe',chunk_length_s:30,stride_length_s:5,return_timestamps:true});self.postMessage({ok:r.chunks||[{text:r.text,timestamp:[0]}]});}catch(err){self.postMessage({err:String(err)});}};}
  async function transcribe(k,force){
    if(!force&&!needTs(k))return;
    if(k.tsBusy)return;
    var ck='nlj_ts_'+k.id,c=null;try{c=JSON.parse(localStorage.getItem(ck)||'null');}catch(e){}
    if(c&&c.length){k.lyrics=c;trKey='';loadLyrics();return;}
    k.tsBusy=1;k.tsMsg=TSM[lang()]||TSM.en;renderLyrics();
    try{
      var buf=await (await fetch(k.url)).arrayBuffer();
      var ac=new (window.AudioContext||window.webkitAudioContext)({sampleRate:16000});
      var dec=await ac.decodeAudioData(buf);var a=dec.getChannelData(0);try{ac.close();}catch(e){}
      var w=new Worker(URL.createObjectURL(new Blob(['('+wfn+')()'],{type:'text/javascript'})),{type:'module'});
      var r=await new Promise(function(ok,ko){w.onmessage=function(e){if(e.data.ok)ok(e.data.ok);else if(e.data.err)ko(new Error(e.data.err));};w.onerror=function(){ko(new Error('worker'));};w.postMessage({a:a,l:WL[k.tsLang||k.lang||'fr']||'french'});});
      w.terminate();
      var ls=[];r.forEach(function(ch){var x=String(ch.text||'').trim();if(x)ls.push({t:(ch.timestamp&&ch.timestamp[0]!=null)?ch.timestamp[0]:null,x:x});});
      if(ls.length){k.lyrics=ls;try{localStorage.setItem(ck,JSON.stringify(ls));}catch(e){}
        if(k.tsLang){k.lang=k.tsLang;}
        if(window.NLJ&&window.NLJ.admin){try{var NL=String.fromCharCode(10),raw2=ls.map(function(l){return (l.t!=null?'['+Math.floor(l.t/60)+':'+(l.t%60).toFixed(2).padStart(5,'0')+'] ':'')+l.x;}).join(NL),cc=sb();
          if(cc&&k.id&&!/^https?:/i.test(String(k.id))){var rr=await cc.from('musiques').update({lyrics:raw2,lang:k.lang||'fr'}).eq('id',k.id).select('id');if(rr&&rr.data&&rr.data.length){k.raw=raw2;toast('✅ Paroles enregistrées pour tous les membres');}}}catch(e){}}
      }
    }catch(e){}
    k.tsBusy=0;k.tsDone=1;k.tsMsg='';trKey='';
    if(TR[cur]===k)loadLyrics();else renderLyrics();
  }
  audio.addEventListener('play',function(){var k=TR[cur];if(needTs(k))transcribe(k);});
  var admEd=false,admKey='';
  function admBar(){var b=$('mzAdm'),k=TR[cur];if(!b)return;var ok=!!(window.NLJ&&window.NLJ.admin)&&!!k;if(admEd&&ok)return;var key=(ok?k.id:'')+'|'+ok;if(key===admKey)return;admKey=key;
    if(!ok){b.innerHTML='';return;}
    b.innerHTML='<button type=button id=mzAdmOpen style="margin-top:10px;padding:9px 16px;border-radius:999px;border:1px solid #c9a227;background:#fffdf6;color:#7a5b00;font-weight:700;cursor:pointer">✏️ Modifier les paroles (administrateur)</button>';
    $('mzAdmOpen').onclick=admOpen;}
  function admOpen(){var k=TR[cur],b=$('mzAdm');if(!k||!b)return;admEd=true;
    var raw=k.raw==null?'':(Array.isArray(k.raw)?k.raw.join(String.fromCharCode(10)):String(k.raw));
    var lg=(k.lang||'fr').slice(0,2),names={fr:'Français',en:'English',es:'Español',pt:'Português',it:'Italiano',de:'Deutsch',ar:'العربية',zh:'中文',nl:'Nederlands',ru:'Русский'};
    var opts=Object.keys(names).map(function(c){return '<option value='+c+(c===lg?' selected':'')+'>'+names[c]+'</option>';}).join('');
    b.innerHTML='<div style="margin-top:12px;padding:14px;border:1px solid #e5d9a8;border-radius:14px;background:#fffdf6">'
     +'<div style="font-weight:800;margin-bottom:6px">✏️ Paroles de : '+esc(k.title)+'</div>'
     +'<div style="font-size:.8rem;color:#6b7280;margin-bottom:8px">Une ligne par phrase. Format conseillé avec temps : [0:12.50] texte de la ligne. Sans temps, les lignes défilent automatiquement.</div>'
     +'<textarea id=mzAdmTx rows=12 style="width:100%;box-sizing:border-box;font-family:ui-monospace,Menlo,monospace;font-size:.85rem;padding:10px;border:1px solid #d6d3d1;border-radius:10px"></textarea>'
     +'<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px"><label style="font-weight:700">Langue du chant : <select id=mzAdmLg style="padding:6px;border-radius:8px">'+opts+'</select></label>'
     +'<button type=button id=mzAdmSave style="padding:9px 18px;border-radius:999px;border:0;background:#c9a227;color:#1b1400;font-weight:800;cursor:pointer">Enregistrer</button>'
     +'<button type=button id=mzAdmCancel style="padding:9px 18px;border-radius:999px;border:1px solid #d6d3d1;background:#fff;cursor:pointer">Annuler</button>'
     +'<span id=mzAdmSt style="font-weight:700"></span></div></div>';
    $('mzAdmTx').value=raw;$('mzAdmCancel').onclick=function(){admEd=false;admKey='';admBar();};$('mzAdmSave').onclick=admSave;}
  async function admSave(){var k=TR[cur],st=$('mzAdmSt'),c=sb();if(!k||!c){return;}
    var txt=$('mzAdmTx').value.trim(),lg=$('mzAdmLg').value;st.style.color='#374151';st.textContent='Enregistrement…';
    if(!k.id||/^https?:/i.test(String(k.id))){st.style.color='#b91c1c';st.textContent='Ce chant n a pas d identifiant en base : impossible d enregistrer.';return;}
    try{var r=await c.from('musiques').update({lyrics:txt,lang:lg}).eq('id',k.id).select('id');
      if(r.error)throw r.error;
      if(!r.data||!r.data.length)throw new Error('refusé : exécute paroles_admin.sql dans Supabase');
      k.raw=txt;k.lyrics=parseLyrics(txt);k.lang=lg;k.tsDone=1;
      try{Object.keys(localStorage).forEach(function(x){if(x.indexOf('nlj_tr_'+k.id+'_')===0||x==='nlj_ts_'+k.id)localStorage.removeItem(x);});}catch(e){}
      admEd=false;admKey='';trKey='';trLines=null;loadLyrics();admBar();toast('✅ Paroles enregistrées');
    }catch(e){st.style.color='#b91c1c';st.textContent='Erreur : '+((e&&e.message)||e);}}
  var GEN={fr:['Générer les paroles (IA)','Chant en :'],en:['Generate lyrics (AI)','Song language:'],es:['Generar letra (IA)','Idioma del canto:'],pt:['Gerar letra (IA)','Idioma do cântico:'],it:['Genera testo (IA)','Lingua del canto:'],de:['Text erzeugen (KI)','Sprache des Liedes:'],ar:['إنشاء الكلمات (ذكاء اصطناعي)','لغة الترنيمة:'],zh:['生成歌词（AI）','歌曲语言：'],nl:['Tekst genereren (AI)','Taal van het lied:'],ru:['Создать текст (ИИ)','Язык песни:']};
  var LNAMES={fr:'Français',en:'English',es:'Español',pt:'Português',it:'Italiano',de:'Deutsch',ar:'العربية',zh:'中文',nl:'Nederlands',ru:'Русский'};
  function genUi(k){var g=GEN[lang()]||GEN.en,cl=(k.lang||'fr').slice(0,2);
    return '<div class="mz-gen" translate="no" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center;margin-top:10px"><label style="font-size:.85rem;font-weight:600">'+esc(g[1])+' <select id="mzGenLg" style="padding:6px;border-radius:8px">'+Object.keys(LNAMES).map(function(c){return '<option value="'+c+'"'+(c===cl?' selected':'')+'>'+LNAMES[c]+'</option>';}).join('')+'</select></label><button type="button" id="mzGen" style="padding:9px 16px;border-radius:999px;border:0;background:#c9a227;color:#1b1400;font-weight:800;cursor:pointer">🎤 '+esc(g[0])+'</button></div>';}
  document.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('#mzGen');if(!b)return;var k=TR[cur];if(!k)return;var sl=$('mzGenLg');k.tsLang=sl?sl.value:(k.lang||'fr');k.tsDone=0;transcribe(k,true);});
  function loadLyrics(){
    var k=TR[cur];if(!k)return;
    var key=k.id+'|'+lang(),tok=++lyrTok;
    if(key===trKey){renderLyrics();return;}
    trKey=key;trLines=null;
    renderLyrics(true);trTitle(k);
    if(!k.lyrics.length){if(playing)transcribe(k);return;}
    translateAll(k,lang()).then(function(r){if(tok!==lyrTok)return;trLines=r;renderLyrics();});
  }
  function lyricIdx(k,t){
    var n=k.lyrics.length;if(!n)return -1;
    if(k.lyrics[0].t!=null){var ix=0;for(var i=0;i<n;i++){if(k.lyrics[i].t!=null&&k.lyrics[i].t<=t)ix=i;}return ix;}
    var d=audio.duration||k.dur||0;if(!d)return 0;return Math.min(n-1,Math.floor(t/d*n));
  }
  function renderLyrics(loading){
    var box=$('mzLyBox'),note=$('mzLyNote');if(!box)return;
    var k=TR[cur],T=L();admBar();
    $('mzLyTitle').textContent=T.lyr;
    if(!k||!k.lyrics.length){box.innerHTML='<div class="mz-lyr-empty">'+esc((k&&k.tsMsg)||T.none)+'</div>'+((k&&!k.tsBusy)?genUi(k):'');note.innerHTML='';return;}
    var nat=k.lyrBy&&k.lyrBy[lang()]&&(k.lang||'fr')!==lang()?parseLyrics(k.lyrBy[lang()]):null;
    if(nat&&nat.length&&nat.length!==k.lyrics.length&&!showOrig){box.innerHTML=nat.map(function(l){return '<p>'+esc(l.x)+'</p>';}).join('');note.innerHTML='<button type="button" class="mz-orig" id="mzOrig">'+esc(T.orig)+'</button>';return;}
    var useTr=!showOrig&&trLines&&trLines.length===k.lyrics.length;
    var idx=playing?lyricIdx(k,audio.currentTime):-1;
    box.innerHTML=k.lyrics.map(function(l,i){return '<p class="'+(i===idx?'on':'')+'">'+esc(useTr?trLines[i]:l.x)+'</p>';}).join('');
    if(loading&&MT[k.lang]!==MT[lang()]&&(k.lang||'fr')!==lang()){note.innerHTML='<span class="mz-lyr-note">'+esc(T.trg)+'</span>';}
    else if(trLines){note.innerHTML='<span class="mz-lyr-note">'+esc(T.tr)+' ('+esc(k.lang)+' → '+esc(lang())+')</span> <button type="button" class="mz-orig" id="mzOrig">'+esc(showOrig?T.tra:T.orig)+'</button>';}
    else note.innerHTML=(nat&&nat.length&&showOrig)?'<button type="button" class="mz-orig" id="mzOrig">'+esc(T.tra)+'</button>':'';
    var on=box.querySelector('p.on');if(on){box.scrollTop=on.offsetTop-box.clientHeight/2+on.clientHeight/2;}
  }

  /* ---------- rendu ---------- */
  function chips(k){
    var h='';
    if(k.country)h+='<span class="mz-chip">🌍 '+esc(k.country)+'</span>';
    if(k.city)h+='<span class="mz-chip">📍 '+esc(k.city)+'</span>';
    if(k.age)h+='<span class="mz-chip">'+esc(k.age)+' '+esc(L().yrs)+'</span>';
    return h;
  }
  function shell(){
    var a=$('mzApp');if(!a||$('mzPl'))return;
    a.innerHTML=
    '<div class="mz-player" id="mzPl"><div class="mz-cover" id="mzCover">🎶</div><div>'+
      '<div class="mz-nt" id="mzNt">—</div><div class="mz-nm" id="mzNm"></div>'+
      '<div class="mz-bar" id="mzBar"><b id="mzFill"></b></div>'+
      '<div class="mz-times"><span id="mzTc">0:00</span><span id="mzTd">0:00</span></div>'+
      '<div class="mz-ctr"><button type="button" id="mzPrev" aria-label="Précédent">⏮</button><button type="button" class="mz-play" id="mzPp" aria-label="Lecture">▶</button><button type="button" id="mzNext" aria-label="Suivant">⏭</button>'+
      '<input type="range" id="mzVol" min="0" max="1" step="0.05" value="0.8" aria-label="Volume"><button type="button" class="mz-dl" id="mzDl"></button></div>'+
    '</div></div>'+
    '<details class="mz-lyr" open><summary><span>🎤</span><span id="mzLyTitle">Paroles</span><span id="mzLyNote"></span><span class="mz-chev">▾</span></summary><div class="mz-lyr-box" id="mzLyBox"></div></details><div id=mzAdm></div>'+
    '<div class="mz-list" id="mzList"></div>';
    $('mzPp').onclick=function(){playing?pause():play();};
    $('mzPrev').onclick=function(){go(-1);};$('mzNext').onclick=function(){go(1);};
    $('mzVol').oninput=function(){audio.volume=+this.value;};audio.volume=.8;
    $('mzBar').onclick=function(e){var r=this.getBoundingClientRect();if(audio.duration)audio.currentTime=(e.clientX-r.left)/r.width*audio.duration;};
    $('mzDl').onclick=function(){download(TR[cur]);};
    $('mzList').onclick=function(e){
      var d=e.target.closest('[data-dl]');if(d){e.stopPropagation();download(TR[+d.getAttribute('data-dl')]);return;}
      var r=e.target.closest('.mz-row');if(!r)return;var i=+r.getAttribute('data-i');
      /* Chant choisi : le déroulant de l'artiste se referme tout seul (sauf si on met simplement en pause le chant en cours) */
      var g=r.closest('details.mz-grp'),gi=g?+g.getAttribute('data-g'):-1,keep=(i===cur&&playing);
      if(!keep&&gi>-1&&GN[gi]!==undefined){OPEN[GN[gi]]=false;g.open=false;}
      if(i===cur){playing?pause():play();}else{load(i);play();}
      if(!keep){var pl=$('mzPl');if(pl&&pl.getBoundingClientRect().top<0){try{pl.scrollIntoView({behavior:'smooth',block:'nearest'});}catch(x){}}}
    };
    /* Dès qu'une lecture démarre (ligne, bouton lecture, suivant/précédent), tous les déroulants de la liste se referment */
    audio.addEventListener('play',function(){try{var l=$('mzList');if(!l)return;l.querySelectorAll('details.mz-grp[open]').forEach(function(d){var gi=+d.getAttribute('data-g');if(GN[gi]!==undefined)OPEN[GN[gi]]=false;d.open=false;});}catch(x){}});
    $('mzList').addEventListener('toggle',function(e){var d=e.target;if(d&&d.getAttribute&&d.getAttribute('data-g')!==null){OPEN[GN[+d.getAttribute('data-g')]]=d.open;}},true);$('mzList').onkeydown=function(e){if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('mz-row')){e.preventDefault();e.target.click();}};
    $('mzLyNote').onclick=function(e){if(e.target.id==='mzOrig'){e.preventDefault();showOrig=!showOrig;renderLyrics();}};
  }
  var HT={fr:['Touchez un nom pour ouvrir et écouter ses chants','Voir les chants','Fermer'],en:['Tap a name to open and listen to their songs','View songs','Close'],es:['Toca un nombre para abrir y escuchar sus cantos','Ver cantos','Cerrar'],pt:['Toque num nome para abrir e ouvir os cânticos','Ver cânticos','Fechar'],it:['Tocca un nome per aprire e ascoltare i canti','Vedi canti','Chiudi'],de:['Namen antippen, um die Lieder zu öffnen und zu hören','Lieder ansehen','Schließen'],ar:['المس اسمًا لفتح ترانيمه والاستماع إليها','عرض الترانيم','إغلاق'],zh:['点击名字即可打开并收听他的歌曲','查看歌曲','关闭'],nl:['Tik op een naam om de liederen te openen en te beluisteren','Liederen bekijken','Sluiten'],ru:['Нажмите на имя, чтобы открыть и послушать песни','Показать песни','Закрыть']};var OPEN={},GN=[];function renderList(){var l=$('mzList');if(!l)return;var T=L();var head='<div class=mz-lh>'+esc(T.pl)+'<span>'+TR.length+' '+esc(TR.length>1?T.cnt:T.cnt1)+'</span></div><div class=mz-hint>👆 '+(HT[lang()]||HT.fr)[0]+'</div>';var groups=[],map={};GN=[];TR.forEach(function(k,i){var n=k.artist||'';if(!map.hasOwnProperty(n)){map[n]={name:n,items:[]};groups.push(map[n]);}map[n].items.push(i);});l.innerHTML=head+groups.map(function(g,gi){GN[gi]=g.name;var hasCur=g.items.indexOf(cur)>-1;var open=OPEN.hasOwnProperty(g.name)?OPEN[g.name]:(hasCur||groups.length===1);var rows=g.items.map(function(i,j){var k=TR[i],isCur=(i===cur),on=isCur&&playing,ch=chips(k),d=k.dur?fmt(k.dur):'',ttl=esc(k.ttl||k.title);return '<div class=\"mz-row'+(isCur?' cur':'')+(on?' on':'')+'\" data-i='+i+' role=button tabindex=0 aria-label=\"'+ttl+'\">'+'<span class=mz-n><span class=mz-num>'+(j+1)+'</span><span class=mz-pl aria-hidden=true>▶</span><span class=mz-eq aria-hidden=true><i></i><i></i><i></i></span></span>'+'<div class=mz-main><div class=mz-t>'+ttl+'</div><div class=mz-a><span class=mz-role>'+esc(T.comp)+'</span><span class=mz-name>'+esc(k.artist)+'</span></div></div>'+(ch?'<div class=mz-who>'+ch+'</div>':'')+(d?'<span class=mz-dur>'+d+'</span>':'')+'<button type=button class=\"mz-rdl'+(premium()?'':' locked')+'\" data-dl='+i+' title=\"'+esc(premium()?T.dl:T.lock)+'\" aria-label=\"'+esc(premium()?T.dl:T.lock)+'\">'+(premium()?ICO_DL:ICO_LOCK)+'</button></div>';}).join('');return '<details class=mz-grp data-g='+gi+(open?' open':'')+'><summary><span class=mz-gi>🎙</span><span class=mz-gn>'+esc(g.name)+'</span><span class=mz-gc>🎵 '+g.items.length+' '+esc(g.items.length>1?T.cnt:T.cnt1)+'</span><span class=mz-btn><span class=mz-bo>'+(HT[lang()]||HT.fr)[1]+'</span><span class=mz-bc>'+(HT[lang()]||HT.fr)[2]+'</span><span class=mz-chev>▾</span></span></summary>'+rows+'</details>';}).join('');if(window.NLJ_NAVM)window.NLJ_NAVM();}  function renderPlayer(){
    var k=TR[cur];if(!k)return;
    $('mzNt').textContent=k.ttl||k.title;
    $('mzNm').innerHTML=(k.artist?'<span class="mz-chip">🎙 '+esc(k.artist)+'</span>':'')+chips(k);
    $('mzTd').textContent=fmt(audio.duration||k.dur);
    $('mzPp').textContent=playing?'⏸':'▶';
    $('mzPl').className='mz-player'+(playing?' playing':'')+(audio.videoWidth>0?' mz-hasvid':'');
    var d=$('mzDl');d.innerHTML=(premium()?ICO_DL:ICO_LOCK)+' '+esc(L().dl);d.className='mz-dl'+(premium()?'':' locked');
    var cv=$('mzCover');
    if(audio.videoWidth>0){if(audio.parentNode!==cv){cv.innerHTML='';cv.appendChild(audio);}cv.classList.add('mz-vid');}
    else{cv.classList.remove('mz-vid');cv.innerHTML=k.cover?'<img src="'+esc(k.cover)+'" alt="">':'🎶';}
  }
  function render(){
    var a=$('mzApp');if(!a)return;
    if(!TR.length){
      a.innerHTML='<div class="empty-state"><div class="es-icon">🎵</div><h3>'+esc(err?L().err:L().empty)+'</h3>'+(err?'<p>'+esc(err)+'</p>':'<blockquote>« Que tout ce qui respire loue l\'Éternel ! »<cite>Psaume 150:6</cite></blockquote>')+'</div>';
      return;
    }
    shell();renderPlayer();renderList();renderLyrics();
  }
  function refresh(){if(TR.length&&$('mzPl')){renderPlayer();renderList();}}

  /* ---------- lecture ---------- */
  function load(i){
    cur=i;var k=TR[i];audio.pause();audio.src=k.url;audio.load();
    $('mzFill').style.width='0%';$('mzTc').textContent='0:00';
    showOrig=false;trKey='';renderPlayer();renderList();loadLyrics();
  }
  function play(){var p=audio.play();if(p&&p.catch)p.catch(function(){});}
  function pause(){audio.pause();}
  function go(d){var w=playing;load((cur+d+TR.length)%TR.length);if(w)play();}
  audio.addEventListener('play',function(){playing=true;renderPlayer();renderList();});
  audio.addEventListener('pause',function(){playing=false;renderPlayer();renderList();renderLyrics();});
  audio.addEventListener('ended',function(){go(1);});
  audio.addEventListener('loadedmetadata',function(){if($('mzTd'))$('mzTd').textContent=fmt(audio.duration);if($('mzPl')&&audio.videoWidth>0)renderPlayer();});
  audio.addEventListener('click',function(){if(audio.parentNode)playing?pause():play();});
  audio.addEventListener('timeupdate',function(){
    if(!$('mzFill'))return;var d=audio.duration||0;
    $('mzFill').style.width=(d?audio.currentTime/d*100:0)+'%';$('mzTc').textContent=fmt(audio.currentTime);
    var k=TR[cur];if(k&&k.lyrics.length){var ix=lyricIdx(k,audio.currentTime),box=$('mzLyBox'),ps=box&&box.children;
      if(ps&&ps[ix]&&ps[ix].className!=='on'){for(var i=0;i<ps.length;i++)ps[i].className=(i===ix?'on':'');box.scrollTop=ps[ix].offsetTop-box.clientHeight/2+ps[ix].clientHeight/2;}}
  });

  /* ---------- téléchargement : Premium uniquement ---------- */
  async function download(k){
    if(!k)return;
    if(!premium()){toast(L().lock);return;}
    toast(L().ok);
    var name=(k.title||'chant').replace(/[\\\/:*?"<>|]+/g,' ').trim()+'.mp3';
    try{
      var r=await fetch(k.url);if(!r.ok)throw new Error('http');
      var b=await r.blob(),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();a.remove();
      setTimeout(function(){URL.revokeObjectURL(a.href);},5000);
    }catch(e){window.open(k.url,'_blank');}
  }


  /* ---------- présentation propre des titres et compositeurs ---------- */
  var ICO_LOCK='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-7-2a2 2 0 0 1 4 0v2h-4V7z"/></svg>';
  var ICO_DL='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/></svg>';
  var BRAND='Niamké Love Jésus';
  var PROPER={dieu:'Dieu','jésus':'Jésus',jesus:'Jésus',christ:'Christ',seigneur:'Seigneur','éternel':'Éternel',eternel:'Éternel',esprit:'Esprit','père':'Père',saint:'Saint','niamké':'Niamké',niamke:'Niamké',love:'Love'};
  function cleanTitle(t){
    t=String(t==null?'':t).replace(/\s+/g,' ').trim();
    t=t.replace(/\.(mp3|wav|m4a|aac|ogg|oga|flac|wma|webm)$/i,'').trim();
    if(t.indexOf('_')>-1&&t.indexOf(' ')<0)t=t.replace(/_+/g,' ').trim();
    var letters=t.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g,'');
    if(letters.length>3&&letters===letters.toUpperCase()){
      t=t.toLowerCase().replace(/(^|[\s'’\-])([a-zà-ÿ]+)/g,function(m,sep,w){return sep+(PROPER[w]||w);});
      t=t.charAt(0).toUpperCase()+t.slice(1);
    }
    return t||'Chant pour Jésus';
  }
  function cleanArtist(a){
    a=String(a==null?'':a).replace(/\s+/g,' ').trim();
    a=a.replace(/^(?:(?:h?auteure?|compositeur|compositrice|composé(?:e)? par|compose par|interpr[eè]te|chanté(?:e)? par|artiste|par)\b\s*[:\-–—]?\s*)+/i,'').trim();
    a=a.replace(/niamk[eé]\s+love\s+j[eé]sus/ig,BRAND);
    return a||BRAND;
  }

  /* ---------- chargement des chants ---------- */
  async function loadSongs(){
    var c=sb();if(!c){render();return;}
    try{
      var r=await c.from('musiques').select('*').order('created_at',{ascending:false}).limit(300);
      if(r.error)throw r.error;
      var rows=(r.data||[]).filter(function(s){return s&&pick(s,['url','storage_path','file_path','path','file','file_url','audio_url','audio']);});
      /* infos membre (pays, âge, ville) */
      var ids=[];rows.forEach(function(s){var u=pick(s,['user_id','uploader_id','owner_id','profile_id','created_by','member_id']);if(u&&ids.indexOf(u)<0)ids.push(u);});
      var byUser={},byId={};
      if(ids.length){
        try{var p1=await c.from('profiles').select('id,user_id,name,last_name,age,city,country').in('user_id',ids);(p1.data||[]).forEach(function(p){byUser[p.user_id]=p;});}catch(e){}
        try{var p2=await c.from('profiles').select('id,user_id,name,last_name,age,city,country').in('id',ids);(p2.data||[]).forEach(function(p){byId[p.id]=p;});}catch(e){}
      }
      var parBy={};
      try{var pr=await c.from('paroles').select('musique_id,langue,texte');(pr.data||[]).forEach(function(x){var m=x.musique_id;(parBy[m]=parBy[m]||{})[String(x.langue||'').toLowerCase().slice(0,2)]=x.texte;});}catch(e){}
      TR=await Promise.all(rows.map(async function(s){
        var v=pick(s,['url','storage_path','file_path','path','file','file_url','audio_url','audio']),u=v;
        if(!/^https?:/i.test(v)){
          try{var sg=await c.storage.from('musiques').createSignedUrl(v,3600);u=sg&&sg.data&&sg.data.signedUrl;}catch(e){}
          if(!u){try{u=c.storage.from('musiques').getPublicUrl(v).data.publicUrl;}catch(e){}}
        }
        var uid=pick(s,['user_id','uploader_id','owner_id','profile_id','created_by','member_id']),p=byUser[uid]||byId[uid]||{};
        var pname=((p.name||'')+' '+(p.last_name||'')).trim();
        var rawL=pick(s,['lyrics','paroles','lyrics_text','texte']),pb=parBy[s.id]||{},LG0=String(pick(s,['lang','langue','language'])||'fr').toLowerCase().slice(0,2);
        if(!rawL){var kk=pb[LG0]?LG0:Object.keys(pb)[0];if(kk){rawL=pb[kk];LG0=kk;}}
        return {
          id:s.id||u,url:u,cover:s.image_url||'',
          title:cleanTitle(s.title||s.titre),
          artist:cleanArtist(pick(s,['artist','artiste','compositeur','composer','auteur','author'])||pname),
          age:pick(s,['age'])||p.age||'',
          city:pick(s,['city','ville'])||p.city||'',
          country:pick(s,['country','pays'])||p.country||'',
          lang:LG0,
          raw:rawL||'',lyrics:parseLyrics(rawL),lyrBy:pb,
          dur:+s.duration||0
        };
      }));
      TR=TR.filter(function(k){return k.url;});TR.sort(function(a,b){return String(a.artist).localeCompare(String(b.artist),'fr',{sensitivity:'base'});});
      err='';
    }catch(e){err=(e&&e.message)||String(e);TR=[];}
    cur=0;render();
    if(TR.length){audio.src=TR[0].url;loadLyrics();}
  }

  window.NLJ_MUSIC={load:loadSongs,render:render,refresh:refresh};(function(){var P=null,A=null,NG=[];var FULL={fr:'Ouvrir le lecteur complet',en:'Open the full player',es:'Abrir el reproductor completo',pt:'Abrir o leitor completo',it:'Apri il lettore completo',de:'Kompletten Player öffnen',ar:'فتح المشغل الكامل',zh:'打开完整播放器',nl:'Volledige speler openen',ru:'Открыть полный плеер'};function place(){if(!A||!P||P.hidden)return;var r=A.getBoundingClientRect(),w=Math.min(380,window.innerWidth-16);var left=Math.max(8,Math.min(r.left+r.width/2-w/2,window.innerWidth-w-8));P.style.width=w+'px';P.style.left=left+'px';P.style.top=(r.bottom+8)+'px';P.style.maxHeight=Math.max(220,window.innerHeight-r.bottom-24)+'px';}function fill(){if(!P)return;var T=L(),h=HT[lang()]||HT.fr;if(!TR.length){P.innerHTML='<div class=nm-h>🎵 '+esc(T.empty)+'</div>';return;}var groups=[],map={};NG=[];TR.forEach(function(k,i){var n=k.artist||'';if(!map.hasOwnProperty(n)){map[n]={name:n,items:[]};groups.push(map[n]);}map[n].items.push(i);});var body=groups.map(function(g,gi){NG[gi]=g.name;var op=OPEN.hasOwnProperty(g.name)?OPEN[g.name]:(g.items.indexOf(cur)>-1||groups.length===1);var rows=g.items.map(function(i){var k=TR[i],ic=(i===cur),on=ic&&playing,d=k.dur?fmt(k.dur):'';return '<div class='+(ic?'nm-cur':'nm-row')+' data-i='+i+' role=button tabindex=0><span class=nm-pi>'+(on?'⏸':'▶')+'</span><span class=nm-tt>'+esc(k.ttl||k.title)+'</span>'+(d?'<span class=nm-du>'+d+'</span>':'')+'</div>';}).join('');return '<details class=nm-g data-g='+gi+(op?' open':'')+'><summary><span>🎙</span><span class=nm-gn>'+esc(g.name)+'</span><span class=nm-gc>🎵 '+g.items.length+'</span><span class=nm-chev>▾</span></summary>'+rows+'</details>';}).join('');P.innerHTML='<div class=nm-h>👆 '+esc(h[0])+'</div>'+body+'<button type=button class=nm-full>🎧 '+(FULL[lang()]||FULL.fr)+'</button>';}function close(){if(P)P.hidden=true;if(A){A.setAttribute('aria-expanded','false');A.classList.remove('nm-on');}}function open(a){A=a;if(!P){P=document.createElement('div');P.id='nm-panel';P.hidden=true;document.body.appendChild(P);P.addEventListener('click',function(e){var r=e.target.closest('.nm-row,.nm-cur');if(r){var i=+r.getAttribute('data-i'),keep=(i===cur&&playing);if(i===cur){playing?pause():play();}else{load(i);play();}if(!keep)close();return;}if(e.target.closest('.nm-full')){close();var s=document.getElementById('musique');if(s)s.scrollIntoView({behavior:'smooth',block:'start'});}});P.addEventListener('toggle',function(e){var d=e.target;if(d&&d.getAttribute&&d.getAttribute('data-g')!==null){OPEN[NG[+d.getAttribute('data-g')]]=d.open;}},true);}P.hidden=false;fill();place();a.setAttribute('aria-expanded','true');a.classList.add('nm-on');}document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(a&&a.getAttribute('href')==='#musique'&&a.closest('.nav-links')){e.preventDefault();e.stopPropagation();if(P&&!P.hidden)close();else open(a);return;}if(P&&!P.hidden&&!e.target.closest('#nm-panel'))close();},true);document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});window.addEventListener('resize',place);window.addEventListener('scroll',place,true);window.NLJ_NAVM=function(){if(P&&!P.hidden)fill();};})();

  /* changement de langue du site → paroles retraduites + libellés */
  document.addEventListener('change',function(e){
    if(e.target&&e.target.id==='langSelect'){setTimeout(function(){if(TR.length){showOrig=false;renderPlayer();renderList();loadLyrics();}else render();},60);}
  });

  /* ---------- versets publiés (Mur de prière, kind = verset) ---------- */
  async function loadVerses(){
    var box=$('pubVerses');if(!box)return;
    var c=rd();if(!c){return;}
    try{
      var q=c.from('prayers').select('id,user_id,author_name,content,reference,created_at').eq('kind','verset').eq('visible',true).order('created_at',{ascending:false}).limit(60);
      if(ONLY_VERSE_AUTHORS.length)q=q.in('user_id',ONLY_VERSE_AUTHORS);
      var r=await q;if(r.error)throw r.error;
      var rows=r.data||[];
      box.innerHTML=rows.length?rows.map(function(v){return '<div class="pv-card"><blockquote>« '+esc(v.content)+' »'+(v.reference?'<cite>'+esc(v.reference)+'</cite>':'')+'</blockquote><small>'+esc(v.author_name||'')+'</small></div>';}).join(''):'<p class="pw-empty" style="grid-column:1/-1;text-align:center;color:#64748b">—</p>';
    }catch(e){if(!box.children.length)box.innerHTML='';}
  }

  /* ---------- profil repliable ---------- */
  function initProfileFold(){
    var h=$('pfToggle'),f=$('pfFold');if(!h||!f)return;
    function t(){var open=f.hidden;f.hidden=!open;h.setAttribute('aria-expanded',open?'true':'false');}
    h.addEventListener('click',t);
    h.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();t();}});
  }

  function init(){initProfileFold();loadVerses();loadSongs();setInterval(function(){if(!document.hidden)loadVerses();},30000);setInterval(function(){if(!document.hidden&&!(TR&&TR.length))loadSongs();},20000);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
