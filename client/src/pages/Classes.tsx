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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { AccessTime, FitnessCenter, Group, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Assuming RootState is defined here
import { useNavigate } from 'react-router-dom';
import { YogaClass } from '../types'; // Import YogaClass interface
import { classes as classService } from '../services/api';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Classes = () => {
  console.log("Classes component rendered!");
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const theme = useTheme();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [classes, setClasses] = useState<YogaClass[]>([]); // Use YogaClass interface
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for errors

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await classService.getAll();
        if (response.success) {
          setClasses(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch classes');
        }
      } catch (err: any) {
        console.error("Failed to fetch classes:", err);
        setError(err.message);
        toast.error(err.message || 'Failed to fetch classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []); // Empty dependency array means this runs once on mount

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.error("Failed to load Razorpay SDK");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleBookNow = async (classId: string) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    const classToBook = classes.find(c => c._id === classId);
    if (!classToBook) {
        alert("Class not found.");
        return;
    }

    // Conditional navigation based on yoga type
    if (classToBook.style === 'general') {
      navigate('/plans'); // Navigate to the subscription plans section
      return;
    }

    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ classId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment order');
      }

      const { data: order } = await response.json();
      console.log('Razorpay Order received:', order);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Payment gateway failed to load. Please try again.");
        return;
      }

      console.log('Razorpay Key:', process.env.REACT_APP_RAZORPAY_KEY_ID);
      console.log('Order Details:', order);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID_HERE', // Replace with your actual public Key ID
        amount: order.amount, // Amount in paise/cents from backend
        currency: order.currency, // Currency from backend (e.g., INR)
        name: 'YogaVibe',
        description: `Enrollment for ${classToBook.title}`,
        order_id: order.orderId, // Razorpay Order ID from backend
        handler: function (response: any) {
          alert('Payment Successful! Payment ID: ' + response.razorpay_payment_id);
          // In a real app, you might want to redirect or show a success page
          // The backend webhook will confirm payment status definitively
        },
        prefill: {
          name: currentUser?.name || '',
          email: currentUser?.email || '',
          contact: currentUser?.phone || '',
        },
        notes: {
          classId: classId,
          userId: currentUser?._id,
          paymentId: order.paymentId,
        },
        theme: {
          color: '#3399FF'
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response: any) {
        alert('Payment Failed: ' + response.error.description);
        console.error('Razorpay Payment Error:', response.error);
      });

      rzp.open();

    } catch (error: any) {
      console.error('Error initiating payment:', error);
      alert('An error occurred while trying to book the class: ' + error.message);
    }
  };

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 4,
          mb: 4,
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 1,
              bgcolor: 'rgba(255, 255, 255, 0.2)', // Adjust background for contrast on primary.main
              borderRadius: '50%',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.4)',
              },
            }}
          >
            <IconButton onClick={() => navigate(-1)} color="inherit" sx={{ color: 'white' }}>
              <ArrowBackIcon />
            </IconButton>
          </Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Yoga Classes
          </Typography>
          <Typography variant="h6">
            Find the perfect class for your practice
          </Typography>
        </Container>
      </Box>

      {/* Classes Grid */}
      <Container maxWidth="lg">
        {loading && <Typography align="center">Loading classes...</Typography>}
        {error && <Typography color="error" align="center">Error: {error}</Typography>}
        {!loading && !error && classes.length === 0 && (
          <Typography align="center">No classes available.</Typography>
        )}
        <Grid container spacing={4}>
          {!loading && !error && classes.map((classItem: YogaClass) => (
            <Grid item key={classItem._id} xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: { xs: '100%', md: 200 },
                    height: { xs: 200, md: 'auto' },
                  }}
                  image={classItem.image}
                  alt={classItem.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {classItem.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {classItem.description}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      icon={<AccessTime />}
                      label={classItem.duration}
                      size="small"
                    />
                    <Chip
                      icon={<FitnessCenter />}
                      label={classItem.level}
                      size="small"
                    />
                    <Chip
                      icon={<Group />}
                      label={typeof classItem.instructor === 'string' ? classItem.instructor : classItem.instructor?.name}
                      size="small"
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {`Date: ${new Date(classItem.date).toLocaleDateString()} at ${new Date(classItem.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </Typography>
                  <Typography variant="h6" color="text.primary" sx={{ mt: 2 }}>
                    Price: ₹{classItem.price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => {
                      console.log('Attempting to book class with ID:', classItem._id);
                      handleBookNow(classItem._id);
                    }}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Login Prompt Dialog */}
      <Dialog
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
      >
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <Typography>You need to be logged in to book a class. Please log in or register.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLoginPrompt(false)}>Cancel</Button>
          <Button onClick={() => navigate('/login')} variant="contained">Go to Login</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Classes; 