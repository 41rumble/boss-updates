import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useAuth } from '../context/AuthContext';
import { styled, keyframes } from '@mui/system';

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Styled components
const AnimatedBox = styled(Box)(({ theme }) => ({
  animation: `${fadeIn} 1s ease-out`,
})) as typeof Box;

const ShimmerButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
    backgroundSize: '200% 100%',
    animation: `${shimmer} 2s infinite`,
    pointerEvents: 'none',
  },
})) as typeof Button;

const NewspaperTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Playfair Display", "Times New Roman", serif',
  fontWeight: 900,
  letterSpacing: '-0.05em',
  borderBottom: '2px solid #000',
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
  textTransform: 'uppercase',
})) as typeof Typography;

const NewspaperDate = styled(Typography)(({ theme }) => ({
  fontFamily: '"Lora", "Georgia", serif',
  fontStyle: 'italic',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
})) as typeof Typography;

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
  },
})) as typeof Card;

// Sample news data
const featuredNews = [
  {
    id: 1,
    title: 'Streamlined Communication',
    summary: 'Keep your boss informed with regular updates in a clean, organized format.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Save Important Information',
    summary: 'Star important items to easily reference them later when needed.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Mobile Optimized',
    summary: 'Access your updates anywhere, anytime with our responsive design.',
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
];

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700
            }}
          >
            Doug's News
          </Typography>
          
          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem 
                  component={RouterLink} 
                  to={isAuthenticated ? "/news" : "/login"}
                  onClick={handleMenuClose}
                >
                  {isAuthenticated ? "Dashboard" : "Login"}
                </MenuItem>
                <MenuItem 
                  component="a" 
                  href="#features"
                  onClick={handleMenuClose}
                >
                  Features
                </MenuItem>
                <MenuItem 
                  component="a" 
                  href="#about"
                  onClick={handleMenuClose}
                >
                  About
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                color="inherit" 
                component="a" 
                href="#features"
              >
                Features
              </Button>
              <Button 
                color="inherit" 
                component="a" 
                href="#about"
              >
                About
              </Button>
              <ShimmerButton 
                variant="contained" 
                color="primary"
                component={RouterLink}
                to={isAuthenticated ? "/news" : "/login"}
                endIcon={<KeyboardArrowRightIcon />}
              >
                {isAuthenticated ? "Dashboard" : "Login"}
              </ShimmerButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box 
        sx={{ 
          py: { xs: 6, md: 12 },
          background: 'linear-gradient(to bottom, #f8f5f1, #ffffff)',
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center' }}>
            <Box sx={{ flex: 1, width: '100%' }}>
              <AnimatedBox>
                <NewspaperTitle variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                  DOUG'S NEWS
                </NewspaperTitle>
                <NewspaperDate variant="subtitle1">
                  {currentDate}
                </NewspaperDate>
                <Typography 
                  variant="h3" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    mb: 3,
                    fontWeight: 'bold',
                    fontSize: { xs: '1.75rem', md: '2.25rem' }
                  }}
                >
                  Your Personal News Dashboard for Efficient Communication
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ 
                    mb: 4,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    maxWidth: '90%'
                  }}
                >
                  Keep your boss informed with regular updates in a clean, professional format. 
                  Doug's News provides a streamlined way to share important information, links, 
                  and updates in a newspaper-style interface.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <ShimmerButton 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    component={RouterLink}
                    to={isAuthenticated ? "/news" : "/login"}
                    endIcon={<KeyboardArrowRightIcon />}
                  >
                    {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                  </ShimmerButton>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="large"
                    component="a"
                    href="#features"
                  >
                    Learn More
                  </Button>
                </Box>
              </AnimatedBox>
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <AnimatedBox sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Newspaper"
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    transform: 'rotate(2deg)',
                  }}
                />
              </AnimatedBox>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ mb: 6 }}
          >
            Key Features
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {featuredNews.map((item) => (
              <Box key={item.id} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' } }}>
                <FeatureCard>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.summary}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* About Section */}
      <Box 
        id="about" 
        sx={{ 
          py: { xs: 6, md: 10 },
          backgroundColor: 'rgba(0,0,0,0.02)',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ mb: 4 }}
          >
            About Doug's News
          </Typography>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              backgroundColor: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2
            }}
          >
            <Typography variant="body1" paragraph>
              Doug's News was created to solve the common challenge of keeping your boss informed with regular updates in a clean, organized format.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Our newspaper-style interface provides a familiar and professional way to present information, making it easy for your boss to quickly scan and understand key updates.
            </Typography>
            
            <Typography variant="body1" paragraph>
              With features like favoriting important items, a clean mobile interface, and a simple admin panel, Doug's News streamlines your communication workflow.
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Ready to get started?
            </Typography>
            
            <ShimmerButton 
              variant="contained" 
              color="primary" 
              size="large"
              component={RouterLink}
              to={isAuthenticated ? "/news" : "/login"}
              endIcon={<KeyboardArrowRightIcon />}
              sx={{ mt: 2 }}
            >
              {isAuthenticated ? "Go to Dashboard" : "Login Now"}
            </ShimmerButton>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 4, 
          mt: 'auto',
          backgroundColor: theme.palette.primary.main,
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Doug's News
              </Typography>
              <Typography variant="body2">
                Your personal news dashboard for efficient communication.
              </Typography>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Typography variant="body2">
                © {new Date().getFullYear()} Doug's News. All rights reserved.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;