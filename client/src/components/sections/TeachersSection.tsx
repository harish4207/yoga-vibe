import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import { ScrollReveal, HoverScale } from '../animations';

const teachers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Hatha Yoga Instructor',
    image: '/teacher-1.jpg',
    bio: 'Certified yoga instructor with 10+ years of experience in Hatha and Vinyasa yoga.',
    social: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#',
    },
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Vinyasa Flow Expert',
    image: '/teacher-2.jpg',
    bio: 'Specializes in dynamic Vinyasa flows and power yoga sequences.',
    social: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#',
    },
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Meditation Guide',
    image: '/teacher-3.jpg',
    bio: 'Mindfulness and meditation expert with a background in psychology.',
    social: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#',
    },
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Yin Yoga Specialist',
    image: '/teacher-4.jpg',
    bio: 'Deep tissue specialist focusing on Yin yoga and restorative practices.',
    social: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#',
    },
  },
];

const TeachersSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      id="teachers"
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
              Our Teachers
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
              Meet our experienced and passionate yoga instructors dedicated to your wellness journey.
            </Typography>
          </ScrollReveal>
        </Box>

        {/* Teachers Grid */}
        <Grid container spacing={4}>
          {teachers.map((teacher) => (
            <Grid item xs={12} sm={6} md={3} key={teacher.id}>
              <ScrollReveal direction="up" delay={0.1 * teacher.id}>
                <HoverScale>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="300"
                      image={teacher.image}
                      alt={teacher.name}
                      sx={{
                        objectFit: 'cover',
                        height: '300px',
                        width: '100%',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: '#1A202C',
                          mb: 1,
                          fontFamily: '"Playfair Display", serif',
                        }}
                      >
                        {teacher.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: '#F6E05E',
                          mb: 2,
                          fontFamily: '"Lora", serif',
                        }}
                      >
                        {teacher.role}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#4A5568',
                          mb: 2,
                          fontFamily: '"Lora", serif',
                        }}
                      >
                        {teacher.bio}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          href={teacher.social.facebook}
                          target="_blank"
                          sx={{
                            color: '#F6E05E',
                            '&:hover': {
                              bgcolor: 'rgba(246, 224, 94, 0.1)',
                            },
                          }}
                        >
                          <FacebookIcon />
                        </IconButton>
                        <IconButton
                          href={teacher.social.twitter}
                          target="_blank"
                          sx={{
                            color: '#F6E05E',
                            '&:hover': {
                              bgcolor: 'rgba(246, 224, 94, 0.1)',
                            },
                          }}
                        >
                          <TwitterIcon />
                        </IconButton>
                        <IconButton
                          href={teacher.social.instagram}
                          target="_blank"
                          sx={{
                            color: '#F6E05E',
                            '&:hover': {
                              bgcolor: 'rgba(246, 224, 94, 0.1)',
                            },
                          }}
                        >
                          <InstagramIcon />
                        </IconButton>
                        <IconButton
                          href={teacher.social.linkedin}
                          target="_blank"
                          sx={{
                            color: '#F6E05E',
                            '&:hover': {
                              bgcolor: 'rgba(246, 224, 94, 0.1)',
                            },
                          }}
                        >
                          <LinkedInIcon />
                        </IconButton>
                      </Box>
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

export default TeachersSection; 