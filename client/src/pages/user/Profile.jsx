import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services';
import './Auth.css';

function Profile() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, updateUser, logout, isAuthenticated } = useAuth();
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [formData, setFormData] = useState({ full_name: '', profile_picture: null });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        if (user) setFormData({ full_name: user.full_name || '', profile_picture: null });
    }, [user, isAuthenticated, navigate]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);
        try {
            const data = new FormData();
            data.append('full_name', formData.full_name);
            if (formData.profile_picture) data.append('profile_picture', formData.profile_picture);
            const response = await userService.updateProfile(data);
            updateUser(response.data);
            setMessage({ type: 'success', text: t('profile.updateSuccess') });
            setEditing(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || t('profile.updateError') });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        if (passwordData.new_password !== passwordData.confirm_password) {
            setMessage({ type: 'error', text: t('profile.passwordMismatch') });
            return;
        }
        if (passwordData.new_password.length < 6) {
            setMessage({ type: 'error', text: t('profile.passwordTooShort') });
            return;
        }
        setLoading(true);
        try {
            await userService.changePassword(passwordData.current_password, passwordData.new_password);
            setMessage({ type: 'success', text: t('profile.passwordSuccess') });
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
            setChangingPassword(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || t('profile.passwordError') });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => { logout(); navigate('/'); };

    if (!user) return null;

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="container">
                    <h1>{t('profile.myProfile')}</h1>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div className="profile-content">
                        <div className="profile-sidebar">
                            {user.profile_picture ? (
                                <img
                                    src={`http://localhost:5000/uploads/${user.profile_picture}`}
                                    alt={user.full_name}
                                    className="profile-avatar"
                                />
                            ) : (
                                <div className="profile-avatar-placeholder">
                                    {user.full_name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="profile-info">
                                <h2>{user.full_name}</h2>
                                <p>{user.email}</p>
                                <button onClick={handleLogout} className="btn btn-outline btn-block">
                                    {t('profile.logout')}
                                </button>
                            </div>
                        </div>

                        <div className="profile-main">
                            {message.text && (
                                <div className={`alert alert-${message.type}`}>{message.text}</div>
                            )}

                            {/* Profile Information */}
                            <div className="profile-section">
                                <h3>{t('profile.profileInfo')}</h3>
                                {editing ? (
                                    <form onSubmit={handleProfileUpdate}>
                                        <div className="form-group">
                                            <label className="form-label">{t('profile.fullName')}</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">{t('profile.profilePicture')}</label>
                                            <input
                                                type="file"
                                                className="form-input"
                                                accept="image/*"
                                                onChange={(e) => setFormData({ ...formData, profile_picture: e.target.files[0] })}
                                            />
                                        </div>
                                        <div className="form-actions">
                                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                                {loading ? t('profile.saving') : t('profile.saveChanges')}
                                            </button>
                                            <button type="button" onClick={() => setEditing(false)} className="btn btn-outline">
                                                {t('profile.cancel')}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div>
                                        <p><strong>{t('profile.name')}:</strong> {user.full_name}</p>
                                        <p><strong>{t('profile.email')}:</strong> {user.email}</p>
                                        <button onClick={() => setEditing(true)} className="btn btn-primary">
                                            {t('profile.editProfile')}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Change Password */}
                            <div className="profile-section">
                                <h3>{t('profile.changePassword')}</h3>
                                {changingPassword ? (
                                    <form onSubmit={handlePasswordChange}>
                                        <div className="form-group">
                                            <label className="form-label">{t('profile.currentPassword')}</label>
                                            <input
                                                type="password"
                                                className="form-input"
                                                value={passwordData.current_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">{t('profile.newPassword')}</label>
                                            <input
                                                type="password"
                                                className="form-input"
                                                value={passwordData.new_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">{t('profile.confirmPassword')}</label>
                                            <input
                                                type="password"
                                                className="form-input"
                                                value={passwordData.confirm_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-actions">
                                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                                {loading ? t('profile.changing') : t('profile.changePassword')}
                                            </button>
                                            <button type="button" onClick={() => setChangingPassword(false)} className="btn btn-outline">
                                                {t('profile.cancel')}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button onClick={() => setChangingPassword(true)} className="btn btn-outline">
                                        {t('profile.changePassword')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Profile;