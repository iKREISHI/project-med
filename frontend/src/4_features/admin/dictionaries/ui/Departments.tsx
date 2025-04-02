// @ts-nocheck
import { FC, useState } from "react";
import { Box, Paper, Theme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ruRU } from '@mui/x-data-grid/locales';
import { Add, Edit, Delete } from "@mui/icons-material";
import { CustomButton } from "@6_shared/Button";
import { InputForm } from "@6_shared/Input";
import { CustomSelect } from "@6_shared/Select";

export const Departments: FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const branchOptions = [
        { id: 1, name: "Филиал 1" },
    ];

    const [departments, setDepartments] = useState([
        {
            id: 1,
            branch: "Филиал 1",
            manager: "Иванов И.И.",
            fullName: "Полное наименование",
        },
    ]);

    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [newDepartment, setNewDepartment] = useState({
        branch: "",
        manager: "",
        fullName: "",
    });

    // для десктопной версии
    const desktopColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 80 },
        { field: 'branch', headerName: 'Филиал', flex: 1, minWidth: 150 },
        { field: 'manager', headerName: 'Руководитель', flex: 1, minWidth: 150 },
        { field: 'fullName', headerName: 'Полное наименование', flex: 2, minWidth: 250 },
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
        { field: 'fullName', headerName: 'Наименование', flex: 1, minWidth: 120 },
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
        setNewDepartment({
            branch: "",
            manager: "",
            fullName: "",
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить это подразделение?')) {
            alert('Подразделение удалено');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewDepartment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setNewDepartment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (department: any) => {
        setIsEditing(true);
        setCurrentId(department.id);
        setNewDepartment({
            branch: department.branch,
            manager: department.manager,
            fullName: department.fullName
        });
        setOpenModal(true);
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
                boxShadow: theme.shadows[3],
                borderRadius: (theme: Theme) => theme.shape.borderRadius,
            }}>
                <DataGrid
                    rows={departments}
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
                <DialogTitle>{isEditing ? 'Редактировать подразделение' : 'Добавить подразделение'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <CustomSelect
                            value={newDepartment.branch}
                            onChange={(value) => handleSelectChange('branch', value)}
                            options={branchOptions}
                            placeholder="Выберите филиал"
                            label="Филиал"
                            required
                        />
                        <InputForm
                            type="text"
                            name="manager"
                            label="Руководитель"
                            value={newDepartment.manager}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <InputForm
                            type="text"
                            name="fullName"
                            label="Полное наименование"
                            value={newDepartment.fullName}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <CustomButton onClick={handleCloseModal} variant="outlined">Отмена</CustomButton>
                    <CustomButton variant="contained">
                        {isEditing ? 'Обновить' : 'Сохранить'}
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};