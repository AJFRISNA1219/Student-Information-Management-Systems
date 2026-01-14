import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="page">
            <div className="page-content flex-center">
                <div className="container-sm">
                    <div className="card text-center">
                        <h1 className="card-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                            Student Information Management System
                        </h1>
                        <p className="text-muted" style={{ fontSize: '1.125rem', marginBottom: '3rem' }}>
                            Centralized, secure, and efficient digital solution for managing student records
                        </p>

                        <div className="grid grid-2 gap-2">
                            <div className="card">
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-light)' }}>
                                    Student Portal
                                </h2>
                                <p className="text-muted mb-2">
                                    Register, login, and manage your academic profile
                                </p>
                                <div className="flex gap-1" style={{ flexDirection: 'column' }}>
                                    <Link to="/student/register" className="btn btn-primary btn-block">
                                        Register
                                    </Link>
                                    <Link to="/student/login" className="btn btn-secondary btn-block">
                                        Login
                                    </Link>
                                </div>
                            </div>

                            <div className="card">
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--secondary)' }}>
                                    Administrator Portal
                                </h2>
                                <p className="text-muted mb-2">
                                    Manage student records and approve change requests
                                </p>
                                <Link to="/admin/login" className="btn btn-primary btn-block">
                                    Admin Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
