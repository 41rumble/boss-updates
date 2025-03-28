import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Container,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  Tabs,
  Tab
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// Import icons individually in MUI v7
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Login from '@mui/icons-material/Login';
import PersonAdd from '@mui/icons-material/PersonAdd';
import { useAuth } from '../context/AuthContext';
import { styled, keyframes } from '@mui/system';

// Rename for clarity
const LoginIcon = Login;
const RegisterIcon = PersonAdd;

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
const AnimatedPaper = styled(Paper)(({ theme }) => ({
  animation: `${fadeIn} 0.8s ease-out`,
  padding: theme.spacing(4),
  borderRadius: theme.spacing(1),
  boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
  backdropFilter: 'blur(10px)',
  background: 'rgba(255,255,255,0.9)',
})) as typeof Paper;

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
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
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

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, register, error: authError } = useAuth();
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Shared state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Login form submitted:', { email: loginEmail, password: loginPassword });

    try {
      // Use the AuthContext login function which will try API first, then fallback to demo
      const success = await login(loginEmail, loginPassword);
      if (success) {
        navigate('/news');
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Registration is now admin-only and handled in the admin section

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #ffffff 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.03)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.03)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ py: 8, zIndex: 1 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBack />}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
            }}
          >
            Doug's News
          </Typography>
        </Box>

        <AnimatedPaper>
          <Tabs 
            value={0} 
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label="Sign In" 
              icon={<LoginIcon />} 
              iconPosition="start"
              sx={{ fontWeight: 500 }}
            />
            {/* Register tab removed - registration is now admin-only */}
          </Tabs>

          {/* Login Tab */}
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ pt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showLoginPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      edge="end"
                    >
                      {showLoginPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <ShimmerButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading || !loginEmail || !loginPassword}
              sx={{ py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </ShimmerButton>

            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
              <Box>
                <Link component={RouterLink} to="/" variant="body2">
                  Forgot password?
                </Link>
              </Box>
            </Box>
          </Box>

          {/* Register Tab removed - registration is now admin-only */}
        </AnimatedPaper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Doug's News. All rights reserved.
          </Typography>
        </Box>
      </Container>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error || !!authError}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error || authError}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
