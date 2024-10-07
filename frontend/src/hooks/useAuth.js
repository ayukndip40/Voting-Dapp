/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { getCurrentUser, logoutUser, loginUser } from "../api/authApi";

const useAuth = () => {
  console.log("useAuth hook initialized");

  const [user, setUser] = useState(null);
  console.log("Initial user state:", user);

  const [loading, setLoading] = useState(true);
  console.log("Initial loading state:", loading);

  const [refreshLoading, setRefreshLoading] = useState(false);
  console.log("Initial refreshLoading state:", refreshLoading);

  const navigate = useNavigate();
  console.log("useNavigate hook initialized");

  // Refetch user data
  const refetchUser = async () => {
    console.log("Refetching user data...");
    setRefreshLoading(true);
    console.log("refreshLoading set to true");

    try {
      const currentUser = await getCurrentUser();
      console.log("Current user fetched:", currentUser);
      const role = localStorage.getItem("role"); // Fetch role from localStorage
      if (role) {
        setUser({ ...currentUser, role });
        console.log("User state updated with role:", { ...currentUser, role });
      } else {
        setUser(currentUser);
        console.log("User state updated without role:", currentUser);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      if (error.message === "Invalid or expired token") {
        console.log("Token invalid/expired, navigating to /login");
        navigate("/login");
      } else {
        setUser(null);
        console.log("User set to null due to error");
      }
    } finally {
      setRefreshLoading(false);
      console.log("refreshLoading set to false");
    }
  };

  // Fetch user when the hook is mounted
  useEffect(() => {
    console.log("useEffect called - component mounted");
    const fetchUserOnMount = async () => {
      if (!user) {
        console.log("User is null, refetching...");
        await refetchUser();
      } else {
        console.log("User already exists:", user);
      }
      setLoading(false);
      console.log("Loading state set to false");
    };

    fetchUserOnMount();
  }, []); // Run only once on mount

  // Handle login process
  const login = useCallback(
    async (credentials) => {
      try {
        const response = await loginUser(credentials);
        const { accessToken, refreshToken, role, user } = response;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", role);

        setUser({ ...user, role });

        // Navigate based on role right after setting user
        setTimeout(() => {
          if (role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/user/dashboard");
          }
        }, 0);

        await refetchUser();
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    [navigate, refetchUser]
  );

  // Handle logout process
  const logout = async () => {
    console.log("Logout function called");

    const confirmLogout = window.confirm("Do you really want to logout?");
    console.log("Logout confirmation:", confirmLogout);

    if (confirmLogout) {
      try {
        await logoutUser();
        console.log("Logged out successfully");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        console.log("Tokens and role removed from localStorage");
        setUser(null);
        console.log("User state set to null");
        navigate("/login");
        console.log("Navigating to /login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // Update the user object
  const updateUser = (newUser) => {
    console.log("Updating user with new data:", newUser);
    setUser(newUser);
    console.log("User state updated");
  };

  return {
    user,
    loading,
    refreshLoading,
    login,
    logout,
    updateUser,
  };
};

export default useAuth;
