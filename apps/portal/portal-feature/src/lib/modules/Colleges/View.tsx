import React from 'react';
import { useShow, useGetIdentity } from '@refinedev/core';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  Rating,
  IconButton,
  Link,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Language as WebsiteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';

interface College {
  collegeId: string;
  name: string;
  type: string;
  state: string;
  district?: string;
  city?: string;
  fees?: string;
  image?: string;
  rating?: number;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  establishedYear?: number;
  affiliation?: string;
  accreditation?: string;
  isActive: boolean;
}

export const CollegeView: React.FC = () => {
  const { data: user } = useGetIdentity();
  const { query } = useShow<College>({
    resource: 'colleges',
  });

  const college = query?.data?.data;
  const isLoading = query?.isLoading;
  
  // Check if user is a student
  const isStudent = user?.userTypeName?.toLowerCase() === 'student' || user?.roleName?.toLowerCase() === 'student';

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!college) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          College not found
        </Typography>
      </Box>
    );
  }

  // Hide inactive colleges from students
  if (isStudent && !college.isActive) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          College not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid>
              <Avatar
                src={college.image}
                sx={{ width: 100, height: 100, backgroundColor: '#ff6b35' }}
              >
                <SchoolIcon sx={{ fontSize: 50 }} />
              </Avatar>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                  {college.name}
                </Typography>
                <Chip
                  label={college.isActive ? 'Active' : 'Inactive'}
                  color={college.isActive ? 'success' : 'default'}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                <Chip label={college.type} />
                {college.rating && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Rating value={college.rating} readOnly size="small" />
                    <Typography variant="body2">({college.rating})</Typography>
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationIcon fontSize="small" color="action" />
                <Typography variant="body1" color="text.secondary">
                  {college.city ? `${college.city}, ` : ''}
                  {college.district ? `${college.district}, ` : ''}
                  {college.state}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Basic Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {college.establishedYear && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Established:
                    </Typography>
                    <Typography variant="body2">{college.establishedYear}</Typography>
                  </Box>
                )}
                {college.affiliation && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Affiliation:
                    </Typography>
                    <Typography variant="body2">{college.affiliation}</Typography>
                  </Box>
                )}
                {college.accreditation && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VerifiedIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Accreditation:
                    </Typography>
                    <Typography variant="body2">{college.accreditation}</Typography>
                  </Box>
                )}
                {college.fees && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Fees:
                    </Typography>
                    <Typography variant="body2">{college.fees}</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {college.website && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WebsiteIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Website:
                    </Typography>
                    <Link
                      href={college.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                    >
                      {college.website}
                    </Link>
                  </Box>
                )}
                {college.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Phone:
                    </Typography>
                    <Link href={`tel:${college.phone}`} variant="body2">
                      {college.phone}
                    </Link>
                  </Box>
                )}
                {college.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Email:
                    </Typography>
                    <Link href={`mailto:${college.email}`} variant="body2">
                      {college.email}
                    </Link>
                  </Box>
                )}
                {college.address && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Address:
                    </Typography>
                    <Typography variant="body2">{college.address}</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Description */}
        {college.description && (
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  {college.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CollegeView;