/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component that wraps around your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to check if the user is authenticated
  const checkAuth = () => {
    console.log('Checking authentication...');
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    console.log('Stored user:', storedUser);
    console.log('Access token:', accessToken);
    
    if (storedUser && accessToken) {
      console.log('User is authenticated');
      setUser(JSON.parse(storedUser));  // Assuming user details are stored in localStorage
      setIsAuthenticated(true);
    } else {
      console.log('User is not authenticated');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Check authentication status when component mounts
  useEffect(() => {
    console.log('Component mounted, checking authentication...');
    checkAuth();
  }, []);

  // Function to handle login
  const login = (userData, tokens) => {
    console.log('Logging in...');
    console.log('User data:', userData);
    console.log('Tokens:', tokens);

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', tokens.accessToken);

    console.log('Login successful');
  };

  // Function to handle logout
  const logout = () => {
    console.log('Logging out...');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');

    console.log('Logout successful');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
