import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Testimonials = () => {
  return (
    <Container>
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          User Testimonials
        </Typography>
        {/* Content for Testimonials page */}
        <Typography variant="body1" align="center">What our users are saying will go here.</Typography>
      </Box>
    </Container>
  );
};

export default Testimonials; 