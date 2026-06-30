import { useEffect, useState } from 'react';
import { api, ApiError } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import type { ServiceRequest } from '../../types';
import StatusBadge from '../../components/StatusBadge';

export default function PendingRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    api.getPendingRequests(user.token)
      .then(setRequests)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load pending requests'))
      .finally(() => setLoading(false));
  }, [user]);

  async function handleAccept(requestId: number) {

    if (!user?.mechanicId) return;

    try {
      await api.acceptRequest(user.mechanicId, requestId, user.token);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to accept request');
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Pending requests</h1>
          <p className="muted">Open jobs available to accept</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="muted">Loading pending requests…</p>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <p>No pending requests right now. Check back soon.</p>
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
                <p className="muted">Customer: {request.customer.name}</p>
              )}
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleAccept(request.id)}
              >
                Accept job
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
