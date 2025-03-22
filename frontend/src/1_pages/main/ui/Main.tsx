import * as React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toolbar, CssBaseline, Box, IconButton, useMediaQuery } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import { globalsStyle } from '../../../6_shared/styles/globalsStyle';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import { Header } from '../../../6_shared/Header';
import { CustomDrawer } from '../../../6_shared/Drawer';
import { Plane } from '../../../6_shared/Plane';
import { Calendar } from '../../../6_shared/Calendar';
import { InputSearch } from '../../../6_shared/Input';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

export function Main() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isRightMenuVisible, setRightMenuVisible] = React.useState(true);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [search, setSearch] = React.useState('');
  const isDarkText = !(theme.palette.mode === "dark");

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
    { name: 'Документооборот', path: '/document', icon: <DescriptionOutlinedIcon /> },
    { name: 'Пациенты', path: '/registry', icon: <PeopleAltOutlinedIcon /> },
    { name: 'Прием', path: '/admission', icon: <MedicalServicesOutlinedIcon /> },
    { name: 'Запись', path: '/record', icon: <EditCalendarOutlinedIcon /> },
  ];

  const tasks = [
    { task: 'Задача 1', date: '12.02.2025' },
    { task: 'Задача 2', date: '13.02.2025' },
    { task: 'Задача 3', date: '14.02.2025' },
  ];

  const currentMenuItem = listItems.find((item) => item.path === `/${location.pathname.split('/')[1]}`) || listItems[0];

  // Поле поиска
  // const searchInput = (
  //   <InputSearch
  //     type="text"
  //     value={search}
  //     onChange={(e) => setSearch(e.target.value)}
  //     fullWidth
  //     placeholder="Введите запрос"
  //     onSearch={handleSearch}
  //     isDarkText={isDarkText}
  //     // bgcolorFlag={true}
  //   />
  // );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header
        handleDrawerToggle={handleDrawerToggle}
        title={currentMenuItem.name}
        subtitle={'Начальная страница с дашбордом'}
        user={{ name: 'Петр Петров', surname: 'Иванов' }}
        handleSearch={handleSearch}
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
              backgroundColor: theme.palette.grey[400],
              boxShadow: '0 0 10px rgb(0, 0, 0, 0.1)',
              borderRadius: '10px 0 0 10px',
              
            }}
            title={isRightMenuVisible ? 'Закрыть' : 'Открыть'}
          >
            <MenuOpenIcon sx={{transform: isRightMenuVisible ? 'rotate(180deg)' : 'rotate(0deg)'}} />
          </IconButton>
        </Box>
        <Box sx={{ m: 2, mt: 2 }}>
          {/* Поле поиска для мобильной версии */}
          {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <Box sx={{ flexGrow: 1, mb: 2 }}>
                {searchInput}
              </Box>
            )}
          </Box> */}

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