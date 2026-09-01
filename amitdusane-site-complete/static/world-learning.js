/* Adobe Analytics Learning world shell behavior: mobile drawer, accordion nav,
   theme (shares the site-wide 'site-theme' key, same as world-migration.js),
   and print. Search wiring lands in a later phase (L6); the button is present
   but inert for now. */
(function () {
  var body = document.body, docEl = document.documentElement;

  var mb = document.getElementById('siteMenuBtn'), ov = document.getElementById('lOverlay');
  function closeNav() { body.classList.remove('lnav-open'); }
  if (mb) mb.addEventListener('click', function () { body.classList.toggle('lnav-open'); });
  if (ov) ov.addEventListener('click', closeNav);

  /* Accordion: one category open at a time, one module open at a time.
     With 5 categories, 21 modules and 116 sections, leaving panels open turns
     the sidebar into a wall, and worst of all on a phone. Opening any panel
     closes its siblings. The pocket map is the where-am-I device, not this. */
  function shut(body) {
    if (!body || !body.classList.contains('open')) return;
    body.classList.remove('open');
    var wrap = body.parentNode,
        hdr = wrap ? (wrap.querySelector('.lnav-header') || wrap.querySelector('.lnav-cathead')) : null;
    if (hdr) hdr.classList.remove('open');
    var chev = document.querySelector('[data-toggle="' + body.id + '"]');
    if (chev) chev.setAttribute('aria-expanded', 'false');
  }

  document.addEventListener('click', function (ev) {
    var h = ev.target.closest ? ev.target.closest('[data-toggle]') : null;
    if (h && (h.classList.contains('lnav-chevron') || h.classList.contains('lnav-catchev'))) {
      ev.preventDefault();
      var tgt = document.getElementById(h.getAttribute('data-toggle'));
      if (!tgt) return;
      var isCat = h.classList.contains('lnav-catchev'),
          willOpen = !tgt.classList.contains('open');

      if (willOpen) {
        var siblings = document.querySelectorAll(isCat ? '.lnav-catbody.open' : '.lnav-subs.open');
        for (var i = 0; i < siblings.length; i++) {
          if (siblings[i] !== tgt) shut(siblings[i]);
        }
        /* closing a category leaves no reason to keep a module inside it open */
        if (isCat) {
          var stale = document.querySelectorAll('.lnav-subs.open');
          for (var j = 0; j < stale.length; j++) {
            if (!tgt.contains(stale[j])) shut(stale[j]);
          }
        }
      }

      tgt.classList.toggle('open', willOpen);
      var hdr = h.closest('.lnav-header') || h.closest('.lnav-cathead');
      if (hdr) hdr.classList.toggle('open', willOpen); else h.classList.toggle('open', willOpen);
      h.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    }
  });

  /* The theme toggle moved to siteheader.js on 2 Sep 2026. Both worlds carried
     their own identical copy of it; the header is shared now, so the behaviour
     is too. */

  /* Screenshots have to survive printing, and lazy loading fights that.
     The print document is a clone built at print time inside a
     display:none container, and an image marked lazy inside a hidden
     subtree never enters a viewport, so it never loads and the page
     prints with a blank frame. Two defenses: warm the originals once the
     page is idle, so the bytes are cached whichever way the user prints,
     and force every clone eager. */
  function lWarmShots() {
    var imgs = document.querySelectorAll('.shot-frame img[loading="lazy"]');
    Array.prototype.forEach.call(imgs, function (img) { img.setAttribute('loading', 'eager'); });
  }
  if (window.requestIdleCallback) { requestIdleCallback(lWarmShots, { timeout: 3000 }); }
  else { window.addEventListener('load', function () { setTimeout(lWarmShots, 1200); }); }

  /* The print document moved to printdoc.js on 2 Sep 2026: one builder for
     the whole site, asked where the article is rather than told which world
     it is in. lWarmShots above stays, because warming the ORIGINALS is a
     learning-world concern: it is the only world with screenshots. */

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  // Copy buttons on code blocks (every .code-copy uses onclick="copyCode(this)")
  window.copyCode = function (btn) {
    var block = btn.closest ? btn.closest('.code-block') : null;
    var pre = block ? block.querySelector('.code-body pre') : null;
    var text = pre ? pre.innerText : '';
    if (!text) return;
    var flash = function () {
      var orig = btn.getAttribute('data-label') || btn.textContent;
      btn.setAttribute('data-label', orig);
      btn.textContent = 'Copied!';
      setTimeout(function () { btn.textContent = orig; }, 1500);
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
  };

  /* "See where this fits" pocket map */
  (function () {
    var fab = document.getElementById('wfFab');
    var ov = document.getElementById('wfOverlay');
    if (!fab || !ov) return;
    var closeBtn = document.getElementById('wfClose');

    /* record the true location (the groups shown at page load) */
    var homeCat = null, homeMod = null;
    var onCat = ov.querySelector('.wf-cat.on');
    var onMod = ov.querySelector('.wf-mod.on');
    if (onCat) homeCat = onCat.getAttribute('data-cat');
    if (onMod) homeMod = onMod.getAttribute('data-mod');

    var svg = ov.querySelector('.wf-arrows');
    var lineCM = svg && svg.querySelector('.wf-a-cm');
    var lineMS = svg && svg.querySelector('.wf-a-ms');
    if (svg) { svg.style.position = 'absolute'; svg.style.top = '0'; svg.style.left = '0'; svg.style.pointerEvents = 'none'; svg.style.overflow = 'visible'; svg.style.zIndex = '3'; }

    var setLine = function (line, fromEl, toEl, show) {
      if (!line) return;
      if (!show || !fromEl || !toEl) { line.style.display = 'none'; return; }
      var m = svg.getBoundingClientRect();
      if (!m.height) { line.style.display = 'none'; return; }
      var a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
      line.setAttribute('x1', a.left + a.width / 2 - m.left);
      line.setAttribute('y1', a.bottom - m.top + 2);
      line.setAttribute('x2', b.left + b.width / 2 - m.left);
      line.setAttribute('y2', b.top - m.top - 4);
      line.style.display = 'block';
    };

    var syncArrows = function () {
      var mapEl = ov.querySelector('.wf-map');
      if (svg && mapEl) { svg.setAttribute('width', mapEl.clientWidth); svg.setAttribute('height', mapEl.clientHeight); }
      /* cat->mod arrow shows only when the shown module group is the home category */
      var shownModGroup = ov.querySelector('.wf-row-mod.show');
      var catTrue = shownModGroup && shownModGroup.getAttribute('data-catgroup') === homeCat;
      /* mod->sec arrow shows only when the shown section group is the home module */
      var shownSecGroup = ov.querySelector('.wf-row-sec.show');
      var modTrue = shownSecGroup && shownSecGroup.getAttribute('data-modgroup') === homeMod;
      setLine(lineCM, ov.querySelector('.wf-cat.on'), ov.querySelector('.wf-mod.on'), !!catTrue);
      setLine(lineMS, ov.querySelector('.wf-mod.on'), ov.querySelector('.wf-sec.on'), !!(catTrue && modTrue));
    };

    var showOnly = function (sel, attr, val) {
      var g = ov.querySelectorAll(sel);
      for (var i = 0; i < g.length; i++) g[i].classList.toggle('show', g[i].getAttribute(attr) === val);
    };
    var markSel = function (sel, attr, val) {
      var b = ov.querySelectorAll(sel);
      for (var i = 0; i < b.length; i++) b[i].classList.toggle('sel', b[i].getAttribute(attr) === val);
    };

    /* snap the map back to the reader's true location */
    var reset = function () {
      var s1 = ov.querySelectorAll('.wf-cat.sel'); for (var i = 0; i < s1.length; i++) s1[i].classList.remove('sel');
      var s2 = ov.querySelectorAll('.wf-mod.sel'); for (var j = 0; j < s2.length; j++) s2[j].classList.remove('sel');
      if (homeCat) showOnly('.wf-row-mod', 'data-catgroup', homeCat);
      if (homeMod) showOnly('.wf-row-sec', 'data-modgroup', homeMod);
    };

    var open = function () {
      reset();
      if (lineCM) lineCM.style.display = 'none';
      if (lineMS) lineMS.style.display = 'none';
      ov.classList.add('wf-open');
      document.body.classList.add('wf-lock');
      var mapEl = ov.querySelector('.wf-map');
      var done = function () { syncArrows(); if (mapEl) mapEl.removeEventListener('animationend', done); };
      if (mapEl) mapEl.addEventListener('animationend', done);
      requestAnimationFrame(function () { requestAnimationFrame(syncArrows); });
      setTimeout(syncArrows, 380);
    };
    var close = function () { ov.classList.remove('wf-open'); document.body.classList.remove('wf-lock'); };

    fab.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('wf-open')) close(); });
    window.addEventListener('resize', function () { if (ov.classList.contains('wf-open')) syncArrows(); });

    ov.addEventListener('click', function (e) {
      var cat = e.target.closest ? e.target.closest('.wf-cat[data-cat]') : null;
      if (cat) {
        var c = cat.getAttribute('data-cat');
        showOnly('.wf-row-mod', 'data-catgroup', c);
        markSel('.wf-cat', 'data-cat', c);
        var firstMod = ov.querySelector('.wf-row-mod[data-catgroup="' + c + '"] .wf-mod');
        if (firstMod) {
          var mn = firstMod.getAttribute('data-mod');
          showOnly('.wf-row-sec', 'data-modgroup', mn);
          markSel('.wf-mod', 'data-mod', mn);
        }
        syncArrows();
        return;
      }
      var mod = e.target.closest ? e.target.closest('.wf-mod[data-mod]') : null;
      if (mod) {
        var m = mod.getAttribute('data-mod');
        showOnly('.wf-row-sec', 'data-modgroup', m);
        markSel('.wf-mod', 'data-mod', m);
        syncArrows();
      }
    });
  })();

  /* Home-page map: cascade glow as the reader selects (no fixed location) */
  (function () {
    var map = document.getElementById('homeMap');
    if (!map) return;
    var showOnly = function (sel, attr, val) {
      var g = map.querySelectorAll(sel);
      for (var i = 0; i < g.length; i++) g[i].classList.toggle('show', g[i].getAttribute(attr) === val);
    };
    var lightOnly = function (sel, attr, val) {
      var b = map.querySelectorAll(sel);
      for (var i = 0; i < b.length; i++) b[i].classList.toggle('on', b[i].getAttribute(attr) === val);
    };
    map.addEventListener('click', function (e) {
      var cat = e.target.closest ? e.target.closest('.hm-cat[data-cat]') : null;
      if (cat) {
        var c = cat.getAttribute('data-cat');
        lightOnly('.hm-cat', 'data-cat', c);
        showOnly('.hm-row-mod', 'data-catgroup', c);
        var firstMod = map.querySelector('.hm-row-mod[data-catgroup="' + c + '"] .hm-mod');
        if (firstMod) {
          var mn = firstMod.getAttribute('data-mod');
          lightOnly('.hm-mod', 'data-mod', mn);
          showOnly('.hm-row-sec', 'data-modgroup', mn);
        }
        return;
      }
      var mod = e.target.closest ? e.target.closest('.hm-mod[data-mod]') : null;
      if (mod) {
        var m = mod.getAttribute('data-mod');
        lightOnly('.hm-mod', 'data-mod', m);
        showOnly('.hm-row-sec', 'data-modgroup', m);
      }
    });
  })();
})();

