import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Snackbar, 
  Alert, 
  TextField,
  InputAdornment,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NewsList from '../components/NewsList';
import { NewsItem } from '../types';
import { getArchivedItems, unarchiveItem, toggleFavorite, toggleAdminKeeper } from '../services/api';

const ArchivePage = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const fetchArchivedItems = async () => {
    try {
      setLoading(true);
      const data = await getArchivedItems();
      
      // Ensure we only display items that are actually archived
      const archivedData = data.filter(item => item.isArchived === true);
      setNewsItems(archivedData);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching archived items:', err);
      setError('Failed to load archived items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedItems();
  }, []);

  const handleUnarchive = async (id: string) => {
    try {
      await unarchiveItem(id);
      // Remove the item from the list
      setNewsItems(prevItems => prevItems.filter(item => item._id !== id));
      showSnackbar('Item unarchived successfully', 'success');
    } catch (err) {
      console.error('Error unarchiving item:', err);
      showSnackbar('Failed to unarchive item', 'error');
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const updatedItem = await toggleFavorite(id);
      
      setNewsItems(prevItems => 
        prevItems.map(item => 
          item._id === id ? { ...item, isFavorite: updatedItem.isFavorite } : item
        )
      );
      
      showSnackbar('Keeper status updated', 'success');
    } catch (err) {
      console.error('Error toggling favorite:', err);
      showSnackbar('Failed to update keeper status', 'error');
    }
  };

  const handleToggleAdminKeeper = async (id: string) => {
    try {
      const updatedItem = await toggleAdminKeeper(id);
      
      setNewsItems(prevItems => 
        prevItems.map(item => 
          item._id === id ? { ...item, isAdminKeeper: updatedItem.isAdminKeeper } : item
        )
      );
      
      showSnackbar('Admin keeper status updated', 'success');
    } catch (err) {
      console.error('Error toggling admin keeper:', err);
      showSnackbar('Failed to update admin keeper status', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const filteredItems = newsItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Archive
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Browse and manage archived news items. You can unarchive items or add them to keepers.
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search archive..."
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
        onToggleAdminKeeper={handleToggleAdminKeeper}
        onUnarchive={handleUnarchive}
        onItemUpdated={fetchArchivedItems}
        showAdminControls={true}
        emptyMessage="No archived items available."
      />

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

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

export default ArchivePage;