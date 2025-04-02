// @ts-nocheck
import * as React from 'react';
import { Box, Typography, Modal, useTheme, useMediaQuery } from '@mui/material';
import { CustomButton } from '@6_shared/Button';
import { InputForm } from '@6_shared/Input';
import { CustomSelect } from '@6_shared/Select';

interface PatientCondition {
    id?: number;
    patient?: string;
    patient_name?: string;
    shift?: number;
    description?: string;
    date?: string;
    status?: string;
}

interface ConditionModalProps {
    open: boolean;
    onClose: () => void;
    condition: Partial<PatientCondition> | null;
    onSave?: (condition: Partial<PatientCondition>) => void;
    patients: { id: number; name: string }[];
}

const statusOptions = [
    { id: 1, value: 'stable', label: 'Стабильное' },
    { id: 2, value: 'observation', label: 'Под наблюдением' },
    { id: 3, value: 'critical', label: 'Критическое' },
    { id: 4, value: 'improving', label: 'Улучшение' },
    { id: 5, value: 'worsening', label: 'Ухудшение' },
];

const documentTemplates = [
    { id: 1, name: 'Шаблон 1' },
    { id: 2, name: 'Шаблон 2' },
];

type ShiftData = {
    document_template: string;
    document: string;
    document_fields: string;
};

export const ConditionModal: React.FC<ConditionModalProps> = ({ open, onClose, condition, onSave, patients }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [localCondition, setLocalCondition] = React.useState<Partial<PatientCondition>>({});
    const [shiftData, setShiftData] = React.useState<ShiftData>({
        document_template: '',
        document: '',
        document_fields: ''
    });

    React.useEffect(() => {
        if (open) {
            if (!condition) {
                setLocalCondition({});
                setShiftData({
                    document_template: '',
                    document: '',
                    document_fields: ''
                });
            } else {
                setLocalCondition(condition);
            }
        }
    }, [open, condition]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalCondition(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (value: string) => {
        setLocalCondition(prev => ({
            ...prev,
            status: value,
            condition_str: statusOptions.find(opt => opt.value === value)?.label
        }));
    };

    const handlePatientChange = (value: string) => {
        setLocalCondition(prev => ({
            ...prev,
            patient: value,
        }));
    };

    const handleSelectChange = (field: keyof ShiftData) => (value: string) => {
        setShiftData(prev => ({ ...prev, [field]: value }));
    };

    const handleShiftInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShiftData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (onSave) {
            onSave(localCondition);
        }
        onClose();
    };

    const isDocumentTemplateSelected = !!shiftData.document_template;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isMobile ? '90%' : 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 1
            }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    {localCondition?.id ? 'Редактирование состояния' : 'Добавление состояния'}
                </Typography>

                <Box sx={{ mb: 1, display: { lg: 'flex' }, gap: 1 }}>
                    <CustomSelect
                        value={localCondition.patient || ''}
                        onChange={handlePatientChange}
                        options={patients.map((patient) => ({
                            id: patient.id,
                            value: patient.id.toString(),
                            name: patient.name,
                        }))}
                        placeholder="Выберите пациента"
                        label="Пациент"
                        required
                        fullWidth
                    />

                    <CustomSelect
                        value={localCondition?.status || ''}
                        onChange={handleStatusChange}
                        label="Статус состояния"
                        required
                        options={statusOptions.map((option) => ({
                            id: option.id,
                            value: option.value,
                            name: option.label,
                        }))}
                        placeholder='Выберите статус состояния'
                        fullWidth
                    />
                </Box>

                <InputForm
                    type="text"
                    label="Комментарий"
                    name="description"
                    value={localCondition?.description || ''}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    fullWidth
                />

                <InputForm
                    type="text"
                    label="Название документа"
                    name="document"
                    value={shiftData.document}
                    onChange={handleShiftInputChange}
                    fullWidth
                />



                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                    <CustomButton
                        variant="outlined"
                        onClick={onClose}
                    >
                        Отмена
                    </CustomButton>
                    <CustomButton
                        variant="contained"
                        onClick={handleSubmit}
                    >
                        Сохранить
                    </CustomButton>
                </Box>
            </Box>
        </Modal>
    );
};