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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ArchiveIcon from '@mui/icons-material/Archive';
import PeopleIcon from '@mui/icons-material/People';
import { 
  addNewsItem, 
  getNewsItems, 
  getFavorites, 
  getArchivedItems,
  toggleFavorite, 
  toggleAdminKeeper, 
  archiveItem,
  unarchiveItem,
  markAsRead,
  getLoginHistory
} from '../services/api';
import NewsList from '../components/NewsList';
import { NewsItem, LoginHistoryEntry } from '../types';

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
  const [archivedItems, setArchivedItems] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingKeepers, setLoadingKeepers] = useState(false);
  const [loadingArchive, setLoadingArchive] = useState(false);
  
  // Login history state
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([]);
  const [loadingLoginHistory, setLoadingLoginHistory] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
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
    } else if (tabValue === 3) {
      fetchArchivedItems();
    } else if (tabValue === 4) {
      fetchLoginHistory();
    }
  }, [tabValue]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchAllNewsItems = async () => {
    try {
      setLoadingNews(true);
      // In admin view, show non-archived items by default
      const data = await getNewsItems({ archived: false });
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
      // In admin view, show non-archived keepers by default
      const data = await getFavorites({ archived: false });
      setKeeperItems(data);
    } catch (err) {
      console.error('Error fetching keepers:', err);
      showSnackbar('Failed to load keepers', 'error');
    } finally {
      setLoadingKeepers(false);
    }
  };
  
  const fetchArchivedItems = async () => {
    try {
      setLoadingArchive(true);
      const data = await getArchivedItems();
      setArchivedItems(data);
    } catch (err) {
      console.error('Error fetching archived items:', err);
      showSnackbar('Failed to load archived items', 'error');
    } finally {
      setLoadingArchive(false);
    }
  };
  
  const fetchLoginHistory = async () => {
    try {
      setLoadingLoginHistory(true);
      const data = await getLoginHistory();
      setLoginHistory(data);
    } catch (err) {
      console.error('Error fetching login history:', err);
      showSnackbar('Failed to load login history', 'error');
    } finally {
      setLoadingLoginHistory(false);
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
      const updatedItem = await toggleFavorite(id);
      
      // This will be called from both the All News and Keepers tabs
      if (tabValue === 2) {
        // If we're in the Keepers tab and it's no longer a favorite or admin keeper, remove it
        if (!updatedItem.isFavorite && !updatedItem.isAdminKeeper) {
          setKeeperItems(prevItems => prevItems.filter(item => item._id !== id));
        } else {
          // Otherwise update it
          setKeeperItems(prevItems => 
            prevItems.map(item => 
              item._id === id ? { ...item, isFavorite: updatedItem.isFavorite } : item
            )
          );
        }
      } else {
        // If we're in the All News tab, update the item's favorite status
        setAllNewsItems(prevItems => 
          prevItems.map(item => 
            item._id === id ? { ...item, isFavorite: updatedItem.isFavorite } : item
          )
        );
      }
      showSnackbar('User keeper status updated', 'success');
    } catch (err) {
      console.error('Error toggling keeper status:', err);
      showSnackbar('Failed to update keeper status', 'error');
    }
  };
  
  const handleToggleAdminKeeper = async (id: string) => {
    try {
      const updatedItem = await toggleAdminKeeper(id);
      
      // This will be called from both the All News and Keepers tabs
      if (tabValue === 2) {
        // If we're in the Keepers tab and it's no longer a favorite or admin keeper, remove it
        if (!updatedItem.isFavorite && !updatedItem.isAdminKeeper) {
          setKeeperItems(prevItems => prevItems.filter(item => item._id !== id));
        } else {
          // Otherwise update it
          setKeeperItems(prevItems => 
            prevItems.map(item => 
              item._id === id ? { ...item, isAdminKeeper: updatedItem.isAdminKeeper } : item
            )
          );
        }
      } else {
        // If we're in the All News tab, update the item's admin keeper status
        setAllNewsItems(prevItems => 
          prevItems.map(item => 
            item._id === id ? { ...item, isAdminKeeper: updatedItem.isAdminKeeper } : item
          )
        );
      }
      showSnackbar('Admin keeper status updated', 'success');
    } catch (err) {
      console.error('Error toggling admin keeper status:', err);
      showSnackbar('Failed to update admin keeper status', 'error');
    }
  };
  
  const handleArchive = async (id: string) => {
    try {
      const updatedItem = await archiveItem(id);
      
      // Remove the item from the current list
      if (tabValue === 1) {
        setAllNewsItems(prevItems => prevItems.filter(item => 
          (item._id || item.id) !== id
        ));
      } else if (tabValue === 2) {
        setKeeperItems(prevItems => prevItems.filter(item => 
          (item._id || item.id) !== id
        ));
      }
      
      // Add the item to the archived items list if we're on the archive tab
      if (tabValue === 3) {
        setArchivedItems(prevItems => [...prevItems, updatedItem]);
      }
      
      showSnackbar('Item archived successfully', 'success');
    } catch (err) {
      console.error('Error archiving item:', err);
      showSnackbar('Failed to archive item', 'error');
    }
  };
  
  const handleUnarchive = async (id: string) => {
    try {
      const updatedItem = await unarchiveItem(id);
      
      // Remove the item from the archive list
      if (tabValue === 3) {
        setArchivedItems(prevItems => prevItems.filter(item => 
          (item._id || item.id) !== id
        ));
      }
      
      // Add the item back to the appropriate list if we're on that tab
      if (tabValue === 1) {
        setAllNewsItems(prevItems => [...prevItems, updatedItem]);
      } else if (tabValue === 2 && (updatedItem.isFavorite || updatedItem.isAdminKeeper)) {
        setKeeperItems(prevItems => [...prevItems, updatedItem]);
      }
      
      showSnackbar('Item unarchived successfully', 'success');
    } catch (err) {
      console.error('Error unarchiving item:', err);
      showSnackbar('Failed to unarchive item', 'error');
    }
  };
  
  const handleMarkRead = async (id: string) => {
    try {
      const updatedItem = await markAsRead(id);
      
      // Update the item in the current list
      if (tabValue === 1) {
        setAllNewsItems(prevItems => 
          prevItems.map(item => 
            item._id === id ? { ...item, isRead: true } : item
          )
        );
      } else if (tabValue === 2) {
        setKeeperItems(prevItems => 
          prevItems.map(item => 
            item._id === id ? { ...item, isRead: true } : item
          )
        );
      }
      
      showSnackbar('Item marked as read', 'success');
    } catch (err) {
      console.error('Error marking item as read:', err);
      showSnackbar('Failed to mark item as read', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  // Pagination handlers for login history
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          <Tab icon={<ArchiveIcon />} label="Archive" />
          <Tab icon={<PeopleIcon />} label="Login History" />
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
              onToggleAdminKeeper={handleToggleAdminKeeper}
              onArchive={handleArchive}
              onMarkRead={handleMarkRead}
              onItemUpdated={fetchAllNewsItems}
              showAdminControls={true}
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
              onToggleAdminKeeper={handleToggleAdminKeeper}
              onArchive={handleArchive}
              onMarkRead={handleMarkRead}
              onItemUpdated={fetchKeepers}
              showAdminControls={true}
              emptyMessage="No keepers yet. Star items from the News page to add them here."
            />
          </Box>
        </TabPanel>
        
        {/* Archive Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Archive
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Browse and manage archived news items. You can unarchive items or add them to keepers.
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <NewsList 
              items={archivedItems} 
              loading={loadingArchive} 
              onToggleFavorite={handleToggleFavorite}
              onToggleAdminKeeper={handleToggleAdminKeeper}
              onUnarchive={handleUnarchive}
              onMarkRead={handleMarkRead}
              onItemUpdated={fetchArchivedItems}
              showAdminControls={true}
              emptyMessage="No archived items available."
            />
          </Box>
        </TabPanel>
        
        {/* Login History Tab */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Login History
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Track when users log in to the system. This helps monitor usage patterns and security.
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {loadingLoginHistory ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table sx={{ minWidth: 650 }} aria-label="login history table">
                    <TableHead>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Login Time</TableCell>
                        <TableCell>IP Address</TableCell>
                        <TableCell>Browser/Device</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loginHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No login history available.
                          </TableCell>
                        </TableRow>
                      ) : (
                        loginHistory
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((entry, index) => (
                            <TableRow key={`${entry.userId}-${index}`} hover>
                              <TableCell>{entry.userName}</TableCell>
                              <TableCell>{entry.userEmail}</TableCell>
                              <TableCell>{entry.isAdmin ? 'Admin' : 'User'}</TableCell>
                              <TableCell>
                                {new Date(entry.timestamp).toLocaleString()}
                              </TableCell>
                              <TableCell>{entry.ipAddress || 'Unknown'}</TableCell>
                              <TableCell>
                                {entry.userAgent ? (
                                  <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                                    {entry.userAgent}
                                  </Typography>
                                ) : (
                                  'Unknown'
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={loginHistory.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}
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