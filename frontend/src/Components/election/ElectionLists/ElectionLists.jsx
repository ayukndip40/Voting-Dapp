/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// components/election/ElectionLists/ElectionLists.jsx
import React, { useEffect, useState } from 'react';
import { getElections } from '../../../api/electionApi';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const PAGE_SIZE = 10;

const ElectionList = ({ onSelectElection }) => {
  const [elections, setElections] = useState([]);
  const [filteredElections, setFilteredElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const data = await getElections();
        if (Array.isArray(data)) {
          setElections(data);
          setFilteredElections(data);
        } else {
          setError('Unexpected data format. Please contact support.');
        }
      } catch (err) {
        setError(`Failed to fetch elections: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  useEffect(() => {
    const results = elections.filter(election =>
      election.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
    setFilteredElections(results);
    setCurrentPage(1);
  }, [searchTerm, elections]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleElectionClick = (electionId) => {
    navigate(`/elections/${electionId}`); // Navigate to election details page
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedElections = filteredElections.slice(startIndex, endIndex);

  if (loading) return <div className="text-center py-4 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-600">{error}</div>;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg w-full max-w-lg p-6 h-auto min-h-[500px]">
        <h2 className="text-2xl font-bold mb-4 text-center">Select an Election</h2>
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <ul className="space-y-4">
          {paginatedElections.length === 0 ? (
            <div className="text-center text-gray-500">No elections available at the moment.</div>
          ) : (
            paginatedElections.map(election => (
              <li key={election.electionId} className="bg-gray-50 border rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => handleElectionClick(election.electionId)}
                  className="w-full p-4 text-left text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {election.title}
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({ length: Math.ceil(filteredElections.length / PAGE_SIZE) }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-lg border ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'} hover:bg-blue-100 transition duration-300`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElectionList;
