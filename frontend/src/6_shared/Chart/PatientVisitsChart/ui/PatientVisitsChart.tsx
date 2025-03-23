import { LineChart } from '@mui/x-charts/LineChart';
import { globalsStyle } from '../../../styles/globalsStyle';
import { useRef, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { globalsStyleSx } from '../../../styles/globalsStyleSx';

export default function PatientVisitsChart() {
  const containerRef = useRef<HTMLElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  const timeData = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const visitData = [5, 10, 8, 15, 12, 23, 18, 8, 22];

  useEffect(() => {
    if (containerRef.current) {
      setChartWidth(containerRef.current.offsetWidth);
    }
  }, []);

  return (
    <Box ref={containerRef} style={{ width: '100%' }} sx={globalsStyleSx.container}>
      <LineChart
        xAxis={[
          {
            data: timeData,
            scaleType: 'band',
            label: 'Время',
          },
        ]}
        yAxis={[
          {
            label: 'Количество посещений',
          },
        ]}
        series={[
          {
            data: visitData,
            label: 'Посещения',
            color: globalsStyle.colors.blue,
          },
        ]}
        width={chartWidth}
        height={400}
      />
    </Box>
  );
}
