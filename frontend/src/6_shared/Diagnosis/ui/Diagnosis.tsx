import { FC } from "react";
import { Box, Typography } from "@mui/material";
import {DocumentEditor} from "@2_widgets/documetEditor";

export const Diagnosis: FC = () => {
  const handleDataExtract = (data: Record<string, any>) => {
    console.log("Собранные данные:", JSON.stringify(data, null, 2));
  };
  return (
    <Box sx={{p: 1}}>
      <Typography variant="h1" gutterBottom>
      Diagnosis
      </Typography>
      <DocumentEditor
        templateHtml={`
    <h2>Диагноз пациента</h2>
    <label>ФИО пациента:</label>
    <input type="text" name="patient_name" placeholder="Введите ФИО пациента">

    <label>Дата приема:</label>
    <input type="date" name="diagnosis_date">

    <label>Основные симптомы:</label>
    <textarea name="symptoms" rows="3" placeholder="Опишите симптомы"></textarea>

    <label>Предварительный диагноз:</label>
    <select name="diagnosis">
      <option value="">Выберите диагноз</option>
      <option value="flu">Грипп</option>
      <option value="cold">Простуда</option>
      <option value="bronchitis">Бронхит</option>
      <option value="pneumonia">Пневмония</option>
      <option value="covid">COVID-19</option>
    </select>

    <label>Рекомендованное лечение:</label>
    <textarea name="treatment" rows="3" placeholder="Опишите рекомендации"></textarea>

    <label>Врач:</label>
    <input type="text" name="doctor" placeholder="ФИО врача">
  `}
        onDataExtract={handleDataExtract}
      />

    </Box>
  );
};