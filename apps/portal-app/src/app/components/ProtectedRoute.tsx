import React from 'react';
import { useGetIdentity, usePermissions } from '@refinedev/core';
import { Navigate } from 'react-router';
import { Box, Typography, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: string[];
  requiredPermissions?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedUserTypes, 
  requiredPermissions
}) => {
  const { data: user, isLoading: userLoading } = useGetIdentity();
  const { data: permissions, isLoading: permissionsLoading } = usePermissions({});

  // Helper function to check if user has a specific permission
  const hasPermission = (actionName: string): boolean => {
    if (!permissions || permissions.length === 0) return false;
    
    const userRole = user?.roleName || user?.userTypeName;
    
    // Check if user has the specific action permission
    return permissions?.data?.some((permission: any) => {
      return permission.actionName === actionName && 
             (permission.roleName === userRole || !permission.roleName);
    });
  };

  if (userLoading || permissionsLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  const userType = user?.userTypeName || user?.roleName;
  
  // Check user type permissions
  if (allowedUserTypes && !allowedUserTypes.includes(userType)) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        textAlign: 'center',
        px: 3
      }}>
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You don't have permission to access this page.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your account type: <strong>{userType}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Required access: <strong>{allowedUserTypes.join(', ')}</strong>
        </Typography>
      </Box>
    );
  }

  // Check specific permissions using the actionName from permissions array
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission));
    
    if (!hasAllPermissions) {
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          textAlign: 'center',
          px: 3
        }}>
          <Typography variant="h4" color="error" gutterBottom>
            Insufficient Permissions
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You don't have the required permissions to access this page.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Required permissions: <strong>{requiredPermissions.join(', ')}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Your role: <strong>{userType}</strong>
          </Typography>
        </Box>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;