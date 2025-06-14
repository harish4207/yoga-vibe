import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Privacy = () => {
  return (
    <Container>
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Privacy Policy
        </Typography>
        {/* Content for Privacy page */}
        <Typography variant="body1" align="center">Our privacy policy will go here.</Typography>
      </Box>
    </Container>
  );
};

export default Privacy; 