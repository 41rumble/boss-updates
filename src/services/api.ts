import axios from 'axios';
import { NewsItem } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

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
  const response = await api.get('/favorites');
  return response.data;
};

export const toggleFavorite = async (id: string): Promise<void> => {
  await api.post(`/news/${id}/toggle-favorite`);
};

export const addNewsItem = async (newsItem: Omit<NewsItem, 'id' | 'date' | 'isFavorite'>): Promise<NewsItem> => {
  const response = await api.post('/news', newsItem);
  return response.data;
};

export default api;