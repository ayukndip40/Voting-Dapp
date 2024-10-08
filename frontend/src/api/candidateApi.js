import axios from "axios";

const API_URL = "http://localhost:3000/api/candidates";

const getAccessToken = () => localStorage.getItem("accessToken"); // Helper function to get the access token

const logAccessToken = () => {
  const accessToken = getAccessToken();
  console.log("Access Token:", accessToken);
  return accessToken;
};

export const getCandidates = async () => {
  const accessToken = getAccessToken();
  console.log("Access Token:", accessToken); // Log the token value

  try {
    const response = await axios.get(`${API_URL}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("Candidates response:", response); // Log the response for debugging
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching candidates:",
      error.response ? error.response.data : error
    );

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 404) {
        return { candidates: [], message: "No candidates found" };
      } else {
        throw new Error(
          `Server error: ${error.response.data.message || "Unknown error"}`
        );
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("Network error: Unable to reach the server");
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
};

export const addCandidate = async (electionId, candidateName) => {
  const accessToken = logAccessToken(); // Log access token

  try {
    const response = await axios.post(
      `${API_URL}/${electionId}`,
      {
        electionId,
        name: candidateName,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use the access token for authorization
        },
      }
    );
    console.log("Add candidate response:", response);
    return response.data;
  } catch (error) {
    // Check if the error has a response and return the error message
    if (error.response && error.response.data) {
      console.error("Error adding candidate:", error.response.data.error);
      throw new Error(`Error adding candidate: ${error.response.data.error}`); // Custom error message from backend
    } else {
      console.error("Error adding candidate:", error);
      throw new Error("Failed to add candidate"); // Default error message
    }
  }
};

export const updateCandidate = async (candidateId, candidateData) => {
  if (!candidateId || !candidateData) {
    throw new Error("Candidate ID and candidate data are required");
  }

  const accessToken = getAccessToken();
  console.log("Access Token:", accessToken);

  try {
    const response = await axios.put(
      `${API_URL}/${candidateId}`,
      candidateData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Update candidate response:", response);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating candidate:",
      error.response ? error.response.data : error
    );
    throw new Error("Failed to update candidate");
  }
};

export const deleteCandidate = async (candidateId) => {
  if (!candidateId) {
    throw new Error("Candidate ID is required");
  }

  const accessToken = getAccessToken();
  console.log("Access Token:", accessToken);

  try {
    const response = await axios.delete(`${API_URL}/${candidateId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("Delete candidate response:", response);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting candidate:",
      error.response ? error.response.data : error
    );
    throw new Error("Failed to delete candidate");
  }
};
