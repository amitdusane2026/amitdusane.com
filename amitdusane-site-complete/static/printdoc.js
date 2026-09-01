/* Filling the print document. Global.

   The two worlds keep the article in different places, which is the only thing
   that ever differed between their print builders:
     learning    .lcontent      title in .lsec-title
     migration   .view.active   title in h1

   Everything else was duplicated: copy the article into #printBody, put the
   page title in the running header, force the images eager, and print once they
   have decoded. So it is one function now, asked where the article is rather
   than told which world it is in.

   Both entry points matter. The button is the obvious one; the beforeprint
   listener is not optional, because Ctrl/Cmd+P and the browser's own menu never
   touch the button and would otherwise print a header-only sheet. */
(function () {
  var body = document.getElementById('printBody');
  if (!body) return;

  function article() {
    return document.querySelector('.lcontent') ||
           document.querySelector('.main .view.active') ||
           document.querySelector('.main');
  }
  function heading(src) {
    var h = src.querySelector('.lsec-title') || src.querySelector('h1');
    return h ? h.textContent : '';
  }

  function fill() {
    var src = article();
    if (!src) return;
    body.innerHTML = src.innerHTML;
    /* Lazy images never load inside a display:none subtree, because they never
       enter a viewport, so a print taken from the clone shows blank frames.
       Every copy is forced eager. */
    var imgs = body.querySelectorAll('img');
    Array.prototype.forEach.call(imgs, function (img) { img.setAttribute('loading', 'eager'); });
    var ctx = document.getElementById('printCtx');
    if (ctx) ctx.textContent = heading(src);
  }

  var btn = document.getElementById('sitePrintBtn');
  if (btn) btn.addEventListener('click', function () {
    fill();
    /* Wait for the cloned images before handing over to the dialog, or the
       snapshot is taken while they are still decoding. The timeout is the
       backstop: a broken image that never fires either event must not leave
       the reader with a button that silently does nothing. */
    var pending = [].slice.call(body.querySelectorAll('img')).filter(function (i) { return !i.complete; });
    if (!pending.length) { window.print(); return; }
    var done = 0, fired = false;
    function go() { if (!fired) { fired = true; window.print(); } }
    pending.forEach(function (i) {
      function tick() { if (++done === pending.length) go(); }
      i.addEventListener('load', tick, { once: true });
      i.addEventListener('error', tick, { once: true });
    });
    setTimeout(go, 2500);
  });

  window.addEventListener('beforeprint', fill);
})();
