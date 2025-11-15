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

// Client-side events loader (fetches data/events.json and renders into #events-list)
ready(function loadEvents() {
  var container = document.getElementById('events-list');
  if (!container) return; // nothing to render

  fetch('data/events.json')
    .then(function(res) {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(function(events) {
      if (!Array.isArray(events)) return;
      container.innerHTML = '';
      events.forEach(function(ev) {
        var li = document.createElement('li');
        li.className = 'mb-2';
        var date = ev.date ? new Date(ev.date).toLocaleDateString() : '';
        var time = ev.time ? ' ' + ev.time : '';
        var title = ev.title || '';
        var location = ev.location ? ' (' + ev.location + ')' : '';
        li.textContent = date + time + ' — ' + title + location;
        container.appendChild(li);
      });
    })
    .catch(function(err) {
      console.warn('Failed to load events:', err);
      if (container) container.innerHTML = '<li class="text-muted">Could not load events.</li>';
    });
});
