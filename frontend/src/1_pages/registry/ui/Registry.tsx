import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Paper, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CustomButton, InputForm } from '../../../../6_shared';
import { ruRU } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';
import { getAllPatients } from '../../../../5_entities/patient';
import type { Patient } from '../../../../5_entities/patient';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 80 },
  { field: 'last_name', headerName: 'Фамилия', flex: 1, minWidth: 130 },
  { field: 'first_name', headerName: 'Имя', flex: 1, minWidth: 130 },
  { field: 'patronymic', headerName: 'Отчество', flex: 1, minWidth: 130 },
  { field: 'date_created', headerName: 'Дата регистрации', flex: 1.5, minWidth: 150 },
];

export const Registry: React.FC = () => {
  const theme = useTheme();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAllPatients({ page: 1, page_size: 50 })
      .then((data) => {
        const safePatients = data?.results || [];
        const transformedPatients = safePatients.map((patient) => ({
          ...patient,
          id: patient.id || Math.random(),
        }));
        setPatients(transformedPatients);
      })
      .catch((error) => {
        console.error('Ошибка получения списка пациентов', error);
      });
  }, []);

  const filteredPatients = patients.filter((patient) =>
    `${patient.last_name} ${patient.first_name} ${patient.patronymic}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{
      width: '100%',
      p: theme.spacing(2),
      boxSizing: 'border-box'
    }}>
      <Box sx={{
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2)
      }}>
        <InputForm
          label=""
          type="text"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск"
        />

        <CustomButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/registry/patient')}
          sx={{ alignSelf: 'flex-start' }}
        >
          Добавить пациента
        </CustomButton>
      </Box>

      <Paper sx={{
        width: '100%',
        overflow: 'hidden',
        boxShadow: theme.shadows[3]
      }}>
        <DataGrid
          rows={filteredPatients}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 13 },
            },
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              lineHeight: '1.5',
              padding: theme.spacing(1),
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.grey[100],
            },
          }}
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        />
      </Paper>
    </Box>
  );
};