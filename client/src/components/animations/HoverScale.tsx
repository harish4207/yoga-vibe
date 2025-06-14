import React from 'react';
import { Box } from '@mui/material';

interface HoverScaleProps {
  children: React.ReactNode;
  scale?: number;
}

export const HoverScale: React.FC<HoverScaleProps> = ({
  children,
  scale = 1.05,
}) => {
  return (
    <Box
      sx={{
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: `scale(${scale})`,
        },
      }}
    >
      {children}
    </Box>
  );
};