// src/api/voteApi.js
import axios from 'axios';

// Base URL for API
const API_URL = 'http://localhost:3000/api/votes';

const getAccessToken = () => localStorage.getItem('accessToken');

// Log the access token (for debugging purposes)
const logAccessToken = () => {
  const accessToken = getAccessToken();
  console.log('Access Token:', accessToken);
  return accessToken;
};

// Cast a vote
export const castVote = async (voteData) => {
  const accessToken = logAccessToken(); // Log access token

  try {
    const response = await axios.post(`${API_URL}/cast`, voteData, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Use the access token for authorization
      },
    });
    console.log('Cast vote response:', response);
    return response.data;
  } catch (error) {
    console.error('Error casting vote:', error.response ? error.response.data : error);
    throw new Error(error.response?.data?.message || 'Failed to cast vote');
  }
};

// Tally votes for a specific vote
export const getElectionResults = async (electionId) => {
  const accessToken = logAccessToken();

  try {
    const response = await axios.get(`${API_URL}/elections/${electionId}/tally`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('Election results response:', response); // Log full response

    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      throw new Error('Server returned HTML instead of JSON.');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching election results:', error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch election results');
  }
};

