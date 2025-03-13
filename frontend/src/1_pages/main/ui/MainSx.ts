import { SxProps, Theme } from '@mui/material/styles';

export const MainSx = {
  container: {
    backgroundColor: (theme: Theme) => theme.palette.background.paper, 
    borderRadius: (theme: Theme) => theme.shape.borderRadius, 
    padding: (theme: Theme) => theme.spacing(3),
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', 
  } as SxProps<Theme>,
};