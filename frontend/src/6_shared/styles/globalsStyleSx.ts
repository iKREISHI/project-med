import { SxProps, Theme } from '@mui/material/styles';

export const globalsStyleSx = {
  container: {
    backgroundColor: (theme: Theme) => theme.palette.background.paper,
    borderRadius: (theme: Theme) => theme.shape.borderRadius,
    padding: (theme: Theme) => theme.spacing(0),
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  } as SxProps<Theme>,
  inputContainer: {
    display: "grid",
    gridTemplateColumns: {
      lg: "1fr 4fr",
      xs: "1fr"
    }, 
    alignItems: "center",
    gap: "10px", 
    mt: 1,
    mb: 1,
  } as SxProps<Theme>,
  inputContainer1: {
    display: "grid",
    gridTemplateColumns:"1fr", 
    alignItems: "center",
    gap: "10px", 
    mt: 1,
    mb: 1,
  } as SxProps<Theme>,
  inputContainer2: {
    display: "grid",
    gridTemplateColumns: {
      lg: "1fr 1fr",
      xs: "1fr"
    }, 
    alignItems: "center",
    gap: "10px", 
    mt: 1,
    mb: 1,
  } as SxProps<Theme>,
};