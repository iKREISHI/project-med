// @ts-nocheck
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Paper, useTheme, useMediaQuery, Theme, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import { ruRU } from '@mui/x-data-grid/locales';
import { ConditionModal } from './ConditionModal';
import { CustomButton } from '@6_shared/Button';
import EditIcon from '@mui/icons-material/Edit';
import { PatientModal } from './PatientModal';
import { getAllConditions } from '@5_entities/patientCondition';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface PatientCondition {
    id: number;
    patient: string;
    shift: number;
    shift_str: string;
    description?: string;
    date: string;
    status: string;
    condition_str: string;
    document_template?: string;
    document?: string;
    document_fields?: object;
}

export const PatientCondition: React.FC = () => {
    const { shiftId } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [conditions, setConditions] = useState<PatientCondition[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [openPatientModal, setOpenPatientModal] = useState(false);
    const [shouldOpenConditionModal, setShouldOpenConditionModal] = useState(false);
    const [currentCondition, setCurrentCondition] = useState<Partial<PatientCondition> | null>(null);

    useEffect(() => {
        const fetchConditions = async () => {
            try {
                const response = await getAllConditions({ shift: shiftId });
                setConditions(response.results || []);
            } catch (error) {
                console.error('Ошибка при загрузке состояний:', error);
            }
        };

        fetchConditions();
    }, [shiftId]);

    useEffect(() => {
        if (shouldOpenConditionModal) {
            setShouldOpenConditionModal(false);
            handleOpenModal(null);
        }
    }, [shouldOpenConditionModal]);

    const handleOpenModal = (condition: Partial<PatientCondition> | null) => {
        setCurrentCondition(condition || {
            patient: undefined,
            shift: Number(shiftId),
            description: '',
            date: new Date().toISOString(),
            status: '',
        });
        setOpenModal(true);
    };

    const exportToExcel = () => {
        const worksheetData = conditions.map((cond) => ({
            ID: cond.id,
            Пациент: cond.patient,
            Смена: cond.shift_str,
            Статус: cond.condition_str,
            Описание: cond.description,
            Дата: new Date(cond.date).toLocaleString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Состояния");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, "Состояния_пациентов.xlsx");
    };

    const desktopColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 80 },
        { field: 'patient', headerName: 'Пациент', flex: 1, minWidth: 180 },
        { field: 'condition_str', headerName: 'Статус', flex: 1, minWidth: 150 },
        {
            field: 'description',
            headerName: 'Описание',
            flex: 1.5,
            minWidth: 200,
            renderCell: (params) => (
                <Box sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%'
                }}>
                    {params.value}
                </Box>
            )
        },
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
        { field: 'patient', headerName: 'Пациент', flex: 1, minWidth: 120 },
        { field: 'condition_str', headerName: 'Статус', flex: 1, minWidth: 100 },
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
                    onClick={() => setOpenPatientModal(true)}
                >
                    Добавить
                </CustomButton>

                <CustomButton
                    variant="outlined"
                    onClick={exportToExcel}
                >
                    Выгрузить в Excel
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

            <PatientModal
                open={openPatientModal}
                onClose={() => {
                    setOpenPatientModal(false);
                    setShouldOpenConditionModal(true);
                }}
            />

            <ConditionModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                condition={currentCondition}
                patients={[]} // можно подгрузить реально
            />
        </Box>
    );
};
