/* Délégation d'événements : remplace les onclick/onchange inline (CSP sans 'unsafe-inline').
   Liste blanche fermée : seuls les noms ci-dessous sont appelables depuis data-nlj-act / data-nlj-chg. */
(function(){
var A={
  addPrayer:function(e,el){return addPrayer.apply(null,Array.prototype.slice.call(arguments,2))},
  applyFilters:function(e,el){return applyFilters.apply(null,Array.prototype.slice.call(arguments,2))},
  contactWA:function(e,el){return contactWA.apply(null,Array.prototype.slice.call(arguments,2))},
  deletePrayer:function(e,el){return deletePrayer.apply(null,Array.prototype.slice.call(arguments,2))},
  downloadAll:function(e,el){return downloadAll.apply(null,Array.prototype.slice.call(arguments,2))},
  downloadMusic:function(e,el){return downloadMusic.apply(null,Array.prototype.slice.call(arguments,2))},
  downloadOne:function(e,el){return downloadOne.apply(null,Array.prototype.slice.call(arguments,2))},
  goTo:function(e,el){return goTo.apply(null,Array.prototype.slice.call(arguments,2))},
  togglePrayer:function(e,el){return togglePrayer.apply(null,Array.prototype.slice.call(arguments,2))}
};
function args(el){var a=el.getAttribute('data-nlj-a');if(a==null)return[];try{var r=JSON.parse(decodeURIComponent(a));return Array.isArray(r)?r:[r];}catch(x){return[];}}
function run(attr,ev){for(var el=ev.target;el&&el.nodeType===1;el=el.parentElement){var n=el.getAttribute(attr);
  if(n&&Object.prototype.hasOwnProperty.call(A,n))A[n].apply(el,[ev,el].concat(args(el)));}}
document.addEventListener('click',function(e){run('data-nlj-act',e);});
document.addEventListener('change',function(e){run('data-nlj-chg',e);});
window.NLJA=function(a){return encodeURIComponent(JSON.stringify(a));};
})();
