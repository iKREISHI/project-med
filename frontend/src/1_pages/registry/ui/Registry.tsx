import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { InputForm } from '../../../6_Shared';
import { ruRU } from '@mui/x-data-grid/locales';
import { Link } from 'react-router-dom';


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

export const Registry: React.FC = () => {
  const screenWidth = window.screen.width;
  const [patients, setPatients] = React.useState(Patients);
  const [searchQuery, setSearchQuery] = React.useState('');

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
      </Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => console.log('Добавить пациента')}
        sx={{ mb: 2 }}
        component={Link} 
        to="/registry/new-patient"
      >
        Добавить пациента
      </Button>
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
                xs: `calc(${screenWidth}px - 49px)`,
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