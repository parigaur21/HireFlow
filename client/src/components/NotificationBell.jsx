import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Bell, Check, CheckCheck, Trash2, X } from 'lucide-react';

const NotificationBell = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const panelRef = useRef(null);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 15000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications?limit=10');
            setNotifications(data.data.notifications);
            setUnreadCount(data.data.unreadCount);
        } catch (err) {
            // Silent fail
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {}
    };

    const markAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {}
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            const wasUnread = notifications.find(n => n._id === id && !n.read);
            setNotifications(prev => prev.filter(n => n._id !== id));
            if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {}
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const typeColors = {
        status_change: '#8b5cf6',
        new_application: '#10b981',
        message: '#3b82f6',
        system: '#f59e0b'
    };

    if (!user) return null;

    return (
        <div ref={panelRef} style={{ position: 'relative' }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    padding: '0.5rem', position: 'relative', boxShadow: 'none',
                    color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
                }}
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', top: '2px', right: '2px',
                        background: '#ef4444', color: 'white', borderRadius: '50%',
                        width: '18px', height: '18px', fontSize: '0.65rem',
                        fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid var(--card-bg)',
                        animation: 'pulse 2s infinite'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                    width: '380px', maxHeight: '500px', overflowY: 'auto',
                    background: 'var(--card-bg)', borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    zIndex: 1001, animation: 'slideDown 0.2s ease'
                }}>
                    <div style={{
                        padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <h3 style={{ fontWeight: 800, fontSize: '1rem' }}>Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} style={{
                                background: 'transparent', border: 'none', color: 'var(--primary-color)',
                                fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.3rem 0.5rem', boxShadow: 'none'
                            }}>
                                <CheckCheck size={14} /> Mark all read
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                            <Bell size={32} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
                            <p style={{ fontWeight: 600 }}>No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div
                                key={n._id}
                                style={{
                                    padding: '0.85rem 1.25rem',
                                    borderBottom: '1px solid var(--border-color)',
                                    background: n.read ? 'transparent' : 'rgba(37,99,235,0.03)',
                                    display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                                    cursor: 'pointer', transition: 'background 0.15s'
                                }}
                                onClick={() => !n.read && markAsRead(n._id)}
                            >
                                <div style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: n.read ? 'transparent' : (typeColors[n.type] || '#6b7280'),
                                    marginTop: '6px', flexShrink: 0
                                }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.3 }}>{n.title}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: 1.4 }}>{n.message}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem', opacity: 0.7 }}>{getTimeAgo(n.createdAt)}</p>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }} style={{
                                    background: 'transparent', border: 'none', color: 'var(--text-muted)',
                                    cursor: 'pointer', padding: '0.25rem', boxShadow: 'none', opacity: 0.5
                                }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default NotificationBell;
