/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { castVote } from '../../../api/voteApi';
import './VoteForm.css'; // Import specific styles for the Vote Form

const VoteForm = ({ electionId, candidates }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVote = async (candidateId) => {
    console.log('handleVote called with candidateId:', candidateId); // Debug log

    if (!candidateId) {
      console.error('Error: No candidateId provided'); // Debug log
      setError('Invalid candidate selected.');
      return;
    }

    console.log('Proceeding with vote for candidateId:', candidateId); // Debug log
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await castVote({ electionId, candidateId });
      console.log('Vote result:', result); // Debug log
      setSuccess('Vote cast successfully!');
    } catch (error) {
      console.error('Error casting vote:', error); // Debug log
      setError('Failed to cast vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vote-form-container">
      <h2>Cast Your Vote</h2>
      <div className="candidates-container">
        {candidates.map((candidate) => {
          console.log('Rendering candidate:', candidate); // Debug log
          return (
            <div key={candidate._id} className="candidate-card">
              <h3>{candidate.name}</h3>
              <button
  onClick={() => {
    console.log('Button clicked for candidateId:', candidate.candidateId); // Debug log
    handleVote(candidate.candidateId);
  }}
  className="vote-button"
  disabled={loading}
>
  {loading ? 'Voting...' : 'Vote'}
</button>
            </div>
          );
        })}
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};


export default VoteForm;
