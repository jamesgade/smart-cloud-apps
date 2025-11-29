import React, { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Divider,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  PhoneCallback as FollowupIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router'
import { useGetIdentity, usePermissions } from '@refinedev/core'
import { authProvider } from '../../../libs/authProvider'
import { routesMenuConfig, filterMenuByPermissions } from './MenuConfig'
import MenuRenderer from './MenuRenderer'
import ProfilePopup from '../../ProfilePopup'
import logo from '../../../assets/images/campus_yatra_logo.png'
import axios from 'axios'
import { API_BASE_URL } from '../../../libs/constants'

const drawerWidth = 240

interface AppLayoutProps {
  children?: React.ReactNode;
}

// Create a simple cache outside component to persist across re-renders
const componentCache = {
  user: null as any,
  permissions: null as any,
  userLoaded: false,
  permissionsLoaded: false,
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [followupCount, setFollowupCount] = useState(0);
  const navigate = useNavigate()
  const location = useLocation()
  const openMenu = Boolean(anchorEl);

  // Only call hooks if data not already cached
  const shouldFetchUser = !componentCache.userLoaded && !componentCache.user
  const shouldFetchPermissions = !componentCache.permissionsLoaded && !componentCache.permissions

  // Use direct Refine hooks conditionally
  const { data: user, isLoading: userLoading, error: userError } = useGetIdentity()
  const { data: permissions, isLoading: permissionsLoading } = usePermissions({})

  // Cache the data when received
  useEffect(() => {
    if (user && !componentCache.userLoaded) {
      componentCache.user = user
      componentCache.userLoaded = true
    }
  }, [user])

  useEffect(() => {
    if (permissions && !componentCache.permissionsLoaded) {
      componentCache.permissions = permissions
      componentCache.permissionsLoaded = true
    }
  }, [permissions])

  // Use cached data if available
  const currentUser = componentCache.user || user
  const currentPermissions = componentCache.permissions || permissions
  const isUserLoading = componentCache.userLoaded ? false : userLoading
  const isPermissionsLoading = componentCache.permissionsLoaded ? false : permissionsLoading

  // Cache permission lookup with useMemo for better performance
  const permissionSet = React.useMemo(() => {
    if (!currentPermissions?.data) return new Set();
    return new Set(currentPermissions.data.map((p: any) => p.actionName));
  }, [currentPermissions?.data]);

  // Helper function to check permissions with Set lookup (O(1) instead of O(n))
  const hasPermission = React.useCallback((permission: string) => {
    return permissionSet.has(permission);
  }, [permissionSet]);

  const error = userError

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN_KEY');
        if (!token || !currentUser) return;

        const userType = currentUser.userTypeName || currentUser.roleName || '';
        const isAdminOrCounsellor = ['Admin', 'Manager', 'Senior Counsellor', 'Counsellor'].includes(userType);
        const isStudent = userType === 'Student' || userType?.toLowerCase() === 'student';
        
        const apiBaseUrl = API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/api';

        if (isStudent) {
          // For students, fetch confirmed appointments
          const apiUrl = `${apiBaseUrl}/appointments`;
          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const allAppointments = Array.isArray(response.data?.data) 
            ? response.data.data 
            : (Array.isArray(response.data) ? response.data : []);

          // Filter for confirmed appointments only
          const confirmedAppointments = allAppointments.filter(
            (apt: any) => apt.status?.status_code === 'CONFIRMED'
          );

          setNotificationCount(confirmedAppointments.length);
        } else if (isAdminOrCounsellor) {
          // For admins/counsellors, fetch pending applications
          const apiUrl = `${apiBaseUrl}/applications/pending`;
          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          const pendingApplications = response.data || [];
          setNotificationCount(pendingApplications.length);
        } else {
          setNotificationCount(0);
        }
      } catch (err) {
        // Don't show error to user, just set count to 0
        setNotificationCount(0);
      }
    };

    if (currentUser && !isUserLoading) {
      fetchNotificationCount();
      // Refresh notification count every 30 seconds
      const interval = setInterval(fetchNotificationCount, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser, isUserLoading]);

  // Fetch followup count
  useEffect(() => {
    const fetchFollowupCount = async () => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN_KEY');
        if (!token || !currentUser) return;

        // Only fetch followups for admins/counsellors (not students)
        const userType = currentUser.userTypeName || currentUser.roleName || '';
        const isAdminOrCounsellor = ['Admin', 'Manager', 'Senior Counsellor', 'Counsellor'].includes(userType);
        
        if (!isAdminOrCounsellor) {
          setFollowupCount(0);
          return;
        }

        // Check if user has FOLLOWUP_MENU permission
        if (!hasPermission('FOLLOWUP_MENU')) {
          setFollowupCount(0);
          return;
        }

        // Construct API URL
        const apiBaseUrl = API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/api';
        const apiUrl = `${apiBaseUrl}/auth/assigned-students/followups`;

        // Fetch followups for assigned students
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const followups = response.data || [];
        // Filter out completed followups from the count
        const activeFollowups = followups.filter((followup: any) => followup.status !== 'COMPLETED');
        setFollowupCount(activeFollowups.length);
      } catch (err) {
        console.error('Error fetching followup count:', err);
        // Don't show error to user, just set count to 0
        setFollowupCount(0);
      }
    };

    if (currentUser && !isUserLoading && currentPermissions?.data) {
      fetchFollowupCount();
      // Refresh followup count every 30 seconds
      const interval = setInterval(fetchFollowupCount, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser, isUserLoading, currentPermissions?.data, hasPermission]);

  // Handle authentication errors
  useEffect(() => {
    if (error) {
      console.error('Authentication error:', error)
      navigate('/')
    }
  }, [error, navigate])

  // Check if user has valid token - optimize to avoid unnecessary navigation calls
  useEffect(() => {
    const token = localStorage.getItem('ACCESS_TOKEN_KEY')
    if (!token && !isUserLoading && !currentUser) {
      navigate('/')
    }
  }, [isUserLoading, currentUser, navigate])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  // Filter menu items based on user permissions and type with memoization
  const filteredMenuItems = React.useMemo(() => {
    if (!currentUser || !currentPermissions?.data) return [];

    return filterMenuByPermissions(
      routesMenuConfig,
      hasPermission,
      currentUser?.userTypeName || currentUser?.roleName || ''
    );
  }, [currentUser, currentPermissions?.data, hasPermission]);

  const handleMenuClick = (path: string) => {
    navigate(path)
    setMobileOpen(false)
  }

  const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(" ");
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  const handleFollowupsClick = () => {
    navigate('/followups');
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      // Clear the component cache on logout
      componentCache.user = null;
      componentCache.permissions = null;
      componentCache.userLoaded = false;
      componentCache.permissionsLoaded = false;

      const result = await authProvider.logout({});
      if (result.success) {
        navigate(result.redirectTo || '/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback logout - clear tokens and cache, then redirect
      componentCache.user = null;
      componentCache.permissions = null;
      componentCache.userLoaded = false;
      componentCache.permissionsLoaded = false;

      localStorage.removeItem('ACCESS_TOKEN_KEY');
      localStorage.removeItem('REFRESH_TOKEN');
      localStorage.removeItem('IDENTIFIER');
      navigate('/');
      handleMenuClose();
    }
  }

  // Show loading state only while user is loading - render layout immediately when user loads
  if (isUserLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Profile Section */}
      <Box sx={{ p: 2, pb: 0, margin: '0 auto' }}>
        <img
          src={logo}
          alt="Campus Yatra"
          style={{ height: 40 }}
        />
      </Box>

      <Divider />

      {/* Dynamic Menu Items */}
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#ccc',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#aaa',
        },
      }}>
        {isPermissionsLoading ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 2
          }}>
            <CircularProgress size={20} />
            <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>Loading menu...</Typography>
          </Box>
        ) : (
          <MenuRenderer
            menuItems={filteredMenuItems}
            onMenuClick={handleMenuClick}
            currentPath={location.pathname}
          />
        )}
      </Box>
    </Box>
  )

  // If no user data and not loading, something went wrong
  if (!currentUser && !isUserLoading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Typography>Unable to load user data</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar>
          {/* Mobile menu button (left side) */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: '#ff6b35' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo (left side) */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="img"
              src={logo}
              alt="Campus Yatra"
              style={{ height: 40 }}
              sx={{ display: { sm: 'none' } }}
            />
          </Box>

          {/* Spacer to push avatar to the right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Followups Icon */}
          {hasPermission('FOLLOWUP_MENU') && (
            <IconButton
              onClick={handleFollowupsClick}
              sx={{
                color: '#666',
                mr: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  color: '#ff6b35',
                },
              }}
            >
              {followupCount > 0 ? (
                <Badge badgeContent={followupCount} color="error">
                  <FollowupIcon />
                </Badge>
              ) : (
                <FollowupIcon />
              )}
            </IconButton>
          )}

          {/* Notifications Icon */}
          <IconButton
            onClick={handleNotificationsClick}
            sx={{
              color: '#666',
              mr: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                color: '#ff6b35',
              },
            }}
          >
            {notificationCount > 0 ? (
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            ) : (
              <NotificationsIcon />
            )}
          </IconButton>

          {/* Avatar at the end */}
          <Avatar
            src={user?.avatars}
            alt={user?.name}
            onClick={handleProfileMenuOpen}
            sx={{
              backgroundColor: '#ff6b35',
              cursor: 'pointer',
              color: '#fff',
              width: 48,
              height: 48,
            }}
          >
            {currentUser.userName ? (
              getInitials(currentUser.userName)
            ) : (
              <PersonIcon />
            )}
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem
              onClick={() => {
                setProfilePopupOpen(true);
                handleMenuClose();
              }}
            >
              My Profile
            </MenuItem>
            {/* <MenuItem onClick={handleMenuClose}>Settings</MenuItem> */}
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid #e0e0e0',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid #e0e0e0',
              backgroundColor: '#fafafa',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children || <Outlet />}
      </Box>
      
      {/* Profile Popup */}
      <ProfilePopup 
        open={profilePopupOpen} 
        onClose={() => setProfilePopupOpen(false)} 
      />
    </Box>
  )
}

export default AppLayout