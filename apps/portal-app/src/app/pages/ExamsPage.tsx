import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import AdmissionCalendar from '../modules/landing-page/AdmissionCalendar';

const ExamsPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AdmissionCalendar />
    </Box>
  );
};

export default ExamsPage;

