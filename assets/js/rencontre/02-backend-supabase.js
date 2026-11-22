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
footerDesc:"Rencontre chrétienne centrée sur Jésus-Christ. Jésus au centre. 21 langues. Suppressions définitives."
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
footerDesc:"Christian dating centered on Jesus Christ. No more cities, just Jesus at the center. 21 languages. Permanent deletions."
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
footerDesc:"Incontro cristiano centrato su Gesù Cristo. 21 lingue. Giochi/Musica/Bibbia GRATUIT, Tchat PREMIUM."
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
footerDesc:"Christliches Treffen zentriert auf Jesus Christus. 21 Sprachen. Spiele/Musik/Bibel KOSTENLOS, Chat PREMIUM."
},
nl:{
choose:"Kies dit abonnement",free:"Gratis",navHome:"Home",navMeet:"Ontmoeting",navVerses:"Verzen over Jezus",navGame:"Bijbelspel",navMusic:"Muziek",navMod:"Moderatie",navPremium:"Premium",
heroBadge:"✝️ Jezus Christus is de Weg - 2026",heroTitle:"Jezus Christus in het centrum om een eeuwig verbond naar Gods wil te vinden.",heroDesc:"<strong>Jezus Christus is het fundament.</strong> Pastorale verificatie, Bijbelstudie over Jezus, gebedschat in de naam van Jezus en Bijbelspellen over Jezus. Liefde heeft Jezus in het centrum.",
btnDiscover:"Ontdek profielen in Jezus",btnVerses:"Verzen over Jezus",
verseDayTitle:"✝️ Vers van de dag - Jezus",verseDayText:"« Jezus Christus is gisteren en heden dezelfde, en tot in eeuwigheid - Hij is ons voorbeeld van liefde »",verseDayCite:"Hebreeën 13:8 & 1 Korintiërs 13:4 — Jezus, fundament van elk verbond",
meetTitle:"Ontmoeting in Jezus Christus",meetLead:"Elk profiel toont naam, leeftijd en stad. Filter op leeftijd (tussen X en Y), kerk en geslacht.",
churchAll:"Alle kerkgenootschappen in Jezus",genderAll:"Alle geslachten",searchPh:"Zoek voornaam, vers over Jezus...",
ageMinLabel:"Minimumleeftijd:",ageMaxLabel:"Maximumleeftijd:",ageTo:"tot",
loginTitle:"Inloggen in Jezus",loginBtn:"Inloggen in Jezus",registerTitle:"Registratie - Sluit je aan bij het verbond in Jezus",registerBtn:"Maak mijn profiel in Jezus",
versesTitle:"📖 Verzenbibliotheek - Jezus in het centrum",versesLead:"Al deze verzen gaan over Jezus Christus. Klik om het vers te kopiëren. Jezus staat in het centrum van elk verbond.",
gameTitle:"Bijbelspel over Jezus 🎮",gameLead:"25 vragen over Jezus en het huwelijk, 12 verzen van Jezus, 12 bijbelse paren.",
musicTitle:"Christelijke muziek - Jezus",musicLead:"Liederen voor Jezus Christus, onze hemelse Bruidegom.",
uploadTitle:"🎵 Liederen voor Jezus uploaden",uploadBtn:"Toevoegen voor Jezus",
modTitle:"Moderatie in Jezus",modLead:"Beheer profielen in Jezus. Bewerk of verwijder. Verwijderingen zijn definitief.",
premiumTitle:"Abonnementen in Jezus - Prijzen in CFA",premiumLead:"Prijzen ontworpen voor Afrika, gecentreerd op Jezus. 9 000 F / 15 000 F / 30 000 F",paymentTitle:"Betaling voor het werk van Jezus",footerDesc:"Christelijke ontmoeting gecentreerd op Jezus Christus. Jezus in het centrum. 21 talen. Definitieve verwijderingen."
},
ru:{
choose:"Выбрать этот тариф",free:"Бесплатно",navHome:"Главная",navMeet:"Знакомства",navVerses:"Стихи об Иисусе",navGame:"Библейская игра",navMusic:"Музыка",navMod:"Модерация",navPremium:"Премиум",
heroBadge:"✝️ Иисус Христос — Путь - 2026",heroTitle:"Иисус Христос в центре, чтобы обрести вечный завет по воле Бога.",heroDesc:"<strong>Иисус Христос — основание.</strong> Пасторская проверка, изучение Библии об Иисусе, молитвенный чат во имя Иисуса и библейские игры об Иисусе. В центре любви — Иисус.",
btnDiscover:"Смотреть анкеты в Иисусе",btnVerses:"Стихи об Иисусе",
verseDayTitle:"✝️ Стих дня - Иисус",verseDayText:"« Иисус Христос вчера и сегодня и вовеки Тот же - Он наш образец любви »",verseDayCite:"Евреям 13:8 и 1 Коринфянам 13:4 — Иисус, основание каждого завета",
meetTitle:"Знакомства в Иисусе Христе",meetLead:"В каждой анкете указаны имя, возраст и город. Фильтруйте по возрасту (от X до Y), церкви и полу.",
churchAll:"Все конфессии в Иисусе",genderAll:"Все полы",searchPh:"Искать имя, стих об Иисусе...",
ageMinLabel:"Минимальный возраст:",ageMaxLabel:"Максимальный возраст:",ageTo:"до",
loginTitle:"Вход в Иисусе",loginBtn:"Войти в Иисусе",registerTitle:"Регистрация - Присоединяйся к завету в Иисусе",registerBtn:"Создать мою анкету в Иисусе",
versesTitle:"📖 Библиотека стихов - Иисус в центре",versesLead:"Все эти стихи говорят об Иисусе Христе. Нажмите, чтобы скопировать стих. Иисус — в центре каждого завета.",
gameTitle:"Библейская игра об Иисусе 🎮",gameLead:"25 вопросов об Иисусе и браке, 12 стихов Иисуса, 12 библейских пар.",
musicTitle:"Христианская музыка - Иисус",musicLead:"Песни для Иисуса Христа, нашего Небесного Жениха.",
uploadTitle:"🎵 Загрузить песни для Иисуса",uploadBtn:"Добавить для Иисуса",
modTitle:"Модерация в Иисусе",modLead:"Управляйте анкетами в Иисусе. Редактируйте или удаляйте. Удалённое не возвращается.",
premiumTitle:"Подписки в Иисусе - Цены в CFA",premiumLead:"Цены, созданные для Африки, с Иисусом в центре. 9 000 F / 15 000 F / 30 000 F",paymentTitle:"Оплата на дело Иисуса",footerDesc:"Христианские знакомства с Иисусом Христом в центре. Иисус в центре. 21 язык. Удаление окончательное."
},
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
footerDesc:"以耶稣基督为中心的基督徒相遇。21种语言。游戏/音乐/圣经免费，聊天高级。"
},
ln:{
choose:"Pona formule oyo",free:"Ofele",navHome:"Ndako",navMeet:"Kokutana",navVerses:"Mavɛrsɛ ya Yesu",navGame:"Momekano ya Biblia",navMusic:"Miziki",navMod:"Bokengi",navPremium:"Premium",
heroBadge:"✝️ Yesu Kristo azali Nzela - 2026",heroTitle:"Yesu Kristo na katikati mpo na kozwa bondeko ya seko engebene na Nzambe.",heroDesc:"<strong>Yesu Kristo azali moboko.</strong> Botalaka ya pasteur, kopesa mayele na Biblia na ntina ya Yesu, tchat ya mabondeli na kombo ya Yesu mpe momekano ya Biblia na ntina ya Yesu. Bolingo ezali na Yesu na katikati.",
btnDiscover:"Tala bapwofile na Yesu",btnVerses:"Mavɛrsɛ na ntina ya Yesu",
verseDayTitle:"✝️ Vɛrsɛ ya mokolo - Yesu",verseDayText:"« Yesu Kristo azali ndenge moko lobi, lelo mpe libela - Azali ndakisa na biso ya bolingo »",verseDayCite:"Baebele 13:8 & 1 Bakolinti 13:4 — Yesu, moboko ya bondeko nyonso",
meetTitle:"Kokutana na Yesu Kristo",meetLead:"Pwofile nyonso emonisi kombo, mbula mpe engumba. Pona engebene na mbula (kati na X mpe Y), eklezya mpe bonsomi.",
churchAll:"Mitindo nyonso na Yesu",genderAll:"Bonsomi nyonso",searchPh:"Luka kombo, vɛrsɛ ya Yesu...",
ageMinLabel:"Mbula ya moke :",ageMaxLabel:"Mbula ya monene :",ageTo:"kino",
loginTitle:"Kokota na Yesu",loginBtn:"Kokota na Yesu",registerTitle:"Komikomisa - Kota na bondeko na Yesu",registerBtn:"Salela pwofile na ngai na Yesu",
versesTitle:"📖 Libwɛ ya Mavɛrsɛ - Yesu na katikati",versesLead:"Mavɛrsɛ oyo nyonso ezali koloba na ntina ya Yesu Kristo. Fina mpo na kokopa vɛrsɛ. Yesu azali na katikati ya bondeko nyonso.",
gameTitle:"Momekano ya Biblia na ntina ya Yesu 🎮",gameLead:"Mituna 25 na ntina ya Yesu mpe libala, mavɛrsɛ 12 ya Yesu, babalani 12 ya Biblia.",
musicTitle:"Miziki ya Bakristu - Yesu",musicLead:"Nzembo mpo na Yesu Kristo, Mobali na biso ya likolo.",
uploadTitle:"🎵 Tia nzembo mpo na Yesu",uploadBtn:"Bakisa mpo na Yesu",
modTitle:"Bokengi na Yesu",modLead:"Kamba bapwofile na Yesu. Bongola to longola. Bolongoli ezongaka lisusu te.",
premiumTitle:"Bokotisi na Yesu - Talo ya CFA",premiumLead:"Talo esalemi mpo na Afrika, na Yesu na katikati. 9 000 F / 15 000 F / 30 000 F",paymentTitle:"Kofuta mpo na mosala ya Yesu",footerDesc:"Kokutana ya Bakristu na katikati ya Yesu Kristo. Yesu na katikati. Minoko 21. Bolongoli ezali ya seko."
},
sw:{
choose:"Chagua mpango huu",free:"Bure",navHome:"Mwanzo",navMeet:"Kukutana",navVerses:"Mistari ya Yesu",navGame:"Mchezo wa Biblia",navMusic:"Muziki",navMod:"Usimamizi",navPremium:"Premium",
heroBadge:"✝️ Yesu Kristo ndiye Njia - 2026",heroTitle:"Yesu Kristo katikati ili kupata agano la milele kulingana na Mungu.",heroDesc:"<strong>Yesu Kristo ndiye msingi.</strong> Uthibitisho wa kichungaji, funzo la Biblia kuhusu Yesu, gumzo la maombi kwa jina la Yesu na michezo ya Biblia kuhusu Yesu. Upendo una Yesu katikati.",
btnDiscover:"Gundua wasifu katika Yesu",btnVerses:"Mistari kuhusu Yesu",
verseDayTitle:"✝️ Mstari wa siku - Yesu",verseDayText:"« Yesu Kristo ni yeye yule jana, leo na hata milele - Yeye ndiye kielelezo chetu cha upendo »",verseDayCite:"Waebrania 13:8 na 1 Wakorintho 13:4 — Yesu, msingi wa kila agano",
meetTitle:"Kukutana katika Yesu Kristo",meetLead:"Kila wasifu unaonyesha jina, umri na mji. Chuja kwa umri (kati ya X na Y), kanisa na jinsia.",
churchAll:"Madhehebu yote katika Yesu",genderAll:"Jinsia zote",searchPh:"Tafuta jina, mstari wa Yesu...",
ageMinLabel:"Umri wa chini:",ageMaxLabel:"Umri wa juu:",ageTo:"hadi",
loginTitle:"Kuingia katika Yesu",loginBtn:"Ingia katika Yesu",registerTitle:"Usajili - Jiunge na agano katika Yesu",registerBtn:"Fungua wasifu wangu katika Yesu",
versesTitle:"📖 Maktaba ya Mistari - Yesu katikati",versesLead:"Mistari hii yote inamzungumzia Yesu Kristo. Bofya ili kunakili mstari. Yesu yuko katikati ya kila agano.",
gameTitle:"Mchezo wa Biblia kuhusu Yesu 🎮",gameLead:"Maswali 25 kuhusu Yesu na ndoa, mistari 12 ya Yesu, wanandoa 12 wa Biblia.",
musicTitle:"Muziki wa Kikristo - Yesu",musicLead:"Nyimbo za Yesu Kristo, Bwana Arusi wetu wa mbinguni.",
uploadTitle:"🎵 Pakia nyimbo za Yesu",uploadBtn:"Ongeza kwa ajili ya Yesu",
modTitle:"Usimamizi katika Yesu",modLead:"Simamia wasifu katika Yesu. Hariri au futa. Vilivyofutwa havirudi tena.",
premiumTitle:"Usajili katika Yesu - Bei za CFA",premiumLead:"Bei zilizopangwa kwa ajili ya Afrika, zikimlenga Yesu. 9 000 F / 15 000 F / 30 000 F",paymentTitle:"Malipo kwa ajili ya kazi ya Yesu",footerDesc:"Kukutana kwa Wakristo kukimlenga Yesu Kristo. Yesu katikati. Lugha 21. Ufutaji ni wa kudumu."
},
hi:{
choose:"यह योजना चुनें",free:"निःशुल्क",navHome:"मुख्य पृष्ठ",navMeet:"मुलाक़ात",navVerses:"यीशु के वचन",navGame:"बाइबल खेल",navMusic:"संगीत",navMod:"प्रबंधन",navPremium:"प्रीमियम",
heroBadge:"✝️ यीशु मसीह ही मार्ग हैं - 2026",heroTitle:"परमेश्वर के अनुसार अनन्त वाचा पाने के लिए यीशु मसीह केंद्र में।",heroDesc:"<strong>यीशु मसीह ही नींव हैं।</strong> पास्टरीय सत्यापन, यीशु पर बाइबल अध्ययन, यीशु के नाम में प्रार्थना चैट और यीशु पर बाइबल खेल। प्रेम के केंद्र में यीशु हैं।",
btnDiscover:"यीशु में प्रोफ़ाइल देखें",btnVerses:"यीशु के बारे में वचन",
verseDayTitle:"✝️ आज का वचन - यीशु",verseDayText:"« यीशु मसीह कल, आज और युगानुयुग एक सा है - वही हमारे प्रेम का आदर्श है »",verseDayCite:"इब्रानियों 13:8 और 1 कुरिन्थियों 13:4 — यीशु, हर वाचा की नींव",
meetTitle:"यीशु मसीह में मुलाक़ात",meetLead:"हर प्रोफ़ाइल में नाम, उम्र और शहर दिखता है। उम्र (X और Y के बीच), कलीसिया और लिंग के अनुसार छाँटें।",
churchAll:"यीशु में सभी कलीसियाएँ",genderAll:"सभी लिंग",searchPh:"नाम, यीशु का वचन खोजें...",
ageMinLabel:"न्यूनतम उम्र :",ageMaxLabel:"अधिकतम उम्र :",ageTo:"से",
loginTitle:"यीशु में लॉगिन",loginBtn:"यीशु में लॉगिन करें",registerTitle:"पंजीकरण - यीशु में वाचा से जुड़ें",registerBtn:"यीशु में मेरी प्रोफ़ाइल बनाएँ",
versesTitle:"📖 वचनों का पुस्तकालय - यीशु केंद्र में",versesLead:"ये सभी वचन यीशु मसीह के बारे में हैं। वचन कॉपी करने के लिए क्लिक करें। यीशु हर वाचा के केंद्र में हैं।",
gameTitle:"यीशु पर बाइबल खेल 🎮",gameLead:"यीशु और विवाह पर 25 प्रश्न, यीशु के 12 वचन, 12 बाइबल जोड़े।",
musicTitle:"मसीही संगीत - यीशु",musicLead:"यीशु मसीह के लिए गीत, हमारे स्वर्गीय दूल्हे के लिए।",
uploadTitle:"🎵 यीशु के लिए गीत अपलोड करें",uploadBtn:"यीशु के लिए जोड़ें",
modTitle:"यीशु में प्रबंधन",modLead:"यीशु में प्रोफ़ाइल प्रबंधित करें। संपादित करें या हटाएँ। हटाया गया वापस नहीं आता।",
premiumTitle:"यीशु में सदस्यता - CFA मूल्य",premiumLead:"अफ़्रीका के लिए बनाए गए मूल्य, यीशु पर केंद्रित। 9 000 F / 15 000 F / 30 000 F",paymentTitle:"यीशु के कार्य के लिए भुगतान",footerDesc:"यीशु मसीह पर केंद्रित मसीही मुलाक़ात। यीशु केंद्र में। 21 भाषाएँ। स्थायी रूप से हटाना।"
},
id:{
choose:"Pilih paket ini",free:"Gratis",navHome:"Beranda",navMeet:"Pertemuan",navVerses:"Ayat Yesus",navGame:"Permainan Alkitab",navMusic:"Musik",navMod:"Moderasi",navPremium:"Premium",
heroBadge:"✝️ Yesus Kristus adalah Jalan - 2026",heroTitle:"Yesus Kristus di pusat untuk menemukan perjanjian kekal menurut Allah.",heroDesc:"<strong>Yesus Kristus adalah dasarnya.</strong> Verifikasi pastoral, pendalaman Alkitab tentang Yesus, obrolan doa dalam nama Yesus, dan permainan Alkitab tentang Yesus. Cinta memiliki Yesus di pusatnya.",
btnDiscover:"Temukan profil dalam Yesus",btnVerses:"Ayat tentang Yesus",
verseDayTitle:"✝️ Ayat hari ini - Yesus",verseDayText:"« Yesus Kristus tetap sama, kemarin, hari ini dan selama-lamanya - Dialah teladan kasih kita »",verseDayCite:"Ibrani 13:8 & 1 Korintus 13:4 — Yesus, dasar setiap perjanjian",
meetTitle:"Pertemuan dalam Yesus Kristus",meetLead:"Setiap profil menampilkan nama, usia, dan kota. Saring berdasarkan usia (antara X dan Y), gereja, dan jenis kelamin.",
churchAll:"Semua denominasi dalam Yesus",genderAll:"Semua jenis kelamin",searchPh:"Cari nama, ayat Yesus...",
ageMinLabel:"Usia minimum:",ageMaxLabel:"Usia maksimum:",ageTo:"sampai",
loginTitle:"Masuk dalam Yesus",loginBtn:"Masuk dalam Yesus",registerTitle:"Pendaftaran - Bergabunglah dalam perjanjian di dalam Yesus",registerBtn:"Buat profil saya dalam Yesus",
versesTitle:"📖 Perpustakaan Ayat - Yesus di Pusat",versesLead:"Semua ayat ini berbicara tentang Yesus Kristus. Klik untuk menyalin ayat. Yesus ada di pusat setiap perjanjian.",
gameTitle:"Permainan Alkitab tentang Yesus 🎮",gameLead:"25 pertanyaan tentang Yesus dan pernikahan, 12 ayat Yesus, 12 pasangan Alkitab.",
musicTitle:"Musik Kristen - Yesus",musicLead:"Lagu untuk Yesus Kristus, Mempelai Pria surgawi kita.",
uploadTitle:"🎵 Unggah lagu untuk Yesus",uploadBtn:"Tambahkan untuk Yesus",
modTitle:"Moderasi dalam Yesus",modLead:"Kelola profil dalam Yesus. Ubah atau hapus. Penghapusan tidak dapat dikembalikan.",
premiumTitle:"Langganan dalam Yesus - Harga CFA",premiumLead:"Harga dirancang untuk Afrika, berpusat pada Yesus. 9.000 F / 15.000 F / 30.000 F",paymentTitle:"Pembayaran untuk pekerjaan Yesus",footerDesc:"Pertemuan Kristen yang berpusat pada Yesus Kristus. Yesus di pusat. 21 bahasa. Penghapusan permanen."
},
tl:{
choose:"Piliin ang planong ito",free:"Libre",navHome:"Home",navMeet:"Pagkikita",navVerses:"Mga Talata ni Hesus",navGame:"Larong Biblikal",navMusic:"Musika",navMod:"Pangangasiwa",navPremium:"Premium",
heroBadge:"✝️ Si Hesukristo ang Daan - 2026",heroTitle:"Si Hesukristo sa sentro upang matagpuan ang walang hanggang tipan ayon sa Diyos.",heroDesc:"<strong>Si Hesukristo ang pundasyon.</strong> Pastoral na beripikasyon, pag-aaral ng Biblia tungkol kay Hesus, panalanging chat sa pangalan ni Hesus, at mga larong biblikal tungkol kay Hesus. Si Hesus ang sentro ng pag-ibig.",
btnDiscover:"Tuklasin ang mga profile kay Hesus",btnVerses:"Mga talata tungkol kay Hesus",
verseDayTitle:"✝️ Talata ng araw - Hesus",verseDayText:"« Si Hesukristo ay pareho kahapon, ngayon, at magpakailanman - Siya ang ating huwaran ng pag-ibig »",verseDayCite:"Hebreo 13:8 at 1 Corinto 13:4 — Hesus, pundasyon ng bawat tipan",
meetTitle:"Pagkikita kay Hesukristo",meetLead:"Ipinapakita ng bawat profile ang pangalan, edad, at lungsod. Mag-filter ayon sa edad (sa pagitan ng X at Y), simbahan, at kasarian.",
churchAll:"Lahat ng denominasyon kay Hesus",genderAll:"Lahat ng kasarian",searchPh:"Maghanap ng pangalan, talata ni Hesus...",
ageMinLabel:"Pinakamababang edad:",ageMaxLabel:"Pinakamataas na edad:",ageTo:"hanggang",
loginTitle:"Pag-login kay Hesus",loginBtn:"Mag-login kay Hesus",registerTitle:"Pagpaparehistro - Sumali sa tipan kay Hesus",registerBtn:"Gawin ang aking profile kay Hesus",
versesTitle:"📖 Aklatan ng mga Talata - Si Hesus sa Sentro",versesLead:"Ang lahat ng talatang ito ay tungkol kay Hesukristo. I-click para kopyahin ang talata. Si Hesus ang sentro ng bawat tipan.",
gameTitle:"Larong Biblikal tungkol kay Hesus 🎮",gameLead:"25 tanong tungkol kay Hesus at pag-aasawa, 12 talata ni Hesus, 12 magkapareha sa Biblia.",
musicTitle:"Kristiyanong Musika - Hesus",musicLead:"Mga awit para kay Hesukristo, ang ating makalangit na Kasintahang Lalaki.",
uploadTitle:"🎵 Mag-upload ng mga awit para kay Hesus",uploadBtn:"Idagdag para kay Hesus",
modTitle:"Pangangasiwa kay Hesus",modLead:"Pamahalaan ang mga profile kay Hesus. I-edit o burahin. Hindi na maibabalik ang mga binura.",
premiumTitle:"Mga Subscription kay Hesus - Presyo sa CFA",premiumLead:"Mga presyong idinisenyo para sa Africa, nakasentro kay Hesus. 9,000 F / 15,000 F / 30,000 F",paymentTitle:"Bayad para sa gawain ni Hesus",footerDesc:"Kristiyanong pagkikita na nakasentro kay Hesukristo. Si Hesus sa sentro. 21 wika. Permanente ang pagbura."
},
ko:{
choose:"이 요금제 선택",free:"무료",navHome:"홈",navMeet:"만남",navVerses:"예수님의 말씀",navGame:"성경 게임",navMusic:"음악",navMod:"관리",navPremium:"프리미엄",
heroBadge:"✝️ 예수 그리스도는 길이십니다 - 2026",heroTitle:"하나님의 뜻에 따라 영원한 언약을 찾기 위해 예수 그리스도를 중심에.",heroDesc:"<strong>예수 그리스도는 터전이십니다.</strong> 목회적 검증, 예수님에 관한 성경 공부, 예수님의 이름으로 하는 기도 채팅, 예수님에 관한 성경 게임. 사랑의 중심에는 예수님이 계십니다.",
btnDiscover:"예수님 안에서 프로필 보기",btnVerses:"예수님에 관한 말씀",
verseDayTitle:"✝️ 오늘의 말씀 - 예수님",verseDayText:"« 예수 그리스도는 어제나 오늘이나 영원토록 동일하시니 - 그분은 우리 사랑의 모범이십니다 »",verseDayCite:"히브리서 13:8 & 고린도전서 13:4 — 예수님, 모든 언약의 터전",
meetTitle:"예수 그리스도 안에서의 만남",meetLead:"각 프로필에는 이름, 나이, 도시가 표시됩니다. 나이(X와 Y 사이), 교회, 성별로 필터링하세요.",
churchAll:"예수님 안의 모든 교단",genderAll:"모든 성별",searchPh:"이름, 예수님 말씀 검색...",
ageMinLabel:"최소 나이:",ageMaxLabel:"최대 나이:",ageTo:"~",
loginTitle:"예수님 안에서 로그인",loginBtn:"예수님 안에서 로그인",registerTitle:"회원가입 - 예수님 안에서 언약에 동참하세요",registerBtn:"예수님 안에서 내 프로필 만들기",
versesTitle:"📖 말씀 도서관 - 예수님 중심",versesLead:"이 모든 말씀은 예수 그리스도에 관한 것입니다. 클릭하면 말씀이 복사됩니다. 예수님은 모든 언약의 중심이십니다.",
gameTitle:"예수님에 관한 성경 게임 🎮",gameLead:"예수님과 결혼에 관한 25문제, 예수님의 말씀 12개, 성경 속 커플 12쌍.",
musicTitle:"기독교 음악 - 예수님",musicLead:"우리의 하늘 신랑이신 예수 그리스도를 위한 찬양.",
uploadTitle:"🎵 예수님을 위한 찬양 업로드",uploadBtn:"예수님을 위해 추가",
modTitle:"예수님 안에서의 관리",modLead:"예수님 안에서 프로필을 관리하세요. 수정하거나 삭제하세요. 삭제는 되돌릴 수 없습니다.",
premiumTitle:"예수님 안에서의 구독 - CFA 가격",premiumLead:"아프리카를 위해 마련된, 예수님 중심의 가격. 9,000 F / 15,000 F / 30,000 F",paymentTitle:"예수님의 사역을 위한 결제",footerDesc:"예수 그리스도 중심의 기독교 만남. 예수님이 중심. 21개 언어. 삭제는 영구적입니다."
},
vi:{
choose:"Chọn gói này",free:"Miễn phí",navHome:"Trang chủ",navMeet:"Gặp gỡ",navVerses:"Câu Kinh Thánh về Chúa Giêsu",navGame:"Trò chơi Kinh Thánh",navMusic:"Âm nhạc",navMod:"Quản trị",navPremium:"Premium",
heroBadge:"✝️ Chúa Giêsu Kitô là Con Đường - 2026",heroTitle:"Chúa Giêsu Kitô ở trung tâm để tìm một giao ước vĩnh cửu theo ý Chúa.",heroDesc:"<strong>Chúa Giêsu Kitô là nền tảng.</strong> Xác minh mục vụ, học Kinh Thánh về Chúa Giêsu, trò chuyện cầu nguyện nhân danh Chúa Giêsu và trò chơi Kinh Thánh về Chúa Giêsu. Tình yêu có Chúa Giêsu ở trung tâm.",
btnDiscover:"Khám phá hồ sơ trong Chúa Giêsu",btnVerses:"Câu Kinh Thánh về Chúa Giêsu",
verseDayTitle:"✝️ Câu Kinh Thánh hôm nay - Chúa Giêsu",verseDayText:"« Chúa Giêsu Kitô hôm qua, hôm nay và mãi mãi vẫn là một - Ngài là gương mẫu tình yêu của chúng ta »",verseDayCite:"Hê-bơ-rơ 13:8 & 1 Cô-rinh-tô 13:4 — Chúa Giêsu, nền tảng của mọi giao ước",
meetTitle:"Gặp gỡ trong Chúa Giêsu Kitô",meetLead:"Mỗi hồ sơ hiển thị tên, tuổi và thành phố. Lọc theo độ tuổi (từ X đến Y), hội thánh và giới tính.",
churchAll:"Mọi giáo phái trong Chúa Giêsu",genderAll:"Mọi giới tính",searchPh:"Tìm tên, câu Kinh Thánh...",
ageMinLabel:"Tuổi tối thiểu:",ageMaxLabel:"Tuổi tối đa:",ageTo:"đến",
loginTitle:"Đăng nhập trong Chúa Giêsu",loginBtn:"Đăng nhập trong Chúa Giêsu",registerTitle:"Đăng ký - Gia nhập giao ước trong Chúa Giêsu",registerBtn:"Tạo hồ sơ của tôi trong Chúa Giêsu",
versesTitle:"📖 Thư viện Câu Kinh Thánh - Chúa Giêsu ở trung tâm",versesLead:"Tất cả những câu này nói về Chúa Giêsu Kitô. Nhấn để sao chép câu Kinh Thánh. Chúa Giêsu ở trung tâm mọi giao ước.",
gameTitle:"Trò chơi Kinh Thánh về Chúa Giêsu 🎮",gameLead:"25 câu hỏi về Chúa Giêsu và hôn nhân, 12 câu Kinh Thánh của Chúa Giêsu, 12 cặp đôi trong Kinh Thánh.",
musicTitle:"Âm nhạc Kitô giáo - Chúa Giêsu",musicLead:"Những bài ca dâng Chúa Giêsu Kitô, Chàng Rể trên trời của chúng ta.",
uploadTitle:"🎵 Tải lên bài ca dâng Chúa Giêsu",uploadBtn:"Thêm cho Chúa Giêsu",
modTitle:"Quản trị trong Chúa Giêsu",modLead:"Quản lý hồ sơ trong Chúa Giêsu. Chỉnh sửa hoặc xóa. Nội dung đã xóa không thể khôi phục.",
premiumTitle:"Gói đăng ký trong Chúa Giêsu - Giá CFA",premiumLead:"Mức giá dành cho châu Phi, lấy Chúa Giêsu làm trung tâm. 9.000 F / 15.000 F / 30.000 F",paymentTitle:"Thanh toán cho công việc của Chúa Giêsu",footerDesc:"Gặp gỡ Kitô hữu lấy Chúa Giêsu Kitô làm trung tâm. Chúa Giêsu ở trung tâm. 21 ngôn ngữ. Xóa vĩnh viễn."
},
pl:{
choose:"Wybierz ten plan",free:"Za darmo",navHome:"Strona główna",navMeet:"Spotkania",navVerses:"Wersety o Jezusie",navGame:"Gra biblijna",navMusic:"Muzyka",navMod:"Moderacja",navPremium:"Premium",
heroBadge:"✝️ Jezus Chrystus jest Drogą - 2026",heroTitle:"Jezus Chrystus w centrum, aby znaleźć wieczne przymierze według Boga.",heroDesc:"<strong>Jezus Chrystus jest fundamentem.</strong> Weryfikacja duszpasterska, studium biblijne o Jezusie, czat modlitewny w imię Jezusa i gry biblijne o Jezusie. Miłość ma Jezusa w centrum.",
btnDiscover:"Odkryj profile w Jezusie",btnVerses:"Wersety o Jezusie",
verseDayTitle:"✝️ Werset dnia - Jezus",verseDayText:"« Jezus Chrystus wczoraj i dziś, ten sam także na wieki - On jest naszym wzorem miłości »",verseDayCite:"List do Hebrajczyków 13:8 i 1 List do Koryntian 13:4 — Jezus, fundament każdego przymierza",
meetTitle:"Spotkania w Jezusie Chrystusie",meetLead:"Każdy profil pokazuje imię, wiek i miasto. Filtruj według wieku (między X a Y), Kościoła i płci.",
churchAll:"Wszystkie wyznania w Jezusie",genderAll:"Wszystkie płcie",searchPh:"Szukaj imienia, wersetu o Jezusie...",
ageMinLabel:"Wiek minimalny:",ageMaxLabel:"Wiek maksymalny:",ageTo:"do",
loginTitle:"Logowanie w Jezusie",loginBtn:"Zaloguj się w Jezusie",registerTitle:"Rejestracja - Dołącz do przymierza w Jezusie",registerBtn:"Utwórz mój profil w Jezusie",
versesTitle:"📖 Biblioteka wersetów - Jezus w centrum",versesLead:"Wszystkie te wersety mówią o Jezusie Chrystusie. Kliknij, aby skopiować werset. Jezus jest w centrum każdego przymierza.",
gameTitle:"Gra biblijna o Jezusie 🎮",gameLead:"25 pytań o Jezusa i małżeństwo, 12 wersetów Jezusa, 12 par biblijnych.",
musicTitle:"Muzyka chrześcijańska - Jezus",musicLead:"Pieśni dla Jezusa Chrystusa, naszego niebieskiego Oblubieńca.",
uploadTitle:"🎵 Prześlij pieśni dla Jezusa",uploadBtn:"Dodaj dla Jezusa",
modTitle:"Moderacja w Jezusie",modLead:"Zarządzaj profilami w Jezusie. Edytuj lub usuń. Usunięte treści nie wracają.",
premiumTitle:"Subskrypcje w Jezusie - Ceny w CFA",premiumLead:"Ceny stworzone z myślą o Afryce, skupione na Jezusie. 9 000 F / 15 000 F / 30 000 F",paymentTitle:"Płatność na dzieło Jezusa",footerDesc:"Chrześcijańskie spotkania skupione na Jezusie Chrystusie. Jezus w centrum. 21 języków. Usunięcie jest trwałe."
},
uk:{
choose:"Обрати цей тариф",free:"Безкоштовно",navHome:"Головна",navMeet:"Знайомства",navVerses:"Вірші про Ісуса",navGame:"Біблійна гра",navMusic:"Музика",navMod:"Модерація",navPremium:"Преміум",
heroBadge:"✝️ Ісус Христос — це Шлях - 2026",heroTitle:"Ісус Христос у центрі, щоб знайти вічний завіт за волею Бога.",heroDesc:"<strong>Ісус Христос — це основа.</strong> Пастирська перевірка, вивчення Біблії про Ісуса, молитовний чат в ім’я Ісуса та біблійні ігри про Ісуса. У центрі любові — Ісус.",
btnDiscover:"Дивитися анкети в Ісусі",btnVerses:"Вірші про Ісуса",
verseDayTitle:"✝️ Вірш дня - Ісус",verseDayText:"« Ісус Христос учора, і сьогодні, і навіки той самий - Він наш зразок любові »",verseDayCite:"Євреїв 13:8 і 1 Коринтян 13:4 — Ісус, основа кожного завіту",
meetTitle:"Знайомства в Ісусі Христі",meetLead:"Кожна анкета показує ім’я, вік і місто. Фільтруйте за віком (від X до Y), церквою та статтю.",
churchAll:"Усі конфесії в Ісусі",genderAll:"Усі статі",searchPh:"Шукати ім’я, вірш про Ісуса...",
ageMinLabel:"Мінімальний вік:",ageMaxLabel:"Максимальний вік:",ageTo:"до",
loginTitle:"Вхід в Ісусі",loginBtn:"Увійти в Ісусі",registerTitle:"Реєстрація - Приєднуйся до завіту в Ісусі",registerBtn:"Створити мою анкету в Ісусі",
versesTitle:"📖 Бібліотека віршів - Ісус у центрі",versesLead:"Усі ці вірші говорять про Ісуса Христа. Натисни, щоб скопіювати вірш. Ісус — у центрі кожного завіту.",
gameTitle:"Біблійна гра про Ісуса 🎮",gameLead:"25 запитань про Ісуса та шлюб, 12 віршів Ісуса, 12 біблійних пар.",
musicTitle:"Християнська музика - Ісус",musicLead:"Пісні для Ісуса Христа, нашого небесного Нареченого.",
uploadTitle:"🎵 Завантажити пісні для Ісуса",uploadBtn:"Додати для Ісуса",
modTitle:"Модерація в Ісусі",modLead:"Керуй анкетами в Ісусі. Редагуй або видаляй. Видалене не повертається.",
premiumTitle:"Підписки в Ісусі - Ціни в CFA",premiumLead:"Ціни, створені для Африки, зосереджені на Ісусі. 9 000 F / 15 000 F / 30 000 F",paymentTitle:"Оплата на діло Ісуса",footerDesc:"Християнські знайомства, зосереджені на Ісусі Христі. Ісус у центрі. 21 мова. Видалення остаточне."
},
ur:{
choose:"یہ پلان منتخب کریں",free:"مفت",navHome:"ہوم",navMeet:"ملاقات",navVerses:"یسوع کی آیات",navGame:"بائبل کھیل",navMusic:"موسیقی",navMod:"نگرانی",navPremium:"پریمیم",
heroBadge:"✝️ یسوع مسیح ہی راہ ہیں - 2026",heroTitle:"خدا کے مطابق ابدی عہد پانے کے لیے یسوع مسیح مرکز میں۔",heroDesc:"<strong>یسوع مسیح ہی بنیاد ہیں۔</strong> پادری تصدیق، یسوع پر بائبل مطالعہ، یسوع کے نام میں دعائیہ چیٹ اور یسوع پر بائبل کھیل۔ محبت کے مرکز میں یسوع ہیں۔",
btnDiscover:"یسوع میں پروفائل دیکھیں",btnVerses:"یسوع کے بارے میں آیات",
verseDayTitle:"✝️ آج کی آیت - یسوع",verseDayText:"« یسوع مسیح کل اور آج بلکہ ابد تک یکساں ہے - وہی ہماری محبت کا نمونہ ہے »",verseDayCite:"عبرانیوں 13:8 اور 1 کرنتھیوں 13:4 — یسوع، ہر عہد کی بنیاد",
meetTitle:"یسوع مسیح میں ملاقات",meetLead:"ہر پروفائل میں نام، عمر اور شہر نظر آتا ہے۔ عمر (X اور Y کے درمیان)، کلیسیا اور جنس کے مطابق چھانٹیں۔",
churchAll:"یسوع میں تمام کلیسیائی فرقے",genderAll:"تمام جنس",searchPh:"نام، یسوع کی آیت تلاش کریں...",
ageMinLabel:"کم از کم عمر:",ageMaxLabel:"زیادہ سے زیادہ عمر:",ageTo:"تا",
loginTitle:"یسوع میں لاگ اِن",loginBtn:"یسوع میں لاگ اِن کریں",registerTitle:"رجسٹریشن - یسوع میں عہد سے جُڑیں",registerBtn:"یسوع میں میرا پروفائل بنائیں",
versesTitle:"📖 آیات کی لائبریری - یسوع مرکز میں",versesLead:"یہ تمام آیات یسوع مسیح کے بارے میں ہیں۔ آیت کاپی کرنے کے لیے کلک کریں۔ یسوع ہر عہد کے مرکز میں ہیں۔",
gameTitle:"یسوع پر بائبل کھیل 🎮",gameLead:"یسوع اور شادی پر 25 سوالات، یسوع کی 12 آیات، 12 بائبلی جوڑے۔",
musicTitle:"مسیحی موسیقی - یسوع",musicLead:"یسوع مسیح کے لیے حمدیں، ہمارے آسمانی دولہا کے لیے۔",
uploadTitle:"🎵 یسوع کے لیے حمدیں اپ لوڈ کریں",uploadBtn:"یسوع کے لیے شامل کریں",
modTitle:"یسوع میں نگرانی",modLead:"یسوع میں پروفائلز کا انتظام کریں۔ ترمیم کریں یا حذف کریں۔ حذف شدہ واپس نہیں آتا۔",
premiumTitle:"یسوع میں رکنیت - CFA قیمتیں",premiumLead:"افریقہ کے لیے بنائی گئی قیمتیں، یسوع پر مرکوز۔ 9,000 F / 15,000 F / 30,000 F",paymentTitle:"یسوع کے کام کے لیے ادائیگی",footerDesc:"یسوع مسیح پر مرکوز مسیحی ملاقات۔ یسوع مرکز میں۔ 21 زبانیں۔ حذف مستقل ہے۔"
},
ro:{
choose:"Alege acest plan",free:"Gratuit",navHome:"Acasă",navMeet:"Întâlniri",navVerses:"Versete despre Isus",navGame:"Joc biblic",navMusic:"Muzică",navMod:"Moderare",navPremium:"Premium",
heroBadge:"✝️ Isus Hristos este Calea - 2026",heroTitle:"Isus Hristos în centru pentru a găsi un legământ veșnic după voia lui Dumnezeu.",heroDesc:"<strong>Isus Hristos este temelia.</strong> Verificare pastorală, studiu biblic despre Isus, chat de rugăciune în numele lui Isus și jocuri biblice despre Isus. Iubirea îl are pe Isus în centru.",
btnDiscover:"Descoperă profilurile în Isus",btnVerses:"Versete despre Isus",
verseDayTitle:"✝️ Versetul zilei - Isus",verseDayText:"« Isus Hristos este același ieri, azi și în veci - El este modelul nostru de iubire »",verseDayCite:"Evrei 13:8 și 1 Corinteni 13:4 — Isus, temelia fiecărui legământ",
meetTitle:"Întâlniri în Isus Hristos",meetLead:"Fiecare profil afișează numele, vârsta și orașul. Filtrează după vârstă (între X și Y), biserică și gen.",
churchAll:"Toate confesiunile în Isus",genderAll:"Toate genurile",searchPh:"Caută prenume, verset despre Isus...",
ageMinLabel:"Vârsta minimă:",ageMaxLabel:"Vârsta maximă:",ageTo:"până la",
loginTitle:"Conectare în Isus",loginBtn:"Conectează-te în Isus",registerTitle:"Înregistrare - Intră în legământul în Isus",registerBtn:"Creează-mi profilul în Isus",
versesTitle:"📖 Biblioteca de versete - Isus în centru",versesLead:"Toate aceste versete vorbesc despre Isus Hristos. Apasă pentru a copia versetul. Isus este în centrul fiecărui legământ.",
gameTitle:"Joc biblic despre Isus 🎮",gameLead:"25 de întrebări despre Isus și căsătorie, 12 versete ale lui Isus, 12 cupluri biblice.",
musicTitle:"Muzică creștină - Isus",musicLead:"Cântări pentru Isus Hristos, Mirele nostru ceresc.",
uploadTitle:"🎵 Încarcă cântări pentru Isus",uploadBtn:"Adaugă pentru Isus",
modTitle:"Moderare în Isus",modLead:"Gestionează profilurile în Isus. Modifică sau șterge. Ștergerile nu se mai pot anula.",
premiumTitle:"Abonamente în Isus - Prețuri în CFA",premiumLead:"Prețuri gândite pentru Africa, centrate pe Isus. 9 000 F / 15 000 F / 30 000 F",paymentTitle:"Plată pentru lucrarea lui Isus",footerDesc:"Întâlniri creștine centrate pe Isus Hristos. Isus în centru. 21 de limbi. Ștergeri definitive."
}
};

