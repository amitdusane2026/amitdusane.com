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
  function openPanel() { body.classList.add('panel-open'); if (panel) panel.setAttribute('aria-hidden', 'false'); if (pBody) pBody.scrollTop = 0; }
  function closePanel() { body.classList.remove('panel-open'); if (panel) panel.setAttribute('aria-hidden', 'true'); }
  if (pClose) pClose.addEventListener('click', closePanel);

  var idx = null, loading = false;
  function ensureIdx(cb) {
    if (idx) { cb(); return; }
    if (loading) return; loading = true;
    fetch(window.SEARCH_INDEX || '/index.json').then(function (r) { return r.json(); })
      .then(function (d) { idx = d; loading = false; cb(); })
      /* A failed fetch used to stop here and the Why link did nothing. Now the
         lookup runs against an empty index, finds nothing, and openKB falls
         back to following the link. */
      .catch(function () { idx = []; loading = false; cb(); });
  }
  function firstSentences(t, n) { var p = (t || '').split(/(?<=[.!?])\s+/); return p.slice(0, n || 3).join(' '); }
  function openKB(id, href) {
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
        /* Match the id as a path segment wherever it sits, not only under
           /kb/, so any page in this world's index can be opened. */
        if (u.indexOf('/' + id + '/') === -1) continue;
        if (!first) first = idx[i];
        if (u.indexOf('#') === -1) { e = idx[i]; break; }
      }
      e = e || first;
      /* NOTHING FOUND MEANS FOLLOW THE LINK. This returned silently, so a Why
         link whose page was not in the index did nothing at all when clicked:
         no panel, no navigation, no error. */
      if (!e) { if (href) window.location.href = href; return; }
      if (pKind) pKind.textContent = e.g || 'Knowledge Base';
      pBody.innerHTML = '<h2>' + e.t + '</h2><p>' + firstSentences(e.x, 3) + '</p>' +
        '<div class="panel-foot"><a href="' + e.u + '">Read the full topic &rarr;</a></div>';
      openPanel();
    });
  }


  /* NO CITATION PANEL. The inline [n] markers and the panel that opened a
     reference from them were removed on 11 September 2026, at Amit's request:
     they distracted and read as low confidence. Sources live on the
     References page and nowhere else. WORLD_ROOT is published by baseof.html
     from the registry. */
  var worldRoot = window.WORLD_ROOT || '/web-sdk-migration';

  /* THE BASICS PANEL. Since 11 September 2026, Amit's call.

     A Why link into a Basics section (Mobile App Basics today, Website Basics
     next) used to leave the guide for the other section. It now opens in the
     same panel as a KB article, so the reader keeps their place in the step:
     the topic's title, its "In one sentence", and the opening of its "Why it
     matters to you", then a link to the full topic.

     It reads the topic page itself rather than a search index, because a
     Basics topic has no h3 stack for the index to cut, and the page already
     carries the summary in known places: .b-one for the sentence, the first h2
     of .b-body for the opening. A page without .b-topic, or a failed fetch,
     simply navigates. */
  var basicsCache = {};
  function readBasics(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var t = doc.querySelector('.b-topic');
    if (!t) return null;
    var h1 = t.querySelector('h1'), one = t.querySelector('.b-one p'), crumb = t.querySelector('.crumb a'),
        bb = t.querySelector('.b-body'), kids = bb ? bb.children : [], paras = [], started = false;
    for (var i = 0; i < kids.length && paras.length < 2; i++) {
      if (kids[i].tagName === 'H2') { if (started) break; started = true; continue; }
      if (kids[i].tagName === 'P') paras.push(kids[i]);
    }
    return { kind: crumb ? crumb.textContent.trim() : 'Basics', title: h1 ? h1.textContent.trim() : '',
             one: one ? one.textContent.trim() : '', paras: paras };
  }
  function showBasics(d, href) {
    if (pKind) pKind.textContent = d.kind;
    pBody.innerHTML = '';
    var h = document.createElement('h2'); h.textContent = d.title; pBody.appendChild(h);
    if (d.one) {
      var box = document.createElement('div'), l = document.createElement('span'), p = document.createElement('p');
      box.className = 'pb-one'; l.className = 'pb-one-l'; l.textContent = 'In one sentence'; p.textContent = d.one;
      box.appendChild(l); box.appendChild(p); pBody.appendChild(box);
    }
    for (var i = 0; i < d.paras.length; i++) pBody.appendChild(document.importNode(d.paras[i], true));
    var foot = document.createElement('div'), a = document.createElement('a');
    foot.className = 'panel-foot'; a.href = href; a.textContent = 'Open the full topic in ' + d.kind + ' →';
    foot.appendChild(a); pBody.appendChild(foot);
    openPanel();
  }
  function openBasics(href) {
    var go = function () { window.location.href = href; };
    if (Object.prototype.hasOwnProperty.call(basicsCache, href)) {
      if (basicsCache[href]) showBasics(basicsCache[href], href); else go();
      return;
    }
    fetch(href).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) { var d = readBasics(html); basicsCache[href] = d; if (d) showBasics(d, href); else go(); })
      .catch(go);
  }

  document.addEventListener('click', function (ev) {
    var a = ev.target.closest ? ev.target.closest('a.why[data-kb]') : null;
    if (a) {
      var href = a.getAttribute('href') || '';
      ev.preventDefault();
      /* Outside this world's root means a Basics topic: the Basics panel. */
      if (href.charAt(0) === '/' && href.indexOf(worldRoot + '/') !== 0) { openBasics(href); return; }
      openKB(a.getAttribute('data-kb'), href); return;
    }
    /* A TAP ANYWHERE OUTSIDE AN OPEN PANEL CLOSES IT, the header included, on
       every screen size. Since 11 September 2026: on a phone the panel covered
       the whole screen and its close button was hidden, so there was no way
       back to the step. The tap still does whatever it would have done. */
    if (body.classList.contains('panel-open') && panel && !panel.contains(ev.target)) closePanel();
    if (ev.target === scrim) closeNav();
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

  /* THE PLATFORM SWITCHER. One reader, one platform, remembered.

     A mobile implementation is written once in whichever language the app is
     built in, so a reader who has told us they are on Flutter should not be
     asked again on every later step. The choice is stored and applied to every
     switcher on every page of this world.

     Storage is wrapped because a private window, cleared site data, or a
     browser set to block storage all throw on access rather than returning
     null, and a throw here would take the handlers above down with it.

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
