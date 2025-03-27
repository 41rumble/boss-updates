import axios from 'axios';
import { NewsItem } from '../types';

// Use the production URL in production, or localhost in development
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://dougsnews.com/api' 
    : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default api;