// @ts-nocheck
// @ts-nocheck
import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Paper, useTheme, useMediaQuery, Theme, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { ruRU } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';
import { InputSearch } from "@6_shared/Input";
import { CustomButton } from "@6_shared/Button";

const patients = [
    {
        id: 1,
        last_name: "Иванов",
        first_name: "Иван",
        patronymic: "Иванович",
        snils: "000-000-000 11",
        date_created: "2000-01-01",
        // full_name: "Иванов И.И."
    },
];

export const PatientList: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const isDarkText = !(theme.palette.mode === "dark");

    // для мобильной версии
    const processedPatients = patients.map(patient => ({
        ...patient,
        full_name: `${patient.last_name} ${patient.first_name[0]}.${patient.patronymic[0]}.`
    }));

    const desktopColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 80 },
        { field: 'last_name', headerName: 'Фамилия', flex: 1, minWidth: 120 },
        { field: 'first_name', headerName: 'Имя', flex: 1, minWidth: 120 },
        { field: 'patronymic', headerName: 'Отчество', flex: 1, minWidth: 120 },
        { field: 'snils', headerName: 'СНИЛС', flex: 1.5, minWidth: 150 },
        { field: 'date_created', headerName: 'Дата регистрации', flex: 1.5, minWidth: 120 },
        {
            field: 'actions',
            headerName: 'Действия',
            flex: 0.5,
            minWidth: 80,
            sortable: false,
            renderCell: (params) => (
                <IconButton onClick={() => handleEdit(params.row.id)} disableRipple>
                    <EditIcon />
                </IconButton>
            ),
        },
    ];

    const mobileColumns: GridColDef[] = [
        {
            field: 'full_name',
            headerName: 'ФИО',
            flex: 1,
            minWidth: 120,
        },
        { field: 'snils', headerName: 'СНИЛС', flex: 1, minWidth: 120 },
        {
            field: 'actions',
            headerName: 'Действия',
            flex: 0.5,
            minWidth: 80,
            sortable: false,
            renderCell: (params) => (
                <IconButton onClick={() => handleEdit(params.row.id)}>
                    <EditIcon />
                </IconButton>
            ),
        },
    ];

    const filteredPatients = processedPatients.filter((patient) =>
        `${patient.last_name} ${patient.first_name} ${patient.patronymic}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const columns = isMobile ? mobileColumns : desktopColumns;

    const handleEdit = (id: number) => {
        console.log(id);
    };

    return (
        <Box sx={{
            width: '100%',
            boxSizing: 'border-box'
        }}>
            <Typography variant="h1" gutterBottom>
                Пациенты
            </Typography>

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
                    placeholder="Поиск пациентов"
                    isDarkText={isDarkText}
                    bgcolorFlag={true}
                />
            </Box>

            <Box sx={{ mb: 1 }}>
                <CustomButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/patients/create")}
                >
                    Добавить пациента
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
                    rows={filteredPatients}
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