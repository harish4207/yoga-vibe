import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { ScrollReveal } from '../animations';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Classes', path: '/classes' },
  { name: 'Schedule', path: '/schedule' },
  { name: 'Teachers', path: '/teachers' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            color: '#F6E05E',
            textDecoration: 'none',
            fontWeight: 700,
            fontFamily: '"Playfair Display", serif',
          }}
        >
          Yoga Studio
        </Typography>
        <IconButton
          color="inherit"
          aria-label="close drawer"
          edge="end"
          onClick={handleDrawerToggle}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.name}
            component={RouterLink}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: '#1A202C',
              '&:hover': {
                bgcolor: 'rgba(246, 224, 94, 0.1)',
              },
            }}
          >
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                fontFamily: '"Lora", serif',
              }}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          component={RouterLink}
          to="/book-class"
          onClick={handleDrawerToggle}
          sx={{
            bgcolor: '#F6E05E',
            color: '#1A202C',
            '&:hover': {
              bgcolor: '#C0A14F',
            },
            fontFamily: '"Lora", serif',
          }}
        >
          Book a Class
        </Button>
      </Box>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              color: scrolled ? '#1A202C' : '#fff',
              textDecoration: 'none',
              fontWeight: 700,
              fontFamily: '"Playfair Display", serif',
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            Yoga Studio
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                ml: 4,
                flexGrow: 1,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    color: scrolled ? '#1A202C' : '#fff',
                    '&:hover': {
                      color: '#F6E05E',
                    },
                    fontFamily: '"Lora", serif',
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          )}

          {/* Book Class Button */}
          {!isMobile && (
            <ScrollReveal direction="left">
              <Button
                variant="contained"
                component={RouterLink}
                to="/book-class"
                sx={{
                  bgcolor: '#F6E05E',
                  color: '#1A202C',
                  '&:hover': {
                    bgcolor: '#C0A14F',
                  },
                  fontFamily: '"Lora", serif',
                }}
              >
                Book a Class
              </Button>
            </ScrollReveal>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                color: scrolled ? '#1A202C' : '#fff',
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 