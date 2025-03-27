import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import NewsItem from './NewsItem';
import { NewsItem as NewsItemType } from '../types';

interface NewsListProps {
  items: NewsItemType[];
  loading: boolean;
  onToggleFavorite: (id: string) => void;
  onItemUpdated?: () => void;
  emptyMessage?: string;
}

const NewsList: React.FC<NewsListProps> = ({ 
  items, 
  loading, 
  onToggleFavorite,
  onItemUpdated,
  emptyMessage = "No news items available."
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {items.map(item => (
        <NewsItem 
          key={item.id || item._id} 
          item={item} 
          onToggleFavorite={onToggleFavorite}
          onItemUpdated={onItemUpdated}
        />
      ))}
    </Box>
  );
};

export default NewsList;