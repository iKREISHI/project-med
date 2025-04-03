import { FC, useState } from "react";
import { Box, Paper, Theme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ruRU } from '@mui/x-data-grid/locales';
import { Add, Edit, Delete } from "@mui/icons-material";
import { CustomButton } from "@6_shared/Button";
import { InputForm } from "@6_shared/Input";
import { getAllSpecialization, addNewSpecialization, updateSpecialization, deleteSpecialization } from "@5_entities/specialization";
import { CustomSnackbar } from "@6_shared/Snackbar";

export const Specializations: FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [specializations, setSpecializations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [newSpecialization, setNewSpecialization] = useState({
        title: "",
        description: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rowCount, setRowCount] = useState(0);

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    // Загрузка данных
    useEffect(() => {
        fetchData();
    }, [paginationModel.page, paginationModel.pageSize]);
    const fetchData = async () => {
        try {
            setLoading(true);
            // Загружаем все специализации сразу
            const data = await getAllSpecialization({
                page: paginationModel.page + 1,
                page_size: paginationModel.pageSize,
            });
            setRowCount(data.count || 0);
            // Обрабатываем разные форматы ответа API
            const items = Array.isArray(data) ? data : (data.results || []);
            setSpecializations(items);
        } catch (error) {
            console.error("Ошибка при загрузке специализаций:", error);
            setSnackbar({
                open: true,
                message: 'Ошибка при загрузке специализаций',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };


    // Колонки для DataGrid
    const columns: GridColDef[] = isMobile
        ? [
            { field: 'title', headerName: 'Название', flex: 1, minWidth: 120 },
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
        ]
        : [
            { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 80 },
            { field: 'title', headerName: 'Название', flex: 1, minWidth: 300 },
            { field: 'description', headerName: 'Описание', flex: 1, minWidth: 150 },
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

    const handleOpenModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setNewSpecialization({
            title: "",
            description: "",
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
        setNewSpecialization(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (specialization: any) => {
        setIsEditing(true);
        setCurrentId(specialization.id);
        setNewSpecialization({
            title: specialization.title,
            description: specialization.description,
        });
        setOpenModal(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту специализацию?')) {
            return;
        }

        try {
            setLoading(true);
            const prevSpecializations = [...specializations];

            setSpecializations(prev => prev.filter(item => item.id !== id));

            try {
                await deleteSpecialization(id);
                setSnackbar({
                    open: true,
                    message: 'Специализация успешно удалена',
                    severity: 'success'
                });
            } catch (err: any) {
                console.error('Ошибка удаления:', err);
                // Откатываем изменения при ошибке
                setSpecializations(prevSpecializations);

                setSnackbar({
                    open: true,
                    message: err.message.includes('204')
                        ? 'Специализация успешно удалена'
                        : err.message || 'Ошибка при удалении специализации',
                    severity: err.message.includes('204') ? 'success' : 'error'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            if (!newSpecialization.title.trim()) {
                throw new Error('Название специализации обязательно для заполнения');
            }

            if (isEditing && currentId) {
                const response = await updateSpecialization(currentId, {
                    title: newSpecialization.title,
                    description: newSpecialization.description
                });

                setSpecializations(prev => prev.map(item =>
                    item.id === currentId ? response : item
                ));

                setSnackbar({
                    open: true,
                    message: 'Специализация успешно обновлена',
                    severity: 'success'
                });
            } else {
                const response = await addNewSpecialization({
                    title: newSpecialization.title,
                    description: newSpecialization.description
                });

                if (!response || !response.id) {
                    throw new Error('Неверный формат ответа сервера');
                }

                setSpecializations(prev => [...prev, response]);

                setSnackbar({
                    open: true,
                    message: 'Специализация успешно добавлена',
                    severity: 'success'
                });
            }

            handleCloseModal();
        } catch (error) {
            console.error("Ошибка при сохранении специализации:", error);
            setSnackbar({
                open: true,
                message: error instanceof Error ? error.message : 'Произошла ошибка при сохранении',
                severity: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

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
                boxShadow: theme.shadows[0],
                borderRadius: (theme: Theme) => theme.shape.borderRadius,
            }}>
                <DataGrid
                    rows={specializations}
                    columns={columns}
                    autoHeight
                    loading={loading}
                    disableRowSelectionOnClick
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    rowCount={rowCount}
                   
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

            {/* Модальное окно */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? 'Редактировать специализацию' : 'Добавить специализацию'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <InputForm
                            name="title"
                            label="Название специализации"
                            value={newSpecialization.title}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <InputForm
                            fullWidth
                            multiline
                            rows={4}
                            name="description"
                            label="Описание"
                            value={newSpecialization.description}
                            onChange={handleInputChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <CustomButton onClick={handleCloseModal} variant="outlined">Отмена</CustomButton>
                    <CustomButton
                        variant="contained"
                        onClick={handleSave}
                        disabled={isSubmitting || !newSpecialization.title.trim()}
                    >
                        {isSubmitting ? 'Загрузка...' : isEditing ? 'Обновить' : 'Сохранить'}
                    </CustomButton>
                </DialogActions>
            </Dialog>

            {/* Уведомления */}
            <CustomSnackbar
                open={snackbar.open}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
            />
        </Box>
    );
};