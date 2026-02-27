import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { galleryService, authService } from '../../services';
import './AdminPages.css';

function GalleryManagement() {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        image: null
    });

    useEffect(() => {
        verifyAuth();
        fetchImages();
    }, []);

    const verifyAuth = async () => {
        try {
            await authService.verifyToken();
        } catch (error) {
            navigate('/admin/login');
        }
    };

    const fetchImages = async () => {
        try {
            const response = await galleryService.getAll();
            setImages(response.data || []);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('image', formData.image);

        try {
            await galleryService.upload(data);
            resetForm();
            fetchImages();
        } catch (error) {
            alert('Error uploading image');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                await galleryService.delete(id);
                fetchImages();
            } catch (error) {
                alert('Error deleting image');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: '',
            image: null
        });
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
                    <h1>Gallery Management</h1>
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
                            {showForm ? 'Cancel' : '+ Upload Image'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="admin-form-card">
                            <h2>Upload New Image</h2>
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
                                    <label className="form-label">Category *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="e.g., Sports, Cultural, Academic"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Image *</label>
                                    <input
                                        type="file"
                                        className="form-input"
                                        accept="image/*"
                                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        Upload Image
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
                        <div className="gallery-admin-grid">
                            {images.map((image) => (
                                <div key={image.id} className="gallery-admin-item">
                                    <img
                                        src={`http://localhost:5000/uploads/${image.image_path}`}
                                        alt={image.title}
                                    />
                                    <div className="gallery-admin-info">
                                        <h4>{image.title}</h4>
                                        <span className="badge">{image.category}</span>
                                        <button onClick={() => handleDelete(image.id)} className="btn-icon btn-delete">
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default GalleryManagement;
