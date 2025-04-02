// @ts-nocheck
import { SxProps, Theme } from '@mui/material/styles';

export const planeSx = {
  container: {
    backgroundColor: (theme: Theme) => theme.palette.background.paper,
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: (theme: Theme) => theme.shape.borderRadius,
    padding: (theme: Theme) => theme.spacing(3),
    width: '100%',
    margin: '0 auto',
  } as SxProps<Theme>,
  modalContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    bgcolor: "background.paper",
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
    maxWidth: "60vh", 
    overflowY: "auto",
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
    color: (theme: Theme) => theme.palette.grey[500],
  } as SxProps<Theme>,
  addLink: {
    color: (theme: Theme) => theme.palette.grey[700],
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
    color: (theme: Theme) => theme.palette.grey[500],
  } as SxProps<Theme>,
  popover: {
    '& .MuiPopover-paper': {
      overflow: 'visible',
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: '12%',
        width: '12px',
        height: '12px',
        bgcolor: 'background.paper',
        transform: 'translate(-50%, -50%) rotate(45deg)',
        zIndex: 0,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      }
    }
  },
  detailsButton: {
    color: (theme: Theme) => theme.palette.grey[500],
    ml: 1,
  },
  popoverContent: {
    p: 2,
    minWidth: '300px',
    maxWidth: '400px',
    position: 'relative',
    overflow: 'visible',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    mt: 2,
  },
};