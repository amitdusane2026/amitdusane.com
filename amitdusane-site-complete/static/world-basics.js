/* Basics-world behaviour: the rail drawer on phones, and the copy buttons.
   Created 11 September 2026.

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

  /* COPY THE QUESTIONS, as a numbered list ready to paste into a ticket or a
     chat with the developer. */
  var cq = document.querySelector('.b-copyq');
  if (cq && navigator.clipboard) {
    cq.hidden = false;
    cq.addEventListener('click', function () {
      var items = document.querySelectorAll('.b-ask li'), t = [];
      for (var q = 0; q < items.length; q++) t.push((q + 1) + '. ' + items[q].textContent);
      navigator.clipboard.writeText(t.join('\n')).then(function () {
        cq.textContent = 'Copied';
        setTimeout(function () { cq.textContent = 'Copy'; }, 1500);
      });
    });
  }

  /* The word picker that lived here was removed on 11 September 2026, at
     Amit's request: fourteen topics do not need a tool with a learning curve,
     and it took the whole first screen of the front page. "See where this
     fits" (wherefits.js, shared) does the orienting now. */
})();
