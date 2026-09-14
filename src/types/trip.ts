// Shared types for the trip planning domain.
// These mirror the shape the Django API will return from POST /api/trips/plan/.
// Keeping this in one file means the frontend and backend can never silently
// drift apart on what a "schedule event" or "stop" looks like.

export interface TripRequest {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_used: number;
}

export type StopType = "current" | "pickup" | "dropoff" | "fuel" | "rest";

export interface Stop {
  type: StopType;
  label: string;
  lat: number;
  lng: number;
  mile_marker?: number;
}

export type DutyStatus =
  | "OFF_DUTY"
  | "SLEEPER_BERTH"
  | "DRIVING"
  | "ON_DUTY_NOT_DRIVING";

export interface ScheduleEvent {
  day: number;
  start_time: string; // ISO 8601
  end_time: string; // ISO 8601
  duration_hours: number;
  status: DutyStatus;
  label: string; // e.g. "Driving", "Fuel stop", "30-minute break"
  location?: string;
}

export interface DailyLog {
  day: number;
  date: string;
  total_driving_hours: number;
  total_on_duty_hours: number;
  total_off_duty_hours: number;
  total_sleeper_hours: number;
  total_miles: number;
  events: ScheduleEvent[];
  remarks: string[];
}

export interface RouteGeometry {
  coordinates: [number, number][]; // [lng, lat] pairs, GeoJSON order
}

export interface TripSummary {
  distance_miles: number;
  driving_hours: number;
  estimated_days: number;
  cycle_hours_remaining: number;
}

export interface TripPlanResponse {
  trip: TripSummary;
  route: RouteGeometry;
  stops: Stop[];
  schedule: ScheduleEvent[];
  daily_logs: DailyLog[];
}

export interface ApiError {
  message: string;
  field?: string;
}