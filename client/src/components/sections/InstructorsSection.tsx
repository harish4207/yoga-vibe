import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';

interface Instructor {
  id: number;
  name: string;
  role: string;
  image: string;
  videoUrl: string;
  expertise: string[];
  bio: string;
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const instructors: Instructor[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Yoga Instructor",
    image: "/instructors/instructor1.jpg",
    videoUrl: "/videos/instructor1.mp4",
    expertise: ["Hatha Yoga", "Meditation", "Pranayama"],
    bio: "With over 10 years of experience, Sarah specializes in Hatha Yoga and mindfulness meditation.",
    social: {
      facebook: "#",
      instagram: "#",
      linkedin: "#"
    }
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Vinyasa Flow Expert",
    image: "/instructors/instructor2.jpg",
    videoUrl: "/videos/instructor2.mp4",
    expertise: ["Vinyasa", "Power Yoga", "Yoga Therapy"],
    bio: "Michael brings dynamic energy to his classes, focusing on strength and flexibility.",
    social: {
      instagram: "#",
      twitter: "#"
    }
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Meditation Specialist",
    image: "/instructors/instructor3.jpg",
    videoUrl: "/videos/instructor3.mp4",
    expertise: ["Meditation", "Yin Yoga", "Mindfulness"],
    bio: "Priya combines traditional meditation techniques with modern mindfulness practices.",
    social: {
      facebook: "#",
      linkedin: "#"
    }
  },
  {
    id: 4,
    name: "David Martinez",
    role: "Yoga & Wellness Coach",
    image: "/instructors/instructor4.jpg",
    videoUrl: "/videos/instructor4.mp4",
    expertise: ["Ashtanga", "Yoga Therapy", "Wellness"],
    bio: "David focuses on holistic wellness and therapeutic yoga practices.",
    social: {
      instagram: "#",
      twitter: "#",
      linkedin: "#"
    }
  }
];

const InstructorsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <Box
      id="instructors"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth="lg">
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
            Meet Our Instructors
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
            Learn from experienced yoga practitioners dedicated to your wellness journey
          </Typography>
        </Box>

        {/* Instructors Grid */}
        <Grid container spacing={4}>
          {instructors.map((instructor) => (
            <Grid item xs={12} sm={6} md={3} key={instructor.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
                  },
                }}
                onMouseEnter={() => setHoveredId(instructor.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Instructor Image/Video Container */}
                <Box
                  sx={{
                    position: 'relative',
                    paddingTop: '100%', // 1:1 Aspect Ratio
                    overflow: 'hidden',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={instructor.image}
                    alt={instructor.name}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'all 0.3s ease-in-out',
                      transform: hoveredId === instructor.id ? 'scale(1.1)' : 'scale(1)',
                    }}
                  />
                  {hoveredId === instructor.id && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(4px)',
                        transition: 'all 0.3s ease-in-out',
                      }}
                    >
                      <IconButton
                        sx={{
                          color: 'white',
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.3)',
                          },
                        }}
                      >
                        <PlayIcon fontSize="large" />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                {/* Instructor Info */}
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    p: 3,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#1A202C',
                        mb: 0.5,
                        fontFamily: '"Playfair Display", serif',
                      }}
                    >
                      {instructor.name}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#4A5568',
                        mb: 2,
                        fontFamily: '"Lora", serif',
                      }}
                    >
                      {instructor.role}
                    </Typography>
                  </Box>

                  {/* Expertise Tags */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {instructor.expertise.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(246, 224, 94, 0.2)',
                          color: '#805AD5',
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: 'rgba(246, 224, 94, 0.3)',
                          },
                        }}
                      />
                    ))}
                  </Box>

                  {/* Bio */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#4A5568',
                      mb: 2,
                      fontFamily: '"Lora", serif',
                    }}
                  >
                    {instructor.bio}
                  </Typography>

                  {/* Social Links */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    {instructor.social.facebook && (
                      <IconButton
                        size="small"
                        sx={{ color: '#4A5568', '&:hover': { color: '#1A202C' } }}
                      >
                        <FacebookIcon />
                      </IconButton>
                    )}
                    {instructor.social.twitter && (
                      <IconButton
                        size="small"
                        sx={{ color: '#4A5568', '&:hover': { color: '#1A202C' } }}
                      >
                        <TwitterIcon />
                      </IconButton>
                    )}
                    {instructor.social.instagram && (
                      <IconButton
                        size="small"
                        sx={{ color: '#4A5568', '&:hover': { color: '#1A202C' } }}
                      >
                        <InstagramIcon />
                      </IconButton>
                    )}
                    {instructor.social.linkedin && (
                      <IconButton
                        size="small"
                        sx={{ color: '#4A5568', '&:hover': { color: '#1A202C' } }}
                      >
                        <LinkedInIcon />
                      </IconButton>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default InstructorsSection; 