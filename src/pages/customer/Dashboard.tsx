import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import type { CustomerDashboard } from '../../types';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<CustomerDashboard | null>(null);
  const [error, setError] = useState('');
  const [locationStatus, setLocationStatus] = useState('');

  useEffect(() => {
    if (!user) return;

    api.getCustomerDashboard(user.userId, user.token)
      .then(setDashboard)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load dashboard'));
  }, [user]);

  function updateLocation() {
    if (!user) return;

    setLocationStatus('Getting location…');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await api.updateLocation(
            user.userId,
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            user.token,
          );
          setLocationStatus('Location updated successfully.');
        } catch (err) {
          setLocationStatus(err instanceof ApiError ? err.message : 'Failed to update location');
        }
      },
      () => setLocationStatus('Unable to access your location. Please enable location services.'),
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Customer dashboard</h1>
          <p className="welcome-text">Welcome back, {user?.name}</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={updateLocation}>
          Update my location
        </button>
      </div>

      {locationStatus && <div className="alert alert-info">{locationStatus}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {dashboard && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total requests</span>
            <span className="stat-value">{dashboard.totalRequests}</span>
          </div>
          <div className="stat-card pending">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{dashboard.pending}</span>
          </div>
          <div className="stat-card accepted">
            <span className="stat-label">Accepted</span>
            <span className="stat-value">{dashboard.accepted}</span>
          </div>
          <div className="stat-card completed">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{dashboard.completed}</span>
          </div>
        </div>
      )}

      <div className="quick-actions">
        <Link to="/customer/new-request" className="action-card">
          <h3>New service request</h3>
          <p>Describe your vehicle issue and request a mobile mechanic.</p>
        </Link>
        <Link to="/customer/nearby" className="action-card">
          <h3>Find nearby mechanics</h3>
          <p>See available mechanics sorted by distance from you.</p>
        </Link>
        <Link to="/customer/requests" className="action-card">
          <h3>View my requests</h3>
          <p>Track the status of all your service requests.</p>
        </Link>
      </div>
    </div>
  );
}
