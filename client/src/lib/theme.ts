import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5A8D7D', // Muted earthy green
      light: '#7CB0A1',
      dark: '#3D6E5F',
      contrastText: '#F0F2F0', // Soft off-white
    },
    secondary: {
      main: '#D4B28C', // Soft gold/beige
      light: '#E1C7A9',
      dark: '#A98C6A',
      contrastText: '#333333', // Dark text for contrast
    },
    background: {
      default: '#F4F4F2', // Soft light grey/beige
      paper: '#FFFFFF', // Keep paper white for now, can adjust later if needed
    },
    text: {
      primary: '#333333', // Dark grey for primary text
      secondary: '#555555', // Slightly lighter grey for secondary text
    },
    // Add other colors like error, warning, info, success if needed
    error: {
      main: '#E57373',
    },
    warning: {
      main: '#FFB74D',
    },
    info: {
      main: '#64B5F6',
    },
    success: {
      main: '#81C784',
    },
  },
  typography: {
    fontFamily: '"Merriweather", "Georgia", serif', // Using a classic serif font for headings
    // You might want a different font for body text, e.e., '"Roboto", "Helvetica", "Arial", sans-serif'
    h1: {
      fontSize: '3rem', // Increased size for more impact
      fontWeight: 700,
      color: '#3D6E5F', // Darker green for headings
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#3D6E5F',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#3D6E5F',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.2rem',
      fontWeight: 500,
    },
    body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
    },
    body2: {
        fontSize: '0.9rem',
        lineHeight: 1.5,
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 20px', // Adjusted padding
        },
        containedPrimary: {
            // Styles for primary contained buttons
            backgroundColor: '#5A8D7D',
            color: '#F0F2F0',
            '&:hover': {
                backgroundColor: '#3D6E5F',
            },
        },
         outlinedPrimary: {
            // Styles for primary outlined buttons
            color: '#5A8D7D',
            borderColor: '#5A8D7D',
             '&:hover': {
                borderColor: '#3D6E5F',
                color: '#3D6E5F',
                backgroundColor: 'rgba(90, 141, 125, 0.05)', // Slight hover background
            },
        }
        // You can add styles for other button variants and colors here
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', // Slightly stronger shadow
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)', // More prominent shadow on hover
          }
        },
      },
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                // Basic styling for text fields
                '.MuiOutlinedInput-root': {
                    borderRadius: 4,
                }
            }
        }
    }
    // Add more component overrides here (e.g., MuiAppBar, MuiContainer, etc.)
  },
});

export default theme;