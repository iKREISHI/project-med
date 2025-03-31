import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Theme, useTheme, } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ruRU } from "@mui/x-data-grid/locales";


const mockRecipes = [
  {
    id: 1,
    name: 'Парацетамол',
    description: 'По 1 таблетке при температуре выше 38°C, не более 3 раз в сутки',
    created_at: '31.03.2025',
    patient: 'Иванов И.И.',
    doctor: 'Васильев И.П.',
  },
  {
    id: 2,
    name: 'Ибупрофен',
    description: 'По 1 таблетке 2 раза в день при болях, не более 5 дней',
    created_at: '31.03.2025',
    patient: 'Петров П.П.',
    doctor: 'Васильев И.П.',
  },
];

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 70
  },
  {
    field: 'name',
    headerName: 'Лекарство',
    width: 150,
  },
  {
    field: 'description',
    headerName: 'Инструкция',
    width: 300
  },
  {
    field: 'patient',
    headerName: 'Пациент',
    width: 150
  },
  {
    field: 'doctor',
    headerName: 'Врач',
    width: 150
  },
  {
    field: 'created_at',
    headerName: 'Дата назначения',
    width: 150,
  },
];

export const RecipesList = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const theme = useTheme();
  useEffect(() => {
    const timer = setTimeout(() => {
      setRecipes(mockRecipes);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{
      width: '100%',
      boxSizing: 'border-box'
    }}>
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
          rows={recipes}
          columns={columns}
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
    </Box>
  );
};