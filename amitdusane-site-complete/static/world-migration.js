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

  /* THE PANEL READS THE PAGE, NOT THE SEARCH INDEX. Since 11 September 2026.

     It used to show the first three "sentences" of the search index's plain
     text for the topic. Plain text does not know what a table is, so on a KB
     article that is mostly a table (the variable mapping catalog, the plugin
     cookbook) the panel showed every cell run together as one wall of words,
     cut wherever a full stop happened to fall. Amit caught it on step 2 of the
     migration guide.

     Now the panel fetches the article and takes its opening prose, and only
     prose: the paragraphs after the title, stopping at the first table, code
     block, figure or heading, at three paragraphs, or at about 110 words. The
     rest is behind "Read the full topic". The same reader serves a Basics
     topic (.b-topic), where it takes the "Why it matters to you" opening and
     adds the "In one sentence" box. An unreadable page, or a failed fetch,
     simply follows the link. */
  var pageCache = {};
  function wordCount(el) { return (el.textContent || '').trim().split(/\s+/).filter(Boolean).length; }
  function readPage(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var bt = doc.querySelector('.b-topic');
    var root = bt ? bt.querySelector('.b-body') : doc.querySelector('.main .view.active');
    var h1 = bt ? bt.querySelector('h1') : (root && root.querySelector('h1'));
    if (!root || !h1) return null;
    var paras = [], n = 0, kids = root.children, i, el, w;
    /* A KB article's prose starts after its h1 and byline; a Basics topic's
       summary is the section under its first h2 and ends at the next one. */
    var inside = false;
    for (i = 0; i < kids.length; i++) {
      el = kids[i];
      if (!bt && el === h1) { inside = true; continue; }
      if (bt && el.tagName === 'H2') { if (inside) break; inside = true; continue; }
      if (!inside || /byline|crumb|eyebrow/.test(el.className || '')) continue;
      if (el.tagName !== 'P') { if (paras.length) break; continue; }
      w = wordCount(el);
      if (!w) continue;
      if (paras.length && n + w > 110) break;
      paras.push(el); n += w;
      if (paras.length === 3) break;
    }
    var one = bt ? bt.querySelector('.b-one p') : null, crumb = bt ? bt.querySelector('.crumb a') : null;
    return { basics: !!bt, kind: bt ? (crumb ? crumb.textContent.trim() : 'Basics') : 'Knowledge Base',
             title: h1.textContent.trim(), one: one ? one.textContent.trim() : '', paras: paras };
  }
  function showPage(d, href) {
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
    foot.className = 'panel-foot'; a.href = href;
    a.textContent = d.basics ? 'Open the full topic in ' + d.kind + ' →' : 'Read the full topic →';
    foot.appendChild(a); pBody.appendChild(foot);
    openPanel();
  }
  function openPage(href) {
    var go = function () { window.location.href = href; };
    if (Object.prototype.hasOwnProperty.call(pageCache, href)) {
      if (pageCache[href]) showPage(pageCache[href], href); else go();
      return;
    }
    fetch(href).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) {
        var d = readPage(html);
        if (d && !d.paras.length && !d.one) d = null;
        pageCache[href] = d;
        if (d) showPage(d, href); else go();
      })
      .catch(go);
  }


  /* NO CITATION PANEL. The inline [n] markers and the panel that opened a
     reference from them were removed on 11 September 2026, at Amit's request:
     they distracted and read as low confidence. Sources live on the
     References page and nowhere else. */

  document.addEventListener('click', function (ev) {
    /* Every Why link, KB or Basics, goes through the one page reader above. */
    var a = ev.target.closest ? ev.target.closest('a.why[data-kb]') : null;
    if (a) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) !== '/') return;
      ev.preventDefault(); openPage(href); return;
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
