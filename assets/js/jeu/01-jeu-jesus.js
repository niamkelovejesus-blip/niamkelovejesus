(function(){
/* Jeu « De Bethléem au Retour » — venue, mort et avènement de Jésus. Textes : Louis Segond 1910 (domaine public). */
var CH=[
{id:'venue',ico:'⭐',t:'Sa venue',s:'De l’annonce à Bethléem',
q:[
['Dans quelle ville Jésus est-il né ?',['Bethléem','Nazareth','Jérusalem','Capernaüm'],0,'Matthieu 2:1','Le Messie devait naître à Bethléem, comme l’avait annoncé le prophète Michée.'],
['Quel ange annonça à Marie qu’elle mettrait au monde le Sauveur ?',['Michel','Gabriel','Raphaël','Uriel'],1,'Luc 1:26','L’ange Gabriel fut envoyé auprès de Marie, à Nazareth.'],
['Pourquoi l’enfant devait-il s’appeler Jésus ?',['Parce que c’était le nom de son grand-père','Parce qu’il sauvera son peuple de ses péchés','Parce qu’il serait roi de Jérusalem','Parce qu’il guérirait les malades'],1,'Matthieu 1:21','« Tu lui donneras le nom de Jésus ; c’est lui qui sauvera son peuple de ses péchés. »'],
['Quel prophète annonça : « la jeune fille deviendra enceinte, elle enfantera un fils, et elle lui donnera le nom d’Emmanuel » ?',['Jérémie','Daniel','Ésaïe','Ézéchiel'],2,'Ésaïe 7:14','Ésaïe l’avait annoncé environ 700 ans avant la naissance de Jésus. Emmanuel signifie « Dieu avec nous ».'],
['Qui vint adorer l’enfant Jésus après avoir vu son étoile en Orient ?',['Les bergers','Les mages','Les scribes','Les prêtres'],1,'Matthieu 2:1','Les mages venus d’Orient cherchaient le roi des Juifs pour l’adorer.'],
['Complète : « Et la parole a été faite ____, et elle a habité parmi nous. »',['lumière','esprit','chair','pain'],2,'Jean 1:14','Dieu s’est fait homme en Jésus-Christ : c’est le mystère de l’Incarnation.']
],
o:{t:'Remets la naissance de Jésus dans l’ordre',l:['L’ange annonce la naissance à Marie','Jésus naît à Bethléem','Les bergers viennent à la crèche','Les mages adorent l’enfant','La fuite en Égypte']}},
{id:'mort',ico:'✝️',t:'Sa mort',s:'De Gethsémané au tombeau',
q:[
['Dans quel jardin Jésus pria-t-il avant son arrestation ?',['Éden','Gethsémané','Les Oliviers d’Hérode','Siloé'],1,'Matthieu 26:36','Jésus dit à ses disciples : « Asseyez-vous ici, pendant que je m’éloignerai pour prier. »'],
['Pour combien de pièces d’argent Judas livra-t-il Jésus ?',['Dix','Vingt','Trente','Cinquante'],2,'Matthieu 26:15','Ils lui payèrent trente pièces d’argent.'],
['Que dit Jésus juste avant de rendre l’esprit, selon Jean ?',['« Père, pardonne-leur »','« Tout est accompli »','« Il est écrit »','« Je reviendrai »'],1,'Jean 19:30','« Tout est accompli » : l’œuvre du salut était achevée.'],
['Que se passa-t-il dans le temple à la mort de Jésus ?',['Le feu tomba du ciel','Les portes s’ouvrirent','Le voile se déchira en deux','Le sol se couvrit de lumière'],2,'Matthieu 27:51','Le voile se déchira du haut en bas : le chemin vers Dieu était désormais ouvert.'],
['Qui, voyant comment Jésus était mort, dit : « Assurément, cet homme était Fils de Dieu » ?',['Pilate','Le centenier','Hérode','Barabbas'],1,'Matthieu 27:54','Le centenier romain et ceux qui gardaient Jésus furent saisis de frayeur.'],
['Quel homme riche offrit son tombeau neuf pour ensevelir Jésus ?',['Nicodème','Joseph d’Arimathée','Lazare','Zachée'],1,'Matthieu 27:57','Joseph d’Arimathée, disciple de Jésus, le déposa dans son tombeau taillé dans le roc.']
],
o:{t:'Remets la Passion dans l’ordre',l:['Le dernier repas avec les disciples','La prière à Gethsémané','Jésus est arrêté','Jésus devant Pilate','La crucifixion']}},
{id:'avenement',ico:'🕊️',t:'Son avènement',s:'De la résurrection au Retour',
q:[
['Quand Jésus est-il ressuscité, selon les Écritures ?',['Le jour même','Le troisième jour','Le septième jour','Après quarante jours'],1,'1 Corinthiens 15:4','Il a été enseveli et il est ressuscité le troisième jour, selon les Écritures.'],
['À qui Jésus ressuscité apparut-il en premier ?',['Pierre','Jean','Marie de Magdala','Thomas'],2,'Jean 20:14','Marie de Magdala le vit près du tombeau et l’entendit l’appeler par son nom.'],
['Quel disciple voulait voir et toucher les plaies avant de croire ?',['Philippe','André','Thomas','Barthélemy'],2,'Jean 20:27','Thomas s’écria : « Mon Seigneur et mon Dieu ! »'],
['Pendant combien de jours Jésus se montra-t-il à ses disciples avant de monter au ciel ?',['Trois','Sept','Quarante','Cinquante'],2,'Actes 1:3','Il leur donna plusieurs preuves qu’il était vivant pendant quarante jours.'],
['Que promirent les anges aux disciples lors de l’ascension ?',['Que l’Esprit viendrait aussitôt','Que Jésus reviendrait de la même manière','Que le temple serait rebâti','Que Jésus apparaîtrait en rêve'],1,'Actes 1:11','« Ce Jésus, qui a été enlevé au ciel du milieu de vous, reviendra de la même manière que vous l’avez vu allant au ciel. »'],
['Qui connaît le jour et l’heure du retour de Jésus ?',['Les anges','Les prophètes','Le Père seul','Personne ne le saura jamais'],2,'Matthieu 24:36','Veillons : le jour et l’heure, seul le Père les connaît.']
],
o:{t:'Remets les apparitions du ressuscité dans l’ordre',l:['Le tombeau est trouvé vide','Jésus apparaît à Marie de Magdala','Jésus rejoint les disciples d’Emmaüs','Jésus apparaît à Thomas','Jésus monte au ciel']}}
];
var FIN=['Oui, je viens bientôt. Amen ! Viens, Seigneur Jésus !','Apocalypse 22:20'];
var $=function(i){return document.getElementById(i)},M=$('m');
var S={pts:0,done:{}};
try{var sv=JSON.parse(localStorage.getItem('nlj_jeu_jesus')||'{}');if(sv&&typeof sv==='object'){S.done=sv.done||{};}}catch(e){}
function save(){try{localStorage.setItem('nlj_jeu_jesus',JSON.stringify({done:S.done}));}catch(e){}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function pts(){$('pts').textContent=S.pts+' pt'+(S.pts>1?'s':'');}
function stars(n){return '★★★'.slice(0,n)+'☆☆☆'.slice(0,3-n);}
function readBtn(ref){return '<a data-ref="'+esc(ref)+'" role="button" tabindex="0">Lire dans la Bible</a>';}
M.addEventListener('click',function(e){var a=e.target.closest('[data-ref]');if(a){try{parent.postMessage({nlj:'bible-open',ref:a.getAttribute('data-ref')},'*');}catch(x){}}});
M.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.hasAttribute('data-ref'))e.target.click();});
$('back').onclick=function(){try{parent.postMessage({nlj:'go',page:'p1'},'*');}catch(e){location.href='../';}};

