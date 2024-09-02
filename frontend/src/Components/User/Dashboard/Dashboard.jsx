/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Import specific styles for the User Dashboard

const UserDashboard = () => {
  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <h1>User Dashboard</h1>
        <p>Welcome back! Here’s what you can do:</p>
      </header>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Elections</h2>
          <p>View and participate in upcoming elections.</p>
          <Link to="/user/elections" className="btn-primary">View Elections</Link>
        </div>
        <div className="dashboard-card">
          <h2>Results</h2>
          <p>Check out the results of past elections.</p>
          <Link to="/user/results" className="btn-primary">View Results</Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
