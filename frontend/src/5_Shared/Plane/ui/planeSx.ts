import { SxProps, Theme } from '@mui/material/styles';

export const planeSx = {
  container: {
    backgroundColor: (theme: Theme) => theme.palette.background.paper,
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: (theme: Theme) => theme.shape.borderRadius,
    padding: (theme: Theme) => theme.spacing(4),
    width: '100%',
    margin: '0 auto',
  } as SxProps<Theme>,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: (theme: Theme) => theme.spacing(1),
  } as SxProps<Theme>,
  title: {
    fontSize: (theme: Theme) => theme.typography.h6.fontSize,
    fontWeight: '500',
    color: (theme: Theme) => theme.palette.primary.main,
  } as SxProps<Theme>,
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: (theme: Theme) => theme.spacing(0.5),
    paddingTop: (theme: Theme) => theme.spacing(1),
  } as SxProps<Theme>,
  taskContent: {
    flexGrow: 1,
  } as SxProps<Theme>,
  taskText: {
    fontSize: (theme: Theme) => theme.typography.body1.fontSize,
  } as SxProps<Theme>,
  dateText: {
    color: (theme: Theme) => theme.palette.text.secondary,
  } as SxProps<Theme>,
  addLink: {
    color: (theme: Theme) => theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      color: (theme: Theme) => theme.palette.primary.dark,
    },
    cursor: 'pointer',
  } as SxProps<Theme>,
  linkContent: {
    display: 'flex',
    alignItems: 'center',
    gap: (theme: Theme) => theme.spacing(1),
  } as SxProps<Theme>,
  addIcon: {
    fontSize: '20px',
  } as SxProps<Theme>,
  deleteIcon: {
    color: (theme: Theme) => theme.palette.text.secondary,
  } as SxProps<Theme>,
};