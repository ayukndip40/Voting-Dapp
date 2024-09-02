/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { getCandidates, addCandidate } from '../../../api/candidateApi';
import { getElections } from '../../../api/electionApi'; // Import the function to get elections
import './ManageCandidates.css';

const ManageCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const result = await getElections();
        setElections(result);
      } catch (error) {
        setError('Failed to fetch elections');
        console.log(error);
      }
    };

    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElectionId) {
      const fetchCandidates = async () => {
        try {
          const result = await getCandidates(selectedElectionId);
          setCandidates(result);
        } catch (error) {
          setError('Failed to fetch candidates');
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      fetchCandidates();
    }
  }, [selectedElectionId]);

  const handleAddCandidate = async () => {
    if (!newCandidateName.trim() || !selectedElectionId) return;

    try {
      await addCandidate(selectedElectionId, newCandidateName); // Use electionId for adding candidate
      setNewCandidateName('');
      // Refresh candidates list
      const result = await getCandidates(selectedElectionId);
      setCandidates(result);
    } catch (error) {
      setError('Failed to add candidate');
    }
  };

  const handleElectionChange = (event) => {
    setSelectedElectionId(event.target.value); // Ensure this is a numeric ID
  };

  const handleDeleteCandidate = async (candidateId) => {
    try {
      // Implement delete functionality if needed
      // await deleteCandidate(candidateId);
      setCandidates((prev) => prev.filter((candidate) => candidate._id !== candidateId));
    } catch (error) {
      setError('Failed to delete candidate');
    }
  };

  return (
    <div className="manage-candidates">
      <h1>Manage Candidates</h1>

      <div className="select-election">
        <select value={selectedElectionId} onChange={handleElectionChange}>
          <option value="">Select an Election</option>
          {elections.map((election) => (
            <option key={election.electionId} value={election.electionId}>
              {election.title}
            </option>
          ))}
        </select>
      </div>

      {selectedElectionId && (
        <div className="add-candidate-form">
          <input
            type="text"
            value={newCandidateName}
            onChange={(e) => setNewCandidateName(e.target.value)}
            placeholder="Enter candidate name"
          />
          <button onClick={handleAddCandidate}>Add Candidate</button>
        </div>
      )}

      {loading && <p className="loading">Loading candidates...</p>}
      {error && <p className="error">{error}</p>}

      {candidates.length > 0 ? (
        <div className="candidate-list">
          <table>
            <thead>
              <tr>
                <th>Election ID</th>
                <th>Election Title</th>
                <th>Candidate Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.electionId}</td>
                  <td>{candidate.electionTitle}</td>
                  <td>{candidate.name}</td>
                  <td>
                    <button onClick={() => handleDeleteCandidate(candidate.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && !error && <p>No candidates found.</p>
      )}
    </div>
  );
};

export default ManageCandidates;
