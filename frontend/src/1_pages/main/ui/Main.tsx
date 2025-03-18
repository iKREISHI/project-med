import * as React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CustomDrawer, Plane, Calendar, Header } from '../../../6_Shared';
import { Toolbar, CssBaseline, Box, IconButton } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import { globalsStyle } from '../../../6_Shared/styles/globalsStyle';

export function Main() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isRightMenuVisible, setRightMenuVisible] = React.useState(true);
  const location = useLocation();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleRightMenu = () => {
    setRightMenuVisible(!isRightMenuVisible);
  };

  const listItems = [
    { name: 'Главная', path: '/' },
    { name: 'Чат', path: '/chat' },
    { name: 'Документооборот', path: '/document' },
    { name: 'Расписание', path: '/schedule' },
    { name: 'Пациенты', path: '/registry' },
    { name: 'Прием', path: '/admission' },
    { name: 'Запись', path: '/record' },
  ];

  const tasks = [
    { task: 'Задача 1', date: '12.02.2025' },
    { task: 'Задача 2', date: '13.02.2025' },
    { task: 'Задача 3', date: '14.02.2025' },
  ];

  const currentMenuItem = listItems.find((item) => item.path === `/${location.pathname.split('/')[1]}`) || listItems[0];
  console.log(currentMenuItem)
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
        <Box sx={{ m: 3, mt: 5 }}>
          <Box sx={{ textAlign: 'right', width: '100%', mb:1, color: theme.palette.background.default, display: {xs: 'none', sm: 'block'}}}>
            <IconButton disableRipple onClick={toggleRightMenu} title={isRightMenuVisible ? 'Закрыть' : 'Открыть'}>
              <CalendarMonthIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            {/* Основной контент */}
            <Grid size={{ xs: 12, lg: isRightMenuVisible ? 9 : 12, md: 12 }}>
              <Box>
                <Outlet />
              </Box>
            </Grid>

            {/* Правое меню */}
            {isRightMenuVisible && (
              <Grid size={{ xs: 12, lg: 3, md: 12 }} sx={{ ml: 'auto' }}>
                <Box sx={{ flexGrow: 1, mb: 2, ml: 'auto' }}>
                  <Plane tasks={tasks} />
                </Box>
                <Box sx={{ flexGrow: 1, ml: 'auto' }}>
                  <Calendar />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}