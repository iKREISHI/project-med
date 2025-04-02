// @ts-nocheck
import { FC } from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { InputForm } from "@6_shared/Input";
import { patientRegisterFormSx } from "./patientRegisterFormSx";
import { CustomButton } from "@6_shared/Button";
import { usePatientFormStore } from "../../model/store.ts";
import { addNewPatient } from "@5_entities/patient/api/addNewPatient.ts";
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx.ts";
import Grid from '@mui/material/Grid2';


export const PatientRegisterForm: FC = () => {
  const { patient, setField, resetForm } = usePatientFormStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    const patient = {"place_of_work": "Сафонова Лтд",
      "last_name": "Титов",
      "first_name": "Лукия",
      "patronymic": "Петровна",
      "gender": "F",
      "date_of_birth": "1983-10-13",
      "date_created": "2025-03-30T09:28:09.861864",
      "snils": "060-875-511 90",
      "inn": "823623405155",
      "passport_series": "6075",
      "passport_number": "681434",
      "photo": null,
      "registration_address": "г. Палана, бул. Минина, д. 735, 012257",
      "actual_address": "с. Рязань, пр. Пушкинский, д. 1 стр. 4/3, 333511",
      "email": "harlampi_2018@guljaev.org",
      "phone": "80675723211",
      "additional_place_of_work": "РАО «Федоров»",
      "profession": "Инженер-энергетик",
      "registered_by": 1,
      "contractor": null,
      "legal_representative": null}
    console.log(patient)
    try {
      const newPatient = await addNewPatient(patient);
      console.log("Пациент успешно добавлен:", newPatient);
      resetForm(); // Очищаем форму после успешной регистрации
    } catch (error) {
      console.error("Ошибка при добавлении пациента:", error);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 11, lg: 8 }}>
            <Box>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ ...globalsStyleSx.inputContainer, gridTemplateColumns: { sm: '1fr 1fr 1fr' } }}>
                  <InputForm
                    type="text"
                    value={patient.last_name || ""}
                    onChange={(e) => setField("last_name", e.target.value)}
                    required
                    fullWidth
                    label="Фамилия"
                  />
                  <InputForm
                    type="text"
                    label="Имя"
                    value={patient.first_name || ""}
                    onChange={(e) => setField("first_name", e.target.value)}
                    required
                    fullWidth
                  />
                  <InputForm
                    type="text"
                    label="Отчество"
                    value={patient.patronymic || ""}
                    onChange={(e) => setField("patronymic", e.target.value)}
                    fullWidth
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <InputForm
                type="date"
                fullWidth
                value={patient.date_of_birth || ""}
                onChange={(e) => setField("date_of_birth", e.target.value)}
                label="Дата рождения"
                required
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography component="p" sx={{ fontSize: '0.9rem' }}>Пол</Typography>

              <RadioGroup
                row
                name="gender"
                value={patient.gender}
                onChange={(e) => setField("gender", e.target.value)}
                sx={{ ...patientRegisterFormSx.inputContainer, m: 0 }}
              >
                <Box sx={{ ...globalsStyleSx.inputContainer, gridTemplateColumns: { sm: '1fr 1fr 1fr' } }}>
                  <FormControlLabel value="M" control={<Radio disableRipple />} sx={patientRegisterFormSx.radioCheck} label="Мужской" />
                  <FormControlLabel value="F" control={<Radio disableRipple />} sx={patientRegisterFormSx.radioCheck} label="Женский" />
                  <FormControlLabel value="U" control={<Radio disableRipple />} sx={patientRegisterFormSx.radioCheck} label="Не указан" />
                </Box>
              </RadioGroup>
            </Box>
            <CustomButton type="submit" variant="contained">
              Зарегистрировать
            </CustomButton>
          </Grid>
        </Grid>
      </form >

    </Box >
  );
};
