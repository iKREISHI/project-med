import { FC } from 'react';
import { PatientVisitsChart } from '../../../6_shared/Chart/PatientVisitsChart';
import { Schedule } from '../../../6_shared/Schedule';
import { Box } from '@mui/material';
import { globalsStyleSx } from '../../../6_shared/styles/globalsStyleSx';

export const DashBoard: FC = () => {
  interface ScheduleEntry {
    time: string;
    event: string;
    type: 'patient' | 'other';
  }

  interface DaySchedule {
    day: string;
    schedule: ScheduleEntry[];
  }

  const schedule: DaySchedule[] = [
    {
      day: '2025-03-03',
      schedule: [
        { time: '09:00', event: 'Иван Иванов', type: 'patient' },
        { time: '09:15', event: 'Сходить покушать', type: 'other' },
        { time: '10:00', event: 'Петр Петров', type: 'patient' },
        { time: '10:15', event: 'Позвонить врачу', type: 'other' },
      ],
    },
    {
      day: '2025-03-04',
      schedule: [
        { time: '09:10', event: 'Сидор Сидоров', type: 'patient' },
        { time: '09:15', event: 'Подготовить документы', type: 'other' },
      ],
    },
    {
      day: '2025-03-05',
      schedule: [
        { time: '09:30', event: 'Анна Аннова', type: 'patient' },
        { time: '09:15', event: 'Записаться на прием', type: 'other' },
        { time: '10:00', event: 'Мария Маринова', type: 'patient' },
        { time: '10:20', event: 'Обновить расписание', type: 'other' },
      ],
    },
  ];

  return (
    <>
      <Box sx={{...globalsStyleSx.container, mb: 1}}>
        <Schedule schedule={schedule} />
      </Box>
      <PatientVisitsChart />

    </>
  );
};