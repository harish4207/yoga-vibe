import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PersonAdd as SignUpIcon,
  FitnessCenter as PracticeIcon,
  TrendingUp as ProgressIcon,
} from '@mui/icons-material';

const steps = [
  {
    icon: <SignUpIcon sx={{ fontSize: 60 }} />,
    title: "Create Your Account",
    description: "Sign up and customize your yoga journey with our easy registration process.",
    color: "#F6E05E",
  },
  {
    icon: <PracticeIcon sx={{ fontSize: 60 }} />,
    title: "Start Your Practice",
    description: "Choose from our diverse range of classes and begin your yoga journey.",
    color: "#C0A14F",
  },
  {
    icon: <ProgressIcon sx={{ fontSize: 60 }} />,
    title: "Track Your Progress",
    description: "Monitor your growth and achievements with our comprehensive tracking system.",
    color: "#805AD5",
  },
];

const HowItWorksSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      id="how-it-works"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(246, 224, 94, 0.1) 0%, transparent 70%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: '#1A202C',
              mb: 2,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            How It Works
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#4A5568',
              maxWidth: '600px',
              mx: 'auto',
              fontFamily: '"Lora", serif',
            }}
          >
            Start your yoga journey in three simple steps
          </Typography>
        </Box>

        {/* Steps Grid */}
        <Grid container spacing={4} justifyContent="center">
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                {/* Step Number */}
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: step.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    boxShadow: `0 4px 8px ${step.color}40`,
                  }}
                >
                  {index + 1}
                </Box>

                {/* Icon */}
                <Box
                  sx={{
                    color: step.color,
                    mb: 2,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {step.icon}
                </Box>

                {/* Title */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: '#1A202C',
                    mb: 2,
                    fontFamily: '"Playfair Display", serif',
                  }}
                >
                  {step.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body1"
                  sx={{
                    color: '#4A5568',
                    fontFamily: '"Lora", serif',
                  }}
                >
                  {step.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Video Section */}
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(246, 224, 94, 0.2), rgba(192, 161, 79, 0.2))',
              zIndex: 1,
            },
          }}
        >
          <Box
            component="video"
            controls
            poster="/video-thumbnail.jpg"
            sx={{
              width: '100%',
              height: { xs: 'auto', md: '400px' },
              objectFit: 'cover',
            }}
          >
            <source src="/how-it-works.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorksSection; 