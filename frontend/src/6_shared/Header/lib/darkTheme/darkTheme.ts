// @ts-nocheck
// @ts-nocheck
import { createTheme } from '@mui/material/styles';
import { globalsStyle } from "@6_shared/styles/globalsStyle"
import { grey } from '@mui/material/colors';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
    default: '#2b2b2b',
      paper: '#333333',  
    },
    text: {
      primary: globalsStyle.colors.white,
      secondary: '#dcdcdc', 
    },
    primary: {
      main: globalsStyle.colors.blue, 
    },
    secondary: {
      main: '#0c6c7c', 
    },
    grey: {
      100: grey[900],
      200: grey[800],
      300: grey[700],
      400: grey[600],
      500: grey[500],
      600: grey[400],
      700: grey[300],
      800: grey[200],
      900: grey[100],

    }, 
  },
  typography: {
    h1: { fontSize: globalsStyle.fontSizes.h1 }, 
    h2: { fontSize: globalsStyle.fontSizes.h2 }, 
    h6: { fontSize: globalsStyle.fontSizes.h6 }, 
    body1: { fontSize: globalsStyle.fontSizes.body1 }, 
    body2: { fontSize: globalsStyle.fontSizes.body2 }, 
  },
  shape: {
    borderRadius: 5, 
  },
});