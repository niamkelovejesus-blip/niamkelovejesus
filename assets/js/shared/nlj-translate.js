/* ==========================================================================
   NLJ-TRANSLATE — traduction automatique de TOUTE la page (v1.0)
   Quand un membre choisit une langue, tout le texte visible est traduit :
   menus, publications, prières, versets, messages du tchat, profils, etc.
   Le contenu ajouté plus tard (nouvelle publication, nouveau message) est
   traduit automatiquement aussi. « Voir l'original » restaure le texte d'origine.
   ========================================================================== */
(function () {
  'use strict';
  if (window.NLJT) return;

  var MT = { fr: 'fr', en: 'en', es: 'es', pt: 'pt', it: 'it', de: 'de', ar: 'ar', zh: 'zh-CN', nl: 'nl', ru: 'ru',
    ln: 'ln', sw: 'sw', hi: 'hi', id: 'id', tl: 'tl', ko: 'ko', vi: 'vi', pl: 'pl', uk: 'uk', ur: 'ur', ro: 'ro' };
  var NEWLANG = { ln: 1, sw: 1, hi: 1, id: 1, tl: 1, ko: 1, vi: 1, pl: 1, uk: 1, ur: 1, ro: 1 };
  var UI = {
    fr: ['Traduit automatiquement', 'Voir l’original', 'Voir la traduction', 'Traduction en cours…'],
    en: ['Automatically translated', 'Show original', 'Show translation', 'Translating…'],
    es: ['Traducido automáticamente', 'Ver original', 'Ver traducción', 'Traduciendo…'],
    pt: ['Traduzido automaticamente', 'Ver original', 'Ver tradução', 'A traduzir…'],
    it: ['Tradotto automaticamente', 'Mostra originale', 'Mostra traduzione', 'Traduzione…'],
    de: ['Automatisch übersetzt', 'Original zeigen', 'Übersetzung zeigen', 'Wird übersetzt…'],
    ar: ['ترجمة تلقائية', 'عرض الأصل', 'عرض الترجمة', 'جارٍ الترجمة…'],
    zh: ['自动翻译', '查看原文', '查看翻译', '翻译中…'],
    nl: ['Automatisch vertaald', 'Origineel tonen', 'Vertaling tonen', 'Vertalen…'],
    ru: ['Автоперевод', 'Показать оригинал', 'Показать перевод', 'Перевод…'],
    ln: ['Ebongolami na machine', 'Tala ya yambo', 'Tala ebongoli', 'Ebongolami…'],
    sw: ['Imetafsiriwa kiotomatiki', 'Ona asili', 'Ona tafsiri', 'Inatafsiriwa…'],
    hi: ['स्वचालित रूप से अनुवादित', 'मूल देखें', 'अनुवाद देखें', 'अनुवाद हो रहा है…'],
    id: ['Diterjemahkan otomatis', 'Lihat aslinya', 'Lihat terjemahan', 'Menerjemahkan…'],
    tl: ['Awtomatikong isinalin', 'Tingnan ang orihinal', 'Tingnan ang salin', 'Isinasalin…'],
    ko: ['자동 번역됨', '원문 보기', '번역 보기', '번역 중…'],
    vi: ['Đã dịch tự động', 'Xem bản gốc', 'Xem bản dịch', 'Đang dịch…'],
    pl: ['Przetłumaczono automatycznie', 'Pokaż oryginał', 'Pokaż tłumaczenie', 'Tłumaczenie…'],
    uk: ['Автоматичний переклад', 'Показати оригінал', 'Показати переклад', 'Переклад…'],
    ur: ['خودکار ترجمہ', 'اصل دیکھیں', 'ترجمہ دیکھیں', 'ترجمہ ہو رہا ہے…'],
    ro: ['Tradus automat', 'Vezi originalul', 'Vezi traducerea', 'Se traduce…']
  };

  /* Éléments jamais traduits : noms, lecteur de chants (il gère déjà ses paroles), champs de saisie… */
  var SKIP_SEL = 'script,style,noscript,textarea,input,select,option,code,pre,svg,audio,video,iframe,' +
    '[translate="no"],.notranslate,#langSelect,#currencySelect,#nljt-bar,' +
    '.pc-name,.pw-ih b,.pw-ih time,#mzApp,#mzLyBox,#pfInfo';
  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
  var SEP = '\n§§§\n';

  var store = { orig: new WeakMap(), done: new WeakMap(), aorig: new WeakMap() };
  var mem = {};            // cache mémoire  { 'en': { 'texte fr': 'text en' } }
  var applied = null;      // langue actuellement appliquée
  var showOriginal = false;
  var busy = 0, timer = null, saveTimer = null, observer = null;

  function curLang() {
    var l = 'fr';
    try { l = (localStorage.getItem('niamke_lang') || 'fr').toLowerCase().slice(0, 2); } catch (e) {}
    return MT[l] ? l : 'fr';
  }
  function ui(i) { return (UI[curLang()] || UI.en)[i]; }

  /* ---------- cache (mémoire + localStorage) ---------- */
  function cacheFor(l) {
    if (mem[l]) return mem[l];
    try { Object.keys(localStorage).forEach(function (k) { if (/^nljt_/.test(k)) localStorage.removeItem(k); }); } catch (e) {}   // ancien cache (pouvait contenir du français)
    var c = {};
    try { c = JSON.parse(localStorage.getItem('nljt2_' + l) || '{}') || {}; } catch (e) {}
    return (mem[l] = c);
  }
  function persist(l) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      var c = cacheFor(l), keys = Object.keys(c);
      if (keys.length > 1500) { keys.slice(0, keys.length - 1200).forEach(function (k) { delete c[k]; }); }
      try { localStorage.setItem('nljt2_' + l, JSON.stringify(c)); } catch (e) {
        try { Object.keys(localStorage).forEach(function (k) { if (/^nljt2?_/.test(k) && k !== 'nljt2_' + l) localStorage.removeItem(k); }); } catch (e2) {}
      }
    }, 800);
  }

  /* ---------- moteurs de traduction (avec secours) ---------- */
  /* Disjoncteur : si Google bloque / limite / ne répond pas, on arrête de marteler le service,
     on attend (5 s, 10 s, 20 s… jusqu'à 2 min) puis on réessaie tout seul. */
  var cool = { until: 0, step: 0, tmr: null };
  var bad = {};                                   // { 'ln': { 'texte': heure de l'échec } } : pas de re-essai immédiat
  var mmBudget = 40;                              // MyMemory : quota gratuit très limité
  function nowMs() { return new Date().getTime(); }
  function tripped() { return nowMs() < cool.until; }
  function failing() { return cool.step > 0; }
  function trip() {
    cool.step = Math.min(cool.step + 1, 5);
    var wait = Math.min(5000 * Math.pow(2, cool.step - 1), 120000);
    cool.until = nowMs() + wait;
    clearTimeout(cool.tmr);
    cool.tmr = setTimeout(function () { if (!showOriginal) { try { go(false); } catch (e) {} } }, wait + 50);
    try { setBar(); } catch (e) {}
  }
  function healthy() { if (cool.step) { cool.step = 0; cool.until = 0; try { setBar(); } catch (e) {} } }
  function isBad(l, k) { var t = (bad[l] || {})[k]; return !!t && nowMs() - t < 45000; }
  function markBad(l, k) { (bad[l] = bad[l] || {})[k] = nowMs(); }
  function retryNow() { cool.step = 0; cool.until = 0; bad = {}; try { go(true); } catch (e) {} }

  function fetchT(url, opt, ms) {
    var ctl = window.AbortController ? new AbortController() : null, tm = null;
    if (ctl) { opt.signal = ctl.signal; tm = setTimeout(function () { ctl.abort(); }, ms || 9000); }
    return fetch(url, opt).then(function (r) { if (tm) clearTimeout(tm); return r; },
      function (e) { if (tm) clearTimeout(tm); throw e; });
  }
  var lastErr = '';
  function errTxt(e) { return !e ? '' : e.http ? ('HTTP ' + e.http) : (e.name === 'AbortError' ? 'timeout' : (e.mismatch ? 'format' : 'réseau')); }
  function parseGtx(j, texts) {
    var full = (j[0] || []).map(function (x) { return x[0] || ''; }).join('');
    var parts = full.split(/\s*§\s*§\s*§\s*/);
    if (parts.length !== texts.length) { var e = new Error('mismatch'); e.mismatch = true; throw e; }
    return parts.map(function (p) { return p.trim(); });
  }
  /* Secours : même service en GET (certains navigateurs / réseaux refusent le POST). Lots courts (< 1700 car. encodés). */
  function gtxGetBatch(texts, tgt) {
    var groups = [], cur = [], len = 0;
    texts.forEach(function (t) {
      var l = encodeURIComponent(t + SEP).length;
      if (cur.length && len + l > 1700) { groups.push(cur); cur = []; len = 0; }
      cur.push(t); len += l;
    });
    if (cur.length) groups.push(cur);
    return Promise.all(groups.map(function (g) {
      var u = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + encodeURIComponent(tgt) + '&dt=t&q=' + encodeURIComponent(g.join(SEP));
      return fetchT(u, { method: 'GET' }, 9000).then(function (r) { if (!r.ok) { var e = new Error('gtx ' + r.status); e.http = r.status; throw e; } return r.json(); })
        .then(function (j) { return parseGtx(j, g); });
    })).then(function (a) { return [].concat.apply([], a); });
  }
  function gtxBatch(texts, tgt) {
    var body = 'client=gtx&sl=auto&tl=' + encodeURIComponent(tgt) + '&dt=t&q=' + encodeURIComponent(texts.join(SEP));
    return fetchT('https://translate.googleapis.com/translate_a/single', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body
    }, 9000).then(function (r) { if (!r.ok) { var e = new Error('gtx ' + r.status); e.http = r.status; throw e; } return r.json(); })
      .then(function (j) {
        return parseGtx(j, texts);
      });
  }
  function myMemory(text, tgt) {
    if (mmBudget <= 0) return Promise.reject(new Error('mm-budget'));
    mmBudget--;
    var u = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text.slice(0, 480)) + '&langpair=' + encodeURIComponent('fr|' + tgt);
    return fetchT(u, {}, 8000).then(function (r) { return r.json(); }).then(function (j) {
      var t = j && j.responseData && j.responseData.translatedText;
      if (j && +j.responseStatus === 200 && t && !/MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(t)) return t;
      throw new Error('mm');
    });
  }
  function nulls(n) { var a = []; for (var i = 0; i < n; i++) a.push(null); return a; }
  /* Lot ; si Google a abîmé le séparateur, on coupe le lot en deux (et non texte par texte) :
     quelques requêtes au lieu de centaines. Jamais d'exception : les échecs reviennent en null. */
  function translateMany(texts, tgt) {
    if (!texts.length) return Promise.resolve([]);
    if (tripped()) return Promise.resolve(nulls(texts.length));
    return gtxBatch(texts, tgt).then(function (r) { healthy(); return r; }, function (err) {
      if (err && err.mismatch) {
        if (texts.length > 1) {
          var h = Math.ceil(texts.length / 2);
          return Promise.all([translateMany(texts.slice(0, h), tgt), translateMany(texts.slice(h), tgt)])
            .then(function (a) { return a[0].concat(a[1]); });
        }
        return myMemory(texts[0], tgt).then(function (t) { return [t]; }, function () { return [null]; });
      }
      // POST refusé / réseau / 429 / délai : on essaie le même service en GET, sinon on met en pause
      lastErr = errTxt(err);
      return gtxGetBatch(texts, tgt).then(function (r) { healthy(); lastErr = ''; return r; }, function (e2) {
        if (e2 && e2.mismatch && texts.length === 1) return myMemory(texts[0], tgt).then(function (t) { return [t]; }, function () { trip(); return [null]; });
        lastErr = errTxt(e2) || lastErr; trip(); return nulls(texts.length);
      });
    });
  }

  /* ---------- sélection du texte à traduire ---------- */
  var SCRIPT = { ar: /[\u0600-\u06FF]/g, ru: /[\u0400-\u04FF]/g, zh: /[\u4E00-\u9FFF]/g, hi: /[\u0900-\u097F]/g, ko: /[\uAC00-\uD7AF]/g };
  function inTargetScript(t) {
    var re = SCRIPT[curLang()]; if (!re) return false;
    var m = t.match(re), letters = t.match(/[A-Za-z\u00C0-\u00FF\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF]/g);
    return !!m && !!letters && m.length / letters.length > 0.5;
  }
  function translatable(s) {
    if (!s) return false;
    var t = s.trim();
    if (inTargetScript(t)) return false;
    if (t.length < 2 || t.length > 20000) return false;
    if (!/[A-Za-zÀ-ÿ\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF]/.test(t)) return false;
    if (/^(https?:\/\/|www\.)\S+$/i.test(t) || /^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(t)) return false;
    return true;
  }
  /* Nouvelles langues : les listes déroulantes (églises, filtres…) sont traduites aussi.
     Seules les <option> qui ont un attribut value sont touchées : la valeur enregistrée ne change jamais. */
  var SKIP_NOOPT = SKIP_SEL.replace('select,option,', '');
  function skipped(el) {
    if (!el) return true;
    if (el.tagName === 'OPTION' && el.hasAttribute('value') && NEWLANG[curLang()]) {
      var sel = el.parentElement && el.parentElement.closest ? el.parentElement.closest('select') : null;
      if (sel && (sel.id === 'langSelect' || sel.id === 'currencySelect')) return true;
      return !!(el.closest && el.closest(SKIP_NOOPT.replace(/,#langSelect|,#currencySelect/g, '')));
    }
    return !!(el.closest && el.closest(SKIP_SEL));
  }

  function collect(root) {
    var nodes = [], attrs = [];
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !translatable(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        return skipped(n.parentElement) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    var n; while ((n = w.nextNode())) nodes.push(n);
    var els = root.nodeType === 1 ? [root].concat([].slice.call(root.querySelectorAll('[placeholder],[title],[aria-label],[alt]'))) : [];
    els.forEach(function (el) {
      if (skipped(el) && !/^(INPUT|TEXTAREA)$/.test(el.tagName)) return;
      if (el.closest && el.closest('#nljt-bar,#mzApp,#langSelect')) return;
      ATTRS.forEach(function (a) {
        var v = el.getAttribute && el.getAttribute(a);
        if (v && translatable(v)) attrs.push([el, a, v]);
      });
    });
    return { nodes: nodes, attrs: attrs };
  }

  /* ---------- textes longs : découpés en phrases (<= 900 car.) puis recollés ---------- */
  function hardSplit(s, MAX) {
    var out = [];
    while (s.length > MAX) {
      var i = s.lastIndexOf(' ', MAX);
      if (i < MAX * 0.5) i = MAX;
      out.push(s.slice(0, i)); s = s.slice(i);
    }
    if (s) out.push(s);
    return out;
  }
  function splitLong(t) {
    var MAX = 900;
    if (t.length <= MAX) return [{ l: '', t: t, r: '' }];
    var sents = t.match(/[^.!?\u061F\u3002\uFF01\uFF1F\n]*[.!?\u061F\u3002\uFF01\uFF1F]+["'\u00BB\u201D\u2019)]*\s*|[^.!?\u061F\u3002\uFF01\uFF1F\n]+\s*|\n+/g) || [t];
    var chunks = [], cur = '';
    sents.forEach(function (x) {
      if (x.length > MAX) {
        if (cur) { chunks.push(cur); cur = ''; }
        hardSplit(x, MAX).forEach(function (p) { chunks.push(p); });
      } else if (cur.length + x.length > MAX) { chunks.push(cur); cur = x; }
      else cur += x;
    });
    if (cur) chunks.push(cur);
    var out = [], carry = '';
    chunks.forEach(function (c) {
      var mm = c.match(/^(\s*)([\s\S]*?)(\s*)$/);
      if (!mm[2]) { if (out.length) out[out.length - 1].r += c; else carry += c; return; }
      out.push({ l: carry + mm[1], t: mm[2], r: mm[3] }); carry = '';
    });
    return out.length ? out : [{ l: '', t: t, r: '' }];
  }

  /* ---------- application ---------- */
  function setNode(n, orig, tr) {
    var lead = (orig.match(/^\s*/) || [''])[0], trail = (orig.match(/\s*$/) || [''])[0];
    var val = lead + tr + trail;
    store.done.set(n, val);
    if (n.nodeValue !== val) n.nodeValue = val;
  }

  function run(root, tgt, cacheOnly) {
    if (tgt === 'fr' && !hasOriginals()) { setBar(); return Promise.resolve(); }
    var c = cacheFor(tgt), found = collect(root || document.body), need = {}, jobs = [];

    found.nodes.forEach(function (n) {
      var cur = n.nodeValue, known = store.orig.get(n);
      if (store.done.get(n) === cur && known) return;       // déjà traduit par nous
      var orig = cur; store.orig.set(n, orig);               // nouveau texte (ou ré-affiché par la page)
      jobs.push({ n: n, orig: orig });
    });
    found.attrs.forEach(function (a) {
      var m = store.aorig.get(a[0]) || {};
      if (m[a[1]] && m[a[1]].done === a[2]) return;
      m[a[1]] = { orig: a[2], done: null }; store.aorig.set(a[0], m);
      jobs.push({ el: a[0], attr: a[1], orig: a[2] });
    });

    var pending = [];
    if (tripped()) cacheOnly = true;                       // service en pause : on n'appelle rien
    jobs.forEach(function (j) {
      var key = j.orig.trim();
      if (tgt === 'fr') return;
      if (c[key] != null) { apply(j, c[key]); }
      else if (isBad(tgt, key)) { /* a échoué il y a peu : on attend avant de réessayer */ }
      else { if (!need[key]) { need[key] = 1; pending.push(key); } }
    });
    if (!pending.length || cacheOnly) { if (!cacheOnly) setBar(); return Promise.resolve(); }

    busy++; setBar();
    // textes longs : découpés en morceaux, traduits, puis recollés
    var parts = {}, units = [], useen = {}, ut = {};
    pending.forEach(function (t) {
      var ps = splitLong(t); parts[t] = ps;
      ps.forEach(function (p) { if (!useen[p.t]) { useen[p.t] = 1; units.push(p.t); } });
    });
    // lots de 35 textes / 3500 caractères max
    var batches = [], cur = [], len = 0;
    units.forEach(function (t) {
      if (cur.length >= 25 || len + t.length > 2500) { batches.push(cur); cur = []; len = 0; }
      cur.push(t); len += t.length + SEP.length;
    });
    if (cur.length) batches.push(cur);

    var bi = 0;
    function nextBatch() {
      if (bi >= batches.length) return Promise.resolve();
      var b = batches[bi++];
      return handleBatch(b).then(nextBatch);
    }
    function handleBatch(b) {
        return translateMany(b, MT[tgt]).then(function (res) {
          if (curLang() !== tgt) return;                      // l'utilisateur a changé de langue entre-temps
          b.forEach(function (u, i) { if (res[i]) ut[u] = res[i]; });
          pending.forEach(function (k) {
            if (c[k] != null) return;
            var ps = parts[k], out = [], ok = true;
            for (var q = 0; q < ps.length; q++) {
              var tr = ut[ps[q].t];
              if (tr == null) { ok = false; break; }
              out.push(ps[q].l + tr + ps[q].r);
            }
            if (ok) c[k] = out.join(''); else markBad(tgt, k);
          });
          persist(tgt);
          jobs.forEach(function (j) { var k = j.orig.trim(); if (c[k] != null && !j.applied) apply(j, c[k]); });
        }).catch(function () {});
    }
    var workers = [];
    for (var w = 0; w < 4; w++) workers.push(nextBatch());
    return Promise.all(workers).catch(function () {}).then(function () { busy--; setBar(); });

    function apply(j, tr) {
      if (j.applied || showOriginal) return; j.applied = true;
      if (j.n) { if (j.n.isConnected) setNode(j.n, j.orig, tr); }
      else if (j.el) {
        var m = store.aorig.get(j.el) || {}; m[j.attr] = { orig: j.orig, done: tr };
        store.aorig.set(j.el, m); j.el.setAttribute(j.attr, tr);
      }
    }
  }

  var seenAny = false;
  function hasOriginals() { return seenAny; }

  function restore() {
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var n; while ((n = w.nextNode())) {
      var o = store.orig.get(n);
      if (o != null && store.done.get(n) === n.nodeValue) { n.nodeValue = o; store.done.delete(n); }
    }
    document.querySelectorAll('[placeholder],[title],[aria-label],[alt]').forEach(function (el) {
      var m = store.aorig.get(el); if (!m) return;
      Object.keys(m).forEach(function (a) { if (m[a].done && el.getAttribute(a) === m[a].done) { el.setAttribute(a, m[a].orig); m[a].done = null; } });
    });
  }

  /* ---------- barre d'état ---------- */
  function setBar() {
    var l = curLang(), bar = document.getElementById('nljt-bar');
    if (l === 'fr' && !showOriginal) { if (bar) bar.style.display = 'none'; document.documentElement.classList.remove('nljt-on'); return; }
    if (!bar) {
      bar = document.createElement('div'); bar.id = 'nljt-bar';
      bar.setAttribute('role', 'status'); bar.setAttribute('translate', 'no');
      bar.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:2147483000;display:flex;gap:8px;align-items:center;' +
        'background:#0f2a4a;color:#fff;border:1px solid rgba(217,185,122,.6);border-radius:999px;padding:7px 8px 7px 14px;' +
        'font:600 12px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.28);max-width:calc(100vw - 24px)';
      bar.innerHTML = '<span id="nljt-t"></span><button type="button" id="nljt-b" style="border:0;border-radius:999px;padding:6px 12px;' +
        'background:#d9b97a;color:#1b1400;font:700 12px system-ui,sans-serif;cursor:pointer"></button>';
      var st = document.createElement('style'); st.id = 'nljt-css';
      st.textContent = '.nljt-on footer{padding-bottom:88px!important}';
      document.head.appendChild(st);
      document.body.appendChild(bar);
      bar.querySelector('#nljt-b').addEventListener('click', function () { if (failing() && !showOriginal) retryNow(); else toggleOriginal(); });
    }
    bar.style.display = 'flex';
    document.documentElement.classList.add('nljt-on');
    if (failing() && !showOriginal) {
      bar.querySelector('#nljt-t').textContent = '🌐 ⚠ ' + l.toUpperCase() + (lastErr ? ' · ' + lastErr : '');
      bar.querySelector('#nljt-b').textContent = '↻';
    } else {
      bar.querySelector('#nljt-t').textContent = busy ? '🌐 ' + ui(3) : '🌐 ' + ui(0) + (l !== 'fr' ? ' (' + l.toUpperCase() + ')' : '');
      bar.querySelector('#nljt-b').textContent = showOriginal ? ui(2) : ui(1);
    }
  }

  function toggleOriginal() {
    showOriginal = !showOriginal;
    try { sessionStorage.setItem('nljt_orig', showOriginal ? '1' : ''); } catch (e) {}
    if (showOriginal) { stopObs(); restore(); setBar(); }
    else { startObs(); go(true); }
  }

  /* ---------- déclenchement ---------- */
  function setDir(l) {
    try {
      document.documentElement.lang = l;
      document.documentElement.dir = (l === 'ar' || l === 'ur') ? 'rtl' : 'ltr';
    } catch (e) {}
  }

  function go(force) {
    var l = curLang();
    if (!force && l === applied) { return run(document.body, l); }
    var changed = l !== applied; applied = l; setDir(l);
    if (l === 'fr') { restore(); setBar(); return Promise.resolve(); }
    if (changed) restore();                                   // repart toujours du texte d'origine
    seenAny = true;
    return run(document.body, l);
  }

  /* Prévient la page parente (écran de démarrage) que la 1re traduction est prête */
  var readySent = false;
  function signalReady() {
    if (readySent) return; readySent = true;
    try { if (window.parent && window.parent !== window) window.parent.postMessage({ nlj: 'i18n-ready' }, '*'); } catch (e) {}
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(function () { if (!showOriginal) go(false); }, 220);
  }

  function startObs() {
    if (observer || !window.MutationObserver) return;
    observer = new MutationObserver(function (muts) {
      if (showOriginal || curLang() === 'fr') return;
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === 'characterData' && store.done.get(m.target) === m.target.nodeValue) continue;
        if (m.target && m.target.closest && m.target.closest('#nljt-bar')) continue;
        try { run(document.body, curLang(), true); } catch (e) {}
        return schedule();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  function stopObs() { if (observer) { observer.disconnect(); observer = null; } }

  function boot() {
    try { showOriginal = !!sessionStorage.getItem('nljt_orig'); } catch (e) {}
    if (!showOriginal) startObs();
    document.addEventListener('change', function (e) {
      if (e.target && (e.target.id === 'langSelect')) setTimeout(function () { if (!showOriginal) go(false); }, 150);
    }, true);
    window.addEventListener('storage', function (e) { if (e.key === 'niamke_lang') go(false); });
    setInterval(function () { if (curLang() !== applied && !showOriginal) go(false); }, 700);   // sélecteurs React, autres pages…
    try { go(false); } catch (e) {}                              // tout de suite : texte du cache sans attendre
    function afterBoot() {
      if (document.documentElement.classList.contains('nlj-boot')) { setTimeout(afterBoot, 80); return; }
      Promise.resolve(go(false)).then(signalReady, signalReady);
    }
    setTimeout(afterBoot, 400);
    setTimeout(signalReady, 3500);
    setTimeout(function () { go(false); }, 2500);               // contenu chargé après coup (Supabase)
  }

  window.NLJT = { diag: function () { return { lang: curLang(), erreur: lastErr, pause: tripped(), echecs: cool.step }; }, refresh: function () { go(true); }, lang: curLang, toggleOriginal: toggleOriginal };

  if (document.body) boot(); else document.addEventListener('DOMContentLoaded', boot);
})();
