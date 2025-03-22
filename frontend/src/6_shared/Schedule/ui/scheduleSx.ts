import { SxProps, Theme } from '@mui/material/styles';
import { globalsStyle } from '../../styles/globalsStyle';

export const scheduleSx = {
    getTableContainer: {
        overflowX: 'auto',
        maxWidth: '91vw',
        borderRadius: (theme: Theme) => theme.shape.borderRadius,
        border: 'none',
    } as SxProps<Theme>,
    getTable: {
        borderCollapse: 'collapse',
        border: 'none',
    } as SxProps<Theme>,
    getHeaderCell: {
        border: (theme: Theme) => `1px solid ${theme.palette.grey[500]}`,
        color: (theme: Theme) => theme.palette.mode === 'dark' ? globalsStyle.colors.grey300 : theme.palette.primary.main,
        width: '40px',
    } as SxProps<Theme>,
    getEventCell: (type: string, event: string) => (theme: Theme) => ({
        border: `1px solid ${theme.palette.grey[500]}`,
        cursor: type === 'patient' && event ? 'pointer' : 'default',
        backgroundColor: type === 'patient' && event ? theme.palette.grey[400] : 'inherit',
        minWidth: '150px',
        borderRight: 'none',
        borderBottom: 'none',
    }),
};