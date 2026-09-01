/* Site search. Filters a build-time index entirely in the browser: no external
   service, no tracker, no network call to anyone but this origin.
   Open with the topbar button or "/" or Cmd/Ctrl-K; Esc closes; Up/Down select;
   Enter opens.

   Two indexes, and they do different jobs.

   window.SEARCH_INDEX is the current world's index and carries the full prose,
   one entry per section heading. It is what the query actually matches.
   window.SEARCH_HINTS is a small titles-and-descriptions file covering every
   world, used only to tell a reader that a term is also covered somewhere else
   on the site. It carries no body text, which is what keeps it small as worlds
   are added.

   The world index is PREFETCHED shortly after load rather than on first open.
   The Adobe Analytics index is around half a megabyte gzipped, and Amit's call
   was that search must return real full-text results rather than fast weak
   ones. Fetching it in the background while somebody reads means it is usually
   ready by the time they press "/", and on a slow connection search waits
   instead of degrading. It is cached after the first visit. */
(function () {
  var overlay = document.getElementById('searchOverlay');
  var input = document.getElementById('searchInput');
  var results = document.getElementById('searchResults');
  var btn = document.getElementById('siteSearchBtn');
  if (!overlay || !input || !results) return;

  var index = null, loading = false, failed = false, sel = -1, current = [];
  var hints = null, hintsTried = false;

  function load() {
    if (index || loading) return;
    loading = true;
    fetch(window.SEARCH_INDEX)
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        index = d; loading = false;
        if (overlay.hidden === false) run(input.value);
      })
      .catch(function () {
        loading = false; failed = true;
        if (overlay.hidden === false) results.innerHTML = '<div class="search-hint">Search could not load. Check your connection and try again.</div>';
      });
  }

  /* Loaded separately and never blocking: if the hint file fails, local results
     are still complete and the reader loses nothing. */
  function loadHints() {
    if (hints || hintsTried || !window.SEARCH_HINTS) return;
    hintsTried = true;
    fetch(window.SEARCH_HINTS)
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) { hints = d; if (overlay.hidden === false) run(input.value); })
      .catch(function () {});
  }

  function prefetch() {
    var go = function () { load(); loadHints(); };
    if ('requestIdleCallback' in window) { requestIdleCallback(go, { timeout: 4000 }); }
    else { setTimeout(go, 1500); }
  }
  if (document.readyState === 'complete') prefetch();
  else window.addEventListener('load', prefetch);

  function open() {
    overlay.hidden = false; load(); loadHints();
    setTimeout(function () { input.focus(); input.select(); }, 0);
  }
  function close() { overlay.hidden = true; sel = -1; }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function snippet(text, tokens) {
    var lc = text.toLowerCase(), at = -1;
    for (var i = 0; i < tokens.length; i++) { var p = lc.indexOf(tokens[i]); if (p !== -1 && (at === -1 || p < at)) at = p; }
    if (at === -1) at = 0;
    var start = Math.max(0, at - 50), end = Math.min(text.length, at + 130);
    var s = (start > 0 ? '… ' : '') + text.slice(start, end) + (end < text.length ? ' …' : '');
    s = esc(s);
    tokens.forEach(function (t) { if (t) s = s.replace(new RegExp('(' + escRe(t) + ')', 'ig'), '<mark>$1</mark>'); });
    return s;
  }

  /* Cross-world hint. Titles and descriptions only, and only for worlds other
     than this one, so it can never repeat what the local results already show. */
  function hintHtml(tokens) {
    if (!hints || !window.SEARCH_WORLD) return '';
    var here = '/' + window.SEARCH_WORLD + '/';
    var hit = [];
    hints.forEach(function (e) {
      if (e.u.indexOf(here) === 0) return;
      var hay = ((e.t || '') + ' ' + (e.d || '')).toLowerCase();
      for (var i = 0; i < tokens.length; i++) { if (hay.indexOf(tokens[i]) === -1) return; }
      hit.push(e);
    });
    if (!hit.length) return '';
    return '<div class="shint"><span class="shint-lead">Also covered in ' + esc(hit[0].w) + '</span>' +
      hit.slice(0, 3).map(function (e) {
        return '<a class="shint-a" href="' + e.u + '">' + esc(e.t) + '</a>';
      }).join('') + '</div>';
  }

  function run(q) {
    q = (q || '').trim().toLowerCase();
    sel = -1;
    if (!q) { results.innerHTML = '<div class="search-hint">Type to search.</div>'; current = []; return; }
    if (failed) { results.innerHTML = '<div class="search-hint">Search could not load. Check your connection and try again.</div>'; return; }
    if (!index) { results.innerHTML = '<div class="search-hint">Loading the index…</div>'; return; }

    var tokens = q.split(/\s+/).filter(Boolean);
    var phrase = tokens.length > 1 ? q : null;
    var scored = [];
    index.forEach(function (e) {
      var title = (e.t || '').toLowerCase(), text = (e.x || '').toLowerCase(),
          ptitle = (e.p || '').toLowerCase(), score = 0, all = true;
      tokens.forEach(function (t) {
        var inTitle = title.indexOf(t) !== -1, inText = text.indexOf(t) !== -1;
        if (!inTitle && !inText) all = false;
        if (inTitle) score += 10;
        if (inText) score += 1;
        /* The PAGE the entry belongs to matters as much as the heading. Without
           this, searching "evar" put a passing mention inside a CJA section
           above the eVars section itself, because both merely had the word in
           their heading. A section whose page is about the term is what the
           reader wanted. */
        if (ptitle.indexOf(t) !== -1) score += 6;
      });
      if (!all) return;
      /* An exact phrase beats the same words scattered across a long section. */
      if (phrase) {
        if (title.indexOf(phrase) !== -1) score += 25;
        else if (text.indexOf(phrase) !== -1) score += 8;
      }
      scored.push({ e: e, score: score });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    current = scored.slice(0, 12).map(function (x) { return x.e; });

    var hint = hintHtml(tokens);
    if (!current.length) {
      results.innerHTML = '<div class="search-hint">No matches for &ldquo;' + esc(q) + '&rdquo;.</div>' + hint;
      return;
    }
    results.innerHTML = current.map(function (e, i) {
      var badge = (e.b || '').toLowerCase();
      /* On an anchored entry the heading is the result and the page title is the
         context, so the reader knows which section they are being sent into. */
      var ctx = (e.p && e.p !== e.t) ? e.p : '';
      var meta = [e.g, ctx].filter(Boolean).join(' · ');
      return '<a class="sresult" href="' + e.u + '" data-i="' + i + '">' +
        '<span class="sbadge ' + badge + '">' + esc(e.b || '') + '</span>' +
        '<span class="sbody"><span class="stitle">' + esc(e.t) + '</span>' +
        (meta ? '<span class="smeta">' + esc(meta) + '</span>' : '') +
        '<span class="ssnip">' + snippet(e.x || '', tokens) + '</span></span></a>';
    }).join('') + hint;
  }

  function move(d) {
    var items = results.querySelectorAll('.sresult');
    if (!items.length) return;
    sel = (sel + d + items.length) % items.length;
    items.forEach(function (el, i) { el.classList.toggle('sel', i === sel); });
    items[sel].scrollIntoView({ block: 'nearest' });
  }
  function go() {
    var items = results.querySelectorAll('.sresult');
    if (!items.length) return;
    var el = sel >= 0 ? items[sel] : items[0];
    if (el) window.location.href = el.getAttribute('href');
  }

  if (btn) btn.addEventListener('click', open);
  input.addEventListener('input', function () { run(input.value); });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function (e) {
    if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K'))) &&
        overlay.hidden && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
      e.preventDefault(); open(); return;
    }
    if (overlay.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); go(); }
  });
})();
