import { Theme } from '@mui/material/styles';
import { globalsStyle } from '../../../styles/globalsStyle';

export const inputFormSx = {
  input: {
    backgroundColor: 'transparent',
    padding: 0.5,
    pl: 1,
    border: (theme: Theme) => `1px solid ${theme.palette.grey[400]}`,
    borderRadius: 1,
    "&:hover:not(.Mui-disabled)": {
      borderColor: (theme: Theme) => theme.palette.grey[900],
    },
    "&.Mui-focused": {
      borderColor: globalsStyle.colors.blueDark,
    },
    transition: "border-color 0.3s ease",
    "& input[type='date']::-webkit-calendar-picker-indicator": {
      filter: (theme: Theme) => (theme.palette.mode === 'dark' ? 'invert(1)' : 'invert(0)'),
    },
    "& input[type='date']::-moz-calendar-picker-indicator": {
      filter: (theme: Theme) => (theme.palette.mode === 'dark' ? 'invert(1)' : 'invert(0)'),
    },
    "& input[disabled]": {
      cursor: 'not-allowed',
    },
    ".css-yimnyd-MuiInputBase-input.Mui-disabled": {
      '-webkit-text-fill-color':  (theme: Theme) => theme.palette.grey[900],
  }

  },
};