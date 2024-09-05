/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCurrentUser, logoutUser, loginUser } from '../api/authApi';

const useAuth = () => {
  console.log('useAuth hook initialized');

  const [user, setUser] = useState(null);
  console.log('Initial user state:', user);

  const [loading, setLoading] = useState(true);
  console.log('Initial loading state:', loading);

  const [refreshLoading, setRefreshLoading] = useState(false);
  console.log('Initial refreshLoading state:', refreshLoading);

  const navigate = useNavigate();
  console.log('useNavigate hook called');

  // Refetch user data
  const refetchUser = async () => {
    console.log('Refetching user data...');
    setRefreshLoading(true);
    console.log('refreshLoading set to true');

    try {
      const currentUser = await getCurrentUser();
      console.log('Current user fetched:', currentUser);
      setUser(currentUser);
      console.log('User state updated:', currentUser);
    } catch (error) {
      console.error('Error fetching current user:', error);
      if (error.message === 'Invalid or expired token') {
        console.log('Token invalid/expired, navigating to /login');
        navigate('/login');
      } else {
        setUser(null);
        console.log('User set to null due to error');
      }
    } finally {
      setRefreshLoading(false);
      console.log('refreshLoading set to false');
    }
  };

  // Fetch user when the hook is mounted
  useEffect(() => {
    console.log('useEffect called');
    const fetchUserOnMount = async () => {
      if (!user) {
        console.log('User is null, refetching...');
        await refetchUser();
      } else {
        console.log('User already exists:', user);
      }
      setLoading(false);
      console.log('Loading set to false');
    };

    fetchUserOnMount();
  }, [user]);

  // Handle login process
  const login = async (credentials) => {
    console.log('Login function called with credentials:', credentials);

    try {
      const response = await loginUser(credentials);
      console.log('Login response received:', response);

      const { accessToken, refreshToken, role, user } = response;

      console.log('Tokens received:', { accessToken, refreshToken, role });
      console.log('Storing tokens in localStorage');
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      console.log('Updating user state');
      setUser(user);

      console.log('Refetching user after login');
      await refetchUser();

      if (role === 'admin') {
        console.log('Navigating to admin dashboard');
        navigate('/admin/dashboard');
      } else {
        console.log('Navigating to user dashboard');
        navigate('/user/dashboard');
      }

      console.log('Login process completed');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Handle logout process
  const logout = async () => {
    console.log('Logout function called');

    const confirmLogout = window.confirm('Do you really want to logout?');
    console.log('Logout confirmation:', confirmLogout);

    if (confirmLogout) {
      try {
        await logoutUser();
        console.log('Logged out successfully');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        console.log('Tokens removed from localStorage');
        setUser(null);
        console.log('User state set to null');
        navigate('/login');
        console.log('Navigating to /login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  // Update the user object
  const updateUser = (user) => {
    console.log('Updating user with new data:', user);
    setUser(user);
    console.log('User state updated');
  };

  return {
    loading,
    refreshLoading,
    login,
    logout,
    updateUser,
  };
};

export default useAuth;
