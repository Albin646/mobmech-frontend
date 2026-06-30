import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="landing">
      <div className="landing-hero">
        <div className="hero-badge">MobMech</div>
        <h1>Get back on the road, fast.</h1>
        <h6 className= "welcome-text muted2">
          MobMech connects drivers with trusted mobile mechanics. Request help,
          find nearby pros........
          <p>
          </p>
  
        </h6>

        <div className="hero-actions">
          <Link to="/register/customer" className="btn btn-secondary">
            I need a mechanic
          </Link>
          <Link to="/register/mechanic" className="btn btn-secondary">
            I&apos;m a mechanic
          </Link>
          <Link to="/login" className="btn btn-primary">
            Sign in
          </Link>
        </div>
      </div>

      <div className="feature-grid">
        <article className="feature-card">
          <h3>For customers</h3>
          <p>Create service requests, share your location, and browse nearby mechanics sorted by distance.</p>
        </article>
        <article className="feature-card">
          <h3>For mechanics</h3>
          <p>View pending jobs in your area, accept requests, and manage your assigned work from one dashboard.</p>
        </article>
        <article className="feature-card">
          <h3>End-to-end tracking</h3>
          <p>Every request moves from pending to accepted to completed — visible to both sides in real time.</p>
        </article>
      </div>
    </div>
  );
}
