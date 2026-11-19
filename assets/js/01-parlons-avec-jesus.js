const log=document.getElementById("log"),chips=document.getElementById("chips"),form=document.getElementById("f"),inp=document.getElementById("t");
let mode="",busy=false;
/* Bible en ligne (Louis Segond 1910) : cliquer sur une référence ouvre le passage complet dans la Bible */
const bibleUrl=r=>'https://www.biblegateway.com/passage/?search='+encodeURIComponent(String(r).replace(/<[^>]*>/g,'').replace(/&[a-z]+;/g,' ').trim())+'&version=LSG';
const L=r=>'<a class="bl" href="'+bibleUrl(r)+'" target="_blank" rel="noopener noreferrer" title="Lire dans la Bible">'+r+'</a>';
const V=(t,r)=>'<div class="v">« '+t+' »<b>'+(String(r||'').trim()?L(r)+' <span aria-hidden="true">📖</span>':'')+'</b></div>';
const P=t=>'<div class="pr">'+t+'</div>';
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9?\s]/g," ");

function add(cls,html){const d=document.createElement("div");d.className="m "+cls;d.innerHTML=html;log.appendChild(d);log.scrollTop=log.scrollHeight;return d;}
function setChips(l){chips.innerHTML="";l.forEach(([t,f])=>{const b=document.createElement("button");b.type="button";b.textContent=t;b.onclick=()=>{if(busy)return;add("me",esc(t));f();};chips.appendChild(b);});}
function bot(parts,ch){busy=true;chips.innerHTML="";let i=0;(function step(){const d=add("bot dots","<span></span><span></span><span></span>");setTimeout(()=>{d.remove();add("bot",parts[i++]);if(i<parts.length)step();else{busy=false;setChips(ch||[]);}},600);})();}

const J316=V("Car Dieu a tellement aimé le monde qu’il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu’il ait la vie éternelle.","Jean 3:16");
const PH=V("Ne vous inquiétez de rien ; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces. Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ.","Philippiens 4:6-7");
const PH19=V("Et mon Dieu pourvoira à tous vos besoins selon sa richesse, avec gloire, en Jésus-Christ.","Philippiens 4:19");
const PRV=V("Confie-toi en l’Éternel de tout ton cœur, et ne t’appuie pas sur ta sagesse ; reconnais-le dans toutes tes voies, et il aplanira tes sentiers.","Proverbes 3:5-6");
const JN1=V("Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner, et pour nous purifier de toute iniquité.","1 Jean 1:9");
const JOS=V("Ne t’ai-je pas ordonné : Fortifie-toi et prends courage ? Ne t’effraie point, car l’Éternel, ton Dieu, est avec toi dans tout ce que tu entreprendras.","Josué 1:9");

