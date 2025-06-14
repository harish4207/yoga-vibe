import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Alert, Link, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Extract email from query parameter or state
  const email = new URLSearchParams(location.search).get('email') || location.state?.email;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!otp) {
      setError('OTP is required');
      return;
    }

    if (!email) {
       setError('Email is missing. Please try registering again.');
       return;
    }

    try {
      const response = await axios.post('/api/auth/verify-otp', { email, otp });
      if (response.data.success) {
        toast.success('Email verified successfully! You can now log in.');
        navigate('/login'); // Redirect to login page after successful verification
      } else {
        setError(response.data.message || 'OTP verification failed.');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setError(error.response?.data?.message || 'OTP verification failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, position: 'relative' }}>
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
              bgcolor: theme.palette.primary.light, // Use a lighter primary color on hover
            },
          }}
        >
          <IconButton onClick={() => navigate(-1)} color="inherit" sx={{ color: theme.palette.text.primary }}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Typography component="h1" variant="h5">
          Verify Your Email
        </Typography>
         {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
         {!email && (
             <Alert severity="warning" sx={{ width: '100%', mb: 2 }}>
                 Email not found. Please ensure you arrived here after registration.
             </Alert>
         )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="otp"
            label="Enter OTP"
            name="otp"
            autoFocus
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            error={!!error && error !== 'Email is missing. Please try registering again.'}
            helperText={error && error !== 'Email is missing. Please try registering again.' ? error : 'Check your email for the verification code.'}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Verify Email
          </Button>
           <Typography variant="body2" align="center">
              Didn't receive OTP?{' '}
              {/* Implement resend OTP functionality if needed */}
              <Link component={RouterLink} to="/register" variant="body2">
                Register again
              </Link>
            </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default VerifyOTP; 