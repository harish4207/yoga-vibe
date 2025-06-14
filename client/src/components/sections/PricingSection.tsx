import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Check as CheckIcon,
} from '@mui/icons-material';
import { ScrollReveal, HoverScale } from '../animations';
import { useAppSelector } from '../../hooks/useAppSelector';
import { toast } from 'react-toastify';
import axios from 'axios';
import type { RootState } from '../../store';
import { User } from '../../types';
import { SubscriptionPlan } from '../../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PricingSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isYearly, setIsYearly] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/subscriptions/plans');
        setPlans(response.data.data);
      } catch (err) {
        console.error('Error fetching subscription plans:', err);
        setError('Failed to load subscription plans.');
        toast.error('Failed to load subscription plans.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleBillingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsYearly(event.target.checked);
  };

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

  const handleBookNowSubscription = async (plan: SubscriptionPlan) => {
    if (!isAuthenticated) {
      toast.error("Please log in to subscribe to a plan.");
      return;
    }

    const amount = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const currency = 'INR'; // Assuming INR for Razorpay

    try {
      const response = await axios.post('/api/payments/create-subscription-order', {
        planId: plan._id,
        amount: amount * 100, // Razorpay amount in paise
        currency,
        billingCycle: isYearly ? 'yearly' : 'monthly',
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create subscription order');
      }

      const { data: order } = response.data;
      console.log('Razorpay Subscription Order received:', order);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Payment gateway failed to load. Please try again.");
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID_HERE', 
        amount: order.amount,
        currency: order.currency,
        name: 'YogaVibe Subscription',
        description: `${plan.name} Plan (${isYearly ? 'Yearly' : 'Monthly'})`,
        order_id: order.orderId, 
        handler: function (paymentResponse: any) {
          toast.success('Subscription Payment Successful! Payment ID: ' + paymentResponse.razorpay_payment_id);
          // In a real app, you would likely verify this payment on your backend
          // and then update the user's subscription status in your database.
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        notes: {
          planId: plan._id,
          userId: user?._id,
          billingCycle: isYearly ? 'yearly' : 'monthly',
        },
        theme: {
          color: '#F6E05E'
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (paymentResponse: any) {
        toast.error('Payment Failed: ' + paymentResponse.error.description);
        console.error('Razorpay Payment Error:', paymentResponse.error);
      });

      rzp.open();

    } catch (error: any) {
      console.error('Error initiating subscription payment:', error);
      toast.error(error.response?.data?.message || 'An error occurred while trying to subscribe.');
    }
  };

  return (
    <Box
      id="pricing"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <ScrollReveal delay={0.1}>
            <Typography
              variant="h2"
              sx={{
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                color: 'text.primary',
                letterSpacing: '-0.05em',
                lineHeight: 1.1,
              }}
            >
              Choose Your Plan
            </Typography>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              Select the perfect plan for your yoga journey. All plans include a 7-day free trial.
            </Typography>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <FormControlLabel
              control={
                <Switch
                  checked={isYearly}
                  onChange={handleBillingChange}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, color: isYearly ? 'text.secondary' : 'text.primary' }}>
                    Monthly
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: isYearly ? 'text.primary' : 'text.secondary' }}>
                    Yearly
                  </Typography>
                  {!isYearly && (
                    <Chip label="Save 20%" color="success" size="small" sx={{ ml: 1 }} />
                  )}
                </Box>
              }
              sx={{ mb: 4 }}
            />
          </ScrollReveal>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <Typography>Loading plans...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {plans.map((plan) => (
              <Grid item xs={12} sm={6} md={4} key={plan._id}>
                <ScrollReveal delay={0.4}>
                  <HoverScale>
                    <Card
                      sx={{
                        p: { xs: 2, md: 4 },
                        borderRadius: theme.shape.borderRadius * 2,
                        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderColor: plan.popular ? theme.palette.primary.main : 'transparent',
                        borderWidth: plan.popular ? 2 : 0,
                        borderStyle: 'solid',
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: 'background.paper',
                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.12)',
                        },
                      }}
                    >
                      {plan.popular && (
                        <Chip
                          label="Best Value"
                          color="warning"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            fontWeight: 'bold',
                          }}
                        />
                      )}
                      <CardContent>
                        <Typography
                          variant="h4"
                          sx={{
                            mb: 1,
                            fontWeight: 700,
                            color: 'text.primary',
                            display: 'flex',
                            alignItems: 'baseline',
                          }}
                        >
                          {plan.name}
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{
                            mb: 2,
                            fontWeight: 800,
                            color: 'primary.main',
                          }}
                        >
                          ₹{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                          <Typography component="span" variant="h6" color="text.secondary">
                            {isYearly ? ' / year' : ' / month'}
                          </Typography>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          {plan.description}
                        </Typography>
                        <List sx={{ p: 0, mb: 3 }}>
                          <ListItem sx={{ p: 0, mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                              <CheckIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={`Live Sessions: ${plan.features.maxLiveSessions}`} primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }} />
                          </ListItem>
                          <ListItem sx={{ p: 0, mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                              <CheckIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={`On-Demand Content: ${plan.features.maxOnDemandContent}`} primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }} />
                          </ListItem>
                          <ListItem sx={{ p: 0, mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                              <CheckIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={`Community Access: ${plan.features.hasCommunityAccess ? 'Yes' : 'No'}`} primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }} />
                          </ListItem>
                          <ListItem sx={{ p: 0, mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                              <CheckIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={`Personalized Plan: ${plan.features.hasPersonalizedPlan ? 'Yes' : 'No'}`} primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }} />
                          </ListItem>
                          <ListItem sx={{ p: 0, mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                              <CheckIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={`Progress Tracking: ${plan.features.hasProgressTracking ? 'Yes' : 'No'}`} primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }} />
                          </ListItem>
                          <ListItem sx={{ p: 0, mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                              <CheckIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={`Challenges Access: ${plan.features.hasChallengesAccess ? 'Yes' : 'No'}`} primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }} />
                          </ListItem>
                        </List>
                      </CardContent>
                      <Box sx={{ px: { xs: 2, md: 4 }, pb: { xs: 2, md: 4 }, mt: 'auto' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          size="large"
                          onClick={() => handleBookNowSubscription(plan)}
                          sx={{
                            borderRadius: theme.shape.borderRadius * 1.5,
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: 'none',
                          }}
                        >
                          Choose Plan
                        </Button>
                      </Box>
                    </Card>
                  </HoverScale>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default PricingSection; 