import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import type { RouteGeometry, Stop } from "../types/trip";
import { STOP_META, STOP_MARKER_SVG } from "../utils/dutyStatus";
import "./RouteMap.css";

interface RouteMapProps {
  route: RouteGeometry;
  stops: Stop[];
}

function stopDivIcon(stop: Stop) {
  const meta = STOP_META[stop.type];
  const svg = STOP_MARKER_SVG[stop.type];
  return L.divIcon({
    html: `<span class="route-map__pin" style="border-color:${meta.color};color:${meta.color}">${svg}</span>`,
    className: "route-map__pin-wrapper",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function FitToRoute({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [32, 32] });
    }
  }, [map, positions]);
  return null;
}

export default function RouteMap({ route, stops }: RouteMapProps) {
  const positions: [number, number][] = route.coordinates.map(([lng, lat]) => [lat, lng]);

  return (
    <div className="route-map">
      <MapContainer
        center={positions[0] ?? [39.8283, -98.5795]}
        zoom={5}
        scrollWheelZoom={false}
        className="route-map__container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <Polyline positions={positions} pathOptions={{ color: "#1f4b99", weight: 4, opacity: 0.85 }} />
        {stops.map((stop, i) => (
          <Marker key={i} position={[stop.lat, stop.lng]} icon={stopDivIcon(stop)}>
            <Popup>
              <strong>{stop.label}</strong>
              {stop.mile_marker != null && (
              <>
                <br />
                Mile {stop.mile_marker.toLocaleString()}
              </>
            )}
            </Popup>
          </Marker>
        ))}
        <FitToRoute positions={positions} />
      </MapContainer>
    </div>
  );
}