import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightTwoToneIcon from "@mui/icons-material/KeyboardArrowRightTwoTone";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import SidebarMenu from "./SidebarMenu";
import {Drawer, DrawerFooter, DrawerHeader, StyledBox} from "./Sidebar.styled";
import {MenuItem} from "./CustomLinkButton";
import React, {ElementType} from "react";

type SidebarProps = {
  menuList: Array<MenuItem>;
  openSidebar: boolean;
  setOpenSidebar: (value: boolean) => void;
  drawerWidth: number;
  header: React.ReactElement;
  footer: React.ReactElement;
  sideBarComponent?: ElementType;
};

const Sidebar = ({
  menuList,
  openSidebar,
  setOpenSidebar,
  drawerWidth,
  header,
  footer,
  sideBarComponent,
}: SidebarProps) => {
  return (
    <StyledBox
      open={openSidebar}
      drawerwidth={drawerWidth}
      data-testid="sidebar"
      className={openSidebar ? "open" : "closed"}
    >
      <IconButton
        data-testid="sidebar-toggle-button"
        className="IconButton"
        onClick={() => {
          setOpenSidebar(!openSidebar);
        }}
      >
        {openSidebar ? (
          <KeyboardArrowLeftIcon />
        ) : (
          <KeyboardArrowRightTwoToneIcon />
        )}
      </IconButton>
      <Drawer variant="permanent" open={openSidebar} drawerwidth={drawerWidth}>
        <Toolbar /> {/* Spacer for the header */}
        <Box sx={{flexGrow: 1}}>
          <DrawerHeader>{header}</DrawerHeader>
        </Box>
        <Box sx={{flexGrow: 1}}>
          <SidebarMenu
            menuList={menuList}
            open={openSidebar}
            sideBarComponent={sideBarComponent}
          />
        </Box>
        <Box sx={{flexGrow: 1}}>
          <DrawerFooter
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              flexDirection: "column",
            }}
          >
            {footer}
          </DrawerFooter>
        </Box>
      </Drawer>
    </StyledBox>
  );
};

export default Sidebar;