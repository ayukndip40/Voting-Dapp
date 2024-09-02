/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// components/election/ElectionLists/ElectionLists.jsx
import React, { useEffect, useState } from 'react';
import { getElections } from '../../../api/electionApi';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ElectionLists.css';

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
        console.log('Fetching elections...'); // Debugging
        const data = await getElections();
        console.log('Fetched data:', data); // Debugging
        if (Array.isArray(data)) {
          setElections(data);
          setFilteredElections(data);
        } else {
          setError('Unexpected data format. Please contact support.');
          console.error('Error: Unexpected data format', data); // Debugging
        }
      } catch (err) {
        setError(`Failed to fetch elections: ${err.message}`);
        console.error('Fetch error:', err); // Debugging
      } finally {
        setLoading(false);
        console.log('Loading complete'); // Debugging
      }
    };

    fetchElections();
  }, []);

  useEffect(() => {
    console.log('Search term changed:', searchTerm); // Debugging
    const results = elections.filter(election =>
      election.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
    console.log('Filtered results:', results); // Debugging
    setFilteredElections(results);
    setCurrentPage(1);
  }, [searchTerm, elections]);

  const handleSearchChange = (e) => {
    console.log('Search input changed:', e.target.value); // Debugging
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    console.log('Page changed to:', page); // Debugging
    setCurrentPage(page);
  };

  const handleElectionClick = (electionId) => {
    console.log('Election selected:', electionId); // Debugging
    navigate(`/elections/${electionId}`); // Navigate to election details page
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedElections = filteredElections.slice(startIndex, endIndex);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="election-list-container">
      <h2>Select an Election</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <ul className="election-list">
        {paginatedElections.length === 0 ? (
          <div className="no-elections">No elections available at the moment.</div>
        ) : (
          paginatedElections.map(election => (
            <li key={election.electionId} className="election-item">
              <button onClick={() => handleElectionClick(election.electionId)}>
                {election.title}
              </button>
            </li>
          ))
        )}
      </ul>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredElections.length / PAGE_SIZE) }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ElectionList;
