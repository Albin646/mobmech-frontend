import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function Navbar() {
  const { user, logout, role } = useAuth();
  const location = useLocation();

  const customerLinks = [
    { to: '/customer', label: 'Dashboard' },
    { to: '/customer/requests', label: 'My Requests' },
    { to: '/customer/new-request', label: 'New Request' },
    { to: '/customer/nearby', label: 'Nearby Mechanics' },
  ];

  const mechanicLinks = [
    { to: '/mechanic', label: 'Dashboard' },
    { to: '/mechanic/pending', label: 'Pending Jobs' },
    { to: '/mechanic/jobs', label: 'My Jobs' },
  ];

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const links = role === 'MECHANIC' ? mechanicLinks : customerLinks;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand logo-btn">
          <span className="brand-icon">🔧</span>
          MobMech
        </Link>

        <nav className="nav-links">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? 'nav-link active' : 'nav-link'}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-user">
          <span className="user-name">{user?.name}</span>
          <button type="button" className="btn btn-ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
