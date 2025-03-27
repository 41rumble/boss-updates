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
      
      console.log('Login attempt:', { email, password });
      
      // For demo purposes, we'll accept any login with password "password"
      // In a real app, use the API call below
      
      if (password === 'password') {
        console.log('Login successful with demo credentials');
        
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
        
        setIsAuthenticated(true);
        setUser(user);
        return true;
      }
      
      // Real API integration (uncomment for production)
      /*
      try {
        const userData = await apiService.login(email, password);
        
        if (userData && userData.token) {
          localStorage.setItem('auth_token', userData.token);
          localStorage.setItem('user_data', JSON.stringify(userData));
          
          setIsAuthenticated(true);
          setUser(userData);
          return true;
        }
      } catch (apiError) {
        console.error('API login error:', apiError);
        throw apiError;
      }
      */
      
      console.log('Login failed: Invalid credentials');
      setError('Invalid email or password. Use any email with password: "password"');
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
      // In a real app, use the API call below
      
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
      
      setIsAuthenticated(true);
      setUser(user);
      return true;
      
      // Real API integration (uncomment for production)
      /*
      try {
        const userData = await apiService.register(name, email, password);
        
        if (userData && userData.token) {
          localStorage.setItem('auth_token', userData.token);
          localStorage.setItem('user_data', JSON.stringify(userData));
          
          setIsAuthenticated(true);
          setUser(userData);
          return true;
        }
      } catch (apiError) {
        console.error('API registration error:', apiError);
        throw apiError;
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