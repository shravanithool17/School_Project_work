import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

function SignIn() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await userService.login(formData.email, formData.password);
            login(response.data.user, response.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <h1>Welcome Back</h1>
                    <p className="text-muted">Sign in to your account</p>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
