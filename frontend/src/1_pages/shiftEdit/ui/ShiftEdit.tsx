// @ts-nocheck
// @ts-nocheck
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Divider, useMediaQuery } from '@mui/material';
import { CustomButton } from "@6_shared/Button";
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CustomSelect } from '@6_shared/Select';
import { InputForm } from '@6_shared/Input';
import { globalsStyleSx } from '@6_shared/styles/globalsStyleSx';
import Grid from '@mui/material/Grid2';
import { PatientMenu } from '@6_shared/PatientMenu';
import { DocumentEditor } from '@2_widgets/documetEditor';

interface Shift {
    id?: number;
    doctor: string;
    doctor_name: string;
    start_time: string;
    end_time: string;
    shift_str: string;
    document_template?: string;
    document?: string;
    document_fields?: string;
    comment?: string;
}

interface Option {
    id: number;
    name: string;
    doctor?: string;
    time?: string;
}

const documentTemplates: Option[] = [
    { id: 1, name: "Открытие смены" },
    { id: 2, name: "Закрытие смены" },
];

const availableShifts: Option[] = [
    { id: 1, name: "Смена 1 (Иванов И.И.)", doctor: "Иванов И.И.", time: "15.05.2023 08:00 - 15.05.2023 20:00" },
];

const menuItems = [
    { name: "Госпитализация", path: "hospitalization" },
    { name: "Состояния пациентов", path: "conditions" },
];

// редактирование смены 
export const ShiftEdit: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 600px)");

    const [shiftData, setShiftData] = useState<Shift>({
        doctor: '',
        doctor_name: '',
        start_time: '',
        end_time: '',
        shift_str: '',
        document_template: '',
        document: '',
        document_fields: '',
        comment: ''
    });

    useEffect(() => {
        const fetchShiftData = () => {
            const mockShift = {
                id: 1,
                doctor: '1',
                doctor_name: 'Иванов И.И.',
                start_time: '2023-05-15T08:00',
                end_time: '2023-05-15T20:00',
                shift_str: 'Смена 1 (15.05.2023)',
                document_template: '1',
                comment: 'Обычная смена'
            };
            setShiftData(mockShift);
        };

        fetchShiftData();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShiftData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (field: keyof Shift) => (value: string) => {
        setShiftData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(shiftData);
    };


    const isDocumentTemplateSelected = Boolean(shiftData.document_template);

    return (
        <Box sx={{
            ...globalsStyleSx.container,
            p: 0,
            overflow: 'hidden'
        }}>

            <Box sx={{ flex: 1, p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={() => navigate('/doctor-shift')} sx={{ mr: 2 }} disableRipple>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h2">Редактирование смены</Typography>
                </Box>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <CustomSelect
                                    value={shiftData.doctor}
                                    onChange={handleSelectChange('doctor')}
                                    options={availableShifts}
                                    placeholder="Выберите врача"
                                    label="Врач"
                                    required
                                    fullWidth
                                />

                                <InputForm
                                    type="datetime-local"
                                    label="Начало смены"
                                    name="start_time"
                                    value={shiftData.start_time}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                />

                                <InputForm
                                    type="datetime-local"
                                    label="Конец смены"
                                    name="end_time"
                                    value={shiftData.end_time}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                />


                            </Box>
                        </Grid>
                        <Grid size={{ xs:12, lg: 5 }}>
                            {isDocumentTemplateSelected && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <CustomSelect
                                        value={shiftData.document_template || ''}
                                        onChange={handleSelectChange('document_template')}
                                        options={documentTemplates}
                                        placeholder="Выберите шаблон"
                                        label="Шаблон документа"
                                        fullWidth
                                    />

                                    <InputForm
                                        type="text"
                                        label="Название документа"
                                        name="document"
                                        value={shiftData.document || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />

                                    <InputForm
                                        type="text"
                                        label="Комментарий"
                                        name="comment"
                                        value={shiftData.comment || ''}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={3}
                                        fullWidth
                                    />
                                </Box>
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, lg: 11 }}>

                            <InputForm
                                type="text"
                                label="Поля документа"
                                name="document_fields"
                                value={shiftData.document_fields || ''}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                fullWidth
                            />
                        </Grid>

                    </Grid>


                    <Box sx={{ mt: 2 }}>
                        <CustomButton
                            type="submit"
                            variant="contained"
                        >
                            Сохранить изменения
                        </CustomButton>
                    </Box>
                </form >
            </Box>
            <Divider />
            <Box sx={{ overflow: 'hidden' }}>
                <Box sx={{
                    position: 'relative',
                }}>
                    {isMobile && (
                        <Box sx={{
                            width: '100%',
                            zIndex: 1,
                        }}>
                            <PatientMenu menuItems={menuItems} />
                        </Box>
                    )}
                    <Box sx={globalsStyleSx.flexContainerMenu}>
                        {!isMobile && <PatientMenu menuItems={menuItems} />}
                        <Box sx={{
                            flex: 1,
                            mt: isMobile ? 6 : 0,
                            overflow: 'auto',
                            p: 1
                        }}>
                            <Outlet />
                        </Box>
                    </Box>
                </Box>
            </Box>
            
        </Box >
    );
};