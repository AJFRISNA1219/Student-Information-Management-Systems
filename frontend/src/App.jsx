import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import StudentRegister from './components/StudentRegister';
import StudentLogin from './components/StudentLogin';
import StudentDashboard from './components/StudentDashboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminStudents from './components/AdminStudents';
import AdminChangeRequests from './components/AdminChangeRequests';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
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
