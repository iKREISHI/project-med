// @ts-nocheck
import { FC, useState, useEffect, useRef } from "react";
import {
  Box, TextField, Typography, Stack, IconButton, Button
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { InputForm } from "@6_shared/Input";
import { CustomAutocomplete } from "@6_shared/Autocomplete";
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";
import { GET, POST } from "@6_shared/api";
import { useAppointmentsFormStore } from "@4_features/admission/model/store";
import { useRecipeStore } from "../model/useRecipeStore";
import { DocumentEditor } from "@2_widgets/documetEditor";

export const AddRecipeForm: FC = () => {
  const { appointment, setField: setAppointmentField } = useAppointmentsFormStore();
  const { setField } = useRecipeStore();
  const editorRef = useRef<any>(null);

  const [formData, setFormData] = useState({
    doctor: null,
    patient: null,
    description: "",
    diagnosis: ""
  });

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState({ patients: false, doctors: false });

  const getFullName = (person) =>
    person ? `${person.last_name} ${person.first_name} ${person.patronymic || ''}`.trim() : '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading({ patients: true, doctors: true });
      try {
        const [patientsResp, doctorsResp] = await Promise.all([
          GET("/api/v0/patient/", { query: { page: 1, page_size: 100 } }),
          GET("/api/v0/employee/", { query: { page: 1, page_size: 100 } }),
        ]);
        setPatients(patientsResp.data?.results || []);
        setDoctors(doctorsResp.data?.results || []);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      } finally {
        setLoading({ patients: false, doctors: false });
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setAppointmentField(field, value?.id || null);
  };

  const fetchDrugs = async () => {
    try {
      const response = await GET("/api/v0/medical-drug/", {
        query: {
          search: searchText,
          page: 1,
          page_size: 10
        }
      });
      setSearchResults(response.data?.results || []);
    } catch (err) {
      console.error("Ошибка поиска препаратов:", err);
    }
  };

  const handleAddDrug = (drug) => {
    setSelectedDrugs(prev => [...prev, drug]);
    setSearchText('');
    setSearchResults([]);
  };

  const handleDataExtract = (data) => {
    Object.entries(data).forEach(([key, value]) => {
      setField(key, value);
    });
  };

  const handleSavePrescription = async () => {
    if (!formData.patient || !formData.doctor) {
      alert("Выберите пациента и врача");
      return;
    }

    const html = editorRef.current?.getProcessedHtml();
    const payload = {
      is_signed: true,
      is_send: true,
      description: formData.description,
      doc_content: html || '',
      signed_by: formData.doctor.id,
      patient: formData.patient.id
    };

    try {
      const res = await POST("/api/v0/medicine-prescription/", {
        body: payload
      });

      if (res?.data?.id) {
        alert("Рецепт успешно сохранен");
      } else {
        alert("Ошибка при сохранении рецепта");
      }
    } catch (err) {
      console.error("Ошибка при отправке:", err);
      alert("Ошибка при сохранении рецепта");
    }
  };

  const htmlTemplate = `
    <div class="recipe-form">
      <h2 style="text-align: center;">Рецепт</h2>
      <div class="form-section">
        <label>ФИО пациента:</label>
        <input type="text" name="patientFullName" value="${getFullName(formData.patient)}" class="form-input" />
      </div>
      <div class="form-section">
        <label>Дата рождения:</label>
        <input type="date" name="patientBirthDate" value="${formData.patient?.date_of_birth || ''}" class="form-input" />
      </div>
      <div class="form-section">
        <label>ФИО лечащего врача:</label>
        <input type="text" name="doctorFullName" value="${getFullName(formData.doctor)}" class="form-input" />
      </div>

      ${selectedDrugs.map((drug, idx) => `
        <div class="form-section">
          <label>Rp${idx + 1}:</label>
          <input type="text" name="medication${idx + 1}" class="form-input" value="${drug.name_trade} (${drug.standard_doze}, ${drug.standard_form})">
        </div>
      `).join('')}

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
  `;

  return (
    <Box sx={{ ...globalsStyleSx.container, p: 3 }}>
      <CustomAutocomplete
        value={formData.doctor}
        onChange={handleSelectChange('doctor')}
        options={doctors}
        placeholder="Выберите врача"
        label="Врач"
        loading={loading.doctors}
        isOptionEqualToValue={(o, v) => o?.id === v?.id}
        getOptionLabel={getFullName}
        renderInput={(params) => <TextField {...params} label="Врач" required />}
      />

      <CustomAutocomplete
        value={formData.patient}
        onChange={handleSelectChange('patient')}
        options={patients}
        placeholder="Выберите пациента"
        label="Пациент"
        loading={loading.patients}
        isOptionEqualToValue={(o, v) => o?.id === v?.id}
        getOptionLabel={getFullName}
        renderInput={(params) => <TextField {...params} label="Пациент" required />}
      />

      <InputForm
        label="Описание"
        value={formData.description}
        onChange={handleInputChange("description")}
        fullWidth
        multiline
        rows={3}
      />

      <InputForm
        label="Диагноз"
        value={formData.diagnosis}
        onChange={handleInputChange("diagnosis")}
        fullWidth
        multiline
        rows={3}
      />

      <Typography variant="h6" mt={3} mb={1}>Добавить препарат</Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          label="Поиск по названию"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchDrugs()}
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
          <Typography variant="h6">Выбранные препараты:</Typography>
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
          ref={editorRef}
          templateHtml={htmlTemplate}
          onDataExtract={handleDataExtract}
        />
      </Box>

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSavePrescription}>
          Сохранить рецепт
        </Button>
        <Button variant="outlined" onClick={() => editorRef.current?.exportToPdf()}>
          Сохранить в PDF
        </Button>
      </Box>
    </Box>
  );
};
