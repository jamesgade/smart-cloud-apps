import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import CourseCatalog from '../modules/landing-page/CourseCatalog';

const CoursesPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <CourseCatalog />
    </Box>
  );
};

export default CoursesPage;

