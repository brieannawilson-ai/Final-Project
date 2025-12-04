# Local serverless demo (Netlify Functions)

This project includes a local-only serverless demo you can run with Netlify CLI. The functions are intended for local development and testing only.

Files added:

- `netlify/functions/get-events.js` — GET endpoint that reads `data/events.json` and returns it.
- `netlify/functions/add-event.js` — POST endpoint that accepts a JSON body and appends an event to `data/events.json` (local/ephemeral).
- `netlify.toml` — config to point Netlify CLI to the functions folder for local development.

Why local only?
- These functions read and write `./data/events.json`. While `netlify dev` supports this locally, writes are ephemeral when deployed to serverless hosts. Use a real database (Supabase, Firebase, etc.) for production persistence.

Run locally (quick):

1. Install Netlify CLI if you don't have it:

```bash
npm install -g netlify-cli
```

2. From the project root run:

```bash
netlify dev
```

3. Endpoints (local):

- GET  http://localhost:8888/.netlify/functions/get-events
- POST http://localhost:8888/.netlify/functions/add-event

Example POST JSON body:

```json
{
  "title": "Study Group",
  "date": "2025-12-15",
  "time": "14:00",
  "location": "Library Room 101"
}
```

Notes:
- The POST endpoint will try to write to `data/events.json` and this will be visible while `netlify dev` is running locally. On real serverless platforms writes to the project filesystem are ephemeral and do not survive redeploys.
- If you'd like persistent storage, I can help wire this up to Supabase/Firebase/Postgres.
