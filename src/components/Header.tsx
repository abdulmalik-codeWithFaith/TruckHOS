import "./Header.css";

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__mark">
          <span className="app-header__dot" aria-hidden="true" />
          <span className="app-header__wordmark">TruckHOS</span>
        </div>
        <span className="app-header__tagline">Trip &amp; hours-of-service planner</span>
      </div>
    </header>
  );
}