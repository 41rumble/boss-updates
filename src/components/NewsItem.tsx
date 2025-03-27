import React from 'react';
import { Card, CardContent, CardActions, Typography, IconButton, Link, Box, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { NewsItem as NewsItemType } from '../types';

interface NewsItemProps {
  item: NewsItemType;
  onToggleFavorite: (id: string) => void;
}

const NewsItem: React.FC<NewsItemProps> = ({ item, onToggleFavorite }) => {
  const formattedDate = new Date(item.date).toLocaleDateString();
  // Use _id if available, otherwise fall back to id
  const itemId = item._id || item.id || '';
  
  return (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="div" gutterBottom>
            {item.title}
          </Typography>
          <Chip 
            label={formattedDate} 
            size="small" 
            sx={{ ml: 1, fontSize: '0.7rem' }} 
          />
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {item.summary}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 1 }}>
        <IconButton 
          onClick={() => onToggleFavorite(itemId)}
          color={item.isFavorite ? "secondary" : "default"}
          aria-label={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {item.isFavorite ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
        <Link 
          href={item.link} 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <Typography variant="button" sx={{ mr: 0.5 }}>
            View Source
          </Typography>
          <OpenInNewIcon fontSize="small" />
        </Link>
      </CardActions>
    </Card>
  );
};

export default NewsItem;