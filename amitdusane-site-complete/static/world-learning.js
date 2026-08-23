/* Adobe Analytics Learning world shell behavior: mobile drawer, accordion nav,
   theme (shares the site-wide 'site-theme' key, same as world-migration.js),
   and print. Search wiring lands in a later phase (L6); the button is present
   but inert for now. */
(function () {
  var body = document.body, docEl = document.documentElement;

  var mb = document.getElementById('lMenuBtn'), ov = document.getElementById('lOverlay');
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

  var tb = document.getElementById('lThemeBtn');
  if (tb) tb.addEventListener('click', function () {
    var t = docEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    docEl.setAttribute('data-theme', t); docEl.style.colorScheme = t;
    try { localStorage.setItem('site-theme', t); } catch (e) {}
  });

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

  function lFillPrintDoc() {
    var src = document.querySelector('.lcontent'),
        body = document.getElementById('printBody'),
        ctx = document.getElementById('printCtx'),
        h1 = document.querySelector('.lcontent .lsec-title');
    if (body && src) {
      body.innerHTML = src.innerHTML;
      var imgs = body.querySelectorAll('img');
      Array.prototype.forEach.call(imgs, function (img) { img.setAttribute('loading', 'eager'); });
    }
    if (ctx) ctx.textContent = h1 ? h1.textContent : '';
  }
  var pb = document.getElementById('lPrintBtn');
  if (pb) pb.addEventListener('click', function () {
    lFillPrintDoc();
    /* Wait for the cloned images before handing over to the print dialog,
       or the snapshot is taken while they are still decoding. */
    var imgs = [].slice.call(document.querySelectorAll('#printBody img'));
    var pending = imgs.filter(function (i) { return !i.complete; });
    if (!pending.length) { window.print(); return; }
    var done = 0, fired = false;
    function go() { if (!fired) { fired = true; window.print(); } }
    pending.forEach(function (i) {
      function tick() { if (++done === pending.length) go(); }
      i.addEventListener('load', tick, { once: true });
      i.addEventListener('error', tick, { once: true });
    });
    setTimeout(go, 2500);
  });
  // Native browser print (Ctrl/Cmd+P or the browser menu) must populate the
  // same print container the button uses. Without this it prints an empty,
  // header-only page because the fill step never runs.
  window.addEventListener('beforeprint', lFillPrintDoc);

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
(function () {
  var frames = document.querySelectorAll('.shot-box .shot-frame');
  if (!frames.length) return;

  /* The hint names the input the reader actually has. A phone has no Esc key,
     so advertising it sends them after a control that does not exist while
     the close button sits visible in the same corner.

     Two things here were wrong the first time. It tested pointer ALONE, and a
     touch device that reports hover:hover -- a Windows touch laptop, an
     Android tablet, a desktop browser in device mode -- came out as "fine"
     and got told to press Esc at phone width. And it was evaluated once at
     load, so it could never notice the viewport changing afterwards.

     So: coarse pointer OR the site's own mobile breakpoint, and evaluated at
     the moment the overlay opens rather than at load. 768px is not an
     arbitrary number; it is where this stylesheet already switches the whole
     layout to its mobile form, so the wording and the layout agree.

     The Esc listener stays unconditional either way -- a tablet with a
     keyboard attached still closes on Esc. Only the wording changes. */
  function isTouchView() {
    var coarse = !(window.matchMedia &&
                   window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    return coarse || window.innerWidth <= 768;
  }

  var ov = document.createElement('div');
  ov.className = 'shot-ov';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.innerHTML =
    '<div class="shot-ov-hint"></div>' +
    '<button type="button" class="shot-ov-close" aria-label="Close">&#215;</button>' +
    '<div class="shot-ov-scroll"><img alt=""></div>';
  document.body.appendChild(ov);

  var ovImg = ov.querySelector('img'),
      scroller = ov.querySelector('.shot-ov-scroll'),
      closeBtn = ov.querySelector('.shot-ov-close'),
      hint = ov.querySelector('.shot-ov-hint'),
      opener = null;

  function trueWidth(img) { return parseInt(img.getAttribute('width'), 10) || 0; }

  /* Expanding shows the capture at the size it really is, not at the file's
     2x pixels. A 2880px asset is a 1440px window, and 1440 fits any desktop
     screen -- so on desktop expanding means "see all of it", with no panning,
     which is what expanding ought to mean. It still overflows a phone, but at
     1440 rather than 2880, so it is a swipe or two instead of five. */
  function open(src, alt, btn, w, h) {
    ovImg.setAttribute('src', src);
    ovImg.setAttribute('alt', alt || '');
    ovImg.style.width = w ? w + 'px' : '';
    /* The hint has to describe THIS picture, not screenshots in general:
       most of them now fit the screen whole, and telling a reader to pan
       something that cannot move is the same fault as offering them an Esc
       key they do not have. */
    var pans = (w > window.innerWidth - 32) || (h > window.innerHeight - 82);
    var touch = isTouchView();
    hint.innerHTML = pans
      ? (touch ? 'Drag to pan &middot; Tap &#215; to close' : 'Scroll to pan &middot; Esc to close')
      : (touch ? 'Tap &#215; to close' : 'Esc to close');
    ov.classList.add('open');
    document.body.classList.add('shot-ov-open');
    scroller.scrollTop = 0;
    scroller.scrollLeft = 0;
    opener = btn || null;
    closeBtn.focus();
  }

  function close() {
    if (!ov.classList.contains('open')) return;
    ov.classList.remove('open');
    document.body.classList.remove('shot-ov-open');
    ovImg.removeAttribute('src');
    if (opener) { opener.focus(); opener = null; }
  }

  Array.prototype.forEach.call(frames, function (frame) {
    var btn = frame.querySelector('.shot-zoom-btn'),
        img = frame.querySelector('img');
    if (!btn || !img) return;
    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      open(img.getAttribute('src'), img.getAttribute('alt'), btn,
           trueWidth(img), parseInt(img.getAttribute('height'), 10) || 0);
    });
  });

  /* Hide the control on any capture already shown whole. Once a screenshot
     renders at its true size, most of them are not constrained by the column
     at all, and a magnifier over a picture that cannot get any bigger is a
     promise the overlay cannot keep. Re-run on resize, because the same shot
     is constrained on a phone and unconstrained on a desktop. */
  function syncZoomButtons() {
    Array.prototype.forEach.call(frames, function (frame) {
      var btn = frame.querySelector('.shot-zoom-btn'),
          img = frame.querySelector('img');
      if (!btn || !img) return;
      var t = trueWidth(img);
      btn.hidden = t > 0 && img.getBoundingClientRect().width >= t - 1;
    });
  }
  syncZoomButtons();
  window.addEventListener('resize', syncZoomButtons);
  window.addEventListener('load', syncZoomButtons);

  /* Close on the button, on the backdrop, or on the padding around the
     image. Never on the image, so a click while panning does not dismiss. */
  ov.addEventListener('click', function (ev) {
    if (ev.target === ov || ev.target === scroller || ev.target === closeBtn) close();
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' || ev.keyCode === 27) close();
  });
})();

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

  /* ---- Ask Amit, the bar that ARRIVES ----
     The spine solves reachability on desktop, but below 1244 it is a drawer
     and Ask is two taps behind a button. A bar pinned from the first paragraph
     was rejected: three floating controls already sit on a phone, it would
     outrank all of them by spanning the full width, and it costs about 7% of a
     390x844 screen permanently to serve an action most readers never take.

     So it arrives instead. It slides up once the reader is two thirds through
     the article -- roughly the point where a question has actually formed --
     and it can be dismissed.

     DISMISSAL IS FOR THIS READING PASS ONLY. It used to persist across the
     whole session, which was wrong twice over: the offer is tied to THIS
     section -- the subject line carries the section title, so it is a
     different offer on every page -- and a reader who waved it away on
     section 3 was silently denied it on the other 115. It also never came
     back after scrolling up and down again, which simply reads as broken.

     So dismissal now re-arms as soon as the reader scrolls back above the
     threshold, and nothing is remembered between pages. The re-arm point is
     lower than the show point on purpose: matching them would let the bar
     flicker in and out for anyone resting near the boundary.

     CSS confines the shape by width; this only toggles a class. */
  var askDismissed = false;
  var askBar = document.createElement('div');
  askBar.className = 'ask-bar';
  askBar.innerHTML =
    '<a href="mailto:' + (document.getElementById('askAddr')
      ? document.getElementById('askAddr').textContent.trim() : '') + '" data-ask>' +
    '<span>Questions about this section?</span><b>Ask Amit</b></a>' +
    '<button type="button" class="ask-bar-x" aria-label="Dismiss">&times;</button>';
  document.body.appendChild(askBar);
  askBar.querySelector('.ask-bar-x').addEventListener('click', function () {
    askBar.classList.remove('is-in');
    document.body.classList.remove('ask-bar-in');   /* let the fabs drop back */
    askDismissed = true;
  });

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

    /* Measured against the ARTICLE, not the document: the footer, the
       prev/next and the print block are not reading, and counting them would
       push the trigger past the end of the prose on a short section. */
    if (askBar) {
      var r = main.getBoundingClientRect(),
          read = (-r.top + window.innerHeight) / (r.height || 1);
      /* Coming back up past the re-arm point clears the dismissal, so the bar
         is available again on the next pass down. 0.58 rather than 0.66 gives
         it hysteresis: with one threshold it would flicker for a reader
         resting on the boundary. */
      if (read < 0.58) askDismissed = false;
      var shown = read > 0.66 && !askDismissed;
      askBar.classList.toggle('is-in', shown);
      /* The body class lifts the About mark and the page-nav button clear of
         the bar. They occupy the same corner, and measured at 390 they collide
         with it exactly. */
      document.body.classList.toggle('ask-bar-in', shown);
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(sync); }
  }, { passive: true });
  window.addEventListener('resize', sync);
  sync();
})();
