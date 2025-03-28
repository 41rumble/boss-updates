import axios from 'axios';
import { NewsItem } from '../types';

// Use the local proxy server to bypass CORS
const API_URL = 'http://localhost:3001/api';

console.log('Using API URL with proxy:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // No need for withCredentials when using the proxy
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

// Add a response interceptor to handle auth errors and CORS issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error information for debugging
    console.error('API Error:', {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.config?.headers,
      data: error.config?.data
    });
    
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
    
    // Handle CORS errors
    if (error.message && error.message.includes('CORS')) {
      console.error('CORS Error detected. This is likely due to cross-origin restrictions.');
      console.error('Please ensure the server has proper CORS headers configured.');
      
      // You might want to show a user-friendly error message here
      // or try an alternative API endpoint
    }
    
    return Promise.reject(error);
  }
);

// API functions remain the same as in api.ts
export const getNewsItems = async (params?: { archived?: boolean }): Promise<NewsItem[]> => {
  const queryParams: Record<string, string> = {};
  if (params?.archived !== undefined) {
    queryParams.archived = params.archived ? 'true' : 'false';
  }
  const response = await api.get('/news', { params: queryParams });
  return response.data;
};

export const getFavorites = async (params?: { adminOnly?: boolean, userOnly?: boolean, archived?: boolean }): Promise<NewsItem[]> => {
  const queryParams: Record<string, string> = {};
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