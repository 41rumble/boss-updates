import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  IconButton, 
  Link, 
  Box, 
  Chip, 
  Divider,
  Paper,
  Tooltip,
  Badge
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { NewsItem as NewsItemType } from '../types';
import { styled } from '@mui/system';
import VideoThumbnail from './VideoThumbnail';
import { isVideoUrl } from '../utils/videoUtils';
import { useAuth } from '../context/AuthContext';
import EditNewsItemModal from './EditNewsItemModal';
import { markAsRead } from '../services/api';

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
  onToggleFavorite?: (id: string) => void;
  onToggleAdminKeeper?: (id: string) => void;
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onMarkRead?: (id: string) => void;
  onItemUpdated?: () => void;
  showAdminControls?: boolean;
}

const NewsItem: React.FC<NewsItemProps> = ({ 
  item, 
  onToggleFavorite, 
  onToggleAdminKeeper,
  onArchive,
  onUnarchive,
  onMarkRead,
  onItemUpdated,
  showAdminControls = false
}) => {
  const { user } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isReadLocally, setIsReadLocally] = useState(item.isRead || false);
  
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Use _id if available, otherwise fall back to id
  const itemId = item._id || item.id || '';
  
  // Mark as read when the component is viewed
  useEffect(() => {
    const markItemAsRead = async () => {
      if (!isReadLocally && !item.isRead) {
        try {
          await markAsRead(itemId);
          setIsReadLocally(true);
          if (onMarkRead) {
            onMarkRead(itemId);
          }
        } catch (err) {
          console.error('Error marking item as read:', err);
        }
      }
    };
    
    // Only auto-mark as read if the user is not an admin
    if (!user?.isAdmin) {
      markItemAsRead();
    }
  }, [itemId, isReadLocally, item.isRead, user?.isAdmin, onMarkRead]);
  
  const handleEditSuccess = () => {
    if (onItemUpdated) {
      onItemUpdated();
    }
  };
  
  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(itemId);
    }
  };
  
  const handleToggleAdminKeeper = () => {
    if (onToggleAdminKeeper) {
      onToggleAdminKeeper(itemId);
    }
  };
  
  const handleArchive = () => {
    if (onArchive) {
      onArchive(itemId);
    }
  };
  
  const handleUnarchive = () => {
    if (onUnarchive) {
      onUnarchive(itemId);
    }
  };
  
  const handleManualMarkRead = () => {
    if (onMarkRead) {
      onMarkRead(itemId);
      setIsReadLocally(true);
    }
  };
  
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
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* User Keeper (Star) Button */}
          {onToggleFavorite && (
            <Tooltip title={item.isFavorite ? "Remove from your keepers" : "Add to your keepers"}>
              <IconButton 
                onClick={handleToggleFavorite}
                color={item.isFavorite ? "secondary" : "default"}
                aria-label={item.isFavorite ? "Remove from keepers" : "Add to keepers"}
                sx={{ 
                  mr: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(139, 0, 0, 0.04)'
                  }
                }}
              >
                {item.isFavorite ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </Tooltip>
          )}
          
          {/* Admin Keeper (Bookmark) Button - only visible to admins or when showing admin controls */}
          {(user?.isAdmin || showAdminControls) && onToggleAdminKeeper && (
            <Tooltip title={item.isAdminKeeper ? "Remove from admin keepers" : "Add to admin keepers"}>
              <IconButton 
                onClick={handleToggleAdminKeeper}
                color={item.isAdminKeeper ? "primary" : "default"}
                aria-label={item.isAdminKeeper ? "Remove from admin keepers" : "Add to admin keepers"}
                sx={{ 
                  mr: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)'
                  }
                }}
              >
                {item.isAdminKeeper ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </Tooltip>
          )}
          
          {/* Status indicators */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            {item.isFavorite && (
              <Chip 
                size="small" 
                label="Your Keeper" 
                color="secondary" 
                variant="outlined" 
                icon={<StarIcon fontSize="small" />}
                sx={{ mr: 1, height: 24 }}
              />
            )}
            
            {item.isAdminKeeper && (
              <Chip 
                size="small" 
                label="Admin Keeper" 
                color="primary" 
                variant="outlined" 
                icon={<BookmarkIcon fontSize="small" />}
                sx={{ mr: 1, height: 24 }}
              />
            )}
            
            {(isReadLocally || item.isRead) && (
              <Chip 
                size="small" 
                label="Read" 
                color="default" 
                variant="outlined" 
                icon={<VisibilityIcon fontSize="small" />}
                sx={{ height: 24 }}
              />
            )}
          </Box>
          
          {/* Admin Controls - only visible to admins */}
          {user?.isAdmin && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              {/* Edit Button */}
              <Tooltip title="Edit news item">
                <IconButton
                  onClick={() => setEditModalOpen(true)}
                  color="primary"
                  aria-label="Edit news item"
                  size="small"
                  sx={{ 
                    mr: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              {/* Archive/Unarchive Button */}
              {item.isArchived ? (
                onUnarchive && (
                  <Tooltip title="Unarchive item">
                    <IconButton
                      onClick={handleUnarchive}
                      color="default"
                      aria-label="Unarchive item"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <UnarchiveIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )
              ) : (
                onArchive && (
                  <Tooltip title="Archive item">
                    <IconButton
                      onClick={handleArchive}
                      color="default"
                      aria-label="Archive item"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <ArchiveIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )
              )}
              
              {/* Mark as Read Button */}
              {onMarkRead && !isReadLocally && !item.isRead && (
                <Tooltip title="Mark as read">
                  <IconButton
                    onClick={handleManualMarkRead}
                    color="default"
                    aria-label="Mark as read"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
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
      
      {/* Edit Modal */}
      <EditNewsItemModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={item}
        onSuccess={handleEditSuccess}
      />
    </NewspaperCard>
  );
};

export default NewsItem;