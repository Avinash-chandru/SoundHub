import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, isAdmin } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default ProtectedRoute;