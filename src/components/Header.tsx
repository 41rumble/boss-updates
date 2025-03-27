import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import StarIcon from '@mui/icons-material/Star';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Boss Updates
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            startIcon={!isMobile && <NewspaperIcon />}
          >
            {isMobile ? <NewspaperIcon /> : "News"}
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/favorites"
            startIcon={!isMobile && <StarIcon />}
          >
            {isMobile ? <StarIcon /> : "Favorites"}
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/admin"
            startIcon={!isMobile && <AdminPanelSettingsIcon />}
          >
            {isMobile ? <AdminPanelSettingsIcon /> : "Admin"}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;