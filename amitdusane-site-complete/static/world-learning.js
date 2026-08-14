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

  var ov = document.createElement('div');
  ov.className = 'shot-ov';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.innerHTML =
    '<div class="shot-ov-hint">Scroll to pan &middot; Esc to close</div>' +
    '<button type="button" class="shot-ov-close" aria-label="Close">&#215;</button>' +
    '<div class="shot-ov-scroll"><img alt=""></div>';
  document.body.appendChild(ov);

  var ovImg = ov.querySelector('img'),
      scroller = ov.querySelector('.shot-ov-scroll'),
      closeBtn = ov.querySelector('.shot-ov-close'),
      opener = null;

  function open(src, alt, btn) {
    ovImg.setAttribute('src', src);
    ovImg.setAttribute('alt', alt || '');
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
      open(img.getAttribute('src'), img.getAttribute('alt'), btn);
    });
  });

  /* Close on the button, on the backdrop, or on the padding around the
     image. Never on the image, so a click while panning does not dismiss. */
  ov.addEventListener('click', function (ev) {
    if (ev.target === ov || ev.target === scroller || ev.target === closeBtn) close();
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' || ev.keyCode === 27) close();
  });
})();
