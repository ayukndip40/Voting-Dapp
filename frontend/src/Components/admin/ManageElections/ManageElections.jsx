/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import CreateElectionForm from '../../election/ElectionForm/ElectionForm';
import UpdateElectionForm from '../../election/UpdateElectionForm/UpdateElectionForm';
import { getElections as fetchElections, createElection, updateElection } from '../../../api/electionApi'; 
import ElectionCard from '../../election/ElectionCard/ElectionCard';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const ManageElections = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadElections = async () => {
      try {
        setLoading(true);
        const data = await fetchElections();
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Manage Elections</h1>
      <button
        onClick={() => setIsCreating(true)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700"
      >
        <PlusIcon className="w-5 h-5" />
        <span>Create Election</span>
      </button>

      {isCreating && (
        <div className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <CreateElectionForm onCreateElection={handleCreateElection} />
        </div>
      )}

      {selectedElection && (
        <div className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <UpdateElectionForm
            election={selectedElection}
            onUpdateElection={handleUpdateElection}
          />
        </div>
      )}

      {loading && <p className="text-gray-600">Loading elections...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {Array.isArray(elections) && elections.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {elections.map((election) => (
            <ElectionCard
              key={election.id}
              election={election}
              onEdit={() => setSelectedElection(election)}
              onDelete={() => handleDeleteElection(election.id)}
            />
          ))}
        </div>
      ) : (
        !loading && !error && <p className="text-gray-600">No elections found.</p>
      )}
    </div>
  );
};

export default ManageElections;
