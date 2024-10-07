/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import {
  RectangleGroupIcon,
  ChartBarIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

const UserDashboard = () => {
  // Sample data for statistics
  const totalElections = 10; // Total available elections
  const participatedElections = 5; // Elections the user participated in
  const totalVotes = 20; // Total votes user could have cast
  const votesCast = 10; // Votes the user has cast

  // Calculate progress percentages
  const participationPercentage =
    (participatedElections / totalElections) * 100;
  const votesPercentage = (votesCast / totalVotes) * 100;

  //window.location.reload();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="mb-8 flex justify-between items-center bg-gradient-to-r from-blue-50 via-gray-100 to-white p-6 rounded-lg shadow-md">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            User Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            <span className="font-semibold text-blue-600">Welcome back!</span>{" "}
            Here’s what you can do:
          </p>
        </div>
        {/*<div className="flex items-center space-x-4">
          <BellIcon className="w-8 h-8 text-gray-500 cursor-pointer hover:text-blue-600" />
          <div className="flex items-center space-x-3">
            <img
              src="/path-to-avatar.jpg"
              alt="User Avatar"
              className="w-10 h-10 rounded-full border border-gray-300"
            />
            <span className="text-gray-700 font-semibold">User Name</span>
          </div>
        </div>*/}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4 border border-gray-300 transform hover:scale-105 transition duration-300">
          <RectangleGroupIcon className="w-12 h-12 text-blue-600" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">Elections</h2>
            <p className="text-gray-600 mt-1">
              View and participate in upcoming elections.
            </p>
            <Link
              to="/user/elections"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-400 transition duration-300"
            >
              View Elections
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4 border border-gray-300 transform hover:scale-105 transition duration-300">
          <ChartBarIcon className="w-12 h-12 text-green-600" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">Results</h2>
            <p className="text-gray-600 mt-1">
              Check out the results of past elections.
            </p>
            <Link
              to="/user/view-results"
              className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:ring focus:ring-green-400 transition duration-300"
            >
              View Results
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border border-gray-300">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <ul className="mt-4 text-gray-600">
          <li>Participated in the 2024 Local Elections</li>
          <li>Checked results for the 2023 National Elections</li>
          <li>Updated profile information</li>
        </ul>
      </div>

      {/* Statistics Overview with Progress Bars */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border border-gray-300">
        <h2 className="text-xl font-semibold text-gray-900">Your Statistics</h2>

        {/* Elections Participation */}
        <p className="mt-2">
          Elections Participated:{" "}
          <span className="font-bold">{participatedElections}</span> /{" "}
          {totalElections}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${participationPercentage}%` }}
          ></div>
        </div>

        {/* Votes Cast */}
        <p className="mt-4">
          Votes Cast: <span className="font-bold">{votesCast}</span> /{" "}
          {totalVotes}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
          <div
            className="bg-green-600 h-4 rounded-full"
            style={{ width: `${votesPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
