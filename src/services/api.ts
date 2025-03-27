import axios from 'axios';
import { NewsItem } from '../types';

// Use the production URL in production, or localhost in development
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://www.dougsnews.com/backend/api' 
    : 'https://www.dougsnews.com/backend/api');

console.log('Using API URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with cross-origin requests
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

export const getNewsItems = async (params?: { archived?: boolean }): Promise<NewsItem[]> => {
  // Create a new object with string values for the API
  const queryParams: Record<string, string> = {};
  
  // Only add parameters that are defined
  if (params?.archived !== undefined) {
    queryParams.archived = params.archived ? 'true' : 'false';
  }
  
  const response = await api.get('/news', { params: queryParams });
  return response.data;
};

export const getFavorites = async (params?: { adminOnly?: boolean, userOnly?: boolean, archived?: boolean }): Promise<NewsItem[]> => {
  // Create a new object with string values for the API
  const queryParams: Record<string, string> = {};
  
  // Only add parameters that are defined
  if (params?.archived !== undefined) {
    queryParams.archived = params.archived ? 'true' : 'false';
  }
  if (params?.adminOnly !== undefined) {
    queryParams.adminOnly = params.adminOnly ? 'true' : 'false';
  }
  if (params?.userOnly !== undefined) {
    queryParams.userOnly = params.userOnly ? 'true' : 'false';
  }
  
  const response = await api.get('/news/favorites', { params: queryParams });
  return response.data;
};

export const getArchivedItems = async (): Promise<NewsItem[]> => {
  return getNewsItems({ archived: true });
};

export const toggleFavorite = async (id: string): Promise<NewsItem> => {
  const response = await api.post(`/news/${id}/toggle-favorite`);
  return response.data;
};

export const toggleAdminKeeper = async (id: string): Promise<NewsItem> => {
  const response = await api.post(`/news/${id}/toggle-admin-keeper`);
  return response.data;
};

export const markAsRead = async (id: string): Promise<NewsItem> => {
  const response = await api.post(`/news/${id}/mark-read`);
  return response.data;
};

export const archiveItem = async (id: string): Promise<NewsItem> => {
  const response = await api.post(`/news/${id}/archive`);
  return response.data;
};

export const unarchiveItem = async (id: string): Promise<NewsItem> => {
  const response = await api.post(`/news/${id}/unarchive`);
  return response.data;
};

// Helper function to get a single item by ID
export const getItemById = async (id: string): Promise<NewsItem | null> => {
  const response = await api.get(`/news/${id}`);
  return response.data;
};

export const addNewsItem = async (newsItem: Omit<NewsItem, 'id' | 'date' | 'isFavorite' | 'isAdminKeeper' | 'isRead' | 'isArchived'>): Promise<NewsItem> => {
  const response = await api.post('/news', newsItem);
  return response.data;
};

export const updateNewsItem = async (id: string, newsItem: Partial<Omit<NewsItem, 'id' | 'date' | 'isFavorite' | 'isAdminKeeper' | 'isRead' | 'isArchived'>>): Promise<NewsItem> => {
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