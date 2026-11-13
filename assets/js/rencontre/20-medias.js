/* Section « Écouter & regarder » : lit sur le site les liens YouTube, Spotify, Facebook… ajoutés dans l'admin. */
(function(){
if(window.__nljMedias)return;window.__nljMedias=1;
var SB_URL="https://qxxhbfoqlreiqyshbpqp.supabase.co",SB_KEY="sb_publishable_OK9ncVWB2Ih8xZ5fzqEQWg_mSV6vCoe";
var L='fr';try{L=(localStorage.getItem('niamke_lang')||'fr').toLowerCase().slice(0,2);}catch(e){}
var TX={
fr:{nav:'Écouter & regarder',h:'Écouter & regarder',p:'Chants, prédications et vidéos partagés par la communauté.',none:'Les prochains liens arrivent bientôt 🙏',err:'Impossible de charger les liens pour le moment.',play:'Lire',open:'Ouvrir sur',other:'Autres',close:'Fermer',hint:'Vidéo qui ne s’affiche pas ? Elle n’est peut-être pas publique : ouvrez-la sur',link:'Lien',openlink:'Ouvrir le lien'},
en:{nav:'Listen & watch',h:'Listen & watch',p:'Songs, sermons and videos shared by the community.',none:'New links are coming soon 🙏',err:'Unable to load links right now.',play:'Play',open:'Open on',other:'Other',close:'Close',hint:'Video not showing? It may not be public: open it on',link:'Link',openlink:'Open link'},
es:{nav:'Escuchar y ver',h:'Escuchar y ver',p:'Cantos, prédicas y vídeos compartidos por la comunidad.',none:'Pronto habrá nuevos enlaces 🙏',err:'No se pudieron cargar los enlaces.',play:'Reproducir',open:'Abrir en',other:'Otros',close:'Cerrar',hint:'¿El vídeo no se muestra? Quizá no es público: ábrelo en',link:'Enlace',openlink:'Abrir enlace'}};
var T=TX[L]||TX.fr;
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function client(){try{if(window.__nxsb)return window.__nxsb;var p=null;try{p=window.parent.supabaseClient;}catch(e){}if(p)return p;if(window.supabase&&window.supabase.createClient)return window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:false,autoRefreshToken:false,storageKey:'nlj-public-read'}});}catch(e){}return null;}
var css=document.createElement('style');css.textContent=
'#medias .md-g{margin-top:20px;border:1px solid #efe4b8;border-radius:16px;background:#fff;overflow:hidden}'+
'#medias .md-g>summary{cursor:pointer;display:flex;align-items:center;gap:10px;padding:14px 18px;font-weight:700;color:#0f172a;list-style:none}'+
'#medias .md-g>summary::-webkit-details-marker{display:none}'+
'#medias .md-g>summary small{margin-left:auto;color:#a8841a;font-weight:700}'+
'#medias .md-l{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;padding:0 16px 16px}'+
'#medias .md-c{border:1px solid #efe4b8;border-radius:14px;overflow:hidden;background:#fffdf6;align-self:start}'+
'#medias .md-m{position:relative;display:block;width:100%;border:0;padding:0;cursor:pointer;aspect-ratio:16/9;background:linear-gradient(135deg,#0f172a,#334155);color:#fff;font:inherit;overflow:hidden}'+
'#medias .md-m img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}'+
'#medias .md-m b{position:absolute;left:10px;top:10px;background:rgba(0,0,0,.65);border-radius:6px;padding:2px 8px;font-size:12px}'+
'#medias .md-m i{position:absolute;inset:0;margin:auto;width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.92);display:grid;place-items:center}'+
'#medias .md-m svg{width:22px;height:22px;margin-left:3px;fill:#0f172a}'+
'#medias .md-f{position:relative;width:100%}'+
'#medias .md-f.v{aspect-ratio:16/9}#medias .md-f.r{height:600px;max-width:340px;margin:0 auto}.md-f.s{height:152px}#medias .md-f.sl{height:352px}#medias .md-f.p{height:520px}'+
'#medias .md-f iframe{position:absolute;inset:0;width:100%;height:100%;border:0}'+
'#medias .md-i{padding:10px 14px 12px}'+
'#medias .md-t{font-weight:700;color:#0f172a;margin:0;line-height:1.3}'+
'#medias .md-s{font-size:13px;color:#64748b;margin:2px 0 0}'+
'#medias .md-o{display:inline-block;margin-top:6px;font-size:12px;color:#a8841a}'+
'#medias .md-n{text-align:center;color:#64748b;padding:24px 0}'+
'#medias .md-x{display:flex;align-items:center;justify-content:center;aspect-ratio:16/9;background:linear-gradient(135deg,#0f172a,#334155);color:#fff;font-weight:700;text-decoration:none;font-size:15px}'+
'#medias .md-h{font-size:12px;color:#64748b;margin:6px 0 0;line-height:1.35}'+
'#medias .md-f video{position:absolute;inset:0;width:100%;height:100%;background:#000}';
document.head.appendChild(css);

