// @ts-nocheck
import { FC, useState, useEffect } from "react";
import { Box, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, useTheme, useMediaQuery, CircularProgress, Theme } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { ruRU } from '@mui/x-data-grid/locales';
import { Add, Edit, Delete } from "@mui/icons-material";
import { CustomButton } from "@6_shared/Button";
import { InputForm } from "@6_shared/Input";
import { getAllFilials } from "@5_entities/filial/api/getAllFilials";
import { deleteFilial } from "@5_entities/filial/api/deleteFilial";
import { updateFilial } from "@5_entities/filial/api/updateFilial";
import { addNewFilial } from "@5_entities/filial/api/addNewFilial";
import { CustomSnackbar } from "@6_shared/Snackbar";
import { PaginatedFilialList } from "@5_entities/filial/model/model";


export const Filial: FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [branches, setBranches] = useState<PaginatedFilialList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [newBranch, setNewBranch] = useState<Omit<PaginatedFilialList, 'id'>>({
        city: "",
        street: "",
        house: "",
        building: "",
        name: "",
        description: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pagination, setPagination] = useState({
        count: 0,
        page: 0,
        pageSize: 13
    });

    useEffect(() => {
        const fetchBranches = async (page: number = 1, pageSize: number = 13) => {
            try {
                setLoading(true);
                console.log('[Filial] Загрузка филиалов...');
                const data = await getAllFilials({
                    page: page,
                    page_size: pageSize
                });
                console.log('[Filial] Получены данные:', data);

                if (data && data.results) {
                    setBranches(data.results);
                    setPagination({
                        count: data.count || 0,
                        page: page - 1,
                        pageSize: pageSize
                    });
                } else {
                    console.warn('[Filial] Неожиданный формат данных:', data);
                    setBranches([]);
                }
            } catch (err: any) {
                console.error('[Filial] Ошибка загрузки:', err);
                setError(err.message || 'Не удалось загрузить филиалы');
                setSnackbar({
                    open: true,
                    message: err.message || 'Ошибка загрузки филиалов',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBranches();
    }, []);

    const desktopColumns: GridColDef<PaginatedFilialList>[] = [
        { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 50 },
        { field: 'name', headerName: 'Название', flex: 1, minWidth: 100 },
        { field: 'city', headerName: 'Город', minWidth: 50 },
        { field: 'street', headerName: 'Улица', minWidth: 50 },
        { field: 'house', headerName: 'Дом', minWidth: 50 },
        { field: 'building', headerName: 'Строение', minWidth: 80 },
        {
            field: 'actions',
            headerName: 'Действия',
            flex: 0.5,
            minWidth: 80,
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

    const mobileColumns: GridColDef<PaginatedFilialList>[] = [
        { field: 'city', headerName: 'Город', flex: 1, minWidth: 120 },
        {
            field: 'actions',
            headerName: 'Действия',
            flex: 0.5,
            minWidth: 80,
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
        setNewBranch({
            city: "",
            street: "",
            house: "",
            building: "",
            name: "",
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
        setNewBranch(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (branch: PaginatedFilialList) => {
        setIsEditing(true);
        setCurrentId(branch.id);
        setNewBranch({
            city: branch.city,
            street: branch.street,
            house: branch.house,
            building: branch.building || "",
            name: branch.name || "",
            description: branch.description || "",
        });
        setOpenModal(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот филиал?')) {
            return;
        }

        try {
            setLoading(true);
            console.log('Попытка удаления филиала ID:', id);

            const prevBranches = [...branches];
            setBranches(prev => prev.filter(item => item.id !== id));

            try {
                await deleteFilial(id);

                setSnackbar({
                    open: true,
                    message: 'Филиал успешно удален',
                    severity: 'success'
                });
            } catch (err: any) {
                console.error('Ошибка удаления:', {
                    error: err,
                    message: err.message,
                    stack: err.stack
                });

                setBranches(prevBranches);

                setSnackbar({
                    open: true,
                    message: err.message.includes('204')
                        ? 'Филиал успешно удален'
                        : err.message || 'Ошибка при удалении филиала',
                    severity: err.message.includes('204') ? 'success' : 'error'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (isEditing) {
            await handleUpdate();
        } else {
            await handleAdd();
        }
    };

    const handleAdd = async () => {
        try {
            setIsSubmitting(true);
            console.log('[Filial] Добавление филиала:', newBranch);

            const response = await addNewFilial({
                city: newBranch.city,
                street: newBranch.street,
                house: newBranch.house,
                building: newBranch.building || null,
                name: newBranch.name || null,
                description: newBranch.description || null,

            });

            console.log('[Filial] Ответ сервера:', response);

            if (!response || !response.id) {
                throw new Error('Сервер вернул неполные данные');
            }

            setBranches(prev => [...prev, response]);

            setSnackbar({
                open: true,
                message: 'Филиал успешно добавлен',
                severity: 'success'
            });
            handleCloseModal();
        } catch (err: any) {
            console.error('[Filial] Ошибка сохранения:', err);
            setSnackbar({
                open: true,
                message: err.message || 'Ошибка при добавлении филиала',
                severity: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        try {
            if (!currentId) return;

            setIsSubmitting(true);
            console.log('[Filial] Обновление филиала:', newBranch);
            const response = await updateFilial(
                currentId,
                {
                    city: newBranch.city,
                    street: newBranch.street,
                    house: newBranch.house,
                    building: newBranch.building || null,
                    name: newBranch.name || null,
                    description: newBranch.description || null,
                }
            );

            console.log('[Filial] Ответ сервера при обновлении:', response);

            setBranches(prev =>
                prev.map(item => item.id === currentId ? response : item)
            );

            setSnackbar({
                open: true,
                message: 'Филиал успешно обновлен',
                severity: 'success'
            });
            handleCloseModal();
        } catch (err: any) {
            console.error('[Filial] Ошибка обновления:', err);
            setSnackbar({
                open: true,
                message: err.message || 'Ошибка при обновлении филиала',
                severity: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handlePaginationModelChange = (params: GridPaginationModel) => {
        setPagination(prev => ({
            ...prev,
            page: params.page,
            pageSize: params.pageSize
        }));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', boxSizing: 'border-box', }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="h4" gutterBottom>
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
                width: '100%',
                overflow: 'hidden',
                boxShadow: theme.shadows[0],
                borderRadius: theme.shape.borderRadius,
            }}>
                <DataGrid
                    key={branches.length}
                    rows={branches}
                    columns={isMobile ? mobileColumns : desktopColumns}
                    autoHeight
                    disableRowSelectionOnClick
                    paginationMode="server"
                    rowCount={pagination.count}
                    pageSizeOptions={[10, 13, 25, 50]}
                    paginationModel={{
                        page: pagination.page,
                        pageSize: pagination.pageSize
                    }}
                    onPaginationModelChange={handlePaginationModelChange}
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

            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {isEditing ? 'Редактировать филиал' : 'Добавить филиал'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <InputForm
                            type="text"
                            name="name"
                            label="Название"
                            value={newBranch.name}
                            onChange={handleInputChange}
                            fullWidth
                            disabled={isSubmitting}
                        />
                        <InputForm
                            type="text"
                            name="description"
                            label="Описание"
                            value={newBranch.description}
                            onChange={handleInputChange}
                            fullWidth
                            disabled={isSubmitting}
                        />
                        <InputForm
                            type="text"
                            name="city"
                            label="Город"
                            value={newBranch.city}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            disabled={isSubmitting}
                        />
                        <InputForm
                            type="text"
                            name="street"
                            label="Улица"
                            value={newBranch.street}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            disabled={isSubmitting}
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
                                disabled={isSubmitting}
                            />
                            <InputForm
                                type="text"
                                name="building"
                                label="Строение"
                                value={newBranch.building || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={isSubmitting}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <CustomButton
                        onClick={handleCloseModal}
                        variant="outlined"
                        disabled={isSubmitting}
                    >
                        Отмена
                    </CustomButton>
                    <CustomButton
                        variant="contained"
                        onClick={handleSave}
                        disabled={!newBranch.city.trim() || !newBranch.street.trim() || !newBranch.house.trim() || isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    >
                        {isEditing ? 'Обновить' : 'Сохранить'}
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