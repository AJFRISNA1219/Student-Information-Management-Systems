import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function StudentRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        registration_number: '',
        email: '',
        first_name: '',
        last_name: '',
        birth_date: '',
        gender: '',
        phone_number: '',
        year: '',
        course: '',
        password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
        setSuccess('');

        // Validate passwords match
        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return;
        }

        // Validate password strength
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/student/register.php', formData);
            if (response.success) {
                setSuccess('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/student/login');
                }, 2000);
            }
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="page-content">
                <div className="container-sm">
                    <div className="card">
                        <div className="card-header">
                            <h1 className="card-title">Student Registration</h1>
                            <p className="text-muted">Create your student account</p>
                        </div>

                        {error && <div className="alert alert-error">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-2">
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
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="student@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        className="form-input"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        className="form-input"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">Birth Date</label>
                                    <input
                                        type="date"
                                        name="birth_date"
                                        className="form-input"
                                        value={formData.birth_date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Gender</label>
                                    <select
                                        name="gender"
                                        className="form-select"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        className="form-input"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        required
                                        placeholder="+1234567890"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Year</label>
                                    <input
                                        type="number"
                                        name="year"
                                        className="form-input"
                                        value={formData.year}
                                        onChange={handleChange}
                                        required
                                        placeholder="1"
                                        min="1"
                                        max="6"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Course</label>
                                <input
                                    type="text"
                                    name="course"
                                    className="form-input"
                                    value={formData.course}
                                    onChange={handleChange}
                                    required
                                    placeholder="Computer Science"
                                />
                            </div>

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-input"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength="6"
                                        placeholder="Minimum 6 characters"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        className="form-input"
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Re-enter password"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block mt-2" disabled={loading}>
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </form>

                        <p className="text-center mt-2 text-muted">
                            Already have an account?{' '}
                            <Link to="/student/login" style={{ color: 'var(--primary-light)' }}>
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentRegister;
