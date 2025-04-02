// @ts-nocheck
// @ts-nocheck
import { SxProps, Theme } from '@mui/material/styles';

export const inputSearchSx = {
  input: (isDarkText?: boolean, bgcolorFlag?: boolean, ) => ({
    backgroundColor: (theme: Theme) => bgcolorFlag ? theme.palette.background.paper : 'transparent',
    padding: 0.7,
    pl: 2,
    width: '100%',
    color: (theme: Theme) =>
      isDarkText ? theme.palette.common.black : theme.palette.common.white,
    borderRadius: (theme: Theme) => theme.shape.borderRadius,

    border: (theme: Theme) => `1px solid ${theme.palette.grey[400]}`,
    "&:hover:not(.Mui-focused):not(.Mui-disabled)": {
      borderColor: (theme: Theme) => theme.palette.grey[500],
    },
    '&::placeholder': {
      color: (theme: Theme) =>
        isDarkText ? theme.palette.common.black : theme.palette.common.white,
      opacity: 1,
    },
    "&.Mui-focused": {
      borderColor: (theme: Theme) => theme.palette.grey[500],
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
    padding: 0,
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
      isDarkText ? theme.palette.grey[900] : theme.palette.common.white,
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  }) as SxProps<Theme>,
};