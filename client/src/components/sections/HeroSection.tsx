import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ScrollReveal, HoverScale, Bounce } from '../animations';

const HeroSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      id="home"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        background: 'linear-gradient(135deg, #D1F2EB 0%, #A9CCE3 50%, #FADBD8 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/land.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <ScrollReveal>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 700,
                  color: '#2C3445',
                  mb: 3,
                  fontFamily: '"Playfair Display", serif',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.05)',
                  letterSpacing: '-0.02em',
                }}
              >
                Find Your Inner Peace Through Yoga
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: '#4A5568',
                  mb: 5,
                  fontFamily: '"Playfair Display", serif',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.05)',
                  lineHeight: 1.6,
                  maxWidth: '90%',
                }}
              >
                Discover the perfect balance of mind, body, and soul with our expert-led yoga classes
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <HoverScale>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: '#F6E05E',
                      color: '#1A202C',
                      '&:hover': {
                        bgcolor: '#C0A14F',
                        transform: 'translateY(-2px)',
                      },
                      borderRadius: '30px',
                      px: 5,
                      py: 1.8,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 12px rgba(246, 224, 94, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Start Your Journey
                  </Button>
                </HoverScale>
                <HoverScale>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: '#F6E05E',
                      color: '#2C3445',
                      '&:hover': {
                        borderColor: '#C0A14F',
                        color: '#C0A14F',
                        bgcolor: 'rgba(246, 224, 94, 0.05)',
                        transform: 'translateY(-2px)',
                      },
                      borderRadius: '30px',
                      px: 5,
                      py: 1.8,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Learn More
                  </Button>
                </HoverScale>
              </Box>
            </ScrollReveal>
          </Grid>
          <Grid item xs={12} md={6}>
            <ScrollReveal direction="right">
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="img"
                  src="/land.png"
                  alt="Yoga Practice"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '20px',
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                />
              </Box>
            </ScrollReveal>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection; 