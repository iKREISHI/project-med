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

interface ShiftTransfer {
    id?: number;
    from_shift: string;
    to_shift: string;
    comment: string;
    document_template: string;
    document: string;
    document_fields: string;
}

interface Option {
    id: number;
    name: string;
    doctor?: string;
    time?: string;
}

const documentTemplates: Option[] = [
    { id: 1, name: "Передача смены" },
];

const availableShifts: Option[] = [
    { id: 1, name: "Смена 1 (Иванов И.И.)", doctor: "Иванов И.И.", time: "15.05.2023 08:00 - 15.05.2023 20:00" },
];

// передача смены
export const ShiftTransfer: React.FC = () => {
    const navigate = useNavigate();
    const [transferData, setTransferData] = useState<ShiftTransfer>({
        from_shift: '',
        to_shift: '',
        comment: '',
        document_template: '',
        document: '',
        document_fields: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTransferData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (field: keyof ShiftTransfer) => (value: string) => {
        setTransferData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const isDocumentTemplateSelected = Boolean(transferData.document_template);

    return (
        <Box sx={{
            ...globalsStyleSx.container, p: 4
        }}> 
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/doctor-shift')} sx={{ mr: 2 }} disableRipple>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h2">Передача смены</Typography>
            </Box>

            <Box>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, lg: 12 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 2 }}>
                                    <CustomSelect
                                        value={transferData.from_shift}
                                        onChange={handleSelectChange('from_shift')}
                                        options={availableShifts}
                                        placeholder="Выберите смену"
                                        label="Смена для передачи"
                                        required
                                        fullWidth
                                    />
                                    <CustomSelect
                                        value={transferData.to_shift}
                                        onChange={handleSelectChange('to_shift')}
                                        options={availableShifts}
                                        placeholder="Выберите смену"
                                        label="Смена принимающего врача"
                                        required
                                        fullWidth
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
                                        value={transferData.document_template}
                                        onChange={handleSelectChange('document_template')}
                                        options={documentTemplates}
                                        placeholder="Выберите шаблон"
                                        label="Шаблон документа"
                                        required
                                        fullWidth
                                    />
                                    <Box>
                                        <InputForm
                                            type="text"
                                            label="Название документа"
                                            name="document"
                                            value={transferData.document}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                        />
                                    </Box>
                                </Box>
                                {isDocumentTemplateSelected && (
                                    <>
                                        <InputForm
                                            type="text"
                                            label="Поля документа"
                                            name="document_fields"
                                            value={transferData.document_fields}
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
                                    value={transferData.comment}
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
                                        Сохранить
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