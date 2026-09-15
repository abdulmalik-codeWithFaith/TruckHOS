import { motion } from "framer-motion";
import type { TripSummary } from "../types/trip";
import "./TripSummaryCard.css";

interface TripSummaryCardProps {
  trip: TripSummary;
  routeLabel: string;
}

export default function TripSummaryCard({ trip, routeLabel }: TripSummaryCardProps) {
  const stats = [
    { label: "Distance", value: `${trip.distance_miles.toLocaleString()} mi` },
    { label: "Driving time", value: `${trip.driving_hours.toFixed(1)}h` },
    { label: "Estimated duration", value: `${trip.estimated_days} day${trip.estimated_days === 1 ? "" : "s"}` },
    { label: "Cycle hours remaining", value: `${trip.cycle_hours_remaining.toFixed(1)}h` },
  ];

  return (
    <motion.section
      className="trip-summary"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <p className="trip-summary__route">{routeLabel}</p>
      <div className="trip-summary__stats">
        {stats.map((s) => (
          <div className="trip-summary__stat" key={s.label}>
            <span className="trip-summary__stat-value">{s.value}</span>
            <span className="trip-summary__stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}