const FAQ={
jesus:{t:"Qui est Jésus ?",k:["qui est jesus","jesus christ","fils de dieu","messie","sauveur"],a:"<p>Jésus est le Fils de Dieu, venu sur terre pour nous montrer l’amour du Père. Il est mort sur la croix pour nos péchés et il est ressuscité le troisième jour : il est vivant.</p>"+V("Jésus lui dit : Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi.","Jean 14:6")},
bible:{t:"Par où lire la Bible ?",k:["lire la bible","par ou commencer","bible","livre","evangile"],a:"<p>La Bible compte 66 livres. Pour commencer, lis l’Évangile de Jean, qui présente Jésus, puis les Psaumes pour prier et les Proverbes pour la sagesse au quotidien. Quelques versets par jour, lus calmement après une courte prière, valent mieux qu’un long passage lu en vitesse.</p>"+V("Toute Écriture est inspirée de Dieu, et utile pour enseigner, pour convaincre, pour corriger, pour instruire dans la justice.","2 Timothée 3:16")},
priere:{t:"Comment prier ?",k:["comment prier","apprendre a prier","notre pere","prier dieu","la priere"],a:"<p>Prier, c’est parler à Dieu comme à un père : remercie-le, confie-lui tes soucis, demande son aide, puis fais silence pour l’écouter. Pas besoin de belles phrases, la sincérité suffit.</p>"+V("Notre Père qui es aux cieux ! Que ton nom soit sanctifié ; que ton règne vienne ; que ta volonté soit faite sur la terre comme au ciel.","Matthieu 6:9-10")},
pardon:{t:"Le pardon de Dieu",k:["peche","pardon de dieu","dieu me pardonne","coupable","honte","erreur"],a:"<p>Dieu pardonne à celui qui vient à lui avec sincérité, quel que soit son passé. Jésus a payé le prix à la croix : tu peux repartir à neuf.</p>"+JN1},
salut:{t:"Être sauvé",s:1,k:["etre sauve","le salut","vie eternelle","sauve par","grace"],a:"<p>Le salut est un don de Dieu : on ne le gagne pas par ses efforts, on le reçoit par la foi en Jésus.</p>"+V("Car c’est par la grâce que vous êtes sauvés, par le moyen de la foi. Et cela ne vient pas de vous, c’est le don de Dieu.","Éphésiens 2:8")},
ciel:{t:"Le ciel et l’enfer",k:["ciel","enfer","paradis","apres la mort","jugement"],a:"<p>La Bible enseigne que Dieu prépare une place auprès de lui pour ceux qui croient en Jésus. Il ne veut pas que quelqu’un se perde : c’est pour cela qu’il a envoyé son Fils.</p>"+J316},
peur:{t:"La peur et l’inquiétude",k:["peur","anxiete","angoisse","stress","inquiet","soucis","decourage"],a:"<p>Dieu t’invite à lui confier ce qui te pèse. Tu n’as pas à tout porter seul(e).</p>"+PH},
souffrance:{t:"Pourquoi la souffrance ?",k:["souffr","epreuve","pourquoi dieu","injustice","malheur"],a:"<p>Dieu n’est pas absent de ta douleur : Jésus lui-même a souffert et il comprend. Nous ne savons pas toujours pourquoi, mais il promet d’être avec nous et d’œuvrer pour le bien, même dans l’épreuve.</p>"+V("Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.","Romains 8:28")},
esprit:{t:"Le Saint-Esprit",k:["saint esprit","esprit saint","esprit de dieu"],a:"<p>Le Saint-Esprit est Dieu présent en nous : il nous guide, nous console et nous transforme de l’intérieur. Sa présence porte du fruit dans notre vie.</p>"+V("Mais le fruit de l’Esprit, c’est l’amour, la joie, la paix, la patience, la bonté, la bénignité, la fidélité, la douceur, la tempérance.","Galates 5:22")},
bapteme:{t:"Le baptême",k:["bapteme","baptise","trinite"],a:"<p>Le baptême est le premier pas public d’un croyant : il montre qu’on est uni à Jésus dans sa mort et sa résurrection. Jésus a demandé à ses disciples de baptiser « au nom du Père, du Fils et du Saint-Esprit » ("+L("Matthieu 28:19")+"). Parle à un pasteur pour t’y préparer.</p>"},
eglise:{t:"Pourquoi aller à l’église ?",k:["eglise","pasteur","communaute","assemblee","culte"],a:"<p>On grandit mieux ensemble : l’église est une famille qui prie, enseigne la Bible et s’entraide.</p>"+V("N’abandonnons pas notre assemblée, comme c’est la coutume de quelques-uns","Hébreux 10:25")},
couple:{t:"Amour et mariage",k:["mariage","couple","rencontre","relation","celibat","fiance","epouse","epoux","petit ami","petite amie"],a:"<p>Confie ta recherche à Dieu dans la prière, avance avec patience et cherche une personne qui aime Jésus et partage tes valeurs. Prenez le temps de bien vous connaître et demandez conseil à des chrétiens mûrs.</p>"+PRV},
pardonner:{t:"Pardonner aux autres",k:["pardonner","rancune","colere","offense","trahi","blesse"],a:"<p>Pardonner ne veut pas dire excuser le mal : c’est choisir de ne plus porter la rancune, avec l’aide de Dieu. C’est un chemin, et tu peux le demander dans la prière.</p>"+V("Soyez bons les uns envers les autres, compatissants, vous pardonnant réciproquement, comme Dieu vous a pardonné en Christ.","Éphésiens 4:32")},
doute:{t:"Quand on doute",k:["doute","croire en dieu","ma foi","pas sur"],a:"<p>Douter n’est pas la fin de la foi : la Bible montre des croyants sincères qui ont connu le doute. Apporte-le à Dieu et cherche des réponses honnêtement.</p>"+V("Je crois ! viens au secours de mon incrédulité !","Marc 9:24")},
argent:{t:"Argent et travail",k:["argent","travail","finance","pauvrete","emploi","chomage","besoin"],a:"<p>Dieu connaît tes besoins. Travaille avec honnêteté, confie-lui ta situation et reste généreux, même avec peu.</p>"+PH19}
};

