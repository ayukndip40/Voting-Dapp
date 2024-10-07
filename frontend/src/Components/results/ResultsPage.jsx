/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { getElectionResults } from "../../api/voteApi";
import { getElections } from "../../api/electionApi";
import {
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResultsPage = ({ results }) => {
  const formattedResults = Object.entries(results).map(([key, value]) => ({
    name: value.name,
    voteCount: Number(value.voteCount),
  }));

  const maxVoteCount = Math.max(
    ...formattedResults.map((result) => result.voteCount),
    1
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(100vh-300px)]">
      {formattedResults.map((result, index) => {
        const color = `hsl(${
          (index * 360) / formattedResults.length
        }, 70%, 50%)`;
        const barWidth = `${(result.voteCount / maxVoteCount) * 100}%`;

        return (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow-lg h-40 flex flex-col justify-between transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-semibold">{result.name}</h4>
              <div className="flex items-center space-x-2">
                <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" />
                <span className="font-medium">{result.voteCount} votes</span>
              </div>
            </div>
            <div className="mt-4 h-4 bg-gray-200 rounded-lg overflow-hidden">
              <div
                className="h-full rounded-lg transition-all duration-1000 ease-out"
                style={{ backgroundColor: color, width: barWidth }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ResultPage = () => {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState("");
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await getElections();
        setElections(response || []);
      } catch (err) {
        setMessage("Failed to fetch elections.");
        toast.error("Failed to fetch elections.");
      }
    };
    fetchElections();
  }, []);

  const handleGetResults = async () => {
    if (!selectedElectionId) {
      setMessage("Please select an election.");
      toast.warn("Please select an election.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await getElectionResults(selectedElectionId);

      if (result.results === null) {
        setMessage(result.message);
        toast.info(result.message);
        setElection(null);
        setCandidates([]);
      } else {
        const electionData = result.election || {};
        const candidatesData = result.results || [];

        const startDateTimestamp = Number(electionData.startDate);
        const endDateTimestamp = Number(electionData.endDate);

        const formattedStartDate = isNaN(startDateTimestamp)
          ? "Invalid Date"
          : new Date(startDateTimestamp * 1000).toLocaleDateString();
        const formattedEndDate = isNaN(endDateTimestamp)
          ? "Invalid Date"
          : new Date(endDateTimestamp * 1000).toLocaleDateString();

        setElection({
          ...electionData,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });
        setCandidates(candidatesData);
        setMessage("");
        toast.success("Results fetched successfully!");
      }
    } catch (error) {
      setMessage(error.message);
      toast.error(error.message);
      setElection(null);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-4 mt-6 bg-gray-100 rounded-lg shadow-lg min-h-screen">
      <ToastContainer />
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Election Results
      </h2>

      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
        <div className="w-full md:w-2/3">
          <label
            htmlFor="election-select"
            className="block font-medium text-gray-700 mb-2"
          >
            Select Election:
          </label>
          <select
            id="election-select"
            value={selectedElectionId}
            onChange={(e) => setSelectedElectionId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
          >
            <option value="">--Select an Election--</option>
            {elections.map((election) => (
              <option key={election.electionId} value={election.electionId}>
                {election.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-center md:justify-start">
          <button
            onClick={handleGetResults}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-md shadow hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Loading...</span>
              </div>
            ) : (
              "Get Results"
            )}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center space-x-2 mb-6 p-4 rounded-lg ${
            message.includes("Failed")
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          } transition-all duration-300 ease-in-out`}
        >
          {message.includes("Failed") ? (
            <XCircleIcon className="h-6 w-6" />
          ) : (
            <CheckCircleIcon className="h-6 w-6" />
          )}
          <span>{message}</span>
        </div>
      )}

      {election && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 transition-all duration-300 hover:shadow-xl">
          <h3 className="text-3xl font-bold text-gray-800 mb-4 hover:text-blue-600 transition-colors duration-300">
            {election.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-gray-600 text-lg">
              <span className="font-semibold">Start Date:</span>{" "}
              {election.startDate}
            </p>
            <p className="text-gray-600 text-lg">
              <span className="font-semibold">End Date:</span>{" "}
              {election.endDate}
            </p>
          </div>
          <div className="mt-6">
            <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              View Details
            </button>
          </div>
        </div>
      )}

      {Object.keys(candidates).length > 0 && (
        <ResultsPage results={candidates} />
      )}
    </div>
  );
};

export default ResultPage;
