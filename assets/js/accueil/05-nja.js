(function(){
if(window.NLJ_AUTH)return;
var D={
fr:{login:"Se connecter",signup:"S'inscrire",email:"Adresse Gmail",pass:"Mot de passe",pass2:"Confirme le mot de passe",first:"Prénom",last:"Nom",age:"Âge",gender:"Sexe",man:"Homme",woman:"Femme",choose:"Choisir…",city:"Ville",country:"Pays",church:"Église / confession",photo:"Ta photo de profil",pick:"Choisir une photo",consent:"J'ai 18 ans ou plus et j'accepte les conditions d'utilisation et la politique de confidentialité.",create:"Créer mon profil en Jésus",enter:"Se connecter en Jésus",forgot:"Mot de passe oublié ?",
badpw:"Mot de passe incorrect",confirm:"Confirme d'abord ton adresse Gmail grâce au message que nous t'avons envoyé.",wait:"Trop de tentatives. Patiente quelques secondes puis réessaie.",rate:"Trop de demandes d'e-mail pour le moment. Réessaie dans une heure ou contacte-nous.",net:"Connexion impossible pour le moment. Vérifie ta connexion internet.",fill:"Merci de remplir tous les champs.",
eEmail:"Entre une adresse Gmail valide (nom@gmail.com).",ePw:"Le mot de passe doit contenir au moins 6 caractères.",ePw2:"Les deux mots de passe ne sont pas identiques.",eAge:"L'âge doit être compris entre 18 et 90 ans.",ePhoto:"Ajoute une photo de profil (image JPG, PNG ou WEBP).",eImg:"Image illisible ou trop lourde. Essaie une autre photo.",eConsent:"Tu dois accepter les conditions pour continuer.",eExists:"Cet email est déjà inscrit : connecte-toi avec ton mot de passe.",eSignup:"Inscription impossible : ",
need:"Connecte-toi pour accéder à la rencontre.",
doneT:"✅ Compte créé ! Ouvre ta boîte Gmail et clique sur le lien de confirmation, puis reviens te connecter ici. Tes informations sont déjà enregistrées.",gmail:"Ouvrir Gmail",reset:"✅ E-mail envoyé : vérifie ta boîte pour choisir un nouveau mot de passe.",resetNeed:"Saisis d'abord ton adresse e-mail.",terms:"conditions",priv:"confidentialité"},
en:{login:"Log in",signup:"Sign up",email:"Gmail address",pass:"Password",pass2:"Confirm password",first:"First name",last:"Last name",age:"Age",gender:"Gender",man:"Man",woman:"Woman",choose:"Choose…",city:"City",country:"Country",church:"Church / denomination",photo:"Your profile photo",pick:"Choose a photo",consent:"I am 18 or older and I accept the terms of use and the privacy policy.",create:"Create my profile in Jesus",enter:"Log in",forgot:"Forgot password?",
badpw:"Incorrect password",confirm:"Please confirm your Gmail address using the message we sent you.",wait:"Too many attempts. Please wait a few seconds and try again.",rate:"Too many email requests right now. Please try again in an hour or contact us.",net:"Unable to connect right now. Check your internet connection.",fill:"Please fill in all fields.",
eEmail:"Enter a valid Gmail address (name@gmail.com).",ePw:"Password must be at least 6 characters.",ePw2:"The two passwords do not match.",eAge:"Age must be between 18 and 90.",ePhoto:"Add a profile photo (JPG, PNG or WEBP image).",eImg:"Image unreadable or too large. Try another photo.",eConsent:"You must accept the terms to continue.",eExists:"This email is already registered: log in with your password.",eSignup:"Sign-up failed: ",
need:"Please log in to access the meeting area.",
doneT:"✅ Account created! Open your Gmail and click the confirmation link, then come back and log in here. Your information is already saved.",gmail:"Open Gmail",reset:"✅ Email sent: check your inbox to choose a new password.",resetNeed:"Enter your email address first.",terms:"terms",priv:"privacy"}
};
function lg(){var l='fr';try{l=(localStorage.getItem('niamke_lang')||'fr').toLowerCase();}catch(e){}return l==='fr'?'fr':'en';}
function t(k){return D[lg()][k]||D.fr[k]||k;}
function $(i){return document.getElementById(i);}
var SB_URL="https://qxxhbfoqlreiqyshbpqp.supabase.co",SB_KEY="sb_publishable_OK9ncVWB2Ih8xZ5fzqEQWg_mSV6vCoe";
/* Adresse Gmail plausible : règles officielles de Google (6 à 30 caractères, lettres/chiffres/points,
    pas de point au début, à la fin ni double point, pas de « + »), et pas un même caractère répété. */
 function validGmail(em){
   var m=/^([a-z0-9.]+)@gmail\.com$/.exec(String(em||'').trim().toLowerCase());
   if(!m)return false;
   var u=m[1];
   if(u.length<6||u.length>30)return false;
   if(u.charAt(0)==='.'||u.charAt(u.length-1)==='.'||u.indexOf('..')>-1)return false;
   if(/^(.)\1+$/.test(u.replace(/\./g,'')))return false;
   return true;
 }
function sb(){try{if(window.__nxsb)return window.__nxsb;if(window.supabase&&window.supabase.createClient){window.__nxsb=(function(){try{return window.parent.supabaseClient}catch(e){}})()||window.supabase.createClient(SB_URL,SB_KEY);return window.__nxsb;}}catch(e){}return null;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

var COUNTRIES=["Sénégal","Côte d'Ivoire","Mali","Burkina Faso","Guinée","Bénin","Togo","Niger","Cameroun","Gabon","Congo","RD Congo","Tchad","Mauritanie","Gambie","Guinée-Bissau","Cap-Vert","Nigeria","Ghana","Liberia","Sierra Leone","Rwanda","Burundi","Madagascar","Maroc","Algérie","Tunisie","Afrique du Sud","Kenya","France","Belgique","Suisse","Canada","États-Unis","Royaume-Uni","Allemagne","Italie","Espagne","Portugal","Brésil","Haïti"];
var built=false,mode='login',fails=0,lock=0,photo=null,busy=false;

var REL=[["Christianisme", [["Catholique", "Catholique", "Catholic"], ["Protestante", "Protestante", "Protestant"], ["Évangélique", "Évangélique", "Evangelical"], ["Pentecôtiste", "Pentecôtiste", "Pentecostal"], ["Adventiste", "Adventiste", "Adventist"], ["Baptiste", "Baptiste", "Baptist"], ["Méthodiste", "Méthodiste", "Methodist"], ["Anglicane", "Anglicane", "Anglican"], ["Orthodoxe", "Orthodoxe", "Orthodox"], ["Église Royaume Universel de Dieu","Église Royaume Universel de Dieu","Église Royaume Universel de Dieu"], ["Autre chrétienne en Jésus", "Autre chrétienne en Jésus", "Other Christian"]], "Christianity"]];
function churchOpts(){
  var l=lg(),h='<option value="">'+esc(t('choose'))+'</option>';
  REL.forEach(function(g){
    var items=g[1].map(function(o){return '<option value="'+esc(o[0])+'">'+esc(l==='fr'?o[1]:o[2])+'</option>';}).join('');
    h+=g[0]?'<optgroup label="'+esc(l==='fr'?g[0]:(g[2]||g[0]))+'">'+items+'</optgroup>':items;
  });
  return h;
}

function build(){
  if(built){return;}built=true;
  var o=document.createElement('div');o.id='nja';o.className='nja-ov';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
  o.innerHTML='<div class="nja-box"><button type="button" class="nja-x" id="nja-x" aria-label="Fermer">&times;</button>'+
  '<div class="nja-tabs"><button type="button" id="nja-tl" data-m="login"></button><button type="button" id="nja-ts" data-m="signup"></button></div>'+
  '<div class="nja-notice" id="nja-notice" style="display:none"></div>'+
  '<form id="nja-login" novalidate autocomplete="on">'+
    '<div class="nja-f"><label for="nja-le"></label><input id="nja-le" type="email" autocomplete="email" inputmode="email"></div>'+
    '<div class="nja-f"><label for="nja-lp"></label><div class="nja-pw"><input id="nja-lp" type="password" autocomplete="current-password"><button type="button" class="nja-eye" data-eye="nja-lp" aria-label="👁">👁</button></div></div>'+
    '<div class="nja-err" id="nja-lerr" role="alert"></div>'+
    '<button class="nja-btn navy" type="submit" id="nja-lb"></button>'+
    '<p style="text-align:center;margin:12px 0 0"><button type="button" class="nja-link" id="nja-forgot"></button></p>'+
  '</form>'+
  '<form id="nja-signup" novalidate autocomplete="on"><div class="nja-g">'+
    '<div class="nja-f"><label for="nja-first"></label><input id="nja-first" autocomplete="given-name" maxlength="40"></div>'+
    '<div class="nja-f"><label for="nja-last"></label><input id="nja-last" autocomplete="family-name" maxlength="40"></div>'+
    '<div class="nja-f"><label for="nja-age"></label><input id="nja-age" type="number" min="18" max="90" inputmode="numeric"></div>'+
    '<div class="nja-f"><label for="nja-gender"></label><select id="nja-gender"></select></div>'+
    '<div class="nja-f"><label for="nja-city"></label><input id="nja-city" autocomplete="address-level2" maxlength="60"></div>'+
    '<div class="nja-f"><label for="nja-country"></label><input id="nja-country" list="nja-cl" autocomplete="country-name" maxlength="60"><datalist id="nja-cl">'+COUNTRIES.map(function(c){return '<option value="'+esc(c)+'">';}).join('')+'</datalist></div>'+
    '<div class="nja-f full"><label for="nja-church"></label><select id="nja-church"></select></div>'+
    '<div class="nja-f full"><label for="nja-photo" id="nja-photol"></label><div class="nja-ph"><label for="nja-photo" class="nja-circle" id="nja-circle">📷<img id="nja-prev" alt=""></label><label for="nja-photo" class="nja-pick" id="nja-pickl"></label><input id="nja-photo" type="file" accept="image/jpeg,image/png,image/webp"></div></div>'+
    '<div class="nja-f full"><label for="nja-se"></label><input id="nja-se" type="email" autocomplete="email" inputmode="email"></div>'+
    '<div class="nja-f"><label for="nja-sp"></label><div class="nja-pw"><input id="nja-sp" type="password" autocomplete="new-password"><button type="button" class="nja-eye" data-eye="nja-sp" aria-label="👁">👁</button></div></div>'+
    '<div class="nja-f"><label for="nja-sp2"></label><input id="nja-sp2" type="password" autocomplete="new-password"></div>'+
  '</div>'+
  '<label class="nja-chk"><input type="checkbox" id="nja-consent"><span id="nja-consentT"></span></label>'+
  '<div class="nja-err" id="nja-serr" role="alert"></div>'+
  '<button class="nja-btn" type="submit" id="nja-sb"></button>'+
  '</form>'+
  '<div id="nja-done" style="display:none"><div class="nja-ok" id="nja-doneT"></div><p style="margin:14px 0 0"><button type="button" class="nja-btn navy" id="nja-gm"></button></p></div></div>';
  document.body.appendChild(o);
  o.addEventListener('mousedown',function(e){if(e.target===o)close();});
  $('nja-x').onclick=close;
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&o.classList.contains('on'))close();});
  [$('nja-tl'),$('nja-ts')].forEach(function(b){b.onclick=function(){setMode(b.getAttribute('data-m'));};});
  o.querySelectorAll('[data-eye]').forEach(function(b){b.onclick=function(){var i=$(b.getAttribute('data-eye'));i.type=i.type==='password'?'text':'password';};});
  $('nja-login').addEventListener('submit',doLogin);
  $('nja-signup').addEventListener('submit',doSignup);
  $('nja-forgot').onclick=doForgot;
  $('nja-gm').onclick=function(){window.open('https://mail.google.com','_blank','noopener,noreferrer');};
  $('nja-photo').addEventListener('change',onPhoto);
  $('nja-consentT').addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(a){e.preventDefault();parent.postMessage({nlj:'legal',doc:a.getAttribute('data-d')},'*');}});
  $('nja-le').value=$('nja-se').value=(function(){try{return localStorage.getItem('nlj_gmail')||'';}catch(e){return '';}})();
}

