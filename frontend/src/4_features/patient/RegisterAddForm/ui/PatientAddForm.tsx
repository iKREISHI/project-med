// @ts-nocheck
import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
import { patientAddFormSx } from "./patientAddFormSx.ts";
import { usePatientFormStore } from "../../model/store.ts";

export const PatientAddForm: FC = () => {

  const { patient, setField } = usePatientFormStore();

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h1" gutterBottom>
        Дополнительная информация 
      </Typography>
      <form>
        <Box sx={{mt: 3}}>
          <Box sx={{...patientAddFormSx.inputContainer, mb: 2}}>
            <InputForm
              type="text"
              label="Место работы"
              value={patient.place_of_work || ''}
              onChange={(e) => setField('place_of_work', e.target.value)}
            />
          </Box>
        </Box>
        <InputForm
          type="email"
          label="Должность"
          value={patient.profession || ''}
          onChange={(e) => setField('profession', e.target.value)}
        />

      </form>
    </Box>
  );
};