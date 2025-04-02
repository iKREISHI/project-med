// @ts-nocheck
import { createTheme } from '@mui/material/styles';
import { globalsStyle } from "@6_shared/styles/globalsStyle"
import { grey } from '@mui/material/colors';

import backgroundImage from '@0_app/assets/images/hospital2.jpg';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: 'rgba(0, 0, 0, 0)',
      paper: globalsStyle.colors.white, 
    },
    text: {
      primary: globalsStyle.colors.black, 
      secondary: grey[900], 
    },
    primary: {
      main: globalsStyle.colors.blue,
    },
    secondary: {
      main: globalsStyle.colors.blueDark, 
    },
    grey: {
      100: grey[100],
      200: grey[200],
      300: grey[300], 
      400: grey[400],
      500: grey[500],
      600: grey[600],
      700: grey[700],
      800: grey[800],
      900: grey[900],
    },
  },
  typography: {
    h1: { fontSize: globalsStyle.fontSizes.h1 }, 
    h2: { fontSize: globalsStyle.fontSizes.h2 }, 
    h5: { fontSize: globalsStyle.fontSizes.h5 }, 
    h6: { fontSize: globalsStyle.fontSizes.h6 }, 
    body1: { fontSize: globalsStyle.fontSizes.body1 }, 
    body2: { fontSize: globalsStyle.fontSizes.body2 }, 
  },
  shape: {
    borderRadius: 5,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          position: 'relative',
          margin: 0,
          padding: 0,
          '&::before': {
            content: '""',
            position: 'fixed',
            top: '-10px',
            left: '-10px',
            right: '-10px',
            bottom: '-10px',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(10px)',
            zIndex: -1,
          },
        },
        '#root': {
          position: 'relative',
          minHeight: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        },
      },
    },
  
  
  },
});
