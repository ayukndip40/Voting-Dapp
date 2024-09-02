import axios from 'axios';

// Base URL for API
const API_URL = 'http://localhost:3000/api/elections';

// Helper function to get the access token
const getAccessToken = () => localStorage.getItem('accessToken');

// Log the access token (for debugging purposes)
const logAccessToken = () => {
  const accessToken = getAccessToken();
  console.log('Access Token:', accessToken);
  return accessToken;
};

// Create a new election
export const createElection = async (electionData) => {
  const accessToken = logAccessToken(); // Log access token

  try {
    const response = await axios.post(`${API_URL}/createElection`, electionData, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Use the access token for authorization
      },
    });
    console.log('Create election response:', response);
    return response.data;
  } catch (error) {
    console.error('Error creating election:', error.response ? error.response.data : error);
    throw new Error('Failed to create election');
  }
};


// Get all elections
export const getElections = async () => {
  const accessToken = logAccessToken(); // Log access token

  try {
    const response = await axios.get(`${API_URL}/getElections`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Use the access token for authorization
      },
    });
    console.log('Elections response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching elections:', error.response ? error.response.data : error);
    throw new Error('Failed to fetch elections');
  }
};

// Get election by ID
export const getElectionById = async (id) => {
  if (!id) {
    throw new Error('Election ID is required');
  }

  const accessToken = logAccessToken(); // Log and get access token

  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Use the access token for authorization
      },
    });
    console.log('Get election by ID response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching election by ID:', error.response ? error.response.data : error);
    throw new Error('Failed to fetch election');
  }
};

// Update election by ID
export const updateElection = async (id, updatedData) => {
  if (!id || !updatedData) {
    throw new Error('Election ID and updated data are required');
  }

  logAccessToken(); // Log access token

  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    console.log('Update election response:', response);
    return response.data;
  } catch (error) {
    console.error('Error updating election:', error.response ? error.response.data : error);
    throw new Error('Failed to update election');
  }
};

// Delete election by ID
export const deleteElection = async (id) => {
  if (!id) {
    throw new Error('Election ID is required');
  }

  logAccessToken(); // Log access token

  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log('Delete election response:', response);
    return response.data;
  } catch (error) {
    console.error('Error deleting election:', error.response ? error.response.data : error);
    throw new Error('Failed to delete election');
  }
};
