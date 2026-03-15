import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { BarChart3, TrendingUp, Users, Briefcase, Target, CheckCircle, XCircle, Clock, Award } from 'lucide-react';

const Analytics = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const { data: res } = await api.get('/analytics');
            setData(res.data);
        } catch (err) {
            console.error('Failed to load analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="analytics-spinner" />
        </div>
    );

    if (!data) return <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Failed to load analytics.</p>;

    const isRecruiter = user?.role === 'recruiter' || user?.role === 'admin';

    const statusColors = {
        'Applied': '#3b82f6', 'Screening': '#8b5cf6', 'Interview': '#f59e0b',
        'Technical': '#06b6d4', 'HR': '#ec4899', 'Offer': '#10b981',
        'Hired': '#059669', 'Rejected': '#ef4444', 'Withdrawn': '#6b7280'
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <BarChart3 size={28} color="var(--primary-color)" />
                    Analytics Dashboard
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {isRecruiter ? 'Track your recruitment pipeline performance' : 'Track your job application progress'}
                </p>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {isRecruiter ? (
                    <>
                        <StatCard icon={<Briefcase size={22} />} label="Total Jobs" value={data.totalJobs} color="#3b82f6" />
                        <StatCard icon={<Users size={22} />} label="Total Applications" value={data.totalApplications} color="#8b5cf6" />
                        <StatCard icon={<Target size={22} />} label="Avg Match Score" value={`${data.averageMatchScore}%`} color="#10b981" />
                        <StatCard icon={<TrendingUp size={22} />} label="Pipeline Stages" value={data.statusBreakdown?.length || 0} color="#f59e0b" />
                    </>
                ) : (
                    <>
                        <StatCard icon={<Briefcase size={22} />} label="Total Applications" value={data.totalApplications} color="#3b82f6" />
                        <StatCard icon={<Clock size={22} />} label="Active" value={data.activeApplications} color="#8b5cf6" />
                        <StatCard icon={<CheckCircle size={22} />} label="Hired" value={data.hiredCount} color="#10b981" />
                        <StatCard icon={<Target size={22} />} label="Avg Match Score" value={`${data.averageMatchScore}%`} color="#f59e0b" />
                    </>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Status Breakdown */}
                <div style={{
                    background: 'var(--card-bg)', borderRadius: '16px', padding: '1.75rem',
                    border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)'
                }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.05rem' }}>Application Status Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {(data.statusBreakdown || []).map((item, i) => {
                            const total = data.totalApplications || 1;
                            const pct = Math.round((item.count / total) * 100);
                            return (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.status}</span>
                                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: statusColors[item.status] || '#6b7280' }}>{item.count} ({pct}%)</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%', width: `${pct}%`,
                                            background: statusColors[item.status] || '#6b7280',
                                            borderRadius: '4px', transition: 'width 0.5s ease'
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                        {(!data.statusBreakdown || data.statusBreakdown.length === 0) && (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No data yet</p>
                        )}
                    </div>
                </div>

                {/* Right panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {isRecruiter && data.topSkills?.length > 0 && (
                        <div style={{
                            background: 'var(--card-bg)', borderRadius: '16px', padding: '1.75rem',
                            border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)'
                        }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.05rem' }}>Top Skills in Demand</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {data.topSkills.map((s, i) => (
                                    <span key={i} style={{
                                        background: `hsla(${i * 35}, 70%, 50%, 0.1)`,
                                        color: `hsl(${i * 35}, 70%, 40%)`,
                                        padding: '0.4rem 0.9rem', borderRadius: '20px',
                                        fontWeight: 700, fontSize: '0.85rem'
                                    }}>
                                        {s.skill} ({s.count})
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {isRecruiter && data.applicationsPerJob?.length > 0 && (
                        <div style={{
                            background: 'var(--card-bg)', borderRadius: '16px', padding: '1.75rem',
                            border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)'
                        }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.05rem' }}>Applications per Job</h3>
                            {data.applicationsPerJob.map((j, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: i < data.applicationsPerJob.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{j.jobTitle}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{j.company}</p>
                                    </div>
                                    <span style={{ fontWeight: 800, color: 'var(--primary-color)', fontSize: '1.1rem' }}>{j.count}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isRecruiter && data.recentApplications?.length > 0 && (
                        <div style={{
                            background: 'var(--card-bg)', borderRadius: '16px', padding: '1.75rem',
                            border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)'
                        }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.05rem' }}>Recent Applications</h3>
                            {data.recentApplications.map((app, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: i < data.recentApplications.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{app.jobTitle}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.company}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                            background: statusColors[app.status] || '#6b7280',
                                            color: 'white', padding: '0.2rem 0.6rem',
                                            borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700
                                        }}>{app.status}</span>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{app.matchScore}% match</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .analytics-spinner {
                    width: 40px; height: 40px; border: 4px solid var(--border-color);
                    border-top-color: var(--primary-color); border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
                    div[style*="repeat(auto-fit"] { grid-template-columns: 1fr 1fr !important; }
                }
            `}</style>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div style={{
        background: 'var(--card-bg)', borderRadius: '16px', padding: '1.5rem',
        border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)',
        display: 'flex', alignItems: 'center', gap: '1rem'
    }}>
        <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: color, flexShrink: 0
        }}>
            {icon}
        </div>
        <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{value}</p>
        </div>
    </div>
);

export default Analytics;
