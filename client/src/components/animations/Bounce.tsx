import React from 'react';
import { motion } from 'framer-motion';

interface BounceProps {
  children: React.ReactNode;
}

export const Bounce: React.FC<BounceProps> = ({ children }) => {
  return (
    <motion.div
      whileHover={{
        y: [0, -8, 0],
        transition: {
          duration: 0.6,
          ease: 'easeInOut',
        },
      }}
    >
      {children}
    </motion.div>
  );
}; 