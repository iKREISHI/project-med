
import React, { useState, useEffect } from "react";
import { Box, Checkbox, FormControlLabel, Divider, Typography, TextField } from "@mui/material";
import { InputForm } from "@6_shared/Input";
import { CustomButton } from "@6_shared/Button";
import { CustomSnackbar } from "@6_shared/Snackbar";
import { CustomSelect } from "@6_shared/Select";
import { CustomAutocomplete } from "@6_shared/Autocomplete";
import Grid from "@mui/material/Grid2";
import { useAppointmentsFormStore } from "@4_features/admission/model/store.ts";
import { getAllPatients, Patient } from "@5_entities/patient";
import { patientRegisterFormSx } from "@4_features/patient/RegisterForm/ui/patientRegisterFormSx.ts";
import { getCurrentUser, User } from "@5_entities/user";
import {addAppointments} from "@5_entities/doctorAppointment";
import {DoctorAppointment} from "@5_entities/doctorAppointment/model/model.ts";
import { InspectionChoice } from '@5_entities/doctorAppointment/model/types';



interface AdmissionInfoFormProps {
  patientName?: string;
}

export const AdmissionInfoForm: React.FC<AdmissionInfoFormProps> = ({ patientName }) => {
  const { appointment, setField } = useAppointmentsFormStore();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [employee, setEmployee] = useState<User>();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const INSPECTION_CHOICE_LABELS: Record<InspectionChoice, string> = {
    no_inspection: 'Не нуждается в обследовании',
    additional: 'Нуждается в проведении доп обследования',
    center: 'Нуждается в обследовании в центре',
    ambulatory: 'Нуждается в амбулаторном обследовании',
    stationary: 'Нуждается в стационарном обследовании',
    sanatorium: 'Нуждается в санаторно-курортном лечении',
    dispensary: 'Нуждается в диспансерном наблюдении',
    preventive: 'Нуждается в лечебно-профилактических мероприятиях',
    referral: 'Нуждается в направлении на медико-социальную экспертизу'
  };

  // Синхронизация выбранного пациента с хранилищем
  useEffect(() => {
    if (appointment.patient && patients.length > 0) {
      const foundPatient = patients.find(p => p.id === appointment.patient);
      setSelectedPatient(foundPatient || null);
    }
  }, [appointment.patient, patients]);

  // Преобразуем Enum в массив для селектора
  const inspectionOptions = (Object.keys(INSPECTION_CHOICE_LABELS) as InspectionChoice[]).map(key => ({
    id: key,
    name: INSPECTION_CHOICE_LABELS[key]
  }));

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [patientsData, userData] = await Promise.all([
          getAllPatients(),
          getCurrentUser()
        ]);

        setPatients(patientsData.results);
        setEmployee(userData);


        if (patientName && patientsData.results.length) {
          const foundPatient = patientsData.results.find(p =>
            `${p.last_name} ${p.first_name} ${p.patronymic}`.includes(patientName)
          );
          if (foundPatient) {
            setField("patient", foundPatient.id);
            setSelectedPatient(foundPatient);
          }
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        setEmployee({
          id: 0,
          username: "Неизвестный врач",
          position_id: "",
          position_name: ""
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientName, setField]);

  const handlePatientChange = (_: React.SyntheticEvent, value: Patient | null) => {
    setSelectedPatient(value);
    setField("patient", value?.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSnackbarOpen(true);
    try{
      await addAppointments(appointment as DoctorAppointment)
    } catch (error){
      console.error(error);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 11, lg: 7 }}>
            {/* Секция пациента */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: "text.secondary" }}>
                Данные пациента
              </Typography>
              <CustomAutocomplete
                value={appointment.patient ?
                  patients.find(p => p.id === appointment.patient)?.first_name || ''
                  : ''
                }
                onChange={(value) => {
                  const selectedPat = patients.find(p => p.first_name === value);
                  setField('patient', selectedPat?.id);
                }}
                options={patients.map(p => p.first_name)}
                placeholder="Выберите пациента"
                label='Пациент'
                required

              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Секция информации о приеме */}
            <Typography variant="h6" gutterBottom sx={{ color: "text.secondary" }}>
              Информация о приеме
            </Typography>

            <Box sx={{ mt: 2 }}>
              <InputForm
                value={appointment.reason_for_inspection || ""}
                type="text"
                label="Причина обследования"
                onChange={(e) => setField("reason_for_inspection", e.target.value)}
                fullWidth
              />

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={appointment.is_first_appointment || false}
                      onChange={(e) => setField("is_first_appointment", e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Первый прием"
                  sx={patientRegisterFormSx.radioCheck}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={appointment.is_closed || false}
                      onChange={(e) => setField("is_closed", e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Прием закрыт"
                  sx={patientRegisterFormSx.radioCheck}
                />
              </Box>

              <Box sx={{ mt: 2 }}>
              <CustomSelect
                value={inspectionOptions.find(opt => opt.id === appointment.inspection_choice) || null}
                onChange={(option) => setField('inspection_choice', option?.id as InspectionChoice)}
                options={inspectionOptions}
                placeholder="Выберите тип осмотра"
                label="Тип осмотра"
                fullWidth
                required
              />

              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Секция времени приема */}
            <Typography variant="h6" gutterBottom sx={{ color: "text.secondary" }}>
              Время приема
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <InputForm
                    type="date"
                    value={appointment.appointment_date || ""}
                    label="Дата приема"
                    onChange={(e) => setField("appointment_date", e.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <InputForm
                    type="time"
                    value={appointment.start_time || ""}
                    label="Время начала"
                    onChange={(e) => setField("start_time", e.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <InputForm
                    type="time"
                    value={appointment.end_time || ""}
                    label="Время окончания"
                    onChange={(e) => setField("end_time", e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Секция врача */}
            <Typography variant="h6" gutterBottom sx={{ color: "text.secondary" }}>
              Ответственный врач
            </Typography>

            <Box sx={{ mt: 2 }}>
              <InputForm
                type="text"
                value={employee?.username || "Загрузка..."}
                label="Врач"
                disabled
                fullWidth
                onChange={(e) => setField('signed_by', e.target.value)}
              />
            </Box>

            <Box sx={{ mt: 4 }}>
              <CustomButton type="submit" variant="contained" fullWidth>
                Сохранить прием
              </CustomButton>
              <CustomButton type="submit" variant="contained" fullWidth onClick={() => console.log(appointment)}>
                Проверить данные
              </CustomButton>
            </Box>
          </Grid>
        </Grid>
      </form>

      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message="Данные успешно сохранены!"
      />
    </Box>
  );
};