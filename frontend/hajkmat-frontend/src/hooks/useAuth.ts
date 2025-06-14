import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import React from 'react';
import { User, AuthContextType } from '../types/authtypes';
import API_URL from '../config/api';

// Create the context with a default undefined value AND explicit type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps your app and makes auth available
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleTokenAuthentication = async (token: string) => {
    try {
      console.log('handleTokenAuthentication called with token');

      // Store token (redundant but ensures it's set)
      localStorage.setItem('auth_token', token);

      // Verify token and update state
      await checkAuthStatus();

      // Check if it worked
      console.log('Auth state after token processing:', {
        isAuthenticated,
        user: user?.displayName || 'No user',
      });

      return isAuthenticated;
    } catch (err) {
      console.error('Token authentication failed:', err);
      return false;
    }
  };
  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check for token
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Verify token with backend
      const response = await fetch(`${API_URL}/auth/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        // Token invalid, clean up
        localStorage.removeItem('auth_token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setError('Failed to check authentication status');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle login - redirects to Google OAuth
  const login = () => {
    // For production, redirect to Google OAuth
    window.location.href = `${API_URL}/auth/google`;
  };

  // Handle logout
  const logout = async () => {
    try {
      setLoading(true);

      // Remove token instead of clearing cookies
      localStorage.removeItem('auth_token');

      return true;
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Failed to logout');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check auth status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Create value object to provide to consumers
  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    checkAuthStatus,
    handleTokenAuthentication,
  };

  // Provide the auth context to children
  return React.createElement(AuthContext.Provider, { value }, children);
};

// Hook for consuming the auth context from components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
