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

// FullCalendar initialization for an interactive calendar on `calendar.html`
ready(function initFullCalendar() {
  var calendarEl = document.getElementById('calendar');
  if (!calendarEl) return; // only run on calendar page

  // Load events from the same JSON source and map to FullCalendar format
  fetch('data/events.json')
    .then(function(res) {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(function(events) {
      var fcEvents = (Array.isArray(events) ? events : []).map(function(ev) {
        // If a time is provided, combine date and time into an ISO datetime
        var start = ev.date || null;
        if (ev.time && ev.time.trim()) {
          // assume time like "14:00" — attach to date
          // FullCalendar accepts YYYY-MM-DDTHH:MM:SS or YYYY-MM-DDTHH:MM
          start = (ev.date || '') + 'T' + ev.time;
        }

        return {
          id: ev.id || undefined,
          title: ev.title || 'Untitled',
          start: start,
          allDay: !!ev.allDay || !ev.time || ev.time === '',
          extendedProps: {
            location: ev.location || ''
          }
        };
      });

      // Create FullCalendar instance
      try {
        var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridMonth',
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,listWeek'
          },
          events: fcEvents,
          eventClick: function(info) {
            var e = info.event;
            var when = e.start ? e.start.toLocaleString() : '';
            var loc = e.extendedProps && e.extendedProps.location ? '\nLocation: ' + e.extendedProps.location : '';
            // Simple details popup — you can replace with a Bootstrap modal if you prefer
            alert(e.title + '\n' + when + loc);
          }
        });

        calendar.render();
      } catch (err) {
        console.warn('FullCalendar failed to initialize', err);
        calendarEl.innerHTML = '<p class="text-muted">Interactive calendar failed to load.</p>';
      }
    })
    .catch(function(err) {
      console.warn('Failed to load events for FullCalendar:', err);
      calendarEl.innerHTML = '<p class="text-muted">Could not load calendar events.</p>';
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
