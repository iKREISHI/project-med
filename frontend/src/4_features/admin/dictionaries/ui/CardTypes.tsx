// @ts-nocheck
// @ts-nocheck
import { FC, useState } from "react";
import { Box, Paper, Theme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ruRU } from '@mui/x-data-grid/locales';
import { Add, Edit, Delete } from "@mui/icons-material";
import { CustomButton } from "@6_shared/Button";
import { InputForm } from "@6_shared/Input";

interface CardType {
  id: number;
  name: string;
  suffix: string;
  prefix: string;
  begin_number: string;
  description: string;
}

export const CardTypes: FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [cardTypes, setCardTypes] = useState<CardType[]>([
        {
            id: 1,
            name: "Стандартная",
            suffix: "suff",
            prefix: "perf",
            begin_number: "0",
            description: "Стандартная карта"
        },
    ]);

    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [newCardType, setNewCardType] = useState<Omit<CardType, 'id'>>({
        name: "",
        suffix: "",
        prefix: "",
        begin_number: "",
        description: ""
    });

    // для десктопной версии
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

    // для мобильной версии
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
            suffix: "",
            prefix: "",
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

    const handleDelete = (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этот тип карты?')) {
            alert('Тип карты удален');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCardType((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (cardType: CardType) => {
        setIsEditing(true);
        setCurrentId(cardType.id);
        setNewCardType({
            name: cardType.name,
            suffix: cardType.suffix,
            prefix: cardType.prefix,
            begin_number: cardType.begin_number,
            description: cardType.description
        });
        setOpenModal(true);
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
                boxShadow: theme.shadows[3],
                borderRadius: (theme: Theme) => theme.shape.borderRadius,
            }}>
                <DataGrid
                    rows={cardTypes}
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
                <DialogTitle>{isEditing ? 'Редактировать тип карты' : 'Добавить тип карты'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <InputForm
                            type="text"
                            name="name"
                            label="Название"
                            value={newCardType.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <InputForm
                                type="text"
                                name="prefix"
                                label="Префикс"
                                value={newCardType.prefix}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <InputForm
                                type="text"
                                name="suffix"
                                label="Суффикс"
                                value={newCardType.suffix}
                                onChange={handleInputChange}
                                fullWidth
                            />
                        </Box>
                        <InputForm
                            type="text"
                            name="begin_number"
                            label="Начальный номер"
                            value={newCardType.begin_number}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <InputForm
                            type="text"
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
                    <CustomButton variant="contained">
                        {isEditing ? 'Обновить' : 'Сохранить'}
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};