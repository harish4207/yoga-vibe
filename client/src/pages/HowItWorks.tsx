import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const HowItWorks = () => {
  return (
    <Container>
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          How It Works
        </Typography>
        {/* Content for How It Works page */}
        <Typography variant="body1" align="center">Steps on how to use the platform will go here.</Typography>
      </Box>
    </Container>
  );
};

export default HowItWorks; 