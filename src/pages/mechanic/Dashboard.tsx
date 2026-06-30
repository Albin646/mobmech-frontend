import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import type { MechanicDashboard } from '../../types';

export default function MechanicDashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<MechanicDashboard | null>(null);
  const [error, setError] = useState('');
  const [locationStatus, setLocationStatus] = useState('');

  useEffect(() => {
    if (!user?.mechanicId) return;

    api.getMechanicDashboard(user.mechanicId, user.token)
      .then(setDashboard)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load dashboard'));
  }, [user]);

  function updateLocation() {
    if (!user) return;

    setLocationStatus('Getting location…');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await api.updateMechanicLocation(
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
      () => setLocationStatus('Unable to access your location.'),
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Mechanic dashboard</h1>
          <p className="muted">Welcome back, {user?.name}</p>
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
            <span className="stat-label">Assigned jobs</span>
            <span className="stat-value">{dashboard.assignedJobs}</span>
          </div>
          <div className="stat-card completed">
            <span className="stat-label">Completed jobs</span>
            <span className="stat-value">{dashboard.completedJobs}</span>
          </div>
          <div className="stat-card accepted">
            <span className="stat-label">Rating</span>
            <span className="stat-value">{dashboard.rating.toFixed(1)} ★</span>
          </div>
        </div>
      )}

      <div className="quick-actions">
        <Link to="/mechanic/pending" className="action-card">
          <h3>Pending requests</h3>
          <p>Browse open jobs waiting for a mechanic to accept.</p>
        </Link>
        <Link to="/mechanic/jobs" className="action-card">
          <h3>My assigned jobs</h3>
          <p>View jobs you&apos;ve accepted and mark them complete.</p>
        </Link>
      </div>
    </div>
  );
}
