import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsService, authService } from '../../services';
import './AdminPages.css';

function EventsManagement() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'event',
        event_date: '',
        is_published: true,
        image: null
    });

    useEffect(() => {
        verifyAuth();
        fetchEvents();
    }, []);

    const verifyAuth = async () => {
        try {
            await authService.verifyToken();
        } catch (error) {
            navigate('/admin/login');
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await eventsService.getAllAdmin();
            setEvents(response.data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) data.append(key, formData[key]);
        });

        try {
            if (editingId) {
                await eventsService.update(editingId, data);
            } else {
                await eventsService.create(data);
            }
            resetForm();
            fetchEvents();
        } catch (error) {
            alert('Error saving event');
        }
    };

    const handleEdit = (event) => {
        setEditingId(event.id);
        setFormData({
            title: event.title,
            description: event.description,
            type: event.type,
            event_date: event.event_date ? event.event_date.split('T')[0] : '',
            is_published: event.is_published,
            image: null
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await eventsService.delete(id);
                fetchEvents();
            } catch (error) {
                alert('Error deleting event');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            type: 'event',
            event_date: '',
            is_published: true,
            image: null
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div className="container">
                    <h1>Events & News Management</h1>
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
                    <div className="admin-actions">
                        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                            {showForm ? 'Cancel' : '+ Add Event/News'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="admin-form-card">
                            <h2>{editingId ? 'Edit Event/News' : 'Add New Event/News'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Title *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description *</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    ></textarea>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Type *</label>
                                        <select
                                            className="form-select"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="event">Event</option>
                                            <option value="news">News</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Event Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={formData.event_date}
                                            onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Image</label>
                                        <input
                                            type="file"
                                            className="form-input"
                                            accept="image/*"
                                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_published}
                                                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                            />
                                            {' '}Published
                                        </label>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        {editingId ? 'Update' : 'Add'} Event
                                    </button>
                                    <button type="button" onClick={resetForm} className="btn btn-outline">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>Type</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event) => (
                                        <tr key={event.id}>
                                            <td>
                                                {event.image && (
                                                    <img
                                                        src={`/uploads/${event.image}`}
                                                        alt={event.title}
                                                        className="table-image"
                                                    />
                                                )}
                                            </td>
                                            <td>{event.title}</td>
                                            <td>
                                                <span className={`badge ${event.type === 'event' ? 'badge-success' : ''}`}>
                                                    {event.type}
                                                </span>
                                            </td>
                                            <td>{event.event_date ? new Date(event.event_date).toLocaleDateString() : '-'}</td>
                                            <td>
                                                <span className={`badge ${event.is_published ? 'badge-success' : 'badge-warning'}`}>
                                                    {event.is_published ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <button onClick={() => handleEdit(event)} className="btn-icon btn-edit">
                                                        ✏️
                                                    </button>
                                                    <button onClick={() => handleDelete(event.id)} className="btn-icon btn-delete">
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default EventsManagement;
