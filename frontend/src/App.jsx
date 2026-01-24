import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import StudentRegister from './components/StudentRegister';
import StudentLogin from './components/StudentLogin';
import StudentDashboard from './components/StudentDashboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminStudents from './components/AdminStudents';
import AdminChangeRequests from './components/AdminChangeRequests';
import AdminProfile from './components/AdminProfile';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/student/login" replace />} />
                <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
                <Route path="/student/register" element={<StudentRegister />} />
                <Route path="/student/login" element={<StudentLogin />} />
                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute role="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/profile"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/students"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminStudents />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/change-requests"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminChangeRequests />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
