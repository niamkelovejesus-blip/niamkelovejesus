const DEMO_DATA=[]; // Exemplaires comme Sarah supprimés sur demande

// ====== BACKEND SUPABASE - NIAMKE LOVE JESUS ======
const SUPABASE_URL = "https://qxxhbfoqlreiqyshbpqp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_OK9ncVWB2Ih8xZ5fzqEQWg_mSV6vCoe";
let supabaseClient = null;
let USE_SUPABASE = false;
try {
  if (!SUPABASE_URL.includes("TON_PROJET") && typeof supabase !== 'undefined') {
    supabaseClient = (function(){try{return window.parent.supabaseClient}catch(e){}})() || supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    USE_SUPABASE = true;
    console.log("✅ Supabase connecté");
  }
} catch(e) { USE_SUPABASE = false; }

const NLJ_PUB_COLS='id,user_id,name,age,church,confession,verse,gender,looking,status,points,plan,city,country,created_at,photo_url';
const NLJ_PUB_CORE='id,user_id,name,age,church,verse,gender,looking,status,points,plan,created_at,photo_url';
async function backendGetProfiles(){
  if(!USE_SUPABASE) return null;
  let { data, error } = await supabaseClient.from('profiles').select(NLJ_PUB_COLS).eq('status','approved').order('created_at', {ascending:false});
  if(error && /column|schema/i.test(error.message||'')){ ({ data, error } = await supabaseClient.from('profiles').select(NLJ_PUB_CORE).eq('status','approved').order('created_at', {ascending:false})); }
  if(error){ console.warn('profiles (lecture):', error.message); return null; }
  return data.map(p=>({ id:p.id, user_id:p.user_id, name:p.name, age:p.age, church:p.church, confession:p.confession||p.church, verse:p.verse, gender:p.gender, looking:p.looking, email:'', status:p.status, points:p.points||0, plan:p.plan||'Découverte', city:p.city||'', country:p.country||'', since:p.created_at||'', photo:p.photo_url||"" }));
}
async function backendAddProfile(p, photoFile){
  if(!USE_SUPABASE) return false;
  let photo_url = "";
  if(photoFile){
    const fileName = Date.now()+'_'+photoFile.name;
    const { error: upErr } = await supabaseClient.storage.from('photos').upload(fileName, photoFile);
    if(!upErr){ const { data } = supabaseClient.storage.from('photos').getPublicUrl(fileName); photo_url = data.publicUrl; }
  }
  const { error } = await supabaseClient.from('profiles').insert([{ name:p.name, age:p.age, church:p.church, verse:p.verse, gender:p.gender, looking:p.looking, email:p.email, status:'approved', points:0, plan:'Découverte', photo_url }]);
  return !error;
}
async function backendRecordPayment(email, plan, amount, provider){
  if(!USE_SUPABASE) return false;
  const { error } = await supabaseClient.from('payments').insert([{email, plan, amount, provider, status:'pending'}]);
  return !error;
}
const PAYMENT_CONFIG={whatsapp:"221772919300",whatsapp_display:"+221 77 291 93 00",email:"niamkelovejesus@gmail.com"};
// ====== FIN BACKEND ======

// PERSISTANCE - Les suppressions ne reviennent plus
const STORAGE_KEY="niamke_love_profiles_v3_sans_exemple_jesus";
let profiles;
try{
const saved=localStorage.getItem(STORAGE_KEY);
if(saved){
profiles=JSON.parse(saved);
console.log("Profils chargés depuis localStorage - suppressions conservées en Jésus");
}else{
profiles=JSON.parse(JSON.stringify(DEMO_DATA));
localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}
}catch(e){
profiles=JSON.parse(JSON.stringify(DEMO_DATA));
}
function saveProfiles(){
try{localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));}catch(e){console.log("Erreur sauvegarde",e);}
}

function escapeHTML(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}

let currentChatUser=null;let editingIndex=null;let deletingIndex=null;let deletingAll=false;

