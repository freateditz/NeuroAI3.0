import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ParentProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'parent') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ParentProtectedRoute;
