import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
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
  MenuItem,
  alpha
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useAuth } from '../context/AuthContext';
import { styled, keyframes } from '@mui/system';
import { motion } from 'framer-motion';

// Enhanced animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -300% 0;
  }
  100% {
    background-position: 300% 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(2deg);
  }
  50% {
    transform: translateY(-10px) rotate(1deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;

const gradientMove = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Styled components with enhanced effects
const GlassBox = styled(Box)(({ theme }) => ({
  backdropFilter: 'blur(10px)',
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.1)}`,
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.3)}, transparent)`,
  },
}));

const AnimatedBox = styled(motion.div)(({ theme }) => ({
  animation: `${fadeIn} 1.2s ease-out`,
}));

const PremiumButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 600,
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
    backgroundSize: '300% 100%',
    animation: `${shimmer} 3s infinite linear`,
    pointerEvents: 'none',
    zIndex: 1,
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 10px 25px -5px ${alpha(theme.palette.primary.main, 0.5)}`,
  },
})) as typeof Button;

const NewspaperTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Playfair Display", "Times New Roman", serif',
  fontWeight: 900,
  letterSpacing: '-0.05em',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #6a11cb 100%)`,
  backgroundSize: '200% 200%',
  animation: `${gradientMove} 5s ease infinite`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textTransform: 'uppercase',
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '2px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, #6a11cb, ${theme.palette.primary.main})`,
    backgroundSize: '200% 100%',
    animation: `${shimmer} 3s infinite linear`,
  },
}));

const NewspaperDate = styled(Typography)(({ theme }) => ({
  fontFamily: '"Lora", "Georgia", serif',
  fontStyle: 'italic',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  borderRadius: '16px',
  overflow: 'hidden',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
  '&:hover': {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: `
      0 20px 40px ${alpha(theme.palette.common.black, 0.2)},
      0 0 20px ${alpha(theme.palette.primary.main, 0.3)}
    `,
    '& .card-image': {
      transform: 'scale(1.1)',
    },
    '& .card-overlay': {
      opacity: 0.3,
    },
  },
}));

const CardImageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '& img': {
    transition: 'transform 0.7s cubic-bezier(0.33, 1, 0.68, 1)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 100%)',
    opacity: 0.5,
    transition: 'opacity 0.5s ease',
  },
}));

const HeroImage = styled(Box)(({ theme }) => ({
  position: 'relative',
  animation: `${float} 6s ease-in-out infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '5%',
    left: '5%',
    right: '5%',
    bottom: '5%',
    borderRadius: '2px',
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(theme.palette.secondary.light, 0.2)})`,
    filter: 'blur(20px)',
    zIndex: -1,
  },
}));

