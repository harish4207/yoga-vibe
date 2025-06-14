import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const ProgressStats = () => {
  return (
    <Container>
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Progress & Benefits
        </Typography>
        {/* Content for Progress & Stats page */}
        <Typography variant="body1" align="center">Stats and benefits highlights will go here.</Typography>
      </Box>
    </Container>
  );
};

export default ProgressStats; 