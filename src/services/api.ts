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

export const getNewsItems = async (params?: { archived?: boolean }): Promise<NewsItem[]> => {
  // If archived parameter is not explicitly set, default to showing non-archived items
  const queryParams = params || {};
  if (queryParams.archived === undefined) {
    queryParams.archived = false;
  }
  
  const response = await api.get('/news', { params: queryParams });
  return response.data;
};

export const getFavorites = async (params?: { adminOnly?: boolean, userOnly?: boolean, archived?: boolean }): Promise<NewsItem[]> => {
  // By default, don't show archived items in favorites/keepers
  const queryParams = params || {};
  if (queryParams.archived === undefined) {
    queryParams.archived = false;
  }
  
  const response = await api.get('/news/favorites', { params: queryParams });
  return response.data;
};

export const getArchivedItems = async (): Promise<NewsItem[]> => {
  return getNewsItems({ archived: true });
};

export const toggleFavorite = async (id: string): Promise<NewsItem> => {
  try {
    // First try the API endpoint
    const response = await api.post(`/news/${id}/toggle-favorite`);
    return response.data;
  } catch (error) {
    // If the API endpoint fails, fall back to a direct update
    console.log('Falling back to direct update for toggle favorite');
    const item = await getItemById(id);
    if (!item) {
      throw new Error('Item not found');
    }
    
    const updatedItem = { ...item, isFavorite: !item.isFavorite };
    return updateNewsItem(id, updatedItem);
  }
};

export const toggleAdminKeeper = async (id: string): Promise<NewsItem> => {
  try {
    // First try the API endpoint
    const response = await api.post(`/news/${id}/toggle-admin-keeper`);
    return response.data;
  } catch (error) {
    // If the API endpoint fails, fall back to a direct update
    console.log('Falling back to direct update for toggle admin keeper');
    const item = await getItemById(id);
    if (!item) {
      throw new Error('Item not found');
    }
    
    const updatedItem = { ...item, isAdminKeeper: !item.isAdminKeeper };
    return updateNewsItem(id, updatedItem);
  }
};

export const markAsRead = async (id: string): Promise<NewsItem> => {
  try {
    // First try the API endpoint
    const response = await api.post(`/news/${id}/mark-read`);
    return response.data;
  } catch (error) {
    // If the API endpoint fails, fall back to a direct update
    console.log('Falling back to direct update for mark as read');
    const item = await getItemById(id);
    if (!item) {
      throw new Error('Item not found');
    }
    
    const updatedItem = { 
      ...item, 
      isRead: true,
      lastReadAt: new Date().toISOString()
    };
    return updateNewsItem(id, updatedItem);
  }
};

export const archiveItem = async (id: string): Promise<NewsItem> => {
  try {
    // First try the API endpoint
    const response = await api.post(`/news/${id}/archive`);
    return response.data;
  } catch (error) {
    // If the API endpoint fails, fall back to a direct update
    // This is useful for the mock environment where we don't have specific endpoints
    console.log('Falling back to direct update for archive');
    const item = await getItemById(id);
    if (!item) {
      throw new Error('Item not found');
    }
    
    const updatedItem = { ...item, isArchived: true };
    return updateNewsItem(id, updatedItem);
  }
};

export const unarchiveItem = async (id: string): Promise<NewsItem> => {
  try {
    // First try the API endpoint
    const response = await api.post(`/news/${id}/unarchive`);
    return response.data;
  } catch (error) {
    // If the API endpoint fails, fall back to a direct update
    console.log('Falling back to direct update for unarchive');
    const item = await getItemById(id);
    if (!item) {
      throw new Error('Item not found');
    }
    
    const updatedItem = { ...item, isArchived: false };
    return updateNewsItem(id, updatedItem);
  }
};

// Helper function to get a single item by ID
export const getItemById = async (id: string): Promise<NewsItem | null> => {
  try {
    const response = await api.get(`/news/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching item by ID:', error);
    
    // For mock environment, try to find the item in all news
    const allItems = await getNewsItems({ archived: undefined });
    const item = allItems.find(item => (item._id || item.id) === id);
    return item || null;
  }
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