/* Basics-world behaviour: the topic switcher, and the copy buttons.
   Created 11 September 2026, rewritten 12 September 2026.

   Theme, search, print, figure zoom and the Ask Amit bar are global scripts
   and load on every world; this file is only what a Basics section adds.

   THE DRAWER CODE IS GONE with the rail it opened. A Basics section has no
   left rail as of 12 September 2026, so the header's menu button is hidden
   (world-basics.css) and there is nothing off-canvas to toggle. */
(function () {

  /* ---- THE TOPIC SWITCHER ------------------------------------------------
     Replaces the rail and "See where this fits". Opens on click, closes on
     Escape, on an outside click, and on losing focus to somewhere outside it,
     so it can never be left open behind the reader. The button owns
     aria-expanded; the panel owns `hidden`, which is the one property the
     site's reset guarantees cannot be overridden by a stray display rule. */
  var wrap = document.querySelector('[data-switch]');
  if (wrap) {
    var btn = wrap.querySelector('.b-switch-btn'),
        panel = wrap.querySelector('.b-switch-panel');

    var setOpen = function (open) {
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        /* Bring the current topic into view when the list is long enough to
           scroll; a picker that opens showing the wrong end is worse than a
           list, which is the whole thing this replaced. */
        var cur = panel.querySelector('.b-switch-a.current');
        if (cur && panel.scrollHeight > panel.clientHeight) {
          panel.scrollTop = Math.max(0, cur.offsetTop - 80);
        }
      }
    };

    btn.addEventListener('click', function () {
      setOpen(panel.hidden);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { setOpen(false); btn.focus(); }
    });

    document.addEventListener('click', function (e) {
      if (!panel.hidden && !wrap.contains(e.target)) setOpen(false);
    });

    document.addEventListener('focusin', function (e) {
      if (!panel.hidden && !wrap.contains(e.target)) setOpen(false);
    });
  }

  /* ---- COPY BUTTONS on .code blocks, delegated so it works on any page. */
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest ? ev.target.closest('.code .copy') : null;
    if (!b) return;
    var pre = b.parentNode ? b.parentNode.querySelector('pre') : null;
    var text = pre ? pre.innerText : '';
    if (!text) return;
    var flash = function () {
      var orig = b.getAttribute('data-label') || b.textContent;
      b.setAttribute('data-label', orig);
      b.classList.add('done'); b.textContent = 'Copied';
      setTimeout(function () { b.textContent = orig; b.classList.remove('done'); }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(flash, flash);
    } else { flash(); }
  });

  /* ---- COPY THE QUESTIONS, as a numbered list ready to paste into a ticket
     or a chat with the developer. */
  var cq = document.querySelector('.b-copyq');
  if (cq && navigator.clipboard) {
    cq.hidden = false;
    cq.addEventListener('click', function () {
      var items = document.querySelectorAll('.b-ask li'), t = [];
      for (var q = 0; q < items.length; q++) t.push((q + 1) + '. ' + items[q].textContent.trim());
      navigator.clipboard.writeText(t.join('\n')).then(function () {
        cq.textContent = 'Copied';
        setTimeout(function () { cq.textContent = 'Copy all'; }, 1500);
      });
    });
  }

})();
