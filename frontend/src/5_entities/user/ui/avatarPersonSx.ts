// @ts-nocheck
export const avatarPersonSx = {

  avatar: {

  },
  menuPaper: {
    elevation: 0,
    overflow: 'visible',
    filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.1))',
    mt: 1.5,
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
  
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  },
};
