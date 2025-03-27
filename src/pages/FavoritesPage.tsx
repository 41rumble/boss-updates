import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import NewsList from '../components/NewsList';
import { NewsItem } from '../types';

const FavoritesPage = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from API
    setTimeout(() => {
      // This would be a separate API call to get favorites
      const mockNewsItems = [
        {
          id: '2',
          title: 'New Client Acquisition',
          summary: 'We have successfully onboarded XYZ Corp as a new client with an estimated annual contract value of $500K.',
          link: 'https://example.com/client',
          date: '2023-04-10',
          isFavorite: true
        }
      ];
      setNewsItems(mockNewsItems);
      setLoading(false);
    }, 1000);
  }, []);

  const handleToggleFavorite = (id: string) => {
    setNewsItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      ).filter(item => item.isFavorite)
    );
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Favorite Updates
      </Typography>
      
      <NewsList 
        items={newsItems} 
        loading={loading} 
        onToggleFavorite={handleToggleFavorite}
        emptyMessage="No favorites yet. Star items from the News page to add them here."
      />
    </Box>
  );
};

export default FavoritesPage;