function home(){
  var tot=CH.reduce(function(n,c){return n+(S.done[c.id]||0);},0);
  M.innerHTML='<h2>Le chemin de Jésus</h2><p class="lead">Parcours les trois temps de l’histoire du salut : sa venue, sa mort, son avènement. Chaque question s’appuie sur la Parole.</p>'
  +CH.map(function(c,i){return '<button class="ch" data-c="'+i+'"><i aria-hidden="true">'+c.ico+'</i><span><b>'+(i+1)+'. '+esc(c.t)+'</b><small>'+esc(c.s)+'</small></span><span class="st" aria-label="'+(S.done[c.id]||0)+' étoiles sur 3">'+stars(S.done[c.id]||0)+'</span></button>';}).join('')
  +(tot===9?'<div class="vf">'+esc(FIN[0])+'<b>'+FIN[1]+'</b></div>':'');
  M.scrollTop=0;
}
M.addEventListener('click',function(e){var b=e.target.closest('.ch');if(b)start(+b.getAttribute('data-c'));});

var G;
function start(ci){var c=CH[ci];G={ci:ci,c:c,qs:c.q.map(function(q){var idx=shuf([0,1,2,3]);return{t:q[0],o:idx.map(function(k){return q[1][k];}),a:idx.indexOf(q[2]),r:q[3],e:q[4]};}),i:0,err:0};S.pts=0;pts();ask();}
function bar(){var n=G.c.q.length+1;return '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="'+n+'" aria-valuenow="'+G.i+'"><div style="width:'+Math.round(G.i/n*100)+'%"></div></div>';}
function ask(){
  if(G.i>=G.qs.length)return order();
  var q=G.qs[G.i];
  M.innerHTML=bar()+'<h2>'+esc(G.c.ico+' '+G.c.t)+'</h2><p class="q">'+esc(q.t)+'</p>'+q.o.map(function(o,k){return '<button class="opt" data-k="'+k+'">'+esc(o)+'</button>';}).join('')+'<div id="fb"></div>';
  M.scrollTop=0;
  var tried=false;
  M.querySelectorAll('.opt').forEach(function(b){b.onclick=function(){
    var k=+b.getAttribute('data-k');
    if(k===q.a){
      if(!tried){S.pts+=10;pts();}else G.err++;
      M.querySelectorAll('.opt').forEach(function(x){x.disabled=true;});b.classList.add('ok');
      $('fb').innerHTML='<div class="ex">'+esc(q.e)+'<b>'+esc(q.r)+' — '+readBtn(q.r)+'</b></div><div class="row"><button class="btn" id="nx">Continuer</button></div>';
      $('nx').onclick=function(){G.i++;ask();};$('nx').focus();
    }else{b.classList.add('ko');b.disabled=true;tried=true;}
  };});
}
function order(){
  var o=G.c.o,want=o.l,pool=shuf(want.map(function(t,i){return{t:t,i:i};})),next=0,miss=0;
  function draw(){
    M.innerHTML=bar()+'<h2>'+esc(o.t)+'</h2><p class="lead">Touche les événements dans l’ordre où ils se sont produits.</p>'
    +pool.map(function(p,k){var done=p.i<next;return '<button class="opt'+(done?' ok':'')+'" data-k="'+k+'"'+(done?' disabled':'')+'>'+(done?(p.i+1)+'. ':'')+esc(p.t)+'</button>';}).join('')+'<div id="fb"></div>';
    M.querySelectorAll('.opt').forEach(function(b){b.onclick=function(){
      var p=pool[+b.getAttribute('data-k')];
      if(p.i===next){next++;if(next===want.length){S.pts+=20-Math.min(miss,4)*5;pts();G.err+=miss>2?1:0;G.i++;draw2();}else draw();}
      else{miss++;b.classList.add('ko');setTimeout(function(){b.classList.remove('ko');},400);}
    };});
  }
  function draw2(){
    M.innerHTML=bar()+'<h2>'+esc(o.t)+'</h2>'+want.map(function(t,i){return '<div class="opt ok">'+(i+1)+'. '+esc(t)+'</div>';}).join('')+'<div class="row"><button class="btn" id="nx">Terminer le chapitre</button></div>';
    $('nx').onclick=end;$('nx').focus();
  }
  draw();
}
function end(){
  var n=G.err<=0?3:G.err<=2?2:1;
  if(n>(S.done[G.c.id]||0)){S.done[G.c.id]=n;save();}
  var last=G.ci<CH.length-1;
  M.innerHTML='<div class="big"><div class="ico" aria-hidden="true">'+G.c.ico+'</div><h2>Chapitre terminé : '+esc(G.c.t)+'</h2><div class="stars" aria-label="'+n+' étoiles sur 3">'+stars(n)+'</div><p class="lead">Score : '+S.pts+' points</p></div>'
  +'<div class="row" style="justify-content:center">'+(last?'<button class="btn" id="go">Chapitre suivant</button>':'')+'<button class="btn s" id="re">Rejouer</button><button class="btn s" id="hm">Le chemin</button></div>';
  if(last)$('go').onclick=function(){start(G.ci+1);};
  $('re').onclick=function(){start(G.ci);};$('hm').onclick=function(){S.pts=0;pts();home();};
}
home();
})();
