import React from 'react';
import { Logout } from '@mui/icons-material';
import { Tooltip, IconButton, ListItemIcon, MenuItem, Menu, Avatar } from '@mui/material';
import { avatarPersonSx } from './avatarPersonSx';
import { useNavigate } from 'react-router-dom';

interface AvatarPersonProps {
  name: string;
  withMenu?: boolean; // Новый пропс для управления отображением меню
}

// Функция для генерации цвета на основе строки
function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

// Функция для создания аватара с цветом на основе имени
function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1] ? name.split(' ')[1][0] : ''}`,
  };
}

// Аватар профиля пользователя
const AvatarPerson: React.FC<AvatarPersonProps> = ({ name, withMenu = true }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (withMenu) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    console.log("Close");
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <React.Fragment>
      <Tooltip title={name}>
        {/* Иконка профиля */}
        <IconButton
          disableRipple
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar {...stringAvatar(name)} />
        </IconButton>
      </Tooltip>

      {/* Меню */}
      {withMenu && (
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: avatarPersonSx.menuPaper,
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleLogout} disableRipple>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Выйти
          </MenuItem>
        </Menu>
      )}
    </React.Fragment>
  );
};

export default AvatarPerson;