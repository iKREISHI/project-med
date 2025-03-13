import React from 'react';
import { Logout } from '@mui/icons-material'; 
import { Tooltip, IconButton, ListItemIcon, MenuItem, Menu, Avatar } from '@mui/material';
import { avatarPersonSx } from './avatarPersonSx';
import { useNavigate } from 'react-router-dom';

interface AvatarPersonProps {
  name: string; 
}

const AvatarPerson: React.FC<AvatarPersonProps> = ({ name }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    console.log("Close")
  };
  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <React.Fragment>
      <Tooltip title="Профиль">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={avatarPersonSx.iconButton}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={avatarPersonSx.avatar}>{name[0]}</Avatar>
        </IconButton>
      </Tooltip>

      {/* Меню */}
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
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Выйти
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default AvatarPerson;
