// @ts-nocheck
import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { recordSx } from "./recordSx";
import {RecordForm} from "@4_features/record/RecordForm";

export const Record: FC = () => {
  return (
    <Box sx={recordSx.containerMain}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h1" gutterBottom>Запись пациента</Typography>
        <RecordForm/>
      </Box>
    </Box>
  )
}