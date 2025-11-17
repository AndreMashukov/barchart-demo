import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import {styled, Theme} from "@mui/material/styles";

const DEFAULT_DRAWER_WIDTH = 310;

const openedMixin = (theme: Theme, drawerWidth: number) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden" as const,
});

const closedMixin = (theme: Theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden" as const,
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const DrawerHeader = styled("div")(({theme}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export const DrawerFooter = styled("div")(({theme}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

// Define a type for the props
interface AppBarProps {
  open: boolean;
  drawerwidth?: number; // Optional property
}

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => (prop !== "open" && prop) !== "drawerwidth",
})<AppBarProps>(({theme, open, drawerwidth = DEFAULT_DRAWER_WIDTH}) => ({
  width: drawerwidth,
  flexShrink: 0,
  borderRadius: "17px",
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    zIndex: theme.zIndex.drawer, // Ensure sidebar appears below the header
  },
  ...(open && {
    ...openedMixin(theme, drawerwidth),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme, drawerwidth),
      borderRadius: "17px",
      zIndex: theme.zIndex.drawer,
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      borderRadius: "17px",
      zIndex: theme.zIndex.drawer,
    },
  }),
}));

export const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "drawerwidth",
})<AppBarProps>(({theme, open, drawerwidth = DEFAULT_DRAWER_WIDTH}) => ({
  "& .IconButton": {
    background: "white",
    position: "fixed",
    zIndex: theme.zIndex.drawer + 1,
    color: "#fc7b00",
    left: open ? drawerwidth - 20 : 47,
    top: "80px", // Position below the header
    display: "flex",
    filter: "drop-shadow(1px 2px 2px rgba(9, 30, 66, 0.08))",
    border: "1px solid #ddd",
    width: "30px",
    height: "30px",
  },
  "&:hover": {
    "& .IconButton": {
      color: "white",
      background: "#fc7b00",
    },
  },
}));