import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { facultyService, authService } from '../../services';
import './AdminPages.css';

function FacultyManagement() {
    const navigate = useNavigate();
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        department: '',
        qualification: '',
        experience: '',
        profile_image: null
    });

    useEffect(() => {
        verifyAuth();
        fetchFaculty();
    }, []);

    const verifyAuth = async () => {
        try {
            await authService.verifyToken();
        } catch (error) {
            navigate('/admin/login');
        }
    };

    const fetchFaculty = async () => {
        try {
            const response = await facultyService.getAll();
            setFaculty(response.data || []);
        } catch (error) {
            console.error('Error fetching faculty:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) data.append(key, formData[key]);
        });

        try {
            if (editingId) {
                await facultyService.update(editingId, data);
            } else {
                await facultyService.create(data);
            }
            resetForm();
            fetchFaculty();
        } catch (error) {
            alert('Error saving faculty member');
        }
    };

    const handleEdit = (member) => {
        setEditingId(member.id);
        setFormData({
            name: member.name,
            designation: member.designation,
            department: member.department,
            qualification: member.qualification || '',
            experience: member.experience || '',
            profile_image: null
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this faculty member?')) {
            try {
                await facultyService.delete(id);
                fetchFaculty();
            } catch (error) {
                alert('Error deleting faculty member');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            designation: '',
            department: '',
            qualification: '',
            experience: '',
            profile_image: null
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
                    <h1>Faculty Management</h1>
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
                            {showForm ? 'Cancel' : '+ Add Faculty'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="admin-form-card">
                            <h2>{editingId ? 'Edit Faculty' : 'Add New Faculty'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Name *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Designation *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.designation}
                                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Department *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Qualification</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.qualification}
                                            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Experience (years)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Profile Image</label>
                                        <input
                                            type="file"
                                            className="form-input"
                                            accept="image/*"
                                            onChange={(e) => setFormData({ ...formData, profile_image: e.target.files[0] })}
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        {editingId ? 'Update' : 'Add'} Faculty
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
                                        <th>Name</th>
                                        <th>Designation</th>
                                        <th>Department</th>
                                        <th>Qualification</th>
                                        <th>Experience</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faculty.map((member) => (
                                        <tr key={member.id}>
                                            <td>
                                                {member.profile_image && (
                                                    <img
                                                        src={`http://localhost:5000/uploads/${member.profile_image}`}
                                                        alt={member.name}
                                                        className="table-image"
                                                    />
                                                )}
                                            </td>
                                            <td>{member.name}</td>
                                            <td>{member.designation}</td>
                                            <td>{member.department}</td>
                                            <td>{member.qualification || '-'}</td>
                                            <td>{member.experience ? `${member.experience} years` : '-'}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <button onClick={() => handleEdit(member)} className="btn-icon btn-edit">
                                                        ✏️
                                                    </button>
                                                    <button onClick={() => handleDelete(member.id)} className="btn-icon btn-delete">
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

export default FacultyManagement;
