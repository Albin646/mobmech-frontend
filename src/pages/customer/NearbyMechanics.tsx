import { useEffect,useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { api, ApiError } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import type { NearbyMechanic } from "../../types";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

export default function NearbyMechanics() {
  const { user } = useAuth();
  const [mechanics, setMechanics] = useState<NearbyMechanic[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [center, setCenter] = useState(defaultCenter);

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

console.log(mechanics);

  useEffect(() => {
    if (!user) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log("Unable to get location");
        }
      );
    }

    api.getNearbyMechanics(user.userId, user.token)
      .then((data) => setMechanics([...data].sort((a, b) => a.distance - b.distance)))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load mechanics'))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Nearby mechanics</h1>
          <p className="muted">Mechanics sorted by distance from your location</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <LoadScript googleMapsApiKey={apiKey}>
      <div className="map-card">
  <GoogleMap
    mapContainerStyle={mapContainerStyle}
    center={center}
    zoom={13}
  >
    {/* Customer location */}
    <Marker position={center} />

    {/* Nearby mechanics */}
    {mechanics.map((mechanic) => (
      <Marker
        key={mechanic.mechanicId}
        position={{
          lat: mechanic.latitude,
          lng: mechanic.longitude,
        }}
        title={mechanic.name}
      />
    ))}
    
  </GoogleMap>
  </div>
</LoadScript>

      {loading ? (
        <p className="muted">Loading mechanics…</p>
      ) : mechanics.length === 0 ? (
        <div className="empty-state">
          <p>No mechanics found. Make sure you&apos;ve updated your location on the dashboard.</p>
        </div>
      ) : (
        <div className="list">
          {mechanics.map((mechanic) => (
            <article key={mechanic.mechanicId} className="list-card">
              <div>
                <h3>{mechanic.name}</h3>
                <p className="muted">{mechanic.specialization}</p>
              </div>
              <span className="badge">{mechanic.distance.toFixed(1)} km away</span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
