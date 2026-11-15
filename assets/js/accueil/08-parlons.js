(function(){
/* Bouton flottant « Parlons de Jésus » (page d'accueil uniquement, en bas à droite) :
   ouvre le chat = page 4 de la coque (pages/parlons-avec-jesus.html) */
var FR=true;try{FR=(localStorage.getItem('niamke_lang')||'fr').toLowerCase()==='fr';}catch(e){}
var t1=FR?'Parlons de Jésus':'Let’s talk about Jesus';
var t2=FR?'Cliquez ici pour parler de Jésus':'Click here to talk about Jesus';
function go(){try{parent.postMessage({nlj:'go',page:'p4',id:''},'*');}catch(e){}}
if(document.getElementById('nlj-parlons'))return;
var b=document.createElement('button');
b.id='nlj-parlons';b.type='button';b.setAttribute('aria-label',t1+' — '+t2);
b.innerHTML='<img src="../assets/img/ange-parlons.jpg" alt="" width="46" height="46" decoding="async"><span class="nlj-pt"><b>'+t1+'</b><small>'+t2+'</small></span>';
b.addEventListener('click',go);
document.body.appendChild(b);
})();
