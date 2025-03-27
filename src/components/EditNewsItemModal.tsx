import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  CircularProgress,
  Alert
} from '@mui/material';
import { NewsItem } from '../types';
import { updateNewsItem } from '../services/api';

interface EditNewsItemModalProps {
  open: boolean;
  onClose: () => void;
  item: NewsItem | null;
  onSuccess: () => void;
}

const EditNewsItemModal: React.FC<EditNewsItemModalProps> = ({ 
  open, 
  onClose, 
  item, 
  onSuccess 
}) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when item changes
  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setSummary(item.summary);
      setLink(item.link);
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!item || !item._id) {
      setError('Invalid item data');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateNewsItem(item._id, { title, summary, link });
      setError(null);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error updating news item:', err);
      setError('Failed to update item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit News Item</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="edit-title"
            label="Title"
            name="title"
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
            id="edit-summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="link"
            label="Source Link"
            id="edit-link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            helperText="YouTube and Vimeo links will automatically display video thumbnails"
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!title || !summary || !link || isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditNewsItemModal;