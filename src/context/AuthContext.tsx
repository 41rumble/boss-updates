import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import * as apiService from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token?: string;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  loading: true,
  error: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login user
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Login attempt:', { email });
      
      try {
        console.log('Attempting API login...');
        const userData = await apiService.login(email, password);
        
        if (userData && userData.token) {
          console.log('API login successful');
          localStorage.setItem('auth_token', userData.token);
          localStorage.setItem('user_data', JSON.stringify(userData));
          
          setIsAuthenticated(true);
          setUser(userData);
          return true;
        }
      } catch (apiError) {
        console.error('API login error:', apiError);
      }
      
      // If we get here, login failed
      console.log('Login failed: Invalid credentials');
      setError('Invalid email or password.');
      return false;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Login failed');
      } else {
        setError('Login failed. Please try again.');
      }
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register user (admin only)
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Registration attempt:', { name, email });
      
      try {
        console.log('Attempting API registration...');
        const userData = await apiService.register(name, email, password);
        
        if (userData && userData.token) {
          console.log('API registration successful');
          return true;
        }
      } catch (apiError) {
        console.error('API registration error:', apiError);
      }
      
      console.log('Registration failed');
      setError('Registration failed. Please try again.');
      return false;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Registration failed');
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      register,
      logout, 
      loading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};