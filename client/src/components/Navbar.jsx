import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';
import { Sun, Moon, User, MessageSquare, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Hire<span>Flow</span>
        </Link>

        {/* Mobile menu button */}
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`nav-links ${mobileOpen ? 'nav-links-open' : ''}`}>
          <NavLink
            to="/jobs"
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            onClick={() => setMobileOpen(false)}
          >
            Browse Jobs
          </NavLink>

          {user && (
            <>
              <NavLink
                to="/resume-analyzer"
                className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                onClick={() => setMobileOpen(false)}
              >
                Resume Analyzer
              </NavLink>
              <NavLink
                to="/analytics"
                className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                onClick={() => setMobileOpen(false)}
              >
                <BarChart3 size={16} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                Analytics
              </NavLink>
            </>
          )}

          {user ? (
            <>
              {user.role === 'recruiter' ? (
                <NavLink
                  to="/recruiter-dashboard"
                  className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </NavLink>
              ) : (
                <NavLink
                  to="/candidate-dashboard"
                  className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </NavLink>
              )}

              <div className="nav-actions">
                <NavLink to="/chat" className="nav-icon-btn" title="Messages" onClick={() => setMobileOpen(false)}>
                  <MessageSquare size={20} />
                </NavLink>

                <NotificationBell />

                <button onClick={toggleTheme} className="nav-icon-btn" title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}>
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <NavLink to="/profile" className="nav-avatar" title="Profile" onClick={() => setMobileOpen(false)}>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </NavLink>

                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </div>
            </>
          ) : (
            <>
              <button onClick={toggleTheme} className="nav-icon-btn" title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <NavLink
                to="/login"
                className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                onClick={() => setMobileOpen(false)}
              >
                Login
              </NavLink>
              <Link to="/register" className="btn-register" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          background-color: var(--card-bg);
          border-bottom: 1px solid var(--border-color);
          padding: 0.85rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
          transition: background-color 0.3s, border-color 0.3s;
        }
        .nav-container {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
          box-sizing: border-box;
        }
        .nav-logo {
          font-size: 1.75rem;
          font-weight: 900;
          color: var(--text-main);
          text-decoration: none;
          letter-spacing: -0.03em;
        }
        .nav-logo span {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .nav-item {
          text-decoration: none;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.92rem;
          padding: 0.5rem 0.25rem;
          transition: all 0.2s ease;
          position: relative;
          display: flex;
          align-items: center;
          white-space: nowrap;
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
          height: 2.5px;
          background: linear-gradient(90deg, #2563eb, #3b82f6);
          border-radius: 2px;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: 0.5rem;
        }
        .nav-icon-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: none;
          text-decoration: none;
        }
        .nav-icon-btn:hover {
          background: rgba(37,99,235,0.08);
          color: var(--primary-color);
          transform: none;
          box-shadow: none;
        }
        .nav-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #8b5cf6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          flex-shrink: 0;
        }
        .nav-avatar:hover {
          transform: scale(1.08);
          box-shadow: 0 2px 12px rgba(37,99,235,0.3);
        }
        .btn-logout {
          background: var(--border-color);
          color: var(--text-muted);
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          font-weight: 700;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-logout:hover {
          background: rgba(239,68,68,0.1);
          color: #ef4444;
          border-color: rgba(239,68,68,0.2);
          box-shadow: none;
          transform: none;
        }
        .btn-register {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white !important;
          padding: 0.6rem 1.4rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(37,99,235,0.25);
          white-space: nowrap;
        }
        .btn-register:hover {
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(37,99,235,0.35);
        }
        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-main);
          cursor: pointer;
          padding: 0.5rem;
          box-shadow: none;
        }
        .mobile-menu-btn:hover {
          transform: none;
          box-shadow: none;
        }

        @media (max-width: 900px) {
          .mobile-menu-btn {
            display: flex;
            align-items: center;
          }
          .nav-links {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--card-bg);
            padding: 1rem 2rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            gap: 0.75rem;
            z-index: 999;
          }
          .nav-links-open {
            display: flex !important;
          }
          .nav-actions {
            margin-left: 0;
            justify-content: center;
            flex-wrap: wrap;
          }
          .nav-item.active::after {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
