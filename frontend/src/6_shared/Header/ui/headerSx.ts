// @ts-nocheck
// @ts-nocheck
import { SxProps, Theme } from '@mui/material/styles';
import { globalsStyle } from "../../styles/globalsStyle";

export const headerSx = {
  appBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    transition: 'background-color 0.5s ease',
    marginLeft: { sm: globalsStyle.widthDrawer },
  } as SxProps<Theme>,
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: (theme: Theme) => theme.spacing(1),
  } as SxProps<Theme>,
  iconButton: {
    color: (theme: Theme) => theme.palette.text.primary,
    marginRight: (theme: Theme) => theme.spacing(1),
    display: { xs: 'block', sm: 'none' },
    ml: 1
  } as SxProps<Theme>,
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: (theme: Theme) => theme.spacing(1),
    width: '100%',
  } as SxProps<Theme>,
  userInfoBox: {
    display: 'flex',
    alignItems: 'center',
    gap: (theme: Theme) => theme.spacing(0),
  } as SxProps<Theme>,
  userTextContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as SxProps<Theme>,
};