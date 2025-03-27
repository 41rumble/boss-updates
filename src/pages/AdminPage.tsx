import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const AdminPage = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [link, setLink] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      console.log('Submitted:', { title, summary, link, date: new Date().toISOString() });
      setTitle('');
      setSummary('');
      setLink('');
      setSnackbarOpen(true);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Update
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            name="summary"
            label="Summary"
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="link"
            label="Source Link"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!title || !summary || !link || isSubmitting}
            endIcon={<SendIcon />}
          >
            {isSubmitting ? 'Submitting...' : 'Add Update'}
          </Button>
        </Box>
      </Paper>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Update added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPage;