// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, IconButton, Stack } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { GET } from "@6_shared/api";
import { DocumentEditor } from "@2_widgets/documetEditor";
import { useRecipeStore } from "../model/useRecipeStore";

export const AddRecipeFormHtml = () => {
  const { setField } = useRecipeStore();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDrugs, setSelectedDrugs] = useState([]);

  const fetchDrugs = async () => {
    try {
      const response = await GET("/api/v0/medical-drug/", {
        query: {
          search: searchText,
          page: 1,
          page_size: 10
        }
      });

      if (response.data && response.data.results) {
        setSearchResults(response.data.results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
    }
  };

  const handleDataExtract = (data: Record<string, any>) => {
    Object.entries(data).forEach(([key, value]) => {
      setField(key, value);
    });
  };

  const handleAddDrug = (drug) => {
    setSelectedDrugs(prev => [...prev, drug]);
    setSearchText('');
    setSearchResults([]);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Добавить препарат</Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          label="Поиск препаратов"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              fetchDrugs();
              e.preventDefault();
            }
          }}
        />
        <Button variant="contained" onClick={fetchDrugs}>Поиск</Button>
      </Stack>

      {searchResults.length > 0 && (
        <Box mt={2}>
          <Typography variant="body2">Результаты поиска:</Typography>
          <ul>
            {searchResults.map(drug => (
              <li key={drug.id}>
                {drug.name_trade} ({drug.country}) — {drug.name_producer}
                <IconButton size="small" onClick={() => handleAddDrug(drug)}>
                  <AddIcon />
                </IconButton>
              </li>
            ))}
          </ul>
        </Box>
      )}

      {selectedDrugs.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>Выбранные препараты</Typography>
          <ul>
            {selectedDrugs.map((d, idx) => (
              <li key={idx}>
                {d.name_trade} ({d.standard_doze}, {d.standard_form})
              </li>
            ))}
          </ul>
        </Box>
      )}

      <Box mt={4}>
        <DocumentEditor
          templateHtml={`
            <div class="recipe-form">
              <h2 style="text-align: center;">Рецепт</h2>
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
              <div class="form-section">
                <label>Срок действия:</label>
                <select name="validityPeriod" class="form-input">
                  <option value="10">10 дней</option>
                  <option value="30">1 месяц</option>
                  <option value="90">3 месяца</option>
                </select>
              </div>
              <style>
                .form-section {
                  margin-bottom: 15px;
                  display: flex;
                  flex-direction: column;
                }
                .form-input {
                  padding: 8px;
                  border: 1px solid #ccc;
                  font-size: 14pt;
                  border-radius: 4px;
                }
              </style>
            </div>
          `}
          onDataExtract={handleDataExtract}
        />
      </Box>
    </Box>
  );
};
