import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass-effect">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Hire<span>Flow</span>
        </Link>

        <div className="nav-links">
          <NavLink
            to="/jobs"
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            Browse Jobs
          </NavLink>

          {user && (
            <NavLink
              to="/resume-analyzer"
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              Resume Analyzer
            </NavLink>
          )}

          {user ? (
            <>
              {user.role === 'recruiter' ? (
                <NavLink
                  to="/recruiter-dashboard"
                  className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                >
                  Dashboard
                </NavLink>
              ) : (
                <NavLink
                  to="/candidate-dashboard"
                  className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                >
                  Dashboard
                </NavLink>
              )}
              <div className="nav-actions">
                <ThemeToggle />
                <button onClick={handleLogout} className="secondary-btn btn-logout">Logout</button>
              </div>
            </>
          ) : (
            <div className="nav-actions">
              <NavLink
                to="/login"
                className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
              >
                Login
              </NavLink>
              <ThemeToggle />
              <Link to="/register" className="btn-register">Get Started</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          background-color: var(--bg-nav);
          border-bottom: 1px solid var(--border-color);
          padding: 0.75rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.1);
        }
        
        .nav-container {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 3rem;
          box-sizing: border-box;
        }

        .nav-logo {
          font-family: var(--font-heading);
          font-size: 1.85rem;
          font-weight: 900;
          color: var(--text-main);
          text-decoration: none;
          letter-spacing: -0.04em;
        }

        .nav-logo span {
          background: linear-gradient(135deg, var(--primary-color), #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-item {
          text-decoration: none;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.5rem 0.25rem;
          transition: var(--transition);
          position: relative;
        }

        .nav-item:hover {
          color: var(--primary-color);
        }

        .nav-item.active {
          color: var(--primary-color);
        }

        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, var(--primary-color), #7c3aed);
          border-radius: 20px;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-left: 0.5rem;
        }

        .btn-register {
          background-color: var(--primary-color);
          color: white !important;
          padding: 0.65rem 1.5rem;
          border-radius: var(--border-radius-md);
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          transition: var(--transition);
          box-shadow: 0 8px 20px -4px var(--primary-glow);
          font-family: var(--font-heading);
        }

        .btn-register:hover {
          background-color: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -6px var(--primary-glow);
        }

        .btn-logout {
            padding: 0.55rem 1.25rem;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .nav-container { padding: 0 1.5rem; }
          .nav-links { gap: 1rem; }
          .nav-item { display: none; } /* On mobile, usually handled by a menu */
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
