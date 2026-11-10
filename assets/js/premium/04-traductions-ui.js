(function(){var XT={"t1": ["Espace réservé aux membres", "Members-only area", "Espacio reservado a miembros", "Área reservada a membros", "Area riservata ai membri", "Bereich nur für Mitglieder", "مساحة مخصصة للأعضاء", "仅限会员的空间", "Alleen voor leden", "Раздел только для участников"], "x1": ["Connecte-toi ou crée ton profil pour accéder à ton espace Premium.", "Log in or create your profile to access your Premium area.", "Inicia sesión o crea tu perfil para acceder a tu espacio Premium.", "Entre ou crie seu perfil para acessar seu espaço Premium.", "Accedi o crea il tuo profilo per accedere al tuo spazio Premium.", "Melde dich an oder erstelle dein Profil, um deinen Premium-Bereich zu öffnen.", "سجّل الدخول أو أنشئ ملفك الشخصي للوصول إلى مساحتك المميزة.", "请登录或创建资料以进入您的高级空间。", "Log in of maak je profiel aan om naar je Premium-ruimte te gaan.", "Войдите или создайте профиль, чтобы получить доступ к Premium-разделу."], "b1": ["Se connecter", "Log in", "Iniciar sesión", "Entrar", "Accedi", "Anmelden", "تسجيل الدخول", "登录", "Inloggen", "Войти"], "t2": ["Espace réservé aux abonnés Premium", "Premium subscribers only", "Espacio reservado a suscriptores Premium", "Área reservada a assinantes Premium", "Area riservata agli abbonati Premium", "Bereich nur für Premium-Abonnenten", "مساحة مخصصة لمشتركي بريميوم", "仅限高级订阅用户", "Alleen voor Premium-abonnees", "Раздел только для подписчиков Premium"], "x2": ["Choisis un abonnement pour débloquer les études, les musiques et le carnet de prière.", "Choose a plan to unlock the studies, the music and the prayer journal.", "Elige un plan para desbloquear los estudios, la música y el diario de oración.", "Escolha um plano para desbloquear os estudos, as músicas e o diário de oração.", "Scegli un abbonamento per sbloccare gli studi, la musica e il diario di preghiera.", "Wähle ein Abo, um die Bibelstudien, die Musik und das Gebetstagebuch freizuschalten.", "اختر اشتراكًا لفتح الدراسات والموسيقى ودفتر الصلاة.", "选择订阅以解锁学习、音乐和祷告日记。", "Kies een abonnement om de bijbelstudies, de muziek en het gebedsdagboek te ontgrendelen.", "Выберите подписку, чтобы открыть исследования, музыку и молитвенный дневник."], "b2": ["⭐ Devenir Premium", "⭐ Go Premium", "⭐ Hazte Premium", "⭐ Seja Premium", "⭐ Passa a Premium", "⭐ Premium werden", "⭐ اشترك في بريميوم", "⭐ 成为高级会员", "⭐ Word Premium", "⭐ Стать Premium"], "back": ["← Retour à l'accueil", "← Back to home", "← Volver al inicio", "← Voltar ao início", "← Torna alla home", "← Zurück zur Startseite", "← العودة إلى الرئيسية", "← 返回首页", "← Terug naar home", "← На главную"]},LK=["fr", "en", "es", "pt", "it", "de", "ar", "zh", "nl", "ru"];function X(k){var l='fr';try{l=(localStorage.getItem('niamke_lang')||'fr').toLowerCase();}catch(e){}var i=LK.indexOf(l);if(i<0)i=1;return XT[k][i];}var bb=document.getElementById('nljBack');if(bb)bb.textContent=X('back');var PLANNUM={'Mensuel':1,'Alliance':2,'Éternelle':3};
  var lock=document.getElementById('nljLock');
  function apply(s){
    if(s.premium){
      lock.style.display='none';
      try{NLJ_PLAN=3;window.NLJ_PLANNAME=s.plan||'';if(typeof applyLang==='function')applyLang(LANG);}catch(e){}
      return;
    }
    lock.style.display='flex';
    var btn=document.getElementById('nljLockBtn');btn.style.display='inline-block';
    if(!s.user){
      document.getElementById('nljLockTitle').textContent=X('t1');
      document.getElementById('nljLockText').textContent=X('x1');
      btn.textContent=X('b1');btn.setAttribute('href','2eme_page.html#auth');
    }else{
      document.getElementById('nljLockTitle').textContent=X('t2');
      document.getElementById('nljLockText').textContent=X('x2');
      btn.textContent=X('b2');btn.setAttribute('href','2eme_page.html#premium');
    }
  }
  window.addEventListener('message',function(e){
    if(e.data&&e.data.nlj==='state'&&e.source===parent){try{var pl={'Mensuel':1,'Alliance':2,'Éternelle':3};NLJ_PLAN=e.data.premium?(pl[e.data.plan]||1):0;window.NLJ_PLANNAME=e.data.premium?String(e.data.plan||''):'';}catch(x){}apply(e.data);}
  });
  try{parent.postMessage({nlj:'need-state'},'*');}catch(e){}
})();
