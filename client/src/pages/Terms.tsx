import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Terms = () => {
  return (
    <Container>
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Terms of Service
        </Typography>
        {/* Content for Terms page */}
        <Typography variant="body1" align="center">Terms and conditions will go here.</Typography>
      </Box>
    </Container>
  );
};

export default Terms; 