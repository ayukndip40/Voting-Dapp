/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { getElectionResults } from '../../api/voteApi';
import { getElections } from '../../api/electionApi';
import { ChartBarIcon, CheckCircleIcon, XCircleIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const ResultsPage = ({ results }) => {
  const maxVoteCount = Math.max(...results.map(result => result.voteCount), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[400px]">
      {results.map((result, index) => {
        const color = `hsl(${(index * 360) / results.length}, 70%, 50%)`;
        const barWidth = `${(result.voteCount / maxVoteCount) * 100}%`;

        return (
          <div key={result.candidateId} className="p-4 bg-white rounded-lg shadow-lg h-40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-semibold">{result.name}</h4>
              <div className="flex items-center space-x-2">
                <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" />
                <span className="font-medium">{result.voteCount} votes</span>
              </div>
            </div>
            <div className="mt-4 h-4 bg-gray-200 rounded-lg overflow-hidden">
              <div
                className="h-full rounded-lg"
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
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await getElections();
        setElections(response || []);
      } catch (err) {
        setError('Failed to fetch elections.');
      }
    };
    fetchElections();
  }, []);

  const handleGetResults = async () => {
    if (!selectedElectionId) {
      setError('Please select an election.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getElectionResults(selectedElectionId);
      const electionData = result.election || {};
      const candidatesData = result.results || [];

      const formattedStartDate = new Date(Number(electionData.startDate) * 1000).toLocaleDateString();
      const formattedEndDate = new Date(Number(electionData.endDate) * 1000).toLocaleDateString();

      setElection({
        ...electionData,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });
      setCandidates(candidatesData);
    } catch (error) {
      setError('Failed to fetch election results.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 mt-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Election Results</h2>

      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
        <div className="w-full">
          <label htmlFor="election-select" className="block font-medium text-gray-700 mb-2">
            Select Election:
          </label>
          <select
            id="election-select"
            value={selectedElectionId}
            onChange={(e) => setSelectedElectionId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">--Select an Election--</option>
            {elections.map((election) => (
              <option key={election.electionId} value={election.electionId}>
                {election.title}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleGetResults}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Loading...' : 'Get Results'}
        </button>
      </div>

      {error && (
        <div className="text-red-500 flex items-center space-x-2 mb-4">
          <XCircleIcon className="h-6 w-6" />
          <span>{error}</span>
        </div>
      )}

      {election && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold">{election.title}</h3>
          <p className="text-gray-700">Start Date: {election.startDate}</p>
          <p className="text-gray-700">End Date: {election.endDate}</p>
          <p className="text-gray-700">Total Votes: {election.totalVotes}</p>
        </div>
      )}

      {candidates.length > 0 && <ResultsPage results={candidates} />}
    </div>
  );
};

export default ResultPage;
