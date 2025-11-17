import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import React, {ElementType} from "react";
import CustomLinkButton, {MenuItem} from "./CustomLinkButton";

interface SidebarMenuProps {
  menuList: MenuItem[];
  open: boolean;
  sideBarComponent?: ElementType;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  menuList,
  open,
  sideBarComponent = CustomLinkButton,
}) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const handleItemClick = (id: string) => {
    setSelectedId(id);
  };

  return (
    <List>
      {menuList.map((menu) => (
        <ListItem key={menu.id} disablePadding sx={{display: "block"}}>
          <div onClick={() => handleItemClick(menu.id)}>
            <CustomLinkButton
              menu={menu}
              open={open}
              selected={selectedId === menu.id}
            />
          </div>
        </ListItem>
      ))}
    </List>
  );
};

export default SidebarMenu;