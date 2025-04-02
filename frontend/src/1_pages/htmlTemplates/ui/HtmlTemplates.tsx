// @ts-nocheck
// @ts-nocheck
import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Paper, useTheme, useMediaQuery, Theme, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ruRU } from '@mui/x-data-grid/locales';
import { InputSearch } from "@6_shared/Input";
import { CustomButton } from "@6_shared/Button";
import {AddTemplateModal} from "@4_features/admin/templateModal/addTemplateModal/ui/AddTemplateModal.tsx";

const templatesData = [
  {
    id: 1,
    name: "Приём пациента",
    description: "Шаблон",
    last_modified: "2004-01-01",
    path: "/templates/admission"
  },
];

export const HtmlTemplates: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchQuery, setSearchQuery] = useState('');
  const isDarkText = !(theme.palette.mode === "dark");
  const [modalOpen, setModalOpen] = useState(false);


  const desktopColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 80 },
    { field: 'name', headerName: 'Название шаблона', flex: 1.5, minWidth: 200 },
    { field: 'description', headerName: 'Описание', flex: 2, minWidth: 250 },
    { field: 'last_modified', headerName: 'Последнее изменение', flex: 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Действия',
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            title="Посмотреть"
            disableRipple
          >
            <VisibilityIcon />
          </IconButton>
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
    { field: 'name', headerName: 'Шаблон', flex: 1, minWidth: 150 },
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

  const filteredTemplates = templatesData.filter(template =>
    `${template.name} ${template.description}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const columns = isMobile ? mobileColumns : desktopColumns;

  const handleEdit = (id: number) => {
    console.log(id);
  };

  return (
    <Box sx={{
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Typography variant="h1" gutterBottom>
        HTML Шаблоны
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
          placeholder="Поиск шаблонов"
          isDarkText={isDarkText}
          bgcolorFlag={true}
        />
      </Box>

      <Box sx={{ mb: 1 }}>
        <CustomButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={()=>setModalOpen(true)}
        >
          Создать шаблон
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
          rows={filteredTemplates}
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
      <AddTemplateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      ></AddTemplateModal>
    </Box>
  );
};