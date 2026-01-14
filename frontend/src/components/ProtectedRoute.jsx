import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, role }) => {
    const userRole = sessionStorage.getItem('userRole');
    const userId = sessionStorage.getItem('userId');

    if (!userId || !userRole) {
        return <Navigate to="/" replace />;
    }

    if (role && userRole !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
