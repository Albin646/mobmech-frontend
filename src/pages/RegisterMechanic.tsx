import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function RegisterMechanic() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    experience: '',
    specialization: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.registerMechanic({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        experience: Number(form.experience),
        specialization: form.specialization,
      });

      const authUser = await api.loginMechanic({
        email: form.email,
        password: form.password,
      });
      login(authUser);
      navigate('/mechanic');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>
        <Link to="/" className="logo-btn">
          <span className="brand-icon">🔧</span>
          MobMech
        </Link>
        </h2>

        <h1>Join as a mechanic</h1>
        <p className="muted">Accept jobs and grow your mobile repair business</p>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Full name
            <input
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
            />
          </label>

          <label>
            Phone
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              required
            />
          </label>

          <div className="form-row">
            <label>
              Years of experience
              <input
                type="number"
                min="0"
                value={form.experience}
                onChange={(e) => updateField('experience', e.target.value)}
                required
              />
            </label>

            <label>
              Specialization
              <input
                value={form.specialization}
                onChange={(e) => updateField('specialization', e.target.value)}
                required
                placeholder="e.g. Engine, Brakes"
              />
            </label>
          </div>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              required
              minLength={4}
            />
          </label>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
            {loading ? 'Creating account…' : 'Create mechanic account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className='count-text'>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