// LANG - TRADUCTION COMPLÈTE 6 LANGUES - JÉSUS AU CENTRE
const I18N={
fr:{
choose:"Choisir cette formule",free:"Gratuit",navHome:"Accueil",navMeet:"Rencontre",navVerses:"Versets Jésus",navGame:"Jeu Biblique",navMusic:"Musique",navMod:"Modération",navPremium:"Premium",
heroBadge:"✝️ Jésus-Christ est le Chemin - 2026",heroTitle:"Jésus-Christ au centre pour trouver une alliance éternelle selon Dieu.",heroDesc:"<strong>Jésus-Christ est le fondement.</strong> Vérification pastorale, étude biblique sur Jésus, chat prière au nom de Jésus et jeux bibliques sur Jésus. L'amour a Jésus au centre.",
btnDiscover:"Découvrir les profils en Jésus",btnVerses:"Versets sur Jésus",verseDayTitle:"✝️ Verset du jour - Jésus",verseDayText:"« Jésus-Christ est le même hier, aujourd'hui et éternellement - Il est notre modèle d'amour »",verseDayCite:"Hébreux 13:8 & 1 Corinthiens 13:4 — Jésus, fondement de chaque alliance",
meetTitle:"Rencontre en Jésus-Christ",meetLead:"Chaque profil affiche le nom, l'âge et la ville. Filtre par âge (entre X et Y), église et genre.",
churchAll:"Toutes les confessions en Jésus",genderAll:"Tous genres",searchPh:"Rechercher prénom, verset Jésus...",
ageMinLabel:"Âge minimum :",ageMaxLabel:"Âge maximum :",ageTo:"à",
loginTitle:"Connexion en Jésus",loginBtn:"Se connecter en Jésus",registerTitle:"Inscription - Rejoins l'alliance en Jésus",registerBtn:"Créer mon profil en Jésus",
versesTitle:"📖 Bibliothèque de Versets - Jésus au Centre",versesLead:"Tous ces versets parlent de Jésus-Christ. Clique pour copier le verset. Jésus est au centre de chaque alliance.",
gameTitle:"Jeu Biblique sur Jésus 🎮",gameLead:"25 questions sur Jésus et le mariage, 12 versets de Jésus, 12 couples bibliques.",
musicTitle:"Musique Chrétienne - Jésus",musicLead:"Chants pour Jésus-Christ, notre Époux céleste.",uploadTitle:"🎵 Téléverser des chants pour Jésus",uploadBtn:"Ajouter pour Jésus",
modTitle:"Modération en Jésus",modLead:"Gère les profils en Jésus. Modifie ou supprime. Les suppressions ne reviennent plus.",
premiumTitle:"Abonnements en Jésus - Prix CFA",premiumLead:"Prix pensés pour l'Afrique, centrés sur Jésus. 9 000 F / 15 000 F / 30 000 F",paymentTitle:"Paiement pour l'œuvre de Jésus",
footerDesc:"Rencontre chrétienne centrée sur Jésus-Christ. Jésus au centre. 10 langues. Suppressions définitives."
},
en:{
choose:"Choose in Jesus",free:"Free",navHome:"Home",navMeet:"Meet",navVerses:"Jesus Verses",navGame:"Bible Game",navMusic:"Music",navMod:"Moderation",navPremium:"Premium",
heroBadge:"✝️ Jesus Christ is the Way - 2026",heroTitle:"Jesus Christ at the center to find an eternal covenant according to God.",heroDesc:"<strong>Jesus Christ is the foundation.</strong> Pastoral verification, Bible study on Jesus, prayer chat in Jesus' name and Bible games about Jesus. Love has no city, it has Jesus at the center.",
btnDiscover:"Discover profiles in Jesus",btnVerses:"Verses about Jesus",verseDayTitle:"✝️ Verse of the day - Jesus",verseDayText:"« Jesus Christ is the same yesterday, today and forever - He is our model of love »",verseDayCite:"Hebrews 13:8 & 1 Corinthians 13:4 — Jesus, foundation of every covenant",
meetTitle:"Meeting in Jesus Christ",meetLead:"No more cities! We search in Jesus, not by neighborhood. Filter by age (between X and Y), church and gender.",
churchAll:"All confessions in Jesus",genderAll:"All genders",searchPh:"Search first name, Jesus verse...",
ageMinLabel:"Minimum age:",ageMaxLabel:"Maximum age:",ageTo:"to",
loginTitle:"Login in Jesus",loginBtn:"Login in Jesus",registerTitle:"Registration - Join the covenant in Jesus",registerBtn:"Create my profile in Jesus",
versesTitle:"📖 Library of Verses - Jesus at the Center",versesLead:"All these verses speak about Jesus Christ. Click to copy. Jesus is at the center of every covenant.",
gameTitle:"Bible Game about Jesus 🎮",gameLead:"25 questions about Jesus and marriage, 12 verses of Jesus, 12 biblical couples.",
musicTitle:"Christian Music - Jesus",musicLead:"Songs for Jesus Christ, our heavenly Bridegroom.",uploadTitle:"🎵 Upload songs for Jesus",uploadBtn:"Add for Jesus",
modTitle:"Moderation in Jesus",modLead:"Manage profiles in Jesus. Edit or delete. Deletions are permanent.",
premiumTitle:"Subscriptions in Jesus - CFA Price",premiumLead:"Prices designed for Africa, centered on Jesus. 9,000 F / 15,000 F / 30,000 F",paymentTitle:"Payment for the work of Jesus",
footerDesc:"Christian dating centered on Jesus Christ. No more cities, just Jesus at the center. 6 languages. Permanent deletions."
},
es:{
choose:"Elegir en Jesús",free:"Gratis",navHome:"Inicio",navMeet:"Encuentro",navVerses:"Versículos Jesús",navGame:"Juego Bíblico",navMusic:"Música",navMod:"Moderación",navPremium:"Premium",
heroBadge:"✝️ Jesucristo es el Camino - 2026",heroTitle:"Jesucristo en el centro para encontrar una alianza eterna según Dios.",heroDesc:"<strong>Jesucristo es el fundamento.</strong> Verificación pastoral, estudio bíblico sobre Jesús, chat de oración en el nombre de Jesús y juegos bíblicos sobre Jesús.",
btnDiscover:"Descubrir perfiles en Jesús",btnVerses:"Versículos sobre Jesús",verseDayTitle:"✝️ Versículo del día - Jesús",verseDayText:"« Jesucristo es el mismo ayer, hoy y por los siglos - Él es nuestro modelo de amor »",verseDayCite:"Hebreos 13:8 & 1 Corintios 13:4 — Jesús, fundamento de cada alianza",
meetTitle:"Encuentro en Jesucristo",meetLead:"¡No más ciudades! Buscamos en Jesús, no por barrio. Filtra por edad, iglesia y género.",
churchAll:"Todas las iglesias",genderAll:"Todos los géneros",searchPh:"Buscar nombre, versículo Jesús...",
ageMinLabel:"Edad mínima:",ageMaxLabel:"Edad máxima:",ageTo:"a",
loginTitle:"Conexión en Jesús",loginBtn:"Conectarse en Jesús",registerTitle:"Inscripción - Únete a la alianza en Jesús",registerBtn:"Crear mi perfil en Jesús",
versesTitle:"📖 Biblioteca de Versículos - Jesús en el Centro",versesLead:"Todos estos versículos hablan de Jesucristo. Haz clic para copiar.",
gameTitle:"Juego Bíblico sobre Jesús 🎮",gameLead:"25 preguntas sobre Jesús y matrimonio, 12 versículos de Jesús, 12 parejas bíblicas.",
musicTitle:"Música Cristiana - Jesús",musicLead:"Cantos para Jesucristo, nuestro Esposo celestial.",uploadTitle:"🎵 Subir cantos para Jesús",uploadBtn:"Añadir para Jesús",
modTitle:"Moderación en Jesús",modLead:"Gestiona perfiles en Jesús. Edita o elimina. Eliminaciones permanentes.",
premiumTitle:"Suscripciones en Jesús - Precio CFA",premiumLead:"Precios pensados para África, centrados en Jesús.",paymentTitle:"Pago para la obra de Jesús",
footerDesc:"Encuentro cristiano centrado en Jesucristo. Sin ciudades, solo Jesús en el centro."
},
pt:{
choose:"Escolher em Jesus",free:"Grátis",navHome:"Início",navMeet:"Encontro",navVerses:"Versículos Jesus",navGame:"Jogo Bíblico",navMusic:"Música",navMod:"Moderação",navPremium:"Premium",
heroBadge:"✝️ Jesus Cristo é o Caminho - 2026",heroTitle:"Jesus Cristo no centro para encontrar uma aliança eterna segundo Deus.",heroDesc:"<strong>Jesus Cristo é o fundamento.</strong> Verificação pastoral, estudo bíblico sobre Jesus, chat de oração em nome de Jesus.",
btnDiscover:"Descobrir perfis em Jesus",btnVerses:"Versículos sobre Jesus",verseDayTitle:"✝️ Versículo do dia - Jesus",verseDayText:"« Jesus Cristo é o mesmo ontem, hoje e eternamente - Ele é nosso modelo de amor »",verseDayCite:"Hebreus 13:8 & 1 Coríntios 13:4 — Jesus, fundamento de cada aliança",
meetTitle:"Encontro em Jesus Cristo",meetLead:"Sem mais cidades! Buscamos em Jesus, não por bairro. Filtre por idade, igreja e gênero.",
churchAll:"Todas as igrejas",genderAll:"Todos os gêneros",searchPh:"Pesquisar nome, versículo Jesus...",
ageMinLabel:"Idade mínima:",ageMaxLabel:"Idade máxima:",ageTo:"a",
loginTitle:"Conexão em Jesus",loginBtn:"Conectar em Jesus",registerTitle:"Inscrição - Junte-se à aliança em Jesus",registerBtn:"Criar meu perfil em Jesus",
versesTitle:"📖 Biblioteca de Versículos - Jesus no Centro",versesLead:"Todos esses versículos falam de Jesus Cristo. Clique para copiar.",
gameTitle:"Jogo Bíblico sobre Jesus 🎮",gameLead:"25 perguntas sobre Jesus e casamento, 12 versículos de Jesus, 12 casais bíblicos.",
musicTitle:"Música Cristã - Jesus",musicLead:"Cânticos para Jesus Cristo, nosso Noivo celestial.",uploadTitle:"🎵 Enviar cânticos para Jesus",uploadBtn:"Adicionar para Jesus",
modTitle:"Moderação em Jesus",modLead:"Gerencie perfis em Jesus. Edite ou exclua. Exclusões permanentes.",
premiumTitle:"Assinaturas em Jesus - Preço CFA",premiumLead:"Preços pensados para a África, centrados em Jesus.",paymentTitle:"Pagamento para a obra de Jesus",
footerDesc:"Encontro cristão centrado em Jesus Cristo. Sem cidades, apenas Jesus no centro."
},
ar:{
choose:"اختيار في يسوع",free:"مجاني",navHome:"الرئيسية",navMeet:"لقاء",navVerses:"آيات يسوع",navGame:"لعبة كتابية",navMusic:"موسيقى",navMod:"إشراف",navPremium:"اشتراك",
heroBadge:"✝️ يسوع المسيح هو الطريق - 2026",heroTitle:"يسوع المسيح في المركز لإيجاد عهد أبدي حسب الله.",heroDesc:"<strong>يسوع المسيح هو الأساس.</strong> تحقق رعوي، دراسة كتابية عن يسوع، دردشة صلاة باسم يسوع.",
btnDiscover:"اكتشاف الملفات في يسوع",btnVerses:"آيات عن يسوع",verseDayTitle:"✝️ آية اليوم - يسوع",verseDayText:"« يسوع المسيح هو هو أمسا واليوم وإلى الأبد - هو نموذجنا للمحبة »",verseDayCite:"عبرانيين 13:8 & 1 كورنثوس 13:4 — يسوع، أساس كل عهد",
meetTitle:"لقاء في يسوع المسيح",meetLead:"لا مزيد من المدن! نبحث في يسوع، ليس حسب الحي. فلترة حسب العمر والكنيسة والجنس.",
churchAll:"جميع الكنائس",genderAll:"جميع الأجناس",searchPh:"بحث عن اسم، آية يسوع...",
ageMinLabel:"الحد الأدنى للعمر:",ageMaxLabel:"الحد الأقصى للعمر:",ageTo:"إلى",
loginTitle:"تسجيل دخول في يسوع",loginBtn:"تسجيل دخول في يسوع",registerTitle:"تسجيل - انضم إلى العهد في يسوع",registerBtn:"إنشاء ملفي في يسوع",
versesTitle:"📖 مكتبة الآيات - يسوع في المركز",versesLead:"كل هذه الآيات تتحدث عن يسوع المسيح. انقر للنسخ.",
gameTitle:"لعبة كتابية عن يسوع 🎮",gameLead:"25 سؤالا عن يسوع والزواج، 12 آية ليسوع، 12 زوجا كتابيا.",
musicTitle:"موسيقى مسيحية - يسوع",musicLead:"ترانيم ليسوع المسيح، عريسنا السماوي.",uploadTitle:"🎵 تحميل ترانيم ليسوع",uploadBtn:"إضافة ليسوع",
modTitle:"إشراف في يسوع",modLead:"إدارة الملفات في يسوع. تعديل أو حذف. الحذف نهائي.",
premiumTitle:"اشتراكات في يسوع - سعر فرنك أفريقي",premiumLead:"أسعار مصممة لأفريقيا، تتمحور حول يسوع.",paymentTitle:"دفع لعمل يسوع",
footerDesc:"لقاء مسيحي يتمحور حول يسوع المسيح. لا مدن، فقط يسوع في المركز."
},
it:{
choose:"Scegli in Gesù",free:"Gratis",navHome:"Home",navMeet:"Incontro",navVerses:"Versetti Gesù",navGame:"Gioco Biblico",navMusic:"Musica",navMod:"Moderazione",navPremium:"Premium - GRATUIT vs PREMIUM",
heroBadge:"✝️ Gesù Cristo è la Via - 2026",heroTitle:"Gesù Cristo al centro per trovare un'alleanza eterna secondo Dio.",heroDesc:"<strong>Gesù Cristo è il fondamento.</strong> Verifica pastorale, studio biblico su Gesù, chat di preghiera nel nome di Gesù e giochi biblici su Gesù. L'amore non ha città, ha Gesù al centro.",
btnDiscover:"Scopri profili in Gesù",btnVerses:"Versetti su Gesù - GRATUIT",verseDayTitle:"✝️ Versetto del giorno - Gesù",verseDayText:"« Gesù Cristo è lo stesso ieri, oggi e in eterno - Lui è il nostro modello d'amore »",verseDayCite:"Ebrei 13:8 & 1 Corinzi 13:4 — Gesù, fondamento di ogni alleanza",
meetTitle:"Incontro in Gesù Cristo - TCHAT PREMIUM 🔒",meetLead:"Più città ! Cerchiamo in Gesù, non per quartiere. Filtra per età, chiesa e genere. Giochi e musica GRATUITI, tchat Premium.",
churchAll:"Tutte le confessioni in Gesù",genderAll:"Tutti i generi",searchPh:"Cerca nome, versetto Gesù...",
ageMinLabel:"Età minima:",ageMaxLabel:"Età massima:",ageTo:"a",
loginTitle:"Accesso in Gesù",loginBtn:"Accedi in Gesù",registerTitle:"Iscrizione - Unisciti all'alleanza in Gesù",registerBtn:"Crea il mio profilo in Gesù",
versesTitle:"📖 Biblioteca di Versetti - GRATUIT ✅",versesLead:"Tutti questi versetti parlano di Gesù Cristo. Clicca per copiare. GRATUIT en Jésus.",
gameTitle:"Gioco Biblico su Gesù 🎮 - GRATUIT ✅",gameLead:"25 domande su Gesù e il matrimonio, 12 versetti di Gesù, 12 coppie bibliche. GRATUIT",
musicTitle:"Musica Cristiana - GRATUIT ✅",musicLead:"Canti per Gesù Cristo, nostro Sposo celeste. GRATUIT",uploadTitle:"🎵 Carica canti per Gesù",uploadBtn:"Aggiungi per Gesù",
modTitle:"Moderazione in Gesù",modLead:"Gestisci profili in Gesù. Modifica o elimina. Les suppressions ne reviennent plus.",
premiumTitle:"Abonnements en Jésus - Prix CFA",premiumLead:"Prix pensés pour l'Afrique, centrés sur Jésus. 9 000 F / 15 000 F / 30 000 F - TCHAT PREMIUM",paymentTitle:"Paiement pour l'œuvre de Jésus",
footerDesc:"Incontro cristiano centrato su Gesù Cristo. 8 lingue. Giochi/Musica/Bibbia GRATUIT, Tchat PREMIUM."
},
de:{
choose:"In Jesus wählen",free:"Kostenlos",navHome:"Start",navMeet:"Treffen",navVerses:"Jesus-Verse",navGame:"Bibelspiel",navMusic:"Musik",navMod:"Moderation",navPremium:"Premium - KOSTENLOS vs PREMIUM",
heroBadge:"✝️ Jesus Christus ist der Weg - 2026",heroTitle:"Jesus Christus im Zentrum, um einen ewigen Bund nach Gott zu finden.",heroDesc:"<strong>Jesus Christus ist das Fundament.</strong> Pastorale Prüfung, Bibelstudium über Jesus, Gebetschat im Namen Jesu und Bibelspiele über Jesus.",
btnDiscover:"Profile in Jesus entdecken",btnVerses:"Verse über Jesus - KOSTENLOS",verseDayTitle:"✝️ Vers des Tages - Jesus",verseDayText:"« Jesus Christus ist derselbe gestern, heute und in Ewigkeit - Er ist unser Vorbild der Liebe »",verseDayCite:"Hebräer 13:8 & 1. Korinther 13:4 — Jesus, Fundament jedes Bundes",
meetTitle:"Begegnung in Jesus Christus - PREMIUM CHAT 🔒",meetLead:"Keine Städte mehr! Wir suchen in Jesus, nicht nach Stadtteil. Filter nach Alter, Kirche und Geschlecht. Spiele und Musik KOSTENLOS, Chat Premium.",
churchAll:"Alle Bekenntnisse in Jesus",genderAll:"Alle Geschlechter",searchPh:"Name suchen, Jesus-Vers...",
ageMinLabel:"Mindestalter:",ageMaxLabel:"Höchstalter:",ageTo:"bis",
loginTitle:"Anmeldung in Jesus",loginBtn:"In Jesus anmelden",registerTitle:"Registrierung - Tritt dem Bund in Jesus bei",registerBtn:"Mein Profil in Jesus erstellen",
versesTitle:"📖 Versbibliothek - KOSTENLOS ✅",versesLead:"Alle diese Verse sprechen von Jesus Christus. Klicken zum Kopieren. KOSTENLOS in Jesus.",
gameTitle:"Bibelspiel über Jesus 🎮 - KOSTENLOS ✅",gameLead:"25 Fragen über Jesus und Ehe, 12 Verse von Jesus, 12 biblische Paare. KOSTENLOS",
musicTitle:"Christliche Musik - KOSTENLOS ✅",musicLead:"Lieder für Jesus Christus, unseren himmlischen Bräutigam. KOSTENLOS",uploadTitle:"🎵 Lieder für Jesus hochladen",uploadBtn:"Für Jesus hinzufügen",
modTitle:"Moderation in Jesus",modLead:"Profile in Jesus verwalten. Bearbeiten oder löschen. Löschungen sind endgültig.",
premiumTitle:"Abos in Jesus - CFA Preis",premiumLead:"Preise für Afrika gedacht, zentriert auf Jesus. 9 000 F / 15 000 F / 30 000 F - PREMIUM CHAT",paymentTitle:"Zahlung für das Werk Jesu",
footerDesc:"Christliches Treffen zentriert auf Jesus Christus. 8 Sprachen. Spiele/Musik/Bibel KOSTENLOS, Chat PREMIUM."
},
nl:{
choose:"Kies in Jezus",free:"Gratis",navHome:"Home",navMeet:"Ontmoeting",navVerses:"Jezus Verzen",navGame:"Bijbelspel",navMusic:"Muziek",navMod:"Moderatie",navPremium:"Premium",
heroBadge:"✝️ Jezus Christus is de Weg - 2026",heroTitle:"Jezus Christus in het centrum om een eeuwig verbond naar God te vinden.",
heroDesc:"Jezus Christus is het fundament. Pastorale verificatie, Bijbelstudie, gebedschat en Bijbelspellen. Liefde heeft Jezus in het centrum.",
btnDiscover:"Profielen in Jezus ontdekken",btnVerses:"Verzen over Jezus - GRATIS",
meetTitle:"Ontmoeting in Jezus Christus - PREMIUM CHAT 🔒",meetLead:"Spellen en muziek GRATIS, chat Premium.",
versesTitle:"📖 Verzenbibliotheek - GRATIS ✅",versesLead:"GRATIS in Jezus.",
gameTitle:"Bijbelspel over Jezus 🎮 - GRATIS ✅",gameLead:"25 vragen over Jezus en huwelijk. GRATIS",
musicTitle:"Christelijke Muziek - GRATIS ✅",musicLead:"Liederen voor Jezus Christus. GRATIS",
premiumTitle:"Abonnementen in Jezus - CFA Prijs",premiumLead:"9 000 F / 15 000 F / 30 000 F - PREMIUM CHAT",
footerDesc:"Christelijke ontmoeting gecentreerd op Jezus Christus. 9 talen. Spellen/Muziek/Bijbel GRATIS, Chat PREMIUM."
},
ru:{choose:"Выбрать в Иисусе",free:"Бесплатно",navHome:"Главная",navMeet:"Встреча",navVerses:"Стихи Иисуса",navGame:"Библейская игра",navMusic:"Музыка",navMod:"Модерация",navPremium:"Премиум",heroBadge:"✝️ Иисус Христос — Путь - 2026",heroTitle:"Иисус Христос в центре",heroDesc:"Иисус Христос — основание.",btnDiscover:"Найти профили в Иисусе",btnVerses:"Стихи об Иисусе - БЕСПЛАТНО",meetTitle:"Встреча в Иисусе Христе - ПРЕМИУМ ЧАТ 🔒",meetLead:"Игры и музыка БЕСПЛАТНО, чат Премиум.",versesTitle:"📖 Библиотека стихов - БЕСПЛАТНО ✅",versesLead:"БЕСПЛАТНО в Иисусе.",gameTitle:"Библейская игра об Иисусе 🎮 - БЕСПЛАТНО ✅",gameLead:"25 вопросов. БЕСПЛАТНО",musicTitle:"Христианская музыка - БЕСПЛАТНО ✅",musicLead:"Песни для Иисуса. БЕСПЛАТНО",premiumTitle:"Подписки в Иисусе",premiumLead:"9 000 F / 15 000 F / 30 000 F",footerDesc:"10 языков. Игры/Музыка/Библия БЕСПЛАТНО, Чат ПРЕМИУМ."},
zh:{

choose:"在耶稣里选择",free:"免费",navHome:"首页",navMeet:"相遇",navVerses:"耶稣经文",navGame:"圣经游戏",navMusic:"音乐",navMod:"管理",navPremium:"高级 - 免费 vs 高级",
heroBadge:"✝️ 耶稣基督是道路 - 2026",heroTitle:"耶稣基督为中心，按照神的心意找到永恒的盟约。",heroDesc:"<strong>耶稣基督是根基。</strong> 牧师验证，关于耶稣的圣经学习，奉耶稣名的祷告聊天和关于耶稣的圣经游戏。",
btnDiscover:"在耶稣里发现资料",btnVerses:"关于耶稣的经文 - 免费",verseDayTitle:"✝️ 今日经文 - 耶稣",verseDayText:"« 耶稣基督，昨日、今日、一直到永远，是一样的 - 祂是我们爱的榜样 »",verseDayCite:"希伯来书13:8 & 哥林多前书13:4 — 耶稣，每一个盟约的根基",
meetTitle:"在耶稣基督里的相遇 - 高级聊天 🔒",meetLead:"不再有城市！我们在耶稣里寻找，不按街区。按年龄、教会和性别筛选。游戏和音乐免费，聊天高级。",
churchAll:"所有教会",genderAll:"所有性别",searchPh:"搜索名字，耶稣经文...",
ageMinLabel:"最小年龄：",ageMaxLabel:"最大年龄：",ageTo:"到",
loginTitle:"在耶稣里登录",loginBtn:"在耶稣里登录",registerTitle:"注册 - 在耶稣里加入盟约",registerBtn:"在耶稣里创建我的资料",
versesTitle:"📖 经文图书馆 - 免费 ✅",versesLead:"所有这些经文都讲到耶稣基督。点击复制。免费",
gameTitle:"关于耶稣的圣经游戏 🎮 - 免费 ✅",gameLead:"25个关于耶稣和婚姻的问题，12节耶稣的经文，12对圣经夫妇。免费",
musicTitle:"基督教音乐 - 免费 ✅",musicLead:"为耶稣基督，我们天上的新郎的歌曲。免费",uploadTitle:"🎵 为耶稣上传歌曲",uploadBtn:"为耶稣添加",
modTitle:"在耶稣里的管理",modLead:"在耶稣里管理资料。编辑或删除。删除是永久的。",
premiumTitle:"在耶稣里的订阅 - 非洲法郎价格",premiumLead:"为非洲设计的价格，以耶稣为中心。9 000 F / 15 000 F / 30 000 F - 高级聊天",paymentTitle:"为耶稣的工作付款",
footerDesc:"以耶稣基督为中心的基督徒相遇。8种语言。游戏/音乐/圣经免费，聊天高级。"
}
};

