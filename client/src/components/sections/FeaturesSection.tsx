import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Spa as SpaIcon,
  SelfImprovement as SelfImprovementIcon,
  FitnessCenter as FitnessCenterIcon,
  Psychology as PsychologyIcon,
  AccessTime as AccessTimeIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { ScrollReveal, HoverScale } from '../animations';

const features = [
  {
    icon: <SpaIcon sx={{ fontSize: 40, color: '#F6E05E' }} />,
    title: 'Holistic Approach',
    description: 'Experience a comprehensive approach to wellness that nurtures your body, mind, and spirit.',
  },
  {
    icon: <SelfImprovementIcon sx={{ fontSize: 40, color: '#F6E05E' }} />,
    title: 'Expert Instructors',
    description: 'Learn from certified yoga instructors with years of experience in various yoga styles.',
  },
  {
    icon: <FitnessCenterIcon sx={{ fontSize: 40, color: '#F6E05E' }} />,
    title: 'Physical Wellness',
    description: 'Improve flexibility, strength, and balance through carefully designed yoga sequences.',
  },
  {
    icon: <PsychologyIcon sx={{ fontSize: 40, color: '#F6E05E' }} />,
    title: 'Mental Clarity',
    description: 'Find peace of mind and reduce stress through meditation and mindfulness practices.',
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 40, color: '#F6E05E' }} />,
    title: 'Flexible Schedule',
    description: 'Choose from multiple class times throughout the day to fit your busy lifestyle.',
  },
  {
    icon: <GroupIcon sx={{ fontSize: 40, color: '#F6E05E' }} />,
    title: 'Community Support',
    description: 'Join a supportive community of like-minded individuals on their wellness journey.',
  },
];

const FeaturesSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
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
          <ScrollReveal direction="up">
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
              Why Choose Us
            </Typography>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <Typography
              variant="h6"
              sx={{
                color: '#4A5568',
                maxWidth: '600px',
                mx: 'auto',
                fontFamily: '"Lora", serif',
              }}
            >
              Discover the unique benefits that make our yoga studio the perfect place for your wellness journey.
            </Typography>
          </ScrollReveal>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ScrollReveal direction="up" delay={0.1 * index}>
                <HoverScale>
                  <Card
                    sx={{
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: '#1A202C',
                          mb: 2,
                          fontFamily: '"Playfair Display", serif',
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#4A5568',
                          fontFamily: '"Lora", serif',
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </HoverScale>
              </ScrollReveal>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection; 