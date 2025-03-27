import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  useMediaQuery, 
  Container, 
  Divider, 
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import StarIcon from '@mui/icons-material/Star';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext';
import { styled } from '@mui/system';

const NewspaperTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Playfair Display", "Times New Roman", serif',
  fontWeight: 900,
  letterSpacing: '-0.05em',
  textTransform: 'uppercase',
}));

const CurrentDate = styled(Typography)(({ theme }) => ({
  fontFamily: '"Lora", "Georgia", serif',
  fontStyle: 'italic',
  color: theme.palette.text.secondary,
}));

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/');
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={0}
        sx={{ 
          borderBottom: '2px solid #000',
          backgroundColor: '#fff'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <NewspaperTitle variant="h3" align="center" sx={{ mb: 0.5 }}>
              Doug's News
            </NewspaperTitle>
            <CurrentDate variant="subtitle2" align="center">
              {currentDate}
            </CurrentDate>
          </Box>
        </Container>
        
        <Divider />
        
        <Toolbar component={Container} maxWidth="lg">
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Dashboard
              </Typography>
              <IconButton
                edge="end"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
              
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <Box
                  sx={{ width: 250 }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <List>
                    <ListItemButton component={RouterLink} to="/news">
                      <ListItemIcon>
                        <NewspaperIcon />
                      </ListItemIcon>
                      <ListItemText primary="Latest News" />
                    </ListItemButton>
                    <ListItemButton component={RouterLink} to="/news/favorites">
                      <ListItemIcon>
                        <StarIcon />
                      </ListItemIcon>
                      <ListItemText primary="Favorites" />
                    </ListItemButton>
                    <ListItemButton component={RouterLink} to="/news/admin">
                      <ListItemIcon>
                        <AdminPanelSettingsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Admin" />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/news"
                  startIcon={<NewspaperIcon />}
                  sx={{ fontWeight: 500 }}
                >
                  Latest News
                </Button>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/news/favorites"
                  startIcon={<StarIcon />}
                  sx={{ fontWeight: 500 }}
                >
                  Favorites
                </Button>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/news/admin"
                  startIcon={<AdminPanelSettingsIcon />}
                  sx={{ fontWeight: 500 }}
                >
                  Admin
                </Button>
              </Box>
              
              <Box sx={{ flexGrow: 1 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Welcome, {user?.name || 'User'}
                </Typography>
                <IconButton
                  edge="end"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
                    {user?.name?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;