import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function AdminProfile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        full_name: '',
        username: '',
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/admin/profile.php');
            if (response.success) {
                setProfile({
                    ...profile,
                    full_name: response.data.full_name,
                    username: response.data.username
                });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout.php');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            sessionStorage.clear();
            navigate('/');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (profile.new_password && profile.new_password !== profile.confirm_password) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        try {
            const response = await api.put('/admin/profile.php', {
                full_name: profile.full_name,
                current_password: profile.current_password,
                new_password: profile.new_password
            });

            if (response.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully' });
                sessionStorage.setItem('userName', profile.full_name);
                setProfile({
                    ...profile,
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div className="container">
                    <div className="nav">
                        <div className="nav-brand">SIMS - Admin Profile</div>
                        <div className="nav-links">
                            <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                            <Link to="/admin/students" className="nav-link">Students</Link>
                            <Link to="/admin/change-requests" className="nav-link">Change Requests</Link>
                            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="container-sm">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">Manage Profile</h2>
                            <p className="text-muted">Update your administrative information and password</p>
                        </div>

                        {message.text && (
                            <div className={`alert alert-${message.type === 'error' ? 'danger' : 'info'} mb-2`}>
                                {message.text}
                            </div>
                        )}

                        {loading ? (
                            <div className="spinner"></div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={profile.username}
                                        disabled
                                        style={{ opacity: 0.7, cursor: 'not-allowed' }}
                                    />
                                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Username cannot be changed</small>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={profile.full_name}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                        required
                                    />
                                </div>

                                <hr className="my-2" style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

                                <div className="card" style={{ background: 'rgba(255, 255, 255, 0.05)', marginTop: '1rem' }}>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--primary-light)' }}>Change Password</h3>

                                    <div className="form-group">
                                        <label className="form-label">Current Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={profile.current_password}
                                            onChange={(e) => setProfile({ ...profile, current_password: e.target.value })}
                                            placeholder="Required to change password"
                                        />
                                    </div>

                                    <div className="grid grid-2">
                                        <div className="form-group">
                                            <label className="form-label">New Password</label>
                                            <input
                                                type="password"
                                                className="form-input"
                                                value={profile.new_password}
                                                onChange={(e) => setProfile({ ...profile, new_password: e.target.value })}
                                                placeholder="Leave blank to keep current"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Confirm New Password</label>
                                            <input
                                                type="password"
                                                className="form-input"
                                                value={profile.confirm_password}
                                                onChange={(e) => setProfile({ ...profile, confirm_password: e.target.value })}
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary btn-block mt-2">
                                    Save Profile Changes
                                </button>

                                <Link to="/admin/dashboard" className="btn btn-secondary btn-block mt-1">
                                    Back to Dashboard
                                </Link>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProfile;