const CONFESSIONS=["Catholique","Protestante","Évangélique","Pentecôtiste","Adventiste","Baptiste","Méthodiste","Anglicane","Orthodoxe","Église Royaume Universel de Dieu","Autre chrétienne en Jésus"];
let currentLang='fr';
let currentCurrency='XOF';
const CURRENCY_RATES={EUR:1/655.96,USD:1.09/655.96,XOF:1,CAD:1.48/655.96,GBP:0.86/655.96};
const CURRENCY_SYMBOLS={EUR:"€",USD:"$",XOF:"F CFA",CAD:"C$",GBP:"£"};
const BASE_PRICES_XOF={decouverte:0,mensuel:9000,semestre:15000,annuel:30000};
function formatPrice(xof){
const rate=CURRENCY_RATES[currentCurrency];
const sym=CURRENCY_SYMBOLS[currentCurrency];
let val=xof*rate;
if(currentCurrency==='XOF') return Math.round(val).toLocaleString('fr-FR')+' '+sym;
if(currentCurrency==='EUR') return val.toFixed(2)+' '+sym;
return sym+val.toFixed(2);
}
function renderPricing(){
const grid=document.getElementById("pricingGrid");
const dict=I18N[currentLang]||I18N.fr;
const plans=[
{key:"Découverte",keyId:"Découverte",xof:0,duration:"Gratuit à vie",features:["10 likes/jour en Jésus","Écouter la musique","Jeux sur Jésus","Étude biblique","Profils : nom, âge et ville"],cta:dict.choose,cls:""},
{key:"Mensuel Jésus",keyId:"Mensuel",xof:BASE_PRICES_XOF.mensuel,duration:"/ mois",badge:"",features:["Likes illimités en Jésus", "Chat prière au nom de Jésus (messages écrits et vocaux)", "Étude biblique Jésus à deux", "Écouter et télécharger la musique", "Jeux complets Jésus", "Filtres âge, genre et confession", "Profil mis en avant", "Vérification pastorale Jésus", "Coaching mariage en Jésus", "Top profil 1 an", "Support en Jésus"],cta:dict.choose,cls:""},
{key:"Alliance 6 Mois",keyId:"Alliance",months:6,xof:BASE_PRICES_XOF.semestre,duration:"/ 6 mois",badge:"★ Le plus choisi",save:"Économisez 39 000 F en Jésus",featured:true,features:["Likes illimités en Jésus", "Chat prière au nom de Jésus (messages écrits et vocaux)", "Étude biblique Jésus à deux", "Écouter et télécharger la musique", "Jeux complets Jésus", "Filtres âge, genre et confession", "Profil mis en avant", "Vérification pastorale Jésus", "Coaching mariage en Jésus", "Top profil 1 an", "Support en Jésus"],cta:dict.choose,cls:"featured"},
{key:"Éternelle 12 Mois",keyId:"Éternelle",months:12,xof:BASE_PRICES_XOF.annuel,duration:"/ 12 mois",badge:"★ Meilleure offre Jésus",save:"Économisez 78 000 F en Jésus",features:["Likes illimités en Jésus", "Chat prière au nom de Jésus (messages écrits et vocaux)", "Étude biblique Jésus à deux", "Écouter et télécharger la musique", "Jeux complets Jésus", "Filtres âge, genre et confession", "Profil mis en avant", "Vérification pastorale Jésus", "Coaching mariage en Jésus", "Top profil 1 an", "Support en Jésus"],cta:dict.choose,cls:""}
];
grid.innerHTML=plans.map(p=>{
let priceHtml;
if(p.xof===0) priceHtml=`<div class="price">${dict.free}<small style="font-size:.5em;display:block;color:var(--muted);margin-top:4px">${p.duration}</small></div>`;
else priceHtml=`<div class="price">${formatPrice(p.xof)}<small>${p.duration}</small>${p.months?`<div style="font-size:.4em;color:var(--muted);font-weight:700;margin-top:8px">soit ${formatPrice(p.xof/p.months)} / mois · payé en une fois</div>`:''}${p.save?`<div style="background:#dcfce7;color:#166534;font-size:.42em;padding:4px 10px;border-radius:999px;margin-top:10px;display:inline-block;font-weight:800">${p.save}</div>`:''}</div>`;
let badgeHtml=p.badge?`<div style="position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:${p.keyId==='Alliance'?'var(--gold)':'var(--navy)'};color:${p.keyId==='Alliance'?'#111':'#fff'};font-weight:900;font-size:.70rem;padding:5px 14px;border-radius:999px;white-space:nowrap">${p.badge}</div>`:'';
return `<div class="plan ${p.cls}" style="position:relative">${badgeHtml}<h3>${p.key}</h3>${priceHtml}<ul>${p.features.map(f=>`<li>${f}</li>`).join("")}</ul><button class="btn ${p.featured?'btn-gold':'btn-outline'}" style="width:100%" data-nlj-act="choosePlan" data-nlj-a="${NLJA([p.keyId])}">${p.cta}</button></div>`
}).join("");
}
function showToast(m){const t=document.getElementById("toast");t.textContent=m;t.classList.add("show");clearTimeout(window.__nljT);window.__nljT=setTimeout(()=>t.classList.remove("show"),2500)}
function updateStats(){}
function initials(n){return n?n[0].toUpperCase():"👤"}
function setConfessionFilter(val){
document.getElementById("filterChurch").value=val;
document.querySelectorAll(".conf-btn").forEach(b=>{
b.classList.toggle("active", b.dataset.conf===val);
});
renderProfiles();
const sec=document.getElementById("profilesGrid");
if(sec){ window.scrollTo({top:sec.getBoundingClientRect().top+window.scrollY-170, behavior:"smooth"}); }
showToast(val ? `✝️ Filtre : ${val} en Jésus` : "✝️ Toutes confessions en Jésus");
}
function ensureConfession(p){ if(!p.confession) p.confession = p.church || "Catholique"; return p; }
function renderProfiles(){
profiles.forEach(ensureConfession);

const church=document.getElementById("filterChurch").value;
// Confession = église = très important en Jésus pour le mariage
const gender=document.getElementById("filterGender").value;
const search=document.getElementById("filterSearch").value.toLowerCase();
const ageMin=parseInt(document.getElementById("ageMin").value);
const ageMax=parseInt(document.getElementById("ageMax").value);
const realGrid=document.getElementById("profilesGrid");const grid=document.createElement("div");
profiles.filter(p=>String(p.status||"").trim().toLowerCase()==="approved").filter(p=>!church||p.church===church||p.confession===church).filter(p=>!gender||p.gender===gender).filter(p=>!p.age||(p.age>=ageMin && p.age<=ageMax)).filter(p=>!search||((p.name||"")+(p.verse||"")+(p.church||"")).toLowerCase().includes(search)).forEach(p=>{
const realIdx=profiles.indexOf(p);
grid.insertAdjacentHTML("beforeend",`<div class="profile pc"${p.user_id?` data-uid="${escapeHTML(p.user_id)}"`:""}><div class="pc-ph">${p.photo?`<img src="${escapeHTML(p.photo)}" alt="${escapeHTML(p.name||"Membre")}" loading="lazy">`:initials(p.name||"Membre")}</div><div class="pc-info"><div class="pc-name">${escapeHTML(p.name||"Membre")}</div><div class="pc-sub">${p.age?escapeHTML(p.age)+" ans":"Âge non renseigné"} · 📍 ${p.city?escapeHTML(p.city):"Ville non renseignée"}</div></div><div class="pc-act"><button class="btn ${(window.NLJ&&NLJ.liked&&NLJ.liked.has(p.id))?'btn-outline':'btn-primary'} btn-sm" data-nlj-act="likeProfile" data-nlj-a="[${realIdx}]">❤️ ${escapeHTML(p.points||0)}</button>${p.user_id?`<button class="btn btn-gold btn-sm pc-msg" title="Écrire un message" data-nlj-act="openChat" data-nlj-a="${NLJA([p.user_id])}">💬 Écrire</button>`:""}<button class="btn btn-outline btn-sm" data-nlj-report data-nlj-act="reportProfile" data-nlj-a="[${realIdx}]">🚩</button></div></div>`)});
if(!grid.children.length)grid.innerHTML='<div class="empty-state"><div class="es-icon">🔍</div><h3>Aucun profil ne correspond pour le moment</h3><p>Élargis la tranche d\'âge ou change de confession pour voir plus de profils.</p><blockquote>« Cherchez, et vous trouverez ; frappez, et l\'on vous ouvrira. »<cite>Matthieu 7:7</cite></blockquote></div>';
if(realGrid.innerHTML.replace(/ is-online/g,"")!==grid.innerHTML)realGrid.innerHTML=grid.innerHTML;
if(window.nljApplyPresence)window.nljApplyPresence();
}
// CHAT COMPLET - TCHAT EN JÉSUS - PERSISTANT
const CHAT_STORAGE_KEY="niamke_chat_jesus_v2";
let chatConversations={};
try{
const savedChat=localStorage.getItem(CHAT_STORAGE_KEY);
if(savedChat) chatConversations=JSON.parse(savedChat);
}catch(e){}
function saveChat(){try{localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatConversations));}catch(e){}}