const PR={
gu:{t:"Guérison",p:"Père céleste, tu es le Dieu qui guérit. Je te présente cette maladie et cette douleur. Touche le corps, apaise le cœur et donne la force et la patience. Que ta volonté s’accomplisse, et donne-nous ta paix pendant l’épreuve. Au nom de Jésus, Amen.",v:V("Il guérit ceux qui ont le cœur brisé, et il panse leurs blessures.","Psaume 147:3")},
pa:{t:"Paix et peur",p:"Seigneur, tu connais mes peurs et mes inquiétudes. Je les dépose à tes pieds. Remplis mon cœur de ta paix et rappelle-moi que tu es avec moi. Je choisis de te faire confiance. Au nom de Jésus, Amen.",v:JOS},
fa:{t:"Famille",p:"Père, je te confie ma famille. Protège chacun, remplis notre maison d’amour, de paix et de pardon. Rapproche les cœurs et rapproche-nous de toi. Au nom de Jésus, Amen.",v:V("Moi et ma maison, nous servirons l’Éternel.","Josué 24:15")},
tr:{t:"Travail et finances",p:"Seigneur, tu connais mes besoins. Ouvre les portes que toi seul peux ouvrir, donne-moi sagesse et persévérance, et pourvois à ce qu’il me faut. Apprends-moi à te faire confiance. Au nom de Jésus, Amen.",v:PH19},
pd:{t:"Pardon",p:"Seigneur, je reconnais mes fautes et je te demande pardon. Purifie mon cœur. Donne-moi aussi la force de pardonner à ceux qui m’ont blessé(e). Merci pour ta grâce. Au nom de Jésus, Amen.",v:JN1},
re:{t:"Relation et mariage",p:"Père, je te confie ma vie de cœur. Guide mes pas, garde-moi de la précipitation et conduis-moi vers ce qui vient de toi. Que mon amour soit bâti sur toi. Au nom de Jésus, Amen.",v:PRV},
me:{t:"Remerciement",p:"Seigneur, merci pour la vie, pour ta fidélité et pour chaque bienfait, connu ou caché. Merci pour Jésus et pour ton amour. Que ma vie te glorifie. Au nom de Jésus, Amen.",v:V("Louez l’Éternel, car il est bon, car sa miséricorde dure à toujours !","Psaume 107:1")}
};


/* Questions modifiables depuis l'admin (table parlons_faq). Si la table est vide ou injoignable, on garde les questions ci-dessus. */
(function(){
  var URL_="https://qxxhbfoqlreiqyshbpqp.supabase.co",KEY="sb_publishable_OK9ncVWB2Ih8xZ5fzqEQWg_mSV6vCoe";
  var ctl=("AbortController" in window)?new AbortController():null,tm=setTimeout(function(){try{ctl&&ctl.abort();}catch(e){}},5000);
  fetch(URL_+"/rest/v1/parlons_faq?select=id,slug,topic,keywords,answer,verse_text,verse_ref,show_salut&visible=eq.true&order=sort.asc,created_at.asc&limit=200",
    {headers:{apikey:KEY},signal:ctl?ctl.signal:undefined})
  .then(function(r){return r.ok?r.json():[];}).then(function(rows){
    clearTimeout(tm);
    if(!Array.isArray(rows)||!rows.length)return;
    var neu={};
    rows.forEach(function(r){
      if(!r||!r.topic)return;
      var paras=String(r.answer||"").split(/\n{2,}/).map(function(x){return x.trim();}).filter(Boolean);
      var a=paras.map(function(x){return "<p>"+esc(x).replace(/\n/g,"<br>")+"</p>";}).join("");
      if(r.verse_text&&String(r.verse_text).trim())a+=V(esc(String(r.verse_text).trim()),esc(String(r.verse_ref||"").trim()));
      var kw=String(r.keywords||"").split(/[,;\n]/).map(function(x){return norm(x).trim();}).filter(function(x){return x.length>=3;});
      neu[r.slug||("db_"+r.id)]={t:r.topic,k:kw,a:a,s:r.show_salut?1:0};
    });
    if(!Object.keys(neu).length)return;
    Object.keys(FAQ).forEach(function(k){delete FAQ[k];});
    Object.keys(neu).forEach(function(k){FAQ[k]=neu[k];});
  }).catch(function(){clearTimeout(tm);});
})();

