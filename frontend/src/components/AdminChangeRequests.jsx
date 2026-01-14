import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function AdminChangeRequests() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchChangeRequests();
    }, []);

    const fetchChangeRequests = async () => {
        try {
            const response = await api.get('/admin/change-requests.php?status=pending');
            if (response.success) {
                setRequests(response.data);
            }
        } catch (err) {
            setMessage('Failed to load change requests');
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

    const handleApprove = async (requestId) => {
        if (!confirm('Are you sure you want to approve this change request?')) {
            return;
        }

        try {
            const response = await api.put('/admin/change-requests.php', {
                request_id: requestId,
                status: 'approved'
            });

            if (response.success) {
                setMessage('Change request approved successfully');
                fetchChangeRequests();
            }
        } catch (err) {
            setMessage(err.message || 'Failed to approve request');
        }
    };

    const handleReject = async (requestId) => {
        if (!confirm('Are you sure you want to reject this change request?')) {
            return;
        }

        try {
            const response = await api.put('/admin/change-requests.php', {
                request_id: requestId,
                status: 'rejected'
            });

            if (response.success) {
                setMessage('Change request rejected');
                fetchChangeRequests();
            }
        } catch (err) {
            setMessage(err.message || 'Failed to reject request');
        }
    };

    const formatFieldName = (fieldName) => {
        return fieldName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="page">
            <div className="page-header">
                <div className="container">
                    <div className="nav">
                        <div className="nav-brand">SIMS - Change Requests</div>
                        <div className="nav-links">
                            <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                            <Link to="/admin/students" className="nav-link">Students</Link>
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
                        <div className="card-header">
                            <h2 className="card-title">Pending Change Requests</h2>
                            <p className="text-muted">Review and process student modification requests</p>
                        </div>

                        {loading ? (
                            <div className="spinner"></div>
                        ) : requests.length === 0 ? (
                            <div className="text-center text-muted" style={{ padding: '2rem' }}>
                                <p style={{ fontSize: '1.125rem' }}>No pending change requests</p>
                                <p>All requests have been processed!</p>
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                {requests.map(request => (
                                    <div key={request.request_id} className="card">
                                        <div className="flex-between mb-2">
                                            <div>
                                                <h3 style={{ fontSize: '1.125rem', color: 'var(--primary-light)', marginBottom: '0.25rem' }}>
                                                    {request.first_name} {request.last_name}
                                                </h3>
                                                <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                                                    {request.registration_number} • {request.email}
                                                </p>
                                            </div>
                                            <span className="badge badge-pending">Pending</span>
                                        </div>

                                        <div className="info-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                                            <div className="info-item">
                                                <div className="info-label">Field</div>
                                                <div className="info-value">{formatFieldName(request.field_name)}</div>
                                            </div>
                                            <div className="info-item">
                                                <div className="info-label">Current Value</div>
                                                <div className="info-value">{request.old_value || 'N/A'}</div>
                                            </div>
                                            <div className="info-item">
                                                <div className="info-label">Requested Value</div>
                                                <div className="info-value" style={{ color: 'var(--success)' }}>
                                                    {request.new_value}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-2" style={{
                                            background: 'rgba(99, 102, 241, 0.05)',
                                            padding: '1rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border)'
                                        }}>
                                            <div className="info-label" style={{ marginBottom: '0.5rem' }}>Reason</div>
                                            <p className="text-muted">{request.message}</p>
                                        </div>

                                        <div className="flex gap-1 mt-2">
                                            <button
                                                onClick={() => handleApprove(request.request_id)}
                                                className="btn btn-success"
                                                style={{ flex: 1 }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.request_id)}
                                                className="btn btn-danger"
                                                style={{ flex: 1 }}
                                            >
                                                Reject
                                            </button>
                                        </div>

                                        <p className="text-muted text-center mt-1" style={{ fontSize: '0.75rem' }}>
                                            Requested on {new Date(request.requested_at).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminChangeRequests;
