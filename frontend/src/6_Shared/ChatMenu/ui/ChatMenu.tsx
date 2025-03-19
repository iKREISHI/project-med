import { FC, useState } from "react";
import { List, ListItem, ListItemAvatar, ListItemText, useMediaQuery, Theme, ListItemButton, SxProps, useTheme } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { chatMenuSx } from "./chatMenuSx";
import { globalsStyle } from "../../styles/globalsStyle";
import { InputSearch } from "../../Input";
import { AvatarPerson } from "../../../5_Entities/Avatar";

interface ChatMenuProps {
  menuItems: { id: string; name: string; unreadCount: number }[];
}
// меню чата
export const ChatMenu: FC<ChatMenuProps> = ({ menuItems }) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const { id } = useParams();
  const theme = useTheme();
  const [search, setSearch] = useState('');

  const isDarkText = !(theme.palette.mode === "dark");


  const handleSearch = () => {
    console.log(search);
  };

  // Поиск дурга по ФИ
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isMobile && id) return null;

  return (
    <>
      <InputSearch
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        placeholder="Поиск"
        onSearch={handleSearch}
        shadowColor="rgba(0, 0, 0, 0.2)"
        isDarkText={isDarkText}
      />
      <List>
        {filteredMenuItems.map((item, index) => {
          const buttonStyles = {
            ...chatMenuSx.listButton,
            ...chatMenuSx.listButtonHover,
            ...(location.pathname.endsWith(`/${item.id}`) && {
              backgroundColor: globalsStyle.colors.blue,
              color: theme.palette.common.white,
            }),
          } as SxProps<Theme>;

          return (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component={Link}
                to={`/chat/${item.id}`}
                disableRipple
                sx={buttonStyles}
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