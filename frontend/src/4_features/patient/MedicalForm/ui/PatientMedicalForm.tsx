// @ts-nocheck
// @ts-nocheck
import { FC } from "react";
import { Box } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
import {usePatientFormStore} from "../../model/store.ts";
import {patientMedicalFormSx} from "./patientPassportFormSx.ts";


export const PatientMedicalForm: FC = () => {
  const {patient, setField} = usePatientFormStore();

  return (
    <Box>
      <form>
        <Box sx={{mt: 3}}>
          <Box sx={patientMedicalFormSx.inputContainer}>
            <InputForm
              type="text"
              label='СНИЛС'
              value={patient.snils || ''}
              onChange={(e) => setField('snils', e.target.value)}
            />
            <InputForm
              type="text"
              label="ИНН"
              value={patient.inn || ''}
              onChange={(e) => setField('inn',e.target.value)}
            />
          </Box>
        </Box>
      </form>
    </Box>
  );
};