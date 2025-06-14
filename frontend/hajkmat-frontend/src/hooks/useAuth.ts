import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import React from 'react';
import { User, AuthContextType } from '../types/authtypes';

// Create the context with a default undefined value AND explicit type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps your app and makes auth available
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use development bypass in dev mode if needed
      if (import.meta.env.DEV && window.localStorage.getItem('dev_auth_bypass')) {
        const devUser = JSON.parse(
          localStorage.getItem('dev_user') || '{"id":"dev-user","displayName":"Dev User"}',
        );
        setUser(devUser);
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/check', {
        credentials: 'include', // Important for cookies
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
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
    // For dev environment, you can use bypass
    if (import.meta.env.DEV && confirm('Use dev login bypass?')) {
      window.localStorage.setItem('dev_auth_bypass', 'true');
      window.localStorage.setItem(
        'dev_user',
        JSON.stringify({
          id: 'dev-user',
          displayName: 'Dev User',
          email: 'dev@example.com',
        }),
      );
      checkAuthStatus();
      return;
    }

    // For production, redirect to Google OAuth
    window.location.href = '/api/auth/google';
  };

  // Handle logout
  const logout = async () => {
    try {
      setLoading(true);

      // Clear dev bypass if used
      if (import.meta.env.DEV && window.localStorage.getItem('dev_auth_bypass')) {
        window.localStorage.removeItem('dev_auth_bypass');
        window.localStorage.removeItem('dev_user');
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      // Call logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setUser(null);
      } else {
        setError('Failed to logout');
      }
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Failed to logout');
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