function likeProfile(i){const p=profiles[i];if(p){p.points++;saveProfiles();renderProfiles();renderModeration();showToast("❤️ Liké en Jésus: "+p.name); // auto ouvre chat après like
if(window.NLJ&&NLJ.premium===true) setTimeout(()=>openChat(p.name),400);
}}

function openChat(n){
// VÉRIFICATION PAYANT - TCHAT RÉSERVÉ AUX ABONNÉS EN JÉSUS
const isPremium = !!(window.NLJ&&NLJ.premium===true);
const freeChatsUsed = parseInt(localStorage.getItem('niamke_free_chats')||'0');
if(!isPremium){
document.getElementById("chatPanel").classList.remove("hidden");
document.getElementById("chatTitle").textContent="💳 Tchat réservé aux abonnés en Jésus";
document.getElementById("chatSubtitle").textContent="Passe en Premium pour tchater en Jésus";
document.getElementById("chatContacts").innerHTML='<div style="padding:16px;text-align:center"><div style="font-size:2.5rem">🔒</div><h4 style="margin:10px 0">Tchat réservé Premium en Jésus</h4><p style="font-size:.85rem;color:var(--muted)">Le tchat est réservé aux abonnés. Pour tchater au nom de Jésus, choisis un abonnement.</p><div style="margin-top:16px;display:grid;gap:8px"><button class="btn btn-gold" data-nlj-act="scrollPremium">💳 Voir les abonnements - 9 000 F</button>'+'</div></div>';
document.getElementById("chatMessages").innerHTML='<div style="padding:20px;text-align:center;color:var(--muted)"><p>💬 <strong>Pourquoi le tchat est payant en Jésus ?</strong></p><p style="font-size:.85rem;margin-top:10px">Pour éviter les faux profils et garder une communauté sérieuse en Jésus. 9 000 F CFA = engagement sérieux pour le mariage en Jésus, pas pour s\'amuser.</p><p style="font-size:.85rem;margin-top:10px">✅ Mensuel Jésus: 9 000 F - Tchat illimité en Jésus<br>✅ Alliance 6 mois: 15 000 F - Le plus choisi<br>✅ Éternelle 12 mois: 30 000 F</p></div>';
/* fenêtre plein écran : pas de défilement de la page derrière */
return;
}

currentChatUser=n;
if(!chatConversations[n]) chatConversations[n]=[{from:"them",text:`Bonjour en Jésus, je suis ${n}. Que Dieu bénisse votre journée au nom de Jésus 🙏✝️ J'ai vu votre profil et j'aimerais faire connaissance en Jésus au nom de Jésus-Christ.`,time:new Date().toLocaleTimeString()}];
document.getElementById("chatPanel").classList.remove("hidden");
document.getElementById("chatTitle").textContent=n+" en Jésus";
document.getElementById("chatSubtitle").textContent=isPremium ? "✅ Premium - Tchat illimité en Jésus" : "🎁 Tchat gratuit - "+(1-freeChatsUsed)+" restant en Jésus";
renderChatContacts();
renderChatMessages(n);
/* fenêtre plein écran : pas de défilement de la page derrière */
if(!isPremium){
localStorage.setItem('niamke_free_chats', (freeChatsUsed+1).toString());
}
}

