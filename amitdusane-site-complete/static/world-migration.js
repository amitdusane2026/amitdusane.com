/* Migration-world shell behavior: theme (authoritative over device), mobile rail,
   the "Why" slide-over panel, and print. Ported from the single-file app. */
(function () {
  var docEl = document.documentElement, body = document.body;

  /* The theme toggle moved to siteheader.js on 2 Sep 2026. Both worlds carried
     their own identical copy of it; the header is shared now, so the behaviour
     is too. */

  var mb = document.getElementById('siteMenuBtn'), scrim = document.getElementById('scrim');
  function closeNav() { body.classList.remove('nav-open'); }
  if (mb) mb.addEventListener('click', function () { body.classList.toggle('nav-open'); });

  var panel = document.getElementById('panel'), pBody = document.getElementById('panelBody'),
      pKind = document.getElementById('panelKind'), pClose = document.getElementById('panelClose');
  function openPanel() { body.classList.add('panel-open'); if (panel) panel.setAttribute('aria-hidden', 'false'); }
  function closePanel() { body.classList.remove('panel-open'); if (panel) panel.setAttribute('aria-hidden', 'true'); }
  if (pClose) pClose.addEventListener('click', closePanel);

  var idx = null, loading = false;
  function ensureIdx(cb) {
    if (idx) { cb(); return; }
    if (loading) return; loading = true;
    fetch(window.SEARCH_INDEX || '/index.json').then(function (r) { return r.json(); })
      .then(function (d) { idx = d; loading = false; cb(); }).catch(function () { loading = false; });
  }
  function firstSentences(t, n) { var p = (t || '').split(/(?<=[.!?])\s+/); return p.slice(0, n || 3).join(' '); }
  function openKB(id) {
    ensureIdx(function () {
      /* The index keys are one character (u, t, x, g) since they repeat once
         per entry. This panel used to read .url/.title/.text/.group, and when
         the index was rebuilt per world on 1 Sep 2026 those became undefined:
         nothing ever matched, openKB returned silently, and every "Why" link
         stopped opening with no error in the console.

         The index is also per SECTION HEADING now, not per page, so one KB
         topic yields several entries. Prefer the page-level one, the entry with
         no #anchor, so the panel opens on the topic's own opening rather than
         halfway down it. */
      var e = null, first = null, i, u;
      if (idx) for (i = 0; i < idx.length; i++) {
        u = idx[i].u || '';
        if (u.indexOf('/kb/' + id + '/') === -1) continue;
        if (!first) first = idx[i];
        if (u.indexOf('#') === -1) { e = idx[i]; break; }
      }
      e = e || first;
      if (!e) return;
      if (pKind) pKind.textContent = e.g || 'Knowledge Base';
      pBody.innerHTML = '<h2>' + e.t + '</h2><p>' + firstSentences(e.x, 3) + '</p>' +
        '<div class="panel-foot"><a href="' + e.u + '">Read the full topic &rarr;</a></div>';
      openPanel();
    });
  }


  var refsDoc = null, refsLoading = false;
  function ensureRefs(cb) {
    if (refsDoc) { cb(); return; }
    if (refsLoading) return; refsLoading = true;
    fetch('/web-sdk-migration/references/').then(function (r) { return r.text(); })
      .then(function (html) { refsDoc = new DOMParser().parseFromString(html, 'text/html'); refsLoading = false; cb(); })
      .catch(function () { refsLoading = false; });
  }
  function openRef(n) {
    ensureRefs(function () {
      var li = refsDoc && refsDoc.getElementById('ref-' + n);
      if (!li) return;
      if (pKind) pKind.textContent = 'Reference';
      pBody.innerHTML = '<h2>Reference [' + n + ']</h2>' + li.innerHTML +
        '<div class="panel-foot"><a href="/web-sdk-migration/references/#ref-' + n + '">Open in the full reference list &rarr;</a></div>';
      openPanel();
    });
  }

  document.addEventListener('click', function (ev) {
    var a = ev.target.closest ? ev.target.closest('a.why[data-kb]') : null;
    if (a) { ev.preventDefault(); openKB(a.getAttribute('data-kb')); return; }
    var c = ev.target.closest ? ev.target.closest('a.cite') : null;
    if (c) { ev.preventDefault(); var n = c.getAttribute('data-ref') || (c.getAttribute('href') || '').replace(/.*#ref-/, ''); openRef(n); return; }
    if (ev.target === scrim) { closePanel(); closeNav(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closePanel(); closeNav(); } });

  /* The print document moved to printdoc.js on 2 Sep 2026, shared with every
     other world. */
})();
