import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStudents: 0,
        pendingRequests: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/stats.php');
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch dashboard stats');
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

    const adminName = sessionStorage.getItem('userName') || 'Administrator';

    return (
        <div className="page">
            <div className="page-header">
                <div className="container">
                    <div className="nav">
                        <div className="nav-brand">SIMS - Admin Portal</div>
                        <div className="nav-links">
                            <Link to="/admin/profile" className="nav-link">
                                Welcome, {adminName}!
                            </Link>
                            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="container">
                    <div className="card">
                        <div className="card-header">
                            <h1 className="card-title">Administrator Dashboard</h1>
                            <p className="text-muted">Manage student records and change requests</p>
                        </div>

                        {loading ? (
                            <div className="spinner"></div>
                        ) : (
                            <>
                                <div className="grid grid-2 gap-2">
                                    <Link to="/admin/students" style={{ textDecoration: 'none' }}>
                                        <div className="card" style={{ height: '100%' }}>
                                            <div style={{
                                                fontSize: '3rem',
                                                fontWeight: '700',
                                                background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--secondary) 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                                marginBottom: '1rem'
                                            }}>
                                                {stats.totalStudents}
                                            </div>
                                            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                                Total Students
                                            </h3>
                                            <p className="text-muted">View and manage all student records</p>
                                            <button className="btn btn-primary btn-block mt-2">
                                                Manage Students
                                            </button>
                                        </div>
                                    </Link>

                                    <Link to="/admin/change-requests" style={{ textDecoration: 'none' }}>
                                        <div className="card" style={{ height: '100%' }}>
                                            <div style={{
                                                fontSize: '3rem',
                                                fontWeight: '700',
                                                background: 'linear-gradient(135deg, var(--warning) 0%, var(--accent) 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                                marginBottom: '1rem'
                                            }}>
                                                {stats.pendingRequests}
                                            </div>
                                            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                                Pending Requests
                                            </h3>
                                            <p className="text-muted">Review and approve student change requests</p>
                                            <button className="btn btn-primary btn-block mt-2">
                                                View Requests
                                            </button>
                                        </div>
                                    </Link>
                                </div>

                                <div className="mt-3">
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                                        System Overview
                                    </h3>
                                    <div className="grid grid-3 gap-2">
                                        <div className="card text-center" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                                            <div className="text-muted mb-1">Total Courses</div>
                                            <div style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--success)' }}>{stats.totalCourses || 0}</div>
                                        </div>
                                        <div className="card text-center" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                                            <div className="text-muted mb-1">System Status</div>
                                            <div style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--primary-light)' }}>{stats.systemStatus || 'Optimal'}</div>
                                        </div>
                                        <div className="card text-center" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                                            <div className="text-muted mb-1">Live Uptime</div>
                                            <div style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--info)' }}>{stats.uptime || '99.9%'}</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="grid grid-2 gap-2 mt-2">
                        <div className="card">
                            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Recent Registrations</h3>
                            {stats.recentStudents && stats.recentStudents.length > 0 ? (
                                <div className="table-container" style={{ maxHeight: '300px' }}>
                                    <table style={{ fontSize: '0.875rem' }}>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Reg. No.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.recentStudents.map((student, idx) => (
                                                <tr key={idx}>
                                                    <td>{student.first_name} {student.last_name}</td>
                                                    <td>{student.registration_number}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-muted">No recent registrations</p>
                            )}
                            <Link to="/admin/students" className="btn btn-secondary btn-sm btn-block mt-2" style={{ textDecoration: 'none' }}>
                                View All Students
                            </Link>
                        </div>
                        <div className="card">
                            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Quick Actions</h3>
                            <div className="grid grid-2 gap-1">
                                <Link to="/admin/students" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none', textAlign: 'center' }}>
                                    Search Students
                                </Link>
                                <Link to="/admin/profile" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none', textAlign: 'center' }}>
                                    Update Profile
                                </Link>
                            </div>
                            <div className="mt-2" style={{
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)'
                            }}>
                                <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Admin Support</h4>
                                <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                                    For system issues, contact technical support at <span style={{ color: 'var(--primary-light)' }}>support@sims.edu</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