function renderChatContacts(){
const container=document.getElementById("chatContacts");
const names=Object.keys(chatConversations);
if(!names.length){
container.innerHTML='<p style="color:var(--muted);font-size:.85rem;padding:10px">Aucune conversation en Jésus. Clique sur 💬 Chat sur un profil pour commencer en Jésus.</p>';
return;
}
container.innerHTML=names.map(name=>{
const isActive=name===currentChatUser;
const lastMsg=chatConversations[name][chatConversations[name].length-1];
return `<div data-nlj-act="openChat" data-nlj-a="${NLJA([name])}" style="padding:10px 12px;border-radius:12px;cursor:pointer;display:flex;gap:10px;align-items:center;${isActive?'background:#0f172a;color:#fff':'background:#fff;border:1px solid #e2e8f0'}">
<div style="width:38px;height:38px;border-radius:50%;background:${isActive?'#c9a227':'#e2e8f0'};display:grid;place-items:center;font-weight:800">${String(name[0]).toUpperCase().replace(/&/g,'&amp;').replace(/</g,'&lt;')}</div>
<div style="flex:1;min-width:0"><div style="font-weight:700;font-size:.88rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${String(name).replace(/&/g,'&amp;').replace(/</g,'&lt;')}</div><div style="font-size:.75rem;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${lastMsg?lastMsg.text.substring(0,28)+'...':''}</div></div>
${isActive?'':`<span style="width:8px;height:8px;background:var(--green);border-radius:50%"></span>`}
</div>`;
}).join("");
}

function renderChatMessages(name){
const msgs=chatConversations[name]||[];
const box=document.getElementById("chatMessages");
box.innerHTML=msgs.map(m=>`<div class="message ${m.from==='me'?'me':'them'}" style="${m.from==='me'?'':'background:#fff;border:1px solid #e2e8f0'}"><div>${String(m.text).replace(/&/g,'&amp;').replace(/</g,'&lt;')}</div><small style="font-size:.68rem;opacity:.6;display:block;margin-top:4px">${m.time||''} • en Jésus</small></div>`).join("") + '<div id="typingIndicator" class="hidden" style="padding:8px;color:var(--muted);font-size:.8rem">✍️ '+name+' écrit en Jésus...</div>';
box.scrollTop=box.scrollHeight;
}

function closeChatPanel(){document.getElementById("chatPanel").classList.add("hidden");}

document.getElementById("chatForm").addEventListener("submit",e=>{
e.preventDefault();
const input=document.getElementById("chatInput");
const v=input.value.trim();
if(!v || !currentChatUser) return;
const now=new Date().toLocaleTimeString();
if(!chatConversations[currentChatUser]) chatConversations[currentChatUser]=[];
chatConversations[currentChatUser].push({from:"me",text:v,time:now});
saveChat();
renderChatContacts();
renderChatMessages(currentChatUser);
input.value="";
const box=document.getElementById("chatMessages");
box.scrollTop=box.scrollHeight;
// Réponse automatique en Jésus
const typing=document.getElementById("typingIndicator");
if(typing) typing.classList.remove("hidden");
setTimeout(()=>{
if(typing) typing.classList.add("hidden");
const replies=[
"Merci pour ton message au nom de Jésus 🙏 Que Dieu te bénisse en Jésus !",
"Je prie pour toi en Jésus, que le Seigneur Jésus guide nos pas vers le mariage selon Dieu en Jésus.",
"Ton message me touche en Jésus. Parlons de notre foi en Jésus-Christ, Il est au centre.",
"Que Jésus-Christ soit au centre de notre conversation. Veux-tu qu'on prie ensemble en Jésus ? 🙏",
"J'apprécie ton cœur pour Jésus. Continue de chercher Jésus-Christ, Il te guidera vers la bonne personne en Jésus.",
"En Jésus, je crois que Dieu peut nous unir si c'est Sa volonté. Prions ensemble au nom de Jésus."
];
const reply=replies[Math.floor(Math.random()*replies.length)];
chatConversations[currentChatUser].push({from:"them",text:reply,time:new Date().toLocaleTimeString()});
saveChat();
renderChatContacts();
renderChatMessages(currentChatUser);
},1200+Math.random()*800);
});

(document.getElementById("registerForm")||{addEventListener:function(){}}).addEventListener("submit",e=>{e.preventDefault();const file=document.getElementById("regPhoto").files[0];const p={name:document.getElementById("regName").value,age:+document.getElementById("regAge").value,church:document.getElementById("regChurch").value,verse:document.getElementById("regVerse").value||"Jésus - Jean 14:6",gender:document.getElementById("regGender").value,looking:document.getElementById("regLooking").value,email:document.getElementById("regEmail").value,status:"pending",points:0,plan:"Découverte",photo:""};const done=d=>{p.photo=d;profiles.push(p);refresh();e.target.reset();showToast("✅ Profil créé en Jésus, en attente.");document.getElementById("moderation").scrollIntoView({behavior:"smooth"})};if(file){const r=new FileReader();r.onload=()=>done(r.result);r.readAsDataURL(file)}else done("")});
function renderModeration(){
const list=document.getElementById("moderationList");list.innerHTML="";
profiles.forEach((p,i)=>{
list.insertAdjacentHTML("beforeend",`
<div class="moderation-item"><div class="moderation-photo">${p.photo?`<img src="${escapeHTML(p.photo)}">`:initials(p.name)}</div><div class="moderation-info"><strong>${escapeHTML(p.name)}, ${escapeHTML(p.age)} ans</strong><div class="profile-meta">${escapeHTML(p.church)} • ${escapeHTML(p.email)}</div><div class="profile-meta">${escapeHTML(p.gender)} cherche ${escapeHTML(p.looking)} • ${escapeHTML(p.plan)} • ${p.points} pts en Jésus</div></div><span class="status-pill ${p.status==="approved"?"approved":"pending"}">${p.status==="approved"?"✅ Approuvé en Jésus":"⏳ En attente"}</span><div style="display:flex;gap:7px;flex-wrap:wrap"><button class="btn ${p.status==="approved"?"btn-outline":"btn-success"} btn-sm" data-nlj-act="approveProfile" data-nlj-a="[${i}]">${p.status==="approved"?"⏸️ En attente":"✅ Approuver en Jésus"}</button><button class="btn btn-outline btn-sm" data-nlj-act="editProfile" data-nlj-a="[${i}]">✏️</button><button class="btn btn-danger btn-sm" data-nlj-act="deleteProfile" data-nlj-a="[${i}]">🗑️</button></div></div>`)});
if(!profiles.length)list.innerHTML='<p class="center" style="color:var(--muted);padding:20px;background:#fff;border-radius:14px">Aucun profil en Jésus. Restaure.</p>';
}
function approveProfile(i){profiles[i].status=profiles[i].status==="approved"?"pending":"approved";saveProfiles();refresh();showToast(profiles[i].status==="approved"?"✅ "+profiles[i].name+" approuvé en Jésus":"⏸️ "+profiles[i].name+" en attente")}
function editProfile(i){editingIndex=i;const p=profiles[i];document.getElementById("editName").value=p.name;document.getElementById("editAge").value=p.age;document.getElementById("editChurch").value=p.church;document.getElementById("editVerse").value=p.verse;document.getElementById("editEmail").value=p.email;document.getElementById("editPlan").value=p.plan;document.getElementById("editStatus").value=p.status;document.getElementById("editModal").classList.add("open");}
function closeEditModal(){document.getElementById("editModal").classList.remove("open");editingIndex=null}
function saveEdit(){if(editingIndex===null)return;const p=profiles[editingIndex];Object.assign(p,{name:document.getElementById("editName").value||p.name,age:+document.getElementById("editAge").value||p.age,church:document.getElementById("editChurch").value||p.church,verse:document.getElementById("editVerse").value||p.verse,email:document.getElementById("editEmail").value||p.email,plan:document.getElementById("editPlan").value||p.plan,status:document.getElementById("editStatus").value});closeEditModal();saveProfiles();refresh();showToast("✏️ "+p.name+" modifié en Jésus");}
function deleteProfile(i){deletingIndex=i;deletingAll=false;document.getElementById("deleteText").textContent=`Supprimer ${profiles[i].name.replace(/</g,'')} en Jésus ?`;document.getElementById("deleteModal").classList.add("open");}
function deleteAllDemoProfiles(){deletingIndex=null;deletingAll=true;document.getElementById("deleteText").textContent=`Supprimer TOUS les ${profiles.length} profils en Jésus ?`;document.getElementById("deleteModal").classList.add("open");}
function closeDeleteModal(){document.getElementById("deleteModal").classList.remove("open");deletingIndex=null;deletingAll=false}
document.getElementById("confirmDeleteBtn").addEventListener("click",()=>{if(deletingAll){profiles=[];showToast("🗑️ Tous supprimés en Jésus - ne reviendront plus")}else if(deletingIndex!==null){const name=profiles[deletingIndex].name;profiles.splice(deletingIndex,1);showToast("🗑️ "+name+" supprimé en Jésus - ne reviendra plus")}saveProfiles();closeDeleteModal();refresh();});
function restoreDemo(){if(!confirm("Restaurer tous les profils démo en Jésus ? Cela ramènera tous les exemplaires supprimés.")) return;profiles=JSON.parse(JSON.stringify(DEMO_DATA));saveProfiles();refresh();showToast("♻️ Restaurés en Jésus - Tous les profils sont revenus")}
function addRandomDemo(){const names=["Grace","Paul","Esther","Moïse","Rebecca","Joël"];const n=names[Math.floor(Math.random()*names.length)];profiles.push({name:n+" "+Math.floor(Math.random()*100),age:22+Math.floor(Math.random()*18),church:["Catholique","Évangélique","Protestant"][Math.floor(Math.random()*3)],verse:"Jésus - Jean 14:6",gender:"Femme",looking:"Homme",email:n.toLowerCase()+Date.now()+"@demo.love",status:"pending",points:0,plan:"Découverte",photo:""});saveProfiles();refresh();showToast("➕ Ajouté en Jésus")}
function refresh(){saveProfiles();renderModeration();renderProfiles();updateStats();renderPricing();renderAdminStats();}
function renderAdminStats(){
const total=profiles.length;
const premium=profiles.filter(p=>p.plan!=='Découverte').length;
const revenue=profiles.reduce((sum,p)=>{
if(p.plan==='Mensuel') return sum+9000;
if(p.plan==='Alliance') return sum+15000;
if(p.plan==='Éternelle') return sum+30000;
return sum;
},0);
const chats=Object.keys(chatConversations||{}).length;
const el1=document.getElementById("adminTotal"); if(el1) el1.textContent=total;
const el2=document.getElementById("adminPremium"); if(el2) el2.textContent=premium;
const el3=document.getElementById("adminRevenue"); if(el3) el3.textContent=revenue.toLocaleString('fr-FR')+' F CFA';
const el4=document.getElementById("adminChats"); if(el4) el4.textContent=chats;
}
function resetAdminData(){
if(!confirm("Reset tchat & premium en Jésus ? Cela va effacer toutes les conversations et le statut premium pour tester à nouveau.")) return;
localStorage.removeItem('niamke_chat_jesus_v2');
localStorage.removeItem('niamke_premium_active');
localStorage.removeItem('niamke_free_chats');
localStorage.removeItem('niamke_premium_plan');
chatConversations={};
showToast("🔄 Reset fait en Jésus - Tchat et premium remis à zéro");
renderAdminStats();
document.getElementById("chatContacts").innerHTML='';
document.getElementById("chatPanel").classList.add("hidden");
}

