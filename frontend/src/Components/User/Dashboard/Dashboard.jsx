/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { RectangleGroupIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline'; // Import icons from Heroicons

const UserDashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="mb-8 bg-gradient-to-r from-blue-50 via-gray-100 to-white p-6 rounded-lg shadow-md">
       <h1 className="text-4xl font-extrabold text-gray-900 mb-2">User Dashboard</h1>
       <p className="text-gray-600 text-lg">
       <span className="font-semibold text-blue-600">Welcome back!</span> Here’s what you can do:
       </p>
      </header>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4 border border-gray-300">
          <RectangleGroupIcon className="w-12 h-12 text-blue-600" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">Elections</h2>
            <p className="text-gray-600 mt-1">View and participate in upcoming elections.</p>
            <Link
              to="/user/elections"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              View Elections
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4 border border-gray-300">
          <ChartBarIcon className="w-12 h-12 text-green-600" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">Results</h2>
            <p className="text-gray-600 mt-1">Check out the results of past elections.</p>
            <Link
              to="/user/results"
              className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              View Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
