// @ts-nocheck
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { CustomButton } from "@6_shared/Button";
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { InputForm } from '@6_shared/Input';
import { globalsStyleSx } from '@6_shared/styles/globalsStyleSx';
import Grid from '@mui/material/Grid2';

import { getCurrentUser } from '@5_entities/user';
import { getAllShifts } from '@5_entities/shift';
import { CustomAutocomplete } from '@6_shared/Autocomplete';
import { POST } from '@6_shared/api';

const documentTemplates = [
    { id: 1, name: "Передача смены" },
    { id: 2, name: "Смена врача" }
];

export const ShiftTransfer: React.FC = () => {
    const navigate = useNavigate();
    const [transferData, setTransferData] = useState({
        from_shift: null,
        to_shift: null,
        comment: '',
        document_template: null,
        document: '',
        document_fields: '',
    });

    const [shifts, setShifts] = useState<{ id: number, label: string }[]>([]);
    const [templates, setTemplates] = useState<{ id: number, label: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getCurrentUser();
                const shiftResponse = await getAllShifts({ doctor: user.id });

                const mappedShifts = shiftResponse.results.map(shift => ({
                    id: shift.id,
                    label: shift.shift_str
                }));

                setShifts(mappedShifts);
                setTemplates(documentTemplates.map(dt => ({
                    id: dt.id,
                    label: dt.name
                })));
            } catch (error) {
                console.error('Ошибка при загрузке:', error);
            }
        };

        fetchData();
    }, []);

    const handleAutocompleteChange = (field: keyof typeof transferData) => (value: string) => {
        const options = field === 'document_template' ? templates : shifts;
        const selected = options.find(opt => opt.label === value);
        setTransferData(prev => ({
            ...prev,
            [field]: selected?.id ?? null
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTransferData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            from_shift: transferData.from_shift,
            to_shift: transferData.to_shift,
            comment: transferData.comment,
            document_template: transferData.document_template,
            document: transferData.document,
            document_fields: transferData.document_fields
        };

        try {
            const response = await POST('/api/v0/shift-transfers/', {
                body: payload
            });
            console.log('Успешно отправлено:', response);
            navigate('/doctor-shift');
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
        }
    };

    return (
        <Box sx={{ ...globalsStyleSx.container, p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/doctor-shift')} sx={{ mr: 2 }} disableRipple>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h2">Передача смены</Typography>
            </Box>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid xs={12}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 2 }}>
                                <CustomAutocomplete
                                    value={shifts.find(s => s.id === transferData.from_shift)?.label || ''}
                                    onChange={handleAutocompleteChange('from_shift')}
                                    options={shifts.map(s => s.label)}
                                    placeholder="Выберите смену"
                                    label="Смена для передачи"
                                    required
                                />
                                <CustomAutocomplete
                                    value={shifts.find(s => s.id === transferData.to_shift)?.label || ''}
                                    onChange={handleAutocompleteChange('to_shift')}
                                    options={shifts.map(s => s.label)}
                                    placeholder="Смена принимающего врача"
                                    label="Смена принимающего врача"
                                    required
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', lg: 'row' } }}>
                                <CustomAutocomplete
                                    value={templates.find(t => t.id === transferData.document_template)?.label || ''}
                                    onChange={handleAutocompleteChange('document_template')}
                                    options={templates.map(t => t.label)}
                                    placeholder="Выберите шаблон"
                                    label="Шаблон документа"
                                    required
                                />
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
                                <CustomButton type="submit" variant="contained">
                                    Сохранить
                                </CustomButton>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};
