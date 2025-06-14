import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
} from '@mui/material';
import { AccessTime as AccessTimeIcon, LocationOn as LocationOnIcon, EventNote as EventNoteIcon } from '@mui/icons-material';
import { useAppSelector } from '../hooks/useAppSelector';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { YogaClass, Instructor } from '../types/index';
import { classes as classService } from '../services/api';
import { toast } from 'react-toastify';

const ClassesPage: React.FC = () => {
  const { token } = useAppSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!token) {
        setError('Authentication token is missing. Please log in.');
        setLoading(false);
        return;
      }
      try {
        const response = await classService.getAllClasses(token);
        setClasses(response.data.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching classes:', err);
        setError(err.response?.data?.message || 'Failed to load classes.');
        setLoading(false);
      }
    };

    fetchClasses();
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error" align="center">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 700 }}>
        All Classes
      </Typography>
      {classes.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center">
          No classes available at the moment.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {classes.map((classItem: YogaClass) => (
            <Grid item xs={12} sm={6} md={4} key={classItem._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={classItem.image || '/default-yoga.jpg'} // Use a default image if none provided
                  alt={classItem.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {classItem.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {classItem.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip label={classItem.style} size="small" sx={{ mr: 1, bgcolor: '#EBF8FF', color: '#2B6CB0' }} />
                    <Chip label={classItem.level} size="small" sx={{ mr: 1, bgcolor: '#E6FFFA', color: '#38A169' }} />
                    <Chip label={`${classItem.duration} min`} size="small" sx={{ bgcolor: '#FEEBC8', color: '#DD6B20' }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <EventNoteIcon sx={{ mr: 1, fontSize: 'small' }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(classItem.date).toLocaleDateString()} at {new Date(classItem.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <LocationOnIcon sx={{ mr: 1, fontSize: 'small' }} />
                    <Typography variant="body2" color="text.secondary">
                      {classItem.location?.type === 'online' ? 'Online Class' : 'In-Person'}
                    </Typography>
                  </Box>
                  {typeof classItem.instructor === 'object' && 'name' in classItem.instructor && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <AccessTimeIcon sx={{ mr: 1, fontSize: 'small' }} />
                      <Typography variant="body2" color="text.secondary">
                        Instructor: {(classItem.instructor as Instructor).name}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary.main">
                    ₹{classItem.price}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: '#F6E05E', color: '#1A202C', '&:hover': { bgcolor: '#C0A14F' } }}
                    onClick={() => navigate(`/classes/${classItem._id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ClassesPage; 