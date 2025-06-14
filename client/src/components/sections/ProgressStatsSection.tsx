import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Timer as TimerIcon,
  FitnessCenter as FitnessIcon,
  Group as GroupIcon,
} from '@mui/icons-material';

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  color: string;
}

const stats: Stat[] = [
  {
    icon: <GroupIcon sx={{ fontSize: 40 }} />,
    value: "10,000+",
    label: "Active Students",
    color: "#F6E05E",
  },
  {
    icon: <TimerIcon sx={{ fontSize: 40 }} />,
    value: "50,000+",
    label: "Hours of Practice",
    color: "#C0A14F",
  },
  {
    icon: <FitnessIcon sx={{ fontSize: 40 }} />,
    value: "100+",
    label: "Expert Instructors",
    color: "#805AD5",
  },
  {
    icon: <TrophyIcon sx={{ fontSize: 40 }} />,
    value: "95%",
    label: "Success Rate",
    color: "#F6E05E",
  },
];

const achievements: Achievement[] = [
  {
    id: 1,
    title: "Consistency Champion",
    description: "Complete 30 days of consecutive practice",
    progress: 75,
    icon: <TimerIcon />,
    color: "#F6E05E",
  },
  {
    id: 2,
    title: "Flexibility Master",
    description: "Master 20 advanced yoga poses",
    progress: 60,
    icon: <FitnessIcon />,
    color: "#C0A14F",
  },
  {
    id: 3,
    title: "Meditation Guru",
    description: "Complete 50 meditation sessions",
    progress: 90,
    icon: <GroupIcon />,
    color: "#805AD5",
  },
];

const ProgressStatsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      id="progress-stats"
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
            Your Progress & Our Impact
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
            Track your achievements and join our growing community
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={4} sx={{ mb: { xs: 6, md: 8 } }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
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
                <Box
                  sx={{
                    color: stat.color,
                    mb: 2,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#1A202C',
                    mb: 1,
                    fontFamily: '"Playfair Display", serif',
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#4A5568',
                    fontFamily: '"Lora", serif',
                  }}
                >
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Achievements Section */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#1A202C',
              mb: 4,
              textAlign: 'center',
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Your Achievements
          </Typography>
          <Grid container spacing={4}>
            {achievements.map((achievement) => (
              <Grid item xs={12} md={4} key={achievement.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
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
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        color: achievement.color,
                        mr: 2,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      {achievement.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#1A202C',
                        fontFamily: '"Playfair Display", serif',
                      }}
                    >
                      {achievement.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#4A5568',
                      mb: 2,
                      fontFamily: '"Lora", serif',
                    }}
                  >
                    {achievement.description}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#4A5568',
                        mb: 0.5,
                        fontFamily: '"Lora", serif',
                      }}
                    >
                      Progress: {achievement.progress}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={achievement.progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(246, 224, 94, 0.2)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: achievement.color,
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box
          sx={{
            textAlign: 'center',
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
            Start Your Journey Today
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
            Join our community and begin your transformation with personalized guidance and support.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default ProgressStatsSection; 