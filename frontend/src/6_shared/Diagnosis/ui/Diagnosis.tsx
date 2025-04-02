// @ts-nocheck
// @ts-nocheck
import { FC, useRef, useState, useEffect } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { DocumentEditor } from "@2_widgets/documetEditor";
import { useAppointmentsFormStore } from "@4_features/admission/model/store.ts";
import { getPatient } from "@5_entities/patient";
import { getEmployee } from "@5_entities/emloyee/api/getEmployee";
import { Employee } from "@5_entities/emloyee/model/model";

export const Diagnosis: FC = () => {
  const { appointment, setField } = useAppointmentsFormStore();
  const documentEditorRef = useRef<any>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [employee, setEmployee] = useState<Employee>()
  useEffect(() => {
    const fetchPatient = async () => {
      if (appointment.patient) {
        try {
          const patient = await getPatient(appointment.patient);
          console.log(patient);
          setPatientData(patient);
        } catch (error) {
          console.error("Error loading patient:", error);
          setPatientData(null);
        }
      }
    };

    const fetchEmplyeeData = async () => {
      if (appointment.assigned_doctor) {
        try {
          const employeeData = await getEmployee(appointment.assigned_doctor);
          console.log(employeeData);
          setEmployee(employeeData)
        } catch (error) {
          console.error(error);

        }
      }
    }
    fetchPatient();
    fetchEmplyeeData();
  }, [appointment.patient]);


  

  const handleDataExtract = (data: Record<string, any>) => {
    // Получаем HTML с подставленными данными
    const processedHtml = documentEditorRef.current?.getProcessedHtml() || "";
  
    const mergedData = {
      ...data,
      patient: patientData 
        ? `${patientData.last_name} ${patientData.first_name} ${patientData.patronymic || ''}`.trim()
        : "Пациент не указан",
      doctor: getEmployee(appointment.signed_by)  || "Не указан",
      date: appointment.appointment_date || "Не указана",
      time: appointment.start_time && appointment.end_time
        ? `${appointment.start_time} - ${appointment.end_time}`
        : "Не указано"
    };
  
    // Сохраняем и данные формы, и HTML
    setField('reception_document_fields', mergedData);
    setField('reception_document', processedHtml); // <-- Добавлено сохранение HTML
  };

  const initialData = {
    patient: patientData 
      ? `${patientData.last_name} ${patientData.first_name} ${patientData.patronymic || ''}`.trim()
      : "Пациент не указан",
    doctor: employee?.first_name || "Не указан",
    date: appointment.appointment_date || "Не указана",
    time: appointment.start_time && appointment.end_time
      ? `${appointment.start_time} - ${appointment.end_time}`
      : "Не указано"
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h1" gutterBottom>
        Первичный осмотр
      </Typography>
      
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
      <p><strong>Статус визита:</strong> {{visitStatus}}</p>
    </div>
  </header>

  <div class="vital-signs">
    <h2>Жизненно важные показатели</h2>
    <div class="vital-grid">ЙВ
      <div class="vital-item">
        <label>Температура тела (°C):</label>
        <input type="text" name="temperature" value="{{temperature}}" class="form-input">
      </div>
      <div class="vital-item">
        <label>Артериальное давление:</label>
        <input type="text" name="bloodPressure" value="{{bloodPressure}}" class="form-input" placeholder="120/80">
      </div>
      <div class="vital-item">
        <label>Пульс (уд/мин):</label>
        <input type="text" name="pulse" value="{{pulse}}" class="form-input">
      </div>
      <div class="vital-item">
        <label>Частота дыхания (дых/мин):</label>
        <input type="text" name="respirationRate" value="{{respirationRate}}" class="form-input">
      </div>
    </div>
  </div>

  <div class="neurological-status">
    <h2>Неврологический статус</h2>
    <div class="status-grid">
      <div class="status-item">
        <label>Уровень сознания:</label>
        <select name="consciousnessLevel" class="form-select">
          <option value="ясное" {{consciousnessLevel === 'ясное' ? 'selected' : ''}}>Ясное</option>
          <option value="спутанное" {{consciousnessLevel === 'спутанное' ? 'selected' : ''}}>Спутанное</option>
          <option value="кома" {{consciousnessLevel === 'кома' ? 'selected' : ''}}>Кома</option>
        </select>
      </div>
      <div class="status-item">
        <label>Уровень боли (0-10):</label>
        <input type="number" name="painLevel" min="0" max="10" value="{{painLevel}}" class="form-input">
      </div>
    </div>
  </div>

  <div class="symptoms-section">
    <h2>Симптомы и жалобы</h2>
    <textarea name="symptoms" rows="4" class="form-textarea">{{symptoms}}</textarea>
  </div>

  <div class="symptoms-section">
    <h2>История болезни</h2>
    <textarea name="illness_history" rows="4" class="form-textarea">{{symptoms}}</textarea>
  </div>

  <div class="treatment-section">
    <h2>Назначения</h2>
    <div class="treatment-item">
      <label>Процедуры:</label>
      <textarea name="procedures" rows="3" class="form-textarea">{{procedures}}</textarea>
    </div>
    <div class="treatment-item">
      <label>Дополнительные исследования:</label>
      <textarea name="additionalTests" rows="2" class="form-textarea">{{additionalTests}}</textarea>
    </div>
  </div>

  <style>
    .medical-examination-form {
      font-family: 'Times New Roman', Times, serif;
      font-size: 14pt;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
    }
    
    .form-header {
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 2px solid #333;
    }
    
    .form-header h1 {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .patient-info p {
      margin: 5px 0;
    }
    
    h2 {
      color: #2c3e50;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
      margin-top: 25px;
    }
    
    .vital-grid, .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
      margin: 15px 0;
    }
    
    .form-input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14pt;
    }
    
    .form-select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14pt;
      background-color: white;
    }
    
    .form-textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      min-height: 80px;
      font-size: 14pt;
      font-family: inherit;
    }
    
    .treatment-item {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
  </style>
</div>
        `}
        initialData={initialData}
        onDataExtract={handleDataExtract}
      />

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      <Button variant="contained" onClick={() => console.log(appointment)}>
          Проверить данные
        </Button>
        <Button variant="contained" onClick={() => documentEditorRef.current?.extractFormData()}>
          Сохранить данные
        </Button>
        <Button variant="outlined" onClick={() => documentEditorRef.current?.exportToPdf()}>
          Экспорт в PDF
        </Button>
      </Stack>
    </Box>
  );
};