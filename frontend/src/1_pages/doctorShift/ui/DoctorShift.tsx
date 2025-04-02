// @ts-nocheck
import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Paper, useTheme, useMediaQuery, Theme, IconButton } from '@mui/material';
import { ruRU } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';
import { InputSearch } from "@6_shared/Input";
import { CustomButton } from '@6_shared/Button';
import EditIcon from '@mui/icons-material/Edit';

import { getCurrentUser } from '@5_entities/user';
import { getAllShifts } from '@5_entities/shift';
import type { Shift } from '@5_entities/shift/model/model';

interface DoctorShiftProps {
    userRole?: string;
}

export const DoctorShift: React.FC<DoctorShiftProps> = ({ userRole }) => {
    const isHeadDoctor = userRole === 'head_doctor';
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchQuery, setSearchQuery] = useState('');
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [filteredShifts, setFilteredShifts] = useState<Shift[]>([]);
    const navigate = useNavigate();
    const isDarkText = !(theme.palette.mode === "dark");

    useEffect(() => {
        const fetchShifts = async () => {
            try {
                const user = await getCurrentUser();
                const { results } = await getAllShifts({ doctor: user.id });
                setShifts(results);
                setFilteredShifts(results);
            } catch (error) {
                console.error("Ошибка при загрузке смен:", error);
            }
        };

        fetchShifts();
    }, []);

    useEffect(() => {
        setFilteredShifts(
            shifts.filter((shift) =>
                shift.doctor_name?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, shifts]);

    const desktopColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 80 },
        { field: 'doctor_name', headerName: 'Врач', flex: 1, minWidth: 140 },
        {
            field: 'time',
            headerName: 'Время',
            flex: 1.3,
            minWidth: 160,
            renderCell: (params) => {
                const row = params.row;
                return `${row.start_time} - ${row.end_time}`;
            }
        },
        { field: 'document_template', headerName: 'Шаблон', flex: 1, minWidth: 150 },
        { field: 'document', headerName: 'Документ', flex: 1.2, minWidth: 160 },
        {
            field: 'actions',
            headerName: 'Действия',
            flex: 0.5,
            minWidth: 100,
            renderCell: (params) => (
                <IconButton onClick={() => navigate(`/doctor-shift/edit/${params.id}`)} disableRipple>
                    <EditIcon />
                </IconButton>
            ),
        },
    ];

    const mobileColumns: GridColDef[] = [
        { field: 'doctor_name', headerName: 'Врач', flex: 1, minWidth: 120 },
        {
            field: 'time',
            headerName: 'Время',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => {
                const row = params.row;
                return `${row.start_time} - ${row.end_time}`;
            }
        },
        {
            field: 'actions',
            headerName: 'Действия',
            flex: 0.5,
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
        <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
            <Box sx={{ mb: 1, display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
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
                width: { xs: `91vw`, sm: '100%' },
                overflow: 'hidden',
                boxShadow: theme.shadows[3],
                borderRadius: (theme: Theme) => theme.shape.borderRadius,
            }}>
                <DataGrid
                    rows={filteredShifts}
                    columns={columns}
                    getRowId={(row) => row.id}
                    autoHeight
                    disableRowSelectionOnClick
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
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
