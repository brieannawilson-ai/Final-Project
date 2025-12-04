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
                try {
                  // Build a Google Calendar creation URL and open in a new tab
                  var evObj = {
                    title: e.title,
                    date: e.start ? e.start.toISOString().slice(0,10) : null,
                    time: e.start ? (e.start.getHours().toString().padStart(2,'0') + ':' + e.start.getMinutes().toString().padStart(2,'0')) : '',
                    allDay: e.allDay,
                    location: (e.extendedProps && e.extendedProps.location) || '',
                    description: e.extendedProps && e.extendedProps.description ? e.extendedProps.description : ''
                  };
                  var href = buildGCalUrlFromEvent(evObj, e.start, e.end);
                  window.open(href, '_blank', 'noopener');
                } catch (err) {
                  console.warn('Failed to open Google Calendar link', err);
                  // fallback to basic alert
                  var when = e.start ? e.start.toLocaleString() : '';
                  var loc = e.extendedProps && e.extendedProps.location ? '\nLocation: ' + e.extendedProps.location : '';
                  alert(e.title + '\n' + when + loc);
                }
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

  // Helper: build a Google Calendar URL for creating a new event
  function buildGCalUrlFromEvent(ev, fcStartDate, fcEndDate) {
    // ev may have .date (YYYY-MM-DD), .time (HH:MM), .allDay, .title, .location, .description
    var title = encodeURIComponent(ev.title || 'Event');
    var details = encodeURIComponent(ev.description || '');
    var location = encodeURIComponent(ev.location || '');

    // Determine start/end strings for Google Calendar
    // If FullCalendar provided Date objects (fcStartDate/fcEndDate) prefer them
    var toGCalDateTime = function(d) {
      // Format as YYYYMMDDTHHMMSSZ in UTC
      var y = d.getUTCFullYear();
      var m = String(d.getUTCMonth() + 1).padStart(2, '0');
      var day = String(d.getUTCDate()).padStart(2, '0');
      var hh = String(d.getUTCHours()).padStart(2, '0');
      var mm = String(d.getUTCMinutes()).padStart(2, '0');
      var ss = String(d.getUTCSeconds()).padStart(2, '0');
      return '' + y + m + day + 'T' + hh + mm + ss + 'Z';
    };

    var startStr = '';
    var endStr = '';

    if (fcStartDate) {
      // Use provided Date objects
      startStr = toGCalDateTime(new Date(fcStartDate));
      if (fcEndDate) {
        endStr = toGCalDateTime(new Date(fcEndDate));
      } else {
        // default duration 1 hour for timed events, or next day for allDay
        if (ev.allDay) {
          var s = new Date(fcStartDate);
          var e = new Date(s);
          e.setDate(e.getDate() + 1);
          startStr = '' + s.getUTCFullYear() + String(s.getUTCMonth() + 1).padStart(2, '0') + String(s.getUTCDate()).padStart(2, '0');
          endStr = '' + e.getUTCFullYear() + String(e.getUTCMonth() + 1).padStart(2, '0') + String(e.getUTCDate()).padStart(2, '0');
        } else {
          var s2 = new Date(fcStartDate);
          var e2 = new Date(s2);
          e2.setHours(e2.getHours() + 1);
          endStr = toGCalDateTime(e2);
        }
      }
    } else if (ev.date) {
      // ev.date is YYYY-MM-DD
      if (ev.time && ev.time.trim()) {
        // combine date and time as local time then convert to UTC string
        var parts = ev.date.split('-');
        var dt = new Date(parts[0], parts[1] - 1, parts[2]);
        var tparts = ev.time.split(':');
        dt.setHours(parseInt(tparts[0], 10) || 0, parseInt(tparts[1], 10) || 0, 0, 0);
        startStr = toGCalDateTime(dt);
        var dtEnd = new Date(dt);
        dtEnd.setHours(dtEnd.getHours() + 1);
        endStr = toGCalDateTime(dtEnd);
      } else {
        // all-day event: Google uses YYYYMMDD/YYYYMMDD (end is non-inclusive)
        var d = ev.date.split('-');
        var y = d[0], mo = d[1], da = d[2];
        startStr = '' + y + mo + da;
        // compute next day
        var dd = new Date(parseInt(y,10), parseInt(mo,10)-1, parseInt(da,10));
        dd.setDate(dd.getDate() + 1);
        var y2 = dd.getFullYear();
        var m2 = String(dd.getMonth() + 1).padStart(2,'0');
        var d2 = String(dd.getDate()).padStart(2,'0');
        endStr = '' + y2 + m2 + d2;
      }
    }

    var datesParam = '';
    if (startStr && endStr) {
      datesParam = startStr + '/' + endStr;
    } else if (startStr) {
      datesParam = startStr + '/' + startStr;
    }

    var base = 'https://www.google.com/calendar/render?action=TEMPLATE';
    var parts = [];
    parts.push('text=' + title);
    if (datesParam) parts.push('dates=' + datesParam);
    if (details) parts.push('details=' + details);
    if (location) parts.push('location=' + location);

    return base + '&' + parts.join('&');
  }


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
        // Text node for the event description
        var textNode = document.createTextNode(date + time + ' — ' + title + location);
        li.appendChild(textNode);

        // Create Google Calendar "Add" link
        try {
          var gcalHref = buildGCalUrlFromEvent(ev);
          var a = document.createElement('a');
          a.href = gcalHref;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'ms-2 btn btn-sm btn-outline-primary';
          a.textContent = 'Add to Google Calendar';
          li.appendChild(a);
        } catch (e) {
          // ignore link creation errors
        }

        container.appendChild(li);
      });
    })
    .catch(function(err) {
      console.warn('Failed to load events:', err);
      if (container) container.innerHTML = '<li class="text-muted">Could not load events.</li>';
    });
});
