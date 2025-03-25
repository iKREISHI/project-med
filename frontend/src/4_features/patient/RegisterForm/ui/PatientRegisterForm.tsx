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
            <Box sx={globalsStyleSx.inputContainer}>
              <Typography component="p">ФИО</Typography>
              <Box sx={{ ...globalsStyleSx.inputContainer, gridTemplateColumns: { sm: '1fr 1fr 1fr' } }}>
                <InputForm
                  type="text"
                  placeholder="Фамилия*"
                  value={patient.last_name || ""}
                  onChange={(e) => setField("last_name", e.target.value)}
                  required
                />
                <InputForm
                  type="text"
                  placeholder="Имя*"
                  value={patient.first_name || ""}
                  onChange={(e) => setField("first_name", e.target.value)}
                  required
                />
                <InputForm
                  type="text"
                  placeholder="Отчество"
                  value={patient.patronymic || ""}
                  onChange={(e) => setField("patronymic", e.target.value)}
                />
              </Box>
            </Box>

            <Box sx={globalsStyleSx.inputContainer}>
              <Typography component="p">Дата рождения*</Typography>
              <InputForm
                type="date"
                fullWidth
                value={patient.date_of_birth || ""}
                onChange={(e) => setField("date_of_birth", e.target.value)}
                required
              />
            </Box>
            <Box sx={globalsStyleSx.inputContainer}>
              <Typography component="p">Пол</Typography>

              <RadioGroup
                row
                name="gender"
                value={patient.gender}
                onChange={(e) => setField("gender", e.target.value)}
                sx={patientRegisterFormSx.inputContainer}
              >
                <Box sx={{ ...globalsStyleSx.inputContainer, gridTemplateColumns: { sm: '1fr 1fr 1fr' } }}>
                  <FormControlLabel value="M" control={<Radio disableRipple />} sx={patientRegisterFormSx.radioCheck} label="Мужской" />
                  <FormControlLabel value="F" control={<Radio disableRipple />} sx={patientRegisterFormSx.radioCheck} label="Женский" />
                  <FormControlLabel value="U" control={<Radio disableRipple />} sx={patientRegisterFormSx.radioCheck} label="Не указан" /></Box>
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
