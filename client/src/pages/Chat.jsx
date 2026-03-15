import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { MessageSquare, Send, ArrowLeft, Search, User } from 'lucide-react';

const Chat = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchEmail, setSearchEmail] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeConv) {
            fetchMessages(activeConv._id);
            const interval = setInterval(() => fetchMessages(activeConv._id), 5000);
            return () => clearInterval(interval);
        }
    }, [activeConv?._id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/chat/conversations');
            setConversations(data.data);
        } catch (err) {
            console.error('Failed to load conversations');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (convId) => {
        try {
            const { data } = await api.get(`/chat/messages/${convId}`);
            setMessages(data.data);
        } catch (err) {
            console.error('Failed to load messages');
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !activeConv) return;
        setSending(true);
        try {
            await api.post('/chat/messages', {
                conversationId: activeConv._id,
                content: newMessage.trim()
            });
            setNewMessage('');
            fetchMessages(activeConv._id);
            fetchConversations();
        } catch (err) {
            console.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const startNewConversation = async () => {
        if (!searchEmail.trim()) return;
        try {
            // We'll use email to find user - but our API expects participantId
            // For now, show instructions
            alert('Enter the user ID of the person you want to chat with. You can find this in the recruiter/candidate dashboard.');
        } catch (err) {
            console.error('Failed to start conversation');
        }
    };

    const getOtherParticipant = (conv) => {
        return conv.participants?.find(p => p._id !== user?._id) || { name: 'Unknown' };
    };

    const formatTime = (date) => {
        const d = new Date(date);
        const now = new Date();
        if (d.toDateString() === now.toDateString()) {
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '1.5rem auto', padding: '0 1rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <MessageSquare size={26} color="var(--primary-color)" /> Messages
            </h1>

            <div style={{
                display: 'grid', gridTemplateColumns: '340px 1fr',
                borderRadius: '16px', overflow: 'hidden',
                border: '1px solid var(--border-color)',
                background: 'var(--card-bg)',
                height: 'calc(100vh - 200px)',
                boxShadow: 'var(--shadow-md)'
            }}>
                {/* Sidebar */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                placeholder="Search conversations..."
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                                style={{ paddingLeft: '2.25rem', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {conversations.length === 0 && !loading && (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                                <MessageSquare size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                                <p style={{ fontWeight: 600 }}>No conversations yet</p>
                                <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Start a conversation from the dashboard</p>
                            </div>
                        )}
                        {conversations
                            .filter(c => {
                                if (!searchEmail.trim()) return true;
                                const other = getOtherParticipant(c);
                                return other.name?.toLowerCase().includes(searchEmail.toLowerCase()) ||
                                       other.email?.toLowerCase().includes(searchEmail.toLowerCase());
                            })
                            .map(conv => {
                                const other = getOtherParticipant(conv);
                                const isActive = activeConv?._id === conv._id;
                                return (
                                    <div
                                        key={conv._id}
                                        onClick={() => setActiveConv(conv)}
                                        style={{
                                            padding: '1rem 1.25rem', cursor: 'pointer',
                                            background: isActive ? 'rgba(37,99,235,0.06)' : 'transparent',
                                            borderLeft: isActive ? '3px solid var(--primary-color)' : '3px solid transparent',
                                            borderBottom: '1px solid var(--border-color)',
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '42px', height: '42px', borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0
                                            }}>
                                                {other.name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{other.name}</p>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatTime(conv.lastMessageAt)}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                                                        {conv.lastMessage || 'No messages yet'}
                                                    </p>
                                                    {conv.unreadCount > 0 && (
                                                        <span style={{
                                                            background: '#2563eb', color: 'white', borderRadius: '10px',
                                                            padding: '0.1rem 0.5rem', fontSize: '0.7rem', fontWeight: 800
                                                        }}>{conv.unreadCount}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>

                {/* Chat Area */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {activeConv ? (
                        <>
                            {/* Chat Header */}
                            <div style={{
                                padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)',
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                background: 'var(--card-bg)'
                            }}>
                                <div style={{
                                    width: '38px', height: '38px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontWeight: 800, fontSize: '0.85rem'
                                }}>
                                    {getOtherParticipant(activeConv).name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div>
                                    <p style={{ fontWeight: 700 }}>{getOtherParticipant(activeConv).name}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                                        {getOtherParticipant(activeConv).role}
                                    </p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {messages.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                        <p style={{ fontWeight: 600 }}>Start the conversation!</p>
                                        <p style={{ fontSize: '0.85rem' }}>Send your first message below</p>
                                    </div>
                                )}
                                {messages.map(msg => {
                                    const isMine = msg.sender?._id === user?._id;
                                    return (
                                        <div key={msg._id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                                            <div style={{
                                                maxWidth: '70%',
                                                background: isMine ? 'linear-gradient(135deg, #2563eb, #3b82f6)' : 'var(--border-color)',
                                                color: isMine ? 'white' : 'var(--text-main)',
                                                padding: '0.75rem 1.1rem',
                                                borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                fontSize: '0.9rem', lineHeight: 1.5
                                            }}>
                                                <p>{msg.content}</p>
                                                <p style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: '0.3rem', textAlign: 'right' }}>
                                                    {formatTime(msg.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div style={{
                                padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)',
                                display: 'flex', gap: '0.75rem', alignItems: 'center'
                            }}>
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                    placeholder="Type a message..."
                                    style={{ flex: 1 }}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={sending || !newMessage.trim()}
                                    style={{
                                        background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                                        padding: '0.7rem', borderRadius: '12px', minWidth: '44px'
                                    }}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-muted)' }}>
                            <MessageSquare size={60} style={{ opacity: 0.15, marginBottom: '1rem' }} />
                            <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>Select a conversation</p>
                            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>Choose from the sidebar to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
