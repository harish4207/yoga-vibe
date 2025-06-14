import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  VideoCameraFront as VideoIcon,
  Forum as ForumIcon,
  Event as EventIcon,
  ArrowForward as ArrowForwardIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
} from '@mui/icons-material';

interface LiveClass {
  id: number;
  title: string;
  instructor: {
    name: string;
    avatar: string;
  };
  time: string;
  duration: string;
  level: string;
  thumbnail: string;
  participants: number;
}

interface CommunityEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  type: 'workshop' | 'retreat' | 'meetup';
}

const liveClasses: LiveClass[] = [
  {
    id: 1,
    title: "Morning Vinyasa Flow",
    instructor: {
      name: "Sarah Johnson",
      avatar: "/instructors/instructor1.jpg",
    },
    time: "08:00 AM",
    duration: "60 min",
    level: "Intermediate",
    thumbnail: "/classes/morning-flow.jpg",
    participants: 45,
  },
  {
    id: 2,
    title: "Yin Yoga & Meditation",
    instructor: {
      name: "Michael Chen",
      avatar: "/instructors/instructor2.jpg",
    },
    time: "12:00 PM",
    duration: "75 min",
    level: "All Levels",
    thumbnail: "/classes/yin-yoga.jpg",
    participants: 32,
  },
  {
    id: 3,
    title: "Power Yoga",
    instructor: {
      name: "Priya Sharma",
      avatar: "/instructors/instructor3.jpg",
    },
    time: "06:00 PM",
    duration: "90 min",
    level: "Advanced",
    thumbnail: "/classes/power-yoga.jpg",
    participants: 28,
  },
];

const communityEvents: CommunityEvent[] = [
  {
    id: 1,
    title: "Weekend Yoga Retreat",
    description: "A transformative weekend of yoga, meditation, and mindfulness in nature.",
    date: "April 15-17, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Mountain View Resort",
    image: "/events/retreat.jpg",
    type: "retreat",
  },
  {
    id: 2,
    title: "Meditation Workshop",
    description: "Learn advanced meditation techniques for stress relief and mental clarity.",
    date: "March 25, 2024",
    time: "2:00 PM - 4:00 PM",
    location: "Community Center",
    image: "/events/meditation.jpg",
    type: "workshop",
  },
  {
    id: 3,
    title: "Yoga Meetup",
    description: "Connect with fellow yogis and share your practice journey.",
    date: "March 30, 2024",
    time: "6:00 PM - 8:00 PM",
    location: "City Park",
    image: "/events/meetup.jpg",
    type: "meetup",
  },
];

