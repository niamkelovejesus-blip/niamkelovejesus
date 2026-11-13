(function(){
if(window.__nljVideos)return;window.__nljVideos=1;
var SB_URL="https://qxxhbfoqlreiqyshbpqp.supabase.co",SB_KEY="sb_publishable_OK9ncVWB2Ih8xZ5fzqEQWg_mSV6vCoe";
var L='fr';try{L=(localStorage.getItem('niamke_lang')||'fr').toLowerCase().slice(0,2);}catch(e){}
var TX={fr:{nav:'Vidéos',h:'Vidéos & souvenirs',p:'Prières de la semaine et moments partagés par la communauté.',none:'Les prochaines vidéos arrivent bientôt 🙏',err:'Impossible de charger les vidéos pour le moment.',pr:'Prière de la semaine',so:'Souvenir',cl:'Fermer',play:'Lire la vidéo'},
en:{nav:'Videos',h:'Videos & memories',p:'Weekly prayers and moments shared by the community.',none:'New videos are coming soon 🙏',err:'Unable to load videos right now.',pr:'Prayer of the week',so:'Memory',cl:'Close',play:'Play video'},
es:{nav:'Vídeos',h:'Vídeos y recuerdos',p:'Oraciones de la semana y momentos compartidos por la comunidad.',none:'Pronto habrá nuevos vídeos 🙏',err:'No se pudieron cargar los vídeos.',pr:'Oración de la semana',so:'Recuerdo',cl:'Cerrar',play:'Reproducir vídeo'}};
var T=TX[L]||TX.fr;
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function safeUrl(u){return /^https:\/\//i.test(u||'')?u:'';}
function dur(s){return s?Math.floor(s/60)+':'+String(s%60).padStart(2,'0'):'';}
function client(){try{if(window.__nxsb)return window.__nxsb;var p=null;try{p=window.parent.supabaseClient;}catch(e){}if(p)return p;if(window.supabase&&window.supabase.createClient)return window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:false,autoRefreshToken:false}});}catch(e){}return null;}
var css=document.createElement('style');css.id='nlj-videos-css';css.textContent=
'#videos .nv-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px;margin-top:24px}'+
'#videos .nv-c{background:#fff;border:1px solid #efe4b8;border-radius:18px;overflow:hidden;box-shadow:0 12px 32px rgba(15,23,42,.10);cursor:pointer;text-align:left;padding:0;font:inherit;color:inherit;display:block;width:100%;align-self:start;transition:transform .2s,box-shadow .2s}'+
'#videos .nv-c:hover{transform:translateY(-3px)}'+
'#videos .nv-m{position:relative;aspect-ratio:16/9;background:#0f172a;overflow:hidden}'+
'#videos .nv-m img,#videos .nv-m video{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}'+
'#videos .nv-p{position:absolute;inset:0;display:grid;place-items:center;background:linear-gradient(to top,rgba(0,0,0,.35),transparent 60%)}'+
'#videos .nv-p i{width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.92);display:grid;place-items:center}'+
'#videos .nv-p svg{width:22px;height:22px;margin-left:3px;fill:#0f172a}'+
'#videos .nv-d{position:absolute;right:8px;bottom:8px;background:rgba(0,0,0,.7);color:#fff;font-size:12px;font-weight:600;border-radius:6px;padding:2px 7px}'+
'#videos .nv-i{padding:14px 16px 16px}'+
'#videos .nv-k{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#a8841a}'+
'#videos .nv-t{font-family:"Playfair Display",serif;font-weight:700;font-size:18px;line-height:1.3;color:#0f172a;margin:4px 0 0}'+
'#videos .nv-s{font-size:13px;color:#64748b;margin:6px 0 0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}'+
'#videos .nv-n{text-align:center;color:#64748b;padding:24px 0}'+
'#nv-modal{position:fixed;inset:0;z-index:2147483000;background:rgba(5,12,24,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px}'+
'#nv-modal video{max-width:100%;max-height:78vh;border-radius:12px;background:#000}'+
'#nv-modal h3{color:#fff;font:700 18px "Playfair Display",serif;margin:0 0 12px;text-align:center}'+
'#nv-modal button{position:absolute;top:14px;right:14px;border:0;border-radius:999px;background:#fff;color:#0f172a;font-weight:700;font-size:14px;padding:10px 16px;cursor:pointer}';
document.head.appendChild(css);
var data=[];
function embedOf(u){try{var E=window.NLJ_EMBED;if(!E||!u)return null;var c=E.clean?E.clean(u):u;var e=c&&E.parse?E.parse(c):null;return e&&!e.file?e:null;}catch(x){return null;}}
function embedSrc(e){var s=e.src,j=s.indexOf('?')<0?'?':'&';if(e.net==='YouTube')return s+j+'autoplay=1&playsinline=1&rel=0';if(e.net==='Vimeo'||e.net==='Dailymotion')return s+j+'autoplay=1';if(e.net==='Facebook'&&(e.kind==='v'||e.kind==='r'))return s+'&autoplay=true';return s;}
function card(v,i){var u=safeUrl(v.image_url),vu=safeUrl(v.url),k=v.kind==='priere'?T.pr:T.so,em=embedOf(vu);
 var th=u||(em&&em.thumb)||'';
 var media=th?'<img src="'+esc(th)+'" alt="" loading="lazy" referrerpolicy="no-referrer">':(em?'<div style="position:absolute;inset:0;display:grid;place-items:center;color:#fff;font:700 20px Inter,system-ui,sans-serif;letter-spacing:.04em">'+esc(em.net)+'</div>':'<video src="'+esc(vu)+'#t=0.5" preload="metadata" muted playsinline></video>');
 return '<button type="button" class="nv-c" data-i="'+i+'" aria-label="'+esc(T.play+' : '+(v.title||''))+'"><div class="nv-m">'+media+'<div class="nv-p"><i><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></i></div>'+(v.duration?'<span class="nv-d">'+dur(v.duration)+'</span>':'')+'</div><div class="nv-i"><div class="nv-k">'+esc(k)+'</div><h3 class="nv-t">'+esc(v.title||'')+'</h3>'+(v.description?'<p class="nv-s">'+esc(v.description)+'</p>':'')+'</div></button>';}