const MENU=[["📖 Question sur la Bible",bible],["🙏 Prier avec moi",priere],["✝️ Donner ma vie à Jésus",salut],["📜 Lire la Bible",lireBible]];
const tp=k=>[FAQ[k].t,()=>repondre(FAQ[k])];
const keysFaq=n=>Object.keys(FAQ).filter(k=>k!=="salut"||Object.keys(FAQ).length<=n).slice(0,n);

function menu(){mode="";bot(["Que veux-tu faire ?"],MENU);}
function bible(){mode="";bot(["Pose-moi ta question dans la zone de texte, ou choisis un sujet :"],[...keysFaq(8).map(tp),["Menu",menu]]);}
function repondre(e){mode="";bot([e.a],[...(e.s?[["✝️ Donner ma vie à Jésus",salut]]:[]),["Une autre question",bible],["🙏 Prier avec moi",priere],["Menu",menu]]);}

function lireBible(){mode="";bot(["Voici la Bible en ligne (Louis Segond). Touche un livre pour le lire :<ul><li>"+L("Jean 1")+" — l’Évangile qui présente Jésus</li><li>"+L("Psaumes 23")+" — pour prier</li><li>"+L("Proverbes 3")+" — la sagesse au quotidien</li><li>"+L("Matthieu 5")+" — le sermon sur la montagne</li></ul>Tu peux aussi m’écrire une référence, par exemple <i>Jean 3:16</i>, et je t’ouvre le passage."],[["Question sur la Bible",bible],["Menu",menu]]);}
const LIVRES="genese exode levitique nombres deuteronome josue juges ruth 1 samuel 2 samuel 1 rois 2 rois 1 chroniques 2 chroniques esdras nehemie esther job psaume psaumes proverbes ecclesiaste cantique des cantiques esaie isaie jeremie lamentations ezechiel daniel osee joel amos abdias jonas jonas michee nahum habacuc sophonie aggee zacharie malachie matthieu marc luc jean actes romains 1 corinthiens 2 corinthiens galates ephesiens philippiens colossiens 1 thessaloniciens 2 thessaloniciens 1 timothee 2 timothee tite philemon hebreux jacques 1 pierre 2 pierre 1 jean 2 jean 3 jean jude apocalypse";
const estLivre=b=>(" "+LIVRES+" ").includes(" "+b.trim()+" ");
function verset(t){const m=norm(t).trim().replace(/\s+/g," ").match(/^((?:[123] ?)?[a-z]+(?: des [a-z]+)?) (\d{1,3})(?: (\d{1,3})(?: (\d{1,3}))?)?$/);return !!m&&estLivre(m[1].replace(/^([123])(?=[a-z])/,"$1 "));}
const APRES=[["🙏 Amen",amen],["Prier pour autre chose",priere],["Menu",menu]];
function priere(){mode="priere";bot(["Avec joie 🙏 Pour quoi veux-tu que nous priions ? Choisis un sujet, ou écris-le toi-même dans la zone de texte."],Object.keys(PR).map(k=>[PR[k].t,()=>prier(k)]));}
function prier(k){mode="priere";bot(["Prions ensemble. Tu peux lire à voix haute, doucement :",P(PR[k].p)+PR[k].v],APRES);}
function prierLibre(t){bot(["Je prie avec toi :",P("Père céleste, tu connais ce que je porte : « "+esc(t.slice(0,200))+" ». Je le remets entre tes mains. Donne-moi ta paix, ta sagesse et ta force. Je te fais confiance, car tu m’aimes. Au nom de Jésus, Amen.")+V("Déchargez-vous sur lui de tous vos soucis, car lui-même prend soin de vous.","1 Pierre 5:7")],APRES);}
function amen(){mode="";bot(["Amen 🙏 Que la paix de Dieu garde ton cœur. Je reste là si tu veux continuer."],MENU);}

