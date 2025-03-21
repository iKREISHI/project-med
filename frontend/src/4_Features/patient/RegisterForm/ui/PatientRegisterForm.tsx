import { FC } from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
import { patientRegisterFormSx } from "./patientRegisterFormSx";
import { CustomButton } from "../../../../6_shared/Button";
import { usePatientFormStore } from "../../model/store.ts";
import { addNewPatient } from "../../../../5_entities/patient/api/addNewPatient.ts";

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
        <Box sx={patientRegisterFormSx.inputContainer}>
          <Typography component="p">ФИО</Typography>
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

        <Box sx={patientRegisterFormSx.inputContainer}>
          <Typography component="p">Дата рождения*</Typography>
          <InputForm
            type="date"
            value={patient.date_of_birth || ""}
            onChange={(e) => setField("date_of_birth", e.target.value)}
            required
          />
        </Box>

        <RadioGroup
          row
          name="gender"
          value={patient.gender}
          onChange={(e) => setField("gender", e.target.value)}
          sx={patientRegisterFormSx.inputContainer}
        >
          <Typography component="p">Пол</Typography>
          <FormControlLabel value="M" control={<Radio disableRipple />} label="Мужской" />
          <FormControlLabel value="F" control={<Radio disableRipple />} label="Женский" />
          <FormControlLabel value="U" control={<Radio disableRipple />} label="Не указан" />
        </RadioGroup>

        <CustomButton type="submit" variant="contained">
          Зарегистрировать
        </CustomButton>
      </form>
    </Box>
  );
};
