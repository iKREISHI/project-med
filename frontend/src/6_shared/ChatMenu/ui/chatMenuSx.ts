import { SxProps, Theme } from '@mui/material/styles';

export const chatMenuSx = {
  sideContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    flexDirection: 'column',
    backgroundColor: (theme: Theme) => theme.palette.primary.main,
    height: '80vh',
  } as SxProps<Theme>,

  listButton: {
    paddingLeft: (theme: Theme) => theme.spacing(3),
    marginBottom: 0.5,
  },
  listButtonHover: {
    transition: 'all 0.2s ease-in-out',
    // '&:hover': {
    //   backgroundColor: (theme: Theme) => theme.palette.grey[400],
    //   color: (theme: Theme) => theme.palette.common.white,
    // },
  } as SxProps<Theme>,
};