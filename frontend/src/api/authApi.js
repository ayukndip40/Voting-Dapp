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
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);

    // Ensure response.data is defined and has the expected properties
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Unexpected response format');
    }

    const { accessToken, refreshToken, role } = response.data;

    // Check if 'role' is present
    if (role === undefined) {
      throw new Error('Role is not included in the response');
    }

    // Store the tokens in local storage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    console.log('Access Token stored in local storage:', localStorage.getItem('accessToken'));
    console.log('Refresh Token stored in local storage:', localStorage.getItem('refreshToken'));

    return { accessToken, refreshToken, role };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Logout a user
export const logoutUser = async () => {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.post(`${API_URL}/logout`, null, { headers });
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
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