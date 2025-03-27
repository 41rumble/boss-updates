export interface NewsItem {
  _id?: string;
  id?: string; // For backward compatibility
  title: string;
  summary: string;
  link: string;
  date: string;
  isFavorite: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id?: string;
  id?: string; // For backward compatibility
  username: string;
  isAdmin: boolean;
}