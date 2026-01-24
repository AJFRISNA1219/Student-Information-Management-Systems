import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function AdminLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/admin/login.php', formData);
            if (response.success) {
                sessionStorage.setItem('userId', response.data.admin.admin_id);
                sessionStorage.setItem('userRole', 'admin');
                sessionStorage.setItem('userName', response.data.admin.full_name);
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="page-content flex-center">
                <div className="container-xs">
                    <div className="card">
                        <div className="card-header">
                            <h1 className="card-title">Administrator Login</h1>
                            <p className="text-muted">Access the admin dashboard</p>
                        </div>

                        {error && <div className="alert alert-error">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-input"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="admin"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your password"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary btn-block mt-2" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <div className="mt-2 text-center" style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}>
                            <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                Default Admin Credentials:
                            </p>
                            <p style={{ color: 'var(--info)', fontWeight: '500' }}>
                                Username: admin | Password: sims_admin_2026!
                            </p>
                        </div>

                        <p className="text-center mt-2">
                            <Link to="/admin" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                Admin Portal Entry
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
