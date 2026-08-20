/* ---------------------------------------------------------------------------
   diagram-check.js — the per-figure pass from diagram-spec.html §06, automated.

   WHY THIS FILE EXISTS
   Cycle 6 pasted the same checking script into the browser fifteen times, once
   per page per theme, and it was the single largest cost of that session. This
   file is the canonical copy so it is pasted ONCE per session and then called
   for the price of a few characters.

   HOW TO USE IT
   1. Verify against a CLEAN BUILD, never against a running `hugo server` in
      this tree. Its watcher silently misses in-place rewrites here and serves
      a stale page, which looks exactly like an edit that did nothing. Stop the
      server, `rm -rf public`, `hugo --gc`, restart, then check.
   2. Once per session, paste this file's contents into the browser wrapped as:
         localStorage.setItem('dgc', String.raw`...file contents...`)
      String.raw, not a plain template literal — a plain one eats the backslash
      in every regex here and silently breaks them. Comments can be stripped on
      the way in; the stored copy is the same code without them. localStorage
      survives navigation on the same origin, so this is one paste for the whole
      session however many pages you visit.
   3. On every page thereafter, the whole check costs one line:
         eval(localStorage.dgc); DGC()
   4. Run it in BOTH themes. Set the theme the way the site does — never by
      flipping the data-theme attribute:
         localStorage.setItem('site-theme','dark'); location.reload()
   5. Run it at 1440 and at 375.

   WHAT IT RETURNS
   One line per figure. 'OK' means every check in diagram-spec §06 that can be
   measured passed. It cannot tell you whether the figure teaches anything —
   that is the reader's test in §00, and it needs eyes.
--------------------------------------------------------------------------- */

