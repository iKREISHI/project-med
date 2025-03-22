import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Paper, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ruRU } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';
import { InputForm, InputSearch } from '../../../6_shared/Input';
import { CustomButton } from '../../../6_shared/Button';


interface Patient {
  id: number;
  fullName: string;
  lastVisit: string;
}

const Patients: Patient[] = [
  { id: 1, fullName: "Иванов Иван Иванович", lastVisit: "2025-03-14" },
  { id: 2, fullName: "Петров Петр Петрович", lastVisit: "2025-03-14" },


];
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'fullName', headerName: 'ФИО', width: 250 },
  { field: 'lastVisit', headerName: 'Дата последнего приема', width: 150 },
];
// Главная старница со списокм пациентов 
export const Registry: React.FC = () => {
  const screenWidth = window.screen.width;
  const [patients, setPatients] = React.useState(Patients);
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate()
  const theme = useTheme();

  const filteredPatients = patients.filter((patient) =>
    patient.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ pt: 1, pb: 1 }}>
        <InputForm
          label=""
          type='text'
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Поиск'
        />
        {/* <InputSearch
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          placeholder="Введите запрос"
          // onSearch={handleSearch}
          isDarkText={!(theme.palette.mode === "dark")}
        /> */}
      </Box>
      <Box sx={{ mb: 1 }}>
        <CustomButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/registry/patient')}
        >
          Добавить пациента
        </CustomButton>
      </Box>
      <Box sx={{ overflowX: 'auto', width: `calc(${screenWidth}px` }}>
        <Paper>
          <DataGrid
            rows={filteredPatients}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 13 },
              },
            }}
            onRowClick={(params) => console.log(params.row)}
            sx={{
              width: {
                xs: `91vw`,
                sm: '100%'
              }
            }}
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          />
        </Paper>
      </Box>
    </Box>
  );
};