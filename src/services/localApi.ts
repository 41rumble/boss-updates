import { NewsItem } from '../types';
import dbData from '../../db.json';

// Convert the data from db.json to match our NewsItem type
const convertDbItemToNewsItem = (item: any): NewsItem => {
  return {
    _id: item.id,
    title: item.title,
    summary: item.summary,
    content: item.summary,
    source: item.link,
    date: new Date(item.date).toISOString(),
    isFavorite: item.isFavorite,
    isAdminKeeper: item.isFavorite, // Use isFavorite as isAdminKeeper for demo
    isRead: false,
    isArchived: false
  };
};

// Convert all items
const newsItems: NewsItem[] = dbData.news.map(convertDbItemToNewsItem);

// API functions that return promises to simulate async behavior
export const getNewsItems = async (params?: { archived?: boolean }): Promise<NewsItem[]> => {
  // Filter by archived status if specified
  if (params?.archived !== undefined) {
    return newsItems.filter(item => item.isArchived === params.archived);
  }
  return newsItems.filter(item => !item.isArchived);
};

export const getFavorites = async (params?: { adminOnly?: boolean, userOnly?: boolean, archived?: boolean }): Promise<NewsItem[]> => {
  let items = newsItems;
  
  // Filter by archived status if specified
  if (params?.archived !== undefined) {
    items = items.filter(item => item.isArchived === params.archived);
  } else {
    items = items.filter(item => !item.isArchived);
  }
  
  // Filter by favorite status
  if (params?.adminOnly) {
    return items.filter(item => item.isAdminKeeper);
  } else if (params?.userOnly) {
    return items.filter(item => item.isFavorite && !item.isAdminKeeper);
  } else {
    return items.filter(item => item.isFavorite || item.isAdminKeeper);
  }
};

export const getArchivedItems = async (): Promise<NewsItem[]> => {
  return getNewsItems({ archived: true });
};

export const toggleFavorite = async (id: string): Promise<NewsItem> => {
  const item = newsItems.find(item => item._id === id);
  if (!item) {
    throw new Error(`News item with ID ${id} not found`);
  }
  
  item.isFavorite = !item.isFavorite;
  return item;
};

export const toggleAdminKeeper = async (id: string): Promise<NewsItem> => {
  const item = newsItems.find(item => item._id === id);
  if (!item) {
    throw new Error(`News item with ID ${id} not found`);
  }
  
  item.isAdminKeeper = !item.isAdminKeeper;
  return item;
};

export const markAsRead = async (id: string): Promise<NewsItem> => {
  const item = newsItems.find(item => item._id === id);
  if (!item) {
    throw new Error(`News item with ID ${id} not found`);
  }
  
  item.isRead = true;
  return item;
};

export const archiveItem = async (id: string): Promise<NewsItem> => {
  const item = newsItems.find(item => item._id === id);
  if (!item) {
    throw new Error(`News item with ID ${id} not found`);
  }
  
  item.isArchived = true;
  return item;
};

export const unarchiveItem = async (id: string): Promise<NewsItem> => {
  const item = newsItems.find(item => item._id === id);
  if (!item) {
    throw new Error(`News item with ID ${id} not found`);
  }
  
  item.isArchived = false;
  return item;
};

export const getItemById = async (id: string): Promise<NewsItem | null> => {
  const item = newsItems.find(item => item._id === id);
  return item || null;
};

export const addNewsItem = async (newsItem: Omit<NewsItem, 'id' | 'date' | 'isFavorite' | 'isAdminKeeper' | 'isRead' | 'isArchived'>): Promise<NewsItem> => {
  const newItem: NewsItem = {
    _id: (newsItems.length + 1).toString(),
    ...newsItem,
    date: new Date().toISOString(),
    isFavorite: false,
    isAdminKeeper: false,
    isRead: false,
    isArchived: false
  };
  
  newsItems.push(newItem);
  return newItem;
};

export const updateNewsItem = async (id: string, newsItem: Partial<Omit<NewsItem, 'id' | 'date' | 'isFavorite' | 'isAdminKeeper' | 'isRead' | 'isArchived'>>): Promise<NewsItem> => {
  const item = newsItems.find(item => item._id === id);
  if (!item) {
    throw new Error(`News item with ID ${id} not found`);
  }
  
  Object.assign(item, newsItem);
  return item;
};

export const deleteNewsItem = async (id: string): Promise<void> => {
  const index = newsItems.findIndex(item => item._id === id);
  if (index === -1) {
    throw new Error(`News item with ID ${id} not found`);
  }
  
  newsItems.splice(index, 1);
};

// Auth API calls
export const login = async (email: string, password: string) => {
  // For demo purposes, accept any email with password "password"
  if (password === 'password') {
    const token = 'demo_token_' + Math.random().toString(36).substring(2);
    return {
      token,
      user: {
        _id: '1',
        name: 'Demo User',
        email,
        isAdmin: true
      }
    };
  } else {
    throw new Error('Invalid credentials');
  }
};

export const register = async (name: string, email: string, password: string) => {
  // For demo purposes, always succeed
  const token = 'demo_token_' + Math.random().toString(36).substring(2);
  return {
    token,
    user: {
      _id: '1',
      name,
      email,
      isAdmin: true
    }
  };
};

export const getUserProfile = async () => {
  // For demo purposes, return a fixed user
  return {
    _id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    isAdmin: true
  };
};

export default {
  getNewsItems,
  getFavorites,
  getArchivedItems,
  toggleFavorite,
  toggleAdminKeeper,
  markAsRead,
  archiveItem,
  unarchiveItem,
  getItemById,
  addNewsItem,
  updateNewsItem,
  deleteNewsItem,
  login,
  register,
  getUserProfile
};