function salut(){mode="";bot(["Quelle belle décision de t’approcher de Jésus 💛 Voici l’essentiel, simplement :","<ul><li><b>Dieu t’aime</b> et veut te donner la vie.</li><li><b>Le péché nous sépare de Dieu</b> : tous ont besoin de pardon.</li><li><b>Jésus a payé pour toi</b> : il est mort sur la croix et il est ressuscité.</li><li><b>Tu reçois ce cadeau par la foi</b>, en l’acceptant de tout ton cœur.</li></ul>"+J316],[["✝️ Je veux donner ma vie à Jésus",decision],["J’ai une question avant",bible],["Pas maintenant",plusTard]]);}
function decision(){bot(["Voici une prière simple. Dis-la avec tes propres mots, ou répète-la du fond du cœur :",P("Seigneur Jésus, je reconnais que j’ai besoin de toi. Je te demande pardon pour mes péchés. Je crois que tu es mort sur la croix pour moi et que Dieu t’a ressuscité. Aujourd’hui, je t’ouvre mon cœur et je te reçois comme mon Sauveur et mon Seigneur. Remplis-moi de ton Esprit et guide ma vie. Merci de m’accepter tel que je suis. Amen.")+V("Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l’a ressuscité des morts, tu seras sauvé.","Romains 10:9")],[["🙏 J’ai prié",fait],["Je ne suis pas encore prêt(e)",plusTard]]);}
function fait(){bot(["🎉 Bienvenue dans la famille de Dieu !"+V("Si quelqu’un est en Christ, il est une nouvelle création. Les choses anciennes sont passées ; voici, toutes choses sont devenues nouvelles.","2 Corinthiens 5:17"),"Pour grandir dans ta foi :<ul><li>Lis chaque jour un passage, en commençant par l’Évangile de Jean.</li><li>Parle à Dieu chaque jour, avec tes mots.</li><li>Rejoins une église et parle à un pasteur ou à un chrétien mûr.</li><li>Fais-toi baptiser quand tu es prêt(e).</li><li>Partage ta décision avec une personne de confiance.</li></ul>"],[["📖 Question sur la Bible",bible],["🙏 Prier pour une situation",priere],["Menu",menu]]);}
function plusTard(){bot(["Aucune pression : Jésus ne te presse pas, il attend avec patience."+V("Voici, je me tiens à la porte, et je frappe. Si quelqu’un entend ma voix et ouvre la porte, j’entrerai chez lui.","Apocalypse 3:20"),"Tu peux revenir quand tu veux, ou me poser tes questions."],[["Poser une question",bible],["Menu",menu]]);}
function crise(){mode="";bot(["Ce que tu traverses a l’air très lourd. Merci de l’avoir écrit. Ta vie a de la valeur et tu n’as pas à porter cela seul(e).","Parle dès maintenant à une personne de confiance près de toi (famille, ami, pasteur), ou appelle les services d’urgence de ton pays si tu es en danger. Je peux aussi prier avec toi."+V("Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos.","Matthieu 11:28")],[["🙏 Prier avec moi",priere],["Menu",menu]]);}