window.DGC = function () {
  // 'none' and 'transparent' are NOT colours. Parsing them as rgb(0,0,0) was a
  // real bug in cycle 6: it made every label inside a stroke-only container
  // measure against fake black and report two false contrast failures.
  const parse = s => {
    if (!s || s === 'none' || s === 'transparent') return null;
    const m = s.match(/[\d.]+/g);
    if (!m) return null;
    return [+m[0], +m[1], +m[2], m[3] === undefined ? 1 : +m[3]];
  };
  const composite = (fg, bg) => {
    const a = fg[3];
    return [fg[0]*a + bg[0]*(1-a), fg[1]*a + bg[1]*(1-a), fg[2]*a + bg[2]*(1-a), 1];
  };
  const luminance = c => {
    const s = c.slice(0, 3).map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126*s[0] + 0.7152*s[1] + 0.0722*s[2];
  };
  const ratio = (a, b) => {
    const x = luminance(a), y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  const contains = (inner, outer) =>
    inner.x >= outer.x - 1 && inner.y >= outer.y - 1 &&
    inner.x + inner.width  <= outer.x + outer.width  + 1 &&
    inner.y + inner.height <= outer.y + outer.height + 1;
  // getBBox() on <text> returns the em box, which is taller than the visible
  // glyphs, so two normally-spaced stacked lines touch or graze by a fraction
  // of a pixel. Reporting that as a collision produced six false failures the
  // first time this ran. A real overlap bites by more than a couple of pixels
  // in both directions, so overlap is measured by depth, not by contact.
  const overlapDepth = (a, b) => Math.min(
    Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x),
    Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)
  );
  const overlaps = (a, b, tol = 0) => overlapDepth(a, b) > tol;

  const theme = document.documentElement.getAttribute('data-theme') || 'system';
  const page  = location.pathname.split('/').filter(Boolean).pop() || 'home';
  const lines = [];
  let figures = 0, failures = 0;

  document.querySelectorAll('.diagram-box').forEach((box, i) => {
    const id = 'fig' + (i + 1);
    const svg = box.querySelector('svg');
    if (!svg) { lines.push(id + '  STILL HTML — not yet redrawn'); failures++; return; }
    figures++;
    const bad = [];

    // --- canvas -----------------------------------------------------------
    const vb = (svg.getAttribute('viewBox') || '').split(/\s+/).map(Number);
    if (vb[2] !== 700) bad.push('canvas width ' + vb[2] + ', must be 700');
    if (vb[3] < 180 || vb[3] > 340) bad.push('canvas height ' + vb[3] + ', must be 180-340');

    // --- root attributes --------------------------------------------------
    if (svg.getAttribute('role') !== 'img') bad.push('missing role="img"');
    const aria = svg.getAttribute('aria-label');
    if (!aria) bad.push('missing aria-label');
    else if (aria.trim().split(/\s+/).length < 8) bad.push('aria-label is not a full sentence');

    // A figure wrapped in .diagram-content is the old HTML-layout idiom. An
    // inline SVG goes straight inside .diagram-box.
    if (box.querySelector('.diagram-content')) bad.push('SVG wrapped in .diagram-content — drop the wrapper');

    // --- typeface and size ------------------------------------------------
    // Cycle 6: both inherited §8 figures carried font-family:sans-serif on
    // every text element, so neither rendered in Plex on a site that
    // self-hosts its typeface precisely so that it does.
    const raw = svg.outerHTML;
    const families = raw.match(/font-family[:=]/g);
    if (families) bad.push(families.length + ' hardcoded font-family — remove, let it inherit Plex');

    const texts  = [...svg.querySelectorAll('text')];
    const shapes = [...svg.querySelectorAll('rect,circle,path,line,ellipse,polygon')].filter(e => !e.closest('defs'));
    const boxes  = [...svg.querySelectorAll('rect,circle,ellipse')].filter(e => !e.closest('defs'));

    const sizes = texts.map(t => parseFloat(getComputedStyle(t).fontSize));
    const smallest = Math.min(...sizes);
    if (smallest < 11) bad.push('text at ' + smallest + 'px, floor is 11');

    if (/letter-spacing/.test(raw)) bad.push('letter-spacing present — rejected 19 Aug as a generated-page tell');
    // An uppercase LABEL is the rejected treatment. An acronym is not — ECID,
    // AMCV, FPID and CNAME are how those things are written. A single word of
    // six characters or fewer is read as an acronym and left alone.
    texts.forEach(t => {
      const s = t.textContent.trim();
      const isAcronym = !/\s/.test(s) && s.length <= 6;
      if (s.length > 3 && s === s.toUpperCase() && /[A-Z]{4}/.test(s) && !isAcronym) {
        bad.push('uppercase label "' + s.slice(0, 20) + '"');
      }
    });

    // --- stale and hardcoded colour --------------------------------------
    if (/e11d48/.test(raw)) bad.push('stale #e11d48 fallback — accent is #ba2142 since 18 Aug');
    if (/94a3b8/.test(raw) && theme !== 'dark') bad.push('#94a3b8 used as a light fallback — that is the DARK --text3');
    const naked = raw.match(/(?:fill|stroke):\s*(?!var\()#[0-9a-fA-F]{3,8}/g);
    if (naked) bad.push(naked.length + ' colour(s) not wrapped in var() with a fallback');

    // --- ids --------------------------------------------------------------
    [...svg.querySelectorAll('marker[id],linearGradient[id],radialGradient[id],clipPath[id]')].forEach(d => {
      if (!/\d/.test(d.id)) bad.push('id "' + d.id + '" is not section-suffixed — ids are global to the page');
    });

    // --- budget -----------------------------------------------------------
    const count = shapes.length + texts.length;
    if (count < 20) bad.push('only ' + count + ' elements, band is 20-45');
    if (count > 45) bad.push(count + ' elements, band is 20-45');

    // --- geometry ---------------------------------------------------------
    // Check text against EVERY shape, not just <rect>. A figure drawn with
    // <path> is invisible to a rect-only check, which is how a document
    // outline once came to strike through the line beneath it.
    let worstClearance = Infinity;
    texts.forEach(t => {
      const tb = t.getBBox();
      shapes.forEach(sh => {
        const sb = sh.getBBox();
        if (overlaps(tb, sb) && !contains(tb, sb)) {
          bad.push('"' + t.textContent.slice(0, 18) + '" overlaps a ' + sh.tagName);
        }
      });
      // clearance from the smallest box that holds it
      let host = null, area = Infinity;
      boxes.forEach(sh => {
        const sb = sh.getBBox();
        if (contains(tb, sb) && sb.width * sb.height < area) { area = sb.width * sb.height; host = sb; }
      });
      if (host && t.textContent.trim().length > 2) {
        const clear = Math.min(
          tb.x - host.x, host.x + host.width - (tb.x + tb.width),
          tb.y - host.y, host.y + host.height - (tb.y + tb.height)
        );
        worstClearance = Math.min(worstClearance, clear);
        // A 3-line box needs height 70, a 2-line box 52. 64 for three lines
        // leaves 3px under the last line and was made twice in one session.
        if (clear < 4) bad.push('"' + t.textContent.slice(0, 18) + '" only ' + clear.toFixed(1) + 'px from its box edge');
      }
    });
    for (let a = 0; a < texts.length; a++) {
      for (let b = a + 1; b < texts.length; b++) {
        if (overlaps(texts[a].getBBox(), texts[b].getBBox(), 2)) {
          bad.push('"' + texts[a].textContent.slice(0, 14) + '" overlaps "' + texts[b].textContent.slice(0, 14) + '"');
        }
      }
    }
    const lowest = Math.max(...[...shapes, ...texts].map(e => e.getBBox().y + e.getBBox().height));
    if (lowest > vb[3]) bad.push('content runs ' + Math.round(lowest - vb[3]) + 'px past the canvas bottom');
    const rightmost = Math.max(...texts.map(t => t.getBBox().x + t.getBBox().width));
    if (rightmost > vb[2] - 4) bad.push('text reaches x=' + Math.round(rightmost) + ', too close to the right edge');

    // --- contrast, composited against the real backdrop -------------------
    let ground = parse(getComputedStyle(box).backgroundColor) || [255, 255, 255, 1];
    if (ground[3] < 1) ground = composite(ground, parse(getComputedStyle(document.body).backgroundColor) || [255, 255, 255, 1]);
    let worstContrast = Infinity;
    texts.forEach(t => {
      const tb = t.getBBox();
      let backdrop = ground, area = Infinity;
      boxes.forEach(sh => {
        const sb = sh.getBBox();
        const fill = parse(getComputedStyle(sh).fill);
        if (contains(tb, sb) && fill && fill[3] > 0 && sb.width * sb.height < area) {
          area = sb.width * sb.height;
          backdrop = composite(fill, ground);
        }
      });
      const ink = composite(parse(getComputedStyle(t).fill) || [0, 0, 0, 1], backdrop);
      const r = ratio(ink, backdrop);
      worstContrast = Math.min(worstContrast, r);
      const size = parseFloat(getComputedStyle(t).fontSize);
      const bold = +getComputedStyle(t).fontWeight >= 700;
      const need = (size >= 18 || (size >= 14 && bold)) ? 3 : 4.5;
      if (r < need - 1e-4) bad.push('"' + t.textContent.slice(0, 18) + '" at ' + r.toFixed(2) + ':1, needs ' + need);
    });

    // --- rendering --------------------------------------------------------
    const rendered = Math.round(svg.getBoundingClientRect().width);
    if (rendered !== 700) bad.push('renders at ' + rendered + 'px, not 700 — authored px is no longer rendered px');

    if (bad.length) failures++;
    lines.push(
      id + '  ' + vb[2] + 'x' + vb[3] + '  ' + count + ' el  ' + smallest + 'px  ' +
      'clear ' + (worstClearance === Infinity ? '-' : worstClearance.toFixed(1)) + '  ' +
      'contrast ' + worstContrast.toFixed(2) + '  ' +
      (bad.length ? 'FAIL: ' + bad.join(' | ') : 'OK')
    );
  });

  const pageOverflows = document.documentElement.scrollWidth > innerWidth + 1;
  return [
    page + '  theme=' + theme + '  viewport=' + innerWidth +
    '  figures=' + figures + '  failing=' + failures +
    (pageOverflows ? '  PAGE SCROLLS HORIZONTALLY' : ''),
    ...lines
  ].join('\n');
};
