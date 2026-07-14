# Template: Dashboard

Admin dashboard with sidebar, stats, and data tables

## What's already built and wired (do NOT rebuild it)

This is a working admin dashboard scaffold with a live mock API. Build on top of it — don't replace the wiring.

What's wired:
- server.js — Express + /api routes mounted.
- lib/mock-data.js — seeded-random generators for stats, a 30-day activity series, and a 47-row user list (deterministic per day).
- routes/api.js — GET /api/stats, /api/activity, /api/users (paginated, sortable).
- public/index.html — sidebar + topbar layout, stat grid, Chart.js area chart (CDN, no install), sortable paginated users table.
- public/app.js — fetches /api/*, renders, handles sort + pagination + filter.

To wire real data, swap the functions in routes/api.js — the frontend just needs the same JSON shapes back. Don't add npm chart libs (Chart.js is CDN).

This starter already boots, is pre-installed, and looks polished. Make the SMALLEST brand/copy edit the user asked for (usually just public/index.html and mock-data.js — product name, metric labels, colors). Do NOT rewrite sections they didn't mention, do NOT read files you aren't editing, and do NOT npm install or smoke-test a copy/brand edit — it already runs.

## Suggested features

- Collapsible sidebar
- Stats cards
- Sortable data table
- Charts
- Activity feed
- Search

---

This starter already boots and is pre-installed — it is NOT a placeholder to replace. Follow the "what's already built" guidance above.

Do NOT deploy on your own initiative. Your FIRST real build publishes automatically once you commit it (the platform posts the live link) — end that turn with: "Changes saved — publishing your first version now." After that first publish, the user ships: they tap the Deploy button (play icon in the chat header), or they ask you outright to deploy — then do it per TOOLS.md §Deploy. End later build turns with: "Changes saved. Tap the play button to review and deploy — or just tell me to deploy."