function route(t){
const n=" "+norm(t)+" ",s=n.trim();
if(verset(t)){const r=t.trim();return bot(["Voici le passage dans la Bible 📖"+V("Touche la référence pour lire le texte complet.",esc(r))],[["Question sur la Bible",bible],["Menu",menu]]);}
if(/suicid|me tuer|en finir avec|envie de mourir|veux mourir|veux plus vivre|plus envie de vivre/.test(n))return crise();
if(/donner ma vie|accepter jesus|devenir chretien|me convertir|recevoir jesus|etre sauve|suivre jesus|nouvelle naissance/.test(n))return salut();
if(mode==="priere"&&!/\?|bible|qui est|comment |pourquoi/.test(n))return prierLibre(t);
if(/prie pour|prier pour|prier avec|prie avec|veux prier|priez pour|prions/.test(n))return priere();
if(/^(bonjour|bonsoir|salut|coucou|hello|paix a toi)( jesus)?$/.test(s))return bot(["Bonjour, que la paix de Christ soit avec toi 🙏 Comment puis-je t’aider ?"],MENU);
if(/^(merci|amen|ok|d accord)/.test(s))return bot(["Avec joie 🙏 Que Dieu te bénisse. Que veux-tu faire maintenant ?"],MENU);
let best=null,sc=0;
for(const k in FAQ){let x=0;FAQ[k].k.forEach(w=>{if(n.includes(w))x+=w.length;});if(x>sc){sc=x;best=FAQ[k];}}
if(best&&sc>=4)return repondre(best);
bot(["Je n’ai pas de réponse toute prête à cette question 🙏 Choisis un sujet ci-dessous. Pour aller plus loin, parle à un pasteur ou à un responsable de ton église."],[...keysFaq(6).map(tp),["Menu",menu]]);
}

form.onsubmit=e=>{e.preventDefault();const t=inp.value.trim();if(!t||busy)return;inp.value="";add("me",esc(t));route(t);};

bot(["Paix à toi 🙏 Bienvenue ! Je peux répondre à tes questions sur la Bible, prier avec toi et t’aider à donner ta vie à Jésus.","Je suis un assistant aux réponses préparées, pas Jésus lui-même : pour un accompagnement personnel, rapproche-toi d’un pasteur. Touche une référence biblique (ex. Jean 3:16 📖) pour la lire dans la Bible du site. Que veux-tu faire ?"],MENU);

/* Références bibliques : ouvrent la Bible du site (page 5) au bon verset ; si la coque est absente, le lien biblegateway reste le secours */
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a.bl");if(!a)return;if(window.parent===window)return;e.preventDefault();try{parent.postMessage({nlj:"bible-open",ref:a.textContent.trim()},"*");}catch(x){window.open(a.href,"_blank","noopener");}},true);

/* Intégration au site : retour vers l'accueil (la page est affichée dans la coque index.html) */


/* La barre de traduction de la coque (langues autres que le français) est collée en bas à gauche : on laisse de la place au champ de saisie. */
(function(){try{var h=parent.document.documentElement;function m(){document.body.classList.toggle("nljt",h.classList.contains("nljt-on"));}m();new MutationObserver(m).observe(h,{attributes:true,attributeFilter:["class"]});}catch(e){}})();
/* Croix de fermeture : revient à la page précédente (comme la flèche retour du téléphone) */
(function(){var T=['Fermer','Close','Cerrar','Fechar','Chiudi','Schließen','إغلاق','关闭','Sluiten','Закрыть','Kanga','Funga','बंद करें','Tutup','Isara','닫기','Đóng','Zamknij','Закрити','بند کریں','Închide'],L=['fr','en','es','pt','it','de','ar','zh','nl','ru','ln','sw','hi','id','tl','ko','vi','pl','uk','ur','ro'],l='fr';try{l=(localStorage.getItem('niamke_lang')||'fr').toLowerCase();}catch(e){}var i=L.indexOf(l);if(i<0)i=1;var b=document.getElementById('back');if(!b)return;b.textContent='\u2715';b.setAttribute('aria-label',T[i]);b.setAttribute('title',T[i]);b.onclick=function(e){if(e)e.preventDefault();try{if(parent&&parent!==window&&parent.history.length>1){parent.history.back();return;}}catch(x){}try{parent.postMessage({nlj:'go',page:'p1',id:''},'*');}catch(x){}};})();
