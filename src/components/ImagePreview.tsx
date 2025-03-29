import React, { useState } from 'react';
import { Box, Paper, Modal, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import { styled } from '@mui/system';

interface ImagePreviewProps {
  url: string;
  title?: string;
  id?: string;
}

const ImageContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
  borderRadius: theme.spacing(1),
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  // Add max-width for desktop screens to prevent images from dominating the space
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

const ExpandButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0)',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
}));

const ImageTitle = styled(Typography)(({ theme }) => ({
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

const ImagePreview: React.FC<ImagePreviewProps> = ({ url, title, id }) => {
  const [open, setOpen] = useState(false);
  
  if (!url) {
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
      <ImageContainer 
        elevation={3} 
        onClick={handleOpen} 
        id={id ? `image-preview-${id}` : undefined}
      >
        <Box
          component="img"
          src={url}
          alt={title || "Image"}
          sx={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'cover',
            aspectRatio: '16/9',
          }}
        />
        <ImageOverlay />
        <ExpandButton aria-label="expand image">
          <ZoomOutMapIcon />
        </ExpandButton>
        {title && <ImageTitle variant="body2">{title}</ImageTitle>}
      </ImageContainer>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="image-modal"
        aria-describedby="image-preview"
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
          
          <Box sx={{ width: '100%' }}>
            <Box
              component="img"
              src={url}
              alt={title || "Image"}
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block',
                maxHeight: '80vh',
                objectFit: 'contain',
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

export default ImagePreview;