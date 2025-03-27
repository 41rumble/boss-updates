import React, { useState } from 'react';
import { Box, Paper, IconButton, Modal, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import { getVideoThumbnailUrl, getVideoEmbedUrl } from '../utils/videoUtils';
import { styled } from '@mui/system';

interface VideoThumbnailProps {
  url: string;
  title?: string;
}

const ThumbnailContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
  borderRadius: theme.spacing(1),
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  // Add max-width for desktop screens to prevent thumbnails from dominating the space
  [theme.breakpoints.up('md')]: {
    maxWidth: '400px',
    margin: '16px auto',
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: '450px',
  },
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    transform: 'translate(-50%, -50%) scale(1.1)',
  },
}));

const VideoOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
}));

const VideoTitle = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  padding: theme.spacing(1, 2),
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: '#fff',
  fontWeight: 500,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
}));

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ url, title }) => {
  const [open, setOpen] = useState(false);
  
  const thumbnailUrl = getVideoThumbnailUrl(url);
  const embedUrl = getVideoEmbedUrl(url);
  
  if (!thumbnailUrl || !embedUrl) {
    return null;
  }
  
  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <>
      <ThumbnailContainer elevation={3} onClick={handleOpen}>
        <Box
          component="img"
          src={thumbnailUrl}
          alt={title || "Video thumbnail"}
          sx={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'cover',
            aspectRatio: '16/9',
          }}
        />
        <VideoOverlay />
        <PlayButton aria-label="play video">
          <PlayArrowIcon sx={{ fontSize: { xs: 60, md: 50 } }} />
        </PlayButton>
        {title && <VideoTitle variant="body2">{title}</VideoTitle>}
      </ThumbnailContainer>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="video-modal"
        aria-describedby="video-player"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
            maxWidth: '1000px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 1,
            borderRadius: 1,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
            <iframe
              src={embedUrl}
              title={title || "Video player"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
          
          {title && (
            <Typography variant="h6" sx={{ mt: 2, px: 1 }}>
              {title}
            </Typography>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default VideoThumbnail;