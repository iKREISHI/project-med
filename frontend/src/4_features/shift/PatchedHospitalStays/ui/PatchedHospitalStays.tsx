// @ts-nocheck
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Paper, useTheme, useMediaQuery, Theme, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import { ruRU } from '@mui/x-data-grid/locales';
import { HospitalModal } from './HospitalModal';
import { CustomButton } from '@6_shared/Button';
import EditIcon from '@mui/icons-material/Edit';

interface PatientCondition {
    id: number;
    patient: string;
    ward: string;
    shift: string;
    description?: string;
    document_template?: string;
    document?: string;
    document_fields?: string;
}

const mockPatients = [
    { id: 1, name: 'Иванов Иван Иванович' },
    { id: 2, name: 'Петров Петр Петрович' },
    { id: 3, name: 'Сидорова Мария Сергеевна' },
];

const mockConditions: PatientCondition[] = [
    {
        id: 1,
        patient: 'Иванов Иван Иванович',
        ward: '101',
        shift: 'Смена 1 (15.05.2023)',
        description: 'Состояние стабильное, жалоб нет',
    },
];
const mockWards = [
    { id: 1, number: '101' },
    { id: 2, number: '102' },
    { id: 3, number: '103' },
];

const mockAppointments = [
    { id: 1, name: 'Первичный осмотр' },
    { id: 2, name: 'Повторный осмотр' },
    { id: 3, name: 'Экстренный прием' },
];
// госпитализация пациентов (таблица)
export const PatchedHospitalStays: React.FC = () => {
    const { shiftId } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [conditions, setConditions] = useState<PatientCondition[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [currentCondition, setCurrentCondition] = useState<Partial<PatientCondition> | null>(null);

    useEffect(() => {
        setConditions(mockConditions);
    }, [shiftId]);

    const desktopColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 80 },
        { field: 'patient', headerName: 'ФИО', flex: 1, minWidth: 180 },
        { field: 'ward', headerName: 'Палата', flex: 1, minWidth: 100 },
        {
            field: 'actions',
            headerName: 'Действия',
            width: 100,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(params.row);
                    }}
                    disableRipple
                >
                    <EditIcon />
                </IconButton>
            ),
        },
    ];

    const mobileColumns: GridColDef[] = [
        { field: 'patient', headerName: 'ФИО', flex: 1, minWidth: 120 },
        { field: 'ward', headerName: 'Палата', flex: 1, minWidth: 80 },
        {
            field: 'actions',
            headerName: 'Действия',
            width: 80,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(params.row);
                    }}
                >
                    <EditIcon />
                </IconButton>
            ),
        },
    ];

    const columns = isMobile ? mobileColumns : desktopColumns;

    const handleOpenModal = (condition: Partial<PatientCondition> | null) => {
        setCurrentCondition(condition || {
            patient: undefined,
            ward: undefined,
            shift: undefined,
            description: '',
        });
        setOpenModal(true);
    };

    return (
        <Box>
            <Box sx={{
                mb: 1,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 1,
                alignItems: isMobile ? 'stretch' : 'center'
            }}>
                <CustomButton
                    variant="contained"
                    onClick={() => handleOpenModal(null)}
                >
                    Добавить
                </CustomButton>
            </Box>

            <Paper sx={{
                width: '100%',
                overflow: 'hidden',
                boxShadow: theme.shadows[3],
                borderRadius: (theme: Theme) => theme.shape.borderRadius,
            }}>
                <DataGrid
                    rows={conditions}
                    columns={columns}
                    autoHeight
                    disableRowSelectionOnClick
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    sx={{
                        '& .MuiDataGrid-cell': {
                            whiteSpace: 'normal',
                            lineHeight: '1.5',
                            py: 1,
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: theme.palette.grey[100],
                        },
                    }}
                    localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                />
            </Paper>

            <HospitalModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                condition={currentCondition}
                patients={mockPatients}
                wards={mockWards}
                appointments={mockAppointments}
            />
        </Box>
    );
};