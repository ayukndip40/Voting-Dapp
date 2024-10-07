// src/api/voteApi.js
import axios from "axios";

// Base URL for API
const API_URL = "http://localhost:3000/api/votes";

const getAccessToken = () => localStorage.getItem("accessToken");

// Log the access token (for debugging purposes)
const logAccessToken = () => {
  const accessToken = getAccessToken();
  console.log("Access Token:", accessToken);
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

    console.log("Cast vote response:", response);
    return response.data;
  } catch (error) {
    // Log the full error object for debugging purposes
    console.error(
      "Error casting vote:",
      error.response ? error.response.data : error
    );

    // Extract the server's error message
    const serverErrorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Failed to cast vote. Please try again.";

    // Throw a new Error with the server's message
    throw new Error(serverErrorMessage);
  }
};

export const getVotingHistory = async () => {
  const accessToken = logAccessToken(); // Log access token

  try {
    const response = await axios.get(`${API_URL}/getVotingHistory`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Use the access token for authorization
      },
    });

    console.log("Get voting history response:", response);

    // Check if the voting history data is empty
    if (!response.data || response.data.length === 0) {
      console.warn("No voting history found.");
      return { message: "No voting history found." };
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching voting history:",
      error.response ? error.response.data : error
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch voting history"
    );
  }
};

// Tally votes for a specific vote
export const getElectionResults = async (electionId) => {
  const accessToken = logAccessToken();

  try {
    const response = await axios.get(
      `${API_URL}/elections/${electionId}/tally`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Election results response:", response); // Log full response

    if (
      typeof response.data === "string" &&
      response.data.includes("<!doctype html>")
    ) {
      throw new Error("Server returned HTML instead of JSON.");
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching election results:",
      error.response ? error.response.data : error.message
    );

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (
        error.response.status === 400 &&
        error.response.data.msg ===
          "Election is still active or voting has not ended yet"
      ) {
        return {
          results: null,
          message: "Election is still active or voting has not ended yet",
        };
      } else if (error.response.status === 404) {
        return { results: null, message: "Election not found" };
      } else {
        throw new Error(
          `Server error: ${
            error.response.data.msg ||
            error.response.data.message ||
            "Unknown error"
          }`
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
