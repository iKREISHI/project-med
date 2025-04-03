import { FC, useState } from "react";
import { Box, Paper, Theme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ruRU } from '@mui/x-data-grid/locales';
import { Add, Edit, Delete } from "@mui/icons-material";
import { CustomButton } from "@6_shared/Button";
import { InputForm } from "@6_shared/Input";
import { CustomSnackbar } from "@6_shared/Snackbar";
import { getAllMedicalCardType } from "@5_entities/medicalCardType/api/getAllMedicalCardType";
import { addNewMedicalCardType } from "@5_entities/medicalCardType/api/addNewMedicalCardType";
import { updateMedicalCardType } from "@5_entities/medicalCardType/api/updateMedicalCardType";
import { deleteMedicalCardType } from "@5_entities/medicalCardType/api/deleteMedicalCardType";

interface CardType {
  id: number;
  name: string;
  prefix: string;
  suffix: string;
  begin_number: string;
  description: string;
}

export const CardTypes: FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [cardTypes, setCardTypes] = useState<CardType[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [newCardType, setNewCardType] = useState<Omit<CardType, 'id'>>({
        name: "",
        prefix: "",
        suffix: "",
        begin_number: "",
        description: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    // Загрузка данных
    useEffect(() => {
        const fetchCardTypes = async () => {
            try {
                setLoading(true);
                const response = await getAllMedicalCardType();
                // Извлекаем results из пагинированного ответа
                setCardTypes(response.results || []);
            } catch (error) {
                console.error("Ошибка при загрузке типов карт:", error);
                setSnackbar({
                    open: true,
                    message: 'Ошибка при загрузке типов карт',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };
    
        fetchCardTypes();
    }, []);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Валидация
            if (!newCardType.name) {
                throw new Error('Название обязательно для заполнения');
            }

            if (isEditing && currentId) {
                // Обновление существующего типа
                const updatedCardType = await updateMedicalCardType(currentId, newCardType);
                setCardTypes(prev => 
                    prev.map(item => 
                        item.id === currentId ? { ...updatedCardType, id: currentId } : item
                    )
                );
                setSnackbar({
                    open: true,
                    message: 'Тип карты успешно обновлен',
                    severity: 'success'
                });
            } else {
                // Добавление нового типа
                const createdCardType = await addNewMedicalCardType(newCardType);
                setCardTypes(prev => [...prev, { ...createdCardType, id: createdCardType.id }]);
                setSnackbar({
                    open: true,
                    message: 'Тип карты успешно добавлен',
                    severity: 'success'
                });
            }
            handleCloseModal();
        } catch (error) {
            console.error("Ошибка при сохранении типа карты:", error);
            setSnackbar({
                open: true,
                message: error instanceof Error ? error.message : 'Ошибка при сохранении',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const desktopColumns: GridColDef<CardType>[] = [
        { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 80 },
        { field: 'name', headerName: 'Название', flex: 1, minWidth: 150 },
        { field: 'prefix', headerName: 'Префикс', flex: 0.5, minWidth: 80 },
        { field: 'suffix', headerName: 'Суффикс', flex: 0.5, minWidth: 80 },
        { field: 'begin_number', headerName: 'Начальный номер', flex: 1, minWidth: 120 },
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

    const mobileColumns: GridColDef<CardType>[] = [
        { field: 'name', headerName: 'Название', flex: 1, minWidth: 120 },
        { field: 'prefix', headerName: 'Префикс', flex: 0.5, minWidth: 60 },
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
        setNewCardType({
            name: "",
            prefix: "",
            suffix: "",
            begin_number: "",
            description: ""
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот тип карты?')) {
            return;
        }

        try {
            setLoading(true);
            const prevCardTypes = [...cardTypes];
            
            // Оптимистичное обновление
            setCardTypes(prev => prev.filter(item => item.id !== id));

            try {
                await deleteMedicalCardType(id);
                setSnackbar({
                    open: true,
                    message: 'Тип карты успешно удален',
                    severity: 'success'
                });
            } catch (error) {
                // Откат при ошибке
                setCardTypes(prevCardTypes);
                setSnackbar({
                    open: true,
                    message: error instanceof Error ? error.message : 'Ошибка при удалении',
                    severity: 'error'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCardType(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (cardType: CardType) => {
        setIsEditing(true);
        setCurrentId(cardType.id);
        setNewCardType({
            name: cardType.name,
            prefix: cardType.prefix,
            suffix: cardType.suffix,
            begin_number: cardType.begin_number,
            description: cardType.description
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
                    Типы карт
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
                    rows={cardTypes}
                    columns={isMobile ? mobileColumns : desktopColumns}
                    loading={loading}
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

            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? 'Редактировать тип карты' : 'Добавить тип карты'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <InputForm
                            name="name"
                            label="Название"
                            value={newCardType.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <InputForm
                                name="prefix"
                                label="Префикс"
                                value={newCardType.prefix}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <InputForm
                                name="suffix"
                                label="Суффикс"
                                value={newCardType.suffix}
                                onChange={handleInputChange}
                                fullWidth
                            />
                        </Box>
                        <InputForm
                            name="begin_number"
                            label="Начальный номер"
                            value={newCardType.begin_number}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <InputForm
                            name="description"
                            label="Описание"
                            value={newCardType.description}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <CustomButton onClick={handleCloseModal} variant="outlined">Отмена</CustomButton>
                    <CustomButton
                        variant="contained"
                        onClick={handleSave}
                        disabled={isLoading || !newCardType.name}
                    >
                        {isLoading ? 'Загрузка...' : isEditing ? 'Обновить' : 'Сохранить'}
                    </CustomButton>
                </DialogActions>
            </Dialog>

            <CustomSnackbar
                open={snackbar.open}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
            />
        </Box>
    );
};