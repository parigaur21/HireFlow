import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, MapPin, Briefcase, Code, Phone, Globe, Github, Linkedin, Save, Edit3, X, CheckCircle } from 'lucide-react';

const Profile = () => {
    const { user, login } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [form, setForm] = useState({
        name: '', bio: '', phone: '', location: '',
        skills: '', experienceYears: 0,
        linkedin: '', github: '', portfolio: '', avatar: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/profile/me');
            setProfile(data.data);
            setForm({
                name: data.data.name || '',
                bio: data.data.bio || '',
                phone: data.data.phone || '',
                location: data.data.location || '',
                skills: (data.data.skills || []).join(', '),
                experienceYears: data.data.experienceYears || 0,
                linkedin: data.data.linkedin || '',
                github: data.data.github || '',
                portfolio: data.data.portfolio || '',
                avatar: data.data.avatar || ''
            });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data } = await api.put('/profile/me', {
                ...form,
                skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
                experienceYears: Number(form.experienceYears)
            });
            setProfile(data.data);
            setEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Update auth context
            const updatedUser = { ...user, name: data.data.name, skills: data.data.skills, experienceYears: data.data.experienceYears, location: data.data.location };
            const token = localStorage.getItem('token');
            login(updatedUser, token);

            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="spinner" />
        </div>
    );

    const initials = profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
            {message.text && (
                <div style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: message.type === 'success' ? '#059669' : '#dc2626',
                    border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    fontWeight: 600
                }}>
                    <CheckCircle size={18} />
                    {message.text}
                </div>
            )}

            {/* Profile Header */}
            <div style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%)',
                borderRadius: '20px',
                padding: '2.5rem',
                color: 'white',
                marginBottom: '1.5rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        width: '90px', height: '90px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', fontWeight: 800,
                        border: '3px solid rgba(255,255,255,0.3)',
                        backdropFilter: 'blur(10px)',
                        flexShrink: 0
                    }}>
                        {profile?.avatar ? <img src={profile.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : initials}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>{profile?.name}</h1>
                        <p style={{ opacity: 0.85, fontSize: '1rem', margin: '0.25rem 0' }}>{profile?.email}</p>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{
                                background: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.75rem',
                                borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
                                textTransform: 'capitalize', backdropFilter: 'blur(5px)'
                            }}>
                                {profile?.role}
                            </span>
                            {profile?.location && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', opacity: 0.9 }}>
                                    <MapPin size={14} /> {profile.location}
                                </span>
                            )}
                            {profile?.experienceYears > 0 && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', opacity: 0.9 }}>
                                    <Briefcase size={14} /> {profile.experienceYears} yrs exp
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => setEditing(!editing)}
                        style={{
                            background: editing ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.2)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: 'white', padding: '0.6rem 1.25rem',
                            borderRadius: '12px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            fontWeight: 700, fontSize: '0.9rem',
                            backdropFilter: 'blur(5px)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {editing ? <><X size={16} /> Cancel</> : <><Edit3 size={16} /> Edit Profile</>}
                    </button>
                </div>
            </div>

            {/* Profile Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Left Column - Details */}
                <div style={{
                    background: 'var(--card-bg)', borderRadius: '16px',
                    padding: '1.75rem', border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={18} color="var(--primary-color)" /> Personal Info
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</label>
                            {editing ? <input name="name" value={form.name} onChange={handleChange} style={{ marginTop: '0.3rem' }} /> :
                                <p style={{ fontWeight: 600, marginTop: '0.3rem' }}>{profile?.name}</p>}
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bio</label>
                            {editing ? <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
                                style={{ marginTop: '0.3rem', width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit' }} /> :
                                <p style={{ marginTop: '0.3rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{profile?.bio || 'No bio added yet'}</p>}
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <MapPin size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />Location
                            </label>
                            {editing ? <input name="location" value={form.location} onChange={handleChange} style={{ marginTop: '0.3rem' }} /> :
                                <p style={{ fontWeight: 600, marginTop: '0.3rem' }}>{profile?.location || 'Not set'}</p>}
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <Phone size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />Phone
                            </label>
                            {editing ? <input name="phone" value={form.phone} onChange={handleChange} style={{ marginTop: '0.3rem' }} /> :
                                <p style={{ fontWeight: 600, marginTop: '0.3rem' }}>{profile?.phone || 'Not set'}</p>}
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <Briefcase size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />Experience (Years)
                            </label>
                            {editing ? <input name="experienceYears" type="number" min="0" value={form.experienceYears} onChange={handleChange} style={{ marginTop: '0.3rem' }} /> :
                                <p style={{ fontWeight: 600, marginTop: '0.3rem' }}>{profile?.experienceYears || 0} years</p>}
                        </div>
                    </div>
                </div>

                {/* Right Column - Skills & Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{
                        background: 'var(--card-bg)', borderRadius: '16px',
                        padding: '1.75rem', border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Code size={18} color="var(--primary-color)" /> Skills
                        </h3>
                        {editing ? (
                            <div>
                                <input name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB..." />
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Separate skills with commas</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {(profile?.skills || []).length > 0 ? profile.skills.map((skill, i) => (
                                    <span key={i} style={{
                                        background: 'rgba(37,99,235,0.08)', color: '#2563eb',
                                        padding: '0.35rem 0.85rem', borderRadius: '20px',
                                        fontSize: '0.85rem', fontWeight: 600
                                    }}>{skill}</span>
                                )) : <p style={{ color: 'var(--text-muted)' }}>No skills added yet</p>}
                            </div>
                        )}
                    </div>

                    <div style={{
                        background: 'var(--card-bg)', borderRadius: '16px',
                        padding: '1.75rem', border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Globe size={18} color="var(--primary-color)" /> Social Links
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Linkedin size={12} /> LinkedIn
                                </label>
                                {editing ? <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." style={{ marginTop: '0.3rem' }} /> :
                                    profile?.linkedin ? <a href={profile.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.9rem' }}>{profile.linkedin}</a> : <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Not set</p>}
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Github size={12} /> GitHub
                                </label>
                                {editing ? <input name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/..." style={{ marginTop: '0.3rem' }} /> :
                                    profile?.github ? <a href={profile.github} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.9rem' }}>{profile.github}</a> : <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Not set</p>}
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Globe size={12} /> Portfolio
                                </label>
                                {editing ? <input name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="https://yourportfolio.com" style={{ marginTop: '0.3rem' }} /> :
                                    profile?.portfolio ? <a href={profile.portfolio} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.9rem' }}>{profile.portfolio}</a> : <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Not set</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            {editing && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                            color: 'white', padding: '0.75rem 2rem',
                            borderRadius: '12px', fontWeight: 700,
                            fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                            opacity: saving ? 0.7 : 1
                        }}
                    >
                        <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}

            <style>{`
                .spinner {
                    width: 40px; height: 40px;
                    border: 4px solid var(--border-color);
                    border-top-color: var(--primary-color);
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    div[style*="grid-template-columns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Profile;
