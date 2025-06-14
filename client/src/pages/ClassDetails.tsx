import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, CircularProgress, Alert, Button, Grid, Card, CardContent, CardMedia, Chip, Stack, IconButton } from '@mui/material';
import { classes as classService } from '../services/api';
import { YogaClass } from '../types';
import { useAppSelector } from '../hooks/useAppSelector';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const ClassDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [yogaClass, setYogaClass] = useState<YogaClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, user: currentUser } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!id) {
        setError('Class ID is missing');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await classService.getById(id);
        if (response.success) {
          setYogaClass(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch class details');
        }
      } catch (err: any) {
        console.error('Error fetching class details:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Error: {error}</Alert>
      </Container>
    );
  }

  if (!yogaClass) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">Class not found.</Alert>
      </Container>
    );
  }

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

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to book a class.");
      return;
    }

    if (!yogaClass) return; // Should not happen if we've passed the !yogaClass check above

    // Conditional navigation based on yoga type
    if (yogaClass.style === 'general') {
      // Assuming 'general' yoga requires a plan, redirect to pricing/plans page
      // navigate('/plans'); // You might want to add a navigate here if you have a pricing page
      toast.info("This class requires a subscription plan. Please check our pricing.");
      return;
    }

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Payment gateway failed to load. Please try again.");
        return;
      }

      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ classId: yogaClass._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment order');
      }

      const { data: order } = await response.json();
      console.log('Razorpay Order received:', order);

      console.log('Client-side Razorpay Key ID:', process.env.REACT_APP_RAZORPAY_KEY_ID);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID_HERE',
        amount: order.amount,
        currency: order.currency,
        name: 'YogaVibe',
        description: `Enrollment for ${yogaClass.title}`,
        order_id: order.orderId,
        handler: function (paymentResponse: any) {
          toast.success('Payment Successful! Payment ID: ' + paymentResponse.razorpay_payment_id);
          // In a real app, you might want to redirect or show a success page
          // The backend webhook will confirm payment status definitively
        },
        prefill: {
          name: currentUser?.name || '',
          email: currentUser?.email || '',
          contact: currentUser?.phone || '',
        },
        notes: {
          classId: yogaClass._id,
          userId: currentUser?._id,
          paymentId: order.paymentId, // This might not be available here, remove if causing issues
        },
        theme: {
          color: '#3399FF'
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (paymentResponse: any) {
        toast.error('Payment Failed: ' + paymentResponse.error.description);
        console.error('Razorpay Payment Error:', paymentResponse.error);
      });

      rzp.open();

    } catch (err: any) {
      console.error('Error initiating payment:', err);
      toast.error(err.message || 'An error occurred while trying to book the class.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, py: 4, position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1,
          bgcolor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '50%',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            bgcolor: theme.palette.primary.light,
          },
        }}
      >
        <IconButton onClick={() => navigate(-1)} color="inherit" sx={{ color: theme.palette.text.primary }}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Grid container spacing={4}>
        {/* Class Media (Image/Video) */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              height="400"
              image={yogaClass.thumbnailUrl || '/default-yoga.jpg'}
              alt={yogaClass.title}
            />
          </Card>
        </Grid>

        {/* Class Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {yogaClass.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                Instructor: {typeof yogaClass.instructor === 'string' ? yogaClass.instructor : yogaClass.instructor?.name}
              </Typography>
              <Typography variant="body1" paragraph>
                {yogaClass.description}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                <Chip label={`Style: ${yogaClass.style}`} color="primary" variant="outlined" />
                <Chip label={`Level: ${yogaClass.level}`} color="secondary" variant="outlined" />
                <Chip label={`Duration: ${yogaClass.duration} mins`} color="info" variant="outlined" />
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Date: {new Date(yogaClass.date).toLocaleDateString()} at {new Date(yogaClass.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
              <Typography variant="h5" color="text.primary" sx={{ mt: 2, fontWeight: 'bold' }}>
                Price: ₹{yogaClass.price}
              </Typography>

              {/* Enrollment / Book Now Section */}
              <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBookNow}
                  size="large"
                >
                  Book Now
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Capacity: {yogaClass.booked}/{yogaClass.capacity}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ClassDetails; 