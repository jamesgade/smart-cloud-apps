import React from 'react';
import { useGetIdentity } from '@refinedev/core';
import StudentMessaging from '../StudentMessaging';
import AdminMessaging from '../AdminMessaging';
import CounsellorMessaging from '../CounsellorMessaging';
import { CircularProgress, Box } from '@mui/material';

const MessagingWrapper: React.FC = () => {
  const { data: identity, isLoading } = useGetIdentity();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Check if user is admin based on userTypeName or role
  const isAdmin = identity?.userTypeName === 'Admin' || 
                  identity?.roleName === 'Admin' ||
                  identity?.roles?.some((role: any) => role.name === 'Admin');

  // Check if user is counsellor
  const isCounsellor = identity?.userTypeName === 'Counsellor' || 
                       identity?.userTypeName === 'Senior Counsellor' ||
                       identity?.roleName === 'Counsellor' ||
                       identity?.roleName === 'Senior Counsellor' ||
                       identity?.roles?.some((role: any) => 
                         role.name === 'Counsellor' || role.name === 'Senior Counsellor'
                       );

  // Check if user is student
  const isStudent = identity?.userTypeName === 'Student' ||
                   identity?.roleName === 'Student' ||
                   identity?.roles?.some((role: any) => role.name === 'Student');

  // Show appropriate component based on user role
  if (isAdmin) {
    return <AdminMessaging />;
  } else if (isCounsellor) {
    return <CounsellorMessaging />;
  } else if (isStudent) {
    return <StudentMessaging />;
  }

  // Fallback to student messaging if role is unclear
  return <StudentMessaging />;
};

export default MessagingWrapper;
