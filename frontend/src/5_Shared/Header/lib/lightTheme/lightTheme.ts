import { createTheme } from '@mui/material/styles';
import { globalsStyle } from "../../../../5_Shared/styles/globalsStyle"

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5',
      paper: globalsStyle.colors.white, 
    },
    text: {
      primary: globalsStyle.colors.black, 
      secondary: globalsStyle.colors.greyDark, 
    },
    primary: {
      main: globalsStyle.colors.blue,
    },
    secondary: {
      main: globalsStyle.colors.blueDark, 
    },
    grey: {
      100: globalsStyle.colors.greyLight, 
      500: globalsStyle.colors.grey, 
      900: globalsStyle.colors.greyDark, 
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
