import { SxProps, Theme } from '@mui/material/styles';

// Global styles for scholarship modals - matching loan management design
export const scholarshipModalStyles = {
  // Dialog container
  dialog: {
    borderRadius: 2,
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  } as SxProps<Theme>,

  // Header with gradient background - same as loans
  header: {
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
    color: 'white',
    py: 3,
    px: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  } as SxProps<Theme>,

  // Section cards
  sectionCard: {
    mb: 4,
    border: '1px solid #e0e0e0',
  } as SxProps<Theme>,

  // Section headers
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    mb: 3,
  } as SxProps<Theme>,

  // Section icons with colors - matching loan management
  sectionIcons: {
    basic: { color: '#ff6b35', mr: 1 },
    eligibility: { color: '#ff6b35', mr: 1 },
    courses: { color: '#ff9800', mr: 1 },
    amount: { color: '#4caf50', mr: 1 },
    application: { color: '#f44336', mr: 1 },
    dates: { color: '#2196f3', mr: 1 },
  } as const,

  // Standard field heights - fixed dimensions for consistency
  fieldHeights: {
    single: '56px',
    multiline: '120px', // Increased for better consistency
  } as const,

  // Fixed widths for all fields
  fieldWidths: {
    full: '100%',
    half: '48%',
    third: '31%',
    quarter: '23%',
  } as const,

  // Text fields
  textField: {
    borderRadius: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
    },
  } as SxProps<Theme>,

  // Single line field - fixed height
  singleLineField: {
    '& .MuiOutlinedInput-root': {
      height: '56px',
      minHeight: '56px',
      maxHeight: '56px',
    },
  } as SxProps<Theme>,

  // Multiline field - fixed height
  multilineField: {
    '& .MuiOutlinedInput-root': {
      height: '120px',
      minHeight: '120px',
      maxHeight: '120px',
    },
  } as SxProps<Theme>,

  // Fixed height for all text areas
  fixedHeightField: {
    '& .MuiOutlinedInput-root': {
      height: '120px',
      minHeight: '120px',
      maxHeight: '120px',
      overflow: 'auto',
    },
  } as SxProps<Theme>,

  // Form control
  formControl: {
    borderRadius: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
    },
  } as SxProps<Theme>,

  // Single line form control - fixed height
  singleLineFormControl: {
    borderRadius: 2,
    '& .MuiOutlinedInput-root': {
      height: '56px',
      minHeight: '56px',
      maxHeight: '56px',
      borderRadius: 2,
    },
  } as SxProps<Theme>,

  // Fixed dimensions for all form elements
  fixedDimensions: {
    width: '100%',
    minWidth: '200px',
    maxWidth: '100%',
  } as SxProps<Theme>,

  // Input adornment
  inputAdornment: {
    borderRadius: 2,
    height: '56px',
  } as SxProps<Theme>,

  // Paper for requirements sections
  requirementsPaper: {
    p: 2,
    border: '1px solid #e0e0e0',
    borderRadius: 2,
  } as SxProps<Theme>,

  // Requirements section headers
  requirementsHeader: {
    display: 'flex',
    alignItems: 'center',
    mb: 1.5,
  } as SxProps<Theme>,

  // Action buttons - same orange as loans
  actionButton: {
    backgroundColor: '#ff6b35',
    '&:hover': {
      backgroundColor: '#e55a2b',
    },
  } as SxProps<Theme>,

  // Cancel button
  cancelButton: {
    color: 'text.secondary',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  } as SxProps<Theme>,
};

// Helper function to get section icon
export const getSectionIcon = (section: keyof typeof scholarshipModalStyles.sectionIcons) => {
  return scholarshipModalStyles.sectionIcons[section];
};

// Helper function to combine styles
export const combineStyles = (...styles: SxProps<Theme>[]): SxProps<Theme> => {
  return styles.reduce((acc, style) => ({ ...acc, ...style }), {});
};