document.querySelectorAll(".modal-overlay").forEach(o=>{o.addEventListener("click",e=>{if(e.target===o){o.classList.remove("open")}})})

// VERSETS JÉSUS BIBLIOTHÈQUE
const BIBLICAL_VERSES=[
["Jean 14:6","Je suis le chemin, la vérité et la vie."],
["Genèse 2:24","L'homme quittera son père et sa mère, et s'attachera à sa femme."],
["1 Corinthiens 13:4","L'amour est patient, il est plein de bonté."],
["Éphésiens 5:25","Maris, aimez chacun votre femme, comme Christ a aimé l'Église."],
["Jean 3:16","Car Dieu a tant aimé le monde qu'il a donné son Fils unique."],
["Proverbes 18:22","Celui qui trouve une femme trouve le bonheur."],
["Matthieu 19:6","Ce que Dieu a joint, que l'homme ne le sépare pas !"],
["1 Jean 4:8","Dieu est amour."],
["Ruth 1:16","Où tu iras j'irai, où tu demeureras je demeurerai."],
["Colossiens 3:14","Revêtez-vous de la charité, qui est le lien de la perfection."],
["Hébreux 13:4","Que le mariage soit honoré de tous."],
["Cantique 2:16","Mon bien-aimé est à moi, et je suis à lui."],
["Marc 10:9","Que l'homme ne sépare donc pas ce que Dieu a joint."],
["Apocalypse 19:7","Les noces de l'agneau sont venues."],
["Jean 2:11","Tel fut, à Cana en Galilée, le commencement des miracles que fit Jésus."],
["Romains 8:39","Rien ne pourra nous séparer de l'amour de Dieu manifesté en Jésus-Christ."]
];

const JESUS_VERSES_LIBRARY=[
["Jean 14:6","Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi.","Jésus se présente comme le seul chemin"],
["Jean 3:16","Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.","L'amour de Dieu manifesté en Jésus"],
["Matthieu 19:6","Ce que Dieu a joint, que l'homme ne le sépare pas !","Parole de Jésus : le mariage est indissoluble"],
["Jean 2:1-11","Récit : Jésus est invité aux noces de Cana et y accomplit son premier miracle en changeant l'eau en vin.","Jésus honore le mariage",true],
["Éphésiens 5:25","Maris, aimez chacun votre femme, comme Christ a aimé l'Église, et s'est livré lui-même pour elle.","Jésus, modèle d'amour sacrificiel"],
["1 Jean 4:19","Pour nous, nous l'aimons, parce qu'il nous a aimés le premier.","Jésus nous a aimés le premier"],
["Apocalypse 19:7","Réjouissons-nous, soyons dans l'allégresse, et donnons-lui gloire ; car les noces de l'agneau sont venues, et son épouse s'est préparée.","Jésus, l'Époux céleste"],
["Hébreux 13:8","Jésus-Christ est le même hier, aujourd'hui, et éternellement.","Jésus ne change pas"],
["Romains 8:39","… ni aucune autre créature ne pourra nous séparer de l'amour de Dieu manifesté en Jésus-Christ notre Seigneur.","Un amour que rien ne sépare"],
["Matthieu 11:28","Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos.","Jésus donne le repos"],
["Jean 15:12","C'est ici mon commandement : Aimez-vous les uns les autres, comme je vous ai aimés.","Le commandement de Jésus"],
["Colossiens 3:14","Mais par-dessus toutes ces choses revêtez-vous de la charité, qui est le lien de la perfection.","L'amour, lien parfait"],
["Genèse 2:24","C'est pourquoi l'homme quittera son père et sa mère, et s'attachera à sa femme, et ils deviendront une seule chair.","Le mariage, voulu par Dieu dès l'origine"],
["Proverbes 18:22","Celui qui trouve une femme trouve le bonheur ; c'est une grâce qu'il obtient de l'Éternel.","Le mariage, une grâce de Dieu"],
["Ecclésiaste 4:12","Si quelqu'un est plus fort qu'un seul, les deux peuvent lui résister ; et la corde à trois fils ne se rompt pas facilement.","Christ, la troisième corde du couple"],
["Matthieu 28:20","Et voici, je suis avec vous tous les jours, jusqu'à la fin du monde.","Jésus avec le couple, toujours"]
];

function renderTicker(){const track=document.getElementById("tickerTrack");if(!track)return;const build=BIBLICAL_VERSES.map(v=>`<span>✝️ <b>${v[0]}</b> — <i>« ${v[1]} »</i></span><span style="color:rgba(201,162,39,.6)"> • </span>`).join("");track.innerHTML=build+build;}
function applyLang(lang){
currentLang=lang;
lang=String(lang||'fr').toLowerCase(); if(!I18N[lang])lang='fr'; const t=Object.assign({},I18N.fr,I18N.en,I18N[lang]);
document.querySelectorAll('[data-i18n]').forEach(el=>{
const key=el.getAttribute('data-i18n');
if(t[key]) el.innerHTML=t[key];
});
// Specific placeholders
const churchSel=document.getElementById("filterChurch");
if(churchSel && churchSel.options[0]) churchSel.options[0].textContent=t.churchAll;
const genderSel=document.getElementById("filterGender");
if(genderSel && genderSel.options[0]) genderSel.options[0].textContent=t.genderAll;
const searchIn=document.getElementById("filterSearch");
if(searchIn) searchIn.placeholder=t.searchPh;
const ageMinL=document.getElementById("ageMinLabel");
if(ageMinL) ageMinL.textContent=t.ageMinLabel;
const ageMaxL=document.getElementById("ageMaxLabel");
if(ageMaxL) ageMaxL.textContent=t.ageMaxLabel;
document.documentElement.lang=lang;
// Direction for Arabic
if(lang==='ar' || lang==='zh'){
document.documentElement.dir= lang==='ar' ? 'rtl' : 'ltr';
}else{
document.documentElement.dir='ltr';
}
localStorage.setItem('niamke_lang',lang);
}

function renderVersesLibrary(){const lib=document.getElementById("versesLibrary");if(!lib) return;
const esc=x=>String(x).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
lib.innerHTML=JESUS_VERSES_LIBRARY.map(v=>`<div class="card verse-item" role="button" tabindex="0" data-ref="${esc(v[0])}" data-txt="${esc(v[1])}"><div class="vi-head"><span class="vi-ref">✝️ ${v[0]}</span><span class="vi-copy" title="Copier le verset" aria-hidden="true">📋</span></div><p class="vi-text">${v[3]?v[1]:"« "+v[1]+" »"}</p><p class="vi-note">💡 ${v[2]}</p></div>`).join("");
lib.querySelectorAll(".verse-item").forEach(el=>{const copy=()=>{const t=el.dataset.txt+" — "+el.dataset.ref;const done=()=>showToast("📖 Verset copié : "+el.dataset.ref);if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done).catch(done);}else{done();}};el.addEventListener("click",copy);el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();copy();}});});}

