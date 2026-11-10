(function(){
var LG=[["privacy", "Politique de confidentialité"], ["terms", "Conditions d’utilisation"], ["contact", "Nous contacter"]],FR=true;try{FR=(localStorage.getItem('niamke_lang')||'fr').toLowerCase()==='fr';}catch(e){}
var T=FR?{a:'Profils vérifiés',a2:'Chaque membre est relu avant d’apparaître.',b:'Modération bienveillante',b2:'Un espace respectueux, guidé par la prière.',c:'100 % chrétien',c2:'Des rencontres bâties sur la Parole.',v:'« Ce que Dieu a uni, que l’homme ne le sépare point. »',vr:'Matthieu 19:6',home:'Accueil',meet:'Rencontre',prem:'Premium',made:'Fait avec foi et amour 🙏',top:'Haut de page'}:{a:'Verified profiles',a2:'Every member is reviewed before appearing.',b:'Caring moderation',b2:'A respectful space, guided by prayer.',c:'100% Christian',c2:'Relationships built on the Word.',v:'“What God has joined together, let no one separate.”',vr:'Matthew 19:6',home:'Home',meet:'Meet',prem:'Premium',made:'Made with faith and love 🙏',top:'Back to top'};
function go(p,id){try{parent.postMessage({nlj:'go',page:p,id:id||''},'*');}catch(e){}}
function legal(d){try{parent.postMessage({nlj:'legal',doc:d},'*');}catch(e){}}
function plus(f){
  if(f.querySelector('.nlj-fp'))return;
  var L=LG.map(function(x){var n=FR?x[1]:(x[0]==='terms'?'Terms of use':x[0]==='privacy'?'Privacy policy':x[1]);return '<a data-a="'+x[0]+'">'+n+'</a>';}).join('');
  var d=document.createElement('div');d.className='nlj-fp';
  d.innerHTML='<div class="in"><div class="nlj-tr"><div><span class="i">✅</span><p style="margin:0"><b>'+T.a+'</b>'+T.a2+'</p></div><div><span class="i">🤝</span><p style="margin:0"><b>'+T.b+'</b>'+T.b2+'</p></div><div><span class="i">✝️</span><p style="margin:0"><b>'+T.c+'</b>'+T.c2+'</p></div></div><p class="nlj-vs">'+T.v+'<small>'+T.vr+'</small></p><nav class="nlj-ln"><a data-a="home">'+T.home+'</a><a data-a="meet">'+T.meet+'</a><a data-a="prem">'+T.prem+'</a>'+L+'</nav><div class="nlj-bt"><span>'+(f.textContent.indexOf('©')<0?'© '+new Date().getFullYear()+' Niamké Love Jésus':'')+'</span><span>'+T.made+'</span></div></div>';
  f.appendChild(d);
  d.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-a]');if(!a)return;e.preventDefault();var v=a.getAttribute('data-a');if(v==='home')scrollTo({top:0,behavior:'smooth'});else if(v==='meet')go('p2','rencontre');else if(v==='prem')go('p3');else legal(v);});
}
var io=null;try{io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});}catch(e){}
function tag(){if(!io)return;document.querySelectorAll('section div[class*="rounded-["]:not(.nlj-rv)').forEach(function(el){var w=el.offsetWidth;if(w<200||w>560||el.closest('#nja')||el.querySelector('input,select,form')||!el.querySelector('img,h3,h4'))return;el.classList.add('nlj-rv','nlj-card');io.observe(el);});}
function run(){var f=document.querySelector('footer');if(f)plus(f);tag();}
var tm;new MutationObserver(function(){clearTimeout(tm);tm=setTimeout(run,150);}).observe(document.body,{childList:true,subtree:true});
setTimeout(function(){document.querySelectorAll('.nlj-rv').forEach(function(e){e.classList.add('in');});},3500);
var b=document.createElement('button');b.id='nlj-top';b.type='button';b.setAttribute('aria-label',T.top);b.textContent='↑';b.onclick=function(){scrollTo({top:0,behavior:'smooth'});};document.body.appendChild(b);
addEventListener('scroll',function(){b.classList.toggle('on',scrollY>600);},{passive:true});
run();
})();
