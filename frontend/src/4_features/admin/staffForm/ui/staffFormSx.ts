// @ts-nocheck
// @ts-nocheck
import { SxProps, Theme } from '@mui/material/styles';
import { globalsStyle } from '@6_shared/styles/globalsStyle';

export const staffFormSx = {

  container: {
    display: 'flex',
    gap: (theme: Theme) => theme.spacing(2),
    width: '100%',
    backgroundColor: (theme: Theme) => theme.palette.background.paper,
    height: "60vh",
  } as SxProps<Theme>,
  containerMain: {
    width: '100%',
    backgroundColor: (theme: Theme) => theme.palette.background.paper,
    boxShadow: globalsStyle.boxShadow,
    borderRadius: (theme: Theme) => theme.shape.borderRadius,
    overflow: 'hidden',
    overflowY: "auto",
  } as SxProps<Theme>,
  inputContainer: {
    display: {sm:'flex'}, 
    alignItems: 'center',
     gap: '10px'
  } as SxProps<Theme>,
  radioCheck: {
      '& .css-1bz1rr0-MuiSvgIcon-root': {
        zIndex: '1',
      },
      '& .css-z8nmqa-MuiSvgIcon-root': {
        zIndex: '4',
      }
  } as SxProps<Theme>
};