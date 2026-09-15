import { motion } from "framer-motion";
import type { ScheduleEvent } from "../types/trip";
import { formatClock, formatHours, statusColor } from "../utils/dutyStatus";
import "./TripTimeline.css";

interface TripTimelineProps {
  schedule: ScheduleEvent[];
}

function groupByDay(schedule: ScheduleEvent[]): Map<number, ScheduleEvent[]> {
  const map = new Map<number, ScheduleEvent[]>();
  for (const e of schedule) {
    const list = map.get(e.day) ?? [];
    list.push(e);
    map.set(e.day, list);
  }
  return map;
}

export default function TripTimeline({ schedule }: TripTimelineProps) {
  const days = Array.from(groupByDay(schedule).entries()).sort((a, b) => a[0] - b[0]);

  return (
    <section className="trip-timeline">
      <h3 className="trip-timeline__title">Trip schedule</h3>
      <div className="trip-timeline__days">
        {days.map(([day, events]) => (
          <div className="trip-timeline__day" key={day}>
            <h4 className="trip-timeline__day-title">Day {day}</h4>
            <ol className="trip-timeline__list">
              {events.map((e, i) => (
                <motion.li
                  className="trip-timeline__item"
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <span
                    className="trip-timeline__dot"
                    style={{ background: statusColor(e.status) }}
                    aria-hidden="true"
                  />
                  <div className="trip-timeline__content">
                    <div className="trip-timeline__row">
                      <span className="trip-timeline__time">
                        {formatClock(e.start_time)} – {formatClock(e.end_time)}
                      </span>
                      <span className="trip-timeline__duration">{formatHours(e.duration_hours)}</span>
                    </div>
                    <p className="trip-timeline__label">{e.label}</p>
                    {e.location && <p className="trip-timeline__location">{e.location}</p>}
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}