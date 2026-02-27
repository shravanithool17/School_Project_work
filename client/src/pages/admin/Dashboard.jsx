import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services';

function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await authService.verifyToken();
            } catch (error) {
                navigate('/admin/login');
            }
        };

        verifyAuth();
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/admin/login');
    };

    return (
        <div className="page">
            <div className="admin-header">
                <div className="container">
                    <h1>Admin Dashboard</h1>
                    <button onClick={handleLogout} className="btn btn-outline">
                        Logout
                    </button>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div className="grid grid-3">
                        <div className="card" onClick={() => navigate('/admin/faculty')} style={{ cursor: 'pointer' }}>
                            <h3>Faculty Management</h3>
                            <p className="text-muted">Manage faculty members</p>
                            <p className="text-primary">→ Go to Faculty</p>
                        </div>

                        <div className="card" onClick={() => navigate('/admin/events')} style={{ cursor: 'pointer' }}>
                            <h3>Events Management</h3>
                            <p className="text-muted">Manage events and news</p>
                            <p className="text-primary">→ Go to Events</p>
                        </div>

                        <div className="card" onClick={() => navigate('/admin/gallery')} style={{ cursor: 'pointer' }}>
                            <h3>Gallery Management</h3>
                            <p className="text-muted">Upload and manage images</p>
                            <p className="text-primary">→ Go to Gallery</p>
                        </div>

                        <div className="card" onClick={() => navigate('/admin/admissions')} style={{ cursor: 'pointer' }}>
                            <h3>Admissions</h3>
                            <p className="text-muted">View admission enquiries</p>
                            <p className="text-primary">→ Go to Admissions</p>
                        </div>

                        <div className="card" onClick={() => navigate('/admin/messages')} style={{ cursor: 'pointer' }}>
                            <h3>Contact Messages</h3>
                            <p className="text-muted">View contact form submissions</p>
                            <p className="text-primary">→ Go to Messages</p>
                        </div>

                        <div className="card" onClick={() => navigate('/admin/announcements')} style={{ cursor: 'pointer' }}>
                            <h3>Announcements</h3>
                            <p className="text-muted">Manage announcements</p>
                            <p className="text-primary">→ Go to Announcements</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
