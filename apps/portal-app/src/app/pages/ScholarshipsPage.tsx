import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import ScholarshipInfo from '../modules/landing-page/ScholarshipInfo';

const ScholarshipsPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <ScholarshipInfo />
    </Box>
  );
};

export default ScholarshipsPage;

