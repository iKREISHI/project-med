import { useState, useEffect } from "react";
import {Box, Checkbox, FormControlLabel, } from "@mui/material";
import { InputForm } from "@6_shared/Input";
import { CustomButton } from "@6_shared/Button";
import { CustomSnackbar } from "@6_shared/Snackbar";
import { CustomSelect } from "@6_shared/Select";
import { CustomAutocomplete } from "@6_shared/Autocomplete";
import Grid from '@mui/material/Grid2';
import { useAppointmentsFormStore } from "@4_features/admission/model/store.ts";
import { getAllPatients, Patient } from "@5_entities/patient";
import {patientRegisterFormSx} from "@4_features/patient/RegisterForm/ui/patientRegisterFormSx.ts";
import {getCurrentUser, User} from "@5_entities/user";

// Форма приема пациента
interface AdmissionInfoFormProps {
    patientName?: string;
}

export const AdmissionInfoForm: React.FC<AdmissionInfoFormProps> = ({ patientName }) => {
    const { appointment, setField } = useAppointmentsFormStore();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState("");
    const [date, setDate] = useState("");
    const [medcard, setMedcard] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [employee, setEmployee] = useState<User>();


    const inspectionOptions = [
      { id: 1, name: 'Без осмотра', value: 'no_Inspection' },
      { id: 2, name: 'Дополнительный осмотр', value: 'additional' },
      { id: 3, name: 'Центральный осмотр', value: 'center' },
      { id: 4, name: 'Амбулаторный осмотр', value: 'ambulatory' },
      { id: 5, name: 'Стационарный осмотр', value: 'stationary' },
      { id: 6, name: 'Анаторий', value: 'anatorium' },
      { id: 7, name: 'Диспансерный осмотр', value: 'dispensary' },
      { id: 8, name: 'Профилактический осмотр', value: 'preventive' },
      { id: 9, name: 'Направление', value: 'referral' }
    ];


  // Функция загрузки списка пациентов
    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            try {
                const data = await getAllPatients({ page: 1, page_size: 10 });
                console.log("Ответ от API:", data); // <-- Смотрим, что в `data`
                setPatients(data.results); // <-- Здесь должно быть `data.results`
            } catch (error) {
                console.error("Ошибка загрузки пациентов:", error);
            } finally {
                setLoading(false);
            }
        };

      const getEmployee = async () => {
        try {
          const data = await getCurrentUser();
          console.log("Current user data:", data); // Добавьте лог для отладки
          setEmployee(data);
        } catch (error) {
          console.error("Failed to fetch current user:", error);
          // Можно установить значение по умолчанию или показать ошибку
          setEmployee({
            id: 0,
            username: "Неизвестный врач",
            position_id: "",
            position_name: ""
          });
        }
      }

        fetchPatients();
        getEmployee();
    }, []);


    // Установка дефолтного пациента, если передано `patientName`
    useEffect(() => {
        if (patientName) {
            const foundPatient = patients.find((p) => p.name === patientName);
            if (foundPatient) {
                setField("patient", foundPatient.id);
            }
        }
    }, [patientName, patients, setField]);

    return (
      <Box>
          <form>
              <Grid container spacing={2}>
                  <Grid size={{ xs: 11, lg: 7 }}>
                      {/* Поиск пациента */}
                      <Box sx={{ mt: 2 }}>
                          <CustomAutocomplete<Patient>
                            value={patients.find((p) => p.id === appointment.patient) || null}
                            onChange={(_, patient) => setField("patient", patient?.id || "")}
                            options={patients}
                            placeholder="Введите имя пациента"
                            label="Пациент"
                            required
                            loading={loading}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            getOptionLabel={(option) => {
                                const lastName = option.last_name || "";
                                const firstName = option.first_name || "";
                                const patronymic = option.patronymic || "";
                                return `${lastName} ${firstName} ${patronymic}`.trim() || "Неизвестный пациент";
                            }}
                          />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                          <InputForm
                            value={appointment.reason_for_inspection || ''}
                            type="text"
                            label={'Причина обследования'}
                            onChange={(e) => setField("reason_for_inspection", e.target.value)}
                            fullWidth
                          />

                          <FormControlLabel
                            control={
                                <Checkbox
                                  checked={appointment.is_first_appointment || false}
                                  onChange={(e) => setField('is_first_appointment', e.target.checked)}
                                  color="primary"
                                />
                            }
                            label="Первый прием"
                            sx={patientRegisterFormSx.radioCheck}
                          /><FormControlLabel
                        control={
                            <Checkbox
                              checked={appointment.is_closed || false}
                              onChange={(e) => setField('is_closed', e.target.checked)}
                              color="primary"
                            />
                        }
                        label="Прием закрыт"
                        sx={patientRegisterFormSx.radioCheck}
                      />
                        <CustomSelect
                          value={appointment.inspection_choice || ''}
                          onChange={(value) => setField('inspection_choice', value)}
                          options={inspectionOptions.map(opt => ({
                            id: opt.id,
                            name: opt.name
                          }))}
                          placeholder="Выберите тип осмотра"
                          label="Тип осмотра"
                          fullWidth
                          required
                        />
                      </Box>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{display: 'flex', gap: 1}}>
                        {/* Дата приема */}
                        <Box sx={{flex: 1}}>
                          <InputForm
                            type={'date'}
                            value={appointment.appointment_date || ''}
                            label={'Дата приема'}
                            onChange={(e) => setField("appointment_date", e.target.value)}
                            fullWidth
                          />
                        </Box>

                        {/* Время начала */}
                        <Box sx={{flex: 1}}>
                          <InputForm
                            type={'time'}
                            value={appointment.start_time || ''}
                            label='Время начала'
                            onChange={(e) => setField("start_time", e.target.value)}
                            fullWidth
                          />
                        </Box>

                        {/* Время окончания */}
                        <Box sx={{flex: 1}}>
                          <InputForm
                            type={'time'}
                            value={appointment.end_time || ''}
                            label='Время окончания'
                            onChange={(e) => setField("end_time", e.target.value)}
                            fullWidth
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <InputForm
                        type="text"
                        value={employee?.username || ''}
                        label="Врач"
                        disabled
                        fullWidth
                      />

                    </Box>
                      <Box sx={{ mt: 2 }}>
                          <CustomButton type="submit" variant="contained">
                              Провести
                          </CustomButton>
                      </Box>
                  </Grid>
              </Grid>
          </form>

          {/* Уведомление об успешной отправке */}
          <CustomSnackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message="Данные успешно сохранены!" />
      </Box>
    );
};