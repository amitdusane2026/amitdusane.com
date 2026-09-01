/* The "Ask Amit" bar that arrives near the end of a read. Global.

   Lifted out of world-learning.js on 2 Sep 2026 so the migration world gets it
   too. It was tangled with the learning spine's scrollspy, sharing that
   function's variables, which is the only reason it was ever learning-only.

   It is the bar and nothing else: no entry in any side navigation. A tip pinned
   permanently to a rail is only ever seen by a reader who already finished, and
   Amit ruled that out.

   The overlay it opens is not built here. The link carries data-ask, and
   author.js, which loads on every page, turns that into the overlay. So this
   file only decides WHEN to offer it.

   Per-world wiring is two questions, answered by whichever selector matches:
     what am I measuring     the article container
     when do I get out of the way   the prev/next block at the end of it */
(function () {
  var main = document.querySelector('.lmain') ||
             document.querySelector('.main');
  /* Off once the prev/next links are on screen, so the bar never covers them.
     Keyed to the element rather than to a scroll percentage on purpose: the
     block is a fixed height inside articles that vary by a thousand words, so
     a percentage tuned to clear it on a long piece fires far too early on a
     short one. */
  var stop = document.querySelector('.lpn') ||
             document.querySelector('.stepnav');
  var addrEl = document.getElementById('askAddr');
  if (!main || !addrEl) return;

  var dismissed = false;
  var bar = document.createElement('div');
  bar.className = 'ask-bar';
  bar.innerHTML =
    '<a href="mailto:' + addrEl.textContent.trim() + '" data-ask>' +
    '<span>Questions about this section?</span><b>Ask Amit</b></a>' +
    '<button type="button" class="ask-bar-x" aria-label="Dismiss">&times;</button>';
  document.body.appendChild(bar);
  bar.querySelector('.ask-bar-x').addEventListener('click', function () {
    bar.classList.remove('is-in');
    document.body.classList.remove('ask-bar-in');   /* let the fabs drop back */
    dismissed = true;
  });

  var ticking = false;
  function sync() {
    var r = main.getBoundingClientRect(),
        read = (-r.top + window.innerHeight) / (r.height || 1);
    /* Shows at half the article, on Amit's call 2 Sep 2026; it was three
       quarters, which on a long section put the offer so late that a reader who
       had already decided to leave never saw it.

       Dismissal lasts until the reader LEAVES the zone. Step out below the
       re-arm point and step back in, and the bar is offered again; that is the
       behaviour Amit asked for, and it is why nothing is remembered between
       pages either.

       The gap between the two numbers exists only to stop the flag flickering
       for someone resting exactly on the boundary, so it wants to be small. It
       was 0.41 against 0.50, carried over from when the bar appeared at 0.75,
       and nine points below a halfway trigger meant scrolling almost back to
       the top to re-arm. Four points is enough for the dead band and makes
       leaving and re-entering the zone feel immediate. */
    if (read < 0.46) dismissed = false;
    /* Hide only once the navigation actually reaches the band the bar occupies,
       not the moment it enters the viewport at all.

       The original test was `nav.top < innerHeight`, which is the whole screen.
       That worked in the learning world, where sections run to 2000 words and
       three quarters of the article is far above the prev/next block. It fails
       in the migration world, where a step is 350 words: there, 75% read and
       "the nav is somewhere on screen" happen at the same moment, so the bar
       was built, correctly suppressed, and never once appeared.

       Measuring against the bar's own rectangle keeps the original intent, that
       the bar must never cover the navigation, and drops the part that was only
       ever an accident of long articles. */
    var barH = bar.getBoundingClientRect().height || 56;
    var band = window.innerHeight - barH - 24;
    var navUp = stop && stop.getBoundingClientRect().top < band;
    var shown = read > 0.50 && !navUp && !dismissed;
    bar.classList.toggle('is-in', shown);
    /* The body class lifts the About mark and the page-nav button clear of the
       bar: they occupy the same corner and collide with it exactly at 390. */
    document.body.classList.toggle('ask-bar-in', shown);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(sync); }
  }, { passive: true });
  window.addEventListener('resize', sync);
  sync();
})();
