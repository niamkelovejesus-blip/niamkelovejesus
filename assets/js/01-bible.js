/* Lecteur de Bible — Niamké Love Jésus.
   Texte : assets/bible/<langue>.json (voir assets/bible/LISEZ-MOI.txt).
   Formats acceptés : [{abbrev,chapters:[[versets…]]}]  ou  {books:[{name,chapters:[{verses:[{text}]}]}]}.
   Sans fichier, le lecteur affiche les paroles de Jésus intégrées (amorce). */
(function(){
var $=function(i){return document.getElementById(i);};
var NAMES=["Genèse","Exode","Lévitique","Nombres","Deutéronome","Josué","Juges","Ruth","1 Samuel","2 Samuel","1 Rois","2 Rois","1 Chroniques","2 Chroniques","Esdras","Néhémie","Esther","Job","Psaumes","Proverbes","Ecclésiaste","Cantique des cantiques","Ésaïe","Jérémie","Lamentations","Ézéchiel","Daniel","Osée","Joël","Amos","Abdias","Jonas","Michée","Nahum","Habacuc","Sophonie","Aggée","Zacharie","Malachie","Matthieu","Marc","Luc","Jean","Actes","Romains","1 Corinthiens","2 Corinthiens","Galates","Éphésiens","Philippiens","Colossiens","1 Thessaloniciens","2 Thessaloniciens","1 Timothée","2 Timothée","Tite","Philémon","Hébreux","Jacques","1 Pierre","2 Pierre","1 Jean","2 Jean","3 Jean","Jude","Apocalypse"];
var SEED=[ /* paroles de Jésus — Louis Segond 1910 (domaine public) */
["Jean",14,6,"Jésus lui dit: Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi."],
["Matthieu",11,28,"Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos."],
["Jean",8,12,"Jésus leur parla de nouveau, et dit: Je suis la lumière du monde; celui qui me suit ne marchera pas dans les ténèbres, mais il aura la lumière de la vie."],
["Matthieu",6,33,"Cherchez premièrement le royaume et la justice de Dieu; et toutes ces choses vous seront données par-dessus."],
["Jean",13,34,"Je vous donne un commandement nouveau: Aimez-vous les uns les autres; comme je vous ai aimés, vous aussi, aimez-vous les uns les autres."],
["Jean",10,10,"Le voleur ne vient que pour dérober, égorger et détruire; moi, je suis venu afin que les brebis aient la vie, et qu'elles l'aient en abondance."],
["Jean",14,27,"Je vous laisse la paix, je vous donne ma paix. Ce n'est pas comme le monde donne que je vous la donne. Que votre cœur ne se trouble point, et ne s'alarme point."],
["Matthieu",7,7,"Demandez, et l'on vous donnera; cherchez, et vous trouverez; frappez, et l'on vous ouvrira."],
["Jean",15,5,"Je suis le cep, vous êtes les sarments. Celui qui demeure en moi et en qui je demeure porte beaucoup de fruit, car sans moi vous ne pouvez rien faire."],
["Jean",6,35,"Jésus leur dit: Je suis le pain de vie. Celui qui vient à moi n'aura jamais faim, et celui qui croit en moi n'aura jamais soif."],
["Jean",3,16,"Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle."],
["Matthieu",28,20,"Et voici, je suis avec vous tous les jours, jusqu'à la fin du monde."]
];
var PLAN=[[42,1,'La Parole faite chair'],[42,3,'Naître de nouveau'],[42,4,'L\'eau vive'],[42,6,'Le pain de vie'],[42,8,'La lumière du monde'],[42,10,'Le bon berger'],[42,11,'La résurrection et la vie'],[42,13,'Le lavement des pieds'],[42,14,'Le chemin, la vérité, la vie'],[42,15,'Demeurer en lui'],[42,17,'La prière de Jésus'],[39,5,'Les Béatitudes'],[39,6,'Prier et ne pas s\'inquiéter'],[39,7,'Bâtir sur le roc'],[39,11,'Venez à moi'],[39,13,'Les paraboles du royaume'],[39,18,'Pardonner'],[39,22,'Le plus grand commandement'],[39,25,'Veiller et servir'],[41,10,'Le bon Samaritain'],[41,15,'Le fils retrouvé'],[41,19,'Zachée'],[40,4,'La tempête apaisée'],[40,10,'Servir plutôt qu\'être servi'],[39,26,'La Cène et Gethsémané'],[42,19,'La croix'],[41,23,'Aujourd\'hui avec moi dans le paradis'],[39,28,'Il est ressuscité'],[42,20,'Thomas et la foi'],[42,21,'« Pais mes brebis »']];
var PLAN_DONE=[];try{PLAN_DONE=JSON.parse(localStorage.getItem('nlj_plan_done')||'[]');}catch(e){}
function planSave(){try{localStorage.setItem('nlj_plan_done',JSON.stringify(PLAN_DONE));}catch(e){}}
function plan(){
  if(!BIB[cur]){main().innerHTML='<p class="msg">Le plan de lecture sera disponible quand la Bible sera chargée.</p>';return;}
  var n=PLAN.length,done=PLAN_DONE.length,next=0;for(var i=1;i<=n;i++){if(PLAN_DONE.indexOf(i)<0){next=i;break;}}
  var h='<h2>30 jours avec Jésus</h2><p class="hint" style="margin:0 0 10px">Un chapitre par jour dans les Évangiles. Lis, puis touche « J\'ai lu » à la fin du chapitre.</p>';
  h+='<div class="pbar"><i style="width:'+Math.round(done*100/n)+'%"></i></div><p class="hint" style="margin:6px 0 12px">'+done+' / '+n+' jours terminés</p>';
  if(next)h+='<button type="button" class="pnext" data-plan="'+next+'">▶ Continuer : jour '+next+' — '+esc(NAMES[PLAN[next-1][0]]+' '+PLAN[next-1][1])+'</button>';
  else h+='<div class="warn">🎉 Bravo, tu as terminé les 30 jours avec Jésus ! Gloire à Dieu. 🙏</div>';
  h+=PLAN.map(function(p,i){var d=i+1,ok=PLAN_DONE.indexOf(d)>=0;return '<div class="res prow'+(ok?' ok':'')+'" data-plan="'+d+'"><b>Jour '+d+(ok?' ✅':'')+'</b>'+esc(NAMES[p[0]]+' '+p[1]+' — '+p[2])+'</div>';}).join('');
  main().innerHTML=h;
}
function openPlan(d){var p=PLAN[d-1];if(!p||!BIB[cur])return;view.planDay=d;chapter(p[0],p[1]-1);}
var TR=[{id:'fr',label:'Français',file:'../assets/bible/fr.json'},{id:'en',label:'English',file:'../assets/bible/en.json'}];
var VDJ=null;
var BIB={},cur=null,view={t:'lire',book:null,ch:null,sel:{},planDay:null},FAV=[];
try{FAV=JSON.parse(localStorage.getItem('nlj_bible_fav')||'[]');}catch(e){}
var fs=parseInt((function(){try{return localStorage.getItem('nlj_bible_fs');}catch(e){return 19;}})(),10)||19;
function setFs(n){fs=Math.max(14,Math.min(30,n));document.documentElement.style.setProperty('--fs',fs+'px');try{localStorage.setItem('nlj_bible_fs',fs);}catch(e){}}
setFs(fs);
function plain(s){return String(s).replace(/[\u27E6\u27E7]/g,'');}
function rich(s){return esc(s).replace(/\u27E6/g,'<span class="wj">').replace(/\u27E7/g,'</span>');}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function norm(j){
  if(Array.isArray(j)&&j.length&&j[0]&&Array.isArray(j[0].chapters)&&(j[0].chapters.length===0||Array.isArray(j[0].chapters[0])))return j.map(function(b){return b.chapters;});
  var bs=(j&&j.books)||(Array.isArray(j)?j:null);
  if(bs&&bs[0]&&bs[0].chapters&&bs[0].chapters[0]&&bs[0].chapters[0].verses)return bs.map(function(b){return b.chapters.map(function(c){return c.verses.map(function(v){return v.text;});});});
  return null;
}
function load(t){return fetch(t.file,{cache:'no-cache'}).then(function(r){if(!r.ok)throw 0;return r.text();}).then(function(x){var d=norm(JSON.parse(x.replace(/^﻿/,'')));if(!d||d.length!==66)throw 0;BIB[t.id]=d;}).catch(function(){});}
function save(){try{localStorage.setItem('nlj_bible_fav',JSON.stringify(FAV));}catch(e){}}
function ref(b,c,v){return NAMES[b]+' '+(c+1)+(v!=null?':'+(v+1):'');}
function favKey(b,c,v){return b+'.'+c+'.'+v;}
function isFav(b,c,v){return FAV.indexOf(favKey(b,c,v))>=0;}
function text(b,c,v){var d=BIB[cur];return d&&d[b]&&d[b][c]&&d[b][c][v]!=null?plain(d[b][c][v]):null;}
function main(){return $('main');}
function seedIdx(n){return NAMES.indexOf(n);}
function votd(){
  var d=new Date(),k=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5),s=(VDJ&&VDJ.length?VDJ:SEED)[k%(VDJ&&VDJ.length?VDJ.length:SEED.length)];
  return '<div class="vdj"><small>Verset du jour · Parole de Jésus</small><p>« '+esc(s[3])+' »</p><b>'+esc(s[0]+' '+s[1]+':'+s[2])+'</b>'+(BIB[cur]?'<button type="button" data-open="'+seedIdx(s[0])+'.'+(s[1]-1)+'.'+(s[2]-1)+'">Lire le chapitre</button>':'')+'</div>';
}
function home(){
  var h=votd();
  if(!BIB[cur]){
    h+='<div class="warn"><b>Bible complète en cours d\'installation.</b><br>En attendant, voici des paroles de Jésus. Le texte intégral s\'affichera ici dès que le fichier de la Bible sera ajouté au site.</div><h2>Paroles de Jésus</h2>';
    h+=SEED.map(function(s){return '<div class="res"><b>'+esc(s[0]+' '+s[1]+':'+s[2])+'</b>'+esc(s[3])+'</div>';}).join('');
    main().innerHTML=h;return;
  }
  h+='<h2>Ancien Testament</h2><div class="books">'+NAMES.slice(0,39).map(function(n,i){return '<button type="button" data-b="'+i+'">'+esc(n)+'</button>';}).join('')+'</div>';
  h+='<h2>Nouveau Testament</h2><div class="books">'+NAMES.slice(39).map(function(n,i){return '<button type="button" data-b="'+(i+39)+'">'+esc(n)+'</button>';}).join('')+'</div>';
  main().innerHTML=h;
}
function chapters(b){
  var n=BIB[cur][b].length;
  var h='<div class="crumb"><button type="button" data-home="1">← Livres</button></div><h2>'+esc(NAMES[b])+'</h2><div class="chaps">';
  for(var i=0;i<n;i++)h+='<button type="button" data-open="'+b+'.'+i+'">'+(i+1)+'</button>';
  main().innerHTML=h+'</div>';
}
function chapter(b,c,hl,hl2){
  view.book=b;view.ch=c;view.sel={};
  var vs=BIB[cur][b][c]||[];
  var h='<div class="crumb"><button type="button" data-b="'+b+'">← '+esc(NAMES[b])+'</button></div><div class="ch"><h2>'+esc(NAMES[b])+' '+(c+1)+'</h2>';
  h+=vs.map(function(t,i){return '<p class="vs'+(isFav(b,c,i)?' fav':'')+((hl!=null&&i>=hl&&i<=(hl2==null?hl:hl2))?' sel':'')+'" data-v="'+i+'"><sup>'+(i+1)+'</sup>'+rich(t)+'</p>';}).join('');
  var pv=prevOf(b,c),nx=nextOf(b,c);
  h+='</div><div class="nav"><button type="button" '+(pv?'data-open="'+pv+'"':'disabled')+'>← Précédent</button><button type="button" '+(nx?'data-open="'+nx+'"':'disabled')+'>Suivant →</button></div>';
  if(view.planDay){var pd=view.planDay,dn=PLAN_DONE.indexOf(pd)>=0;h+='<div class="plan-ok"><button type="button" data-plandone="'+pd+'">'+(dn?'✅ Jour '+pd+' terminé':'☐ J\'ai lu · terminer le jour '+pd)+'</button></div>';}
  h+='<p class="hint"><span class="wj">Texte en rouge</span> : paroles de Jésus. Touchez un verset pour le copier, le partager ou l\'ajouter aux favoris.</p><div class="act" id="act"><button type="button" data-a="copy">Copier</button><button type="button" data-a="share">Partager</button><button type="button" data-a="fav">⭐ Favori</button></div>';
  main().innerHTML=h;main().scrollTop=0;
  if(hl!=null){var e=main().querySelector('[data-v="'+hl+'"]');if(e)e.scrollIntoView({block:'center'});}
}
function prevOf(b,c){if(c>0)return b+'.'+(c-1);if(b>0)return (b-1)+'.'+(BIB[cur][b-1].length-1);return null;}
function nextOf(b,c){if(c<BIB[cur][b].length-1)return b+'.'+(c+1);if(b<65)return (b+1)+'.0';return null;}
function selected(){return Object.keys(view.sel).map(Number).sort(function(a,b){return a-b;});}
function selText(){var s=selected();if(!s.length)return '';var b=view.book,c=view.ch;
  return '« '+s.map(function(v){return text(b,c,v);}).join(' ')+' »\n— '+NAMES[b]+' '+(c+1)+':'+(s.length>1?(s[0]+1)+'-'+(s[s.length-1]+1):(s[0]+1))+' · niamkelovejesus.com';}
function nrm(x){return String(x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[.']/g,' ').replace(/\s+/g,' ').trim();}
function bookIdx(name){var n=nrm(name),n2=n.replace(/s$/,'');for(var i=0;i<66;i++){var x=nrm(NAMES[i]);if(x===n||x.replace(/s$/,'')===n2)return i;}
  var AL={'cantique':21,'cantiques':21,'psaume':18,'ps':18,'eccl':20,'esaie':22,'isaie':22,'ezechiel':25,'apoc':65,'rev':65,'mt':39,'mc':40,'lc':41,'jn':42,'ac':43,'rm':44};return AL.hasOwnProperty(n)?AL[n]:-1;}
function search(q){
  q=q.trim();if(!q)return;
  /* référence directe : « Jean 3:16 », « Philippiens 4:6-7 », « 1 Jean 4 » */
  var m=q.match(/^(\d?\s?[A-Za-zÀ-ÿ' .]+?)\s+(\d+)(?:\s*[:.,]\s*(\d+)(?:\s*[-–]\s*(\d+))?)?$/);
  if(m&&BIB[cur]){var bi=bookIdx(m[1]);
    if(bi>=0&&BIB[cur][bi][+m[2]-1]){setTab('lire');view.planDay=null;chapter(bi,+m[2]-1,m[3]?+m[3]-1:null,m[4]?+m[4]-1:null);return true;}}
  if(!BIB[cur]){var low=q.toLowerCase();var r=SEED.filter(function(s){return s[3].toLowerCase().indexOf(low)>=0||(s[0]+' '+s[1]+':'+s[2]).toLowerCase()===low;});
    main().innerHTML=r.length?r.map(function(s){return '<div class="res"><b>'+esc(s[0]+' '+s[1]+':'+s[2])+'</b>'+esc(s[3])+'</div>';}).join(''):'<p class="msg">La recherche dans toute la Bible sera disponible dès l\'ajout du fichier.</p>';return;}
  var low2=q.toLowerCase(),out=[],d=BIB[cur];
  for(var b=0;b<66&&out.length<150;b++)for(var c=0;c<d[b].length&&out.length<150;c++)for(var v=0;v<d[b][c].length;v++){var t=plain(d[b][c][v]);if(t&&t.toLowerCase().indexOf(low2)>=0){out.push([b,c,v,t]);if(out.length>=150)break;}}
  if(!out.length){main().innerHTML='<p class="msg">Aucun verset trouvé pour « '+esc(q)+' ».</p>';return;}
  var re=new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig');
  main().innerHTML='<p class="msg">'+out.length+(out.length>=150?'+':'')+' résultat(s)</p>'+out.map(function(o){return '<div class="res" data-open="'+o[0]+'.'+o[1]+'.'+o[2]+'"><b>'+esc(ref(o[0],o[1],o[2]))+'</b>'+esc(o[3]).replace(re,'<mark>$1</mark>')+'</div>';}).join('');
}
function favs(){
  if(!FAV.length){main().innerHTML='<p class="msg">Aucun favori pour le moment.<br>Touchez un verset puis « ⭐ Favori ».</p>';return;}
  main().innerHTML=FAV.map(function(k){var p=k.split('.').map(Number),t=text(p[0],p[1],p[2]);if(t==null)return '';return '<div class="res" data-open="'+k+'"><b>'+esc(ref(p[0],p[1],p[2]))+'</b>'+esc(t)+'</div>';}).join('')||'<p class="msg">Les favoris s\'afficheront quand la Bible sera chargée.</p>';
}
function openRef(s){var p=s.split('.').map(Number);if(!BIB[cur])return;setTab('lire');view.planDay=null;chapter(p[0],p[1],p.length>2?p[2]:null);}
function setTab(t){view.t=t;document.querySelectorAll('.tabs button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-t')===t);});}
document.addEventListener('click',function(e){
  var t=e.target.closest('[data-b],[data-open],[data-home],[data-v],[data-a],[data-t],[data-plan],[data-plandone]');if(!t)return;
  if(t.hasAttribute('data-plan')){openPlan(+t.getAttribute('data-plan'));return;}
  if(t.hasAttribute('data-plandone')){var pd=+t.getAttribute('data-plandone'),ix=PLAN_DONE.indexOf(pd);if(ix>=0)PLAN_DONE.splice(ix,1);else PLAN_DONE.push(pd);planSave();var nx=PLAN_DONE.indexOf(pd)>=0;t.textContent=nx?'✅ Jour '+pd+' terminé':'☐ J\'ai lu · terminer le jour '+pd;return;}
  if(t.hasAttribute('data-t')){setTab(t.getAttribute('data-t'));view.planDay=null;if(view.t==='fav')favs();else if(view.t==='plan')plan();else home();return;}
  if(t.hasAttribute('data-home')){home();return;}
  if(t.hasAttribute('data-open')){openRef(t.getAttribute('data-open'));return;}
  if(t.hasAttribute('data-b')&&!t.hasAttribute('data-v')){chapters(+t.getAttribute('data-b'));return;}
  if(t.hasAttribute('data-v')){var v=+t.getAttribute('data-v');if(view.sel[v]){delete view.sel[v];t.classList.remove('sel');}else{view.sel[v]=1;t.classList.add('sel');}var a=$('act');if(a)a.classList.toggle('on',selected().length>0);return;}
  if(t.hasAttribute('data-a')){var s=selected();if(!s.length)return;var k=t.getAttribute('data-a'),tx=selText();
    if(k==='copy'){try{navigator.clipboard.writeText(tx);}catch(x){}t.textContent='✓ Copié';setTimeout(function(){t.textContent='Copier';},1200);}
    else if(k==='share'){if(navigator.share){navigator.share({text:tx}).catch(function(){});}else{try{navigator.clipboard.writeText(tx);}catch(x){}t.textContent='✓ Copié';setTimeout(function(){t.textContent='Partager';},1200);}}
    else{s.forEach(function(v){var key=favKey(view.book,view.ch,v),i=FAV.indexOf(key);if(i>=0)FAV.splice(i,1);else FAV.push(key);});save();chapter(view.book,view.ch);}
  }
});
$('go').addEventListener('click',function(){search($('q').value);});
$('q').addEventListener('keydown',function(e){if(e.key==='Enter')search($('q').value);});
$('fsm').addEventListener('click',function(){setFs(fs-2);});
$('fsp').addEventListener('click',function(){setFs(fs+2);});

$('tr').addEventListener('change',function(){cur=this.value;try{localStorage.setItem('nlj_bible_tr',cur);}catch(e){}home();});
/* démarrage : charge les traductions disponibles */
fetch('../assets/bible/versets-du-jour.json').then(function(r){return r.ok?r.json():null;}).then(function(j){if(Array.isArray(j)&&j.length)VDJ=j.map(function(x){return [x[0],x[1],x[2],x[3]];});}).catch(function(){});
Promise.all(TR.map(load)).then(function(){
  var ok=TR.filter(function(t){return BIB[t.id];}),want='fr';
  try{want=localStorage.getItem('nlj_bible_tr')||(localStorage.getItem('niamke_lang')||'fr').toLowerCase();}catch(e){}
  cur=BIB[want]?want:(ok[0]?ok[0].id:'fr');
  if(ok.length>1){var s=$('tr');s.hidden=false;s.innerHTML=ok.map(function(t){return '<option value="'+t.id+'"'+(t.id===cur?' selected':'')+'>'+t.label+'</option>';}).join('');}
  home();
  try{parent.postMessage({nlj:'bible-ready'},'*');}catch(e){}
});
window.addEventListener('message',function(e){var d=e.data;if(!d||d.nlj!=='bible')return;if(d.ref)openRef(d.ref);else if(d.q){$('q').value=d.q;if(!search(d.q)){}}});
})();
/* Croix de fermeture : revient à la page précédente (comme la flèche retour du téléphone) */
(function(){var T=['Fermer','Close','Cerrar','Fechar','Chiudi','Schließen','إغلاق','关闭','Sluiten','Закрыть','Kanga','Funga','बंद करें','Tutup','Isara','닫기','Đóng','Zamknij','Закрити','بند کریں','Închide'],L=['fr','en','es','pt','it','de','ar','zh','nl','ru','ln','sw','hi','id','tl','ko','vi','pl','uk','ur','ro'],l='fr';try{l=(localStorage.getItem('niamke_lang')||'fr').toLowerCase();}catch(e){}var i=L.indexOf(l);if(i<0)i=1;var b=document.getElementById('back');if(!b)return;b.textContent='\u2715';b.setAttribute('aria-label',T[i]);b.setAttribute('title',T[i]);b.onclick=function(e){if(e)e.preventDefault();try{if(parent&&parent!==window&&parent.history.length>1){parent.history.back();return;}}catch(x){}try{parent.postMessage({nlj:'go',page:'p1',id:''},'*');}catch(x){}};})();
