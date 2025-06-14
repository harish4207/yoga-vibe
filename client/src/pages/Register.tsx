import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Grid, Link, Alert, Divider, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { register } from '../store/slices/authSlice';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import { Google as GoogleIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useTheme } from '@mui/material/styles';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [generalError, setGeneralError] = useState('');
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
    setGeneralError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = formData.password !== formData.confirmPassword
      ? 'Passwords do not match'
      : '';

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        name: nameError || '',
        email: emailError || '',
        password: passwordError || '',
        confirmPassword: confirmPasswordError || '',
      });
      return;
    }

    try {
      await dispatch(register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })).unwrap();
      toast.success('Registration successful! Please check your email for verification.');
      // Redirect to OTP verification page, passing email if needed
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (error: any) {
      setGeneralError(error.message || 'Registration failed');
      toast.error(error.message || 'Registration failed');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
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
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Sign up
        </Typography>
        {generalError && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{generalError}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            onBlur={() => setErrors({ ...errors, name: validateName(formData.name) })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            onBlur={() => setErrors({ ...errors, email: validateEmail(formData.email) })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            onBlur={() => setErrors({ ...errors, password: validatePassword(formData.password) })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            onBlur={() => setErrors({ ...errors, confirmPassword: formData.password !== formData.confirmPassword ? 'Passwords do not match' : '' })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign up
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 1, mb: 2 }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" variant="body2">
              Sign In
            </Link>
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }}>OR</Divider>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{ mb: 2 }}
        >
          Continue with Google
        </Button>

      </Paper>
    </Container>
  );
};

export default Register; 