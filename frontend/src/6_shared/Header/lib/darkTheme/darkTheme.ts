import { createTheme } from '@mui/material/styles';
import { globalsStyle } from "../../../../6_shared/styles/globalsStyle"

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#2b2b2b', //#2b2b2b 202020
      paper: '#333333',  
    },
    text: {
      primary: '#ffffff',
      secondary: '#dcdcdc', 
    },
    primary: {
      main: globalsStyle.colors.blue, 
    },
    secondary: {
      main: '#0c6c7c', 
    },
    grey: {
      100: globalsStyle.colors.grey900,
      200: globalsStyle.colors.grey800,
      300: globalsStyle.colors.grey700,
      400: globalsStyle.colors.grey600,
      500: globalsStyle.colors.grey500,
      600: globalsStyle.colors.grey400,
      700: globalsStyle.colors.grey300,
      800: globalsStyle.colors.grey200,
      900: globalsStyle.colors.grey100,

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