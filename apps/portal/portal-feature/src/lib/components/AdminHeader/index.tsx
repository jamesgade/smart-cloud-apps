import React from 'react';
import { AppBar, Toolbar, Container } from '@mui/material';
import { useNavigate } from 'react-router';
import logo from '../../../../public/images/campus_yatra_logo.png';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: '#FFF5F0', // Light orange background
        top: 0, 
        zIndex: 1100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters 
          sx={{ 
            minHeight: '60px', // Reduced height
            py: 1,
            justifyContent: 'flex-start' // Align logo to left
          }}
        >
          <img
            src={logo}
            alt="Campus Yatra Logo"
            style={{
              height: '40px', // Decreased logo size
              width: 'auto',
              cursor: 'pointer',
              objectFit: 'contain'
            }}
            onClick={() => navigate('/')}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AdminHeader;
