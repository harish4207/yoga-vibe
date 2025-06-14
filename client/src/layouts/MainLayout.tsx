import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Button,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Avatar,
  Grid,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  FitnessCenter as ClassesIcon,
  Person as ProfileIcon,
  People as CommunityIcon,
  Dashboard as DashboardIcon,
  Group as InstructorsIcon,
  Payments as PricingIcon,
  HelpOutline as HowItWorksIcon,
  Feedback as TestimonialsIcon,
  Article as BlogIcon,
  TrendingUp as ProgressStatsIcon,
  ContactMail as ContactIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { logout } from '../store/slices/authSlice';
import { Link as RouterLink } from 'react-router-dom';
import ChatBot from '../components/ChatBot';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();

  // Add detailed debug logs
  console.log('MainLayout - Full auth state:', {
    isAuthenticated,
    user,
    hasToken: !!localStorage.getItem('token'),
    currentPath: location.pathname
  });

  console.log('MainLayout - user:', user);
  console.log('MainLayout - isAuthenticated:', isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    handleUserMenuClose();
  };

  const handleMainMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMainMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleProfileClick = () => {
    if (location.pathname !== '/profile') {
      navigate('/profile');
    }
    handleUserMenuClose();
  };

  const handleDashboardClick = () => {
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
    handleUserMenuClose();
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Classes', icon: <ClassesIcon />, path: '/classes' },
    { text: 'Instructors', icon: <InstructorsIcon />, path: '/#instructors' },
    { text: 'Pricing', icon: <PricingIcon />, path: '/#pricing' },
    { text: 'How It Works', icon: <HowItWorksIcon />, path: '/#how-it-works' },
    { text: 'Testimonials', icon: <TestimonialsIcon />, path: '/#testimonials' },
    { text: 'Blog', icon: <BlogIcon />, path: '/#blog' },
    { text: 'Progress & Stats', icon: <ProgressStatsIcon />, path: '/#progress-stats' },
    { text: 'Community', icon: <CommunityIcon />, path: '/#community' },
    { text: 'Contact', icon: <ContactIcon />, path: '/#contact' },
  ];

  const handleNavigation = (path: string) => {
    if (path.startsWith('/') && path.includes('#')) {
      const parts = path.split('#');
      const route = parts[0];
      const hash = parts[1];

      if (location.pathname === route || (location.pathname === '/' && route === '')) {
        if (hash) {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else {
        navigate(path);
      }
    } else {
      if (location.pathname !== path) {
        navigate(path);
      }
    }
    setDrawerOpen(false);
  };

  const drawer = (
    <List>
      {menuItems.map((item) => (
        <ListItemButton
          key={item.text}
          selected={location.pathname === item.path}
          onClick={() => handleNavigation(item.path)}
          sx={{
            color: location.pathname === item.path ? '#1A202C' : '#4A5568',
            fontWeight: location.pathname === item.path ? 'medium' : 'normal',
            bgcolor: location.pathname === item.path ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.08)',
              color: '#1A202C',
            },
          }}
        >
          <ListItemIcon sx={{ color: location.pathname === item.path ? '#1A202C' : '#4A5568' }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} sx={{ color: location.pathname === item.path ? '#1A202C' : '#4A5568' }} />
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Premium Navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.8)', // 80% white background
          backdropFilter: 'blur(12px)', // Increased blur effect
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
          transition: 'all 0.3s ease-in-out',
          width: '100%',
          ml: 0,
          mr: 0,
          mt: 0,
          top: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar, // Use theme zIndex for AppBar
        }}
      >
        {/* Content Container (mimics max-w-7xl mx-auto) */}
        <Container maxWidth="lg" disableGutters={isMobile} sx={{ px: { xs: 2, md: 6 }, py: { xs: 1.5, md: 2.5 } }}>
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 2, color: '#4A5568' }} // Use gray-700 color
              >
                <MenuIcon />
              </IconButton>
            )}
            {/* Logo & Brand */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}> {/* Added gap */}
              <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }} component={RouterLink} to='/'>
                <img src="/logo.jpg" alt="Yoga Platform Logo" style={{ height: '40px', width: '40px', marginRight: '10px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} /> {/* Added shadow and fixed size */}
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: '600',
                    color: '#1A202C', // Use near black for brand name
                    fontFamily: '"Playfair Display", serif', // Use Playfair Display font
                    fontSize: '1.5rem', // Increased font size
                    letterSpacing: '0.05em', // tracking-wide equivalent
                  }}
                >
                  Yoga Vibe
                </Typography>
              </Box>
            </Box>

            {/* Nav Links - Hidden on mobile */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {/* Home Link */}
                <Button
                  key='Home'
                  color="inherit"
                  variant="text"
                  component={RouterLink}
                  to='/'
                  sx={{
                    color: '#4A5568', // Tailwind gray-700
                    textTransform: 'none',
                    fontWeight: 'medium',
                    fontSize: '1.125rem',
                    '&:hover': {
                      color: '#1A202C', // Tailwind black or near black
                      bgcolor: 'transparent',
                      textDecoration: 'none',
                    },
                    fontFamily: '"Lora", serif', // Example serif font
                  }}
                >
                  Home
                </Button>

                {/* Classes Link */}
                <Button
                  key='Classes'
                  color="inherit"
                  variant="text"
                  component={RouterLink}
                  to='/classes'
                  sx={{
                    color: '#4A5568',
                    textTransform: 'none',
                    fontWeight: 'medium',
                    fontSize: '1.125rem',
                    '&:hover': {
                      color: '#1A202C',
                      bgcolor: 'transparent',
                      textDecoration: 'none',
                    },
                    fontFamily: '"Lora", serif',
                  }}
                >
                  Classes
                </Button>

                 {/* More Links (Placeholder for other static links if needed, e.g., About, Contact) */}
                 {/* Keeping the Menu IconButton for the rest of the links as per previous implementation */}
                 <IconButton
                   color="inherit"
                   aria-label="more navigation links"
                   onClick={handleMainMenuOpen}
                   sx={{ color: '#4A5568', fontSize: '1.125rem' }}
                 >
                   <MenuIcon />
                 </IconButton>
                 <Menu
                   id="main-menu-dropdown"
                   anchorEl={anchorEl}
                   open={Boolean(anchorEl)}
                   onClose={handleMainMenuClose}
                   MenuListProps={{
                     'aria-labelledby': 'more-button',
                   }}
                   sx={{
                     '.MuiPaper-root': {
                       borderRadius: '16px',
                       boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                       border: '1px solid rgba(255, 255, 255, 0.2)',
                       backdropFilter: 'blur(10px)',
                       bgcolor: 'rgba(255, 255, 255, 0.05)',
                     },
                   }}
                 >
                   {menuItems
                     .filter(item => item.text !== 'Home' && item.text !== 'Classes')
                     .map((item) => (
                       <MenuItem
                         key={item.text}
                         onClick={() => {
                           handleNavigation(item.path);
                           handleMainMenuClose();
                         }}
                         sx={{
                           color: '#E2E8F0',
                           fontSize: '1rem',
                           fontFamily: '"Lora", serif',
                           padding: '12px 20px',
                           borderRadius: '12px',
                           margin: '4px',
                           bgcolor: 'transparent',
                           transition: 'all 0.3s ease-in-out',
                           '&:hover': {
                             bgcolor: 'rgba(255, 255, 255, 0.2)',
                             color: '#FFFFFF',
                             transform: 'scale(1.02)',
                           },
                         }}
                       >
                         <ListItemIcon
                           sx={{
                             color: '#E2E8F0',
                             minWidth: '36px',
                             transition: 'transform 0.3s ease-in-out',
                             '&:hover': {
                               transform: 'scale(1.05)',
                             },
                           }}
                         >
                           {item.icon}
                         </ListItemIcon>
                         <ListItemText primary={item.text} />
                       </MenuItem>
                     ))}
                 </Menu>
              </Box>
            )}

            {/* Actions - Login and Sign Up */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {!user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {/* Login Link - Hidden on mobile */}
                  {!isMobile && (
                    <Button
                      color="inherit"
                      variant="text"
                      onClick={() => navigate('/login')}
                      sx={{
                        textTransform: 'none',
                        color: location.pathname === '/login' ? '#1A202C' : '#4A5568',
                        fontWeight: 'medium',
                        fontSize: '1.125rem',
                        '&:hover': {
                          color: '#1A202C',
                          bgcolor: 'transparent',
                        },
                        fontFamily: '"Lora", serif',
                      }}
                    >
                      Login
                    </Button>
                  )}

                  {/* Sign Up Button (Gold Gradient Pill) */}
                  <Button
                    variant="contained"
                    onClick={() => navigate('/register')}
                    sx={{
                      textTransform: 'none',
                      background: 'linear-gradient(to right, #F6E05E, #C0A14F)',
                      color: '#FFFFFF',
                      px: 3,
                      py: 1.5,
                      borderRadius: '9999px',
                      fontSize: '1.125rem',
                      fontWeight: 'semibold',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: 'linear-gradient(to right, #C0A14F, #F6E05E)',
                        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)',
                        transform: 'scale(1.05)',
                      },
                      fontFamily: '"Lora", serif',
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              ) : (
                <Box>
                  {/* User Menu/Avatar when logged in */}
                  <IconButton
                    onClick={handleUserMenuOpen}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls="user-menu"
                    aria-haspopup="true"
                  >
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    id="user-menu"
                    anchorEl={userMenuAnchorEl}
                    open={Boolean(userMenuAnchorEl)}
                    onClose={handleUserMenuClose}
                    onClick={handleUserMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    sx={{
                      '.MuiPaper-root': {
                        borderRadius: '16px',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        transition: 'all 0.3s ease-in-out',
                        padding: '8px',
                      },
                    }}
                  >
                    <MenuItem 
                      onClick={handleProfileClick}
                      sx={{
                        color: '#E2E8F0',
                        fontSize: '1rem',
                        fontFamily: '"Lora", serif',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        margin: '4px',
                        bgcolor: 'transparent',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          color: '#FFFFFF',
                          transform: 'scale(1.02)',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: '#E2E8F0',
                          minWidth: '36px',
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <ProfileIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Profile" />
                    </MenuItem>
                    <MenuItem 
                      onClick={handleDashboardClick}
                      sx={{
                        color: '#E2E8F0',
                        fontSize: '1rem',
                        fontFamily: '"Lora", serif',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        margin: '4px',
                        bgcolor: 'transparent',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          color: '#FFFFFF',
                          transform: 'scale(1.02)',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: '#E2E8F0',
                          minWidth: '36px',
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <DashboardIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Dashboard" />
                    </MenuItem>
                    <MenuItem 
                      onClick={handleLogout}
                      sx={{
                        color: '#E2E8F0',
                        fontSize: '1rem',
                        fontFamily: '"Lora", serif',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        margin: '4px',
                        bgcolor: 'transparent',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          color: '#FFFFFF',
                          transform: 'scale(1.02)',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: '#E2E8F0',
                          minWidth: '36px',
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </MenuItem>
                  </Menu>
                </Box>
              )}
            </Box>

             {/* Mobile Menu Toggle (Hamburger Icon) */}
             {isMobile && (
               <IconButton
                 color="inherit"
                 aria-label="menu"
                 onClick={() => setDrawerOpen(true)}
                 sx={{ color: '#4A5568' }}
               >
                 <MenuIcon />
               </IconButton>
             )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Spacer to prevent content from being hidden behind fixed AppBar */}
      <Toolbar sx={{ mt: 0 }} />

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            borderRadius: '0 16px 16px 0',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            transition: 'all 0.3s ease-in-out',
            padding: '16px',
          },
        }}
      >
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)} onKeyDown={() => setDrawerOpen(false)}>
          <List>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.text}
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  color: '#E2E8F0',
                  fontSize: '1rem',
                  fontFamily: '"Lora", serif',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  margin: '4px',
                  bgcolor: 'transparent',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    transform: 'scale(1.02)',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: '#E2E8F0',
                    minWidth: '36px',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
          {/* Mobile Login/Signup in Drawer */}
          {!user && (
            <Box sx={{ mt: 2, px: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  navigate('/login');
                  setDrawerOpen(false);
                }}
                sx={{
                  textTransform: 'none',
                  color: '#4A5568',
                  borderColor: '#4A5568',
                  '&:hover': {
                    borderColor: '#1A202C',
                    color: '#1A202C',
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  navigate('/register');
                  setDrawerOpen(false);
                }}
                sx={{
                   textTransform: 'none',
                   background: 'linear-gradient(to right, #F6E05E, #C0A14F)',
                   color: '#FFFFFF',
                   '&:hover': {
                     background: 'linear-gradient(to right, #C0A14F, #F6E05E)',
                   },
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, pt: { xs: 8, sm: 9 } }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            height: '100vh',
            minHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: 'url("/land.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 1,
            },
          }}
        >
          {/* Content Container */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              color: 'white',
              px: 2,
              maxWidth: '1200px',
              width: '100%',
            }}
          >
            {/* Title */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 700,
                mb: 4,
                fontFamily: '"Playfair Display", serif',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              Find Your Inner Peace
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.75rem' },
                fontWeight: 400,
                mb: 6,
                fontFamily: '"Lora", serif',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
              }}
            >
              Transform your life through the power of yoga
            </Typography>

            {/* Buttons Container */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 4 },
                justifyContent: 'center',
                alignItems: 'center',
                mb: 6,
              }}
            >
              {/* Start Free Trial Button */}
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #F6E05E 30%, #C0A14F 90%)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                    background: 'linear-gradient(45deg, #C0A14F 30%, #F6E05E 90%)',
                  },
                  minWidth: { xs: '280px', sm: '200px' },
                }}
              >
                Start Free Trial
              </Button>

              {/* View Class Library Button */}
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  textTransform: 'none',
                  borderColor: 'white',
                  color: 'white',
                  borderWidth: 2,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 2,
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                  },
                  minWidth: { xs: '280px', sm: '200px' },
                }}
              >
                View Class Library
              </Button>
            </Box>

            {/* Trusted Users Text */}
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: '"Lora", serif',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              Trusted by 10,000+ Yogis Worldwide 🧘‍♀️
            </Typography>
          </Box>
        </Box>

        {children}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[100],
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="space-between">
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>YogaVibe</Typography>
              <Typography variant="body2">Find your balance, anytime, anywhere.</Typography>
              <Box sx={{ mt: 2 }}>
                <IconButton color="primary"><FacebookIcon /></IconButton>
                <IconButton color="primary"><TwitterIcon /></IconButton>
                <IconButton color="primary"><InstagramIcon /></IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Quick Links</Typography>
              <Box>
                <Typography variant="body2"><RouterLink to="/about" className="text-gray-700 hover:underline">About Us</RouterLink></Typography>
                <Typography variant="body2"><RouterLink to="/terms" className="text-gray-700 hover:underline">Terms of Service</RouterLink></Typography>
                <Typography variant="body2"><RouterLink to="/privacy" className="text-gray-700 hover:underline">Privacy Policy</RouterLink></Typography>
                <Typography variant="body2"><RouterLink to="/blog" className="text-gray-700 hover:underline">Blog</RouterLink></Typography>
                <Typography variant="body2"><RouterLink to="/community" className="text-gray-700 hover:underline">Community</RouterLink></Typography>
                <Typography variant="body2"><RouterLink to="/pricing" className="text-gray-700 hover:underline">Membership Plans</RouterLink></Typography>
                <Typography variant="body2"><RouterLink to="/contact" className="text-gray-700 hover:underline">Contact Us</RouterLink></Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Contact Us</Typography>
              <Typography variant="body2">Email: support@yogavibe.com</Typography>
              <Typography variant="body2">Phone: (123) 456-7890</Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                <RouterLink to="/admin/login" className="text-gray-700 hover:underline text-xs">Admin Login</RouterLink>
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} Yoga Platform. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ChatBot with debug info */}
      {
        <Box 
          sx={{ 
            position: 'fixed', 
            bottom: 20, 
            left: 20, 
            zIndex: 9999, // Increased zIndex to be on top of almost everything
            border: '5px solid magenta', // Even more obnoxious border
            padding: '10px',
            backgroundColor: 'rgba(255, 0, 255, 0.9)', // Bright background
            width: 'auto', // Allow content to dictate width
            height: 'auto', // Allow content to dictate height
          }}
        >
          <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
            DEBUG: CHATBOT SHOULD BE HERE!
          </Typography>
          <ChatBot />
        </Box>
      }
    </Box>
  );
};

export default MainLayout; 