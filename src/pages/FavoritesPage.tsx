import React, { useState, useEffect } from 'react';
import { Typography, Box, Snackbar, Alert } from '@mui/material';
import NewsList from '../components/NewsList';
import { NewsItem } from '../types';
import { getFavorites, toggleFavorite } from '../services/api';

const FavoritesPage = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      setNewsItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorites. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavorite(id);
      // Remove the item from favorites list
      setNewsItems(prevItems => prevItems.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update favorite status. Please try again.');
    }
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

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FavoritesPage;