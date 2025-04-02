// @ts-nocheck
// @ts-nocheck
import * as React from 'react';
import { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { CustomButton } from "@6_shared/Button";
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CustomSelect } from '@6_shared/Select';
import { InputForm } from '@6_shared/Input';
import { globalsStyleSx } from '@6_shared/styles/globalsStyleSx';
import Grid from '@mui/material/Grid2';

interface Shift {
    id?: number;
    doctor: string;
    doctor_name: string;
    start_time: string;
    end_time: string;
    shift: string;
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
];

const availableShifts: Option[] = [
    { id: 1, name: "Смена 1 (Иванов И.И.)", doctor: "Иванов И.И.", time: "15.05.2023 08:00 - 15.05.2023 20:00" },
];

// создание / открытие смены 
export const ShiftCreate: React.FC = () => {
    const navigate = useNavigate();
    const [shiftData, setShiftData] = useState<Shift>({
        doctor: '',
        doctor_name: '',
        start_time: '',
        end_time: '',
        shift: '',
        document_template: '',
        document: '',
        document_fields: '',
        comment: ''
    });

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
            ...globalsStyleSx.container, p: 4
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/doctor-shift')} sx={{ mr: 2 }} disableRipple>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h2">Открытие смены</Typography>
            </Box>

            <Box>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, lg: 12 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <CustomSelect
                                    value={shiftData.doctor}
                                    onChange={handleSelectChange('doctor')}
                                    options={availableShifts}
                                    placeholder="Выберите врача"
                                    label="Врач"
                                    required
                                    fullWidth
                                />
                                <Box sx={{
                                    display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 2, '& > *': {
                                        flex: '1 1 50%',
                                    }
                                }}>
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


                                <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    flexDirection: { xs: 'column', lg: 'row' },
                                    '& > *': {
                                        flex: '1 1 50%',
                                    }
                                }}>
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
                                </Box>
                                {isDocumentTemplateSelected && (
                                    <>
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
                                    </>
                                )}
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

                                <Box>
                                    <CustomButton
                                        type="submit"
                                        variant="contained"
                                    >
                                        Открыть смену
                                    </CustomButton>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Box>
    );
};