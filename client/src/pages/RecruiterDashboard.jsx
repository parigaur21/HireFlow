import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatusBoard from '../components/StatusBoard';
import {
    PlusCircle,
    Briefcase,
    Users,
    TrendingUp,
    Sparkles,
    Search,
    Layout,
    Building2,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Trophy,
    Target,
    Filter
} from 'lucide-react';

const RecruiterDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [myJobs, setMyJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [jobForm, setJobForm] = useState({ title: '', description: '', company: '' });
    const [creating, setCreating] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [statsRes, jobsRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/jobs', { params: { postedBy: user._id } })
            ]);

            setStats(statsRes.data.data);
            setMyJobs(jobsRes.data.data.jobs);
        } catch (err) {
            setError('Failed to fetch dashboard data.');
        } finally {
            setLoading(false);
        }
    }, [user._id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const fetchApplications = async (jobId) => {
        setSelectedJob(myJobs.find(j => j._id === jobId));

        try {
            const appsRes = await api.get(`/applications/job/${jobId}`);
            const applicationsData = appsRes.data.data;
            const enrichedApplications = applicationsData.sort((a, b) => b.matchScore - a.matchScore);
            setApplications(enrichedApplications);
        } catch (err) {
            alert('Failed to fetch applications');
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await api.post('/jobs', jobForm);
            if (res.data.success) {
                setJobForm({ title: '', description: '', company: '' });
                fetchData();
                alert('Job created successfully!');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create job');
        } finally {
            setCreating(false);
        }
    };

    if (loading) return (
        <div className="rd-loader">
            <div className="spinner"></div>
            <span>Loading Workspace...</span>
        </div>
    );
    if (error) return <div className="error-banner card glass-effect"><AlertCircle size={20} /> {error}</div>;

    return (
        <div className="rd-wrapper fade-in">
            {/* ───────── HEADER ───────── */}
            <header className="rd-header-section">
                <div className="header-layout">
                    <div className="header-text">
                        <div className="rd-badge"><Layout size={14} /> <span>Hiring Console v2.0</span></div>
                        <h1>Recruiter <br /><span className="gradient-text">Workspace</span></h1>
                        <p className="subtitle">Welcome back, <strong>{user?.name}</strong>. Manage your AI hiring pipeline.</p>
                    </div>

                    <div className="header-stats">
                        <div className="stat-card glass-effect blue">
                            <div className="s-icon"><Briefcase size={20} /></div>
                            <div className="s-info">
                                <span className="s-val">{stats.totalJobs}</span>
                                <span className="s-label">Active Roles</span>
                            </div>
                        </div>
                        <div className="stat-card glass-effect purple">
                            <div className="s-icon"><Users size={20} /></div>
                            <div className="s-info">
                                <span className="s-val">{stats.totalApplications}</span>
                                <span className="s-label">Total Applicants</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="rd-grid">
                {/* ───────── LEFT SIDEBAR ───────── */}
                <aside className="rd-sidebar">
                    <div className="sidebar-card card">
                        <div className="card-header">
                            <h3><PlusCircle size={18} /> <span>Post New Job</span></h3>
                        </div>
                        <form onSubmit={handleCreateJob} className="rd-form">
                            <div className="rd-field">
                                <label>Job Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Senior React Developer"
                                    value={jobForm.title}
                                    onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="rd-field">
                                <label>Company</label>
                                <input
                                    type="text"
                                    placeholder="Company Name"
                                    value={jobForm.company}
                                    onChange={e => setJobForm({ ...jobForm, company: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="rd-field">
                                <label>Job Description</label>
                                <textarea
                                    placeholder="Describe requirements and role..."
                                    value={jobForm.description}
                                    onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="primary-btn rd-post-btn" disabled={creating}>
                                {creating ? 'Posting...' : <>Post Job <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    </div>

                    <div className="sidebar-card card">
                        <div className="card-header sp">
                            <h3><TrendingUp size={18} /> <span>Your Jobs ({myJobs.length})</span></h3>
                        </div>
                        <div className="job-list-compact">
                            {myJobs.length === 0 ? (
                                <p className="empty-msg">No jobs posted yet.</p>
                            ) : (
                                myJobs.map(job => (
                                    <div
                                        key={job._id}
                                        className={`job-mini-item ${selectedJob?._id === job._id ? 'active' : ''}`}
                                        onClick={() => fetchApplications(job._id)}
                                    >
                                        <div className="jm-info">
                                            <span className="jm-title">{job.title}</span>
                                            <span className="jm-company"><Building2 size={12} /> {job.company}</span>
                                        </div>
                                        {selectedJob?._id === job._id ? <CheckCircle2 size={16} className="active-ico" /> : <div className="jm-dot"></div>}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </aside>

                {/* ───────── MAIN CONTENT ───────── */}
                <main className="rd-main">
                    {selectedJob && applications.length > 0 && (() => {
                        const totalCandidates = applications.length;
                        const avgMatch = Math.round(applications.reduce((sum, a) => sum + (a.matchScore || 0), 0) / totalCandidates);
                        const strongMatches = applications.filter(a => (a.matchScore || 0) > 70).length;
                        const topCandidate = applications.reduce((best, a) => (a.matchScore || 0) > (best.matchScore || 0) ? a : best, applications[0]);

                        return (
                            <div className="rd-ai-insights glass-effect">
                                <div className="insights-header">
                                    <div className="header-top">
                                        <div className="ai-badge"><Sparkles size={14} fill="currentColor" /> <span>AI MATCHING ACTIVE</span></div>
                                        <div className="job-name">{selectedJob.title}</div>
                                    </div>
                                    <h3>Intelligence Report</h3>
                                </div>

                                <div className="insights-grid">
                                    <div className="i-box">
                                        <div className="i-icon blue"><Target size={20} /></div>
                                        <div className="i-text">
                                            <strong>{avgMatch}%</strong>
                                            <span>Average Match</span>
                                        </div>
                                    </div>
                                    <div className="i-box">
                                        <div className="i-icon purple"><Trophy size={20} /></div>
                                        <div className="i-text">
                                            <strong className="truncate">{topCandidate.candidate?.name?.split(' ')[0]}</strong>
                                            <span>Top Prospect</span>
                                        </div>
                                    </div>
                                    <div className="i-box">
                                        <div className="i-icon green"><CheckCircle2 size={20} /></div>
                                        <div className="i-text">
                                            <strong>{strongMatches}</strong>
                                            <span>Found Hits</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    <div className="rd-pipeline-card card">
                        <div className="pipeline-header">
                            <div className="ph-left">
                                <h2 className="section-title">Application Pipeline</h2>
                                {selectedJob && <p className="pipeline-desc">Real-time candidate workflow for {selectedJob.title}</p>}
                            </div>
                            <div className="ph-right">
                                <button className="secondary-btn small-btn"><Filter size={14} /> Filter</button>
                            </div>
                        </div>

                        {selectedJob ? (
                            <div className="pipeline-workspace shadow-inner">
                                <StatusBoard
                                    applications={applications}
                                    onUpdate={() => {
                                        fetchApplications(selectedJob._id);
                                        fetchData();
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="rd-empty-state">
                                <div className="empty-graphic">
                                    <Search size={48} strokeWidth={1} />
                                </div>
                                <h3>Select a job</h3>
                                <p>Choose a listing from the sidebar to view candidate pipeline and AI scores.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <style>{`
                .app-container { max-width: 1440px !important; padding: 0 2rem 2rem !important; margin: 0 auto !important; }

                .rd-wrapper { display: flex; flex-direction: column; gap: 2.5rem; padding-top: 1.5rem; }

                /* Header Section */
                .rd-header-section {
                    background: var(--bg-card);
                    border-radius: var(--border-radius-lg);
                    padding: 3rem;
                    border: 1px solid var(--border-color);
                    box-shadow: var(--shadow-premium);
                    position: relative; overflow: hidden;
                }
                .header-layout { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; }
                .header-text h1 { font-size: 3.5rem; margin-bottom: 0.5rem; }
                .subtitle { color: var(--text-muted); font-size: 1.1rem; }
                .rd-badge {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: var(--primary-color); color: white;
                    padding: 0.4rem 0.85rem; border-radius: 100px;
                    font-size: 0.7rem; font-weight: 800; text-transform: uppercase; margin-bottom: 1.5rem;
                }

                .header-stats { display: flex; gap: 1rem; }
                .stat-card {
                    padding: 1.5rem 2rem; border-radius: 20px;
                    display: flex; gap: 1.25rem; align-items: center; min-width: 200px;
                }
                .s-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: var(--bg-main); }
                .blue .s-icon { color: var(--primary-color); }
                .purple .s-icon { color: #7c3aed; }
                .s-val { display: block; font-size: 1.8rem; font-weight: 900; line-height: 1; color: var(--text-main); }
                .s-label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

                /* Grid Layout */
                .rd-grid { display: grid; grid-template-columns: 360px 1fr; gap: 2.5rem; align-items: start; }
                
                /* Sidebar */
                .sidebar-card { padding: 1.5rem; border-radius: 24px; margin-bottom: 1.5rem; }
                .card-header { margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; }
                .card-header h3 { font-size: 1.1rem; display: flex; align-items: center; gap: 10px; margin: 0; }
                
                .rd-form { display: flex; flex-direction: column; gap: 1.25rem; }
                .rd-field label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.02em; }
                .rd-post-btn { width: 100%; padding: 0.85rem; font-size: 0.95rem; }

                .empty-msg { text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 2rem; }
                .job-list-compact { display: flex; flex-direction: column; gap: 0.5rem; max-height: 400px; overflow-y: auto; padding-right: 4px; }
                .job-mini-item {
                    padding: 1rem 1.25rem; border-radius: 16px; border: 1.5px solid var(--border-color);
                    display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: var(--transition);
                }
                .job-mini-item:hover { border-color: var(--primary-color); background: var(--bg-main); }
                .job-mini-item.active { background: var(--primary-glow); border-color: var(--primary-color); }
                .jm-title { font-weight: 800; font-size: 0.95rem; color: var(--text-main); display: block; }
                .jm-company { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; display: flex; align-items: center; gap: 4px; }
                .active-ico { color: var(--primary-color); }
                .jm-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border-color); }

                /* AI Insights */
                .rd-ai-insights { padding: 2rem; border-radius: 24px; border: 1.2px solid var(--primary-color); margin-bottom: 2.5rem; position: relative; }
                .insights-header { margin-bottom: 1.5rem; }
                .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
                .ai-badge { background: var(--primary-color); color: white; padding: 0.35rem 0.75rem; border-radius: 100px; font-size: 0.65rem; font-weight: 900; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px; }
                .job-name { font-size: 0.85rem; font-weight: 700; color: var(--primary-color); text-transform: uppercase; }
                .rd-ai-insights h3 { font-size: 1.5rem; margin: 0; }
                
                .insights-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
                .i-box { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 16px; background: var(--bg-main); border: 1px solid var(--border-color); }
                .i-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: var(--bg-card); flex-shrink: 0; }
                .i-icon.blue { color: var(--primary-color); }
                .i-icon.purple { color: #7c3aed; }
                .i-icon.green { color: #10b981; }
                .i-text strong { display: block; font-size: 1.1rem; font-weight: 900; color: var(--text-main); }
                .i-text span { font-size: 0.7rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }

                /* Pipeline */
                .rd-pipeline-card { border-radius: 24px; padding: 2rem; overflow: hidden; }
                .pipeline-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .pipeline-workspace { 
                    margin: 0 -1rem; padding: 0.5rem 1rem 1rem; overflow-x: auto; 
                    scrollbar-width: thin; scrollbar-color: var(--border-color) transparent;
                }
                .pipeline-workspace::-webkit-scrollbar { height: 6px; }
                .pipeline-workspace::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }

                .rd-empty-state { padding: 4rem 1rem; text-align: center; color: var(--text-muted); }
                .empty-graphic { margin-bottom: 1.5rem; opacity: 0.3; }
                .rd-empty-state h3 { font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-main); }

                /* Loader */
                .rd-loader { min-height: 500px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }

                @media (max-width: 1200px) { .rd-grid { grid-template-columns: 1fr; } .header-layout { flex-direction: column; align-items: flex-start; gap: 2rem; } .header-stats { width: 100%; } .stat-card { flex: 1; } }
                @media (max-width: 768px) { .rd-header-section { padding: 2rem; } .header-text h1 { font-size: 2.5rem; } .insights-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
};

export default RecruiterDashboard;