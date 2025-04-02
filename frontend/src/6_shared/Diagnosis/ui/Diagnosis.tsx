// @ts-nocheck
import { FC, useRef, useState, useEffect } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { DocumentEditor } from "@2_widgets/documetEditor";
import { useAppointmentsFormStore } from "@4_features/admission/model/store.ts";
import { getPatient } from "@5_entities/patient";
import { getEmployee } from "@5_entities/emloyee/api/getEmployee";
import { getAiResponse } from "@5_entities/ai-response/api/getAiResponse";

export const Diagnosis: FC = () => {
  const { appointment, setField } = useAppointmentsFormStore();
  const documentEditorRef = useRef<any>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (appointment.patient) {
        try {
          const patient = await getPatient(appointment.patient);
          setPatientData(patient);
        } catch (error) {
          console.error("Ошибка загрузки пациента:", error);
        }
      }
    };

    const fetchDoctor = async () => {
      if (appointment.assigned_doctor) {
        try {
          const doctor = await getEmployee(appointment.assigned_doctor);
          setEmployee(doctor);
        } catch (error) {
          console.error("Ошибка загрузки врача:", error);
        }
      }
    };

    fetchPatient();
    fetchDoctor();
  }, [appointment.patient, appointment.assigned_doctor]);

  const handleDataExtract = (data: Record<string, any>) => {
    const html = documentEditorRef.current?.getProcessedHtml() || "";
    setField("reception_document", html);
    setField("reception_document_fields", data);
  };

  const handleAskRecommendation = async () => {
    try {
      const response = await getAiResponse(appointment);
      const content = response.recommendation || "Нет рекомендации";

      if (documentEditorRef.current) {
        documentEditorRef.current.fillFieldByName("recommendation", content);
        documentEditorRef.current.extractFormData();
      }
    } catch (error) {
      console.error("Ошибка при получении рекомендации:", error);
    }
  };

  const initialData = {
    patient: patientData
      ? `${patientData.last_name} ${patientData.first_name} ${patientData.patronymic || ""}`.trim()
      : "Пациент не указан",
    doctor: employee?.first_name || "Не указан",
    date: appointment.appointment_date || "Не указана",
    time: appointment.start_time && appointment.end_time
      ? `${appointment.start_time} - ${appointment.end_time}`
      : "Не указано"
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h1" gutterBottom>Первичный осмотр</Typography>

      <DocumentEditor
        ref={documentEditorRef}
        templateHtml={`
<div class="medical-examination-form">
  <header class="form-header">
    <h1>Медицинская карта осмотра пациента</h1>
    <div class="patient-info">
      <p><strong>Пациент:</strong> {{patient}}</p>
      <p><strong>Врач:</strong> {{doctor}}</p>
      <p><strong>Дата осмотра:</strong> {{date}} {{time}}</p>
    </div>
  </header>

  <div class="vital-signs">
    <h2>Жизненно важные показатели</h2>
    <div class="vital-grid">
      <div class="vital-item"><label>Температура тела (°C):</label><input type="text" name="temperature" class="form-input" /></div>
      <div class="vital-item"><label>АД:</label><input type="text" name="bloodPressure" class="form-input" /></div>
      <div class="vital-item"><label>Пульс:</label><input type="text" name="pulse" class="form-input" /></div>
      <div class="vital-item"><label>Частота дыхания:</label><input type="text" name="respirationRate" class="form-input" /></div>
    </div>
  </div>

  <div class="symptoms-section">
    <h2>Симптомы и жалобы</h2>
    <textarea name="symptoms" class="form-textarea"></textarea>
  </div>

  <div class="symptoms-section">
    <h2>История болезни</h2>
    <textarea name="illness_history" class="form-textarea"></textarea>
  </div>

  <div class="treatment-section">
    <h2>Назначения</h2>
    <textarea name="procedures" class="form-textarea"></textarea>
    <textarea name="additionalTests" class="form-textarea"></textarea>
  </div>

  <div class="recommendation-section">
    <h2>Рекомендации ИИ</h2>
    <textarea name="recommendation" class="form-textarea"></textarea>
  </div>

  <style>
    .form-textarea, .form-input {
      width: 100%;
      border: 1px solid #ccc;
      padding: 8px;
      font-size: 14pt;
    }
    .vital-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }
  </style>
</div>
        `}
        initialData={initialData}
        onDataExtract={handleDataExtract}
      />

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={handleAskRecommendation}>
          Запросить рекомендацию
        </Button>
        <Button variant="contained" onClick={() => documentEditorRef.current?.extractFormData()}>
          Сохранить
        </Button>
        <Button variant="outlined" onClick={() => documentEditorRef.current?.exportToPdf()}>
          PDF
        </Button>
      </Stack>
    </Box>
  );
};
