import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { addNewsItem, getNewsItems, getFavorites } from '../services/api';
import NewsList from '../components/NewsList';
import { NewsItem } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminPage = () => {
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Add News form state
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // News items state
  const [allNewsItems, setAllNewsItems] = useState<NewsItem[]>([]);
  const [keeperItems, setKeeperItems] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingKeepers, setLoadingKeepers] = useState(false);
  
  // Notification state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [error, setError] = useState<string | null>(null);

  // Fetch data when tab changes
  useEffect(() => {
    if (tabValue === 1) {
      fetchAllNewsItems();
    } else if (tabValue === 2) {
      fetchKeepers();
    }
  }, [tabValue]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchAllNewsItems = async () => {
    try {
      setLoadingNews(true);
      const data = await getNewsItems();
      setAllNewsItems(data);
    } catch (err) {
      console.error('Error fetching news items:', err);
      showSnackbar('Failed to load news items', 'error');
    } finally {
      setLoadingNews(false);
    }
  };

  const fetchKeepers = async () => {
    try {
      setLoadingKeepers(true);
      const data = await getFavorites();
      setKeeperItems(data);
    } catch (err) {
      console.error('Error fetching keepers:', err);
      showSnackbar('Failed to load keepers', 'error');
    } finally {
      setLoadingKeepers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addNewsItem({ title, summary, link });
      setTitle('');
      setSummary('');
      setLink('');
      showSnackbar('Update added successfully!', 'success');
    } catch (err) {
      console.error('Error adding news item:', err);
      showSnackbar('Failed to add update', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      // This will be called from both the All News and Keepers tabs
      if (tabValue === 2) {
        // If we're in the Keepers tab, remove the item from the list
        setKeeperItems(prevItems => prevItems.filter(item => item._id !== id));
      } else {
        // If we're in the All News tab, update the item's favorite status
        setAllNewsItems(prevItems => 
          prevItems.map(item => 
            item._id === id ? { ...item, isFavorite: !item.isFavorite } : item
          )
        );
      }
      showSnackbar('Keeper status updated', 'success');
    } catch (err) {
      console.error('Error toggling keeper status:', err);
      showSnackbar('Failed to update keeper status', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<AddIcon />} label="Add News" />
          <Tab icon={<NewspaperIcon />} label="All News" />
          <Tab icon={<StarIcon />} label="Manage Keepers" />
        </Tabs>
        
        {/* Add News Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add New Update
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                multiline
                rows={4}
                name="summary"
                label="Summary"
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                helperText="Provide context about why this is important for Doug"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="link"
                label="Source Link"
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                helperText="YouTube and Vimeo links will automatically display video thumbnails"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={!title || !summary || !link || isSubmitting}
                endIcon={isSubmitting ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
              >
                {isSubmitting ? 'Submitting...' : 'Add Update'}
              </Button>
            </Box>
          </Box>
        </TabPanel>
        
        {/* All News Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Manage All News
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              View and edit all news items. Star items to add them to Keepers.
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <NewsList 
              items={allNewsItems} 
              loading={loadingNews} 
              onToggleFavorite={handleToggleFavorite}
              onItemUpdated={fetchAllNewsItems}
              emptyMessage="No news items available."
            />
          </Box>
        </TabPanel>
        
        {/* Keepers Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Manage Keepers
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              These are important items that will remain accessible to Doug for reference.
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <NewsList 
              items={keeperItems} 
              loading={loadingKeepers} 
              onToggleFavorite={handleToggleFavorite}
              onItemUpdated={fetchKeepers}
              emptyMessage="No keepers yet. Star items from the News page to add them here."
            />
          </Box>
        </TabPanel>
      </Paper>
      
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

export default AdminPage;