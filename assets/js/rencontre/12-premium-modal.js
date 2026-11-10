(function(){
function $(i){return document.getElementById(i);}
function db(){try{return (typeof supabaseClient!=='undefined'&&supabaseClient)||null;}catch(e){return null;}}
var uid=null;
/* 1) Guide visible dans la section Premium */
var sec=$('premium'),ct=sec&&sec.querySelector('.container');
if(ct&&!$('pmGuide')){var g=document.createElement('div');g.id='pmGuide';g.className='pm-guide';
g.innerHTML='<h3>💡 Comment devenir Premium ?</h3><ol>'+
'<li><b>Clique sur « Devenir Premium »</b> et choisis ta formule (Mensuel, Alliance ou Éternelle).</li>'+
'<li><b>Tes informations</b> : prénom, âge, ville et confession sont déjà enregistrés à ton inscription, <b>rien à ressaisir</b>. On te demande seulement ce qui manque (par exemple ton nom ou ta ville).</li>'+
'<li><b>Clique sur « Payer »</b> : tu es redirigé vers la page sécurisée PayDunya (Orange Money, Wave, MTN MoMo, Moov Money ou carte Visa / Mastercard).</li>'+
'<li><b>Effectue le paiement</b> : PayDunya confirme automatiquement ton paiement à notre site.</li>'+
'<li><b>Ton Premium est activé automatiquement</b> dès que le paiement est confirmé, sans envoyer de capture ni attendre une vérification manuelle.</li></ol>'+
'<div class="pm-ok">🔒 Le paiement se fait uniquement sur la page sécurisée PayDunya.</div>'+
'<div class="pm-go"><button type="button" class="btn btn-gold" data-nlj-act="openPremium">⭐ Devenir Premium</button></div>';
ct.appendChild(g);}
/* rappel dans l'étape paiement */
if($('pmHello')&&!$('pmMini'))$('pmHello').insertAdjacentHTML('afterend','<div class="pm-mini" id="pmMini"><b>La suite :</b> ① choisis ton abonnement → ② tu es redirigé vers PayDunya → ③ tu paies (Orange Money, Wave, MTN, Moov ou carte) et ton Premium s\'active tout seul.</div>');
/* 2) Pré-remplissage depuis le profil créé à l'inscription */
async function auto(){
 try{
  var c=db();if(!c)return;
  var s=await c.auth.getSession(),u=s.data&&s.data.session&&s.data.session.user;if(!u)return;uid=u.id;
  var r=await c.from('profiles').select('name,last_name,age,city,church,confession').eq('user_id',u.id).maybeSingle(),p=r.data||{},m=u.user_metadata||{};
  var v={pmPrenom:p.name||m.first_name||m.name,pmNom:p.last_name||m.last_name,pmVille:p.city||m.city,pmAge:p.age||m.age,pmEglise:p.church||p.confession||m.church||m.confession},all=true,miss=0;
  Object.keys(v).forEach(function(id){
   var el=$(id),val=String(v[id]==null?'':v[id]).trim(),box=el.closest('div');
   if(id==='pmEglise'&&val&&![].some.call(el.options,function(o){return o.value===val||o.text===val;}))val='';
   if(id==='pmAge'){var a=parseInt(val,10);if(!(a>=18&&a<=75))val='';}
   if(val){el.value=val;box.classList.add('pm-hide');}else{box.classList.remove('pm-hide');all=false;miss++;}
  });
  if(all){$('pmForm').dispatchEvent(new Event('submit',{cancelable:true,bubbles:true}));}
  else{var n=$('pmAutoNote');if(!n){n=document.createElement('p');n.id='pmAutoNote';n.className='pm-mini';$('pmForm').insertAdjacentElement('afterbegin',n);}
   n.textContent='✅ Le reste est déjà enregistré à ton inscription. Complète seulement ce qui manque.';}
 }catch(e){}
}
var op=window.openPremium;
if(typeof op==='function')window.openPremium=function(){op.apply(this,arguments);auto();};
/* 3) Modifier : on réaffiche tous les champs */
var mb=document.querySelector('#pmStep2 .modal-actions button');
if(mb)mb.addEventListener('click',function(){document.querySelectorAll('#pmStep1 .pm-hide').forEach(function(x){x.classList.remove('pm-hide');});});
/* 4) Ce que la personne complète est enregistré dans Supabase */
if($('pmForm'))$('pmForm').addEventListener('submit',function(){setTimeout(async function(){
 try{var c=db();if(!c||!uid||$('pmStep2').hidden)return;
  var row={name:$('pmPrenom').value.trim(),last_name:$('pmNom').value.trim(),city:$('pmVille').value.trim(),age:parseInt($('pmAge').value,10),church:$('pmEglise').value,confession:$('pmEglise').value};
  var r=await c.from('profiles').update(row).eq('user_id',uid);
  if(r.error&&/column|schema/i.test(r.error.message||'')){delete row.last_name;delete row.city;await c.from('profiles').update(row).eq('user_id',uid);}
 }catch(e){}},0);});
})();
