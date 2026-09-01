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
  /* Diagrams share this overlay, so the guard cannot ask about screenshots
     alone: a section carrying figures and no capture would silently get no
     control at all. */
  var zoomDias = document.querySelectorAll('.diagram-box');
  if (!frames.length && !zoomDias.length) return;

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
    '<div class="shot-ov-scroll"><img alt=""><div class="shot-ov-svg"></div></div>';
  document.body.appendChild(ov);

  var ovImg = ov.querySelector('img'),
      ovSvg = ov.querySelector('.shot-ov-svg'),
      scroller = ov.querySelector('.shot-ov-scroll'),
      closeBtn = ov.querySelector('.shot-ov-close'),
      hint = ov.querySelector('.shot-ov-hint'),
      opener = null;

  function trueWidth(img) { return parseInt(img.getAttribute('width'), 10) || 0; }

  /* A figure's authored width. The corpus convention is that authored units
     are rendered pixels, so the viewBox width IS the size the labels were
     drawn for. */
  function naturalWidth(svgEl) {
    var vb = svgEl.viewBox && svgEl.viewBox.baseVal;
    return (vb && vb.width) ? Math.round(vb.width) : 700;
  }

  /* Expanding shows the capture at the size it really is, not at the file's
     2x pixels. A 2880px asset is a 1440px window, and 1440 fits any desktop
     screen -- so on desktop expanding means "see all of it", with no panning,
     which is what expanding ought to mean. It still overflows a phone, but at
     1440 rather than 2880, so it is a swipe or two instead of five. */
  /* On a phone, true size is more than the reader asked for. A 1244px capture
     on a 390px screen is over three screens of panning before the picture has
     been seen at all, and the ones declared 1440 are nearly four. Expanded is
     capped to twice the viewport there, which halves the panning while still
     showing the capture well above the size it had in the column. Desktop is
     untouched: 1440 fits a laptop whole, which is the point of true size.

     Width only. Height stays auto and follows, because constraining both is
     what stretched every printed figure. */
  function expandWidth(w) {
    if (!w) return 0;
    if (window.innerWidth > 880) return w;
    return Math.min(w, window.innerWidth * 2);
  }

  function open(src, alt, btn, w, h) {
    ovSvg.innerHTML = '';
    ovSvg.hidden = true;
    ovImg.hidden = false;
    ovImg.setAttribute('src', src);
    ovImg.setAttribute('alt', alt || '');
    var capped = expandWidth(w);
    /* The height has to be scaled by the same factor, or the panning hint
       below reasons about a picture that is no longer there. */
    if (w && capped !== w && h) h = Math.round(h * (capped / w));
    w = capped;
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

  /* A diagram is inline SVG, not a file, so it is cloned in rather than
     pointed at.

     It opens at the figure's NATURAL width, the one its viewBox declares,
     because that is the width the labels were authored against: 11px means
     11px there and nowhere else. On a phone the figure is shrunk to fit the
     column, so this is the enlargement, and it is the only place the diagram
     can be read properly.

     Two wrong answers were tried first. Opening at the same width the page
     already showed made the control promise nothing. Doubling it made the
     text large but sent the reader panning four screens for a figure they
     could otherwise take in whole. Natural size is the one that means
     something. Read from the viewBox rather than assumed, since not every
     figure in the corpus is 700 wide. */

  /* Expanded shows the WHOLE figure, not the svg alone. M02 s2 pairs an svg
     timeline with three HTML bars, and cloning only the svg dropped the bars:
     the reader tapped enlarge and got half of what they were looking at. So
     everything in the frame comes across, minus the control itself. For the
     other 125 figures the frame holds the svg alone and this is exactly what
     it always was. */
  function openSvg(svgEl, btn) {
    var zoomW = naturalWidth(svgEl);
    var parent = svgEl.parentNode;
    var frame = (parent && parent.classList &&
                 parent.classList.contains('diagram-frame')) ? parent : null;
    var parts = frame ? frame.children : [svgEl];
    ovSvg.innerHTML = '';
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (part.classList && part.classList.contains('diagram-zoom-btn')) continue;
      var clone = part.cloneNode(true);
      if (clone.tagName && clone.tagName.toLowerCase() === 'svg') {
        clone.removeAttribute('style');
        clone.style.height = 'auto';
        clone.style.display = 'block';
      }
      /* Every part holds the authored width, so a bar cannot stop short of
         the drawing it annotates once the panel is wider than the screen. */
      clone.style.width = zoomW + 'px';
      clone.style.minWidth = zoomW + 'px';
      ovSvg.appendChild(clone);
    }
    /* Emptied, not merely hidden. A leftover alt string renders as text the
       moment anything lets the element draw, which is exactly what happened. */
    ovImg.removeAttribute('src');
    ovImg.setAttribute('alt', '');
    ovImg.style.width = '';
    ovImg.hidden = true;
    ovSvg.hidden = false;
    var pans = zoomW > window.innerWidth - 32;
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
    ovSvg.innerHTML = '';
    ovSvg.hidden = true;
    ovImg.hidden = false;
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

  /* ---- Diagrams get the same control, for the same reason (pilot, M7 s5) ----
     A 700-unit figure holds its width so its authored 11px text renders at
     11px rather than 5.4px. The cost is that a phone sees 341px of it and
     roughly 390px sits off-screen with nothing saying so. Readers have been
     taught by 43 screenshots that a picture carries a zoom button, and the
     most numerous visual on the site was the one that did not. Same button,
     same overlay, same gesture.

     The button lives inside .diagram-title rather than floating over the
     artwork, because .diagram-box is itself the horizontal scroller: anything
     absolutely positioned inside it scrolls away with the figure. The title
     is already position:sticky;left:0, so a control riding in it stays put.

     Visibility is CSS-gated to the mobile breakpoint. This hides it whenever
     the figure is already at its authored width, because offering to enlarge
     something the reader can see whole is a promise the overlay cannot keep.
     The test is the rendered width against the authored one, not overflow:
     on a phone the figure is scaled down to fit, so it never overflows and
     an overflow test would hide the button exactly where it is needed. */
  function syncDiagramButtons() {
    Array.prototype.forEach.call(zoomDias, function (box) {
      var btn = box.querySelector('.diagram-zoom-btn'),
          svg = box.querySelector('svg');
      if (!btn || !svg) return;
      btn.hidden = svg.getBoundingClientRect().width >= naturalWidth(svg) - 1;
    });
  }

  /* The drawing gets wrapped in a frame so the control can sit on it, in the
     same corner a screenshot's does. 43 captures taught that convention and it
     is the one with the head start, so diagrams move to match rather than the
     other way round.

     The wrapper is what makes it possible: a button cannot be positioned
     inside an <svg>, and .diagram-box holds the caption and the hint too, so
     anchoring to the box would float the control up beside the caption. This
     mirrors .shot-frame exactly. It also takes the chrome, because once the
     svg is wrapped the `.diagram-box > svg` rule stops matching it. */
  Array.prototype.forEach.call(zoomDias, function (box) {
    var svg = box.querySelector(':scope > svg');
    if (!svg) return;
    var frame = document.createElement('div');
    frame.className = 'diagram-frame';
    box.insertBefore(frame, svg);
    /* The frame takes the whole drawing, not just the svg: everything from
       the svg to the end of the box. For 125 of the 126 figures that is the
       svg alone and the result is identical. The exception is M02 s2's
       allocation figure, which is an svg timeline followed by three HTML
       bars, and wrapping the svg alone drew the border around the timeline
       while leaving the bars -- the payoff of the figure -- outside it.
       A caption stays outside the frame; a drawing never should. */
    for (var node = frame.nextSibling; node; node = frame.nextSibling) {
      frame.appendChild(node);
    }
    /* A drawing that is only an svg needs no inset: the viewBox carries its
       own whitespace. Real DOM content does, or its text sits on the outline
       -- "First Touch" measured 0px from the border. Flagged rather than
       given to every frame, because padding on the other 125 would shrink
       the svg inside the --diagram-min floor for no gain. */
    if (frame.querySelector(':scope > *:not(svg)')) {
      frame.className = 'diagram-frame diagram-frame-mixed';
    }
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'diagram-zoom-btn';
    btn.setAttribute('aria-label', 'Enlarge this diagram');
    btn.innerHTML = '&#10530;';
    frame.appendChild(btn);
    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      openSvg(svg, btn);
    });
  });
  syncDiagramButtons();
  window.addEventListener('resize', syncDiagramButtons);
  window.addEventListener('load', syncDiagramButtons);

  /* ---- The hint, on every figure ----
     At phone width a capture's interface text lands near 3px and a diagram's
     near 5px, so a reader who does not notice the 30px control concludes the
     pictures are simply poor rather than that there is more behind them.

     It was on the first figure only, on the argument that one instance teaches
     a convention and repeating it is noise. That was wrong, and the reason is
     discoverability: a reader arriving mid-page from the spine, or scrolling
     fast, never passes the first figure, and a hint nobody sees is worth
     nothing however tidy it is. At 11px and muted it costs almost no space,
     so certainty is the better trade.

     Deliberately not appended to the caption: captions here are editorial
     clauses and the longer ones already wrap to two lines at 341px.

     There is no page-level gate. Every figure is asked whether it has a
     control, and one without a control gets no hint, so a section holding
     screenshots and no drawing is covered on the same terms as any other.
     The pilot gated this on diagrams and would have left those sections
     silent. */
  var hintSyncs = [];
  Array.prototype.forEach.call(
    document.querySelectorAll('.diagram-box, .shot-box'),
    function (fig) {
      var target = fig.querySelector(':scope > .diagram-frame') ||
                   fig.querySelector(':scope > svg') ||
                   fig.querySelector(':scope > .diagram-content') ||
                   fig.querySelector('.shot-frame');
      var ctrl = fig.querySelector('.diagram-zoom-btn, .shot-zoom-btn');
      if (!target || !ctrl) return;
      var hint = document.createElement('p');
      hint.className = 'fig-hint';
      hint.innerHTML = 'Tap &#10530; to see this full size';
      target.parentNode.insertBefore(hint, target);
      /* If the control is hidden the hint is a lie, so it follows it. */
      hintSyncs.push(function () { hint.hidden = ctrl.hidden; });
    }
  );
  var syncHints = function () {
    for (var i = 0; i < hintSyncs.length; i++) hintSyncs[i]();
  };
  syncHints();
  window.addEventListener('resize', syncHints);
  window.addEventListener('load', syncHints);

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

  /* ---- Ask Amit, the bar that ARRIVES ----
     The spine solves reachability on desktop, but below 1244 it is a drawer
     and Ask is two taps behind a button. A bar pinned from the first paragraph
     was rejected: three floating controls already sit on a phone, it would
     outrank all of them by spanning the full width, and it costs about 7% of a
     390x844 screen permanently to serve an action most readers never take.

     So it arrives instead. It slides up once the reader is three quarters
     through the article -- roughly the point where a question has actually
     formed -- and it can be dismissed.

     THREE QUARTERS, not two thirds. Amit's call on 1 Sep 2026, after a week
     of living with it: at two thirds the bar was intruding on readers who
     were still reading. Somebody who genuinely works down a section still
     meets it; somebody skimming the middle no longer does.

     IT ALSO LEAVES AT THE FOOT OF THE PAGE. Same call, same reason: the bar
     sat on top of the previous and next links and made moving between
     sections awkward. It now hides as soon as that navigation is on screen,
     and comes back if the reader scrolls up away from it.

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
  var askNav = document.querySelector('.lpn');   /* the prev/next block */
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

    /* Measured against .lmain rather than the document: the site footer and
       the print block are not reading, and counting them would push the
       trigger past the end of the prose on a short section. .lmain does
       include the prev/next block, which an earlier version of this comment
       denied. It is a fixed 165px or so and makes no practical difference to
       the fraction, and the bottom behaviour below keys off that element
       directly rather than off the fraction. */
    if (askBar) {
      var r = main.getBoundingClientRect(),
          read = (-r.top + window.innerHeight) / (r.height || 1);
      /* Coming back up past the re-arm point clears the dismissal, so the bar
         is available again on the next pass down. 0.66 rather than 0.75 gives
         it hysteresis: with one threshold it would flicker for a reader
         resting on the boundary. */
      if (read < 0.66) askDismissed = false;
      /* Off once the prev/next links are on screen, so the bar never covers
         them. Keyed to the element rather than to a scroll percentage on
         purpose: .lpn is a fixed height inside articles that run from 700 to
         2000 words, so a percentage tuned to clear it on a long section would
         fire far too early on a short one. Scrolling back up above the
         navigation brings the bar back, provided the reader is still past the
         three quarter mark. */
      var navUp = askNav && askNav.getBoundingClientRect().top < window.innerHeight;
      var shown = read > 0.75 && !navUp && !askDismissed;
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
