// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Box, TextField, Typography, IconButton, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ruRU } from "@mui/x-data-grid/locales";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { GET } from "@6_shared/api";
import { getPatient } from "@5_entities/patient";
import { CustomButton } from "@6_shared/Button";

export const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState([]);
  const [patientsMap, setPatientsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });

  const navigate = useNavigate();

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await GET("/api/v0/medicine-prescription/", {
        query: {
          page: pagination.page,
          page_size: pagination.pageSize,
          search: searchQuery
        }
      });

      const results = response?.data?.results || [];
      setRecipes(results);
      setPagination(prev => ({
        ...prev,
        total: response.data?.count || 0
      }));

      // Получаем всех пациентов по id
      const uniquePatientIds = [...new Set(results.map(r => r.patient).filter(Boolean))];

      const newPatientsMap = {};
      for (const id of uniquePatientIds) {
        try {
          const p = await getPatient(id);
          newPatientsMap[id] = p;
        } catch (e) {
          console.warn(`Пациент ${id} не найден`, e);
        }
      }

      setPatientsMap(newPatientsMap);

    } catch (error) {
      console.error("Ошибка при загрузке рецептов:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [pagination.page, pagination.pageSize, searchQuery]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    {
      field: 'patient',
      headerName: 'Пациент',
      flex: 1,
      valueGetter: (params) => {
        try {
          const p = patientsMap?.[params.row?.patient];
          return p ? `${p.last_name || ''} ${p.first_name || ''}`.trim() : '—';
        } catch {
          return 'Ошибка';
        }
      }
    },
    {
      field: 'description',
      headerName: 'Описание',
      flex: 2,
    },
    {
      field: 'is_send',
      headerName: 'Отправлен',
      width: 120,
      valueFormatter: ({ value }) => value ? 'Да' : 'Нет'
    },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => navigate(`/recipes/view/${params.row.id}`)}>
          <EditIcon />
        </IconButton>
      )
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          label="Поиск по пациенту или статусу"
          fullWidth
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <CustomButton
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ ml: 2, whiteSpace: 'nowrap' }}
          onClick={() => navigate("/recipes/create")}
        >
          Добавить рецепт
        </CustomButton>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <DataGrid
          autoHeight
          rows={recipes}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          pageSizeOptions={[10, 20, 50]}
          rowCount={pagination.total}
          paginationMode="server"
          paginationModel={{
            page: pagination.page - 1,
            pageSize: pagination.pageSize
          }}
          onPaginationModelChange={({ page, pageSize }) => {
            setPagination({ ...pagination, page: page + 1, pageSize });
          }}
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f9f9f9'
            },
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              lineHeight: 1.5,
              py: 1
            }
          }}
        />
      </Paper>
    </Box>
  );
};
