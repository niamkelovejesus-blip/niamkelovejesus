/* =====================================================================
   OUTILS ADMIN (chargé par admin.html après le script principal)
   1. Suspendre / réactiver un membre      4. Message à tous les membres
   2. Journal des actions admin            5. Sauvegarde en un clic
   3. Statistiques d'inscriptions          6. Questions « Parlons avec Jésus »
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- styles et icônes ---------- */
  const st = document.createElement('style');
  st.textContent = `
    .hb{display:grid;grid-template-columns:minmax(90px,150px) 1fr 44px;gap:8px;align-items:center;margin:5px 0;font-size:13px}
    .hb i{display:block;height:12px;border-radius:6px;background:#1e3a8a;min-width:2px}
    .hb b{text-align:right}
    .per{display:flex;gap:6px;flex-wrap:wrap}
    .per button.on{background:#1e3a8a;color:#fff;border-color:#1e3a8a}
    .sub{font-size:12px;color:#667085;display:block;margin-top:2px}
    .batch{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:6px 0}
    .note{background:#fdf0d8;border:1px solid #f1d9a8;border-radius:8px;padding:10px 12px;font-size:13px;margin:10px 0}
    .okbox{background:#e3f4ea;border:1px solid #bfe3cd;border-radius:8px;padding:10px 12px;font-size:13px;margin:10px 0}`;
  document.head.appendChild(st);

  Object.assign(IC, {
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    log: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7"/>',
    db: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'
  });
  Object.assign(TABS, {
    stats: ['Statistiques', 'chart', 'Outils & suivi'],
    broadcast: ['Message aux membres', 'mail', 'Outils & suivi'],
    parlonsq: ['Questions Parlons', 'chat', 'Outils & suivi'],
    logs: ['Journal admin', 'log', 'Outils & suivi'],
    backup: ['Sauvegarde', 'db', 'Outils & suivi']
  });

  const NEED_SQL = n => `<div class="formc"><h3>Dernière étape avant de commencer</h3><p>La table « ${esc(n)} » n’existe pas encore. Dans Supabase, ouvrez <b>SQL Editor</b>, collez le contenu du fichier <b>supabase_admin_outils.sql</b> puis cliquez sur <b>Run</b>. Revenez ensuite sur cet onglet.</p></div>`;
  const isMissing = e => /(schema cache|does not exist|Could not find|relation .* does not exist)/i.test((e && e.message) || '');

  // Lecture complète (par pages de 1000, limite de sécurité 20 000 lignes)
  async function fetchAll(make, max = 20000) {
    const out = [];
    for (let from = 0; from < max; from += 1000) {
      const { data } = await q(make().range(from, from + 999));
      out.push(...(data || []));
      if (!data || data.length < 1000) break;
    }
    return out;
  }
  async function fetchProfiles() {
    try { return await fetchAll(() => sb.rpc('admin_profiles').order('created_at', { ascending: false })); }
    catch (e) { const { data } = await q(sb.rpc('admin_profiles')); return data || []; }
  }
  const isFree = r => !r.plan || /^(free|d[ée]couverte)$/i.test(String(r.plan).trim());
  const fullName = r => [r.name, r.last_name].filter(Boolean).join(' ') || r.email || 'ce membre';
  const csvCell = v => { let t = String(v ?? ''); if (/^[=+\-@\t\r]/.test(t)) t = "'" + t; return `"${t.replace(/"/g, '""')}"`; };
  function download(name, text, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/plain' }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  const today = () => new Date().toISOString().slice(0, 10);

  /* =====================================================================
     2. JOURNAL DES ACTIONS ADMIN
     ===================================================================== */
  const LBL = {
    delProfile: 'Membre supprimé', memSuspend: 'Membre suspendu', memRestore: 'Membre réactivé',
    repSuspend: 'Membre suspendu (signalement)', repRestore: 'Membre réactivé (signalement)', repClose: 'Signalement classé',
    delMsg: 'Message supprimé', delConf: 'Confession supprimée', payNo: 'Paiement refusé', payOk: 'Paiement validé · Premium activé',
    toggleVis: 'Visibilité modifiée', togglePrayer: 'Visibilité d’une prière modifiée', delPrayer: 'Prière supprimée',
    delSong: 'Musique supprimée', setCat: 'Catégorie d’un chant modifiée', editSong: 'Musique modifiée', reorg: 'Fichiers audio rangés',
    republish: 'Vidéo republiée', editVideo: 'Vidéo modifiée', delVideo: 'Vidéo supprimée', delRow: 'Élément supprimé',
    delLyric: 'Paroles supprimées', delPA: 'Prière audio supprimée', vpHide: 'Message vocal masqué / réaffiché', delVP: 'Message vocal supprimé',
    'c:plan': 'Offre d’un membre modifiée', 'c:pstatus': 'Statut d’un membre modifié', photo: 'Photo d’un membre changée',
    bcPublish: 'Annonce publiée sur le site', bcEmail: 'E-mail aux membres préparé', backupNow: 'Sauvegarde téléchargée',
    pqDel: 'Question Parlons supprimée', pqToggle: 'Question Parlons masquée / affichée',
    'form:link': 'Liens ajoutés', 'form:song': 'Musique ajoutée', 'form:lyrics': 'Paroles enregistrées', 'form:welcome': 'Message de bienvenue modifié',
    'form:video': 'Vidéo ajoutée', 'form:prayeraudio': 'Prière audio publiée', 'form:parlonsq': 'Question Parlons enregistrée'
  };
  const labelOf = a => {
    if (LBL[a]) return LBL[a];
    if (/^form:/.test(a)) { const k = a.slice(5); return (typeof G !== 'undefined' && G[k]) ? 'Ajout : ' + G[k].title : 'Formulaire : ' + k; }
    return a;
  };
  const rowText = el => {
    const tr = el && el.closest && el.closest('tr'); if (!tr) return '';
    return [...tr.cells].filter(c => !c.querySelector('select,input,button')).map(c => (c.textContent || "").replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 3).join(' · ').slice(0, 160);
  };
  window.nljCtx = (el, action) => ({ action, target: rowText(el), details: null });
  window.nljFormCtx = f => {
    const first = [...f.elements].find(x => x.name && x.type !== 'file' && x.type !== 'hidden' && x.value && x.value.trim());
    return { action: 'form:' + f.dataset.f, target: first ? first.value.trim().slice(0, 120) : '', details: null };
  };
  let logWarned = false;
  window.nljLog = ctx => {
    try {
      if (!ctx || !ctx.action) return;
      const row = { admin_id: (me && me.id) || null, admin_email: (me && me.email) || null, action: labelOf(ctx.action), target: ctx.target || null, details: ctx.details || null };
      Promise.resolve(sb.from('admin_logs').insert(row)).then(r => {
        if (r && r.error && !logWarned) { logWarned = true; toast('Journal admin inactif : exécutez supabase_admin_outils.sql dans Supabase (l’action, elle, a bien été faite).', true); }
      }, () => {});
    } catch (e) { /* le journal ne doit jamais bloquer une action */ }
  };

  V.logs = async () => {
    let data;
    try { ({ data } = await q(sb.from('admin_logs').select('*').order('created_at', { ascending: false }).limit(LIM('logs')))); }
    catch (e) { if (isMissing(e)) return $('#main').innerHTML = head('Journal admin', '') + NEED_SQL('admin_logs'); throw e; }
    cache.logs = data;
    $('#main').innerHTML = head('Journal admin', `Qui a fait quoi, et quand. Seules les actions faites depuis la mise en place du journal apparaissent. ${data.length} ligne${data.length > 1 ? 's' : ''} chargée${data.length > 1 ? 's' : ''}.`,
      `<div class="acts"><input id="s" type="search" placeholder="Rechercher (admin, action, nom…)"><button data-a="logsCsv">${ico('dl')}Exporter CSV</button></div>`) + '<div id="t"></div><div id="mo">' + moreBtn('logs', data.length) + '</div>';
    const draw = () => {
      const f = $('#s').value.toLowerCase();
      $('#t').innerHTML = tbl([
        ['Date et heure', r => esc(new Date(r.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'medium' }))],
        ['Administrateur', r => esc(r.admin_email || '—')],
        ['Action', r => `<b>${esc(r.action)}</b>`],
        ['Cible', r => esc(r.target || '')],
        ['Détails', r => esc(r.details || '')]
      ], data.filter(r => [r.admin_email, r.action, r.target, r.details].join(' ').toLowerCase().includes(f)));
    };
    $('#s').oninput = draw; draw();
  };

  /* =====================================================================
     1. SUSPENDRE UN MEMBRE (au lieu de le supprimer)
     ===================================================================== */
  async function setSuspension(id, patch) {
    try { await updRows(sb.from('profiles').update(patch).eq('id', id)); }
    catch (e) {
      // colonnes « raison / date » pas encore créées : on suspend quand même (statut seul)
      if (/suspended_(reason|at)|column|schema cache/i.test(e.message || '')) await updRows(sb.from('profiles').update({ status: patch.status }).eq('id', id));
      else throw e;
    }
  }
  const findMember = id => (cache.membersAll || cache.members || []).find(x => String(x.id) === String(id));

  V.members = async () => {
    const all = await fetchProfiles();
    cache.membersAll = all; cache.members = all;
    const nSusp = all.filter(r => r.status === 'rejected').length;
    $('#main').innerHTML = head('Membres', `${all.length} membre${all.length > 1 ? 's' : ''} inscrit${all.length > 1 ? 's' : ''}${nSusp ? ` · ${nSusp} suspendu${nSusp > 1 ? 's' : ''}` : ''} · cliquez sur une photo pour la changer`,
      `<div class="acts"><input id="s" type="search" placeholder="Rechercher un nom ou un email"><select id="sf" style="width:auto"><option value="">Tous</option><option value="approved">Actifs</option><option value="rejected">Suspendus</option><option value="pending">En attente</option></select>${csvBtn('members')}</div>`)
      + '<div id="t"></div>';
    const draw = () => {
      const f = $('#s').value.toLowerCase(), sf = $('#sf').value;
      const list = all.filter(r => (!sf || r.status === sf) && [r.name, r.last_name, r.email].filter(Boolean).join(' ').toLowerCase().includes(f));
      const shown = list.slice(0, 500);
      $('#t').innerHTML = (list.length > shown.length ? `<p class="m">${shown.length} affichés sur ${list.length} : affinez la recherche.</p>` : '') + tbl([
        ['', r => `<label class="avl" title="Changer la photo">${r.photo_url ? `<img class="av" alt="" src="${esc(r.photo_url)}">` : '<span class="av"></span>'}<input type="file" accept="image/*" data-p="${esc(r.id)}" hidden></label>`],
        ['Nom', r => esc([r.name, r.last_name].filter(Boolean).join(' '))],
        ['Email', r => esc(r.email)],
        ['Âge', r => esc(r.age)],
        ['Lieu', r => esc([r.city, r.country].filter(Boolean).join(', '))],
        ['Église', r => esc(r.church)],
        ['Offre', r => sel(['Découverte', 'Mensuel', 'Alliance', 'Éternelle'], (!r.plan || /^free$/i.test(r.plan)) ? 'Découverte' : r.plan, 'plan', r.id)],
        ['Statut', r => r.status === 'rejected'
          ? `<span class="tag rejected">Suspendu</span>${r.suspended_reason ? `<span class="sub">${esc(r.suspended_reason)}</span>` : ''}${r.suspended_at ? `<span class="sub">depuis le ${day(r.suspended_at)}</span>` : ''}`
          : sel(['approved', 'pending', 'rejected'], r.status, 'pstatus', r.id)],
        ['Inscrit le', r => day(r.created_at)],
        ['', r => (r.status === 'rejected'
          ? `<button data-a="memRestore" data-id="${esc(r.id)}">Réactiver</button>`
          : `<button data-a="memSuspend" data-id="${esc(r.id)}">Suspendre</button>`) + `<button class="d" data-a="delProfile" data-id="${esc(r.id)}">Supprimer</button>`, 1]
      ], shown);
    };
    $('#s').oninput = draw; $('#sf').onchange = draw; draw();
  };

  Object.assign(A, {
    memSuspend: id => {
      const m = findMember(id); if (!m) return toast('Membre introuvable', true);
      const why = prompt(`Suspendre ${fullName(m)} ?\n\nSon profil ne sera plus visible sur le site. Rien n’est effacé : vous pourrez le réactiver quand vous voulez.\n\nRaison (facultatif : faux profil, comportement abusif…) :`, '');
      if (why === null) return;
      const reason = why.trim();
      if (act.ctx) act.ctx.details = 'Raison : ' + (reason || 'non précisée');
      return act(() => setSuspension(id, { status: 'rejected', suspended_reason: reason || null, suspended_at: new Date().toISOString() }), 'Membre suspendu');
    },
    memRestore: id => {
      const m = findMember(id); if (!m) return toast('Membre introuvable', true);
      if (!confirm(`Réactiver ${fullName(m)} ? Son profil redeviendra visible sur le site.`)) return;
      return act(() => setSuspension(id, { status: 'approved', suspended_reason: null, suspended_at: null }), 'Membre réactivé');
    },
    logsCsv: () => {
      const rows = cache.logs || []; if (!rows.length) return toast('Rien à exporter', true);
      const ks = ['created_at', 'admin_email', 'action', 'target', 'details'];
      download('journal-admin-' + today() + '.csv', '\ufeff' + [ks.join(';'), ...rows.map(r => ks.map(k => csvCell(r[k])).join(';'))].join('\n'), 'text/csv');
    }
  });

  /* =====================================================================
     3. STATISTIQUES D'INSCRIPTIONS
     ===================================================================== */
  const noAcc = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  function tally(items, keyFn, labelFn) {
    const m = new Map();
    items.forEach(it => {
      const k = keyFn(it), e = m.get(k) || { n: 0, names: {} }; e.n++;
      const l = labelFn(it); e.names[l] = (e.names[l] || 0) + 1; m.set(k, e);
    });
    return [...m.values()].map(e => [Object.entries(e.names).sort((a, b) => b[1] - a[1])[0][0], e.n]).sort((a, b) => b[1] - a[1]);
  }
  const hbars = (list, total, max = 10) => !list.length ? '<p class="m">Pas encore de données.</p>'
    : list.slice(0, max).map(([n, c]) => `<div class="hb"><span>${esc(n)}</span><div><i style="width:${Math.max(2, Math.round(c / (list[0][1] || 1) * 100))}%"></i></div><b>${c}<span class="sub">${total ? Math.round(c / total * 100) + ' %' : ''}</span></b></div>`).join('');

  V.stats = async () => {
    const span = cache.statDays || 30;
    const all = await fetchProfiles();
    let langs = null;
    try { langs = await fetchAll(() => sb.from('member_lang').select('user_id,lang')); } catch (e) { langs = null; }
    const end = new Date(), start = new Date(end.getTime() - span * 864e5), prevStart = new Date(start.getTime() - span * 864e5);
    const inP = r => { const d = new Date(r.created_at); return d >= start && d <= end; };
    const inPrev = r => { const d = new Date(r.created_at); return d >= prevStart && d < start; };
    const cur_ = all.filter(inP), prev = all.filter(inPrev);
    const keys = [...Array(span)].map((_, i) => { const d = new Date(end.getTime() - (span - 1 - i) * 864e5); return d.toISOString().slice(0, 10); });
    const by = Object.fromEntries(keys.map(k => [k, 0]));
    all.forEach(r => { const k = (r.created_at || '').slice(0, 10); if (k in by) by[k]++; });
    const vals = keys.map(k => by[k]), mx = Math.max(...vals, 1), W = 600, bw = W / span;
    const bars = vals.map((v, i) => `<rect x="${(i * bw + 1).toFixed(1)}" y="${(150 - v / mx * 130).toFixed(1)}" width="${Math.max(1, bw - 2).toFixed(1)}" height="${(v / mx * 130).toFixed(1)}" rx="2" fill="#1e3a8a"><title>${day(keys[i])} : ${v}</title></rect>`).join('');
    const chart = `<svg viewBox="0 0 ${W} 175" style="width:100%;height:auto" role="img" aria-label="Inscriptions par jour"><line x1="0" y1="150" x2="${W}" y2="150" stroke="#e4e7ec"/>${bars}
      <text x="0" y="170" font-size="11" fill="#667085">${day(keys[0])}</text><text x="${W}" y="170" font-size="11" fill="#667085" text-anchor="end">${day(keys[span - 1])}</text>
      <text x="0" y="12" font-size="11" fill="#667085">max ${mx}/jour</text></svg>`;
    const diff = prev.length ? Math.round((cur_.length - prev.length) / prev.length * 100) : null;
    const best = keys.reduce((b, k) => by[k] > by[b] ? k : b, keys[0]);
    const k = (l, v, s) => `<div class="card"><span class="m">${l}</span><b>${v}</b>${s ? `<span class="sub">${s}</span>` : ''}</div>`;
    const t0 = today(), d7 = new Date(end.getTime() - 7 * 864e5);
    const countries = tally(cur_, r => noAcc(r.country) || '—', r => String(r.country || '').trim() || 'Non renseigné');

    // Langues : sur la période si on peut relier les membres, sinon tous ceux qui ont déjà un choix enregistré
    let langBlock, langNote = '';
    if (langs === null) langBlock = '<p class="m">La table des langues n’existe pas encore : exécutez <b>supabase_admin_outils.sql</b> dans Supabase.</p>';
    else if (!langs.length) langBlock = '<p class="m">Aucune langue enregistrée pour l’instant. Elle s’enregistre quand un membre ouvre le site connecté.</p>';
    else {
      const byUser = new Map(langs.map(l => [String(l.user_id), l.lang]));
      const canJoin = all.some(r => r.user_id);
      let pool, n;
      if (canJoin) { pool = cur_.map(r => byUser.get(String(r.user_id))).filter(Boolean); langNote = `Inscrits de la période dont la langue est connue : ${pool.length} sur ${cur_.length}.`; }
      else { pool = langs.map(l => l.lang); langNote = `Tous les membres dont la langue est connue (${pool.length}), pas seulement la période.`; }
      n = pool.length;
      langBlock = hbars(tally(pool, x => x, x => langName(x)), n, 10) + `<p class="m" style="font-size:12px;margin-top:8px">${esc(langNote)}</p>`;
    }
    $('#main').innerHTML = head('Statistiques d’inscriptions', 'Pour juger si vos publicités fonctionnent : repérez les jours où les inscriptions montent, et d’où viennent les nouveaux membres.',
      `<div class="per">${[7, 30, 90].map(n => `<button data-a="statSpan" data-id="${n}" class="${n === span ? 'on' : ''}">${n} jours</button>`).join('')}</div>`)
      + `<div class="cards">${k('Inscrits (' + span + ' j)', cur_.length, diff === null ? '' : (diff >= 0 ? '+' : '') + diff + ' % vs période précédente (' + prev.length + ')')}${k('Aujourd’hui', all.filter(r => (r.created_at || '').slice(0, 10) === t0).length)}${k('7 derniers jours', all.filter(r => new Date(r.created_at) >= d7).length)}${k('Moyenne / jour', (cur_.length / span).toFixed(1))}${k('Meilleur jour', by[best] || 0, by[best] ? day(best) : '')}${k('Total membres', all.length)}</div>`
      + `<div class="panel" style="margin-bottom:14px"><h3>Inscriptions par jour · ${span} derniers jours</h3>${chart}</div>`
      + `<div class="panels" style="grid-template-columns:1fr 1fr"><div class="panel"><h3>Par pays (${span} jours)</h3>${hbars(countries, cur_.length)}</div><div class="panel"><h3>Par langue</h3>${langBlock}</div></div>`;
  };
  A.statSpan = id => { cache.statDays = Number(id) || 30; go('stats'); };

  /* =====================================================================
     4. MESSAGE À TOUS LES MEMBRES (annonce sur le site + e-mail)
     ===================================================================== */
  function audience(rows, aud) {
    let l = rows.filter(r => r.status !== 'rejected');
    if (aud === 'premium') l = l.filter(r => !isFree(r));
    else if (aud === 'free') l = l.filter(isFree);
    else if (/^c:/.test(aud)) l = l.filter(r => noAcc(r.country) === aud.slice(2));
    return l;
  }
  V.broadcast = async () => {
    const all = await fetchProfiles();
    cache.bcRows = all;
    const cs = tally(all.filter(r => r.status !== 'rejected'), r => noAcc(r.country) || '—', r => String(r.country || '').trim() || '').filter(c => c[0]);
    const cKey = n => noAcc(n);
    $('#main').innerHTML = head('Message aux membres', 'Annoncez le chat, le Premium, un culte… sur le site et/ou par e-mail.')
      + `<form class="formc" data-f="broadcast"><h3>Écrire le message</h3><div class="fg">
          <label>À qui ?<select id="bcAud"><option value="all">Tous les membres actifs</option><option value="premium">Membres Premium</option><option value="free">Membres Découverte (gratuit)</option>${cs.slice(0, 30).map(([n]) => `<option value="c:${esc(cKey(n))}">Pays : ${esc(n)}</option>`).join('')}</select><span class="sub" id="bcCount"></span></label>
          <label>Importance (annonce du site)<select name="importance"><option>Normale</option><option>Importante</option><option>Urgente</option></select></label>
          <label class="w">Titre / objet de l’e-mail<input name="titre" maxlength="140"></label>
          <label class="w">Message<textarea name="message" rows="7"></textarea></label></div>
        <div class="acts"><button class="p" type="button" data-a="bcPublish">${ico('bell')}Publier comme annonce sur le site</button><button type="button" data-a="bcEmail">${ico('mail')}Préparer l’e-mail</button></div>
        <p class="m" style="font-size:12px;margin-top:10px">L’annonce du site est visible par tous les membres, quel que soit le choix « À qui ? ». Ce choix ne sert que pour l’e-mail. Les membres suspendus ne sont jamais inclus.</p>
        <div id="bcOut"></div></form>`;
    const upd = () => { const n = audience(all, $('#bcAud').value).filter(r => r.email).length; $('#bcCount').textContent = n + ' destinataire' + (n > 1 ? 's' : '') + ' avec e-mail'; };
    $('#bcAud').onchange = upd; upd();
  };
  FORMS.broadcast = async () => { throw new Error('Utilisez les boutons « Publier comme annonce » ou « Préparer l’e-mail ».'); };
  const bcForm = () => $('form[data-f="broadcast"]');
  const bcVals = () => { const E = bcForm().elements; return { titre: E.titre.value.trim(), message: E.message.value.trim(), importance: E.importance.value, aud: $('#bcAud').value }; };
  const copy = async (t, ok) => { try { await navigator.clipboard.writeText(t); toast(ok || 'Copié'); } catch (e) { prompt('Copiez avec Ctrl+C :', t); } };
  Object.assign(A, {
    bcPublish: () => {
      const v = bcVals(); if (!v.titre || !v.message) return toast('Écrivez un titre et un message.', true);
      if (!confirm('Publier cette annonce sur le site ? Tous les membres pourront la voir.')) return;
      if (act.ctx) act.ctx.target = v.titre;
      return act(async () => {
        try { await q(sb.from('annonces').insert({ titre: v.titre, message: v.message, importance: v.importance, visible: true })); }
        catch (e) { if (isMissing(e)) throw new Error('La table « annonces » n’existe pas : exécutez supabase_eglise.sql dans Supabase.'); throw e; }
      }, 'Annonce publiée sur le site');
    },
    bcEmail: () => {
      const v = bcVals(); if (!v.titre || !v.message) return toast('Écrivez un titre et un message.', true);
      const list = audience(cache.bcRows || [], v.aud).filter(r => r.email), emails = [...new Set(list.map(r => String(r.email).trim()).filter(Boolean))];
      if (!emails.length) return toast('Aucun destinataire avec e-mail pour ce choix.', true);
      const SIZE = 40, batches = []; for (let i = 0; i < emails.length; i += SIZE) batches.push(emails.slice(i, i + SIZE));
      cache.bcBatches = batches; cache.bcMsg = v;
      nljLog({ action: 'bcEmail', target: v.titre, details: emails.length + ' destinataires (' + $('#bcAud').selectedOptions[0].textContent + ')' });
      $('#bcOut').innerHTML = `<div class="okbox"><b>${emails.length} destinataire${emails.length > 1 ? 's' : ''}</b>, en ${batches.length} lot${batches.length > 1 ? 's' : ''} de ${SIZE} maximum. Les adresses vont en copie cachée (CCI) : les membres ne voient pas les adresses des autres.</div>
        <div class="batch"><button data-a="bcCopyMsg">Copier le message</button></div>`
        + batches.map((b, i) => `<div class="batch"><b>Lot ${i + 1}</b> (${b.length})<button data-a="bcOpen" data-id="${i}">Ouvrir dans ma messagerie</button><button data-a="bcCopyBatch" data-id="${i}">Copier les adresses</button></div>`).join('')
        + `<div class="note">Ce système utilise votre propre messagerie : parfait pour quelques dizaines ou centaines de membres, mais les messageries limitent les envois par jour (environ 500 pour Gmail) et peuvent classer les messages en spam. Pour toute la communauté un jour, il faudra un vrai service d’envoi (Resend, Brevo…).</div>`;
    },
    bcCopyMsg: () => copy(cache.bcMsg.titre + '\n\n' + cache.bcMsg.message, 'Message copié'),
    bcCopyBatch: id => copy((cache.bcBatches[id] || []).join(', '), 'Adresses copiées'),
    bcOpen: id => {
      const m = cache.bcMsg, b = cache.bcBatches[id] || [];
      let url = 'mailto:?bcc=' + encodeURIComponent(b.join(',')) + '&subject=' + encodeURIComponent(m.titre);
      const withBody = url + '&body=' + encodeURIComponent(m.message);
      if (withBody.length <= 1900) url = withBody; else toast('Message trop long pour s’ouvrir tout seul : cliquez « Copier le message » puis collez-le dans l’e-mail.', true);
      location.href = url;
    }
  });

  /* =====================================================================
     5. SAUVEGARDE EN UN CLIC
     ===================================================================== */
  const BACKUP = [
    ['membres', 'rpc:admin_profiles'], ['prieres_et_versets', 'prayers'], ['chants', 'musiques'], ['paroles', 'paroles'],
    ['prieres_audio', 'admin_prayers'], ['mur_vocal', 'voice_posts'], ['annonces', 'annonces'], ['evenements', 'evenements'], ['pasteurs', 'pasteurs'],
    ['videos_souvenirs', 'videos_souvenirs'], ['confessions', 'confessions'], ['jeux', 'jeux'], ['questions_parlons', 'parlons_faq'],
    ['paiements', 'payments'], ['abonnements', 'subscriptions'], ['signalements', 'reports'], ['reglages', 'site_settings'], ['langues_membres', 'member_lang'], ['journal_admin', 'admin_logs']
  ];
  V.backup = async () => {
    $('#main').innerHTML = head('Sauvegarde', 'Téléchargez une copie de vos données en un clic.')
      + `<div class="formc"><h3>Sauvegarde complète</h3>
        <p>Un seul fichier (<b>.json</b>) avec : membres, prières et versets, chants et paroles, annonces, événements, pasteurs, vidéos, paiements, questions Parlons, journal admin…</p>
        <p class="m" style="margin:8px 0 14px">Non inclus : les messages privés entre membres (vie privée) et les fichiers eux-mêmes (photos, audios, vidéos) : seuls leurs liens sont sauvegardés. Le fichier contient des e-mails : gardez-le en lieu sûr.</p>
        <div class="acts"><button class="p" data-a="backupNow" id="bkBtn">${ico('dl')}Télécharger la sauvegarde</button><button data-a="backupMembers">${ico('dl')}Membres seulement (CSV)</button></div>
        <div id="bkOut" style="margin-top:14px"></div></div>`;
  };
  A.backupNow = async (id, b) => {
    if (A.backupNow.busy) return; A.backupNow.busy = true; const t0 = b.innerHTML; b.disabled = true;
    const out = $('#bkOut'), tables = {}, errors = {}, lines = [];
    try {
      for (let i = 0; i < BACKUP.length; i++) {
        const [name, src] = BACKUP[i]; b.textContent = `Sauvegarde… ${i + 1}/${BACKUP.length} (${name})`;
        try {
          const rows = src === 'rpc:admin_profiles' ? await fetchProfiles() : await fetchAll(() => sb.from(src).select('*'));
          tables[name] = rows; lines.push(`<tr><td>${esc(name)}</td><td>${rows.length}</td></tr>`);
        } catch (e) { errors[name] = e.message || String(e); lines.push(`<tr><td>${esc(name)}</td><td class="m">ignorée (${esc(isMissing(e) ? 'table absente' : e.message)})</td></tr>`); }
      }
      const n = Object.values(tables).reduce((s, r) => s + r.length, 0);
      const pack = { application: 'Niamké Love Jésus', date: new Date().toISOString(), par: (me && me.email) || null, tables, tables_ignorees: errors };
      download('sauvegarde-niamke-' + today() + '.json', JSON.stringify(pack, null, 1), 'application/json');
      nljLog({ action: 'backupNow', details: n + ' lignes, ' + Object.keys(tables).length + ' tables' });
      out.innerHTML = `<div class="okbox">Sauvegarde téléchargée : <b>${n}</b> lignes dans ${Object.keys(tables).length} tables.</div><div class="wrap"><table><thead><tr><th>Table</th><th>Lignes</th></tr></thead><tbody>${lines.join('')}</tbody></table></div>`;
    } catch (e) { toast('Sauvegarde interrompue : ' + (e.message || e), true); }
    finally { A.backupNow.busy = false; b.disabled = false; b.innerHTML = t0; }
  };
  A.backupMembers = async () => {
    try {
      const rows = await fetchProfiles(); if (!rows.length) return toast('Rien à exporter', true);
      const ks = [...new Set(rows.flatMap(r => Object.keys(r)))];
      download('membres-' + today() + '.csv', '\ufeff' + [ks.join(';'), ...rows.map(r => ks.map(k => csvCell(r[k])).join(';'))].join('\n'), 'text/csv');
      nljLog({ action: 'backupNow', details: 'Export CSV des membres (' + rows.length + ')' });
    } catch (e) { toast(e.message || 'Export impossible', true); }
  };

  /* =====================================================================
     6. QUESTIONS « PARLONS AVEC JÉSUS » (table parlons_faq)
     ===================================================================== */
  V.parlonsq = async () => {
    let data;
    try { ({ data } = await q(sb.from('parlons_faq').select('*').order('sort', { ascending: true }).order('created_at', { ascending: true }).limit(500))); }
    catch (e) { if (isMissing(e)) return $('#main').innerHTML = head('Questions Parlons', '') + NEED_SQL('parlons_faq'); throw e; }
    cache.pq = Object.fromEntries(data.map(r => [r.id, r]));
    $('#main').innerHTML = head('Questions « Parlons avec Jésus »', `${data.length} question${data.length > 1 ? 's' : ''}. Les changements sont visibles sur le site dès l’enregistrement. Le menu affiche les 8 premières (selon l’ordre).`)
      + `<form class="formc" data-f="parlonsq"><h3 id="pqTitle">Ajouter une question</h3><input type="hidden" name="id"><div class="fg">
          <label>Sujet (bouton affiché au membre)<input name="topic" maxlength="80" placeholder="Ex. Le jeûne"></label>
          <label>Ordre (petit = en premier)<input name="sort" type="number" value="500"></label>
          <label class="w">Mots-clés (séparés par des virgules)<input name="keywords" placeholder="jeune, jeuner, privation, carême"><span class="sub">Les mots que les membres pourraient écrire, sans majuscule ni accent obligatoire. Mettez des mots d’au moins 4 lettres.</span></label>
          <label class="w">Réponse (une ligne vide = nouveau paragraphe)<textarea name="answer" rows="6"></textarea></label>
          <label>Verset (texte, facultatif)<textarea name="verse_text" rows="3"></textarea></label>
          <label>Référence du verset<input name="verse_ref" placeholder="Matthieu 6:16-18"></label>
          <label>Proposer « Donner ma vie à Jésus » après la réponse ?<select name="show_salut"><option value="0">Non</option><option value="1">Oui</option></select></label></div>
        <div class="acts"><button class="p" type="submit">${ico('plus')}<span id="pqBtn">Enregistrer la question</span></button><button type="button" data-a="pqCancel" id="pqCancel" hidden>Annuler la modification</button></div><div class="err" data-e role="alert"></div></form>`
      + tbl([
        ['Ordre', r => esc(r.sort)],
        ['Sujet', r => `<b>${esc(r.topic)}</b>`],
        ['Mots-clés', r => esc(String(r.keywords || '').slice(0, 70))],
        ['Réponse', r => esc(String(r.answer || '').slice(0, 90))],
        ['Verset', r => esc(r.verse_ref || '')],
        ['Visible', r => r.visible === false ? tag('rejected') : tag('approved')],
        ['', r => `<button data-a="pqEdit" data-id="${esc(r.id)}">Modifier</button><button data-a="pqToggle" data-id="${esc(r.id)}">${r.visible === false ? 'Afficher' : 'Masquer'}</button><button class="d" data-a="pqDel" data-id="${esc(r.id)}">Supprimer</button>`, 1]
      ], data);
  };
  FORMS.parlonsq = async f => {
    const E = f.elements, topic = E.topic.value.trim(), answer = E.answer.value.trim();
    if (!topic) throw new Error('Écrivez le sujet de la question.');
    if (!answer) throw new Error('Écrivez la réponse.');
    const row = {
      topic, answer, keywords: E.keywords.value.split(/[,;\n]/).map(x => x.trim()).filter(Boolean).join(', '),
      verse_text: E.verse_text.value.trim() || null, verse_ref: E.verse_ref.value.trim() || null,
      show_salut: E.show_salut.value === '1', sort: parseInt(E.sort.value, 10) || 500
    };
    if (E.id.value) await updRows(sb.from('parlons_faq').update(row).eq('id', E.id.value));
    else await q(sb.from('parlons_faq').insert({ ...row, visible: true }));
  };
  Object.assign(A, {
    pqEdit: id => {
      const r = cache.pq[id], f = $('form[data-f="parlonsq"]'); if (!r || !f) return;
      const E = f.elements; E.id.value = r.id; E.topic.value = r.topic || ''; E.sort.value = r.sort ?? 500; E.keywords.value = r.keywords || '';
      E.answer.value = r.answer || ''; E.verse_text.value = r.verse_text || ''; E.verse_ref.value = r.verse_ref || ''; E.show_salut.value = r.show_salut ? '1' : '0';
      $('#pqTitle').textContent = 'Modifier : ' + r.topic; $('#pqBtn').textContent = 'Enregistrer les modifications'; $('#pqCancel').hidden = false;
      f.scrollIntoView({ behavior: 'smooth' }); E.topic.focus();
    },
    pqCancel: () => go('parlonsq'),
    pqToggle: id => { const r = cache.pq[id]; return r && act(() => updRows(sb.from('parlons_faq').update({ visible: r.visible === false }).eq('id', id)), r.visible === false ? 'Question affichée' : 'Question masquée'); },
    pqDel: id => confirm('Supprimer cette question ? Elle disparaîtra du site.') && act(() => delRows(sb.from('parlons_faq').delete().eq('id', id)), 'Question supprimée')
  });
})();

/* Démarrage de l'admin une fois les outils en place (le script principal ne démarre pas tout seul). */
window.nljStarted = true;
startAdmin();
