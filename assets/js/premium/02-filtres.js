(function(){var $=function(i){return document.getElementById(i)};
function T(){try{return TR[LANG]||TR.FR}catch(e){return {}}}
function lab(){var u=T().f_years||"ans";$("pfMinVal").textContent=$("pfMin").value+" "+u;$("pfMaxVal").textContent=$("pfMax").value+" "+u;}
window.nljFilterLab=lab;
$("pfMin").addEventListener("input",function(){if(+this.value>+$("pfMax").value)this.value=$("pfMax").value;lab();});
$("pfMax").addEventListener("input",function(){if(+this.value<+$("pfMin").value)this.value=$("pfMin").value;lab();});
window.applyFilters=function(){
 if(typeof NLJ_PLAN!=="undefined"&&NLJ_PLAN<1){showToast(T().f_lock||"Les filtres sont inclus dans tous les abonnements Premium.");return;}
 parent.postMessage({nlj:"filters",church:$("pfChurch").value,gender:$("pfGender").value,search:$("pfSearch").value.trim(),ageMin:+$("pfMin").value,ageMax:+$("pfMax").value},"*");};
lab();
})();
