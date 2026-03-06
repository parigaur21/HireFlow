import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Lock, CheckCircle2, ShieldCheck, Zap, Briefcase, GraduationCap } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'candidate',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const { name, email, password, role } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/register', {
                name,
                email,
                password,
                role,
            });

            if (response.data.success) {
                const { data } = response.data;
                login(data, data.token);

                if (data.role === 'recruiter') {
                    navigate('/recruiter-dashboard');
                } else {
                    navigate('/candidate-dashboard');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page fade-in">
            <div className="auth-container glass-effect">
                <div className="auth-side auth-left">
                    <div className="auth-mesh"></div>
                    <div className="auth-left-content">
                        <div className="auth-brand">
                            <span className="nav-logo">Hire<span>Flow</span></span>
                        </div>
                        <h1>Start your <br /><span className="gradient-text">Journey.</span></h1>
                        <p>Join the next generation of hiring. Create your account and explore verified roles in under 30 seconds.</p>

                        <div className="auth-features">
                            <div className="auth-feature">
                                <CheckCircle2 size={18} className="feat-ico" />
                                <span>Candidate & Recruiter dash</span>
                            </div>
                            <div className="auth-feature">
                                <Zap size={18} className="feat-ico" />
                                <span>AI Matching Engine</span>
                            </div>
                            <div className="auth-feature">
                                <ShieldCheck size={18} className="feat-ico" />
                                <span>Verified Listings</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-side auth-right">
                    <div className="auth-form-card">
                        <div className="form-header">
                            <h2>Create account</h2>
                            <p>Get started today</p>
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={onSubmit}>
                            <div className="auth-field">
                                <label htmlFor="name">Full Name</label>
                                <div className="input-with-icon">
                                    <User size={18} className="field-icon" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={name}
                                        onChange={onChange}
                                        required
                                        placeholder="Your full name"
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-with-icon">
                                    <Mail size={18} className="field-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={onChange}
                                        required
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="password">Password</label>
                                <div className="input-with-icon">
                                    <Lock size={18} className="field-icon" />
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={onChange}
                                        required
                                        placeholder="Min. 6 characters"
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label>I am a</label>
                                <div className="role-selector-grid">
                                    <div
                                        className={`role-option ${role === 'candidate' ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, role: 'candidate' })}
                                    >
                                        <GraduationCap size={20} />
                                        <span>Candidate</span>
                                    </div>
                                    <div
                                        className={`role-option ${role === 'recruiter' ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, role: 'recruiter' })}
                                    >
                                        <Briefcase size={20} />
                                        <span>Recruiter</span>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="primary-btn auth-submit" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <p className="auth-switch">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .auth-page {
                    min-height: calc(100vh - 100px);
                    display: flex; align-items: center; justify-content: center;
                    padding: 2rem;
                }
                .auth-container {
                    display: grid; grid-template-columns: 1.1fr 0.9fr;
                    max-width: 1080px; width: 100%;
                    background: var(--bg-card); border-radius: 32px;
                    border: 1px solid var(--border-color);
                    overflow: hidden; min-height: 620px;
                }
                .auth-side { padding: 4rem; position: relative; }
                
                .auth-left {
                    background: var(--bg-main);
                    display: flex; align-items: center;
                    border-right: 1px solid var(--border-color);
                }
                .auth-mesh {
                    position: absolute; inset: 0;
                    background-image: radial-gradient(var(--primary-color) 0.5px, transparent 0.5px);
                    background-size: 30px 30px; opacity: 0.05;
                }
                
                .auth-left-content { position: relative; z-index: 1; }
                .auth-brand { margin-bottom: 2.5rem; }
                .auth-left h1 { font-size: 3rem; margin-bottom: 1.5rem; }
                .auth-left p { color: var(--text-muted); font-size: 1.1rem; line-height: 1.7; margin-bottom: 3rem; }
                
                .auth-features { display: flex; flex-direction: column; gap: 1.25rem; }
                .auth-feature { display: flex; align-items: center; gap: 1rem; font-weight: 700; font-size: 0.95rem; }
                .feat-ico { color: #10b981; }

                .auth-right { display: flex; align-items: center; justify-content: center; background: var(--bg-card); }
                .auth-form-card { width: 100%; max-width: 380px; }
                .form-header { margin-bottom: 2.5rem; }
                .form-header h2 { font-size: 2rem; margin-bottom: 0.5rem; }
                .form-header p { color: var(--text-muted); font-size: 0.95rem; }

                .auth-field { margin-bottom: 1.25rem; }
                .auth-field label { display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.6rem; color: var(--text-muted); }
                
                .input-with-icon { position: relative; display: flex; align-items: center; }
                .field-icon { position: absolute; left: 1.25rem; color: var(--text-muted); opacity: 0.5; }
                .input-with-icon input { padding-left: 3.25rem; }
                
                .role-selector-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .role-option {
                    padding: 1rem; border-radius: 16px; border: 1.5px solid var(--border-color);
                    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
                    cursor: pointer; transition: var(--transition); color: var(--text-muted);
                }
                .role-option span { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
                .role-option:hover { border-color: var(--primary-color); color: var(--primary-color); }
                .role-option.active { border-color: var(--primary-color); background: var(--primary-glow); color: var(--primary-color); }

                .auth-submit { width: 100%; margin-top: 1.5rem; padding: 1rem; font-size: 1rem; }
                
                .auth-error {
                    background: rgba(239, 68, 68, 0.1); color: #ef4444; 
                    padding: 1rem; border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2);
                    font-size: 0.85rem; font-weight: 600; margin-bottom: 1.5rem;
                }

                .auth-switch { text-align: center; margin-top: 2rem; color: var(--text-muted); font-size: 0.95rem; }
                .auth-switch a { color: var(--primary-color); font-weight: 800; text-decoration: none; }
                .auth-switch a:hover { text-underline-offset: 4px; text-decoration: underline; }

                @media (max-width: 900px) {
                    .auth-container { grid-template-columns: 1fr; border-radius: 0; border: none; }
                    .auth-left { display: none; }
                }
            `}</style>
        </div>
    );
};

export default Register;
