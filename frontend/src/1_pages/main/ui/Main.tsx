import * as React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CustomDrawer, Plane, Calendar, Header } from '../../../5_Shared';
import { Toolbar, CssBaseline, Box } from '@mui/material';
import { MainSx } from './MainSx.ts';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles'; 
import { globalsStyle } from '../../../5_Shared/styles/globalsStyle';

export function Main() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const listItems = [
    { name: 'Главная', path: '/' },
    { name: 'Чат', path: '/chat' },
    { name: 'Документооборот', path: '/document' },
    { name: 'Расписание', path: '/schedule' },
    { name: 'Пациенты', path: '/registry' },
  ];

  const tasks = [
    { task: 'Задача 1', date: '12.02.2024' },
    { task: 'Задача 2', date: '13.02.2024' },
    { task: 'Задача 3', date: '14.02.2024' },
  ];

  const currentMenuItem = listItems.find((item) => item.path === location.pathname) || listItems[0];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header
        handleDrawerToggle={handleDrawerToggle}
        title={currentMenuItem.name}
        subtitle={'Начальная страница с дашбордом'}
        user={{ name: 'Иван', surname: 'Иванов' }}
      />

      <CustomDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        listItems={listItems}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${globalsStyle.widthDrawer})` }, 
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Toolbar />
        <Box sx={{ m: 3, mt: 8 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 9, md: 12 }}>
              <Box sx={MainSx.container}>
                <Outlet />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 3, md: 12 }}>
              <Box sx={{ flexGrow: 1, maxWidth: '350px', mb: 2 }}>
                <Plane tasks={tasks} />
              </Box>
              <Box sx={{ flexGrow: 1, maxWidth: '350px' }}>
                <Calendar />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}