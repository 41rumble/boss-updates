import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Snackbar, 
  Alert, 
  ToggleButtonGroup, 
  ToggleButton,
  Divider,
  Chip
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import NewsList from '../components/NewsList';
import { NewsItem } from '../types';
import { getFavorites, toggleFavorite } from '../services/api';

const KeepersPage = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null); // null = all, 'user' = user keepers, 'admin' = admin keepers

  const fetchKeepers = async () => {
    try {
      setLoading(true);
      
      // Get keepers based on filter
      let params = {};
      if (filter === 'user') {
        params = { userOnly: true };
      } else if (filter === 'admin') {
        params = { adminOnly: true };
      }
      
      const data = await getFavorites(params);
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
  }, [filter]);
  
  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string | null,
  ) => {
    setFilter(newFilter);
  };

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
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Filter by:
        </Typography>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          aria-label="keeper filter"
          size="small"
        >
          <ToggleButton value={null} aria-label="all keepers">
            All Keepers
          </ToggleButton>
          <ToggleButton value="user" aria-label="your keepers">
            <StarIcon fontSize="small" sx={{ mr: 1 }} />
            Your Keepers
          </ToggleButton>
          <ToggleButton value="admin" aria-label="admin keepers">
            <BookmarkIcon fontSize="small" sx={{ mr: 1 }} />
            Admin Selections
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {filter && (
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={filter === 'user' ? 'Showing your keepers' : 'Showing admin selections'} 
            color={filter === 'user' ? 'secondary' : 'primary'}
            onDelete={() => setFilter(null)}
            icon={filter === 'user' ? <StarIcon /> : <BookmarkIcon />}
          />
        </Box>
      )}
      
      <NewsList 
        items={newsItems} 
        loading={loading} 
        onToggleFavorite={handleToggleFavorite}
        onItemUpdated={fetchKeepers}
        emptyMessage={
          filter === 'user' 
            ? "You haven't starred any items yet. Star items from the News page to add them here."
            : filter === 'admin'
              ? "No admin selections available yet."
              : "No keepers yet. Star items from the News page to add them here."
        }
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