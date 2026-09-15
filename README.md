# TruckHOS — Truck Trip Planner & ELD Log Generator

A full-stack application that plans a truck driver's trip — current location,
pickup, and dropoff — and generates a compliant Hours-of-Service (HOS)
schedule along with daily ELD (Electronic Logging Device) log sheets,
drawn from the same schedule used to plan the route.

Built as a Full Stack Developer hiring assessment.

## Assessment objective

Given a driver's current location, pickup location, dropoff location, and
current 70-hour/8-day cycle usage, the application:

1. Calculates a real driving route between all three points.
2. Builds a chronological trip schedule that respects the FMCSA
   property-carrying-driver Hours-of-Service rules.
3. Inserts fuel stops (~every 1,000 miles), a 1-hour pickup, and a 1-hour
   dropoff into that schedule.
4. Generates one ELD daily log per calendar day the trip spans, each drawn
   as a visual 24-hour duty-status grid — not just a table of totals.
5. Displays the route, stops, and schedule on an interactive map and
   timeline.

Accuracy of the HOS/ELD calculation is the primary grading criterion, ahead
of UI polish, per the assessment brief.

## Features

- Trip planning form with client- and server-side validation
- Real road routing and geocoding (free, open-data services — see below)
- HOS-compliant scheduling: 11-hour driving limit, 14-hour on-duty window,
  30-minute break after 8 cumulative driving hours, 10-hour rest, 70-hour/
  8-day cycle tracking, and automatic 34-hour restart if the cycle is
  exhausted mid-trip
- Fuel stops generated automatically at ~1,000-mile intervals
- 1-hour pickup and 1-hour dropoff events
- Interactive route map (OpenStreetMap/Leaflet) with distinct icons for
  current location, pickup, dropoff, fuel, and rest stops
- Day-by-day trip timeline
- Visual ELD daily log grid — a real stepped duty-status line generated
  from the schedule, including correct handling of rest periods that span
  midnight across two calendar days
- Friendly error handling for invalid locations, unreachable routes,
  out-of-range cycle hours, and service outages

## Tech stack

**Frontend**
- React + Vite + TypeScript
- React Leaflet (map) over OpenStreetMap tiles
- Framer Motion (animation)
- Axios (API calls)
- Lucide React (icons)

