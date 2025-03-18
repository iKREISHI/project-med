<<<<<<< HEAD:frontend/src/1_pages/registry/Patient/ui/patientSx.ts
import { SxProps, Theme } from '@mui/material/styles';
import { globalsStyle } from '../../../../6_Shared/styles/globalsStyle';

export const patientSx = {

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
    position: "relative"

  } as SxProps<Theme>,
=======
import { SxProps, Theme } from '@mui/material/styles';
import { globalsStyle } from '../../styles/globalsStyle';

export const patientSx = {

  container: {
    display: 'flex',
    gap: (theme: Theme) => theme.spacing(2),
    width: '100%',
    backgroundColor: (theme: Theme) => theme.palette.background.paper,
    minHeight: "50vh",
  } as SxProps<Theme>,
  containerMain: {
    width: '100%',
    backgroundColor: (theme: Theme) => theme.palette.background.paper,
    boxShadow: globalsStyle.boxShadow,
    borderRadius: (theme: Theme) => theme.shape.borderRadius,
    overflow: 'hidden',
    overflowY: "auto",
    position: "relative"

  } as SxProps<Theme>,
>>>>>>> 57f26553 (add patient admission and recording):frontend/src/6_shared/Patient/ui/patientSx.ts
};