import { FC, useState, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";
import { AddRecipeFormHtml } from "./AddRecipeFormHtml";
import { InputForm } from "@6_shared/Input";
import { CustomAutocomplete } from "@6_shared/Autocomplete";
import { useAppointmentsFormStore } from "@4_features/admission/model/store";
import { User } from "@5_entities/user";
import { getAllPatients } from "@5_entities/patient";
import { getAllEmployee } from "@5_entities/emloyee/api/getAllEmployee";
import { Employee } from "@5_entities/emloyee/model/model";

interface Patient {
  id: number;
  last_name: string;
  first_name: string;
  patronymic?: string;
}

export const AddRecipeForm: FC = () => {
  const [formData, setFormData] = useState({
    doctor: null as Employee | null,
    patient: null as Patient | null,
    description: "",
    diagnosis: ""
  });
  const { appointment, setField } = useAppointmentsFormStore();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Employee[]>([]);
  const [loading, setLoading] = useState({
    patients: false,
    doctors: false
  });
  const [currentUser, setCurrentUser] = useState<User>();

  const getFullName = (person: { last_name?: string; first_name?: string; patronymic?: string } | null) => {
    if (!person) return "";
    const lastName = person.last_name || "";
    const firstName = person.first_name || "";
    const patronymic = person.patronymic || "";
    return `${lastName} ${firstName} ${patronymic}`.trim();
  };

  // Синхронизация выбранного пациента с хранилищем
  useEffect(() => {
    if (appointment.patient && patients.length > 0) {
      const foundPatient = patients.find(p => p.id === appointment.patient);
      setFormData(prev => ({ ...prev, patient: foundPatient || null }));
    }
  }, [appointment.patient, patients]);

  // Синхронизация выбранного врача с хранилищем
  useEffect(() => {
    if (appointment.doctor && doctors.length > 0) {
      const foundDoctor = doctors.find(d => d.id === appointment.doctor);
      setFormData(prev => ({ ...prev, doctor: foundDoctor || null }));
    }
  }, [appointment.doctor, doctors]);
  const handlePatientChange = (value: Patient | null) => {
    setFormData(prev => ({
      ...prev,
      patient: value
    }));
    setField("patient", value?.id || null);
  };
  
  const handleDoctorChange = (value: Employee | null) => {
    setFormData(prev => ({
      ...prev,
      doctor: value
    }));
    setField("doctor", value?.id || null);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({ ...prev, patients: true, doctors: true }));
        
        const [patientsData, doctorsResponse, userData] = await Promise.all([
          getAllPatients().catch(() => ({ results: [] })),
          getAllEmployee().catch(() => ({ results: [] })), 
        ]);
    
        const doctorsData = doctorsResponse.results || [];
        
        setPatients(patientsData.results || []);
        setDoctors(doctorsData); 
        setCurrentUser(userData);
    
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(prev => ({ ...prev, patients: false, doctors: false }));
      }
    };
    fetchData();
  }, []);

  const handleFieldChange = (field: keyof typeof formData) => 
    (event: React.SyntheticEvent, value: Employee | Patient | null) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
  
      if (field === 'patient') {
        setField("patient", value?.id || null);
      } else if (field === 'doctor') {
        setField("doctor", value?.id || null);
      }
    };

  const handleInputChange = (field: keyof typeof formData) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    };

  return (
    <>
      <Box sx={{ ...globalsStyleSx.container, p: 3, mb: 1 }}>
        <CustomAutocomplete<Employee>
          value={formData.doctor}
          onChange={handleDoctorChange}
          options={doctors}
          placeholder="Выберите врача"
          label="Врач"
          required
          loading={loading.doctors}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          getOptionLabel={(option) => getFullName(option)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Врач"
              placeholder="Начните вводить ФИО врача"
              required
            />
          )}
        />

        <CustomAutocomplete<Patient>
          value={formData.patient}
          onChange={handlePatientChange}
          options={patients}
          placeholder="Введите ФИО пациента"
          label="Пациент"
          required
          loading={loading.patients}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          getOptionLabel={(option) => getFullName(option)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Пациент"
              placeholder="Начните вводить ФИО"
              required
            />
          )}
        />

        {/* Поле описания */}
        <InputForm
          value={formData.description}
          type="text"
          label="Описание"
          onChange={handleInputChange('description')}
          fullWidth
          multiline
          rows={3}
        />

        {/* Поле диагноза */}
        <InputForm
          value={formData.diagnosis}
          type="text"
          label="Диагноз"
          onChange={handleInputChange('diagnosis')}
          fullWidth
          multiline
          rows={3}
        />
      </Box>
      <AddRecipeFormHtml />
    </>
  );
};