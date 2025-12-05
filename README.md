# Final-Project

Project name
---------------

Final-Project — Campus Resources (Design Program)

Description & purpose
----------------------

This repository contains a static multi-page website that presents campus resources for a design program: dining, campus map, health services, tutoring, and an events calendar. The purpose is to provide a clean, accessible informational site with a small amount of interactive functionality (client-side event loading, an interactive calendar) and local serverless function demos for development.

Technologies used
------------------

- HTML5
- CSS3 (custom `styles.css` + Bootstrap 5 via CDN)
- JavaScript (vanilla) — `script.js` contains site-wide helpers and event/calendar logic
- FullCalendar (CDN) — interactive calendar UI
- Netlify Functions (local demo) — `netlify/functions/get-events` and `add-event` for local GET/POST examples
- Git & GitHub for version control and hosting repository

Instructions — setup & local development
-------------------------------------

1. Clone the repository:

	 git clone https://github.com/brieannawilson-ai/Final-Project.git
	 cd Final-Project

2. Open the site locally:

- Option A — Static files only: open the HTML files in your browser (e.g., double-click `index.html`) or run a simple static server (recommended):
	- Python 3: `python -m http.server 8000` and visit `http://localhost:8000`.

- Option B — Local serverless functions (recommended for testing POST event creation):
	- Install Netlify CLI: `npm install -g netlify-cli`
	- Start local dev server: `netlify dev`
	- While running, use these endpoints:
		- GET events: `http://localhost:8888/.netlify/functions/get-events`
		- POST event: `http://localhost:8888/.netlify/functions/add-event` (JSON body)

3. View the interactive calendar: open `calendar.html` (or visit via local server). The calendar reads `data/events.json` by default.

Deployment
----------

- GitHub Pages (static): enable GitHub Pages in repository Settings → Pages and select the `main` branch. The site will be available at `https://<your-username>.github.io/Final-Project/`.
- Netlify (static + functions): connect the repo in Netlify for automatic deploys. Netlify will also deploy `netlify/functions` as serverless functions — note the demo functions included are intended for local use and file writes are ephemeral in production.

Overview of features & how to use them
-------------------------------------

- Consistent navigation across pages: use the navbar to open Dining, Health Services, Calendar, Campus Map, and Tutoring pages.
- Events calendar:
	- Interactive FullCalendar view on `calendar.html` (month/week/list views).
	- Events are loaded from `data/events.json` (client-side). The calendar supports clicking an event to open a prefilled Google Calendar creation page.
	- A simple local POST endpoint (`add-event`) is available when running `netlify dev` to append events for local testing.
- Images: stored in the `images/` folder and used across pages. Add or replace images there.

Potential future improvements / stretch goals
-------------------------------------------

- Persistent backend for events (Supabase / Firebase / PostgreSQL) so events survive redeploys.
- Authentication + admin UI for creating and managing events.
- Recurring events support (RRULE) and timezone-aware event handling.
- Improve accessibility (ARIA attributes, keyboard navigation, contrast testing) and run automated audits.
- Add image lightbox/gallery for dining and campus photos.
- Automated tests (unit tests for small JS helpers, and end-to-end smoke tests for pages).

Contact & contribution
----------------------

If you want help extending the project (deploying functions, wiring a DB, auth), open an issue or a PR. The repository includes commit history; feel free to fork and experiment.
