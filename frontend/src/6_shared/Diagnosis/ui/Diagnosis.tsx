import { FC, useRef, useState, useEffect } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { DocumentEditor } from "@2_widgets/documetEditor";
import { useAppointmentsFormStore } from "@4_features/admission/model/store.ts";
import { getPatient } from "@5_entities/patient";

export const Diagnosis: FC = () => {
  const { appointment, setField } = useAppointmentsFormStore();
  const documentEditorRef = useRef<any>(null);
  const [patientData, setPatientData] = useState<any>(null);

  // Загружаем данные пациента при изменении appointment.patient
  useEffect(() => {
    const fetchPatient = async () => {
      if (appointment.patient) {
        try {
          const patient = await getPatient(appointment.patient);
          setPatientData(patient);
        } catch (error) {
          console.error("Ошибка загрузки данных пациента:", error);
          setPatientData(null);
        }
      }
    };

    fetchPatient();
  }, [appointment.patient]);

  const handleDataExtract = (data: Record<string, any>) => {
    const mergedData = {
      ...data,
      patient: patientData 
        ? `${patientData.last_name} ${patientData.first_name} ${patientData.patronymic || ''}`.trim()
        : "Пациент не указан",
      doctor: appointment.signed_by || "Не указан",
      date: appointment.appointment_date || "Не указана",
      time: appointment.start_time && appointment.end_time
        ? `${appointment.start_time} - ${appointment.end_time}`
        : "Не указано"
    };
    
    console.log("Объединенные данные:", mergedData);
    setField('reception_document_fields', JSON.stringify(mergedData));
  };

  // Остальной код без изменений
  const handleSave = () => {
    if (documentEditorRef.current) {
      documentEditorRef.current.extractFormData();
    }
  };

  const handleExportPdf = () => {
    if (documentEditorRef.current) {
      documentEditorRef.current.exportToPdf();
    }
  };

  const handleExportDoc = () => {
    if (documentEditorRef.current) {
      documentEditorRef.current.exportToDoc();
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h1" gutterBottom>
        Первичный осмотр
      </Typography>
      
      <DocumentEditor
        ref={documentEditorRef}
        templateHtml={`
          <div class="medical-form">
            <h2>Терапевтический осмотр</h2>
            
            <div class="form-header">
              <p><strong>Пациент:</strong> {{patient}}</p>
              <p><strong>Врач:</strong> {{doctor}}</p>
              <p><strong>Дата приема:</strong> {{date}} {{time}}</p>
            </div>

            <div class="form-section">
              <label>Жалобы:</label>
              <textarea name="complaints" rows="3" class="form-textarea"></textarea>
            </div>

            <div class="form-section">
              <label>Анамнез заболевания:</label>
              <textarea name="illness_history" rows="2" class="form-textarea"></textarea>
            </div>

            <style>
              .medical-form { font-family: 'Times New Roman', Times, serif; font-size: 14pt; }
              .form-header { margin-bottom: 20px; }
              .form-section { margin-bottom: 15px; }
              .form-textarea { width: 100%; border: 1px solid #000; padding: 5px; }
            </style>
          </div>
        `}
        onDataExtract={handleDataExtract}
      />

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleSave}>
          Сохранить данные
        </Button>
        <Button variant="outlined" onClick={handleExportPdf}>
          Экспорт в PDF
        </Button>
        <Button variant="outlined" onClick={handleExportDoc}>
          Экспорт в DOC
        </Button>
      </Stack>
    </Box>
  );
};