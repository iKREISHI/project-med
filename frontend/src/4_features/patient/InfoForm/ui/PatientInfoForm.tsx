// @ts-nocheck
// @ts-nocheck
import { FC} from "react";
import { Box } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
import { patientInfoFormSx } from "./patientInfoFormSx";
import {usePatientFormStore} from "../../model/store.ts";

export const PacientInfoForm: FC = () => {

  const {patient, setField} = usePatientFormStore();

  return (
    <Box sx={{mt: 3}}>
      <form>
        <Box>
          <Box sx={{...patientInfoFormSx.inputContainer, mb: 2}}>
            <InputForm
              type="text"
              label="Мобильный телефон"
              value={patient.phone || ''}
              onChange={(e) => setField('phone',e.target.value)}
            />
          </Box>
        </Box>
        <InputForm
          type="email"
          label="Адрес электронной почты"
          value={patient.email || ''}
          onChange={(e) => setField('email', e.target.value)}
        />

      </form>
    </Box>
  );
};