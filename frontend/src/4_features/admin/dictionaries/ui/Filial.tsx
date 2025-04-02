// @ts-nocheck
// @ts-nocheck
import { FC, useState, useEffect } from "react";
import { Box, Paper, Theme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ruRU } from '@mui/x-data-grid/locales';
import { Add, Delete, Edit } from "@mui/icons-material";
import { CustomButton } from "@6_shared/Button";
import { InputForm } from "@6_shared/Input";
import { getAllFilials } from "@5_entities/filial/api/getAllFilials";
import { deleteFilial } from "@5_entities/filial/api/deleteFilial";
import { updateFilial } from "@5_entities/filial/api/updateFilial";
import { addNewFilial } from "@5_entities/filial/api/addNewFilial";

interface FilialType {
    readonly id: number;
    city: string;
    street: string;
    house: string;
    building?: string | null;
}

export const Filial: FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [branches, setBranches] = useState<FilialType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [newBranch, setNewBranch] = useState<Omit<FilialType, 'id'>>({
        city: "",
        street: "",
        house: "",
        building: "",
    });

    const fetchBranches = async () => {
        try {
            setLoading(true);
            const apiResponse = await getAllFilials();
            setBranches(apiResponse.results); 
            setError(null);
        } catch (err) {
            setError("Не удалось загрузить филиалы");
            console.error("Ошибка при загрузке филиалов:", err);
        } finally {
            setLoading(false);
        }
    };

    // Загрузка филиалов при монтировании компонента
    useEffect(() => {
        fetchBranches();
    }, []);

    // для десктопной версии
    const desktopColumns: GridColDef<FilialType>[] = [
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
    const mobileColumns: GridColDef<FilialType>[] = [
        { field: 'city', headerName: 'Город', flex: 1, minWidth: 120 },
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

    const handleOpenModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setNewBranch({
            city: "",
            street: "",
            house: "",
            building: "",
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этот филиал?')) {
            try {
                await deleteFilial(id);
                setBranches(prev => prev.filter(branch => branch.id !== id));
            } catch (err) {
                console.error("Ошибка при удалении филиала:", err);
                alert("Не удалось удалить филиал");
            }
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewBranch(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (branch: FilialType) => {
        setIsEditing(true);
        setCurrentId(branch.id);
        setNewBranch({
            city: branch.city,
            street: branch.street,
            house: branch.house,
            building: branch.building || "",
        });
        setOpenModal(true);
    };

    const handleSubmit = async () => {
        try {

            if (isEditing && currentId) {
                // Редактирование существующего филиала
                const updatedData = {
                    city: newBranch.city.trim(),
                    street: newBranch.street.trim(),
                    house: newBranch.house.trim(),
                    building: newBranch.building?.trim() || null,
                };
                
                const updatedBranch = await updateFilial(currentId, updatedData);
                // Обновляем состояние с новыми данными
                setBranches(prev => prev.map(branch => 
                    branch.id === currentId ? { ...branch, ...updatedData } : branch
                ));
            } else {
                // Создание нового филиала
                const newFilialData = {
                    city: newBranch.city.trim(),
                    street: newBranch.street.trim(),
                    house: newBranch.house.trim(),
                    building: newBranch.building?.trim() || null,
                };
                
                const createdBranch = await addNewFilial(newFilialData);
                // Добавляем новый филиал в состояние
                setBranches(prev => [...prev, createdBranch]);
            }
            
            handleCloseModal();
            // Сбрасываем форму после успешного сохранения
            setNewBranch({
                city: '',
                street: '',
                house: '',
                building: '',
            });
        } catch (err) {
            console.error("Ошибка при сохранении филиала:", err);
        }
    };

    return (
        <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
            <Box sx={{ mb: 2, display: { lg: 'flex' }, justifyContent: 'space-between', alignItems: 'center' }}>
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

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

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
                    loading={loading}
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
                <DialogTitle>{isEditing ? 'Редактировать филиал' : 'Добавить филиал'}</DialogTitle>
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
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <CustomButton onClick={handleCloseModal} variant="outlined">Отмена</CustomButton>
                    <CustomButton
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!newBranch.city || !newBranch.street || !newBranch.house}
                    >
                        {isEditing ? 'Обновить' : 'Сохранить'}
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};