/* ===== Mon profil : chargé automatiquement depuis Supabase (profiles) avec l'ID utilisateur ===== */
(function(){
  function $(i){return document.getElementById(i);}
  var CH=["Catholique", "Protestante", "Évangélique", "Pentecôtiste", "Adventiste", "Baptiste", "Méthodiste", "Anglicane", "Orthodoxe", "Église Royaume Universel de Dieu", "Autre chrétienne en Jésus"];
  var uid=null,user=null,busy=false;
  function cli(){try{return (typeof supabaseClient!=='undefined'&&supabaseClient)||null;}catch(e){return null;}}
  function toast(m){try{if(typeof showToast==='function')showToast(m);}catch(e){}}
  function msg(t,ok){var m=$('pfMsg');if(!m)return;m.textContent=t;m.style.display='block';m.style.background=ok?'#ecfdf5':'#fef2f2';m.style.color=ok?'#065f46':'#b91c1c';m.style.border='1px solid '+(ok?'#a7f3d0':'#fecaca');}
  function toLogin(){try{parent.postMessage({nlj:'noauth'},'*');}catch(e){}}

  function fillChurch(val){
    var s=$('pfChurch'),h='<option value="">Choisir…</option>';
    CH.forEach(function(c){h+='<option value="'+c.replace(/"/g,'&quot;')+'">'+c+'</option>';});
    
    s.innerHTML=h;s.value=val||'';
  }
  function photo(url,name){
    var ph=$('pfPh');
    if(url){ph.innerHTML='';var i=new Image();i.alt='';i.className='pf-ph';i.style.cssText='width:100%;height:100%;border-radius:50%;object-fit:cover';i.onerror=function(){ph.textContent=(name||'?').charAt(0).toUpperCase();};i.src=url;ph.appendChild(i);}
    else ph.textContent=(name||'?').charAt(0).toUpperCase();
  }
  var lastP={};
  function esc2(x){return String(x==null?"":x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function renderInfo(p){
    var m=(user&&user.user_metadata)||{};
    function pick(a,b){return (a!=null&&a!=='')?a:(b!=null?b:'');}
    var plan=pick(p.plan,'')||(window.NLJ&&NLJ.plan)||'Découverte';
    var since=p.created_at?new Date(p.created_at).toLocaleDateString('fr-FR'):'';
    var rows=[['Prénom',pick(p.name,m.first_name||m.name)],['Nom',pick(p.last_name,m.last_name)],['Âge',pick(p.age,m.age)?pick(p.age,m.age)+' ans':''],
      ['Sexe',pick(p.gender,m.gender)],['Ville',pick(p.city,m.city)],['Pays',pick(p.country,m.country)],
      ['Église / confession',pick(p.church,m.church||m.confession)],['Verset préféré',pick(p.verse,m.verse)],
      ['Email',(user&&user.email)||p.email||''],['Offre',plan],['Statut',p.status==='approved'?'✅ Vérifié':'⏳ En attente'],['Membre depuis',since]];
    var box=$('pfInfoList');if(!box)return;
    box.innerHTML=rows.filter(function(r){return r[1]!==''&&r[1]!=null;}).map(function(r){return '<div style="background:#fffbe6;border:1px solid #f1e8c6;border-radius:12px;padding:10px 14px"><div style="font-size:.74rem;color:#8b7355;text-transform:uppercase;letter-spacing:.04em">'+r[0]+'</div><div style="font-weight:600;color:#0f172a;word-break:break-word">'+esc2(r[1])+'</div></div>';}).join('');
  }
  function fill(p){
    lastP=p;
    var m=(user&&user.user_metadata)||{};
    function pick(a,b){return (a!=null&&a!=='')?a:(b!=null?b:'');}
    $('pfName').value=pick(p.name,m.first_name||m.name);
    $('pfLast').value=pick(p.last_name,m.last_name);
    $('pfAge').value=pick(p.age,m.age);
    $('pfGender').value=pick(p.gender,m.gender);
    $('pfCity').value=pick(p.city,m.city);
    $('pfCountry').value=pick(p.country,m.country);
    fillChurch(pick(p.church,m.church||m.confession));
    $('pfVerse').value=pick(p.verse,m.verse);
    $('pfEmail').value=(user&&user.email)||p.email||'';
    photo(pick(p.photo_url,m.photo_url),$('pfName').value);
    $('pfSt').textContent=p.status==='approved'?'✅ Profil vérifié et visible dans la rencontre':'⏳ En attente de vérification pastorale';
    try{renderInfo(p);}catch(e){}
    $('pfLoad').style.display='none';$('pfBody').style.display='block';
  }

  /* Profil absent (ex. 1re connexion après confirmation email) : on le crée UNE fois à partir des infos d'inscription */
  async function createFromMeta(){
    var s=cli(),m=user.user_metadata||{};
    var row={user_id:uid,email:user.email,status:'approved',name:m.first_name||m.name||'',last_name:m.last_name||null,age:m.age?parseInt(m.age,10):null,gender:m.gender||null,looking:m.looking||null,church:m.church||m.confession||null,confession:m.church||m.confession||null,verse:m.verse||'',city:m.city||null,country:m.country||null,photo_url:m.photo_url||null};
    var r=await s.from('profiles').insert([row]).select('id,user_id,name,age,gender,looking,church,verse,photo_url,status,created_at').maybeSingle();
    if(r.error&&/column|schema/i.test(r.error.message||'')){
      ['last_name','city','country'].forEach(function(k){delete row[k];});
      r=await s.from('profiles').insert([row]).select('id,user_id,name,age,gender,looking,church,verse,photo_url,status,created_at').maybeSingle();
    }
    return r.data||row;
  }
  async function load(){
    var s=cli();
    if(!s){$('pfLoad').textContent='Service indisponible : vérifie ta connexion internet.';return;}
    var ses=null;try{var g=await s.auth.getSession();ses=g.data&&g.data.session;}catch(e){}
    if(!ses){toLogin();return;}                      /* pas connecté → retour page 1 */
    user=ses.user;uid=user.id;
    try{
      var r=await s.from('profiles').select('id,user_id,name,last_name,age,gender,looking,church,confession,verse,city,country,photo_url,status,plan,points,created_at').eq('user_id',uid).maybeSingle();
      if(r.error&&/column|schema/i.test(r.error.message||'')){r=await s.from('profiles').select('id,user_id,name,age,gender,looking,church,verse,photo_url,status,created_at').eq('user_id',uid).maybeSingle();}
      var p=r.data;
      if(!p&&!r.error)p=await createFromMeta();
      if(!p){$('pfLoad').textContent='Impossible de charger ton profil pour le moment.';return;}
      fill(p);
    }catch(e){$('pfLoad').textContent='Impossible de charger ton profil pour le moment.';}
  }

  async function uploadPhoto(file){
    var s=cli(),ok={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
    if(!ok[file.type]||file.size>3*1024*1024)throw new Error('La photo doit être une image JPG, PNG ou WEBP de 3 Mo maximum.');
    var path=Date.now()+'_'+Math.random().toString(36).slice(2)+'.'+ok[file.type];
    var up=await s.storage.from('photos').upload(path,file,{contentType:file.type});
    if(up.error)throw new Error('Envoi de la photo impossible : '+up.error.message);
    return s.storage.from('photos').getPublicUrl(path).data.publicUrl;
  }

  /* Modification : UPDATE du même profil (user_id) — jamais de nouveau compte */
  async function save(e){
    e.preventDefault();if(busy)return;
    var s=cli();if(!s||!uid){toLogin();return;}
    var v=function(i){return $(i).value.trim();};
    var age=parseInt(v('pfAge'),10),gender=v('pfGender');
    if(!v('pfName')||!v('pfLast')||!gender||!v('pfCity')||!v('pfCountry')||!v('pfChurch')){msg('Merci de remplir : prénom, nom, sexe, ville, pays et église.',false);return;}
    if(!(age>=18&&age<=90)){msg("L'âge doit être compris entre 18 et 90 ans.",false);return;}
    busy=true;var b=$('pfSave');b.disabled=true;b.textContent='Enregistrement…';
    try{
      var patch={name:v('pfName'),last_name:v('pfLast'),age:age,gender:gender,looking:gender==='Femme'?'Homme':'Femme',city:v('pfCity'),country:v('pfCountry'),church:v('pfChurch'),confession:v('pfChurch'),verse:v('pfVerse')};
      var f=$('pfFile').files[0];if(f)patch.photo_url=await uploadPhoto(f);
      var r=await s.from('profiles').update(patch).eq('user_id',uid).select('id');
      var partial=false;
      if(r.error&&/column|schema/i.test(r.error.message||'')){
        ['last_name','city','country'].forEach(function(k){delete patch[k];});partial=true;
        r=await s.from('profiles').update(patch).eq('user_id',uid).select('id');
      }
      if(!r.error&&(!r.data||!r.data.length)){      /* ligne absente : on la crée avec le même user_id */
        r=await s.from('profiles').insert([Object.assign({user_id:uid,email:user.email,status:'approved'},patch)]).select('id');
      }
      if(r.error)throw new Error(r.error.message);
      if(patch.photo_url){photo(patch.photo_url,patch.name);$('pfFile').value='';}
      try{lastP=Object.assign({},lastP,patch);renderInfo(lastP);}catch(e){}
      if(partial)msg("Enregistré, mais nom, ville et pays n'ont pas pu l'être : la base Supabase doit être mise à jour (fichier SQL fourni).",false);
      else{msg('✅ Profil mis à jour.',true);toast('✅ Profil mis à jour');}
    }catch(err){msg('Erreur : '+(err&&err.message?err.message:err),false);}
    finally{busy=false;b.disabled=false;b.textContent='💾 Enregistrer mes modifications';}
  }

  async function out(){
    try{var s=cli();if(s)await s.auth.signOut();}catch(e){}
    try{parent.postMessage({nlj:'logout'},'*');}catch(e){}
  }

  var f=$('profileForm');if(f)f.addEventListener('submit',save);
  var o=$('pfOut');if(o)o.addEventListener('click',out);
  var c=cli();
  if(c){try{c.auth.onAuthStateChange(function(ev){if(ev==='SIGNED_OUT'){try{parent.postMessage({nlj:'logout'},'*');}catch(e){}}});}catch(e){}}
  load();
})();
