// script.js — site-wide JavaScript
// Small utilities used across the static pages.

// Log to confirm the file is loaded
console.log('script.js loaded');

// DOM ready helper
function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

// Example: toggles a `.show` class on bootstrap-like collapse targets when the navbar toggler is clicked
ready(function() {
  var togglers = document.querySelectorAll('.navbar-toggler');
  togglers.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var selector = btn.getAttribute('data-bs-target') || btn.getAttribute('data-target');
      if (!selector) return;
      var target = document.querySelector(selector);
      if (!target) return;
      target.classList.toggle('show');
    });
  });
});

// Small helper to set an "active" class on nav links based on the current path (useful if server doesn't set it)
ready(function() {
  try {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('a.nav-link');
    links.forEach(function(a) {
      var href = (a.getAttribute('href') || '').split('/').pop();
      if (href === path) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  } catch (e) {
    console.warn('Nav active helper failed', e);
  }
});
