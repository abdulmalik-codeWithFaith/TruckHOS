import { useState } from "react";
import Header from "./components/Header";
import RouteMotif from "./components/RouteMotif";
import TripForm from "./components/TripForm";
import type { TripRequest } from "./types/trip";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(data: TripRequest) {
    console.log("Trip request ready to send:", data);
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 1500);
  }

  return (
    <div className="app">
      <Header />
      <main className="hero">
        <div className="hero__inner">
          <div className="hero__copy">
            <p className="hero__eyebrow">Hours-of-service &amp; ELD planning</p>
            <h1>Plan the route. Stay within your hours.</h1>
            <p className="hero__lede">
              Enter a trip and TruckHOS lays out the route, fuel and rest stops, and
              a compliant daily schedule — with ELD logs drawn straight from the plan.
            </p>
            <RouteMotif className="hero__motif" active={!isLoading} />
          </div>
          <TripForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}

export default App;