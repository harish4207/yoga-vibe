import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { ScrollReveal, FadeIn } from '../animations';

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Regular Student',
    avatar: '/avatar-1.jpg',
    rating: 5,
    text: "The instructors here are amazing! They've helped me achieve poses I never thought possible.",
  },
  {
    name: 'Michael Chen',
    role: 'Meditation Enthusiast',
    avatar: '/avatar-2.jpg',
    rating: 5,
    text: "I've been practicing meditation for years, but the mindfulness techniques I've learned here have taken my practice to a whole new level.",
  },
  {
    name: 'Priya Sharma',
    role: 'Yoga Teacher',
    avatar: '/avatar-3.jpg',
    rating: 5,
    text: "The combination of physical exercise and mental wellness makes this studio unique. I've never felt better in both body and mind.",
  },
  {
    name: 'David Wilson',
    role: 'Beginner Yogi',
    avatar: '/avatar-4.jpg',
    rating: 5,
    text: "As someone who's new to yoga, I appreciate how welcoming and supportive the community is here.",
  },
];

const TestimonialsSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

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
              What Our Students Say
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
              Hear from our community members about their transformative experiences
            </Typography>
          </ScrollReveal>
        </Box>

        {/* Testimonials Carousel */}
        <Box sx={{ position: 'relative' }}>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} key={index}>
                <FadeIn
                  direction={index % 2 === 0 ? 'left' : 'right'}
                  delay={0.1 * index}
                >
                  <Card
                    sx={{
                      display: index === currentIndex ? 'block' : 'none',
                      borderRadius: '20px',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 3,
                        }}
                      >
                        <Avatar
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          sx={{
                            width: 64,
                            height: 64,
                            mr: 2,
                            border: '2px solid #F6E05E',
                          }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: '#1A202C',
                              fontFamily: '"Playfair Display", serif',
                            }}
                          >
                            {testimonial.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#4A5568',
                              fontFamily: '"Lora", serif',
                            }}
                          >
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                      <Rating
                        value={testimonial.rating}
                        readOnly
                        sx={{
                          color: '#F6E05E',
                          mb: 2,
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#4A5568',
                          fontStyle: 'italic',
                          fontFamily: '"Lora", serif',
                          lineHeight: 1.8,
                        }}
                      >
                        "{testimonial.text}"
                      </Typography>
                    </CardContent>
                  </Card>
                </FadeIn>
              </Grid>
            ))}
          </Grid>

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 4,
              gap: 2,
            }}
          >
            <IconButton
              onClick={handlePrevious}
              sx={{
                bgcolor: 'rgba(246, 224, 94, 0.1)',
                color: '#F6E05E',
                '&:hover': {
                  bgcolor: 'rgba(246, 224, 94, 0.2)',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                bgcolor: 'rgba(246, 224, 94, 0.1)',
                color: '#F6E05E',
                '&:hover': {
                  bgcolor: 'rgba(246, 224, 94, 0.2)',
                },
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>

          {/* Dots Indicator */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2,
              gap: 1,
            }}
          >
            {testimonials.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: index === currentIndex ? '#F6E05E' : 'rgba(246, 224, 94, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    bgcolor: '#F6E05E',
                  },
                }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TestimonialsSection; 