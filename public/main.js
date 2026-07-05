// Maestro landing — progressive enhancement only.
// (1) copy-to-clipboard  (2) scroll-reveal. No libs. Content works without this file.
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  // ---- Copy-to-clipboard ----
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for non-secure contexts (e.g. opened via file://)
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy') ? resolve() : reject();
      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  var copyStatus = document.getElementById('copy-status');
  function announce(msg) {
    if (copyStatus) copyStatus.textContent = msg;
  }

  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sel = btn.getAttribute('data-copy-target');
      var target = sel && document.querySelector(sel);
      if (!target) return;
      var text = target.innerText.trim();
      var label = btn.querySelector('.copy-label');
      var original = label ? label.textContent : '';
      copyText(text).then(function () {
        if (label) label.textContent = 'Copied';
        btn.setAttribute('aria-label', 'Copied to clipboard');
        announce('Copied to clipboard');
        setTimeout(function () {
          if (label) label.textContent = original;
          btn.setAttribute('aria-label', 'Copy to clipboard');
        }, 1800);
      }).catch(function () {
        if (label) label.textContent = 'Press Ctrl+C';
        announce('Press Ctrl+C to copy');
        setTimeout(function () { if (label) label.textContent = original; }, 1800);
      });
    });
  });

  // ---- Scroll reveal (only when motion is welcome) ----
  var motionOK = window.matchMedia && window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  var revealables = document.querySelectorAll('.reveal');
  if (motionOK && 'IntersectionObserver' in window && revealables.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  }
})();
