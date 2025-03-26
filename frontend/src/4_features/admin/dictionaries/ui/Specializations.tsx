import { FC, useState } from "react";
import { Box, Paper, Theme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, useTheme, useMediaQuery, } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ruRU } from '@mui/x-data-grid/locales';
import { Add, Edit } from "@mui/icons-material";
import { CustomButton } from "@6_shared/Button";
import { InputForm } from "@6_shared/Input";


export const Specializations: FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [specializations, setSpecializations] = useState([
        {
            id: 1,
            name: "имя",
            description: "Специалист",
            document_template_id: "temp1",
        },

    ]);

    // Состояние модального окна
    const [openModal, setOpenModal] = useState(false);
    const [newSpecialization, setNewSpecialization] = useState({
        name: "",
        description: "",
        document_template_id: "",
    });

    // Колонки для десктопной версии
    const desktopColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 80 },
        { field: 'name', headerName: 'Название', flex: 1, minWidth: 150 },
        { field: 'description', headerName: 'Описание', flex: 2, minWidth: 200 },
        { field: 'document_template_id', headerName: 'ID шаблона', flex: 1, minWidth: 150 },
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

    // Колонки для мобильной версии
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
        setNewSpecialization((prev) => ({
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
                    Специализации
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
                    rows={specializations}
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
                <DialogTitle>Добавить специализацию</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <InputForm
                            type="text"
                            name="name"
                            label="Название"
                            value={newSpecialization.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <InputForm
                            fullWidth
                            multiline
                            type="text"
                            rows={5}
                            name="description"
                            label="Описание"
                            value={newSpecialization.description}
                            onChange={handleInputChange}
                            placeholder="Введите краткое описание"
                        />
                        <InputForm
                            type="text"
                            name="document_template_id"
                            label="ID шаблона документа"
                            value={newSpecialization.document_template_id}
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