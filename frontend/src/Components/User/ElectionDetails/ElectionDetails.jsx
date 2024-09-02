/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { getElectionById } from '../../../api/electionApi';
import VoteForm from '../VoteForm/VoteForm';
import './ElectionDetails.css'; // Import specific styles for the Election Details

const ElectionDetails = ({ electionId }) => {
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        console.log('Fetching election with ID:', electionId); // Debugging: Log the election ID being fetched
        const result = await getElectionById(electionId);
        console.log('Fetched election data:', result); // Debugging: Log the fetched election data

        if (result && result.electionId) { // Adjust based on your response structure
          setElection(result);
        } else {
          setError('Election not found.');
          console.error('Error: Election not found in the response:', result);
        }
      } catch (err) {
        setError(`Failed to fetch election details: ${err.message}`);
        console.error('Fetch error:', err); // Debugging: Log fetch error
      } finally {
        setLoading(false);
      }
    };

    fetchElection();
  }, [electionId]);

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    };
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="election-details">
      <h1>{election.title}</h1>
      <p>{election.description}</p>
      <p>
        <strong>Start Date:</strong> {formatDateTime(election.startDate)}
      </p>
      <p>
        <strong>End Date:</strong> {formatDateTime(election.endDate)}
      </p>
      <VoteForm electionId={election.electionId} candidates={election.candidates} />
    </div>
  );
};

export default ElectionDetails;
