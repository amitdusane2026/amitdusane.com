/* Behaviour that belongs to the global header itself, on every page of every
   world.

   Only the theme toggle lives here, and it is here because both worlds had
   byte-identical implementations of it bound to different button ids. That is
   the definition of something that should be shared.

   The menu button and the print button deliberately stay with each world, even
   though the markup is now common. They are not the same behaviour wearing two
   names: the two worlds have different drawers (`nav-open` against `lnav-open`)
   and build different print documents. Each world binds to the shared ids from
   its own script.

   Search is handled by search.js, which the header shares too. */
(function () {
  var docEl = document.documentElement;
  var btn = document.getElementById('siteThemeBtn');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var t = docEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    docEl.setAttribute('data-theme', t);
    docEl.style.colorScheme = t;
    /* The pre-paint script in head.html reads this back on the next load, so
       the theme survives navigation without a flash. */
    try { localStorage.setItem('site-theme', t); } catch (e) {}
  });
})();