const CommunitySection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      id="community"
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
            Join Our Community
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
            Connect with fellow yogis, join live classes, and participate in community events
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{
              '& .MuiTabs-indicator': {
                bgcolor: '#F6E05E',
              },
            }}
          >
            <Tab
              icon={<VideoIcon />}
              label="Live Classes"
              sx={{
                color: '#4A5568',
                '&.Mui-selected': {
                  color: '#1A202C',
                },
              }}
            />
            <Tab
              icon={<EventIcon />}
              label="Events"
              sx={{
                color: '#4A5568',
                '&.Mui-selected': {
                  color: '#1A202C',
                },
              }}
            />
            <Tab
              icon={<ForumIcon />}
              label="Community"
              sx={{
                color: '#4A5568',
                '&.Mui-selected': {
                  color: '#1A202C',
                },
              }}
            />
          </Tabs>
        </Box>

        {/* Live Classes Tab */}
        {activeTab === 0 && (
          <Grid container spacing={4}>
            {liveClasses.map((class_) => (
              <Grid item xs={12} md={4} key={class_.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      image={class_.thumbnail}
                      alt={class_.title}
                      sx={{
                        height: 200,
                        objectFit: 'cover',
                      }}
                    />
                    <Chip
                      label={class_.level}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: 'rgba(246, 224, 94, 0.9)',
                        color: '#1A202C',
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#1A202C',
                        mb: 2,
                        fontFamily: '"Playfair Display", serif',
                      }}
                    >
                      {class_.title}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Avatar
                        src={class_.instructor.avatar}
                        alt={class_.instructor.name}
                        sx={{ width: 32, height: 32 }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: '#1A202C',
                        }}
                      >
                        {class_.instructor.name}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: '#4A5568',
                        mb: 2,
                      }}
                    >
                      <TimeIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2">
                        {class_.time} • {class_.duration}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: '#4A5568',
                      }}
                    >
                      <GroupIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2">
                        {class_.participants} participants
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Events Tab */}
        {activeTab === 1 && (
          <Grid container spacing={4}>
            {communityEvents.map((event) => (
              <Grid item xs={12} md={4} key={event.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={event.image}
                    alt={event.title}
                    sx={{
                      height: 200,
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Chip
                      label={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      sx={{
                        bgcolor: 'rgba(246, 224, 94, 0.2)',
                        color: '#805AD5',
                        fontWeight: 500,
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#1A202C',
                        mb: 2,
                        fontFamily: '"Playfair Display", serif',
                      }}
                    >
                      {event.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#4A5568',
                        mb: 2,
                        fontFamily: '"Lora", serif',
                      }}
                    >
                      {event.description}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: '#4A5568',
                        }}
                      >
                        <CalendarIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{event.date}</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: '#4A5568',
                        }}
                      >
                        <TimeIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{event.time}</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: '#4A5568',
                        }}
                      >
                        <LocationIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{event.location}</Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        bgcolor: '#F6E05E',
                        color: '#1A202C',
                        '&:hover': {
                          bgcolor: '#C0A14F',
                        },
                      }}
                    >
                      Register Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Community Tab */}
        {activeTab === 2 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: '#1A202C',
                      mb: 3,
                      fontFamily: '"Playfair Display", serif',
                    }}
                  >
                    Discussion Forums
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#4A5568',
                      mb: 3,
                      fontFamily: '"Lora", serif',
                    }}
                  >
                    Join our vibrant community forums to share experiences, ask questions, and connect with fellow yogis.
                  </Typography>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: '#F6E05E',
                      color: '#1A202C',
                      '&:hover': {
                        bgcolor: '#C0A14F',
                      },
                    }}
                  >
                    Join Discussion
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: '#1A202C',
                      mb: 3,
                      fontFamily: '"Playfair Display", serif',
                    }}
                  >
                    Social Media Community
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#4A5568',
                      mb: 3,
                      fontFamily: '"Lora", serif',
                    }}
                  >
                    Follow us on social media for daily inspiration, tips, and community updates.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton
                      sx={{
                        color: '#4A5568',
                        '&:hover': { color: '#1A202C' },
                      }}
                    >
                      <FacebookIcon />
                    </IconButton>
                    <IconButton
                      sx={{
                        color: '#4A5568',
                        '&:hover': { color: '#1A202C' },
                      }}
                    >
                      <InstagramIcon />
                    </IconButton>
                    <IconButton
                      sx={{
                        color: '#4A5568',
                        '&:hover': { color: '#1A202C' },
                      }}
                    >
                      <TwitterIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Call to Action */}
        <Box
          sx={{
            textAlign: 'center',
            mt: { xs: 6, md: 8 },
            p: { xs: 4, md: 6 },
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(246, 224, 94, 0.1) 0%, rgba(192, 161, 79, 0.1) 100%)',
            border: '1px solid rgba(246, 224, 94, 0.2)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#1A202C',
              mb: 2,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Join Our Growing Community
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#4A5568',
              maxWidth: '600px',
              mx: 'auto',
              mb: 3,
              fontFamily: '"Lora", serif',
            }}
          >
            Connect with like-minded individuals and be part of a supportive yoga community.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: '#F6E05E',
              color: '#1A202C',
              '&:hover': {
                bgcolor: '#C0A14F',
              },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CommunitySection; 