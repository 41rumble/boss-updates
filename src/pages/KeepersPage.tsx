import React, { useState, useEffect } from 'react';
import { Typography, Box, Snackbar, Alert } from '@mui/material';
import NewsList from '../components/NewsList';
import { NewsItem } from '../types';
import { getFavorites, toggleFavorite } from '../services/api';

const KeepersPage = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKeepers = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      setNewsItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching keepers:', err);
      setError('Failed to load keepers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeepers();
  }, []);

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavorite(id);
      // Remove the item from keepers list
      setNewsItems(prevItems => prevItems.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error toggling keeper status:', err);
      setError('Failed to update keeper status. Please try again.');
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Keepers
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Important content worth holding on to for Doug's reference.
      </Typography>
      
      <NewsList 
        items={newsItems} 
        loading={loading} 
        onToggleFavorite={handleToggleFavorite}
        onItemUpdated={fetchKeepers}
        emptyMessage="No keepers yet. Star items from the News page to add them here."
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

export default KeepersPage;