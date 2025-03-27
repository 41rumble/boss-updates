import { NewsItem } from '../types';
import * as localApi from './localApi';

// Use the local API instead of making HTTP requests
console.log('Using local API for data');

export const getNewsItems = localApi.getNewsItems;
export const getFavorites = localApi.getFavorites;
export const getArchivedItems = localApi.getArchivedItems;
export const toggleFavorite = localApi.toggleFavorite;
export const toggleAdminKeeper = localApi.toggleAdminKeeper;
export const markAsRead = localApi.markAsRead;
export const archiveItem = localApi.archiveItem;
export const unarchiveItem = localApi.unarchiveItem;
export const getItemById = localApi.getItemById;
export const addNewsItem = localApi.addNewsItem;
export const updateNewsItem = localApi.updateNewsItem;
export const deleteNewsItem = localApi.deleteNewsItem;
export const login = localApi.login;
export const register = localApi.register;
export const getUserProfile = localApi.getUserProfile;

export default localApi.default;