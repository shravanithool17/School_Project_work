import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle, School } from 'lucide-react';
import './Auth.css';

function SignUp() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', full_name: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const getStrength = (pwd) => {
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return score;
    };

    const strengthInfo = (score) => {
        if (score === 0) return { label: '', color: '#e2e8f0', width: '0%' };
        if (score === 1) return { label: 'Weak', color: '#ef4444', width: '25%' };
        if (score === 2) return { label: 'Fair', color: '#f59e0b', width: '50%' };
        if (score === 3) return { label: 'Good', color: '#3b82f6', width: '75%' };
        return { label: 'Strong', color: '#10b981', width: '100%' };
    };

    const strength = strengthInfo(getStrength(formData.password));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            const response = await userService.register({
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name
            });
            setSuccessMessage('Account created successfully! Redirecting...');
            setTimeout(() => { login(response.data.user, response.data.token); navigate('/profile'); }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                {/* Brand */}
                <div className="auth-brand">
                    <div className="auth-logo"><School size={24} /></div>
                    <div className="auth-brand-text">
                        <h1>Kendriya Vidyalaya Yavatmal</h1>
                        <p className="auth-subtitle">Yavatmal, Maharashtra</p>
                    </div>
                </div>

                {/* Header */}
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p className="auth-description">Join our school community today</p>
                </div>

                {successMessage && (
                    <div className="auth-success-message">
                        <CheckCircle size={16} /><span>{successMessage}</span>
                    </div>
                )}
                {error && (
                    <div className="auth-error-message">
                        <AlertCircle size={16} /><span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">

                    {/* Full Name */}
                    <div className="form-group">
                        <label className="form-label"><User size={13} /> Full Name</label>
                        <input
                            type="text" name="full_name" className="form-input"
                            value={formData.full_name} onChange={handleChange}
                            placeholder="Enter your full name"
                            required autoComplete="name"
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label className="form-label"><Mail size={13} /> Email Address</label>
                        <input
                            type="email" name="email" className="form-input"
                            value={formData.email} onChange={handleChange}
                            placeholder="student@newhighschool.edu"
                            required autoComplete="email"
                        />
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label className="form-label"><Lock size={13} /> Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"} name="password"
                                className="form-input password-input"
                                value={formData.password} onChange={handleChange}
                                placeholder="Create a strong password"
                                required autoComplete="new-password"
                            />
                            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>

                        {/* ✅ Strength bar - no list */}
                        {formData.password && (
                            <div className="strength-wrapper">
                                <div className="strength-bar-track">
                                    <div className="strength-bar-fill" style={{ width: strength.width, background: strength.color }}></div>
                                </div>
                                <span className="strength-label" style={{ color: strength.color }}>
                                    {strength.label}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label className="form-label"><Lock size={13} /> Confirm Password</label>
                        <div className="password-input-container">
                            <input
                                type={showConfirmPassword ? "text" : "password"} name="confirmPassword"
                                className="form-input password-input"
                                value={formData.confirmPassword} onChange={handleChange}
                                placeholder="Confirm your password"
                                required autoComplete="new-password"
                            />
                            <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                        {formData.confirmPassword && (
                            <div className="password-match">
                                {formData.password === formData.confirmPassword
                                    ? <span className="match-success"><CheckCircle size={12} /> Passwords match</span>
                                    : <span className="match-error"><AlertCircle size={12} /> Passwords do not match</span>}
                            </div>
                        )}
                    </div>

                    {/* Terms */}
                    <div className="form-group terms-group">
                        <label className="checkbox-label">
                            <input type="checkbox" required />
                            <span className="checkmark"></span>
                            I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                        </label>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="btn btn-auth"
                        disabled={loading || !formData.email || !formData.password || !formData.confirmPassword || !formData.full_name}>
                        {loading ? <><div className="spinner"></div> Creating Account...</> : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
                </div>

            </div>
        </div>
    );
}

export default SignUp;