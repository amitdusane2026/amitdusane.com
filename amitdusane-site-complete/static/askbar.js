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
  /* Off before the end of the article arrives, so the bar never covers it.
     Keyed to the element rather than to a scroll percentage on purpose: the
     block is a fixed height inside articles that vary by a thousand words, so
     a percentage tuned to clear it on a long piece fires far too early on a
     short one.

     THE FIRST END BLOCK, not the navigation. A comma list resolves in document
     order, so this picks whichever of them a page happens to open its ending
     with: the Adobe screen path where the section has one, the Adobe links or
     the prev/next where it does not, and the step navigation in the migration
     world. Aiming at the navigation alone left the bar sitting over the Adobe
     links and the screen path, which are just as much "the reader has finished"
     as the navigation is. */
  var stop = document.querySelector('.path-box, .ref-box, .lpn, .stepnav');
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
     is working. A migration step is 350 words, so that world shows at half.

     LEARNING MOVED 0.75 -> 0.60 on 2 Sep 2026, and only because the lead-out
     below moved first. Three quarters was Amit's own number, set on 1 Sep after
     a week of living with it, and nothing about it was wrong. But leaving the
     article early enough to clear its ending costs the bar the whole tail of
     the read: measured on a section, 0.75 with the new lead-out left it visible
     for 918px of a 6525px scroll, about one screen. 0.60 restores 2006px. The
     show point is paying back what the fix costs rather than loosening a rule.

     Dismissal lasts until the reader LEAVES the zone. Step out below the re-arm
     point and step back in, and the bar is offered again; nothing is remembered
     between pages, because the offer carries this section's title and so is a
     different offer on every page.

     The dead band between the two numbers exists only to stop the flag
     flickering for a reader resting exactly on the boundary. Nine points below
     the trigger in the learning world, four in migration, where nine would mean
     scrolling almost back to the top to re-arm. */
  var LEARNING = document.body.classList.contains('world-learning'),
      SHOW   = LEARNING ? 0.60 : 0.50,
      REARM  = LEARNING ? 0.51 : 0.46;

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

  /* THE LEAD-OUT: how far ahead of the ending the bar gets out of the way.
     One number for both worlds, which is worth stating because the show
     threshold above is not. Measured on the shortest migration step, the one
     most at risk of the bar never appearing at all: 140px still leaves it
     visible across half the scroll range, and it leaves a learning section
     around 2000px. There is no length in the corpus where this squeezes it. */
  var LEAD = 140;

  /* TWO WAYS TO ANSWER ONE QUESTION, and they agree by construction: is the end
     block within LEAD of the bottom of the screen. The arithmetic below is the
     definition; the observer further down is the same test with the browser
     supplying both terms instead of us.

     The observer is authoritative once it has spoken, and null until then, so a
     browser without IntersectionObserver and the first paint before it reports
     both fall through to the arithmetic rather than to a wrong answer. Ordering
     them this way is also what makes the behaviour testable: an observer
     delivers nothing at all to a hidden page, so a suite that measures the bar
     off-screen would otherwise be measuring a frozen flag. */
  var ioNear = null;
  function endNear() {
    if (!stop) return false;
    if (ioNear !== null) return ioNear;
    return stop.getBoundingClientRect().top < (window.innerHeight + LEAD);
  }

  var ticking = false;
  function sync() {
    var r = main.getBoundingClientRect(),
        read = (-r.top + window.innerHeight) / (r.height || 1);
    if (read < REARM) dismissed = false;
    var shown = read > SHOW && !endNear() && !dismissed;
    bar.classList.toggle('is-in', shown);
    /* The body class lifts the About mark and the page-nav button clear of the
       bar: they occupy the same corner and collide with it exactly at 390. */
    document.body.classList.toggle('ask-bar-in', shown);
    ticking = false;
  }

  /* WHY THE BROWSER DOES THIS ARITHMETIC AND NOT US. The old test measured the
     end block against `window.innerHeight` minus the bar's own height. Both
     terms are unreliable on a phone: innerHeight moves as the address bar
     collapses and expands, and a position:fixed bottom element does not always
     land where that number says it will. Reported by readers on real handsets,
     and reproducible in an emulator even with a steady viewport -- the bar hid
     only once the navigation's top had risen within 78px of the screen bottom,
     so up to 54px of it emerged from behind the bar first.

     An observer removes both terms. The browser computes the intersection
     against the real viewport and recomputes it when that viewport changes, so
     a toolbar sliding in or out is handled without a resize event firing.

     isIntersecting is the wrong flag to read. Scroll past the end block far
     enough and it leaves the viewport entirely, isIntersecting goes false, and
     the bar would return on top of the navigation -- the exact bug, restored at
     the exact moment it matters. `top < rootBounds.bottom` stays true once the
     block is above the fold and is just as much the browser's own number, since
     rootBounds already carries the margin below. */
  if (stop && window.IntersectionObserver) {
    new IntersectionObserver(function (entries) {
      var e = entries[entries.length - 1];
      if (e.rootBounds) ioNear = e.boundingClientRect.top < e.rootBounds.bottom;
      sync();   /* directly, never through rAF: see the scroll handler below */
    }, { rootMargin: '0px 0px ' + LEAD + 'px 0px' }).observe(stop);
  }

  /* rAF coalesces scroll work, and it does not run while the page is hidden.
     That is correct for a bar nobody is looking at, but it means the observer
     above must call sync itself rather than queue a frame that may never come. */
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(sync); }
  }, { passive: true });
  window.addEventListener('resize', sync);
  sync();
})();
