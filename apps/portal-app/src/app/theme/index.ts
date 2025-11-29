import { createTheme, responsiveFontSizes } from "@mui/material";


const customLightTheme = createTheme({
  typography: {
    fontFamily: "Inter",
  },
  palette: {
    // mode: 'light',
    primary: {
      main: '#FF6B35',
      light: '#FF8C42',
      dark: '#E55A2B',
      "50": "#FFF3E0",
      "500": "#FF6B35",
      "800": '#E55A2B',
    },
    secondary: {
      main: '#fff',
      "500": '#fff'
    },
    background: {
      default: 'rgba(255, 107, 53, 0.05)',
      paper: '#fff',
    }
  },
  components: {
    MuiOutlinedInput : {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem'
        }
      }
    },
    // MuiSvgIcon: {
    //   styleOverrides : {
    //     root: {
    //       color: '#33385D',
    //     }
    //   }
    // },
  },
})

const customDarkTheme = createTheme({
  typography: {
    fontFamily: "Inter",
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6B35',
      light: '#FF8C42',
      dark: '#E55A2B',
      "500": "#FF6B35",
      "600": "#E55A2B",
      "800": '#E55A2B',
    },
    background: {
      default: '#2c3051',
      paper: '#33385D',
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2c3051',
        },
      },
    },
    MuiOutlinedInput : {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem'
        }
      }
    },
    // MuiSvgIcon: {
    //   styleOverrides : {
    //     root: {
    //       color: '#fff',
    //     }
    //   }
    // },
  },
})

export const SESLightTheme = responsiveFontSizes(customLightTheme);
export const SESDarkTheme = responsiveFontSizes(customDarkTheme);
