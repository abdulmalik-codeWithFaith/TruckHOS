import { motion } from "framer-motion";
import type { TripPlanResponse, TripRequest } from "../types/trip";
import TripSummaryCard from "../components/TripSummaryCard";
import RouteMap from "../components/RouteMap";
import StopList from "../components/StopList";
import TripTimeline from "../components/TripTimeline";
import ELDLogViewer from "../components/ELDLogViewer";
import "./ResultsPage.css";

interface ResultsPageProps {
  data: TripPlanResponse;
  request: TripRequest;
  onReset: () => void;
}

export default function ResultsPage({ data, request, onReset }: ResultsPageProps) {
  const routeLabel = `${request.current_location} → ${request.pickup_location} → ${request.dropoff_location}`;

  return (
    <div className="results-page">
      <div className="results-page__toolbar">
        <button className="results-page__reset" onClick={onReset}>
          ← Plan another trip
        </button>
      </div>

      <motion.div
        className="results-page__sections"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
          <TripSummaryCard trip={data.trip} routeLabel={routeLabel} />
        </motion.div>

        <motion.div
          className="results-page__map-row"
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        >
          <RouteMap route={data.route} stops={data.stops} />
          <StopList stops={data.stops} />
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
          <TripTimeline schedule={data.schedule} />
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
          <ELDLogViewer dailyLogs={data.daily_logs} schedule={data.schedule} />
        </motion.div>
      </motion.div>
    </div>
  );
}