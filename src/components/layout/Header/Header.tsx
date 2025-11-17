import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import CustomIconButton from "./CustomIconButton";

type CornerIcon = {
  Icon: React.ElementType;
  action: (event: React.MouseEvent<HTMLButtonElement>) => void;
  badgeContent?: number;
};

type HeaderProps = {
  title: React.ReactNode;
  cornerIcons?: CornerIcon[];
  customCornerComponent?: React.ReactElement;
  state: {
    openSidebar: boolean;
  };
  drawerWidth?: number;
  backgroundColor?: string;
};

const Header: React.FC<HeaderProps> = ({
  title,
  cornerIcons = [],
  customCornerComponent,
  state,
  drawerWidth = 280,
  backgroundColor,
}) => {
  const { openSidebar } = state;
  const theme = useTheme();

  const appBarBackgroundColor = backgroundColor ?? theme.palette.primary.main;

  return (
    <AppBar
      position="fixed"
      elevation={2}
      sx={{
        backgroundColor: appBarBackgroundColor,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        color: "white",
        zIndex: theme.zIndex.drawer + 1,
        width: `calc(100% - ${theme.spacing(8)} - 1px)`,
        marginLeft: `calc(${theme.spacing(8)} + 1px)`,
        ...(openSidebar && {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: drawerWidth,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }),
        "& .MuiToolbar-root": {
          padding: theme.spacing(0, 3),
        },
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {customCornerComponent}
          {cornerIcons.map((icon, index) => (
            <CustomIconButton
              key={index}
              dataCy={`header-icon-button-${index}`}
              onClick={icon.action}
              IconComponent={icon.Icon}
              badgeContent={icon.badgeContent}
            />
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(Header);