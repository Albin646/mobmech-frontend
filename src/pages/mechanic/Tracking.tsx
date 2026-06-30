import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";

import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import type { TrackingResponse } from "../../types";

const containerStyle = {
  width: "100%",
  height: "600px",
};

export default function MechanicTracking() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const requestId = Number(id);

  const [tracking, setTracking] = useState<TrackingResponse | null>(null);
  const [address, setAddress] = useState("");

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (!user || !requestId || !isLoaded) return;
  
    const loadTracking = () => {
      api.getTracking(requestId, user.token)
        .then((data) => {
  
          setTracking(data);
  
          // Reverse Geocoding using Google Maps JavaScript API
          const geocoder = new google.maps.Geocoder();
  
          geocoder.geocode(
            {
              location: {
                lat: data.customerLat,
                lng: data.customerLon,
              },
            },
            (results, status) => {
              console.log("Geocoder Status:", status);
              console.log("Geocoder Results:", results);
  
              if (
                status === google.maps.GeocoderStatus.OK &&
                results &&
                results.length > 0
              ) {
                setAddress(results[0].formatted_address);
              } else {
                setAddress("Unknown location");
              }
            }
          );
  
          const directionsService = new google.maps.DirectionsService();
  
          console.log("Tracking Data:", data);
  
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
              console.log("Directions Status:", status);
  
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
  
  }, [requestId, user, isLoaded]); if (!isLoaded || !tracking) {
    return <h2>Loading map...</h2>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Navigate to Customer</h1>
          {/* <h4>
            Customer location updates every 5 seconds
          </h4> */}
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

<button
  className="btn btn-primary"
  onClick={() => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${tracking.customerLat},${tracking.customerLon}&travelmode=driving`,
      "_blank"
    );
  }}
>
  Open in Google Maps
</button>

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


<div className="info-card">
    <div style={{ marginTop: "20px" }}>
        <h3>Customer Location</h3>

        <p>
            <strong>Status:</strong> {tracking.status}
        </p>

        <p>
            <strong>📍 Location:</strong> {address}
        </p>
    </div>
</div>
     </div>
  );
}