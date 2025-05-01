// // src/components/PrivateRoute.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ element }) => {
//   const isAuthenticated = localStorage.getItem('token'); // Check if token exists

//   return isAuthenticated ? element : <Navigate to="/login" />; // Redirect to login if not authenticated
// };

// export default PrivateRoute;
// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ element, children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')); // assuming user info is stored
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Support nested routes (children)
  return element || children;
};

export default PrivateRoute;
