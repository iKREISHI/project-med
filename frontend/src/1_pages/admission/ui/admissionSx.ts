// @ts-nocheck
// @ts-nocheck
import { SxProps, Theme } from '@mui/material/styles';
import { globalsStyle } from '../../../6_shared/styles/globalsStyle';

export const admissionSx = {
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
};