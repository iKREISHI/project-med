// @ts-nocheck
import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Paper, useTheme, useMediaQuery, Theme, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { ruRU } from '@mui/x-data-grid/locales';
import { InputSearch } from "@6_shared/Input";
import { CustomButton } from "@6_shared/Button";
import { useNavigate } from 'react-router-dom';
import { MedicalRecordEditModal } from '@6_shared/MedicalRecordAdd';
import { getAllMedicalCard } from '@5_entities/medicalCard/api/getAllMedicalCard';
import { getAllPatients, Patient } from '@5_entities/patient';
import { MedicalCard } from '@5_entities/medicalCard/model/model';
import { getAllFilials } from '@5_entities/filial/api/getAllFilials';
import { getAllMedicalCardType } from '@5_entities/medicalCardType/api/getAllMedicalCardType';

interface CombinedMedicalRecord {
  id: number;
  cardNumber: string;
  patientInitials: string;
  cardType: string;
  registrationDate: string;
  branch: string;
  is_signed: boolean;
  clientId: number;
}

export const MedicalRecordList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchQuery, setSearchQuery] = useState('');
  const isDarkText = !(theme.palette.mode === "dark");
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<CombinedMedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardTypes, setCardTypes] = useState<Record<number, string>>({});
  const [filials, setFilials] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
 
        // Получаем типы медицинских карт
        const cardTypesResponse = await getAllMedicalCardType();
        const cardTypesMap: Record<number, string> = {};
        cardTypesResponse.results.forEach(type => {
          cardTypesMap[type.id] = type.name;
        });
        setCardTypes(cardTypesMap);

        // Получаем филиалы
        const filialsResponse = await getAllFilials();
        const filialsMap: Record<number, string> = {};
        filialsResponse.results.forEach(filial => {
          filialsMap[filial.id] = filial.name;
        });
        setFilials(filialsMap);

        // Получаем медицинские карты
        const cardsResponse = await getAllMedicalCard();
        const medicalCards: MedicalCard[] = cardsResponse.results;

        // Получаем список всех пациентов
        const patientsResponse = await getAllPatients();
        const patients: Patient[] = patientsResponse.results;

        // Создаем мап пациентов для быстрого поиска по ID
        const patientsMap = new Map<number, Patient>();
        patients.forEach(patient => {
          patientsMap.set(patient.id, patient);
        });

        // Формируем объединенные данные
        const combinedRecords: CombinedMedicalRecord[] = medicalCards.map(card => {
          const patient = patientsMap.get(card.client);
          const patientInitials = patient
            ? `${patient.last_name} ${patient.first_name.charAt(0)}.${patient.patronymic ? patient.patronymic.charAt(0) + '.' : ''}`
            : 'Неизвестный пациент';

          const cardType = cardTypesMap[card.card_type] || 'Неизвестный тип';
          const branch = filialsMap[card.filial] || 'Неизвестный филиал';

          return {
            id: card.id,
            cardNumber: card.number,
            patientInitials,
            cardType,
            registrationDate: formatDate(card.date_created),
            branch,
            is_signed: card.is_signed,
            clientId: card.client
          };
        });

        setMedicalRecords(combinedRecords);
      } catch (err) {
        setError('Ошибка при загрузке данных');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const desktopColumns: GridColDef[] = [
    { field: 'cardNumber', headerName: 'Номер Карты', flex: 1, minWidth: 120 },
    { field: 'patientInitials', headerName: 'Пациент', flex: 1, minWidth: 150 },
    { field: 'cardType', headerName: 'Вид Карты', flex: 1, minWidth: 150 },
    { field: 'registrationDate', headerName: 'Дата Регистрации', flex: 1, minWidth: 150 },
    { field: 'branch', headerName: 'Филиал', flex: 1.5, minWidth: 180 },
    {
      field: 'is_signed',
      headerName: 'Статус',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        params.value ? 'Подписана' : 'Не подписана'
      ),
    },
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

  const filteredRecords = medicalRecords.filter(record =>
    `${record.cardNumber} ${record.patientInitials} ${record.cardType} ${record.branch}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const columns = isMobile ? mobileColumns : desktopColumns;

  const handleEdit = (id: number) => {
    setSelectedRecordId(id);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedRecordId(null);
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

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
          loading={loading}
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

      <MedicalRecordEditModal
        open={editModalOpen}
        onClose={handleCloseModal}
        recordId={selectedRecordId || undefined}
      />
    </Box>
  );
};