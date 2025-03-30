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
          <div class="medical-form">
  <h2>Терапевтический осмотр</h2>
  

  <div class="form-section">
    <label>Жалобы:</label>
    <textarea name="complaints" rows="3" class="form-textarea"></textarea>
  </div>

  <div class="form-section">
    <label>Анамнез заболевания:</label>
    <textarea name="illness_history" rows="2" class="form-textarea"></textarea>
  </div>

  <div class="form-section">
    <label>Анамнез жизни:</label>
    <textarea name="life_history" rows="2" class="form-textarea"></textarea>
  </div>

  <div class="form-section">
    <label>Объективный статус:</label>
    <textarea name="objective_status" rows="4" class="form-textarea"></textarea>
  </div>

  <div class="form-section">
    <label>Предварительный диагноз:</label>
    <input type="text" name="diagnosis" class="form-input">
  </div>

  <div class="form-section">
    <label>Рекомендации:</label>
    <textarea name="recommendations" rows="3" class="form-textarea"></textarea>
  </div>

 

<style>
.medical-form {
  font-family: 'Times New Roman', Times, serif;
  font-size: 14pt;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.form-section {
  margin-bottom: 15px;
}
.form-input {
  border-bottom: 1px solid #000;
  width: 70%;
  padding: 5px;
}
.form-textarea {
  width: 100%;
  border: 1px solid #000;
  padding: 5px;
}
.form-footer {
  margin-top: 50px;
  text-align: right;
}
.signature {
  margin-top: 30px;
}
</style>
        `}
        onDataExtract={handleDataExtract}
      />
    </Box>
  );
};