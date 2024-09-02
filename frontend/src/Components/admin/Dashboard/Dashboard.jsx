/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Import specific styles for the Admin Dashboard

const Dashboard = () => {
  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, Admin! Here’s what you can manage:</p>
      </header>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Manage Elections</h2>
          <p>View, create, update, or delete elections.</p>
          <Link to="/admin/manage-elections" className="btn-primary">Manage Elections</Link>
        </div>
        <div className="dashboard-card">
          <h2>Manage Candidates</h2>
          <p>Review and manage the candidates participating in the elections.</p>
          <Link to="/admin/manage-candidates" className="btn-primary">Manage Candidates</Link>
        </div>
        <div className="dashboard-card">
          <h2>View Results</h2>
          <p>Access and review the results of the elections from the blockchain.</p>
          <Link to="/admin/view-results" className="btn-primary">View Results</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
