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
  Avatar,
  ListItemIcon,
  Tooltip,
  CssBaseline,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  FitnessCenter as ClassesIcon,
  Person as ProfileIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/useAppSelector';
import { logout } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import type { User } from '../types';

interface UserMenuItem {
  name: string;
  action: () => void;
}

const pages = [
  { name: 'Home', href: '#home' },
  { name: 'Classes', href: '#classes' },
  { name: 'Teachers', href: '#teachers' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Contact', href: '#contact' },
];

const Navbar: React.FC = () => {
  console.log('Navbar rendering...');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);
  console.log('Navbar - isAuthenticated:', isAuthenticated);
  console.log('Navbar - user:', user);
  console.log('Navbar - user.profilePicture:', user?.profilePicture);
  console.log('Navbar - loading:', loading);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuOpen = Boolean(anchorElNav);
  const userMenuOpen = Boolean(anchorElUser);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64; // Height of the navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileOpen(false);
  };

  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      const sectionId = href.substring(1);
      scrollToSection(sectionId);
    } else {
      navigate(href);
    }
  };

  const userMenuItems: UserMenuItem[] = [
    { name: 'Dashboard', action: () => navigate('/dashboard') },
    { name: 'Profile', action: () => navigate('/profile') },
  ];

  const settingsToDisplay: UserMenuItem[] = user?.role === 'admin' ? [
    { name: 'Admin Dashboard', action: () => navigate('/admin') },
    ...userMenuItems,
    { name: 'Logout', action: handleLogout },
  ] : [
    ...userMenuItems,
    { name: 'Logout', action: handleLogout },
  ];

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
      <List>
        {pages.map((item) => (
          <ListItem
            key={item.name}
            button
            onClick={() => handleNavigation(item.href)}
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
        {!isAuthenticated && (
          <>
            <ListItem
              component={RouterLink}
              to="/login"
              onClick={() => {
                handleCloseNavMenu();
                navigate('/login');
              }}
              sx={{
                color: '#1A202C',
                '&:hover': {
                  bgcolor: 'rgba(246, 224, 94, 0.1)',
                },
              }}
            >
              <ListItemText
                primary="Login"
                primaryTypographyProps={{
                  fontFamily: '"Lora", serif',
                }}
              />
            </ListItem>
            <ListItem
              component={RouterLink}
              to="/register"
              onClick={() => {
                handleCloseNavMenu();
                navigate('/register');
              }}
              sx={{
                color: '#1A202C',
                '&:hover': {
                  bgcolor: 'rgba(246, 224, 94, 0.1)',
                },
              }}
            >
              <ListItemText
                primary="Sign Up"
                primaryTypographyProps={{
                  fontFamily: '"Lora", serif',
                }}
              />
            </ListItem>
          </>
        )}
        {isAuthenticated && (
          <ListItem
            onClick={handleLogout}
            sx={{
              color: '#1A202C',
              '&:hover': {
                bgcolor: 'rgba(246, 224, 94, 0.1)',
              },
            }}
          >
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontFamily: '"Lora", serif',
              }}
            />
          </ListItem>
        )}
      </List>
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
      <CssBaseline />
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src="/logo.jpg"
              alt="Yoga Studio Logo"
              style={{
                height: '40px',
                width: 'auto',
                borderRadius: '50%',
              }}
            />
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
          </Box>

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
              {pages.map((item) => (
                <Button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
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

          {/* Auth Buttons */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {!isAuthenticated ? (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    sx={{
                      color: scrolled ? '#1A202C' : '#fff',
                      '&:hover': {
                        color: '#F6E05E',
                      },
                      fontFamily: '"Lora", serif',
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      bgcolor: '#F6E05E',
                      color: '#1A202C',
                      '&:hover': {
                        bgcolor: '#C0A14F',
                      },
                      fontFamily: '"Lora", serif',
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {loading ? (
                    <CircularProgress size={20} sx={{ color: scrolled ? '#1A202C' : '#fff' }} />
                  ) : (
                    <>
                      <Typography
                        sx={{
                          color: scrolled ? '#1A202C' : '#fff',
                          fontFamily: '"Lora", serif',
                          fontSize: '0.9rem',
                        }}
                      >
                        {user?.name || 'User'}
                      </Typography>
                      {isAuthenticated && user && (
                        <Box sx={{ flexGrow: 0 }}>
                          <Tooltip title="Open settings">
                            <IconButton onClick={(event) => {
                              console.log("User avatar clicked!");
                              handleOpenUserMenu(event);
                            }} sx={{ p: 0 }}>
                              <Avatar alt={user?.name || 'User'} src={user?.profilePicture} />
                            </IconButton>
                          </Tooltip>
                          <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                          >
                            {settingsToDisplay.map((setting) => (
                              <MenuItem key={setting.name} onClick={() => {
                                setting.action();
                                handleCloseUserMenu();
                              }}>
                                <Typography textAlign="center">{setting.name}</Typography>
                              </MenuItem>
                            ))}
                          </Menu>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              )}
            </Box>
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
          keepMounted: true,
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