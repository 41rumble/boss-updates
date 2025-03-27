import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

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

// Use the production URL in production, or localhost in development
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://dougsnews.com/api/auth' 
    : 'http://localhost:5000/api/auth');

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

  // Configure axios with auth token
  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        setAuthToken(token);
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
      
      // For demo purposes, we'll accept any login with password "password"
      // In a real app, uncomment the API call below
      
      // Simulated successful login
      if (password === 'password') {
        const user: User = {
          _id: '1',
          name: email.includes('admin') ? 'Admin User' : 'Doug',
          email: email,
          isAdmin: email.includes('admin'),
          token: 'demo_token_' + Math.random().toString(36).substring(2)
        };
        
        // Store auth data in localStorage
        localStorage.setItem('auth_token', user.token || '');
        localStorage.setItem('user_data', JSON.stringify(user));
        
        setAuthToken(user.token || null);
        setIsAuthenticated(true);
        setUser(user);
        return true;
      }
      
      /* Uncomment for real API integration
      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      if (response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data));
        
        setAuthToken(response.data.token);
        setIsAuthenticated(true);
        setUser(response.data);
        return true;
      }
      */
      
      setError('Invalid email or password');
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

  // Register user
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // For demo purposes, we'll simulate a successful registration
      // In a real app, uncomment the API call below
      
      // Simulated successful registration
      const user: User = {
        _id: '2',
        name: name,
        email: email,
        isAdmin: false,
        token: 'demo_token_' + Math.random().toString(36).substring(2)
      };
      
      // Store auth data in localStorage
      localStorage.setItem('auth_token', user.token || '');
      localStorage.setItem('user_data', JSON.stringify(user));
      
      setAuthToken(user.token || null);
      setIsAuthenticated(true);
      setUser(user);
      return true;
      
      /* Uncomment for real API integration
      const response = await axios.post(`${API_URL}/register`, { name, email, password });
      
      if (response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data));
        
        setAuthToken(response.data.token);
        setIsAuthenticated(true);
        setUser(response.data);
        return true;
      }
      */
      
      setError('Registration failed');
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
    setAuthToken(null);
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