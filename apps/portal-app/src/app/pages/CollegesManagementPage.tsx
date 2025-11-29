import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Avatar,
  Tooltip,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Language as WebsiteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { collegeService, College as CollegeType } from '../services/collegeService';

// Use the College type from the service
type College = CollegeType;

// Form validation schema
const collegeSchema = z.object({
  name: z.string().min(1, 'College name is required'),
  type: z.string().min(1, 'College type is required'),
  program: z.string().min(1, 'College Program is required'),
  state: z.string().min(1, 'State is required'),
  district: z.string().optional(),
  city: z.string().optional(),
  fees: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
  rating: z.number().min(0).max(5).optional(),
  description: z.string().optional(),
  website: z.string().optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  establishedYear: z.number().min(1800).max(new Date().getFullYear()).optional(),
  affiliation: z.string().optional(),
  accreditation: z.string().optional(),
  isActive: z.boolean().default(true),
});

type CollegeFormData = z.infer<typeof collegeSchema>;

const CollegesManagementPage: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterType, setFilterType] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [collegeToDelete, setCollegeToDelete] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CollegeFormData>({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      isActive: true,
      rating: 0,
    },
  });

  // College types
  const collegeProgram = [
    'Engineering',
    'Medical',
    'Arts',
    'Science',
    'Commerce',
    'Law',
    'Agriculture',
    'Management',
    'Pharmacy',
    'Architecture',
    'Education',
    'Other',
  ];

      const collegeTypes = [
      'Public',
      'Private'
  ];

  // Indian states
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
  ];

  // Load colleges
  const loadColleges = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm || undefined,
        state: filterState || undefined,
        type: filterType || undefined,
      };
      const response = await collegeService.getColleges(params);
      setColleges(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load colleges:', error);
      showAlert('error', 'Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColleges();
  }, [page, rowsPerPage, searchTerm, filterState, filterType]);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleCreateCollege = () => {
    setEditingCollege(null);
    reset({
      isActive: true,
      rating: 0,
    });
    setOpenDialog(true);
  };

  const handleEditCollege = (college: College) => {
    setEditingCollege(college);
    reset(college);
    setOpenDialog(true);
  };

  const handleDeleteCollege = (collegeId: string) => {
    setCollegeToDelete(collegeId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (collegeToDelete) {
      try {
        await collegeService.deleteCollege(collegeToDelete);
        showAlert('success', 'College deleted successfully');
        loadColleges();
      } catch (error) {
        console.error('Failed to delete college:', error);
        showAlert('error', 'Failed to delete college');
      }
    }
    setDeleteConfirmOpen(false);
    setCollegeToDelete(null);
  };

  const onSubmit = async (data: CollegeFormData) => {
    try {
      if (editingCollege) {
        await collegeService.updateCollege(editingCollege.collegeId, data);
        showAlert('success', 'College updated successfully');
      } else {
        await collegeService.createCollege(data);
        showAlert('success', 'College created successfully');
      }
      setOpenDialog(false);
      loadColleges();
    } catch (error) {
      console.error(`Failed to ${editingCollege ? 'update' : 'create'} college:`, error);
      showAlert('error', `Failed to ${editingCollege ? 'update' : 'create'} college`);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      {alert && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Typography variant="h4" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
        Colleges Management
      </Typography>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search colleges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Filter by State</InputLabel>
                <Select
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                  label="Filter by State"
                >
                  <MenuItem value="">All States</MenuItem>
                  {indianStates.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Filter by Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Filter by Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {collegeTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateCollege}
                sx={{
                  backgroundColor: '#ff6b35',
                  '&:hover': { backgroundColor: '#e55a2b' },
                }}
              >
                Add College
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Colleges Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>College</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Program</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : colleges?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="textSecondary">No colleges found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                colleges?.map((college) => (
                  <TableRow key={college.collegeId} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={college.image}
                          sx={{ width: 40, height: 40, backgroundColor: '#ff6b35' }}
                        >
                          <SchoolIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {college.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Est. {college.establishedYear}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={college.type} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={college.program} size="small" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {college.city}, {college.state}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Rating value={college.rating} readOnly size="small" />
                        <Typography variant="body2">({college.rating})</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {college.website && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <WebsiteIcon fontSize="small" color="action" />
                            <Typography variant="caption">{college.website}</Typography>
                          </Box>
                        )}
                        {college.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="caption">{college.phone}</Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={college.isActive ? 'Active' : 'Inactive'}
                        color={college.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEditCollege(college)}
                          sx={{ color: '#ff6b35' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteCollege(college.collegeId)}
                          sx={{ color: '#f44336' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCollege ? 'Edit College' : 'Create New College'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="College Name *"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.type}>
                      <InputLabel>College Type *</InputLabel>
                      <Select {...field} label="College Type *">
                        {collegeTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
               <Grid item xs={12} md={6}>
                <Controller
                  name="program"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.type}>
                      <InputLabel>College Program *</InputLabel>
                      <Select {...field} label="College Program *">
                        {collegeProgram.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.state}>
                      <InputLabel>State *</InputLabel>
                      <Select {...field} label="State *">
                        {indianStates.map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="City"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="district"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="District"
                      error={!!errors.district}
                      helperText={errors.district?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="establishedYear"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Established Year"
                      type="number"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      error={!!errors.establishedYear}
                      helperText={errors.establishedYear?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="website"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Website"
                      error={!!errors.website}
                      helperText={errors.website?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="fees"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Fees"
                      error={!!errors.fees}
                      helperText={errors.fees?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="affiliation"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Affiliation"
                      error={!!errors.affiliation}
                      helperText={errors.affiliation?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="accreditation"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Accreditation"
                      error={!!errors.accreditation}
                      helperText={errors.accreditation?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Address"
                      multiline
                      rows={2}
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Description"
                      multiline
                      rows={3}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Image URL"
                      error={!!errors.image}
                      helperText={errors.image?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography>Rating:</Typography>
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <Rating
                        {...field}
                        onChange={(event, newValue) => field.onChange(newValue || 0)}
                      />
                    )}
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                backgroundColor: '#ff6b35',
                '&:hover': { backgroundColor: '#e55a2b' },
              }}
            >
              {isSubmitting ? <CircularProgress size={20} /> : editingCollege ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this college? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CollegesManagementPage;