function labels(){
  var set=function(id,k){var e=$(id);if(e)e.textContent=t(k);};
  set('nja-tl','login');set('nja-ts','signup');
  document.querySelector('label[for=nja-le]').textContent=t('email');
  document.querySelector('label[for=nja-lp]').textContent=t('pass');
  set('nja-lb','enter');set('nja-forgot','forgot');
  [['first','first'],['last','last'],['age','age'],['gender','gender'],['city','city'],['country','country'],['church','church'],['se','email'],['sp','pass'],['sp2','pass2']].forEach(function(p){document.querySelector('label[for=nja-'+p[0]+']').textContent=t(p[1]);});
  set('nja-photol','photo');set('nja-pickl','pick');set('nja-sb','create');set('nja-gm','gmail');set('nja-doneT','doneT');
  $('nja-consentT').innerHTML=esc(t('consent')).replace(lg()==='fr'?"conditions d'utilisation":'terms of use','<a href="#" data-d="terms">'+(lg()==='fr'?"conditions d'utilisation":'terms of use')+'</a>').replace(lg()==='fr'?'politique de confidentialité':'privacy policy','<a href="#" data-d="privacy">'+(lg()==='fr'?'politique de confidentialité':'privacy policy')+'</a>');
  var g=$('nja-gender'),gv=g.value;g.innerHTML='<option value="">'+esc(t('choose'))+'</option><option value="Homme">'+esc(t('man'))+'</option><option value="Femme">'+esc(t('woman'))+'</option>';g.value=gv;
  var c=$('nja-church'),cv=c.value;c.innerHTML=churchOpts();c.value=cv;
}

