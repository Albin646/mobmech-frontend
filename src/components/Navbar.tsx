import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const customerLinks = [
    { to: "/customer", label: "Dashboard" },
    { to: "/customer/requests", label: "My Requests" },
    { to: "/customer/new-request", label: "New Request" },
    { to: "/customer/nearby", label: "Nearby Mechanics" },
  ];

  const mechanicLinks = [
    { to: "/mechanic", label: "Dashboard" },
    { to: "/mechanic/pending", label: "Pending Jobs" },
    { to: "/mechanic/jobs", label: "My Jobs" },
  ];

  const links = role === "MECHANIC" ? mechanicLinks : customerLinks;

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">

      <Link to="/" className="brand">
  <span className="brand-icon">🔧</span>
  <span className="logo-btn">MobMech</span>
</Link>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>

          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={
                location.pathname === link.to
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              {link.label}
            </Link>
          ))}

          <span className="user-name">{user?.name}</span>

          <button
            className="btn btn-ghost"
            onClick={handleLogout}
          >
            Logout
          </button>

        </nav>

      </div>
    </header>
  );
}