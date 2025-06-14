import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Send as SendIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { ScrollReveal, HoverScale } from '../animations';
import axios from 'axios';
import { toast } from 'react-toastify';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What are your class schedules?",
    answer: "We offer classes throughout the day, from early morning to evening. You can view our complete schedule on the Classes page or contact us for specific timing details.",
  },
  {
    question: "Do I need to bring my own yoga mat?",
    answer: "While we provide mats for all students, we recommend bringing your own for personal comfort and hygiene. We also have mats available for purchase in our studio.",
  },
  {
    question: "What should I wear to class?",
    answer: "Wear comfortable, stretchy clothing that allows for movement. Avoid loose or baggy clothes that might get in the way during poses.",
  },
  {
    question: "Do you offer private sessions?",
    answer: "Yes, we offer private sessions for individuals or small groups. These can be customized to your specific needs and goals.",
  },
  {
    question: "What is your cancellation policy?",
    answer: "We require 24 hours notice for class cancellations. Late cancellations may be subject to a fee. Please check our policy page for complete details.",
  },
];

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/messages/contact', formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        toast.error(response.data.error || 'Failed to send message.');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.error || 'An error occurred while sending your message.');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      id="contact"
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
              Get in Touch
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
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </Typography>
          </ScrollReveal>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <ScrollReveal direction="up" delay={0.3}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.1)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#F6E05E',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#F6E05E',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.1)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#F6E05E',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#F6E05E',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.1)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#F6E05E',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#F6E05E',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.1)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#F6E05E',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#F6E05E',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <HoverScale>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          sx={{
                            bgcolor: '#F6E05E',
                            color: '#1A202C',
                            py: 1.5,
                            '&:hover': {
                              bgcolor: '#C0A14F',
                            },
                            boxShadow: '0 4px 12px rgba(246, 224, 94, 0.3)',
                          }}
                        >
                          Send Message
                        </Button>
                      </HoverScale>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </ScrollReveal>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <ScrollReveal direction="right">
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: '#1A202C',
                      mb: 3,
                      fontFamily: '"Playfair Display", serif',
                    }}
                  >
                    Contact Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LocationIcon sx={{ color: '#F6E05E', fontSize: 24 }} />
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#4A5568',
                            fontFamily: '"Lora", serif',
                          }}
                        >
                          123 Yoga Street, Wellness City, WC 12345
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PhoneIcon sx={{ color: '#F6E05E', fontSize: 24 }} />
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#4A5568',
                            fontFamily: '"Lora", serif',
                          }}
                        >
                          +1 (555) 123-4567
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <EmailIcon sx={{ color: '#F6E05E', fontSize: 24 }} />
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#4A5568',
                            fontFamily: '"Lora", serif',
                          }}
                        >
                          contact@yogastudio.com
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Map */}
                <Paper
                  elevation={0}
                  sx={{
                    height: 300,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986432970718!3d40.697149422113014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1647043087964!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </Paper>
              </Box>
            </ScrollReveal>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            bgcolor: snackbar.severity === 'success' ? '#F6E05E' : '#F56565',
            color: '#1A202C',
            '& .MuiAlert-icon': {
              color: '#1A202C',
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactSection; 