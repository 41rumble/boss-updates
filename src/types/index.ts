export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  link: string;
  date: string;
  isFavorite: boolean;
}

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}