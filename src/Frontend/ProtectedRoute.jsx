import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { DataContext } from './DataProvider/DataProvider';

const ProtectedRoute = ({ children }) => {
  const { localUsername } = useContext(DataContext);

  if (localUsername.trim() === "") {
    return <Navigate to="/signup" />;
  }

  // if username is set, allow access to the requested page
  return children;
};

export default ProtectedRoute;
