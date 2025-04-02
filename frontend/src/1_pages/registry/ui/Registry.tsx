// @ts-nocheck
// @ts-nocheck
import * as React from "react";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Paper, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ruRU } from "@mui/x-data-grid/locales";
import { useNavigate } from "react-router-dom";
import { getAllPatients, getPatient, updatePatient, Patient } from "@5_entities/patient";
import { CustomButton } from "@6_shared/Button";
import { InputSearch } from "@6_shared/Input";
import { EditPatientModal } from "@4_features/patient/EditPatientModal";



export const Registry: React.FC = () => {
  const theme = useTheme();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const navigate = useNavigate();
  const isDarkText = !(theme.palette.mode === "dark");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    getAllPatients({ page: 1, page_size: 50 })
      .then((data) => setPatients(data?.results || []))
      .catch(console.error);
  };

  const handleEditClick = (id: number) => {
    setSelectedPatientId(id);
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5, minWidth: 80 },
    { field: "last_name", headerName: "Фамилия", flex: 1, minWidth: 130 },
    { field: "first_name", headerName: "Имя", flex: 1, minWidth: 130 },
    { field: "patronymic", headerName: "Отчество", flex: 1, minWidth: 130 },
    { field: "date_created", headerName: "Дата регистрации", flex: 1.5, minWidth: 150 },
    {
      field: "actions",
      headerName: "Действия",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <CustomButton
          variant="outlined"
          onClick={() => handleEditClick(params.row.id)}
        >
          Редактировать
        </CustomButton>
      ),
    },
  ];

  const handleCloseModal = () => {
    setSelectedPatientId(null);
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.last_name} ${patient.first_name} ${patient.patronymic}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 1, display: "flex", flexDirection: "column", gap: theme.spacing(2) }}>
        <InputSearch
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          placeholder="Поиск"
          isDarkText={isDarkText}
          bgcolorFlag={true}
        />
        <Box sx={{ mb: 1 }}>
          <CustomButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/registry/patient")}
          >
            Добавить пациента
          </CustomButton>
        </Box>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <DataGrid
          rows={filteredPatients}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          sx={{'& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'transparent',
            },
            '& .css-ok32b7-MuiDataGrid-overlay': {
              bgcolor: 'transparent'
            }}}
        />
      </Paper>

      {/* Модальное окно редактирования */}
      <EditPatientModal
        open={Boolean(selectedPatientId)}
        onClose={handleCloseModal}
        patientId={selectedPatientId}
        onUpdate={fetchPatients}
      />
    </Box>
  );
};
