/* eslint-disable no-unused-vars */
// DashboardRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AdminDashboard from '../Components/admin/Dashboard/Dashboard'; // Adjust the import path as needed
import UserDashboard from '../Components/User/Dashboard/Dashboard'; // Adjust the import path as needed

const DashboardRoute = () => {
  const { updateUser } = useAuth();

  if (!updateUser) {
    return <Navigate to="/login" />;
  }

  // Render the dashboard based on user role
  return updateUser.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};

export default DashboardRoute;
