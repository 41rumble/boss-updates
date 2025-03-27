import React from 'react';
import { 
  Typography, 
  IconButton, 
  Link, 
  Box, 
  Chip, 
  Divider,
  Paper
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { NewsItem as NewsItemType } from '../types';
import { styled } from '@mui/system';
import VideoThumbnail from './VideoThumbnail';
import { isVideoUrl } from '../utils/videoUtils';

// Styled components for newspaper look
const NewspaperCard = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: 0,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(0,0,0,0.08)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '5px',
    background: 'linear-gradient(90deg, #8B0000, #121212)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 1,
  },
}));

const NewsHeadline = styled(Typography)(({ theme }) => ({
  fontFamily: '"Playfair Display", "Times New Roman", serif',
  fontWeight: 700,
  lineHeight: 1.3,
})) as typeof Typography;

const DateChip = styled(Chip)(({ theme }) => ({
  fontFamily: '"Lora", "Georgia", serif',
  fontStyle: 'italic',
  backgroundColor: 'rgba(0,0,0,0.05)',
  borderRadius: 0,
  height: 24,
}));

const NewsSummary = styled(Typography)(({ theme }) => ({
  fontFamily: '"Lora", "Georgia", serif',
  fontSize: '1rem',
  lineHeight: 1.6,
  color: theme.palette.text.secondary,
}));

interface NewsItemProps {
  item: NewsItemType;
  onToggleFavorite: (id: string) => void;
}

const NewsItem: React.FC<NewsItemProps> = ({ item, onToggleFavorite }) => {
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Use _id if available, otherwise fall back to id
  const itemId = item._id || item.id || '';
  
  return (
    <NewspaperCard elevation={0}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <NewsHeadline variant="h5" component="h2">
          {item.title}
        </NewsHeadline>
        <DateChip 
          label={formattedDate} 
          size="small" 
          sx={{ ml: 1, fontSize: '0.7rem' }} 
        />
      </Box>
      
      <NewsSummary paragraph>
        {item.summary}
      </NewsSummary>
      
      {/* Display video thumbnail if the link is a video URL */}
      {item.link && isVideoUrl(item.link) && (
        <VideoThumbnail url={item.link} title={item.title} />
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <IconButton 
            onClick={() => onToggleFavorite(itemId)}
            color={item.isFavorite ? "secondary" : "default"}
            aria-label={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
            sx={{ 
              mr: 1,
              '&:hover': {
                backgroundColor: 'rgba(139, 0, 0, 0.04)'
              }
            }}
          >
            {item.isFavorite ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            {item.isFavorite ? 'Saved to favorites' : 'Add to favorites'}
          </Typography>
        </Box>
        
        <Link 
          href={item.link} 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            color: 'secondary.main',
            fontFamily: '"Lora", "Georgia", serif',
            fontWeight: 500,
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          <Typography variant="button" sx={{ mr: 0.5 }}>
            {isVideoUrl(item.link || '') ? 'Watch Video' : 'Read Full Article'}
          </Typography>
          <OpenInNewIcon fontSize="small" />
        </Link>
      </Box>
    </NewspaperCard>
  );
};

export default NewsItem;