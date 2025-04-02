import { FC } from "react";
import { Box } from "@mui/material";
import { DocumentEditor } from "@2_widgets/documetEditor";
import { useRecipeStore } from "../model/useRecipeStore";

export const AddRecipeFormHtml: FC = () => {
  const { setField } = useRecipeStore();

  const handleDataExtract = (data: Record<string, any>) => {
    Object.entries(data).forEach(([key, value]) => {
      setField(key as keyof Prescription, value);
    });
  };

  return (
    <Box >
      <DocumentEditor
        templateHtml={`
          <div class="recipe-form">
            <h2 style="text-align: center; margin-bottom: 10px">Рецепт</h2>
            
            <div style="text-align: center; margin-bottom: 20px;">
              <select name="patientType" class="form-input" style="width: 150px; text-align: center; margin-bottom: 10px;">
                <option value="adult">взрослый</option>
                <option value="child">детский</option>
              </select>
              
              <div class="form-section" style="justify-content: center;">
                <label style="width: auto; margin-right: 10px;">Дата выписки:</label>
                <input type="date" name="prescriptionDate" class="form-input" style="width: 120px;">
              </div>
            </div>

            <div class="form-section">
              <label>ФИО пациента:</label>
              <input type="text" name="patientFullName" class="form-input">
            </div>

            <div class="form-section">
              <label>Дата рождения:</label>
              <input type="date" name="patientBirthDate" class="form-input">
            </div>

            <div class="form-section">
              <label>ФИО лечащего врача:</label>
              <input type="text" name="doctorFullName" class="form-input">
            </div>

            <div style="margin: 20px 0; border: 1px solid #000; padding: 10px;">
              <div class="form-section">
                <label>Rp:</label>
                <input type="text" name="medication1" class="form-input">
                <label style="width: 50px; margin-left: 10px;">Руб:</label>
                <input type="text" name="priceRub1" class="form-input" style="width: 50px;">
                <label style="width: 50px; margin-left: 10px;">Коп:</label>
                <input type="text" name="priceKop1" class="form-input" style="width: 50px;">
              </div>

              <div class="form-section">
                <label>Rp:</label>
                <input type="text" name="medication2" class="form-input">
                <label style="width: 50px; margin-left: 10px;">Руб:</label>
                <input type="text" name="priceRub2" class="form-input" style="width: 50px;">
                <label style="width: 50px; margin-left: 10px;">Коп:</label>
                <input type="text" name="priceKop2" class="form-input" style="width: 50px;">
              </div>

              <div class="form-section">
                <label>Rp:</label>
                <input type="text" name="medication3" class="form-input">
                <label style="width: 50px; margin-left: 10px;">Руб:</label>
                <input type="text" name="priceRub3" class="form-input" style="width: 50px;">
                <label style="width: 50px; margin-left: 10px;">Коп:</label>
                <input type="text" name="priceKop3" class="form-input" style="width: 50px;">
              </div>
            </div>

            <div class="form-footer">
              <div class="form-section">
                <label>Подпись врача:</label>
                <span style="border-bottom: 1px solid #000; flex-grow: 1; margin-left: 10px;"></span>
              </div>
              
              <div class="form-section">
                <label>Срок действия:</label>
                <select name="validityPeriod" class="form-input" style="width: 150px;">
                  <option value="10">10 дней</option>
                  <option value="30">1 месяц</option>
                  <option value="90">3 месяца</option>
                </select>
              </div>
            </div>

            <style>
              .recipe-form {
                font-family: 'Times New Roman', Times, serif;
                font-size: 14pt;
                max-width: 550px;
                padding: 20px;
                background-color: white
              }
              .form-section {
                margin-bottom: 15px;
                display: flex;
                align-items: center;
              }
              .form-section label {
                width: 200px;
              }
              .form-input {
                border-bottom: 1px solid #000;
                padding: 5px;
                flex-grow: 1;
                background: transparent;
                border: none;
                border-bottom: 1px solid #000;
              }
              .form-textarea {
                width: 100%;
                border: 1px solid #000;
                padding: 5px;
                margin-top: 5px;
                min-height: 50px;
              }
              .form-footer {
                margin-top: 30px;
              }
              select.form-input {
                padding: 5px;
                background: white;
              }
            </style>
          </div>
        `}
        onDataExtract={handleDataExtract}
      />
    </Box>
  );
};