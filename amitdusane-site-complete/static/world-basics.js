/* Basics-world behaviour: the rail drawer on phones, copy buttons, and the
   word picker on the front page. Created 11 September 2026.

   Theme, search, print, figure zoom and the Ask Amit bar are global scripts
   and load on every world; this file is only what a Basics section adds. */
(function () {
  var body = document.body;

  /* THE DRAWER. Below 880px the rail is off-canvas and the header's menu
     button opens it. Escape and the scrim close it. */
  var mb = document.getElementById('siteMenuBtn'),
      scrim = document.getElementById('bScrim');
  if (mb) mb.addEventListener('click', function () { body.classList.toggle('nav-open'); });
  if (scrim) scrim.addEventListener('click', function () { body.classList.remove('nav-open'); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') body.classList.remove('nav-open');
  });

  /* COPY BUTTONS on .code blocks, delegated so it works on any page. */
  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest ? ev.target.closest('.code .copy') : null;
    if (!btn) return;
    var pre = btn.parentNode ? btn.parentNode.querySelector('pre') : null;
    var text = pre ? pre.innerText : '';
    if (!text) return;
    var flash = function () {
      var orig = btn.getAttribute('data-label') || btn.textContent;
      btn.setAttribute('data-label', orig);
      btn.classList.add('done'); btn.textContent = 'Copied';
      setTimeout(function () { btn.textContent = orig; btn.classList.remove('done'); }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(flash, flash);
    } else { flash(); }
  });

  /* THE WORD PICKER. The reader taps the words that are new to them and the
     topics covering those words light up; everything else fades back.

     It is hidden in the markup and shown only here, so a reader without
     JavaScript never sees buttons that do nothing. The cards still list every
     topic either way, which is the part that matters. */
  var pick = document.getElementById('bPick');
  if (!pick) return;
  var chips = pick.querySelectorAll('.b-chip'),
      cards = document.querySelectorAll('.b-card'),
      out = document.getElementById('bPickOut'),
      clear = document.getElementById('bPickClear');
  pick.hidden = false;

  function picked() {
    var s = [];
    for (var i = 0; i < chips.length; i++) {
      if (chips[i].getAttribute('aria-pressed') === 'true') s.push(chips[i].getAttribute('data-w'));
    }
    return s;
  }
  function apply() {
    var sel = picked(), hits = 0, i, j, ws, hit;
    for (i = 0; i < cards.length; i++) {
      if (!sel.length) { cards[i].classList.remove('is-hit', 'is-dim'); continue; }
      ws = (cards[i].getAttribute('data-words') || '').split('|');
      hit = false;
      for (j = 0; j < sel.length; j++) { if (ws.indexOf(sel[j]) !== -1) { hit = true; break; } }
      cards[i].classList.toggle('is-hit', hit);
      cards[i].classList.toggle('is-dim', !hit);
      if (hit) hits++;
    }
    if (clear) clear.hidden = !sel.length;
    if (!out) return;
    if (!sel.length) { out.textContent = ''; return; }
    out.textContent = hits === 1 ? 'Start with the highlighted topic.'
                    : hits > 1  ? 'Start with the ' + hits + ' highlighted topics.'
                    : 'No topic here covers those words yet.';
  }
  for (var c = 0; c < chips.length; c++) {
    chips[c].addEventListener('click', function () {
      this.setAttribute('aria-pressed', this.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      apply();
    });
  }
  if (clear) clear.addEventListener('click', function () {
    for (var i = 0; i < chips.length; i++) chips[i].setAttribute('aria-pressed', 'false');
    apply();
  });

  /* SHOW ALL WORDS. Only each topic's first two words show at first; the
     rest wait behind this button. Hiding them again also unpresses any of
     them, so the highlighted cards never answer a choice the reader cannot
     see. */
  var more = document.getElementById('bPickMore');
  if (more) more.addEventListener('click', function () {
    var open = more.getAttribute('aria-expanded') !== 'true';
    var extra = pick.querySelectorAll('.b-chip[data-more]');
    for (var i = 0; i < extra.length; i++) {
      extra[i].hidden = !open;
      if (!open) extra[i].setAttribute('aria-pressed', 'false');
    }
    more.setAttribute('aria-expanded', open ? 'true' : 'false');
    more.textContent = more.getAttribute(open ? 'data-less' : 'data-all');
    apply();
  });
})();
