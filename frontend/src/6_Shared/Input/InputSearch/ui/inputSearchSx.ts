import { SxProps, Theme } from '@mui/material/styles';

export const inputSearchSx = {
  input: (shadowColor: string, isDarkText?: boolean) => ({
    backgroundColor: 'transparent',
    padding: 0.7,
    pl: 1.5,
    width: '100%',
    color: (theme: Theme) => 
      isDarkText ? theme.palette.common.black : theme.palette.common.white, 
    borderRadius: (theme: Theme) => theme.shape.borderRadius,
    boxShadow: `0 0 5px ${shadowColor}`,

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
        color: (theme: Theme) => 
          isDarkText ? theme.palette.common.black : theme.palette.common.white, 
      },
    },
  }) as SxProps<Theme>,
  container: {
    padding: (theme: Theme) => theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden'
  } as SxProps<Theme>,
  iconSearch: (isDarkText?: boolean) => ({
    minWidth: 0,
    height: '100%',
    pr: 1,
    color: (theme: Theme) => 
      isDarkText ? theme.palette.common.black : theme.palette.common.white, 
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  }) as SxProps<Theme>,
};