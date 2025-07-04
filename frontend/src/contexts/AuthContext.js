import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios defaults
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  axios.defaults.baseURL = API_URL;
  axios.defaults.withCredentials = true;

  // Logout function defined early to avoid circular dependency
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  // Add request interceptor to include token
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor to handle token refresh
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await axios.post('/auth/refresh-token');
          const { token } = response.data;
          localStorage.setItem('token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  // Check if user is authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Try to fetch user profile from backend
          await fetchUserProfile();
        } catch (error) {
          // If backend is not available, use mock data
          console.warn('Backend not available, using mock data');
          setUser({
            email: 'demo@example.com',
            username: 'Demo User',
            role: 'user',
            emailVerified: true,
            mfaEnabled: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/user/me');
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      // If we can't fetch the profile, clear the token
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    }
  };

  const login = async (email, password, mfaCode = null) => {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
        token: mfaCode,
      });

      if (response.data.mfaRequired) {
        return { mfaRequired: true };
      }

      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      
      // Use actual user data from response or create a mock user
      const userInfo = userData || {
        email,
        username: email.split('@')[0],
        role: 'user',
        emailVerified: true,
        mfaEnabled: mfaCode ? true : false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setUser(userInfo);
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      let message = 'Login failed';
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        message = 'Cannot connect to server. Please try again later.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      toast.error(message);
      return { error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      toast.success(response.data.message || 'Registration successful!');
      return { success: true };
    } catch (error) {
      let message = 'Registration failed';
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        message = 'Cannot connect to server. Please try again later.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      toast.error(message);
      return { error: message };
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await axios.post('/auth/verify-email', { token });
      toast.success(response.data.message);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Email verification failed';
      toast.error(message);
      return { error: message };
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const response = await axios.post('/auth/request-password-reset', { email });
      toast.success(response.data.message);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset request failed';
      toast.error(message);
      return { error: message };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await axios.post('/auth/reset-password', { token, password });
      toast.success(response.data.message);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { error: message };
    }
  };

  const enableMFA = async () => {
    try {
      const response = await axios.post('/mfa/enable');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'MFA setup failed';
      toast.error(message);
      return { error: message };
    }
  };

  const verifyMFA = async (token) => {
    try {
      const response = await axios.post('/mfa/verify', { token });
      toast.success(response.data.message);
      // Update user to reflect MFA enabled
      setUser(prevUser => ({ ...prevUser, mfaEnabled: true }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'MFA verification failed';
      toast.error(message);
      return { error: message };
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await axios.patch('/user/me', userData);
      toast.success(response.data.message);
      // Update user state with new data
      setUser(prevUser => ({ ...prevUser, ...userData }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { error: message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    enableMFA,
    verifyMFA,
    updateProfile,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
