import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Snackbar,
  Alert,
  List,
  ListItemIcon,
  ListItemText,
  ListItem,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  BarChart as BarChartIcon,
  People as PeopleIcon,
  Class as ClassIcon,
  Payment as PaymentIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Dashboard as DashboardIcon,
  MenuBook as ContentIcon,
  CardMembership as CardMembershipIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/useAppSelector';
import axios from 'axios';
import SubscriptionPlans from '../components/admin/SubscriptionPlans';
import AdminUserManagement from '../components/admin/AdminUserManagement';
import AdminProgressTracking from '../components/admin/AdminProgressTracking';
import AdminClassManagement from '../components/admin/AdminClassManagement';
import AdminPaymentHistory from '../components/admin/AdminPaymentHistory';
import AdminMessages from './admin/AdminMessages';
import AdminContentManagement from '../components/admin/AdminContentManagement';

// Mock data - replace with actual API calls
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', joinDate: '2024-03-01' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', joinDate: '2024-03-05' },
];

const mockClasses = [
  { id: 1, name: 'Morning Yoga', instructor: 'Sarah J.', students: 15, schedule: 'Mon, Wed, Fri 9:00 AM' },
  { id: 2, name: 'Evening Flow', instructor: 'Mike R.', students: 12, schedule: 'Tue, Thu 6:00 PM' },
];

// Define content types based on backend enum
const contentTypes = ['youtube', 'zoom', 'article', 'custom_video', 'meditation_audio'];
const yogaLevels = ['beginner', 'intermediate', 'advanced'];

interface User {
  name?: string;
  yogaLevel?: string | null | undefined;
}

