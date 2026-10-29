# Ayush Kumar · Portfolio

A DevOps portfolio that presents itself as a pipeline run. Each page section is a CI job: the sidebar (or the run bar on smaller screens) shows jobs going from queued to running to passed as you scroll, and the run is "deployed" when you reach the end. Light theme by default, with an animated switch to dark.

```
frontend/   Next.js 16 (App Router, TypeScript): all UI and content
backend/    Python FastAPI: contact inbox, résumé download, health/status
```

## Editing content

All page content lives in one constants file: **`frontend/src/data/portfolio.ts`**. Edit it and the page updates; no database is involved. Its shape is typed in `frontend/src/lib/types.ts`.

- Featured projects use `featured_projects`. Other projects use `projects`, and each project's `cats` value decides which filter chips it appears under.
- Status values: `prod` (green), `wip` (amber), `poc` (violet).
- To replace the résumé, put the new PDF at `backend/static/Ayush_Kumar_DevOps_Engineer_Resume.pdf`.

## Tech icons

Logos for skills and tags are SVGs in `frontend/public/tech/`, mapped to labels in `frontend/src/lib/tech.ts` (first matching rule wins). They render as CSS masks, so each takes its brand colour in both themes. To add one, add a rule in `tech.ts`; if it needs a new SVG, add the slug to `frontend/scripts/build-icons.mjs` and run:

```bash
cd frontend
npm i --no-save simple-icons devicon
node scripts/build-icons.mjs
```

## Backend endpoints

| Route | Purpose |
| --- | --- |
| `GET /api/health` | Liveness and checks |
| `GET /api/status` | Uptime, request count and p50/p95 latency |
| `POST /api/contact` | Validates a message, rate-limits to 3 per IP per 10 min, appends it to `backend/data/messages.jsonl` |
| `GET /api/resume` | Résumé PDF |

The browser only talks to the Next.js origin. Next rewrites `/api/*` to `BACKEND_URL` (default `http://127.0.0.1:8000`).

## Run locally

Backend:

```bash
cd backend
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt   # macOS/Linux: .venv/bin/python
.venv/Scripts/python -m uvicorn app.main:app --port 8000 --reload
```

Frontend (in a second terminal):

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000.

## Production

```bash
cd frontend && npm run build && npm start
```

Run the API with `uvicorn app.main:app --host 0.0.0.0 --port 8000` behind NGINX, and set `BACKEND_URL` for the frontend and `CORS_ORIGINS` for the backend.
