import { FC, useState } from "react";
import { List, ListItem, ListItemAvatar, ListItemText, useMediaQuery, Theme, ListItemButton, SxProps, useTheme, Box } from "@mui/material";
import { Link, useParams, useLocation } from "react-router-dom";
import { chatMenuSx } from "./chatMenuSx";
import { InputSearch } from "../../Input";
import { AvatarPerson } from "../../../5_entities/Avatar";

interface ChatMenuProps {
  menuItems: { id: string; name: string; unreadCount: number }[];
}

export const ChatMenu: FC<ChatMenuProps> = ({ menuItems }) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const { id } = useParams();
  const theme = useTheme();
  const location = useLocation();
  const [search, setSearch] = useState('');

  const isDarkText = !(theme.palette.mode === "dark");

  const handleSearch = () => {
    console.log(search);
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isMobile && id) return null;

  return (
    <>
      <Box sx={{ m: 1 }}>
        <InputSearch
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          placeholder="Поиск"
          onSearch={handleSearch}
          isDarkText={isDarkText}
        />
      </Box>
      <List>
        {filteredMenuItems.map((item, index) => {
          const isSelected = location.pathname.endsWith(`/${item.id}`);
          
          const buttonStyles = {
            ...chatMenuSx.listButton,
            ...chatMenuSx.listButtonHover,
            ...(isSelected && {
              boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
              '&:active': {
                color: theme.palette.common.black
              },

            }),
          } as SxProps<Theme>;

          return (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component={Link}
                to={`/chat/${item.id}`}
                disableRipple
                sx={buttonStyles}
                selected={isSelected}
              >
                <ListItemAvatar>
                  <AvatarPerson name={item.name} withMenu={false} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {item.name}
                      {item.unreadCount > 0 && (
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: theme.palette.primary.main,
                          }}
                        />
                      )}
                    </div>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
};