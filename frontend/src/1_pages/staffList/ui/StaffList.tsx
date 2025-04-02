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
import { StaffEditModal } from '@6_shared/Staff';

const staffData = [
    {
        id: 1,
        lastname: "Иванов",
        firstname: "Иван",
        patronymic: "Иванович",
        position: "Главный врач",
        date_created: "988-01-15"
    },
];

export const StaffList: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const isDarkText = !(theme.palette.mode === "dark");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

    // для мобильной версии
    const processedStaff = staffData.map(staff => ({
        ...staff,
        full_name: `${staff.lastname} ${staff.firstname[0]}.${staff.patronymic[0]}.`
    }));

    const desktopColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 80 },
        { field: 'lastname', headerName: 'Фамилия', flex: 1, minWidth: 120 },
        { field: 'firstname', headerName: 'Имя', flex: 1, minWidth: 120 },
        { field: 'patronymic', headerName: 'Отчество', flex: 1, minWidth: 120 },
        { field: 'position', headerName: 'Должность', flex: 1.5, minWidth: 150 },
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
        { field: 'position', headerName: 'Должность', flex: 1, minWidth: 120 },
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

    const filteredStaff = processedStaff.filter((staff) =>
        `${staff.lastname} ${staff.firstname} ${staff.patronymic}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const columns = isMobile ? mobileColumns : desktopColumns;

    const handleEdit = (id: number) => {
        setSelectedStaffId(id);
        setEditModalOpen(true);
    };

    const handleDeleteStaff = (id: number) => {
        console.log("Удаление сотрудника с ID:", id);
    };

    return (
        <Box sx={{
            width: '100%',
            boxSizing: 'border-box'
        }}>
            <Typography variant="h1" gutterBottom>
                Сотрудники
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
                    placeholder="Поиск сотрудников"
                    isDarkText={isDarkText}
                    bgcolorFlag={true}
                />
            </Box>

            <Box sx={{ mb: 1 }}>
                <CustomButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/staff/create")}
                >
                    Добавить сотрудника
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
                    rows={filteredStaff}
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

            <StaffEditModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                staffId={selectedStaffId || undefined}
                onDelete={handleDeleteStaff}
            />
        </Box>
    );
};