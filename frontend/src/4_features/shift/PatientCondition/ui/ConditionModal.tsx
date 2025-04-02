import * as React from 'react';
import { Box, Typography, Modal, useTheme, useMediaQuery } from '@mui/material';
import { CustomButton } from '@6_shared/Button';
import { DocumentEditor } from '@2_widgets/documetEditor';
import { usePatientConditionFormStore } from '../model/store';
import { addNewCondition, PatientCondition } from '@5_entities/patientCondition';
import { getPatient } from '@5_entities/patient';

interface ConditionModalProps {
    open: boolean;
    onClose: () => void;
    onSave?: (documentContent: string) => void;
}

const medicalTemplate = `
<div class="medical-document">
  <header class="document-header">
    <div class="clinic-info">
      <p>Государственное бюджетное учреждение здравоохранения</p>
      <p>"Шадринская городская больница"</p>
      <p>г. Шадринск, ул.Михайловская </p>
    </div>
    
    <h1>МЕДИЦИНСКАЯ КАРТА СТАЦИОНАРНОГО БОЛЬНОГО</h1>
    <div class="document-number">
      № <input type="text" name="document_number" class="underlined-input short">
    </div>
  </header>

  <div class="patient-info">
    <h2>Информация о пациенте:</h2>
    <div class="info-row">
        <div class="form-field">
        <label>Пациент:</label>
        <span>{{patient_name}}</span>
      </div>
    </div>
  </div>

  <div class="main-content">
    <h2>Объективный статус:</h2>
    <div class="form-field">
      <label>Cостояние:</label>
      <input type="text" name="general_state" class="underlined-input" placeholder="удовлетворительное">
    </div>

    <h3>Жизненно важные показатели:</h3>
    <div class="vital-signs">
      <div class="form-field">
        <label>АД:</label>
        <input type="text" name="blood_pressure" class="underlined-input short" placeholder="120/80">
      </div>
      <div class="form-field">
        <label>ЧДД:</label>
        <input type="text" name="respiratory_rate" class="underlined-input short">
      </div>
      <div class="form-field">
        <label>ЧСС:</label>
        <input type="text" name="heart_rate" class="underlined-input short">
      </div>
    </div>

    <h3>Неврологический статус:</h3>
    <div class="form-field">
      <textarea name="neurological_status" class="underlined-textarea"></textarea>
    </div>

    <h3>Назначения:</h3>
    <div class="form-field">
      <textarea name="prescriptions" class="underlined-textarea"></textarea>
    </div>
  </div>

  <div class="doctor-signature">
    <div class="signature-block">
      <p>Лечащий врач:</p>
      <div class="signature-line"></div>
      <p class="doctor-name"><input type="text" name="doctor_fullname" class="underlined-input"></p>
    </div>
  </div>

  <style>
    .medical-document {
      font-family: 'Times New Roman', Times, serif;
      font-size: 14pt;
      line-height: 1.5;
      max-width: 21cm;
      margin: 2cm auto;
      padding: 1.5cm;
      background: white;
    }

    .document-header {
      text-align: center;
      margin-bottom: 1.5cm;
    }

    .document-header h1 {
      font-size: 16pt;
      text-transform: uppercase;
      margin: 20px 0;
      border-bottom: 2px solid #000;
      padding-bottom: 10px;
    }

    .clinic-info p {
      margin: 5px 0;
      font-size: 12pt;
    }

    .document-number {
      font-size: 12pt;
      margin-top: 15px;
    }

    .patient-info {
      margin: 1cm 0;
    }

    .form-field {
      margin: 15px 0;
    }

    .underlined-input {
      border: none;
      border-bottom: 1px solid #000;
      font-family: 'Times New Roman';
      font-size: 14pt;
      padding: 0 5px;
      margin-left: 10px;
      width: 200px;
    }

    .underlined-input.short {
      width: 80px;
    }

    .underlined-textarea {
      border: 1px solid #000;
      width: 100%;
      min-height: 100px;
      padding: 5px;
      font-family: 'Times New Roman';
      font-size: 14pt;
      line-height: 1.5;
    }

    .doctor-signature {
      margin-top: 2cm;
      text-align: right;
    }

    .signature-block {
      display: inline-block;
      text-align: left;
    }

    .signature-line {
      width: 300px;
      border-bottom: 1px solid #000;
      margin: 40px 0 5px;
    }

    .doctor-name {
      font-weight: bold;
    }
  </style>
</div>
`;

export const ConditionModal: React.FC<ConditionModalProps> = ({ open, onClose, onSave }) => {
    const theme = useTheme();
    const { pCondition, setField } = usePatientConditionFormStore();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const documentEditorRef = React.useRef<any>(null);
    const formDataRef = React.useRef<Record<string, any>>({});
    const [patient, setPatient] = React.useState();


    React.useEffect(() =>{
      const fetchPatient = async () =>{
        const patData = await getPatient(pCondition.patient || 1);
        setPatient(patData.first_name + patData.last_name + (patData.patronymic ?? ''));


      }
      fetchPatient();
    })

    const handleDataExtract = (data: Record<string, any>) => {
        formDataRef.current = data;
        const processedHtml = documentEditorRef.current?.getProcessedHtml() || "";
        

        setField('shift', '1');
        setField('document', processedHtml);
        setField('document_fields', JSON.stringify(data));
        setField('patient', data.patient)
    };

    const handleSaveDocument = async () => {
        try {
            if (!documentEditorRef.current) return;
            
            // Обновляем данные формы
            documentEditorRef.current.extractFormData();
            
            // Получаем финальные данные
            const htmlContent = documentEditorRef.current.getProcessedHtml();
            const formData = formDataRef.current;

            // Валидация
            if (!htmlContent?.trim()) {
                alert('Документ не может быть пустым');
                return;
            }

            console.log("Сохраненные данные:", { 
                html: htmlContent, 
                formData,
                storeData: pCondition 
            });


        
            await addNewCondition(pCondition as PatientCondition);
            if (onSave) onSave(htmlContent, formData);
            onClose();
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
            alert('Произошла ошибка при сохранении');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isMobile ? '95%' : '60%',
                height: '100vh',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 3,
                borderRadius: 2,
                overflowY: 'auto'
            }}>
                <Typography variant="h5" sx={{ mb: 3 }}>
                    Медицинский осмотр пациента
                </Typography>

                <DocumentEditor 
                  ref={documentEditorRef} 
                  templateHtml={medicalTemplate}
                  initialData={{ patient_name: patient }}
                  onDataExtract={handleDataExtract}
                />



                {/* Блок для отладки */}
                <Box sx={{ mt: 2, display: 'none' /* Скрыто по умолчанию */ }}>
                    <Typography variant="body2">Отладочная информация:</Typography>
                    <pre>{JSON.stringify(formDataRef.current, null, 2)}</pre>
                    <Typography variant="body2">HTML содержимое:</Typography>
                    <div dangerouslySetInnerHTML={{__html: documentEditorRef.current?.getProcessedHtml() || ''}} />
                </Box>

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
                        onClick={handleSaveDocument}
                        sx={{ minWidth: 160 }}
                    >
                        Сохранить данные
                    </CustomButton>
                    <CustomButton 
                        variant="outlined" 
                        onClick={() => documentEditorRef.current?.exportToPdf()}
                    >
                        Экспорт в PDF
                    </CustomButton>
                </Box>
            </Box>
        </Modal>
    );
};