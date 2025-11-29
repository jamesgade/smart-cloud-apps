import React, { useEffect } from 'react';
import {
  useList,
} from '@refinedev/core';
import CreateUserModal from './Create';
import EditUserModal from './Edit';
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Pagination,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  userType?: {
    name: string;
  };
  userAssignRoles?: Array<{
    roleId: string;
    role: {
      id: string;
      title: string;
      description?: string;
    };
  }>;
}

export const UserList: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editUserId, setEditUserId] = React.useState<string | null>(null);

  const { query } = useList<User>({
    resource: 'provider',
    filters: [
      {
        field: 'page',
        operator: 'eq',
        value: page + 1,
      },
      {
        field: 'pageSize',
        operator: 'eq',
        value: rowsPerPage,
      },
    ],
    queryOptions: {
      queryKey: ['provider-list', page, rowsPerPage],
      enabled: true,
    },
  });

  const data = query?.data?.data?.data || [];
  const isLoading = query?.isLoading;
  const total = query?.data?.data?.total || query?.data?.total || 0;
  const pageCount = query?.data?.data?.pageCount || Math.ceil(total / rowsPerPage);

  const handleCreateSuccess = () => {
    query?.refetch?.();
  };

  const handleEditSuccess = () => {
    query?.refetch?.();
    setEditModalOpen(false);
    setEditUserId(null);
  };
  
  

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, userId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleEdit = () => {
    if (selectedUserId) {
      setEditUserId(selectedUserId);
      setEditModalOpen(true);
    }
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedUserId) {
      // Navigate to view page or open view modal
    }
    handleMenuClose();
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };


  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'invitation-sent':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Create Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{
            backgroundColor: '#ff6b35',
            '&:hover': {
              backgroundColor: '#e55a2b',
            },
          }}
        >
          Create User
        </Button>
      </Box>

      {/* Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>First Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Last Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">No users found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((user: User) => (
                    <TableRow key={user.userId} hover>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.userAssignRoles?.map((userRole, index) => (
                          <Chip
                            key={userRole.roleId}
                            label={userRole.role?.title || 'Unknown Role'}
                            size="small"
                            variant="filled"
                            sx={{
                              backgroundColor: '#e3f2fd',
                              color: '#1976d2',
                              marginRight: index < user.userAssignRoles!.length - 1 ? 1 : 0,
                              marginBottom: 0.5,
                            }}
                          />
                        )) || '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          color={getStatusColor(user.status) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <IconButton
                          onClick={(event) => handleMenuClick(event, user.userId)}
                          size="small"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          <Box sx={{ 
            borderTop: '1px solid #e0e0e0', 
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="body2" color="text.secondary">
              Showing {((page) * rowsPerPage) + 1}-{Math.min((page + 1) * rowsPerPage, total)} of {total} results
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center">
              {total > 0 && (
                <Pagination
                  count={pageCount}
                  page={page + 1}
                  onChange={(event, value) => handleChangePage(event, value - 1)}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#666',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#ff6b35',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#e55a2b',
                        },
                      },
                    },
                  }}
                />
              )}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
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
        <MenuItem onClick={handleView} sx={{ gap: 1 }}>
          <ViewIcon fontSize="small" />
          View
        </MenuItem>
        <MenuItem onClick={handleEdit} sx={{ gap: 1 }}>
          <EditIcon fontSize="small" />
          Edit
        </MenuItem>
      </Menu>

      {/* Create User Modal */}
      <CreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit User Modal */}
      <EditUserModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditUserId(null);
        }}
        onSuccess={handleEditSuccess}
        userId={editUserId}
      />
    </Box>
  );
};

export default UserList;