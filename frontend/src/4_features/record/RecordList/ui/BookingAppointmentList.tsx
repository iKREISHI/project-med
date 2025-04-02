// @ts-nocheck
import { getAllBokkingAppointments } from "@5_entities/bookingAppointments/api/getAllBokkingAppointments";
import { CustomButton } from "@6_shared/Button";
import { InputSearch } from "@6_shared/Input";
import { useTheme } from "@emotion/react";
import { Box, Paper } from "@mui/material";
import { DataGrid, GridAddIcon, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface BookingAppointment {
  id: number;
  patient: number;
  patient_name: string;
  doctor: number;
  doctor_name: string;
  status: string;
  vizit_datetime: string;
}

export const BookingAppointmentList: FC = () => {
  const theme = useTheme();
  const isDarkText = !(theme.palette.mode === "dark");
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<BookingAppointment[]>([]);
  
  // Определяем колонки таблицы
  const columns: GridColDef[] = [
    { field: "patient_name", headerName: "Пациент", flex: 1, minWidth: 150 },
    { field: "doctor_name", headerName: "Доктор", flex: 1, minWidth: 150 },
    { field: "vizit_datetime", headerName: "Дата приема", flex: 1, minWidth: 200 },
    {
      field: "actions",
      headerName: "Действия",
      flex: 1,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams) => (
        <CustomButton
          variant="contained"
          onClick={() => navigate(`/admission`, { 
            state: { 
              patientName: params.row.patient, 
              visitDate: params.row.vizit_datetime 
            } 
          })}
        >
          Провести прием
        </CustomButton>
      ),
    },
  ];

  useEffect(() => {
    fetchBookingAppointments();
  }, []);

  const fetchBookingAppointments = async () => {
    let allAppointments: BookingAppointment[] = [];
    let page = 1;
    let totalPages = 1;
    let minDate = "9999-12-31T23:59:59.999Z"; // Самая дальняя возможная дата
    let maxDate = "0000-01-01T00:00:00.000Z"; // Самая ранняя возможная дата

    do {
      const response = await getAllBokkingAppointments({
        start_date: minDate,
        end_date: maxDate,
        page,
        page_size: 100
      });

      if (response?.results?.length) {
        allAppointments = [...allAppointments, ...response.results];

        response.results.forEach((appointment: BookingAppointment) => {
          if (appointment.vizit_datetime < minDate) {
            minDate = appointment.vizit_datetime;
          }
          if (appointment.vizit_datetime > maxDate) {
            maxDate = appointment.vizit_datetime;
          }
        });
      }

      totalPages = Math.ceil(response.count / 100);
      page++;

    } while (page <= totalPages);

    setAppointments(allAppointments);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 1, display: "flex", flexDirection: "column", gap: theme.spacing(2) }}>
        <InputSearch
          type="text"
          value={''}
          onChange={(e) => console.log('Поиск')}
          fullWidth
          placeholder="Поиск"
          isDarkText={isDarkText}
          bgcolorFlag={true}
        />
        <Box sx={{ mb: 1 }}>
          <CustomButton
            variant="contained"
            startIcon={<GridAddIcon />}
            onClick={() => navigate("/booking-appointment/record")}
          >
            Добавить запись
          </CustomButton>
        </Box>
      </Box>

      <Paper sx={{ width: "100%", overflow: 'hidden' }}>
        <DataGrid
          rows={appointments}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          pageSizeOptions={[5, 10, 25]}
        />
      </Paper>
    </Box>
  );
};
