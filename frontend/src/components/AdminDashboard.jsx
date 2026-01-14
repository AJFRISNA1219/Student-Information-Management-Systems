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
            const [studentsResponse, requestsResponse] = await Promise.all([
                api.get('/admin/students.php'),
                api.get('/admin/change-requests.php?status=pending')
            ]);

            setStats({
                totalStudents: studentsResponse.data?.length || 0,
                pendingRequests: requestsResponse.data?.length || 0
            });
        } catch (err) {
            console.error('Failed to fetch stats:', err);
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
                            <span className="text-muted">Welcome, {adminName}!</span>
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
