import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Building2, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

const JobCard = ({ job, loading: isLoading }) => {
  const { user } = useAuth();
  const [applied, setApplied] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleApply = async () => {
    setBtnLoading(true);
    setMessage('');
    try {
      const response = await api.post('/applications', { job: job._id });
      if (response.data.success) {
        setApplied(true);
        setMessage('Application sent successfully!');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to apply. Please try again.');
    } finally {
      setBtnLoading(false);
    }
  };

  const isCandidate = user?.role === 'candidate';

  if (isLoading) {
    return (
      <div className="jc-wrap jc-skeleton">
        <div className="jc-inner">
          <div className="sk-line w50" style={{ height: 14, marginBottom: 10 }}></div>
          <div className="sk-line w90" style={{ height: 20, marginBottom: 14 }}></div>
          <div className="sk-line w100" style={{ height: 11, marginBottom: 5 }}></div>
          <div className="sk-line w70" style={{ height: 11, marginBottom: 20 }}></div>
          <div className="sk-divider"></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="sk-line w30" style={{ height: 14 }}></div>
            <div className="sk-line w20" style={{ height: 30, borderRadius: 8 }}></div>
          </div>
        </div>
        <style>{`
          .sk-line { background: var(--border-color); opacity: 0.5; border-radius:5px; position:relative; overflow:hidden; }
          .sk-line::after { content:""; position:absolute; inset:0; transform:translateX(-100%); background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent); animation:sk-shimmer 1.8s infinite; }
          @keyframes sk-shimmer { 100%{transform:translateX(100%)} }
          .w100{width:100%} .w90{width:90%} .w70{width:70%} .w50{width:50%} .w30{width:30%} .w20{width:20%}
          .sk-divider{height:1px; background: var(--border-color); margin:8px 0;}
        `}</style>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="jc-wrap glass-effect">
      <div className="jc-accent"></div>
      <div className="jc-inner">
        <div className="jc-badges">
          <span className="badge-company">
            <Building2 size={12} />
            {job.company}
          </span>
          <span className="badge-date">
            <Calendar size={12} />
            {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <h3 className="jc-title">{job.title}</h3>
        <p className="jc-desc">
          {job.description && job.description.length > 100
            ? `${job.description.substring(0, 100)}...`
            : job.description}
        </p>

        <div className="jc-footer">
          <Link to={`/jobs/${job._id}`} className="jc-link">
            Details <ArrowRight size={14} />
          </Link>
          {isCandidate && (
            <button
              onClick={handleApply}
              disabled={applied || btnLoading}
              className={applied ? 'jc-btn-done' : 'jc-btn-apply'}
            >
              {btnLoading ? '...' : applied ? <><CheckCircle2 size={14} /> Applied</> : 'Apply'}
            </button>
          )}
        </div>
        {message && <div className={`jc-msg ${applied ? 'ok' : 'err'}`}>{message}</div>}
      </div>

      <style>{`
        .jc-wrap {
          background: var(--bg-card);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--border-color);
          transition: var(--transition);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .jc-wrap:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 40px -15px var(--primary-glow);
          border-color: var(--primary-color);
        }

        .jc-accent {
          height: 4px;
          background: linear-gradient(90deg, var(--primary-color) 0%, #7c3aed 100%);
          flex-shrink: 0;
          opacity: 0.8;
        }

        .jc-inner {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .jc-badges {
          display: flex; gap: 0.75rem; margin-bottom: 0.85rem; flex-wrap: wrap;
        }

        .badge-company {
          background: var(--primary-glow);
          color: var(--primary-color);
          padding: 0.35rem 0.65rem; border-radius: 8px;
          font-size: 0.65rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.05em;
          display: flex; align-items: center; gap: 4px;
        }

        .badge-date {
          background: var(--bg-main);
          color: var(--text-muted);
          padding: 0.35rem 0.65rem; border-radius: 8px;
          font-size: 0.65rem; font-weight: 600;
          display: flex; align-items: center; gap: 4px;
          border: 1px solid var(--border-color);
        }

        .jc-title {
          font-family: var(--font-heading);
          font-size: 1.25rem; font-weight: 700;
          color: var(--text-main); letter-spacing: -0.02em;
          line-height: 1.2; margin: 0 0 0.75rem;
        }

        .jc-desc {
          font-size: 0.875rem; color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 1.5rem;
          flex: 1;
        }

        .jc-footer {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .jc-link {
          color: var(--primary-color); font-weight: 700; font-size: 0.85rem;
          text-decoration: none; transition: var(--transition);
          display: flex; align-items: center; gap: 4px;
        }

        .jc-link:hover { transform: translateX(3px); }

        .jc-btn-apply {
          background-color: var(--primary-color) !important;
          color: white !important;
          padding: 0.5rem 1.1rem !important;
          font-size: 0.85rem !important;
          border-radius: 10px !important;
        }

        .jc-btn-done {
          background-color: #10b981 !important;
          color: white !important;
          padding: 0.5rem 1.1rem !important;
          font-size: 0.85rem !important;
          border-radius: 10px !important;
          display: flex; align-items: center; gap: 4px;
          cursor: default;
          box-shadow: none !important;
          transform: none !important;
        }

        .jc-msg {
          font-size: 0.75rem; padding: 0.5rem;
          border-radius: 8px; text-align: center; margin-top: 1rem;
          font-weight: 600;
        }
        .jc-msg.ok { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .jc-msg.err { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
      `}</style>
    </div>
  );
};

export default JobCard;
