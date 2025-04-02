// @ts-nocheck
// @ts-nocheck
import { FC, useState } from "react";
import { Box, Paper, Theme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ruRU } from '@mui/x-data-grid/locales';
import { Add, Edit, Delete } from "@mui/icons-material";
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
        },
    ]);

    // Состояние модального окна
    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
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
        {
            field: 'actions',
            headerName: 'Действия',
            flex: 1,
            minWidth: 120,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => handleEdit(params.row)} disableRipple>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.id)} disableRipple color="error">
                        <Delete />
                    </IconButton>
                </Box>
            ),
        },
    ];

    // Колонки для мобильной версии
    const mobileColumns: GridColDef[] = [
        { field: 'name', headerName: 'Название', flex: 1, minWidth: 120 },
        {
            field: 'actions',
            headerName: 'Действия',
            flex: 1,
            minWidth: 100,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => handleEdit(params.row)} size="small" disableRipple>
                        <Edit fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.id)} size="small" disableRipple color="error">
                        <Delete fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    // Обработчики
    const handleOpenModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setNewSpecialization({
            name: "",
            description: "",
            document_template_id: "",
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewSpecialization((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (row: any) => {
        setIsEditing(true);
        setCurrentId(row.id);
        setNewSpecialization({
            name: row.name,
            description: row.description,
            document_template_id: row.document_template_id || "",
        });
        setOpenModal(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить эту специализацию?')) {
            alert('Специализация удалена');
        }
    };

    const handleSave = () => {
        handleCloseModal();
    };

    return (
        <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
            <Box sx={{ mb: 2, display: { lg: 'flex' }, justifyContent: 'space-between', alignItems: 'center' }}>
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

            {/* Модальное окно добавления/редактирования */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? 'Редактировать специализацию' : 'Добавить специализацию'}</DialogTitle>
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
                    </Box>
                </DialogContent>
                <DialogActions>
                    <CustomButton onClick={handleCloseModal} variant="outlined">Отмена</CustomButton>
                    <CustomButton
                        variant="contained"
                        onClick={handleSave}
                    >
                        {isEditing ? 'Обновить' : 'Сохранить'}
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};