function setMode(m){
  mode=m;
  $('nja-login').classList.toggle('on',m==='login');
  $('nja-signup').classList.toggle('on',m==='signup');
  $('nja-tl').classList.toggle('on',m==='login');$('nja-ts').classList.toggle('on',m==='signup');
  $('nja-done').style.display='none';
  $('nja-lerr').classList.remove('on');$('nja-serr').classList.remove('on');
  document.querySelector('.nja-tabs').style.display='';
}
function err(id,msg){var e=$(id);e.textContent=msg;e.classList.add('on');}
function noerr(){$('nja-lerr').classList.remove('on');$('nja-serr').classList.remove('on');document.querySelectorAll('#nja .bad').forEach(function(x){x.classList.remove('bad');});}
function goApp(){close();try{parent.postMessage({nlj:'authed'},'*');}catch(e){}}
function close(){var o=$('nja');if(o)o.classList.remove('on');}

/* Si la personne a déjà une session valide, elle va directement sur son profil (page 2) : jamais de ré-inscription */
async function open(m,notice){
  var s=sb();
  try{if(s){var r=await s.auth.getSession();if(r.data&&r.data.session){goApp();return;}}}catch(e){}
  build();labels();setMode(m==='signup'?'signup':'login');
  var n=$('nja-notice');
  if(notice){n.textContent=(notice==='need'||notice===true)?t('need'):String(notice);n.style.display='';}else{n.style.display='none';}
  $('nja').classList.add('on');
  setTimeout(function(){var f=$(mode==='login'?(($('nja-le').value)?'nja-lp':'nja-le'):'nja-first');if(f)f.focus({preventScroll:true});},60);
}

