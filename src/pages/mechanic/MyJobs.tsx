import { useEffect, useState } from 'react';
import { api, ApiError } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import type { ServiceRequest } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import { useNavigate } from "react-router-dom";

export default function MyJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!user?.mechanicId) return;

    api.getMechanicRequests(user.mechanicId, user.token)
      .then(setRequests)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load jobs'))
      .finally(() => setLoading(false));
  }, [user]);

  async function handleComplete(requestId: number) {
    if (!user) return;

    try {
      const updated = await api.completeRequest(requestId, user.token);
      setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to complete job');
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My assigned jobs</h1>
          <p className="muted2">Jobs you&apos;ve accepted</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="muted2">Loading jobs…</p>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <p>No assigned jobs yet. Accept a pending request to get started.</p>
        </div>
      ) : (
        <div className="list">
          {requests.map((request) => (
            <article key={request.id} className="list-card vertical">
              <div className="list-card-header">
                <h3>{request.vehicleType}</h3>
                <StatusBadge status={request.status} />
              </div>
              <p>{request.problemDescription}</p>
              <p className="muted">📍 {request.location}</p>
              {request.customer && (
                <p className="muted2">Customer: {request.customer.name}</p>
              )}
              {request.status === 'ACCEPTED' && (
  <button
    type="button"
    className="btn btn-secondary"
    onClick={() => navigate(`/mechanic/tracking/${request.id}`)}
  >
    📍 Navigate to Customer
  </button>
)}
              
              {request.status === 'ACCEPTED' && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleComplete(request.id)}
                >
                  Mark as completed
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
