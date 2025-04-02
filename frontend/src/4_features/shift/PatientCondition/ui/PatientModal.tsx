import * as React from 'react';
import { Box, Typography, Modal, useTheme, useMediaQuery } from '@mui/material';
import { CustomButton } from '@6_shared/Button';
import { usePatientConditionFormStore } from '../model/store';
import { CustomAutocomplete } from '@6_shared/Autocomplete';
import { getAllPatients, Patient } from '@5_entities/patient';

interface PatientModalProps {
    open: boolean;
    onClose: () => void;
}

export const PatientModal: React.FC<PatientModalProps> = ({ open, onClose }) => {
    const [patients, setPatients] = React.useState<Patient[]>([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { pCondition, setField } = usePatientConditionFormStore();

    React.useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getAllPatients(1, 10);
                setPatients(data.results);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPatients();
    }, []);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isMobile ? '20%' : '30%',
                height: '50vh',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 3,
                borderRadius: 2,
                overflowY: 'auto'
            }}>
                <Typography variant="h5" sx={{ mb: 3 }}>
                    Выберите пациента
                </Typography>
                <CustomAutocomplete
                    value={pCondition.patient ?
                        patients?.find(p => p.id === pCondition.patient)?.last_name || ''
                        : ''
                    }
                    onChange={(value) => {
                        const selected = patients?.find(p => p.last_name === value);
                        setField('patient', selected?.id);
                    }}
                    options={patients?.map(p => p.last_name) || []}
                    placeholder='Выберите пациента'
                    label='Пациент'
                    required
                />
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    mt: 3,
                    position: 'sticky',
                    bottom: 0,
                    bgcolor: 'background.paper',
                    py: 2
                }}>
                    <CustomButton variant="outlined" onClick={onClose}>
                        Отмена
                    </CustomButton>
                    <CustomButton variant="contained" onClick={onClose}>
                        Сохранить
                    </CustomButton>
                </Box>
            </Box>
        </Modal>
    );
};
