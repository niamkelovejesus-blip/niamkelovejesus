(function(){
/* Bouton flottant « Parlons avec Jésus » : ouvre la page 4 de la coque (pages/parlons-avec-jesus.html) */
var FR=true;try{FR=(localStorage.getItem('niamke_lang')||'fr').toLowerCase()==='fr';}catch(e){}
var label=FR?'Parlons avec Jésus':'Talk with Jesus';
function go(){try{parent.postMessage({nlj:'go',page:'p4',id:''},'*');}catch(e){}}
if(document.getElementById('nlj-parlons'))return;
var b=document.createElement('button');
b.id='nlj-parlons';b.type='button';b.setAttribute('aria-label',label);
b.innerHTML='<span aria-hidden="true">🙏</span><b>'+label+'</b>';
b.addEventListener('click',go);
document.body.appendChild(b);
})();
