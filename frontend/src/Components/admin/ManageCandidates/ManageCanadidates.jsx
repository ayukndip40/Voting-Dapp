/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { getCandidates, addCandidate } from '../../../api/candidateApi';
import { getElections } from '../../../api/electionApi';
import { TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline'; // Import icons from Heroicons
import './ManageCandidates.css';

const ManageCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const result = await getElections();
        setElections(result);
      } catch (error) {
        setError('Failed to fetch elections');
        console.error(error);
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
          console.error(error);
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
      await addCandidate(selectedElectionId, newCandidateName);
      setNewCandidateName('');
      setSuccessMessage('Candidate added successfully!'); // Set success message
      // Refresh candidates list
      const result = await getCandidates(selectedElectionId);
      setCandidates(result);
    } catch (error) {
      setError('Failed to add candidate');
      console.error(error);
    }
  };

  const handleElectionChange = (event) => {
    setSelectedElectionId(event.target.value);
  };

  const handleDeleteCandidate = async (candidateId) => {
    try {
      // Implement delete functionality if needed
      // await deleteCandidate(candidateId);
      setCandidates((prev) => prev.filter((candidate) => candidate.id !== candidateId));
    } catch (error) {
      setError('Failed to delete candidate');
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">Manage Candidates</h1>

      <div className="mb-6">
        <label htmlFor="election" className="block text-lg font-medium text-gray-700 mb-2">Select Election</label>
        <select
          id="election"
          value={selectedElectionId}
          onChange={handleElectionChange}
          className="w-full bg-white border border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select an Election</option>
          {elections.map((election) => (
            <option key={election.electionId} value={election.electionId}>
              {election.title}
            </option>
          ))}
        </select>
      </div>

      {selectedElectionId && (
        <div className="mb-6 flex flex-col md:flex-row items-center">
          <input
            type="text"
            value={newCandidateName}
            onChange={(e) => setNewCandidateName(e.target.value)}
            placeholder="Enter candidate name"
            className="w-full md:w-1/2 bg-white border border-gray-300 rounded-lg py-2 px-4 text-gray-700 mb-4 md:mb-0 md:mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddCandidate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition duration-300"
          >
            <UserPlusIcon className="w-5 h-5 mr-2" />
            Add Candidate
          </button>
        </div>
      )}

      {successMessage && (
        <p className="text-green-600 mb-4">{successMessage}</p>
      )}

      {loading && <p className="text-gray-700">Loading candidates...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {candidates.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-200 border-b border-gray-300">
              <tr>
                <th className="py-2 px-4 text-left text-gray-600">Election Title</th>
                <th className="py-2 px-4 text-left text-gray-600">Candidate Name</th>
                <th className="py-2 px-4 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="border-b border-gray-300">
                  <td className="py-2 px-4 text-gray-700">{candidate.electionTitle}</td>
                  <td className="py-2 px-4 text-gray-700">{candidate.name}</td>
                  <td className="py-2 px-4 text-gray-700">
                    <button
                      onClick={() => handleDeleteCandidate(candidate.id)}
                      className="text-red-600 hover:text-red-700 transition duration-300 flex items-center"
                    >
                      <TrashIcon className="w-5 h-5 mr-2" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && !error && <p className="text-gray-700">No candidates found.</p>
      )}
    </div>
  );
};

export default ManageCandidates;
