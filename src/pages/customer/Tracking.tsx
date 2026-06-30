import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

interface TrackingData {
  customerLat: number;
  customerLon: number;
  mechanicLat: number;
  mechanicLon: number;
  mechanicName: string;
  status: string;
}

const containerStyle = {
  width: "100%",
  height: "600px",
};

export default function Tracking() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const requestId = Number(id);

  const [tracking, setTracking] = useState<TrackingData | null>(null);

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (!user || !requestId) return;

    const loadTracking = () => {
      api.getTracking(requestId, user.token)
        .then((data) => {
          setTracking(data);

          const directionsService =
            new google.maps.DirectionsService();

          directionsService.route(
            {
              origin: {
                lat: data.mechanicLat,
                lng: data.mechanicLon,
              },
              destination: {
                lat: data.customerLat,
                lng: data.customerLon,
              },
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === "OK" && result) {
                setDirections(result);
              }
            }
          );
        })
        .catch(console.error);
    };

    loadTracking();

    const interval = setInterval(loadTracking, 5000);

    return () => clearInterval(interval);
  }, [requestId, user]);

  if (!isLoaded || !tracking) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Track Mechanic</h1>
          <p className="muted">
            Mechanic location updates every 5 seconds
          </p>
        </div>
      </div>

<div className="map-card">
      <GoogleMap
  mapContainerStyle={containerStyle}
  center={{
    lat: tracking.customerLat,
    lng: tracking.customerLon,
  }}
  zoom={13}
>
        <Marker
    position={{
        lat: tracking.customerLat,
        lng: tracking.customerLon,
    }}
    icon={{
        url: "/customer.png",
        scaledSize: new google.maps.Size(45,45),
    }}
/>

<Marker
    position={{
        lat: tracking.mechanicLat,
        lng: tracking.mechanicLon,
    }}
    icon={{
        url: "/mechanic.png",
        scaledSize: new google.maps.Size(45,45),
    }}
/>


        {directions && (
          <DirectionsRenderer
          directions={directions}
          options={{
            polylineOptions: {
              strokeColor: "#2563EB",
              strokeWeight: 6,
              strokeOpacity: 0.9,
            },
            suppressMarkers: true,
          }}
        />
        )}
      </GoogleMap>
      </div>

      {directions && (
        <div className="info-grid">

        <div className="info-card">
            <h3>📏 Distance</h3>
            <h1>
                {directions?.routes[0].legs[0].distance?.text}
            </h1>
        </div>
    
        <div className="info-card">
            <h3>⏱ ETA</h3>
            <h1>
                {directions?.routes[0].legs[0].duration?.text}
            </h1>
        </div>
    
    </div>
      )}

      <div style={{ marginTop: 20 }}>
        <h3>Mechanic Information</h3>

        <p>
          <strong>Name:</strong> {tracking.mechanicName}
        </p>

        <p>
          <strong>Status:</strong> {tracking.status}
        </p>
      </div>
    </div>
  );
}