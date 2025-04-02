import * as React from 'react';
import { Box, Typography, Modal, useTheme, useMediaQuery } from '@mui/material';
import { CustomButton } from '@6_shared/Button';
import { InputForm } from '@6_shared/Input';
import { CustomSelect } from '@6_shared/Select';

interface PatchedHospitalStays {
    id?: number;
    patient: string;
    description: string;
    ward_number: string;
    appointment: string;
    document_template: string;
    document: string;
    document_fields?: string;
}

interface HospitalModalProps {
    open: boolean;
    onClose: () => void;
    condition: Partial<PatchedHospitalStays> | null;
    onSave?: (condition: Partial<PatchedHospitalStays>) => void;
    patients: { id: number; name: string }[];
    wards: { id: number; number: string }[];
    appointments: { id: number; name: string }[];
}

const documentTemplates = [
    { id: 1, name: 'Шаблон 1' },
    { id: 2, name: 'Шаблон 2' },
];

export const HospitalModal: React.FC<HospitalModalProps> = ({ open, onClose, condition, onSave, patients, wards, appointments }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [localStay, setLocalStay] = React.useState<Partial<PatchedHospitalStays>>({});
    const [documentData, setDocumentData] = React.useState({
        document_template: '',
        document: '',
        document_fields: ''
    });

    React.useEffect(() => {
        if (open) {
            if (!condition) {
                setLocalStay({});
                setDocumentData({
                    document_template: '',
                    document: '',
                    document_fields: ''
                });
            } else {
                setLocalStay(condition);
                if (condition.document_template) {
                    setDocumentData({
                        document_template: condition.document_template,
                        document: condition.document || '',
                        document_fields: condition.document_fields || ''
                    });
                }
            }
        }
    }, [open, condition]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalStay(prev => ({ ...prev, [name]: value }));
    };

    const handlePatientChange = (value: string) => {
        setLocalStay(prev => ({
            ...prev,
            patient: value,
        }));
    };

    const handleWardChange = (value: string) => {
        setLocalStay(prev => ({
            ...prev,
            ward_number: value,
        }));
    };

    const handleAppointmentChange = (value: string) => {
        setLocalStay(prev => ({
            ...prev,
            appointment: value,
        }));
    };

    const handleSelectChange = (field: keyof typeof documentData) => (value: string) => {
        setDocumentData(prev => ({ ...prev, [field]: value }));
    };

    const handleDocumentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDocumentData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (onSave) {
            onSave({
                ...localStay,
                document_template: documentData.document_template,
                document: documentData.document,
                document_fields: documentData.document_fields
            });
        }
        onClose();
    };

    const isDocumentTemplateSelected = !!documentData.document_template;

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
                    {localStay?.id ? 'Редактирование госпитализации' : 'Добавление госпитализации'}
                </Typography>

                <Box sx={{ mb: 1, display: { lg: 'flex' }, gap: 1 }}>
                    <CustomSelect
                        value={localStay.patient || ''}
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
                        value={localStay.ward_number || ''}
                        onChange={handleWardChange}
                        options={wards.map((ward) => ({
                            id: ward.id,
                            value: ward.number,
                            name: ward.number,
                        }))}
                        placeholder="Выберите палату"
                        label="Номер палаты"
                        fullWidth
                    />
                </Box>

                <InputForm
                    type="text"
                    label="Описание"
                    name="description"
                    value={localStay.description || ''}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    fullWidth
                />

                <Box sx={{ mb: 1, display: { lg: 'flex' }, gap: 1, mt: 1 }}>
                    <CustomSelect
                        value={localStay.appointment || ''}
                        onChange={handleAppointmentChange}
                        options={appointments.map((appointment) => ({
                            id: appointment.id,
                            value: appointment.id.toString(),
                            name: appointment.name,
                        }))}
                        placeholder="Выберите прием"
                        label="Прием"
                        fullWidth
                    />

                    <CustomSelect
                        value={documentData.document_template}
                        onChange={handleSelectChange('document_template')}
                        options={documentTemplates.map(t => ({
                            id: t.id,
                            value: t.id.toString(),
                            name: t.name
                        }))}
                        placeholder="Выберите шаблон"
                        label="Шаблон документа"
                        fullWidth
                    />
                </Box>

                {isDocumentTemplateSelected && (
                    <>
                        <InputForm
                            type="text"
                            label="Название документа"
                            name="document"
                            value={documentData.document}
                            onChange={handleDocumentInputChange}
                            fullWidth
                        />

                        <InputForm
                            type="text"
                            label="Поля документа"
                            name="document_fields"
                            value={documentData.document_fields}
                            onChange={handleDocumentInputChange}
                            multiline
                            rows={4}
                            fullWidth
                        />
                    </>
                )}

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