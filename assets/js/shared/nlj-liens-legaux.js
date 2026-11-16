/* Pied de page : tous les liens légaux ouvrent leur fenêtre (CGU, confidentialité/RGPD, cookies, mentions légales, sécurité, aide, contact).
   Les liens sont repérés par leur texte français dès leur affichage, donc ils marchent aussi après un changement de langue. */
(function(){
var FR=[[/^\s*(cgu|conditions)/i,'terms'],[/confidentialit|^\s*rgpd/i,'privacy'],[/^\s*cookies/i,'cookies'],[/mentions\s*l[ée]gales/i,'mentions'],[/^\s*s[ée]curit[ée]/i,'security'],[/centre d.aide/i,'help'],[/^\s*contact/i,'contact']];
var OT=[[/privacy|datenschutz|privacidad|privacidade|riservatezza|privacidade/i,'privacy'],[/terms|nutzung|términos|termos|termini|voorwaarden|agb/i,'terms'],[/^\s*(contact us|contato|contacto|kontakt|contatti)/i,'contact']];
function tag(){
  var l=document.querySelectorAll('footer a[href="#"]:not([data-lg])');
  for(var i=0;i<l.length;i++){var t=l[i].textContent||'';
    for(var j=0;j<FR.length;j++){if(FR[j][0].test(t)){l[i].setAttribute('data-lg',FR[j][1]);break;}}}
}
tag();
if(window.MutationObserver){var t;new MutationObserver(function(){clearTimeout(t);t=setTimeout(tag,60);}).observe(document.documentElement,{childList:true,subtree:true});}
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a');if(!a)return;
  var h=a.getAttribute('href');if(h&&h!=='#')return;
  var k=a.getAttribute('data-lg');
  if(!k){var tx=a.textContent||'';var all=FR.concat(OT);for(var i=0;i<all.length;i++){if(all[i][0].test(tx)){k=all[i][1];break;}}}
  if(k){e.preventDefault();e.stopPropagation();parent.postMessage({nlj:'legal',doc:k},'*');}
},true);
})();
