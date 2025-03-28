export interface NewsItem {
  _id?: string;
  id?: string; // For backward compatibility
  title: string;
  summary: string;
  link: string;
  date: string;
  isFavorite: boolean;
  isAdminKeeper?: boolean; // Added to track items the admin has marked as keepers
  isRead?: boolean; // Track if Doug has read this item
  isArchived?: boolean; // Track if item has been archived
  lastReadAt?: string; // When the item was last read
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id?: string;
  id?: string; // For backward compatibility
  username: string;
  isAdmin: boolean;
}

export interface LoginHistoryEntry {
  userId: string;
  userName: string;
  userEmail: string;
  isAdmin: boolean;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}