import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
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

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/team' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
    programs: [
      { name: 'Yoga Classes', href: '/classes' },
      { name: 'Meditation', href: '/meditation' },
      { name: 'Workshops', href: '/workshops' },
      { name: 'Retreats', href: '/retreats' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  };

  const socialLinks = [
    { icon: <FacebookIcon />, href: 'https://facebook.com' },
    { icon: <TwitterIcon />, href: 'https://twitter.com' },
    { icon: <InstagramIcon />, href: 'https://instagram.com' },
    { icon: <YouTubeIcon />, href: 'https://youtube.com' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1A202C',
        color: '#fff',
        pt: { xs: 8, md: 12 },
        pb: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <ScrollReveal direction="up">
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#F6E05E',
                    mb: 2,
                    fontFamily: '"Playfair Display", serif',
                  }}
                >
                  Yoga Studio
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#A0AEC0',
                    fontFamily: '"Lora", serif',
                    lineHeight: 1.8,
                  }}
                >
                  Discover inner peace and physical wellness through our transformative yoga and meditation programs.
                </Typography>
              </Box>
            </ScrollReveal>
          </Grid>

          {/* Navigation Links */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {Object.entries(footerLinks).map(([category, links]) => (
                <Grid item xs={6} sm={4} key={category}>
                  <ScrollReveal direction="up" delay={0.1 * Object.keys(footerLinks).indexOf(category)}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#F6E05E',
                        mb: 2,
                        textTransform: 'capitalize',
                        fontFamily: '"Playfair Display", serif',
                      }}
                    >
                      {category}
                    </Typography>
                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                      {links.map((link) => (
                        <Box component="li" key={link.name} sx={{ mb: 1 }}>
                          <Link
                            href={link.href}
                            sx={{
                              color: '#A0AEC0',
                              textDecoration: 'none',
                              '&:hover': {
                                color: '#F6E05E',
                              },
                              fontFamily: '"Lora", serif',
                            }}
                          >
                            {link.name}
                          </Link>
                        </Box>
                      ))}
                    </Box>
                  </ScrollReveal>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Bottom Section */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <ScrollReveal direction="up">
              <Typography
                variant="body2"
                sx={{
                  color: '#A0AEC0',
                  fontFamily: '"Lora", serif',
                }}
              >
                © {new Date().getFullYear()} Yoga Studio. All rights reserved.
              </Typography>
            </ScrollReveal>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ScrollReveal direction="up">
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                  gap: 1,
                }}
              >
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#A0AEC0',
                      '&:hover': {
                        color: '#F6E05E',
                        bgcolor: 'rgba(246, 224, 94, 0.1)',
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </ScrollReveal>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer; 