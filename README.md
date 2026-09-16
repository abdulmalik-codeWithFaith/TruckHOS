

```markdown
# TruckHOS — Frontend

React + Vite + TypeScript frontend for TruckHOS, a truck trip planner and
Hours-of-Service (HOS) / ELD log generator. Built as part of a Full Stack
Developer hiring assessment.

**Live app:** https://truck-hos.vercel.app
**Backend repo:** https://github.com/abdulmalik-codeWithFaith/truck-hos-planner-backend

## What it does

Takes a driver's current location, pickup location, dropoff location, and
current 70-hour/8-day cycle usage, sends it to the TruckHOS backend API,
and renders the result:

- An interactive route map (OpenStreetMap via Leaflet) with distinct icons
  for current location, pickup, dropoff, fuel stops, and rest stops
- A trip summary (distance, driving hours, estimated duration, cycle hours
  remaining)
- A day-by-day trip timeline
- Visual ELD daily log sheets — a real 24-hour duty-status graph generated
  from the backend's schedule, with day tabs for multi-day trips

The ELD grid, timeline, and map all render directly from the same
`schedule` array returned by the backend — nothing is recalculated on the
frontend, so they can never disagree with each other.

## Tech stack

- React 18 + Vite + TypeScript
- React Leaflet (map) over OpenStreetMap's standard tile server
  (`tile.openstreetmap.org`) — free, no API key required
- Framer Motion (animation)
- Axios (API calls)
- Lucide React (icons)

## Project structure

```
src/
├── components/       Header, TripForm, RouteMap, StopList, TripTimeline,
│                     ELDLogViewer, EldGrid, RouteMotif
├── pages/             ResultsPage
├── services/           api.ts — calls the Django backend
├── types/               trip.ts — shared API response shape
└── utils/                dutyStatus.ts — ELD grid math (duty-status rows,
                          midnight-clipping for multi-day events)
```

## Local setup

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`. Requires the backend running separately
(see the backend repo) or pointed at the deployed backend via the env var
below.

## Environment variables

Create `.env` in the project root:

```
VITE_API_BASE_URL=http://localhost:8000
```

For production (Vercel), set this to the deployed backend URL instead:

```
VITE_API_BASE_URL=https://truck-hos-planner-backend.onrender.com
```

Vite bakes environment variables into the build at build time — changing
this value requires a redeploy, not just a page refresh.

## Deployment

Deployed to Vercel. Framework preset: Vite (auto-detected). No special
root directory needed since this repo only contains the frontend.

## Responsive design notes

- The results page (trip summary, map, stops, timeline, ELD logs) is fully
  responsive down to mobile widths.
- The route map uses a horizontally scrollable container on narrow
  screens (rather than shrinking the map itself), since compressing a
  cross-country route into a very narrow viewport makes it unreadable —
  swiping/dragging reveals the full route, consistent with how embedded
  maps commonly behave on mobile.
- The ELD 24-hour duty-status grid similarly scrolls horizontally within
  its own card on narrow screens, since a full day's timeline needs more
  width than a phone screen offers to stay legible.

## Notes

- Render's free tier spins down after inactivity — the first request after
  idle time can take 30–60 seconds while the backend wakes up. This is
  expected, not a bug.
- The backend enforces CORS; only origins listed in its
  `CORS_EXTRA_ORIGINS` environment variable can call the API.
- If map tiles ever fail to load, this is most commonly OpenStreetMap's
  tile server being transiently slow/rate-limited for the visitor's
  network, not an application bug — the map's markers, route line, and
  interactivity still function independently of tile image loading.
```