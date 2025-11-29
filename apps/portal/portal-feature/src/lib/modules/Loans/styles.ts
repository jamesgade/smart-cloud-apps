import { SxProps, Theme } from '@mui/material/styles';

// Global styles for loan modals
export const loanModalStyles = {
  // Dialog container
  dialog: {
    borderRadius: 2,
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  } as SxProps<Theme>,

  // Header with gradient background
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

  // Section icons with colors
  sectionIcons: {
    basic: { color: '#ff6b35', mr: 1 },
    amount: { color: '#4caf50', mr: 1 },
    interest: { color: '#ff9800', mr: 1 },
    eligibility: { color: '#ff6b35', mr: 1 },
    collateral: { color: '#f44336', mr: 1 },
    guarantor: { color: '#2196f3', mr: 1 },
  } as const,

  // Standard field heights
  fieldHeights: {
    single: '56px',
    multiline: '80px',
  } as const,

  // Text fields
  textField: {
    borderRadius: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
    },
  } as SxProps<Theme>,

  // Single line field
  singleLineField: {
    '& .MuiOutlinedInput-root': {
      height: '56px',
    },
  } as SxProps<Theme>,

  // Multiline field
  multilineField: {
    '& .MuiOutlinedInput-root': {
      minHeight: '80px',
    },
  } as SxProps<Theme>,

  // Form control
  formControl: {
    borderRadius: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
    },
  } as SxProps<Theme>,

  // Single line form control
  singleLineFormControl: {
    borderRadius: 2,
    '& .MuiOutlinedInput-root': {
      height: '56px',
      borderRadius: 2,
    },
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

  // Action buttons
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
export const getSectionIcon = (section: keyof typeof loanModalStyles.sectionIcons) => {
  return loanModalStyles.sectionIcons[section];
};

// Helper function to combine styles
export const combineStyles = (...styles: SxProps<Theme>[]): SxProps<Theme> => {
  return styles.reduce((acc, style) => ({ ...acc, ...style }), {});
};
