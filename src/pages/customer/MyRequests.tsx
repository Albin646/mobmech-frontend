import { useEffect, useState } from 'react';
import { api, ApiError } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import type { ServiceRequest } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import { useNavigate } from "react-router-dom";

export default function MyRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [showRating, setShowRating] = useState(false);
  const [selectedRequest, setSelectedRequest] =
  useState<number | null>(null);

  const [rating, setRating] = useState(5);

  const submitRating = async () => {

    if (!selectedRequest || !user) return;

    try {

        await api.rateMechanic(
            selectedRequest,
            rating,
            user.token
        );

        alert("Thank you for your rating!");

        setShowRating(false);

    }catch (err: any) {

      console.error(err);
  
      if (err instanceof Error) {
  
          alert(err.message);
  
      } else {
  
          alert("Failed to submit rating");
  
      }
  
  }

};

  useEffect(() => {
    if (!user) return;

    api.getCustomerRequests(user.userId, user.token)
      .then(setRequests)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load requests'))
      .finally(() => setLoading(false));
  }, [user]);

  async function handleComplete(requestId: number) {
    if (!user) return;

    try {

      const updated = await api.completeRequest(
          requestId,
          user.token
      );
  
      setRequests(prev =>
          prev.map(r => r.id === requestId ? updated : r)
      );
  
      setSelectedRequest(requestId);
      setShowRating(true);
  
  } catch (err) {
      setError(
          err instanceof ApiError
              ? err.message
              : "Failed to complete request"
      );
  }
  }
  async function handleCancel(requestId: number) {

    if (!user) return;
    
    try {
    
      const updated = await api.cancelRequest(
        requestId,
        user.token
      );
    
      setRequests(prev =>
        prev.map(r =>
          r.id === requestId ? updated : r
        )
      );
    
    } catch (err) {
    
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to cancel request"
      );
    
    }
    }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My service requests</h1>
          <p className="muted">Track and manage your requests</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="muted">Loading requests…</p>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <p>No service requests yet. Create your first request to get started.</p>
        </div>
      ) : (
        <div className="list">
          {requests.map((request) => (
            <article key={request.id} className="list-card vertical">
              <div className="list-card-header">
                <h3 className='muted'>{request.vehicleType}</h3>
                <StatusBadge status={request.status} />
                {request.status === "ACCEPTED" ? (
  <button
    className="btn btn-primary"
    onClick={() => navigate(`/customer/tracking/${request.id}`)}
  >
    Track Mechanic
  </button>
) : request.status === "COMPLETED" ? (
  <span className="muted">✅ Service Completed</span>
) : null}

{request.status === "PENDING" && (
  <button
    className="btn btn-danger"
    onClick={() => handleCancel(request.id)}
  >
    Cancel Request
  </button>
)}

{request.status === "COMPLETED" && (
  <button
  className='btn btn-primary'
    onClick={() => {
      setSelectedRequest(request.id);
      setShowRating(true);
    }}
  >
    Rate Mechanic
  </button>
)}
              </div>
              <p>{request.problemDescription}</p>
              <p className="muted">📍 {request.location}</p>
              {request.mechanic && (
                <p className="muted">
                  Mechanic: {request.mechanic.user.name} ({request.mechanic.specialization})
                </p>
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
{showRating && (
  <div className="modal-overlay">
    <div className="rating-modal">
      <h2>⭐ Rate your Mechanic</h2>

      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="star-btn"
          >
            {star <= rating ? "⭐" : "☆"}
          </button>
        ))}
      </div>

      <div className="modal-buttons">
        <button className="btn btn-primary" onClick={submitRating}>
          Submit Rating
        </button>

        <button
          className="btn"
          onClick={() => setShowRating(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
