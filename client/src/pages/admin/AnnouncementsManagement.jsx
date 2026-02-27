import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { announcementsService, authService } from '../../services';
import './AdminPages.css';

function AnnouncementsManagement() {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: ''
    });

    useEffect(() => {
        verifyAuth();
        fetchAnnouncements();
    }, []);

    const verifyAuth = async () => {
        try {
            await authService.verifyToken();
        } catch (error) {
            navigate('/admin/login');
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const response = await announcementsService.getAll();
            setAnnouncements(response.data || []);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await announcementsService.update(editingId, formData);
            } else {
                await announcementsService.create(formData);
            }
            resetForm();
            fetchAnnouncements();
        } catch (error) {
            alert('Error saving announcement');
        }
    };

    const handleEdit = (announcement) => {
        setEditingId(announcement.id);
        setFormData({
            title: announcement.title,
            description: announcement.description,
            start_date: announcement.start_date.split('T')[0],
            end_date: announcement.end_date.split('T')[0]
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await announcementsService.delete(id);
                fetchAnnouncements();
            } catch (error) {
                alert('Error deleting announcement');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            start_date: '',
            end_date: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/admin/login');
    };

    const isActive = (announcement) => {
        const now = new Date();
        const start = new Date(announcement.start_date);
        const end = new Date(announcement.end_date);
        return now >= start && now <= end;
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div className="container">
                    <h1>Announcements Management</h1>
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
                            {showForm ? 'Cancel' : '+ Add Announcement'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="admin-form-card">
                            <h2>{editingId ? 'Edit Announcement' : 'Add New Announcement'}</h2>
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
                                        <label className="form-label">Start Date *</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={formData.start_date}
                                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">End Date *</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={formData.end_date}
                                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        {editingId ? 'Update' : 'Add'} Announcement
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
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {announcements.map((announcement) => (
                                        <tr key={announcement.id}>
                                            <td>{announcement.title}</td>
                                            <td>{announcement.description.substring(0, 50)}...</td>
                                            <td>{new Date(announcement.start_date).toLocaleDateString()}</td>
                                            <td>{new Date(announcement.end_date).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${isActive(announcement) ? 'badge-success' : 'badge-warning'}`}>
                                                    {isActive(announcement) ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <button onClick={() => handleEdit(announcement)} className="btn-icon btn-edit">
                                                        ✏️
                                                    </button>
                                                    <button onClick={() => handleDelete(announcement.id)} className="btn-icon btn-delete">
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

export default AnnouncementsManagement;