/* Screenshot lightbox (added 14 Aug 2026).
   The image itself is inert: only the zoom button opens anything, and it
   opens in this tab rather than navigating away. The overlay shows the
   capture at natural size inside a scroller, so a wide screenshot pans
   left and right on a phone instead of being shrunk to nothing. */

/* ==========================================================================
   PROTOTYPE v2, one section only (WAY-01, the in-page spine).
   Runs on section pages only, which baseof marks with .has-rail server-side.

   Three things worth knowing about the design:
   - The first entry is "Introduction", pointing at the top of the article.
     Without it the list starts at the first h3, which is NOT the start of
     the page: every section opens with untitled prose before that heading,
     so entry 01 would silently skip it and there would be no way back up.
   - Labels are SHORTENED, not copied. A nav label is a signpost; the
     headings on this site are full editorial clauses and reproducing them
     makes a list that has to be scrolled. An author can override any label
     with data-nav="..." on the heading.
   - The pocket map trigger lives at the top of this rail rather than
     floating over the page, so the two navigation devices sit together and
     neither hides behind the other.

   Heading IDs are generated here for the prototype. For real they belong to
   WAY-02 and must be emitted server-side, or Google never sees them.
   ========================================================================== */
(function () {
  if (!document.body.classList.contains('has-rail')) return;

  var main = document.querySelector('.lmain'),
      content = document.querySelector('.lcontent'),
      article = document.querySelector('.section'),
      title = document.querySelector('.lsec-title'),
      heads = [].slice.call(document.querySelectorAll('.section > .subsec-title'));
  if (!main || !content || !article) return;

  if (title && !title.id) title.id = 'top';

  /* ---- ids: stable, readable, and never cut mid-word ---- */
  var used = {};
  heads.forEach(function (h, i) {
    if (h.id) return;
    var s = (h.textContent || '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (s.length > 60) s = s.slice(0, 60).replace(/-[^-]*$/, '');
    if (!s) s = 'section-' + (i + 1);
    if (used[s]) { s = s + '-' + (++used[s]); } else { used[s] = 1; }
    h.id = s;
  });

  /* ---- label shortening ----
     A nav label has to make sense standing alone in a list. The first
     version cut at the first ':' or ', and', which assumed the opening
     clause carries the meaning. Often it is the opposite: "Step 1: the
     developer declares it" became "Step 1", and a run of headings reading
     One / Two / Three / Four / Five told the reader nothing at all.
     Measured across the whole corpus, that produced 163 poor labels out
     of 629, or 26 percent.

     So: keep the whole heading whenever it fits, and only cut at a joint
     when what remains is long enough to stand on its own. Truncation is
     the last resort, not the second. Where even that reads badly, the
     heading carries data-nav="..." and this function steps aside.
     Residual after the change: 18 of 629, all of them authored by hand. */
  var NAV_LIMIT = 58, NAV_MIN_STANDALONE = 22,
      NAV_JOINTS = [', and ', ', but ', ', not ', ', because ', ', which ',
                    ', so ', ', where ', ', until ', ', then '];
  function shortLabel(h) {
    var override = h.getAttribute('data-nav');
    if (override) return override.trim();
    var t = (h.textContent || '').trim(), i, k;
    if (t.length <= NAV_LIMIT) return t;
    for (k = 0; k < NAV_JOINTS.length; k++) {
      i = t.indexOf(NAV_JOINTS[k]);
      if (i >= NAV_MIN_STANDALONE) return t.slice(0, i);
    }
    i = t.indexOf(': ');
    if (i >= NAV_MIN_STANDALONE) return t.slice(0, i);
    return t.slice(0, NAV_LIMIT).replace(/[\s,;:\u2014-]+\S*$/, '') + '\u2026';
  }

  var rail = document.createElement('aside');
  rail.className = 'wf-rail';
  /* The read time is NOT recomputed here. It is published by the byline on
     data-readmins, computed once at build time. Counting it again in the
     browser gave 3,001 words against Hugo's 2,929 and showed the reader 14
     minutes in the rail against 13 in the byline, which is exactly the kind
     of small contradiction that costs a page its authority. Word count is
     gone with it: the minutes are the useful signal, the raw count is
     trivia, and the byline already carries the minutes at the top. */

  /* ---- the pocket map, promoted out of the floating tab ----
     Kept green and kept loud. It is the device that carries a reader across
     116 sections, so it must not look like a sibling of the page list. */
  var pocket = document.getElementById('wfFab');
  if (pocket) {
    var mapBtn = document.createElement('button');
    mapBtn.type = 'button';
    mapBtn.className = 'wf-map-btn';
    mapBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="9"/><polygon points="15.5 8.5 13 13 8.5 15.5 11 11 15.5 8.5"/></svg>' +
      '<span><b>See where this fits</b><em>Across the whole curriculum</em></span>';
    mapBtn.addEventListener('click', function () { closeDrawer(); pocket.click(); });
    rail.appendChild(mapBtn);
  }

  /* Build the list first, then decide whether it has earned a heading. A
     section with no h3 stack (an unwritten stub, or a very short section)
     still gets the rail for the read time, the pocket map and the path-box
     jump. What it must not get is an "On this page" label above nothing. */
  var ol = document.createElement('ol');
  function addItem(href, text, full, cls) {
    var li = document.createElement('li'), a = document.createElement('a');
    if (cls) li.className = cls;
    a.href = href;
    a.textContent = text;
    if (full && full !== text) a.title = full;
    li.appendChild(a);
    ol.appendChild(li);
    return li;
  }
  if (heads.length) {
    addItem('#' + (title ? title.id : 'top'), 'Introduction', 'Start of the article', 'wf-intro');
    heads.forEach(function (h) { addItem('#' + h.id, shortLabel(h), h.textContent.trim()); });
  }

  /* The path-box last: somebody who arrived from a search only wanting to
     know where the screen lives should not have to read the section to find
     it. Deliberately the path-box and NOT the ref-box, which sends people
     to Adobe rather than answering here. The label is read from the box's
     own title, so the two can never drift apart. Skipped where a section
     has no Adobe screen, which is exactly when there is no path-box. */
  var pathBox = document.querySelector('.section > .path-box');
  if (pathBox) {
    if (!pathBox.id) pathBox.id = 'where-to-find-it';
    var pTitle = pathBox.querySelector('.path-title'),
        pBody = pathBox.querySelector('p');
    addItem('#' + pathBox.id,
            pTitle ? pTitle.textContent.trim() : 'Where to find it in Adobe Analytics',
            pBody ? pBody.textContent.trim().slice(0, 130) : '',
            'wf-path');
  }

  /* Ask Amit, the last entry, below the path-box jump. The spine is the only
     furniture on a section page that is reachable from any scroll position
     without first scrolling, which is exactly the problem a foot-of-page link
     has. Same pattern as wf-path: not a heading, so it takes no number.
     A real mailto; author.js upgrades the click to the overlay. */
  var askLi = addItem('mailto:' + (document.getElementById('askAddr')
                ? document.getElementById('askAddr').textContent.trim() : ''),
              'Ask Amit',
              'Email, mail app, or LinkedIn',
              'wf-ask');
  if (askLi) {
    var askA = askLi.querySelector('a');
    if (askA) askA.setAttribute('data-ask', '');
  }

  /* Module downloads, pinned above the heading list. Emitted hidden by
     partials/moduledocs.html on every section of a module that declares a
     file set, and lifted here rather than built in JS so the markup lives in
     one place. It goes FIRST, before "On this page", because on a module
     whose payload is a set of files the files outrank the heading list: a
     reader who has not opened them is reading about documents they cannot
     see. Nothing is emitted at all on the 20 modules with no file set. */
  var mdocs = document.getElementById('mdocs-src');
  if (mdocs && mdocs.firstElementChild) {
    rail.appendChild(mdocs.firstElementChild);
    mdocs.parentNode.removeChild(mdocs);
  }

  if (ol.children.length) {
    var hd = document.createElement('p');
    hd.className = 'wf-rail-h';
    hd.textContent = 'On this page';
    rail.appendChild(hd);
    var sub = document.createElement('p');
    sub.className = 'wf-rail-sub';
    sub.textContent = heads.length ? 'Jump within this section' : 'Where to find it';
    rail.appendChild(sub);
    rail.appendChild(ol);
  }

  main.appendChild(rail);

  /* ---- drawer, for every width below the three-column threshold ---- */
  var veil = document.createElement('div');
  veil.className = 'wf-nav-veil';
  document.body.appendChild(veil);

  var fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'wf-nav-fab';
  fab.setAttribute('aria-label', 'On this page');
  fab.setAttribute('aria-expanded', 'false');
  fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" aria-hidden="true"><path d="M4 6h10M4 12h16M4 18h7"/>' +
    '<circle cx="18" cy="6" r="2"/></svg>';
  document.body.appendChild(fab);

  function openDrawer() {
    rail.classList.add('open'); veil.classList.add('open');
    fab.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    rail.classList.remove('open'); veil.classList.remove('open');
    fab.setAttribute('aria-expanded', 'false');
  }
  fab.addEventListener('click', function () {
    rail.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  veil.addEventListener('click', closeDrawer);
  /* a jump should dismiss the drawer, or the reader lands behind it */
  ol.addEventListener('click', function (ev) { if (ev.target.closest('a')) closeDrawer(); });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' || ev.keyCode === 27) closeDrawer();
  });

  /* ---- Ask Amit ----
     The bar moved to askbar.js on 2 Sep 2026 so the migration world gets it.
     It lived here only because it shared this scrollspy's variables, which
     is not a reason for it to be learning-only. */

  /* ---- scrollspy ---- */
  var items = [].slice.call(ol.children), ticking = false;
  function sync() {
    var mark = window.innerHeight * 0.28, active = 0;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top <= mark) active = i + 1; else break;
    }
    items.forEach(function (li, i) {
      li.classList.toggle('on', i === active);
      li.classList.toggle('seen', i < active);
    });

    /* The Ask Amit toggle that sat here is in askbar.js now, with its own
       scroll listener. It never needed the spine's state, only the same
       scroll position. */
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(sync); }
  }, { passive: true });
  window.addEventListener('resize', sync);
  sync();
})();

