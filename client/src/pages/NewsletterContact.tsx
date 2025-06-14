import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const NewsletterContact = () => {
  return (
    <Container>
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Stay Updated & Contact Us
        </Typography>
        {/* Content for Newsletter & Contact page */}
        <Typography variant="body1" align="center">Newsletter signup and contact information will go here.</Typography>
      </Box>
    </Container>
  );
};

export default NewsletterContact; 