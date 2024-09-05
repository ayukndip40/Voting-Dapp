/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { ChartBarIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow-md p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-700">Welcome back, Admin! Here are the actions you can perform:</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <ChartBarIcon className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Manage Elections</h2>
            </div>
            <p className="text-gray-600 mb-4">View, create, update, or delete elections.</p>
            <Link
              to="/admin/manage-elections"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Manage Elections
            </Link>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <UserGroupIcon className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Manage Candidates</h2>
            </div>
            <p className="text-gray-600 mb-4">Review and manage the candidates participating in the elections.</p>
            <Link
              to="/admin/manage-candidates"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
            >
              Manage Candidates
            </Link>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <DocumentTextIcon className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">View Results</h2>
            </div>
            <p className="text-gray-600 mb-4">Access and review the results of the elections from the blockchain.</p>
            <Link
              to="/admin/view-results"
              className="inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
            >
              View Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
