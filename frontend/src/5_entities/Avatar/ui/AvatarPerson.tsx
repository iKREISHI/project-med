// @ts-nocheck
import React from 'react';
import { Logout } from '@mui/icons-material';
import { Tooltip, IconButton, ListItemIcon, MenuItem, Menu, Avatar } from '@mui/material';
import { avatarPersonSx } from './avatarPersonSx';
import { useNavigate } from 'react-router-dom';
import avatarDefault from '@0_app/assets/images/speaker-placeholder.png';
import { useAuth } from '@4_features/auth/lib/useAuth';


interface AvatarPersonProps {
  name: string;
  withMenu?: boolean;
}



// Аватар профиля пользователя
const AvatarPerson: React.FC<AvatarPersonProps> = ({ name, withMenu = true }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const {handleLogout} = useAuth();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (withMenu) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    console.log("Close");
  };

  return (
    <React.Fragment>
      <Tooltip title={name}>
        <IconButton
          disableRipple
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar src={avatarDefault} />
        </IconButton>
      </Tooltip>

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