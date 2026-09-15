import type { TripPlanResponse } from "../types/trip";

// MOCK DATA — for frontend development only.
// Chicago, IL -> Denver, CO (pickup) -> Los Angeles, CA (dropoff).
// HOS math below is worked out by hand to be internally consistent
// (11h driving/day, 14h window, break after 8h driving, 10h rest,
// 1h pickup/dropoff, fuel roughly every 1,000 miles) so the UI can be
// validated against real rules ahead of the backend engine existing.
// This will be replaced by the live API response from POST /api/trips/plan/.

export const mockTripPlan: TripPlanResponse = {
  trip: {
    distance_miles: 1450,
    driving_hours: 26,
    estimated_days: 3,
    cycle_hours_remaining: 14,
  },
  route: {
    coordinates: [
      [-87.6298, 41.8781], // Chicago, IL
      [-99.0817, 40.6996], // Kearney, NE (fuel + rest)
      [-104.9903, 39.7392], // Denver, CO (pickup)
      [-108.5506, 39.0639], // Grand Junction, CO (fuel + rest)
      [-118.2437, 34.0522], // Los Angeles, CA (dropoff)
    ],
  },
  stops: [
    { type: "current", label: "Chicago, IL", lat: 41.8781, lng: -87.6298 },
    { type: "fuel", label: "Fuel stop — Kearney, NE", lat: 40.6996, lng: -99.0817, mile_marker: 480 },
    { type: "rest", label: "Overnight rest — Kearney, NE", lat: 40.6996, lng: -99.0817 },
    { type: "pickup", label: "Pickup — Denver, CO", lat: 39.7392, lng: -104.9903 },
    { type: "fuel", label: "Fuel stop — Grand Junction, CO", lat: 39.0639, lng: -108.5506, mile_marker: 1020 },
    { type: "rest", label: "Overnight rest — Grand Junction, CO", lat: 39.0639, lng: -108.5506 },
    { type: "dropoff", label: "Dropoff — Los Angeles, CA", lat: 34.0522, lng: -118.2437 },
  ],
  schedule: [
    // Day 1 — 2026-09-14
    { day: 1, start_time: "2026-09-14T06:00:00", end_time: "2026-09-14T07:00:00", duration_hours: 1, status: "ON_DUTY_NOT_DRIVING", label: "Pre-trip inspection", location: "Chicago, IL" },
    { day: 1, start_time: "2026-09-14T07:00:00", end_time: "2026-09-14T15:00:00", duration_hours: 8, status: "DRIVING", label: "Driving", location: "En route to Denver, CO" },
    { day: 1, start_time: "2026-09-14T15:00:00", end_time: "2026-09-14T15:30:00", duration_hours: 0.5, status: "ON_DUTY_NOT_DRIVING", label: "30-minute break (required after 8h driving)", location: "Rest area, I-80" },
    { day: 1, start_time: "2026-09-14T15:30:00", end_time: "2026-09-14T18:30:00", duration_hours: 3, status: "DRIVING", label: "Driving", location: "En route to Denver, CO" },
    { day: 1, start_time: "2026-09-14T18:30:00", end_time: "2026-09-14T19:00:00", duration_hours: 0.5, status: "ON_DUTY_NOT_DRIVING", label: "Fuel stop (~1,000 mi interval)", location: "Kearney, NE" },
    { day: 1, start_time: "2026-09-14T19:00:00", end_time: "2026-09-15T05:00:00", duration_hours: 10, status: "SLEEPER_BERTH", label: "10-hour rest", location: "Kearney, NE" },

    // Day 2 — 2026-09-15
    { day: 2, start_time: "2026-09-15T05:00:00", end_time: "2026-09-15T05:30:00", duration_hours: 0.5, status: "ON_DUTY_NOT_DRIVING", label: "Pre-trip inspection", location: "Kearney, NE" },
    { day: 2, start_time: "2026-09-15T05:30:00", end_time: "2026-09-15T09:30:00", duration_hours: 4, status: "DRIVING", label: "Driving", location: "En route to Denver, CO" },
    { day: 2, start_time: "2026-09-15T09:30:00", end_time: "2026-09-15T10:30:00", duration_hours: 1, status: "ON_DUTY_NOT_DRIVING", label: "Pickup", location: "Denver, CO" },
    { day: 2, start_time: "2026-09-15T10:30:00", end_time: "2026-09-15T14:30:00", duration_hours: 4, status: "DRIVING", label: "Driving", location: "En route to Los Angeles, CA" },
    { day: 2, start_time: "2026-09-15T14:30:00", end_time: "2026-09-15T15:00:00", duration_hours: 0.5, status: "ON_DUTY_NOT_DRIVING", label: "30-minute break (required after 8h driving)", location: "Rest area, I-70" },
    { day: 2, start_time: "2026-09-15T15:00:00", end_time: "2026-09-15T18:00:00", duration_hours: 3, status: "DRIVING", label: "Driving", location: "En route to Los Angeles, CA" },
    { day: 2, start_time: "2026-09-15T18:00:00", end_time: "2026-09-15T18:30:00", duration_hours: 0.5, status: "ON_DUTY_NOT_DRIVING", label: "Fuel stop (~2,000 mi interval)", location: "Grand Junction, CO" },
    { day: 2, start_time: "2026-09-15T18:30:00", end_time: "2026-09-16T04:30:00", duration_hours: 10, status: "SLEEPER_BERTH", label: "10-hour rest", location: "Grand Junction, CO" },

    // Day 3 — 2026-09-16
    { day: 3, start_time: "2026-09-16T04:30:00", end_time: "2026-09-16T05:00:00", duration_hours: 0.5, status: "ON_DUTY_NOT_DRIVING", label: "Pre-trip inspection", location: "Grand Junction, CO" },
    { day: 3, start_time: "2026-09-16T05:00:00", end_time: "2026-09-16T09:00:00", duration_hours: 4, status: "DRIVING", label: "Driving", location: "En route to Los Angeles, CA" },
    { day: 3, start_time: "2026-09-16T09:00:00", end_time: "2026-09-16T10:00:00", duration_hours: 1, status: "ON_DUTY_NOT_DRIVING", label: "Dropoff", location: "Los Angeles, CA" },
    { day: 3, start_time: "2026-09-16T10:00:00", end_time: "2026-09-17T00:00:00", duration_hours: 14, status: "OFF_DUTY", label: "Trip complete — off duty", location: "Los Angeles, CA" },
  ],
  daily_logs: [
    {
      day: 1,
      date: "2026-09-14",
      total_driving_hours: 11,
      total_on_duty_hours: 2,
      total_off_duty_hours: 6,
      total_sleeper_hours: 5,
      total_miles: 610,
      events: [],
      remarks: [
        "06:00 — Chicago, IL — Pre-trip inspection, on duty",
        "07:00 — Chicago, IL — Driving",
        "15:00 — Rest area, I-80 — 30-minute break",
        "15:30 — Rest area, I-80 — Driving",
        "18:30 — Kearney, NE — Fuel stop, on duty",
        "19:00 — Kearney, NE — Sleeper berth, 10-hour rest",
      ],
    },
    {
      day: 2,
      date: "2026-09-15",
      total_driving_hours: 11,
      total_on_duty_hours: 2.5,
      total_off_duty_hours: 0,
      total_sleeper_hours: 10.5,
      total_miles: 615,
      events: [],
      remarks: [
        "05:00 — Kearney, NE — Pre-trip inspection, on duty",
        "05:30 — Kearney, NE — Driving",
        "09:30 — Denver, CO — Pickup, on duty",
        "10:30 — Denver, CO — Driving",
        "14:30 — Rest area, I-70 — 30-minute break",
        "15:00 — Rest area, I-70 — Driving",
        "18:00 — Grand Junction, CO — Fuel stop, on duty",
        "18:30 — Grand Junction, CO — Sleeper berth, 10-hour rest",
      ],
    },
    {
      day: 3,
      date: "2026-09-16",
      total_driving_hours: 4,
      total_on_duty_hours: 1.5,
      total_off_duty_hours: 14,
      total_sleeper_hours: 4.5,
      total_miles: 225,
      events: [],
      remarks: [
        "04:30 — Grand Junction, CO — Pre-trip inspection, on duty",
        "05:00 — Grand Junction, CO — Driving",
        "09:00 — Los Angeles, CA — Dropoff, on duty",
        "10:00 — Los Angeles, CA — Trip complete, off duty",
      ],
    },
  ],
};