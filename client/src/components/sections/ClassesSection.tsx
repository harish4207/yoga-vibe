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
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { ScrollReveal, HoverScale } from '../animations';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api'; // Import the API service

interface ClassItem {
  _id: string;
  title: string;
  description: string;
  image?: string; // Optional, as it might not be directly from server yet
  level: string;
  duration: number; // Changed from string to number to match backend
  style: string; // Changed from category to style to match backend
  date: string; // To match the backend date field
  price: number; // To match the backend price field
  instructor: string; // Will display name, but can be ID
  type: 'live' | 'recorded';
  location: {
    type: 'online' | 'in-person';
    address?: string;
    meetingLink?: string;
  };
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

const ClassesSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get('/classes');
        // Filter for classes with status 'scheduled' or 'ongoing' to show only relevant classes to users
        const activeClasses = response.data.data.filter((cls: ClassItem) => cls.status === 'scheduled' || cls.status === 'ongoing');
        setClasses(activeClasses);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching classes:', err);
        setError('Failed to load classes. Please try again later.');
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const categories = ['All', ...Array.from(new Set(classes.map(cls => cls.style)))]; // Dynamically get categories from fetched classes

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  const filteredClasses = selectedCategory === 'All'
    ? classes
    : classes.filter((class_) => class_.style === selectedCategory);

  return (
    <Box
      id="classes"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <ScrollReveal>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#2D3748',
              mb: 6,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Our Yoga Classes
          </Typography>
        </ScrollReveal>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}><CircularProgress /></Box>
        ) : error ? (
          <Typography color="error" align="center">{error}</Typography>
        ) : classes.length === 0 ? (
          <Typography align="center" color="text.secondary">No classes available at the moment.</Typography>
        ) : (
          <>
            <Box sx={{ mb: 6 }}>
              <ScrollReveal direction="up" delay={0.3}>
                <Tabs
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  variant={isMobile ? 'scrollable' : 'fullWidth'}
                  scrollButtons={isMobile ? 'auto' : false}
                  sx={{
                    '& .MuiTabs-indicator': {
                      bgcolor: '#F6E05E',
                    },
                    '& .MuiTab-root': {
                      color: '#4A5568',
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 500,
                      '&.Mui-selected': {
                        color: '#F6E05E',
                      },
                    },
                  }}
                >
                  {categories.map((category) => (
                    <Tab key={category} label={category} value={category} />
                  ))}
                </Tabs>
              </ScrollReveal>
            </Box>

            <Grid container spacing={4}>
              {filteredClasses.map((classItem) => (
                <Grid item xs={12} sm={6} md={4} key={classItem._id}>
                  <ScrollReveal direction="up" delay={0.1 * (classes.indexOf(classItem) + 1)}>
                    <HoverScale>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          background: 'rgba(255, 255, 255, 0.7)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={classItem.image || '/default-yoga.jpg'} // Use a default image if none provided
                          alt={classItem.title}
                          sx={{
                            objectFit: 'cover',
                            height: '200px',
                            width: '100%',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            },
                          }}
                        />
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                          <Typography
                            variant="h5"
                            component="h3"
                            gutterBottom
                            sx={{
                              fontWeight: 600,
                              color: '#2D3748',
                              fontFamily: '"Playfair Display", serif',
                            }}
                          >
                            {classItem.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {classItem.description}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mt: 'auto',
                            }}
                          >
                            <Typography variant="body2" color="primary">
                              {classItem.duration} min • {classItem.level} • {new Date(classItem.date).toLocaleString()} 
                            </Typography>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                bgcolor: '#F6E05E',
                                color: '#1A202C',
                                '&:hover': {
                                  bgcolor: '#C0A14F',
                                },
                                borderRadius: '20px',
                                textTransform: 'none',
                                px: 2,
                              }}
                              onClick={() => navigate(`/classes/${classItem._id}`)} // Navigate to individual class detail page
                            >
                              Book Now
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </HoverScale>
                  </ScrollReveal>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default ClassesSection; 