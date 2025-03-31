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

// Мок-данные лекарств
const mockMedicines = [
  { id: 1, name: 'Парацетамол' },
  { id: 2, name: 'Ибупрофен' },
];

export const AddRecipeForm: FC = () => {
  const [formData, setFormData] = useState({
    doctor: null as Employee | null,
    patient: null as Patient | null,
    medicine: null as { id: number; name: string } | null,
    description: "",
    diagnosis: "",
    dosage: "",
    duration: ""
  });
  
  const { appointment, setField } = useAppointmentsFormStore();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Employee[]>([]);
  const [medicines] = useState(mockMedicines); 
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

  const handleMedicineChange = (value: { id: number; name: string } | null) => {
    setFormData(prev => ({
      ...prev,
      medicine: value
    }));
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

  const handleInputChange = (field: keyof typeof formData) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    };

  return (
    <>
      <Box sx={{ ...globalsStyleSx.container, p: 3, mb: 1, display: 'flex', flexDirection: 'column', gap:1 }}>
        {/* Поле выбора врача */}
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

        />

        {/* Поле выбора пациента */}
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

        />

        {/* Поле выбора лекарства */}
        <CustomAutocomplete<{ id: number; name: string }>
          value={formData.medicine}
          onChange={handleMedicineChange}
          options={medicines}
          placeholder="Выберите лекарство"
          label="Лекарство"
          required
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          getOptionLabel={(option) => option.name}
        />

        {/* Поле дозировки */}
        <InputForm
          value={formData.dosage}
          type="text"
          label="Дозировка"
          onChange={handleInputChange('dosage')}
          fullWidth
          placeholder="500 мг 3 раза в день"
        />

        {/* Поле продолжительности приема */}
        <InputForm
          value={formData.duration}
          type="text"
          label="Продолжительность приема"
          onChange={handleInputChange('duration')}
          fullWidth
          placeholder="7 дней"
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
          placeholder="Дополнительные указания по приему"
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
          placeholder="Диагноз пациента"
        />
      </Box>
      <AddRecipeFormHtml />
    </>
  );
};