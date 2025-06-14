import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Blog = () => {
  return (
    <Container>
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          YogaVibe Blog
        </Typography>
        {/* Content for Blog page */}
        <Typography variant="body1" align="center">Latest articles and wellness tips will go here.</Typography>
      </Box>
    </Container>
  );
};

export default Blog; 