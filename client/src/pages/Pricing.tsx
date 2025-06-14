import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Pricing = () => {
  return (
    <Container>
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Membership Plans
        </Typography>
        {/* Content for Pricing page */}
        <Typography variant="body1" align="center">Details about membership plans will go here.</Typography>
      </Box>
    </Container>
  );
};

export default Pricing; 