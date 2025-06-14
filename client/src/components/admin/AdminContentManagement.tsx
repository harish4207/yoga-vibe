import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IContent } from '../../types';

const contentTypes = ['youtube', 'website', 'article', 'manual_video', 'pdf'];

const AdminContentManagement: React.FC = () => {
  const [content, setContent] = useState<IContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentContent, setCurrentContent] = useState<Partial<IContent> | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/content/content', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContent(response.data.data);
    } catch (err: any) {
      console.error('Error fetching content:', err);
      setError(err.response?.data?.error || 'Failed to fetch content.');
      toast.error(err.response?.data?.error || 'Failed to fetch content.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!currentContent?.title) errors.title = 'Title is required.';
    if (!currentContent?.contentType) errors.contentType = 'Content Type is required.';
    if (!currentContent?.url) errors.url = 'URL is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddClick = () => {
    setCurrentContent({ contentType: 'youtube' }); // Default to YouTube
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleEditClick = (item: IContent) => {
    setCurrentContent(item);
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/content/content/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Content deleted successfully!');
        fetchContent();
      } catch (err: any) {
        console.error('Error deleting content:', err);
        toast.error(err.response?.data?.error || 'Failed to delete content.');
      }
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentContent(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentContent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveContent = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token');
      if (currentContent?._id) {
        // Update existing content
        await axios.put(`/api/content/content/${currentContent._id}`, currentContent, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Content updated successfully!');
      } else {
        // Create new content
        await axios.post('/api/content/content', currentContent, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Content added successfully!');
      }
      handleDialogClose();
      fetchContent();
    } catch (err: any) {
      console.error('Error saving content:', err);
      toast.error(err.response?.data?.error || 'Failed to save content.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="h6" ml={2}>Loading Content...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error: {error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">Content Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add New Content
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Content Type</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No content available.
                </TableCell>
              </TableRow>
            ) : (
              content.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.contentType}</TableCell>
                  <TableCell>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                      {item.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditClick(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(item._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{currentContent?._id ? 'Edit Content' : 'Add New Content'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={currentContent?.title || ''}
            onChange={handleFormChange}
            error={!!formErrors.title}
            helperText={formErrors.title}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description (Optional)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={currentContent?.description || ''}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="contentType"
            label="Content Type"
            select
            fullWidth
            variant="outlined"
            value={currentContent?.contentType || ''}
            onChange={handleFormChange}
            error={!!formErrors.contentType}
            helperText={formErrors.contentType}
            sx={{ mb: 2 }}
          >
            {contentTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            name="url"
            label="URL / Link"
            type="text"
            fullWidth
            variant="outlined"
            value={currentContent?.url || ''}
            onChange={handleFormChange}
            error={!!formErrors.url}
            helperText={formErrors.url}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveContent} variant="contained" color="primary">
            {currentContent?._id ? 'Save Changes' : 'Add Content'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminContentManagement; 