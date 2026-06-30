import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<'CUSTOMER' | 'MECHANIC'>('CUSTOMER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authUser = role === 'CUSTOMER'
        ? await api.loginCustomer({ email, password })
        : await api.loginMechanic({ email, password });

        console.log("AUTH USER:", authUser);

      login(authUser);
      navigate(role === 'CUSTOMER' ? '/customer' : '/mechanic');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="logo-btn">
        <h2>
          <span className="brand-icon">🔧</span>
          MobMech
          </h2>
        </Link>

        <h1>Welcome back</h1>
        <p>Sign in to your account</p>

        <div className="role-toggle">
          <button
            type="button"
            className={role === 'CUSTOMER' ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setRole('CUSTOMER')}
          >
            Customer
          </button>
          <button
            type="button"
            className={role === 'MECHANIC' ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setRole('MECHANIC')}
          >
            Mechanic
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </label>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to={role === 'CUSTOMER' ? '/register/customer' : '/register/mechanic'} className='count-text'>
            Register as {role === 'CUSTOMER' ? 'customer' : 'mechanic'}
          </Link>
        </p>
      </div>
    </div>
  );
}
