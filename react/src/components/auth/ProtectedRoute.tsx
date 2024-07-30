import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  element: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, adminOnly }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Redirect to login if no user
    return <Navigate to="/" />;
  }

  if (adminOnly && !currentUser.isAdmin) {
    // Redirect to a forbidden page or elsewhere if not admin
    return <Navigate to="/" />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
