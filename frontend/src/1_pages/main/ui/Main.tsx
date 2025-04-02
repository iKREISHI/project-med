// @ts-nocheck
// @ts-nocheck
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Toolbar, CssBaseline, Box, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import { globalsStyle } from '../../../6_shared/styles/globalsStyle';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import { Header } from '../../../6_shared/Header';
import { CustomDrawer } from '../../../6_shared/Drawer';
import { Plane } from '../../../6_shared/Plane';
import { Calendar } from '../../../6_shared/Calendar';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

export function Main() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isRightMenuVisible, setRightMenuVisible] = React.useState(true);
  const theme = useTheme();
  const [search, setSearch] = React.useState('');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleRightMenu = () => {
    setRightMenuVisible(!isRightMenuVisible);
  };

  const handleSearch = () => {
    console.log(search);
  };

  const listItems = [
    { name: 'Главная', path: '/', icon: <HomeOutlinedIcon /> },
    { name: 'Чат', path: '/chat', icon: <ChatBubbleOutlineOutlinedIcon /> },
    { name: 'Пациенты', path: '/registry', icon: <PeopleAltOutlinedIcon /> },
    { name: 'Прием', path: '/admission', icon: <MedicalServicesOutlinedIcon /> },
    { name: 'Запись', path: '/booking-appointment', icon: <EditCalendarOutlinedIcon /> },
    { name: 'Дежурства', path: '/doctor-shift', icon: <AssignmentOutlinedIcon /> },
    { name: 'Рецепты', path: '/recipes', icon: <BallotOutlinedIcon /> },
  ];

  const tasks = [
    { task: 'Задача 1', date: '12.02.2025' },
    { task: 'Задача 2', date: '13.02.2025' },
    { task: 'Задача 3', date: '14.02.2025' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header
        handleDrawerToggle={handleDrawerToggle}
        user={{ name: 'Петр Петров', surname: 'Иванов' }}
        // handleSearch={handleSearch}
      />

      <CustomDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        listItems={listItems}
        handleSearch={handleSearch}
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
        <Box
          sx={{
            textAlign: 'right',
            mb: 1,
            mt: 2,
            width: { md: '100%', xs: 'auto' },
            color: theme.palette.background.default,
            display: { xs: 'none', lg: 'block' },
          }}
        >
          <IconButton
            disableRipple
            onClick={toggleRightMenu}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: '10px 0 0 10px',
              
            }}
            title={isRightMenuVisible ? 'Закрыть' : 'Открыть'}
          >
            <MenuOpenIcon sx={{transform: isRightMenuVisible ? 'rotate(180deg)' : 'rotate(0deg)'}} />
          </IconButton>
        </Box>
        <Box sx={{ m: {lg: 5, xs: 2}, mt: 2 }}>

          <Grid container spacing={4}>
            {/* Основной контент */}
            <Grid size={{ xs: 12, lg: isRightMenuVisible ? 9 : 12, md: 12 }}>
              <Box>
                <Outlet />
              </Box>
            </Grid>

            {/* Правое меню */}
            {isRightMenuVisible && (
              <Grid size={{ xs: 12, lg: 3, md: 12 }} sx={{ ml: 'auto' }}>
                <Box sx={{ flexGrow: 1, mb: 4, ml: 'auto' }}>
                  <Plane tasks={tasks} />
                </Box>
                <Box sx={{ flexGrow: 1, ml: 'auto', display: { xs: "none", md: "block" } }}>
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