const AdminDashboard: React.FC = () => {
  const { user, token } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [openAddContentDialog, setOpenAddContentDialog] = useState(false);
  const [newContentFormData, setNewContentFormData] = useState<{
    title: string;
    description: string;
    type: string;
    url: string;
    tags: string;
    duration: string;
    scheduledTime: string;
    yogaLevel: string | null;
    isPublished: boolean;
    thumbnail: string;
  }>({
    title: '',
    description: '',
    type: '',
    url: '',
    tags: '',
    duration: '',
    scheduledTime: '',
    yogaLevel: null,
    isPublished: true,
    thumbnail: '',
  });
  const [contentList, setContentList] = useState([]); // State to hold content list
  const [loadingContent, setLoadingContent] = useState(false); // Loading state for content
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

  // New state for popular content
  const [popularContent, setPopularContent] = useState<any[]>([]);
  const [loadingPopularContent, setLoadingPopularContent] = useState(false);
  const [popularContentError, setPopularContentError] = useState<string | null>(null);

  // Fetch content when the tab changes to 'classes'
  useEffect(() => {
    if (activeTab === 'content') { // Changed from 'classes' to 'content' as 'content' seems to be the current content management tab
      fetchContent();
    } else if (activeTab === 'dashboard') { // Fetch popular content when dashboard is active
      fetchPopularContent();
    }
  }, [activeTab, token]); // Add token dependency

  const fetchContent = async () => {
    if (!token) return; // Ensure token exists

    setLoadingContent(true);
    try {
      const response = await axios.get('/api/content', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContentList(response.data.data);
      setLoadingContent(false);
    } catch (error: any) {
      setLoadingContent(false);
      setSnackbarSeverity('error');
      setSnackbarMessage(error.response?.data?.message || 'Failed to fetch content');
      setSnackbarOpen(true);
      console.error('Error fetching content:', error);
    }
  };

  // New function to fetch popular content
  const fetchPopularContent = async () => {
    if (!token) {
      setPopularContentError('Authentication token not available.');
      setLoadingPopularContent(false);
      return;
    }

    setLoadingPopularContent(true);
    setPopularContentError(null);
    try {
      const response = await axios.get('/api/interactions/analytics/popular-content', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPopularContent(response.data.data);
      setLoadingPopularContent(false);
    } catch (error: any) {
      console.error('Error fetching popular content:', error);
      setPopularContentError(error.response?.data?.message || 'Failed to fetch popular content');
      setLoadingPopularContent(false);
    }
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleDelete = (id: number) => {
    // Implement delete functionality
    console.log('Delete item:', id);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleSave = () => {
    // Implement save functionality
    console.log('Save changes:', selectedItem);
    handleCloseDialog();
  };

  const handleOpenAddContentDialog = () => {
    setOpenAddContentDialog(true);
  };

  const handleCloseAddContentDialog = () => {
    setOpenAddContentDialog(false);
    setNewContentFormData({
      title: '',
      description: '',
      type: '',
      url: '',
      tags: '',
      duration: '',
      scheduledTime: '',
      yogaLevel: null,
      isPublished: true,
      thumbnail: '',
    });
  };

  const handleNewContentFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const target = e.target as HTMLInputElement;
    if (target.name === 'yogaLevel' && target.value === '') {
      setNewContentFormData((prev) => ({
        ...prev,
        [target.name]: null,
      }));
    } else {
      setNewContentFormData((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewContentFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleSaveNewContent = async () => {
    if (!token) return; // Ensure token exists

    try {
      // Prepare data (e.g., split tags string into array)
      const dataToSave = {
        ...newContentFormData,
        tags: newContentFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        duration: newContentFormData.duration ? Number(newContentFormData.duration) : undefined,
        // Handle scheduledTime format if needed
        // Handle thumbnail file upload later
      };

      await axios.post('/api/content', dataToSave, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSnackbarSeverity('success');
      setSnackbarMessage('Content added successfully!');
      setSnackbarOpen(true);

      handleCloseAddContentDialog();
      fetchContent(); // Refresh the content list
    } catch (error: any) {
      setSnackbarSeverity('error');
      setSnackbarMessage(error.response?.data?.message || 'Failed to add content');
      setSnackbarOpen(true);
      console.error('Error adding content:', error);
    }
  };

   const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Analytics Dashboard</Typography>
             <Grid container spacing={3}>
               {/* User Growth Section */}
               <Grid item xs={12} sm={6} md={4}>
                 <Card>
                   <CardContent>
                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                       <PeopleIcon color="primary" sx={{ mr: 1 }} />
                       <Typography variant="h6">Total Users</Typography>
                     </Box>
                     <Typography variant="h4">{/* TODO: Fetch actual total users */}150</Typography>
                     {/* TODO: Add trend data or charts */}
                   </CardContent>
                 </Card>
               </Grid>

               {/* Content Engagement Section */}
               <Grid item xs={12} sm={6} md={4}>
                 <Card>
                   <CardContent>
                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                       <BarChartIcon color="secondary" sx={{ mr: 1 }} />
                       <Typography variant="h6">Total Sessions Completed</Typography>
                     </Box>
                     <Typography variant="h4">{/* TODO: Fetch actual sessions completed */}500</Typography>
                     {/* TODO: Add trend data or charts */}
                   </CardContent>
                 </Card>
               </Grid>

               {/* Most Popular Content Section */}
               <Grid item xs={12} sm={6} md={4}>
                 <Card>
                   <CardContent>
                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                       <ContentIcon color="info" sx={{ mr: 1 }} />
                       <Typography variant="h6">Most Popular Content (by Bookmarks)</Typography>
                     </Box>
                     {loadingPopularContent ? (
                       <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>
                     ) : popularContentError ? (
                       <Typography variant="body2" color="error">{popularContentError}</Typography>
                     ) : popularContent.length > 0 ? (
                       <List dense>
                         {popularContent.map((item, index) => (
                           <ListItem key={index} disablePadding>
                             <ListItemText
                               primary={
                                 <Typography variant="body2">
                                   <strong>{item.contentDetails.title}</strong>
                                 </Typography>
                               }
                               secondary={`Bookmarks: ${item.bookmarkCount}`}
                             />
                           </ListItem>
                         ))}
                       </List>
                     ) : (
                       <Typography variant="body2" color="text.secondary">No popular content data available.</Typography>
                     )}
                   </CardContent>
                 </Card>
               </Grid>

                {/* Goal Completion Summary (Ties to Progress Tracking) */}
               <Grid item xs={12} sm={6} md={4}>
                 <Card>
                   <CardContent>
                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                       <BarChartIcon color="success" sx={{ mr: 1 }} />
                       <Typography variant="h6">Goal Completion Rate</Typography>
                     </Box>
                     {/* TODO: Calculate and display actual goal completion rate */}
                     <Typography variant="h4">{/* Placeholder */}
                        75%
                     </Typography>
                      <Typography variant="body2" color="text.secondary">{/* TODO: Display number of completed goals */}150 Completed Goals</Typography>
                   </CardContent>
                 </Card>
               </Grid>

               {/* Placeholder for other analytics sections */}
               {/* E.g., Subscription Metrics, Live Class Attendance, etc. */}

             </Grid>
          </Paper>
        );
      case 'classes':
        return <AdminClassManagement />;
      case 'users':
        return <AdminUserManagement />;
      case 'subscriptions':
        return <SubscriptionPlans />;
      case 'progress':
        return <AdminProgressTracking />;
      case 'payments':
        return <AdminPaymentHistory />;
      case 'messages':
        return <AdminMessages />;
      case 'content':
        return <AdminContentManagement />;
      default:
        return <Typography>Select a section from the sidebar</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <List component="nav">
          <ListItem button onClick={() => setActiveTab('dashboard')}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
           <ListItem button onClick={() => setActiveTab('classes')}>
            <ListItemIcon>
              <ContentIcon />
            </ListItemIcon>
            <ListItemText primary="Class Management" />
          </ListItem>
          <ListItem button onClick={() => setActiveTab('users')}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="User Accounts" />
          </ListItem>
          <ListItem button onClick={() => setActiveTab('subscriptions')}>
            <ListItemIcon>
              <CardMembershipIcon />
            </ListItemIcon>
            <ListItemText primary="Subscription Plans" />
          </ListItem>
           <ListItem button onClick={() => setActiveTab('progress')}>
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Progress Tracking" />
          </ListItem>
          <ListItem button onClick={() => setActiveTab('payments')}>
            <ListItemIcon>
              <PaymentIcon />
            </ListItemIcon>
            <ListItemText primary="Payment History" />
          </ListItem>
          <ListItem button onClick={() => setActiveTab('messages')}>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText primary="Contact Messages" />
          </ListItem>
          <ListItem button onClick={() => setActiveTab('content')}>
            <ListItemIcon>
              <ContentIcon />
            </ListItemIcon>
            <ListItemText primary="Content Management" />
          </ListItem>
          {/* Add other sidebar items here */}
        </List>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        <Container maxWidth="lg">
          {renderContent()}
        </Container>
      </Box>

      {/* TODO: Implement Edit Dialog for Content */}

      {/* Add New Content Dialog */}
      <Dialog open={openAddContentDialog} onClose={handleCloseAddContentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Content</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={newContentFormData.title}
                onChange={handleNewContentFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={newContentFormData.description}
                onChange={handleNewContentFormChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
               <FormControl fullWidth required>
                 <InputLabel id="content-type-label">Type</InputLabel>
                 <Select
                   labelId="content-type-label"
                   id="content-type"
                   name="type"
                   value={newContentFormData.type}
                   label="Type"
                   onChange={handleNewContentFormChange}
                 >
                   {contentTypes.map((type) => (
                     <MenuItem key={type} value={type}>{type}</MenuItem>
                   ))}
                 </Select>
               </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Link/Embed URL"
                name="url"
                value={newContentFormData.url}
                onChange={handleNewContentFormChange}
                required
              />
            </Grid>
             <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                name="tags"
                value={newContentFormData.tags}
                onChange={handleNewContentFormChange}
                helperText="Enter tags separated by commas (e.g., Beginner, Flexibility)"
              />
            </Grid>
             <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                name="duration"
                type="number"
                value={newContentFormData.duration}
                onChange={handleNewContentFormChange}
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
               <FormControl fullWidth>
                 <InputLabel id="yoga-level-label">Yoga Level</InputLabel>
                 <Select
                   labelId="yoga-level-label"
                   id="yoga-level"
                   name="yogaLevel"
                   value={newContentFormData.yogaLevel || ''}
                   label="Yoga Level"
                   onChange={handleNewContentFormChange}
                 >
                   <MenuItem value=""><em>None</em></MenuItem>
                   {yogaLevels.map((level) => (
                     <MenuItem key={level} value={level}>{level}</MenuItem>
                   ))}
                 </Select>
               </FormControl>
            </Grid>
            {/* TODO: Implement Date/Time picker for scheduledTime */}
             <Grid item xs={12}>
              <TextField
                fullWidth
                label="Scheduled Time (YYYY-MM-DDTHH:mm)"
                name="scheduledTime"
                value={newContentFormData.scheduledTime}
                onChange={handleNewContentFormChange}
                helperText="Format: 2024-03-21T18:00 (for live sessions)"
              />
            </Grid>
             {/* TODO: Implement File Upload for thumbnail */}
             <Grid item xs={12}>
              <TextField
                fullWidth
                label="Thumbnail URL"
                name="thumbnail"
                value={newContentFormData.thumbnail}
                onChange={handleNewContentFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newContentFormData.isPublished}
                    onChange={handleCheckboxChange}
                    name="isPublished"
                  />
                }
                label="Published"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddContentDialog}>Cancel</Button>
          <Button onClick={handleSaveNewContent} variant="contained">Save Content</Button>
        </DialogActions>
      </Dialog>

       <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default AdminDashboard; 