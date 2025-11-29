import React from 'react';
import { useCreate } from '@refinedev/core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Rating,
  CircularProgress,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Chip,
  Autocomplete,
  Divider,
} from '@mui/material';

interface CreateCollegeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const collegeSchema = z.object({
  // Basic Information
  name: z.string().min(1, 'College name is required'),
  type: z.string().min(1, 'College type is required'),
  program: z.string().min(1, 'College Program is required'),
  state: z.string().min(1, 'State is required'),
  district: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  fees: z.string().nullable().optional(),
  image: z.string().url().nullable().optional().or(z.literal('')),
  rating: z.number().min(0).max(5).optional(),
  description: z.string().nullable().optional(),
  website: z.string().url().nullable().optional().or(z.literal('')),
  phone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional().or(z.literal('')),
  address: z.string().nullable().optional(),
  establishedYear: z.number().min(1800).max(new Date().getFullYear()).optional(),
  affiliation: z.string().nullable().optional(),
  accreditation: z.string().nullable().optional(),
  isActive: z.boolean(),
  
  // Academic Information (Priority 1)
  coursesOffered: z.array(z.string()).optional(),
  entranceExams: z.array(z.string()).optional(),
  cutoffPercentile: z.number().min(0).max(100).optional(),
  applicationDeadline: z.string().nullable().optional().or(z.literal('')),
  minimumPercentage: z.number().min(0).max(100).optional(),
  
  // Financial Information (Priority 2)
  tuitionFeeYearly: z.number().min(0, 'Fee must be a positive number').optional(),
  hostelFeeYearly: z.number().min(0, 'Fee must be a positive number').optional(),
  totalFeeYearly: z.number().min(0, 'Fee must be a positive number').optional(),
  scholarshipsAvailable: z.boolean().optional(),
  loanFacilities: z.boolean().optional(),
  
  // Infrastructure & Facilities (Priority 3)
  campusSizeAcres: z.number().min(0).optional(),
  hostelFacility: z.boolean().optional(),
  libraryBooksCount: z.number().min(0).optional(),
  laboratoriesCount: z.number().min(0).optional(),
  wifiFacility: z.boolean().optional(),
  
  // Student Statistics & Placement (Priority 4)
  totalStudents: z.number().min(0).optional(),
  facultyCount: z.number().min(0).optional(),
  placementPercentage: z.number().min(0).max(100).optional(),
  averageSalary: z.number().min(0).optional(),
  topRecruiters: z.array(z.string()).optional(),
});

type CollegeFormData = z.infer<typeof collegeSchema>;

