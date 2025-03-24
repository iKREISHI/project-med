import { SxProps, Theme } from '@mui/material/styles';
import { globalsStyle } from '../../../../6_shared/styles/globalsStyle.ts';

export const recordFormSx = {
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
        display: { sm: 'flex' },
        alignItems: 'center',
        gap: '10px'
    } as SxProps<Theme>,
};