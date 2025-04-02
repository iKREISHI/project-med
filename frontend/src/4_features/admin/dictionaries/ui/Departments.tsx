import { FC, useState } from "react";
import { Box, Paper, Theme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ruRU } from '@mui/x-data-grid/locales';
import { Add, Edit, Delete } from "@mui/icons-material";
import { CustomButton } from "@6_shared/Button";
import { InputForm } from "@6_shared/Input";
import { CustomSnackbar } from "@6_shared/Snackbar";
import { CustomAutocomplete } from "@6_shared/Autocomplete";
import { getAllDepartaments, addNewDepartaments, deleteDepartaments, updateDepartaments, FilialDepartament } from "@5_entities/departament";
import { getAllFilials } from "@5_entities/filial/api/getAllFilials";

export const Departments: FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
 
    const [departments, setDepartments] = useState<FilialDepartament[]>([]);
    const [branchOptions, setBranchOptions] = useState<{ id: number, name: string }[]>([]);
    const [filialsMap, setFilialsMap] = useState<Record<number, string>>({});

    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [newDepartment, setNewDepartment] = useState<{
        name: string;
        director: string;
        filialName: string; // для отображения
        filialId?: number; // для отправки
    }>({
        name: "",
        director: "",
        filialName: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const filialsResponse = await getAllFilials();
                const filials = filialsResponse.results;

                const options = filials.map(filial => ({
                    id: filial.id,
                    name: filial.name
                }));
                setBranchOptions(options);

                const map = filials.reduce((acc, filial) => {
                    acc[filial.id] = filial.name;
                    return acc;
                }, {} as Record<number, string>);
                setFilialsMap(map);

                const departmentsData = await getAllDepartaments();
                const enrichedDepartments = departmentsData.map(dept => ({
                    ...dept,
                    filialName: map[dept.filial] || `Филиал #${dept.filial}`
                }));

                setDepartments(enrichedDepartments);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
                setSnackbar({
                    open: true,
                    message: 'Ошибка при загрузке данных',
                    severity: 'error'
                });
            }
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (!newDepartment.name || !newDepartment.filialId) {
                throw new Error('Все поля обязательны для заполнения');
            }

            const departmentData = {
                name: newDepartment.name,
                director: newDepartment.director,
                filial: newDepartment.filialId
            };

            if (isEditing && currentId) {
                const response = await updateDepartaments(currentId, departmentData);
                setDepartments(prev => prev.map(dept =>
                    dept.id === currentId ? {
                        ...dept,
                        ...departmentData,
                        filialName: filialsMap[departmentData.filial] || `Филиал #${departmentData.filial}`
                    } : dept
                ));

                setSnackbar({
                    open: true,
                    message: 'Подразделение успешно обновлено',
                    severity: 'success'
                });
            } else {
                const response = await addNewDepartaments(departmentData);
                if (!response || !response.id) {
                    throw new Error('Неверный формат ответа сервера');
                }

                setDepartments(prev => [...prev, {
                    id: response.id,
                    name: response.name,
                    director: response.director,
                    filial: response.filial,
                    filialName: filialsMap[response.filial] || `Филиал #${response.filial}`,
                    date_created: response.date_created
                }]);

                setSnackbar({
                    open: true,
                    message: 'Подразделение успешно добавлено',
                    severity: 'success'
                });
            }

            handleCloseModal();
        } catch (error) {
            console.error("Ошибка при сохранении подразделения:", error);
            setSnackbar({
                open: true,
                message: error instanceof Error ? error.message : 'Произошла ошибка при сохранении',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Колонки для DataGrid
    const columns: GridColDef[] = isMobile
        ? [
            { field: 'name', headerName: 'Наименование', flex: 1, minWidth: 120 },
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
            { field: 'name', headerName: 'Наименование', flex: 1, minWidth: 300 },
            {
                field: 'filialName',
                headerName: 'Филиал',
                flex: 1,
                minWidth: 100,
            },
            { field: 'director', headerName: 'Директор', flex: 1, minWidth: 150 },
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
        setNewDepartment({
            name: "",
            director: "",
            filial: "",
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить это подразделение?')) {
            return;
        }

        try {
            setLoading(true);
            const prevDepartments = [...departments];

            // Оптимистичное обновление UI
            setDepartments(prev => prev.filter(item => item.id !== id));

            try {
                await deleteDepartaments(id);
                setSnackbar({
                    open: true,
                    message: 'Подразделение успешно удалено',
                    severity: 'success'
                });
            } catch (err: any) {
                console.error('Ошибка удаления:', err);
                // Откатываем изменения при ошибке
                setDepartments(prevDepartments);

                setSnackbar({
                    open: true,
                    message: err.message.includes('204')
                        ? 'Подразделение успешно удалено'
                        : err.message || 'Ошибка при удалении подразделения',
                    severity: err.message.includes('204') ? 'success' : 'error'
                });
            }
        } finally {
            setLoading(false);
        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewDepartment(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFilialChange = (value: string) => {
        // Находим филиал по имени
        const selectedFilial = branchOptions.find(filial => filial.name === value);

        setNewDepartment(prev => ({
            ...prev,
            filialName: value,
            filialId: selectedFilial?.id
        }));
    };

    const handleEdit = (department: FilialDepartament) => {
        setIsEditing(true);
        setCurrentId(department.id);
        setNewDepartment({
            name: department.name,
            director: department.director || "",
            filialName: department.filialName || "",
            filialId: department.filial
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
                    Подразделения
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
                    rows={departments}
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

            {/* Модальное окно добавления/редактирования */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? 'Редактировать подразделение' : 'Добавить подразделение'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <InputForm
                            name="name"
                            label="Наименование подразделения"
                            value={newDepartment.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <InputForm
                            name="director"
                            label="Директор"
                            value={newDepartment.director}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <CustomAutocomplete
                            value={newDepartment.filialName}
                            onChange={handleFilialChange}
                            options={branchOptions.map(filial => filial.name)}
                            placeholder="Выберите филиал"
                            label="Филиал"
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <CustomButton onClick={handleCloseModal} variant="outlined">Отмена</CustomButton>
                    <CustomButton
                        variant="contained"
                        onClick={handleSave}
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