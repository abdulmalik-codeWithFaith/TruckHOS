import { useState } from "react";
import Header from "./components/Header";
import RouteMotif from "./components/RouteMotif";
import TripForm from "./components/TripForm";
import ResultsPage from "./pages/ResultsPage";
import { planTrip } from "./services/api";
import type { ApiError, TripPlanResponse, TripRequest } from "./types/trip";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TripPlanResponse | null>(null);
  const [request, setRequest] = useState<TripRequest | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(data: TripRequest) {
    setRequest(data);
    setError(null);
    setIsLoading(true);
    try {
      const plan = await planTrip(data);
      setResult(plan);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setRequest(null);
    setError(null);
  }

  if (result && request) {
    return (
      <div className="app">
        <Header />
        <ResultsPage data={result} request={request} onReset={handleReset} />
      </div>
    );
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
          <div className="hero__form-column">
            <TripForm onSubmit={handleSubmit} isLoading={isLoading} />
            {error && (
              <div className="hero__error" role="alert">
                {error.message}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;