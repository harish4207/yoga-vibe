import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Grid, Link, Divider, IconButton } from '@mui/material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import { login } from '../store/slices/authSlice';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils/validation';
import { Google as GoogleIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Login: React.FC = () => {
  console.log('Login component rendering...');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError || '',
        password: passwordError || '',
      });
      return;
    }

    try {
      const result = await dispatch(login(formData)).unwrap();
      toast.success('Login successful!');
      
      // Redirect after login to home page
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    // Use the full backend API URL to initiate Google OAuth
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 4, color: '#1A202C', fontFamily: '"Playfair Display", serif' }}
          >
            Login
          </Typography>

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

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              required
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#F6E05E',
                color: '#1A202C',
                '&:hover': {
                  bgcolor: '#C0A14F',
                },
                fontFamily: '"Lora", serif',
                mb: 2,
              }}
            >
              Login
            </Button>

            <Divider sx={{ my: 2 }}>OR</Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{
                borderColor: '#F6E05E',
                color: '#1A202C',
                '&:hover': {
                  borderColor: '#C0A14F',
                  bgcolor: 'rgba(246, 224, 94, 0.1)',
                },
                fontFamily: '"Lora", serif',
              }}
            >
              Continue with Google
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" sx={{ color: '#F6E05E' }}>
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 