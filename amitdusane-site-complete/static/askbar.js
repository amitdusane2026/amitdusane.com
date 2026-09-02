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

   Per-world wiring is three questions, answered by whichever selector matches:
     is this page eligible at all   see the learning-world guard below
     what am I measuring            the article container
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

  /* THE LEARNING WORLD OFFERS THE BAR ON SECTIONS ONLY, and .section is what
     says so: it wraps a lesson article and it is absent from all 26 module and
     category landings and from the world root.

     This used to be free. The bar lived inside world-learning.js's spine, which
     returns early without .section, so a landing never reached the code that
     builds it. Lifting the bar out on 2 Sep 2026 left that condition behind and
     the bar started arriving on landings, which is wrong for the reason the
     landings themselves exist: a landing is two paragraphs of signposting, so
     "Questions about this section?" is offered to somebody who has not been
     told anything yet, over the very links they came to click.

     Learning-world only. The migration world answers the same question from a
     body class instead, immediately below. */
  if (document.body.classList.contains('world-learning') &&
      !document.querySelector('.section')) return;

  /* THE MIGRATION WORLD OFFERS THE BAR ON STEPS AND KB TOPICS ONLY, and it
     needs a server-side answer rather than a DOM probe: its front page, its KB
     index and its references page all render the same `.main` wrapper a step
     does, so there is nothing in the markup to separate them. baseof.html adds
     `asks` to the body on exactly the two page types that are real articles.

     Narrowed 2 Sep 2026 on Amit's call. The bar had been appearing on the
     front page, the KB index and the references list, which are a router, a
     card grid and a bibliography -- none of them something a reader finishes
     with a question about the section they just read. */
  if (document.body.classList.contains('world-migration') &&
      !document.body.classList.contains('asks')) return;

  /* WHERE IN THE READ THE BAR ARRIVES, and it is per-world because the two
     worlds are different lengths. A learning section runs to 2000 words, so
     half of it is still mid-explanation and the offer intrudes on somebody who
     is working; three quarters is roughly where a question has actually formed.
     Amit's call on 1 Sep 2026, after a week of living with it. A migration step
     is 350 words and three quarters lands on top of the prev/next block, so
     that world shows at half.

     Dismissal lasts until the reader LEAVES the zone. Step out below the re-arm
     point and step back in, and the bar is offered again; nothing is remembered
     between pages, because the offer carries this section's title and so is a
     different offer on every page.

     The dead band between the two numbers exists only to stop the flag
     flickering for a reader resting exactly on the boundary. Nine points is
     right below a 0.75 trigger; four is right below 0.50, where nine would mean
     scrolling almost back to the top to re-arm. */
  var LEARNING = document.body.classList.contains('world-learning'),
      SHOW   = LEARNING ? 0.75 : 0.50,
      REARM  = LEARNING ? 0.66 : 0.46;

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
    if (read < REARM) dismissed = false;
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
    var shown = read > SHOW && !navUp && !dismissed;
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
