import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { admissionsService, authService } from '../../services';
import './AdminPages.css';

function AdmissionsViewer() {
    const navigate = useNavigate();
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        verifyAuth();
        fetchAdmissions();
    }, [filter]);

    const verifyAuth = async () => {
        try {
            await authService.verifyToken();
        } catch (error) {
            navigate('/admin/login');
        }
    };

    const fetchAdmissions = async () => {
        try {
            const response = await admissionsService.getAll(filter || null);
            setAdmissions(response.data || []);
        } catch (error) {
            console.error('Error fetching admissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await admissionsService.updateStatus(id, status);
            fetchAdmissions();
        } catch (error) {
            alert('Error updating status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this admission request?')) {
            try {
                await admissionsService.delete(id);
                fetchAdmissions();
            } catch (error) {
                alert('Error deleting admission');
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
                    <h1>Admission Requests</h1>
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
                    <div className="admin-filters">
                        <button
                            className={`filter-btn ${filter === '' ? 'active' : ''}`}
                            onClick={() => setFilter('')}
                        >
                            All
                        </button>
                        <button
                            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                            onClick={() => setFilter('pending')}
                        >
                            Pending
                        </button>
                        <button
                            className={`filter-btn ${filter === 'contacted' ? 'active' : ''}`}
                            onClick={() => setFilter('contacted')}
                        >
                            Contacted
                        </button>
                        <button
                            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
                            onClick={() => setFilter('approved')}
                        >
                            Approved
                        </button>
                        <button
                            className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                            onClick={() => setFilter('rejected')}
                        >
                            Rejected
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Parent Name</th>
                                        <th>Mobile</th>
                                        <th>Email</th>
                                        <th>Class</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admissions.map((admission) => (
                                        <tr key={admission.id}>
                                            <td>{admission.student_name}</td>
                                            <td>{admission.parent_name}</td>
                                            <td>{admission.mobile}</td>
                                            <td>{admission.email || '-'}</td>
                                            <td>{admission.class_applied}</td>
                                            <td>
                                                <select
                                                    className="status-select"
                                                    value={admission.status}
                                                    onChange={(e) => handleStatusUpdate(admission.id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="approved">Approved</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </td>
                                            <td>{new Date(admission.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <button onClick={() => handleDelete(admission.id)} className="btn-icon btn-delete">
                                                    🗑️
                                                </button>
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

export default AdmissionsViewer;
