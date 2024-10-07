/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { castVote } from "../../../api/voteApi";
import imageurl from "../../../assets/001.jpg";
// Spinner Component
const Spinner = () => (
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
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 0116 0A8 8 0 014 12z"
    />
  </svg>
);

// VoteForm Component
const VoteForm = ({ electionId, candidates, isElectionActive }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVote = async (candidateId) => {
    if (!candidateId) {
      setError("Invalid candidate selected.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await castVote({ electionId, candidateId });
      setSuccess("Vote cast successfully on the Blockchain");
    } catch (error) {
      // Log the entire error object for debugging
      console.error("Error object structure:", error);

      // Display the server's error message from error.message
      setError(error.message || "Failed to cast vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-8">
      <div className="w-full max-w-3xl p-8 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105 duration-300">
        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-8">
          {isElectionActive ? "Cast Your Vote" : "Election Closed"}
        </h2>
        <div className="space-y-6">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className="p-6 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300 transform hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={imageurl}
                  alt={candidate.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="text-xl font-medium text-gray-800">
                  {candidate.name}
                </span>
              </div>
              <button
                onClick={() => handleVote(candidate.candidateId)}
                disabled={loading || !isElectionActive}
                className={`flex items-center px-6 py-3 text-white rounded-lg transition-colors duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : isElectionActive
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? <Spinner /> : isElectionActive ? "Vote" : "Closed"}
              </button>
            </div>
          ))}
        </div>
        {error && (
          <div className="mt-6 text-red-500 text-center font-semibold transition-opacity duration-300">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-6 text-green-500 text-center font-semibold transition-opacity duration-300">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoteForm;
