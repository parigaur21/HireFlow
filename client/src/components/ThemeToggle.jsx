import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`theme-toggle-btn ${isDarkMode ? 'is-dark' : 'is-light'}`}
            aria-label="Toggle Theme"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <div className="icon-wrapper">
                {isDarkMode ? (
                    <Sun className="theme-toggle-icon sun-icon" />
                ) : (
                    <Moon className="theme-toggle-icon moon-icon" />
                )}
            </div>
            <style>{`
        .theme-toggle-btn {
          background: var(--bg-card);
          color: var(--text-main);
          width: 44px;
          height: 44px;
          padding: 0;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-small);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }

        .theme-toggle-btn:hover {
          background: var(--bg-main);
          border-color: var(--primary-color);
          transform: rotate(12deg) scale(1.1);
        }

        .theme-toggle-btn:active {
          transform: scale(0.95);
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        .theme-toggle-icon {
          width: 20px;
          height: 20px;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .sun-icon {
          color: #f59e0b;
          transform: rotate(0);
        }

        .moon-icon {
          color: #6366f1;
          transform: rotate(0);
        }

        .is-dark .sun-icon {
            animation: sunRotate 0.5s ease;
        }

        .is-light .moon-icon {
            animation: moonRotate 0.5s ease;
        }

        @keyframes sunRotate {
            0% { transform: scale(0) rotate(-90deg); opacity: 0; }
            100% { transform: scale(1) rotate(0); opacity: 1; }
        }

        @keyframes moonRotate {
            0% { transform: scale(0) rotate(90deg); opacity: 0; }
            100% { transform: scale(1) rotate(0); opacity: 1; }
        }
      `}</style>
        </button>
    );
};

export default ThemeToggle;
