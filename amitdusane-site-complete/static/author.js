/* Bottom-right author button -> About overlay (universal, all pages). */
(function () {
  var fab = document.getElementById('authorFab'), ov = document.getElementById('aboutOverlay'), x = document.getElementById('aboutClose');
  if (!fab || !ov) return;
  function open() { ov.hidden = false; } function close() { ov.hidden = true; }
  fab.addEventListener('click', open);
  if (x) x.addEventListener('click', close);
  ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !ov.hidden) close(); });
})();

/* ---------------------------------------------------------------------------
   Ask Amit (universal, all pages).

   Every trigger on the site is a real <a href="mailto:..."> in the served
   HTML. This upgrades them: the click is intercepted and the overlay opens
   instead. With JavaScript off, or before this file runs, the links still do
   something useful rather than nothing.

   The subject is written at OPEN time, not at build time, because the same
   overlay serves every page. It carries the section title so an arriving mail
   is already labelled with the page that prompted it.
   --------------------------------------------------------------------------- */
(function () {
  var ov = document.getElementById('askOverlay');
  if (!ov) return;

  var card   = ov.querySelector('.ask-card'),
      closeB = document.getElementById('askClose'),
      mail   = document.getElementById('askMail'),
      copyB  = document.getElementById('askCopy'),
      addrEl = document.getElementById('askAddr'),
      addr   = addrEl ? addrEl.textContent.trim() : '',
      lastFocus = null;

  /* The h1 is the section's real title. document.title carries the SEO title
     and a site suffix, which would make every subject line twice as long and
     bury the part Amit actually needs to see. */
  function pageName() {
    var h = document.querySelector('.lsec-title') || document.querySelector('h1');
    return h ? h.textContent.trim() : document.title.split('·')[0].trim();
  }

  function buildMailto() {
    var subject = 'Ask Amit — ' + pageName();
    var body = '\n\n---\nAsked from: ' + location.href;
    return 'mailto:' + addr +
           '?subject=' + encodeURIComponent(subject) +
           '&body=' + encodeURIComponent(body);
  }

  function open() {
    lastFocus = document.activeElement;
    if (mail) mail.href = buildMailto();
    ov.hidden = false;
    if (closeB) closeB.focus();
  }
  function close() {
    ov.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.openAsk = open;

  if (closeB) closeB.addEventListener('click', close);
  ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.keyCode === 27) && !ov.hidden) close();
  });

  /* One delegated listener rather than one per trigger, because the spine
     entry and the mobile bar are both created later by world-learning.js. */
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-ask]');
    if (!t) return;
    if (card && card.contains(t)) return;   /* never swallow the card's own mail button */
    e.preventDefault();
    open();
  });

  if (copyB && addr) {
    copyB.addEventListener('click', function () {
      /* Flip the action label only. The button is the whole row now, so
         rewriting its textContent would erase the icon and the address. */
      var act = copyB.querySelector('.ask-route-act');
      var done = function () {
        if (!act) return;
        var was = act.textContent;
        act.textContent = 'Copied';
        copyB.classList.add('is-copied');
        setTimeout(function () { act.textContent = was; copyB.classList.remove('is-copied'); }, 1600);
      };
      var fallback = function () {
        var ta = document.createElement('textarea');
        ta.value = addr; ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.top = '-9999px';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (err) {}
        document.body.removeChild(ta);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(done, function () { fallback(); done(); });
      } else { fallback(); done(); }
    });
  }
})();
