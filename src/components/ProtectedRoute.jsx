import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute — enforces role-based access control on the frontend.
 *
 * Usage:
 *   <ProtectedRoute role="admin">   — only admins may access
 *   <ProtectedRoute role="dealer">  — only dealers may access
 *
 * Unauthenticated users are always sent to "/".
 * Wrong-role users are sent to "/dashboard".
 */
export default function ProtectedRoute({ role, children }) {
  const { isAuthenticated, role: userRole } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
