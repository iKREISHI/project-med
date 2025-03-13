import { createTheme } from '@mui/material/styles';
import { globalsStyle } from "../../../../5_Shared/styles/globalsStyle"

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
      main: '#21548B', 
    },
    secondary: {
      main: '#0c6c7c', 
    },
    grey: {
      100: '#202020',
      500: '#757575',
      900: '#dcdcdc',
    },
  },
  typography: {
    h1: { fontSize: globalsStyle.fontSizes.h1 }, 
    h2: { fontSize: globalsStyle.fontSizes.h2 }, 
    body1: { fontSize: globalsStyle.fontSizes.body1 }, 
    body2: { fontSize: globalsStyle.fontSizes.body2 }, 
  },
  shape: {
    borderRadius: 5, 
  },
});