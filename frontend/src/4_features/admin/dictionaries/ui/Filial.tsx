import { FC, useState } from "react";
import { Box, Paper, Theme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ruRU } from '@mui/x-data-grid/locales';
import { Add, Edit } from "@mui/icons-material";
import { CustomButton } from "@6_shared/Button";
import { InputForm } from "@6_shared/Input";

interface Branch {
  id: number;
  city: string;
  street: string;
  house: string;
  building: string;
}

export const Filial: FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [branches, setBranches] = useState<Branch[]>([
        {
            id: 1,
            city: "Шадринск",
            street: "Примерная",
            house: "0",
            building: "1",
        },
    ]);

    const [openModal, setOpenModal] = useState(false);
    const [newBranch, setNewBranch] = useState<Omit<Branch, 'id'>>({
        city: "",
        street: "",
        house: "",
        building: "",
    });

    // для десктопной версии
    const desktopColumns: GridColDef<Branch>[] = [
        { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 80 },
        { field: 'city', headerName: 'Город', flex: 1, minWidth: 120 },
        { field: 'street', headerName: 'Улица', flex: 1, minWidth: 120 },
        { field: 'house', headerName: 'Дом', flex: 0.5, minWidth: 80 },
        { field: 'building', headerName: 'Строение', flex: 0.5, minWidth: 80 },
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
    const mobileColumns: GridColDef<Branch>[] = [
        { field: 'city', headerName: 'Город', flex: 1, minWidth: 120 },
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
        setNewBranch((prev) => ({
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
                    Филиалы
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
                    rows={branches}
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
                <DialogTitle>Добавить филиал</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>

                        <InputForm
                            type="text"
                            name="city"
                            label="Город"
                            value={newBranch.city}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <InputForm
                            type="text"
                            name="street"
                            label="Улица"
                            value={newBranch.street}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <InputForm
                                type="text"
                                name="house"
                                label="Дом"
                                value={newBranch.house}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                            <InputForm
                                type="text"
                                name="building"
                                label="Строение"
                                value={newBranch.building}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </Box>
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