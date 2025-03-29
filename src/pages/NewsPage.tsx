import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  TextField, 
  InputAdornment, 
  Snackbar, 
  Alert,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Paper,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import NewsList from '../components/NewsList';
import { NewsItem } from '../types';
import { getNewsItems, toggleFavorite, markAsRead } from '../services/api';

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [showRead, setShowRead] = useState(false);
  const [showUnread, setShowUnread] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [showAll, setShowAll] = useState(false);
  
  // Active filters count for UI
  const [activeFiltersCount, setActiveFiltersCount] = useState(1); // Default: unread only

  const fetchNewsItems = async () => {
    try {
      setLoading(true);
      
      let params: {
        archived?: boolean;
        isRead?: boolean;
        includeAll?: boolean;
      } = {};
      
      if (showAll) {
        // If "Show All" is selected, don't filter by any status
        params.includeAll = true;
      } else {
        // Otherwise, apply filters
        if (!showArchived) {
          params.archived = false;
        }
        
        // Only apply read filter if we're not showing both read and unread
        if (showRead && !showUnread) {
          params.isRead = true;
        } else if (!showRead && showUnread) {
          params.isRead = false;
        }
      }
      
      const data = await getNewsItems(params);
      setNewsItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching news items:', err);
      setError('Failed to load news items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Update active filters count when filters change
  useEffect(() => {
    let count = 0;
    if (showRead) count++;
    if (showUnread) count++;
    if (showArchived) count++;
    if (showAll) count = 0; // No active filters if showing all
    
    setActiveFiltersCount(count);
    
    // Fetch items when filters change
    fetchNewsItems();
  }, [showRead, showUnread, showArchived, showAll]);

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
  
  const handleMarkRead = async (id: string) => {
    try {
      const updatedItem = await markAsRead(id);
      
      // If we're not showing read items, remove the item from the list
      if (!showRead) {
        setNewsItems(prevItems => 
          prevItems.filter(item => item._id !== id)
        );
      } else {
        // Otherwise, update the item in the list
        setNewsItems(prevItems => 
          prevItems.map(item => 
            item._id === id ? { ...item, isRead: true } : item
          )
        );
      }
    } catch (err) {
      console.error('Error marking item as read:', err);
      setError('Failed to mark item as read. Please try again.');
    }
  };

  const filteredItems = newsItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle filter toggles
  const handleToggleShowRead = () => {
    setShowRead(!showRead);
  };
  
  const handleToggleShowUnread = () => {
    setShowUnread(!showUnread);
  };
  
  const handleToggleShowArchived = () => {
    setShowArchived(!showArchived);
  };
  
  const handleToggleShowAll = () => {
    setShowAll(!showAll);
    
    // If turning on "Show All", disable other filters
    if (!showAll) {
      setShowRead(true);
      setShowUnread(true);
      setShowArchived(true);
    } else {
      // If turning off "Show All", reset to default (unread only)
      setShowRead(false);
      setShowUnread(true);
      setShowArchived(false);
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Latest Updates
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search updates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Paper sx={{ p: 2, minWidth: { md: '300px' } }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Filters
            {activeFiltersCount > 0 && (
              <Chip 
                label={activeFiltersCount} 
                size="small" 
                color="primary" 
                sx={{ ml: 1 }} 
              />
            )}
          </Typography>
          
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={showUnread} 
                  onChange={handleToggleShowUnread}
                  disabled={showAll}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <VisibilityOffIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">Unread</Typography>
                </Box>
              }
            />
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={showRead} 
                  onChange={handleToggleShowRead}
                  disabled={showAll}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">Read</Typography>
                </Box>
              }
            />
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={showArchived} 
                  onChange={handleToggleShowArchived}
                  disabled={showAll}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArchiveIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">Archived</Typography>
                </Box>
              }
            />
            
            <Divider sx={{ my: 1 }} />
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={showAll} 
                  onChange={handleToggleShowAll}
                />
              }
              label={
                <Typography variant="body2" fontWeight="bold">Show All</Typography>
              }
            />
          </FormGroup>
        </Paper>
      </Box>
      
      <NewsList 
        items={filteredItems} 
        loading={loading} 
        onToggleFavorite={handleToggleFavorite}
        onMarkRead={handleMarkRead}
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