/* ---------- connexion : mot de passe faux = on reste sur la page 1 ---------- */
async function doLogin(e){
  e.preventDefault();if(busy)return;noerr();
  var s=sb(),em=$('nja-le').value.trim().toLowerCase(),pw=$('nja-lp').value;
  if(!s){err('nja-lerr',t('net'));return;}
  if(!em||!pw){err('nja-lerr',t('fill'));return;}
  if(Date.now()<lock){err('nja-lerr',t('wait'));return;}
  busy=true;var b=$('nja-lb');b.disabled=true;
  try{
    var r=await s.auth.signInWithPassword({email:em,password:pw});
    if(r.error||!r.data||!r.data.session){
      var er=r.error||{},m=(er.message||'')+' '+(er.code||'');
      if(er.status===429||/rate|too many/i.test(m)){err('nja-lerr',t('wait'));}
      else if(/not.?confirmed|confirm/i.test(m)){err('nja-lerr',t('confirm'));}
      else if(!er.status||er.status===400||er.status===401||/invalid|credential|password/i.test(m)){
        fails++;if(fails>=5){lock=Date.now()+30000;fails=0;}
        err('nja-lerr',t('badpw'));$('nja-lp').classList.add('bad');$('nja-lp').value='';$('nja-lp').focus();
      }else{err('nja-lerr',t('net'));}
      return;
    }
    fails=0;$('nja-lp').value='';
    try{localStorage.setItem('nlj_gmail',em);}catch(x){}
    goApp();
  }catch(ex){err('nja-lerr',t('net'));}
  finally{busy=false;b.disabled=false;}
}

