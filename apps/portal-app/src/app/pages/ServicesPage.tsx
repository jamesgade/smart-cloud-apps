import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import HowItWorks from '../modules/landing-page/HowItWorks';

const ServicesPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <HowItWorks />
    </Box>
  );
};

export default ServicesPage;

