// @ts-nocheck
import { FC, useState, useEffect } from "react";
import { Box, TextField, Typography, Stack, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { InputForm } from "@6_shared/Input";
import { CustomAutocomplete } from "@6_shared/Autocomplete";
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";
import { GET } from "@6_shared/api";
import { useAppointmentsFormStore } from "@4_features/admission/model/store";
import { useRecipeStore } from "../model/useRecipeStore";

interface Patient {
  id: number;
  last_name: string;
  first_name: string;
  patronymic?: string;
}

interface Employee {
  id: number;
  last_name: string;
  first_name: string;
  patronymic?: string;
}

interface Drug {
  id: number;
  name_trade: string;
  standard_form: string;
  standard_doze: string;
  country: string;
  name_producer: string;
}

export const AddRecipeForm: FC = () => {
  const { appointment, setField: setAppointmentField } = useAppointmentsFormStore();
  const { setField } = useRecipeStore();

  const [formData, setFormData] = useState({
    doctor: null as Employee | null,
    patient: null as Patient | null,
    description: "",
    diagnosis: ""
  });

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Drug[]>([]);
  const [selectedDrugs, setSelectedDrugs] = useState<Drug[]>([]);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Employee[]>([]);
  const [loading, setLoading] = useState({ patients: false, doctors: false });

  const getFullName = (person: any) =>
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

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field: 'doctor' | 'patient') => (value: any) => {
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

  const handleAddDrug = (drug: Drug) => {
    setSelectedDrugs(prev => [...prev, drug]);
    setSearchText('');
    setSearchResults([]);
  };

  return (
    <Box sx={{ ...globalsStyleSx.container, p: 3 }}>
      <CustomAutocomplete<Employee>
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

      <CustomAutocomplete<Patient>
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
    </Box>
  );
};
