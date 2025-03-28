import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { DocumentEditor } from "@2_widgets/documetEditor";

export const Diagnosis: FC = () => {
  const handleDataExtract = (data: Record<string, any>) => {
    console.log("Собранные данные:", JSON.stringify(data, null, 2));
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h1" gutterBottom>
        Медицинское заключение
      </Typography>
      <DocumentEditor
        templateHtml={`
          <div style="
            font-family: 'Times New Roman', Times, serif;
            font-size: 14pt;
            line-height: 1.5;
            margin: 0 auto;
            max-width: 21cm;
            padding: 2cm;
            text-align: justify;
          ">
            <div style="text-align: center; margin-bottom: 36pt;">
              <h2 style="font-size: 16pt; font-weight: bold; margin-bottom: 24pt; text-transform: uppercase;">
                Медицинское заключение
              </h2>
            </div>

            <div style="margin-bottom: 12pt; text-indent: 1.25cm;">
              <label>ФИО пациента: </label>
              <input type="text" name="patient_name" 
                style="
                  font-family: 'Times New Roman', Times, serif;
                  font-size: 14pt;
                  border: none;
                  border-bottom: 1px solid #000;
                  width: 70%;
                  padding: 0 4px;
                "
                placeholder="Иванов Иван Иванович">
            </div>

            <div style="margin-bottom: 12pt; text-indent: 1.25cm;">
              <label>Дата приема: </label>
              <input type="date" name="diagnosis_date"
                style="
                  font-family: 'Times New Roman', Times, serif;
                  font-size: 14pt;
                  border: none;
                  border-bottom: 1px solid #000;
                  padding: 0 4px;
                ">
            </div>

            <div style="margin-bottom: 12pt;">
              <div style="text-indent: 1.25cm; margin-bottom: 6pt;">Основные симптомы:</div>
              <textarea name="symptoms" rows="3"
                style="
                  font-family: 'Times New Roman', Times, serif;
                  font-size: 14pt;
                  width: 100%;
                  padding: 4px;
                  border: 1px solid #000;
                  text-indent: 0;
                "
                placeholder="Опишите симптомы"></textarea>
            </div>

            <div style="margin-bottom: 12pt; text-indent: 1.25cm;">
              <label>Предварительный диагноз: </label>
              <select name="diagnosis"
                style="
                  font-family: 'Times New Roman', Times, serif;
                  font-size: 14pt;
                  border: none;
                  border-bottom: 1px solid #000;
                  padding: 0 4px;
                  margin-left: 8px;
                ">
                <option value="">Выберите диагноз</option>
                <option value="flu">Грипп</option>
                <option value="cold">ОРВИ</option>
                <option value="bronchitis">Бронхит</option>
                <option value="pneumonia">Пневмония</option>
                <option value="covid">COVID-19</option>
              </select>
            </div>

            <div style="margin-bottom: 12pt;">
              <div style="text-indent: 1.25cm; margin-bottom: 6pt;">Рекомендованное лечение:</div>
              <textarea name="treatment" rows="4"
                style="
                  font-family: 'Times New Roman', Times, serif;
                  font-size: 14pt;
                  width: 100%;
                  padding: 4px;
                  border: 1px solid #000;
                  text-indent: 0;
                "
                placeholder="Опишите рекомендации"></textarea>
            </div>

            <div style="margin-top: 72pt; width: 50%; float: right;">
              <div style="margin-bottom: 12pt; text-indent: 0;">
                <label>Врач: </label>
                <input type="text" name="doctor"
                  style="
                    font-family: 'Times New Roman', Times, serif;
                    font-size: 14pt;
                    border: none;
                    border-bottom: 1px solid #000;
                    width: 60%;
                    padding: 0 4px;
                  "
                  placeholder="Петров П.П.">
              </div>
              <div style="text-align: center; margin-top: 36pt;">
                <p>________________________</p>
                <p>(подпись)</p>
              </div>
              <div style="
                height: 3cm;
                margin-top: 12pt;
                border: 1px dashed #999;
                text-align: center;
                line-height: 3cm;
              ">
                МЕСТО ДЛЯ ПЕЧАТИ
              </div>
            </div>
          </div>
        `}
        onDataExtract={handleDataExtract}
      />
    </Box>
  );
};