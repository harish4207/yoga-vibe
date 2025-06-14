import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
} from '@mui/icons-material';
import { ScrollReveal } from '../animations';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <ScrollReveal direction="up">
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: '#1A202C',
                  mb: 2,
                  fontFamily: '"Playfair Display", serif',
                }}
              >
                Yoga Studio
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#4A5568',
                  mb: 3,
                  fontFamily: '"Lora", serif',
                }}
              >
                Find your inner peace and transform your life through the practice of yoga. Join our community of mindful practitioners.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
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
                  sx={{
                    color: '#F6E05E',
                    '&:hover': {
                      bgcolor: 'rgba(246, 224, 94, 0.1)',
                    },
                  }}
                >
                  <YouTubeIcon />
                </IconButton>
              </Box>
            </ScrollReveal>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <ScrollReveal direction="up" delay={0.1}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#1A202C',
                  mb: 2,
                  fontFamily: '"Playfair Display", serif',
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['Home', 'Classes', 'Schedule', 'Teachers', 'Pricing', 'Contact'].map((link) => (
                  <Link
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    sx={{
                      color: '#4A5568',
                      textDecoration: 'none',
                      '&:hover': {
                        color: '#F6E05E',
                      },
                      fontFamily: '"Lora", serif',
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Box>
            </ScrollReveal>
          </Grid>

          {/* Classes */}
          <Grid item xs={12} sm={6} md={3}>
            <ScrollReveal direction="up" delay={0.2}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#1A202C',
                  mb: 2,
                  fontFamily: '"Playfair Display", serif',
                }}
              >
                Classes
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  'Hatha Yoga',
                  'Vinyasa Flow',
                  'Yin Yoga',
                  'Meditation',
                  'Prenatal Yoga',
                  'Power Yoga',
                ].map((class_) => (
                  <Link
                    key={class_}
                    href="#"
                    sx={{
                      color: '#4A5568',
                      textDecoration: 'none',
                      '&:hover': {
                        color: '#F6E05E',
                      },
                      fontFamily: '"Lora", serif',
                    }}
                  >
                    {class_}
                  </Link>
                ))}
              </Box>
            </ScrollReveal>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <ScrollReveal direction="up" delay={0.3}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#1A202C',
                  mb: 2,
                  fontFamily: '"Playfair Display", serif',
                }}
              >
                Contact Info
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography
                  sx={{
                    color: '#4A5568',
                    fontFamily: '"Lora", serif',
                  }}
                >
                  123 Yoga Street
                  <br />
                  Wellness City, WC 12345
                </Typography>
                <Typography
                  sx={{
                    color: '#4A5568',
                    fontFamily: '"Lora", serif',
                  }}
                >
                  Phone: +1 (555) 123-4567
                </Typography>
                <Typography
                  sx={{
                    color: '#4A5568',
                    fontFamily: '"Lora", serif',
                  }}
                >
                  Email: contact@yogastudio.com
                </Typography>
              </Box>
            </ScrollReveal>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            pt: 4,
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
          }}
        >
          <ScrollReveal direction="up" delay={0.4}>
            <Typography
              variant="body2"
              sx={{
                color: '#4A5568',
                fontFamily: '"Lora", serif',
              }}
            >
              © {currentYear} Yoga Studio. All rights reserved.
            </Typography>
          </ScrollReveal>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 