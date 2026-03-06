import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/JobCard';
import { SearchX, Briefcase, Building2, Workflow, Search, TrendingUp, Shield, Zap, Filter, ArrowRight } from 'lucide-react';

const JobList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Query State
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/jobs', {
        params: { page, limit, search, company }
      });
      if (response.data.success) {
        setJobs(response.data.data.jobs);
        setTotalPages(response.data.data.pages);
      }
    } catch (err) {
      console.error('Fetch Jobs Error:', err);
      setError(`Failed to load jobs: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, company]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchJobs(); }, 500);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1); };
  const handleCompanyChange = (e) => { setCompany(e.target.value); setPage(1); };

  const activeJobsCount = jobs.length;
  const uniqueCompaniesCount = new Set(jobs.map(j => j.company)).size;

  return (
    <div className="job-list-page fade-in">
      {/* ─── HERO SECTION ─── */}
      <section className="hero-banner">
        <div className="hero-mesh"></div>
        <div className="hero-blob b1"></div>
        <div className="hero-blob b2"></div>

        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <Zap size={14} fill="currentColor" />
              <span>Explore {activeJobsCount > 0 ? activeJobsCount : ''} Active Opportunities</span>
            </div>
            <h1>Your Future <br /><span className="gradient-text">Starts Here.</span></h1>
            <p className="hero-subtitle">
              Discover verified roles from top-tier companies. Our matching engine helps you find the perfect position faster than ever.
            </p>
            <div className="hero-actions">
              <button className="primary-btn pulse-effect" onClick={() => navigate('/register')}>Get Started Now <ArrowRight size={18} /></button>
              <div className="mini-avatars">
                <img src="https://ui-avatars.com/api/?name=JS&background=random" alt="user" />
                <img src="https://ui-avatars.com/api/?name=RB&background=random" alt="user" />
                <img src="https://ui-avatars.com/api/?name=SK&background=random" alt="user" />
                <span>Join 500+ professionals</span>
              </div>
            </div>
          </div>

          <div className="hero-metrics">
            <div className="metric-card glass-effect">
              <div className="metric-icon blue"><Briefcase size={24} /></div>
              <div className="metric-info">
                <span className="metric-val">{activeJobsCount}</span>
                <span className="metric-label">Active Roles</span>
              </div>
            </div>
            <div className="metric-card glass-effect">
              <div className="metric-icon purple"><Building2 size={24} /></div>
              <div className="metric-info">
                <span className="metric-val">{uniqueCompaniesCount}</span>
                <span className="metric-label">Companies</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="main-content-layout">
        <div className="jobs-container">
          {/* ─── SEARCH & FILTERS ─── */}
          <div className="filter-section card">
            <div className="search-group">
              <div className="input-with-icon">
                <Search size={20} className="input-icon" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or skills..."
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="divider-line"></div>
              <div className="input-with-icon">
                <Building2 size={20} className="input-icon" />
                <input
                  type="text"
                  placeholder="Filter by company..."
                  value={company}
                  onChange={handleCompanyChange}
                />
              </div>
            </div>
          </div>

          <div className="section-header">
            <h2 className="section-title">Latest <span className="gradient-text">Openings</span></h2>
            <div className="status-indicator">
              <span className="pulse-dot"></span>
              {loading ? 'Refreshing...' : `Found ${activeJobsCount} positions`}
            </div>
          </div>

          {loading ? (
            <div className="jobs-grid">
              {[1, 2, 3, 4, 5, 6].map(i => <JobCard key={i} loading={true} />)}
            </div>
          ) : error ? (
            <div className="error-banner card">
              <p>{error}</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="jobs-grid">
              {jobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="empty-state-card glass-effect">
              <div className="empty-icon-bg">
                <SearchX size={48} strokeWidth={1} />
              </div>
              <h3>No match found</h3>
              <p>Try broadening your search criteria or clearing filters to see all available roles.</p>
              <button className="secondary-btn" onClick={() => { setSearch(''); setCompany(''); }}>Clear All Filters</button>
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="pagination-wrapper">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="secondary-btn">← Prev</button>
              <div className="page-indicator">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`page-dot ${page === p ? 'active' : ''}`}
                  >{p}</button>
                ))}
              </div>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="secondary-btn">Next →</button>
            </div>
          )}
        </div>

        {/* ─── INSIGHTS SIDEBAR ─── */}
        <aside className="insights-aside">
          <div className="sticky-sidebar">
            <div className="insight-card glass-effect">
              <div className="insight-badge">New Features</div>
              <h3>Resume IQ Analyzer</h3>
              <p>Upload your resume and get instant matching scores with current job openings using our AI engine.</p>
              <button className="primary-btn small-btn" onClick={() => navigate('/resume-analyzer')}>Try Analyzer <Zap size={14} /></button>
            </div>

            <div className="trust-card card">
              <h3>Why HireFlow?</h3>
              <div className="benefit-item">
                <div className="benefit-icon blue"><Shield size={18} /></div>
                <div>
                  <h4>Verified Roles</h4>
                  <p>100% direct company listings</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon green"><TrendingUp size={18} /></div>
                <div>
                  <h4>Real-time Tracking</h4>
                  <p>Live application status updates</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .job-list-page {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          padding-top: 1.5rem;
        }

        /* Hero Styling */
        .hero-banner {
          position: relative;
          background: var(--bg-card);
          border-radius: var(--border-radius-lg);
          padding: 4rem;
          overflow: hidden;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-premium);
          display: flex;
          min-height: 480px;
        }

        .hero-mesh {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(var(--primary-color) 0.5px, transparent 0.5px);
          background-size: 24px 24px;
          opacity: 0.05;
          mask-image: linear-gradient(to bottom, black, transparent);
        }

        .hero-blob {
            position: absolute;
            width: 500px; height: 500px;
            filter: blur(80px);
            opacity: 0.15;
            border-radius: 50%;
            z-index: 0;
        }
        .b1 { top: -200px; left: -100px; background: var(--primary-color); }
        .b2 { bottom: -200px; right: -100px; background: #7c3aed; }

        .hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          gap: 4rem;
        }

        .hero-text { flex: 1.2; }
        .hero-text h1 { font-size: 4rem; margin-bottom: 1.5rem; }
        .hero-subtitle { font-size: 1.15rem; color: var(--text-muted); max-width: 540px; margin-bottom: 2.5rem; line-height: 1.7; }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--primary-color);
          color: white;
          padding: 0.5rem 1rem; border-radius: 100px;
          font-size: 0.75rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.05em;
          margin-bottom: 2rem;
          box-shadow: 0 10px 20px -5px var(--primary-glow);
        }

        .hero-actions { display: flex; align-items: center; gap: 2.5rem; }
        .mini-avatars { display: flex; align-items: center; gap: -8px; }
        .mini-avatars img { 
            width: 36px; height: 36px; border-radius: 50%; 
            border: 3px solid var(--bg-card);
            margin-left: -12px;
        }
        .mini-avatars img:first-child { margin-left: 0; }
        .mini-avatars span { margin-left: 12px; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }

        .hero-metrics { display: flex; flex-direction: column; gap: 1.5rem; flex: 0.8; }
        .metric-card {
            padding: 1.75rem;
            display: flex; align-items: center; gap: 1.5rem;
            border-radius: var(--border-radius-md);
        }
        .metric-icon {
            width: 56px; height: 56px; border-radius: 16px;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
        }
        .metric-icon.blue { background: rgba(37, 99, 235, 0.1); color: var(--primary-color); }
        .metric-icon.purple { background: rgba(124, 58, 237, 0.1); color: #7c3aed; }
        .metric-val { font-size: 2rem; font-weight: 900; line-height: 1; display: block; }
        .metric-label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }

        /* Main Content Layout */
        .main-content-layout {
            display: grid;
            grid-template-columns: 1fr 360px;
            gap: 3rem;
        }

        .filter-section { padding: 0.75rem; margin-bottom: 2.5rem; border-radius: var(--border-radius-md); }
        .search-group { display: flex; align-items: center; gap: 0.5rem; }
        .input-with-icon { flex: 1; position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 1.25rem; color: var(--text-muted); opacity: 0.6; pointer-events: none; }
        .input-with-icon input { padding-left: 3.5rem; border: none; background: transparent; box-shadow: none; }
        .input-with-icon input:focus { transform: none; box-shadow: none; }
        
        .divider-line { width: 1px; height: 32px; background: var(--border-color); }

        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .section-title { font-size: 1.75rem; font-weight: 800; }
        .status-indicator { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
        .pulse-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; position: relative; }
        .pulse-dot::after {
            content: ''; position: absolute; inset: 0; border-radius: 50%;
            background: #10b981; animation: pulse 2s infinite;
        }
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(3); opacity: 0; } }

        .jobs-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
        }

        /* Sidebar Styling */
        .sticky-sidebar { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 1.5rem; }
        .insight-card { padding: 2rem; border-radius: var(--border-radius-lg); }
        .insight-badge { 
            display: inline-block; background: var(--primary-color); color: white;
            padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.65rem; font-weight: 800;
            text-transform: uppercase; margin-bottom: 1.25rem;
        }
        .insight-card h3 { font-size: 1.25rem; margin-bottom: 1rem; }
        .insight-card p { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6; }
        .small-btn { padding: 0.6rem 1.25rem; font-size: 0.85rem; }

        .trust-card h3 { font-size: 1rem; margin-bottom: 1.5rem; font-weight: 800; }
        .benefit-item { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        .benefit-icon { 
            width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
        }
        .benefit-icon.blue { background: rgba(37, 99, 235, 0.05); color: var(--primary-color); }
        .benefit-icon.green { background: rgba(16, 185, 129, 0.05); color: #10b981; }
        .benefit-item h4 { font-size: 0.9rem; margin-bottom: 2px; font-weight: 700; }
        .benefit-item p { font-size: 0.75rem; color: var(--text-muted); margin: 0; }

        /* Pagination Dots */
        .pagination-wrapper { display: flex; justify-content: center; align-items: center; gap: 2rem; margin-top: 3rem; }
        .page-indicator { display: flex; gap: 0.5rem; }
        .page-dot {
            width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border-color);
            background: var(--bg-card); color: var(--text-muted); font-size: 0.75rem; font-weight: 700;
            cursor: pointer; transition: var(--transition);
        }
        .page-dot.active { background: var(--primary-color); color: white; border-color: var(--primary-color); transform: scale(1.1); }

        .pulse-effect:hover { animation: subtle-pulse 2s infinite; }
        @keyframes subtle-pulse { 0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); } 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); } }

        @media (max-width: 1200px) {
            .main-content-layout { grid-template-columns: 1fr; }
            .hero-content { flex-direction: column; text-align: center; }
            .hero-subtitle { margin-inline: auto; }
            .hero-actions { justify-content: center; }
            .hero-metrics { flex-direction: row; width: 100%; }
            .metric-card { flex: 1; }
        }

        @media (max-width: 768px) {
            .jobs-grid { grid-template-columns: 1fr; }
            .hero-text h1 { font-size: 2.5rem; }
            .hero-metrics { flex-direction: column; }
            .search-group { flex-direction: column; align-items: stretch; }
            .divider-line { display: none; }
        }
      `}</style>
    </div>
  );
};

export default JobList;