// GAMES - JÉSUS AU CENTRE - 100% FONCTIONNELS
const quiz=[
["Quel couple a été uni par Dieu dès la création ?",["Adam & Ève","Abraham & Sarah","Isaac & Rebecca","Jacob & Rachel"],0,"Genèse 2:24 - Dieu unit le premier couple"],
["Qui a dit : « Où tu iras j'irai » ? Un modèle de fidélité.",["Sarah","Ruth à Naomi","Esther","Marie"],1,"Ruth 1:16 - Ruth reste fidèle à Naomi"],
["Dans quel passage lit-on : « L'amour est patient » ?",["Jean 3:16","1 Corinthiens 13:4","Romains 8:28","Psaume 23"],1,"1 Corinthiens 13:4-7 - Le chapitre de l'amour"],
["Qui a prié l'Éternel pour trouver une épouse à Isaac ?",["Abraham","Isaac","Le serviteur d'Abraham en prière","Jacob"],2,"Genèse 24 - La prière du serviteur d'Abraham"],
["Quel roi est l'auteur traditionnel du Cantique des Cantiques ?",["David","Salomon","Saül","Ezéchias"],1,"Cantique 2:16 - « Mon bien-aimé est à moi, et je suis à lui »"],
["Combien d'années Jacob a-t-il travaillé en tout pour épouser Rachel ?",["7 ans","14 ans","20 ans","40 ans"],1,"Genèse 29:20-30 - 7 ans, puis 7 ans de plus"],
["Qui écrit : « Maris, aimez vos femmes comme Christ a aimé l'Église » ?",["Pierre","Paul aux Éphésiens","Jean","Jacques"],1,"Éphésiens 5:25 - L'apôtre Paul"],
["Dans quelle ville Jésus a-t-il changé l'eau en vin lors d'un mariage ?",["Cana","Jérusalem","Nazareth","Bethléem"],0,"Jean 2 - Jésus honore le mariage"],
["Qui sont Aquilas et Priscille ?",["Couple missionnaire en Jésus","2 apôtres","Frère et sœur","Roi et reine"],0,"Actes 18"],
["Que dit Proverbes 18:22 ?",["Celui qui trouve une femme trouve le bonheur","L'amour couvre tout","Deux valent mieux qu'un","Que le mariage soit honoré"],0,"Prov 18:22"],
["Qui dit : « Il n'est pas bon que l'homme soit seul » ?",["Adam","Dieu dans Genèse 2:18","Moïse","Paul"],1,"Genèse 2:18"],
["Quel verset dit : « Que le mariage soit honoré de tous » ?",["Hébreux 13:4","Genèse 2:24","Matthieu 19:6","Marc 10:9"],0,"Héb 13:4"],
["Que dit Ecclésiaste 4:9 ?",["Deux valent mieux qu'un","L'amour ne périt jamais","Que le mariage soit honoré","L'homme quittera"],0,"Ecclésiaste 4:9-12 - La corde à trois fils"],
["Que dit Jésus en Marc 10:9 sur le mariage ?",["Que l'homme ne sépare pas ce que Dieu a joint","Deux deviendront une seule chair","L'amour couvre tout","Dieu est amour"],0,"Marc 10:9 - Parole de Jésus"],
["Qui dit : « J'ai trouvé celui que mon cœur aime » ?",["La Sulamite dans Cantique 3:4","Ruth","Esther","Marie"],0,"Cantique 3:4 - La Sulamite retrouve son bien-aimé"],
["Quel est le premier miracle de Jésus rapporté dans l'Évangile de Jean ?",["Marcher sur les eaux","Changer l'eau en vin à Cana","Guérir un aveugle","Multiplier les pains"],1,"Jean 2:1-11"],
["De quoi Dieu forme-t-il la femme selon Genèse 2 ?",["De la poussière","De l'argile du jardin","D'une côte d'Adam","D'un souffle"],2,"Genèse 2:21-22"],
["Quelle femme moabite devient l'épouse de Boaz ?",["Orpa","Naomi","Rahab","Ruth"],3,"Ruth 4:13"],
["Quel âge avait Isaac quand il épousa Rebecca ?",["25 ans","30 ans","40 ans","60 ans"],2,"Genèse 25:20"],
["Parmi la foi, l'espérance et la charité, laquelle est la plus grande ?",["La foi","La charité (l'amour)","L'espérance","Aucune des trois"],1,"1 Corinthiens 13:13"],
["Qui est l'épouse d'Abraham et la mère d'Isaac ?",["Agar","Rebecca","Léa","Sarah"],3,"Genèse 21:2-3"],
["Quel couple reçoit, dans sa vieillesse, la promesse d'un fils, Jean-Baptiste ?",["Zacharie et Élisabeth","Joachim et Anne","Élimélec et Naomi","Aquilas et Priscille"],0,"Luc 1:13"],
["Quelle femme prie à Silo pour avoir un enfant et devient la mère de Samuel ?",["Sarah","Rachel","Anne","Rebecca"],2,"1 Samuel 1:20"],
["Comment s'appelle le jardin où Dieu place le premier couple ?",["Gethsémané","Éden","Carmel","Sion"],1,"Genèse 2:8"],
["Quel est le commandement que Jésus donne à ses disciples en Jean 15:12 ?",["Jeûnez chaque semaine","Bâtissez des temples","Aimez-vous les uns les autres, comme je vous ai aimés","Offrez la dîme"],2,"Jean 15:12"]
];
const verses=[
["L'amour est ___, l'amour est plein de bonté - Jésus",["patient","fidèle","fort","doux"],"patient","1 Corinthiens 13:4 - L'amour est patient"],
["L'homme quittera son père et sa mère et s'attachera à sa ___ en Jésus",["femme","famille","maison","église"],"femme","Gn 2:24"],
["Maris, aimez vos ___ comme Christ a aimé l'Église",["femmes","épouses","compagnes","sœurs"],"femmes","Éph 5:25"],
["Celui qui trouve une ___ trouve le bonheur en Jésus",["femme","épouse","compagne","amie"],"femme","Prov 18:22"],
["Deux valent mieux qu'un avec Jésus comme ___ corde",["troisième","deuxième","première","dernière"],"troisième","Ecclésiaste 4:12 - La corde à trois fils"],
["Dieu est ___ en Jésus",["amour","lumière","juste","fidèle"],"amour","1 Jn 4:8"],
["Où tu iras j'irai, où tu demeureras je ___ en Jésus",["demeurerai","resterai","vivrai","irai"],"demeurerai","Ruth 1:16"],
["Revêtez-vous de l'___ de Jésus",["amour","foi","joie","paix"],"amour","Col 3:14"],
["Que le mariage soit ___ par Jésus",["honoré","respecté","béni","sacré"],"honoré","Héb 13:4"],
["Mon bien-aimé Jésus est à moi, et je suis à ___",["lui","elle","nous","Dieu"],"lui","Cant 2:16"],
["L'amour de Jésus ne ___ jamais",["périt","finit","meurt","cesse"],"périt","1 Co 13:8"],
["Que l'homme ne ___ pas ce que Dieu a joint en Jésus",["sépare","divise","brise","casse"],"sépare","Marc 10:9"]
];
const couples=[["Adam","Ève"],["Abraham","Sarah"],["Isaac","Rebecca"],["Jacob","Rachel"],["Boaz","Ruth"],["Aquilas","Priscille"],["Zacharie","Élisabeth"],["Joseph","Marie"],["Elkana","Anne"],["Élimélec","Naomi"],["Joseph","Asnath"],["Moïse","Séphora"]];
let game={index:0,points:0,lives:3,timer:null,selected:[],matched:0,cards:[]};
function showBoard(t){document.getElementById("gameBoard").classList.remove("hidden");document.getElementById("gameTitle").textContent=t;document.getElementById("gamePoints").textContent=game.points;document.getElementById("gameLives").textContent="❤️".repeat(Math.max(game.lives,0))+"🖤".repeat(3-Math.max(game.lives,0));document.getElementById("gameBoard").scrollIntoView({behavior:"smooth",block:"center"});}
function endGame(n){clearInterval(game.timer);let msg=game.points>=150?"🏆 Champion en Jésus !":game.points>=80?"🌟 Solide en Jésus !":"💪 Continue en Jésus !";document.getElementById("gameContent").innerHTML=`<div class="center" style="padding:20px"><div style="font-size:3.5rem">🎉✝️</div><h3>${n} terminé en Jésus !</h3><div style="background:#f0fdf4;border:2px solid var(--green);border-radius:16px;padding:20px;margin:16px 0"><p style="font-size:1.2rem">Score final en Jésus : <strong style="font-size:1.8rem;color:var(--green)">${game.points} pts</strong></p><p style="margin-top:10px;color:#166534;font-weight:600">${msg}</p></div><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:18px"><button class="btn btn-gold" data-nlj-act="startQuiz">🔄 Rejouer en Jésus</button><button class="btn btn-primary" data-nlj-act="startVerses">✍️ Versets Jésus</button><button class="btn btn-outline" data-nlj-act="startMemory">💞 Memory Jésus</button></div></div>`;}
function startQuiz(){game={index:0,points:0,lives:3,timer:null,selected:[],matched:0,cards:[]};showBoard("🧠 Quiz Jésus & Alliance");quizQuestion();}
function quizQuestion(){
if(game.index>=quiz.length) return endGame("Quiz Jésus");
if(game.lives<=0){clearInterval(game.timer);document.getElementById("gameContent").innerHTML=`<div class="center" style="padding:20px"><div style="font-size:3rem">💔</div><h3>Vies épuisées en Jésus !</h3><p>Question ${game.index+1}/${quiz.length} - ${game.points} pts</p><button class="btn btn-gold" data-nlj-act="startQuiz" style="margin-top:16px">🔄 Recommencer en Jésus</button></div>`;return;}
const q=quiz[game.index];const progress=Math.round((game.index/quiz.length)*100);
document.getElementById("gameContent").innerHTML=`<div style="margin-bottom:16px"><div style="display:flex;justify-content:space-between;font-size:.85rem;font-weight:700;margin-bottom:6px"><span>Question ${game.index+1}/${quiz.length} en Jésus</span><span>${progress}%</span></div><div style="height:8px;background:#e2e8f0;border-radius:999px;overflow:hidden"><div style="height:100%;width:${progress}%;background:linear-gradient(90deg,var(--gold),#f3e3b3)"></div></div></div><h3 style="margin:12px 0">${q[0]}</h3><div class="answers">${q[1].map((a,i)=>`<button class="answer" data-nlj-act="quizAnswer" data-nlj-a="[${i}]"><span style="display:inline-block;width:26px;height:26px;background:#e2e8f0;border-radius:50%;text-align:center;line-height:26px;font-size:.8rem;margin-right:8px">${String.fromCharCode(65+i)}</span>${a}</button>`).join("")}</div><div style="display:flex;justify-content:space-between;margin-top:14px"><p class="note" id="timer" style="background:#fef3c7;padding:6px 12px;border-radius:999px;font-weight:700">⏱️ 20s</p></div><div id="quizExplain" class="hidden" style="margin-top:14px;padding:14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;font-size:.9rem"></div>`;
let t=20;clearInterval(game.timer);game.timer=setInterval(()=>{t--;const el=document.getElementById("timer");if(el){el.textContent=`⏱️ ${t}s`;if(t<=5) el.style.background="#fee2e2";}if(t<=0){clearInterval(game.timer);game.lives--;const ex=document.getElementById("quizExplain");if(ex){ex.classList.remove("hidden");ex.innerHTML=`⏰ Temps écoulé en Jésus !<br><strong>Bonne réponse: ${q[1][q[2]]}</strong><br><em>${q[3]}</em>`;}setTimeout(()=>{game.index++;quizQuestion()},2200);}},1000);
}
function quizAnswer(c){clearInterval(game.timer);const q=quiz[game.index];document.querySelectorAll(".answer").forEach((b,i)=>{b.disabled=true;b.style.pointerEvents="none";if(i===q[2]){b.classList.add("correct");b.innerHTML+=" ✅";}else if(i===c){b.classList.add("wrong");b.innerHTML+=" ❌";}});const ex=document.getElementById("quizExplain");if(ex){ex.classList.remove("hidden");if(c===q[2]){game.points+=10;ex.innerHTML=`✅ <strong>Excellent en Jésus ! +10 pts</strong><br>${q[3]}`;showToast("✅ +10 pts en Jésus");}else{game.lives--;ex.innerHTML=`❌ <strong>Bonne réponse en Jésus: ${q[1][q[2]]}</strong><br><em>${q[3]}</em>`;showToast("❌ C'était "+q[1][q[2]]);}}document.getElementById("gamePoints").textContent=game.points;document.getElementById("gameLives").textContent="❤️".repeat(Math.max(game.lives,0))+"🖤".repeat(3-Math.max(game.lives,0));setTimeout(()=>{game.index++;quizQuestion()},2500);}
function startVerses(){game={index:0,points:0,lives:3,timer:null,selected:[],matched:0,cards:[]};showBoard("✍️ Versets de Jésus");verseQuestion();}
function verseQuestion(){if(game.index>=verses.length) return endGame("Versets de Jésus");const v=verses[game.index];const progress=Math.round((game.index/verses.length)*100);document.getElementById("gameContent").innerHTML=`<div style="margin-bottom:16px"><div style="display:flex;justify-content:space-between;font-size:.85rem;font-weight:700;margin-bottom:6px"><span>Verset ${game.index+1}/${verses.length} en Jésus</span><span>${progress}%</span></div><div style="height:8px;background:#e2e8f0;border-radius:999px;overflow:hidden"><div style="height:100%;width:${progress}%;background:linear-gradient(90deg,var(--green),#bbf7d0)"></div></div></div><div style="background:#faf7ec;border-left:4px solid var(--gold);padding:16px;border-radius:0 12px 12px 0;margin:12px 0"><h3 style="font-size:1.2rem">"${v[0]}"</h3><p style="font-size:.85rem;color:var(--muted);margin-top:8px">💡 ${v[3]}</p></div><p style="font-weight:700;margin:12px 0">Choisis en Jésus :</p><div class="answers">${v[1].map(a=>`<button class="answer" data-nlj-act="verseAnswer" data-nlj-a="${NLJA([a])}">${a}</button>`).join("")}</div><div id="verseFeedback" class="hidden" style="margin-top:14px"></div>`;}
function verseAnswer(chosen){const v=verses[game.index];const correct=v[2];const fb=document.getElementById("verseFeedback");document.querySelectorAll(".answer").forEach(b=>{b.disabled=true;b.style.pointerEvents="none";if(b.textContent.trim()===correct) b.classList.add("correct");if(b.textContent.trim()===chosen && chosen!==correct) b.classList.add("wrong");});fb.classList.remove("hidden");if(chosen.toLowerCase()===correct.toLowerCase()){game.points+=20;fb.innerHTML=`<div style="padding:14px;background:#dcfce7;border-radius:12px"><strong>✅ Bravo en Jésus ! +20 pts</strong><br>Complet : <em>"${v[0].replace('___',correct)}"</em><br><small>${v[3]}</small></div>`;showToast("✅ +20 pts en Jésus");}else{fb.innerHTML=`<div style="padding:14px;background:#fee2e2;border-radius:12px"><strong>❌ C'était "${correct}" en Jésus</strong><br>Complet : <em>"${v[0].replace('___',correct)}"</em><br><small>${v[3]}</small></div>`;showToast("❌ Réponse: "+correct);}document.getElementById("gamePoints").textContent=game.points;setTimeout(()=>{game.index++;verseQuestion()},2500);}
function startMemory(){game={index:0,points:0,lives:3,timer:null,selected:[],matched:0,cards:[]};showBoard("💞 Memory en Jésus");game.cards=[];couples.forEach((c,i)=>{game.cards.push({id:i,name:c[0],matched:false});game.cards.push({id:i,name:c[1],matched:false});});game.cards.sort(()=>Math.random()-0.5);memoryBoard();}
function memoryBoard(){const matchedCount=game.cards.filter(c=>c.matched).length/2;const total=couples.length;document.getElementById("gameContent").innerHTML=`<div style="display:flex;justify-content:space-between;margin-bottom:12px;font-weight:700"><span>Paires en Jésus: ${matchedCount}/${total}</span><span>${game.points} pts</span></div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">${game.cards.map((c,i)=>{const isSel=game.selected.some(s=>s.index===i);const show=c.matched||isSel;return `<button class="answer" data-nlj-act="flipCard" data-nlj-a="[${i}]" style="height:82px;display:grid;place-items:center;font-weight:800;font-size:.9rem;${c.matched?'background:#dcfce7;border-color:var(--green);opacity:.7':''}${isSel&&!c.matched?'background:#fef3c7;border-color:var(--gold);transform:scale(1.05)':''}">${show?c.name:'<span style="font-size:1.6rem">✝️</span>'}</button>`;}).join("")}</div><div id="memoryMsg" style="margin-top:14px;text-align:center;font-weight:600;color:var(--muted)">${game.selected.length===1?'Choisis la 2ème carte en Jésus...':'Trouve les couples unis en Jésus !'}</div>`;if(matchedCount===total){setTimeout(()=>endGame("Memory en Jésus"),600);}}
function flipCard(i){if(game.cards[i].matched) return;if(game.selected.some(s=>s.index===i)) return;if(game.selected.length>=2) return;game.selected.push({index:i,id:game.cards[i].id});memoryBoard();if(game.selected.length===2){const[a,b]=game.selected;if(a.id===b.id){setTimeout(()=>{game.cards[a.index].matched=true;game.cards[b.index].matched=true;game.points+=25;game.selected=[];document.getElementById("gamePoints").textContent=game.points;showToast("💞 +25 pts en Jésus - "+couples[a.id][0]+" & "+couples[a.id][1]);memoryBoard();},700);}else{setTimeout(()=>{game.selected=[];memoryBoard();},1100);}}}

