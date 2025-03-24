import { Theme } from '@mui/material/styles';

export const inputFormSx = {
  input: {
    backgroundColor: 'transparent',
    padding: 0,
    "&:not(.MuiInputBase-multiline)": {
      height: "40px",
    },
    pr: 1,
    pl: 2,
    
    border: (theme: Theme) => `1px solid ${theme.palette.grey[400]}`,
    // borderRadius: 1,
    borderRadius: (theme: Theme) => theme.shape.borderRadius,
    "&:hover:not(.Mui-focused):not(.Mui-disabled)": {
      borderColor: (theme: Theme) => theme.palette.grey[500],
    },

    "&.Mui-focused": {
      borderColor: (theme: Theme) => theme.palette.grey[500],
      // borderColor: (theme: Theme) => theme.palette.primary.main,
      borderWidth: '1px'
    },
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
      '-webkit-text-fill-color': (theme: Theme) => theme.palette.grey[900],
    }

  },
};