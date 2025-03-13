import { SxProps, Theme } from '@mui/material/styles';

export const calendarSx = {
  container: {
    backgroundColor: (theme: Theme) => theme.palette.background.paper,
    borderRadius: (theme: Theme) => theme.shape.borderRadius, 
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as SxProps<Theme>,
  calendar: {
    '& .Mui-selected': {
      backgroundColor: (theme: Theme) => `${theme.palette.primary.main} !important`, 
      color: (theme: Theme) => `${theme.palette.common.white} !important`, 
      '&:hover': {
        backgroundColor: (theme: Theme) => `${theme.palette.primary.dark} !important`, 
      },
    },
    '& .MuiPickersDay-today': {
      border: (theme: Theme) => `1px solid ${theme.palette.primary.main} !important`, 
    },
    '& .MuiPickersDay-root.Mui-selected:focus': {
      backgroundColor: (theme: Theme) => `${theme.palette.primary.dark}`,
    },
    '& .MuiPickersDay-root:focus': {
      backgroundColor: (theme: Theme) => `${theme.palette.primary.main} !important`, 
    },
  } as SxProps<Theme>,
};