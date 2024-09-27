/* eslint-disable no-unused-vars */
// DashboardRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AdminDashboard from '../Components/admin/Dashboard/Dashboard'; // Adjust the import path as needed
import UserDashboard from '../Components/User/Dashboard/Dashboard'; // Adjust the import path as needed

const DashboardRoute = () => {
  const { user, loading } = useAuth(); // Also check for loading

  // Show a loading indicator while fetching user data
  if (loading) {
    return <div>Loading...</div>; // You can customize this as needed
  }

  // Redirect to login if the user is not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Render the correct dashboard based on the user's role
  return user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};

export default DashboardRoute;
