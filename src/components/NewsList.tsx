import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import NewsItem from './NewsItem';
import { NewsItem as NewsItemType } from '../types';

interface NewsListProps {
  items: NewsItemType[];
  loading: boolean;
  onToggleFavorite?: (id: string) => void;
  onToggleAdminKeeper?: (id: string) => void;
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onMarkRead?: (id: string) => void;
  onRemoveFromLatest?: (id: string) => void;
  onAddToLatest?: (id: string) => void;
  onItemUpdated?: () => void;
  emptyMessage?: string;
  showAdminControls?: boolean;
}

const NewsList: React.FC<NewsListProps> = ({ 
  items, 
  loading, 
  onToggleFavorite,
  onToggleAdminKeeper,
  onArchive,
  onUnarchive,
  onMarkRead,
  onRemoveFromLatest,
  onAddToLatest,
  onItemUpdated,
  emptyMessage = "No news items available.",
  showAdminControls = false
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
          onToggleAdminKeeper={onToggleAdminKeeper}
          onArchive={onArchive}
          onUnarchive={onUnarchive}
          onMarkRead={onMarkRead}
          onRemoveFromLatest={onRemoveFromLatest}
          onAddToLatest={onAddToLatest}
          onItemUpdated={onItemUpdated}
          showAdminControls={showAdminControls}
        />
      ))}
    </Box>
  );
};

export default NewsList;