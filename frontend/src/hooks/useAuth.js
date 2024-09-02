/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCurrentUser, logoutUser, login as apiLogin } from '../api/authApi';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const navigate = useNavigate();

  // Function to refetch user data
  const refetch = async () => {
    setRefreshLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      if (error.message === 'Invalid or expired token') {
        navigate('/login');
      } else {
        setUser(null);
      }
    } finally {
      setRefreshLoading(false);
    }
  };

  useEffect(() => {
    // Fetch user on mount
    const fetchUser = async () => {
      if (user === null) {
        await refetch();
      }
      setLoading(false);
    };

    fetchUser();
  }, [user]);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      const { token } = response;
      console.log('Token received:', token); // Log token
      localStorage.setItem('token', token);
      await refetch(); // Refetch user data
    } catch (error) {
      console.error('Failed to login:', error);
      throw error; // Re-throw the error to prevent redirect
    }
  };

  // Logout function
  const logout = async () => {
    const confirmLogout = window.confirm('Do you really want to logout?');
    if (confirmLogout) {
      try {
        await logoutUser();
        localStorage.removeItem('token');
        setUser(null); // Clear user state
        navigate('/login'); // Redirect to login
      } catch (error) {
        console.error('Failed to logout:', error);
      }
    } // No need for an else clause here
  };

  // Update user data
  const updateUser = async (newUser) => {
    setUser(newUser);
  };

  return {
    user,
    loading,
    refreshLoading,
    logout,
    login,
    updateUser,
  };
};

export default useAuth;