**Backend**
- Python + Django + Django REST Framework
- Photon (OpenStreetMap-based) for geocoding
- OSRM (Open Source Routing Machine) for route calculation
- SQLite (default Django database — no complex data layer needed for this
  assessment's stateless calculation)

No authentication, payments, or account system — out of scope per the
assessment brief.

## Architecture

```
truck-hos-planner/
├── frontend/                  React + Vite + TypeScript
│   └── src/
│       ├── components/         Header, TripForm, RouteMap, StopList,
│       │                       TripTimeline, ELDLogViewer, EldGrid, ...
│       ├── pages/               ResultsPage
│       ├── services/            api.ts (calls the Django backend)
│       ├── types/                trip.ts (shared response shape)
│       └── utils/                dutyStatus.ts (ELD grid math)
│
└── backend/                    Django + DRF
    └── trips/
        ├── models.py             Optional Trip record (stateless calc)
        ├── serializers.py         Request validation
        ├── views.py                POST /api/trips/plan/
        ├── urls.py
        ├── services/
        │   ├── routing.py          Geocoding + OSRM routing
        │   ├── hos_engine.py       Pure HOS rules state machine
        │   ├── scheduler.py         Combines route + HOS + stops
        │   └── eld_generator.py     Schedule -> daily ELD logs
        └── tests/                   Automated test suite
```

The backend scheduler is the single source of truth: it produces one
chronological event list. The ELD generator only splits and aggregates
that same list by calendar date — it never recalculates HOS logic
independently. The frontend renders exactly what the backend returns; it
does not recompute the ELD grid from scratch, so the map, timeline, and
ELD logs can never disagree with each other.

## HOS rules implemented

| Rule | Limit |
|---|---|
| Max driving per period | 11 hours |
| On-duty window | 14 hours from start of shift |
| Required break | 30 minutes after 8 cumulative hours of driving |
| Required rest | 10 consecutive hours off duty |
| Cycle limit | 70 hours / 8 days |
| Cycle restart | 34 consecutive hours off duty fully restores the 70-hour cycle |

Implemented in `backend/trips/services/hos_engine.py` as a pure, immutable
state machine (`DriverState` + functions that advance it), independently
testable from the routing and scheduling logic.

## Known implementation assumptions

The assessment intentionally leaves some details unspecified. Rather than
inventing silent behavior, these are the explicit choices made and why:

- **Trip start time**: the trip is assumed to begin at the moment the plan
  is generated, since the assessment doesn't specify a planned departure
  time.
- **Average driving speed**: derived per route leg from OSRM's own
  distance/duration estimate (`distance / duration`), rather than an
  invented flat speed — OSRM already accounts for road type and posted
  limits along the real route.
- **Fuel stop duration**: 30 minutes, a documented, configurable constant
  (`FUEL_STOP_DURATION_HOURS` in `scheduler.py`) — the assessment does not
  specify a duration.
- **Fuel stop placement**: triggered at the next natural stopping point at
  or shortly after each 1,000-mile threshold, rather than forcing an
  awkward mid-drive split.
- **Intermediate stop coordinates**: fuel and mid-route rest stops are
  linearly interpolated between the surrounding waypoints and labeled
  generically by mile marker, rather than reverse-geocoded to a named
  place — reverse geocoding every interpolated stop was out of scope for
  the time budget. The map's route *line* still uses real OSRM road
  geometry; only stop *pin* placement is interpolated.
- **Sleeper-berth splits**: only full, consolidated 10-hour rests and
  34-hour restarts are modeled. The FMCSA sleeper-berth split provision
  (e.g. an 8/2 split) is out of scope.
- **70-hour/8-day cycle recovery**: modeled as a simple running total that
  depletes during the trip and is fully restored only by a 34-hour
  restart. The rolling recovery of hours that age out past 8 days (a full
  recalculation of the trailing 8-day window) is out of scope.
- **Geocoding provider**: Photon (Komoot) was used instead of Nominatim's
  public server after testing showed Nominatim intermittently stalls on
  scripted requests. Both are free, OpenStreetMap-based services — this is
  an implementation choice, not a change to the open-data requirement.

## Local setup

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate      # Windows Git Bash
# or: source venv/bin/activate    # macOS/Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### Environment variables

**`frontend/.env`**
```
VITE_API_BASE_URL=http://localhost:8000
```

Update this to the deployed backend URL in production.

## API

### `POST /api/trips/plan/`

**Request**
```json
{
  "current_location": "Chicago, IL",
  "pickup_location": "Denver, CO",
  "dropoff_location": "Los Angeles, CA",
  "current_cycle_used": 30
}
```

**Response**
```json
{
  "trip": {
    "distance_miles": 2022.0,
    "driving_hours": 35.61,
    "estimated_days": 4,
    "cycle_hours_remaining": 0.39
  },
  "route": { "coordinates": [[lng, lat], ...] },
  "stops": [ { "type": "fuel", "label": "...", "lat": 0, "lng": 0, "mile_marker": 1000 } ],
  "schedule": [ { "day": 1, "start_time": "...", "end_time": "...", "status": "DRIVING", "label": "Driving", "location": "..." } ],
  "daily_logs": [ { "day": 1, "date": "2026-09-14", "total_driving_hours": 11.0, "remarks": ["..."] } ]
}
```

**Error responses** — `400` (validation), `422` (location not found / no
route found), `503` (upstream map service unavailable) — each with a
`message` field intended for direct display to the user.

## Testing

```bash
cd backend
python manage.py test
```

Covers: short and long trips, cycle usage at 0/30/65/70 hours, the 8-hour
break trigger, the 11-hour driving limit, the 14-hour window, the 10-hour
rest, exact 1-hour pickup/dropoff durations, fuel stop intervals,
multi-day ELD log generation, and invalid location/cycle input handling.

## Deployment

- **Frontend**: deployed to Vercel (root directory: `frontend`)
- **Backend**: deployed to Render (root directory: `backend`)

_(Deployed URLs to be added here once live.)_

## License

Built as a coding assessment; not licensed for reuse.
```

That covers all 14 sections the assessment asks for. Two sections — **Testing** and **Deployment** — are written as accurate *descriptions of what will exist*, but the test suite isn't built yet and nothing is deployed yet, so those parts are currently promises rather than facts. I'd rather flag that directly than leave it implied as done.

Given where we are, should we knock out the automated test suite next (so the Testing section becomes true), or move straight to deployment?