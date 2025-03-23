import { SxProps, Theme } from '@mui/material/styles';
import { globalsStyle } from '../../styles/globalsStyle.ts';


export const customDrawerSx = {
  topContainer: {
    display: 'flex',
    justifyContent: {
        xs: 'space-between',
    },
    alignItems: 'center',
    width: '100%',
    p: 0.5,
    mt: 2
  },
  sideContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    flexDirection: 'column',
    backgroundColor: (theme: Theme) => theme.palette.primary.main,
    height: '100vh',
  } as SxProps<Theme>,
  linkContainer: {
    width: `calc(${globalsStyle.widthDrawer} - 10%)`,
    padding: (theme: Theme) => theme.spacing(0),
  } as SxProps<Theme>,
  toolbar: {
    paddingLeft: { xs: '0', sm: '0' },
    paddingRight: { xs: '0', sm: '0' },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  listButton: {
    paddingLeft: (theme: Theme) => theme.spacing(3),
    margin: (theme: Theme) => theme.spacing(0.2),
    borderRadius: (theme: Theme) => theme.shape.borderRadius,
    color: (theme: Theme) => theme.palette.common.white,
  },
  listButtonHover: {
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: globalsStyle.colors.blueDark,
      color: (theme: Theme) => theme.palette.common.white,
    },
  } as SxProps<Theme>,
  drawerPaper: {
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    border: 'none',
  } as SxProps<Theme>,
};