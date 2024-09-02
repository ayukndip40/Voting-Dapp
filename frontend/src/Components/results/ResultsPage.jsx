/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { getElectionResults } from '../../api/voteApi'; // Import from your voteApi file
import { getElections } from '../../api/electionApi'; // Import from your electionApi file
import './ResultsPage.css';

// ResultsPage component
const ResultsPage = ({ results }) => {
  const maxVoteCount = Math.max(...results.map(result => result.voteCount), 1); // Default to 1 to avoid division by zero

  return (
    <div className="results-chart">
      <div className="bar-container">
        {results.map((result, index) => {
          const color = `hsl(${(index * 360) / results.length}, 70%, 50%)`; // Different colors
          const barWidth = `${(result.voteCount / maxVoteCount) * 100}%`; // Adjust width based on max votes

          return (
            <div
              key={result.candidateId}
              className="bar"
              style={{ backgroundColor: color, width: barWidth }}
            >
              <span>{result.name}</span>
              <span>{result.voteCount}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Page Component
const ResultPage = () => {
  const [elections, setElections] = useState([]); // List of elections for selection
  const [selectedElectionId, setSelectedElectionId] = useState(''); // Currently selected election
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]); // Ensure it's always an array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch elections list when component mounts
  useEffect(() => {
    const fetchElections = async () => {
      try {
        console.log('Fetching elections...'); // Log before fetching elections
        const response = await getElections(); // Fetch the list of elections
        console.log('Elections response:', response); // Debug: Check the entire response object
        setElections(response || []); // Directly set response if it is the array
      } catch (err) {
        console.error('Error fetching elections:', err);
        setError('Failed to fetch elections.');
      }
    };

    fetchElections();
  }, []);

  // Fetch results when selectedElectionId changes
  const handleGetResults = async () => {
    if (!selectedElectionId) {
      setError('Please select an election.');
      return;
    }

    console.log('Selected election ID:', selectedElectionId); // Log selected election ID
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching election results...'); // Log before fetching results
      const result = await getElectionResults(selectedElectionId);
      console.log('Election results:', result); // Debug: Check the results object

      // Update this based on the actual structure of result
      const electionData = result.election || {};
      const candidatesData = result.results || [];

      // Log the values to check their types and values
      console.log('Election startDate:', electionData.startDate);
      console.log('Election endDate:', electionData.endDate);
      console.log('Total Votes:', electionData.totalVotes);

      // Ensure dates are numbers and convert to Date objects
      const startDate = Number(electionData.startDate) || 0;
      const endDate = Number(electionData.endDate) || 0;

      const formattedStartDate = isNaN(startDate) ? 'Invalid Date' : new Date(startDate * 1000).toLocaleDateString();
      const formattedEndDate = isNaN(endDate) ? 'Invalid Date' : new Date(endDate * 1000).toLocaleDateString();

      console.log('Formatted Start Date:', formattedStartDate);
      console.log('Formatted End Date:', formattedEndDate);

      // Handle election and candidates
      setElection({
        ...electionData,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });
      setCandidates(candidatesData); // Ensure candidates is always an array
    } catch (error) {
      console.error('Error fetching election results:', error);
      if (error.message.includes('Election is still active')) {
        alert('Election results are not available yet. Please check back later.');
      } else {
        alert('Failed to fetch election results.');
      }
      setError(error.message || 'Failed to fetch election results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="results-page">
      <div className="election-selector">
        <label htmlFor="election-select">Select Election:</label>
        <select
          id="election-select"
          value={selectedElectionId}
          onChange={(e) => setSelectedElectionId(e.target.value)}
        >
          <option value="">--Select an Election--</option>
          {elections.map((election) => (
            <option key={election.id} value={election.id}>
              {election.title}
            </option>
          ))}
        </select>
        <button onClick={handleGetResults} disabled={loading}>
          {loading ? 'Loading...' : 'Get Results'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {election && (
        <div className="election-details">
          <h2>{election.title}</h2>
          <p>Start Date: {election.startDate}</p>
          <p>End Date: {election.endDate}</p>
          <p>Total Votes: {election.totalVotes}</p>
        </div>
      )}

      {candidates.length > 0 && <ResultsPage results={candidates} />}
    </div>
  );
};

export default ResultPage;
