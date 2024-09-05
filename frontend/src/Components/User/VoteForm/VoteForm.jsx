/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { castVote } from '../../../api/voteApi';

const VoteForm = ({ electionId, candidates, isElectionActive }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVote = async (candidateId) => {
    if (!candidateId) {
      setError('Invalid candidate selected.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await castVote({ electionId, candidateId });
      setSuccess('Vote cast successfully!');
    } catch (error) {
      setError('Failed to cast vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xl p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
          {isElectionActive ? 'Cast Your Vote' : 'Election Closed'}
        </h2>
        <div className="space-y-5">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className="p-4 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={candidate.image || 'https://via.placeholder.com/40'}
                  alt={candidate.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-lg font-medium text-gray-800">{candidate.name}</span>
              </div>
              <button
                onClick={() => handleVote(candidate.candidateId)}
                disabled={loading || !isElectionActive}
                className={`px-5 py-2 text-white rounded-lg transition-colors duration-300 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isElectionActive
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? 'Voting...' : isElectionActive ? 'Vote' : 'Closed'}
              </button>
            </div>
          ))}
        </div>
        {error && (
          <div className="mt-4 text-red-500 text-center font-semibold">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 text-green-500 text-center font-semibold">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoteForm;
