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
        /* Was '/kb/' + id, which is why a Why link could only ever reach a
           knowledge base article. Part One topics live under a different
           segment, so match the id as a path segment wherever it sits. */
        if (u.indexOf('/' + id + '/') === -1) continue;
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


  /* THE REFERENCES PANEL, world-aware since 6 September 2026.

     This fetched /web-sdk-migration/references/ by name, and this script is
     shared by every procedure world. So on the Mobile SDK guide every citation
     opened the MIGRATION guide reference carrying the same number: a real Adobe
     link, plausibly worded, and the wrong document. Nothing errored, because
     both pages have a #ref-5.

     WORLD_ROOT is published by baseof.html from the registry, so the panel now
     reads whichever world the reader is actually in. */
  var refsDoc = null, refsLoading = false;
  var worldRoot = window.WORLD_ROOT || '/web-sdk-migration';
  function ensureRefs(cb) {
    if (refsDoc) { cb(); return; }
    if (refsLoading) return; refsLoading = true;
    fetch(worldRoot + '/references/').then(function (r) { return r.text(); })
      .then(function (html) { refsDoc = new DOMParser().parseFromString(html, 'text/html'); refsLoading = false; cb(); })
      .catch(function () { refsLoading = false; });
  }
  function openRef(n) {
    ensureRefs(function () {
      var li = refsDoc && refsDoc.getElementById('ref-' + n);
      if (!li) return;
      if (pKind) pKind.textContent = 'Reference';
      pBody.innerHTML = '<h2>Reference [' + n + ']</h2>' + li.innerHTML +
        '<div class="panel-foot"><a href="' + worldRoot + '/references/#ref-' + n + '">Open in the full reference list &rarr;</a></div>';
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

  /* COPY BUTTONS on .code blocks. Added 6 September 2026, because they had
     never worked. world-shell.css has styled .code .copy since June, including
     a .copy.done state, and nothing in any script ever set it: the button was
     decoration on the one code block this world had. The Mobile SDK guide is
     code-heavy and a reader copying Swift or Kotlin into somebody else.s app
     is the whole point, so the handler is delegated here rather than written
     per page.

     Delegated on document, not bound per button, so it survives the KB panel
     injecting markup after load. */
  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest ? ev.target.closest('.code .copy') : null;
    if (!btn) return;
    var pre = btn.parentNode ? btn.parentNode.querySelector('pre') : null;
    var text = pre ? pre.innerText : '';
    if (!text) return;
    var flash = function () {
      btn.classList.add('done');
      var orig = btn.getAttribute('data-label') || btn.textContent;
      btn.setAttribute('data-label', orig);
      btn.textContent = 'Copied';
      setTimeout(function () { btn.textContent = orig; btn.classList.remove('done'); }, 1500);
    };
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'absolute'; ta.style.left = '-9999px';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(flash, function () { fallback(); flash(); });
    } else { fallback(); flash(); }
  });

  /* THE RAIL PHASE ACCORDION. Added 9 September 2026, and it does nothing
     unless the markup is there, so the migration rail is untouched.

     One phase open at a time, matching the learning world. The phase holding
     the current step is rendered open by the template, so a reader always
     arrives with their own group expanded and the other three closed. */
  document.addEventListener('click', function (ev) {
    var h = ev.target.closest ? ev.target.closest('.rp-head') : null;
    if (!h) return;
    var tgt = document.getElementById(h.getAttribute('data-rp'));
    if (!tgt) return;
    var willOpen = !tgt.classList.contains('open');
    if (willOpen) {
      var sib = document.querySelectorAll('.rp-body.open');
      for (var i = 0; i < sib.length; i++) {
        sib[i].classList.remove('open');
        var sh = sib[i].parentNode.querySelector('.rp-head');
        if (sh) { sh.classList.remove('open'); sh.setAttribute('aria-expanded', 'false'); }
      }
    }
    tgt.classList.toggle('open', willOpen);
    h.classList.toggle('open', willOpen);
    h.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  });

  /* THE PLATFORM SWITCHER. One reader, one platform, remembered.

     A mobile implementation is written once in whichever language the app is
     built in, so a reader who has told us they are on Flutter should not be
     asked again on every later step. The choice is stored and applied to every
     switcher on every page of this world.

     Storage is wrapped because a private window, cleared site data, or a
     browser set to block storage all throw on access rather than returning
     null, and a throw here would take the accordion above down with it.

     The default is the first pane the page happens to declare rather than a
     hardcoded platform, so a step that only offers two languages still works.

     `pfs-ready` is added only once this runs, which is what leaves all four
     panes visible when JavaScript does not. */
  var KEY = 'mobile-platform';
  function readPf() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function writePf(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function applyPf(pf) {
    var boxes = document.querySelectorAll('.pfswitch');
    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i],
          panes = box.querySelectorAll('.pfs-pane'),
          tabs = box.querySelectorAll('.pfs-tab'),
          has = box.querySelector('.pfs-pane[data-pf="' + pf + '"]'),
          use = has ? pf : (panes[0] ? panes[0].getAttribute('data-pf') : null);
      if (!use) continue;
      for (var p = 0; p < panes.length; p++) {
        panes[p].classList.toggle('on', panes[p].getAttribute('data-pf') === use);
      }
      for (var t = 0; t < tabs.length; t++) {
        var on = tabs[t].getAttribute('data-pf') === use;
        tabs[t].classList.toggle('on', on);
        tabs[t].setAttribute('aria-selected', on ? 'true' : 'false');
      }
      box.classList.add('pfs-ready');
    }
  }

  if (document.querySelector('.pfswitch')) {
    var firstPane = document.querySelector('.pfs-pane');
    applyPf(readPf() || (firstPane ? firstPane.getAttribute('data-pf') : 'ios'));
    document.addEventListener('click', function (ev) {
      var tab = ev.target.closest ? ev.target.closest('.pfs-tab') : null;
      if (!tab) return;
      var pf = tab.getAttribute('data-pf');
      if (!pf) return;
      writePf(pf);
      applyPf(pf);
    });
  }

  /* A platform child of step six sets the same preference just by being read.
     Somebody who opens the React Native install page has told us what they are
     building, so the code samples on every later step should already be
     JavaScript when they get there, without another click. */
  if (document.body.getAttribute('data-pf-page')) {
    writePf(document.body.getAttribute('data-pf-page'));
  }

  /* The print document moved to printdoc.js on 2 Sep 2026, shared with every
     other world. */
})();
