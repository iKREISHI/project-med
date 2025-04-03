// @ts-nocheck
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Toolbar, CssBaseline, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { globalsStyle } from '@6_shared/styles/globalsStyle';
import { Header } from '@6_shared/Header';
import { CustomDrawer } from '@6_shared/Drawer';

export function MainAdmin() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const [search, setSearch] = React.useState('');
 
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearch = () => {
    console.log(search);
  };

  const listItems = [
    { name: 'Сотрудники', path: '/staff' },
    { name: 'Шаблоны HTML', path: '/html-templates' },
    { name: 'Медкарты', path: '/medical-records' },
    { name: 'Пациенты', path: '/registry' },
    // { name: 'Пациенты', path: '/patients' },
    { name: 'Справочники', path: '/dictionaries' },
    { name: 'Смена', path: '/shiftCreate' },
  ];


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header
        handleDrawerToggle={handleDrawerToggle}
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
        <Box  sx={{ m: {lg: 5, xs: 2}, mt: 2 }}>
          {/* Основной контент */}
          <Box>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}