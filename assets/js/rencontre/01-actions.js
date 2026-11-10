/* Délégation d'événements : remplace les onclick/onchange inline (CSP sans 'unsafe-inline').
   Liste blanche fermée : seuls les noms ci-dessous sont appelables depuis data-nlj-act / data-nlj-chg. */
(function(){
var A={
  addRandomDemo:function(e,el){return addRandomDemo.apply(null,Array.prototype.slice.call(arguments,2))},
  approveProfile:function(e,el){return approveProfile.apply(null,Array.prototype.slice.call(arguments,2))},
  choosePlan:function(e,el){return choosePlan.apply(null,Array.prototype.slice.call(arguments,2))},
  closeChatPanel:function(e,el){return closeChatPanel.apply(null,Array.prototype.slice.call(arguments,2))},
  closeChatPanelSelf:function(e,el){if(e.target===el)closeChatPanel()},
  closeDeleteModal:function(e,el){return closeDeleteModal.apply(null,Array.prototype.slice.call(arguments,2))},
  closeEditModal:function(e,el){return closeEditModal.apply(null,Array.prototype.slice.call(arguments,2))},
  closePaymentModal:function(e,el){return closePaymentModal.apply(null,Array.prototype.slice.call(arguments,2))},
  closePremium:function(e,el){return closePremium.apply(null,Array.prototype.slice.call(arguments,2))},
  deleteAllDemoProfiles:function(e,el){return deleteAllDemoProfiles.apply(null,Array.prototype.slice.call(arguments,2))},
  deleteProfile:function(e,el){return deleteProfile.apply(null,Array.prototype.slice.call(arguments,2))},
  
  editProfile:function(e,el){return editProfile.apply(null,Array.prototype.slice.call(arguments,2))},
  flipCard:function(e,el){return flipCard.apply(null,Array.prototype.slice.call(arguments,2))},
  goPremiumParent:function(){try{parent.postMessage({nlj:'go',page:'p3'},'*')}catch(e){}},
  likeProfile:function(e,el){return likeProfile.apply(null,Array.prototype.slice.call(arguments,2))},
  openChat:function(e,el){return openChat.apply(null,Array.prototype.slice.call(arguments,2))},
  openPremium:function(e,el){return openPremium.apply(null,Array.prototype.slice.call(arguments,2))},
  payWith:function(e,el){return payWith.apply(null,Array.prototype.slice.call(arguments,2))},
  pmGo:function(e,el){return pmGo.apply(null,Array.prototype.slice.call(arguments,2))},
  quizAnswer:function(e,el){return quizAnswer.apply(null,Array.prototype.slice.call(arguments,2))},
  reportProfile:function(e,el){return reportProfile.apply(null,Array.prototype.slice.call(arguments,2))},
  resetAdminData:function(e,el){return resetAdminData.apply(null,Array.prototype.slice.call(arguments,2))},
  restoreDemo:function(e,el){return restoreDemo.apply(null,Array.prototype.slice.call(arguments,2))},
  saveEdit:function(e,el){return saveEdit.apply(null,Array.prototype.slice.call(arguments,2))},
  scrollPremium:function(){document.getElementById('premium').scrollIntoView({behavior:'smooth'});closeChatPanel()},
  startMemory:function(e,el){return startMemory.apply(null,Array.prototype.slice.call(arguments,2))},
  startQuiz:function(e,el){return startQuiz.apply(null,Array.prototype.slice.call(arguments,2))},
  startVerses:function(e,el){return startVerses.apply(null,Array.prototype.slice.call(arguments,2))},
  verseAnswer:function(e,el){return verseAnswer.apply(null,Array.prototype.slice.call(arguments,2))}
};
function args(el){var a=el.getAttribute('data-nlj-a');if(a==null)return[];try{var r=JSON.parse(decodeURIComponent(a));return Array.isArray(r)?r:[r];}catch(x){return[];}}
function run(attr,ev){for(var el=ev.target;el&&el.nodeType===1;el=el.parentElement){var n=el.getAttribute(attr);
  if(n&&Object.prototype.hasOwnProperty.call(A,n))A[n].apply(el,[ev,el].concat(args(el)));}}
document.addEventListener('click',function(e){run('data-nlj-act',e);});
document.addEventListener('change',function(e){run('data-nlj-chg',e);});
window.NLJA=function(a){return encodeURIComponent(JSON.stringify(a));};
})();
