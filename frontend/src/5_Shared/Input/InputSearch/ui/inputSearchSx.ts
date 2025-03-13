import { SxProps, Theme } from '@mui/material/styles';

export const inputSearchSx = {
  input: {
    backgroundColor: 'transparent',
    padding: '0',
    width: '100%',
    borderRadius: (theme: Theme) => theme.shape.borderRadius,
    boxShadow: '0 0 5px rgba(255, 255, 255, 0.2)',

    '&::placeholder': {
      color: (theme: Theme) => theme.palette.text.secondary, 
      opacity: 1,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: 'none',
      },
      '&:hover fieldset': {
        border: 'none',
      },
      '&.Mui-focused fieldset': {
        border: 'none',
      },
      '& .MuiOutlinedInput-input': {
        padding: (theme: Theme) => theme.spacing(1.7),
        color: (theme: Theme) => theme.palette.common.white,
      },
    },
  } as SxProps<Theme>,
  container: {
    padding: (theme: Theme) => theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  } as SxProps<Theme>,
  iconSearch: {
    minWidth: 0,
    height: '100%',
    padding: 0,
    color: (theme: Theme) => theme.palette.common.white,
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  } as SxProps<Theme>,
};