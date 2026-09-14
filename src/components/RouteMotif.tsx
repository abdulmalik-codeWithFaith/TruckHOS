import { motion } from "framer-motion";

interface RouteMotifProps {
  /** Replays the draw-in animation, e.g. while a trip is being planned. */
  active?: boolean;
  className?: string;
}

/**
 * A dashed route line with three waypoints (current, pickup, dropoff)
 * that draws itself in on mount. This is the app's signature visual motif —
 * it echoes the actual product function instead of a decorative gradient.
 */
export default function RouteMotif({ active = true, className }: RouteMotifProps) {
  const pathD = "M20,90 C90,90 70,20 150,20 C230,20 210,100 290,100";
  const points = [
    { cx: 20, cy: 90, delay: 0, color: "var(--color-brand)" },
    { cx: 150, cy: 20, delay: 0.55, color: "var(--color-amber)" },
    { cx: 290, cy: 100, delay: 1.05, color: "var(--color-route)" },
  ];

  return (
    <svg
      viewBox="0 0 310 120"
      className={className}
      role="img"
      aria-label="Illustrative route from current location through pickup to dropoff"
    >
      <motion.path
        d={pathD}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <motion.path
        d={pathD}
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="1 9"
        initial={{ pathLength: 0 }}
        animate={active ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.3, ease: "easeInOut" }}
      />
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r={7}
          fill="var(--color-surface)"
          stroke={p.color}
          strokeWidth={3}
          initial={{ scale: 0, opacity: 0 }}
          animate={active ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.35, delay: p.delay, ease: "backOut" }}
        />
      ))}
    </svg>
  );
}