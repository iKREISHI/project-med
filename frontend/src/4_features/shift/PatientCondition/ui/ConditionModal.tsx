// ConditionModal.tsx (модалка заполнения документа)
import * as React from 'react';
import { Modal, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { CustomButton } from '@6_shared/Button';
import { DocumentEditor } from '@2_widgets/documetEditor';
import { usePatientConditionFormStore } from '../model/store';

interface ConditionModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (htmlContent: string, formData: any) => void;
}

const medicalTemplate = `...`; // Ваш HTML-шаблон

export const ConditionModal: React.FC<ConditionModalProps> = ({ open, onClose, onSave }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const documentEditorRef = React.useRef<any>(null);
    const { pCondition, setField } = usePatientConditionFormStore();

    const handleSave = async () => {
        if (!documentEditorRef.current) return;
        
        documentEditorRef.current.extractFormData();
        const htmlContent = documentEditorRef.current.getProcessedHtml();
        const formData = documentEditorRef.current.getFormData();

        if (!htmlContent.trim()) {
            alert('Заполните документ!');
            return;
        }

        try {
            await onSave(htmlContent, formData);
            onClose();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert('Ошибка при сохранении');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isMobile ? '95%' : '90%',
                height: '90vh',
                bgcolor: 'background.paper',
                p: 3,
                borderRadius: 2,
                overflowY: 'auto'
            }}>
                <Typography variant="h6" gutterBottom>
                    Медицинская карта пациента
                </Typography>

                <DocumentEditor
                    ref={documentEditorRef}
                    templateHtml={medicalTemplate}
                    initialData={pCondition.document_fields || {}}
                />

                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <CustomButton variant="outlined" onClick={onClose}>
                        Отмена
                    </CustomButton>
                    <CustomButton variant="contained" onClick={handleSave}>
                        Сохранить
                    </CustomButton>
                </Box>
            </Box>
        </Modal>
    );
};