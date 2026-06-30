import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function NewRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    vehicleType: '',
    problemDescription: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    try {
      await api.createServiceRequest(
        {
          customerId: user.userId,
          ...form,
        },
        user.token,
      );
      navigate('/customer/requests');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create request');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page narrow">
      <div className="page-header">
        <div>
          <h1>New service request</h1>
          <p className="muted">Tell us what&apos;s wrong and where you are</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form card">
        <label>
          Vehicle type
          <input
            value={form.vehicleType}
            onChange={(e) => updateField('vehicleType', e.target.value)}
            required
            placeholder="e.g. Sedan, SUV, Motorcycle"
          />
        </label>

        <label>
          Problem description
          <textarea
            value={form.problemDescription}
            onChange={(e) => updateField('problemDescription', e.target.value)}
            required
            rows={4}
            placeholder="Describe the issue in detail…"
          />
        </label>

        <label>
          Service location
          <input
            value={form.location}
            onChange={(e) => updateField('location', e.target.value)}
            required
            placeholder="Address or landmark"
          />
        </label>

        {error && <div className="alert alert-error">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit request'}
        </button>
      </form>
    </div>
  );
}
