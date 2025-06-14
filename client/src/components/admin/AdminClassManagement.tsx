import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
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
  RadioGroup,
  Radio,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '../../services/api';
import { useAppSelector } from '../../hooks/useAppSelector';
import { SelectChangeEvent } from '@mui/material/Select';

interface Instructor {
  _id: string;
  name: string;
  email: string;
}

interface ClassItem {
  _id: string;
  title: string;
  description: string;
  instructor: string | Instructor;  // Can be either string ID or full instructor object
  type: 'live' | 'recorded';
  level: string;
  duration: number;
  price: number;
  date: string;
  style: string;
  capacity: number;
  location: {
    type: 'online' | 'in-person';
    address?: string;
    meetingLink?: string;
  };
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

const yogaTypes = [
  'hatha',
  'vinyasa',
  'ashtanga',
  'yin',
  'power',
  'restorative',
];

const AdminClassManagement: React.FC = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClass, setCurrentClass] = useState<Partial<ClassItem>>({
    title: '',
    description: '',
    instructor: '',
    type: 'live',
    level: '',
    duration: 0,
    price: 0,
    date: '',
    style: '',
    capacity: 0,
    location: {
      type: 'online',
      address: '',
      meetingLink: '',
    },
    status: 'scheduled',
  });

  useEffect(() => {
    fetchClasses();
  }, [token]);

  const fetchClasses = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await api.get('/classes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Received classes data:', response.data.data);
      const validatedClasses = response.data.data.map((classItem: any) => {
        console.log('Processing class item:', classItem);
        if (!classItem.date) {
          console.warn('Class item missing date:', classItem);
          return {
            ...classItem,
            date: new Date().toISOString()
          };
        }
        return classItem;
      });
      setClasses(validatedClasses);
    } catch (error: any) {
      setSnackbarSeverity('error');
      setSnackbarMessage(error.response?.data?.message || 'Failed to fetch classes');
      setSnackbarOpen(true);
      console.error('Error fetching classes:', error);
    }
    setLoading(false);
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentClass({
      title: '',
      description: '',
      instructor: '',
      type: 'live',
      level: '',
      duration: 0,
      price: 0,
      date: '',
      style: '',
      capacity: 0,
      location: {
        type: 'online',
        address: '',
        meetingLink: '',
      },
      status: 'scheduled',
    });
    setOpenDialog(true);
  };

  const handleEditClick = (classItem: ClassItem) => {
    setIsEditing(true);
    const validStatuses: ClassItem['status'][] = ['scheduled', 'ongoing', 'completed', 'cancelled'];
    const sanitizedStatus = validStatuses.includes(classItem.status) ? classItem.status : 'scheduled';

    setCurrentClass({
      ...classItem,
      status: sanitizedStatus,
      date: classItem.date || '',
    });
    setOpenDialog(true);
  };

  const handleDeleteClick = async (classId: string) => {
    if (!token) return;
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await api.delete(`/classes/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSnackbarSeverity('success');
        setSnackbarMessage('Class deleted successfully!');
        setSnackbarOpen(true);
        fetchClasses();
      } catch (error: any) {
        setSnackbarSeverity('error');
        setSnackbarMessage(error.response?.data?.message || 'Failed to delete class');
        setSnackbarOpen(true);
        console.error('Error deleting class:', error);
      }
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | number | number[]>,
    child?: React.ReactNode
  ) => {
    const { name, value } = e.target;
    let parsedValue: any = value;

    if ((e.target as HTMLInputElement).type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    }

    if (name.startsWith('location.')) {
      const locationFieldName = name.split('.')[1];
      setCurrentClass((prev) => ({
        ...prev,
        location: {
          ...prev.location!,
          [locationFieldName]: parsedValue,
        },
      }));
    } else {
      setCurrentClass((prev) => ({
        ...prev,
        [name as string]: parsedValue,
      }));
    }
  };

  const handleSaveClass = async () => {
    if (!token || !user) return;
    try {
      if (!currentClass.date || !currentClass.location) {
        setSnackbarSeverity('error');
        setSnackbarMessage('Date and Location details are missing.');
        setSnackbarOpen(true);
        return;
      }

      const classDate = new Date(currentClass.date);

      if (isNaN(classDate.getTime())) {
        setSnackbarSeverity('error');
        setSnackbarMessage('Invalid Date and Time provided.');
        setSnackbarOpen(true);
        return;
      }

      const formattedClassData = {
        title: currentClass.title,
        description: currentClass.description,
        instructor: user._id,
        type: currentClass.type,
        style: currentClass.style,
        level: currentClass.level,
        duration: Number(currentClass.duration),
        price: Number(currentClass.price),
        capacity: Number(currentClass.capacity),
        date: classDate,
        location: {
          type: currentClass.location.type,
          address: currentClass.location.type === 'in-person' ? currentClass.location.address : undefined,
          meetingLink: currentClass.location.type === 'online' ? currentClass.location.meetingLink : undefined,
        },
        status: currentClass.status,
      };

      console.log('Sending formattedClassData:', formattedClassData);

      if (isEditing && currentClass._id) {
        await api.put(`/classes/${currentClass._id}`, formattedClassData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSnackbarSeverity('success');
        setSnackbarMessage('Class updated successfully!');
      } else {
        await api.post('/classes', formattedClassData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSnackbarSeverity('success');
        setSnackbarMessage('Class added successfully!');
      }
      setSnackbarOpen(true);
      handleDialogClose();
      fetchClasses();
    } catch (error: any) {
      setSnackbarSeverity('error');
      setSnackbarMessage(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} class`);
      setSnackbarOpen(true);
      console.error(`Error ${isEditing ? 'updating' : 'adding'} class:`, error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" gutterBottom>Class Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
          Add New Class
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : classes.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Instructor</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((classItem) => {
                if (!classItem) {
                  console.warn('Undefined class item encountered');
                  return null;
                }
                
                let formattedDate = 'N/A';
                try {
                  if (classItem.date) {
                    formattedDate = new Date(classItem.date).toLocaleString();
                  }
                } catch (error) {
                  console.error('Error formatting date:', error);
                }

                let instructorName = 'N/A';
                if (classItem.instructor) {
                  if (typeof classItem.instructor === 'string') {
                    instructorName = classItem.instructor;
                  } else {
                    const instructorObj = classItem.instructor as { name?: string };
                    instructorName = instructorObj.name || 'N/A';
                  }
                }

                return (
                  <TableRow key={classItem._id}>
                    <TableCell>{classItem.title || 'N/A'}</TableCell>
                    <TableCell>{instructorName}</TableCell>
                    <TableCell>{classItem.level || 'N/A'}</TableCell>
                    <TableCell>{classItem.duration || 'N/A'}</TableCell>
                    <TableCell>₹{classItem.price || 'N/A'}</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEditClick(classItem)}><EditIcon /></IconButton>
                      <IconButton size="small" onClick={() => handleDeleteClick(classItem._id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary">No classes found. Click "Add New Class" to create one.</Typography>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? 'Edit Class' : 'Add New Class'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Class Title"
            type="text"
            fullWidth
            value={currentClass.title}
            onChange={handleFormChange}
            required
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={currentClass.description}
            onChange={handleFormChange}
            required
          />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="style-label">Yoga Style</InputLabel>
            <Select
              labelId="style-label"
              name="style"
              value={currentClass.style || ''}
              onChange={handleFormChange}
              label="Yoga Style"
            >
              {yogaTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Level</InputLabel>
            <Select
              name="level"
              value={currentClass.level || ''}
              onChange={handleFormChange}
              label="Level"
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="duration"
            label="Duration (e.g., 60 min)"
            type="number"
            fullWidth
            value={currentClass.duration}
            onChange={handleFormChange}
            required
          />
          <TextField
            margin="dense"
            name="price"
            label="Price (INR)"
            type="number"
            fullWidth
            value={currentClass.price}
            onChange={handleFormChange}
            required
          />
          <TextField
            margin="dense"
            name="capacity"
            label="Capacity"
            type="number"
            fullWidth
            value={currentClass.capacity}
            onChange={handleFormChange}
            required
          />
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Date and Time</Typography>
          <TextField
            label="Date and Time"
            type="datetime-local"
            name="date"
            value={currentClass.date || ''}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Location</Typography>
          <FormControl component="fieldset" margin="normal">
            <RadioGroup
              row
              name="location.type"
              value={currentClass.location?.type || 'online'}
              onChange={handleFormChange}
            >
              <FormControlLabel value="online" control={<Radio />} label="Online" />
              <FormControlLabel value="in-person" control={<Radio />} label="In-Person" />
            </RadioGroup>
          </FormControl>
          {currentClass.location?.type === 'in-person' && (
            <TextField
              label="Address"
              name="location.address"
              value={currentClass.location?.address || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
          )}
          {currentClass.location?.type === 'online' && (
            <TextField
              label="Meeting Link"
              name="location.meetingLink"
              value={currentClass.location?.meetingLink || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={currentClass.status || 'scheduled'}
              label="Status"
              onChange={handleFormChange}
            >
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="ongoing">Ongoing</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveClass} variant="contained" color="primary">
            {isEditing ? 'Save Changes' : 'Add Class'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminClassManagement; 