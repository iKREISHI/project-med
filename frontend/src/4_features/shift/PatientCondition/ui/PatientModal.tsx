import * as React from 'react';
import { Box, Typography, Modal, useTheme, useMediaQuery } from '@mui/material';
import { CustomButton } from '@6_shared/Button';
import { DocumentEditor } from '@2_widgets/documetEditor';
import { usePatientConditionFormStore } from '../model/store';
import { CustomAutocomplete } from '@6_shared/Autocomplete';
import { getAllPatients, PaginatedPatientList, Patient } from '@5_entities/patient';
import { Cast } from '@mui/icons-material';


interface ConditionModalProps {
    open: boolean;
    onClose: () => void;
    onSave?: (documentContent: string) => void;
}



export const PatientModal: React.FC<ConditionModalProps> = ({ open, onClose, onSave }) => {
    const [patients, setPatients] = React.useState<Patient[]>()
    React.useEffect(() => {
        const fetchPatients = async () =>{
            try{
                const patientData = await getAllPatients(1, 10);
                setPatients(patientData.results)
            } catch (error){
                console.error(error);
            }
        }
        fetchPatients();
    }, []);
    
    const theme = useTheme();
    const { pCondition, setField } = usePatientConditionFormStore();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isMobile ? '95%' : '80%',
                height: '90vh',
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
                        const selectedPat = patients?.find(p => p.last_name === value);
                        setField('patient', selectedPat?.id);
                    }}
                    options={patients?.map(p => p.last_name) || []}
                    placeholder='Выберите пациента'
                    label = 'Пациент'
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
                    <CustomButton variant="outlined" onClick={onClose} sx={{ minWidth: 120 }}>
                        Отмена
                    </CustomButton>
                    <CustomButton 
                        variant="contained" 
                        onClick={onClose}
                        sx={{ minWidth: 160 }}
                    >
                        Сохранить
                    </CustomButton>
                </Box>
            </Box>
        </Modal>
    );
};