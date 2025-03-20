import { createTheme } from '@mui/material/styles';
import { globalsStyle } from "../../../../6_shared/styles/globalsStyle"

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5',
      paper: globalsStyle.colors.white, 
    },
    text: {
      primary: globalsStyle.colors.black, 
      secondary: globalsStyle.colors.grey900, 
    },
    primary: {
      main: globalsStyle.colors.blue,
    },
    secondary: {
      main: globalsStyle.colors.blueDark, 
    },
    grey: {
      100: globalsStyle.colors.grey100,
      200: globalsStyle.colors.grey200,
      300: globalsStyle.colors.grey300,
      400: globalsStyle.colors.grey400,
      500: globalsStyle.colors.grey500,
      600: globalsStyle.colors.grey600,
      700: globalsStyle.colors.grey700,
      800: globalsStyle.colors.grey800,
      900: globalsStyle.colors.grey900,
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
    borderRadius: 4,
  },
});