// MUSIC & PAYMENT
let tracks=[],musicErr="";
function escM(x){return String(x==null?"":x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function uploadMusic(){showToast("Les chants sont ajoutés depuis l'espace administrateur.");}
async function loadSongs(){
  if(window.NLJ_MUSIC){return window.NLJ_MUSIC.load();}
  var c=null;try{c=(typeof supabaseClient!=="undefined"&&supabaseClient)||null;}catch(e){}
  if(!c){renderMusic();return;}
  try{
    var r=await c.from("musiques").select("*").order("created_at",{ascending:false}).limit(300);
    if(r.error)throw r.error;
    var rows=(r.data||[]).filter(function(s){return s&&(s.url||s.storage_path||s.file_path||s.path||s.file||s.file_url||s.audio_url||s.audio)&&!(window.NLJ_EMBED&&(NLJ_EMBED.isLink||NLJ_EMBED.parse)(s.url||s.storage_path||s.file_path||s.path||s.file||s.file_url||s.audio_url||s.audio));});
    tracks=await Promise.all(rows.map(async function(s){
      var v=s.url||s.storage_path||s.file_path||s.path||s.file||s.file_url||s.audio_url||s.audio,u=v;
      if(!/^https?:/i.test(v)){
        try{var sg=await c.storage.from("musiques").createSignedUrl(v,3600);u=sg&&sg.data&&sg.data.signedUrl;}catch(e){}
        if(!u){try{u=c.storage.from("musiques").getPublicUrl(v).data.publicUrl;}catch(e){}}
      }
      return {name:(s.title||s.titre||"Chant pour Jésus")+(s.artist?" — "+s.artist:""),url:u,cover:s.image_url||""};
    }));
    musicErr="";
  }catch(e){musicErr=(e&&e.message)||String(e);tracks=[];}
  renderMusic();
}
function renderMusic(){
  if(window.NLJ_MUSIC){return window.NLJ_MUSIC.render();}
  var l=document.getElementById("musicList");if(!l)return;
  if(tracks.length){
    l.innerHTML=tracks.map(function(t){return '<div class="track">'+(t.cover?'<img src="'+escM(t.cover)+'" alt="" style="width:56px;height:56px;border-radius:10px;object-fit:cover;flex:none">':'')+'<strong>'+escM(t.name)+'</strong><audio controls controlsList="'+((window.NLJ&&window.NLJ.premium)?'':'nodownload')+'" preload="none" src="'+escM(t.url)+'"></audio></div>';}).join("");
    return;
  }
  l.innerHTML=musicErr?'<div class="empty-state"><div class="es-icon">🎵</div><h3>Impossible de charger les chants</h3><p>'+escM(musicErr)+'</p></div>':'<div class="empty-state"><div class="es-icon">🎵</div><h3>Les chants arrivent bientôt</h3><p>Les chants de louange ajoutés par l\'administrateur apparaîtront ici.</p><blockquote>« Que tout ce qui respire loue l\'Éternel ! »<cite>Psaume 150:6</cite></blockquote></div>';
}
let selectedPlanForPay="";
function choosePlan(plan){
if(plan==="Découverte")return showToast("✅ Plan Découverte en Jésus activé - Gratuit");
selectedPlanForPay=plan;
const price = plan==="Mensuel" ? formatPrice(BASE_PRICES_XOF.mensuel) : plan==="Alliance" ? formatPrice(BASE_PRICES_XOF.semestre) : formatPrice(BASE_PRICES_XOF.annuel);
document.getElementById("payPlanName").textContent=plan;
document.getElementById("payPlanPrice").textContent=price;
document.getElementById("paymentModal").classList.add("open");
}
function closePaymentModal(){document.getElementById("paymentModal").classList.remove("open");}
// AGE SLIDER
document.getElementById("ageMin").addEventListener("input",e=>{
let v=parseInt(e.target.value);let max=parseInt(document.getElementById("ageMax").value);
if(v>max){v=max;e.target.value=v;}
document.getElementById("ageMinVal").textContent=v+" ans";renderProfiles();
});
document.getElementById("ageMax").addEventListener("input",e=>{
let v=parseInt(e.target.value);let min=parseInt(document.getElementById("ageMin").value);
if(v<min){v=min;e.target.value=v;}
document.getElementById("ageMaxVal").textContent=v+" ans";renderProfiles();
});

// OTHER LISTENERS
document.getElementById("filterChurch").addEventListener("change",renderProfiles);
document.getElementById("filterGender").addEventListener("change",renderProfiles);
document.getElementById("filterSearch").addEventListener("input",renderProfiles);
document.getElementById("langSelect").addEventListener("change",e=>{applyLang(e.target.value);renderPricing();showToast("🌐 Langue: "+e.target.value+" en Jésus");});
document.getElementById("currencySelect").addEventListener("change",e=>{currentCurrency=e.target.value;renderPricing();showToast("💱 Devise: "+e.target.value+" en Jésus");});

function initApp(){const savedLang=String(localStorage.getItem("niamke_lang")||"fr").toLowerCase();document.getElementById("langSelect").value=savedLang;renderTicker();renderVersesLibrary();applyLang(savedLang);renderProfiles();renderModeration();renderMusic();loadSongs();updateStats();renderPricing();renderAdminStats();}
initApp();
