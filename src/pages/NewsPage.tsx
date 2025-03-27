import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, InputAdornment, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NewsList from '../components/NewsList';
import { NewsItem } from '../types';
import { getNewsItems, toggleFavorite } from '../services/api';

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchNewsItems = async () => {
    try {
      setLoading(true);
      // Explicitly request non-archived items only
      const data = await getNewsItems({ archived: false });
      setNewsItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching news items:', err);
      setError('Failed to load news items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsItems();
  }, []);

  const handleToggleFavorite = async (id: string) => {
    try {
      const updatedItem = await toggleFavorite(id);
      
      setNewsItems(prevItems => 
        prevItems.map(item => 
          item._id === id ? { ...item, isFavorite: updatedItem.isFavorite } : item
        )
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update favorite status. Please try again.');
    }
  };

  const filteredItems = newsItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Latest Updates
      </Typography>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search updates..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <NewsList 
        items={filteredItems} 
        loading={loading} 
        onToggleFavorite={handleToggleFavorite}
        onItemUpdated={fetchNewsItems}
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

export default NewsPage;