const CreateCollegeModal: React.FC<CreateCollegeModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { mutate: createCollege } = useCreate();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CollegeFormData>({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      isActive: true,
      rating: 0,
      coursesOffered: [],
      entranceExams: [],
      topRecruiters: [],
      scholarshipsAvailable: false,
      loanFacilities: false,
      hostelFacility: false,
      wifiFacility: false,
    },
  });

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

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
  ];

  const entranceExams = [
    'JEE Main', 'JEE Advanced', 'NEET', 'CAT', 'MAT', 'XAT', 'SNAP', 'NMAT',
    'CMAT', 'ATMA', 'MAH CET', 'TANCET', 'KCET', 'COMEDK', 'BITSAT', 'VITEEE',
    'SRMJEE', 'WBJEE', 'MHT CET', 'AP EAMCET', 'TS EAMCET', 'Other'
  ];

  const commonCourses = [
    'Computer Science Engineering', 'Mechanical Engineering', 'Civil Engineering',
    'Electrical Engineering', 'Electronics Engineering', 'Information Technology',
    'Aerospace Engineering', 'Chemical Engineering', 'Biotechnology',
    'MBA', 'BBA', 'B.Com', 'B.Sc', 'B.A', 'B.Tech', 'M.Tech', 'M.Sc', 'M.A',
    'Medicine (MBBS)', 'Dental (BDS)', 'Pharmacy', 'Nursing', 'Law', 'Architecture'
  ];

  const topCompanies = [
    'TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'HCL', 'IBM', 'Microsoft',
    'Google', 'Amazon', 'Apple', 'Facebook', 'Oracle', 'SAP', 'Deloitte', 'PwC',
    'EY', 'KPMG', 'Goldman Sachs', 'JP Morgan', 'Morgan Stanley', 'McKinsey',
    'BCG', 'Bain', 'Reliance', 'Tata', 'Adani', 'Mahindra', 'Other'
  ];

  const onSubmit = (data: CollegeFormData) => {
    // Clean data before sending to API - convert empty strings to undefined for date fields
    const cleanedData = {
      ...data,
      applicationDeadline: data.applicationDeadline && data.applicationDeadline.trim() !== '' 
        ? data.applicationDeadline 
        : undefined,
    };
    
    setIsLoading(true);
    createCollege(
      {
        resource: 'colleges',
        values: cleanedData,
      },
      {
        onSuccess: () => {
          setIsLoading(false);
          reset();
          onClose();
          onSuccess();
        },
        onError: () => {
          setIsLoading(false);
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New College</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                  {errors.type && (
                    <FormHelperText>{errors.type.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="program"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel>College Program *</InputLabel>
                  <Select {...field} label="College Type *">
                    {collegeProgram.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.program && (
                    <FormHelperText>{errors.program.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            
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
                  {errors.state && (
                    <FormHelperText>{errors.state.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            
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
            
            {/* <Controller
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
            /> */}
            
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
            
            {/* <Controller
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
            /> */}
            
            <Controller
              name="fees"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Fees"
                  placeholder="Enter amount in lakhs (e.g., 100000 for 1 lakh)"
                  error={!!errors.fees}
                  helperText={errors.fees?.message || "Enter amount in lakhs (e.g., 100000 for 1 lakh)"}
                />
              )}
            />
            
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

            {/* Academic Information Section */}
            <Divider sx={{ my: 2 }}>
              <Typography variant="h6" color="primary">
                Academic Information
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Controller
                  name="coursesOffered"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      options={commonCourses}
                      freeSolo
                      value={field.value || []}
                      onChange={(_, newValue) => field.onChange(newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            key={index}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Courses Offered"
                          placeholder="Select or type courses"
                          error={!!errors.coursesOffered}
                          helperText={errors.coursesOffered?.message}
                        />
                      )}
                    />
                  )}
                />
              </Box>

              <Box>
                <Controller
                  name="entranceExams"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      options={entranceExams}
                      freeSolo
                      value={field.value || []}
                      onChange={(_, newValue) => field.onChange(newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            key={index}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Entrance Exams"
                          placeholder="Select or type exams"
                          error={!!errors.entranceExams}
                          helperText={errors.entranceExams?.message}
                        />
                      )}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Controller
                  name="cutoffPercentile"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Cutoff Percentile"
                      type="number"
                      inputProps={{ min: 0, max: 100, step: 0.01 }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      error={!!errors.cutoffPercentile}
                      helperText={errors.cutoffPercentile?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Controller
                  name="minimumPercentage"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Minimum Percentage"
                      type="number"
                      inputProps={{ min: 0, max: 100, step: 0.01 }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      error={!!errors.minimumPercentage}
                      helperText={errors.minimumPercentage?.message}
                    />
                  )}
                />
              </Box>

              <Box>
                <Controller
                  name="applicationDeadline"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Application Deadline"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.applicationDeadline}
                      helperText={errors.applicationDeadline?.message}
                    />
                  )}
                />
              </Box>
            </Box>

            {/* Financial Information Section */}
            <Divider sx={{ my: 2 }}>
              <Typography variant="h6" color="primary">
                Financial Information
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="tuitionFeeYearly"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Tuition Fee (Yearly)"
                      type="number"
                      placeholder="Enter amount in lakhs (e.g., 100000 for 1 lakh)"
                      inputProps={{ min: 0, step: 1000 }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      error={!!errors.tuitionFeeYearly}
                      helperText={errors.tuitionFeeYearly?.message || "Enter amount in lakhs (e.g., 100000 for 1 lakh)"}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Controller
                  name="hostelFeeYearly"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Hostel Fee (Yearly)"
                      type="number"
                      placeholder="Enter amount in lakhs (e.g., 100000 for 1 lakh)"
                      inputProps={{ min: 0, step: 1000 }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      error={!!errors.hostelFeeYearly}
                      helperText={errors.hostelFeeYearly?.message || "Enter amount in lakhs (e.g., 100000 for 1 lakh)"}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Controller
                  name="totalFeeYearly"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Total Fee (Yearly)"
                      type="number"
                      placeholder="Enter amount in lakhs (e.g., 100000 for 1 lakh)"
                      inputProps={{ min: 0, step: 1000 }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      error={!!errors.totalFeeYearly}
                      helperText={errors.totalFeeYearly?.message || "Enter amount in lakhs (e.g., 100000 for 1 lakh)"}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Controller
                  name="scholarshipsAvailable"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value || false}
                          onChange={field.onChange}
                        />
                      }
                      label="Scholarships Available"
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Controller
                  name="loanFacilities"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value || false}
                          onChange={field.onChange}
                        />
                      }
                      label="Loan Facilities"
                    />
                  )}
                />
              </Box>
            </Box>

            {/* Infrastructure & Facilities Section */}
            <Divider sx={{ my: 2 }}>
              <Typography variant="h6" color="primary">
                Infrastructure & Facilities
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="campusSizeAcres"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Campus Size (Acres)"
                      type="number"
                      inputProps={{ min: 0, step: 0.1 }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      error={!!errors.campusSizeAcres}
                      helperText={errors.campusSizeAcres?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Controller
                  name="libraryBooksCount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Library Books Count"
                      type="number"
                      inputProps={{ min: 0 }}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      error={!!errors.libraryBooksCount}
                      helperText={errors.libraryBooksCount?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Controller
                  name="laboratoriesCount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Laboratories Count"
                      type="number"
                      inputProps={{ min: 0 }}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      error={!!errors.laboratoriesCount}
                      helperText={errors.laboratoriesCount?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Controller
                  name="hostelFacility"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value || false}
                          onChange={field.onChange}
                        />
                      }
                      label="Hostel Facility"
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Controller
                  name="wifiFacility"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value || false}
                          onChange={field.onChange}
                        />
                      }
                      label="WiFi Facility"
                    />
                  )}
                />
              </Box>
            </Box>

            {/* Student Statistics & Placement Section */}
            <Divider sx={{ my: 2 }}>
              <Typography variant="h6" color="primary">
                Student Statistics & Placement
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="totalStudents"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Total Students"
                      type="number"
                      inputProps={{ min: 0 }}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      error={!!errors.totalStudents}
                      helperText={errors.totalStudents?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Controller
                  name="facultyCount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Faculty Count"
                      type="number"
                      inputProps={{ min: 0 }}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      error={!!errors.facultyCount}
                      helperText={errors.facultyCount?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Controller
                  name="placementPercentage"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Placement Percentage"
                      type="number"
                      inputProps={{ min: 0, max: 100, step: 0.01 }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      error={!!errors.placementPercentage}
                      helperText={errors.placementPercentage?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Controller
                  name="averageSalary"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Average Salary (₹)"
                      type="number"
                      inputProps={{ min: 0, step: 10000 }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      error={!!errors.averageSalary}
                      helperText={errors.averageSalary?.message}
                    />
                  )}
                />
              </Box>

              <Box>
                <Controller
                  name="topRecruiters"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      options={topCompanies}
                      freeSolo
                      value={field.value || []}
                      onChange={(_, newValue) => field.onChange(newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            key={index}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Top Recruiters"
                          placeholder="Select or type companies"
                          error={!!errors.topRecruiters}
                          helperText={errors.topRecruiters?.message}
                        />
                      )}
                    />
                  )}
                />
              </Box>
            </Box>
            
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              backgroundColor: '#ff6b35',
              '&:hover': { backgroundColor: '#e55a2b' },
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateCollegeModal;