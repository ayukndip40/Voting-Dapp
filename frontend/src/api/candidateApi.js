import axios from 'axios';

const API_URL = 'http://localhost:3000/api/candidates';

const getAccessToken = () => localStorage.getItem('accessToken'); // Helper function to get the access token

const logAccessToken = () => {
  const accessToken = getAccessToken();
  console.log('Access Token:', accessToken);
  return accessToken;
};

export const getCandidates = async () => {
    const accessToken = getAccessToken();
    console.log('Access Token:', accessToken); // Log the token value
  
    try {
      const response = await axios.get(`${API_URL}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Candidates response:', response); // Log the response for debugging
      return response.data;
    } catch (error) {
      console.error('Error fetching candidates:', error.response ? error.response.data : error);
      throw new Error('Failed to fetch candidates');
    }
  };

  export const addCandidate = async (electionId, candidateName) => {
    const accessToken = logAccessToken(); // Log access token
  
    try {
      const response = await axios.post(`${API_URL}/${electionId}`, {
        electionId,
        name: candidateName
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use the access token for authorization
        },
      });
      console.log('Add candidate response:', response);
      return response.data;
    } catch (error) {
      console.error('Error adding candidate:', error.response ? error.response.data : error);
      throw new Error('Failed to add candidate');
    }
  };

export const updateCandidate = async (candidateId, candidateData) => {
  if (!candidateId || !candidateData) {
    throw new Error('Candidate ID and candidate data are required');
  }

  const accessToken = getAccessToken();
  console.log('Access Token:', accessToken);

  try {
    const response = await axios.put(`${API_URL}/${candidateId}`, candidateData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('Update candidate response:', response);
    return response.data;
  } catch (error) {
    console.error('Error updating candidate:', error.response ? error.response.data : error);
    throw new Error('Failed to update candidate');
  }
};

export const deleteCandidate = async (candidateId) => {
  if (!candidateId) {
    throw new Error('Candidate ID is required');
  }

  const accessToken = getAccessToken();
  console.log('Access Token:', accessToken);

  try {
    const response = await axios.delete(`${API_URL}/${candidateId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('Delete candidate response:', response);
    return response.data;
  } catch (error) {
    console.error('Error deleting candidate:', error.response ? error.response.data : error);
    throw new Error('Failed to delete candidate');
  }
};
