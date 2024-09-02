/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import CreateElectionForm from '../../election/ElectionForm/ElectionForm';
import UpdateElectionForm from '../../election/UpdateElectionForm/UpdateElectionForm';
import './ManageElections.css'; // Import relevant CSS
import { getElections as fetchElections, createElection, updateElection } from '../../../api/electionApi'; // Adjust import path
import ElectionCard from '../../election/ElectionCard/ElectionCard';

const ManageElections = () => {
  const [elections, setElections] = useState([]); // Ensure it's always an array
  const [selectedElection, setSelectedElection] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const loadElections = async () => {
      try {
        setLoading(true);
        const data = await fetchElections(); // Fetch elections from API
        setElections(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadElections();
  }, []);

  const handleCreateElection = async (data) => {
    try {
      const newElection = await createElection(data);
      setElections((prevElections) => [...prevElections, newElection]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateElection = async (data) => {
    try {
      const updatedElection = await updateElection(data);
      setElections((prevElections) =>
        prevElections.map((election) =>
          election.id === updatedElection.id ? updatedElection : election
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSelectedElection(null);
    }
  };

  return (
    <div className="manage-elections">
      <h1>Manage Elections</h1>
      <button onClick={() => setIsCreating(true)}>Create Election</button>

      {isCreating && (
        <CreateElectionForm onCreateElection={handleCreateElection} />
      )}

      {selectedElection && (
        <UpdateElectionForm
          election={selectedElection}
          onUpdateElection={handleUpdateElection}
        />
      )}

      {loading && <p>Loading elections...</p>}
      {error && <p className="error">{error}</p>}
      {Array.isArray(elections) && elections.length > 0 ? (
        <div className="election-list">
          {elections.map((election) => (
            <ElectionCard
              key={election.id}
              election={election}
              onEdit={(e) => setSelectedElection(e)}
            />
          ))}
        </div>
      ) : (
        !loading && !error && <p>No elections found.</p>
      )}
    </div>
  );
};

export default ManageElections;
