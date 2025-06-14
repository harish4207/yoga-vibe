import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const About = () => {
  return (
    <Container>
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          About Us
        </Typography>
        {/* Content for About page */}
        <Typography variant="body1" align="center">Information about the platform will go here.</Typography>
      </Box>
    </Container>
  );
};

export default About; 