import React, { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, IconButton, Typography, Toolbar, AppBar, Switch, useTheme } from '@mui/material';
import { headerSx } from './headerSx';
import { AvatarPerson } from '../../../5_Shared';
import { useThemeContext } from '../ThemeContext';
import { globalsStyle } from '../../../5_Shared/styles/globalsStyle';
import ModeNightIcon from '@mui/icons-material/ModeNight';
interface User {
  name: string;
  surname: string;
}

interface HeaderProps {
  handleDrawerToggle: () => void;
  user: User;
  title: string;
  subtitle: string;
  users?: User[];
}

const Header: React.FC<HeaderProps> = ({ handleDrawerToggle, title, subtitle, user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { toggleTheme, mode } = useThemeContext();
  const theme = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const appBarStyles = {
    ...headerSx.appBar,
    width: { sm: `calc(100% - ${globalsStyle.widthDrawer})` },
    backgroundColor: isScrolled ? theme.palette.background.default : 'transparent',
    boxShadow: isScrolled ? '0 0 3px rgba(0, 0, 0, 0.1)' : '0',
  };

  return (
    <AppBar position="fixed" elevation={0} sx={appBarStyles}>
      <Toolbar sx={headerSx.toolbar}>
        <IconButton
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={headerSx.iconButton}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={headerSx.container}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              noWrap
              component="h3"
              sx={{
                fontSize: {
                  sm: theme.typography.h4.fontSize,
                  xs: theme.typography.h6.fontSize,
                },
                color: theme.palette.text.primary,
              }}
            >
              {title}
            </Typography>
            <Typography
              noWrap
              component="p"
              sx={{
                fontSize: theme.typography.body2.fontSize,
                display: { xs: 'none', sm: 'flex' },
                color: theme.palette.text.primary,
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          <Box sx={headerSx.userInfoBox}>
            <Box sx={headerSx.userTextContainer}>
              <Switch checked={mode === 'dark'} onChange={toggleTheme} color="primary" />              
              <ModeNightIcon sx={{ color: theme.palette.primary.main }} />

            </Box>
            <AvatarPerson name={user.name[0]} />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;