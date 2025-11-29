import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOne, useNotification, useUpdate , useSelect} from '@refinedev/core';

const editUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleInitial: z.string().optional(),
  userAssignRoles: z.string().min(1, 'At least one role is required'),
  status: z.string().optional(),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userId: string | null;
}


const userRoles = [
  { id: '589900b3-0413-4328-8859-e8c0ff3cc9b8', name: 'Admin' },
  { id: '4ccb49d7-359b-45bd-b24b-1a337c7bd458', name: 'Manager' },
  { id: '6563c720-a750-44cc-b3a4-79c1aaa2abe4', name: 'Senior Counsellor' },
  { id: '5d415ea6-84dd-490a-b790-b8f5a314c47e', name: 'Counsellor' },
  { id: '85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', name: 'Student' },
];

const statusOptions = [
  { id: 'ACTIVE', name: 'ACTIVE' },
  { id: 'IN-ACTIVE', name: 'IN-ACTIVE' },
  { id: 'INVITATION-SENT', name: 'INVITATION-SENT' }
];

export const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onClose,
  onSuccess,
  userId,
}) => {
  const { mutate: updateUser ,mutation  } = useUpdate();
  const { open: notify } = useNotification();
  const isUpdating = mutation.isPending
  const { options } = useSelect({
    resource: 'common/roles',
    optionLabel: 'title',
    optionValue: 'id',
    filters: [
      {
        field: 'title',
        operator: 'ne',
        value: 'Student',
      },
    ],
  });
  // Fetch user data
  const { query } = useOne({
    resource: 'provider',
    id: userId || '',
    queryOptions: {
      enabled: !!userId && open,
    },
  });
  const userData = query?.data?.data
  const isLoadingUser = query.isLoading
  const error = query.error

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    // defaultValues: {
    //   email: '',
    //   firstName: '',
    //   lastName: '',
    //   middleInitial: '',
    //   userTypeId: '',
    //   userAssignRoles: '',
    //   status: '',
    // },
  });

  const statusValue = watch('status');

  // Populate form when user data is loaded
  useEffect(() => {
    if (userData && open) {
      const user = userData;
      // Use setValue for each field individually
      setValue('email', user.email || '');
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
      setValue('middleInitial', user.middleInitial || '');
      setValue('status', user.status || '');
      setValue('userAssignRoles', user.userAssignRoles?.[0]?.roleId);
    }
  }, [userData, setValue, open]);

  const onSubmit = (data: EditUserFormData) => {
    if (!userId) return;

    updateUser(
      {
        resource: 'provider',
        id: userId,
        values: {
          ...data,
          userTypeId: '86f0ee54-485d-4a2a-87d2-5c0853764d41',
          userAssignRoles: [data.userAssignRoles],
        },
        meta: {
          customEndpoint: `edit/${userId}`,
        },
        successNotification: false
      },
      {
        onSuccess: () => {
          notify?.({
            type: 'success',
            message: 'User updated successfully',
          });
          onSuccess?.();
          onClose();
        },
        onError: (error: any) => {
          notify?.({
            type: 'error',
            message: error?.response?.data?.message || error?.message || 'Failed to update user',
          });
        },
      }
    );
  };

  const handleClose = () => {
    // Clear all form fields
    setValue('email', '');
    setValue('firstName', '');
    setValue('lastName', '');
    setValue('middleInitial', '');
    setValue('userAssignRoles', '');
    setValue('status', '');
    onClose();
  };

  // Clear form when modal closes
  useEffect(() => {
    if (!open) {
      setValue('email', '');
      setValue('firstName', '');
      setValue('lastName', '');
      setValue('middleInitial', '');
        setValue('userAssignRoles', '');
      setValue('status', '');
    }
  }, [open, setValue]);

  if (!open) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon sx={{ color: '#ff6b35' }} />
            <Typography variant="h6" component="span">
              Edit User
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {isLoadingUser ? (
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#ff6b35' }} />
        </DialogContent>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 2 }}>
            <Stack spacing={3}>
              {/* First Name */}
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#ff6b35',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#ff6b35',
                      },
                    }}
                  />
                )}
              />

              {/* Middle Initial */}
              <Controller
                name="middleInitial"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Middle Initial (Optional)"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#ff6b35',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#ff6b35',
                      },
                    }}
                  />
                )}
              />

              {/* Last Name */}
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#ff6b35',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#ff6b35',
                      },
                    }}
                  />
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#ff6b35',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#ff6b35',
                      },
                    }}
                  />
                )}
              />


              {/* User Roles */}
              <Controller
                name="userAssignRoles"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.userAssignRoles}>
                    <InputLabel sx={{ '&.Mui-focused': { color: '#ff6b35' } }}>
                      User Roles
                    </InputLabel>
                    <Select
                      {...field}
                      label="User Roles"
                      size="medium"
                      renderValue={(selected) => {
                        const role = options.find((r) => r.value === selected);
                        return role?.label || '';
                      }}
                      sx={{
                        minHeight: '56px',
                        '& .MuiSelect-select': {
                          padding: '16.5px 14px',
                          minHeight: '23px',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#ff6b35',
                        },
                      }}
                    >
                      {options.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          {role.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.userAssignRoles && (
                      <FormHelperText>
                        {errors.userAssignRoles.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              {/* Status */}
              {statusValue === 'INVITATION-SENT' ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Status
                  </Typography>
                  <TextField
                    fullWidth
                    value="INVITATION-SENT"
                    disabled
                    sx={{
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000',
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  />
                </Box>
              ) : (
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel sx={{ '&.Mui-focused': { color: '#ff6b35' } }}>
                        Status
                      </InputLabel>
                      <Select
                        {...field}
                        label="Status"
                        size="medium"
                        sx={{
                          height: '56px',
                          '& .MuiSelect-select': {
                            padding: '16.5px 14px',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ff6b35',
                          },
                        }}
                      >
                        {statusOptions
                          .filter(status => status.id !== 'INVITATION-SENT')
                          .map((status) => (
                            <MenuItem key={status.id} value={status.id}>
                              {status.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                />
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isUpdating}
              sx={{
                backgroundColor: '#ff6b35',
                '&:hover': {
                  backgroundColor: '#e55a2b',
                },
              }}
            >
              {isUpdating ? 'Updating...' : 'Update User'}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
};

export default EditUserModal;