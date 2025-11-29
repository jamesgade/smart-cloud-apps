import React from 'react';
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
  Chip,
} from '@mui/material';
import { Close as CloseIcon, Person as PersonIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreate, useNotification, useSelect } from '@refinedev/core';

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleInitial: z.string().optional(),
  userAssignRoles: z.string().min(1, 'At least one role is required'),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}



export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { mutate: createUser, isLoading } = useCreate();
  const { open: notify } = useNotification();

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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      middleInitial: '',
      userAssignRoles: '',
    },
  });

  const onSubmit = (data: CreateUserFormData) => {
    createUser(
      {
        resource: 'provider',
        values: {...data, userTypeId: '86f0ee54-485d-4a2a-87d2-5c0853764d41', userAssignRoles:[data.userAssignRoles]},
      },
      {
        onSuccess: () => {
          notify({
            type: 'success',
            message: 'User created successfully',
          });
          reset();
          onSuccess?.();
          onClose();
        },
        onError: (error) => {
          notify({
            type: 'error',
            message: error?.message || 'Failed to create user',
          });
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

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
            <PersonIcon sx={{ color: '#ff6b35' }} />
            <Typography variant="h6" component="span">
              Create New User
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

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
                    //   multiple
                      size="medium"
                      renderValue={(selected) => {
                        const role = options?.find((r: any) => r.value === selected);
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
                      {options?.map((role: any) => (
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
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              backgroundColor: '#ff6b35',
              '&:hover': {
                backgroundColor: '#e55a2b',
              },
            }}
          >
            {isLoading ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateUserModal;