const CONFESSIONS=["Catholique", "Protestante", "Évangélique", "Pentecôtiste", "Baptiste", "Adventiste du 7ème Jour", "Orthodoxe", "Méthodiste", "Presbytérienne", "Luthérienne", "Anglicane", "Église de Réveil", "Église Kimbanguiste", "Église Royaume Universel de Dieu", "Autre chrétienne en Jésus"];
/* comparaison tolérante des églises (anciens profils « Adventiste », « Protestant »…) */
function nljChNorm(x){x=String(x==null?"":x).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();if(x.indexOf("adventiste")===0)return "adventiste";if(x==="protestant")return "protestante";if(x.indexOf("autre")===0)return "autre";return x;}
function nljSameChurch(a,b){return !!a&&!!b&&nljChNorm(a)===nljChNorm(b);}
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
const PRICEX={fr:["Découverte", "Mensuel Jésus", "Alliance 6 Mois", "Éternelle 12 Mois", "Gratuit à vie", "/ mois", "/ 6 mois", "/ 12 mois", "★ Le plus choisi", "★ Meilleure offre Jésus", "Économisez {p} en Jésus", "soit {p} / mois · payé en une fois", "10 likes/jour en Jésus", "Écouter la musique", "Jeux sur Jésus", "Étude biblique", "Profils : nom, âge et ville", "Likes illimités en Jésus", "Chat prière au nom de Jésus (messages écrits et vocaux)", "Étude biblique Jésus à deux", "Écouter et télécharger la musique", "Jeux complets Jésus", "Filtres âge, genre et confession", "Profil mis en avant", "Vérification pastorale Jésus", "Coaching mariage en Jésus", "Top profil 1 an", "Support en Jésus", "Tout Mensuel Jésus", "Tout Alliance 6 mois", "Publications vocales et écrites", "20 messages écrits par jour", "Messages écrits illimités", "Photos, appels vidéo, contacts"],en:["Discovery", "Monthly", "Alliance 6 months", "Eternal 12 months", "Free for life", "/ month", "/ 6 months", "/ 12 months", "★ Most popular", "★ Best offer", "Save {p} in Jesus", "that is {p} / month · paid at once", "10 likes/day in Jesus", "Listen to music", "Games about Jesus", "Bible study", "Profiles: name, age and city", "Unlimited likes in Jesus", "Prayer chat in Jesus' name (written and voice messages)", "Bible study about Jesus for two", "Listen to and download music", "Full games about Jesus", "Age, gender and denomination filters", "Featured profile", "Pastoral verification", "Marriage coaching in Jesus", "Top profile for 1 year", "Support in Jesus", "Everything in Monthly", "Everything in Alliance 6 months", "Voice and written posts", "20 written messages per day", "Unlimited written messages", "Photos, video calls, contacts"],es:["Descubrimiento", "Mensual", "Alianza 6 meses", "Eterna 12 meses", "Gratis de por vida", "/ mes", "/ 6 meses", "/ 12 meses", "★ La más elegida", "★ Mejor oferta", "Ahorra {p} en Jesús", "es decir {p} / mes · pagado de una vez", "10 me gusta al día en Jesús", "Escuchar música", "Juegos sobre Jesús", "Estudio bíblico", "Perfiles: nombre, edad y ciudad", "Me gusta ilimitados en Jesús", "Chat de oración en el nombre de Jesús (mensajes escritos y de voz)", "Estudio bíblico sobre Jesús en pareja", "Escuchar y descargar música", "Juegos completos sobre Jesús", "Filtros de edad, género y confesión", "Perfil destacado", "Verificación pastoral", "Coaching matrimonial en Jesús", "Perfil destacado durante 1 año", "Soporte en Jesús"],pt:["Descoberta", "Mensal", "Aliança 6 meses", "Eterna 12 meses", "Grátis para sempre", "/ mês", "/ 6 meses", "/ 12 meses", "★ A mais escolhida", "★ Melhor oferta", "Poupe {p} em Jesus", "ou seja {p} / mês · pago de uma só vez", "10 curtidas por dia em Jesus", "Ouvir música", "Jogos sobre Jesus", "Estudo bíblico", "Perfis: nome, idade e cidade", "Curtidas ilimitadas em Jesus", "Chat de oração em nome de Jesus (mensagens escritas e de voz)", "Estudo bíblico sobre Jesus a dois", "Ouvir e baixar música", "Jogos completos sobre Jesus", "Filtros de idade, género e confissão", "Perfil em destaque", "Verificação pastoral", "Coaching de casamento em Jesus", "Perfil em destaque por 1 ano", "Suporte em Jesus"],it:["Scoperta", "Mensile", "Alleanza 6 mesi", "Eterna 12 mesi", "Gratis a vita", "/ mese", "/ 6 mesi", "/ 12 mesi", "★ La più scelta", "★ Migliore offerta", "Risparmia {p} in Gesù", "cioè {p} / mese · pagato in un'unica soluzione", "10 like al giorno in Gesù", "Ascoltare la musica", "Giochi su Gesù", "Studio biblico", "Profili: nome, età e città", "Like illimitati in Gesù", "Chat di preghiera nel nome di Gesù (messaggi scritti e vocali)", "Studio biblico su Gesù in due", "Ascoltare e scaricare la musica", "Giochi completi su Gesù", "Filtri per età, genere e confessione", "Profilo in evidenza", "Verifica pastorale", "Coaching matrimoniale in Gesù", "Profilo in evidenza per 1 anno", "Supporto in Gesù"],de:["Entdeckung", "Monatlich", "Bund 6 Monate", "Ewig 12 Monate", "Lebenslang kostenlos", "/ Monat", "/ 6 Monate", "/ 12 Monate", "★ Am beliebtesten", "★ Bestes Angebot", "Sparen Sie {p} in Jesus", "also {p} / Monat · einmalig bezahlt", "10 Likes pro Tag in Jesus", "Musik hören", "Spiele über Jesus", "Bibelstudium", "Profile: Name, Alter und Stadt", "Unbegrenzte Likes in Jesus", "Gebetschat im Namen Jesu (Text- und Sprachnachrichten)", "Bibelstudium über Jesus zu zweit", "Musik hören und herunterladen", "Vollständige Spiele über Jesus", "Filter für Alter, Geschlecht und Konfession", "Hervorgehobenes Profil", "Pastorale Überprüfung", "Ehecoaching in Jesus", "Top-Profil für 1 Jahr", "Support in Jesus"],ar:["اكتشاف", "شهري", "العهد 6 أشهر", "الأبدية 12 شهرًا", "مجاني مدى الحياة", "/ شهر", "/ 6 أشهر", "/ 12 شهرًا", "★ الأكثر اختيارًا", "★ أفضل عرض", "وفّر {p} في يسوع", "أي {p} / شهر · يُدفع دفعة واحدة", "10 إعجابات يوميًا في يسوع", "الاستماع إلى الموسيقى", "ألعاب عن يسوع", "دراسة الكتاب المقدس", "الملفات: الاسم والعمر والمدينة", "إعجابات غير محدودة في يسوع", "دردشة صلاة باسم يسوع (رسائل مكتوبة وصوتية)", "دراسة الكتاب المقدس عن يسوع بين اثنين", "الاستماع إلى الموسيقى وتحميلها", "ألعاب كاملة عن يسوع", "مرشحات العمر والجنس والطائفة", "ملف مميز", "تحقق رعوي", "إرشاد زواجي في يسوع", "ملف في الصدارة لمدة سنة", "دعم في يسوع"],zh:["探索版", "月度", "盟约 6 个月", "永恒 12 个月", "终身免费", "/ 月", "/ 6 个月", "/ 12 个月", "★ 最多人选择", "★ 最优惠", "在耶稣里节省 {p}", "即 {p} / 月 · 一次付清", "在耶稣里每天 10 个赞", "听音乐", "关于耶稣的游戏", "圣经学习", "资料：姓名、年龄和城市", "在耶稣里无限点赞", "奉耶稣的名祷告聊天（文字和语音消息）", "两人一起的耶稣圣经学习", "听音乐和下载音乐", "完整的耶稣游戏", "年龄、性别和宗派筛选", "突出显示的资料", "牧者验证", "在耶稣里的婚姻辅导", "置顶资料 1 年", "在耶稣里的支持"],nl:["Ontdekking", "Maandelijks", "Verbond 6 maanden", "Eeuwig 12 maanden", "Gratis voor altijd", "/ maand", "/ 6 maanden", "/ 12 maanden", "★ Meest gekozen", "★ Beste aanbieding", "Bespaar {p} in Jezus", "dus {p} / maand · in één keer betaald", "10 likes per dag in Jezus", "Muziek beluisteren", "Spellen over Jezus", "Bijbelstudie", "Profielen: naam, leeftijd en stad", "Onbeperkt likes in Jezus", "Gebedschat in de naam van Jezus (geschreven en gesproken berichten)", "Bijbelstudie over Jezus samen", "Muziek beluisteren en downloaden", "Volledige spellen over Jezus", "Filters op leeftijd, geslacht en kerkgenootschap", "Uitgelicht profiel", "Pastorale verificatie", "Huwelijkscoaching in Jezus", "Topprofiel gedurende 1 jaar", "Ondersteuning in Jezus"],ru:["Знакомство", "Ежемесячно", "Союз на 6 месяцев", "Вечный на 12 месяцев", "Бесплатно навсегда", "/ месяц", "/ 6 месяцев", "/ 12 месяцев", "★ Самый популярный", "★ Лучшее предложение", "Сэкономьте {p} в Иисусе", "то есть {p} / месяц · оплата сразу", "10 лайков в день в Иисусе", "Слушать музыку", "Игры об Иисусе", "Изучение Библии", "Анкеты: имя, возраст и город", "Безлимитные лайки в Иисусе", "Молитвенный чат во имя Иисуса (текстовые и голосовые сообщения)", "Изучение Библии об Иисусе вдвоём", "Слушать и скачивать музыку", "Полные игры об Иисусе", "Фильтры по возрасту, полу и конфессии", "Выделенная анкета", "Пасторская проверка", "Брачный коучинг в Иисусе", "Топ-анкета на 1 год", "Поддержка в Иисусе"],ln:["Boyebi", "Sanza na sanza", "Bondeko sanza 6", "Seko sanza 12", "Ofele libela", "/ sanza", "/ sanza 6", "/ sanza 12", "★ Oyo bato mingi baponi", "★ Likambo ya malamu", "Kobomba {p} na Yesu", "ezali {p} / sanza · efutami mbala moko", "Likes 10 na mokolo na Yesu", "Koyoka miziki", "Momekano na ntina ya Yesu", "Boyekoli Biblia", "Mapwofile : kombo, mbula mpe engumba", "Likes ebimeli te na Yesu", "Tchat ya mabondeli na kombo ya Yesu (nsango ekomami mpe ya mongongo)", "Boyekoli Biblia na ntina ya Yesu mibale", "Koyoka mpe kozwa miziki", "Momekano mobimba na ntina ya Yesu", "Filtre ya mbula, bonsomi mpe eklezya", "Pwofile ezali kolakisama", "Botalaki ya pasteur", "Koteya libala na Yesu", "Pwofile ya liboso mbula 1", "Lisungi na Yesu"],sw:["Ugunduzi", "Kila mwezi", "Agano miezi 6", "Milele miezi 12", "Bure maisha yote", "/ mwezi", "/ miezi 6", "/ miezi 12", "★ Inayochaguliwa zaidi", "★ Ofa bora", "Okoa {p} katika Yesu", "yaani {p} / mwezi · inalipwa mara moja", "Likes 10 kwa siku katika Yesu", "Kusikiliza muziki", "Michezo kuhusu Yesu", "Funzo la Biblia", "Wasifu: jina, umri na mji", "Likes zisizo na kikomo katika Yesu", "Gumzo la maombi kwa jina la Yesu (ujumbe wa maandishi na wa sauti)", "Funzo la Biblia kuhusu Yesu kwa wawili", "Kusikiliza na kupakua muziki", "Michezo kamili kuhusu Yesu", "Vichujio vya umri, jinsia na dhehebu", "Wasifu unaoangaziwa", "Uthibitisho wa kichungaji", "Ushauri wa ndoa katika Yesu", "Wasifu wa juu kwa mwaka 1", "Msaada katika Yesu"],hi:["खोज", "मासिक", "वाचा 6 महीने", "अनन्त 12 महीने", "जीवन भर निःशुल्क", "/ माह", "/ 6 महीने", "/ 12 महीने", "★ सबसे ज़्यादा चुना गया", "★ सर्वोत्तम ऑफ़र", "यीशु में {p} बचाएँ", "यानी {p} / माह · एक बार में भुगतान", "यीशु में प्रतिदिन 10 लाइक", "संगीत सुनें", "यीशु पर खेल", "बाइबल अध्ययन", "प्रोफ़ाइल: नाम, उम्र और शहर", "यीशु में असीमित लाइक", "यीशु के नाम में प्रार्थना चैट (लिखित और वॉइस संदेश)", "दो लोगों के लिए यीशु पर बाइबल अध्ययन", "संगीत सुनें और डाउनलोड करें", "यीशु पर पूर्ण खेल", "उम्र, लिंग और कलीसिया के फ़िल्टर", "विशेष रूप से दिखाई जाने वाली प्रोफ़ाइल", "पास्टरीय सत्यापन", "यीशु में विवाह परामर्श", "1 वर्ष के लिए शीर्ष प्रोफ़ाइल", "यीशु में सहायता"],id:["Penemuan", "Bulanan", "Perjanjian 6 bulan", "Kekal 12 bulan", "Gratis seumur hidup", "/ bulan", "/ 6 bulan", "/ 12 bulan", "★ Paling banyak dipilih", "★ Penawaran terbaik", "Hemat {p} dalam Yesus", "yaitu {p} / bulan · dibayar sekaligus", "10 suka per hari dalam Yesus", "Mendengarkan musik", "Permainan tentang Yesus", "Pendalaman Alkitab", "Profil: nama, usia, dan kota", "Suka tanpa batas dalam Yesus", "Obrolan doa dalam nama Yesus (pesan tertulis dan suara)", "Pendalaman Alkitab tentang Yesus berdua", "Mendengarkan dan mengunduh musik", "Permainan lengkap tentang Yesus", "Filter usia, jenis kelamin, dan denominasi", "Profil unggulan", "Verifikasi pastoral", "Konseling pernikahan dalam Yesus", "Profil teratas selama 1 tahun", "Dukungan dalam Yesus"],tl:["Pagtuklas", "Buwanan", "Tipan 6 buwan", "Walang hanggan 12 buwan", "Libre habambuhay", "/ buwan", "/ 6 buwan", "/ 12 buwan", "★ Pinakapinipili", "★ Pinakamagandang alok", "Makatipid ng {p} kay Hesus", "o {p} / buwan · isang bayaran lang", "10 likes bawat araw kay Hesus", "Makinig ng musika", "Mga laro tungkol kay Hesus", "Pag-aaral ng Biblia", "Mga profile: pangalan, edad, at lungsod", "Walang limit na likes kay Hesus", "Panalanging chat sa pangalan ni Hesus (nakasulat at boses na mensahe)", "Pag-aaral ng Biblia tungkol kay Hesus nang dalawa", "Makinig at mag-download ng musika", "Kumpletong mga laro tungkol kay Hesus", "Mga filter sa edad, kasarian, at denominasyon", "Naka-highlight na profile", "Pastoral na beripikasyon", "Marriage coaching kay Hesus", "Top profile sa loob ng 1 taon", "Suporta kay Hesus"],ko:["탐색", "월간", "언약 6개월", "영원 12개월", "평생 무료", "/ 월", "/ 6개월", "/ 12개월", "★ 가장 많이 선택", "★ 최고의 혜택", "예수님 안에서 {p} 절약", "즉 월 {p} · 한 번에 결제", "예수님 안에서 하루 좋아요 10개", "음악 듣기", "예수님에 관한 게임", "성경 공부", "프로필: 이름, 나이, 도시", "예수님 안에서 무제한 좋아요", "예수님의 이름으로 하는 기도 채팅 (문자 및 음성 메시지)", "둘이 함께하는 예수님 성경 공부", "음악 듣기 및 다운로드", "예수님에 관한 전체 게임", "나이, 성별, 교단 필터", "강조 프로필", "목회적 검증", "예수님 안에서의 결혼 코칭", "1년간 상위 프로필", "예수님 안에서의 지원"],vi:["Khám phá", "Hằng tháng", "Giao ước 6 tháng", "Vĩnh cửu 12 tháng", "Miễn phí trọn đời", "/ tháng", "/ 6 tháng", "/ 12 tháng", "★ Được chọn nhiều nhất", "★ Ưu đãi tốt nhất", "Tiết kiệm {p} trong Chúa Giêsu", "tức {p} / tháng · thanh toán một lần", "10 lượt thích mỗi ngày trong Chúa Giêsu", "Nghe nhạc", "Trò chơi về Chúa Giêsu", "Học Kinh Thánh", "Hồ sơ: tên, tuổi và thành phố", "Lượt thích không giới hạn trong Chúa Giêsu", "Trò chuyện cầu nguyện nhân danh Chúa Giêsu (tin nhắn văn bản và giọng nói)", "Học Kinh Thánh về Chúa Giêsu cho hai người", "Nghe và tải nhạc", "Trò chơi đầy đủ về Chúa Giêsu", "Bộ lọc tuổi, giới tính và giáo phái", "Hồ sơ nổi bật", "Xác minh mục vụ", "Tư vấn hôn nhân trong Chúa Giêsu", "Hồ sơ hàng đầu trong 1 năm", "Hỗ trợ trong Chúa Giêsu"],pl:["Odkrywanie", "Miesięczny", "Przymierze 6 miesięcy", "Wieczny 12 miesięcy", "Za darmo na zawsze", "/ miesiąc", "/ 6 miesięcy", "/ 12 miesięcy", "★ Najczęściej wybierany", "★ Najlepsza oferta", "Zaoszczędź {p} w Jezusie", "czyli {p} / miesiąc · płatne jednorazowo", "10 polubień dziennie w Jezusie", "Słuchanie muzyki", "Gry o Jezusie", "Studium biblijne", "Profile: imię, wiek i miasto", "Nieograniczone polubienia w Jezusie", "Czat modlitewny w imię Jezusa (wiadomości tekstowe i głosowe)", "Studium biblijne o Jezusie we dwoje", "Słuchanie i pobieranie muzyki", "Pełne gry o Jezusie", "Filtry wieku, płci i wyznania", "Wyróżniony profil", "Weryfikacja duszpasterska", "Coaching małżeński w Jezusie", "Najlepszy profil przez 1 rok", "Wsparcie w Jezusie"],uk:["Знайомство", "Щомісяця", "Завіт на 6 місяців", "Вічний на 12 місяців", "Безкоштовно назавжди", "/ місяць", "/ 6 місяців", "/ 12 місяців", "★ Найпопулярніший", "★ Найкраща пропозиція", "Заощадьте {p} в Ісусі", "тобто {p} / місяць · оплата одразу", "10 вподобань на день в Ісусі", "Слухати музику", "Ігри про Ісуса", "Вивчення Біблії", "Анкети: ім’я, вік і місто", "Необмежені вподобання в Ісусі", "Молитовний чат в ім’я Ісуса (текстові та голосові повідомлення)", "Вивчення Біблії про Ісуса вдвох", "Слухати та завантажувати музику", "Повні ігри про Ісуса", "Фільтри за віком, статтю та конфесією", "Виділена анкета", "Пастирська перевірка", "Шлюбний коучинг в Ісусі", "Топ-анкета на 1 рік", "Підтримка в Ісусі"],ur:["دریافت", "ماہانہ", "عہد 6 ماہ", "ابدی 12 ماہ", "عمر بھر مفت", "/ ماہ", "/ 6 ماہ", "/ 12 ماہ", "★ سب سے زیادہ منتخب", "★ بہترین پیشکش", "یسوع میں {p} بچائیں", "یعنی {p} / ماہ · ایک ساتھ ادائیگی", "یسوع میں روزانہ 10 لائکس", "موسیقی سنیں", "یسوع پر کھیل", "بائبل مطالعہ", "پروفائل: نام، عمر اور شہر", "یسوع میں لامحدود لائکس", "یسوع کے نام میں دعائیہ چیٹ (تحریری اور صوتی پیغامات)", "دو افراد کے لیے یسوع پر بائبل مطالعہ", "موسیقی سنیں اور ڈاؤن لوڈ کریں", "یسوع پر مکمل کھیل", "عمر، جنس اور کلیسیائی فرقے کے فلٹر", "نمایاں پروفائل", "پادری تصدیق", "یسوع میں ازدواجی رہنمائی", "1 سال کے لیے سرِفہرست پروفائل", "یسوع میں معاونت"],ro:["Descoperire", "Lunar", "Legământ 6 luni", "Veșnic 12 luni", "Gratuit pe viață", "/ lună", "/ 6 luni", "/ 12 luni", "★ Cel mai ales", "★ Cea mai bună ofertă", "Economisește {p} în Isus", "adică {p} / lună · plătit o singură dată", "10 aprecieri pe zi în Isus", "Ascultă muzică", "Jocuri despre Isus", "Studiu biblic", "Profiluri: nume, vârstă și oraș", "Aprecieri nelimitate în Isus", "Chat de rugăciune în numele lui Isus (mesaje scrise și vocale)", "Studiu biblic despre Isus în doi", "Ascultă și descarcă muzică", "Jocuri complete despre Isus", "Filtre după vârstă, gen și confesiune", "Profil evidențiat", "Verificare pastorală", "Coaching pentru căsătorie în Isus", "Profil de top timp de 1 an", "Suport în Isus"]};
function PX(i){const l=String(currentLang||'fr').toLowerCase();const a=PRICEX[l]||PRICEX.fr;return a[i]||PRICEX.fr[i];}
function PXL(i,fb){return String(currentLang||'fr').toLowerCase()==='fr'?fb:PX(i);}
function renderPricing(){
const grid=document.getElementById("pricingGrid");
const dict=I18N[currentLang]||I18N.fr;
const FD=[PX(12),PX(31),PX(30),PX(13),PX(14),PX(15)];
const FM=[17,32,18,33,19,20,27].map(PX);
const FA=[28,21,22,23].map(PX);
const FE=[29,24,25,26].map(PX);
const plans=[
{key:PX(0),keyId:"Découverte",xof:0,duration:PX(4),features:FD,cta:dict.choose,cls:""},
{key:PX(1),keyId:"Mensuel",xof:BASE_PRICES_XOF.mensuel,duration:PX(5),badge:"",features:FM,cta:dict.choose,cls:""},
{key:PX(2),keyId:"Alliance",months:6,xof:BASE_PRICES_XOF.semestre,duration:PX(6),badge:PX(8),save:PX(10).replace("{p}",formatPrice(39000)),featured:true,features:FA,cta:dict.choose,cls:"featured"},
{key:PX(3),keyId:"Éternelle",months:12,xof:BASE_PRICES_XOF.annuel,duration:PX(7),badge:PX(9),save:PX(10).replace("{p}",formatPrice(78000)),features:FE,cta:dict.choose,cls:""}
];
plans.sort((x,y)=>x.xof-y.xof);
grid.innerHTML=plans.map(p=>{
let priceHtml;
if(p.xof===0) priceHtml=`<div class="price">${dict.free}<small style="font-size:.5em;display:block;color:var(--muted);margin-top:4px">${p.duration}</small></div>`;
else priceHtml=`<div class="price">${formatPrice(p.xof)}<small>${p.duration}</small>${p.months?`<div style="font-size:.4em;color:var(--muted);font-weight:700;margin-top:8px">${PX(11).replace("{p}",formatPrice(p.xof/p.months))}</div>`:''}${p.save?`<div style="background:#dcfce7;color:#166534;font-size:.42em;padding:4px 10px;border-radius:999px;margin-top:10px;display:inline-block;font-weight:800">${p.save}</div>`:''}</div>`;
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
profiles.filter(p=>String(p.status||"").trim().toLowerCase()==="approved").filter(p=>!church||nljSameChurch(p.church,church)||nljSameChurch(p.confession,church)).filter(p=>!gender||p.gender===gender).filter(p=>!p.age||(p.age>=ageMin && p.age<=ageMax)).filter(p=>!search||((p.name||"")+(p.verse||"")+(p.church||"")).toLowerCase().includes(search)).forEach(p=>{
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
lang=String(lang||'fr').toLowerCase(); const __code=lang; if(!I18N[lang])lang='fr'; const t=Object.assign({},I18N.fr,I18N.en,I18N[lang]);
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
document.documentElement.lang=__code;
// Direction : arabe et ourdou de droite à gauche
document.documentElement.dir=(__code==='ar'||__code==='ur')?'rtl':'ltr';
localStorage.setItem('niamke_lang',__code);
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
/* --- Anti-saut des jeux (téléphone) ---
   newGame : arrête le chrono de la partie précédente (sinon il continue en fond et fait sauter des questions)
   later   : minuterie ignorée si une autre partie a démarré entre-temps
   keepHeight : le plateau ne rétrécit jamais pendant une partie (plus de saut de page entre deux questions) */
function newGame(){try{clearInterval(game.timer);}catch(e){}return {index:0,points:0,lives:3,timer:null,selected:[],matched:0,cards:[],locked:false};}
function later(fn,ms){const g=game;return setTimeout(function(){if(g===game)fn();},ms);}
let gameMO=null;
function keepHeight(reset){const c=document.getElementById("gameContent");if(!c)return;if(reset)c.style.minHeight="";if(gameMO||!window.MutationObserver)return;gameMO=new MutationObserver(function(){const h=c.offsetHeight,m=parseFloat(c.style.minHeight)||0;if(h>m+1)c.style.minHeight=h+"px";});gameMO.observe(c,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]});}
function showBoard(t){document.getElementById("gameBoard").classList.remove("hidden");document.getElementById("gameTitle").textContent=t;document.getElementById("gamePoints").textContent=game.points;document.getElementById("gameLives").textContent="❤️".repeat(Math.max(game.lives,0))+"🖤".repeat(3-Math.max(game.lives,0));keepHeight(true);const gb=document.getElementById("gameBoard");requestAnimationFrame(function(){requestAnimationFrame(function(){try{gb.scrollIntoView({behavior:"smooth",block:"start"});}catch(e){gb.scrollIntoView();}});});}
function endGame(n){clearInterval(game.timer);let msg=game.points>=150?"🏆 Champion en Jésus !":game.points>=80?"🌟 Solide en Jésus !":"💪 Continue en Jésus !";document.getElementById("gameContent").innerHTML=`<div class="center" style="padding:20px"><div style="font-size:3.5rem">🎉✝️</div><h3>${n} terminé en Jésus !</h3><div style="background:#f0fdf4;border:2px solid var(--green);border-radius:16px;padding:20px;margin:16px 0"><p style="font-size:1.2rem">Score final en Jésus : <strong style="font-size:1.8rem;color:var(--green)">${game.points} pts</strong></p><p style="margin-top:10px;color:#166534;font-weight:600">${msg}</p></div><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:18px"><button class="btn btn-gold" data-nlj-act="startQuiz">🔄 Rejouer en Jésus</button><button class="btn btn-primary" data-nlj-act="startVerses">✍️ Versets Jésus</button><button class="btn btn-outline" data-nlj-act="startMemory">💞 Memory Jésus</button></div></div>`;}
function startQuiz(){game=newGame();showBoard("🧠 Quiz Jésus & Alliance");quizQuestion();}
function quizQuestion(){
if(game.index>=quiz.length) return endGame("Quiz Jésus");
if(game.lives<=0){clearInterval(game.timer);document.getElementById("gameContent").innerHTML=`<div class="center" style="padding:20px"><div style="font-size:3rem">💔</div><h3>Vies épuisées en Jésus !</h3><p>Question ${game.index+1}/${quiz.length} - ${game.points} pts</p><button class="btn btn-gold" data-nlj-act="startQuiz" style="margin-top:16px">🔄 Recommencer en Jésus</button></div>`;return;}
game.locked=false;const q=quiz[game.index];const progress=Math.round((game.index/quiz.length)*100);
document.getElementById("gameContent").innerHTML=`<div style="margin-bottom:16px"><div style="display:flex;justify-content:space-between;font-size:.85rem;font-weight:700;margin-bottom:6px"><span>Question ${game.index+1}/${quiz.length} en Jésus</span><span>${progress}%</span></div><div style="height:8px;background:#e2e8f0;border-radius:999px;overflow:hidden"><div style="height:100%;width:${progress}%;background:linear-gradient(90deg,var(--gold),#f3e3b3)"></div></div></div><h3 style="margin:12px 0">${q[0]}</h3><div class="answers">${q[1].map((a,i)=>`<button class="answer" data-nlj-act="quizAnswer" data-nlj-a="[${i}]"><span style="display:inline-block;width:26px;height:26px;background:#e2e8f0;border-radius:50%;text-align:center;line-height:26px;font-size:.8rem;margin-right:8px">${String.fromCharCode(65+i)}</span>${a}</button>`).join("")}</div><div style="display:flex;justify-content:space-between;margin-top:14px"><p class="note" id="timer" style="background:#fef3c7;padding:6px 12px;border-radius:999px;font-weight:700">⏱️ 20s</p></div><div id="quizExplain" class="hidden" style="margin-top:14px;padding:14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;font-size:.9rem"></div>`;
let t=20;clearInterval(game.timer);const g0=game;game.timer=setInterval(()=>{if(g0!==game){clearInterval(g0.timer);return;}t--;const el=document.getElementById("timer");if(el){el.textContent=`⏱️ ${t}s`;if(t<=5) el.style.background="#fee2e2";}if(t<=0){clearInterval(game.timer);game.locked=true;document.querySelectorAll(".answer").forEach(b=>{b.disabled=true;b.style.pointerEvents="none";});game.lives--;const ex=document.getElementById("quizExplain");if(ex){ex.classList.remove("hidden");ex.innerHTML=`⏰ Temps écoulé en Jésus !<br><strong>Bonne réponse: ${q[1][q[2]]}</strong><br><em>${q[3]}</em>`;}later(()=>{game.index++;quizQuestion()},2200);}},1000);
}
function quizAnswer(c){if(game.locked)return;game.locked=true;clearInterval(game.timer);const q=quiz[game.index];document.querySelectorAll(".answer").forEach((b,i)=>{b.disabled=true;b.style.pointerEvents="none";if(i===q[2]){b.classList.add("correct");b.innerHTML+=" ✅";}else if(i===c){b.classList.add("wrong");b.innerHTML+=" ❌";}});const ex=document.getElementById("quizExplain");if(ex){ex.classList.remove("hidden");if(c===q[2]){game.points+=10;ex.innerHTML=`✅ <strong>Excellent en Jésus ! +10 pts</strong><br>${q[3]}`;showToast("✅ +10 pts en Jésus");}else{game.lives--;ex.innerHTML=`❌ <strong>Bonne réponse en Jésus: ${q[1][q[2]]}</strong><br><em>${q[3]}</em>`;showToast("❌ C'était "+q[1][q[2]]);}}document.getElementById("gamePoints").textContent=game.points;document.getElementById("gameLives").textContent="❤️".repeat(Math.max(game.lives,0))+"🖤".repeat(3-Math.max(game.lives,0));later(()=>{game.index++;quizQuestion()},2500);}
function startVerses(){game=newGame();showBoard("✍️ Versets de Jésus");verseQuestion();}
function verseQuestion(){if(game.index>=verses.length) return endGame("Versets de Jésus");game.locked=false;const v=verses[game.index];const progress=Math.round((game.index/verses.length)*100);document.getElementById("gameContent").innerHTML=`<div style="margin-bottom:16px"><div style="display:flex;justify-content:space-between;font-size:.85rem;font-weight:700;margin-bottom:6px"><span>Verset ${game.index+1}/${verses.length} en Jésus</span><span>${progress}%</span></div><div style="height:8px;background:#e2e8f0;border-radius:999px;overflow:hidden"><div style="height:100%;width:${progress}%;background:linear-gradient(90deg,var(--green),#bbf7d0)"></div></div></div><div style="background:#faf7ec;border-left:4px solid var(--gold);padding:16px;border-radius:0 12px 12px 0;margin:12px 0"><h3 style="font-size:1.2rem">"${v[0]}"</h3><p style="font-size:.85rem;color:var(--muted);margin-top:8px">💡 ${v[3]}</p></div><p style="font-weight:700;margin:12px 0">Choisis en Jésus :</p><div class="answers">${v[1].map(a=>`<button class="answer" data-nlj-act="verseAnswer" data-nlj-a="${NLJA([a])}">${a}</button>`).join("")}</div><div id="verseFeedback" class="hidden" style="margin-top:14px"></div>`;}
function verseAnswer(chosen){if(game.locked)return;game.locked=true;const v=verses[game.index];const correct=v[2];const fb=document.getElementById("verseFeedback");document.querySelectorAll(".answer").forEach(b=>{b.disabled=true;b.style.pointerEvents="none";if(b.textContent.trim()===correct) b.classList.add("correct");if(b.textContent.trim()===chosen && chosen!==correct) b.classList.add("wrong");});fb.classList.remove("hidden");if(chosen.toLowerCase()===correct.toLowerCase()){game.points+=20;fb.innerHTML=`<div style="padding:14px;background:#dcfce7;border-radius:12px"><strong>✅ Bravo en Jésus ! +20 pts</strong><br>Complet : <em>"${v[0].replace('___',correct)}"</em><br><small>${v[3]}</small></div>`;showToast("✅ +20 pts en Jésus");}else{fb.innerHTML=`<div style="padding:14px;background:#fee2e2;border-radius:12px"><strong>❌ C'était "${correct}" en Jésus</strong><br>Complet : <em>"${v[0].replace('___',correct)}"</em><br><small>${v[3]}</small></div>`;showToast("❌ Réponse: "+correct);}document.getElementById("gamePoints").textContent=game.points;later(()=>{game.index++;verseQuestion()},2500);}
function startMemory(){game=newGame();showBoard("💞 Memory en Jésus");game.cards=[];couples.forEach((c,i)=>{game.cards.push({id:i,name:c[0],matched:false});game.cards.push({id:i,name:c[1],matched:false});});game.cards.sort(()=>Math.random()-0.5);memoryBoard();}
function memoryBoard(){const matchedCount=game.cards.filter(c=>c.matched).length/2;const total=couples.length;document.getElementById("gameContent").innerHTML=`<div style="display:flex;justify-content:space-between;margin-bottom:12px;font-weight:700"><span>Paires en Jésus: ${matchedCount}/${total}</span><span>${game.points} pts</span></div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">${game.cards.map((c,i)=>{const isSel=game.selected.some(s=>s.index===i);const show=c.matched||isSel;return `<button class="answer" data-nlj-act="flipCard" data-nlj-a="[${i}]" style="height:82px;display:grid;place-items:center;font-weight:800;font-size:.9rem;${c.matched?'background:#dcfce7;border-color:var(--green);opacity:.7':''}${isSel&&!c.matched?'background:#fef3c7;border-color:var(--gold);transform:scale(1.05)':''}">${show?c.name:'<span style="font-size:1.6rem">✝️</span>'}</button>`;}).join("")}</div><div id="memoryMsg" style="margin-top:14px;text-align:center;font-weight:600;color:var(--muted)">${game.selected.length===1?'Choisis la 2ème carte en Jésus...':'Trouve les couples unis en Jésus !'}</div>`;if(matchedCount===total){later(()=>endGame("Memory en Jésus"),600);}}
function flipCard(i){if(game.cards[i].matched) return;if(game.selected.some(s=>s.index===i)) return;if(game.selected.length>=2) return;game.selected.push({index:i,id:game.cards[i].id});memoryBoard();if(game.selected.length===2){const[a,b]=game.selected;if(a.id===b.id){later(()=>{game.cards[a.index].matched=true;game.cards[b.index].matched=true;game.points+=25;game.selected=[];document.getElementById("gamePoints").textContent=game.points;showToast("💞 +25 pts en Jésus - "+couples[a.id][0]+" & "+couples[a.id][1]);memoryBoard();},700);}else{later(()=>{game.selected=[];memoryBoard();},1100);}}}

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
