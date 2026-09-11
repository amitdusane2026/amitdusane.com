/* "SEE WHERE THIS FITS": the pocket map overlay.

   Shared by every world that renders layouts/partials/wherefits.html: the
   learning world since August 2026, and Basics topics since 11 September 2026.
   It was moved out of world-learning.js that day rather than copied, so there
   is one copy of it.

   It serves a three-tier map (phase, module, section) and a two-tier one (a
   Basics group, then its topics). In the two-tier map the second-tier items
   are plain links with no data-mod, so a tap opens the topic, and the arrow to
   a third tier simply never draws because there is nothing to point at.

   Any element carrying data-wf-open opens the map as well, which is how the
   Basics side column offers it. */
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
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-wf-open]')) open();
  });
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
      /* A two-tier map (Basics) has no module to open: its second tier is
         links. Without this check the missing data-mod read as null and every
         topic in the row was marked selected. */
      if (firstMod && firstMod.hasAttribute('data-mod')) {
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