var items=[];
function card(it,i){
  var e=it.e,net=e?e.net:(it.net||T.link);
  var top=e?('<button type="button" class="md-m" aria-label="'+esc(T.play+' : '+it.title)+'">'+(e.thumb?'<img src="'+esc(e.thumb)+'" alt="" loading="lazy" referrerpolicy="no-referrer">':'')+'<b>'+esc(net)+'</b><i><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></i></button>')
            :('<a class="md-x" href="'+esc(it.url)+'" target="_blank" rel="noopener noreferrer">▶ '+esc(net)+'</a>');
  var hint=(e&&(net==='Facebook'||net==='Instagram'||net==='TikTok'))?'<p class="md-h">'+esc(T.hint+' '+net)+'.</p>':'';
  return '<div class="md-c" data-i="'+i+'">'+top+
   '<div class="md-i"><p class="md-t">'+esc(it.title)+'</p>'+(it.sub?'<p class="md-s">'+esc(it.sub)+'</p>':'')+
   '<a class="md-o" href="'+esc(it.url)+'" target="_blank" rel="noopener noreferrer">'+esc(e?T.open+' '+net:T.openlink)+'</a>'+hint+'</div></div>';
}
function withAutoplay(e){
  /* Le clic sur la vignette = lecture directe (sans 2e clic dans le lecteur YouTube) */
  var s=e.src,j=s.indexOf('?')<0?'?':'&';
  if(e.net==='YouTube')return s+j+'autoplay=1&playsinline=1&rel=0';
  if(e.net==='Vimeo'||e.net==='Dailymotion')return s+j+'autoplay=1';
  if(e.net==='Facebook'&&(e.kind==='v'||e.kind==='r'))return s+'&autoplay=true';
  if(e.net==='SoundCloud')return s+'&auto_play=true';
  return s;
}
function play(c){
  var it=items[+c.getAttribute('data-i')];if(!it)return;
  var f=document.createElement('div');f.className='md-f '+it.e.kind;
  if(it.e.file==='video'){var vd=document.createElement('video');vd.src=it.e.src;vd.controls=true;vd.autoplay=true;vd.playsInline=true;vd.setAttribute('playsinline','');f.appendChild(vd);var b0=c.querySelector('.md-m');c.replaceChild(f,b0);return;}
  var ifr=document.createElement('iframe');ifr.src=withAutoplay(it.e);ifr.title=it.title+' — '+it.e.net;ifr.allowFullscreen=true;
  ifr.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  ifr.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
  f.appendChild(ifr);var b=c.querySelector('.md-m');c.replaceChild(f,b);
}
function render(sec,rows){
  var body=sec.querySelector('.md-body');
  if(!rows.length){body.innerHTML='<p class="md-n">'+esc(T.none)+'</p>';return;}
  var G={},names=[];
  rows.forEach(function(it,i){var k=it.cat||T.other;if(!G[k]){G[k]=[];names.push(k);}G[k].push(i);});
  body.innerHTML=names.map(function(n){
    return '<details class="md-g"'+(names.length===1?' open':'')+'><summary>📁 '+esc(n)+'<small>'+G[n].length+'</small></summary><div class="md-l">'+G[n].map(function(i){return card(items[i],i);}).join('')+'</div></details>';
  }).join('');
}
function load(sec){
  var c=client(),body=sec.querySelector('.md-body');
  if(!c||!window.NLJ_EMBED){body.innerHTML='<p class="md-n">'+esc(T.err)+'</p>';return;}
  c.from('musiques').select('*').order('created_at',{ascending:false}).limit(300).then(function(r){
    if(r.error){body.innerHTML='<p class="md-n">'+esc(T.err)+'</p>';return;}
    items=[];
    (r.data||[]).forEach(function(s){
      var u=s.url||s.storage_path||s.file_path||s.path||s.file||s.file_url||s.audio_url||s.audio;
      if(!u)return;
      var E=window.NLJ_EMBED,cu=E.clean(u),e=cu&&E.parse(cu);
      if(!e&&!(cu&&E.isLink(cu)))return;          /* fichiers audio -> lecteur de musique */
      var net=e?e.net:E.label(cu);
      items.push({e:e||null,net:net,url:cu,title:s.title||s.titre||('Lien '+(net||'')).trim(),sub:[s.artist||s.artiste,s.recueil].filter(Boolean).join(' · '),cat:String(s.categorie||'').trim()});
    });
    render(sec,items);
  },function(){body.innerHTML='<p class="md-n">'+esc(T.err)+'</p>';});
}
function build(){
  var s=document.getElementById('medias');if(!s||s.__nm)return;s.__nm=1;
  var h=s.querySelector('h2'),p=s.querySelector('.lead');if(h)h.textContent=T.h;if(p)p.textContent=T.p;
  document.querySelectorAll('.nav-links a[href="#medias"]').forEach(function(a){a.textContent='▶️ '+T.nav;});
  s.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.md-m');if(b)play(b.parentNode);});
  load(s);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();
