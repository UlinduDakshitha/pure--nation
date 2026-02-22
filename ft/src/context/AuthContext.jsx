import React, { createContext, useState, useEffect, useContext } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authAPI.getStatus();
        console.log("🔍 Auth status response:", response.data);
        console.log("🔍 User from status:", response.data?.user);

        if (
          response.data &&
          response.data.success &&
          response.data.loggedIn &&
          response.data.user
        ) {
          setUser(response.data.user);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Auth status check failed:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const response = await authAPI.login(email, password);
      console.log("🔐 Login response:", response.data);
      console.log("🔐 User from login:", response.data?.user);
      console.log(
        "🔐 User ID from login:",
        response.data?.user?.id,
        response.data?.user?._id,
      );

      if (response.data && response.data.success && response.data.user) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        return response.data;
      } else {
        throw new Error(response.data?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (userData) => {
    setAuthLoading(true);
    try {
      const response = await authAPI.register(userData);
      console.log("📝 Register response:", response.data);
      console.log("📝 User from register:", response.data?.user);

      if (response.data && response.data.success && response.data.user) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        return response.data;
      } else {
        throw new Error(response.data?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout error:", error);
      // Clear user anyway
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const value = {
    user,
    loading,
    authLoading,
    isLoggedIn,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
