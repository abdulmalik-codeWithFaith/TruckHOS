import type { DutyStatus, ScheduleEvent, Stop, StopType } from "../types/trip";
import { MapPin, Package, Fuel, BedDouble, type LucideIcon } from "lucide-react";

// Row order matches the traditional FMCSA daily log form, top to bottom.
export const DUTY_ROWS: { status: DutyStatus; label: string; short: string }[] = [
  { status: "OFF_DUTY", label: "Off duty", short: "OFF" },
  { status: "SLEEPER_BERTH", label: "Sleeper berth", short: "SB" },
  { status: "DRIVING", label: "Driving", short: "D" },
  { status: "ON_DUTY_NOT_DRIVING", label: "On duty (not driving)", short: "ON" },
];

export function rowIndex(status: DutyStatus): number {
  return DUTY_ROWS.findIndex((r) => r.status === status);
}

export function statusColor(status: DutyStatus): string {
  switch (status) {
    case "DRIVING":
      return "var(--color-brand)";
    case "ON_DUTY_NOT_DRIVING":
      return "var(--color-amber-dark)";
    case "SLEEPER_BERTH":
      return "var(--color-route)";
    case "OFF_DUTY":
    default:
      return "var(--color-ink-faint)";
  }
}


export const STOP_META: Record<StopType, { icon: LucideIcon; label: string; color: string }> = {
  current: { icon: MapPin, label: "Current location", color: "var(--color-brand)" },
  pickup: { icon: Package, label: "Pickup", color: "var(--color-route)" },
  dropoff: { icon: Package, label: "Dropoff", color: "var(--color-danger)" },
  fuel: { icon: Fuel, label: "Fuel stop", color: "var(--color-amber-dark)" },
  rest: { icon: BedDouble, label: "Rest stop", color: "var(--color-ink-muted)" },
};

export const STOP_MARKER_SVG: Record<StopType, string> = {
  current: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  pickup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73Z"/><path d="M12 22V12"/><path d="M3.3 7 12 12l8.7-5"/><path d="m7.5 4.27 9 5.15"/></svg>`,
  dropoff: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73Z"/><path d="M12 22V12"/><path d="M3.3 7 12 12l8.7-5"/><path d="m7.5 4.27 9 5.15"/></svg>`,
  fuel: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="15" y2="22"/><line x1="4" y1="9" x2="14" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0V9.8a2 2 0 0 0-.6-1.4L18 5"/></svg>`,
  rest: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/></svg>`,
};

/** Hours since local midnight of `dayDate` (0–24), clamped, for placing a point on the 24h axis. */
export function hoursSinceMidnight(iso: string, dayDate: string): number {
  const event = new Date(iso);
  const dayStart = new Date(`${dayDate}T00:00:00`);
  const diffMs = event.getTime() - dayStart.getTime();
  const hours = diffMs / (1000 * 60 * 60);
  return Math.max(0, Math.min(24, hours));
}

export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatHours(hours: number): string {
  return `${hours.toFixed(1)}h`;
}

export function eventsForDay(schedule: ScheduleEvent[], day: number): ScheduleEvent[] {
  return schedule.filter((e) => e.day === day);
}


export function isStopType(value: string): value is StopType {
  return value in STOP_META;
}

export function summarizeStops(stops: Stop[]): Stop[] {
  return stops;
}

export interface ClippedEvent {
  status: DutyStatus;
  label: string;
  location?: string;
  startHour: number; // hours since midnight of the target date
  endHour: number;
}

/**
 * Returns the portion of each schedule event that falls within the given
 * calendar date, clipped to [00:00, 24:00). This is what makes an overnight
 * rest period correctly show up on both the day it starts and the day it
 * ends, matching how a real paper ELD log works.
 */
export function clipEventsToDate(schedule: ScheduleEvent[], date: string): ClippedEvent[] {
  const dayStart = new Date(`${date}T00:00:00`).getTime();
  const dayEnd = dayStart + 24 * 60 * 60 * 1000;

  const clipped: ClippedEvent[] = [];

  for (const e of schedule) {
    const start = new Date(e.start_time).getTime();
    const end = new Date(e.end_time).getTime();
    if (end <= dayStart || start >= dayEnd) continue;

    const clippedStart = Math.max(start, dayStart);
    const clippedEnd = Math.min(end, dayEnd);

    clipped.push({
      status: e.status,
      label: e.label,
      location: e.location,
      startHour: (clippedStart - dayStart) / (1000 * 60 * 60),
      endHour: (clippedEnd - dayStart) / (1000 * 60 * 60),
    });
  }

  return clipped.sort((a, b) => a.startHour - b.startHour);
}