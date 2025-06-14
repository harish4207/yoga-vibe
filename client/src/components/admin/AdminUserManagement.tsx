import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAppSelector } from '../../hooks/useAppSelector'; // Adjust the import path based on your file structure
import { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent

interface Subscription {
  plan: string;
  status: string;
  // add other fields if needed
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  subscription?: Subscription | null; // <-- Make sure this line is correct
  createdAt: string; // Assuming creation date is the join date
}

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'success' });

  const { token } = useAppSelector(state => state.auth); // Access token from Redux state

  useEffect(() => {
    fetchUsers();
  }, [token]); // Refetch users if token changes

  const fetchUsers = async () => {
    if (!token) {
      setError('Authentication token not available.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.response?.data?.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({});
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({});
    setError(null); // Clear dialog errors
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    // The target for SelectChangeEvent is different, ensure correct access
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
     if (!token) {
      setError('Authentication token not available.');
      return;
    }

    try {
      if (editingUser) {
        await axios.put(`/api/auth/users/${editingUser._id}`, formData, {
           headers: {
            Authorization: `Bearer ${token}`,
          },
        });
         setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
      } else {
         // TODO: Implement create user functionality if needed
         setSnackbar({ open: true, message: 'Creating users not yet implemented', severity: 'info' });
      }
      fetchUsers(); // Refresh list
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving user:', error);
       setError(error.response?.data?.message || 'Failed to save user');
       setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to save user', severity: 'error' });
    }
  };

  const handleDelete = async (userId: string) => {
     if (!token) {
      setSnackbar({ open: true, message: 'Authentication token not available.', severity: 'error' });
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/auth/users/${userId}`, {
           headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
        fetchUsers(); // Refresh list
      } catch (error: any) {
        console.error('Error deleting user:', error);
        setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to delete user', severity: 'error' });
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">User Accounts</Typography>
        {/* <Button variant="contained" onClick={() => handleOpenDialog()}> {/* Add New User button */}
          {/* Add New User */}
        {/* </Button> */}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Subscription</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.subscription && typeof user.subscription === 'object'
                      ? `${user.subscription.plan} (${user.subscription.status})`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
           {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            margin="normal"
          />
           <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            margin="normal"
            disabled={!!editingUser} // Prevent changing email for existing users
          />
           <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              name="role"
              value={formData.role || 'user'}
              onChange={handleInputChange}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          {/* TODO: Add fields for subscription management if needed */}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

       {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminUserManagement; 