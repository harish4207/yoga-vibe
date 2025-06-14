import React, { useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline, Box, CircularProgress, Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { 
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { theme } from './theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import HeroSection from './components/sections/HeroSection';
import FeaturesSection from './components/sections/FeaturesSection';
import ClassesSection from './components/sections/ClassesSection';
import TeachersSection from './components/sections/TeachersSection';
import TestimonialsSection from './components/sections/TestimonialsSection';
import PricingSection from './components/sections/PricingSection';
import ContactSection from './components/sections/ContactSection';
import Footer from './components/sections/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import GoogleCallback from './pages/GoogleCallback';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import WhatsAppChat from './components/WhatsAppChat';
import ChatBot from './components/ChatBot';
import { useAppSelector, useAppDispatch } from './hooks/useAppSelector';
import { getProfile } from './store/slices/authSlice';
import Classes from './pages/Classes';
import ClassDetails from './pages/ClassDetails';

const HomePage = () => (
  <Box
    sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("/land.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.1,
        zIndex: 0,
      },
    }}
  >
    <Navbar />
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <HeroSection />
      <FeaturesSection />
      <ClassesSection />
      <TeachersSection />
      <TestimonialsSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </Box>
    <WhatsAppChat 
      phoneNumber="+917993511043"
      message="Hello! I'm interested in your yoga classes."
      position="bottom-right"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
      }}
    />
  </Box>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/auth/callback" element={<GoogleCallback />} />
      <Route path="/classes" element={<Classes />} />
      <Route path="/classes/:id" element={<ClassDetails />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute requireAdmin>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
    </Route>
  )
);

const AppContent = () => {
  const { isAuthenticated, token, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      dispatch(getProfile());
    }
  }, [token, dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={80} thickness={4} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading application...</Typography>
      </Box>
    );
  }

  return (
    <>
      <CssBaseline />
      <RouterProvider router={router} />
      {isAuthenticated && (
        <Box 
          sx={{ 
            position: 'fixed', 
            bottom: 20, 
            left: 20, 
            zIndex: 9999,
          }}
        >
          <ChatBot />
        </Box>
      )}
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <AppContent />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </MuiThemeProvider>
    </Provider>
  );
};

export default App;
