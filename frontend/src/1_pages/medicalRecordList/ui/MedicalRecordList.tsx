import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Paper, useTheme, useMediaQuery, Theme, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { ruRU } from '@mui/x-data-grid/locales';
import { InputSearch } from "@6_shared/Input";
import { CustomButton } from "@6_shared/Button";
import { useNavigate } from 'react-router-dom';

const medicalRecordsData = [
  {
    id: 1,
    cardNumber: "MC-0001",
    patientInitials: "Иванов И.И.",
    cardType: "Амбулаторная",
    registrationDate: "2000-01-01",
    branch: "Центральный филиал"
  },
  {
    id: 2,
    cardNumber: "MC-0002",
    patientInitials: "Петрова А.В.",
    cardType: "Стационарная",
    registrationDate: "2000-01-01",
    branch: "Северный филиал"
  },
  {
    id: 3,
    cardNumber: "MC-0003",
    patientInitials: "Сидоров П.К.",
    cardType: "Стоматологическая",
    registrationDate: "2000-01-01",
    branch: "Южный филиал"
  },
];

export const MedicalRecordList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchQuery, setSearchQuery] = useState('');
  const isDarkText = !(theme.palette.mode === "dark");
  const navigate = useNavigate();

  const desktopColumns: GridColDef[] = [
    { field: 'cardNumber', headerName: 'Номер Карты', flex: 1, minWidth: 120 },
    { field: 'patientInitials', headerName: 'Пациент', flex: 1, minWidth: 150 },
    { field: 'cardType', headerName: 'Вид Карты', flex: 1, minWidth: 150 },
    { field: 'registrationDate', headerName: 'Дата Регистрации', flex: 1, minWidth: 150 },
    { field: 'branch', headerName: 'Филиал', flex: 1.5, minWidth: 180 },
    {
      field: 'actions',
      headerName: 'Действия',
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEdit(params.row.id)}
            title="Редактировать"
            disableRipple
          >
            <EditIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const mobileColumns: GridColDef[] = [
    { field: 'cardNumber', headerName: 'Номер', flex: 1, minWidth: 100 },
    { field: 'patientInitials', headerName: 'Пациент', flex: 1, minWidth: 120 },
    {
      field: 'actions',
      headerName: 'Действия',
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEdit(params.row.id)}
            title="Редактировать"
            disableRipple
          >
            <EditIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const filteredRecords = medicalRecordsData.filter(record =>
    `${record.cardNumber} ${record.patientInitials} ${record.cardType} ${record.branch}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const columns = isMobile ? mobileColumns : desktopColumns;

  const handleEdit = (id: number) => {
    console.log(`Editing record with id: ${id}`);
  };

  return (
    <Box sx={{
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Typography variant="h1" gutterBottom>
        Медицинские карты
      </Typography>

      <Box sx={{
        mb: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2)
      }}>
        <InputSearch
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          placeholder="Поиск по пациентам и картам"
          isDarkText={isDarkText}
          bgcolorFlag={true}
        />
      </Box>

      <Box sx={{ mb: 1 }}>
        <CustomButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/medical-records/create')}
        >
          Создать карту
        </CustomButton>
      </Box>

      <Paper sx={{
        width: {
          xs: `91vw`,
          sm: '100%'
        },
        overflow: 'hidden',
        boxShadow: theme.shadows[3],
        borderRadius: (theme: Theme) => theme.shape.borderRadius,
      }}>
        <DataGrid
          rows={filteredRecords}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 13 },
            },
          }}
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
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        />
      </Paper>
    </Box>
  );
};