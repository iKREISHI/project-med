import { FC} from "react";
import { Box } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
import { patientAddFormSx } from "./patientAddFormSx";
import {usePatientFormStore} from "../../model/store.ts";

export const PatientAddForm: FC = () => {

  const {patient, setField} = usePatientFormStore();

  return (
    <Box>
      <form>
        <Box>
          <Box sx={patientAddFormSx.inputContainer}>
            <InputForm
              type="text"
              label="Место работы"
              value={patient.place_of_work || ''}
              onChange={(e) => setField('place_of_work',e.target.value)}
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