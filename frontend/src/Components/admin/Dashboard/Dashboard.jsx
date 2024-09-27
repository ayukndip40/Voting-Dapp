/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { ChartBarIcon, UserGroupIcon, DocumentTextIcon, ChartPieIcon, UserIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cool background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 animate-gradient-xy opacity-50"></div>

      {/* Dashboard Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg p-6 rounded-lg mb-8 text-white flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-300 mt-2">Welcome back, Admin! Manage the platform effectively below.</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-lg font-medium">Admin Name</span>
          </div>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Manage Elections */}
          <div className="group bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-500">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <ChartBarIcon className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Manage Elections</h2>
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

          {/* Manage Candidates */}
          <div className="group bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-500">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <UserGroupIcon className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Manage Candidates</h2>
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

          {/* View Results */}
          <div className="group bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-500">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <DocumentTextIcon className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">View Results</h2>
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

          {/* Voter Turnout */}
          <div className="group bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-500">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <ChartPieIcon className="w-8 h-8 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Voter Turnout</h2>
              </div>
              <p className="text-gray-600 mb-4">Analyze voter turnout and trends.</p>
              <Link
                to="/admin/analytics"
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
              >
                View Analytics
              </Link>
            </div>
          </div>

          {/* Manage Voters */}
          <div className="group bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-500">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <UserIcon className="w-8 h-8 text-yellow-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Manage Voters</h2>
              </div>
              <p className="text-gray-600 mb-4">View and manage registered voters.</p>
              <Link
                to="/admin/manage-users"
                className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition duration-300"
              >
                Manage Voters
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
