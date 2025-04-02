import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Paper, useTheme, useMediaQuery, Theme, Typography, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ruRU } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';
import { InputSearch } from "@6_shared/Input";
import { CustomButton } from "@6_shared/Button";
import { getAllLaboratoryResearch } from '@5_entities/laboratoryResearch/api/getAllLaboratoryResearch';
import { getAllPatients, Patient } from '@5_entities/patient';
import { Laboratory } from '@5_entities/laboratory/model/model';
import { LabResearch } from '@5_entities/laboratoryResearch/model/model';
import { getAllLaboratory } from '@5_entities/laboratory/api/getAllLaboratory';


export const LaboratoryResearch: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [researches, setResearches] = useState<LabResearch[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
    const [loading, setLoading] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const isDarkText = !(theme.palette.mode === "dark");

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    useEffect(() => {
        fetchData();
    }, [paginationModel.page, paginationModel.pageSize, searchQuery]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [researchesRes, patientsRes, labsRes] = await Promise.all([
                getAllLaboratoryResearch({
                    page: paginationModel.page + 1,
                    page_size: paginationModel.pageSize,
                }),
                getAllPatients(),
                getAllLaboratory()
            ]);

            setResearches(researchesRes.results || []);
            setRowCount(researchesRes.count || 0);
            setPatients(patientsRes.results || []);
            setLaboratories(labsRes.results || []);
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
        } finally {
            setLoading(false);
        }
    };

    const getPatientName = (patientId?: number): string => {
        if (!patientId) return 'Не указан';
        const patient = patients.find(p => p.id === patientId);
        return patient ? `${patient.last_name} ${patient.first_name[0]}.` : 'Неизвестный';
    };

    const getLabName = (labId: number): string => {
        const lab = laboratories.find(l => l.id === labId);
        return lab ? lab.name : 'Неизвестная лаборатория';
    };

    const statusColors = {
        completed: 'success',
        process: 'warning'
    };

    const processedData = researches.map(research => ({
        ...research,
        patient_name: getPatientName(research.patient || undefined),
        lab_name: getLabName(research.laboratory),
        formatted_date: new Date(research.create_date).toLocaleDateString(),
        status_label: research.status === 'completed' ? 'Завершено' : 'В процессе'
    }));

    const desktopColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'number', headerName: 'Номер', flex: 1, minWidth: 120 },
        {
            field: 'status',
            headerName: 'Статус',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.row.status_label}
                    size="small"
                />
            )
        },
        { field: 'patient_name', headerName: 'Пациент', flex: 1, minWidth: 150 },
        { field: 'lab_name', headerName: 'Лаборатория', flex: 1, minWidth: 180 },
        { field: 'formatted_date', headerName: 'Дата создания', width: 120 },
        {
            field: 'is_priority',
            headerName: 'Приоритет',
            width: 100,
            renderCell: (params) => params.value ? 'CITO' : 'Нет'
        },
    ];

    const mobileColumns: GridColDef[] = [
        { field: 'number', headerName: 'Номер', flex: 1 },
        {
            field: 'status',
            headerName: 'Статус',
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.row.status_label}
                    size="small"
                />
            )
        },
        { field: 'patient_name', headerName: 'Пациент', flex: 1 },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>

                <InputSearch
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    placeholder="Поиск"
                    isDarkText={isDarkText}
                    bgcolorFlag={true}
                />
            </Box>
            <Paper sx={{
                width: {
                    xs: `91vw`,
                    sm: '100%'
                },
                overflow: 'hidden',
                boxShadow: theme.shadows[0],
                borderRadius: (theme: Theme) => theme.shape.borderRadius,
            }}>
                <DataGrid
                    rows={processedData}
                    columns={isMobile ? mobileColumns : desktopColumns}
                    autoHeight
                    loading={loading}
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
        </Box>
    );
};