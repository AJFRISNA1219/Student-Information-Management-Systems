import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function StudentLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        registration_number: '',
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
            const response = await api.post('/student/login.php', formData);
            if (response.success) {
                sessionStorage.setItem('userId', response.data.student.student_id);
                sessionStorage.setItem('userRole', 'student');
                sessionStorage.setItem('userName', `${response.data.student.first_name} ${response.data.student.last_name}`);
                navigate('/student/dashboard');
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
                            <h1 className="card-title">Student Login</h1>
                            <p className="text-muted">Access your student dashboard</p>
                        </div>

                        {error && <div className="alert alert-error">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Registration Number</label>
                                <input
                                    type="text"
                                    name="registration_number"
                                    className="form-input"
                                    value={formData.registration_number}
                                    onChange={handleChange}
                                    required
                                    placeholder="STU2024001"
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

                        <p className="text-center mt-2 text-muted">
                            Don't have an account?{' '}
                            <Link to="/student/register" style={{ color: 'var(--primary-light)' }}>
                                Register here
                            </Link>
                        </p>

                        <p className="text-center mt-1">
                            <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                ← Back to Home
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentLogin;
