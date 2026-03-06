import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    CheckCircle2,
    Send,
    Users,
    Code,
    UserCheck,
    Gift,
    PartyPopper,
    Clock,
    Briefcase,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    Calendar,
    Building2,
    LayoutDashboard
} from 'lucide-react';

const PIPELINE_STAGES = [
    { key: 'Applied', label: 'Applied', icon: <Send size={14} /> },
    { key: 'Screening', label: 'Screening', icon: <Users size={14} /> },
    { key: 'Interview', label: 'Interview', icon: <Users size={14} /> },
    { key: 'Technical', label: 'Technical', icon: <Code size={14} /> },
    { key: 'HR', label: 'HR', icon: <UserCheck size={14} /> },
    { key: 'Offer', label: 'Offer', icon: <Gift size={14} /> },
    { key: 'Hired', label: 'Hired', icon: <PartyPopper size={14} /> },
];

const CandidateDashboard = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/applications/my');
                if (res.data.success) {
                    setApplications(res.data.data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const total = applications.length;
    const active = applications.filter(a => !['Hired', 'Rejected', 'Offer'].includes(a.status)).length;
    const offers = applications.filter(a => ['Offer', 'Hired'].includes(a.status)).length;

    const getStageIndex = (status) => {
        if (status === 'Rejected') return -1;
        return PIPELINE_STAGES.findIndex(s => s.key === status);
    };

    if (loading) {
        return (
            <div className="cd-loader">
                <div className="spinner"></div>
                <span>Syncing your applications...</span>
            </div>
        );
    }

    return (
        <div className="cd-wrapper fade-in">
            {/* ───────── HERO SECTION ───────── */}
            <header className="cd-hero-section">
                <div className="hero-blur"></div>
                <div className="hero-content">
                    <div className="hero-main">
                        <div className="hero-badge">
                            <LayoutDashboard size={14} />
                            <span>Candidate Portal</span>
                        </div>
                        <h1>Hello, <span className="gradient-text">{user?.name?.split(' ')[0]}</span></h1>
                        <p>Track your job journey and monitor career milestones in real-time.</p>
                    </div>

                    <div className="hero-metrics">
                        <div className="metric-item glass-effect">
                            <div className="m-icon blue"><Briefcase size={20} /></div>
                            <div className="m-text">
                                <span className="m-val">{total}</span>
                                <span className="m-label">Applied</span>
                            </div>
                        </div>
                        <div className="metric-item glass-effect">
                            <div className="m-icon amber"><Clock size={20} /></div>
                            <div className="m-text">
                                <span className="m-val">{active}</span>
                                <span className="m-label">In Progress</span>
                            </div>
                        </div>
                        <div className="metric-item glass-effect">
                            <div className="m-icon green"><TrendingUp size={20} /></div>
                            <div className="m-text">
                                <span className="m-val">{offers}</span>
                                <span className="m-label">Offers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="cd-layout">
                {/* ───────── MAIN PIPELINE ───────── */}
                <main className="cd-content">
                    <div className="section-header-compact">
                        <h2>Application <span className="gradient-text">Timeline</span></h2>
                        <div className="live-status">
                            <span className="dot-pulse"></span>
                            Live Updates
                        </div>
                    </div>

                    {applications.length === 0 ? (
                        <div className="empty-state-dashboard card glass-effect">
                            <Briefcase size={48} strokeWidth={1} />
                            <h3>No applications yet</h3>
                            <p>Browse the job list and start your journey today.</p>
                            <Link to="/jobs"><button className="primary-btn">Explore Jobs</button></Link>
                        </div>
                    ) : (
                        <div className="apps-stack">
                            {applications.map(app => {
                                const currentIdx = getStageIndex(app.status);
                                const isExpanded = expandedId === app._id;
                                const isRejected = app.status === 'Rejected';

                                return (
                                    <div key={app._id} className={`app-row card ${isRejected ? 'rejected-theme' : ''}`}>
                                        <div className="app-row-header">
                                            <div className="app-info">
                                                <div className="company-logo-mini">
                                                    {app.job?.company?.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3>{app.job?.title}</h3>
                                                    <div className="meta">
                                                        <span className="company"><Building2 size={12} /> {app.job?.company}</span>
                                                        <span className="divider"></span>
                                                        <span className="date"><Calendar size={12} /> {new Date(app.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="app-status-badge">
                                                <span className={`status-pill ${app.status.toLowerCase()}`}>{app.status}</span>
                                                <button
                                                    className="expand-btn"
                                                    onClick={() => setExpandedId(isExpanded ? null : app._id)}
                                                >
                                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pipeline-visual">
                                            <div className="pipeline-line">
                                                <div className="progress-fill" style={{ width: isRejected ? '0%' : `${(Math.max(0, currentIdx) / (PIPELINE_STAGES.length - 1)) * 100}%` }}></div>
                                            </div>
                                            <div className="pipeline-dots">
                                                {PIPELINE_STAGES.map((stage, i) => {
                                                    const isDone = !isRejected && currentIdx >= i;
                                                    const isCurrent = !isRejected && currentIdx === i;
                                                    return (
                                                        <div key={stage.key} className={`dot-wrap ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                                                            <div className="p-dot">
                                                                {isDone ? <CheckCircle2 size={12} /> : i + 1}
                                                            </div>
                                                            <span className="p-label">{stage.label}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="app-details-expanded fade-in">
                                                <div className="expanded-grid">
                                                    <div className="history-col">
                                                        <h4>Activity History</h4>
                                                        <div className="timeline-mini">
                                                            {app.history?.map((entry, idx) => (
                                                                <div key={idx} className="timeline-item-mini">
                                                                    <div className="t-marker"></div>
                                                                    <div className="t-content">
                                                                        <div className="t-header">
                                                                            <strong>{entry.status}</strong>
                                                                            <span>{new Date(entry.changedAt).toLocaleDateString()}</span>
                                                                        </div>
                                                                        {entry.note && <p>{entry.note}</p>}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="actions-col">
                                                        <h4>Quick Actions</h4>
                                                        <div className="action-buttons">
                                                            <Link to={`/jobs/${app.job?._id}`}><button className="secondary-btn small-btn">View Job Post</button></Link>
                                                            <button className="secondary-btn small-btn" disabled>Message Recruiter</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>

                {/* ───────── SIDEBAR ───────── */}
                <aside className="cd-aside">
                    <div className="sidebar-card-premium glass-effect">
                        <div className="accent-bar"></div>
                        <h3>Smart Insights</h3>
                        <div className="insight-row">
                            <span>Profile Strength</span>
                            <div className="progress-bar"><div className="fill" style={{ width: '75%' }}></div></div>
                        </div>
                        <div className="stats-mini">
                            <div className="s-box">
                                <span className="s-label">Success Rate</span>
                                <span className="s-val">{total ? Math.round((offers / total) * 100) : 0}%</span>
                            </div>
                            <div className="s-box">
                                <span className="s-label">Top Skill</span>
                                <span className="s-val">React</span>
                            </div>
                        </div>
                    </div>

                    <div className="pro-card card">
                        <h4>Go Premium</h4>
                        <p>Get featured in recruiter searches and see how you rank against other applicants.</p>
                        <button className="upgrade-btn">Upgrade Now</button>
                    </div>
                </aside>
            </div>

            <style>{`
                .app-container { max-width: 1440px !important; padding: 0 2rem 2rem !important; margin: 0 auto !important; }
                
                .cd-wrapper { display: flex; flex-direction: column; gap: 2.5rem; padding-top: 1.5rem; }

                /* Hero Section */
                .cd-hero-section {
                    position: relative;
                    background: var(--bg-card);
                    border-radius: var(--border-radius-lg);
                    padding: 3rem;
                    overflow: hidden;
                    border: 1px solid var(--border-color);
                    box-shadow: var(--shadow-premium);
                }

                .hero-blur {
                    position: absolute; top: -50px; right: -50px; width: 300px; height: 300px;
                    background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%);
                    border-radius: 50%; opacity: 0.4;
                }

                .hero-content { position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center; gap: 2rem; }
                
                .hero-main h1 { font-size: 3rem; margin-bottom: 0.5rem; }
                .hero-main p { color: var(--text-muted); font-size: 1.1rem; }
                .hero-badge {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: var(--primary-color); color: white;
                    padding: 0.4rem 0.85rem; border-radius: 100px;
                    font-size: 0.7rem; font-weight: 800; text-transform: uppercase; margin-bottom: 1.5rem;
                }

                .hero-metrics { display: flex; gap: 1rem; }
                .metric-item { 
                    padding: 1.25rem; border-radius: 16px; min-width: 140px;
                    display: flex; align-items: center; gap: 1rem;
                }
                .m-icon { 
                    width: 44px; height: 44px; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                }
                .m-icon.blue { background: rgba(37, 99, 235, 0.1); color: var(--primary-color); }
                .m-icon.amber { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
                .m-icon.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                .m-val { display: block; font-size: 1.5rem; font-weight: 900; line-height: 1; color: var(--text-main); }
                .m-label { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

                /* Layout */
                .cd-layout { display: grid; grid-template-columns: 1fr 340px; gap: 2.5rem; }
                
                .section-header-compact { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .cd-content h2 { font-size: 1.5rem; margin: 0; }
                .live-status { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 700; color: #10b981; }
                .dot-pulse { width: 8px; height: 8px; border-radius: 50%; background: #10b981; animation: dot-pulse 2s infinite; }
                @keyframes dot-pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }

                .apps-stack { display: flex; flex-direction: column; gap: 1rem; }
                .app-row { padding: 1.5rem; border-radius: 20px; transition: var(--transition); }
                .app-row:hover { border-color: var(--primary-color); transform: none; }
                
                .app-row-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .app-info { display: flex; gap: 1.25rem; align-items: center; }
                .company-logo-mini {
                    width: 48px; height: 48px; border-radius: 12px; background: var(--bg-main);
                    color: var(--primary-color); display: flex; align-items: center; justify-content: center;
                    font-size: 1.25rem; font-weight: 900; border: 1px solid var(--border-color);
                }
                .app-info h3 { font-size: 1.15rem; margin-bottom: 0.25rem; }
                .meta { display: flex; align-items: center; gap: 0.75rem; color: var(--text-muted); font-size: 0.8rem; font-weight: 600; }
                .meta span { display: flex; align-items: center; gap: 4px; }
                .divider { width: 1px; height: 12px; background: var(--border-color); }
                
                .app-status-badge { display: flex; align-items: center; gap: 1rem; }
                .status-pill { 
                    padding: 0.4rem 1rem; border-radius: 100px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;
                    background: var(--bg-main); border: 1px solid var(--border-color); color: var(--text-muted);
                }
                .status-pill.applied { background: #eff6ff; color: #2563eb; border-color: #dbeafe; }
                .status-pill.hired { background: #f0fdf4; color: #10b981; border-color: #dcfce7; }
                .status-pill.rejected { background: #fef2f2; color: #ef4444; border-color: #fee2e2; }
                .expand-btn { background: transparent; color: var(--text-muted); padding: 0.5rem; min-width: 0; box-shadow: none; border: 1px solid var(--border-color); width: 36px; height: 36px; }
                .expand-btn:hover { background: var(--bg-main); color: var(--primary-color); }

                /* Pipeline Visual */
                .pipeline-visual { position: relative; padding: 0 1rem 1rem; }
                .pipeline-line { position: absolute; top: 15px; left: 2.5rem; right: 2.5rem; height: 3px; background: var(--border-color); border-radius: 10px; z-index: 0; }
                .progress-fill { height: 100%; background: linear-gradient(90deg, var(--primary-color), #7c3aed); border-radius: 10px; transition: width 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .pipeline-dots { display: flex; justify-content: space-between; position: relative; z-index: 1; }
                .dot-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; width: 60px; }
                .p-dot { 
                    width: 32px; height: 32px; border-radius: 50%; background: var(--bg-card); 
                    border: 2px solid var(--border-color); color: var(--text-muted);
                    display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800;
                    transition: var(--transition);
                }
                .p-label { font-size: 0.625rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; white-space: nowrap; }
                
                .dot-wrap.done .p-dot { background: var(--primary-color); border-color: var(--primary-color); color: white; }
                .dot-wrap.done .p-label { color: var(--primary-color); }
                .dot-wrap.current .p-dot { border-color: var(--primary-color); box-shadow: 0 0 0 4px var(--primary-glow); }

                .rejected-theme { border-left: 4px solid #ef4444 !important; opacity: 0.85; }
                .rejected-theme .progress-fill { background: #ef4444; }

                /* Expanded */
                .app-details-expanded { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); }
                .expanded-grid { display: grid; grid-template-columns: 1fr 200px; gap: 2rem; }
                .expanded-grid h4 { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 1.25rem; }
                
                .timeline-mini { display: flex; flex-direction: column; gap: 1.25rem; }
                .timeline-item-mini { display: flex; gap: 1rem; position: relative; }
                .t-marker { width: 10px; height: 10px; border-radius: 50%; background: var(--primary-color); margin-top: 4px; flex-shrink: 0; }
                .timeline-item-mini:not(:last-child)::after { content: ''; position: absolute; left: 4px; top: 14px; bottom: -14px; width: 2px; background: var(--border-color); }
                .t-header { display: flex; gap: 1rem; margin-bottom: 2px; }
                .t-header strong { font-size: 0.85rem; color: var(--text-main); }
                .t-header span { font-size: 0.75rem; color: var(--text-muted); }
                .t-content p { font-size: 0.825rem; color: var(--text-muted); margin: 0; line-height: 1.5; }
                
                .action-buttons { display: flex; flex-direction: column; gap: 0.5rem; }
                .small-btn { padding: 0.5rem; font-size: 0.75rem; width: 100%; }

                /* Sidebar Extras */
                .sidebar-card-premium { padding: 1.75rem; border-radius: 20px; position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 1.5rem; }
                .accent-bar { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--primary-color); }
                .sidebar-card-premium h3 { font-size: 1rem; margin: 0; }
                
                .insight-row span { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px; display: block; }
                .progress-bar { height: 8px; background: var(--bg-main); border-radius: 10px; border: 1px solid var(--border-color); }
                .progress-bar .fill { height: 100%; background: var(--primary-color); border-radius: 10px; }
                
                .stats-mini { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
                .s-box { padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 12px; background: var(--bg-main); text-align: center; }
                .s-label { font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 2px; }
                .s-val { font-size: 1.1rem; font-weight: 900; color: var(--text-main); }

                .pro-card { background: linear-gradient(135deg, #0f172a, #1e293b); color: white; border: none; padding: 1.5rem; }
                .pro-card h4 { color: white; font-size: 1rem; margin-bottom: 0.5rem; }
                .pro-card p { font-size: 0.75rem; opacity: 0.7; margin-bottom: 1.25rem; }
                .upgrade-btn { background: white; color: black; border: none; width: 100%; padding: 0.65rem; border-radius: 10px; font-weight: 800; font-size: 0.85rem; }

                /* Loader */
                .cd-loader { min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
                .spinner { width: 40px; height: 40px; border: 4px solid var(--border-color); border-top-color: var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }

                @media (max-width: 1100px) { .cd-layout { grid-template-columns: 1fr; } .cd-hero-section { flex-direction: column; } .hero-metrics { width: 100%; } }
                @media (max-width: 768px) { .hero-main h1 { font-size: 2.2rem; } .cd-hero-section { padding: 2rem; } .pipeline-line, .pipeline-dots { display: none; } .app-row-header { margin-bottom: 0.5rem; } }
            `}</style>
        </div>
    );
};

export default CandidateDashboard;