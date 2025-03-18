import { FC } from "react";
import { RecordForm } from "../../../4_Features/record/RecordForm";
import { Box, Typography } from "@mui/material";
import { recordSx } from "./recordSx";

export const Record: FC = () => {
  return (
    <Box sx={recordSx.containerMain}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h1" gutterBottom>Запись пациента</Typography>
        <RecordForm />
      </Box>
    </Box>
  )
}