// Sample news data
const featuredNews = [
  {
    id: 1,
    title: 'Streamlined Communication',
    summary: 'Keep Doug informed with regular updates in a clean, organized format.',
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
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

    // Add these testimonials to your testimonial section

    const testimonials = [
        {
            id: 1,
            quote: "Doug's News has transformed how I receive updates. The clean interface and organized format make it easy to stay informed about what matters most.",
            name: "Doug Peterson",
            title: "CEO, Peterson Enterprises",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
        },
        {
            id: 2,
            quote: "As someone who needs to stay on top of critical information, Doug's News has been a game-changer. The elegant design and intuitive organization save me hours each week. It's like having a personal news curator!",
            name: "Douglas Fairbanks",
            title: "Managing Director, Fairbanks Investments",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
        },
        {
            id: 3,
            quote: "I've tried countless ways to stay updated, but nothing compares to Doug's News. The premium experience and thoughtful design make reviewing important information a pleasure rather than a chore. Simply brilliant!",
            name: "Doug Williams",
            title: "VP of Operations, Williams Global",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
        }
    ];


    // Handle parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);

      if (heroRef.current) {
        const yValue = scrollPosition * 0.3;
        heroRef.current.style.transform = `translateY(${yValue}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        {/* Header */}
        <AppBar
            position="fixed"
            color="transparent"
            elevation={0}
            sx={{
              backdropFilter: scrolled ? 'blur(10px)' : 'none',
              backgroundColor: scrolled ? alpha(theme.palette.background.paper, 0.8) : 'transparent',
              borderBottom: scrolled ? `1px solid ${alpha(theme.palette.common.white, 0.2)}` : 'none',
              transition: 'all 0.3s ease',
              boxShadow: scrolled ? `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}` : 'none',
            }}
        >
          <Toolbar>
            <Typography
                variant="h6"
                component="div"
                sx={{
                  flexGrow: 1,
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  background: scrolled ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #6a11cb 100%)` : 'none',
                  backgroundClip: scrolled ? 'text' : 'none',
                  WebkitBackgroundClip: scrolled ? 'text' : 'none',
                  WebkitTextFillColor: scrolled ? 'transparent' : 'inherit',
                  transition: 'all 0.3s ease',
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
                      sx={{
                        background: alpha(theme.palette.background.paper, 0.1),
                        backdropFilter: 'blur(5px)',
                        '&:hover': {
                          background: alpha(theme.palette.background.paper, 0.2),
                        }
                      }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      PaperProps={{
                        sx: {
                          backdropFilter: 'blur(10px)',
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                          border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                          borderRadius: '12px',
                          boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.2)}`,
                          mt: 1.5,
                          '& .MuiMenuItem-root': {
                            transition: 'background 0.2s ease',
                            '&:hover': {
                              background: alpha(theme.palette.primary.main, 0.1),
                            }
                          }
                        }
                      }}
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
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '2px',
                          background: theme.palette.primary.main,
                          transform: 'scaleX(0)',
                          transformOrigin: 'right',
                          transition: 'transform 0.3s ease',
                        },
                        '&:hover::after': {
                          transform: 'scaleX(1)',
                          transformOrigin: 'left',
                        }
                      }}
                  >
                    Features
                  </Button>
                  <Button
                      color="inherit"
                      component="a"
                      href="#about"
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '2px',
                          background: theme.palette.primary.main,
                          transform: 'scaleX(0)',
                          transformOrigin: 'right',
                          transition: 'transform 0.3s ease',
                        },
                        '&:hover::after': {
                          transform: 'scaleX(1)',
                          transformOrigin: 'left',
                        }
                      }}
                  >
                    About
                  </Button>
                  <PremiumButton
                      variant="contained"
                      color="primary"
                      component={RouterLink}
                      to={isAuthenticated ? "/news" : "/login"}
                      endIcon={<KeyboardArrowRightIcon />}
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #6a11cb 100%)`,
                        boxShadow: `0 10px 20px -5px ${alpha(theme.palette.primary.main, 0.4)}`,
                      }}
                  >
                    {isAuthenticated ? "Dashboard" : "Login"}
                  </PremiumButton>
                </Box>
            )}
          </Toolbar>
        </AppBar>
        <Toolbar /> {/* Spacer for fixed AppBar */}

        {/* Hero Section */}
        <Box
            sx={{
              py: { xs: 8, md: 14 },
              background: `linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at 20% 30%, ${alpha(theme.palette.primary.light, 0.15)} 0%, transparent 50%)`,
                zIndex: 0,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at 80% 70%, ${alpha(theme.palette.secondary.light, 0.15)} 0%, transparent 50%)`,
                zIndex: 0,
              }
            }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6, alignItems: 'center' }}>
                <Box sx={{ flex: 1, width: '100%' }}>
                  <motion.div variants={itemVariants}>
                    <NewspaperTitle variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.8rem' } }}>
                      DOUG'S NEWS
                    </NewspaperTitle>
                    <NewspaperDate variant="subtitle1">
                      {currentDate}
                    </NewspaperDate>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Typography
                        variant="h3"
                        component="h2"
                        gutterBottom
                        sx={{
                          mb: 3,
                          fontWeight: 'bold',
                          fontSize: { xs: '1.75rem', md: '2.5rem' },
                          background: `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${alpha(theme.palette.text.primary, 0.8)} 100%)`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                    >
                      Your Premium News Dashboard for Elegant Communication
                    </Typography>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Typography
                        variant="body1"
                        paragraph
                        sx={{
                          mb: 4,
                          fontSize: { xs: '1rem', md: '1.2rem' },
                          maxWidth: '90%',
                          lineHeight: 1.8,
                          color: alpha(theme.palette.text.primary, 0.85),
                        }}
                    >
                      Keep Doug informed with sophisticated updates in a refined, professional format.
                      Doug's News delivers a premium experience for sharing important information, links,
                      and updates in a beautifully designed newspaper-style interface.
                    </Typography>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <PremiumButton
                          variant="contained"
                          size="large"
                          component={RouterLink}
                          to={isAuthenticated ? "/news" : "/login"}
                          endIcon={<KeyboardArrowRightIcon />}
                          sx={{
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #6a11cb 100%)`,
                            boxShadow: `0 10px 20px -5px ${alpha(theme.palette.primary.main, 0.4)}`,
                            fontSize: '1.1rem',
                            py: 1.5,
                            px: 4,
                          }}
                      >
                        {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                      </PremiumButton>
                      <Button
                          variant="outlined"
                          size="large"
                          component="a"
                          href="#features"
                          sx={{
                            borderWidth: '2px',
                            borderColor: alpha(theme.palette.primary.main, 0.5),
                            color: theme.palette.primary.main,
                            fontSize: '1.1rem',
                            py: 1.5,
                            px: 4,
                            '&:hover': {
                              borderWidth: '2px',
                              borderColor: theme.palette.primary.main,
                              background: alpha(theme.palette.primary.main, 0.05),
                            }
                          }}
                      >
                        Explore Features
                      </Button>
                    </Box>
                  </motion.div>
                </Box>

                <Box sx={{ flex: 1, width: '100%' }} ref={heroRef}>
                  <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <HeroImage>
                      <Box
                          component="img"
                          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                          alt="Newspaper"
                          sx={{
                            width: '100%',
                            maxWidth: 550,
                            height: 'auto',
                            borderRadius: '16px',
                            boxShadow: `
                          0 30px 60px ${alpha(theme.palette.common.black, 0.25)},
                          0 0 30px ${alpha(theme.palette.primary.main, 0.2)}
                        `,
                            transform: 'rotate(2deg)',
                            transition: 'all 0.5s ease',
                            '&:hover': {
                              boxShadow: `
                            0 40px 80px ${alpha(theme.palette.common.black, 0.3)},
                            0 0 40px ${alpha(theme.palette.primary.main, 0.3)}
                          `,
                            }
                          }}
                      />
                    </HeroImage>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          </Container>
        </Box>

        {/* Features Section */}
        <Box
            id="features"
            sx={{
              py: { xs: 8, md: 14 },
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`,
              }
            }}
        >
          <Container maxWidth="lg">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
            >
              <Typography
                  variant="h2"
                  component="h2"
                  align="center"
                  gutterBottom
                  sx={{
                    mb: 2,
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${alpha(theme.palette.text.primary, 0.7)} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
              >
                Premium Features
              </Typography>

              <Typography
                  variant="h6"
                  align="center"
                  color="text.secondary"
                  sx={{
                    mb: 8,
                    maxWidth: '700px',
                    mx: 'auto',
                    lineHeight: 1.8,
                  }}
              >
                Experience a suite of sophisticated tools designed to elevate your communication
              </Typography>
            </motion.div>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {featuredNews.map((item, index) => (
                  <Box key={item.id} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' } }}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                      <FeatureCard>
                        <CardImageWrapper>
                          <CardMedia
                              component="img"
                              height="220"
                              image={item.image}
                              alt={item.title}
                              className="card-image"
                              sx={{
                                objectFit: 'cover',
                              }}
                          />
                          <Box
                              className="card-overlay"
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(to bottom, transparent 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
                                opacity: 0,
                                transition: 'opacity 0.5s ease',
                                zIndex: 1,
                              }}
                          />
                        </CardImageWrapper>
                        <CardContent sx={{
                          flexGrow: 1,
                          p: 3,
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '10%',
                            right: '10%',
                            height: '1px',
                            background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`,
                          }
                        }}>
                          <Typography
                              variant="h5"
                              component="h3"
                              gutterBottom
                              sx={{
                                fontWeight: 700,
                                mb: 2,
                                background: `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${alpha(theme.palette.text.primary, 0.8)} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{ lineHeight: 1.7 }}
                          >
                            {item.summary}
                          </Typography>
                        </CardContent>
                      </FeatureCard>
                    </motion.div>
                  </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* About Section */}
        <Box
            id="about"
            sx={{
              py: { xs: 8, md: 14 },
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`,
              }
            }}
        >
          <Container maxWidth="md">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
            >
              <Typography
                  variant="h2"
                  component="h2"
                  align="center"
                  gutterBottom
                  sx={{
                    mb: 2,
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${alpha(theme.palette.text.primary, 0.7)} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
              >
                About Doug's News
              </Typography>

              <Typography
                  variant="h6"
                  align="center"
                  color="text.secondary"
                  sx={{
                    mb: 8,
                    maxWidth: '700px',
                    mx: 'auto',
                    lineHeight: 1.8,
                  }}
              >
                Crafted with precision to deliver an exceptional communication experience
              </Typography>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
            >
              <GlassBox
                  sx={{
                    p: 5,
                    borderRadius: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
              >
                <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `radial-gradient(circle at 30% 30%, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 70%)`,
                      zIndex: 0,
                    }}
                />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography
                      variant="body1"
                      paragraph
                      sx={{
                        fontSize: '1.1rem',
                        lineHeight: 1.8,
                        mb: 3,
                      }}
                  >
                    Doug's News was created to solve the common challenge of keeping Doug informed with regular updates in a clean, organized format.
                  </Typography>

                  <Typography
                      variant="body1"
                      paragraph
                      sx={{
                        fontSize: '1.1rem',
                        lineHeight: 1.8,
                        mb: 3,
                      }}
                  >
                    Our newspaper-style interface provides a familiar and professional way to present information, making it easy for Doug to quickly scan and understand key updates.
                  </Typography>

                  <Typography
                      variant="body1"
                      paragraph
                      sx={{
                        fontSize: '1.1rem',
                        lineHeight: 1.8,
                        mb: 3,
                      }}
                  >
                    With features like favoriting important items, a clean mobile interface, and a simple admin panel, Doug's News streamlines your communication workflow.
                  </Typography>

                  <Divider
                      sx={{
                        my: 4,
                        opacity: 0.6,
                        background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.5)}, transparent)`,
                        height: '2px',
                        border: 'none',
                      }}
                  />

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          mb: 3,
                        }}
                    >
                      Ready to elevate your communication?
                    </Typography>

                    <PremiumButton
                        variant="contained"
                        size="large"
                        component={RouterLink}
                        to={isAuthenticated ? "/news" : "/login"}
                        endIcon={<KeyboardArrowRightIcon />}
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #6a11cb 100%)`,
                          boxShadow: `0 10px 20px -5px ${alpha(theme.palette.primary.main, 0.4)}`,
                          fontSize: '1.1rem',
                          py: 1.5,
                          px: 4,
                          mt: 2,
                        }}
                    >
                      {isAuthenticated ? "Go to Dashboard" : "Login Now"}
                    </PremiumButton>
                  </Box>
                </Box>
              </GlassBox>
            </motion.div>
          </Container>
        </Box>

          {/* Testimonial Section */}
          <Box
              sx={{
                  py: { xs: 8, md: 14 },
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
              }}
          >
              <Container maxWidth="lg">
                  <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8 }}
                  >
                      <Typography
                          variant="h2"
                          component="h2"
                          align="center"
                          gutterBottom
                          sx={{
                              mb: 2,
                              fontWeight: 800,
                              background: `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${alpha(theme.palette.text.primary, 0.7)} 100%)`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                          }}
                      >
                          What Dougs Are Saying
                      </Typography>

                      <Typography
                          variant="h6"
                          align="center"
                          color="text.secondary"
                          sx={{
                              mb: 8,
                              maxWidth: '700px',
                              mx: 'auto',
                              lineHeight: 1.8,
                          }}
                      >
                          Join the community of satisfied Dougs who've elevated their information experience
                      </Typography>
                  </motion.div>

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'stretch' }}>
                      {testimonials.map((testimonial, index) => (
                          <motion.div
                              key={testimonial.id}
                              initial={{ opacity: 0, scale: 0.95, y: 20 }}
                              whileInView={{ opacity: 1, scale: 1, y: 0 }}
                              viewport={{ once: true, margin: "-100px" }}
                              transition={{ duration: 0.7, delay: index * 0.2 }}
                              style={{ flex: 1 }}
                          >
                              <GlassBox
                                  sx={{
                                      p: 4,
                                      borderRadius: '24px',
                                      textAlign: 'center',
                                      height: '100%',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      position: 'relative',
                                      overflow: 'hidden',
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                          transform: 'translateY(-10px)',
                                          boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.15)}, 0 0 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                                      }
                                  }}
                              >
                                  <Box
                                      sx={{
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          right: 0,
                                          bottom: 0,
                                          background: `radial-gradient(circle at 50% 30%, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 70%)`,
                                          zIndex: 0,
                                      }}
                                  />

                                  <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                      <Typography
                                          variant="h1"
                                          component="div"
                                          sx={{
                                              fontSize: '3rem',
                                              color: alpha(theme.palette.primary.main, 0.2),
                                              mb: 2,
                                          }}
                                      >
                                          "
                                      </Typography>

                                      <Typography
                                          variant="body1"
                                          paragraph
                                          sx={{
                                              fontStyle: 'italic',
                                              fontWeight: 500,
                                              mb: 4,
                                              lineHeight: 1.8,
                                              flex: 1,
                                          }}
                                      >
                                          {testimonial.quote}
                                      </Typography>

                                      <Box sx={{ mt: 'auto' }}>
                                          <Box
                                              component="img"
                                              src={testimonial.image}
                                              alt={testimonial.name}
                                              sx={{
                                                  width: 70,
                                                  height: 70,
                                                  borderRadius: '50%',
                                                  objectFit: 'cover',
                                                  mb: 2,
                                                  border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                                  transition: 'all 0.3s ease',
                                                  '&:hover': {
                                                      transform: 'scale(1.05)',
                                                      border: `3px solid ${alpha(theme.palette.primary.main, 0.6)}`,
                                                      boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                                  }
                                              }}
                                          />

                                          <Typography
                                              variant="h6"
                                              component="div"
                                              sx={{
                                                  fontWeight: 700,
                                              }}
                                          >
                                              {testimonial.name}
                                          </Typography>

                                          <Typography
                                              variant="body2"
                                              color="text.secondary"
                                          >
                                              {testimonial.title}
                                          </Typography>
                                      </Box>
                                  </Box>
                              </GlassBox>
                          </motion.div>
                      ))}
                  </Box>
              </Container>
          </Box>


          {/* CTA Section */}
        <Box
            sx={{
              py: { xs: 8, md: 12 },
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, #6a11cb 100%)`,
              position: 'relative',
              overflow: 'hidden',
            }}
        >
          <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                background: 'url(https://www.transparenttextures.com/patterns/cubes.png)',
                zIndex: 0,
              }}
          />

          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
            >
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                <Typography
                    variant="h2"
                    component="h2"
                    gutterBottom
                    sx={{
                      mb: 3,
                      fontWeight: 800,
                      textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    }}
                >
                  Ready to Transform Your Communication?
                </Typography>

                <Typography
                    variant="h6"
                    paragraph
                    sx={{
                      mb: 6,
                      maxWidth: '700px',
                      mx: 'auto',
                      opacity: 0.9,
                      lineHeight: 1.8,
                    }}
                >
                  Join Doug and experience the premium way to stay informed. Start your journey with Doug's News today.
                </Typography>

                <PremiumButton
                    variant="contained"
                    size="large"
                    component={RouterLink}
                    to={isAuthenticated ? "/news" : "/login"}
                    endIcon={<KeyboardArrowRightIcon />}
                    sx={{
                      background: 'white',
                      color: theme.palette.primary.main,
                      boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                      fontSize: '1.2rem',
                      py: 2,
                      px: 5,
                      '&:hover': {
                        background: 'white',
                        transform: 'translateY(-5px)',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                      },
                      '&::before': {
                        background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(103,58,183,0.3) 50%, rgba(255,255,255,0) 100%)',
                      }
                    }}
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
                </PremiumButton>
              </Box>
            </motion.div>
          </Container>
        </Box>

        {/* Footer */}
        <Box
            component="footer"
            sx={{
              py: 5,
              mt: 'auto',
              background: theme.palette.background.paper,
              borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 700,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #6a11cb 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                >
                  Doug's News
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your premium news dashboard for elegant communication.
                </Typography>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                <Typography variant="body2" color="text.secondary">
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