async function doForgot(){
  noerr();var s=sb(),em=$('nja-le').value.trim().toLowerCase();
  if(!em){err('nja-lerr',t('resetNeed'));return;}
  try{var red;try{red=parent.location.origin+parent.location.pathname;}catch(x){}
    var r=await s.auth.resetPasswordForEmail(em,red?{redirectTo:red}:undefined);
    if(r.error){try{console.error('Mot de passe oublié :',r.error);}catch(z){}var em2=String(r.error.message||'').toLowerCase();err('nja-lerr',(r.error.status===429||/rate limit|too many|over_email/.test(em2))?t('rate'):t('net'));}else{var e=$('nja-lerr');e.textContent=t('reset');e.classList.add('on');e.style.background='#ecfdf5';e.style.borderColor='#a7f3d0';e.style.color='#065f46';setTimeout(function(){e.style.cssText='';},6000);}
  }catch(x){err('nja-lerr',t('net'));}
}

/* ---------- photo : redimensionnée en JPEG ≤ 900 px ---------- */
function onPhoto(){
  var f=this.files&&this.files[0];photo=null;var pv=$('nja-prev');pv.style.display='none';$('nja-circle').classList.remove('has');
  if(!f)return;
  if(!/^image\/(jpeg|png|webp)$/.test(f.type)||f.size>10*1024*1024){err('nja-serr',t('eImg'));this.value='';return;}
  var img=new Image(),u=URL.createObjectURL(f);
  img.onload=function(){
    try{
      var M=900,w=img.naturalWidth,h=img.naturalHeight,k=Math.min(1,M/Math.max(w,h)),c=document.createElement('canvas');
      c.width=Math.round(w*k);c.height=Math.round(h*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      c.toBlob(function(bl){
        URL.revokeObjectURL(u);
        if(!bl||bl.size>3*1024*1024){err('nja-serr',t('eImg'));return;}
        photo={blob:bl,ext:'jpg'};pv.src=URL.createObjectURL(bl);pv.style.display='block';$('nja-circle').classList.add('has');$('nja-serr').classList.remove('on');
      },'image/jpeg',.85);
    }catch(x){err('nja-serr',t('eImg'));}
  };
  img.onerror=function(){URL.revokeObjectURL(u);err('nja-serr',t('eImg'));};
  img.src=u;
}

/* ---------- inscription : Auth (email + mot de passe) + table profiles ---------- */
function sbErr(m){m=String(m||'');var en=lg()==='en';
  if(/rate limit|too many|over_email_send_rate_limit/i.test(m))return en?'Too many sign-up emails sent. Wait about 1 hour, or disable "Confirm email" in Supabase (Authentication > Providers > Email).':'Trop d’e-mails d’inscription envoyés. Patiente environ 1 heure, ou désactive « Confirm email » dans Supabase (Authentication > Providers > Email).';
  if(/row-level security|policy|not authorized|permission|unauthorized|403/i.test(m))return en?'Photo upload blocked by Supabase: run supabase_setup.sql (storage policies).':"Envoi de la photo bloqué par Supabase : exécute le fichier supabase_setup.sql (droits Storage).";
  if(/bucket/i.test(m)&&/not found|exist/i.test(m))return en?'Storage bucket "photos" does not exist in Supabase.':'Le bucket « photos » n’existe pas dans Supabase Storage.';
  if(/failed to fetch|network|load failed/i.test(m))return t('net');
  return m;}
function bad(id){var e=$(id);if(e)e.classList.add('bad');}
async function saveProfile(s,u,f){
  if(!u)return false;
  try{
    var base={name:f.first,age:f.age,gender:f.gender,looking:f.looking,church:f.church,confession:f.church,verse:'',photo_url:f.photo_url};
    var row=Object.assign({last_name:f.last,city:f.city,country:f.country},base);
    var r=await s.from('profiles').update(row).eq('user_id',u.id).select('id');
    for(var q=0;q<6&&r.error;q++){var mm=/'([^']+)' column/.exec(r.error.message||'');if(!mm||!(mm[1] in row))break;console.warn('[NLJ] colonne absente de profiles :',mm[1]);delete row[mm[1]];r=await s.from('profiles').update(row).eq('user_id',u.id).select('id');}
    if(r.error&&/column|schema/i.test(r.error.message||'')){row=base;r=await s.from('profiles').update(row).eq('user_id',u.id).select('id');}
    if(!r.error&&(!r.data||!r.data.length)){
      r=await s.from('profiles').insert([Object.assign({user_id:u.id,email:u.email,status:'approved'},row)]).select('id');
      if(r.error&&/column|schema/i.test(r.error.message||'')){r=await s.from('profiles').insert([Object.assign({user_id:u.id,email:u.email,status:'approved'},base)]).select('id');}
    }
    if(r.error){console.error('[NLJ] profil non enregistré :',r.error.message);return false;}
    return true;
  }catch(e){console.error('[NLJ] profil non enregistré :',e);return false;}
}
async function doSignup(e){
  e.preventDefault();if(busy)return;noerr();
  var s=sb();if(!s){err('nja-serr',t('net'));return;}
  var v=function(i){return $(i).value.trim();};
  var f={first:v('nja-first'),last:v('nja-last'),age:parseInt(v('nja-age'),10),gender:v('nja-gender'),city:v('nja-city'),country:v('nja-country'),church:v('nja-church')},
      em=v('nja-se').toLowerCase(),pw=$('nja-sp').value,pw2=$('nja-sp2').value;
  f.looking=f.gender==='Femme'?'Homme':'Femme';
  var miss=[['nja-first',f.first],['nja-last',f.last],['nja-gender',f.gender],['nja-city',f.city],['nja-country',f.country],['nja-church',f.church]].filter(function(x){return !x[1];});
  if(miss.length){miss.forEach(function(x){bad(x[0]);});err('nja-serr',t('fill'));return;}
  if(!(f.age>=18&&f.age<=90)){bad('nja-age');err('nja-serr',t('eAge'));return;}
  if(!photo){err('nja-serr',t('ePhoto'));return;}
  if(!validGmail(em)){bad('nja-se');err('nja-serr',t('eEmail'));return;}
  if(pw.length<6){bad('nja-sp');err('nja-serr',t('ePw'));return;}
  if(pw!==pw2){bad('nja-sp2');err('nja-serr',t('ePw2'));return;}
  if(!$('nja-consent').checked){err('nja-serr',t('eConsent'));return;}
  busy=true;var b=$('nja-sb');b.disabled=true;
  try{
    var path=Date.now()+'_'+Math.random().toString(36).slice(2)+'.'+photo.ext;
    var up=await s.storage.from('photos').upload(path,photo.blob,{contentType:'image/jpeg',cacheControl:'3600'});
    if(up.error){err('nja-serr',sbErr(up.error.message));return;}
    f.photo_url=s.storage.from('photos').getPublicUrl(path).data.publicUrl;
    var r=await s.auth.signUp({email:em,password:pw,options:{data:{name:f.first,first_name:f.first,last_name:f.last,age:f.age,gender:f.gender,looking:f.looking,city:f.city,country:f.country,church:f.church,confession:f.church,religion:f.church,verse:'',photo_url:f.photo_url}}});
    if(r.error){err('nja-serr',/registered|already|exist/i.test(r.error.message)?t('eExists'):t('eSignup')+sbErr(r.error.message));if(/registered|already|exist/i.test(r.error.message)){$('nja-le').value=em;setMode('login');err('nja-lerr',t('eExists'));}return;}
    if(r.data&&r.data.user&&r.data.user.identities&&r.data.user.identities.length===0){$('nja-le').value=em;setMode('login');err('nja-lerr',t('eExists'));return;}
    try{localStorage.setItem('nlj_gmail',em);}catch(x){}
    var ses=r.data&&r.data.session;
    if(!ses){try{var si=await s.auth.signInWithPassword({email:em,password:pw});if(si.data&&si.data.session)ses=si.data.session;}catch(x){}}
    if(ses){await saveProfile(s,(r.data&&r.data.user)||ses.user,f);goApp();}
    else{$('nja-login').classList.remove('on');$('nja-signup').classList.remove('on');document.querySelector('.nja-tabs').style.display='none';$('nja-done').style.display='';}
  }catch(ex){err('nja-serr',t('eSignup')+(ex&&ex.message?ex.message:''));}
  finally{busy=false;b.disabled=false;}
}

window.NLJ_AUTH={open:open,close:close};
window.addEventListener('message',function(e){
  var d=e.data;if(!d)return;
  if(d.nlj==='auth')open(d.mode||'login',d.notice);
  else if(d.nlj==='scroll'&&(d.id==='login'||d.id==='auth'))open('login');
  else if(d.nlj==='scroll'&&(d.id==='signup'||d.id==='inscription'))open('signup');
});
})();
