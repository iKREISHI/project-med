import * as React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Box } from '@mui/material'; 
import { calendarSx } from './calendarSx';

dayjs.locale('ru');

export default function Calendar() {
  const [value, setValue] = React.useState(dayjs());

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <Box sx={calendarSx.container}>
        <DemoContainer components={['DateCalendar', 'DateCalendar']}>
          <DemoItem>
            <DateCalendar
              value={value}
              onChange={(newValue) => setValue(newValue)}
              sx={calendarSx.calendar}
            />
          </DemoItem>
        </DemoContainer>
      </Box>
    </LocalizationProvider>
  );
}