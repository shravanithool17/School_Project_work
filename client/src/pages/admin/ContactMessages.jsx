import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contactService, authService } from '../../services';
import './AdminPages.css';

function ContactMessages() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [replies, setReplies] = useState([]);
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        verifyAuth();
        fetchMessages();
    }, []);

    useEffect(() => {
        if (selectedMessage) {
            fetchReplies(selectedMessage.id);
        }
    }, [selectedMessage]);

    const verifyAuth = async () => {
        try {
            await authService.verifyToken();
        } catch (error) {
            navigate('/admin/login');
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await contactService.getAll();
            setMessages(response.data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReplies = async (messageId) => {
        try {
            const response = await contactService.getReplies(messageId);
            setReplies(response.data || []);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setSending(true);

        try {
            await contactService.reply(selectedMessage.id, replyMessage);
            setMessage({ type: 'success', text: 'Reply sent successfully!' });
            setReplyMessage('');
            setShowReplyForm(false);
            fetchReplies(selectedMessage.id);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send reply' });
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await contactService.delete(id);
                setSelectedMessage(null);
                fetchMessages();
            } catch (error) {
                alert('Error deleting message');
            }
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div className="container">
                    <h1>Contact Messages</h1>
                    <div className="admin-header-actions">
                        <button onClick={() => navigate('/admin/dashboard')} className="btn btn-outline">
                            Dashboard
                        </button>
                        <button onClick={handleLogout} className="btn btn-outline">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="messages-container">
                            <div className="messages-list">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`message-item ${selectedMessage?.id === msg.id ? 'active' : ''}`}
                                        onClick={() => setSelectedMessage(msg)}
                                    >
                                        <h4>{msg.name}</h4>
                                        <p className="text-muted text-sm">{msg.email}</p>
                                        <p className="text-muted text-sm">
                                            {new Date(msg.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="message-detail">
                                {selectedMessage ? (
                                    <>
                                        {message.text && (
                                            <div className={`alert alert-${message.type}`} style={{ marginBottom: '1rem' }}>
                                                {message.text}
                                            </div>
                                        )}

                                        <div className="message-header">
                                            <div>
                                                <h2>{selectedMessage.name}</h2>
                                                <p className="text-muted">{selectedMessage.email}</p>
                                                {selectedMessage.subject && (
                                                    <p><strong>Subject:</strong> {selectedMessage.subject}</p>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => setShowReplyForm(!showReplyForm)}
                                                    className="btn btn-primary"
                                                >
                                                    ✉️ Reply
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(selectedMessage.id)}
                                                    className="btn btn-outline btn-delete"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </div>

                                        <div className="message-body">
                                            <h3>Original Message:</h3>
                                            <p>{selectedMessage.message}</p>
                                        </div>

                                        {showReplyForm && (
                                            <div className="reply-form" style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'var(--neutral-50)', borderRadius: 'var(--radius-lg)' }}>
                                                <h3>Send Reply</h3>
                                                <form onSubmit={handleSendReply}>
                                                    <div className="form-group">
                                                        <label className="form-label">Reply Message</label>
                                                        <textarea
                                                            className="form-input"
                                                            rows="6"
                                                            value={replyMessage}
                                                            onChange={(e) => setReplyMessage(e.target.value)}
                                                            placeholder="Type your reply here..."
                                                            required
                                                        ></textarea>
                                                    </div>
                                                    <div className="form-actions">
                                                        <button type="submit" className="btn btn-primary" disabled={sending}>
                                                            {sending ? 'Sending...' : 'Send Reply'}
                                                        </button>
                                                        <button type="button" onClick={() => setShowReplyForm(false)} className="btn btn-outline">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}

                                        {replies.length > 0 && (
                                            <div className="reply-history" style={{ marginTop: '2rem' }}>
                                                <h3>Reply History</h3>
                                                {replies.map((reply) => (
                                                    <div key={reply.id} className="reply-item" style={{ padding: '1rem', background: 'var(--primary-50)', borderRadius: 'var(--radius-md)', marginTop: '1rem' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                            <strong>Sent by: {reply.admin_username}</strong>
                                                            <span className="text-muted text-sm">
                                                                {new Date(reply.sent_at).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <p style={{ whiteSpace: 'pre-wrap' }}>{reply.reply_message}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="message-footer">
                                            <p className="text-muted text-sm">
                                                Received: {new Date(selectedMessage.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="no-selection">
                                        <p>Select a message to view details</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default ContactMessages;
