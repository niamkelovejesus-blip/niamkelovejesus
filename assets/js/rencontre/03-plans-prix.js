(function(){
var $=function(id){return document.getElementById(id)};
var PLANS={"Mensuel":{label:"Mensuel",per:"/ mois",xof:function(){return BASE_PRICES_XOF.mensuel}},"Alliance":{label:"Alliance 6 mois",per:"/ 6 mois",xof:function(){return BASE_PRICES_XOF.semestre}},"Éternelle":{label:"Éternelle 12 mois",per:"/ 12 mois",xof:function(){return BASE_PRICES_XOF.annuel}}};
var METHODS={
 paydunya:{icon:"🔒",name:"Payer en ligne (PayDunya)",sub:"Orange Money, Wave, MTN, Moov, cartes bancaires",how:"Tu vas être redirigé vers la page sécurisée PayDunya pour payer par Orange Money, Wave, MTN MoMo, Moov Money ou carte bancaire. Ton Premium s'active automatiquement dès que le paiement est confirmé."}
};
var pm={plan:"Mensuel",data:null};
var lastFocus=null;
function renderPlans(){
 $("pmPlans").innerHTML=Object.keys(PLANS).map(function(k){var p=PLANS[k];
  return '<label class="pm-plan'+(k===pm.plan?' selected':'')+'"><input type="radio" name="pmPlan" value="'+k+'"'+(k===pm.plan?' checked':'')+'><strong>'+p.label+'</strong><span>'+formatPrice(p.xof())+'</span><small>'+p.per+'</small></label>';}).join("");
 $("pmPlans").querySelectorAll("input").forEach(function(i){i.addEventListener("change",function(){pm.plan=i.value;renderPlans();});});
}
function renderMethods(){
 $("pmMethods").innerHTML=Object.keys(METHODS).map(function(k){var m=METHODS[k];
  return '<button type="button" class="pm-method" data-m="'+k+'"><span class="pm-ico">'+m.icon+'</span><span><strong>'+m.name+'</strong><small>'+m.sub+'</small></span></button>';}).join("");
}
/* clic sur un moyen de paiement : écouteur unique sur le conteneur (survit à la traduction et aux re-rendus) */
function onMethodClick(e){
 var b=e.target&&e.target.closest&&e.target.closest(".pm-method");if(!b)return;
 e.preventDefault();
 try{pmPay(b.getAttribute("data-m")||"paydunya");}
 catch(err){try{console.error("pmPay:",err);}catch(x){}try{showToast("❌ Impossible de lancer le paiement : "+((err&&err.message)||"erreur inconnue"));}catch(x){}}
}
window.pmGo=function(n){
 [1,2,3].forEach(function(i){$("pmStep"+i).hidden=(i!==n);});
 document.querySelectorAll("#premiumModal .pm-steps span").forEach(function(sp){var k=+sp.dataset.s;sp.classList.toggle("active",k===n);sp.classList.toggle("done",k<n);});
 if(n===2){$("pmHello").textContent="Merci "+pm.data.prenom+" ! Choisis ton abonnement puis ton moyen de paiement.";renderPlans();renderMethods();}
 $("premiumModal").querySelector(".modal").scrollTop=0;
};
window.openPremium=function(plan){
 if(window.NLJ_REQUIRE_LOGIN&&!window.NLJ_REQUIRE_LOGIN())return;
 if(plan&&PLANS[plan])pm.plan=plan;
 lastFocus=document.activeElement;
 $("pmError").hidden=true;
 pmGo(1);
 $("premiumModal").classList.add("open");
 document.body.style.overflow="hidden";
 setTimeout(function(){var i=$("pmPrenom");if(i)i.focus();},120);
};
window.closePremium=function(){
 $("premiumModal").classList.remove("open");
 document.body.style.overflow="";
 if(lastFocus&&lastFocus.focus)try{lastFocus.focus();}catch(e){}
};
window.startPayDunya=async function(plan,details){
  var c=(typeof supabaseClient!=="undefined"&&supabaseClient)||null;
  if(!c)throw new Error("Service indisponible. Vérifie ta connexion internet.");
  var s=await c.auth.getSession();
  if(!(s.data&&s.data.session))throw new Error("Connecte-toi d'abord pour payer.");
  var r=await c.functions.invoke("paydunya-create",{body:{plan:plan,details:details||null}});
  if(r.error){
    var msg="Impossible de lancer le paiement. Réessaie dans un instant.";
    try{var j=await r.error.context.json();if(j&&j.error)msg=j.error;}catch(e){}
    throw new Error(msg);
  }
  var url=r.data&&r.data.url;if(url&&String(url).slice(0,8).toLowerCase()!=='https://')url=null;
  if(!url)throw new Error((r.data&&r.data.error)||"Paiement indisponible pour le moment.");
  return url;
};
function goToPayDunya(url){try{window.top.location.href=url;}catch(e){window.open(url,"_blank");}}
function pmPay(method){
  var m=METHODS[method]||METHODS.paydunya,p=PLANS[pm.plan]||PLANS.Mensuel,d=pm.data;
  if(!d){pmGo(1);showToast("Complète d'abord tes informations.");return;}
  var price=formatPrice(p.xof());
  var rows=[["Nom",d.prenom+" "+d.nom],["Ville",d.ville],["Confession",d.eglise],["Âge",d.age+" ans"],["Abonnement",p.label+" · "+price],["Paiement","PayDunya"]];
  var dl=document.createElement("dl");dl.className="pm-recap";
  rows.forEach(function(r){var dt=document.createElement("dt");dt.textContent=r[0];var dd=document.createElement("dd");dd.textContent=r[1];dl.appendChild(dt);dl.appendChild(dd);});
  var box=$("pmRecap");box.replaceWith(dl);dl.id="pmRecap";
  $("pmHow").textContent=m.how;
  var link=$("pmPd"),st=$("pmStatus");
  link.style.display="none";link.removeAttribute("href");
  st.textContent="⏳ Création de ton paiement sécurisé…";
  pmGo(3);
  startPayDunya(pm.plan,d).then(function(url){
    st.textContent="Redirection vers PayDunya…";
    link.href=url;link.style.display="";
    goToPayDunya(url);
  }).catch(function(err){
    st.textContent="❌ "+((err&&err.message)||"Impossible de lancer le paiement. Réessaie.");
  });
}
/* ancienne fenêtre « paymentModal » : tous les boutons passent aussi par PayDunya */
window.payWith=function(){
  var plan=(typeof selectedPlanForPay!=="undefined"&&selectedPlanForPay)||"Mensuel";
  var st=document.getElementById("payStatus");if(st)st.textContent="⏳ Création de ton paiement sécurisé…";
  startPayDunya(plan,null).then(goToPayDunya).catch(function(err){if(st)st.textContent="❌ "+((err&&err.message)||"Paiement indisponible.");});
};
document.addEventListener("DOMContentLoaded",function(){
 $("pmMethods").addEventListener("click",onMethodClick);
 $("pmForm").addEventListener("submit",function(e){
  e.preventDefault();
  var d={prenom:$("pmPrenom").value.trim(),nom:$("pmNom").value.trim(),ville:$("pmVille").value.trim(),eglise:$("pmEglise").value,age:parseInt($("pmAge").value,10)};
  var err="";
  if(!d.prenom||!d.nom)err="Merci d'indiquer ton prénom et ton nom.";
  else if(!d.ville)err="Merci d'indiquer ta ville.";
  else if(!d.age||d.age<18||d.age>75)err="L'âge doit être compris entre 18 et 75 ans.";
  else if(!d.eglise)err="Merci de choisir ton appartenance religieuse.";
  var box=$("pmError");
  if(err){box.textContent=err;box.hidden=false;return;}
  box.hidden=true;pm.data=d;pmGo(2);
 });
 $("premiumModal").addEventListener("click",function(e){if(e.target===this)closePremium();});
 document.addEventListener("keydown",function(e){if(e.key==="Escape"&&$("premiumModal").classList.contains("open"))closePremium();});
 document.querySelectorAll('a[href="#premium"]').forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();openPremium();});});
});
/* les boutons « Choisir » des abonnements ouvrent la même fenêtre */
window.choosePlan=function(plan){
 if(plan==="Découverte")return showToast("✅ Plan Découverte en Jésus activé - Gratuit");
 openPremium(plan);
};
})();
