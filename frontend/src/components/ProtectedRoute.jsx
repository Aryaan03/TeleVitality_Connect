import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; 

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token'); // Check if token exists
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// ProtectedRoute.propTypes = {
//     children: PropTypes.node.isRequired
//   };
  
//   export default ProtectedRoute;