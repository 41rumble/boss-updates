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
import { getNewsItems, toggleFavorite, markAsRead, removeFromLatest, addToLatest } from '../services/api';

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
        isInLatest?: boolean;
        includeAll?: boolean;
      } = {};
      
      if (searchTerm.length > 0 || showAll) {
        // If searching or "Show All" is selected, don't filter by any status
        params.includeAll = true;
      } else {
        // For normal Latest view, only show items that are in Latest and not archived
        params.isInLatest = true;
        params.archived = false;
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
  }, [showRead, showUnread, showArchived, showAll, searchTerm]);

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
      
      // Update the item in the list to show it as read
      setNewsItems(prevItems => 
        prevItems.map(item => 
          item._id === id ? { ...item, isRead: true } : item
        )
      );
    } catch (err) {
      console.error('Error marking item as read:', err);
      setError('Failed to mark item as read. Please try again.');
    }
  };
  
  const handleRemoveFromLatest = async (id: string) => {
    try {
      const updatedItem = await removeFromLatest(id);
      
      // Remove the item from the list if we're in the Latest view
      setNewsItems(prevItems => 
        prevItems.filter(item => item._id !== id)
      );
    } catch (err) {
      console.error('Error removing item from Latest view:', err);
      setError('Failed to remove item from Latest view. Please try again.');
    }
  };
  
  const handleAddToLatest = async (id: string) => {
    try {
      const updatedItem = await addToLatest(id);
      
      // Refresh the list to show the item if we're in the Latest view
      fetchNewsItems();
    } catch (err) {
      console.error('Error adding item to Latest view:', err);
      setError('Failed to add item to Latest view. Please try again.');
    }
  };

  // When searching, we want to search across all items
  useEffect(() => {
    // If we start searching, fetch all items
    if (searchTerm.length > 0 && !showAll) {
      // Temporarily set showAll to true to fetch all items
      setShowAll(true);
    } else if (searchTerm.length === 0 && showAll && !showRead && !showArchived) {
      // When search is cleared and we're not explicitly showing read or archived items,
      // reset to default filters (unread only)
      setShowAll(false);
      setShowRead(false);
      setShowUnread(true);
      setShowArchived(false);
    }
  }, [searchTerm, showAll, showRead, showArchived]);
  
  // Filter items based on search term and read status
  const filteredItems = newsItems.filter(item => {
    // First, apply search filter if there's a search term
    const matchesSearch = searchTerm.length === 0 || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Then, if we're not searching, apply the read/unread filter
    if (searchTerm.length === 0) {
      // In Latest view, only show unread items by default
      if (item.isRead && !showRead) return false;
      if (!item.isRead && !showUnread) return false;
      if (item.isArchived && !showArchived) return false;
    }
    
    return true;
  });

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
      
      <Box sx={{ mb: 3 }}>
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
        
        {/* Only show filters when searching */}
        {searchTerm.length > 0 && (
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Search Filters
              {activeFiltersCount > 0 && (
                <Chip 
                  label={activeFiltersCount} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 1 }} 
                />
              )}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={showUnread} 
                      onChange={handleToggleShowUnread}
                      disabled={showAll}
                      size="small"
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
                      size="small"
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
                      size="small"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ArchiveIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">Archived</Typography>
                    </Box>
                  }
                />
                
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={showAll} 
                      onChange={handleToggleShowAll}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" fontWeight="bold">Show All</Typography>
                  }
                />
              </FormGroup>
            </Box>
          </Paper>
        )}
      </Box>
      
      <NewsList 
        items={filteredItems} 
        loading={loading} 
        onToggleFavorite={handleToggleFavorite}
        onMarkRead={handleMarkRead}
        onRemoveFromLatest={handleRemoveFromLatest}
        onAddToLatest={handleAddToLatest}
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