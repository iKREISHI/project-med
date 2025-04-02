// @ts-nocheck
import { FC} from "react";
import { Box } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
import { patientAdressesFormSx } from "./patientAdressesFormSx.ts";
import {usePatientFormStore} from "../../model/store.ts";

export const PatientAddressesForm: FC = () => {

  const {patient, setField} = usePatientFormStore();

  return (
    <Box>
      <form>
        <Box sx={{mt: 3}}>
          <Box sx={{...patientAdressesFormSx.inputContainer, mb: 2}}>
            <InputForm
              type="text"
              label="Адрес регистрации"
              value={patient.registration_address || ''}
              onChange={(e) => setField('registration_address',e.target.value)}
            />
          </Box>
        </Box>
        <InputForm
          type="email"
          label="Фактический адрес проживания"
          value={patient.actual_address || ''}
          onChange={(e) => setField('actual_address', e.target.value)}
        />

      </form>
    </Box>
  );
};