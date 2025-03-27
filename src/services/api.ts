import axios from 'axios';
import { NewsItem } from '../types';

// Use the production URL in production, or localhost in development
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://dougsnews.com/api' 
    : 'http://192.168.200.184:5000/api');

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // For demo purposes, we'll use a simulated token
      // In a real app, you might redirect to login or refresh the token
      console.warn('Authentication error. Using demo token for development.');
      
      // Create a demo token if in development mode
      if (process.env.NODE_ENV === 'development') {
        const demoToken = 'demo_token_' + Math.random().toString(36).substring(2);
        localStorage.setItem('auth_token', demoToken);
        
        // Create a demo user
        const demoUser = {
          _id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          isAdmin: true
        };
        localStorage.setItem('user_data', JSON.stringify(demoUser));
        
        // Retry the request with the new token
        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${demoToken}`;
        return axios(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);

export const getNewsItems = async (): Promise<NewsItem[]> => {
  const response = await api.get('/news');
  return response.data;
};

export const getFavorites = async (): Promise<NewsItem[]> => {
  const response = await api.get('/news/favorites');
  return response.data;
};

export const toggleFavorite = async (id: string): Promise<NewsItem> => {
  const response = await api.post(`/news/${id}/toggle-favorite`);
  return response.data;
};

export const addNewsItem = async (newsItem: Omit<NewsItem, 'id' | 'date' | 'isFavorite'>): Promise<NewsItem> => {
  const response = await api.post('/news', newsItem);
  return response.data;
};

export const updateNewsItem = async (id: string, newsItem: Partial<Omit<NewsItem, 'id' | 'date' | 'isFavorite'>>): Promise<NewsItem> => {
  const response = await api.put(`/news/${id}`, newsItem);
  return response.data;
};

export const deleteNewsItem = async (id: string): Promise<void> => {
  await api.delete(`/news/${id}`);
};

// Auth API calls
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export default api;