function open(i){var v=data[i];if(!v)return;var o=document.createElement('div');o.id='nv-modal';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
 var em=embedOf(safeUrl(v.url)),pl;
 if(em){var w=em.kind==='r'?'340px':em.kind==='p'?'500px':'min(100%,820px)',st=em.kind==='r'?'height:min(78vh,600px)':em.kind==='p'?'height:min(78vh,560px)':'aspect-ratio:16/9';
  pl='<iframe src="'+esc(embedSrc(em))+'" title="'+esc(v.title||'')+'" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" style="border:0;border-radius:12px;background:#000;max-width:100%;width:'+w+';'+st+'"></iframe><a href="'+esc(safeUrl(v.url))+'" target="_blank" rel="noopener noreferrer" style="color:#fff;margin-top:12px;font:600 14px Inter,system-ui,sans-serif">'+esc(em.net)+' ↗</a>';}
 else pl='<video controls autoplay playsinline src="'+esc(safeUrl(v.url))+'"></video>';
 o.innerHTML='<button type="button" aria-label="'+esc(T.cl)+'">✕ '+esc(T.cl)+'</button><h3>'+esc(v.title||'')+'</h3>'+pl;
 function close(){var vd=o.querySelector('video');try{vd.pause();}catch(e){}o.remove();document.removeEventListener('keydown',kd);}
 function kd(e){if(e.key==='Escape')close();}
 o.addEventListener('click',function(e){if(e.target===o||e.target.tagName==='BUTTON')close();});document.addEventListener('keydown',kd);document.body.appendChild(o);}
function fill(sec,html){sec.querySelector('.nv-body').innerHTML=html;}
function load(sec){var sb=client();if(!sb){fill(sec,'<p class="nv-n">'+esc(T.err)+'</p>');return;}
 var now=new Date().toISOString();
 sb.from('videos_souvenirs').select('*').lte('publish_at',now).order('publish_at',{ascending:false}).limit(60).then(function(r){
  if(r.error){fill(sec,'<p class="nv-n">'+esc(T.err)+'</p>');return;}
  var t=Date.now();
  data=(r.data||[]).filter(function(v){return safeUrl(v.url)&&(!v.expires_at||new Date(v.expires_at).getTime()>t);});
  fill(sec,data.length?'<div class="nv-g">'+data.map(card).join('')+'</div>':'<p class="nv-n">'+esc(T.none)+'</p>');
 },function(){fill(sec,'<p class="nv-n">'+esc(T.err)+'</p>');});}
function build(){var s=document.getElementById('videos');if(!s)return false;if(s.__nv)return true;s.__nv=1;
 var h=s.querySelector('h2'),p=s.querySelector('.lead');if(h)h.textContent=T.h;if(p)p.textContent=T.p;
 var a=document.querySelector('.nav-links a[href="#videos"]');if(a)a.textContent='🎬 '+T.nav;
 s.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.nv-c');if(b)open(+b.getAttribute('data-i'));});
 load(s);return true;}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();
