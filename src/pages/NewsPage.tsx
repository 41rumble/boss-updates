import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NewsList from '../components/NewsList';
import { NewsItem } from '../types';

// In a real app, this would come from an API
const mockNewsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Quarterly Report Summary',
    summary: 'Our Q1 results exceeded expectations with a 15% increase in revenue compared to last year.',
    link: 'https://example.com/report',
    date: '2023-04-15',
    isFavorite: false
  },
  {
    id: '2',
    title: 'New Client Acquisition',
    summary: 'We have successfully onboarded XYZ Corp as a new client with an estimated annual contract value of $500K.',
    link: 'https://example.com/client',
    date: '2023-04-10',
    isFavorite: true
  },
  {
    id: '3',
    title: 'Product Launch Update',
    summary: 'The new product launch is scheduled for May 15th. Marketing materials are ready for review.',
    link: 'https://example.com/product',
    date: '2023-04-05',
    isFavorite: false
  }
];

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNewsItems(mockNewsItems);
      setLoading(false);
    }, 1000);
  }, []);

  const handleToggleFavorite = (id: string) => {
    setNewsItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const filteredItems = newsItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Latest Updates
      </Typography>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search updates..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <NewsList 
        items={filteredItems} 
        loading={loading} 
        onToggleFavorite={handleToggleFavorite} 
      />
    </Box>
  );
};

export default NewsPage;