import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import NewsPage from './pages/NewsPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminPage from './pages/AdminPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';

// Create a newspaper-style theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#121212', // Dark newspaper ink color
      light: '#3a3a3a',
      dark: '#000000',
    },
    secondary: {
      main: '#8B0000', // Deep red for accents
      light: '#bc4747',
      dark: '#5c0000',
    },
    background: {
      default: '#f8f5f1', // Slightly off-white like newspaper
      paper: '#ffffff',
    },
    text: {
      primary: '#121212',
      secondary: '#5a5a5a',
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Times New Roman", serif',
    h1: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Lora", "Georgia", serif',
    },
    body2: {
      fontFamily: '"Lora", "Georgia", serif',
    },
    button: {
      fontFamily: '"Lora", "Georgia", serif',
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '10px 24px',
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show nothing while checking authentication
  if (loading) {
    return null;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/news" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<NewsPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
