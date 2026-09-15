import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DailyLog, ScheduleEvent } from "../types/trip";
import EldGrid from "./EldGrid";
import { formatHours } from "../utils/dutyStatus";
import "./ELDLogViewer.css";

interface ELDLogViewerProps {
  dailyLogs: DailyLog[];
  schedule: ScheduleEvent[];
}

export default function ELDLogViewer({ dailyLogs, schedule }: ELDLogViewerProps) {
  const [selectedDay, setSelectedDay] = useState(dailyLogs[0]?.day ?? 1);
  const activeLog = dailyLogs.find((d) => d.day === selectedDay) ?? dailyLogs[0];

  if (!activeLog) return null;

  const totals = [
    { label: "Driving", value: activeLog.total_driving_hours },
    { label: "On duty (not driving)", value: activeLog.total_on_duty_hours },
    { label: "Sleeper berth", value: activeLog.total_sleeper_hours },
    { label: "Off duty", value: activeLog.total_off_duty_hours },
  ];

  return (
    <section className="eld-viewer">
      <div className="eld-viewer__header">
        <h3 className="eld-viewer__title">Daily ELD logs</h3>
        <div className="eld-viewer__tabs" role="tablist" aria-label="Select day">
          {dailyLogs.map((log) => (
            <button
              key={log.day}
              role="tab"
              aria-selected={log.day === selectedDay}
              className={`eld-viewer__tab ${log.day === selectedDay ? "eld-viewer__tab--active" : ""}`}
              onClick={() => setSelectedDay(log.day)}
            >
              Day {log.day}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeLog.day}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <div className="eld-viewer__meta">
            <span>{activeLog.date}</span>
            <span>{activeLog.total_miles.toLocaleString()} mi driven</span>
          </div>

          <EldGrid schedule={schedule} date={activeLog.date} />

          <div className="eld-viewer__totals">
            {totals.map((t) => (
              <div className="eld-viewer__total" key={t.label}>
                <span className="eld-viewer__total-value">{formatHours(t.value)}</span>
                <span className="eld-viewer__total-label">{t.label}</span>
              </div>
            ))}
          </div>

          <div className="eld-viewer__remarks">
            <h4>Remarks</h4>
            <ul>
              {activeLog.remarks.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}