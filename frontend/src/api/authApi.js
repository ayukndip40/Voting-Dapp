// src/api/authApi.js
import axios from 'axios';

// Base URL for API
const API_URL = "http://localhost:3000/api/auth";

// Register a new user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Registration failed');
  }
};

// Login a user
export const loginUser = async (credentials) => {
  try {
    console.log('Sending login request with credentials:', credentials);

    // Sending the API request to the login endpoint
    const response = await axios.post(`${API_URL}/login`, credentials);
    console.log('Login API response received:', response);

    // Ensure response.data is defined and has the expected properties
    if (!response.data || typeof response.data !== 'object') {
      console.error('Unexpected response format:', response.data);
      throw new Error('Unexpected response format');
    }

    const { accessToken, refreshToken, role } = response.data;
    console.log('Access Token received:', accessToken);
    console.log('Refresh Token received:', refreshToken);
    console.log('Role received:', role);

    // Check if 'role' is present
    if (role === undefined) {
      console.error('Role is not included in the response:', response.data);
      throw new Error('Role is not included in the response');
    }

    // Store the tokens in local storage
    console.log('Storing access token in localStorage');
    localStorage.setItem('accessToken', accessToken);

    console.log('Storing refresh token in localStorage');
    localStorage.setItem('refreshToken', refreshToken);

    console.log('Access Token stored in local storage:', localStorage.getItem('accessToken'));
    console.log('Refresh Token stored in local storage:', localStorage.getItem('refreshToken'));

    // Return the tokens and role
    console.log('Returning tokens and role:', { accessToken, refreshToken, role });
    return { accessToken, refreshToken, role };

  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};


// Logout a user
export const logoutUser = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    console.warn('No tokens found, user might already be logged out.');
    return { msg: 'No tokens found' };
  }

  try {
    const headers = { Authorization: `Bearer ${accessToken}` };
    const response = await axios.post(`${API_URL}/logout`, null, { headers });

    // Clear both access and refresh tokens from localStorage after successful logout
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    return { error: 'Failed to log out. Please try again.' };
  }
};

export const getCurrentUser = async () => {
  const accessToken = localStorage.getItem('accessToken'); // Updated to retrieve accessToken
  console.log('Access Token:', accessToken); // Log the token value
  try {
    const response = await axios.get(`${API_URL}/current`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Use accessToken for authorization
      },
    });
    console.log('Current user response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error.response ? error.response.data : error);
    return null;
  }
};