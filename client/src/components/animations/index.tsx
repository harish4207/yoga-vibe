import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay * 1000);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(50px)';
      case 'down':
        return 'translateY(-50px)';
      case 'left':
        return 'translateX(50px)';
      case 'right':
        return 'translateX(-50px)';
      default:
        return 'translateY(50px)';
    }
  };

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getTransform(),
        transition: 'all 0.8s ease-out',
      }}
    >
      {children}
    </Box>
  );
};

export const FadeIn: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
}) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
};

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