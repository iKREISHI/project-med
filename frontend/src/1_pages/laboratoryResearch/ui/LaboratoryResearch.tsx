// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ruRU } from "@mui/x-data-grid/locales";
import { GET } from "@6_shared/api";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

export const LaboratoryResearch: React.FC = () => {
  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchResearches = async () => {
    setLoading(true);
    try {
      const response = await GET("/api/v0/laboratory-research/", {
        query: {
          page: pagination.page,
          page_size: pagination.pageSize,
          search: searchQuery,
        },
      });

      if (response?.data?.results) {
        setResearches(response.data.results);
        setPagination((prev) => ({
          ...prev,
          total: response.data.count,
        }));
      }
    } catch (error) {
      console.error("Ошибка при загрузке исследований:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearches();
  }, [pagination.page, pagination.pageSize, searchQuery]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "number",
      headerName: "Номер",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "status",
      headerName: "Статус",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "laboratory",
      headerName: "Лаборатория",
      flex: 1.5,
      minWidth: 160,
      renderCell: (params) => {
        const lab = params.row?.laboratory;
        return (
          <span>
            {typeof lab === "object" && lab !== null ? lab.name : "—"}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Действия",
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() => navigate(`/lab-research/view/${params.row.id}`)}
          size="small"
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ p: 2 }}>
        <TextField
          label="Поиск (номер, статус, лаборатория)"
          fullWidth
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <DataGrid
        rows={researches}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        autoHeight
        paginationMode="server"
        pageSizeOptions={[10, 20, 50]}
        rowCount={pagination.total}
        paginationModel={{
          page: pagination.page - 1,
          pageSize: pagination.pageSize,
        }}
        onPaginationModelChange={({ page, pageSize }) => {
          setPagination({
            ...pagination,
            page: page + 1,
            pageSize,
          });
        }}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
          },
          "& .MuiDataGrid-cell": {
            whiteSpace: "normal",
            lineHeight: 1.5,
          },
        }}
        disableRowSelectionOnClick
      />
    </Paper>
  );
};
