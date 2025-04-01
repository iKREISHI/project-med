import { FC, useState, useEffect } from "react";
import { Box, Paper, Theme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ruRU } from '@mui/x-data-grid/locales';
import { Add, Edit, Delete } from "@mui/icons-material";
import { CustomButton } from "@6_shared/Button";
import { InputForm } from "@6_shared/Input";
import { getAllPositions, addNewPosition, deletePosition, updatePositions } from "@5_entities/position";
import { CustomSnackbar } from "@6_shared/Snackbar";

export const Positions: FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [positions, setPositions] = useState([
        {
            id: 0,
            name: "",
            shortName: "",
            minzdrav_position: "",
        },
    ]);

    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [newPosition, setNewPosition] = useState({
        name: "",
        shortName: "",
        minzdrav_position: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    // Загрузка должностей при монтировании компонента
    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const data = await getAllPositions();
                const formattedPositions = data.results.map(position => ({
                    id: position.id,
                    name: position.name,
                    shortName: position.short_name,
                    minzdrav_position: position.minzdrav_position
                }));
                setPositions(formattedPositions);
            } catch (error) {
                console.error("Ошибка при загрузке должностей:", error);
            }
        };

        fetchPositions();
    }, []);

    const handleSave = async () => {
        if (!newPosition.name || !newPosition.shortName || !newPosition.minzdrav_position) {
            setSnackbar({
                open: true,
                message: 'Пожалуйста, заполните все обязательные поля',
                severity: 'error'
            });
            return;
        }

        setIsLoading(true);
        try {
            const positionData = {
                name: newPosition.name,
                short_name: newPosition.shortName,
                minzdrav_position: newPosition.minzdrav_position
            };

            if (isEditing && currentId) {
                const response = await updatePositions(currentId, positionData);
                console.log('[Positions] Ответ сервера при обновлении:', response);
                setPositions(prev => prev.map(pos =>
                    pos.id === currentId ? {
                        id: currentId,
                        name: newPosition.name,
                        shortName: newPosition.shortName,
                        minzdrav_position: newPosition.minzdrav_position
                    } : pos
                ));
                setSnackbar({
                    open: true,
                    message: 'Должность успешно обновлена',
                    severity: 'success'
                });
            } else {
                const addedPosition = await addNewPosition(positionData);
                setPositions(prev => [...prev, addedPosition]);
                setSnackbar({
                    open: true,
                    message: 'Должность успешно добавлена',
                    severity: 'success'
                });
            }

            handleCloseModal();
        } catch (error) {
            console.error("Ошибка при сохранении должности:", error);
            setSnackbar({
                open: true,
                message: error instanceof Error ? error.message : 'Произошла ошибка при сохранении',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // для десктопной версии
    const desktopColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 80 },
        { field: 'name', headerName: 'Название', flex: 1, minWidth: 150 },
        { field: 'shortName', headerName: 'Короткое имя', flex: 1, minWidth: 120 },
        { field: 'minzdrav_position', headerName: 'Должность минздрава', flex: 1, minWidth: 200 },
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

    // для мобильной версии
    const mobileColumns: GridColDef[] = [
        { field: 'name', headerName: 'Должность', flex: 1, minWidth: 120 },
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

    const handleOpenModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setNewPosition({
            name: "",
            shortName: "",
            minzdrav_position: "",
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту должность?')) {
            return;
        }

        try {
            setLoading(true);
            console.log('Попытка удаления должности ID:', id);

            // Оптимистичное обновление UI
            const prevPositions = [...positions];
            setPositions(prev => prev.filter(item => item.id !== id));

            try {
                await deletePosition(id);

                setSnackbar({
                    open: true,
                    message: 'Должность успешно удалена',
                    severity: 'success'
                });
            } catch (err: any) {
                console.error('Ошибка удаления:', {
                    error: err,
                    message: err.message,
                    stack: err.stack
                });

                // Восстанавливаем список при ошибке
                setPositions(prevPositions);

                setSnackbar({
                    open: true,
                    message: err.message.includes('204')
                        ? 'Должность успешно удалена'
                        : err.message || 'Ошибка при удалении должности',
                    severity: err.message.includes('204') ? 'success' : 'error'
                });
            }
        } finally {
            setLoading(false);
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPosition((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (position: any) => {
        setIsEditing(true);
        setCurrentId(position.id);
        setNewPosition({
            name: position.name,
            shortName: position.shortName,
            minzdrav_position: position.minzdrav_position
        });
        setOpenModal(true);
    };
    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };
    return (
        <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
            <Box sx={{ mb: 2, display: { lg: 'flex' }, justifyContent: 'space-between', alignItems: 'center' }}>
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
                boxShadow: theme.shadows[0],
                borderRadius: (theme: Theme) => theme.shape.borderRadius,
            }}>
                <DataGrid
                    rows={positions}
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
                <DialogTitle>{isEditing ? 'Редактировать должность' : 'Добавить должность'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <InputForm
                            type="text"
                            name="name"
                            label="Название должности"
                            value={newPosition.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <InputForm
                            type="text"
                            name="shortName"
                            label="Короткое имя"
                            value={newPosition.shortName}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <InputForm
                            type="text"
                            name="minzdrav_position"
                            label="Должность минздрава"
                            value={newPosition.minzdrav_position}
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
                        onClick={handleSave}
                        disabled={isLoading || !newPosition.name || !newPosition.shortName || !newPosition.minzdrav_position}
                    >
                        {isLoading ? 'Загрузка...' : isEditing ? 'Обновить' : 'Сохранить'}
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