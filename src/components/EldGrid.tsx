import { motion } from "framer-motion";
import { DUTY_ROWS, clipEventsToDate, rowIndex, type ClippedEvent } from "../utils/dutyStatus";
import type { ScheduleEvent } from "../types/trip";
import "./EldGrid.css";

interface EldGridProps {
  schedule: ScheduleEvent[];
  date: string;
}

const LABEL_WIDTH = 92;
const CHART_WIDTH = 864;
const ROW_HEIGHT = 36;
const ROWS = DUTY_ROWS.length;
const CHART_HEIGHT = ROW_HEIGHT * ROWS;
const TOP_MARGIN = 22;
const SVG_WIDTH = LABEL_WIDTH + CHART_WIDTH;
const SVG_HEIGHT = TOP_MARGIN + CHART_HEIGHT;
const HOUR_WIDTH = CHART_WIDTH / 24;

function xForHour(hour: number): number {
  return LABEL_WIDTH + hour * HOUR_WIDTH;
}

function yForRow(idx: number): number {
  return TOP_MARGIN + idx * ROW_HEIGHT + ROW_HEIGHT / 2;
}

function buildStepPath(events: ClippedEvent[]): string {
  if (events.length === 0) return "";
  const points: string[] = [];
  let prevY: number | null = null;

  events.forEach((e) => {
    const y = yForRow(rowIndex(e.status));
    const x1 = xForHour(e.startHour);
    const x2 = xForHour(e.endHour);
    if (prevY !== null && prevY !== y) {
      points.push(`L ${x1} ${prevY}`); // hold at previous level up to the transition
    }
    points.push(points.length === 0 ? `M ${x1} ${y}` : `L ${x1} ${y}`);
    points.push(`L ${x2} ${y}`);
    prevY = y;
  });

  return points.join(" ");
}

export default function EldGrid({ schedule, date }: EldGridProps) {
  const events = clipEventsToDate(schedule, date);
  const pathD = buildStepPath(events);
  const hourTicks = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className="eld-grid" role="img" aria-label={`Duty status graph for ${date}`}>
      <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} width="100%" height="auto">
        {DUTY_ROWS.map((row, idx) => (
          <g key={row.status}>
            <rect
              x={LABEL_WIDTH}
              y={TOP_MARGIN + idx * ROW_HEIGHT}
              width={CHART_WIDTH}
              height={ROW_HEIGHT}
              fill={idx % 2 === 0 ? "var(--color-bg)" : "var(--color-surface)"}
            />
            <text
              x={LABEL_WIDTH - 10}
              y={yForRow(idx) + 4}
              textAnchor="end"
              className="eld-grid__row-label"
            >
              {row.label}
            </text>
          </g>
        ))}

        {hourTicks.map((h) => (
          <line
            key={h}
            x1={xForHour(h)}
            y1={TOP_MARGIN}
            x2={xForHour(h)}
            y2={TOP_MARGIN + CHART_HEIGHT}
            stroke="var(--color-border)"
            strokeWidth={h % 6 === 0 ? 1.4 : 0.75}
          />
        ))}

        {hourTicks
          .filter((h) => h % 2 === 0)
          .map((h) => (
            <text
              key={h}
              x={xForHour(h)}
              y={TOP_MARGIN - 8}
              textAnchor="middle"
              className="eld-grid__hour-label"
            >
              {h === 0 ? "12A" : h === 12 ? "12P" : h > 12 ? h - 12 : h}
            </text>
          ))}

        <rect
          x={LABEL_WIDTH}
          y={TOP_MARGIN}
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          fill="none"
          stroke="var(--color-ink-faint)"
          strokeWidth={1}
        />

        {pathD && (
          <motion.path
            d={pathD}
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth={2.5}
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        )}
      </svg>
    </div>
  );
}