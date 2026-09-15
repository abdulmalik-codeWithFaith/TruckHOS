import { motion } from "framer-motion";
import type { Stop } from "../types/trip";
import { STOP_META } from "../utils/dutyStatus";
import "./StopList.css";

interface StopListProps {
  stops: Stop[];
}

export default function StopList({ stops }: StopListProps) {
  return (
    <div className="stop-list">
      <h3 className="stop-list__title">Stops</h3>
      <ul className="stop-list__items">
        {stops.map((stop, i) => {
          const meta = STOP_META[stop.type];
          return (
            <motion.li
              key={i}
              className="stop-list__item"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <span className="stop-list__icon" style={{ borderColor: meta.color }}>
                <meta.icon size={16} color={meta.color} strokeWidth={2.25} />
              </span>
              <span className="stop-list__label">
                {stop.label}
                {stop.mile_marker != null && (
                  <span className="stop-list__mile"> · mile {stop.mile_marker.toLocaleString()}</span>
                )}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}