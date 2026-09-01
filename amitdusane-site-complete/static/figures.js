/* Figures: the zoom control, the overlay and the hint. Global.

   Lifted out of world-learning.js on 2 Sep 2026 so the migration world gets the
   same behaviour. It was never learning-specific: it is "a picture too big for
   a phone needs a way to be opened", which is true of any world.

   Two figure shapes are handled. The learning world uses .diagram-box with a
   .diagram-title, the migration world uses <figure class="fig-svg"> with a
   <figcaption>. Screenshots (.shot-box) share the same overlay. */
(function () {
  var frames = document.querySelectorAll('.shot-box .shot-frame');
  /* Diagrams share this overlay, so the guard cannot ask about screenshots
     alone: a section carrying figures and no capture would silently get no
     control at all. */
  var zoomDias = document.querySelectorAll('.diagram-box, figure.fig-svg');
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
    /* Stop at a <figcaption>. The migration world's figures are
       <figure class="fig-svg"><svg>...</svg><figcaption>...</figcaption></figure>,
       so sweeping up everything after the svg would pull the caption inside the
       frame and box it with the drawing. The learning world has no figcaption
       at all, so this changes nothing there. */
    for (var node = frame.nextSibling; node; node = frame.nextSibling) {
      if (node.nodeName === 'FIGCAPTION') break;
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
    document.querySelectorAll('.diagram-box, .shot-box, figure.fig-svg'),
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
