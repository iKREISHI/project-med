// @ts-nocheck
import * as React from "react";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Paper, Theme, useTheme } from "@mui/material";
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
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const isDarkText = !(theme.palette.mode === "dark");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  useEffect(() => {
    fetchPatients();
  }, [paginationModel.page, paginationModel.pageSize, searchQuery]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await getAllPatients({
        page: paginationModel.page + 1,
        page_size: paginationModel.pageSize,
      });
      setPatients(data.results);
      setRowCount(data.count);
      console.log(patients)
      console.log(rowCount)
    } catch (error) {
      console.error("Ошибка при загрузке пациентов:", error);
    } finally {
      setLoading(false);
    }
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

      <Paper sx={{
        width: {
          xs: `91vw`,
          sm: '100%'
        },
        overflow: 'hidden',
        boxShadow: theme.shadows[0],
        borderRadius: (theme: Theme) => theme.shape.borderRadius,
      }}>
        <DataGrid
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={rowCount}
          rows={patients}
          columns={columns}
          loading={loading}
          autoHeight
          disableRowSelectionOnClick
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          sx={{
            borderRadius: (theme: Theme) => theme.shape.borderRadius,
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              lineHeight: '1.5',
              padding: theme.spacing(1),
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'transparent',
            },
            '& .css-ok32b7-MuiDataGrid-overlay': {
              bgcolor: 'transparent'
            }
          }}
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
