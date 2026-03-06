import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LogIn, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });

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
            setError(err.response?.data?.message || 'Invalid email or password');
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
                        <h1>Welcome back <br /><span className="gradient-text">Professional.</span></h1>
                        <p>Log in to track your applications, manage your pipeline, and stay ahead in your career journey.</p>

                        <div className="auth-features">
                            <div className="auth-feature">
                                <div className="feature-icon"><ShieldCheck size={18} /></div>
                                <span>Real-time tracking</span>
                            </div>
                            <div className="auth-feature">
                                <div className="feature-icon"><Lock size={18} /></div>
                                <span>Secure data handling</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-side auth-right">
                    <div className="auth-form-card">
                        <div className="form-header">
                            <h2>Log in</h2>
                            <p>Enter your credentials to continue</p>
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={onSubmit}>
                            <div className="auth-field">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-group">
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
                                <div className="input-group">
                                    <Lock size={18} className="field-icon" />
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={onChange}
                                        required
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="primary-btn auth-submit" disabled={loading}>
                                {loading ? 'Signing in...' : <>Sign In <ArrowRight size={18} /></>}
                            </button>
                        </form>

                        <p className="auth-switch">
                            Don't have an account? <Link to="/register">Create one</Link>
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
                .auth-side { padding: 4rem 3rem; position: relative; }
                
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
                
                .auth-left-content { position: relative; z-index: 1; max-width: 400px; }
                .auth-brand { margin-bottom: 2.5rem; }
                .auth-left h1 { font-size: 3rem; margin-bottom: 1.5rem; }
                .auth-left p { color: var(--text-muted); font-size: 1.1rem; line-height: 1.7; margin-bottom: 3rem; }
                
                .auth-features { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .auth-feature { display: flex; align-items: center; gap: 0.75rem; font-weight: 700; font-size: 0.9rem; }
                .feature-icon { 
                    width: 36px; height: 36px; border-radius: 10px; 
                    background: var(--primary-glow); color: var(--primary-color);
                    display: flex; align-items: center; justify-content: center;
                }

                .auth-right { display: flex; align-items: center; justify-content: center; background: var(--bg-card); }
                .auth-form-card { width: 100%; max-width: 380px; }
                .form-header { margin-bottom: 2.5rem; }
                .form-header h2 { font-size: 2rem; margin-bottom: 0.5rem; }
                .form-header p { color: var(--text-muted); font-size: 0.95rem; }

                .auth-field { margin-bottom: 1.5rem; }
                .auth-field label { display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.6rem; color: var(--text-muted); }
                
                .input-group { position: relative; display: flex; align-items: center; }
                .field-icon { position: absolute; left: 1.25rem; color: var(--text-muted); opacity: 0.5; }
                .input-group input { padding-left: 3.25rem; }
                
                .auth-submit { width: 100%; margin-top: 1rem; padding: 1rem; font-size: 1rem; }
                
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
                    .auth-page { padding: 0; background: var(--bg-card); }
                }
            `}</style>
        </div>
    );
};

export default Login;
