// @ts-nocheck
// @ts-nocheck
import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Paper, useTheme, useMediaQuery, Theme, IconButton } from '@mui/material';
import { ruRU } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';
import { InputSearch } from "@6_shared/Input";
import { CustomButton } from '@6_shared/Button';
import EditIcon from '@mui/icons-material/Edit';

interface Shift {
    id: number;
    doctor: string;
    start_time: string;
    end_time: string;
    document_template: string;
    document: string;
    document_fields: string;
}

const shifts: Shift[] = [
    {
        id: 1,
        doctor: "Иванов И.И.",
        start_time: "2023-05-15 08:00",
        end_time: "2023-05-15 20:00",
        document_template: "Самая обычная смена",
        document: "Дежурство №1",
        document_fields: "не знаю что это",
    },
];

// дежурства / семны (таблица)
interface DoctorShiftProps {
    userRole?: string;
}

export const DoctorShift: React.FC<DoctorShiftProps> = ({ userRole }) => {
    const isHeadDoctor = userRole === 'head_doctor';
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const isDarkText = !(theme.palette.mode === "dark");

    const filteredShifts = shifts.filter((shift) =>
        `${shift.doctor} `
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const desktopColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 80 },
        { field: 'doctor', headerName: 'Врач', flex: 1, minWidth: 140 },
        {
            field: 'time',
            headerName: 'Время',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => {
                const shift = shifts.find(s => s.id === params.id);
                return shift ? `${shift.start_time} - ${shift.end_time}` : '';
            }
        },
        { field: 'document_template', headerName: 'Шаблон документа', flex: 1.5, minWidth: 180 },
        { field: 'document', headerName: 'Документ', flex: 1, minWidth: 150 },
        {
            field: 'actions',
            headerName: 'Действия',
            flex: 0.8,
            minWidth: 120,
            renderCell: (params) => (
                <IconButton onClick={() => navigate(`/doctor-shift/edit/${params.id}`)} disableRipple>
                    <EditIcon />
                </IconButton>
            ),
        },
    ];

    const mobileColumns: GridColDef[] = [
        { field: 'doctor', headerName: 'Врач', flex: 1, minWidth: 120 },
        {
            field: 'time',
            headerName: 'Время',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => {
                const shift = shifts.find(s => s.id === params.id);
                return shift ? `${shift.start_time} - ${shift.end_time}` : '';
            }
        },
        {
            field: 'actions',
            headerName: 'Действия',
            flex: 0.8,
            minWidth: 100,
            renderCell: (params) => (
                <IconButton onClick={() => navigate(`/doctor-shift/edit/${params.id}`)} disableRipple>
                    <EditIcon />
                </IconButton>
            ),
        },
    ];

    const columns = isMobile ? mobileColumns : desktopColumns;

    return (
        <Box sx={{
            width: '100%',
            boxSizing: 'border-box'
        }}>

            <Box sx={{
                mb: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing(2)
            }}>
                <InputSearch
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    placeholder="Поиск по врачам"
                    isDarkText={isDarkText}
                    bgcolorFlag={true}
                />
            </Box>
            <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                {isHeadDoctor && (
                    <CustomButton
                        variant="contained"
                        onClick={() => navigate(`/doctor-shift/create`)}
                    >
                        Открыть смену
                    </CustomButton>
                )}
                <CustomButton
                    variant="contained"
                    onClick={() => navigate(`/doctor-shift/transfer`)}
                >
                    Передать смену
                </CustomButton>
            </Box>
            <Paper sx={{
                width: {
                    xs: `91vw`,
                    sm: '100%'
                },
                overflow: 'hidden',
                boxShadow: theme.shadows[3],
                borderRadius: (theme: Theme) => theme.shape.borderRadius,
            }}>
                <DataGrid
                    rows={filteredShifts}
                    columns={columns}
                    autoHeight
                    disableRowSelectionOnClick
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 13 },
                        },
                    }}
                    sx={{
                        borderRadius: (theme: Theme) => theme.shape.borderRadius,
                        '& .MuiDataGrid-cell': {
                            whiteSpace: 'normal',
                            lineHeight: '1.5',
                            padding: theme.spacing(1),
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'transparent',
                        },
                        '& .css-ok32b7-MuiDataGrid-overlay': {
                            bgcolor: 'transparent'
                        }
                    }}
                    localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                />
            </Paper>
        </Box>
    );
};