/* ---------------------------------------------------------------------------
   TABLES ON A PHONE
   31 of the 113 tables ran wider than the 339px of column a phone gives them,
   the worst hiding 237px of itself. Two things fix that here, in this order,
   because they cost the reader different amounts.

   FIRST, break long tokens where they mean something. A dotted path is the
   usual culprit -- digitalData.account.info.loginStatus is 36 characters and
   held its column open at 291px of a 576px table. Left to the browser the
   only way to break it is mid-word, anywhere, which is what this replaced:
   the table fitted but the text read badly. A <wbr> after each separator
   gives the browser somewhere sensible to break instead, so it comes out as
   digitalData. / account. / info. / loginStatus, and the column only has to
   be as wide as the longest SEGMENT rather than the whole path.

   <wbr> rather than a zero-width space, deliberately. Both create the break,
   but a ZWSP is a real character that rides along into the clipboard, and on
   a site where people copy variable names out of tables that would hand them
   a string that looks right and is not. <wbr> copies as nothing.

   SECOND, and only if the breaks were not enough, step the type down. Type
   size is the more expensive fix, so it is the fallback rather than the
   first move, and it stops at a floor rather than shrinking to fit at any
   cost: a table nobody can read without leaning in has not been fixed. */
(function () {
  var tables = document.querySelectorAll('.tbl-wrap table');
  if (!tables.length) return;

  var BASE = 14.5,   /* --fs-sm at the mobile step */
      FLOOR = 12,    /* the smallest this will go, ever. See below. */
      STEP = 0.5;

  /* Where a break is allowed: the separators that already divide a technical
     identifier into parts. Splitting AFTER the separator keeps it on the line
     it belongs to, so a reader sees "digitalData." and knows it continues.

     The list started at dot, underscore, colon, slash and hyphen, which
     covers paths and variable names, and left five tables still over. The
     one that showed why was M02 s3: events="event3=149.99" has no separator
     from that set outside the quotes, so its column stayed 148px wide and
     nothing else could move. Query-style strings break at = & ? ; , and |
     just as sensibly as a path breaks at its dots. */
  var SEPARATORS = /([._:/=&?;,|+\-])/;
  /* Short strings are left alone. Breaking "a.link" helps nobody and litters
     the markup; the problem only starts when a token can dominate a column. */
  var MIN_TOKEN = 14;

  /* camelCase is a separator too, it just has no character to show for it.
     linkDownloadFileTypes carries none of the punctuation above, so it stayed
     one 22-character block and held its column at 175px, which was the last
     thing keeping four tables over. Breaking it at the case changes gives
     link / Download / File / Types, which is where a reader's eye divides it
     anyway.

     Only lowercase-or-digit followed by uppercase counts, so runs of capitals
     stay whole: ECID and XDM are not three words each. Done with a sentinel
     The boundaries are collected by index rather than marked with a sentinel
     or found with a lookbehind. A lookbehind is a syntax error in older
     Safari and would fail when the script is PARSED, taking the whole file
     down rather than just this feature; a sentinel means inventing a
     character that can never appear in the text, which is a promise about
     content nobody should have to keep. Indexes need neither. */
  /* Long enough to matter, and with somewhere sensible to break. Both halves
     are needed: guarding on punctuation alone was the reason camelCase went
     untouched at first, because linkDownloadFileTypes sits in its own <code>
     element whose text node holds no separator at all, so nothing downstream
     ever ran on it. */
  function breakable(word) {
    return word.length >= MIN_TOKEN &&
           (SEPARATORS.test(word) || /[a-z0-9][A-Z]/.test(word));
  }

  function emit(frag, text) {
    var parts = [], last = 0;
    text.replace(/[a-z0-9][A-Z]/g, function (m, idx) {
      /* the break falls between the two characters the pattern matched */
      parts.push(text.slice(last, idx + 1));
      last = idx + 1;
      return m;
    });
    parts.push(text.slice(last));
    parts.forEach(function (part, i) {
      if (i) frag.appendChild(document.createElement('wbr'));
      frag.appendChild(document.createTextNode(part));
    });
  }

  function addBreaks(cell) {
    var walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT, null, false),
        texts = [], n;
    while ((n = walker.nextNode())) texts.push(n);
    texts.forEach(function (node) {
      var words = node.data.split(/(\s+)/);
      var needs = words.some(breakable);
      if (!needs) return;
      var frag = document.createDocumentFragment();
      words.forEach(function (word) {
        if (!breakable(word)) {
          frag.appendChild(document.createTextNode(word));
          return;
        }
        /* split() with a capturing group keeps the separators, so they can be
           re-attached to the piece in front of them rather than orphaned onto
           the next line. */
        var pieces = word.split(SEPARATORS), buf = '';
        pieces.forEach(function (piece, i) {
          buf += piece;
          var isSep = i % 2 === 1;
          if (isSep && i < pieces.length - 1) {
            emit(frag, buf);
            frag.appendChild(document.createElement('wbr'));
            buf = '';
          }
        });
        if (buf) emit(frag, buf);
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  /* Headers get the same treatment. They are short more often than not, but
     a column headed with an identifier is exactly as wide as one holding it. */
  Array.prototype.forEach.call(tables, function (tbl) {
    Array.prototype.forEach.call(tbl.querySelectorAll('th,td'), addBreaks);
  });

  /* Padding comes before type, and the measurements are lopsided enough that
     it is not a close call. On the worst table, taking the type from 14.5px
     to 12 bought 18px; taking horizontal padding from 12px to 6 bought 48.
     The reason is that once the identifiers break, a column is as wide as its
     longest SEGMENT plus its padding, and the padding is then a large share
     of a narrow column. Type shrinks the segment slowly and costs legibility;
     padding costs a little air and nothing else. So the ladder is: breaks,
     then padding, then type, and each rung is only climbed if the table still
     does not fit. */
  var PAD_STEPS = ['', '8px 8px', '7px 6px'];

  /* The hint is a SIBLING of the scroller, never a child of it. Anything
     inside .tbl-wrap scrolls away with the table, so a hint placed there is
     gone by the time the reader needs to be told it can come back. */
  function hint(box, on) {
    var prev = box.previousElementSibling,
        has = prev && prev.classList && prev.classList.contains('tbl-hint');
    if (on && !has) {
      var p = document.createElement('p');
      p.className = 'tbl-hint';
      p.setAttribute('aria-hidden', 'true');   /* the table is already reachable */
      p.textContent = 'Scroll sideways to see the rest of this table';
      box.parentNode.insertBefore(p, box);
    } else if (!on && has) {
      prev.parentNode.removeChild(prev);
    }
  }

  /* Per table, because the trouble varies: most of the 31 were over by less
     than 60px and settle on the first rung, while a handful were over by more
     than 150px. Sizing every table to the worst case would punish 82 that
     were never a problem. */
  function fit() {
    var mobile = window.innerWidth <= 880;
    Array.prototype.forEach.call(tables, function (tbl) {
      var box = tbl.parentNode,
          cells = tbl.querySelectorAll('th,td');
      function over() { return box.scrollWidth > box.clientWidth + 1; }
      function pad(v) {
        Array.prototype.forEach.call(cells, function (c) { c.style.padding = v; });
      }
      /* Always reset first: this runs again on resize, and a table sized down
         for a phone must give its space back on the way to a wider window. */
      tbl.style.fontSize = '';
      pad('');
      hint(box, false);
      if (!mobile || !over()) return;

      for (var p = 1; p < PAD_STEPS.length; p++) {
        pad(PAD_STEPS[p]);
        if (!over()) return;
      }
      var size = BASE;
      while (over() && size > FLOOR) {
        size = Math.max(FLOOR, size - STEP);
        tbl.style.fontSize = size + 'px';
      }
      /* If it still does not fit at the floor, it scrolls. That is the
         deliberate end of the ladder rather than a failure: the floor exists
         so a table cannot be made to fit by becoming unreadable.

         What it does need is to SAY so. A table cut off at the right edge of a
         phone looks like a broken table, not a scrollable one, because the
         scrollbar only appears once you are already dragging it. So the one
         case the ladder cannot fix gets a line above it telling the reader
         what to do. */
      if (over()) hint(box, true);
    });
  }

  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);
})();
