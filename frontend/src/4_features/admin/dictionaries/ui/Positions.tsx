import { FC, useState } from "react";
import { Box, Paper, Theme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, useTheme, useMediaQuery, } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ruRU } from '@mui/x-data-grid/locales';
import { Add, Edit } from "@mui/icons-material";
import { CustomButton } from "@6_shared/Button";
import { InputForm } from "@6_shared/Input";


export const Positions: FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [сardTypes, setCardTypes] = useState([
        {
            id: 1,
            name: "имя",
            minzdrav_position: 'должность'
        },

    ]);
    // модальное окно
    const [openModal, setOpenModal] = useState(false);
    const [newCardTypes, setNewCardTypes] = useState({
        name: "",
        minzdrav_position: "",
    });

    // для десктопной версии
    const desktopColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 80 },
        { field: 'name', headerName: 'Название', flex: 1, minWidth: 150 },
        { field: 'minzdrav_position', headerName: 'Должность минздрава', flex: 1, minWidth: 150 },
        {
            field: 'actions',
            headerName: 'Действия',
            flex: 0.5,
            minWidth: 80,
            sortable: false,
            renderCell: (params) => (
                <IconButton onClick={() => handleEdit(params.row.id)} disableRipple>
                    <Edit />
                </IconButton>
            ),
        },
    ];

    // для мобильной версии
    const mobileColumns: GridColDef[] = [
        { field: 'name', headerName: 'Название', flex: 1, minWidth: 120 },
        {
            field: 'actions',
            headerName: 'Действия',
            flex: 0.5,
            minWidth: 80,
            sortable: false,
            renderCell: (params) => (
                <IconButton onClick={() => handleEdit(params.row.id)} disableRipple>
                    <Edit />
                </IconButton>
            ),
        },
    ];

    // Обработчики
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCardTypes((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (id: number) => {
        console.log(id);
    };

    return (
        <Box sx={{ width: '100%', boxSizing: 'border-box' }}>


            <Box sx={{ mb: 2, display: {lg:'flex'}, justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h1" gutterBottom>
                    Должности
                </Typography>
                <CustomButton
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpenModal}
                >
                    Добавить
                </CustomButton>
            </Box>

            <Paper sx={{
                width: {
                    xs: '78vw',
                    sm: '100%'
                },
                overflow: 'hidden',
                boxShadow: theme.shadows[3],
                borderRadius: (theme: Theme) => theme.shape.borderRadius,
            }}>
                <DataGrid
                    rows={сardTypes}
                    columns={isMobile ? mobileColumns : desktopColumns}
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

            {/* Модальное окно добавления */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth sx={{}}>
                <DialogTitle>Добавить должность</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <InputForm
                            type="text"
                            name="name"
                            label="Название"
                            value={newCardTypes.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <InputForm
                            type="text"
                            name="minzdrav_position"
                            label="Должность минздрава"
                            value={newCardTypes.minzdrav_position}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <CustomButton onClick={handleCloseModal} variant="outlined">Отмена</CustomButton>
                    <CustomButton
                        variant="contained"
                    >
                        Сохранить
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};