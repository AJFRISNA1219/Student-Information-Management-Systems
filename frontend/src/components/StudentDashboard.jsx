import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function StudentDashboard() {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
    const [changeRequest, setChangeRequest] = useState({
        field_name: '',
        new_value: '',
        message: ''
    });
    const [message, setMessage] = useState('');
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    useEffect(() => {
        fetchStudentProfile();
    }, []);

    const fetchStudentProfile = async () => {
        try {
            const response = await api.get('/student/profile.php');
            if (response.success) {
                setStudent(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            setMessage('Failed to load profile');
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

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploadingPhoto(true);

        try {
            const response = await api.post('/upload.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.success) {
                // Update profile with new photo path
                await api.put('/student/profile.php', {
                    profile_photo: response.data.path
                });

                setMessage('Profile photo updated successfully');
                fetchStudentProfile();
            }
        } catch (err) {
            setMessage('Failed to upload photo');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSubmitChangeRequest = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/student/change-request.php', changeRequest);
            if (response.success) {
                setMessage('Change request submitted successfully');
                setShowChangeRequestModal(false);
                setChangeRequest({ field_name: '', new_value: '', message: '' });
            }
        } catch (err) {
            setMessage(err.message || 'Failed to submit request');
        }
    };

    if (loading) {
        return <div className="spinner"></div>;
    }

    if (!student) {
        return <div className="page"><div className="page-content text-center">No profile found</div></div>;
    }

    const getInitials = () => {
        return `${student.first_name?.[0] || ''}${student.last_name?.[0] || ''}`;
    };

    return (
        <div className="page">
            <div className="page-header">
                <div className="container">
                    <div className="nav">
                        <div className="nav-brand">SIMS - Student Portal</div>
                        <div className="nav-links">
                            <span className="text-muted">Welcome, {student.first_name}!</span>
                            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="container">
                    {message && <div className="alert alert-info">{message}</div>}

                    <div className="card">
                        <div className="profile-photo-container">
                            {student.profile_photo ? (
                                <img
                                    src={`http://localhost/SIMS%20Project/backend/${student.profile_photo}`}
                                    alt="Profile"
                                    className="profile-photo"
                                />
                            ) : (
                                <div className="profile-photo-placeholder">{getInitials()}</div>
                            )}
                            <div>
                                <label htmlFor="photo-upload" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                                    {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
                                </label>
                                <input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    style={{ display: 'none' }}
                                    disabled={uploadingPhoto}
                                />
                            </div>
                        </div>

                        <div className="card-header">
                            <div className="flex-between">
                                <h2 className="card-title">Profile Information</h2>
                                <button
                                    onClick={() => setShowChangeRequestModal(true)}
                                    className="btn btn-primary btn-sm"
                                >
                                    Request Change
                                </button>
                            </div>
                        </div>

                        <div className="info-grid">
                            <div className="info-item">
                                <div className="info-label">Registration Number</div>
                                <div className="info-value">{student.registration_number}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Email</div>
                                <div className="info-value">{student.email}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Full Name</div>
                                <div className="info-value">
                                    {student.first_name} {student.last_name}
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Birth Date</div>
                                <div className="info-value">{student.birth_date}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Gender</div>
                                <div className="info-value">{student.gender}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Phone Number</div>
                                <div className="info-value">{student.phone_number || 'N/A'}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Year</div>
                                <div className="info-value">{student.year}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Course</div>
                                <div className="info-value">{student.course}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Marks</div>
                                <div className="info-value">{student.marks || 0}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">GPA</div>
                                <div className="info-value">{student.gpa || 0.00}</div>
                            </div>
                        </div>

                        {student.subjects && Array.isArray(student.subjects) && student.subjects.length > 0 && (
                            <div className="mt-3">
                                <h3 style={{ marginBottom: '1rem', color: 'var(--primary-light)' }}>Subjects</h3>
                                <div className="grid grid-3">
                                    {student.subjects.map((subject, index) => (
                                        <div key={index} className="info-item">
                                            {subject}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Change Request Modal */}
            {showChangeRequestModal && (
                <div className="modal-overlay" onClick={() => setShowChangeRequestModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="card-title">Request Profile Change</h3>
                            <button className="modal-close" onClick={() => setShowChangeRequestModal(false)}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmitChangeRequest}>
                            <div className="form-group">
                                <label className="form-label">Field to Change</label>
                                <select
                                    className="form-select"
                                    value={changeRequest.field_name}
                                    onChange={(e) => setChangeRequest({ ...changeRequest, field_name: e.target.value })}
                                    required
                                >
                                    <option value="">Select Field</option>
                                    <option value="first_name">First Name</option>
                                    <option value="last_name">Last Name</option>
                                    <option value="email">Email</option>
                                    <option value="phone_number">Phone Number</option>
                                    <option value="course">Course</option>
                                    <option value="year">Year</option>
                                    <option value="birth_date">Birth Date</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">New Value</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={changeRequest.new_value}
                                    onChange={(e) => setChangeRequest({ ...changeRequest, new_value: e.target.value })}
                                    required
                                    placeholder="Enter new value"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Reason for Change</label>
                                <textarea
                                    className="form-textarea"
                                    value={changeRequest.message}
                                    onChange={(e) => setChangeRequest({ ...changeRequest, message: e.target.value })}
                                    required
                                    placeholder="Explain why you need this change"
                                ></textarea>
                            </div>

                            <div className="flex gap-1">
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    Submit Request
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowChangeRequestModal(false)}
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentDashboard;
